"""세종 영상 바탕 질감: 한지(밝은 종이)·먹 바탕(어두운 종이) PNG 를 만든다. 한 번만 실행하면 된다."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "public/sejong"
W, H = 1920, 1080
rng = np.random.default_rng(1443)


def fibers(n, length, width):
    img = Image.new("L", (W, H), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    for _ in range(n):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        a = rng.uniform(0, np.pi)
        pts = []
        for k in range(6):
            a += rng.normal(0, 0.35)
            x += np.cos(a) * length / 6
            y += np.sin(a) * length / 6
            pts.append((x, y))
        d.line(pts, fill=int(rng.uniform(40, 110)), width=width)
    return np.asarray(img.filter(ImageFilter.GaussianBlur(0.8)), dtype=float) / 255


def make(base, fiber_col, name, grain=6.0):
    noise = rng.normal(0, 1, (H // 4, W // 4))
    cloud = np.asarray(Image.fromarray(((noise - noise.min()) / np.ptp(noise) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(18)), dtype=float) / 255
    fine = rng.normal(0, 1, (H, W))
    fib = fibers(2600, 60, 1) + 0.6 * fibers(500, 140, 2)
    img = np.zeros((H, W, 3))
    for c in range(3):
        img[..., c] = base[c] + (cloud - 0.5) * 22 + fine * grain * 0.3 + fib * (fiber_col[c] - base[c]) * 2.2
    # 가장자리를 살짝 어둡게
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    img *= (1 - 0.12 * np.clip(r - 0.55, 0, 1))[..., None]
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / name, optimize=True)


OUT.mkdir(parents=True, exist_ok=True)
make((236, 228, 210), (250, 246, 236), "hanji.png")
make((22, 19, 16), (48, 42, 35), "meok.png", grain=3.0)
print("ok")
