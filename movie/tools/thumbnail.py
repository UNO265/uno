"""쇼츠 커버(썸네일) 1080×1920을 만든다. 기준은 guide/01_COVER.md.

- 원본 영상의 한 프레임에서 영화 화면만 세로 9:16으로 잘라 키운다.
- 제목 2줄(1줄 흰색, 2줄 노란 그라데이션). 1줄 위 끝 61.4%, 줄 간격 1.4%, 2줄 아래 끝 87.6% 이내(guide/01_COVER.md, 2026-10-07).
  두 줄 모두 좌우(x 4.5~95.8%)를 같은 비율 확대로 꽉 채운다 → 글자 수가 적은 줄은 글자가 커진다. 가로로 늘리지 않는다.
설정: projects/<slug>/thumb.json   사용: python3 tools/thumbnail.py <slug>
"""
import json, subprocess, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = {"dela": (str(ROOT / "work/fonts/DelaGothicOne-Regular.ttf"), None),
         "noto-black": (str(ROOT / "work/fonts/NotoSansJP-VF.ttf"), "Black"),
         # 2026-10-07 사용자 지정 썸네일 폰트(GPT 썸네일 글자와 가장 비슷): M PLUS 1p Black, 자간을 좁혀 쓴다
         "mplus-black": (str(ROOT / "assets/fonts/MPLUS1p-Black.ttf"), None)}
W, H = 1080, 1920
TOP, BOTTOM = int(H * 0.614), int(H * 0.876)  # 2026-10-07 사용자 확정 위치(guide/01_COVER.md)
SIDE = int(W * 0.045)
GAP_RATIO = 0.014


def frame(src, t, crop, top_h=None, top_y=0, grade=""):
    """top_h가 있으면 장면을 위쪽 top_h px에 맞추고, 아래는 같은 장면을 흐리고 어둡게 늘려 채운다(제목이 중요한 피사체를 덮지 않게)."""
    out = ROOT / "work/_thumb_frame.png"
    h = top_h or H
    seek = [] if str(src).endswith(".png") else ["-ss", str(t)]
    subprocess.run(["ffmpeg", "-v", "error", "-y", *seek, "-i", str(src), "-frames:v", "1",
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


def text_layer(lines, sizes, font="dela", scale_x=1.0, style="gpt", tracking=0.0):
    """lines: [(텍스트, 'white'|'yellow')], sizes: 각 줄 글자 크기. 줄마다 RGBA 이미지와 실제 글자 상자를 돌려준다."""
    out = []
    for (txt, col), size in zip(lines, sizes):
        path, var = FONTS[font]
        f = ImageFont.truetype(path, size)
        if var: f.set_variation_by_name(var)
        trk = int(size * tracking)  # 자간(음수면 좁게)
        adv = [f.getlength(ch) for ch in txt]
        l, t, r, b = f.getbbox(txt)
        w, h = int(sum(adv) + trk * (len(txt) - 1) - l), b - t
        pad = 40
        mask = Image.new("L", (w + pad * 2, h + pad * 2), 0)
        dm = ImageDraw.Draw(mask); xx = pad - l
        for ch, a in zip(txt, adv):
            dm.text((xx, pad - t), ch, font=f, fill=255); xx += a + trk
        bb = mask.getbbox()  # 실제 글자 상자로 다시 맞춤
        if bb:
            mask = mask.crop((bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad)); w, h = bb[2] - bb[0], bb[3] - bb[1]
        if style == "gpt":  # GPT 썸네일 글자처럼 획을 조금 더 굵게
            mask = mask.filter(ImageFilter.MaxFilter(3))
        if scale_x != 1.0:  # 장체(가로로 좁힌 글자) — 참고 썸네일처럼 세로로 길게
            mask = mask.resize((int(mask.size[0] * scale_x), mask.size[1]), Image.LANCZOS)
            w = int(w * scale_x); pad_x = int(pad * scale_x)
        else:
            pad_x = pad
        # style "gpt"(2026-10-07 기본): GPT 썸네일과 같은 느낌 — 흰 줄 순백→연회색, 노랑 #FFEC00→#FFB800, 넓고 진한 그림자
        grad = Image.new("RGB", mask.size)
        g = ImageDraw.Draw(grad)
        for y in range(mask.size[1]):
            k = min(1, max(0, (y - pad) / max(1, h)))
            if col == "yellow":
                c = (255, int(236 - 52 * k), 0) if style == "gpt" else (255, int(236 - 40 * k), int(40 - 40 * k))
            else:
                c = (int(255 - 50 * k ** 1.5),) * 2 + (int(255 - 44 * k ** 1.5),) if style == "gpt" else (255, 255, 255)
            g.line([(0, y), (mask.size[0], y)], fill=c)
        layer = Image.new("RGBA", mask.size, (0, 0, 0, 0))
        # 그림자(번진 검정) + 얇은 검은 테두리
        if style == "gpt":
            sh = mask.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(18))
            layer.paste((0, 0, 0, 255), (8, 12), sh.point(lambda v: min(255, int(v * 1.1))))
            edge = mask.filter(ImageFilter.MaxFilter(5))
        else:
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
    # image: 원본이 저화질(720p 등)이면 미리 Real-ESRGAN으로 키운 장면 사진을 쓴다(crop은 그 사진 기준)
    img = frame(ROOT / cfg.get("image", S["source"]), cfg["time"], cfg["crop"], cfg.get("top_h"), cfg.get("top_y", 0), cfg.get("grade", ""))
    # 아래쪽을 어둡게(글자 대비)
    shade = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shade)
    for y in range(H):
        k = max(0, (y - H * 0.5) / (H * 0.5))
        d.line([(0, y), (W, y)], fill=int(170 * k ** 1.3))
    img.paste((0, 0, 0), (0, 0), shade)

    # 줄마다 글자 크기를 바꿔 좌우를 꽉 채운다(같은 비율). 두 줄 높이가 띠를 넘으면 같은 비율로 줄인다.
    gap = int(H * GAP_RATIO)
    sizes = list(cfg.get("sizes", [200, 200]))
    font, sx, style = cfg.get("font", "mplus-black"), cfg.get("scale_x", 1.0), cfg.get("style", "gpt")
    trk = cfg.get("tracking", -0.06)
    for _ in range(4):
        layers = text_layer(cfg["lines"], sizes, font, sx, style, trk)
        sizes = [max(20, int(sz * (W - 2 * SIDE) / w)) for sz, (_, w, _, _) in zip(sizes, layers)]
    layers = text_layer(cfg["lines"], sizes, font, sx, style, trk)
    while sum(h for _, _, h, _ in layers) + gap * (len(layers) - 1) > BOTTOM - TOP:
        sizes = [int(v * 0.98) for v in sizes]
        layers = text_layer(cfg["lines"], sizes, font, sx, style, trk)
    y = TOP  # 1줄 위 끝 61.4% 고정
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
          f"({y0 / H:.1%}–{y1 / H:.1%} of height; rule top 61.4%, bottom ≤87.6%, sides filled)")


if __name__ == "__main__":
    main()
