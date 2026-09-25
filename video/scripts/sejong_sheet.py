"""out/contact_sejong/*.jpg 를 4×4 시트로 묶는다 (sejong_contact.mjs 가 호출)."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

out = Path(sys.argv[1])
names = json.loads((out / "list.json").read_text())
for k in range(0, len(names), 16):
    group = names[k:k + 16]
    first = Image.open(out / f"{group[0]}.jpg")
    w, h = first.size
    sheet = Image.new("RGB", (w * 4, h * 4), "black")
    d = ImageDraw.Draw(sheet)
    for i, n in enumerate(group):
        x, y = (i % 4) * w, (i // 4) * h
        sheet.paste(Image.open(out / f"{n}.jpg"), (x, y))
        d.rectangle([x, y, x + 60, y + 18], fill="black")
        d.text((x + 4, y + 3), n, fill="white")
    sheet.save(out / f"sheet_{k // 16 + 1:02d}.jpg", quality=88)
    print("sheet", k // 16 + 1)
