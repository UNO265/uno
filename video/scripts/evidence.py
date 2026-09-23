"""使用権を確認した実写素材の一覧を書き出す。

- CASE #001: public/evidence/ → src/evidence.json（Evidence フレーム）
- CASE #002: public/case002/stock/ → src/case002/stock.json（E 画面の実写スロット）

一覧に載っているファイルだけを実写として表示し、無いものはカネナゾ風のグラフィックで表示する。
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXT = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"}

for src, out in [("public/evidence", "src/evidence.json"), ("public/case002/stock", "src/case002/stock.json")]:
    d = ROOT / src
    files = sorted(p.name for p in d.glob("*") if p.suffix.lower() in EXT) if d.exists() else []
    (ROOT / out).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / out).write_text(json.dumps({"files": files}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{src}:", files or "(none)")
