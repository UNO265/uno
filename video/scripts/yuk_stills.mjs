import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const [entry, comp, outDir, framesArg] = process.argv.slice(2);
const frames = framesArg.split(",").map((x) => x.split(":"));
const serveUrl = await bundle({ entryPoint: path.resolve(entry) });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable, chromiumOptions: { gl: "angle" } });
for (const [name, f] of frames) {
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${outDir}/${name}.jpg`, imageFormat: "jpeg", scale: 0.5, browserExecutable, chromiumOptions: { gl: "angle" } });
  console.log("still", name);
}
