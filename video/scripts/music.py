"""章ごとの BGM（キュー）を作曲して public/music/ に書き出す。

- 音源: FluidSynth + FluidR3_GM（MIT ライセンス）。作曲はこのスクリプトによるオリジナル。
- 章ごとに調・テンポ・楽器を変え、8 小節ごとに編成を入れ替えて単調なループを避ける。
- 長さは public/timeline.json の章の長さに合わせる（ナレーション確定後に実行する）。
- public/music/cues.json に各キューの開始フレームと長さを書き出し、Main.tsx が読む。
- `--case case002` で CASE #002 用（public/case002/）を作る。曲想・進行はケースごとに別に用意し、同じループを使い回さない。
"""
import argparse
import json
import subprocess
import tempfile
import wave
from pathlib import Path

import mido
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
SR = 48000
FPS = 30

# 楽器（GM プログラム番号）
PIANO, EPIANO, CELESTA, MUSICBOX, VIBES, MARIMBA = 0, 4, 8, 10, 11, 12
NYLON, ABASS, STRINGS, SLOWSTR, PIZZ, WARMPAD = 24, 32, 48, 49, 45, 89

N = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
Q = {"": [0, 4, 7], "m": [0, 3, 7], "maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10], "7": [0, 4, 7, 10], "m9": [0, 3, 7, 10, 14],
     "maj9": [0, 4, 7, 11, 14], "sus4": [0, 5, 7], "7sus4": [0, 5, 7, 10], "6": [0, 4, 7, 9], "add9": [0, 4, 7, 14]}


def chord(sym):
    root = sym[:2] if len(sym) > 1 and sym[1] in "#b" else sym[:1]
    return N[root], Q[sym[len(root):]]


# 章ごとの曲想: 進行・テンポ・拍子・編成
MOODS = {
    "curious": dict(prog=["Am9", "Fmaj7", "Dm9", "E7sus4"], bpm=80, beats=4, lead=PIANO, pulse="arp8", pizz=True, pad=STRINGS, key=57),
    "analysis": dict(prog=["Cmaj7", "Am7", "Fmaj9", "G6"], bpm=84, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=WARMPAD, key=60),
    "retro": dict(prog=["F", "Dm", "Gm7", "C7"], bpm=96, beats=3, lead=NYLON, pulse="waltz", pizz=False, pad=None, key=53, bell=MUSICBOX),
    "tracking": dict(prog=["Dm", "Bb", "Gm", "A7sus4"], bpm=90, beats=4, lead=PIANO, pulse="octave8", pizz=True, pad=STRINGS, key=50),
    "investigate": dict(prog=["Em7", "Cmaj7", "Am7", "B7sus4"], bpm=92, beats=4, lead=MARIMBA, pulse="arp8", pizz=True, pad=WARMPAD, key=52),
    "crisis": dict(prog=["Cm", "Ab", "Fm", "G"], bpm=68, beats=4, lead=PIANO, pulse="sparse", pizz=False, pad=SLOWSTR, key=48),
    "versus": dict(prog=["Gm7", "Ebmaj7", "Cm7", "D7sus4"], bpm=96, beats=4, lead=MARIMBA, pulse="call", pizz=True, pad=STRINGS, key=55),
    "focus": dict(prog=["Am", "F", "C", "G"], bpm=72, beats=4, lead=PIANO, pulse="sparse", pizz=False, pad=WARMPAD, key=57),
    "resolve": dict(prog=["Dmaj7", "Bm7", "Gmaj7", "A6"], bpm=76, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=SLOWSTR, key=50),
    "outro": dict(prog=["A", "F#m7", "Dmaj7", "E7sus4"], bpm=76, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=STRINGS, key=57, bell=CELESTA),
}

# 章の区間: (キュー名, 曲想, 開始カット, 終了カット(含まない) または (カット, セグメント終了))
SECTIONS = [
    ("s01_opening", "curious", "C001", "C009"),
    ("s02_market", "analysis", "C012", "C019"),
    ("s03_origin", "retro", "C019", "C029"),
    ("s04_idea", "analysis", "C029", "C036"),
    ("s05_structure", "tracking", "C037", "C048"),
    ("s06_clues", "investigate", "C048", "C065"),
    ("s07_clues2", "investigate", "C066", "C077"),
    ("s08_crisis", "crisis", "C078", "C083"),
    ("s09_versus", "versus", "C083", "C101"),
    ("s10_seria", "versus", "C102", "C108"),
    ("s11_focus", "focus", "C109", "C114"),
    ("s12_answer", "resolve", "C114", ("C120", 5)),
    ("s13_outro", "outro", ("C120", 6), "C130"),
    ("s14_end", "outro", "C131", "END"),
]

