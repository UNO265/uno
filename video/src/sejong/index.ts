// 세종 영상만 따로 렌더링하는 진입점: npx remotion render src/sejong/index.ts Sejong out/sejong.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSejong, totalSejong } from "./Main";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "Sejong", component: MainSejong, durationInFrames: totalSejong, fps: 30, width: 1920, height: 1080 });

registerRoot(Root);
