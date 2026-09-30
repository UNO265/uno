"""感動ショート（ドーベルマンと男の子）: 原音 + ナレーション + BGM をミックスし、
上タイトル帯・中央映像・映像上の字幕のレイアウトで 1080x1920 を書き出す。
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


# ---------- レイアウト（上: タイトル帯 / 中: 映像 / 下: 映像のぼかし） ----------
BAND_H = 440                  # タイトル帯 0–440
VID_Y, VID_H = 440, 1160      # 映像 440–1600（元映像 360x387 を y=85 から切り出し）
CROP_Y = 85
NAVY = (17, 22, 36)
SUB_CY = 1335                 # 字幕の中心（映像の下寄り・画面 70% 付近、下部 UI の上）


def title_layer():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, BAND_H], fill=NAVY + (255,))
    font = ImageFont.truetype(FONT, 80)
    colors = {"white": WHITE, "yellow": YELLOW}
    lh = 112
    top = 150
    for k, ln in enumerate(S["title"]):
        x = W / 2 - font.getlength(ln["text"]) / 2
        d.text((x, top + k * lh), ln["text"], font=font, fill=colors[ln["color"]])
    return np.asarray(img, np.float32) / 255.0


def sub_layer(text, fill=WHITE, hl=None, size=60):
    """映像の上に置く字幕: 横いっぱいの半透明の帯（端はぼかす）+ 白文字、強調語は黄色。"""
    font = ImageFont.truetype(FONT, size)
    lines = text.split("\n")
    lh = int(size * 1.35)
    h = lh * len(lines)
    top = int(SUB_CY - h / 2)
    band = Image.new("L", (W, H), 0)
    ImageDraw.Draw(band).rectangle([60, top - 34, W - 60, top + h + 26], fill=150)
    band = band.filter(ImageFilter.GaussianBlur(26))
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    img.putalpha(band)
    d = ImageDraw.Draw(img)
    for k, line in enumerate(lines):
        segs = [(line, fill)]
        if hl and hl in line:
            a, b = line.split(hl, 1)
            segs = [(a, fill), (hl, YELLOW), (b, fill)]
        x = W / 2 - font.getlength(line) / 2
        y = top + k * lh
        for t, c in segs:
            if t:
                d.text((x, y), t, font=font, fill=c, stroke_width=3, stroke_fill=(10, 10, 10))
                x += font.getlength(t)
    return np.asarray(img, np.float32) / 255.0


title = title_layer()
subs = []  # (start, end, layer)
starts = [ln["start"] for ln in S["narration"]] + [DUR]
for i, ln in enumerate(S["narration"]):
    end = min(spans[i][1] + 0.5, starts[i + 1] - 0.15, DUR)
    subs.append((ln["start"] - 0.05, end, sub_layer(ln["sub"], hl=ln.get("hl"))))
vs = S["voice_sub"]
subs.append((vs["start"], vs["end"], sub_layer(vs["text"], fill=CREAM)))

FADE = 0.18


def alpha_at(t, s, e):
    if t < s or t > e:
        return 0.0
    return min(1.0, (t - s) / FADE, (e - t) / FADE)


# ---------- video ----------
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(SRC), "-t", str(DUR),
                        "-filter_complex",
                        f"[0:v]fps={FPS},split[a][b];"
                        f"[b]scale={W}:{H},gblur=sigma=40,eq=brightness=-0.32:saturation=0.8[bg];"
                        f"[a]crop=360:387:0:{CROP_Y},scale={W}:{VID_H}:flags=lanczos,"
                        f"unsharp=5:5:0.5,eq=saturation=1.06:contrast=1.03[fg];"
                        f"[bg][fg]overlay=0:{VID_Y}",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", str(WORK / "mix.wav"),
                        "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
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
    layers = [(title, 1.0)]  # 0 フレームから表示（フェードなし）
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
