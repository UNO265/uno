// ショートの各カット（既定は 80% 地点）を縦長の確認シートにまとめる。
// 使い方: node scripts/shorts_sheet.mjs 1   → out/shorts_sheet_1.jpg
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const n = process.argv[2] ?? "1";
const at = Number(process.env.AT ?? "0.8");
const tl = JSON.parse(fs.readFileSync(path.join(root, `public/case001_shorts/short${n}/timeline.json`), "utf8"));
const out = path.join(root, `out/shorts_stills_${n}`);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: process.env.REMOTION_CHROME ?? null });
const composition = await selectComposition({ serveUrl, id: `Short001-${n}`, puppeteerInstance: browser });
for (const c of tl.cuts) {
  const frame = c.from + Math.min(c.duration - 1, Math.floor(c.duration * at));
  await renderStill({ serveUrl, composition, frame, output: path.join(out, `${c.id}.jpg`), scale: 0.3, imageFormat: "jpeg", puppeteerInstance: browser });
}
await browser.close({ silent: true });
const files = tl.cuts.map((c) => `${c.id}.jpg`);
const inputs = files.map((f) => `-i ${f}`).join(" ");
const pos = files.map((_, k) => `${(k % 5) * 324}_${Math.floor(k / 5) * 576}`).join("|");
execSync(`ffmpeg -v error -y ${inputs} -filter_complex "xstack=inputs=${files.length}:layout=${pos}:fill=black" -frames:v 1 ../shorts_sheet_${n}.jpg`, { cwd: out });
console.log(`out/shorts_sheet_${n}.jpg`);
