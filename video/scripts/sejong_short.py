"""세종 쇼츠: 대본(data/<이름>/script.json) → 내레이션 → 자막 카드 → BGM·효과음 → public/<이름>/timeline.json.

다음 영상 지침(docs/sejong/next-video-guide.md)을 따른다.
- 내레이션은 문장 단위로 한 번에 합성한다(자막 줄 단위로 끊어 읽지 않는다). 목소리 Supertonic 3 M2.
- 자막은 음성인식(Whisper) 단어 시간에 맞춰 나눈다. 마침표·쉼표는 쓰지 않고, 가능한 한 한 줄, 길면 두 줄.
- [ ] 로 감싼 말은 자막에서 색으로 강조한다.

  python3 scripts/sejong_short.py sejong_short1            # 음성·자막·음악
  python3 scripts/sejong_short.py sejong_short1 --master IN.mp4 OUT.mp4   # 음량 -14 LUFS 로 맞춰 최종 파일
"""
import argparse
import json
import re
import shutil
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import sejong_music as SM  # noqa: E402
import sejong_voice as V  # noqa: E402

FPS = 30
RATE = 7.8          # 쇼츠는 본편(6.8)보다 약 15% 빠르게(쉼 제외 초당 음절)
MAXC = 12           # 자막 한 줄 최대 글자 수(세로 화면, 76px)
LEAD = {"S1": 0.1}  # 컷 시작 → 첫 문장(기본 0.2초)
GAP = 0.32          # 문장 사이
TAIL = 0.3          # 마지막 문장 → 다음 컷
HOLD = {"S5": 0.5, "S6": 0.5, "S7": 2.2}  # 말한 뒤 더 머무는 컷


def plain(s):
    return s.replace("[", "").replace("]", "")


def syl(s):
    return len(re.findall(r"[가-힣]", V.clean(s)))


def words_of(sentence):
    """단어마다 (조각 목록[글자, 강조], 쉼표 뒤인지, 음절 수). [ ] 는 단어 안 일부만 감쌀 수도 있다."""
    out, hl = [], False
    for tok in sentence.split():
        parts, buf = [], ""
        for ch in tok:
            if ch in "[]":
                if buf:
                    parts.append([buf, hl])
                buf, hl = "", ch == "["
            else:
                buf += ch
        if buf:
            parts.append([buf, hl])
        text = plain(tok)
        parts = [[re.sub(r"[.,]", "", t), h] for t, h in parts]
        parts = [p for p in parts if p[0]]
        out.append({"text": "".join(t for t, _ in parts), "parts": parts, "comma": text.endswith(","), "w": max(1, syl(text))})
    return out


def align(words, asr, dur):
    """표시 단어마다 시작·끝 시간을 붙인다: 음성인식 단어의 음절 누적 비율에 맞춰 옮긴다(숫자 표기가 달라도 맞음)."""
    if not asr:
        asr = [(0.0, dur, 1)]
    cw = np.cumsum([0] + [a[2] for a in asr]) / sum(a[2] for a in asr)

    def t_at(frac, start):
        frac = min(max(frac, 0), 1)
        j = int(np.searchsorted(cw, frac, side="right" if start else "left")) - 1
        j = min(max(j, 0), len(asr) - 1)
        a0, a1, _ = asr[j]
        k = (frac - cw[j]) / max(1e-9, cw[j + 1] - cw[j])
        return a0 + (a1 - a0) * min(max(k, 0), 1)

    tot = sum(w["w"] for w in words)
    acc = 0
    for w in words:
        w["start"] = round(t_at(acc / tot, True), 3)
        acc += w["w"]
        w["end"] = round(t_at(acc / tot, False), 3)
    return words


def cards(words):
    """쉼표로 나뉜 마디를 기본 단위로, 한 줄(최대 MAXC자) 또는 두 줄 카드로 묶는다."""
    clauses, cur = [], []
    for w in words:
        cur.append(w)
        if w["comma"]:
            clauses.append(cur)
            cur = []
    if cur:
        clauses.append(cur)
    width = lambda ws: len(" ".join(w["text"] for w in ws))
    out = []
    for cl in clauses:
        # 마디가 두 줄에도 안 들어가면 앞에서부터 두 줄 분량씩 자른다
        while cl:
            if width(cl) <= MAXC:
                out.append([cl])
                break
            best = None
            for k in range(1, len(cl)):
                a, b = cl[:k], cl[k:]
                if width(a) <= MAXC and width(b) <= MAXC:
                    # 강조 묶음 한가운데서는 줄을 나누지 않는다(예: "두 / 번")
                    inside = a[-1]["parts"][-1][1] and b[0]["parts"][0][1]
                    score = abs(width(a) - width(b)) + (100 if inside else 0)
                    if best is None or score < best[0]:
                        best = (score, k)
            if best:
                out.append([cl[: best[1]], cl[best[1]:]])
                break
            k = 1
            while k < len(cl) and width(cl[: k + 1]) <= MAXC:
                k += 1
            out.append([cl[:k]])
            cl = cl[k:]
    return [
        {"start": ln[0][0]["start"], "end": ln[-1][-1]["end"], "lines": [[w["parts"] for w in line] for line in ln]}
        for ln in out
    ]


