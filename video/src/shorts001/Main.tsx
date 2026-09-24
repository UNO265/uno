/** CASE #001 のショート 3 本（縦 1080×1920）。音声・BGM の混ぜ方は本編と同じ考え方 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import t1 from "../../public/case001_shorts/short1/timeline.json";
import t2 from "../../public/case001_shorts/short2/timeline.json";
import t3 from "../../public/case001_shorts/short3/timeline.json";
import c1 from "../../public/case001_shorts/short1/music/cues.json";
import c2 from "../../public/case001_shorts/short2/music/cues.json";
import c3 from "../../public/case001_shorts/short3/music/cues.json";
import { CutData, CutProps, clamp, sec } from "../lib";
import { C } from "../theme";
import { SHORT1 } from "./short1";
import { SHORT2 } from "./short2";
import { SHORT3 } from "./short3";

type Cue = { file: string; from: number; to: number; mood: string };
type Tl = { totalFrames: number; cuts: unknown[] };

const make = (tl: Tl, cueList: Cue[], screens: Record<string, React.FC<CutProps>>) => {
  const cuts = tl.cuts as CutData[];
  const VOICE = cuts.flatMap((c) => c.segments.map((s) => [c.from + sec(s.start), c.from + sec(s.end)] as [number, number]));
  const DUCK = 0.3;
  const smooth = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
  const duck = (f: number) => {
    let g = 1;
    for (const [a, b] of VOICE) {
      if (f >= a && f <= b) return DUCK;
      if (f < a && a - f < 8) g = Math.min(g, DUCK + (1 - DUCK) * smooth((a - f) / 8));
      if (f > b && f - b < 20) g = Math.min(g, DUCK + (1 - DUCK) * smooth((f - b) / 20));
    }
    return g;
  };
  const Comp: React.FC = () => (
    <AbsoluteFill style={{ background: C.paper }}>
      {cuts.map((c) => {
        const S = screens[c.id];
        if (!S) throw new Error(`ショート: ${c.id} の画面がありません`);
        return (
          <Sequence key={c.id} from={c.from} durationInFrames={c.duration} name={c.id}>
            <S cut={c} />
          </Sequence>
        );
      })}
      {cueList.map((cue) => {
        const len = cue.to - cue.from;
        return (
          <Sequence key={cue.file} from={cue.from} durationInFrames={len} layout="none">
            <Audio
              src={staticFile(cue.file)}
              volume={(f) => 0.4 * interpolate(f, [0, 12, len - 30, len], [0, 1, 1, 0], clamp) * duck(cue.from + f)}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
  return { Comp, frames: tl.totalFrames };
};

export const SHORTS = [
  { id: "Short001-1", ...make(t1, c1 as Cue[], SHORT1) },
  { id: "Short001-2", ...make(t2, c2 as Cue[], SHORT2) },
  { id: "Short001-3", ...make(t3, c3 as Cue[], SHORT3) },
];
