"""쇼츠 커버(썸네일) 1080×1920을 만든다. 기준은 guide/01_COVER.md.

- 원본 영상의 한 프레임에서 영화 화면만 세로 9:16으로 잘라 키운다.
- 제목 2줄(1줄 흰색, 2줄 노란 그라데이션), 블록은 위 끝 62%·아래 끝 80.7%(guide/01_COVER.md). 넘치면 위치는 그대로 두고 글자를 줄인다.
설정: projects/<slug>/thumb.json   사용: python3 tools/thumbnail.py <slug>
"""
import json, subprocess, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = {"dela": (str(ROOT / "work/fonts/DelaGothicOne-Regular.ttf"), None),
         "noto-black": (str(ROOT / "work/fonts/NotoSansJP-VF.ttf"), "Black")}
W, H = 1080, 1920
TOP, BOTTOM = int(H * 0.62), int(H * 0.807)  # 2026-10-06 사용자 확정 위치(guide/01_COVER.md)
SIDE = int(W * 0.05)


def frame(src, t, crop, top_h=None, top_y=0, grade=""):
    """top_h가 있으면 장면을 위쪽 top_h px에 맞추고, 아래는 같은 장면을 흐리고 어둡게 늘려 채운다(제목이 중요한 피사체를 덮지 않게)."""
    out = ROOT / "work/_thumb_frame.png"
    h = top_h or H
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(src), "-frames:v", "1",
                    "-vf", f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]},scale={W}:{h}:flags=lanczos,unsharp=5:5:0.6" + (f",{grade}" if grade else ""),
                    str(out)], check=True)
    img = Image.open(out).convert("RGB")
    if not top_h:
        return img
    bg = img.resize((W, H)).filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new("RGB", (W, H), (0, 0, 0)), 0.55)
    fade = 160  # 장면 아래 끝을 배경으로 부드럽게
    mask = Image.new("L", (W, h), 255)
    d = ImageDraw.Draw(mask)
    for y in range(h - fade, h):
        d.line([(0, y), (W, y)], fill=int(255 * (h - y) / fade))
    if top_y:  # 장면을 아래로 내리면 위 끝도 흐린 배경으로 부드럽게 잇는다
        for y in range(0, min(fade, h)):
            d.line([(0, y), (W, y)], fill=min(int(255 * y / fade), 255 if y >= h - fade else 255))
    bg.paste(img, (0, top_y), mask)
    return bg


def text_layer(lines, sizes, font="dela", scale_x=1.0):
    """lines: [(텍스트, 'white'|'yellow')], sizes: 각 줄 글자 크기. 줄마다 RGBA 이미지와 실제 글자 상자를 돌려준다."""
    out = []
    for (txt, col), size in zip(lines, sizes):
        path, var = FONTS[font]
        f = ImageFont.truetype(path, size)
        if var: f.set_variation_by_name(var)
        l, t, r, b = f.getbbox(txt)
        w, h = r - l, b - t
        pad = 40
        mask = Image.new("L", (w + pad * 2, h + pad * 2), 0)
        ImageDraw.Draw(mask).text((pad - l, pad - t), txt, font=f, fill=255)
        if scale_x != 1.0:  # 장체(가로로 좁힌 글자) — 참고 썸네일처럼 세로로 길게
            mask = mask.resize((int(mask.size[0] * scale_x), mask.size[1]), Image.LANCZOS)
            w = int(w * scale_x); pad_x = int(pad * scale_x)
        else:
            pad_x = pad
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
        out.append((layer, w, h, (pad_x, pad)))
    return out


def main():
    slug = sys.argv[1]
    P = ROOT / f"projects/{slug}"
    cfg = json.load(open(P / "thumb.json"))
    S = json.load(open(P / "script.json"))
    img = frame(ROOT / S["source"], cfg["time"], cfg["crop"], cfg.get("top_h"), cfg.get("top_y", 0), cfg.get("grade", ""))
    # 아래쪽을 어둡게(글자 대비)
    shade = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shade)
    for y in range(H):
        k = max(0, (y - H * 0.5) / (H * 0.5))
        d.line([(0, y), (W, y)], fill=int(170 * k ** 1.3))
    img.paste((0, 0, 0), (0, 0), shade)

    sizes = list(cfg["sizes"])
    gap = cfg.get("gap", 18)
    while True:  # 폭(좌우 5%)을 넘는 줄만 줄이고, 높이(62~80.7%)를 넘으면 전체를 줄인다
        layers = text_layer(cfg["lines"], sizes, cfg.get("font", "dela"), cfg.get("scale_x", 1.0))
        total = sum(h for _, _, h, _ in layers) + gap * (len(layers) - 1)
        wide = [i for i, (_, w, _, _) in enumerate(layers) if w > W - 2 * SIDE]
        if wide:
            for i in wide: sizes[i] = int(sizes[i] * 0.97)
        elif total > BOTTOM - TOP:
            sizes = [int(v * 0.97) for v in sizes]
        else:
            break
    y = BOTTOM - total  # 블록 아래 끝을 80.7% 선에 맞춘다
    y = max(y, TOP)
    canvas = img.convert("RGBA")
    boxes = []
    for layer, w, h, pad in layers:
        x = (W - w) // 2
        canvas.alpha_composite(layer, (x - pad[0], y - pad[1]))
        boxes.append((x, y, x + w, y + h))
        y += h + gap
    out = ROOT / f"outputs/{slug}/{slug}_thumbnail.png"
    canvas.convert("RGB").save(out)
    x0 = min(b[0] for b in boxes); x1 = max(b[2] for b in boxes); y0 = boxes[0][1]; y1 = boxes[-1][3]
    print(f"wrote {out}  sizes={sizes}  text block x {x0}-{x1}, y {y0}-{y1} "
          f"({y0 / H:.1%}–{y1 / H:.1%} of height; rule 62.0–80.7%)")


if __name__ == "__main__":
    main()
