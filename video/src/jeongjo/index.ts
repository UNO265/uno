// 정조 편 룩 테스트 진입점: npx remotion render src/jeongjo/index.ts JeongjoLook out/jeongjo_look_render.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { JeongjoLook, totalLook } from "./Look";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "JeongjoLook", component: JeongjoLook, durationInFrames: totalLook, fps: 30, width: 1920, height: 1080 });

registerRoot(Root);
