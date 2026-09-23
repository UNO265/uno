import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import timeline from "../public/timeline.json";
import cueList from "../public/music/cues.json";
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
const cues = cueList as Cue[];
const at = (id: string) => cuts.find((c) => c.id === id)?.from ?? 0;

/** ナレーションが鳴っている区間（BGM のダッキング用） */
const VOICE: [number, number][] = cuts.flatMap((c) => c.segments.map((s) => [c.from + sec(s.start), c.from + sec(s.end)] as [number, number]));
const DUCK = 0.33;
const smooth = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
/** 声の直前 0.3 秒でゆっくり下げ、声の後 0.9 秒かけて戻す（急に落ちない） */
const duck = (f: number) => {
  let g = 1;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return DUCK;
    if (f < a && a - f < 9) g = Math.min(g, DUCK + (1 - DUCK) * smooth((a - f) / 9));
    if (f > b && f - b < 27) g = Math.min(g, DUCK + (1 - DUCK) * smooth((f - b) / 27));
  }
  return g;
};

/** カットの途中で BGM を止める区間（冒頭の質問）: [開始, 終了] フレーム */
const c001 = cuts[0];
const hookQ = c001.from + sec(c001.segments[c001.segments.length - 1]?.end ?? 5.2);
const MUTES: [number, number][] = [[hookQ, c001.from + c001.duration]];
const mute = (f: number) => {
  for (const [a, b] of MUTES) {
    if (f >= a - 8 && f <= b + 10) return interpolate(f, [a - 8, a, b, b + 10], [1, 0, 0, 1], clamp);
  }
  return 1;
};

/** 章ごとの BGM（scripts/music.py が作成） */
type Cue = { file: string; from: number; to: number; mood: string };
const BGM_LEVEL: Record<string, number> = { crisis: 0.38, focus: 0.36, resolve: 0.38 };
const CueTrack: React.FC<{ cue: Cue }> = ({ cue }) => {
  const len = cue.to - cue.from;
  const level = BGM_LEVEL[cue.mood] ?? 0.42;
  return (
    <Sequence from={cue.from} durationInFrames={len + 20} layout="none">
      <Audio
        src={staticFile(cue.file)}
        volume={(f) => {
          const g = cue.from + f;
          const fade = interpolate(f, [0, 30, len - 24, len + 20], [0, 1, 1, 0], clamp);
          return level * fade * duck(g) * mute(g);
        }}
      />
    </Sequence>
  );
};

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
    {cues.map((cue) => (
      <CueTrack key={cue.file} cue={cue} />
    ))}
  </AbsoluteFill>
);
