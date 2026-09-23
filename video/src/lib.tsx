import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "./theme";

export type Segment = { text: string; start: number; end: number };
export type CutData = {
  id: string;
  from: number;
  duration: number;
  voice?: string;
  voiceStart?: number;
  segments: Segment[];
};
export type CutProps = { cut: CutData };

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** i 番目のセグメント（ナレーションの一区切り）の開始/終了フレーム */
export const segStart = (cut: CutData, i: number) =>
  sec(cut.segments[Math.min(i, cut.segments.length - 1)]?.start ?? 0);
export const segEnd = (cut: CutData, i: number) =>
  sec(cut.segments[Math.min(i, cut.segments.length - 1)]?.end ?? 0);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = (f: number, from: number, to: number, a = 0, b = 1, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [from, to], [a, b], { ...clamp, easing: e });

/** 0→1 のポップ（少しオーバーシュート） */
export const usePop = (delay: number, damping = 11) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.6, stiffness: 140 } });
};

/** 効果音全体のゲイン。ナレーションより前に出ないよう控えめにする */
export const SFX_GAIN = 0.4;

export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_GAIN} />
  </Sequence>
);

/** 紙の質感 */
export const Paper: React.FC<{ color?: string }> = ({ color = C.paper }) => (
  <AbsoluteFill style={{ background: color }}>
    <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.09, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(80,60,30,0.10) 100%)" }}
    />
  </AbsoluteFill>
);

/** 長い字幕は句読点の近くで 2 行に分ける（スマホで読みやすく） */
const splitSub = (t: string): string[] => {
  const chars = [...t];
  if (chars.length <= 20) return [t];
  const mid = chars.length / 2;
  const isNum = (c?: string) => !!c && /[0-9０-９A-Za-z.,]/.test(c);
  const score = (i: number) => {
    // i = 2 行目の先頭位置。句読点の後か、助詞の後（次が助詞・小書き文字でない）だけで切る
    if (i < 6 || i > chars.length - 4) return Infinity;
    const prev = chars[i - 1];
    const next = chars[i];
    if ("、。，」）".includes(prev)) return Math.abs(i - mid);
    if ("はがをにでともへやの".includes(prev) && !"はがをにでともへやのっゃゅょぁぃぅぇぉーしらり".includes(next) && !isNum(next)) return Math.abs(i - mid) + 3;
    return Infinity;
  };
  let best = -1;
  for (let i = 1; i < chars.length; i++) if (best < 0 || score(i) < score(best)) best = i;
  if (score(best) === Infinity || score(best) > chars.length * 0.35) return [t];
  return [chars.slice(0, best).join(""), chars.slice(best).join("")];
};

/** ナレーションに同期した字幕（濃紺の帯 + 白文字） */
export const Subtitle: React.FC<{ cut: CutData; dark?: boolean }> = ({ cut }) => {
  const f = useCurrentFrame();
  const segs = cut.segments;
  const idx = segs.findIndex((s, i) => {
    const next = segs[i + 1];
    return f >= sec(s.start) - 3 && (next ? f < sec(next.start) - 3 : f < sec(s.end) + 12);
  });
  if (idx < 0) return null;
  const s = segs[idx];
  const opacity = interpolate(f, [sec(s.start) - 3, sec(s.start) + 2], [0, 1], clamp);
  const lines = splitSub(s.text);
  const longest = Math.max(...lines.map((l) => [...l].length));
  const fontSize = Math.min(lines.length > 1 ? 76 : 84, Math.floor(1720 / Math.max(1, longest)));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 40 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.22,
          letterSpacing: 2,
          color: "#FFFFFF",
          background: "rgba(22, 30, 48, 0.88)",
          padding: "10px 44px 14px",
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          opacity,
          textAlign: "center",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** カット共通のラッパー: 背景・字幕・ナレーション音声 */
export const CutFrame: React.FC<{ cut: CutData; dark?: boolean; bg?: React.ReactNode; children: React.ReactNode; noSub?: boolean }> = ({
  cut,
  dark,
  bg,
  children,
  noSub,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
    {bg ?? <Paper />}
    {children}
    {!noSub && <Subtitle cut={cut} dark={dark} />}
    {cut.voice ? (
      <Sequence from={sec(cut.voiceStart ?? 0)} layout="none">
        <Audio src={staticFile(cut.voice)} volume={1} />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
