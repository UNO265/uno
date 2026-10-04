import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main011K, total011k } from "./Main";

const Root: React.FC = () => React.createElement(Composition, { id: "Case011K", component: Main011K, durationInFrames: total011k, fps: 30, width: 1920, height: 1080 });
registerRoot(Root);
