// Poly Haven（CC0）の 3D 素材を public/polyhaven/ に取得する（Python なしで動く版）。
//   node scripts/fetch_polyhaven.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "polyhaven");
const RES = "1k";
const MODELS = ["potted_plant_01", "potted_plant_02", "planter_box_01", "shrub_01", "street_lamp_01", "outdoor_table_chair_set_01", "fire_hydrant", "metal_trash_can", "trashbag", "plastic_crate_01", "wooden_crate_01", "painted_wooden_bench", "flower_gazania"];
const TEXTURES = ["clay_plaster", "asphalt_02", "brick_pavement_02"];
const HDRIS = ["brown_photostudio_02"];

const json = async (u) => (await fetch(u, { headers: { "User-Agent": "kanenazo" } })).json();
const save = async (u, p) => {
  if (fs.existsSync(p)) return;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const r = await fetch(u, { headers: { "User-Agent": "kanenazo" } });
  fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
};

for (const m of MODELS) {
  const f = (await json(`https://api.polyhaven.com/files/${m}`)).gltf[RES].gltf;
  await save(f.url, path.join(ROOT, m, `${m}.gltf`));
  for (const [rel, inc] of Object.entries(f.include ?? {})) await save(inc.url, path.join(ROOT, m, rel));
  console.log("model", m);
}
for (const t of TEXTURES) {
  const f = await json(`https://api.polyhaven.com/files/${t}`);
  for (const k of ["Diffuse", "nor_gl", "Rough"]) if (f[k]) await save(f[k][RES].jpg.url, path.join(ROOT, "tex", t, `${k}.jpg`));
  console.log("texture", t);
}
for (const h of HDRIS) {
  const f = await json(`https://api.polyhaven.com/files/${h}`);
  await save(f.hdri[RES].hdr.url, path.join(ROOT, "hdri", `${h}.hdr`));
  console.log("hdri", h);
}
