"""BGM: やさしい動物たち ③（感動・やさしい）。D major, 72 BPM（1 拍 ≈ 0.83 秒）。
ピアノのアルペジオ + チェロ/ストリングス、王道進行（G-A-F#m-Bm）。
  9.3–12.4 秒 犬のスロー: ピアノを止めて弦だけ
  21.75 秒〜 「小さな命は、みんなで守る」: D に解決して余韻（24.3 秒）
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 72, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [("G", [("G", 3), ("B", 3), ("D", 4), ("G", 4)]), ("A", [("A", 3), ("C#", 4), ("E", 4), ("A", 4)]),
      ("F#", [("F#", 3), ("A", 3), ("C#", 4), ("F#", 4)]), ("B", [("B", 3), ("D", 4), ("F#", 4), ("B", 4)])]
bar = 4 * SPB  # 3.33 秒
t = 0.0
while t < 21.6:
    b = int(t / bar)
    root, tones = CH[b % 4]
    k = int(round((t % bar) / (SPB / 2)))
    slow = 9.3 <= t < 12.4
    if k == 0:
        note(1, m(root, 2), t, bar, 52)          # チェロ
        for tn in tones[:3]:
            note(2, m(*tn), t, bar, 30 if t < 6.7 else 40)  # ストリングス
    if not slow:
        note(0, m(*tones[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]]), t, SPB * 1.5, 46)
    t += SPB / 2
MEL = [(6.9, ("F#", 5), 1.6), (8.6, ("E", 5), 0.8), (9.4, ("D", 5), 2.4),
       (14.7, ("D", 5), 1.2), (15.9, ("E", 5), 0.8), (16.7, ("F#", 5), 1.6), (18.4, ("A", 5), 1.6),
       (20.0, ("G", 5), 0.8), (20.8, ("F#", 5), 0.8)]
for s, nn, d in MEL:
    note(0, m(*nn), s, d, 58)
# 解決
end = 21.7
for tn in [("D", 2), ("D", 3)]:
    note(1, m(*tn), end, 2.6, 55)
for tn in [("F#", 3), ("A", 3), ("D", 4)]:
    note(2, m(*tn), end, 2.6, 48)
for j, tn in enumerate([("D", 4), ("F#", 4), ("A", 4), ("D", 5), ("F#", 5)]):
    note(0, m(*tn), end + j * 0.14, 2.4, 48)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 0), (1, 42), (2, 49)]:  # Piano / Cello / Slow Strings
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=75))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
