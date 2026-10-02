import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main009K, total009k } from "./Main";

const Root: React.FC = () => React.createElement(Composition, { id: "Case009K", component: Main009K, durationInFrames: total009k, fps: 30, width: 1920, height: 1080 });
registerRoot(Root);
