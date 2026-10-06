"""BGM: わたしの妹はワンちゃんです（ニマル版・女の子の一人称、ダンスポップ）。D major, 120 BPM。19.4 秒。
原曲（ダンス曲と推定）は使わず、同じくらいのテンポで新しく作る。
  0–2.6 秒   紹介: クラップ + エレピの和音で軽く始まる
  2.6–5.1 秒 一緒に転がる: 4 つ打ちキック + フィンガーベース + カリンバの旋律が入る
  5.1–7.3 秒 逆立ち → 犬が飛ぶ（0.5 倍スロー）: ドラムを抜き、上がるスウィープ（numpy）→ 6.1 秒の着地でクラッシュ
  7.3–8.5 秒 もう一度飛ぶ: クラッシュ + フィル
  8.5–14.6 秒 ダンス・ごろん: いちばん賑やか（ギターの裏打ちも足す）。「毛が多いけど」の直前で一瞬止める
  14.6–19.4 秒 抱きつく・決めポーズ: 「自慢の妹です」の後、スチールドラム + カリンバの「ジャン♪」で終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 120, 480, 48000
SPB = 60 / BPM  # 0.5 秒
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
DR = 9
KICK, SNARE, CLAP, HAT, CRASH, TOM = 36, 38, 39, 42, 49, 45


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


CH = [[("D", 4), ("F#", 4), ("A", 4)], [("B", 3), ("D", 4), ("F#", 4)], [("G", 3), ("B", 3), ("D", 4)], [("A", 3), ("C#", 4), ("E", 4)]]
BS = [("D", 2), ("B", 1), ("G", 1), ("A", 1)]
MEL = [("F#", 5), ("A", 5), ("B", 5), ("A", 5), ("F#", 5), ("E", 5), ("D", 5), ("E", 5)]


def groove(t0, t1, busy):
    t, k = t0, 0
    while t < t1 - 0.01:
        bar = int((t - 0.0) / (SPB * 4)) % 4
        note(DR, KICK, t, 0.1, 80)
        if k % 2:
            note(DR, CLAP, t, 0.1, 64)
        note(DR, HAT, t + SPB / 2, 0.05, 44)
        note(1, m(*BS[bar]) + (12 if k % 2 else 0), t, SPB * 0.45, 82)
        if busy:
            for tn in CH[bar]:
                note(0, m(*tn), t + SPB / 2, 0.15, 48)
        note(3, m(*MEL[k % 8]), t, SPB * 0.8, 60 if busy else 54)
        t += SPB
        k += 1


# 紹介: クラップ + エレピ
for k in range(5):
    note(DR, CLAP, 0.2 + k * SPB, 0.1, 58)
for tn in CH[0]:
    note(2, m(*tn), 0.0, 2.5, 40)
groove(2.6, 5.1, False)
# 逆立ち → 飛ぶ: ドラムなし、6.1 秒で着地のクラッシュ
for tn in CH[3]:
    note(2, m(*tn), 5.1, 1.0, 38)
note(DR, CRASH, 6.1, 1.2, 96)
note(DR, KICK, 6.1, 0.1, 96)
for tn in CH[0]:
    note(2, m(*tn) + 12, 6.1, 1.2, 46)
# もう一度飛ぶ
for j in range(4):
    note(DR, TOM, 7.3 + j * 0.12, 0.1, 70 + j * 6)
note(DR, CRASH, 7.8, 1.0, 88)
groove(8.0, 11.3, True)
# 11.3–11.7 は一瞬止める（「……ちょっと、毛が多いけど」）
groove(11.8, 14.6, True)
# 抱きつく・決めポーズ（16.3 秒「自慢の妹です」）
groove(14.6, 17.9, False)
note(1, m("D", 2), 18.0, 1.4, 86)
note(DR, KICK, 18.0, 0.1, 96)
note(DR, CRASH, 18.0, 1.4, 80)
for j, nn in enumerate([("D", 5), ("F#", 5), ("A", 5), ("D", 6)]):
    note(4, m(*nn), 18.0 + j * 0.06, 1.3, 78)
    note(3, m(*nn) + 12, 18.0 + j * 0.06, 1.3, 62)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Muted Gt / Finger Bass / E.Piano / Kalimba / Steel Drums
for ch, prog in [(0, 28), (1, 33), (2, 4), (3, 108), (4, 114)]:
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
x = np.pad(x, ((0, max(0, int(20.0 * SR) - len(x))), (0, 0)))
# 飛ぶ前の上がるスウィープ（ノイズを高域へ）: 5.2 → 6.1 秒
rng = np.random.default_rng(3)
T = 0.9
n = int(T * SR)
tt = np.arange(n) / SR
noise = rng.standard_normal(n).astype(np.float32)
k = int(SR * 0.0015)
hp = noise - np.convolve(noise, np.ones(k) / k, "same")
sweep = hp * (tt / T) ** 2 * 0.25
a = int(5.2 * SR)
x[a:a + n] += sweep[:, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
