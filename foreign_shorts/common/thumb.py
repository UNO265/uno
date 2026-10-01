"""썸네일: 편집본(edit.mp4)의 t 초 프레임에 영상과 같은 확대(zooms)를 적용하고, 위에 제목 띠를 얹는다.
usage: python3 thumb.py SCRIPT.json EDIT.mp4 T OUT.jpg FONT.ttf
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image
import styles

S = json.loads(Path(sys.argv[1]).read_text())
EDIT, T, OUT, FONT = sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
W, H = 1080, 1920
LOOK = "unsharp=5:5:0.6,eq=saturation=1.06:contrast=1.03"
if S.get("layout") == "fit":  # build.py と同じ: 元の比率で置き、まわりはぼかした同じ映像
    fg = (f"[a]scale=-2:{int(H * S['fit_h'])}:flags=lanczos,{LOOK}[fg];[bg][fg]overlay=(W-w)/2:{int(H * S['fit_y'])}"
          if "fit_h" in S else
          f"[a]scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos,{LOOK}[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2")
    vf = ["-filter_complex", f"[0:v]split[a][b];[b]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
                             f"gblur=sigma=40,eq=brightness=-0.22:saturation=0.85[bg];" + fg]
else:
    vf = ["-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},{LOOK}"]
raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(T), "-i", EDIT, "-frames:v", "1", *vf,
                      "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
im = Image.frombytes("RGB", (W, H), raw)


def ease(u):
    u = min(1.0, max(0.0, u))
    return u * u * (3 - 2 * u)


for z in S.get("zooms", []):  # build.py の zoom_at と同じ計算
    if z["t0"] <= T <= z["t1"]:
        k = ease((T - z["t0"]) / z.get("ramp", 0.4))
        if z.get("back"):
            k = min(k, ease((z["t1"] - T) / 0.35))
        z0 = z.get("from", 1.0)
        cx, cy = z.get("cx", 0.5), z.get("cy", 0.5)
        cx0, cy0 = z.get("from_cx", cx), z.get("from_cy", cy)
        zf, cx, cy = z0 + (z["to"] - z0) * k, cx0 + (cx - cx0) * k, cy0 + (cy - cy0) * k
        cw, ch = W / zf, H / zf
        x0 = min(max(cx * W - cw / 2, 0), W - cw)
        y0 = min(max(cy * H - ch / 2, 0), H - ch)
        im = im.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
        break

st = styles.get(S, FONT)  # build.py と同じタイトル帯（チャンネルごとのテンプレート）
im = Image.alpha_composite(im.convert("RGBA"), styles.render_title(S, st, W, H, st["title_y"]))
im.convert("RGB").save(OUT, quality=95)
print("thumb ->", OUT)
