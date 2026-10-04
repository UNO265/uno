"""海外動画 → 日本向けショート（共通ビルド）。script.json の設定だけで作る。
  - 元動画: source.segments で切り出して好きな順番に連結（各区間に speed=スロー/早送り、freeze_end=止め）、
    hold_end 秒だけ最後のフレームを止める、blur で焼き込み文字を隠す
  - 演出: zooms で見せ場に寄る（編集後の時間で指定、なめらかに拡大・戻す）
  - 音: 元音声 (source.orig_audio 倍) + ナレーション + BGM（ナレーション中は下げる）→ -14 LUFS
  - 画面: 1080x1920 全画面、上にタイトル帯、ショートの UI を避けた位置に字幕
usage: python3 build.py SCRIPT.json SRC.mp4 WORK_DIR OUT.mp4 FONT.ttf
  WORK_DIR に voice/NN.wav（narration.py）と music/bgm.wav が入っていること。
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import styles

S = json.loads(Path(sys.argv[1]).read_text())
SRC, WORK, OUT, FONT = Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]), sys.argv[5]
W, H, FPS, SR = 1080, 1920, 30, 48000
ST = styles.get(S, FONT)  # チャンネルごとのテンプレート（common/styles.py）
src = S["source"]
# 区間: [from, to] または {"from", "to", "speed": 0.5 でスロー, "freeze_end": 秒}
segs = [dict(zip(("from", "to"), sg)) if isinstance(sg, list) else dict(sg) for sg in src["segments"]]
for sg in segs:
    sg.setdefault("speed", 1.0)
    sg.setdefault("freeze_end", 0.0)
    sg["len"] = (sg["to"] - sg["from"]) / sg["speed"] + sg["freeze_end"]
HOLD = src.get("hold_end", 0)
DUR = sum(sg["len"] for sg in segs) + HOLD

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
# "voice": false の行（字幕だけ）は無音なので BGM を下げない
for (s, e), ln in zip(spans, S["narration"]):
    if ln.get("voice", True) is False:
        continue
    pts += [(s - 0.25, 1.0), (s, 0.0), (e, 0.0), (e + 0.35, 1.0)]
duck = env(pts + [(DUR, 1.0)], n)  # 1 = ナレーションなし

mix = narr.copy()
if src.get("orig_audio", 0) > 0:
    if any(sg["speed"] != 1 or sg["freeze_end"] for sg in segs):
        sys.exit("orig_audio はスロー・止めのある区間と一緒に使えない（音がずれる）")
    orig = np.concatenate([load(SRC)[int(sg["from"] * SR):int(sg["to"] * SR)] for sg in segs])
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
# 最後にリミッター: 低音の強い BGM でも真のピークを -1.5 dBFS 付近に抑える（音割れ防止）
subprocess.run(["ffmpeg", "-v", "error", "-y", *RAW, "-af", LN2 + ",alimiter=limit=0.82:attack=5:release=50:level=false",
                "-ar", str(SR), str(WORK / "mix.wav")], check=True)

# ---------- テロップ ----------
COLORS, OUTLINE = styles.COLORS, styles.OUTLINE
# Shorts の UI（1080x1920）: 上 0–150px はアイコン、右 x>950・高さ 50–85% はボタン列、下 75% 以下は説明・シークバー
SAFE_CX, SAFE_W = 540, 820  # 字幕は画面の真ん中にそろえる（ユーザー決定）。幅 820 なら x 130–950 で右のボタン列にかからない
# 字幕はセリフごとに "y"（縦の中心）・"x"（横の中心）・"w"（最大幅）を画面比で指定できる。被写体を避けるときに使う


def sparkle(d, cx, cy, r, fill):
    k = r * 0.28
    d.polygon([(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k),
               (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)], fill=fill)


def text_layer(spec, size, cy, stroke=8, fill="white", hl=None, band=False, cx=W / 2, max_w=W - 120,
               sparkles=False, shadow_a=170):
    lines = spec.split("\n")
    font = ImageFont.truetype(ST["sub_font"], size)
    while max(font.getlength(l) for l in lines) > max_w:
        size -= 2
        font = ImageFont.truetype(ST["sub_font"], size)
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


# タイトルの位置: 既定はチャンネルの title_y。被写体が上にある場面だけ "title_pos": [{"t0", "t1", "y"}] で動かす
#   （場面の切り替わりに合わせて t0/t1 を置くと、位置が変わっても不自然にならない）
_title_cache = {}


def title_layer_at(t):
    y = next((p["y"] for p in S.get("title_pos", []) if p["t0"] <= t < p["t1"]), ST["title_y"])
    if y not in _title_cache:
        _title_cache[y] = np.asarray(styles.render_title(S, ST, W, H, y), np.float32) / 255.0
    return _title_cache[y]


SUB_Y = S.get("sub_y", 0.70)  # 字幕は下 70% 固定が既定（ユーザー決定）
layers = []  # (start, end, layer)
starts = [ln["start"] for ln in S["narration"]] + [DUR]
for i, ln in enumerate(S["narration"]):
    end = min(spans[i][1] + 0.5, starts[i + 1] - 0.12, DUR)
    layers.append((ln["start"] - 0.05, end, text_layer(ln["sub"], ST["sub_size"], H * ln.get("y", SUB_Y), hl=ln.get("hl"),
                                                       fill=ln.get("color", "white"),  # 動物の心の声は "cream"
                                                       cx=W * ln["x"] if "x" in ln else SAFE_CX,
                                                       max_w=W * ln["w"] if "w" in ln else SAFE_W)))
for c in S.get("captions", []):
    style = c.get("style", "sub")
    if style == "overlay":  # 焼き込み文字の差し替え（元の見た目に合わせて細め・影だけ）
        L = text_layer(c["text"], c.get("size", 58), H * c["y"], stroke=0, fill=c.get("color", "white"),
                       sparkles=c.get("sparkles", False), shadow_a=200)
    else:
        L = text_layer(c["text"], c.get("size", ST["caption_size"]), H * c.get("y", SUB_Y), fill=c.get("color", "white"),
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
for i, sg in enumerate(segs):
    f_ = f"[s{i}]trim={sg['from']}:{sg['to']},setpts=(PTS-STARTPTS)/{sg['speed']}"
    if sg["freeze_end"]:
        f_ += f",tpad=stop_mode=clone:stop_duration={sg['freeze_end']}"
    fc.append(f_ + f"[t{i}]")
fc.append("".join(f"[t{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[cat]")
fc.append("[cat]null[out]")
# 1) 元の解像度で 切り出し・ぼかし・連結 → 中間ファイル（フレーム数を固定するため一度書き出す）
EDIT = WORK / "edit.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", ";".join(fc), "-map", "[out]",
                "-fps_mode", "cfr", "-r", str(FPS), "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast",
                str(EDIT)], check=True)
# 2) 最後のフレームで hold_end 秒止めて 1080x1920 に拡大（縦横比は保ち、はみ出た左右/上下を切る。layout=fit なら切らずに中央へ）
LOOK = "unsharp=5:5:0.6,eq=saturation=1.06:contrast=1.03"
if S.get("layout") == "fit":
    # 正方形・横長の元動画: 画面の真ん中に元の比率のまま置き、上下（左右）は同じ映像を大きくぼかして敷く
    # fit_h/fit_y を指定すると、映像の高さ（画面比）と上端の位置を決められる（被写体をタイトルの下へ下げるとき）
    vf = ["-filter_complex",
          f"[0:v]tpad=stop_mode=clone:stop_duration={HOLD},split[a][b];"
          f"[b]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,"
          f"eq=brightness=-0.22:saturation=0.85[bg];"
          + (f"[a]scale=-2:{int(H * S['fit_h'])}:flags=lanczos,{LOOK}[fg];[bg][fg]overlay=(W-w)/2:{int(H * S['fit_y'])}"
             if "fit_h" in S else
             f"[a]scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos,{LOOK}[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2")]
else:
    vf = ["-vf", f"tpad=stop_mode=clone:stop_duration={HOLD},scale={W}:{H}:force_original_aspect_ratio=increase:"
                 f"flags=lanczos,crop={W}:{H},{LOOK}"]
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(EDIT), *vf,
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
# 見せ場に寄る: {"t0", "t1", "from": 1.0, "to": 1.25, "cx": 0.5, "cy": 0.45, "from_cx", "from_cy", "ramp": 0.4, "back": true}
#   t0 から ease で from→to 倍まで寄り、t1 まで保つ。back=true なら t1 の手前 0.35 秒で from に戻す
#   from=to にすれば区間ずっと一定の拡大（焼き込み文字を画面外に出すトリミングにも使う）
ZOOMS = S.get("zooms", [])


def ease(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


def zoom_at(t):
    for z in ZOOMS:
        if z["t0"] <= t <= z["t1"]:
            ramp = z.get("ramp", 0.4)
            k = ease((t - z["t0"]) / ramp)
            if z.get("back"):
                k = min(k, ease((z["t1"] - t) / 0.35))
            z0 = z.get("from", 1.0)
            cx, cy = z.get("cx", 0.5), z.get("cy", 0.5)
            cx0, cy0 = z.get("from_cx", cx), z.get("from_cy", cy)  # 中心も一緒に動かせる（被写体を追う）
            return z0 + (z["to"] - z0) * k, cx0 + (cx - cx0) * k, cy0 + (cy - cy0) * k
    return 1.0, 0.5, 0.5


# 解説グラフィック: "marks": [{"type": "arrow"|"circle"|"flash", "t0", "t1", ...}]（編集後の時間・画面比の座標）
#   arrow : "path": [[t, x, y], ...] 矢印の先（下向き）が被写体を追う。"label" は矢印の上の文字
#   circle: "path" の位置に輪、"r" は半径（画面幅比）
#   flash : 白く光ってすっと消える（フック → 本編の切り替え）
MARKS = S.get("marks", [])
MARK_FONT = ImageFont.truetype(ST["sub_font"], 60)


def _pos(path, t):
    if t <= path[0][0]:
        return path[0][1], path[0][2]
    for (ta, xa, ya), (tb, xb, yb) in zip(path, path[1:]):
        if ta <= t <= tb:
            u = (t - ta) / max(tb - ta, 1e-6)
            return xa + (xb - xa) * u, ya + (yb - ya) * u
    return path[-1][1], path[-1][2]


def draw_marks(frame, t):
    act = [mk for mk in MARKS if mk["t0"] <= t <= mk["t1"]]
    if not act:
        return frame
    im = Image.fromarray((frame * 255 + 0.5).astype(np.uint8)).convert("RGBA")
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for mk in act:
        a = min(1.0, (t - mk["t0"]) / 0.12, (mk["t1"] - t) / 0.12)
        if mk["type"] == "flash":
            u = (t - mk["t0"]) / max(mk["t1"] - mk["t0"], 1e-6)
            d.rectangle([0, 0, W, H], fill=(255, 255, 255, int(220 * (1 - u))))
            continue
        x, y = _pos(mk["path"], t)
        x, y = x * W, y * H
        col = (255, 216, 90, int(255 * a))
        dark = (40, 26, 18, int(255 * a))
        if mk["type"] == "arrow":
            L, hw = 150, 38
            for c, grow in ((dark, 7), (col, 0)):
                d.rectangle([x - 11 - grow, y - L - grow, x + 11 + grow, y - hw * 1.2], fill=c)
                d.polygon([(x - hw - grow, y - hw * 1.3 - grow), (x + hw + grow, y - hw * 1.3 - grow),
                           (x, y + grow)], fill=c)
            if mk.get("label"):
                tw = MARK_FONT.getlength(mk["label"])
                d.text((x - tw / 2, y - L - 80), mk["label"], font=MARK_FONT, fill=col, stroke_width=7,
                       stroke_fill=dark)
        elif mk["type"] == "circle":
            r = mk.get("r", 0.12) * W
            d.ellipse([x - r, y - r, x + r, y + r], outline=dark, width=18)
            d.ellipse([x - r + 3, y - r + 3, x + r - 3, y + r - 3], outline=col, width=11)
    return np.asarray(Image.alpha_composite(im, lay).convert("RGB"), np.float32) / 255.0


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
    zf, cx, cy = zoom_at(t)
    if zf > 1.001:
        cw, ch = W / zf, H / zf
        x0 = min(max(cx * W - cw / 2, 0), W - cw)
        y0 = min(max(cy * H - ch / 2, 0), H - ch)
        im = Image.fromarray((frame * 255 + 0.5).astype(np.uint8)).resize((W, H), Image.BICUBIC,
                                                                          box=(x0, y0, x0 + cw, y0 + ch))
        frame = np.asarray(im, np.float32) / 255.0
    frame = draw_marks(frame, t)
    for L, a in [(title_layer_at(t), 1.0)] + [(L, alpha_at(t, s, e)) for s, e, L in layers]:
        if a > 0:
            al = L[..., 3:4] * a
            frame = frame * (1 - al) + L[..., :3] * al
    enc.stdin.write((frame * 255 + 0.5).astype(np.uint8).tobytes())
    f += 1
enc.stdin.close()
enc.wait()
dec.wait()
print(f"{f} frames ({f / FPS:.2f}s / planned {DUR:.2f}s) -> {OUT}")
