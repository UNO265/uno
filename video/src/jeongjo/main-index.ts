// 정조 편 본편 진입점: npx remotion render src/jeongjo/main-index.ts Jeongjo out/jeongjo.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainJ, totalJ } from "./Main";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "Jeongjo", component: MainJ, durationInFrames: totalJ, fps: 30, width: 1920, height: 1080 });

registerRoot(Root);
