"""완성 타임라인(assemble.py 의 .timeline.json)에 맞춰 BGM 바닥(music.wav)을 만든다(#003부터, 기성곡 배치).

사용: python3 bgm_bed.py <timeline.json> <bgm_spec.json> <out.wav>
bgm_spec: {"tracks": {"A": "/path/a.mp3", ...},
           "cues": [{"ep": "Ep24", "t": 1020.0, "track": "A", "from": 0.0}, ...   # 그 원본 시각이 나오는 지점부터
                    {"item": 3, "track": null}, ...]}                               # item 번호의 시작부터(null=음악 없음)
- 곡마다 음량을 같은 크기(-23 LUFS)로 맞춘 뒤 깐다(말에 맞춘 감쇄는 mix_bgm.sh 의 sidechain).
- 곡이 짧으면 처음부터 다시 잇고(2초 교차), 곡이 바뀌는 곳은 2초 교차 페이드.
"""
import json, subprocess, sys, tempfile
from pathlib import Path

SR = 48000


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def out_time(tl, c):
    items = tl["items"]
    if "item" in c:
        return items[c["item"]]["start"]
    for it in items:
        if it["type"] == "clip" and it.get("ep") == c["ep"]:
            a, b = map(sec, it["src"])
            if a <= c["t"] < b:
                return it["start"] + (c["t"] - a)
    raise SystemExit(f"그 시각이 든 클립 없음: {c}")


def main():
    tl = json.load(open(sys.argv[1]))
    spec = json.load(open(sys.argv[2]))
    out = sys.argv[3]
    total = tl["items"][-1]["start"] + tl["items"][-1]["dur"]
    tmp = Path(tempfile.mkdtemp(prefix="bgm_"))
    norm = {}
    for k, p in spec["tracks"].items():                      # 곡별 음량 맞춤
        f = tmp / f"{k}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-af", f"loudnorm=I=-23:TP=-3:LRA=11,aresample={SR}",
                        "-ac", "2", str(f)], check=True)
        norm[k] = f
    cues = sorted(((out_time(tl, c), c) for c in spec["cues"]), key=lambda x: x[0])
    segs = []
    for (t0, c), nxt in zip(cues, cues[1:] + [(total, None)]):
        segs.append((t0, nxt[0], c.get("track"), c.get("from", 0.0)))
    parts, X = [], 2.0
    for i, (a, b, k, off) in enumerate(segs):
        d = b - a + (X if i < len(segs) - 1 else 0)
        p = tmp / f"s{i:02d}.wav"
        if k is None:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=stereo", "-t", f"{d:.3f}", str(p)], check=True)
        else:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-ss", f"{off:.3f}", "-i", str(norm[k]),
                            "-t", f"{d:.3f}", "-af", f"afade=t=in:d=1.5,afade=t=out:st={max(0, d - X):.3f}:d={X}", str(p)], check=True)
        parts.append((a, p))
    inputs, fc = [], []
    for i, (a, p) in enumerate(parts):
        inputs += ["-i", str(p)]
        ms = int(a * 1000)
        fc.append(f"[{i}:a]adelay={ms}|{ms}[d{i}]")
    fc.append("".join(f"[d{i}]" for i in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,atrim=0:{total:.3f}[m]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[m]",
                    "-ar", str(SR), "-ac", "2", out], check=True)
    for a, b, k, off in segs:
        print(f"{int(a // 60):02d}:{a % 60:04.1f}–{int(b // 60):02d}:{b % 60:04.1f}  {k or '(무음)'}")
    print(f"→ {out}  {total:.1f}s")


if __name__ == "__main__":
    main()
