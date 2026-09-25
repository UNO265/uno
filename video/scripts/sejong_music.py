"""세종 영상 BGM·효과음: 파트(sec)별 국악풍 앰비언트를 numpy 로 직접 합성해 public/sejong/music/ 에 쓴다.

- 악기: 가야금풍 뜯는 현(Karplus-Strong + 농현 떨림), 낮은 드론, 현악 패드, 대금풍 긴 소리(사인 + 숨소리).
- 음계: 계면조풍 단조 5음(D F G A C) / 평조풍 5음(G A C D E). 작곡·음원 모두 이 스크립트가 만든 오리지널.
- 길이는 public/sejong/timeline.json 의 파트 길이에 맞춘다(내레이션 확정 뒤 다시 실행).
- public/sejong/music/cues.json 에 파트별 시작 프레임과 길이를 쓴다.
"""
import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/sejong/music"
SR = 44100
FPS = 30
rng = np.random.default_rng(1446)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def pluck(freq, dur, amp=0.5, bright=0.6, bend=0.0):
    """가야금풍: Karplus-Strong. bend>0 이면 소리 뒤쪽에 농현(느린 떨림)."""
    n = int(dur * SR)
    period = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, period)
    # 밝기: 초기 잡음을 살짝 누그러뜨림
    for _ in range(int((1 - bright) * 4)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n + period)
    out[:period] = buf
    decay = 0.996
    i = period
    while i < n:
        k = min(period, n - i)
        prev = out[i - period:i - period + k + 1]
        out[i:i + k] = decay * 0.5 * (prev[:k] + prev[1:k + 1])
        i += k
    y = out[:n]
    if bend:
        t = np.arange(n) / SR
        vib = bend * np.clip(t - 0.35, 0, None) * np.sin(2 * np.pi * 5.2 * t)
        idx = np.clip(np.arange(n) + vib * SR / freq * 0.6, 0, n - 1)
        y = np.interp(idx, np.arange(n), y)
    env = np.minimum(1, np.arange(n) / (0.004 * SR))
    return amp * y * env


def drone(freqs, n, amp=0.12):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for j, f in enumerate(freqs):
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * (0.03 + 0.011 * j) * t + j)
        y += lfo * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t + 0.5) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    return amp * y / len(freqs)


def pad(chord, n, amp=0.08):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f in chord:
        for d in (-0.12, 0, 0.13):
            y += np.sin(2 * np.pi * f * (1 + d / 100) * t + rng.uniform(0, 6))
    return amp * y / (3 * len(chord))


