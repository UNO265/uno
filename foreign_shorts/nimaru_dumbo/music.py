"""BGM: 深海で見つけた謎の丸いやつ（ニマル版・深海のふしぎ → かわいい）。D minor → F major, 78 BPM。21.2 秒。
原音は完全に無音なので、水中の気配は全部こちらで作る。
  0–3.2 秒   深海: パッドの低い和音 + ソナーの「ピーン」（numpy）+ 気泡のノイズ。まだ正体がわからない
  3.2–6.9 秒 砂の上へ: エレピが静かに入る。カリンバの点々で「なんだろう？」
  6.9 秒     「……え、タコ！？」: 正体あかし。F メジャーへ転調、カリンバの明るいフレーズ
  8.9–16 秒  かわいいパート: ナイロンギターの軽いアルペジオ + フィンガーベース
  16.7 秒〜  「ヒレで泳いでる」: パッドを広げて深海らしく
  19.3 秒〜  「深海、すごい。」: スチールドラム + カリンバで静かに締める
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys, wave
from pathlib import Path
import mido
import numpy as np

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB, SR = 78, 480, 48000
SPB = 60 / BPM
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(nm, o):
    return 12 * (o + 1) + N[nm]


ev = []


def note(ch, n, sec, dur, vel):
    t0 = int(sec / SPB * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(dur / SPB * TPB) - 20), 0, ch, n, 0))


# 深海（Dm）: 低いパッド
for tn in [("D", 2), ("A", 2), ("D", 3), ("F", 3)]:
    note(4, m(*tn), 0.0, 6.9, 38)
# 砂の上へ: エレピ + カリンバの点々
for s, chord in [(3.2, [("D", 4), ("F", 4), ("A", 4)]), (5.2, [("A#", 3), ("D", 4), ("F", 4)])]:
    for tn in chord:
        note(1, m(*tn), s, 1.8, 34)
for s, nn in [(3.4, ("A", 5)), (4.2, ("F", 5)), (5.4, ("D", 5)), (6.2, ("F", 5))]:
    note(3, m(*nn), s, 0.8, 52)
# 正体あかし（F メジャーへ）
for tn in [("F", 2), ("C", 3), ("F", 3), ("A", 3)]:
    note(4, m(*tn), 6.9, 3.0, 44)
for j, nn in enumerate([("F", 5), ("A", 5), ("C", 6), ("F", 6)]):
    note(3, m(*nn), 6.9 + j * 0.1, 1.6, 66)
# かわいいパート: ギターのアルペジオ + ベース
CH = [[("F", 3), ("C", 4), ("F", 4), ("A", 4)], [("A#", 2), ("F", 3), ("A#", 3), ("D", 4)],
      [("C", 3), ("G", 3), ("C", 4), ("E", 4)], [("F", 3), ("C", 4), ("F", 4), ("A", 4)]]
BS = [("F", 1), ("A#", 1), ("C", 2), ("F", 1)]
BAR = SPB * 4
t, b = 8.9, 0
while t < 16.6:
    c = CH[b % 4]
    for k in range(8):
        s = t + k * BAR / 8
        if s < 16.5:
            note(0, m(*c[[0, 1, 2, 3, 2, 1, 2, 3][k]]) + 12, s, BAR / 8 * 1.7, 48)
    note(2, m(*BS[b % 4]), t, min(BAR, 16.5 - t) * 0.95, 62)
    t += BAR
    b += 1
MEL = [("C", 6), ("A", 5), ("F", 5), ("A", 5), ("C", 6), ("D", 6), ("C", 6), ("A", 5)]
for i, nn in enumerate(MEL):
    s = 8.9 + i * SPB
    if s < 16.4:
        note(3, m(*nn), s, SPB * 0.9, 58)
# ヒレで泳いでる: パッドを広げる
for tn in [("F", 2), ("C", 3), ("A", 3), ("C", 4)]:
    note(4, m(*tn), 16.7, 4.4, 46)
for i, nn in enumerate([("A", 5), ("C", 6), ("F", 6)]):
    note(3, m(*nn), 16.9 + i * 0.7, 1.4, 58)
# 締め
note(2, m("F", 1), 19.3, 2.2, 70)
for j, nn in enumerate([("F", 5), ("A", 5), ("C", 6), ("F", 6)]):
    note(5, m(*nn), 19.3 + j * 0.08, 2.0, 70)
    note(3, m(*nn) + 12, 19.3 + j * 0.08, 2.0, 54)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
# Nylon Gt / E.Piano / Finger Bass / Kalimba / Warm Pad / Steel Drums
for ch, prog in [(0, 24), (1, 4), (2, 33), (3, 108), (4, 89), (5, 114)]:
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=70))
last = 0
for tt, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=tt - last))
    last = tt
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.7", "-r", str(SR), "-F", str(OUT / "music_only.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
with wave.open(str(OUT / "music_only.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
x = np.pad(x, ((0, max(0, int(22.0 * SR) - len(x))), (0, 0)))


def place(sig, at, gain):
    a = int(at * SR)
    n = min(len(sig), len(x) - a)
    x[a:a + n] += (sig[:n] if sig.ndim == 2 else sig[:n, None]) * gain


# ソナーの「ピーン」: 1100Hz のサイン + ゆっくり減衰（深海の広がり）
def ping(f0, dur):
    tt = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * f0 * tt) + 0.4 * np.sin(2 * np.pi * f0 * 2.01 * tt)) * np.exp(-tt * 2.2)
    e = np.zeros(len(s))
    for d, g in [(0.0, 1.0), (0.22, 0.42), (0.48, 0.2), (0.8, 0.09)]:  # 反射音
        k = int(d * SR)
        e[k:] += s[: len(s) - k] * g
    return e


place(ping(1100, 2.2), 0.15, 0.17)
place(ping(880, 2.0), 2.6, 0.1)
# 気泡: 低いノイズをゆっくり
rng = np.random.default_rng(7)
n = int(6.9 * SR)
noise = rng.standard_normal(n).astype(np.float32)
k = int(SR * 0.004)
low = np.convolve(noise, np.ones(k) / k, "same")
env = np.minimum(1, np.arange(n) / (SR * 0.5)) * np.minimum(1, (n - np.arange(n)) / (SR * 1.0))
place(low * env * 3.0, 0.0, 0.1)
y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
with wave.open(str(OUT / "bgm.wav"), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
print("bgm ->", OUT / "bgm.wav", f"({len(y) / SR:.1f}s)")
