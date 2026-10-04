"""BGM: この手は反則でしょ（ニマル版・子猫の心の声、かわいいポップ）。C major, 100 BPM。11.2 秒。
  0–3.0 秒   ごはん中: ナイロンギターの軽い刻み + シェイカー
  3.0 秒     「（あ、来た）」: カリンバの上がるフレーズ
  4.3–6.0 秒 立ち上がる（0.6 倍スロー）: 上がるスライドホイッスル「ピュイ〜」
  6.3–8.4 秒 おねだり: エレピとカリンバの跳ねる旋律、フィンガーベース
  8.5 秒     「（……だめ？）」: いったん音を止める（間）
  10.1 秒    「（だっこ！）」: スチールドラム + カリンバの「キュン♪」で終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 100, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
SHAKER, KICK = 70, 36


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# ごはん中: ギターの刻み（C - Am）
for k in range(10):
    t = 0.2 + k * SPB / 2
    c = [("C", 4), ("E", 4), ("G", 4)] if k < 5 else [("A", 3), ("C", 4), ("E", 4)]
    if k % 2:
        for tn in c:
            note(0, m(*tn), t, 0.15, 50)
    note(DR, SHAKER, t, 0.05, 34)
# あ、来た
for j, nn in enumerate([("C", 6), ("E", 6), ("G", 6)]):
    note(3, m(*nn), 3.0 + j * 0.12, 0.3, 62)
# おねだり（F - G - C、跳ねる）
MEL = [("E", 6), ("G", 6), ("A", 6), ("G", 6), ("E", 6), ("D", 6), ("C", 6), ("D", 6)]
for i, nn in enumerate(MEL):
    s = 6.3 + i * SPB / 2
    note(3, m(*nn), s, SPB * 0.4, 64)
for s, c, bs in [(6.3, [("F", 4), ("A", 4), ("C", 5)], ("F", 2)), (7.5, [("G", 4), ("B", 4), ("D", 5)], ("G", 2))]:
    for tn in c:
        note(1, m(*tn), s, 1.1, 42)
    note(2, m(*bs), s, 1.1, 70)
    note(DR, KICK, s, 0.1, 50)
# 8.5–10.0 は間（音を止める）
# だっこ！
note(2, m("C", 2), 10.1, 1.1, 76)
for j, nn in enumerate([("C", 6), ("E", 6), ("G", 6), ("C", 7)]):
    note(4, m(*nn) - 12, 10.1 + j * 0.05, 1.1, 72)
    note(3, m(*nn), 10.1 + j * 0.05, 1.1, 62)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Nylon Gt / E.Piano / Finger Bass / Kalimba / Steel Drums
for ch, prog in [(0, 24), (1, 4), (2, 33), (3, 108), (4, 114)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=40))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(11.6 * SR) - len(x))), (0, 0)))
# 立ち上がる: 上がるスライドホイッスル（0.6 倍スローに合わせてゆっくり 500 → 1500 Hz）
T = 1.4
tt = np.arange(int(T * SR)) / SR
f = 500 * (1500 / 500) ** (tt / T) * (1 + 0.01 * np.sin(2 * np.pi * 6 * tt))
sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 0.05) * np.minimum(1, (T - tt) / 0.15) * 0.18
a = int(4.4 * SR)
x[a:a + len(sig)] += sig[:, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
