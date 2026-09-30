// 육영수 편 쇼츠: npx remotion render src/yuk/short-index.ts YukShort out/yuk_short.mp4 --gl=angle
import React from "react";
import { Composition, registerRoot } from "remotion";
import { ShortY, totalS } from "./Short";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "YukShort", component: ShortY, durationInFrames: totalS, fps: 30, width: 1080, height: 1920 });

registerRoot(Root);