def asr_words(model, wav):
    segs, _ = model.transcribe(str(wav), language="ko", word_timestamps=True, beam_size=5)
    return [(w.start, w.end, max(1, len(re.findall(r"[가-힣]", V.clean(w.word))))) for s in segs for w in s.words]


def wav_len(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def build(name, force=False):
    from faster_whisper import WhisperModel

    data = json.loads((ROOT / f"data/{name}/script.json").read_text())
    out = ROOT / f"public/{name}"
    (out / "voice").mkdir(parents=True, exist_ok=True)
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, cuts = 0.0, []
    for c in data["cuts"]:
        at = LEAD.get(c["id"], 0.2)
        sents = []
        for i, s in enumerate(c["sentences"]):
            wav = out / "voice" / f"{c['id']}_{i}.wav"
            if force or not wav.exists():
                print("TTS", wav.name, plain(s))
                V.tts_supertonic(V.clean(plain(s)), wav, "M2", RATE)
            d = wav_len(wav)
            ws = align(words_of(s), asr_words(model, wav), d)
            for w in ws:
                w["start"] += at
                w["end"] += at
            sents.append({"text": plain(s), "start": round(at, 3), "end": round(at + d, 3), "voice": f"{name}/voice/{wav.name}",
                          "words": [{k: w[k] for k in ("text", "start", "end")} for w in ws], "cards": cards(ws)})
            at += d + GAP
        length = at - GAP + TAIL + HOLD.get(c["id"], 0)
        frames = round(length * FPS)
        cuts.append({**c, "sentences": sents, "from": round(t * FPS), "duration": frames})
        t += frames / FPS
    total = sum(c["duration"] for c in cuts)
    music(name, cuts, total)
    tl = {"fps": FPS, "width": 1080, "height": 1920, "totalFrames": total, "cuts": cuts}
    (out / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f"{len(cuts)} cuts, {total} frames = {total / FPS:.1f}s")


def music(name, cuts, total):
    """흐름에 따라 두 곡: 사직서 반려까지는 경쾌한 뜯음(ch3), 87세 답부터는 무겁게(ch4). 반전 직전 1초는 비운다."""
    out = ROOT / f"public/{name}/music"
    out.mkdir(parents=True, exist_ok=True)
    split = next(c["from"] for c in cuts if c["id"] == "S6")
    parts = [("a", "ch3", 0, split), ("b", "ch4", split, total)]
    cues = []
    for key, mood, a, b in parts:
        y = SM.compose(mood, (b - a) / FPS + 2.0)
        SM.write(out / f"{key}.wav", y)
        cues.append({"file": f"{name}/music/{key}.wav", "from": a, "to": b, "mood": mood})
    (out / "cues.json").write_text(json.dumps(cues, indent=1))
    # 효과음: 본편과 같은 도장·휙·종 + 숫자가 멈출 때의 딱 소리
    src = ROOT / "public/sejong/music"
    SM.OUT = src
    if not (src / "stamp.wav").exists():
        SM.sfx()
    for f in ("stamp", "whoosh", "bell"):
        shutil.copy(src / f"{f}.wav", out / f"{f}.wav")
    tt = np.arange(int(0.25 * SM.SR)) / SM.SR
    tick = (np.sin(2 * np.pi * 1800 * tt) * 0.5 + np.sin(2 * np.pi * 900 * tt)) * np.exp(-tt * 60) * 0.6
    SM.write(out / "tick.wav", tick)


def master(inp, outp):
    """렌더링된 파일의 소리를 -14 LUFS·최대 -1.5 dBFS 로 맞춰 다시 담는다(영상은 그대로)."""
    import subprocess

    import pyloudnorm as pyln
    import soundfile as sf

    env = dict(**__import__("os").environ, LD_LIBRARY_PATH=str(V.COMP))
    ff = str(V.COMP / "ffmpeg")
    tmp = Path(outp).with_suffix(".tmp.wav")
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", inp, "-vn", "-ac", "2", "-ar", "48000", str(tmp)], check=True, env=env)
    a, sr = sf.read(tmp)
    meter = pyln.Meter(sr)
    a = pyln.normalize.loudness(a, meter.integrated_loudness(a), -14.0)
    peak = 10 ** (-1.5 / 20)
    a = np.where(np.abs(a) > peak * 0.8, np.sign(a) * (peak * 0.8 + (peak * 0.2) * np.tanh((np.abs(a) - peak * 0.8) / (peak * 0.2))), a)
    sf.write(tmp, a, sr)
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", inp, "-i", str(tmp), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", outp], check=True, env=env)
    tmp.unlink()
    print(f"{outp}: {meter.integrated_loudness(a):.1f} LUFS, peak {20 * np.log10(np.abs(a).max()):.1f} dBFS")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("name")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--master", nargs=2, metavar=("IN", "OUT"))
    a = ap.parse_args()
    if a.master:
        master(*a.master)
    else:
        build(a.name, a.force)
