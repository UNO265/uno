"""BGM: 足にしがみつく子猫が離れない（ニマル版・コミカルなポップバンド）。G major, 116 BPM。13.7 秒。
  0–8.5 秒    「とことこ」: ミュートギター + フィンガーベースの跳ねるリズム + 軽いドラム、カリンバの短いフレーズ
  8.5–12.9 秒 引きずられる所（0.8 倍スロー）: ドラムを抜き、ベースが半音ずつ「ずるずる」下がる + 下がるスライドホイッスル
  11.8 秒〜   「もう完全に、足の一部w」: いったん止めて、スチールドラム + カリンバの「チャン♪」
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 116, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
KICK, SNARE, HAT = 36, 38, 42


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# とことこ（G - C - D - G、1 小節ずつ）
BS = [("G", 2), ("C", 3), ("D", 3), ("G", 2)]
CH = [[("G", 3), ("B", 3), ("D", 4)], [("C", 4), ("E", 4), ("G", 4)], [("D", 4), ("F#", 4), ("A", 4)], [("G", 3), ("B", 3), ("D", 4)]]
t, k = 0.2, 0
while t < 8.4:
    b = (k // 8) % 4
    if k % 2 == 0:
        note(1, m(*BS[b]) + (7 if k % 4 == 2 else 0), t, SPB * 0.4, 80)
        note(DR, KICK if k % 4 == 0 else SNARE, t, 0.1, 62 if k % 4 == 0 else 50)
    else:
        for tn in CH[b]:
            note(0, m(*tn), t, 0.12, 54)
    note(DR, HAT, t, 0.05, 34)
    t += SPB / 2
    k += 1
# カリンバ: 「しがみついてる」「仲間まで来た」に合わせた短いフレーズ
for s0 in (2.0, 4.6):
    for j, nn in enumerate([("D", 6), ("B", 5), ("G", 5), ("B", 5), ("D", 6)]):
        note(2, m(*nn), s0 + j * SPB / 2, SPB * 0.4, 64)
# ずるずる: ベースが半音ずつ下がる
for j in range(8):
    note(1, m("G", 2) - j, 8.6 + j * 0.42, 0.38, 72)
# オチ
note(1, m("G", 2), 11.8, 1.5, 84)
note(DR, KICK, 11.8, 0.1, 90)
for j, nn in enumerate([("G", 5), ("B", 5), ("D", 6), ("G", 6)]):
    note(3, m(*nn), 11.8 + j * 0.06, 1.4, 76)
    note(2, m(*nn) + 12, 11.8 + j * 0.06, 1.4, 60)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Muted Gt / Finger Bass / Kalimba / Steel Drums
for ch, prog in [(0, 28), (1, 33), (2, 108), (3, 114)]:
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
# 下がるスライドホイッスル「ヒュ〜〜」（引きずられ始め、1.6 秒かけて 1300 → 350 Hz）
T = 1.6
tt = np.arange(int(T * SR)) / SR
f = 1300 * (350 / 1300) ** (tt / T) * (1 + 0.015 * np.sin(2 * np.pi * 5 * tt))
sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 0.03) * np.minimum(1, (T - tt) / 0.15) * 0.22
a = int(8.75 * SR)
x[a:a + len(sig)] += sig[: len(x) - a, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
