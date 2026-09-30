"""BGM: やさしい動物たち ①（ほのぼの・あたたかい）。F major, 84 BPM, I-iii-IV-V（F-Am-Bb-C）。
アコースティックギターのアルペジオ + フルートのメロディ + グロッケン（最後のきらめき）。15.6 秒。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 84, 480
SPB = 60 / BPM  # 1 拍の秒数
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, beat, beats, vel):
    t0 = int(beat * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(beats * TPB) - 20), 0, ch, n, 0))


CH = [[("F", 2), ("C", 3), ("F", 3), ("A", 3), ("C", 4)], [("A", 2), ("E", 3), ("A", 3), ("C", 4), ("E", 4)],
      [("A#", 2), ("F", 3), ("A#", 3), ("D", 4), ("F", 4)], [("C", 3), ("G", 3), ("C", 4), ("E", 4), ("G", 4)]]
bars = int(15.6 / (4 * SPB))  # 5 小節
for bar in range(bars):
    tones = CH[bar % 4]
    for k, idx in enumerate([0, 1, 2, 3, 4, 3, 2, 1]):
        note(0, m(*tones[idx]), bar * 4 + k * 0.5, 1.2, 50 if idx else 58)
MEL = [(1, ("A", 5), 1), (2, ("C", 6), 1), (3, ("A", 5), 1),
       (4, ("G", 5), 1.5), (5.5, ("E", 5), 0.5), (6, ("C", 5), 2),
       (8, ("D", 5), 1), (9, ("F", 5), 1), (10, ("A#", 5), 1), (11, ("A", 5), 1),
       (12, ("G", 5), 2), (14, ("E", 5), 1), (15, ("G", 5), 1)]
for beat, nn, d in MEL:
    note(1, m(*nn), beat, d, 62)
# 最後: F に解決してきらめき（「人間より、やさしいかも」）
end = bars * 4
note(0, m("F", 2), end, 3, 55)
for j, nn in enumerate([("F", 3), ("A", 3), ("C", 4), ("F", 4)]):
    note(0, m(*nn), end + j * 0.12, 3, 48)
note(1, m("F", 5), end, 3, 60)
for j, nn in enumerate([("C", 6), ("F", 6), ("A", 6), ("C", 7)]):
    note(2, m(*nn), end - 0.8 + j * 0.2, 1.5, 45)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 25), (1, 73), (2, 9)]:  # Steel Gt / Flute / Glockenspiel
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=60))
tr.append(mido.Message("control_change", channel=1, control=7, value=85))
last = 0
for t, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=t - last))
    last = t
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
