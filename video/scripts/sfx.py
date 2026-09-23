"""効果音と BGM を numpy で合成して public/sfx/ に書き出す（外部素材なし）。"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, attack=0.005, release=None, decay=None):
    x = np.arange(n) / SR
    a = np.clip(x / attack, 0, 1)
    if decay is not None:
        return a * np.exp(-x / decay)
    r = np.clip((n / SR - x) / (release or 0.05), 0, 1)
    return a * r


def noise(sec):
    return rng.uniform(-1, 1, int(sec * SR))


def lowpass(x, alpha):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def sweep_lowpass(x, a0, a1):
    y = np.empty_like(x)
    acc = 0.0
    alphas = np.linspace(a0, a1, len(x))
    for i, v in enumerate(x):
        acc += alphas[i] * (v - acc)
        y[i] = acc
    return y


def save(name, x, gain=0.8, stereo_width=0.0):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * gain
    left = x
    right = np.roll(x, int(stereo_width * SR)) if stereo_width else x
    data = (np.stack([left, right], axis=1) * 32767).astype(np.int16)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def pluck(freq, sec=0.35, decay=0.08, harm=(1, 0.35, 0.12)):
    tt = t(sec)
    s = sum(a * np.sin(2 * np.pi * freq * (i + 1) * tt) for i, a in enumerate(harm))
    return s * env(len(tt), 0.002, decay=decay)


# 「톡」: 木琴風。音程違いを 6 個
for i, semi in enumerate([0, 2, 4, 7, 9, 12]):
    f = 660 * 2 ** (semi / 12)
    save(f"tok{i}", pluck(f, 0.3, 0.06, (1, 0.5, 0.1)), 0.55)

# 「팝」: 吹き出し
tt = t(0.18)
f = np.linspace(300, 900, len(tt))
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, decay=0.04), 0.6)

# 「?」: 2 音上昇
save("question", np.concatenate([pluck(784, 0.14, 0.06), pluck(1175, 0.4, 0.12)]), 0.5)

# 「삑」: レジのスキャン音
tt = t(0.09)
save("beep", np.sign(np.sin(2 * np.pi * 2350 * tt)) * 0.3 * env(len(tt), 0.002, 0.01), 0.3)

# 「딩」: 完了
tt = t(1.4)
ding = sum(a * np.sin(2 * np.pi * 1318 * r * tt) for a, r in [(1, 1), (0.4, 2.76), (0.2, 5.4)])
save("ding", ding * env(len(tt), 0.002, decay=0.35), 0.5)

# 「둥」「쿵」: 低音の衝撃
tt = t(1.6)
f = 90 * np.exp(-tt * 2.5) + 38
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.003, decay=0.45)
boom += lowpass(noise(1.6), 0.02) * env(len(tt), 0.001, decay=0.05) * 3
save("thud", boom, 0.95)

# 「슉」「휙」: 風切り
n = noise(0.55)
w = sweep_lowpass(n, 0.02, 0.35) * np.sin(np.linspace(0, np.pi, len(n))) ** 2
save("whoosh", w, 0.5, stereo_width=0.004)

# 自動ドア: モーター音 + 空気
tt = t(1.3)
motor = np.sin(2 * np.pi * (180 + 40 * tt) * tt) * 0.25 + lowpass(noise(1.3), 0.08)
save("door", motor * np.sin(np.linspace(0, np.pi, len(tt))) ** 1.5, 0.35)

# 店内の空気感（ループ用）
amb = lowpass(noise(8.0), 0.03)
chime = np.zeros_like(amb)
for st, fr in [(1.0, 1568), (1.25, 1318), (1.5, 1046)]:
    seg = pluck(fr, 1.2, 0.4)
    i = int(st * SR)
    chime[i:i + len(seg)] += seg * 0.15
save("ambience", amb * 0.6 + chime, 0.18, stereo_width=0.01)

# コインが転がる
tt = t(2.2)
roll = lowpass(noise(2.2), 0.25) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * tt) ** 2)
roll += 0.3 * np.sin(2 * np.pi * 3200 * tt) * (np.sin(2 * np.pi * 5 * tt) > 0.97)
save("roll", roll * env(len(tt), 0.05, 0.3), 0.35)

# 「칙」: 欠ける
tt = t(0.12)
chip = noise(0.12) * env(len(tt), 0.001, decay=0.02) + 0.5 * np.sin(2 * np.pi * 2800 * tt) * env(len(tt), 0.001, decay=0.015)
save("chip", chip, 0.45)

# 汽笛
tt = t(1.4)
horn = sum(np.sin(2 * np.pi * f0 * k * tt) / k for f0 in (110, 138.6) for k in range(1, 6))
save("horn", horn * env(len(tt), 0.12, 0.35), 0.35)

# トラック
tt = t(2.0)
truck = lowpass(noise(2.0), 0.04) + 0.4 * np.sin(2 * np.pi * 45 * tt) * (1 + 0.3 * np.sin(2 * np.pi * 7 * tt))
save("truck", truck * np.sin(np.linspace(0, np.pi, len(tt))), 0.4, stereo_width=0.006)

# 「탁」: スタンプ
tt = t(0.35)
stamp = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-tt * 18) + 60) / SR) * env(len(tt), 0.001, decay=0.07)
stamp += noise(0.35) * env(len(tt), 0.0005, decay=0.008) * 0.8
save("stamp", stamp, 0.8)

# タイプ音
tt = t(0.06)
save("type", noise(0.06) * env(len(tt), 0.0005, decay=0.006) + 0.3 * np.sin(2 * np.pi * 1800 * tt) * env(len(tt), 0.0005, decay=0.004), 0.35)

# シリーズジングル（カネナゾ）
notes = [(0.0, 523.3), (0.14, 659.3), (0.28, 784.0), (0.42, 1046.5)]
jingle = np.zeros(int(3.2 * SR))
for st, fr in notes:
    seg = pluck(fr, 1.5, 0.5, (1, 0.3, 0.1))
    i = int(st * SR)
    jingle[i:i + len(seg)] += seg
tt = t(3.2)
pad = sum(np.sin(2 * np.pi * fr * tt) for fr in (261.6, 329.6, 392.0, 523.3)) * env(len(tt), 0.5, decay=1.0) * 0.25
jingle[: len(pad)] += pad
save("jingle", jingle, 0.6, stereo_width=0.008)

# BGM: 76BPM の穏やかなパッド + アルペジオ（8 小節ループ）
bpm = 76
beat = 60 / bpm
chords = [
    (174.6, 220.0, 261.6, 329.6),  # Fmaj7
    (164.8, 196.0, 246.9, 293.7),  # Em7
    (146.8, 174.6, 220.0, 261.6),  # Dm7
    (130.8, 164.8, 196.0, 246.9),  # Cmaj7
]
bar = beat * 4
total = bar * 8
bgm = np.zeros(int(total * SR))
for b in range(8):
    ch = chords[(b // 2) % 4]
    start = int(b * bar * SR)
    tt = t(bar)
    pad = sum(np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.001 * tt) for f in ch)
    pad *= np.clip(tt / 0.4, 0, 1) * np.clip((bar - tt) / 0.4, 0, 1) * 0.12
    bgm[start:start + len(pad)] += pad
    for k in range(8):
        f = ch[k % 4] * 2
        seg = pluck(f, 0.9, 0.25, (1, 0.2))
        i = start + int(k * beat / 2 * SR)
        bgm[i:i + len(seg)] += seg[: len(bgm) - i] * 0.18
bgm = lowpass(bgm, 0.25)
save("bgm", bgm, 0.5, stereo_width=0.012)

print("sfx:", sorted(p.stem for p in OUT.glob("*.wav")))
