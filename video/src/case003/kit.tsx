/**
 * CASE #003「映画館のポップコーン」の画面部品。
 * CASE #010 までは実写を使わない（v3 0番）。実写の代わりに次の質感で画面を作る:
 *   OBJECT（黒地に物ひとつ）/ DOCUMENT（紙のチケット）/ BLUEPRINT（映画館の線画）/ DATA（白地に数字）
 * 共通の骨組み（mk・字幕・EVIDENCE カードなど）は case002/ui を使う。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const T = {
  ...K,
  butter: "#F6E3A8",
  kernel: "#E9B949",
  velvet: "#8E1B22",
  screen: "#EDEBE4",
  bp: "#8FD3FF",
  bpSoft: "rgba(143,211,255,0.35)",
  ticket: "#F3E9D2",
};

/* ── ポップコーン（ひと粒） ───────────────── */
export const Kernel: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number }> = ({ x, y, s = 1, r = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <circle cx={-14} cy={4} r={20} fill={T.butter} />
    <circle cx={12} cy={-8} r={22} fill="#FFF6DD" />
    <circle cx={10} cy={14} r={17} fill={T.butter} />
    <circle cx={-6} cy={-16} r={15} fill="#FFF9E8" />
    <circle cx={2} cy={2} r={6} fill={T.kernel} opacity={0.7} />
  </g>
);

/** 粒の決まった配置（毎回同じ乱数） */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** 黒い画面で、ポップコーンが弾けて山になる（OBJECT） */
export const PopPile: React.FC<{ at: number; n?: number; cx?: number; base?: number; w?: number; dur?: number; s?: number }> = ({
  at,
  n = 70,
  cx = 960,
  base = 820,
  w = 560,
  dur = 50,
  s = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t0 = at + (i / n) * dur;
        const p = ease(f, t0, t0 + 10, 0, 1, Easing.out(Easing.back(2)));
        if (p <= 0) return null;
        // 山の形: 下ほど広く、上ほど狭い
        const layer = Math.floor(Math.sqrt(i));
        const span = w * Math.max(0.15, 1 - layer / Math.sqrt(n));
        const x = cx + (rnd(i) - 0.5) * span;
        const y = base - layer * 38 * s - rnd(i + 7) * 20;
        const drop = (1 - ease(f, t0, t0 + 8)) * -120;
        return <Kernel key={i} x={x} y={y + drop} s={s * (0.9 + rnd(i + 3) * 0.35) * p} r={rnd(i + 11) * 360} />;
      })}
    </g>
  );
};

