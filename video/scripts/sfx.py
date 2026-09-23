"""効果音を作って public/sfx/ に書き出す。

楽器音は FluidSynth + FluidR3_GM（MIT ライセンス）で生演奏風に鳴らし、
紙や空気の音だけを numpy でなめらかに合成する（ノイズ感・電子音は使わない）。
同じ役割の音は複数バリエーションを用意し、lib.tsx の Sfx が自動で使い分ける。
"""
import subprocess
import tempfile
import wave
from pathlib import Path

import mido
import numpy as np

SR = 48000
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(11)


def render(notes, program, sec, channel=0, reverb=40, gain=0.8):
    """notes: [(開始秒, MIDI ノート, ベロシティ, 長さ秒)] を 1 音色で鳴らす"""
    mid = mido.MidiFile(ticks_per_beat=480)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    tr.append(mido.MetaMessage("set_tempo", tempo=500000))
    tr.append(mido.Message("program_change", program=program, channel=channel, time=0))
    tr.append(mido.Message("control_change", control=91, value=reverb, channel=channel, time=0))
    ev = []
    for st, n, v, d in notes:
        ev.append((st, mido.Message("note_on", note=n, velocity=v, channel=channel)))
        ev.append((st + d, mido.Message("note_off", note=n, velocity=0, channel=channel)))
    ev.sort(key=lambda e: e[0])
    t = 0.0
    for st, m in ev:
        m.time = int(round((st - t) * 960))
        t = st
        tr.append(m)
    with tempfile.TemporaryDirectory() as d:
        mp, wp = Path(d) / "a.mid", Path(d) / "a.wav"
        mid.save(mp)
        subprocess.run(["fluidsynth", "-ni", "-g", str(gain), "-r", str(SR), "-F", str(wp), SF2, str(mp)], check=True, capture_output=True)
        with wave.open(str(wp)) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float64) / 32768
    n = int(sec * SR)
    x = x[:n] if len(x) >= n else np.pad(x, ((0, n - len(x)), (0, 0)))
    fade = np.minimum(1, (n - np.arange(n)) / (0.08 * SR))[:, None]
    return x * fade


def smooth_noise(sec, lo, hi):
    """帯域を絞った柔らかいノイズ（紙・空気用）。ざらつきが出ないよう高域を落とす"""
    n = int(sec * SR)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    shape = np.exp(-((np.log(np.maximum(f, 1)) - np.log(np.sqrt(lo * hi))) ** 2) / (2 * (np.log(hi / lo) / 2.5) ** 2))
    return np.fft.irfft(spec * shape, n)


def env(n, a, r, curve=2.0):
    t = np.arange(n) / SR
    return np.clip(t / a, 0, 1) ** 1.5 * np.clip((n / SR - t) / r, 0, 1) ** curve


def save(name, x, peak=0.7):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = x / (np.max(np.abs(x)) or 1) * peak
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


for old in OUT.glob("*.wav"):
    if old.stem != "bgm":
        old.unlink()

# 商品がかごに入る・カード登場: マリンバ（ペンタトニック 6 音）
for i, n in enumerate([72, 74, 76, 79, 81, 84]):
    save(f"tok{i}", render([(0, n, 58, 0.25)], 12, 0.6, reverb=30), 0.5)

# 吹き出し: ピチカート
for i, n in enumerate([67, 71, 74]):
    save(f"pop{i}", render([(0, n, 60, 0.2)], 45, 0.5, reverb=30), 0.45)

# 疑問: チェレスタ 2 音
save("question", render([(0, 76, 50, 0.3), (0.16, 83, 50, 0.6)], 8, 1.2), 0.4)

# 数字の決定・発見: ビブラフォン（2 種）
save("ding0", render([(0, 79, 52, 1.0)], 11, 1.8, reverb=60), 0.45)
save("ding1", render([(0, 84, 48, 1.0), (0, 76, 40, 1.0)], 11, 1.8, reverb=60), 0.45)

# 強調の低音: ティンパニ + ピアノ低音（柔らかく）
tim = render([(0, 41, 70, 1.5)], 47, 2.2, reverb=50)
pno = render([(0, 29, 50, 1.8)], 0, 2.2, reverb=50)
save("thud", tim + 0.6 * pno, 0.6)

# 木の軽い音: ウッドブロック（3 種）
for i, n in enumerate([76, 72, 79]):
    save(f"chip{i}", render([(0, n, 45, 0.1)], 115, 0.4, reverb=20), 0.35)

# スタンプ: 低いタム（2 種）
for i, n in enumerate([45, 43]):
    save(f"stamp{i}", render([(0, n, 70, 0.3)], 0, 0.8, channel=9, reverb=25), 0.5)

# コイン・お金の流れ: グロッケン（ごく小さく）
save("coin", render([(0, 88, 36, 0.3), (0.09, 91, 30, 0.3)], 9, 1.0, reverb=50), 0.3)

# 物流: 柔らかいホルン
save("horn", render([(0, 53, 55, 1.0), (0, 57, 45, 1.0)], 60, 1.6, reverb=50), 0.4)

# 転換: 空気が流れるような柔らかいスウェル（3 種、高域なし）
for i, sec in enumerate([0.6, 0.8, 0.5]):
    n = int(sec * SR)
    x = smooth_noise(sec, 180, 900) * env(n, sec * 0.55, sec * 0.45)
    save(f"whoosh{i}", np.stack([x, np.roll(x, 60)], axis=1), 0.25)

# 大きな転換: 逆再生ピアノ（2 種）
for i, chord in enumerate([[57, 64, 69, 72], [55, 62, 67, 71]]):
    x = render([(0, n, 55, 1.4) for n in chord], 0, 1.6, reverb=70)
    save(f"swell{i}", x[::-1] * env(len(x), 0.05, 0.08)[:, None], 0.4)

# 紙・資料（EVIDENCE / 資料カード）: 柔らかい紙のすべり音（3 種）
for i, sec in enumerate([0.35, 0.45, 0.3]):
    n = int(sec * SR)
    x = smooth_noise(sec, 700, 2600) * env(n, 0.03, sec * 0.8, 1.2)
    x *= 1 + 0.25 * np.sin(np.arange(n) / SR * 2 * np.pi * (18 + i * 4))
    save(f"paper{i}", np.stack([x, np.roll(x, 40)], axis=1), 0.2)

# KANENAZO ジングル: ピアノ + チェレスタ
pn = render([(0, 57, 60, 0.4), (0.18, 60, 58, 0.4), (0.36, 64, 58, 0.4), (0.54, 69, 62, 2.0), (0.54, 45, 50, 2.2), (0.54, 52, 45, 2.2)], 0, 3.2, reverb=70)
ce = render([(0.54, 81, 40, 1.5), (0.72, 88, 34, 1.2)], 8, 3.2, reverb=70)
save("jingle", pn + 0.7 * ce, 0.6)

print("sfx:", sorted(p.stem for p in OUT.glob("*.wav")))
