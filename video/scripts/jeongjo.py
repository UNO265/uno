"""정조 편 「정조가 없애라던 편지 297통」: 컷 목록(data/jeongjo/cuts.json) → 내레이션 → 자막 → 소리 → public/jeongjo/timeline.json.

- 내레이션: Supertonic 3 M2, 문장 단위 합성, 쉼 제외 초당 5.7음절(세종 편 6.8보다 느리게).
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

OUT = ROOT / "public/jeongjo"
FPS = 30
RATE = 5.7
MAXC = 30
GAP = 0.55        # 문장 사이
LEAD = 0.7        # 컷 시작 → 첫 문장
TAIL = 0.8        # 마지막 문장 → 다음 컷
CHAPTER = 4.2     # 장 제목 카드(내레이션 없음)


def split_tag(s):
    m = re.match(r"^【(재구성|해석)】\s*", s)
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

    cuts = json.loads((ROOT / "data/jeongjo/cuts.json").read_text())
    (OUT / "voice").mkdir(parents=True, exist_ok=True)
    cache_p = OUT / "voice/cache.json"
    cache = json.loads(cache_p.read_text()) if cache_p.exists() else {}
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, out = 0.0, []
    for c in cuts:
        sents = []
        if c["scene"] == "chapter":
            length = CHAPTER
        elif c["scene"] == "endscreen":
            length = c.get("dur", 20)
        else:
            at = c.get("lead", LEAD)
            tag = None
            for i, raw in enumerate(c["s"]):
                t2, text = split_tag(raw)
                tag = t2 or tag
                quote = text.startswith("“")
                speak = re.sub(r"[“”『』]", "", text)
                wav = OUT / "voice" / f"{c['id']}_{i}.wav"
                key = hashlib.md5(f"{speak}|{RATE}".encode()).hexdigest()
                if cache.get(wav.name) != key or not wav.exists():
                    print("TTS", wav.name, speak, flush=True)
                    V.tts_supertonic(V.clean(speak), wav, "M2", RATE)
                    cache[wav.name] = key
                    cache_p.write_text(json.dumps(cache, indent=0))
                d = wav_len(wav)
                ws = SS.align(SS.words_of(speak), SS.asr_words(model, wav), d)
                for w in ws:
                    w["start"] = round(w["start"] + at, 3)
                    w["end"] = round(w["end"] + at, 3)
                sents.append({"text": speak, "tag": tag, "quote": quote, "start": round(at, 3), "end": round(at + d, 3),
                              "voice": f"jeongjo/voice/{wav.name}",
                              "words": [{k: w[k] for k in ("text", "start", "end")} for w in ws],
                              "cards": [] if quote else line_cards(ws)})
                at += d + GAP
            length = at - GAP + TAIL + c.get("hold", 0)
        frames = round(length * FPS)
        out.append({"id": c["id"], "sec": c["sec"], "scene": c["scene"], "p": c.get("p", {}), "sentences": sents,
                    "from": round(t * FPS), "duration": frames})
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
