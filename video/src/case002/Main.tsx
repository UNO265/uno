/** CASE #002「ラーメン一杯1000円。店には、いくら残る？」 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import timeline from "../../public/case002/timeline.json";
import cueList from "../../public/case002/music/cues.json";
import { CutData, clamp, sec } from "../lib";
import { C } from "../theme";
import { OPEN } from "./open";
import { COST } from "./cost";
import { PARADOX } from "./paradox";
import { FINALE } from "./finale";

const CUTS = { ...OPEN, ...COST, ...PARADOX, ...FINALE } as Record<string, React.FC<{ cut: CutData }>>;

export const cuts002 = timeline.cuts as CutData[];
export const total002 = timeline.totalFrames;
const cues = cueList as Cue[];
const cut = (id: string) => cuts002.find((c) => c.id === id)!;

/* ── BGM のダッキング（v2: BGM は背景。声の前後はなめらかに） ─────────── */
const VOICE: [number, number][] = cuts002.flatMap((c) => c.segments.map((s) => [c.from + sec(s.start), c.from + sec(s.end)] as [number, number]));
const DUCK = 0.3;
const smooth = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
const duck = (f: number) => {
  let g = 1;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return DUCK;
    if (f < a && a - f < 10) g = Math.min(g, DUCK + (1 - DUCK) * smooth((a - f) / 10));
    if (f > b && f - b < 30) g = Math.min(g, DUCK + (1 - DUCK) * smooth((f - b) / 30));
  }
  return g;
};

/* ── 無音を使う場所（v2 26）: 予想外の数字・二行だけの画面・結論の直前 ─────────── */
const whole = (id: string): [number, number] => [cut(id).from, cut(id).from + cut(id).duration];
const s59 = cut("S59");
const MUTES: [number, number][] = [
  whole("S15"), // 「100。」
  whole("S35"), // 売れている。でも、残らない。
  [s59.from + sec(s59.segments[0].end), s59.from + sec(s59.segments[1].start)], // 最後の言葉の前の間
];
const mute = (f: number) => {
  for (const [a, b] of MUTES) {
    if (f >= a - 10 && f <= b + 14) return interpolate(f, [a - 10, a, b, b + 14], [1, 0.12, 0.12, 1], clamp);
  }
  return 1;
};

type Cue = { file: string; from: number; to: number; mood: string };
const LEVEL: Record<string, number> = { hook: 0.36, wall: 0.34, pressure: 0.32, answer: 0.34 };
const CueTrack: React.FC<{ cue: Cue }> = ({ cue }) => {
  const len = cue.to - cue.from;
  const level = LEVEL[cue.mood] ?? 0.36;
  return (
    <Sequence from={cue.from} durationInFrames={len + 24} layout="none">
      <Audio
        src={staticFile(cue.file)}
        volume={(f) => {
          const g = cue.from + f;
          const fade = interpolate(f, [0, 36, len - 24, len + 24], [0, 1, 1, 0], clamp);
          return level * fade * duck(g) * mute(g);
        }}
      />
    </Sequence>
  );
};

export const Main002: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    {cuts002.map((c) => {
      const Comp = CUTS[c.id];
      if (!Comp) throw new Error(`CASE #002: ${c.id} の画面がありません`);
      return (
        <Sequence key={c.id} from={c.from} durationInFrames={c.duration} name={c.id}>
          <Comp cut={c} />
        </Sequence>
      );
    })}
    {cues.map((cue) => (
      <CueTrack key={cue.file} cue={cue} />
    ))}
  </AbsoluteFill>
);