/** 紅白ストライプのカップ（無地）＋山盛り */
export const Cup: React.FC<{ x?: number; y?: number; s?: number; fill?: number }> = ({ x = 960, y = 620, s = 1, fill = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={250} rx={170} ry={22} fill="rgba(0,0,0,0.35)" />
    <clipPath id="cupclip">
      <path d="M -200 -40 L 200 -40 L 150 250 L -150 250 Z" />
    </clipPath>
    <g clipPath="url(#cupclip)">
      <rect x={-210} y={-40} width={420} height={300} fill="#FFFFFF" />
      {[-4, -2, 0, 2, 4].map((k) => (
        <path key={k} d={`M ${k * 44 - 22} -40 L ${k * 44 + 22} -40 L ${k * 35 + 17} 260 L ${k * 35 - 17} 260 Z`} fill={T.velvet} />
      ))}
    </g>
    <path d="M -200 -40 L 200 -40 L 150 250 L -150 250 Z" fill="none" stroke="#2A1A10" strokeWidth={6} opacity={0.4} />
    {fill > 0 &&
      Array.from({ length: 26 }, (_, i) => {
        const k = Math.min(1, Math.max(0, fill * 26 - i));
        const row = Math.floor(i / 7);
        const x = -170 + (i % 7) * 57 + (row % 2) * 26 + (rnd(i) - 0.5) * 20;
        const yy = -50 - row * 42 - Math.cos(((i % 7) / 6 - 0.5) * Math.PI) * 40 * (row < 2 ? 1 : 0.4);
        return k > 0 ? <Kernel key={i} x={x * (1 - row * 0.12)} y={yy} s={1.25 * k} r={rnd(i + 5) * 360} /> : null;
      })}
  </g>
);

/** 香り（ゆらぐ線） */
export const Aroma: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`} opacity={o} fill="none" stroke={T.butter} strokeWidth={8} strokeLinecap="round">
      {[-90, 0, 90].map((dx, i) => {
        const t = ((f / 45 + i * 0.33) % 1);
        return <path key={i} d={`M ${dx} ${-t * 90} q 30 -45 0 -90 t 0 -90`} opacity={Math.sin(Math.PI * t) * 0.8} />;
      })}
    </g>
  );
};

/* ── 紙のチケット（DOCUMENT） ───────────────── */
export const TicketDoc: React.FC<{ w?: number; price?: string; title?: string; at?: number; tear?: number }> = ({ w = 900, price = "¥2,200", title = "入場券", at = 0, tear = 0 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  const h = w * 0.42;
  const stubX = w * 0.72;
  return (
    <div style={{ position: "relative", width: w, height: h, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(-3deg)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: T.ticket, borderRadius: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.35)", backgroundImage: "radial-gradient(rgba(120,90,40,0.07) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
      <div style={{ position: "absolute", left: 40, top: 30, right: w - stubX + 30, bottom: 30, border: `3px solid ${T.velvet}`, borderRadius: 8, padding: "24px 36px", color: "#3A2A1A" }}>
        <div style={{ fontSize: w * 0.034, fontWeight: 700, letterSpacing: 6, color: T.velvet }}>CINEMA</div>
        <div style={{ fontSize: w * 0.075, fontWeight: 900, fontFamily: SERIF, marginTop: 6 }}>{title}</div>
        <div style={{ fontSize: w * 0.03, fontWeight: 700, marginTop: 10, opacity: 0.7 }}>SCREEN 7　ROW F　SEAT 12</div>
        <div style={{ position: "absolute", right: 30, bottom: 16, fontSize: w * 0.085, fontWeight: 900, color: T.velvet }}>{price}</div>
      </div>
      <div style={{ position: "absolute", left: stubX, top: 10, bottom: 10, borderLeft: "5px dashed rgba(60,40,20,0.35)" }} />
      <div style={{ position: "absolute", left: stubX + 30, top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${tear * 60}px) rotate(${tear * 8}deg)` }}>
        <div style={{ fontSize: w * 0.04, fontWeight: 900, color: T.velvet, writingMode: "vertical-rl", letterSpacing: 8 }}>入場</div>
      </div>
    </div>
  );
};

/* ── CLUE（チケットの半券のかたち） ───────────────── */
export const CLUES3: Record<string, string[]> = {
  "1": ["売店は、", "チケットとは別の売上を", "生む。"],
  "2": ["売れる席の数には、", "限界がある。"],
  "3": ["座席を増やさなくても、", "客単価は増やせる。"],
  FINAL: ["ポップコーンの値段は、", "原料ではなく、", "映画館の中での役割で決まる。"],
};
export const ClueStub: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.cubic));
  const lines = CLUES3[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(78, Math.floor(1020 / maxChars));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
        <div style={{ display: "flex", opacity: p, transform: `translateX(${(1 - p) * 120}px) rotate(-2deg)`, filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.45))" }}>
          <div style={{ width: 300, background: final ? K.gold : T.velvet, borderRadius: "18px 0 0 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: final ? "#2A1A08" : T.ticket, fontFamily: FONT }}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 8 }}>{final ? "FINAL" : "CLUE"}</div>
            <div style={{ fontSize: final ? 70 : 120, fontWeight: 900, lineHeight: 1 }}>{final ? "CLUE" : no.padStart(2, "0")}</div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, marginTop: 16, opacity: 0.8 }}>CASE #003</div>
          </div>
          <div style={{ width: 0, borderLeft: "6px dashed rgba(60,40,20,0.35)", background: T.ticket }} />
          <div style={{ width: 1120, background: T.ticket, borderRadius: "0 18px 18px 0", padding: "56px 64px", fontFamily: SERIF, color: "#2A1A10" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.4, whiteSpace: "nowrap", opacity: ease(f, at + 8 + i * 6, at + 20 + i * 6) }}>
                {l}
              </div>
            ))}
            <div style={{ marginTop: 20, fontFamily: FONT, fontSize: 24, fontWeight: 900, letterSpacing: 10, color: T.velvet }}>KANENAZO</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.6} />
    </>
  );
};

