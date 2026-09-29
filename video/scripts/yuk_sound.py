"""육영수 편 소리: public/yuk/timeline.json → public/yuk/sound/*.wav + cues.json.

탐사 보도 톤. 촛불·가야금(정조 편) 대신 낮은 신스 드론 + 맥박 같은 저음 + 문서 화면의 작은 클릭.
총소리는 쓰지 않는다(실제 희생자가 있는 사건). 강조는 저음 충격·도장 소리·정적으로 한다.

  python3 scripts/yuk.py --sound
"""
import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/yuk"
SR = 48000
FPS = 30


def smooth(x, n):
    n = max(1, int(n))
    c = np.cumsum(np.insert(x, 0, 0.0))
    y = (c[n:] - c[:-n]) / n
    return np.concatenate([y, np.full(len(x) - len(y), y[-1] if len(y) else 0.0)])


def env(n, a, r):
    e = np.ones(n)
    a, r = int(a * SR), int(r * SR)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def drone(sec, root=55.0, seed=1):
    """어두운 드론: 근음·5도·옥타브 사인 + 느린 떨림 + 걸러 낸 잡음."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(seed)
    x = np.zeros(n)
    for m, a in ((1, 0.5), (1.5, 0.22), (2, 0.18), (3, 0.06)):
        f = root * m * (1 + 0.002 * np.sin(2 * np.pi * 0.07 * t + m))
        x += a * np.sin(2 * np.pi * np.cumsum(f) / SR)
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
    noise = rng.standard_normal(n)
    x += 0.08 * smooth(noise, 60)
    return x * env(n, 1.5, 1.5)


def hit(sec=2.5, f0=48):
    """저음 충격(쿵): 떨어지는 사인 + 짧은 잡음 머리."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = f0 + 70 * np.exp(-t * 18)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    rng = np.random.default_rng(3)
    x += 0.25 * smooth(rng.standard_normal(n), 8) * np.exp(-t * 40)
    return x


def stamp():
    """도장: 둔탁한 짧은 두드림."""
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(5)
    x = smooth(rng.standard_normal(n), 14) * np.exp(-t * 35) * 1.6
    x += 0.8 * np.sin(2 * np.pi * 95 * t) * np.exp(-t * 28)
    return x


def click(k=0):
    """키보드·마우스 클릭."""
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(10 + k)
    return rng.standard_normal(n) * np.exp(-t * 260) * 0.35


def whoosh(sec=1.6):
    """카메라가 날아드는 바람 소리(걸러 낸 잡음이 커졌다 작아짐)."""
    n = int(sec * SR)
    rng = np.random.default_rng(7)
    x = smooth(rng.standard_normal(n), 30)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return x * e * 1.4


def pulse(sec, bpm=62):
    """심장 박동 같은 낮은 맥박."""
    n = int(sec * SR)
    x = np.zeros(n)
    beat = hit(0.5, 42) * 0.5
    step = int(SR * 60 / bpm)
    for s in range(int(0.3 * SR), n - len(beat), step):
        x[s: s + len(beat)] += beat
        s2 = s + int(0.28 * SR)
        if s2 + len(beat) < n:
            x[s2: s2 + len(beat)] += beat * 0.55
    return x


def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += g * x[: j - i]


def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def main():
    tl = json.loads((OUT / "timeline.json").read_text())
    total = tl["totalFrames"] / FPS
    n = int(total * SR) + SR
    bed = np.zeros(n)
    fx = np.zeros(n)
    speech = np.zeros(n)
    for c in tl["cuts"]:
        t0 = c["from"] / FPS
        d = c["duration"] / FPS
        v = c["p"].get("view")
        for s in c["sentences"]:
            a, b = int((t0 + s["start"]) * SR), int((t0 + s["end"]) * SR)
            speech[a:b] = 1
        if v == "notice":
            add(bed, t0, drone(d + 1.5, 41.2, 2) * 0.35)
        elif v in ("hookQuote", "flyin", "seat", "date", "verdict", "memo"):
            add(bed, t0, drone(d + 1.5, 55.0, 3) * 0.5)
        elif v == "bullet":
            add(bed, t0, drone(d + 1.0, 46.2, 4) * 0.45)
            add(bed, t0, pulse(d) * 0.6)
        if v == "flyin":
            add(fx, t0, whoosh(1.8) * 0.5)
        if v in ("hookQuote", "memo", "verdict", "date"):
            add(fx, t0, hit(2.0, 50) * 0.35)
        if v == "date":
            for k in range(12):
                add(fx, t0 + 0.2 + k * 0.066, click(k), 1.0)
        if v == "verdict":
            ss = c["sentences"]
            if len(ss) > 1:
                add(fx, t0 + ss[1]["start"] + 0.2, stamp() * 0.7)
                add(fx, t0 + ss[1]["start"] + 0.2, hit(1.6, 44) * 0.35)
        if v == "memo":
            for k in range(3):
                add(fx, t0 + 0.2 + k * 0.47, click(20 + k), 1.0)
        if v == "title":
            add(fx, t0, hit(3.0, 40) * 0.8)
            add(bed, t0, drone(d + 1.0, 36.7, 5) * 0.5)
    # 탄두 질문 직전 정적: bullet 컷 두 번째 문장 앞 0.6초 동안 배경을 비운다
    for c in tl["cuts"]:
        if c["p"].get("view") == "bullet" and len(c["sentences"]) > 1:
            a = c["from"] / FPS + c["sentences"][1]["start"]
            i, j = int((a - 0.7) * SR), int((a + 0.1) * SR)
            g = np.ones(n)
            g[i:j] = np.linspace(1, 0.15, j - i)
            k = int((a + 1.2) * SR)
            g[j:k] = np.linspace(0.15, 1, k - j)
            bed *= g
    duck = 1 - 0.4 * smooth(speech, int(0.25 * SR))
    mix = bed * duck * 0.55 + fx * 0.7
    mix /= max(1e-6, np.abs(mix).max()) / 0.5
    (OUT / "sound").mkdir(parents=True, exist_ok=True)
    write(OUT / "sound/bed.wav", mix)
    cues = [{"file": "yuk/sound/bed.wav", "from": 0, "to": tl["totalFrames"], "vol": 1.0}]
    (OUT / "sound/cues.json").write_text(json.dumps(cues))
    print("sound", round(total, 1), "s")


if __name__ == "__main__":
    main()
