// 육영수 편 진입점: npx remotion render src/yuk/index.ts Yuk out/yuk.mp4 --gl=angle
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainY, totalY } from "./Main";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "Yuk", component: MainY, durationInFrames: totalY, fps: 30, width: 1920, height: 1080 });

registerRoot(Root);
