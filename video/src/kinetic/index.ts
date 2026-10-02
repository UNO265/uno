// キネティック・タイポの試作
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Opening009, TOTAL009 } from "./Opening009";

const Root: React.FC = () => React.createElement(Composition, { id: "Opening009", component: Opening009, durationInFrames: TOTAL009, fps: 30, width: 1920, height: 1080 });
registerRoot(Root);
