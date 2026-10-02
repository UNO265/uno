// スタイル比較用の静止画（本編には使わない）
import React from "react";
import { Composition, registerRoot } from "remotion";
import { StyleB, StyleC } from "./Frames";
import { Style3D } from "./Three";
import { ShortA } from "./shorts/A";
import { ShortB } from "./shorts/B";
import { ShortD } from "./shorts/D";
import { TOTAL } from "./shorts/common";
import { MiniStill } from "./Mini";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "StyleB", component: StyleB, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "StyleC", component: StyleC, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "Style3D", component: Style3D, durationInFrames: 180, fps: 30, width: 1920, height: 1080 }),
    ...([["ShortA", ShortA], ["ShortB", ShortB], ["ShortD", ShortD]] as const).map(([id, c]) => React.createElement(Composition, { key: id, id, component: c, durationInFrames: TOTAL, fps: 30, width: 1080, height: 1920 })),
    React.createElement(Composition, { id: "MiniStill", component: MiniStill, durationInFrames: 150, fps: 30, width: 1920, height: 1080 }),
  );
registerRoot(Root);
