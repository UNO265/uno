"""렌더링된 세종 영상을 다시 압축하지 않고(원본 화질) 전송 한도 이하 크기로 나눈다.

원본의 영상·소리 데이터 조각(packet)을 순서대로 각 파일에 그대로 나눠 담는다. 영상은 키프레임에서,
소리는 그 시각에 맞는 조각에서 자르므로 빠지거나 겹치는 프레임이 없고, 받은 쪽에서 순서대로 이어 붙이면
(재인코딩 없는 concat) 원본과 같은 영상이 된다.

조각 이름은 <이름>_<번호>of<개수>.mp4 이고, 같은 폴더에 join_windows.bat 을 함께 만든다.
받은 쪽에서는 조각과 join_windows.bat 을 한 폴더에 두고 더블클릭하면 <이름>.mp4 로 합쳐진다(ffmpeg 필요).

  pip install av
  python3 scripts/sejong_split.py [입력=out/sejong.mp4] [출력 폴더=out/sejong_split] [조각당 최대 MB=25] [이름=SEJONG]
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
    name = sys.argv[4] if len(sys.argv) > 4 else "SEJONG"
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*"):
        f.unlink()
    inp = av.open(str(src))
    v, a = inp.streams.video[0], inp.streams.audio[0]
    dur = float(inp.duration / av.time_base)
    abr = (a.bit_rate or 192000) / 8  # 소리 초당 바이트
    # 1) 키프레임마다 누적 크기를 재서, 조각이 한도(여유 8%)를 넘기 전 마지막 키프레임에서 자른다
    #    (화면이 복잡한 구간은 데이터가 많아 같은 길이로 자르면 조각 크기가 크게 달라진다)
    limit = max_mb * 1048576 * 0.92
    keys, cum = [], 0  # (키프레임 시각, 그 앞까지의 영상 누적 바이트)
    for p in inp.demux(v):
        if p.pts is None:
            continue
        if p.is_keyframe:
            keys.append((float(p.pts * v.time_base), cum))
        cum += p.size
    keys.append((dur, cum))
    inp.close()
    cuts = [0.0]
    base = (0.0, 0)
    for i in range(1, len(keys)):
        t, c = keys[i]
        if (c - base[1]) + (t - base[0]) * abr > limit and keys[i - 1][0] > base[0]:
            base = keys[i - 1]
            cuts.append(base[0])
    n = len(cuts)

    inp = av.open(str(src))
    v, a = inp.streams.video[0], inp.streams.audio[0]
    names = [f"{name}_{i + 1}of{n}.mp4" for i in range(n)]
    outs, vmap, amap, off = [], [], [], []
    for nm in names:
        o = av.open(str(out / nm), "w", options={"movflags": "+faststart"})
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
    bat = [
        "@echo off",
        'cd /d "%~dp0"',
        f"(for %%i in ({' '.join(str(i + 1) for i in range(n))}) do @echo file '{name}_%%iof{n}.mp4') > list.txt",
        f"ffmpeg -y -f concat -safe 0 -i list.txt -c copy -movflags +faststart {name}.mp4",
        "del list.txt",
        "echo.",
        f"echo Done: {name}.mp4",
        "pause",
    ]
    (out / "join_windows.bat").write_bytes(("\r\n".join(bat) + "\r\n").encode("ascii"))
    for i, nm in enumerate(names):
        print(f"{nm}  {(out / nm).stat().st_size / 1048576:.1f}MB  from {cuts[i]:.2f}s  video {counts[i][0]}  audio {counts[i][1]}")


if __name__ == "__main__":
    main()
