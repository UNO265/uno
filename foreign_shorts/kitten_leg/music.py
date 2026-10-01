"""BGM: 足にしがみついて離れない子猫（コミカル）。F major, 112 BPM（1 拍 ≈ 0.536 秒）。13.7 秒。
バスーンの「とことこ」ベース + ピチカート + クラリネットの短いフレーズ。
  8.5–12.9 秒 引きずられる所（0.8 倍スロー）: テンポ感を落として、ずるずる下がる音型
  11.75 秒〜  「完全に、足の一部。」: 一度止めて、グロッケン＋ピチカートで「チャン♪」
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 112, 480
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# とことこ（0–8.5）
walk = [("F", 2), ("A", 2), ("C", 3), ("A", 2), ("A#", 2), ("D", 3), ("C", 3), ("A", 2)]
t, k = 0.0, 0
while t < 8.4:
    nm, o = walk[k % len(walk)]
    note(0, m(nm, o), t, SPB * 0.45, 72)
    if k % 2 == 1:
        for tn in [("F", 4), ("A", 4), ("C", 5)] if (k // 4) % 2 == 0 else [("A#", 3), ("D", 4), ("F", 4)]:
            note(1, m(*tn), t, 0.12, 48)
    t += SPB
    k += 1
for s, nn in [(2.0, ("C", 5)), (2.27, ("D", 5)), (2.54, ("F", 5)), (4.6, ("A", 5)), (4.87, ("G", 5)), (5.14, ("F", 5))]:
    note(2, m(*nn), s, 0.25, 64)
# ずるずる（8.5–11.7）: 半音で下がる
drag = [("C", 3), ("B", 2), ("A#", 2), ("A", 2), ("G#", 2), ("G", 2)]
for i, nn in enumerate(drag):
    note(0, m(*nn), 8.5 + i * 0.55, 0.5, 66)
    note(1, m(nn[0], 4), 8.5 + i * 0.55, 0.12, 40)
# オチ
note(0, m("C", 3), 11.75, 0.2, 80)
note(0, m("F", 2), 12.1, 0.3, 85)
for j, nn in enumerate([("F", 6), ("A", 6), ("C", 7)]):
    note(3, m(*nn), 12.1 + j * 0.07, 0.9, 64)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 70), (1, 45), (2, 71), (3, 9)]:  # Bassoon / Pizz / Clarinet / Glock
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=40))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
