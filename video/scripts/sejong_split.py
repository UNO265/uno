"""렌더링된 세종 영상을 다시 압축하지 않고(원본 화질) 전송 한도 이하 크기로 나눈다.

원본의 영상·소리 데이터 조각(packet)을 순서대로 각 파일에 그대로 나눠 담는다. 영상은 키프레임에서,
소리는 그 시각에 맞는 조각에서 자르므로 빠지거나 겹치는 프레임이 없고, 받은 쪽에서 순서대로 이어 붙이면
(재인코딩 없는 concat) 원본과 같은 영상이 된다.

  pip install av
  python3 scripts/sejong_split.py [입력=out/sejong.mp4] [출력 폴더=out/sejong_split] [조각당 최대 MB=25]
"""
import math
import sys
from pathlib import Path

import av

ROOT = Path(__file__).resolve().parent.parent


def main():
    src = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "out/sejong.mp4")
    out = Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / "out/sejong_split")
    max_mb = float(sys.argv[3]) if len(sys.argv) > 3 else 25
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*"):
        f.unlink()
    n = math.ceil(src.stat().st_size / (max_mb * 1048576))

    inp = av.open(str(src))
    v, a = inp.streams.video[0], inp.streams.audio[0]
    dur = float(inp.duration / av.time_base)
    # 1) 키프레임 시각 모으기 → 균등 길이 지점 바로 앞 키프레임을 자르는 점으로
    keys = [float(p.pts * v.time_base) for p in inp.demux(v) if p.is_keyframe and p.pts is not None]
    cuts = [0.0] + [max(k for k in keys if k <= dur * i / n) for i in range(1, n)]
    inp.close()

    inp = av.open(str(src))
    v, a = inp.streams.video[0], inp.streams.audio[0]
    base = src.stem
    names = [f"{base}_part{i + 1}_of{n}.mp4" for i in range(n)]
    outs, vmap, amap, off = [], [], [], []
    for name in names:
        o = av.open(str(out / name), "w", options={"movflags": "+faststart"})
        vmap.append(o.add_stream_from_template(v))
        amap.append(o.add_stream_from_template(a))
        outs.append(o)
        off.append({})
    part_v = 0
    counts = [[0, 0] for _ in range(n)]
    for p in inp.demux(v, a):
        if p.dts is None:
            continue
        s = p.stream
        if s is v:
            # 디코딩 순서로 다음 자르는 점의 키프레임을 만나면 다음 파일로
            if p.is_keyframe and part_v + 1 < n and abs(float(p.pts * v.time_base) - cuts[part_v + 1]) < 1e-6:
                part_v += 1
            i, dst = part_v, vmap
        else:
            t = float(p.pts * a.time_base)
            i = max(j for j in range(n) if j == 0 or t >= cuts[j] - 1e-6)
            dst = amap
        o = off[i].setdefault(s.index, p.pts if i > 0 else 0)
        p.pts -= o
        p.dts -= o
        p.stream = dst[i]
        outs[i].mux(p)
        counts[i][0 if s is v else 1] += 1
    for o in outs:
        o.close()
    inp.close()
    (out / "list.txt").write_text("".join(f"file '{nm}'\n" for nm in names))
    for i, nm in enumerate(names):
        print(f"{nm}  {(out / nm).stat().st_size / 1048576:.1f}MB  from {cuts[i]:.2f}s  video {counts[i][0]}  audio {counts[i][1]}")


if __name__ == "__main__":
    main()
