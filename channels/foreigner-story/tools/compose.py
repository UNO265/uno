"""タビノメ BGM 작곡·배치(가사 없는 기악곡, FluidR3_GM).

사용: python3 compose.py <music_plan.json> <timeline.json> <out_dir>
  music_plan: 구간별 곡(조·템포·코드·악기·패턴)
  timeline  : assemble.py 가 만든 *.timeline.json (항목 종류별로 음량을 정한다)
출력: out_dir/stems/<cue>.wav(곡 원본, E6: 따로 보관), out_dir/music.wav(배치·음량 조절을 마친 전체 BGM)

E6 원칙: 과장하지 않는 기악곡 / 대화 구간은 내레이션 구간보다 더 낮게 / 장면 묶음 단위로 잇고 장이 바뀔 때만 분위기를 바꿈 /
마지막은 짧게 살린 뒤 페이드아웃.
"""
import json, subprocess, sys, tempfile
from pathlib import Path

import mido
import numpy as np

SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
SR = 48000
NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7,
        "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
QUAL = {"": [0, 4, 7, 11], "M7": [0, 4, 7, 11], "m": [0, 3, 7, 10], "m7": [0, 3, 7, 10], "sus": [0, 5, 7, 14],
        "add9": [0, 4, 7, 14], "6": [0, 4, 7, 9]}
GAIN = {"card": 1.0, "freeze": 0.55, "clip": 0.32}   # 항목 종류별 BGM 음량(대화 < 내레이션 < 카드)


def chord(name):
    root = name[:2] if len(name) > 1 and name[1] in "#b" else name[:1]
    q = name[len(root):]
    return NOTE[root], QUAL.get(q, QUAL[""])


