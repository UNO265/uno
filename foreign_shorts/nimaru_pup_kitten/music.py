"""BGM: 子犬と子猫の本気のじゃれあい（ニマル版・スポーツ実況風のポップバンド）。F major, 124 BPM。23.9 秒。
  0–3.7 秒   にらみ合い: キックの心音 + ミュートギターの刻み + スネアロールで盛り上げる（緊張）
  3.65 秒    試合開始: 審判のホイッスル（numpy で合成）
  3.8–17 秒  取っ組み合い: ドラム + フィンガーベース + ナイロンギターの裏打ち + カリンバの主旋律
  7.6 秒     子猫が上: クラッシュ + フィル / 13 秒「延長戦」からタンバリンで一段上げる
  17.1 秒    逃げた: スライドホイッスルの「ヒュ〜ン」（numpy）で全部止める
  18.3–21.5 秒  探す: エレピの和音にオカリナの「どこ？」フレーズ
  21.6 秒〜  「見失ってる」: スチールドラム + カリンバの「チャン♪」で終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 124, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9  # GM ドラム
KICK, SNARE, HAT, CRASH, TAMB = 36, 38, 42, 49, 54


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# にらみ合い: 心音キック + ミュートギター、最後にスネアロール
for k in range(4):
    note(DR, KICK, 0.15 + k * 0.85, 0.1, 70 + k * 6)
    note(DR, KICK, 0.35 + k * 0.85, 0.1, 55 + k * 6)
for k in range(12):
    note(2, m("C", 3), 0.15 + k * SPB / 2, 0.1, 48 + k * 2)
for k in range(10):
    note(DR, SNARE, 2.95 + k * 0.065, 0.05, 40 + k * 6)

# 取っ組み合い: F - Bb - C - F（2 小節ずつ）
CH = [[("F", 4), ("A", 4), ("C", 5)], [("A#", 3), ("D", 4), ("F", 4)], [("C", 4), ("E", 4), ("G", 4)], [("F", 4), ("A", 4), ("C", 5)]]
BS = [("F", 2), ("A#", 2), ("C", 3), ("F", 2)]
MEL = [("C", 6), ("A", 5), ("C", 6), ("D", 6), ("C", 6), ("A", 5), ("G", 5), ("F", 5),
       ("A#", 5), ("A", 5), ("G", 5), ("A", 5), ("C", 6), ("G", 5), ("A", 5), ("F", 5)]
t0, END = 3.85, 16.95
k = 0
t = t0
while t < END:
    beat = k // 2  # 8 分音符 k → 拍
    b = (beat // 8) % 4  # 2 小節で和音を変える
    eighth = k % 2
    if eighth == 0:
        note(DR, KICK if beat % 2 == 0 else SNARE, t, 0.1, 82 if beat % 2 == 0 else 72)
        note(1, m(*BS[b]) + (12 if beat % 4 == 3 else 0), t, SPB * 0.8, 84)
    else:
        for tn in CH[b]:
            note(0, m(*tn), t, 0.14, 58)
    note(DR, HAT, t, 0.05, 52 if eighth else 40)
    if t >= 13.0 and eighth:
        note(DR, TAMB, t, 0.05, 60)
    if eighth == 0 and beat % 2 == 0:
        note(3, m(*MEL[(beat // 2) % 16]), t, SPB * 1.6, 70)
    t += SPB / 2
    k += 1
# 子猫が上: フィル + クラッシュ
for j in range(4):
    note(DR, SNARE, 7.15 + j * 0.11, 0.05, 70 + j * 6)
note(DR, CRASH, 7.6, 1.0, 92)
note(DR, CRASH, 13.0, 1.0, 80)

# 探す: エレピ + オカリナ
for s, chord in [(18.3, [("F", 4), ("A", 4), ("C", 5)]), (19.85, [("D", 4), ("F", 4), ("A", 4)])]:
    for tn in chord:
        note(4, m(*tn), s, 1.5, 46)
for s, nn in [(18.4, ("C", 6)), (18.7, ("A", 5)), (19.0, ("C", 6)), (19.6, ("D", 6)), (19.9, ("C", 6)),
              (20.2, ("A", 5)), (20.8, ("G", 5)), (21.1, ("E", 5))]:
    note(5, m(*nn), s, 0.26, 62)

# オチ: キック + スチールドラム & カリンバの「チャン♪」
note(DR, KICK, 21.55, 0.1, 90)
note(1, m("F", 2), 21.6, 1.2, 80)
for j, nn in enumerate([("F", 5), ("A", 5), ("C", 6), ("F", 6)]):
    note(6, m(*nn), 21.6 + j * 0.06, 1.2, 74)
    note(3, m(*nn) + 12, 21.6 + j * 0.06, 1.2, 60)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Nylon Gt / Finger Bass / Muted Gt / Kalimba / E.Piano / Ocarina / Steel Drums
for ch, prog in [(0, 24), (1, 33), (2, 28), (3, 108), (4, 4), (5, 79), (6, 114)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=35))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768


def place(sig, at):
    a = int(at * SR)
    n = min(len(sig), len(x) - a)
    x[a:a + n] += sig[:n, None]


# 審判のホイッスル: 2.9 kHz の豆笛（トリル = 30 Hz の振幅・周波数ゆれ）を 2 回「ピッ、ピーッ」
def whistle(dur):
    tt = np.arange(int(dur * SR)) / SR
    f = 2900 + 60 * np.sin(2 * np.pi * 30 * tt)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.65 + 0.35 * np.sin(2 * np.pi * 30 * tt))
    env = np.minimum(1, tt / 0.01) * np.minimum(1, (dur - tt) / 0.04)
    return s * env * 0.22


place(whistle(0.12), 3.6)
place(whistle(0.45), 3.78)
# スライドホイッスル: 1500 → 400 Hz に下がる「ヒュ〜ン」
tt = np.arange(int(0.7 * SR)) / SR
f = 1500 * (400 / 1500) ** (tt / 0.7) * (1 + 0.012 * np.sin(2 * np.pi * 6 * tt))
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 0.02) * np.minimum(1, (0.7 - tt) / 0.1) * 0.25, 17.05)

y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
