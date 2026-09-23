import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
// クラウド環境では同梱の Chromium を使う（ローカルでは不要なら削除可）
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
