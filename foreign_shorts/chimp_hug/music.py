"""BGM: 大好きな人に飛びつくチンパンジー（あたたかい感動）。C major, 80 BPM（1 拍 = 0.75 秒）。16.4 秒。
ピアノのアルペジオ（C-G-Am-F）+ ストリングス。11 秒（2 人目へのハグ）から弦を厚くして盛り上げ、C で終わる。
現場の歓声を残すので、BGM は控えめ。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 80, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [("C", [("C", 3), ("G", 3), ("C", 4), ("E", 4)]), ("G", [("G", 2), ("D", 3), ("G", 3), ("B", 3)]),
      ("A", [("A", 2), ("E", 3), ("A", 3), ("C", 4)]), ("F", [("F", 2), ("C", 3), ("F", 3), ("A", 3)])]
bar = 4 * SPB  # 3 秒
t = 0.0
while t < 15.0:
    b = int(t / bar)
    root, tones = CH[b % 4]
    k = int(round((t % bar) / (SPB / 2)))
    note(0, m(*tones[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]]), t, SPB, 44 if t < 11 else 52)
    if k == 0:
        for tn in tones[1:]:
            note(1, m(*tn) + 12, t, bar, 30 if t < 4.3 else (40 if t < 11 else 56))
    t += SPB / 2
MEL = [(4.3, ("E", 5), 1.5), (5.8, ("G", 5), 0.75), (6.55, ("E", 5), 0.75), (7.3, ("D", 5), 2.2),
       (11.2, ("E", 5), 0.75), (11.95, ("G", 5), 0.75), (12.7, ("C", 6), 1.5), (14.2, ("B", 5), 0.75), (14.95, ("G", 5), 0.75)]
for s, nn, d in MEL:
    note(0, m(*nn), s, d, 58)
for tn in [("C", 3), ("G", 3), ("C", 4), ("E", 4), ("G", 4)]:
    note(1, m(*tn), 15.0, 1.6, 55)
note(0, m("C", 6), 15.0, 1.4, 55)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 0), (1, 49)]:  # Piano / Slow Strings
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=70))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
