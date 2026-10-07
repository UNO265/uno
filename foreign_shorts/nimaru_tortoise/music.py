"""BGM: リクガメ社員のゆるい1日（ニマル版・密着ドキュメンタリーのパロディ）。A minor → C major, 92 BPM。24.1 秒。
まじめな密着番組風に始めて、最後の「退勤後の姿が、こちら」で一気にくずす。
  0–20.2 秒  密着: エレピの静かな和音（Am-F-C-G）+ パッド + フィンガーベース、ハイハットの「チッ、チッ」で時間が進む感じ
             クリップの切り替わり（3 秒ごと）にカリンバの単音で区切り
  20.2 秒〜  「退勤後の姿が……」: いったん全部止める
  21.6 秒〜  「こちら」→ 恐竜: 上がるスライドホイッスル + スチールドラム・カリンバの陽気なフレーズで終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 92, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
HAT, KICK, CRASH = 42, 36, 49


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [[("A", 3), ("C", 4), ("E", 4)], [("F", 3), ("A", 3), ("C", 4)], [("C", 4), ("E", 4), ("G", 4)], [("G", 3), ("B", 3), ("D", 4)]]
BS = [("A", 1), ("F", 1), ("C", 2), ("G", 1)]
BAR = SPB * 4
t, b = 0.0, 0
while t < 20.1:
    c = CH[b % 4]
    d = min(BAR, 20.1 - t)
    for tn in c:
        note(1, m(*tn), t, d, 40)
        note(4, m(*tn) + 12, t, d, 30)
    note(2, m(*BS[b % 4]), t, d * 0.9, 64)
    t += BAR
    b += 1
# 時計のようなハイハット
t = 0.0
while t < 20.1:
    note(DR, HAT, t, 0.05, 40)
    t += SPB
# クリップの切り替わりにカリンバの単音
for s, nn in zip([3.2, 6.2, 9.2, 12.2, 15.4, 18.1], [("E", 6), ("C", 6), ("A", 5), ("E", 6), ("G", 6), ("C", 6)]):
    note(3, m(*nn), s, 0.8, 58)
# 20.2–21.5 は無音（「退勤後の姿が……」）
# こちら → 恐竜: 陽気に
note(DR, CRASH, 21.6, 1.5, 90)
note(DR, KICK, 21.6, 0.1, 96)
note(2, m("C", 2), 21.6, 0.4, 84)
for i, nn in enumerate([("C", 6), ("E", 6), ("G", 6), ("E", 6), ("C", 6), ("G", 5), ("C", 6), ("E", 6)]):
    s = 21.6 + i * SPB / 2
    note(0, m(*nn) - 12, s, SPB * 0.45, 72)
    note(DR, KICK if i % 2 == 0 else 38, s, 0.1, 70)
note(2, m("C", 2), 23.3, 0.8, 84)
for j, nn in enumerate([("C", 5), ("E", 5), ("G", 5), ("C", 6)]):
    note(0, m(*nn), 23.3 + j * 0.05, 0.8, 76)
    note(3, m(*nn) + 12, 23.3 + j * 0.05, 0.8, 62)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Steel Drums / E.Piano / Finger Bass / Kalimba / Warm Pad
for ch, prog in [(0, 114), (1, 4), (2, 33), (3, 108), (4, 89)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=45))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(25.0 * SR) - len(x))), (0, 0)))
# 「こちら」で上がるスライドホイッスル（450 → 1700 Hz）
T = 0.45
tt = np.arange(int(T * SR)) / SR
f = 450 * (1700 / 450) ** (tt / T)
sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 0.02) * np.minimum(1, (T - tt) / 0.06) * 0.22
a = int(21.15 * SR)
x[a:a + len(sig)] += sig[:, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
