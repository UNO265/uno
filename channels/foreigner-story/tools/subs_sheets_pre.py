"""렌더링 전 자막 대조 시트(04 E9) — 영상 전체를 만들지 않고, 구성안(plan)과 자막(cues)만으로
자막 한 줄마다 「그 순간의 원본 프레임 + 화면에 나올 일본어 자막 + 영어 원문 + 원본 위치」를 한 칸에 모은다.
assemble.py 와 같은 규칙(클립과 겹치는 자막은 모두 표시)으로 표시 자막을 정한다.

사용: python3 subs_sheets_pre.py <plan.json> <cues_all.json> <sources.json> <out_dir>
결과: out_dir/pre_XX.jpg(12칸씩). 내레이션은 정지 화면 위 흰 글자로 함께 넣는다.
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONTS = Path("/home/user/media/fonts")
FJ = ImageFont.truetype(str(FONTS / "NotoSansJP-Bold.ttf"), 19)   # 실제 자막(1280 폭에서 50px)과 같은 비율
FS = ImageFont.truetype(str(FONTS / "NotoSansJP-Medium.ttf"), 15)
W, H = 480, 270


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def frame(src, t, path):
    if not path.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1",
                        "-vf", f"scale={W}:{H}", str(path)], check=True)
    return Image.open(path).convert("RGB")


def draw_sub(im, text, color):
    d = ImageDraw.Draw(im)
    lines = text.split("\\N")
    y = H - 22 - 24 * len(lines)
    for ln in lines:
        w = d.textlength(ln, font=FJ)
        d.text(((W - w) / 2, y), ln, font=FJ, fill=color, stroke_width=3, stroke_fill=(0, 0, 0))
        y += 24


def main():
    plan, cues, srcs, out = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), json.load(open(sys.argv[3])), Path(sys.argv[4])
    out.mkdir(parents=True, exist_ok=True)
    rows, t_out = [], 0.0
    for it in plan["items"]:
        if it["type"] == "clip":
            a, b = map(sec, it["src"])
            for c in sorted((c for c in cues if c.get("ep") == it["ep"] and c["kind"] == "Y"
                             and min(c["s1"], b) - max(c["s0"], a) > 0.3), key=lambda c: c["s0"]):
                mid = (max(c["s0"], a) + min(c["s1"], b)) / 2
                rows.append(dict(ep=it["ep"], t=mid, ja=c["ja"], en=c.get("en", ""), out=t_out + mid - a, kind="Y", spk=c.get("spk", "")))
            t_out += b - a
        elif it["type"] == "freeze":
            rows.append(dict(ep=it["ep"], t=sec(it["at"]), ja=it["narr"], en="(ナレーション)", out=t_out, kind="N"))
            t_out += 6
        elif it["type"] == "card":
            t_out += it["dur"]
    tiles = []
    for i, r in enumerate(rows):
        im = frame(srcs[r["ep"]], r["t"], out / f"p{i:03d}.png")
        draw_sub(im, r["ja"], (255, 230, 0) if r["kind"] == "Y" else (255, 255, 255))
        tile = Image.new("RGB", (W, H + 64), (20, 20, 20)); tile.paste(im, (0, 0))
        d = ImageDraw.Draw(tile)
        d.text((6, H + 2), f"#{i + 1}  (≈{int(r['out'] // 60):02d}:{int(r['out'] % 60):02d})  {r['ep']} {r['t']:.1f}  [{r.get('spk', '')}]", font=FS, fill=(255, 220, 0))
        d.text((6, H + 22), r["en"][:62], font=FS, fill=(230, 230, 230)); d.text((6, H + 41), r["en"][62:124], font=FS, fill=(230, 230, 230))
        tiles.append(tile)
    for k in range(0, len(tiles), 12):
        sheet = Image.new("RGB", (W * 3, (H + 64) * 4))
        for j, tl in enumerate(tiles[k:k + 12]):
            sheet.paste(tl, ((j % 3) * W, (j // 3) * (H + 64)))
        sheet.save(out / f"pre_{k // 12 + 1:02d}.jpg", quality=80)
    print(len(rows), "줄,", (len(tiles) + 11) // 12, "장 →", out)


if __name__ == "__main__":
    main()
