"""영상마다 가사 없는 BGM을 새로 작곡해 WAV로 렌더링한다.

- 음원: FluidSynth + FluidR3_GM(MIT 라이선스). 작곡(진행·패턴)은 이 스크립트의 오리지널.
- 구간(sections)마다 진행·악기·패턴을 바꾼다. 장르·분위기는 projects/<slug>/bgm.json에서 정한다.
사용: python3 tools/bgm.py <slug>
"""
import json, subprocess, sys, tempfile
from pathlib import Path

import mido

ROOT = Path(__file__).resolve().parent.parent
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
SR = 44100
TPB = 480

N = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
Q = {"": [0, 4, 7], "m": [0, 3, 7], "maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10], "7": [0, 4, 7, 10], "sus4": [0, 5, 7],
     "add9": [0, 4, 7, 14], "m9": [0, 3, 7, 10, 14], "6": [0, 4, 7, 9], "sus2": [0, 2, 7]}


def chord(sym):
    root = sym[:2] if len(sym) > 1 and sym[1] in "#b" else sym[:1]
    return N[root], Q[sym[len(root):]]


class Song:
    def __init__(self, bpm):
        self.bpm = bpm
        self.ev = {}  # ch -> list of (tick, msg)

    def sec2tick(self, s):
        return int(round(s * self.bpm / 60 * TPB))

    def note(self, ch, t, n, v, d):
        a, b = self.sec2tick(t), self.sec2tick(t + d)
        self.ev.setdefault(ch, []).append((a, mido.Message("note_on", channel=ch, note=int(n), velocity=int(max(1, min(127, v))))))
        self.ev[ch].append((b, mido.Message("note_off", channel=ch, note=int(n), velocity=0)))

    def save(self, path, programs, volumes):
        mid = mido.MidiFile(ticks_per_beat=TPB)
        tr = mido.MidiTrack(); mid.tracks.append(tr)
        tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(self.bpm), time=0))
        allev = []
        for ch, p in programs.items():
            allev.append((0, mido.Message("program_change", channel=ch, program=p)))
            allev.append((0, mido.Message("control_change", channel=ch, control=7, value=volumes.get(ch, 100))))
            allev.append((0, mido.Message("control_change", channel=ch, control=91, value=70)))  # reverb
        for evs in self.ev.values():
            allev += evs
        allev.sort(key=lambda x: (x[0], 0 if x[1].type == "note_off" else 1))
        last = 0
        for t, m in allev:
            tr.append(m.copy(time=t - last)); last = t
        mid.save(path)


def compose(cfg):
    bpm = cfg["bpm"]; beat = 60 / bpm; bar = beat * 4
    s = Song(bpm)
    PIANO, PAD, BASS, BELL = 0, 1, 2, 3
    for sec in cfg["sections"]:
        t0, t1 = sec["t"]
        prog = sec["prog"]; dyn = sec.get("dyn", 1.0)
        t = t0; i = 0
        while t < t1 - 0.05:
            root, iv = chord(prog[i % len(prog)])
            L = min(bar, t1 - t)
            base = 48 + root
            if sec.get("pad"):
                for k in iv[:4]:
                    s.note(PAD, t, base + 12 + k, 52 * dyn, L)
            if sec.get("bass"):
                s.note(BASS, t, base - 12, 70 * dyn, L * 0.95)
            pat = sec.get("piano")
            tones = [base + k for k in iv] + [base + 12 + k for k in iv]
            if pat == "arp":  # 8분음 분산화음, 소절 후반은 조금 약하게
                order = [0, 2, 3, 4, 5, 4, 3, 2]
                for j, o in enumerate(order):
                    tt = t + j * beat / 2
                    if tt < t1: s.note(PIANO, tt, tones[o % len(tones)] + 12, (58 - (j % 4) * 4) * dyn, beat * 0.9)
            elif pat == "sparse":  # 소절당 두 번, 여백을 남긴다
                s.note(PIANO, t, tones[0] + 12, 50 * dyn, bar)
                if t + beat * 2 < t1:
                    s.note(PIANO, t + beat * 2, tones[2] + 12, 44 * dyn, beat * 2)
                    s.note(PIANO, t + beat * 2, tones[4] + 12, 40 * dyn, beat * 2)
            elif pat == "broken":  # 4분음 펼침
                for j, o in enumerate([0, 2, 4, 2]):
                    tt = t + j * beat
                    if tt < t1: s.note(PIANO, tt, tones[o] + 12, (56 if j == 0 else 48) * dyn, beat * 1.5)
            mel = sec.get("melody")
            if mel:  # 소절 첫 박에 짧은 동기(코드톤 위 3·5음)
                m = mel[i % len(mel)]
                for j, (off, deg, ln) in enumerate(m):
                    tt = t + off * beat
                    if tt < t1: s.note(PIANO, tt, base + 24 + deg, 62 * dyn, ln * beat)
            if sec.get("bell") and i % 2 == 1:
                s.note(BELL, t + beat * 3, base + 36 + iv[1], 45 * dyn, beat)
            t += bar; i += 1
    return s


def main():
    slug = sys.argv[1]
    cfg = json.load(open(ROOT / f"projects/{slug}/bgm.json"))
    out = ROOT / f"work/{slug}/bgm.wav"
    s = compose(cfg)
    with tempfile.TemporaryDirectory() as d:
        mp = Path(d) / "bgm.mid"; wp = Path(d) / "raw.wav"
        s.save(mp, cfg["programs"] and {int(k): v for k, v in cfg["programs"].items()}, {int(k): v for k, v in cfg["volumes"].items()})
        subprocess.run(["fluidsynth", "-ni", "-g", "0.6", "-r", str(SR), "-F", str(wp), SF2, str(mp)], check=True, capture_output=True)
        total = cfg["length"]
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wp), "-af",
                        f"atrim=0:{total},afade=t=in:d=1.5,afade=t=out:st={total - 3}:d=3,loudnorm=I=-24:TP=-3:LRA=11",
                        "-ar", str(SR), "-ac", "2", str(out)], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main()
