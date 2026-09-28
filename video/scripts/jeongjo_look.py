"""정조 편 오프닝 룩 테스트(약 25초): 내레이션(문장 단위) → 한 줄 자막 → 소리 연출(한 트랙) → public/jeongjo_look/timeline.json.

영화형 연출 시험용. 목소리는 Supertonic 3 M2, 본편보다 조금 느리게(초당 6.3음절).
소리: 촛불 타닥임·밤벌레·종이 펴는 소리·심장 박동·정적·낮은 현 패드를 numpy 로 직접 합성해 bed.wav 하나로 섞는다.

  python3 scripts/jeongjo_look.py
  npx remotion render src/jeongjo/index.ts JeongjoLook out/jeongjo_look_render.mp4
  python3 scripts/sejong_short.py x --master out/jeongjo_look_render.mp4 out/JEONGJO_look.mp4
"""
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

NAME = "jeongjo_look"
OUT = ROOT / f"public/{NAME}"
FPS = 30
SR = 48000
RATE = 6.3
MAXC = 30   # 아래 검은 띠 자막: 한 줄만(48px)
rng = np.random.default_rng(1798)

# (문장, 문장 앞 쉼) — 첫 문장 앞은 촛불이 켜지고 편지가 펼쳐지는 시간
SENTS = [
    ("“나는 성격이 편협하여 태양증을 감당하지 못한다.”", 2.4),
    ("정조가 신하에게 보낸 편지입니다.", 0.9),
    ("받는 사람은 정치적으로 대립하던 심환지.", 0.35),
    ("왕은 그에게 속내를 털어놓고 정치적 지시도 보냈습니다.", 0.5),
    ("읽은 뒤에는 없애라고 했습니다.", 0.6),
    ("그런데 그 편지가 남았습니다.", 1.6),
]
TITLE_HOLD = 4.2


def one_line_cards(words):
    cards, cur = [], []
    width = lambda ws: len(" ".join(w["text"] for w in ws))
    for w in words:
        if cur and width(cur + [w]) > MAXC:
            cards.append(cur)
            cur = []
        cur.append(w)
        if w["comma"] and width(cur) >= 8:
            cards.append(cur)
            cur = []
    if cur:
        cards.append(cur)
    return [{"start": c[0]["start"], "end": c[-1]["end"], "text": " ".join(w["text"] for w in c)} for c in cards]


def voice():
    from faster_whisper import WhisperModel

    (OUT / "voice").mkdir(parents=True, exist_ok=True)
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, sents = 0.0, []
    for i, (s, pre) in enumerate(SENTS):
        t += pre
        wav = OUT / "voice" / f"s{i}.wav"
        text = re.sub(r"[“”]", "", s)
        if not wav.exists():
            print("TTS", text)
            V.tts_supertonic(V.clean(text), wav, "M2", RATE)
        with wave.open(str(wav)) as w:
            d = w.getnframes() / w.getframerate()
        ws = SS.align(SS.words_of(text), SS.asr_words(model, wav), d)
        for w in ws:
            w["start"] = round(w["start"] + t, 3)
            w["end"] = round(w["end"] + t, 3)
        sents.append({"text": text, "start": round(t, 3), "end": round(t + d, 3), "voice": f"{NAME}/voice/{wav.name}",
                      "words": [{k: w[k] for k in ("text", "start", "end")} for w in ws], "cards": one_line_cards(ws)})
        t += d
    return sents, t


# ── 소리 재료 ─────────────────────────
def lp(x, k):
    return np.convolve(x, np.ones(k) / k, "same")


def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-3)) * np.exp(-np.clip(t - a, 0, None) / d)


def crackle(n):
    y = np.zeros(n)
    for p in rng.choice(n, size=int(n / SR * 7), replace=False):
        k = int(SR * rng.uniform(0.002, 0.008))
        y[p:p + k] += rng.normal(0, 1, len(y[p:p + k])) * np.exp(-np.arange(len(y[p:p + k])) / (k / 4)) * rng.uniform(0.2, 1)
    return lp(y, 3) * 0.12


