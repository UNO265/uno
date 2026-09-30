"""BGM: ゆるくてかわいい 1日ルーティン曲。F major, 100 BPM, I-vi-IV-V。
ナイロンギター（ウクレレ風のカッティング）+ ピチカート（ベース）+ マリンバ（メロディ）+ グロッケン（合いの手）。
50.6 秒 = 84 拍 → 20 小節 + F の和音で 1 小節ぶん余韻。
usage: python3 music.py OUT_DIR  → OUT_DIR/bgm.mid, bgm.wav
"""
import subprocess, sys
from pathlib import Path
import mido

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
BPM, TPB = 100, 480
N = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}


def m(name, octv):
    return 12 * (octv + 1) + N[name.replace("b", "")] - (1 if name.endswith("b") and len(name) == 2 else 0)


CH = {  # bass, strum tones
    "F": (m("F", 2), [m("F", 3), m("A", 3), m("C", 4), m("F", 4)]),
    "Dm": (m("D", 2), [m("D", 3), m("F", 3), m("A", 3), m("D", 4)]),
    "Bb": (m("Bb", 2), [m("Bb", 3), m("D", 4), m("F", 4), m("Bb", 4)]),
    "C": (m("C", 3), [m("C", 3), m("E", 3), m("G", 3), m("C", 4)]),
}
PROG = ["F", "Dm", "Bb", "C"] * 5  # 20 bars
# マリンバの主題（2 小節）: (beat, note, beats)
MOTIF_A = [(0, ("C", 5), 0.5), (0.5, ("A", 4), 0.5), (1, ("F", 4), 1), (2.5, ("G", 4), 0.5), (3, ("A", 4), 1),
           (4, ("D", 5), 0.5), (4.5, ("C", 5), 0.5), (5, ("A", 4), 1.5), (7, ("F", 4), 1)]
MOTIF_B = [(0, ("D", 5), 0.5), (0.5, ("C", 5), 0.5), (1, ("Bb", 4), 1), (2.5, ("A", 4), 0.5), (3, ("G", 4), 1),
           (4, ("E", 4), 0.5), (4.5, ("F", 4), 0.5), (5, ("G", 4), 1.5), (7, ("C", 5), 1)]

ev = []


def note(ch, n, beat, beats, vel):
    t0 = int(beat * TPB)
    ev.append((t0, 1, ch, n, vel))
    ev.append((t0 + max(20, int(beats * TPB) - 20), 0, ch, n, 0))


for bar, name in enumerate(PROG):
    b0 = bar * 4
    bass, tones = CH[name]
    intro = bar < 2
    # ピチカートのベース: 1・3 拍
    note(1, bass, b0, 0.8, 70)
    note(1, bass + 7 if name != "C" else bass - 5, b0 + 2, 0.8, 60)
    # ウクレレ風カッティング: ダウン・アップ（裏拍を軽く）
    for k, (off, v) in enumerate([(0, 58), (1, 42), (1.5, 50), (2.5, 42), (3, 52)]):
        for j, t in enumerate(tones):
            note(0, t, b0 + off + j * 0.015, 0.4, v - (0 if not intro else 8))
    # マリンバの主題（3 小節目から、2 小節ずつ A/B を交互）
    if bar >= 2 and bar % 2 == 0:
        motif = MOTIF_A if (bar // 2) % 2 == 1 else MOTIF_B
        for beat, (nm, o), d in motif:
            note(2, m(nm, o), b0 + beat, d, 72)
    # グロッケンの合いの手（4 小節ごと）
    if bar % 4 == 3:
        for k, nn in enumerate([("C", 6), ("F", 6), ("A", 6)]):
            note(3, m(*nn), b0 + 3 + k * 0.25, 0.5, 50)
# 終わり: F の和音で余韻
b0 = 80
note(1, m("F", 2), b0, 3, 70)
for j, t in enumerate(CH["F"][1] + [m("A", 4)]):
    note(0, t, b0 + j * 0.06, 3.5, 55)
note(2, m("F", 5), b0, 3, 70)
note(3, m("F", 6), b0 + 0.5, 2, 45)

mid = mido.MidiFile(ticks_per_beat=TPB)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM)))
for ch, prog in [(0, 24), (1, 45), (2, 12), (3, 9)]:  # Nylon Gt / Pizzicato / Marimba / Glockenspiel
    tr.append(mido.Message("program_change", channel=ch, program=prog))
    tr.append(mido.Message("control_change", channel=ch, control=91, value=45))
tr.append(mido.Message("control_change", channel=0, control=7, value=90))
tr.append(mido.Message("control_change", channel=3, control=7, value=80))
last = 0
for t, typ, ch, n, v in sorted(ev, key=lambda e: (e[0], e[1])):
    tr.append(mido.Message("note_on" if typ else "note_off", channel=ch, note=n, velocity=v, time=t - last))
    last = t
mid.save(OUT / "bgm.mid")
subprocess.run(["fluidsynth", "-ni", "-g", "0.8", "-r", "48000", "-F", str(OUT / "bgm.wav"),
                "/usr/share/sounds/sf2/FluidR3_GM.sf2", str(OUT / "bgm.mid")], check=True, stdout=subprocess.DEVNULL)
print("bgm ->", OUT / "bgm.wav", f"({mid.length:.1f}s)")