# CASE #002: 題材（湯気・厨房・数字の逆説）に合わせた別の曲想。BGM は背景に徹する（v2 24）
MOODS_002 = {
    "hook": dict(prog=["Dm9", "Bbmaj7", "Gm9", "A7sus4"], bpm=72, beats=4, lead=EPIANO, pulse="sparse", pizz=False, pad=WARMPAD, key=50),
    "trace": dict(prog=["Fmaj7", "Am7", "Dm7", "C6"], bpm=86, beats=4, lead=MARIMBA, pulse="arp8", pizz=True, pad=STRINGS, key=53),
    "pressure": dict(prog=["Em", "Cmaj7", "Am7", "B7sus4"], bpm=70, beats=4, lead=PIANO, pulse="sparse", pizz=False, pad=SLOWSTR, key=52),
    "wall": dict(prog=["Fm", "Db", "Bbm7", "C7sus4"], bpm=66, beats=4, lead=PIANO, pulse="sparse", pizz=False, pad=SLOWSTR, key=53),
    "menu": dict(prog=["Gmaj7", "Em7", "Am7", "D6"], bpm=88, beats=4, lead=VIBES, pulse="broken", pizz=True, pad=WARMPAD, key=55),
    "paradox": dict(prog=["Gm7", "Ebmaj7", "Bb", "F6"], bpm=84, beats=4, lead=PIANO, pulse="octave8", pizz=True, pad=STRINGS, key=55),
    "craft": dict(prog=["Cmaj7", "Em7", "Fmaj7", "G6"], bpm=78, beats=3, lead=NYLON, pulse="waltz", pizz=False, pad=None, key=48),
    "system": dict(prog=["Am7", "Fmaj7", "Cmaj7", "Gsus4"], bpm=92, beats=4, lead=MARIMBA, pulse="call", pizz=True, pad=WARMPAD, key=57),
    "tiers": dict(prog=["Bm7", "Gmaj7", "Em7", "F#7sus4"], bpm=84, beats=4, lead=VIBES, pulse="arp8", pizz=False, pad=STRINGS, key=47),
    "answer": dict(prog=["Ebmaj7", "Cm7", "Abmaj7", "Bb6"], bpm=72, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=SLOWSTR, key=51),
    "outro": dict(prog=["Gmaj7", "Em7", "Cmaj7", "D6"], bpm=76, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=STRINGS, key=55, bell=CELESTA),
}
SECTIONS_002 = [
    ("c2_01_hook", "hook", "S01", "S06"),
    ("c2_02_trace", "trace", "S06", "S13"),
    ("c2_03_index", "pressure", "S14", "S21"),
    ("c2_04_wall", "wall", "S21", "S26"),
    ("c2_05_menu", "menu", "S26", "S29"),
    ("c2_06_paradox", "paradox", "S29", "S35"),
    ("c2_07_cause", "pressure", "S36", "S39"),
    ("c2_08_craft", "craft", "S39", "S42"),
    ("c2_09_system", "system", "S42", "S48"),
    ("c2_10_tiers", "tiers", "S48", "S53"),
    ("c2_11_answer", "answer", "S53", ("S59", 0)),
    ("c2_12_outro", "outro", ("S59", 1), "S62"),
    ("c2_13_end", "outro", "S62", "END"),
]
# CASE #003: 映画館。ロビーの静けさ → 帳簿の分析 → コストの重さ → 座席 → 香り → 答え
MOODS_003 = {
    "lobby": dict(prog=["Am9", "Fmaj7", "Cmaj7", "E7sus4"], bpm=74, beats=4, lead=EPIANO, pulse="sparse", pizz=False, pad=WARMPAD, key=57),
    "ledger": dict(prog=["Dm7", "G6", "Cmaj7", "Am7"], bpm=88, beats=4, lead=MARIMBA, pulse="arp8", pizz=True, pad=STRINGS, key=50),
    "pressure": dict(prog=["Bbmaj7", "Gm7", "Ebmaj7", "F7sus4"], bpm=70, beats=4, lead=PIANO, pulse="sparse", pizz=False, pad=SLOWSTR, key=46),
    "seats": dict(prog=["Em9", "Cmaj7", "G6", "D7sus4"], bpm=90, beats=4, lead=VIBES, pulse="call", pizz=True, pad=WARMPAD, key=52),
    "aroma": dict(prog=["Fmaj7", "Dm9", "Bbmaj7", "C6"], bpm=80, beats=3, lead=NYLON, pulse="waltz", pizz=False, pad=None, key=53),
    "answer": dict(prog=["Cmaj7", "Am7", "Fmaj7", "G7sus4"], bpm=72, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=SLOWSTR, key=48),
    "outro": dict(prog=["Fmaj7", "Am7", "Bbmaj7", "C6"], bpm=76, beats=4, lead=PIANO, pulse="broken", pizz=False, pad=STRINGS, key=53, bell=CELESTA),
}
SECTIONS_003 = [
    ("c3_01_lobby", "lobby", "M01", "M05"),
    ("c3_02_lobby", "lobby", "M06", "M10"),
    ("c3_03_ledger", "ledger", "M10", "M17"),
    ("c3_04_ledger", "ledger", "M18", "M23"),
    ("c3_05_pressure", "pressure", "M23", "M26"),
    ("c3_06_seats", "seats", "M26", "M34"),
    ("c3_07_aroma", "aroma", "M34", "M40"),
    ("c3_08_answer", "answer", "M40", "M43"),
    ("c3_09_answer", "answer", "M43", "M47"),
    ("c3_10_outro", "outro", "M47", "END"),
]

