import React from "react";
import { Composition, registerRoot } from "remotion";
import timeline from "../public/timeline.json";
import { Main } from "./Main";

const Root: React.FC = () =>
  React.createElement(Composition, {
    id: "Kanenazo",
    component: Main,
    durationInFrames: timeline.totalFrames,
    fps: timeline.fps,
    width: 1920,
    height: 1080,
  });

registerRoot(Root);
