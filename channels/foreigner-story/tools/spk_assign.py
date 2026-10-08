"""화자 자동 판별 + 섞인 자막 나누기 — 자막 초안 직후, 검수 전에 돌린다 (04 E9-1, 2026-10-08 사용자 결정).

#004 v1 에서 화자 오류 약 90줄·두 사람 말이 섞인 자막 약 30곳이 나왔다(음높이로만 화자를 정함).
이 도구는 원본 목소리(음원 분리한 stem)를 화자 인식 모델(ECAPA, speechbrain)로 비교한다.

anchors.json — 화면에서 그 사람이 말하는 것을 눈으로 확인한 구간(화자마다 2~6곳, 각 2초 이상):
  {"C": [["O", 80.4, 84.5], ...], "E": [...], "B": [...]}      (원본 시각)
  → 기준 목소리 → 자막 전체로 한 번 더 학습(확신이 높은 줄만)해서 기준을 넓힌다.

사용: python3 spk_assign.py <case_dir> <cues.json> <anchors.json> <out_cues.json>
  case_dir 에 stems/<ep>_<s0>_<s1>.wav, words_<ep>.json 이 있어야 한다.
결과:
  out_cues.json — spk 를 목소리 판정으로 바꾸고(확신 높음만), 문장 안에서 화자가 바뀌면 그 자리에서 나눈다.
                  나눈 조각의 ja 는 "??" 로 비워 둔다 → 번역 검토(subs_text_review.py)에서 채운다.
                  각 줄에 spk_conf(확신: high/low)·spk_scores 를 남긴다.
  <out>.spk.md   — 바꾼 줄·나눈 줄·애매한 줄 목록(이 목록이 시트 검수 대상이 된다)
"""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf

MIN_SEG = 0.6       # 이보다 짧은 말은 판정하지 않는다(애매로 남김)
HIGH = 0.15         # 1·2위 점수 차가 이 이상이면 확신 높음


def load_stems(case):
    out = []
    for p in (case / "stems").glob("*.wav"):
        if p.name.endswith(".rest.wav"): continue
        ep, a, b = p.stem.split("_"); out.append((ep, int(a), int(b), p))
    return out


