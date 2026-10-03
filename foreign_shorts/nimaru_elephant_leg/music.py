"""BGM: 失った前足、新しい一歩（ニマル版・感動ドキュメンタリー、ゾウの一人称）。A major, 76 BPM。24.8 秒。
  0–1.2 秒     フック: エレピの和音だけ（「このあと…」）→ 1.2 秒の白フラッシュでカリンバの「キラン」
  1.4–12.6 秒  準備（粉・くつした・義足をはめる）: ナイロンギターのアルペジオ（F#m-D-A-E）、静かに
  12.6–13.6 秒 無音の一拍（最初の一歩の直前、ユーザー決定）
  13.7 秒      「……一歩。」: カリンバの単音 1 つ → パッドが少しずつ広がる（0.7 倍スローの一歩）
  17.0 秒〜    「また歩ける」: ベース・ギター・カリンバの主旋律で一番大きく
  20.6 秒〜    「この足で、明日も。」: A の和音でやさしく終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 76, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


def arp(chord, t, bar, vel, until):
    for k in range(8):
        s = t + k * bar / 8
        if s < until:
            note(0, m(*chord[[0, 1, 2, 3, 2, 1, 2, 3][k]]) + 12, s, bar / 8 * 1.8, vel)


# フック
for tn in [("A", 3), ("C#", 4), ("E", 4)]:
    note(1, m(*tn), 0.0, 1.2, 38)
for j, nn in enumerate([("E", 5), ("A", 5), ("C#", 6)]):
    note(3, m(*nn), 1.2 + j * 0.05, 0.9, 56)
# 準備: 静かなアルペジオ（短調から始めて A へ）
PREP = [[("F#", 2), ("C#", 3), ("F#", 3), ("A", 3)], [("D", 2), ("A", 2), ("D", 3), ("F#", 3)],
        [("A", 2), ("E", 3), ("A", 3), ("C#", 4)], [("E", 2), ("B", 2), ("E", 3), ("G#", 3)]]
BAR = SPB * 4  # ≈ 3.16 秒
t, b = 1.4, 0
while t < 12.6:
    c = PREP[b % 4]
    arp(c, t, BAR, 42, 12.5)
    for tn in c[1:3]:
        note(1, m(*tn) + 12, t, min(BAR, 12.5 - t), 30)
    t += BAR
    b += 1
# 12.6–13.6 は無音
# 一歩: カリンバの単音 → パッドが広がる
note(3, m("E", 6), 13.7, 2.0, 70)
for tn in [("A", 3), ("C#", 4), ("E", 4)]:
    note(4, m(*tn), 14.4, 2.6, 36)
# また歩ける: いちばん大きく
WALK = [[("A", 2), ("E", 3), ("A", 3), ("C#", 4)], [("D", 2), ("A", 2), ("D", 3), ("F#", 3)]]
for i, c in enumerate(WALK):
    s = 17.0 + i * (BAR * 0.6)
    arp(c, s, BAR * 0.6, 56, 20.5)
    note(2, m(*c[0]), s, BAR * 0.6, 68)
    for tn in c[1:]:
        note(4, m(*tn) + 12, s, BAR * 0.6, 44)
for i, nn in enumerate([("C#", 6), ("E", 6), ("A", 6), ("F#", 6), ("E", 6)]):
    note(3, m(*nn), 17.0 + i * SPB * 0.75, SPB * 0.7, 64)
# 終わり
note(2, m("A", 1), 20.6, 4.2, 62)
for tn in [("A", 3), ("C#", 4), ("E", 4), ("A", 4)]:
    note(4, m(*tn), 20.6, 4.2, 42)
    note(1, m(*tn), 20.6, 4.2, 34)
for j, nn in enumerate([("A", 5), ("C#", 6), ("E", 6), ("A", 6)]):
    note(3, m(*nn), 20.7 + j * 0.16, 3.2, 56)

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
