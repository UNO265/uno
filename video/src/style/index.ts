// スタイル比較用の静止画（本編には使わない）
import React from "react";
import { Composition, registerRoot } from "remotion";
import { StyleB } from "./Frames";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "StyleB", component: StyleB, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
  );
registerRoot(Root);
