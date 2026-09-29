"""정조 편 「정조가 없애라던 편지 297통」: 컷 목록(data/jeongjo/cuts.json) → 내레이션 → 자막 → 소리 → public/jeongjo/timeline.json.

- 내레이션: Supertonic 3 M2. 장면(문단) 하나를 통째로 한 번에 합성해 문장 사이 억양이 이어지게 한다.
  속도는 1.0 고정(쉼 제외 초당 약 6.7음절). 문장별로 속도를 억지로 맞추면 쉼이 늘어나 끊겨 들린다.
  합성할 때마다 음성인식으로 반복·누락을 확인하고, 더듬으면 다시 합성한다.
- 자막: 음성인식 단어 시간에 맞춰 아래 검은 띠에 한 줄(최대 30자), 문장부호 없음. 인용문(“ ”)은 화면에 크게 쓰므로 자막을 띄우지 않는다.
- 【재구성】·【해석】 표시는 그 문장부터 컷 끝까지 위 띠에 작게 보인다.
- 소리(--sound): 장(章)별 공간 소리(촛불·밤벌레·바람·새벽·현대 실내) + 곡상이 바뀌는 패드 + 강조 효과음을 장별 wav 로 합성.

  python3 scripts/jeongjo.py            # 음성·타임라인
  python3 scripts/jeongjo.py --sound    # 소리(타임라인 뒤에)
"""
import argparse
import hashlib
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import sejong_short as SS  # noqa: E402
import sejong_voice as V  # noqa: E402

NAME = "jeongjo"   # 다른 편은 NAME·OUT·SPEAK·TAGS 를 바꿔 build() 를 부른다(scripts/yuk.py)
OUT = ROOT / "public/jeongjo"
TAGS = "재구성|해석"
FPS = 30
SPEED = 1.0
SIL = 0.22        # 문단 안 문장 사이 쉼(초)
MAXC = 30
LEAD = 0.35       # 컷 시작 → 첫 문장
TAIL = 0.4        # 마지막 문장 → 다음 컷
CHAPTER = 3.6     # 장 제목 카드(내레이션 없음)
_tts = {}


