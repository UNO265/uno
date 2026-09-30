"""BGM: 王道進行（IV-V-iii-vi, D major）のやさしいピアノ + ストリングス, 76 BPM。
31.6–34.7 秒（男の子の「ごめんね」）は弦の持続音だけに落とし、34.7 秒で D に解決して余韻で終わる。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 76, 480
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(name, octv):
    return 12 * (octv + 1) + N[name]


CHORDS = {  # (root bass, arpeggio tones)
    "G": (m("G", 2), [m("G", 3), m("B", 3), m("D", 4), m("G", 4)]),
    "A": (m("A", 2), [m("A", 3), m("C#", 4), m("E", 4), m("A", 4)]),
    "F#m": (m("F#", 2), [m("F#", 3), m("A", 3), m("C#", 4), m("F#", 4)]),
    "Bm": (m("B", 2), [m("B", 3), m("D", 4), m("F#", 4), m("B", 4)]),
    "D": (m("D", 2), [m("D", 3), m("F#", 3), m("A", 3), m("D", 4)]),
}
PROG = ["G", "A", "F#m", "Bm"] * 2 + ["G", "A"]  # bars 0–9
# melody (bar, beat, note, beats) — bars 4–9
MEL = [
    (4, 0, ("D", 5), 2), (4, 2, ("B", 4), 1), (4, 3, ("A", 4), 1),
    (5, 0, ("C#", 5), 2), (5, 2, ("A", 4), 1), (5, 3, ("E", 5), 1),
    (6, 0, ("F#", 5), 3), (6, 3, ("E", 5), 1),
    (7, 0, ("D", 5), 2), (7, 2, ("C#", 5), 1), (7, 3, ("B", 4), 1),
    (8, 0, ("B", 4), 1), (8, 1, ("D", 5), 1), (8, 2, ("G", 5), 2),
    (9, 0, ("A", 5), 2), (9, 2, ("G", 5), 1), (9, 3, ("F#", 5), 1),
]

events = []  # (tick, type, ch, note, vel)


def note(ch, n, beat_abs, beats, vel):
    t0 = int(beat_abs * TPB)
    events.append((t0, 1, ch, n, vel))
    events.append((t0 + int(beats * TPB) - 10, 0, ch, n, 0))


for bar, name in enumerate(PROG):
    bass, arp = CHORDS[name]
    b0 = bar * 4
    soft = bar < 2
    vel = 38 if soft else 48
    note(0, bass, b0, 4, vel + 4)
    pattern = [0, 1, 2, 3, 2, 1, 2, 3] if not soft else [0, 2, 3, 2]
    step = 4 / len(pattern)
    for k, idx in enumerate(pattern):
        note(0, arp[idx], b0 + k * step, step * 1.6, vel - (6 if k % 2 else 0))
    if bar >= 2:  # strings pad
        for n in arp[:3]:
            note(1, n, b0, 4, 34 if bar < 5 else 46)
for bar, beat, (nm, o), beats in MEL:
    note(0, m(nm, o), bar * 4 + beat, beats, 62)

# bar 10: 弦の持続音だけ（ごめんね）
for n in (m("F#", 3), m("A", 3), m("C#", 4)):
    note(1, n, 40, 4, 26)
# bar 11+: D に解決して伸ばす
bass, arp = CHORDS["D"]
note(0, bass, 44, 6, 44)
for k, n in enumerate(arp + [m("F#", 4), m("A", 4)]):
    note(0, n, 44 + k * 0.25, 6 - k * 0.25, 44)
for n in arp[1:]:
    note(1, n, 44, 6, 36)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
tr.append(mido.Message("program_change", channel=0, program=0))   # Acoustic Grand
tr.append(mido.Message("program_change", channel=1, program=49))  # Slow Strings
tr.append(mido.Message("control_change", channel=0, control=91, value=70))  # reverb
tr.append(mido.Message("control_change", channel=1, control=91, value=90))
tr.append(mido.Message("control_change", channel=0, control=64, value=0))
last = 0
for t, typ, ch, n, v in sorted(events, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=t - last))
    last = t
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True,
               stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
