// 세종 영상: 컷마다 정지 화면을 뽑아 4×4 확인용 시트로 묶는다.
// 사용법: node scripts/sejong_contact.mjs [시작ID] [끝ID]   (AT=0.4,0.9 로 컷당 여러 시점)
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const timeline = JSON.parse(fs.readFileSync(path.join(root, "public/sejong/timeline.json"), "utf8"));
const ids = timeline.cuts.map((c) => c.id);
const [from, to] = process.argv.slice(2);
const i0 = from ? ids.indexOf(from) : 0;
const i1 = to ? ids.indexOf(to) : ids.length - 1;
const AT = (process.env.AT ?? "0.75").split(",").map(Number);
const SCALE = Number(process.env.SCALE ?? 0.25);
const cuts = timeline.cuts.slice(i0, i1 + 1).flatMap((c) => AT.map((a, k) => ({ ...c, at: a, name: AT.length > 1 ? `${c.id}${"abcdefgh"[k]}` : c.id })));
const out = path.join(root, "out/contact_sejong");
fs.mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, "src/sejong/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: process.env.REMOTION_CHROME ?? null });
const composition = await selectComposition({ serveUrl, id: "Sejong", puppeteerInstance: browser });
for (const c of cuts) {
  const frame = c.from + Math.min(c.duration - 1, Math.floor(c.duration * c.at));
  await renderStill({ serveUrl, composition, frame, output: path.join(out, `${c.name}.jpg`), scale: SCALE, imageFormat: "jpeg", puppeteerInstance: browser });
}
await browser.close({ silent: true });
fs.writeFileSync(path.join(out, "list.json"), JSON.stringify(cuts.map((c) => c.name)));
execSync(`python3 ${path.join(root, "scripts/sejong_sheet.py")} ${out}`, { stdio: "inherit" });