def tts_para(text, dst):
    """문단을 한 번에 합성(Supertonic 이 120자 안에서 문장을 묶어 한 번에 읽는다)."""
    from supertonic import TTS

    if "tts" not in _tts:
        _tts["tts"] = TTS(model_dir=ROOT / ".models/supertonic-3")
        _tts["style"] = _tts["tts"].get_voice_style("M2")
    tts = _tts["tts"]
    a, _ = tts.synthesize(text, voice_style=_tts["style"], lang="ko", speed=SPEED, total_steps=16, silence_duration=SIL)
    a = np.asarray(a, dtype=np.float32).squeeze()
    idx = np.where(np.abs(a) > 0.02 * np.abs(a).max())[0]
    a = a[max(0, idx[0] - 600): idx[-1] + 2000] if len(idx) else a
    a = a / max(1e-6, np.abs(a).max()) * 0.85
    tmp = dst.with_suffix(".raw.wav")
    with wave.open(str(tmp), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(tts.sample_rate)
        w.writeframes((a * 32767).astype(np.int16).tobytes())
    V.to_wav(tmp, dst)
    tmp.unlink()


# 자막은 숫자로 쓰고(1798년 8월), 읽을 때만 한글로 푼다(V.clean: 한자어 읽기).
# 고유어로 읽어야 하는 숫자는 여기서 읽는 법을 따로 정한다.
SPEAK = {
    "297통": "이백아흔일곱 통",
    "297.": "이백아흔일곱.",
    "25자와 20자, 합해서 45자": "스물다섯 자와 스무 자, 합해서 마흔다섯 자",
}


def speech(text):
    for k, v in SPEAK.items():
        text = text.replace(k, v)
    return V.clean(text)


def split_tag(s):
    m = re.match(rf"^【({TAGS})】\s*", s)
    return (m.group(1), s[m.end():]) if m else (None, s)


def line_cards(words):
    """쉼표 마디 단위로 한 줄 카드를 만들고, 30자를 넘는 마디는 어절 경계에서 고르게 나눈다."""
    width = lambda ws: len(" ".join(w["text"] for w in ws))
    clauses, cur = [], []
    for w in words:
        cur.append(w)
        if w["comma"]:
            clauses.append(cur)
            cur = []
    if cur:
        clauses.append(cur)
    # 짧은 마디는 앞 마디와 합친다(한 줄에 들어가면)
    merged = []
    for cl in clauses:
        if merged and width(merged[-1] + cl) <= MAXC and (width(cl) < 12 or width(merged[-1]) < 12):
            merged[-1] = merged[-1] + cl
        else:
            merged.append(cl)
    out = []
    for cl in merged:
        n = -(-width(cl) // MAXC)
        if n <= 1:
            out.append(cl)
            continue
        target = width(cl) / n
        part = []
        for w in cl:
            if part and width(part) >= target * 0.92 and len(out) < 99:
                out.append(part)
                part = []
            part.append(w)
        out.append(part)
    return [{"start": c[0]["start"], "end": c[-1]["end"], "text": " ".join(w["text"] for w in c)} for c in out]


def wav_len(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def build():
    from faster_whisper import WhisperModel

    cuts = json.loads((ROOT / f"data/{NAME}/cuts.json").read_text())
    (OUT / "voice").mkdir(parents=True, exist_ok=True)
    cache_p = OUT / "voice/cache.json"
    cache = json.loads(cache_p.read_text()) if cache_p.exists() else {}
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, out = 0.0, []
    for c in cuts:
        sents = []
        voice = {}
        if c["scene"] == "chapter":
            length = CHAPTER
        elif c["scene"] in ("endscreen", "silent"):
            length = c.get("dur", 20)
        else:
            at = c.get("lead", LEAD)
            tag = None
            items = []
            for raw in c["s"]:
                t2, text = split_tag(raw)
                tag = t2 or tag
                items.append((tag, text.startswith("“"), re.sub(r"[“”『』]", "", text)))
            para = " ".join(speech(x[2]) for x in items)
            wav = OUT / "voice" / f"{c['id']}.wav"
            key = hashlib.md5((f"{para}|{SPEED}|para" + ("" if SIL == 0.22 else f"|{SIL}")).encode()).hexdigest()
            if cache.get(wav.name) != key or not wav.exists():
                import jeongjo_fix as F

                best = None
                for k in range(5):
                    print("TTS", wav.name, f"try{k}", para[:40], flush=True)
                    tts_para(para, wav)
                    sc, hyp = F.score(model, wav, para)
                    if best is None or sc > best[0]:
                        best = (sc, wav.read_bytes())
                    if sc >= 0.93:
                        break
                    print("   retry", round(sc, 2), hyp, flush=True)
                wav.write_bytes(best[1])
                cache[wav.name] = key
                cache_p.write_text(json.dumps(cache, indent=0))
            d = wav_len(wav)
            per = [SS.words_of(x[2]) for x in items]
            for (_, _, disp), ws in zip(items, per):
                # 숫자 표기 단어의 음절 수를 읽는 말 기준으로
                for w in ws:
                    w["w"] = max(1, len(re.findall(r"[가-힣]", speech(w["text"]))))
            allw = [w for ws in per for w in ws]
            SS.align(allw, SS.asr_words(model, wav), d)
            k = 0
            for (tag, quote, speak), ws in zip(items, per):
                for w in ws:
                    w["start"] = round(w["start"] + at, 3)
                    w["end"] = round(w["end"] + at, 3)
                sents.append({"text": speak, "tag": tag, "quote": quote, "start": ws[0]["start"], "end": ws[-1]["end"], "voice": "",
                              "words": [{kk: w[kk] for kk in ("text", "start", "end")} for w in ws],
                              "cards": [] if quote else line_cards(ws)})
            voice = {"voice": f"{NAME}/voice/{wav.name}", "vat": round(at, 3)}
            length = at + d + TAIL + c.get("hold", 0)
        frames = round(length * FPS)
        out.append({"id": c["id"], "sec": c["sec"], "scene": c["scene"], "p": c.get("p", {}), "sentences": sents,
                    "from": round(t * FPS), "duration": frames, **(voice if c["scene"] not in ("chapter", "endscreen", "silent") else {})})
        t += frames / FPS
    total = sum(c["duration"] for c in out)
    (OUT / "timeline.json").write_text(json.dumps({"fps": FPS, "totalFrames": total, "cuts": out}, ensure_ascii=False, indent=1))
    print(f"{len(out)} cuts, {total} frames = {total / FPS / 60:.1f} min")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sound", action="store_true")
    a = ap.parse_args()
    if a.sound:
        import jeongjo_sound

        jeongjo_sound.main()
    else:
        build()
