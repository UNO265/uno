"""BGM: ちょっと様子がおかしい動物たち（とぼけたコメディ）。C major, 104 BPM。21.3 秒。
ピチカートとバスーンの「とぼけた」刻み + マリンバの短い合いの手。動物の声を残すので控えめ。
場面の切り替わり（5.0 / 8.73 / 13.23 秒）でグロッケンの「ポン」。
18.0 秒（近すぎる）で一度止めて、19.8 秒に「チャン♪」で終わる。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 104, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


bass = [("C", 2), ("G", 2), ("A", 2), ("E", 2), ("F", 2), ("C", 3), ("G", 2), ("B", 1)]
chords = [[("E", 4), ("G", 4), ("C", 5)], [("C", 4), ("F", 4), ("A", 4)], [("D", 4), ("G", 4), ("B", 4)]]
t, k = 0.0, 0
while t < 17.9:
    nm, o = bass[k % len(bass)]
    note(0, m(nm, o), t, SPB * 0.4, 66)
    if k % 2 == 1:
        for tn in chords[(k // 4) % 3]:
            note(1, m(*tn), t, 0.12, 44)
    t += SPB
    k += 1
for s in (5.0, 8.73, 13.23):
    note(3, m("G", 6), s, 0.5, 60)
    note(3, m("C", 7), s + 0.1, 0.5, 55)
for s, nn in [(3.65, ("E", 5)), (3.9, ("D", 5)), (4.15, ("C", 5)), (7.25, ("G", 4)), (7.5, ("F#", 4)), (7.75, ("F", 4))]:
    note(2, m(*nn), s, 0.22, 62)
# オチ
note(0, m("G", 2), 19.75, 0.2, 80)
note(0, m("C", 2), 20.05, 0.4, 85)
for j, nn in enumerate([("C", 6), ("E", 6), ("G", 6)]):
    note(3, m(*nn), 20.05 + j * 0.06, 0.9, 64)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 70), (1, 45), (2, 12), (3, 9)]:  # Bassoon / Pizz / Marimba / Glock
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=40))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
