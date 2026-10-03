"""タビノメ 쇼츠 — 검은 틀형(05_SHORTS SH4). 원본 한 구간 + 고정 제목 + 화자 색 자막 + 출처.

사용: python3 shorts.py <spec.json> <cues_src.json> <source.mp4> <out.mp4>
spec 예:
{
 "src": [707.4, 750.2],                 # 원본 구간(초)
 "line1": "初めての日本のお菓子",          # 빨강 띠(누가·무엇)
 "line2": "ねるねるねるね",               # 노랑 큰 글자(핵심)
 "credit": "映像：SilkyRonTheRoad（YouTube）",
 "scenes": [[707.4, 719.16, 0.43, 0.80], ...]  # 컷마다 [시작, 끝, 가운데(0~1), 보이는 폭(0.5625=4:3 가득)]
}
자막은 cues_src 에서 구간 안의 노란 자막(Y)을 그대로 가져온다(04 E9 검수본을 쓸 것).
"""
import json, subprocess, sys, tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONTS = Path("/home/user/media/fonts")
W, H = 1080, 1920
VY, VH = 560, 810                     # 영상 칸(4:3)
BG = (10, 12, 16)
SPK = {"S": "&H0080F6FF", "K": "&H00008AFF", "J": "&H0070E08E", None: "&H0000D4FF"}   # 롱폼과 같은 화자 색(ASS BGR)


def frame_png(spec, path):
    """영상 칸을 뺀 고정 그림(제목·출처)."""
    im = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(str(FONTS / "ZenMaruGothic-Black.ttf"), 64)
    t1 = spec["line1"]
    w1 = d.textlength(t1, font=f1)
    bx = (W - w1) / 2 - 34
    d.rounded_rectangle((bx, 250, bx + w1 + 68, 350), radius=26, fill=(200, 16, 46))
    d.text((bx + 34, 256), t1, font=f1, fill="white")
    size = 108
    while True:
        f2 = ImageFont.truetype(str(FONTS / "ZenMaruGothic-Black.ttf"), size)
        if d.textlength(spec["line2"], font=f2) <= W - 140 or size <= 60:
            break
        size -= 4
    w2 = d.textlength(spec["line2"], font=f2)
    d.text(((W - w2) / 2, 375 + (108 - size) / 2), spec["line2"], font=f2, fill=(255, 226, 0),
           stroke_width=10, stroke_fill=(0, 0, 0))
    fc = ImageFont.truetype(str(FONTS / "NotoSansJP-Medium.ttf"), 30)
    wc = d.textlength(spec["credit"], font=fc)
    d.text(((W - wc) / 2, 1520), spec["credit"], font=fc, fill=(200, 200, 200))
    d.rectangle((0, VY, W, VY + VH), fill=(0, 0, 0, 0))          # 영상 칸은 투명
    im.save(path)


def cx_expr(keys, t0):
    """원본 시각 keyframe → 출력 시각 t 의 crop x 식(직선 보간)."""
    keys = sorted((a - t0, c) for a, c in keys)
    span = f"(iw-{W})"
    e = f"{keys[-1][1]}"
    for (a, ca), (b, cb) in reversed(list(zip(keys, keys[1:]))):
        e = f"if(lt(t,{b:.3f}),{ca}+({cb}-{ca})*(t-{a:.3f})/{max(b - a, 0.01):.3f},{e})"
    return f"{span}*({e})" if len(keys) > 1 else f"{span}*{keys[0][1]}"


def ass_time(t):
    m, s = divmod(max(t, 0), 60)
    return f"0:{int(m):02d}:{s:05.2f}"


