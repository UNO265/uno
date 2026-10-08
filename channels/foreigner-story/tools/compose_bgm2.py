"""タビノメ BGM 자체 작곡 v2 (2026-10-08 사용자: 「같은 곡에 악기만 바꾼 것 같다. 다른 곡으로, 초반은 긴장감 있게」).
music.py(v1)는 모든 곡이 같은 반주 틀 + 같은 주제 선율이라 비슷하게 들렸다. v2는 곡마다 따로:
- 음계(단조·도리아·장조·5음계)·박자·템포·화성 진행
- 베이스 패턴(페달 펄스·싱코페이션·워킹·옥타브), 반주 패턴(오스티나토·스트럼·스탭·16분 아르페지오·블록), 드럼 그루브(타이코·팝·보사·재즈 브러시·하프타임·하트비트)
- 곡마다 새로 만드는 선율(2마디 부름 + 2마디 대답, 강박엔 화음 음), 대선율
- 곡 구성: 인트로(4) → A(8) → B(8, 선율) → C(8, 대선율·드럼 풀) → 브레이크(4) → 반복 때 선율·악기 바꿈
음원: FluidSynth + FluidR3_GM(MIT). 사용: python3 compose_bgm2.py <tracks.json> <out_dir> <seconds>"""
import json, sys, wave
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "video" / "scripts"))
import music as M

SCALES = {"minor": [0, 2, 3, 5, 7, 8, 10], "harm": [0, 2, 3, 5, 7, 8, 11], "dorian": [0, 2, 3, 5, 7, 9, 10],
          "major": [0, 2, 4, 5, 7, 9, 11], "mixo": [0, 2, 4, 5, 7, 9, 10], "penta": [0, 2, 4, 7, 9], "minpenta": [0, 3, 5, 7, 10],
          "yo": [0, 2, 5, 7, 9]}
K, SN, SS, CL, HC, HP, HO, LT, MT, HT, RD, CR, TB, SH, CB, CGH, CGL, TRI, WB = 36, 38, 37, 39, 42, 44, 46, 41, 45, 48, 51, 49, 54, 70, 69, 62, 64, 81, 76
LEAD, CNT, COMP, BASS, PAD, EXTRA = 0, 1, 2, 3, 4, 5

def chord(sym, key):
    r, q = M.chord(sym)
    base = key + ((r - key % 12) % 12) - (12 if (r - key % 12) % 12 > 6 else 0)
    return base, [base + i for i in q]

def scale_notes(key, sc, lo, hi):
    out = [n for o in range(-3, 4) for n in (key + 12 * o + i for i in SCALES[sc]) if lo <= n <= hi]
    return sorted(set(out))