def flute(freq, dur, amp=0.16):
    """대금풍 긴 소리: 사인 + 숨소리, 느린 떨림."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 4.6 * t) * np.clip(t - 0.6, 0, 1)
    ph = 2 * np.cumsum(np.pi * freq * vib / SR)
    y = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = np.convolve(rng.normal(0, 1, n), np.ones(40) / 40, "same") * 0.35
    env = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.9).clip(0)
    return amp * (y + breath) * env


def reverb(x, seconds=2.6, wet=0.35):
    m = int(seconds * SR)
    ir = rng.normal(0, 1, m) * np.exp(-np.arange(m) / (0.32 * SR))
    ir = np.convolve(ir, np.ones(8) / 8, "same")
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + m
    size = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - wet) * x + wet * y * 0.6


KYEMYEON = [50, 53, 55, 57, 60, 62, 65, 67, 69, 72]   # D F G A C (계면조풍)
PYEONG = [55, 57, 60, 62, 64, 67, 69, 72, 74, 76]     # G A C D E (평조풍)

# 파트별 곡상: 음계, 드론, 뜯는 간격(초), 음역, 패드, 대금
MOODS = {
    "hook": dict(scale=KYEMYEON, drone=[hz(38), hz(45)], every=4.5, lo=4, hi=9, pad=None, flute=False, level=0.9),
    "prologue": dict(scale=KYEMYEON, drone=[hz(38), hz(45)], every=2.6, lo=2, hi=8, pad=[hz(50), hz(57), hz(60)], flute=True, level=1.0),
    "ch1": dict(scale=PYEONG, drone=[hz(43)], every=1.3, lo=0, hi=8, pad=[hz(55), hz(62), hz(67)], flute=False, level=1.0),
    "ch2": dict(scale=KYEMYEON, drone=[hz(38), hz(50)], every=2.4, lo=5, hi=10, pad=[hz(50), hz(53), hz(60)], flute=False, level=0.95),
    "ch3": dict(scale=PYEONG, drone=[hz(43)], every=0.95, lo=0, hi=7, pad=None, flute=False, level=1.0),
    "ch4": dict(scale=KYEMYEON, drone=[hz(38), hz(45), hz(50)], every=3.4, lo=0, hi=6, pad=[hz(50), hz(53), hz(57)], flute=True, level=0.95),
    "ch5": dict(scale=KYEMYEON, drone=[hz(38), hz(45)], every=1.6, lo=2, hi=9, pad=[hz(50), hz(57), hz(62)], flute=False, level=1.0),
    "epilogue": dict(scale=PYEONG, drone=[hz(43), hz(50)], every=2.2, lo=1, hi=8, pad=[hz(55), hz(59), hz(62), hz(67)], flute=True, level=0.95),
}


def compose(mood, dur, bright_from=None):
    m = MOODS[mood]
    n = int(dur * SR)
    y = drone(m["drone"], n)
    if m["pad"]:
        y += pad(m["pad"], n)
    t = rng.uniform(0.5, 2.0)
    note = rng.integers(m["lo"], m["hi"])
    while t < dur - 1.5:
        scale = m["scale"]
        # 5장 훈민정음 이후는 평조로 밝게
        if bright_from is not None and t >= bright_from:
            scale = PYEONG
        note = int(np.clip(note + rng.choice([-2, -1, -1, 1, 1, 2, 0]), m["lo"], m["hi"] - 1))
        f = hz(scale[note])
        k = int(t * SR)
        p = pluck(f, 3.2, amp=0.22 + rng.uniform(0, 0.08), bend=0.5 if rng.random() < 0.35 else 0)
        y[k:k + len(p)] += p[: n - k]
        # 가끔 아래 5도 겹음
        if rng.random() < 0.25:
            p2 = pluck(f / 1.5, 3.0, amp=0.12)
            y[k:k + len(p2)] += p2[: n - k]
        t += m["every"] * rng.choice([0.5, 1, 1, 1, 1.5, 2])
    if m["flute"]:
        t = rng.uniform(6, 14)
        while t < dur - 8:
            f = hz(m["scale"][rng.integers(4, 8)])
            d = rng.uniform(4, 7)
            fl = flute(f, d)
            k = int(t * SR)
            y[k:k + len(fl)] += fl[: n - k]
            t += rng.uniform(18, 30)
    if bright_from is not None:
        k = int(bright_from * SR)
        y[k:] += pad([hz(55), hz(62), hz(67), hz(71)], n - k, amp=0.1) * np.minimum(1, np.arange(n - k) / (3 * SR))
    y = reverb(y)
    fade = int(2.0 * SR)
    env = np.ones(n)
    env[:fade] = np.linspace(0, 1, fade)
    env[-fade:] = np.linspace(1, 0, fade)
    y *= env * m["level"]
    return y / max(1e-6, np.max(np.abs(y))) * 0.8


def write(path, y):
    pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def sfx():
    """효과음: 도장(낮은 쿵 + 종이), 장 전환(부드러운 바람), 붓 획(짧은 종이 스침)."""
    t = np.arange(int(0.6 * SR)) / SR
    thud = np.sin(2 * np.pi * 70 * t * (1 - 0.4 * t)) * np.exp(-t * 18)
    paper = np.convolve(rng.normal(0, 1, len(t)), np.ones(12) / 12, "same") * np.exp(-t * 30) * 0.5
    write(OUT / "stamp.wav", reverb(0.9 * thud + paper, 0.8, 0.2))
    t = np.arange(int(1.6 * SR)) / SR
    noise = np.convolve(rng.normal(0, 1, len(t)), np.ones(60) / 60, "same")
    env = np.sin(np.pi * t / t[-1]) ** 2
    write(OUT / "whoosh.wav", reverb(noise * env * 3, 1.2, 0.3) * 0.6)
    t = np.arange(int(0.35 * SR)) / SR
    brush = np.convolve(rng.normal(0, 1, len(t)), np.ones(20) / 20, "same") * np.sin(np.pi * t / t[-1]) * 1.4
    write(OUT / "brush.wav", brush * 0.5)
    t = np.arange(int(3.0 * SR)) / SR
    bell = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(hz(74), 1.2), (hz(81), 1.6), (hz(86), 2.2)])
    write(OUT / "bell.wav", reverb(bell / 3, 2.0, 0.4) * 0.8)


def main():
    tl = json.loads((ROOT / "public/sejong/timeline.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    order = []
    for c in tl["cuts"]:
        if not order or order[-1]["sec"] != c["sec"]:
            order.append({"sec": c["sec"], "from": c["from"], "to": c["from"] + c["duration"]})
        else:
            order[-1]["to"] = c["from"] + c["duration"]
    cues = []
    for s in order:
        dur = (s["to"] - s["from"]) / FPS + 2.0
        bright = None
        if s["sec"] == "ch5":
            c511 = next(c for c in tl["cuts"] if c["id"] == "C511")
            bright = (c511["from"] - s["from"]) / FPS + c511["segments"][1]["start"]
        y = compose(s["sec"], dur, bright)
        name = f"{s['sec']}.wav"
        write(OUT / name, y)
        cues.append({"file": f"sejong/music/{name}", "from": s["from"], "to": s["to"], "mood": s["sec"]})
        print(name, f"{dur:.0f}s")
    (OUT / "cues.json").write_text(json.dumps(cues, indent=1))
    sfx()


if __name__ == "__main__":
    main()
