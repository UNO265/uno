"""Poly Haven（CC0）の 3D 素材を public/polyhaven/ に取得する（git には入れない）。

  python3 scripts/fetch_polyhaven.py
"""
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "polyhaven"
RES = "1k"
MODELS = [
    "potted_plant_01", "potted_plant_02", "planter_box_01", "shrub_01", "street_lamp_01",
    "outdoor_table_chair_set_01", "fire_hydrant", "metal_trash_can", "trashbag", "plastic_crate_01",
    "wooden_crate_01", "painted_wooden_bench", "tree_small_02", "flower_gazania",
]
TEXTURES = ["clay_plaster", "asphalt_02", "concrete_pavement", "wood_table_001", "brick_pavement_02"]
HDRIS = ["brown_photostudio_02"]


def get(url: str) -> bytes:
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "kanenazo"}), timeout=60).read()


def save(url: str, path: Path) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(get(url))


def main() -> None:
    for m in MODELS:
        f = json.loads(get(f"https://api.polyhaven.com/files/{m}"))["gltf"][RES]["gltf"]
        save(f["url"], ROOT / m / f"{m}.gltf")
        for rel, inc in f.get("include", {}).items():
            save(inc["url"], ROOT / m / rel)
        print("model", m)
    for t in TEXTURES:
        f = json.loads(get(f"https://api.polyhaven.com/files/{t}"))
        for kind in ("Diffuse", "nor_gl", "Rough"):
            if kind in f:
                save(f[kind][RES]["jpg"]["url"], ROOT / "tex" / t / f"{kind}.jpg")
        print("texture", t)
    for h in HDRIS:
        f = json.loads(get(f"https://api.polyhaven.com/files/{h}"))
        save(f["hdri"][RES]["hdr"]["url"], ROOT / "hdri" / f"{h}.hdr")
        print("hdri", h)


if __name__ == "__main__":
    main()
