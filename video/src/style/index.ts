// スタイル比較用の静止画（本編には使わない）
import React from "react";
import { Composition, registerRoot } from "remotion";
import { StyleB } from "./Frames";
import { ShortA } from "./shorts/A";
import { ShortB } from "./shorts/B";
import { TOTAL } from "./shorts/common";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "StyleB", component: StyleB, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
    ...([["ShortA", ShortA], ["ShortB", ShortB]] as const).map(([id, c]) => React.createElement(Composition, { key: id, id, component: c, durationInFrames: TOTAL, fps: 30, width: 1080, height: 1920 })),
  );
registerRoot(Root);
