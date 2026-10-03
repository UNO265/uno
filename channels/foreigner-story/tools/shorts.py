"""タビノメ 쇼츠 — 검은 틀형(05_SHORTS SH4). 원본 한 구간 + 고정 제목 + 화자 색 자막 + 출처.

사용: python3 shorts.py <spec.json> <cues_src.json> <source.mp4> <out.mp4>
spec 예:
{
 "src": [707.4, 750.2],                 # 원본 구간(초)
 "line1": "初めての日本のお菓子",          # 빨강 띠(누가·무엇)
 "line2": "ねるねるねるね",               # 노랑 큰 글자(핵심)
 "credit": "映像：SilkyRonTheRoad（YouTube）",
 "cx": [[707.4, 0.5], [729.0, 0.42], ...]  # 원본 시각별 자르는 위치(0=왼쪽, 1=오른쪽), 사이는 직선으로 이동
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


def main():
    spec_p, cues_p, src, out = sys.argv[1:5]
    spec = json.load(open(spec_p))
    cues = json.load(open(cues_p))
    a, b = spec["src"]
    d = b - a
    tmp = Path(tempfile.mkdtemp(prefix="shorts_"))
    frame_png(spec, tmp / "frame.png")
    n = write_ass(spec, cues, tmp / "subs.ass")
    x = cx_expr(spec.get("cx", [[a, 0.5]]), a)
    fc = (f"[0:v]scale=-2:{VH},crop={W}:{VH}:'{x}':0,setsar=1[v];"
          f"color=c=0x0A0C10:s={W}x{H}:d={d:.3f}:r=30[bg];[bg][v]overlay=0:{VY}[bv];"
          f"[bv][1:v]overlay=0:0,subtitles={tmp / 'subs.ass'}:fontsdir={FONTS},"
          f"fade=t=in:d=0.25,fade=t=out:st={d - 0.3:.3f}:d=0.3,format=yuv420p[vo];"
          f"[0:a]afade=t=in:d=0.2,afade=t=out:st={d - 0.4:.3f}:d=0.4,"
          f"loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,alimiter=limit=0.70:level=disabled[ao]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", src,
                    "-loop", "1", "-t", f"{d:.3f}", "-i", str(tmp / "frame.png"),
                    "-filter_complex", fc, "-map", "[vo]", "-map", "[ao]", "-r", "30",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", out], check=True)
    print(f"{out}  {d:.1f}초, 자막 {n}줄")


if __name__ == "__main__":
    main()
