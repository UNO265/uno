// 本編の各カットを 3 点（はじめ・なか・おわり）で静止画にし、7 カットずつ 1 枚のシートにまとめる（v3 20番の確認用）。
// 使い方: CASE=004 node scripts/contact_sheet.mjs   → out/contact_case004/sheet1.jpg …
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cs = process.env.CASE ?? "004";
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const AT = (process.env.AT ?? "0.15,0.55,0.95").split(",").map(Number);
const tl = JSON.parse(fs.readFileSync(path.join(root, `public/case${cs}/timeline.json`), "utf8"));
const out = path.join(root, `out/contact_case${cs}`);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: process.env.REMOTION_CHROME ?? null });
const composition = await selectComposition({ serveUrl, id: `Case${cs}`, puppeteerInstance: browser });
const cuts = tl.cuts.filter((c) => !only || only.includes(c.id));
const files = [];
for (const c of cuts) {
  for (const [k, a] of AT.entries()) {
    const frame = c.from + Math.min(c.duration - 1, Math.floor(c.duration * a));
    const file = `${c.id}_${k}.jpg`;
    await renderStill({ serveUrl, composition, frame, output: path.join(out, file), scale: 0.25, imageFormat: "jpeg", puppeteerInstance: browser });
    const t = frame / 30;
    execSync(`ffmpeg -v error -y -i ${file} -vf "drawtext=text='${c.id} ${Math.floor(t / 60)}\\:${(t % 60).toFixed(1).padStart(4, "0")}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.6" _${file} && mv _${file} ${file}`, { cwd: out });
    files.push(file);
  }
}
await browser.close({ silent: true });
const per = AT.length * 7;
for (let g = 0; g * per < files.length; g++) {
  const part = files.slice(g * per, (g + 1) * per);
  const inputs = part.map((f) => `-i ${f}`).join(" ");
  const pos = part.map((_, k) => `${(k % AT.length) * 480}_${Math.floor(k / AT.length) * 270}`).join("|");
  execSync(`ffmpeg -v error -y ${inputs} -filter_complex "xstack=inputs=${part.length}:layout=${pos}:fill=black" -frames:v 1 sheet${g + 1}.jpg`, { cwd: out });
  console.log(`out/contact_case${cs}/sheet${g + 1}.jpg`);
}
