"""BGM: だっこをせがむ子猫（かわいい・やさしい）。F major, 96 BPM（1 拍 = 0.625 秒）。11.2 秒。
  0–4.3 秒   オルゴールのメロディ + ピチカート（ほのぼの）
  4.3 秒     立ち上がる瞬間: グロッケンの上昇グリッサンド（ぴょこっ）
  4.3–9.5 秒 オルゴール続き（少し静かに）
  9.6 秒〜   「だっこ、して。」: ストリングスの F で温かく終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 96, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


MEL = [("C", 6), ("A", 5), ("F", 5), ("A", 5), ("G", 5), ("E", 5), ("C", 5), ("E", 5),
       ("F", 5), ("A", 5), ("C", 6), ("D", 6), ("C", 6), ("A#", 5), ("A", 5), ("G", 5)]
BASS = [("F", 2), ("C", 3), ("D", 2), ("A", 2), ("A#", 2), ("F", 2), ("C", 3), ("G", 2)]
t, k = 0.0, 0
while t < 9.4:
    vel = 64 if t < 4.3 else 54
    nm, o = MEL[k % len(MEL)]
    note(0, m(nm, o), t, SPB * 0.9, vel)
    if k % 2 == 0:
        bn, bo = BASS[(k // 2) % len(BASS)]
        note(1, m(bn, bo), t, 0.3, 60)
    t += SPB
    k += 1
# 立ち上がる瞬間
for j, nn in enumerate([("C", 5), ("E", 5), ("G", 5), ("C", 6), ("E", 6), ("G", 6), ("C", 7)]):
    note(2, m(*nn), 4.35 + j * 0.05, 0.4, 55)
# 終わり
for nn in [("F", 3), ("A", 3), ("C", 4), ("F", 4)]:
    note(3, m(*nn), 9.55, 1.7, 52)
note(0, m("F", 5), 9.55, 1.5, 60)
note(0, m("A", 5), 10.2, 1.0, 55)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 10), (1, 45), (2, 9), (3, 49)]:  # Music Box / Pizz / Glock / Strings
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=60))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
