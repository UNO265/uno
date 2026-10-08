"""タビノメ BGM 자체 작곡(2026-10-08 사용자 결정: 직접 만들고, 단조롭지 않게 여러 악기를 조합).
레포 video/scripts/music.py 의 작곡기(FluidSynth + FluidR3_GM, MIT)를 그대로 쓰고, 곡상(moods)만 CASE별로 정한다.
- 장(章)마다 조·템포·편성을 바꾸고, 8마디마다 편성 밀도를 바꾼다(music.compose).
- 같은 CASE 안에서는 짧은 주제 선율(motif)을 악기를 바꿔 반복해 하나의 영상으로 들리게 한다.
사용: python3 compose_bgm.py <moods.json> <out_dir> <seconds_per_track>
moods.json: {"A": {"prog": [...], "bpm": 96, "beats": 4, "lead": "VIBES", "pulse": "pop", "pad": "WARMPAD", ...}, ...}
악기 이름은 music.py 의 상수(VIBES·MARIMBA·NYLON ...)."""
import json, sys, wave
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "video" / "scripts"))
import music as M

def resolve(m):
    m = dict(m)
    for k in ("lead", "pad", "bass", "off", "bell"):
        if isinstance(m.get(k), str):
            m[k] = getattr(M, m[k])
    m.setdefault("pizz", False); m.setdefault("pad", None)
    return m

def main():
    moods, out, sec = json.load(open(sys.argv[1])), Path(sys.argv[2]), float(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    for i, (k, m) in enumerate(moods.items()):
        if k.startswith("_"): continue
        song, prog, vols = M.compose(resolve(m), sec, seed=4000 + i)
        x = M.render(song, prog, vols, sec)
        with wave.open(str(out / f"{k}.wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(M.SR)
            w.writeframes((x * 32767).astype(np.int16).tobytes())
        print(k, m.get("_name", ""), "ok", flush=True)

if __name__ == "__main__":
    main()
