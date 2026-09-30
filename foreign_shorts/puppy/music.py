"""BGM: もふもふ子犬（コミカル）。C major, 120 BPM（1 拍 = 0.5 秒）。
  0–2.3 秒   「これ何？」: ピチカートの忍び足（半音で上がる）
  2.3–13.5 秒 本編: ピチカートのベース + シロフォンの跳ねるメロディ（C-Am-F-G）
  4.2 秒     運転失敗: 一瞬止めて「ボヨン」（効果音は numpy で合成して重ねる）
  13.57 秒〜 「ぜんぶ許せる」: グロッケンのきらめき + ストリングスの C で余韻（15.9 秒まで）
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 120, 480, 48000
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(name, o):
    return 12 * (o + 1) + N[name]


ev = []


def note(ch, n, sec, dur, vel):  # 秒で指定（120 BPM: 1 秒 = 2 拍）
    t0 = int(sec * 2 * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur * 2 * TPB) - 20), 0, ch, n, 0))


# 忍び足（0–2.3）
for k, (nm, o) in enumerate([("C", 3), ("C#", 3), ("D", 3), ("D#", 3), ("E", 3), ("F", 3), ("F#", 3), ("G", 3)]):
    note(1, m(nm, o), 0.1 + k * 0.27, 0.15, 64)
note(2, m("G", 5), 2.15, 0.12, 60)

# 本編（2.3–13.5）、4.2–5.1 は止める
CH = [("C", [("C", 3), ("E", 3), ("G", 3)]), ("A", [("A", 2), ("C", 3), ("E", 3)]),
      ("F", [("F", 2), ("A", 2), ("C", 3)]), ("G", [("G", 2), ("B", 2), ("D", 3)])]
MEL = [("E", 5), ("G", 5), ("A", 5), ("G", 5), ("E", 5), ("C", 5), ("D", 5), ("E", 5),
       ("C", 5), ("E", 5), ("F", 5), ("A", 5), ("G", 5), ("F", 5), ("E", 5), ("D", 5)]
t, k = 2.3, 0
while t < 13.5:
    if 4.15 <= t < 5.15:
        t += 0.25
        continue
    beat = int(round((t - 2.3) / 0.25))
    root, tones = CH[(beat // 8) % 4]
    if beat % 2 == 0:  # ベース（表拍）
        note(1, m(*tones[0]) - 12 if beat % 4 == 0 else m(*tones[2]) - 12, t, 0.2, 76)
    if beat % 2 == 1:  # 和音の刻み（裏拍）
        for tn in tones:
            note(1, m(*tn) + 12, t, 0.12, 50)
    if beat % 2 == 0:  # シロフォン
        nm, o = MEL[k % len(MEL)]
        note(2, m(nm, o), t, 0.2, 72)
        k += 1
    t += 0.25
# 「ボヨン」の前の一撃
for tn in [("C", 3), ("E", 3), ("G", 3), ("C", 4)]:
    note(1, m(*tn), 4.05, 0.15, 90)

# 余韻（13.57–15.9）
for j, nn in enumerate([("C", 6), ("E", 6), ("G", 6), ("C", 7), ("G", 6), ("E", 6)]):
    note(3, m(*nn), 13.57 + j * 0.09, 0.8, 58)
for tn in [("C", 4), ("E", 4), ("G", 4)]:
    note(4, m(*tn), 13.57, 2.2, 55)
note(1, m("C", 2), 13.57, 1.0, 70)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(1, 45), (2, 13), (3, 9), (4, 48)]:  # Pizzicato / Xylophone / Glockenspiel / Strings
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=40))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)

# 「ボヨン」: 周波数が揺れながら下がるサイン波
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
T = 0.55
tt = np.arange(int(T * SR)) / SR
freq = 420 * np.exp(-tt * 2.2) * (1 + 0.18 * np.sin(2 * np.pi * 14 * tt))
boing = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 5) * 0.5
a = int(4.2 * SR)
x[a:a + len(boing)] += boing[:, None]
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
