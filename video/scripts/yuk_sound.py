"""육영수 편 소리: public/yuk/timeline.json → public/yuk/sound/bed.wav + cues.json.

BGM 은 대본 흐름(sec)에 따라 곡을 바꾼다. 모두 numpy 로 합성(자체 제작, 외부 음원 없음).
  notice·hook  : 긴장 — 낮은 드론 + 맥박
  prologue     : 현재·탐사 — 부드러운 전자피아노 아르페지오(A단조)
  ch1          : 비극·장중 — 현악 패드(D단조) + 드문 피아노 / 다섯 발 장면은 드론 + 심장박동
  ch2          : 수사 — 저음 반복 리듬(E단조) + 패드
  ch3          : 외교 긴장 — 조금 빠른 반복 리듬 + 불협 패드 + 팀파니
  ch4          : 미스터리 — 드문 종소리 + 드론, 탄두 고리 장면은 심장박동
  ch5          : 정리·성찰 — 따뜻한 장조 패드 + 피아노
  epi·end      : 추모 — 느린 피아노 선율 + 옅은 패드, 끝 화면까지 여운
전환은 문장이 끝난 쉼에서 1.5초 크로스페이드. 반전·답 직전에는 BGM 을 잠깐 비운다.
총소리는 쓰지 않는다(실제 희생자가 있는 사건). 강조는 저음 충격·도장 소리로.

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
RNG = np.random.default_rng(11)


# ───────── 기본 도구 ─────────
def smooth(x, n):
    n = max(1, int(n))
    c = np.cumsum(np.insert(x, 0, 0.0))
    y = (c[n:] - c[:-n]) / n
    return np.concatenate([y, np.full(len(x) - len(y), y[-1] if len(y) else 0.0)])


def env(n, a, r):
    e = np.ones(n)
    a, r = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(buf), i + len(x))
    buf[i:j] += g * x[: j - i]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ───────── 악기 ─────────
def piano(m, dur=2.5, v=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    x = np.zeros(n)
    for k in range(1, 7):
        fk = f0 * k * (1 + 0.0004 * k * k)
        x += np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.2 + 0.9 * k)) / k ** 1.4
    x *= env(n, 0.004, 0.3)
    return x * v * 0.5


def epiano(m, dur=1.6, v=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    mod = np.sin(2 * np.pi * f0 * t) * 1.2 * np.exp(-t * 4)
    x = np.sin(2 * np.pi * f0 * t + mod) * np.exp(-t * 1.8)
    x += 0.2 * np.sin(2 * np.pi * 2 * f0 * t) * np.exp(-t * 3)
    return x * env(n, 0.006, 0.25) * v * 0.35


def pad(ms, dur, v=1.0, bright=3, att=1.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m in ms:
        f0 = hz(m)
        for d in (-0.003, 0.0, 0.0031):
            for k in range(1, bright + 1):
                x += np.sin(2 * np.pi * f0 * (1 + d) * k * t + RNG.uniform(0, 6)) / k ** 1.6
    x = smooth(x, 6)
    x *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.13 * t)
    return x * env(n, att, att) * v * 0.06


def pluck(m, dur=0.6, v=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    x = sum(np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * (5 + 4 * k)) / k for k in range(1, 5))
    return x * env(n, 0.003, 0.05) * v * 0.5


def bell(m, dur=4.0, v=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    x = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 0.9), (2.76, 0.5, 1.6), (5.4, 0.25, 2.8), (8.93, 0.12, 4)))
    return x * env(n, 0.003, 0.5) * v * 0.3


def drone(sec, root=55.0, v=1.0):
    n = int(sec * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m, a in ((1, 0.5), (1.5, 0.22), (2, 0.18), (3, 0.06)):
        f = root * m * (1 + 0.002 * np.sin(2 * np.pi * 0.07 * t + m))
        x += a * np.sin(2 * np.pi * np.cumsum(f) / SR)
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
    x += 0.08 * smooth(RNG.standard_normal(n), 60)
    return x * env(n, 1.5, 1.5) * v


def hit(sec=2.5, f0=48):
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = f0 + 70 * np.exp(-t * 18)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    x += 0.25 * smooth(RNG.standard_normal(n), 8) * np.exp(-t * 40)
    return x


def timpani(m=38, v=1.0):
    n = int(2.5 * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    x = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 2.5) + 0.4 * np.sin(2 * np.pi * f0 * 1.5 * t) * np.exp(-t * 4)
    x += 0.3 * smooth(RNG.standard_normal(n), 20) * np.exp(-t * 30)
    return x * v * 0.6


def stamp():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    x = smooth(RNG.standard_normal(n), 14) * np.exp(-t * 35) * 1.6
    x += 0.8 * np.sin(2 * np.pi * 95 * t) * np.exp(-t * 28)
    return x


def click(k=0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    return np.random.default_rng(10 + k).standard_normal(n) * np.exp(-t * 260) * 0.35


def whoosh(sec=1.6):
    n = int(sec * SR)
    x = smooth(RNG.standard_normal(n), 30)
    return x * np.sin(np.linspace(0, np.pi, n)) ** 2 * 1.4


def pulse(sec, bpm=62, v=1.0):
    n = int(sec * SR)
    x = np.zeros(n)
    beat = hit(0.5, 42) * 0.5
    step = int(SR * 60 / bpm)
    for s in range(int(0.3 * SR), n - len(beat), step):
        x[s: s + len(beat)] += beat
        s2 = s + int(0.28 * SR)
        if s2 + len(beat) < n:
            x[s2: s2 + len(beat)] += beat * 0.55
    return x * v


# ───────── 구간별 곡 ─────────
def m_tense(sec):
    return drone(sec + 1.5, 55.0, 0.55) + pulse(sec + 1.5, 60, 0.35)


def m_prologue(sec):
    x = np.zeros(int((sec + 2) * SR))
    chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    beat = 60 / 84
    bar = beat * 4
    for b in range(int(sec / bar) + 1):
        ch = chords[b % 4]
        add(x, b * bar, pad([c - 12 for c in ch], bar + 1.2, 0.6, att=0.6))
        for i in range(8):
            add(x, b * bar + i * beat / 2, epiano(ch[i % 3] + (12 if i in (3, 7) else 0), 1.2, 0.55 if i % 2 else 0.7))
    return x


def m_solemn(sec):
    x = np.zeros(int((sec + 3) * SR))
    chords = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]]  # Dm Bb Gm A
    bar = 4.0
    mel = [69, 67, 65, 64, 65, 62, 64, 61]
    for b in range(int(sec / bar) + 1):
        ch = chords[b % 4]
        add(x, b * bar, pad(ch + [ch[0] - 12], bar + 2.0, 1.0, bright=4, att=1.8))
        if b % 2 == 0:
            add(x, b * bar + 0.5, piano(mel[(b // 2) % len(mel)], 3.5, 0.5))
            add(x, b * bar + 2.5, piano(mel[(b // 2 + 1) % len(mel)] - 12, 3.0, 0.35))
    return x


def m_shots(sec):
    return drone(sec + 1.5, 36.7, 0.5) + pulse(sec + 1.5, 56, 0.55)


def m_invest(sec):
    x = np.zeros(int((sec + 2) * SR))
    beat = 60 / 92
    chords = [[52, 55, 59], [48, 52, 55], [45, 48, 52], [47, 51, 54]]  # Em C Am B
    bass = [40, 40, 43, 40, 40, 38, 40, 43]
    bar = beat * 4
    for b in range(int(sec / bar) + 1):
        ch = chords[b % 4]
        add(x, b * bar, pad(ch, bar + 1.2, 0.7, att=0.8))
        for i in range(8):
            add(x, b * bar + i * beat / 2, pluck(bass[i] + (ch[0] - 52), 0.5, 0.8 if i % 2 == 0 else 0.5))
    return x


def m_diplo(sec):
    x = np.zeros(int((sec + 2) * SR))
    beat = 60 / 100
    chords = [[48, 51, 55, 57], [44, 48, 51, 55], [41, 44, 48, 50], [43, 47, 50, 53]]  # Cm(add6) Ab Fm G7
    bar = beat * 4
    for b in range(int(sec / bar) + 1):
        ch = chords[b % 4]
        add(x, b * bar, pad(ch, bar + 1.0, 0.75, att=0.6))
        for i in range(8):
            add(x, b * bar + i * beat / 2, pluck(ch[0] - 12 + (7 if i in (3, 6) else 0), 0.4, 0.75))
        if b % 2 == 0:
            add(x, b * bar, timpani(ch[0] - 12, 0.7))
    return x


def m_mystery(sec):
    x = drone(sec + 2, 41.2, 0.45)
    scale = [69, 72, 74, 76, 79, 81]
    t = 1.0
    while t < sec:
        add(x, t, bell(int(RNG.choice(scale)), 4.0, 0.45))
        t += RNG.uniform(2.8, 5.0)
    return x


def m_chain(sec):
    return m_mystery(sec) + pulse(sec + 2, 58, 0.4)


def m_reflect(sec):
    x = np.zeros(int((sec + 3) * SR))
    chords = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53]]  # F C Dm Bb
    bar = 4.0
    for b in range(int(sec / bar) + 1):
        ch = chords[b % 4]
        add(x, b * bar, pad(ch, bar + 2.0, 0.9, bright=3, att=1.8))
        for i, m in enumerate(ch + [ch[1] + 12]):
            add(x, b * bar + 0.4 + i * 0.7, piano(m + 12, 3.0, 0.3))
    return x


def m_elegy(sec):
    x = np.zeros(int((sec + 4) * SR))
    mel = [(76, 1.5), (74, 0.75), (72, 0.75), (71, 1.5), (69, 1.5), (72, 1.5), (71, 0.75), (69, 0.75), (67, 1.5), (69, 3.0)]
    chords = [[45, 52, 57], [41, 48, 53], [48, 52, 55], [43, 50, 55]]  # Am F C G
    bar = 6.0
    for b in range(int(sec / bar) + 1):
        add(x, b * bar, pad(chords[b % 4], bar + 2.5, 0.55, bright=2, att=2.5))
        add(x, b * bar, piano(chords[b % 4][0], 5.0, 0.35))
    t = 1.0
    k = 0
    while t < sec - 2:
        m, d = mel[k % len(mel)]
        add(x, t, piano(m, max(2.5, d * 2), 0.55))
        t += d * 1.25
        k += 1
        if k % len(mel) == 0:
            t += 2.5
    return x


MOOD = {"notice": lambda s: drone(s + 1.5, 41.2, 0.4), "hook": m_tense, "prologue": m_prologue, "ch1": m_solemn, "shots": m_shots,
        "ch2": m_invest, "ch3": m_diplo, "ch4": m_mystery, "chain": m_chain, "ch5": m_reflect, "epi": m_elegy, "end": m_elegy}


def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def main():
    tl = json.loads((OUT / "timeline.json").read_text())
    cuts = tl["cuts"]
    total = tl["totalFrames"] / FPS
    n = int(total * SR) + 3 * SR
    music = np.zeros(n)
    fx = np.zeros(n)
    speech = np.zeros(n)
    t0 = lambda c: c["from"] / FPS
    st = lambda c, i: t0(c) + c["sentences"][min(i, len(c["sentences"]) - 1)]["start"] if c["sentences"] else t0(c)

    def word(c, text, fb):
        for s in c["sentences"]:
            for w in s["words"]:
                if text in w["text"]:
                    return t0(c) + w["start"]
        return fb

    # 1) 곡 구간: sec 기준, 일부 장면은 곡을 바꾼다(다섯 발 · 탄두 고리)
    def mood_of(c):
        v = c["p"].get("view")
        if v == "shots":
            return "shots"
        if c["sec"] == "ch4" and v in ("chain", "twoviews", "bullet"):
            return "chain"
        return c["sec"]

    spans = []
    for c in cuts:
        m = mood_of(c)
        if spans and spans[-1][0] == m:
            spans[-1][2] = t0(c) + c["duration"] / FPS
        else:
            spans.append([m, t0(c), t0(c) + c["duration"] / FPS])
    XF = 1.5
    for m, a, b in spans:
        seg = MOOD[m](b - a + XF)
        seg = seg[: int((b - a + XF) * SR)]
        e = env(len(seg), XF if a > 0 else 0.5, XF)
        add(music, a - (XF / 2 if a > 0 else 0), seg * e)

    # 2) 효과음(장면마다 강조 한두 개)
    for c in cuts:
        v = c["p"].get("view")
        a = t0(c)
        for s in c["sentences"]:
            i, j = int((a + s["start"]) * SR), int((a + s["end"]) * SR)
            speech[i:j] = 1
        if v == "chapter":
            add(fx, a, hit(2.5, 44) * 0.55)
        elif v == "flyin":
            add(fx, a, whoosh(1.8) * 0.5)
        elif v == "date":
            for k in range(10):
                add(fx, a + 0.3 + k * 0.066, click(k))
        elif v == "verdict":
            add(fx, st(c, 1) + 0.2, stamp() * 0.7)
        elif v == "memo":
            for k in range(3):
                add(fx, a + 0.2 + k * 0.47, click(20 + k))
        elif v == "title":
            add(fx, a, hit(3.0, 40) * 0.8)
        elif v == "route" and c["p"].get("step") == 1:
            add(fx, st(c, 1) + 0.2, stamp() * 0.5)
            add(fx, st(c, 1) + 0.66, stamp() * 0.5)
        elif v == "conclusion":
            add(fx, st(c, 1) + 22 / FPS, stamp() * 0.7)
        elif v == "archive":
            add(fx, word(c, "국교를", st(c, 1) + 0.6) + 0.1, stamp() * 0.7)
        elif v == "chain" and c["p"].get("step") == 1:
            add(fx, st(c, 3), stamp() * 0.6)
        elif v == "claim":
            add(fx, st(c, 2), stamp() * 0.5)
        elif v == "shots":
            for i, _ in enumerate(c["p"].get("shots", [])):
                add(fx, st(c, i) + 0.2, hit(0.9, 62) * 0.25)
        elif v == "answer":
            add(fx, st(c, 2), hit(2.0, 46) * 0.5)
        elif v == "hall" and "question" in c["p"].get("marks", []):
            add(fx, st(c, 1), hit(2.0, 44) * 0.4)

    # 3) 반전·답 직전 정적
    dips = []
    for c in cuts:
        v = c["p"].get("view")
        if v == "bullet" and len(c["sentences"]) > 1:
            dips.append(st(c, 1))
        if v == "twoviews" and c["p"].get("step") == 1:
            dips.append(st(c, 3))
        if v == "answer":
            dips.append(st(c, 2))
    g = np.ones(n)
    for d in dips:
        i, j, k = int((d - 0.8) * SR), int((d + 0.05) * SR), int((d + 1.4) * SR)
        g[i:j] = np.minimum(g[i:j], np.linspace(1, 0.12, j - i))
        g[j:k] = np.minimum(g[j:k], np.linspace(0.12, 1, k - j))
    music *= g

    duck = 1 - 0.45 * smooth(speech, int(0.3 * SR))
    music /= max(1e-6, np.percentile(np.abs(music), 99.5))
    mix = music * duck * 0.42 + fx * 0.6
    mix = np.tanh(mix * 1.1) / 1.1
    (OUT / "sound").mkdir(parents=True, exist_ok=True)
    write(OUT / "sound/bed.wav", mix[: int(total * SR)])
    (OUT / "sound/cues.json").write_text(json.dumps([{"file": "yuk/sound/bed.wav", "from": 0, "to": tl["totalFrames"], "vol": 1.0}]))
    print("sound", round(total, 1), "s ·", " → ".join(f"{m}" for m, _, _ in spans))


if __name__ == "__main__":
    main()
