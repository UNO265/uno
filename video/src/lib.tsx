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

export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
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

/** ナレーションに同期した字幕 */
export const Subtitle: React.FC<{ cut: CutData; dark?: boolean }> = ({ cut, dark }) => {
  const f = useCurrentFrame();
  const segs = cut.segments;
  const idx = segs.findIndex((s, i) => {
    const next = segs[i + 1];
    return f >= sec(s.start) - 3 && (next ? f < sec(next.start) - 3 : f < sec(s.end) + 12);
  });
  if (idx < 0) return null;
  const s = segs[idx];
  const opacity = interpolate(f, [sec(s.start) - 3, sec(s.start) + 2], [0, 1], clamp);
  const glow = dark ? "rgba(10,14,24,0.9)" : "rgba(244,238,227,0.95)";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: 2,
          color: dark ? "#F4EEE3" : C.ink,
          opacity,
          textShadow: `0 0 8px ${glow}, 0 0 16px ${glow}, 0 0 3px ${glow}`,
        }}
      >
        {s.text}
      </div>
    </AbsoluteFill>
  );
};

/** カット共通のラッパー: 背景・字幕・ナレーション音声 */
export const CutFrame: React.FC<{ cut: CutData; dark?: boolean; bg?: React.ReactNode; children: React.ReactNode }> = ({
  cut,
  dark,
  bg,
  children,
}) => (
  <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
    {bg ?? <Paper />}
    {children}
    <Subtitle cut={cut} dark={dark} />
    {cut.voice ? (
      <Sequence from={sec(cut.voiceStart ?? 0)} layout="none">
        <Audio src={staticFile(cut.voice)} volume={1} />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