/* ── BLUEPRINT（線画） ───────────────── */
/** 線が描かれていく path */
export const Draw: React.FC<{ d: string; at: number; dur?: number; w?: number; color?: string; len?: number }> = ({ d, at, dur = 30, w = 5, color = T.bp, len = 3000 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + dur, 0, 1, Easing.inOut(Easing.cubic));
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
};

/** 線画の注記 */
export const Note: React.FC<{ x: number; y: number; text: string; at: number; anchor?: "start" | "middle" | "end"; size?: number; color?: string }> = ({
  x,
  y,
  text,
  at,
  anchor = "middle",
  size = 40,
  color = T.bp,
}) => {
  const f = useCurrentFrame();
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={800} fontSize={size} fill={color} opacity={fade(f, at)} letterSpacing={2}>
      {text}
    </text>
  );
};

/** 映画館の断面図（スクリーン・客席・映写室） */
export const TheaterSection: React.FC<{ at: number; labels?: { t: string; at: number; x: number; y: number }[] }> = ({ at, labels = [] }) => (
  <g>
    <Draw d="M 200 880 L 1720 880 L 1720 220 L 200 220 Z" at={at} dur={30} len={4400} />
    <Draw d="M 260 300 L 260 700" at={at + 12} w={14} len={420} />
    {Array.from({ length: 8 }, (_, i) => (
      <Draw key={i} d={`M ${560 + i * 130} ${820 - i * 36} l 90 0 l 0 -40`} at={at + 20 + i * 3} w={5} len={200} />
    ))}
    <Draw d="M 1560 260 L 1700 260 L 1700 380 L 1560 380 Z" at={at + 30} len={600} />
    <Draw d="M 1560 320 L 280 500" at={at + 40} w={3} color={T.bpSoft} len={1400} />
    {labels.map((l, i) => (
      <Note key={i} x={l.x} y={l.y} text={l.t} at={l.at} />
    ))}
  </g>
);

/** 座席表（売れた席が赤く埋まる） */
export const Seats: React.FC<{ at: number; dur?: number; cols?: number; rows?: number; x0?: number; y0?: number; gap?: number; sold?: number }> = ({
  at,
  dur = 60,
  cols = 20,
  rows = 10,
  x0 = 480,
  y0 = 280,
  gap = 48,
  sold = 1,
}) => {
  const f = useCurrentFrame();
  const n = cols * rows;
  const k = Math.floor(ease(f, at, at + dur, 0, n * sold));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const order = Math.floor(rnd(i + 99) * n);
        const on = order < k;
        return <rect key={i} x={x0 + c * gap + (c >= cols / 2 ? 30 : 0)} y={y0 + r * gap} width={gap - 12} height={gap - 14} rx={8} fill={on ? K.red : "none"} stroke={on ? K.red : T.bp} strokeWidth={3} opacity={on ? 0.95 : 0.6} />;
      })}
    </g>
  );
};

/* ── 人物（顔なしのシルエット） ───────────────── */
export const Figure: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = K.ink, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-120} r={52} fill={color} />
    <path d="M -90 90 C -90 -40 90 -40 90 90 Z" fill={color} />
  </g>
);

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