# CASE #001 のショート（縦型）: ケース名 → (曲想, 乱数の種)
SHORTS = {
    "case001_shorts/short1": ("investigate", 301),
    "case001_shorts/short2": ("retro", 302),
    "case001_shorts/short3": ("versus", 303),
}


class Song:
    def __init__(self, bpm):
        self.bpm = bpm
        self.ev = {}  # channel -> list of (beat, msg)

    def note(self, ch, beat, n, v, dur):
        lst = self.ev.setdefault(ch, [])
        lst.append((beat, mido.Message("note_on", channel=ch, note=int(n), velocity=int(max(1, min(127, v))))))
        lst.append((beat + dur, mido.Message("note_off", channel=ch, note=int(n), velocity=0)))

    def save(self, path, programs, volumes):
        mid = mido.MidiFile(ticks_per_beat=480)
        meta = mido.MidiTrack()
        meta.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(self.bpm)))
        mid.tracks.append(meta)
        for ch, lst in self.ev.items():
            tr = mido.MidiTrack()
            if ch != 9:
                tr.append(mido.Message("program_change", channel=ch, program=programs[ch], time=0))
            tr.append(mido.Message("control_change", channel=ch, control=7, value=volumes.get(ch, 100), time=0))
            tr.append(mido.Message("control_change", channel=ch, control=91, value=70, time=0))
            lst.sort(key=lambda e: (e[0], e[1].type == "note_on"))
            t = 0
            for beat, msg in lst:
                tick = int(round(beat * 480))
                msg.time = tick - t
                t = tick
                tr.append(msg)
            mid.tracks.append(tr)
        mid.save(path)


