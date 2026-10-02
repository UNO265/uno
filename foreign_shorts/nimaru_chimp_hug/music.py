"""BGM: チンパンジーの全力ハグ（ニマル版・あたたかいアコースティックポップ）。D major, 96 BPM。17.6 秒。
  0–1.2 秒   フック: エレピの和音だけ（「このあと…」）→ 1.2 秒の白フラッシュでカリンバの「キラン」
  1.5–5.5 秒 走り出す: ナイロンギターのアルペジオ（D-A-Bm-G）
  5.5 秒〜   1 人目にハグ: フィンガーベースと軽いキック・シェイカーが入り、カリンバの主旋律
  10.5 秒〜  もう 1 人へ: エレピを足して厚くする
  13.6 秒〜  「みんな、大好きなんだね」: D で終わる（カリンバ + エレピの和音）
現場の歓声を残すので、BGM は控えめ（-g 0.6）。モフピタ版（ピアノ + 弦）とは楽器を変える。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 96, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
KICK, SHAKER = 36, 70


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [[("D", 3), ("A", 3), ("D", 4), ("F#", 4)], [("A", 2), ("E", 3), ("A", 3), ("C#", 4)],
      [("B", 2), ("F#", 3), ("B", 3), ("D", 4)], [("G", 2), ("D", 3), ("G", 3), ("B", 3)]]
# フック: エレピの和音
for tn in [("D", 4), ("F#", 4), ("A", 4)]:
    note(1, m(*tn), 0.0, 1.2, 40)
for j, nn in enumerate([("A", 5), ("D", 6), ("F#", 6)]):
    note(3, m(*nn), 1.2 + j * 0.05, 0.8, 60)
# ギターのアルペジオ（1 小節 = 2.5 秒、8 分音符）
BAR = SPB * 4
t, b = 1.5, 0
while t < 13.6:
    c = CH[b % 4]
    for k in range(8):
        note(0, m(*c[[0, 1, 2, 3, 2, 1, 2, 3][k]]), t + k * SPB / 2, SPB * 0.9, 52)
    if t >= 5.4:
        note(2, m(*c[0]) - 12 if c[0][1] >= 3 else m(*c[0]), t, BAR * 0.9, 70)
        for k in range(4):
            note(DR, KICK if k % 2 == 0 else SHAKER, t + k * SPB, 0.1, 55 if k % 2 == 0 else 40)
    if t >= 10.4:
        for tn in c[1:]:
            note(1, m(*tn) + 12, t, BAR * 0.9, 36)
    t += BAR
    b += 1
# カリンバの主旋律（5.5 秒〜）
MEL = [("F#", 5), ("A", 5), ("B", 5), ("A", 5), ("F#", 5), ("E", 5), ("D", 5), ("E", 5),
       ("F#", 5), ("A", 5), ("D", 6), ("C#", 6), ("B", 5), ("A", 5), ("F#", 5), ("A", 5)]
for i, nn in enumerate(MEL):
    s = 5.5 + i * SPB
    if s < 13.5:
        note(3, m(*nn), s, SPB * 0.9, 62)
# 終わり: D の和音
note(2, m("D", 2), 13.6, 3.6, 66)
for tn in [("D", 4), ("F#", 4), ("A", 4), ("D", 5)]:
    note(1, m(*tn), 13.6, 3.6, 44)
for j, nn in enumerate([("D", 5), ("F#", 5), ("A", 5), ("D", 6)]):
    note(3, m(*nn), 13.6 + j * 0.12, 2.5, 60)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Nylon Gt / E.Piano / Finger Bass / Kalimba
for ch, prog in [(0, 24), (1, 4), (2, 33), (3, 108)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=50))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.6", "-r", str(SR), "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav")
