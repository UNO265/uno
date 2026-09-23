import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import timeline from "../public/timeline.json";
import { C, FONT } from "./theme";
import { CutData, CutProps, CutFrame, clamp } from "./lib";
import { C001, C002, C003, C004, C005 } from "./cuts/opening";
import { C006, C007, C008, C009, C010, C011 } from "./cuts/question";

const CUTS: Record<string, React.FC<CutProps>> = { C001, C002, C003, C004, C005, C006, C007, C008, C009, C010, C011 };

/** 未実装カット用の仮画面 */
const Placeholder: React.FC<CutProps> = ({ cut }) => (
  <CutFrame cut={cut}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, fontSize: 80, color: C.line }}>
      {cut.id}
    </AbsoluteFill>
  </CutFrame>
);

const cuts = timeline.cuts as CutData[];
const at = (id: string) => cuts.find((c) => c.id === id)?.from ?? 0;

/**
 * BGM の音量エンベロープ（フレーム → 音量）。
 * [開始カット, 終了カット(含まない), 音量] の区間だけ鳴らし、前後 0.5 秒でフェードする。
 */
const envelope = (ranges: [string, string, number][]) => (f: number) => {
  for (const [a, b, v] of ranges) {
    const s = at(a);
    const e = b === "END" ? timeline.totalFrames : at(b);
    if (f >= s && f < e) return interpolate(f, [s, s + 15, e - 12, e], [0, v, v, 0], clamp);
  }
  return 0;
};

const bgm = envelope([
  ["C001", "C005", 0.28],
  ["C006", "C009", 0.24],
]);
const ambience = envelope([["C001", "C005", 0.6]]);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    {cuts.map((cut) => {
      const Comp = CUTS[cut.id] ?? Placeholder;
      return (
        <Sequence key={cut.id} from={cut.from} durationInFrames={cut.duration} name={cut.id}>
          <Comp cut={cut} />
        </Sequence>
      );
    })}
    <Audio src={staticFile("sfx/bgm.wav")} loop volume={bgm} />
    <Audio src={staticFile("sfx/ambience.wav")} loop volume={ambience} />
  </AbsoluteFill>
);
