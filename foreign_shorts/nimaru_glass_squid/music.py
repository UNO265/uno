"""BGM: 顔に見えるけど全部イカです（ニマル版・宇宙人みたいな深海イカの心の声）。E minor, 72 BPM。21.5 秒。
原音は完全に無音。「宇宙からの交信」っぽい不思議さ → 最後に少しだけおどける。
  0–9 秒    交信: パッドの長い和音 + ソナー「ピーン」（numpy）+ カリンバの高いアルペジオ（ゆっくり）
  9–18 秒   正面の顔: エレピの和音が入り、フィンガーベースがゆっくり歩く
  18.4 秒〜 「……あの、見すぎです」: 一度止めて、スチールドラムの小さな「ポロン」で終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 72, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [[("E", 3), ("B", 3), ("G", 4)], [("C", 3), ("G", 3), ("E", 4)], [("A", 2), ("E", 3), ("C", 4)], [("B", 2), ("F#", 3), ("D#", 4)]]
BAR = SPB * 4  # ≈ 3.33 秒
# パッド（ずっと）
t, b = 0.0, 0
while t < 18.2:
    for tn in CH[b % 4]:
        note(4, m(*tn), t, min(BAR, 18.2 - t), 36)
    t += BAR
    b += 1
# カリンバの高いアルペジオ（交信）
ARP = [("B", 5), ("E", 6), ("G", 6), ("B", 6), ("G", 6), ("E", 6)]
t, k = 0.2, 0
while t < 9.0:
    note(3, m(*ARP[k % 6]), t, SPB * 0.45, 46)
    t += SPB / 2
    k += 1
# 正面の顔: エレピ + ベース
t, b = 9.0, 0
FACE = [CH[1], CH[2], CH[3]]
BS = [("C", 2), ("A", 1), ("B", 1)]
while t < 18.2:
    i = b % 3
    for tn in FACE[i]:
        note(1, m(*tn) + 12, t, min(BAR, 18.2 - t), 40)
    for j in range(4):
        s = t + j * SPB
        if s < 18.1:
            note(2, m(*BS[i]) + (7 if j % 2 else 0), s, SPB * 0.8, 60)
    t += BAR
    b += 1
for s, nn in [(9.4, ("E", 6)), (12.5, ("G", 6)), (15.5, ("B", 5))]:
    note(3, m(*nn), s, 1.2, 58)
# 18.2–18.6 は止める → 「見すぎです」のあとにポロン
for j, nn in enumerate([("E", 5), ("G", 5), ("B", 5), ("E", 6)]):
    note(5, m(*nn), 20.1 + j * 0.09, 1.2, 66)
note(2, m("E", 2), 20.1, 1.3, 64)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# E.Piano / Finger Bass / Kalimba / Warm Pad / Steel Drums
for ch, prog in [(1, 4), (2, 33), (3, 108), (4, 89), (5, 114)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=75))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(22.0 * SR) - len(x))), (0, 0)))


def ping(f0, dur):
    tt = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * f0 * tt) + 0.35 * np.sin(2 * np.pi * f0 * 1.5 * tt)) * np.exp(-tt * 2.0)
    e = np.zeros(len(s))
    for d, g in [(0.0, 1.0), (0.25, 0.4), (0.55, 0.18), (0.9, 0.08)]:
        k = int(d * SR)
        e[k:] += s[: len(s) - k] * g
    return e


for at, f0, g in [(0.1, 1250, 0.15), (3.6, 990, 0.1), (9.1, 1250, 0.12)]:
    p = ping(f0, 2.2)
    a = int(at * SR)
    n = min(len(p), len(x) - a)
    x[a:a + n] += p[:n, None] * g
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
