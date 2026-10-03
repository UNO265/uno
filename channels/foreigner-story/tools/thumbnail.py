"""タビノメ 썸네일 — 원본의 실제 프레임 + 2줄 제목(06_THUMBNAIL 기준). 얼굴을 다시 그리지 않는다.

사용:
  python3 thumbnail.py <source.mp4> <시각(초 또는 MM:SS.s)> "<1줄>" "<2줄>" <out.png> [--mode shorts|long] [--cx 0.5] [--zoom 1.0] [--cy 0.5]
  --mode shorts : 1080x1920(9:16). 제목 블록은 높이 61~88% 안, 좌우 여백 5% 이상(TH3).
  --mode long   : 1280x720(16:9). 제목은 왼쪽 아래, 오른쪽 아래 재생 시간 표시 자리(가로 20%·세로 15%)는 비운다(TH4).
  --cx/--cy     : 잘라 낼 영역의 중심(원본 폭·높이 대비 0~1). 얼굴이 위쪽 절반에 오도록 맞춘다.
  --zoom        : 1보다 크면 더 확대(얼굴을 크게).
끝나면 제목 블록의 실제 픽셀 위치를 재서 기준 통과 여부를 출력한다.
"""
import argparse, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = "/home/user/media/fonts/NotoSansJP-Black.ttf"     # Noto Sans JP wght 900 인스턴스
WHITE = ((255, 255, 255), (226, 226, 226))                # 1줄: 순백 → 아주 연한 회색
YELLOW = ((255, 230, 0), (255, 180, 0))                   # 2줄: #FFE600 → #FFB400


def sec(t):
    if ":" in t:
        m, s = t.split(":")
        return int(m) * 60 + float(s)
    return float(t)


def grab(src, t):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1",
                                   "-f", "image2pipe", "-vcodec", "png", "-"])
    from io import BytesIO
    return Image.open(BytesIO(raw)).convert("RGB")


def crop_fill(img, W, H, cx, cy, zoom):
    w, h = img.size
    s = max(W / w, H / h) * zoom
    img = img.resize((round(w * s), round(h * s)), Image.LANCZOS)
    w, h = img.size
    x = min(max(0, round(cx * w - W / 2)), w - W)
    y = min(max(0, round(cy * h - H / 2)), h - H)
    img = img.crop((x, y, x + W, y + H))
    if s > 1.5:                                            # 크게 키웠으면 살짝 선명하게(보정 범위 안)
        img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    return img


def darken_bottom(img, start, strength):
    W, H = img.size
    a = np.array(img).astype(np.float32)
    y = np.arange(H)[:, None, None] / H
    k = 1 - strength * np.clip((y - start) / (1 - start), 0, 1) ** 1.2
    return Image.fromarray(np.clip(a * k, 0, 255).astype(np.uint8))


def darken_left(img, end, strength):
    W, H = img.size
    a = np.array(img).astype(np.float32)
    x = np.arange(W)[None, :, None] / W
    y = np.arange(H)[:, None, None] / H
    k = 1 - strength * np.clip((end - x) / end, 0, 1) * np.clip((y - 0.35) / 0.65, 0, 1)
    return Image.fromarray(np.clip(a * k, 0, 255).astype(np.uint8))


