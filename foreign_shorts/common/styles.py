"""チャンネルごとのテンプレート（タイトル帯・字幕のフォントと大きさ）。build.py と thumb.py が共通で使う。
script.json の "channel" で選ぶ（省略時は "a" = チャンネル A。A の見た目は今までと同じ）。
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT_DIR = Path(__file__).resolve().parent.parent / ".fonts"
COLORS = {"white": (255, 255, 255), "yellow": (255, 216, 90), "cream": (255, 240, 214), "red": (255, 48, 48)}
OUTLINE = (40, 26, 18)

STYLES = {
    # チャンネル A: 上 12.5% に角丸の半透明帯（文字幅に合わせる）、Zen Maru Gothic Black 80px、字幕 64px
    "a": dict(title_font=None, title_size=80, title_y=0.125, title_band="round", title_stroke=9,
              title_line=1.28, sub_font=None, sub_size=64, caption_size=68),
    # ニマル（nimaru）: 横幅いっぱいの帯、Dela Gothic One 116px（白 / 赤）、字幕 Mochiy Pop One 74px
    "nimaru": dict(title_font="DelaGothicOne-Regular.ttf", title_size=116, title_y=0.14, title_band="full",
                   title_stroke=7, title_line=1.18, title_red_stroke=(255, 255, 255),
                   sub_font="MochiyPopOne-Regular.ttf", sub_size=74, caption_size=78),
}


def get(S, default_font):
    st = dict(STYLES[S.get("channel", "a")])
    for k in ("title_font", "sub_font"):
        st[k] = str(FONT_DIR / st[k]) if st[k] else default_font
    return st


def render_title(S, st, W, H, y):
    """タイトル帯（RGBA の PIL 画像）。行ごとの color（white / yellow / red）で塗る。"""
    lines = [(l["text"], l["color"]) for l in S["title"]]
    size = st["title_size"]
    max_w = W - (60 if st["title_band"] == "full" else 120)
    font = ImageFont.truetype(st["title_font"], size)
    while max(font.getlength(t) for t, _ in lines) > max_w:
        size -= 2
        font = ImageFont.truetype(st["title_font"], size)
    lh = int(size * st["title_line"])
    top = int(H * y - lh * len(lines) / 2)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if st["title_band"] == "full":
        pad = int(size * 0.3)
        d.rectangle([0, top - pad, W, top + lh * len(lines) + pad * 0.6], fill=(0, 0, 0, 200))
    else:
        widest = max(font.getlength(t) for t, _ in lines)
        pad = int(size * 0.45)
        d.rounded_rectangle([W / 2 - widest / 2 - pad, top - pad * 0.7, W / 2 + widest / 2 + pad,
                             top + lh * len(lines) + pad * 0.3], radius=28, fill=(0, 0, 0, 120))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    stroke = st["title_stroke"]
    for k, (t, c) in enumerate(lines):
        x = W / 2 - font.getlength(t) / 2
        yy = top + k * lh
        outline = st.get("title_red_stroke", OUTLINE) if c == "red" else OUTLINE
        sd.text((x + 5, yy + 7), t, font=font, fill=(0, 0, 0, 170), stroke_width=stroke, stroke_fill=(0, 0, 0, 170))
        d.text((x, yy), t, font=font, fill=COLORS[c], stroke_width=stroke, stroke_fill=outline)
    return Image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(6)), img)
