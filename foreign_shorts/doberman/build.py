"""感動ショート（ドーベルマンと男の子）: 原音 + ナレーション + BGM をミックスし、字幕を焼き込んで 1080x1920 を書き出す。
usage: python3 build.py SRC.mp4 WORK_DIR OUT.mp4 FONT.ttf
  WORK_DIR には narration.py の voice/ と music.py の music/bgm.wav が入っていること。
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, WORK, OUT, FONT = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), sys.argv[4]
HERE = Path(__file__).parent
S = json.loads((HERE / "script.json").read_text())
W, H, FPS, SR = 1080, 1920, 30, 48000
DUR = 38.5


# ---------- audio ----------
def load(path, gain=1.0):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "2", "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2) * gain


def env(points, n):
    """points: [(sec, gain)] を線形補間したゲイン曲線"""
    t = np.arange(n) / SR
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)[:, None].astype(np.float32)


n = int(DUR * SR)
mix = np.zeros((n, 2), np.float32)
narr = np.zeros((n, 2), np.float32)
spans = []
for i, ln in enumerate(S["narration"]):
    v = load(WORK / "voice" / f"{i:02d}.wav")
    a = int(ln["start"] * SR)
    b = min(n, a + len(v))
    narr[a:b] += v[: b - a]
    spans.append((ln["start"], ln["start"] + len(v) / SR))

# ナレーション中は下げる（前後 0.25 秒でなめらかに）
duck_pts = [(0, 1.0)]
for s, e in spans:
    duck_pts += [(s - 0.25, 1.0), (s, 0.0), (e, 0.0), (e + 0.35, 1.0)]
duck_pts.append((DUR, 1.0))
duck = env(duck_pts, n)  # 1 = ナレーションなし, 0 = ナレーション中

orig = load(SRC)[:n]
orig = np.pad(orig, ((0, n - len(orig)), (0, 0)))
# 原音: 普段 0.55、ナレーション中 0.25、男の子の「ごめんね」(31.2–35.2) は 1.1 で前に出す
og = 0.25 + 0.30 * duck
sorry = env([(0, 0), (31.0, 0), (31.4, 1), (35.1, 1), (35.4, 0), (DUR, 0)], n)
og = og * (1 - sorry) + 1.1 * sorry
mix += orig * og

bgm = load(WORK / "music" / "bgm.wav")[:n]
bgm = np.pad(bgm, ((0, n - len(bgm)), (0, 0)))
bg = (0.30 + 0.25 * duck) * env([(0, 0), (0.6, 1), (DUR - 1.2, 1), (DUR, 0)], n)
mix += bgm * bg
mix += narr * 1.0

(WORK / "mix.f32").write_bytes(np.clip(mix, -1, 1).astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(WORK / "mix.f32"),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), str(WORK / "mix.wav")], check=True)

# ---------- subtitles ----------
WHITE, YELLOW, CREAM = (255, 255, 255), (255, 216, 90), (255, 240, 214)
OUTLINE = (40, 26, 18)


def text_layer(lines_spec, size, cy, stroke, fill=WHITE, hl=None, hl_color=YELLOW, lead=1.28, band=False):
    """中央揃えの複数行テロップを RGBA で描く。hl に含まれる語は hl_color で強調。"""
    font = ImageFont.truetype(FONT, size)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lines = lines_spec.split("\n")
    lh = int(size * lead)
    top = int(cy - lh * len(lines) / 2)
    if band:
        pad = int(size * 0.45)
        widest = max(font.getlength(l) for l in lines)
        bd = ImageDraw.Draw(img)
        bd.rounded_rectangle([W / 2 - widest / 2 - pad, top - pad * 0.7, W / 2 + widest / 2 + pad,
                              top + lh * len(lines) + pad * 0.3], radius=28, fill=(0, 0, 0, 120))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    d = ImageDraw.Draw(img)
    for k, line in enumerate(lines):
        segs = [(line, fill)]
        if hl and hl in line:
            a, b = line.split(hl, 1)
            segs = [(a, fill), (hl, hl_color), (b, fill)]
        x = W / 2 - font.getlength(line) / 2
        y = top + k * lh
        for t, c in segs:
            if not t:
                continue
            sd.text((x + 6, y + 8), t, font=font, fill=(0, 0, 0, 170), stroke_width=stroke, stroke_fill=(0, 0, 0, 170))
            d.text((x, y), t, font=font, fill=c, stroke_width=stroke, stroke_fill=OUTLINE)
            x += font.getlength(t)
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    return np.asarray(Image.alpha_composite(shadow, img), np.float32) / 255.0


# タイトル（上部固定）: 画面上 12〜24%（UI と被らない位置）
hook = text_layer(S["hook"], 82, H * 0.17, 9, hl="この子にだけ", band=True)
subs = []  # (start, end, layer)
starts = [ln["start"] for ln in S["narration"]] + [DUR]
for i, ln in enumerate(S["narration"]):
    end = min(spans[i][1] + 0.5, starts[i + 1] - 0.15, DUR)
    subs.append((ln["start"] - 0.05, end, text_layer(ln["sub"], 66, H * 0.66, 8, hl=ln.get("hl"))))
vs = S["voice_sub"]
subs.append((vs["start"], vs["end"], text_layer(vs["text"], 72, H * 0.64, 8, fill=CREAM)))

FADE = 0.18


def alpha_at(t, s, e):
    if t < s or t > e:
        return 0.0
    return min(1.0, (t - s) / FADE, (e - t) / FADE)


# ---------- video ----------
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(SRC), "-t", str(DUR),
                        "-vf", f"scale={W}:{H}:flags=lanczos,unsharp=5:5:0.5,eq=saturation=1.06:contrast=1.03,fps={FPS}",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", str(WORK / "mix.wav"),
                        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUT)],
                       stdin=subprocess.PIPE)
fsize = W * H * 3
f = 0
while True:
    buf = dec.stdout.read(fsize)
    if len(buf) < fsize:
        break
    t = f / FPS
    frame = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32) / 255.0
    layers = [(hook, min(1.0, t / 0.001 if t > 0 else 1.0))]  # 0 フレームから表示（フェードなし）
    layers += [(L, alpha_at(t, s, e)) for s, e, L in subs]
    for L, a in layers:
        if a <= 0:
            continue
        al = L[..., 3:4] * a
        frame = frame * (1 - al) + L[..., :3] * al
    enc.stdin.write((frame * 255 + 0.5).astype(np.uint8).tobytes())
    f += 1
enc.stdin.close()
enc.wait()
dec.wait()
print(f"{f} frames -> {OUT}")
