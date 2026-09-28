// 정조 편 본편 진입점: npx remotion render src/jeongjo/main-index.ts Jeongjo out/jeongjo.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainJ, totalJ } from "./Main";
import { ThumbJ } from "./Thumb";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "Jeongjo", component: MainJ, durationInFrames: totalJ, fps: 30, width: 1920, height: 1080 }),
    // 썸네일: npx remotion still src/jeongjo/main-index.ts JeongjoThumb out/JEONGJO_thumb.png --scale=0.6667
    React.createElement(Composition, { id: "JeongjoThumb", component: ThumbJ, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
  );

registerRoot(Root);
