// スタイル比較ショート（同じ音声・字幕・長さで、画面のスタイルだけを変える）
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import tl from "../../../public/case010_shorts/style_test/timeline.json";

export const SANS = "'Noto Sans CJK JP', sans-serif";
export const SERIF = "'Noto Serif CJK JP', serif";
export const TOTAL = tl.totalFrames;
export const LOOP = 15; // 最後の 0.5 秒は 0 フレームと同じ絵

type Cut = (typeof tl.cuts)[number];
const byId = Object.fromEntries(tl.cuts.map((c) => [c.id, c])) as Record<string, Cut>;
export const at = (id: string, seg = -1) => {
  const c = byId[id];
  return seg < 0 ? c.from : c.from + Math.round(c.segments[seg].start * 30);
};
export const end = (id: string) => byId[id].from + byId[id].duration;
export const k = (g: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(g, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const pop = (g: number, a: number, d = 12) => interpolate(g, [a, a + d * 0.6, a + d], [0, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
/** ループ用: 最後の LOOP フレームは 0 フレームを描く */
export const useG = () => {
  const f = useCurrentFrame();
  return f >= TOTAL - LOOP ? 0 : f;
};

const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  let text = "";
  for (const c of tl.cuts) for (const s of c.segments) if (f >= c.from + s.start * 30 - 2 && f < c.from + c.duration && f < TOTAL - LOOP) text = s.text;
  // 同じカット内では最後に始まったセグメントを表示
  if (!text) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1290, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, lineHeight: 1.3, color: "#fff", padding: "12px 26px", background: "rgba(12,14,24,.78)", borderRadius: 10, textAlign: "center" }}>{text}</div>
    </div>
  );
};

const Note: React.FC = () => {
  const f = useCurrentFrame();
  const t = f >= at("T02") && f < at("T06") ? "※計算・イメージ（利益を本部と店で半分ずつ、捨てた分は本部15%）" : f >= at("T06") && f < TOTAL - LOOP ? "468万円：公正取引委員会 実態調査（2020年）・1店1年の中央値" : "";
  if (!t) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 1236, textAlign: "center", fontFamily: SANS, fontSize: 30, color: "#fff" }}><span style={{ background: "rgba(0,0,0,.45)", padding: "4px 14px", borderRadius: 6 }}>{t}</span></div>;
};

export const Shell: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <AbsoluteFill style={{ background: bg }}>
    {children}
    {tl.cuts.map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={c.duration}>
        <Audio src={staticFile(c.voice)} />
      </Sequence>
    ))}
    <Audio src={staticFile("case010/music/c10_02_calc.wav")} volume={(f) => 0.14 * interpolate(f, [0, 6, TOTAL - 20, TOTAL], [0.6, 1, 1, 0], { extrapolateRight: "clamp" })} />
    <Note />
    <Subtitle />
    <div style={{ position: "absolute", left: 40, top: 40, fontFamily: SANS, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: "rgba(255,255,255,.75)", textShadow: "0 2px 6px rgba(0,0,0,.5)" }}>KANENAZO</div>
  </AbsoluteFill>
);

/** 日本のテロップ風の文字（白フチ） */
export const Telop: React.FC<{ x: number; y: number; size: number; color: string; children: React.ReactNode; edge?: string; o?: number; s?: number; anchor?: "middle" | "start" | "end"; serif?: boolean }> = ({ x, y, size, color, children, edge = "#fff", o = 1, s = 1, anchor = "middle", serif }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <text textAnchor={anchor} fontFamily={serif ? SERIF : SANS} fontWeight={900} fontSize={size} stroke={edge} strokeWidth={size * 0.16} strokeLinejoin="round" paintOrder="stroke" fill={color}>
      {children}
    </text>
  </g>
);
