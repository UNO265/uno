/**
 * CASE #010「お米5キロ、農家に残るのは？」（docs/case010-conti-v5.md）
 * 導入 = 3D キネティック（T01）、本編 = モーション・テンプレート（T02〜T11）+ HERO、波形の強弱。
 * BGM = OpenTracks 6 曲（冒頭は Sulpiride、残りは #009 と同じ曲を別の並びで、docs/case010-audio-credits.md）、エンディング = 固定（C8、#009 と同じ画面）。
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/case010/timeline.json";
import { CutData } from "../lib";
import { END9 } from "../case009/end";
import { C, Caption, Hud, clamp, useFonts } from "../kinetic/kit";
import { SCENES } from "./scenes";

const cuts = timeline.cuts as CutData[];
export const total010k = timeline.totalFrames;
const cut = (id: string) => cuts.find((c) => c.id === id)!;
const at = (id: string) => cut(id).from;

/* ── BGM（OpenTracks）。声の間は下げ、区間の境目は 1 秒で入れ替える ─────────── */
const VOICE: [number, number][] = cuts.flatMap((c) => c.segments.map((s) => [c.from + Math.round(s.start * 30), c.from + Math.round(s.end * 30)] as [number, number]));
const smooth = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
/* 声の間の BGM の下げ幅（0.42 では携帯のスピーカーで聞こえなかったので 0.55） */
const DUCK = 0.55;
const duck = (f: number) => {
  let g = 1;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return DUCK;
    if (f < a && a - f < 10) g = Math.min(g, DUCK + (1 - DUCK) * smooth((a - f) / 10));
    if (f > b && f - b < 24) g = Math.min(g, DUCK + (1 - DUCK) * smooth((f - b) / 24));
  }
  return g;
};
type Cue = { file: string; from: number; to: number; start?: number; level: number };
/* 0:00〜2:22 の曲。試聴用に --props '{"introBgm":"…mp3"}' で差し替えられる */
const IP = getInputProps() as { introBgm?: string; introLevel?: number };
const INTRO = IP.introBgm ?? "case009/music_ot/ot_sulpiride.mp3";
const CUES: Cue[] = [
  { file: INTRO, from: 0, to: at("F14"), level: IP.introLevel ?? 0.2 },
  { file: "case009/music_ot/ot_investor_night.mp3", from: at("F14"), to: at("F17"), level: 0.19 },
  { file: "case009/music_ot/ot_cassette_tape_dream.mp3", from: at("F17"), to: at("F21"), level: 0.18 },
  { file: "case009/music_ot/ot_whisper_of_drums.mp3", from: at("F21"), to: at("F31"), level: 0.19 },
  { file: "case009/music_ot/ot_connectedness.mp3", from: at("F31"), to: at("F35"), level: 0.18 },
  { file: "case009/music_ot/ot_random_number.mp3", from: at("F35"), to: at("F39"), start: 60 * 30, level: 0.2 },
  { file: "case009/music_k/c9k_06_outro.wav", from: at("F39"), to: total010k, level: 0.3 },
];
const CueTrack: React.FC<{ cue: Cue }> = ({ cue }) => {
  const len = cue.to - cue.from;
  return (
    <Sequence from={Math.max(0, cue.from - 15)} durationInFrames={len + 45} layout="none">
      <Audio
        src={staticFile(cue.file)}
        startFrom={cue.start ?? 0}
        volume={(f) => {
          const g = cue.from - 15 + f;
          const fade = interpolate(f, [0, cue.from === 0 ? 1 : 30, len + 15, len + 45], [cue.from === 0 ? 1 : 0, 1, 1, 0], clamp);
          return cue.level * fade * duck(g);
        }}
      />
    </Sequence>
  );
};

/* 字幕・計器（導入は導入側で描く） */
const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= at("F39")) return null;
  let cap = "";
  for (const c of cuts) for (const s of c.segments) if (f >= c.from + s.start * 30 - 2 && f < c.from + c.duration) cap = s.text;
  const chapter = f < at("F16") ? 1 : f < at("F25") ? 2 : f < at("F31") ? 3 : f < at("F35") ? 4 : 5;
  const light = SCENES.some((s) => s.light && f >= at(s.ids[0]) && f < at(s.ids[s.ids.length - 1]) + cut(s.ids[s.ids.length - 1]).duration);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="capfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <Hud f={f} scene={chapter} total={5} dark={!light} label="RICE" caseNo="#010" />
      <Caption text={cap} dark={!light} />
    </svg>
  );
};

export const Main010K: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SCENES.map((sc) => {
        const a = at(sc.ids[0]);
        const last = cut(sc.ids[sc.ids.length - 1]);
        const dur = last.from + last.duration - a;
        const El = sc.el;
        return (
          <Sequence key={sc.ids.join("+")} from={a} durationInFrames={dur} name={sc.ids.join("+")}>
            <El dur={dur} rel={(id: string, i: number) => at(id) - a + Math.round(cut(id).segments[i].start * 30)} />
          </Sequence>
        );
      })}
      {([["F39", "D37"], ["F40", "D38"], ["F41", "D39"]] as const).map(([id, endId]) => {
        const c = cut(id);
        const Comp = (END9 as Record<string, React.FC<{ cut: CutData }>>)[endId];
        return (
          <Sequence key={id} from={c.from} durationInFrames={c.duration} name={id}>
            {/* 固定エンディングの部品は自分で声を鳴らすので、ここでは声を外す（下の全カット共通の声と二重になる） */}
            <Comp cut={{ ...c, voice: undefined }} />
          </Sequence>
        );
      })}
      <Overlay />
      {cuts.map((c) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.duration} layout="none">
          {c.voice ? <Audio src={staticFile(c.voice)} /> : null}
        </Sequence>
      ))}
      {CUES.map((c, i) => (
        <CueTrack key={i} cue={c} />
      ))}
    </AbsoluteFill>
  );
};
