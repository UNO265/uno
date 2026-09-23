import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import timeline from "../public/timeline.json";
import { C, FONT } from "./theme";
import { CutData, CutProps, CutFrame, clamp, sec } from "./lib";
import { C001, C002, C003, C004, C005 } from "./cuts/opening";
import { C006, C007, C008, C009, C010, C011 } from "./cuts/question";
import { PART2 } from "./cuts/part2";
import { PART3 } from "./cuts/part3";

const CUTS: Record<string, React.FC<CutProps>> = {
  C001, C002, C003, C004, C005, C006, C007, C008, C009, C010, C011,
  ...PART2,
  ...PART3,
};

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

/** ナレーションが鳴っている区間（BGM のダッキング用） */
const VOICE: [number, number][] = cuts.flatMap((c) => c.segments.map((s) => [c.from + sec(s.start), c.from + sec(s.end)] as [number, number]));
const duck = (f: number) => {
  let d = Infinity;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return 0.45;
    d = Math.min(d, f < a ? a - f : f - b);
  }
  return interpolate(d, [0, 12], [0.45, 1], clamp);
};

/**
 * BGM の音量。[開始カット, 終了カット(含まない), 音量]。
 * 区間の外は無音（暗転・質問などのパターンブレイクで BGM を止める）。
 */
const envelope = (ranges: [string, string, number][]) => (f: number) => {
  for (const [a, b, v] of ranges) {
    const s = at(a);
    const e = b === "END" ? timeline.totalFrames : at(b);
    if (f >= s && f < e) return interpolate(f, [s, s + 15, e - 12, e], [0, v, v, 0], clamp);
  }
  return 0;
};

const BGM = 0.22;
const bgmLevel = envelope([
  ["C001", "C005", BGM],
  ["C006", "C009", BGM],
  ["C012", "C036", BGM],
  ["C037", "C065", BGM],
  ["C066", "C077", BGM],
  ["C078", "C101", BGM * 0.8],
  ["C102", "C108", BGM],
  ["C109", "C113", BGM],
  ["C114", "C130", BGM],
  ["C131", "END", BGM * 1.3],
]);
const bgm = (f: number) => bgmLevel(f) * duck(f);
const ambience = envelope([["C001", "C005", 0.5]]);

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
