"""海外動画 → 日本向けショート（共通ビルド）。script.json の設定だけで作る。
  - 元動画: source.segments で切り出して連結、hold_end 秒だけ最後のフレームを止める、blur で焼き込み文字を隠す
  - 音: 元音声 (source.orig_audio 倍) + ナレーション + BGM（ナレーション中は下げる）→ -14 LUFS
  - 画面: 1080x1920 全画面、上にタイトル帯、ショートの UI を避けた位置に字幕
usage: python3 build.py SCRIPT.json SRC.mp4 WORK_DIR OUT.mp4 FONT.ttf
  WORK_DIR に voice/NN.wav（narration.py）と music/bgm.wav が入っていること。
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = json.loads(Path(sys.argv[1]).read_text())
SRC, WORK, OUT, FONT = Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]), sys.argv[5]
W, H, FPS, SR = 1080, 1920, 30, 48000
src = S["source"]
segs = src["segments"]
HOLD = src.get("hold_end", 0)
DUR = sum(b - a for a, b in segs) + HOLD

# ---------- audio ----------


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "2", "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


def fit(x, n):
    return np.pad(x[:n], ((0, max(0, n - len(x))), (0, 0)))


def env(points, n):
    t = np.arange(n) / SR
    xs, ys = zip(*points)
    return np.interp(t, xs, ys)[:, None].astype(np.float32)


n = int(DUR * SR)
narr = np.zeros((n, 2), np.float32)
spans = []
for i, ln in enumerate(S["narration"]):
    v = load(WORK / "voice" / f"{i:02d}.wav")
    a = int(ln["start"] * SR)
    b = min(n, a + len(v))
    narr[a:b] += v[: b - a]
    spans.append((ln["start"], ln["start"] + len(v) / SR))
pts = [(0, 1.0)]
for s, e in spans:
    pts += [(s - 0.25, 1.0), (s, 0.0), (e, 0.0), (e + 0.35, 1.0)]
duck = env(pts + [(DUR, 1.0)], n)  # 1 = ナレーションなし

mix = narr.copy()
if src.get("orig_audio", 0) > 0:
    orig = np.concatenate([load(SRC)[int(a * SR):int(b * SR)] for a, b in segs])
    mix += fit(orig, n) * src["orig_audio"] * (0.45 + 0.55 * duck)
bgm = fit(load(WORK / "music" / "bgm.wav"), n)
mix += bgm * (0.32 + 0.28 * duck) * env([(0, 0), (0.3, 1), (DUR - 1.0, 1), (DUR, 0)], n)
(WORK / "mix.f32").write_bytes(np.clip(mix, -1, 1).astype(np.float32).tobytes())
RAW = ["-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(WORK / "mix.f32")]
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
meas = subprocess.run(["ffmpeg", "-hide_banner", *RAW, "-af", LN + ":print_format=json", "-f", "null", "-"],
                      capture_output=True, text=True).stderr
mj = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
LN2 = (f"{LN}:measured_I={mj['input_i']}:measured_TP={mj['input_tp']}:measured_LRA={mj['input_lra']}:"
       f"measured_thresh={mj['input_thresh']}:offset={mj['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", *RAW, "-af", LN2, "-ar", str(SR), str(WORK / "mix.wav")], check=True)

# ---------- テロップ ----------
COLORS = {"white": (255, 255, 255), "yellow": (255, 216, 90), "cream": (255, 240, 214)}
OUTLINE = (40, 26, 18)
# Shorts の UI（1080x1920）: 上 0–150px はアイコン、右 x>950・高さ 50–85% はボタン列、下 75% 以下は説明・シークバー
SAFE_CX, SAFE_W = 500, 820


def sparkle(d, cx, cy, r, fill):
    k = r * 0.28
    d.polygon([(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k),
               (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)], fill=fill)


def text_layer(spec, size, cy, stroke=8, fill="white", hl=None, band=False, cx=W / 2, max_w=W - 120,
               sparkles=False, shadow_a=170):
    lines = spec.split("\n")
    font = ImageFont.truetype(FONT, size)
    while max(font.getlength(l) for l in lines) > max_w:
        size -= 2
        font = ImageFont.truetype(FONT, size)
    fill = COLORS[fill]
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lh = int(size * 1.28)
    top = int(cy - lh * len(lines) / 2)
    widest = max(font.getlength(l) for l in lines)
    if band:
        pad = int(size * 0.45)
        ImageDraw.Draw(img).rounded_rectangle([cx - widest / 2 - pad, top - pad * 0.7, cx + widest / 2 + pad,
                                               top + lh * len(lines) + pad * 0.3], radius=28, fill=(0, 0, 0, 120))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd, d = ImageDraw.Draw(shadow), ImageDraw.Draw(img)
    for k, line in enumerate(lines):
        parts = [(line, fill)]
        if hl and hl in line:
            a, b = line.split(hl, 1)
            parts = [(a, fill), (hl, COLORS["yellow"]), (b, fill)]
        x = cx - font.getlength(line) / 2
        y = top + k * lh
        for t, c in parts:
            if t:
                sd.text((x + 5, y + 7), t, font=font, fill=(0, 0, 0, shadow_a), stroke_width=stroke,
                        stroke_fill=(0, 0, 0, shadow_a))
                if stroke:
                    d.text((x, y), t, font=font, fill=c, stroke_width=stroke, stroke_fill=OUTLINE)
                else:
                    d.text((x, y), t, font=font, fill=c)
                x += font.getlength(t)
    if sparkles:
        yc = top + lh * len(lines) / 2 - size * 0.05
        for sx in (cx - widest / 2 - size * 0.75, cx + widest / 2 + size * 0.75):
            sparkle(sd, sx + 4, yc + 5, size * 0.42, (0, 0, 0, 140))
            sparkle(d, sx, yc, size * 0.42, COLORS["yellow"])
            sparkle(d, sx + size * 0.38, yc - size * 0.38, size * 0.18, COLORS["yellow"])
    shadow = shadow.filter(ImageFilter.GaussianBlur(6))
    return np.asarray(Image.alpha_composite(shadow, img), np.float32) / 255.0


title = S["title"]
title_layer = text_layer("\n".join(l["text"] for l in title), 80, H * 0.125, 9,
                         hl=next((l["text"] for l in title if l["color"] == "yellow"), None), band=True)
SUB_Y = S.get("sub_y", 0.63)
layers = []  # (start, end, layer)
starts = [ln["start"] for ln in S["narration"]] + [DUR]
for i, ln in enumerate(S["narration"]):
    end = min(spans[i][1] + 0.5, starts[i + 1] - 0.12, DUR)
    layers.append((ln["start"] - 0.05, end, text_layer(ln["sub"], 64, H * ln.get("y", SUB_Y), hl=ln.get("hl"),
                                                       cx=SAFE_CX, max_w=SAFE_W)))
for c in S.get("captions", []):
    style = c.get("style", "sub")
    if style == "overlay":  # 焼き込み文字の差し替え（元の見た目に合わせて細め・影だけ）
        L = text_layer(c["text"], c.get("size", 58), H * c["y"], stroke=0, fill=c.get("color", "white"),
                       sparkles=c.get("sparkles", False), shadow_a=200)
    else:
        L = text_layer(c["text"], c.get("size", 68), H * c.get("y", SUB_Y), fill=c.get("color", "white"),
                       cx=SAFE_CX, max_w=SAFE_W)
    layers.append((c["start"], c["end"], L))
FADE = 0.15


def alpha_at(t, s, e):
    if t < s or t > e:
        return 0.0
    if s <= 0:  # 0 フレームから出すものはフェードなし
        return min(1.0, (e - t) / FADE)
    return min(1.0, (t - s) / FADE, (e - t) / FADE)


# ---------- video ----------
fc = ["[0:v]fps=30[v0]"]
cur = "v0"
fc.append(f"[{cur}]split={len(segs)}" + "".join(f"[s{i}]" for i in range(len(segs))))
for i, (a, b) in enumerate(segs):
    fc.append(f"[s{i}]trim={a}:{b},setpts=PTS-STARTPTS[t{i}]")
fc.append("".join(f"[t{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[cat]")
fc.append("[cat]null[out]")
# 1) 元の解像度で 切り出し・ぼかし・連結 → 中間ファイル（フレーム数を固定するため一度書き出す）
EDIT = WORK / "edit.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", ";".join(fc), "-map", "[out]",
                "-fps_mode", "cfr", "-r", str(FPS), "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast",
                str(EDIT)], check=True)
# 2) 最後のフレームで hold_end 秒止めて 1080x1920 に拡大（縦横比は保ち、はみ出た左右/上下を切る）
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(EDIT), "-vf",
                        f"tpad=stop_mode=clone:stop_duration={HOLD},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
                        f"crop={W}:{H},"
                        f"unsharp=5:5:0.6,eq=saturation=1.06:contrast=1.03",
                        "-fps_mode", "cfr", "-r", str(FPS), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", str(WORK / "mix.wav"),
                        "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(OUT)],
                       stdin=subprocess.PIPE)
# 焼き込み文字のぼかし: 拡大後の座標で、縁をなだらかにしたマスクで合成（四角い跡を残さない）
blurs = []
for b in src.get("blur", []):
    sx = W / b.get("src_w", 220)
    sy = H / b.get("src_h", 392)
    pad = 60
    x0, y0 = max(0, int(b["x"] * sx) - pad), max(0, int(b["y"] * sy) - pad)
    x1, y1 = min(W, int((b["x"] + b["w"]) * sx) + pad), min(H, int((b["y"] + b["h"]) * sy) + pad)
    mk = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mk).rounded_rectangle([pad * 0.6, pad * 0.6, x1 - x0 - pad * 0.6, y1 - y0 - pad * 0.6],
                                         radius=40, fill=255)
    mk = np.asarray(mk.filter(ImageFilter.GaussianBlur(pad * 0.35)), np.float32)[..., None] / 255.0
    blurs.append({"t0": b["t0"], "t1": b["t1"], "box": (x0, y0, x1, y1), "mask": mk})
fsize = W * H * 3
f = 0
while True:
    buf = dec.stdout.read(fsize)
    if len(buf) < fsize:
        break
    t = f / FPS
    frame = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32) / 255.0
    for bl in blurs:
        if bl["t0"] <= t <= bl["t1"]:
            x0, y0, x1, y1 = bl["box"]
            reg = Image.fromarray((frame[y0:y1, x0:x1] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))
            reg = np.asarray(reg, np.float32) / 255.0
            m = bl["mask"]
            frame[y0:y1, x0:x1] = frame[y0:y1, x0:x1] * (1 - m) + reg * m
    for L, a in [(title_layer, 1.0)] + [(L, alpha_at(t, s, e)) for s, e, L in layers]:
        if a > 0:
            al = L[..., 3:4] * a
            frame = frame * (1 - al) + L[..., :3] * al
    enc.stdin.write((frame * 255 + 0.5).astype(np.uint8).tobytes())
    f += 1
enc.stdin.close()
enc.wait()
dec.wait()
print(f"{f} frames ({f / FPS:.2f}s / planned {DUR:.2f}s) -> {OUT}")