def make_midi(cue, seconds, path, seed):
    rng = np.random.default_rng(seed)
    bpm, tpb = cue["bpm"], 480
    mid = mido.MidiFile(ticks_per_beat=tpb)
    beats = int(seconds * bpm / 60) + 8
    bars = beats // 4 + 1
    prog = cue["chords"]
    ev = {}                                    # channel -> [(tick, msg)]

    def add(ch, tick, note, vel, length):
        ev.setdefault(ch, []).append((tick, mido.Message("note_on", channel=ch, note=note, velocity=vel)))
        ev.setdefault(ch, []).append((tick + length, mido.Message("note_off", channel=ch, note=note, velocity=0)))

    bar = 4 * tpb
    for b in range(bars):
        r, iv = chord(prog[b % len(prog)])
        base = 48 + r
        t0 = b * bar
        for part in cue["parts"]:
            ch, kind, v = part["ch"], part["kind"], part.get("vel", 60)
            if kind == "pad":
                for x in iv[:3]:
                    add(ch, t0, base + 12 + x, v, bar - 20)
            elif kind == "bass":
                add(ch, t0, base - 12, v, bar // 2 - 20)
                add(ch, t0 + bar // 2, base - 12 + (7 if b % 2 else 0), v - 8, bar // 2 - 20)
            elif kind == "arp":                 # 8분음표 아르페지오
                seq = [iv[0], iv[1], iv[2], iv[1] + 12, iv[2] + 12, iv[1] + 12, iv[2], iv[1]]
                for k, x in enumerate(seq):
                    vv = v + (6 if k % 4 == 0 else 0) + int(rng.integers(-4, 5))
                    add(ch, t0 + k * tpb // 2, base + 12 + x + part.get("oct", 0), vv, tpb // 2 + 60)
            elif kind == "broken":              # 4분음표, 성기게
                for k, x in enumerate([iv[0], iv[2], iv[1] + 12, iv[2]]):
                    if rng.random() < part.get("density", 1.0):
                        add(ch, t0 + k * tpb, base + 12 + x + part.get("oct", 0), v + int(rng.integers(-5, 4)), tpb + 120)
            elif kind == "bell":                # 마디마다 높은 음 1~2개(첼레스타·마림바)
                for k in sorted(rng.choice(8, size=part.get("n", 2), replace=False)):
                    x = iv[int(rng.integers(0, 3))] + 24 + part.get("oct", 0)
                    add(ch, t0 + int(k) * tpb // 2, base + x, v + int(rng.integers(-6, 4)), tpb)
            elif kind == "melody":              # 2마디에 한 번, 코드 음으로 된 짧은 선율
                if b % 2 == 0:
                    pts = [iv[2], iv[1] + 12, iv[0] + 12, iv[2]]
                    for k, x in enumerate(pts):
                        add(ch, t0 + k * tpb * 2 // 2, base + 24 + x + part.get("oct", 0) - 12, v, tpb - 30)
    tracks = []
    tr = mido.MidiTrack()
    tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(bpm)))
    for part in cue["parts"]:
        tr.append(mido.Message("program_change", channel=part["ch"], program=part["prog"]))
        tr.append(mido.Message("control_change", channel=part["ch"], control=91, value=part.get("rev", 70)))
        tr.append(mido.Message("control_change", channel=part["ch"], control=7, value=part.get("vol", 100)))
    tracks.append(tr)
    for ch, lst in ev.items():
        t = mido.MidiTrack()
        lst.sort(key=lambda x: (x[0], x[1].type == "note_on"))
        last = 0
        for tick, msg in lst:
            t.append(msg.copy(time=tick - last))
            last = tick
        tracks.append(t)
    mid.tracks.extend(tracks)
    mid.save(path)


def render(midi, wav):
    subprocess.run(["fluidsynth", "-ni", "-g", "0.6", "-r", str(SR), "-F", str(wav), SF2, str(midi)],
                   check=True, capture_output=True)


def load(wav):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(wav), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def ramp(env, a, b, v0, v1):
    a, b = max(0, int(a * SR)), min(len(env), int(b * SR))
    if b > a:
        env[a:b] = np.linspace(v0, v1, b - a)


def main():
    plan = json.load(open(sys.argv[1]))
    tl = json.load(open(sys.argv[2]))
    out = Path(sys.argv[3]); (out / "stems").mkdir(parents=True, exist_ok=True)
    items = tl["items"]
    total = items[-1]["start"] + items[-1]["dur"]
    n = int(total * SR) + SR
    mix = np.zeros((n, 2), dtype=np.float32)
    tmp = tempfile.mkdtemp(prefix="bgm_")
    xf = plan.get("crossfade", 2.0)
    for i, cue in enumerate(plan["cues"]):
        a, b = cue["start"], cue["end"]
        midi = Path(tmp) / f"{cue['name']}.mid"
        wav = out / "stems" / f"{cue['name']}.wav"
        make_midi(cue, b - a + xf + 4, midi, seed=100 + i)
        render(midi, wav)
        x = load(wav)
        x /= max(1e-6, np.abs(x).max()) / 0.5                       # 곡마다 최대값을 맞춘다
        L = min(len(x), int((b - a + xf) * SR))
        x = x[:L]
        fade_in = int(cue.get("fade_in", xf) * SR)
        fade_out = int(cue.get("fade_out", xf) * SR)
        x[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
        x[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]
        s = int(a * SR)
        mix[s:s + L] += x[: max(0, min(L, n - s))]
    # 항목 종류별 음량(경계는 0.8초에 걸쳐 바뀜)
    env = np.ones(n, dtype=np.float32)
    prev = None
    for it in items:
        g = GAIN[it["type"]]
        a, b = it["start"], it["start"] + it["dur"]
        ramp(env, a, b, g, g)
        if prev is not None and prev != g:
            ramp(env, a - 0.4, a + 0.4, prev, g)
        prev = g
    for sil in plan.get("silence", []):                              # 정적이 중요한 순간은 비운다
        ramp(env, sil[0] - 0.8, sil[0], env[int(sil[0] * SR) - int(0.8 * SR)], 0)
        ramp(env, sil[0], sil[1], 0, 0)
        ramp(env, sil[1], sil[1] + 1.2, 0, env[min(n - 1, int((sil[1] + 1.2) * SR))])
    mix *= env[:, None]
    end_fade = int(plan.get("end_fade", 3.0) * SR)
    e = int(total * SR)
    mix[e - end_fade:e] *= np.linspace(1, 0, end_fade)[:, None]
    mix[e:] = 0
    pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                    str(out / "music.wav")], input=pcm, check=True)
    print(f"music.wav {total:.1f}s, cues {len(plan['cues'])}")


if __name__ == "__main__":
    main()
