// 썸네일 v2（A/B 테스트용, 1280×720）
import React from "react";
import { Composition, registerRoot } from "remotion";
import { T006 } from "./T006";

const T = [["T006", T006]] as const;
const Root: React.FC = () =>
  React.createElement(React.Fragment, null, ...T.map(([id, c]) => React.createElement(Composition, { key: id, id, component: c, durationInFrames: 1, fps: 30, width: 1280, height: 720 })));
registerRoot(Root);