def melody(rng, bars, beats, chords_at, key, sc, lo, hi, rhythms):
    """2마디 단위 부름-대답. 강박=화음 음, 약박=음계 순차. 4마디마다 끝을 으뜸음으로."""
    notes, sn = [], scale_notes(key, sc, lo, hi)
    cur = min(sn, key=lambda n: abs(n - (lo + hi) // 2))
    for b in range(0, bars, 2):
        rh = rhythms[rng.integers(len(rhythms))] if b % 4 == 0 else rh      # 대답은 같은 리듬
        for bb in range(2):
            bar = b + bb
            if bar >= bars: break
            for k, (pos, d) in enumerate(rh[bb]):
                t = bar * beats + pos
                tones = [n for n in sn if n % 12 in {x % 12 for x in chords_at(bar)[1]}]
                if pos % 1 == 0 and tones:
                    cur = min(tones, key=lambda n: abs(n - cur) + rng.random() * 3)
                else:
                    i = sn.index(min(sn, key=lambda n: abs(n - cur)))
                    cur = sn[max(0, min(len(sn) - 1, i + rng.choice([-2, -1, -1, 1, 1, 2])))]
                last = (k == len(rh[bb]) - 1 and bb == 1)
                if last and (b // 2) % 2 == 1:
                    cur = min((n for n in sn if n % 12 == key % 12), key=lambda n: abs(n - cur))
                notes.append((t, cur, d))
    return notes

R_SETS = {   # (위치, 길이) 목록 2마디분
    "lyric": [[[(0, 1.5), (1.5, .5), (2, 2)], [(0, 1), (1, 1), (2, 1.5), (3.5, .5)]], [[(0, .5), (.5, .5), (1, 1), (2, 2)], [(0, 3), (3, 1)]]],
    "bouncy": [[[(0, .5), (.75, .25), (1, .5), (2, .5), (2.5, .5), (3, 1)], [(.5, .5), (1, .5), (2, 1), (3, .5)]], [[(0, .25), (.25, .25), (.5, .5), (1.5, .5), (2, 1)], [(0, .5), (1, .5), (1.5, .5), (2, 2)]]],
    "sparse": [[[(0, 2), (3, 1)], [(0, 3)]], [[(1, 1), (2, 2)], [(0, 1.5), (2, 2)]]],
    "jazz": [[[(.66, .34), (1, .66), (1.66, .34), (2, 1), (3.66, .34)], [(0, .66), (.66, 1.34), (2.66, 1)]], [[(0, 1), (1.66, .34), (2, .66), (2.66, 1.34)], [(.66, .34), (1, 2)]]],
    "waltz": [[[(0, 2), (2, 1)], [(0, 1), (1, 1), (2, 1)]], [[(0, 1.5), (1.5, .5), (2, 1)], [(0, 3)]]],
    "drive": [[[(0, .5), (.5, .5), (1, .5), (1.5, .5), (2, 1), (3, .5), (3.5, .5)], [(0, 1), (1, .5), (1.5, .5), (2, 2)]]],
}

def drums(song, kind, b0, beats, lvl, bar, swing=0.0):
    sw = lambda p: p + (swing if (p * 2) % 2 == 1 else 0)
    n = lambda pos, note, v, d=0.15: song.note(9, b0 + pos, note, v * lvl, d)
    if kind == "taiko":
        for p, v in ((0, 92), (1.5, 70), (2.5, 74), (3, 86)): n(p, LT, v, .4)
        if bar % 2: n(3.5, MT, 60); n(3.75, MT, 70)
        for k in range(8): n(k * .5, SH, 30 + 10 * (k % 2))
    elif kind == "heart":
        n(0, K, 80, .3); n(.4, K, 56, .3)
        for k in range(4): n(k + .5, TRI if k == 3 else HC, 26)
    elif kind == "pop":
        for p in (0, 2.5): n(p, K, 72)
        for p in (1, 3): n(p, SN if lvl > .8 else SS, 64)
        for k in range(8): n(sw(k * .5), HC, 34 + 12 * (k % 2 == 0))
    elif kind == "halftime":
        n(0, K, 74); n(2, SN, 66); n(3.5, K, 50)
        for k in range(8): n(k * .5, HC, 30 + 8 * (k % 2 == 0))
    elif kind == "bossa":
        for p in (0, 1.5, 2, 3.5): n(p, K, 54)
        for p in (0, 1, 2.5, 3, 4 - .5) if bar % 2 == 0 else (1, 2, 3.5): n(p, SS, 50)
        for k in range(8): n(k * .5, SH, 28 + 8 * (k % 2))
    elif kind == "brush":
        for p in (1, 3): n(sw(p + .5), HP, 40)
        for k in range(4): n(sw(k), RD, 40 + 6 * (k % 2)); n(sw(k + .66), RD, 30)
        n(0, K, 40)
    elif kind == "train":
        for k in range(8): n(k * .5, SN if k % 2 else SS, 30 + 14 * (k in (0, 4)), .1)
        n(0, K, 70); n(2, K, 60)
        if bar % 4 == 3: n(3, CR, 50, .8)
    elif kind == "conga":
        for p, nn, v in ((0, CGL, 60), (1, CGH, 46), (1.5, CGH, 52), (2.5, CGL, 56), (3, CGH, 48)): n(p, nn, v)
        n(0, K, 54); n(2, K, 46)
        for k in range(8): n(k * .5, CB, 26 + 8 * (k % 2))

def compose(sp, seconds, seed):
    rng = np.random.default_rng(seed)
    bpm, beats, key, sc = sp["bpm"], sp.get("beats", 4), sp["key"], sp["scale"]
    song = M.Song(bpm)
    bars = int(np.ceil(seconds * bpm / 60 / beats)) + 1
    prog = sp["prog"]; cpb = sp.get("bars_per_chord", 1)
    chords_at = lambda bar: chord(prog[(bar // cpb) % len(prog)], key)
    form = [("intro", 4), ("A", 8), ("B", 8), ("C", 8), ("brk", 4)]
    plan, b = [], 0
    while b < bars:
        for name, n in form:
            plan += [(name, b + i) for i in range(n)]; b += n
    plan = plan[:bars]
    mel_bars = 8
    mel = {}
    for cyc in range(bars // 32 + 2):
        mel[cyc] = melody(rng, mel_bars, beats, lambda x: chords_at(x), key + sp.get("lead_oct", 12), sc, key + sp.get("lead_oct", 12) - 3, key + sp.get("lead_oct", 12) + 16, R_SETS[sp.get("rhythm", "lyric")])
    for sec_name, bar in plan:
        b0, cyc = bar * beats, bar // 32
        root, tones = chords_at(bar)
        lvl = {"intro": .6, "A": .8, "B": .9, "C": 1.0, "brk": .55}[sec_name]
        if sp.get("build"):                       # 긴장: 갈수록 세게
            lvl *= 0.75 + 0.25 * min(1, (bar % 32) / 28)
        # 패드
        if sp.get("pad") is not None:
            for t in tones[:4]: song.note(PAD, b0, t, 40 * lvl + 6, beats)
        # 베이스
        bp = sp["bass"]; lowr = root - 24
        if bp == "pedal":
            for k in range(beats * 2): song.note(BASS, b0 + k * .5, key - 24 + (12 if k % 4 == 3 else 0), (58 if k % 2 == 0 else 44) * lvl, .4)
        elif bp == "sync":
            for p, iv in ((0, 0), (1.5, 0), (2.5, 7), (3.5, 12)): song.note(BASS, b0 + p, lowr + iv, 60 * lvl, .45)
        elif bp == "walk":
            for k, iv in enumerate([0, tones[1] - root, tones[2] - root, 11 if rng.random() < .5 else 10][:beats]): song.note(BASS, b0 + k + (sp.get("swing", 0) if k % 2 else 0), lowr + iv, 54 * lvl, .9)
        elif bp == "octave":
            for k in range(beats * 2): song.note(BASS, b0 + k * .5, lowr + (12 if k % 2 else 0), 54 * lvl, .4)
        elif bp == "long":
            song.note(BASS, b0, lowr, 56 * lvl, beats * .95)
        elif bp == "waltz":
            song.note(BASS, b0, lowr, 56 * lvl, 1); song.note(BASS, b0 + 2, lowr + 7, 44 * lvl, 1)
        # 반주
        cp = sp["comp"]; up = [t + 12 for t in tones]
        if sec_name != "intro" or cp == "ostinato":
            if cp == "ostinato":
                pat = sp.get("ost", [0, 0, 3, 0, 1, 0, 3, 5])
                sn = scale_notes(key, sc, key, key + 24)
                for k, st in enumerate(pat[:beats * 2]):
                    song.note(COMP, b0 + k * .5, sn[st % len(sn)] + (12 if bar % 8 >= 4 and k % 4 == 3 else 0), (52 if k % 2 == 0 else 40) * lvl, .45)
            elif cp == "strum":
                for p in ([0, 1.5, 2.5, 3] if beats == 4 else [0, 1, 2]):
                    for j, t in enumerate(tones): song.note(COMP, b0 + p + j * .02, t, 40 * lvl, .5)
            elif cp == "stab":
                for p in (1.5, 3.5) if bar % 2 == 0 else (.5, 2.5, 3.5):
                    for t in up[:3]: song.note(COMP, b0 + p, t, 46 * lvl, .25)
            elif cp == "arp16":
                seq = up + [up[0] + 12] + up[::-1][1:]
                for k in range(beats * 4): song.note(COMP, b0 + k * .25, seq[k % len(seq)], (34 + 8 * (k % 4 == 0)) * lvl, .22)
            elif cp == "block":
                for p in range(beats): 
                    for t in tones[1:]: song.note(COMP, b0 + p, t + 12, (36 + 6 * (p == 0)) * lvl, .8)
            elif cp == "jazz":
                for p in ((1.66, 3.66) if bar % 2 else (.66, 2, 3.66)):
                    for t in tones[1:4]: song.note(COMP, b0 + p, t, 40 * lvl, .3)
            elif cp == "waltz":
                for p in (1, 2):
                    for t in tones[1:3]: song.note(COMP, b0 + p, t + 12, 36 * lvl, .8)
        # 선율 / 대선율
        mb = bar % 32
        if sec_name in ("B", "C"):
            idx = (mb - 12) % mel_bars
            for t, n, d in mel[cyc]:
                if idx * beats <= t < (idx + 1) * beats:
                    song.note(LEAD if (cyc % 2 == 0 or not sp.get("lead2")) else EXTRA, b0 + (t - idx * beats), n, (64 + rng.integers(-5, 6)) * lvl, d * .95)
        if sec_name == "C" and sp.get("counter") is not None:
            if bar % 2 == 0:
                cn = sorted(tones)[-1] + 12
                song.note(CNT, b0, cn, 44 * lvl, beats * 1.9)
        if sp.get("bell") is not None and sec_name in ("A", "brk") and bar % 4 == 3:
            sn = scale_notes(key, sc, key + 24, key + 36)
            for j in range(3): song.note(EXTRA if not sp.get("lead2") else CNT, b0 + j * (beats / 3), sn[rng.integers(len(sn))], 34 * lvl, beats / 3)
        # 드럼
        if sp.get("drums") and sec_name in ("A", "B", "C") + (("intro", "brk") if sp.get("drums_all") else ()):
            drums(song, sp["drums"], b0, beats, lvl, bar, sp.get("swing", 0))
        # 긴장 효과: 4마디마다 큰 북·심벌 스웰
        if sp.get("hits") and bar % 4 == 0:
            song.note(9, b0, CR, 40 * lvl, 2); song.note(EXTRA if sp.get("bell") is None else CNT, b0, key - 12, 70 * lvl, beats * 3.8)
    progs = {LEAD: sp["lead"], CNT: sp.get("counter") or 48, COMP: sp["comp_ins"], BASS: sp.get("bass_ins", 33), PAD: sp.get("pad") if sp.get("pad") is not None else 89, EXTRA: sp.get("lead2") or sp.get("bell") or sp.get("hit_ins", 47)}
    vols = {LEAD: 100, CNT: 70, COMP: 84, BASS: 92, PAD: 64, EXTRA: 80, 9: 76}
    return song, progs, vols

def render(song, progs, vols, sec):
    """music.render 와 같되, 음량을 곡 전체 기준으로 맞추고(긴장 곡은 갈수록 커짐) 넘침은 부드럽게 누른다."""
    import subprocess, tempfile
    with tempfile.TemporaryDirectory() as d:
        mp, wp = Path(d) / "a.mid", Path(d) / "a.wav"
        song.save(mp, progs, vols)
        subprocess.run(["fluidsynth", "-ni", "-g", "0.4", "-r", str(M.SR), "-F", str(wp), M.SF2, str(mp)], check=True, capture_output=True)
        with wave.open(str(wp)) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).astype(np.float64) / 32768
    n = int(sec * M.SR); x = x[:n] if len(x) >= n else np.pad(x, ((0, n - len(x)), (0, 0)))
    x = x * (np.clip((n - np.arange(n)) / (2.5 * M.SR), 0, 1)[:, None] ** 2)
    x = x * (10 ** (-22 / 20) / (np.sqrt(np.mean(x ** 2)) or 1))
    return np.tanh(x * 1.2) / 1.2

def main():
    tracks, out, sec = json.load(open(sys.argv[1])), Path(sys.argv[2]), float(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    for i, (k, sp) in enumerate(tracks.items()):
        if k.startswith("_"): continue
        song, progs, vols = compose(sp, sec, 7000 + i * 13)
        x = render(song, progs, vols, sec)
        with wave.open(str(out / f"{k}.wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(M.SR)
            w.writeframes((x * 32767).astype(np.int16).tobytes())
        print(k, sp.get("_name", ""), flush=True)

if __name__ == "__main__":
    main()
