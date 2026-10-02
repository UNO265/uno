"""편집표 JSON의 구간을 원본에서 잘라 이어 붙인 검토용 MP4를 만든다(자막·내레이션 없음).
사용: python3 skeleton.py edl.json source.mp4 out.mp4 [--label]
--label: 좌상단에 「#번호 원본 시각」을 작게 표시(검토용).
구간마다 따로 인코딩한 뒤 이어 붙인다(한 번에 trim하면 메모리가 부족하다)."""
import json, os, subprocess, sys, tempfile

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def main():
    edl, src, out = sys.argv[1:4]
    label = "--label" in sys.argv
    segs = json.load(open(edl))["segments"]
    tmp = tempfile.mkdtemp(prefix="skel_", dir=os.path.dirname(os.path.abspath(out)))
    files, total = [], 0.0
    for i, (a, b, _) in enumerate(segs):
        s, e = sec(a), sec(b)
        d = e - s
        vf = "scale=1280:-2,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black"
        if label:
            vf += (f",drawtext=fontfile={FONT}:text='#{i+1}  src {a.replace(':', chr(92) + ':')}':"
                   "x=12:y=12:fontsize=20:fontcolor=white@0.85:box=1:boxcolor=black@0.5")
        vf += ",fps=25,format=yuv420p"
        f = min(0.06, d / 4)
        af = f"aresample=48000,afade=t=in:d={f},afade=t=out:st={d - f:.3f}:d={f}"
        p = os.path.join(tmp, f"{i:03d}.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, s - 3):.3f}", "-i", src,
                        "-ss", f"{min(3, s):.3f}", "-t", f"{d:.3f}", "-vf", vf, "-af", af,
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
                        "-c:a", "aac", "-b:a", "160k", "-ar", "48000", p], check=True)
        files.append(p)
        total += d
    lst = os.path.join(tmp, "list.txt")
    open(lst, "w").write("".join(f"file '{p}'\n" for p in files))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", "-movflags", "+faststart", out], check=True)
    print(f"{len(segs)} segments, {int(total // 60)}:{total % 60:04.1f}")


if __name__ == "__main__":
    main()
