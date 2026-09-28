// 세종 쇼츠만 따로 렌더링하는 진입점: npx remotion render src/sejong_short/index.ts SejongShort1 out/sejong_short1.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { ShortSejong1, totalShort } from "./Short";

const Root: React.FC = () =>
  React.createElement(Composition, { id: "SejongShort1", component: ShortSejong1, durationInFrames: totalShort, fps: 30, width: 1080, height: 1920 });

registerRoot(Root);