def text_layer(size, text, font, colors):
    """글자 한 줄을 세로 그라데이션으로 칠한 RGBA와 그 글자 영역(bbox)을 돌려준다."""
    W, H = size
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).text((0, 0), text, font=font, fill=255)
    bb = mask.getbbox()
    top, bot = np.array(colors[0], np.float32), np.array(colors[1], np.float32)
    g = np.zeros((H, W, 3), np.float32)
    span = max(1, bb[3] - bb[1])
    tt = np.clip((np.arange(H) - bb[1]) / span, 0, 1)[:, None, None]
    g[:] = top * (1 - tt) + bot * tt
    rgba = np.dstack([g, np.array(mask, np.float32)]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA"), bb


def fit_font(text, height_px, max_w):
    """글자 높이가 height_px 가 되는 크기. 폭이 max_w 를 넘으면 줄인다(위치는 그대로)."""
    size = int(height_px * 1.3)
    for _ in range(40):
        f = ImageFont.truetype(FONT, size)
        bb = f.getbbox(text)
        h, w = bb[3] - bb[1], bb[2] - bb[0]
        if abs(h - height_px) <= 2 and w <= max_w:
            break
        size = max(10, int(size * min(height_px / max(h, 1), max_w / max(w, 1))))
    return ImageFont.truetype(FONT, size)


def place(canvas, lines, bottom, x_mode, margin, gap, max_w=None):
    """lines = [(text, colors, height)] 를 아래 끝이 bottom 이 되게 쌓아 그림자와 함께 올린다.
    글자가 길어 줄어들어도 아래 끝은 그대로(위치를 내리지 않고 크기를 줄인다). 블록 bbox를 돌려준다."""
    W, H = canvas.size
    max_w = max_w or W - 2 * margin - 20
    crops = []
    for text, colors, hh in lines:
        lay, bb = text_layer((W, int(hh * 2.2)), text, fit_font(text, hh, max_w), colors)
        crops.append(lay.crop(bb))
    y = bottom - sum(l.height for l in crops) - gap * (len(crops) - 1)
    layers = []
    for lay in crops:
        x = (W - lay.width) // 2 if x_mode == "center" else margin
        layers.append((lay, x, y))
        y += lay.height + gap
    shadow = Image.new("L", (W, H), 0)
    for lay, x, yy in layers:
        shadow.paste(lay.split()[3], (x, yy), lay.split()[3])
    r = max(8, H // 90)
    sh = shadow.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(r))
    canvas.paste(Image.new("RGB", (W, H), 0), (0, 0), sh.point(lambda v: min(255, int(v * 1.6))))
    edge = shadow.filter(ImageFilter.MaxFilter(5))                   # 얇은 검정 테두리
    canvas.paste(Image.new("RGB", (W, H), 0), (0, 0), edge)
    for lay, x, yy in layers:
        canvas.paste(lay, (x, yy), lay)
    xs = [x for _, x, _ in layers] + [x + l.width for l, x, _ in layers]
    return (min(xs), layers[0][2], max(xs), layers[-1][2] + layers[-1][0].height)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("at"); ap.add_argument("line1"); ap.add_argument("line2"); ap.add_argument("out")
    ap.add_argument("--mode", default="shorts", choices=["shorts", "long"])
    ap.add_argument("--cx", type=float, default=0.5); ap.add_argument("--cy", type=float, default=0.5)
    ap.add_argument("--zoom", type=float, default=1.0)
    a = ap.parse_args()
    frame = grab(a.src, sec(a.at))
    ok = True
    if a.mode == "shorts":
        W, H = 1080, 1920
        img = darken_bottom(crop_fill(frame, W, H, a.cx, a.cy, a.zoom), 0.5, 0.55)
        h1, h2, gap = round(H * 0.10), round(H * 0.135), round(H * 0.015)
        # 아래 끝을 86%(88%까지 여유 2%)에 맞춘다. 블록 높이 최대(10.5+1.5+14=26%)여도 위 끝은 60%대
        bb = place(img, [(a.line1, WHITE, h1), (a.line2, YELLOW, h2)], round(H * 0.86), "center", round(W * 0.05), gap)
        checks = [("위 끝 ≥ 61%", bb[1] / H >= 0.61), ("아래 끝 ≤ 88%", bb[3] / H <= 0.88),
                  ("좌우 여백 ≥ 5%", bb[0] / W >= 0.05 and (W - bb[2]) / W >= 0.05)]
    else:
        W, H = 1280, 720
        img = darken_left(darken_bottom(crop_fill(frame, W, H, a.cx, a.cy, a.zoom), 0.55, 0.45), 0.6, 0.35)
        h1, h2, gap = round(H * 0.11), round(H * 0.15), round(H * 0.02)
        bb = place(img, [(a.line1, WHITE, h1), (a.line2, YELLOW, h2)], round(H * 0.84), "left", round(W * 0.05), gap,
                   max_w=round(W * 0.72))
        ts = (W * 0.80, H * 0.85)                                    # 재생 시간 표시 자리
        checks = [("아래 끝 ≤ 88%", bb[3] / H <= 0.88), ("왼쪽 여백 ≥ 5%", bb[0] / W >= 0.05),
                  ("재생 시간 자리 비움", not (bb[2] > ts[0] and bb[3] > ts[1]))]
    img.save(a.out)
    print(f"{a.out} {W}x{H}  제목 블록 x {bb[0]}~{bb[2]}, y {bb[1]}~{bb[3]} "
          f"({bb[1] / H:.1%}~{bb[3] / H:.1%})")
    for name, good in checks:
        print(("  OK  " if good else "  NG  ") + name)
        ok &= good
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
