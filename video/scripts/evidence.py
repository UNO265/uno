"""public/evidence/ にある実際の素材ファイルを src/evidence.json に書き出す。

Evidence フレームはこの一覧に載っているファイルだけを実写として表示し、
無いものはカネナゾ風のグラフィックで代替する。
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXT = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"}
files = sorted(p.name for p in (ROOT / "public" / "evidence").glob("*") if p.suffix.lower() in EXT)
(ROOT / "src" / "evidence.json").write_text(json.dumps({"files": files}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print("evidence:", files or "(none)")
