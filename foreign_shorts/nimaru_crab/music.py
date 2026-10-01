"""BGM: 小さなカニに本気で挑む犬（ニマル版・ドキュメンタリーのパロディをポップバンドで）。A minor → C major。8.9 秒。
  0–5.8 秒  ミュートギターの忍び足 + キックの心音がだんだん速く・大きく + エレピの不穏な和音（緊張）
  5.9 秒    飼い主にさわられて跳ぶ: クラッシュ + スネアの一撃 + 上がるスライドホイッスル + 水しぶき（numpy で合成）
  7.6 秒    「カニ、無事。」: ベース + スチールドラム & カリンバの「チャン♪」
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
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
KICK, SNARE, CRASH = 36, 38, 49


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# 忍び足: ミュートギター「ト、ト、ト」（A → C → B → E と半音ずつにじり寄る）
walk = [("A", 2), ("C", 3), ("B", 2), ("E", 3)]
for k in range(22):
    note(0, m(*walk[(k // 2) % 4]), 0.15 + k * 0.25, 0.12, 50 + k)
# 心音キック: 間隔が詰まり、音が大きくなる
t, gap, k = 0.3, 0.9, 0
while t < 5.7:
    note(DR, KICK, t, 0.1, min(100, 58 + k * 5))
    note(DR, KICK, t + 0.18, 0.1, min(90, 45 + k * 5))
    t += gap
    gap = max(0.42, gap * 0.86)
    k += 1
# 不穏なエレピ（Am → F → E）
for s, chord in [(0.1, [("A", 3), ("C", 4), ("E", 4)]), (2.1, [("F", 3), ("A", 3), ("C", 4)]),
                 (4.1, [("E", 3), ("G#", 3), ("B", 3)])]:
    for tn in chord:
        note(1, m(*tn), s, 1.9, 40)
# 跳ぶ
note(DR, CRASH, 5.9, 1.5, 100)
note(DR, SNARE, 5.9, 0.1, 100)
note(DR, KICK, 5.9, 0.1, 100)
# オチ
note(2, m("C", 2), 7.6, 1.2, 82)
note(DR, KICK, 7.6, 0.1, 90)
for j, nn in enumerate([("C", 5), ("E", 5), ("G", 5), ("C", 6)]):
    note(3, m(*nn), 7.6 + j * 0.06, 1.2, 76)
    note(4, m(*nn) + 12, 7.6 + j * 0.06, 1.2, 62)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Muted Gt / E.Piano / Finger Bass / Steel Drums / Kalimba
for ch, prog in [(0, 28), (1, 4), (2, 33), (3, 114), (4, 108)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=35))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.75", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(9.2 * SR) - len(x))), (0, 0)))


def place(sig, at, gain):
    a = int(at * SR)
    n = min(len(sig), len(x) - a)
    x[a:a + n] += (sig[:n] if sig.ndim == 2 else sig[:n, None]) * gain


# 上がるスライドホイッスル「ピュイッ！」（400 → 1800 Hz、びっくり）
tt = np.arange(int(0.35 * SR)) / SR
f = 400 * (1800 / 400) ** (tt / 0.35)
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 0.01) * np.minimum(1, (0.35 - tt) / 0.05), 5.88, 0.25)
# 水しぶき: 低域を強めたノイズが 5.95 秒で砕けてゆっくり引く
rng = np.random.default_rng(1)
n = int(3.0 * SR)
noise = rng.standard_normal((n, 2)).astype(np.float32)
k = np.exp(-np.linspace(0, 6, 400))
k /= k.sum()
low = np.stack([np.convolve(noise[:, c], k, "same") for c in (0, 1)], 1) * 6
t = np.arange(n) / SR
envw = np.where(t < 0.35, (t / 0.35) ** 2, np.exp(-(t - 0.35) * 1.6))
place((0.55 * low + 0.18 * noise) * envw[:, None], 5.6, 0.5)

y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
