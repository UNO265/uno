"""BGM: 義足をつけたゾウの一歩（ニマル版・あたたかいアコースティック）。A major, 84 BPM。23.8 秒。
  0–1.2 秒    フック: エレピの和音だけ（「このあと…」）→ 1.2 秒の白フラッシュでカリンバの「キラン」
  1.4–13.3 秒 準備（粉・くつした・義足をはめる）: ナイロンギターのアルペジオ（A-E-F#m-D）、静かに
  13.6 秒〜   「あ、歩いた！」: パッドとフィンガーベースが入って広がる + カリンバの主旋律
  19.2 秒〜   「どこへでも行けるね」: A の和音でやさしく終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 84, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [[("A", 2), ("E", 3), ("A", 3), ("C#", 4)], [("E", 2), ("B", 2), ("E", 3), ("G#", 3)],
      [("F#", 2), ("C#", 3), ("F#", 3), ("A", 3)], [("D", 2), ("A", 2), ("D", 3), ("F#", 3)]]
# フック
for tn in [("A", 3), ("C#", 4), ("E", 4)]:
    note(1, m(*tn), 0.0, 1.2, 40)
for j, nn in enumerate([("E", 5), ("A", 5), ("C#", 6)]):
    note(3, m(*nn), 1.2 + j * 0.05, 0.9, 58)
# アルペジオ（1 小節 = 4 拍 ≈ 2.86 秒）
BAR = SPB * 4
t, b = 1.4, 0
while t < 19.1:
    c = CH[b % 4]
    lift = t >= 13.4
    for k in range(8):
        note(0, m(*c[[0, 1, 2, 3, 2, 1, 2, 3][k]]) + 12, t + k * SPB / 2, SPB * 0.9, 56 if lift else 46)
    if lift:
        note(2, m(*c[0]), t, BAR * 0.95, 66)
        for tn in c[1:]:
            note(4, m(*tn) + 12, t, BAR * 0.95, 42)
    t += BAR
    b += 1
# カリンバの主旋律（13.6 秒〜）
MEL = [("C#", 6), ("B", 5), ("A", 5), ("E", 5), ("F#", 5), ("A", 5), ("B", 5), ("C#", 6),
       ("E", 6), ("C#", 6), ("B", 5), ("A", 5)]
for i, nn in enumerate(MEL):
    s = 13.6 + i * SPB
    if s < 19.0:
        note(3, m(*nn), s, SPB * 0.95, 64)
# 終わり: A の和音
note(2, m("A", 1), 19.2, 4.6, 64)
for tn in [("A", 3), ("C#", 4), ("E", 4), ("A", 4)]:
    note(4, m(*tn), 19.2, 4.6, 44)
    note(1, m(*tn), 19.2, 4.6, 36)
for j, nn in enumerate([("A", 5), ("C#", 6), ("E", 6), ("A", 6)]):
    note(3, m(*nn), 19.2 + j * 0.14, 3.0, 58)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Nylon Gt / E.Piano / Finger Bass / Kalimba / Warm Pad
for ch, prog in [(0, 24), (1, 4), (2, 33), (3, 108), (4, 89)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=55))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav")