def main():
    case, cues_p, anc_p, out_p = Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
    import torch
    from speechbrain.inference.speaker import EncoderClassifier
    model = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir="/home/user/media/ecapa")
    stems = load_stems(case); cache = {}

    def audio(ep, a, b):
        c = [s for s in stems if s[0] == ep and s[1] <= a and s[2] >= b]
        if not c: return None
        _, s0, _, p = min(c, key=lambda s: s[2] - s[1])
        if p not in cache:
            y, sr = sf.read(p, dtype="float32"); y = y.mean(1) if y.ndim > 1 else y
            if sr != 16000:
                y = np.interp(np.arange(0, len(y), sr / 16000), np.arange(len(y)), y).astype(np.float32)
            cache[p] = y
        y = cache[p]; return y[int((a - s0) * 16000):int((b - s0) * 16000)]

    def emb(ep, a, b):
        x = audio(ep, a, b)
        if x is None or len(x) < MIN_SEG * 16000: return None
        e = model.encode_batch(torch.from_numpy(x)[None]).squeeze().numpy(); return e / np.linalg.norm(e)

    def norm(v): v = np.mean(v, 0); return v / np.linalg.norm(v)
    anchors = json.load(open(anc_p))
    C = {s: norm([e for e in (emb(*x) for x in v) if e is not None]) for s, v in anchors.items()}
    cues = json.load(open(cues_p))
    W = {ep: [w for s in json.load(open(case / f"words_{ep}.json")) for w in s["w"]] for ep in {c["ep"] for c in cues}}

    def score(e): return {s: float(e @ C[s]) for s in C}
    def judge(sc):
        r = sorted(sc.items(), key=lambda x: -x[1]); return r[0][0], r[0][1] - r[1][1]

    # 1) 줄 전체 판정 → 확신 높은 줄로 기준 목소리를 넓힌다
    E = [emb(c["ep"], c["s0"], c["s1"]) for c in cues]
    for _ in range(2):
        pool = {s: [] for s in C}
        for c, e in zip(cues, E):
            if e is None: continue
            s, m = judge(score(e))
            if m >= HIGH: pool[s].append(e)
        C = {s: norm(v + [C[s]] * 3) if v else C[s] for s, v in pool.items()}

    # 2) 줄 안의 말 단위(쉼 0.35초·문장 끝)로 다시 판정 → 화자가 바뀌면 나눈다
    out, log = [], {"change": [], "split": [], "unsure": []}
    for c, e in zip(cues, E):
        if c.get("kind", "Y") != "Y" or c.get("spk") not in C and c.get("spk") not in (None, "-"):
            out.append(c); continue                                # 점원 등 기준 없는 화자는 그대로
        ws = [w for w in W[c["ep"]] if c["s0"] - 0.1 <= w[0] < c["s1"]]
        ph = []
        for w in ws:
            if ph and (w[0] - ph[-1][-1][1] > 0.35 or ph[-1][-1][2].strip()[-1:] in ".?!"): ph.append([w])
            elif ph: ph[-1].append(w)
            else: ph.append([w])
        segs = []
        for p in ph:
            pe = emb(c["ep"], p[0][0], p[-1][1])
            s, m = judge(score(pe)) if pe is not None else ("?", 0)
            segs.append((p[0][0], p[-1][1], s if m >= HIGH else "?", " ".join(x[2].strip() for x in p)))
        sure = [s for _, _, s, _ in segs if s != "?"]
        if len(set(sure)) > 1:                                      # 섞임 → 화자가 바뀌는 곳에서 나눈다
            grp = []
            for a, b, s, t in segs:
                s = s if s != "?" else (grp[-1][2] if grp else sure[0])
                if grp and grp[-1][2] == s: grp[-1] = (grp[-1][0], b, s, grp[-1][3] + " " + t)
                else: grp.append((a, b, s, t))
            for a, b, s, t in grp:
                out.append(dict(c, s0=round(a, 2), s1=round(b + 0.15, 2), spk=s, ja="??", en=t, spk_conf="high", split_from=c["ja"]))
            log["split"].append((c, grp)); continue
        if e is None:
            out.append(dict(c, spk_conf="low")); log["unsure"].append((c, "짧음")); continue
        sc = score(e); s, m = judge(sc)
        nc = dict(c, spk_scores={k: round(v, 2) for k, v in sc.items()})
        if m >= HIGH:
            if s != c.get("spk"): log["change"].append((c, s, m)); nc["spk"] = s
            nc["spk_conf"] = "high"
        else:
            nc["spk_conf"] = "low"; log["unsure"].append((c, f"{s}? 차이 {m:.2f}"))
        out.append(nc)
    json.dump(out, open(out_p, "w"), ensure_ascii=False, indent=1)
    L = [f"# 화자 판별 결과 — 바꿈 {len(log['change'])}, 나눔 {len(log['split'])}, 애매 {len(log['unsure'])}", ""]
    L += ["## 바꾼 줄(확신 높음)"] + [f"- {c['ep']} {c['s0']:.2f} {c.get('spk')}→{s} (차이 {m:.2f}) {c['ja']} | {c.get('en', '')[:70]}" for c, s, m in log["change"]]
    L += ["", "## 나눈 줄(번역을 화자별로 다시 써야 함, ja='??')"]
    for c, g in log["split"]:
        L.append(f"- {c['ep']} {c['s0']:.2f} {c['ja']}")
        L += [f"  - {a:.2f}-{b:.2f} [{s}] {t}" for a, b, s, t in g]
    L += ["", "## 애매한 줄(시트로 확인)"] + [f"- {c['ep']} {c['s0']:.2f} [{c.get('spk')}] {why} {c['ja']}" for c, why in log["unsure"]]
    Path(out_p).with_suffix(".spk.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print(L[0])


if __name__ == "__main__":
    main()
