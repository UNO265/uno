"""쇼츠 커버(썸네일) 1080×1920을 만든다. 기준은 guide/01_COVER.md.

- 원본 영상의 한 프레임에서 영화 화면만 세로 9:16으로 잘라 키운다.
- 제목 2줄(1줄 흰색, 2줄 노란 그라데이션), 블록은 높이 61~88% 안. 넘치면 위치를 내리지 않고 글자를 줄인다.
설정: projects/<slug>/thumb.json   사용: python3 tools/thumbnail.py <slug>
"""
import json, subprocess, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = str(ROOT / "work/fonts/DelaGothicOne-Regular.ttf")
W, H = 1080, 1920
TOP, BOTTOM = int(H * 0.61), int(H * 0.88)
SIDE = int(W * 0.05)


def frame(src, t, crop):
    out = ROOT / "work/_thumb_frame.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(src), "-frames:v", "1",
                    "-vf", f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]},scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6",
                    str(out)], check=True)
    return Image.open(out).convert("RGB")


def text_layer(lines, sizes):
    """lines: [(텍스트, 'white'|'yellow')], sizes: 각 줄 글자 크기. 줄마다 RGBA 이미지와 실제 글자 상자를 돌려준다."""
    out = []
    for (txt, col), size in zip(lines, sizes):
        f = ImageFont.truetype(FONT, size)
        l, t, r, b = f.getbbox(txt)
        w, h = r - l, b - t
        pad = 40
        mask = Image.new("L", (w + pad * 2, h + pad * 2), 0)
        ImageDraw.Draw(mask).text((pad - l, pad - t), txt, font=f, fill=255)
        if col == "yellow":  # 위 밝은 노랑 → 아래 진한 노랑
            grad = Image.new("RGB", mask.size)
            g = ImageDraw.Draw(grad)
            for y in range(mask.size[1]):
                k = min(1, max(0, (y - pad) / max(1, h)))
                g.line([(0, y), (mask.size[0], y)], fill=(255, int(236 - 40 * k), int(40 - 40 * k)))
        else:
            grad = Image.new("RGB", mask.size, (255, 255, 255))
        layer = Image.new("RGBA", mask.size, (0, 0, 0, 0))
        # 그림자(번진 검정) + 얇은 검은 테두리
        sh = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(14))
        layer.paste((0, 0, 0, 255), (6, 10), sh.point(lambda v: int(v * 0.85)))
        edge = mask.filter(ImageFilter.MaxFilter(7))
        layer.paste((10, 10, 10, 255), (0, 0), edge)
        layer.paste(grad, (0, 0), mask)
        out.append((layer, w, h, pad))
    return out


def main():
    slug = sys.argv[1]
    P = ROOT / f"projects/{slug}"
    cfg = json.load(open(P / "thumb.json"))
    S = json.load(open(P / "script.json"))
    img = frame(ROOT / S["source"], cfg["time"], cfg["crop"])
    # 아래쪽을 어둡게(글자 대비)
    shade = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shade)
    for y in range(H):
        k = max(0, (y - H * 0.5) / (H * 0.5))
        d.line([(0, y), (W, y)], fill=int(170 * k ** 1.3))
    img.paste((0, 0, 0), (0, 0), shade)

    sizes = list(cfg["sizes"])
    gap = cfg.get("gap", 18)
    while True:  # 폭(좌우 5%)과 높이(61~88%) 안에 들어갈 때까지 글자를 줄인다
        layers = text_layer(cfg["lines"], sizes)
        total = sum(h for _, _, h, _ in layers) + gap * (len(layers) - 1)
        if max(w for _, w, _, _ in layers) <= W - 2 * SIDE and total <= BOTTOM - TOP:
            break
        sizes = [int(s * 0.96) for s in sizes]
    y = BOTTOM - total  # 블록 아래 끝을 88% 선에 맞춘다(위 끝은 61% 이상)
    y = max(y, TOP)
    canvas = img.convert("RGBA")
    boxes = []
    for layer, w, h, pad in layers:
        x = (W - w) // 2
        canvas.alpha_composite(layer, (x - pad, y - pad))
        boxes.append((x, y, x + w, y + h))
        y += h + gap
    out = ROOT / f"outputs/{slug}/{slug}_thumbnail.png"
    canvas.convert("RGB").save(out)
    x0 = min(b[0] for b in boxes); x1 = max(b[2] for b in boxes); y0 = boxes[0][1]; y1 = boxes[-1][3]
    print(f"wrote {out}  sizes={sizes}  text block x {x0}-{x1}, y {y0}-{y1} "
          f"({y0 / H:.1%}–{y1 / H:.1%} of height; rule 61–88%)")


if __name__ == "__main__":
    main()