def crickets(n):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f0, rate, ph in ((4300, 2.6, 0), (4700, 3.1, 1.3)):
        gate = (np.sin(2 * np.pi * rate * t + ph) > 0.55).astype(float)
        trill = 0.5 + 0.5 * np.sin(2 * np.pi * 48 * t)
        y += np.sin(2 * np.pi * f0 * t) * lp(gate * trill, 120)
    return y * 0.012


def pad(n, notes, amp=0.05):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f in notes:
        for det in (-0.15, 0, 0.17):
            y += np.sin(2 * np.pi * f * (1 + det / 100) * t + rng.uniform(0, 6)) + 0.35 * np.sin(4 * np.pi * f * t)
    swell = 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t - 1.5)
    return amp * y * swell / (3 * len(notes))


def rustle(dur):
    n = int(dur * SR)
    y = rng.normal(0, 1, n) * lp(rng.uniform(0, 1, n) ** 6, 400) * 3
    y += crackle(n) * 3
    return lp(y, 2) * np.sin(np.pi * np.arange(n) / n) * 0.35


def thump(n_beats, gap=0.95):
    n = int((n_beats * gap + 0.6) * SR)
    y = np.zeros(n)
    tt = np.arange(int(0.35 * SR)) / SR
    one = np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 14)
    for b in range(n_beats):
        for off, g in ((0, 1.0), (0.24, 0.6)):
            p = int((b * gap + off) * SR)
            y[p:p + len(one)] += one * g
    return y * 0.55


def swell(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = lp(rng.normal(0, 1, n), 30)
    return noise * (t / dur) ** 3 * 0.25


def bell():
    tt = np.arange(int(4 * SR)) / SR
    return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) * a for f, d, a in ((196, 0.9, 1), (392.5, 1.4, 0.4), (588, 2.2, 0.2))) * 0.18


def add(y, x, at):
    p = int(at * SR)
    x = x[: max(0, len(y) - p)]
    y[p:p + len(x)] += x


def sound(sents, total):
    n = int(total * SR)
    L = np.zeros(n)
    s = {i: x for i, x in enumerate(sents)}
    black = s[5]["start"] - 1.2          # 암전(정적) 시작
    title = s[5]["end"] + 0.3
    # 방의 공기: 촛불·밤벌레 (암전 동안 끊는다)
    room = crackle(n) + crickets(n)
    gate = np.ones(n)
    a, b = int(black * SR), int((s[5]["start"] - 0.1) * SR)
    gate[a:b] = 0
    gate = lp(gate, int(0.25 * SR))
    L += room * gate
    # 따뜻한 패드(편지·방) → 차가운 패드(남은 편지·달빛)
    warm = pad(int(black * SR), [110, 164.8, 220], 0.06)
    warm *= np.minimum(1, np.arange(len(warm)) / (2.5 * SR)) * np.minimum(1, (len(warm) - np.arange(len(warm))) / (0.8 * SR))
    add(L, warm, 0)
    cold = pad(int((total - s[5]["start"]) * SR), [123.5, 185, 246.9, 293.7], 0.05)
    cold *= np.minimum(1, np.arange(len(cold)) / (1.5 * SR)) * np.minimum(1, (len(cold) - np.arange(len(cold))) / (1.5 * SR))
    add(L, cold, s[5]["start"])
    # 강조: 편지 펴는 소리, 없애라 → 심장 박동, 암전 직전 부풂, 제목 종
    add(L, rustle(1.4), 0.9)
    add(L, rustle(0.8), s[1]["start"] - 0.5)
    add(L, thump(3), s[4]["start"] + 0.2)
    add(L, swell(1.1), black - 1.1)
    add(L, bell(), title)
    L = np.tanh(L * 1.2) / 1.2
    st = np.stack([L, np.roll(L, int(0.012 * SR)) * 0.96], 1)
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(OUT / "bed.wav"), "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    sents, t = voice()
    total = t + TITLE_HOLD
    sound(sents, total)
    frames = round(total * FPS)
    (OUT / "timeline.json").write_text(json.dumps({"fps": FPS, "totalFrames": frames, "sentences": sents}, ensure_ascii=False, indent=1))
    print(f"{frames} frames = {total:.1f}s")
    for s in sents:
        print(f"{s['start']:5.2f}-{s['end']:5.2f} {s['text']}  |  " + " / ".join(c["text"] for c in s["cards"]))


if __name__ == "__main__":
    main()
