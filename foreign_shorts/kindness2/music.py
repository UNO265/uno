"""BGM: やさしい動物たち ②（明るく前向き）。G major, 100 BPM（1 拍 = 0.6 秒）。
  0–13.6 秒  ピアノの跳ねる刻み + ピチカート + 口笛風のメロディ（G-D-Em-C）
  13.67–16.67 秒 キリンのスロー: 刻みを止めて弦の持続音だけ（息をのむ）
  16.9 秒〜  「放っておけない」: G に解決、弦とグロッケンで明るく終わる（19.7 秒）
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 100, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [("G", [("G", 3), ("B", 3), ("D", 4)]), ("D", [("D", 3), ("F#", 3), ("A", 3)]),
      ("E", [("E", 3), ("G", 3), ("B", 3)]), ("C", [("C", 3), ("E", 3), ("G", 3)])]
MEL = [("B", 5), ("D", 6), ("B", 5), ("A", 5), ("G", 5), ("A", 5), ("B", 5), ("D", 5),
       ("E", 5), ("G", 5), ("E", 5), ("D", 5), ("C", 5), ("D", 5), ("E", 5), ("G", 5)]
bar_len = 4 * SPB  # 2.4 秒
t, k = 0.0, 0
while t < 13.6:
    bar = int(t / bar_len)
    root, tones = CH[bar % 4]
    beat = round((t % bar_len) / (SPB / 2))
    if beat % 2 == 0:
        note(1, m(root if root != "E" else "E", 2), t, 0.25, 70)
    for tn in tones:
        note(0, m(*tn), t, 0.2, 46 if beat % 2 else 54)
    if beat % 2 == 0 and t > 1.0:
        nm, o = MEL[k % len(MEL)]
        note(2, m(nm, o), t, SPB * 0.9, 64)
        k += 1
    t += SPB / 2
# スロー（13.67–16.67）: 弦の持続音
for tn in [("E", 3), ("G", 3), ("B", 3), ("E", 4)]:
    note(3, m(*tn), 13.67, 3.1, 50)
note(4, m("B", 6), 14.4, 0.8, 40)
# 解決（16.8〜）
for tn in [("G", 2), ("G", 3), ("B", 3), ("D", 4), ("G", 4)]:
    note(3, m(*tn), 16.8, 2.9, 58)
for j, tn in enumerate([("D", 4), ("G", 4), ("B", 4), ("D", 5)]):
    note(0, m(*tn), 16.8 + j * 0.08, 2.5, 50)
note(2, m("G", 5), 16.8, 1.5, 60)
for j, tn in enumerate([("D", 6), ("G", 6), ("B", 6), ("D", 7)]):
    note(4, m(*tn), 16.8 + j * 0.15, 1.2, 45)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 0), (1, 45), (2, 78), (3, 49), (4, 9)]:  # Piano / Pizz / Whistle / Strings / Glock
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=50))
tr.append(mido.Message("control_change", channel=2, control=7, value=80))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
