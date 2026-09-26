import React from "react";
import { Composition, registerRoot } from "remotion";
import timeline from "../public/timeline.json";
import { Main } from "./Main";
import { Main002, total002 } from "./case002/Main";
import { SHORTS } from "./shorts001/Main";
import { SHORTS002 } from "./shorts002/Main";
import { SHORTS003 } from "./shorts003/Main";
import { SHORTS004 } from "./shorts004/Main";
import { Main004, total004 } from "./case004/Main";
import { Thumb001A, Thumb001B } from "./thumbs/Thumb001";
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
    // CASE #004「コインランドリー、人がいないのになぜ儲かる？」
    React.createElement(Composition, {
      id: "Case004",
      component: Main004,
      durationInFrames: total004,
      fps: 30,
      width: 1920,
      height: 1080,
    }),
    // サムネイル（1280×720、静止画）
    ...[
      ["Thumb001A", Thumb001A],
      ["Thumb001B", Thumb001B],
    ].map(([id, comp]) =>
      React.createElement(Composition, { key: id as string, id: id as string, component: comp as React.FC, durationInFrames: 1, fps: 30, width: 1280, height: 720 }),
    ),
    // CASE #001〜#004 のショート（縦型）
    ...[...SHORTS, ...SHORTS002, ...SHORTS003, ...SHORTS004].map((sh) =>
      React.createElement(Composition, { key: sh.id, id: sh.id, component: sh.Comp, durationInFrames: sh.frames, fps: 30, width: 1080, height: 1920 }),
    ),
  );

registerRoot(Root);
