"""번역 검토표 — 이미지 없이 글로 빠르게 (04 E9-2, 2026-10-08 사용자 결정).

자막 전체를 화면에 나오는 순서대로 [시각·화자·원문 영어·일본어·한국어] 한 줄씩 놓는다.
어색한 일본어(말투가 화자와 안 맞음, 존댓말 섞임, 끊는 위치, 한 단어 조각, 원문보다 강한 표현)와
빠진 뜻(원문에 있는데 일본어에 없음)은 이 표로 잡는 것이 시트(이미지)보다 빠르고 정확하다.

자동 표시(⚠):
  ?? 번역 안 됨(spk_assign 에서 나눈 조각) / 화자 말투 불일치(C·B 에 「〜の」「〜ね」로 끝남, E 에 「〜だぞ」「〜だな」 등)
  가족 대화에 「です・ます」 / 6자 미만 조각 / 영어 단어 수 대비 일본어가 너무 짧음(뜻 빠짐 의심) / 7초 넘는 자막
사용: python3 subs_text_review.py <cues.json> <timeline.json> <out.md>
"""
import json, re, sys

MASC = ("だな", "だぞ", "ぞ", "だろ", "だよな", "んだ", "かな？だ")
FEM = ("のね", "わ", "かしら", "なの", "ね", "の")


def sec(x):
    if isinstance(x, (int, float)): return float(x)
    m, s = x.split(":"); return int(m) * 60 + float(s)


def main():
    cues, items, out = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))["items"], sys.argv[3]
    def o(c):
        for it in items:
            if it["type"] == "clip" and it.get("ep") == c["ep"] and sec(it["src"][0]) - 0.3 <= c["s0"] < sec(it["src"][1]):
                return it["start"] + max(0, c["s0"] - sec(it["src"][0]))
    rows = sorted(((o(c), c) for c in cues if c.get("kind", "Y") == "Y" and c.get("use", True)), key=lambda r: (r[0] is None, r[0] or 0))
    L = ["| 시각 | 화자 | 원문 | 일본어 | 한국어 | ⚠ |", "|---|---|---|---|---|---|"]
    n = 0
    for t, c in rows:
        if t is None: continue
        ja = c["ja"].replace("\\N", ""); en = c.get("en", ""); sp = c.get("spk", "-"); w = []
        tail = re.sub(r"[。、？！…」]+$", "", ja)
        if "??" in ja: w.append("번역 없음")
        if sp in ("C", "B") and tail.endswith(("のね", "かしら")) : w.append("말투(여성형)")
        if sp == "E" and tail.endswith(("だぞ", "だろ", "だな")): w.append("말투(남성형)")
        if sp in "CEB" and re.search(r"(です|ます|ました|ません)(。|$|？)", ja): w.append("존댓말")
        if len(ja) < 6 and len(en.split()) >= 4: w.append("뜻 빠짐?")
        if en and len(ja) < len(en.split()) * 0.9: w.append("짧음(뜻 빠짐?)")
        if c["s1"] - c["s0"] > 7: w.append(f"{c['s1'] - c['s0']:.0f}초")
        if c.get("spk_conf") == "low": w.append("화자 애매")
        n += bool(w)
        L.append(f"| {int(t // 60)}:{t % 60:05.2f} | {sp} | {en} | {ja} | {c.get('ko', '')} | {'・'.join(w)} |")
    open(out, "w").write(f"# 번역 검토표 — {len(rows)}줄, 자동 표시 {n}줄\n\n" + "\n".join(L) + "\n")
    print(f"{len(rows)}줄, ⚠ {n}줄 → {out}")


if __name__ == "__main__":
    main()
