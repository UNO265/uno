import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main010K, total010k } from "./Main";

const Root: React.FC = () => React.createElement(Composition, { id: "Case010K", component: Main010K, durationInFrames: total010k, fps: 30, width: 1920, height: 1080 });
registerRoot(Root);
