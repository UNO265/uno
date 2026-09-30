"""BGM: カニに挑む犬（動物ドキュメンタリーのパロディ）。D minor, 緊張 → 波 → オチ。8.9 秒。
  0–5.8 秒  コントラバスのピチカートで忍び足 + 弦のトレモロが少しずつ大きくなる（緊張）
  5.9 秒    飼い主にさわられて跳ぶ: ティンパニの一撃 + ブラスの和音 + 水しぶきの効果音（ノイズで合成）
  7.6 秒    「カニ、無事。」: ピチカートとグロッケンの「チャン♪」でオチ
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
TPB, SR = 480, 48000
BPM = 120  # 1 拍 = 0.5 秒（秒で書くため）
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec * 2 * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur * 2 * TPB) - 20), 0, ch, n, 0))


# 忍び足（コントラバス・ピチカート、半音で下がる）
walk = [("D", 2), ("C#", 2), ("D", 2), ("A#", 1), ("A", 1), ("A#", 1), ("A", 1), ("G#", 1)]
for k in range(11):
    nm, o = walk[k % len(walk)]
    note(0, m(nm, o), 0.15 + k * 0.5, 0.2, 70 + k * 2)
# 弦のトレモロ（だんだん強く）
for k in range(6):
    for tn in [("D", 4), ("F", 4), ("A", 4)]:
        note(1, m(*tn) + (1 if k >= 4 and tn[0] == "A" else 0), k * 0.95, 0.95, 30 + k * 12)
# 5.9 秒: ティンパニ + ブラス
note(2, m("D", 2), 5.9, 1.2, 100)
note(2, m("A", 1), 5.9, 1.2, 110)
for tn in [("D", 3), ("F", 3), ("A", 3), ("D", 4)]:
    note(3, m(*tn), 5.9, 1.4, 100)
# 7.6 秒: オチ
note(0, m("D", 3), 7.6, 0.2, 90)
note(0, m("A", 2), 7.85, 0.2, 90)
for j, tn in enumerate([("D", 6), ("F#", 6), ("A", 6)]):
    note(4, m(*tn), 7.6 + j * 0.08, 0.8, 70)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 45), (1, 44), (2, 47), (3, 61), (4, 9)]:  # Pizz / Tremolo Str / Timpani / Brass / Glock
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=45))
last = 0
for t, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=t - last))
    last = t
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)

with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(9.2 * SR) - len(x))), (0, 0)))
# 波: 5.6 秒から近づいて 5.95 秒で砕け、ゆっくり引く（低域を強めたノイズ）
rng = np.random.default_rng(1)
T = 3.0
n = int(T * SR)
noise = rng.standard_normal((n, 2)).astype(np.float32)
k = np.exp(-np.linspace(0, 6, 400))
k /= k.sum()
low = np.stack([np.convolve(noise[:, c], k, "same") for c in (0, 1)], 1) * 6
t = np.arange(n) / SR
envw = np.where(t < 0.35, (t / 0.35) ** 2, np.exp(-(t - 0.35) * 1.6))
surf = (0.55 * low + 0.18 * noise) * envw[:, None]
a = int(5.6 * SR)
x[a:a + n] += surf[: len(x) - a] * 0.55
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
