// 各カットの 70% 地点の静止画を書き出し、確認用のコンタクトシートを作る。
// 使い方: node scripts/contact.mjs [開始ID] [終了ID]
//   CASE=case002 node scripts/contact.mjs S01 S20   … CASE #002（public/case002/timeline.json）
//   AT=0.3,0.9 で 1 カットにつき複数の時点を書き出す
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CASE = process.env.CASE;
const timeline = JSON.parse(fs.readFileSync(path.join(root, CASE ? `public/${CASE}/timeline.json` : "public/timeline.json"), "utf8"));
const [from = "A", to = "Z999"] = process.argv.slice(2);
const AT = (process.env.AT ?? "0.7").split(",").map(Number);
const cuts = timeline.cuts
  .filter((c) => c.id >= from && c.id <= to)
  .flatMap((c) => AT.map((a, k) => ({ ...c, at: a, id: AT.length > 1 ? `${c.id}${"abcdefgh"[k]}` : c.id })));
const out = path.join(root, CASE ? `out/contact_${CASE}` : "out/contact");
fs.mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: process.env.REMOTION_CHROME ?? null });
const composition = await selectComposition({ serveUrl, id: CASE ? `Case${CASE.slice(4)}` : "Kanenazo", puppeteerInstance: browser });
for (const c of cuts) {
  const frame = c.from + Math.min(c.duration - 1, Math.floor(c.duration * c.at));
  await renderStill({ serveUrl, composition, frame, output: path.join(out, `${c.id}.jpg`), scale: 0.25, imageFormat: "jpeg", puppeteerInstance: browser });
}
await browser.close({ silent: true });

// 4x4 のシートにまとめる
const files = cuts.map((c) => `${c.id}.jpg`);
for (let i = 0; i < files.length; i += 16) {
  const group = files.slice(i, i + 16);
  const list = group.map((f) => `-i ${f}`).join(" ");
  const pad = 16 - group.length;
  const inputs = group.map((_, k) => `[${k}]drawtext=text='${group[k].replace(".jpg", "")}':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6[v${k}]`).join(";");
  const blanks = Array.from({ length: pad }, (_, k) => `color=c=black:s=480x270:d=1[b${k}]`).join(";");
  const all = [...group.map((_, k) => `[v${k}]`), ...Array.from({ length: pad }, (_, k) => `[b${k}]`)].join("");
  const graph = [inputs, blanks, `${all}xstack=inputs=16:layout=${layout()}`].filter(Boolean).join(";");
  execSync(`ffmpeg -v error -y ${list} -filter_complex "${graph}" -frames:v 1 sheet_${String(i / 16 + 1).padStart(2, "0")}.jpg`, { cwd: out });
}
function layout() {
  const pos = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) pos.push(`${c * 480}_${r * 270}`);
  return pos.join("|");
}
console.log("sheets:", fs.readdirSync(out).filter((f) => f.startsWith("sheet")));
