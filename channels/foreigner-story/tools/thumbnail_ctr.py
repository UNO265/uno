"""タビノメ 클릭형 롱폼 썸네일(1280x720) — 조회수 상위 해외 반응·외국인 체험 썸네일의 공통 구조(06 TH8).

  위: 원본에서 실제로 한 말 「…」(흰색, 두꺼운 검정 테두리)
  아래: 1줄 흰색(누가·상황) + 2줄 노란색 크게(핵심), 두꺼운 검정 테두리
  사진: 반응 얼굴을 크게(확대), 채도·대비를 조금 올림. 오른쪽 아래 재생 시간 자리는 비움.

사용: python3 thumbnail_ctr.py <source.mp4> <시각> "<인용(없으면 -)>" "<1줄>" "<2줄>" <out.png> [--cx --cy --zoom] [--quote-right]
인용은 원본 발언 그대로(번역)만 쓴다. 지어낸 대사·과장 수치 금지(00, 06 TH5).
"""
import argparse, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).parent))
from thumbnail import crop_fill, grab, sec  # noqa: E402

BLACK_FONT = "/home/user/media/fonts/NotoSansJP-Black.ttf"
W, H = 1280, 720


def fit(text, h_px, max_w):
    size = int(h_px * 1.3)
    for _ in range(40):
        f = ImageFont.truetype(BLACK_FONT, size)
        bb = f.getbbox(text)
        h, w = bb[3] - bb[1], bb[2] - bb[0]
        if abs(h - h_px) <= 2 and w <= max_w:
            return f
        size = max(10, int(size * min(h_px / max(h, 1), max_w / max(w, 1))))
    return ImageFont.truetype(BLACK_FONT, size)


def draw_line(img, text, h_px, max_w, x, y_bottom, colors, stroke, align="left"):
    """그라데이션 글자 + 두꺼운 검정 테두리 + 부드러운 그림자. 아래 끝을 y_bottom 에 맞춘다. bbox 반환."""
    f = fit(text, h_px, max_w)
    pad = stroke * 3
    bb = f.getbbox(text, stroke_width=stroke)
    tw, th = bb[2] - bb[0] + 2 * pad, bb[3] - bb[1] + 2 * pad
    fill = Image.new("L", (tw, th), 0); edge = Image.new("L", (tw, th), 0)
    o = (pad - bb[0], pad - bb[1])
    ImageDraw.Draw(edge).text(o, text, font=f, fill=255, stroke_width=stroke, stroke_fill=255)
    ImageDraw.Draw(fill).text(o, text, font=f, fill=255)
    if align == "right":
        x = x - tw
    y = y_bottom - th + pad
    sh = edge.filter(ImageFilter.GaussianBlur(stroke * 1.5))
    img.paste(Image.new("RGB", (tw, th), 0), (x + stroke // 2, y + stroke), sh.point(lambda v: int(v * 0.8)))
    img.paste(Image.new("RGB", (tw, th), 0), (x, y), edge)
    fb = fill.getbbox()
    top, bot = np.array(colors[0], np.float32), np.array(colors[1], np.float32)
    t = np.clip((np.arange(th) - fb[1]) / max(1, fb[3] - fb[1]), 0, 1)[:, None, None]
    g = (top * (1 - t) + bot * t) * np.ones((th, tw, 3), np.float32)
    img.paste(Image.fromarray(g.astype(np.uint8)), (x, y), fill)
    eb = edge.getbbox()
    return (x + eb[0], y + eb[1], x + eb[2], y + eb[3])


def shade(img, top_h, bottom_from):
    a = np.array(img).astype(np.float32)
    y = np.arange(H)[:, None, None] / H
    k = 1 - 0.45 * np.clip((top_h - y) / top_h, 0, 1) - 0.55 * np.clip((y - bottom_from) / (1 - bottom_from), 0, 1)
    return Image.fromarray(np.clip(a * k, 0, 255).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    for k in ("src", "at", "quote", "line1", "line2", "out"):
        ap.add_argument(k)
    ap.add_argument("--cx", type=float, default=0.5); ap.add_argument("--cy", type=float, default=0.5)
    ap.add_argument("--zoom", type=float, default=1.0)
    ap.add_argument("--quote-right", action="store_true", help="인용을 오른쪽 위에")
    ap.add_argument("--text-w", type=float, default=0.74, help="아래 제목의 최대 폭(화면 폭 대비). 얼굴을 가리면 줄인다")
    a = ap.parse_args()
    img = crop_fill(grab(a.src, sec(a.at)), W, H, a.cx, a.cy, a.zoom)
    img = ImageEnhance.Color(img).enhance(1.15)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = shade(img, 0.22 if a.quote != "-" else 0.001, 0.5)
    m = round(W * 0.045)
    white, yellow = ((255, 255, 255), (232, 232, 232)), ((255, 236, 0), (255, 176, 0))
    boxes = []
    if a.quote != "-":
        q = f"「{a.quote}」"
        x = W - m if a.quote_right else m - 10
        boxes.append(draw_line(img, q, round(H * 0.085), round(W * 0.80), x, round(H * 0.16), white, 7,
                               "right" if a.quote_right else "left"))
    b2 = draw_line(img, a.line2, round(H * 0.165), round(W * a.text_w), m, round(H * 0.86), yellow, 10)
    b1 = draw_line(img, a.line1, round(H * 0.105), round(W * a.text_w), m, b2[1] - round(H * 0.01), white, 8)
    boxes += [b1, b2]
    img.save(a.out)
    ok = b2[3] / H <= 0.88 and min(b[0] for b in boxes) >= W * 0.03 and not (b2[2] > W * 0.80 and b2[3] > H * 0.85)
    print(f"{a.out}  아래 끝 {b2[3] / H:.1%}, 글자 폭 최대 {max(b[2] for b in boxes) / W:.0%}  {'OK' if ok else 'NG'}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
