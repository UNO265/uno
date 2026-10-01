"""BGM: 子犬と子猫の本気のじゃれあい（スポーツ実況風のコメディ）。G major, 132 BPM。23.9 秒。
  0–3.7 秒   にらみ合い: ピチカートの「タッ、タッ」と弦のトレモロ（緊張）
  3.7 秒     試合開始: ゴングの音（numpy で合成）
  3.8–17 秒  取っ組み合い: ピアノの跳ねるリズム + ピチカート
  17.1 秒〜  逃げた → 探す: 音数を減らしたとぼけたクラリネット
  21.6 秒〜  「見失ってる」: グロッケンの「チャン♪」で終わる
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 132, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# にらみ合い
for k in range(7):
    note(1, m("D", 3), 0.2 + k * 0.5, 0.15, 60 + k * 4)
for tn in [("D", 4), ("A", 4)]:
    note(2, m(*tn), 0.0, 3.6, 40)
# 取っ組み合い
CH = [[("G", 3), ("B", 3), ("D", 4)], [("C", 4), ("E", 4), ("G", 4)], [("D", 4), ("F#", 4), ("A", 4)], [("G", 3), ("B", 3), ("D", 4)]]
BS = [("G", 2), ("C", 3), ("D", 3), ("G", 2)]
t, k = 3.85, 0
while t < 16.9:
    b = (k // 4) % 4
    if k % 2 == 0:
        note(1, m(*BS[b]) - (0 if k % 4 == 0 else -7), t, 0.18, 74)
    else:
        for tn in CH[b]:
            note(0, m(*tn), t, 0.15, 56)
    if k % 8 in (0, 3, 6):
        mel = [("B", 5), ("D", 6), ("G", 5), ("A", 5), ("B", 5), ("C", 6), ("D", 6), ("B", 5)][(k // 2) % 8]
        note(3, m(*mel), t, 0.2, 58)
    t += SPB / 2
    k += 1
# 逃げた → 探す
for s, nn in [(17.1, ("D", 6)), (17.25, ("B", 5)), (17.4, ("G", 5)), (17.55, ("D", 5))]:
    note(3, m(*nn), s, 0.12, 66)
for i, nn in enumerate([("G", 4), ("A", 4), ("B", 4), ("A", 4), ("G", 4), ("E", 4), ("D", 4)]):
    note(4, m(*nn), 18.4 + i * 0.45, 0.35, 58)
# オチ
note(1, m("D", 3), 21.55, 0.15, 80)
note(1, m("G", 2), 21.85, 0.3, 85)
for j, nn in enumerate([("G", 6), ("B", 6), ("D", 7)]):
    note(5, m(*nn), 21.85 + j * 0.07, 1.0, 64)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 0), (1, 45), (2, 44), (3, 13), (4, 71), (5, 9)]:  # Piano/Pizz/Tremolo/Xylo/Clarinet/Glock
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=40))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.75", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
# ゴング: 非整数倍音の減衰サイン
T = 2.2
tt = np.arange(int(T * SR)) / SR
gong = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, a, d in
           [(520, 0.5, 1.6), (1090, 0.3, 2.2), (1710, 0.18, 3.0), (2470, 0.1, 4.0)]) * 0.45
a = int(3.65 * SR)
x[a:a + len(gong)] += gong[:, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