def write_ass(spec, cues, path):
    a, b = spec["src"]
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
"""
    for k, c in SPK.items():
        head += f"Style: Y{k or ''},TBN Noto Sans JP Bold,66,{c},{c},&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,6,0,8,80,140,{1395},1\n"
    head += "\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
    lines = []
    for c in cues:
        if c["kind"] != "Y" or not (a - 0.2 <= c["s0"] < b - 0.3):
            continue
        for k, part in enumerate(c["ja"].split("\\N")):       # 한 줄씩
            n = len(c["ja"].split("\\N"))
            s0 = c["s0"] + (c["s1"] - c["s0"]) * k / n - a
            s1 = c["s0"] + (c["s1"] - c["s0"]) * (k + 1) / n - a
            lines.append(f"Dialogue: 0,{ass_time(s0)},{ass_time(min(s1, b - a))},Y{c.get('spk') or ''},,0,0,0,,{part}")
    Path(path).write_text(head + "\n".join(lines) + "\n", encoding="utf-8")
    return len(lines)


def render_video(spec, src, tmp):
    """장면(컷)마다 따로 잘라 영상 칸(1080x810)을 만든 뒤 잇는다.
    scenes: [[시작, 끝, 가운데(원본 폭 대비 0~1), 보이는 폭(원본 폭 대비, 기본 0.5625=4:3 가득)], ...]
    보이는 폭이 4:3보다 넓으면(여럿이 나란히 앉은 장면) 전체를 줄여 넣고 위아래는 같은 장면을 흐리게 깐다."""
    a, b = spec["src"]
    scenes = spec.get("scenes") or [[a, b, 0.5, 0.5625]]
    parts = []
    for i, sc in enumerate(scenes):
        t0, t1, c = sc[0], sc[1], sc[2]
        wf = sc[3] if len(sc) > 3 else 0.5625
        sw, sh = 1280, 540                                    # 원본 크기
        if wf <= 0.5625 + 1e-6:                              # 4:3 가득
            cw = round(sh * 4 / 3)
            x = min(max(0, round(c * sw - cw / 2)), sw - cw)
            vf = f"crop={cw}:{sh}:{x}:0,scale={W}:{VH},setsar=1"
        else:                                                # 넓게 보여 주기
            cw = min(sw, round(wf * sw))
            x = min(max(0, round(c * sw - cw / 2)), sw - cw)
            fh = round(W * sh / cw / 2) * 2
            bx = min(max(0, round(c * sw - 360)), sw - 720)
            vf = (f"split[m][b];[b]crop=720:{sh}:{bx}:0,scale={W}:{VH},boxblur=20:2,eq=brightness=-0.25[bb];"
                  f"[m]crop={cw}:{sh}:{x}:0,scale={W}:{fh}[mm];[bb][mm]overlay=0:({VH}-{fh})/2,setsar=1")
        p = tmp / f"v{i:02d}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-t", f"{t1 - t0:.3f}", "-i", src,
                        "-filter_complex", f"[0:v]{vf},fps=30,format=yuv420p[o]", "-map", "[o]", "-an",
                        "-c:v", "libx264", "-crf", "14", "-preset", "fast", str(p)], check=True)
        parts.append(p)
    (tmp / "list.txt").write_text("".join(f"file '{p}'\n" for p in parts))
    out = tmp / "video.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(tmp / "list.txt"),
                    "-c", "copy", str(out)], check=True)
    return out


def check_audio(path):
    """소리 트랙이 있고 들리는 크기인지 확인(사용자 요청 2026-10-03: 검수 때 항상 소리 확인)."""
    st = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_name,channels",
                         "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    vd = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-vn", "-af", "volumedetect", "-f", "null", "-"],
                        capture_output=True, text=True).stderr
    import re
    mean = re.search(r"mean_volume: (-?[\d.]+)", vd)
    mean = float(mean.group(1)) if mean else None
    ok = bool(st) and mean is not None and mean > -30
    print(f"소리: 트랙 {st or '없음'}, 평균 {mean} dB → {'OK' if ok else 'NG'}")
    return ok


def main():
    spec_p, cues_p, src, out = sys.argv[1:5]
    spec = json.load(open(spec_p))
    cues = json.load(open(cues_p))
    a, b = spec["src"]
    d = b - a
    tmp = Path(tempfile.mkdtemp(prefix="shorts_"))
    frame_png(spec, tmp / "frame.png")
    n = write_ass(spec, cues, tmp / "subs.ass")
    video = render_video(spec, src, tmp)
    fc = (f"color=c=0x0A0C10:s={W}x{H}:d={d:.3f}:r=30[bg];[bg][0:v]overlay=0:{VY}[bv];"
          f"[bv][2:v]overlay=0:0,subtitles={tmp / 'subs.ass'}:fontsdir={FONTS},"
          f"fade=t=in:d=0.25,fade=t=out:st={d - 0.3:.3f}:d=0.3,format=yuv420p[vo];"
          f"[1:a]afade=t=in:d=0.2,afade=t=out:st={d - 0.4:.3f}:d=0.4,"
          f"loudnorm=I=-14:TP=-2:LRA=11,aresample=44100,alimiter=limit=0.70:level=disabled[ao]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", src,
                    "-loop", "1", "-t", f"{d:.3f}", "-i", str(tmp / "frame.png"),
                    "-filter_complex", fc, "-map", "[vo]", "-map", "[ao]", "-r", "30", "-t", f"{d:.3f}",
                    "-c:v", "libx264", "-profile:v", "high", "-level", "4.1", "-preset", "medium", "-crf", "19",
                    "-c:a", "aac", "-ac", "2", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
    print(f"{out}  {d:.1f}초, 자막 {n}줄")
    if not check_audio(out):
        sys.exit(1)


if __name__ == "__main__":
    main()
