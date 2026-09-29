/** CASE #008「自販機、なぜ減っても値上げ？」 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import timeline from "../../public/case008/timeline.json";
import cueList from "../../public/case008/music/cues.json";
import { CutData, clamp, sec } from "../lib";
import { C } from "../theme";
import { OPEN8 } from "./open";
import { SHOP8 } from "./shop";
import { EXIT8 } from "./exit";

const CUTS = { ...OPEN8, ...SHOP8, ...EXIT8 } as Record<string, React.FC<{ cut: CutData }>>;

export const cuts008 = timeline.cuts as CutData[];
export const total008 = timeline.totalFrames;
const cues = cueList as Cue[];
const cut = (id: string) => cuts008.find((c) => c.id === id)!;

/* ── BGM のダッキング（v2: BGM は背景。声の前後はなめらかに） ─────────── */
const VOICE: [number, number][] = cuts008.flatMap((c) => c.segments.map((s) => [c.from + sec(s.start), c.from + sec(s.end)] as [number, number]));
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
const j40 = cut("J40");
const MUTES: [number, number][] = [
  whole("J11"), // 答え（先に）「1台を動かす費用は減らない」
  whole("J28"), // CLUE 02「逆に回っている」
  [j40.from, j40.from + sec(j40.segments[0].start)], // 最後の答えの直前
];
const mute = (f: number) => {
  for (const [a, b] of MUTES) {
    if (f >= a - 10 && f <= b + 14) return interpolate(f, [a - 10, a, b, b + 14], [1, 0.12, 0.12, 1], clamp);
  }
  return 1;
};

type Cue = { file: string; from: number; to: number; mood: string };
// 曲想ごとの音量（打楽器・刻みのある曲は少し下げる）
const LEVEL: Record<string, number> = { v_open: 0.33, v_data: 0.26, v_shop: 0.27, v_loss: 0.32, v_exit: 0.27, v_future: 0.31, v_answer: 0.34, outro: 0.36 };
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

export const Main008: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    {cuts008.map((c) => {
      const Comp = CUTS[c.id];
      if (!Comp) throw new Error(`CASE #008: ${c.id} の画面がありません`);
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
