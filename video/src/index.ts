import React from "react";
import { Composition, registerRoot } from "remotion";
import timeline from "../public/timeline.json";
import { Main } from "./Main";
import { Main002, total002 } from "./case002/Main";
import { SHORTS } from "./shorts001/Main";
import { Main003, total003 } from "./case003/Main";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    // CASE #001「100円ショップは、なぜ100円で儲かるのか」
    React.createElement(Composition, {
      id: "Kanenazo",
      component: Main,
      durationInFrames: timeline.totalFrames,
      fps: timeline.fps,
      width: 1920,
      height: 1080,
    }),
    // CASE #002「ラーメン一杯1000円。店には、いくら残る？」
    React.createElement(Composition, {
      id: "Case002",
      component: Main002,
      durationInFrames: total002,
      fps: 30,
      width: 1920,
      height: 1080,
    }),
    // CASE #003「映画館のポップコーン、なぜこんなに高い？」
    React.createElement(Composition, {
      id: "Case003",
      component: Main003,
      durationInFrames: total003,
      fps: 30,
      width: 1920,
      height: 1080,
    }),
    // CASE #001 のショート（縦型）
    ...SHORTS.map((sh) =>
      React.createElement(Composition, { key: sh.id, id: sh.id, component: sh.Comp, durationInFrames: sh.frames, fps: 30, width: 1080, height: 1920 }),
    ),
  );

registerRoot(Root);
