"""완성 영상의 자막 한 줄마다: 그 순간 화면(자막이 입혀진 것) + 영어 원문 + 원본 위치 → 12칸 대조 시트."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
vid, tl, cues_p, out = sys.argv[1:5]
t = json.load(open(tl)); cues = json.load(open(cues_p))
def plain(s): return s.replace("\\N", "")
by = {}
for c in cues: by.setdefault(plain(c["ja"]), []).append(c)
ev = [e for e in t["events"] if e["kind"] in ("Y", "N")]
F = ImageFont.truetype("/home/user/media/fonts/NotoSansJP-Medium.ttf", 15)
tiles = []
for i, e in enumerate(ev):
    mid = (e["t0"] + e["t1"]) / 2
    png = Path(out) / f"f{i:03d}.png"
    if not png.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{mid:.2f}", "-i", vid, "-frames:v", "1", "-vf", "scale=480:-1", str(png)], check=True)
    im = Image.open(png); W, H = im.size
    tile = Image.new("RGB", (W, H + 64), (20, 20, 20)); tile.paste(im, (0, 0))
    d = ImageDraw.Draw(tile)
    c = by.get(plain(e["ja"]), [{}])[0]
    head = f"#{i + 1} {int(e['t0'] // 60):02d}:{e['t0'] % 60:04.1f}  {c.get('ep', '内レ' if e['kind'] == 'N' else '?')} {c.get('s0', '')}"
    d.text((6, H + 2), head, font=F, fill=(255, 220, 0))
    en = c.get("en", "(ナレーション)" if e["kind"] == "N" else "???")
    d.text((6, H + 22), en[:62], font=F, fill=(230, 230, 230)); d.text((6, H + 41), en[62:124], font=F, fill=(230, 230, 230))
    tiles.append(tile)
for k in range(0, len(tiles), 12):
    sheet = Image.new("RGB", (480 * 3, (tiles[0].size[1]) * 4), (0, 0, 0))
    for j, tl_ in enumerate(tiles[k:k + 12]):
        sheet.paste(tl_, ((j % 3) * 480, (j // 3) * tl_.size[1]))
    sheet.save(Path(out) / f"sheet_{k // 12 + 1:02d}.jpg", quality=80)
print(len(ev), "줄,", (len(tiles) + 11) // 12, "장")
