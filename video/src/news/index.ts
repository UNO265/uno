// ニュースグラフィックの試作（静止画）
import React from "react";
import { Composition, registerRoot } from "remotion";
import { ChartCustomers, ChartDiet, ChartSpend } from "./Chart";

const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    ...([["ChartCustomers", ChartCustomers], ["ChartSpend", ChartSpend], ["ChartDiet", ChartDiet]] as const).map(([id, c]) =>
      React.createElement(Composition, { key: id, id, component: c, durationInFrames: 1, fps: 30, width: 1920, height: 1080 }),
    ),
  );
registerRoot(Root);