def compose(mood: dict, seconds: float, seed: int) -> tuple:
    rng = np.random.default_rng(seed)
    bpm, beats = mood["bpm"], mood["beats"]
    song = Song(bpm)
    total_beats = seconds * bpm / 60
    bars = int(np.ceil(total_beats / beats)) + 1
    prog = [chord(c) for c in mood["prog"]]
    key = mood["key"]
    programs = {0: mood["lead"], 1: mood["pad"] or WARMPAD, 2: ABASS, 3: PIZZ, 4: mood.get("bell", CELESTA)}
    for bar in range(bars):
        phrase = bar // 8
        # 8 小節ごとに編成を変える（0: 薄い, 1: 標準, 2: 少し厚い, 3: 標準）
        density = [0, 1, 2, 1][phrase % 4]
        if bar < 2:
            density = 0
        root, q = prog[(bar // 2) % len(prog)] if bars > 8 else prog[bar % len(prog)]
        b0 = bar * beats
        base = key + ((root - key % 12) % 12) - (12 if (root - key % 12) % 12 > 6 else 0)
        tones = [base + i for i in q]
        # パッド（全小節）
        if mood["pad"]:
            for t in tones[:4]:
                song.note(1, b0, t, 34 + 6 * density, beats)
        # ベース
        song.note(2, b0, base - 24, 52, beats * 0.9)
        if beats == 4 and density >= 1:
            song.note(2, b0 + 2.5, base - 24 + (7 if rng.random() < 0.5 else 12), 40, 1.2)
        # リード（伴奏パターン）
        up = [t + 12 for t in tones]
        style = mood["pulse"]
        if style == "arp8":
            seq = (up + up[::-1][1:-1]) * 2
            for k in range(beats * 2):
                if density == 0 and k % 2:
                    continue
                song.note(0, b0 + k * 0.5, seq[k % len(seq)], 38 + rng.integers(-4, 5) + 3 * density, 0.45)
        elif style == "broken":
            for k, t in enumerate([up[0], up[2 % len(up)], up[1], up[-1]][: beats]):
                song.note(0, b0 + k, t, 40 + rng.integers(-4, 5) + 3 * density, 1.2)
        elif style == "octave8":
            for k in range(beats * 2):
                v = 34 + (8 if k % 2 == 0 else 0) + 2 * density
                song.note(0, b0 + k * 0.5, base - 12, v, 0.4)
                if density >= 1 and k % 4 == 2:
                    song.note(0, b0 + k * 0.5, base, v - 6, 0.4)
        elif style == "waltz":
            song.note(0, b0, base - 12, 46, 1)
            for k in (1, 2):
                for t in tones[1:3]:
                    song.note(0, b0 + k, t, 36, 0.9)
        elif style == "sparse":
            song.note(0, b0, up[0], 40, beats)
            if rng.random() < 0.6:
                song.note(0, b0 + beats / 2 + rng.choice([0, 0.5]), up[rng.integers(1, len(up))], 32, beats / 2)
        elif style == "call":
            pat = [0, 1.5, 2, 3.5] if bar % 2 == 0 else [0.5, 1, 2.5, 3]
            for k, pos in enumerate(pat):
                song.note(0, b0 + pos, up[k % len(up)], 40 + 3 * density, 0.4)
        # ピチカート（オフビート）
        if mood["pizz"] and density >= 1:
            for pos in ([1, 3] if beats == 4 else [1]):
                song.note(3, b0 + pos + 0.5, tones[(pos + bar) % len(tones)] + 12, 36 + 4 * density, 0.3)
        # 旋律の断片（2 小節に 1 回、控えめ）
        if density >= 1 and bar % 2 == 1 and rng.random() < 0.7:
            mel = sorted(rng.choice(up + [t + 12 for t in tones[:2]], size=2, replace=False))
            ch = 4 if mood.get("bell") else 0
            for j, n in enumerate(mel):
                song.note(ch, b0 + 1 + j * 1.5, n + (12 if ch == 4 else 0), 30 + 3 * density, 1.2)
    vols = {0: 100, 1: 70, 2: 90, 3: 70, 4: 60}
    return song, programs, vols


def render(song, programs, vols, seconds) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        mp, wp = Path(d) / "a.mid", Path(d) / "a.wav"
        song.save(mp, programs, vols)
        subprocess.run(["fluidsynth", "-ni", "-g", "0.5", "-r", str(SR), "-F", str(wp), SF2, str(mp)], check=True, capture_output=True)
        with wave.open(str(wp)) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float64) / 32768
    n = int(seconds * SR)
    x = x[:n] if len(x) >= n else np.pad(x, ((0, n - len(x)), (0, 0)))
    # 最後はそっと消える
    fade = np.clip((n - np.arange(n)) / (2.5 * SR), 0, 1)[:, None] ** 2
    x = x * fade
    rms = np.sqrt(np.mean(x[: min(n, 30 * SR)] ** 2)) or 1
    x = x * (10 ** (-22 / 20) / rms)  # 約 -22 dBFS RMS にそろえる
    return np.clip(x, -0.95, 0.95)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--case", help="例: case002（省略時は CASE #001）")
    args = ap.parse_args()
    base = ROOT / "public" / args.case if args.case else ROOT / "public"
    out = base / "music"
    prefix = f"{args.case}/music" if args.case else "music"
    t = json.loads((base / "timeline.json").read_text(encoding="utf-8"))
    if args.case == "case002":
        moods, sections, seed0 = MOODS_002, SECTIONS_002, 200
    elif args.case == "case003":
        moods, sections, seed0 = MOODS_003, SECTIONS_003, 400
    elif args.case and args.case in SHORTS:
        # ショート: 1 本通しの短い曲（本編とは別の種で作曲）
        mood, seed0 = SHORTS[args.case]
        moods, sections = MOODS, [("bgm", mood, t["cuts"][0]["id"], "END")]
    else:
        moods, sections, seed0 = MOODS, SECTIONS, 100
    cuts = {c["id"]: c for c in t["cuts"]}

    def frame_of(spec, start=False):
        if spec == "END":
            return t["totalFrames"]
        if isinstance(spec, tuple):
            cid, seg = spec
            c = cuts[cid]
            return c["from"] + round(c["segments"][seg]["end"] * FPS)
        return cuts[spec]["from"]

    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.wav"):
        old.unlink()
    cues = []
    for i, (name, mood, a, b) in enumerate(sections):
        s, e = frame_of(a), frame_of(b)
        seconds = (e - s) / FPS + 2.5
        song, programs, vols = compose(moods[mood], seconds, seed=seed0 + i)
        x = render(song, programs, vols, seconds)
        with wave.open(str(out / f"{name}.wav"), "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((x * 32767).astype(np.int16).tobytes())
        cues.append({"file": f"{prefix}/{name}.wav", "from": s, "to": e, "mood": mood})
        print(f"{name:14s} {mood:12s} {(e - s) / FPS:6.1f}s")
    (out / "cues.json").write_text(json.dumps(cues, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
