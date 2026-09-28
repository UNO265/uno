/**
 * 정조 편 공통 부품: 색·글꼴·카메라·빛·먼지·종이·초서 글씨·촛불·실루엣·건물.
 * 연출 원칙: 편지가 주인공인 밤. 촛불(따뜻함)↔달빛(차가움)↔새벽(회청)↔낮(미색)↔현대(중성) 색을 교차시킨다.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const BAR = 132;
export const SERIF = "'Noto Serif KR', serif";
export const SANS = "'Noto Sans KR', sans-serif";
export const BRUSH = "'Nanum Brush Script', cursive";
export const CURSIVE = "'Liu Jian Mao Cao', cursive";
export const INK = "#17110C";
export const C = {
  warm: "#FFC47E",
  cream: "#F2E6CC",
  gold: "#C9A66B",
  mute: "#9C8B6E",
  moon: "#BFD0E8",
  dawn: "#8FA3B8",
  red: "#B8322A",
};
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.inOut(Easing.cubic)) =>
  a === b ? (f >= b ? to : from) : interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

/** interpolate 입력 구간을 항상 증가하도록 보정 */
export const mono = (xs: number[]) => xs.reduce<number[]>((a, x) => [...a, a.length ? Math.max(x, a[a.length - 1] + 1) : x], []);

export type Word = { text: string; start: number; end: number };
export type Sent = { text: string; tag: string | null; quote: boolean; start: number; end: number; voice: string; words: Word[]; cards: { start: number; end: number; text: string }[] };
export type Cut = { id: string; sec: string; scene: string; p: any; sentences: Sent[]; from: number; duration: number };
export type SP = { cut: Cut };
export const fr = (s: number) => Math.round(s * FPS);
/** i번째 문장 시작 프레임(컷 기준) */
export const sAt = (c: Cut, i: number) => (c.sentences.length ? fr(c.sentences[Math.min(i, c.sentences.length - 1)].start) : 0);
export const sEnd = (c: Cut, i: number) => (c.sentences.length ? fr(c.sentences[Math.min(i, c.sentences.length - 1)].end) : 0);
/** 단어가 처음 나오는 프레임(컷 기준) */
export const wAt = (c: Cut, text: string, fallback = 0) => {
  for (const s of c.sentences) for (const w of s.words) if (w.text.includes(text)) return fr(w.start);
  return fallback;
};

export const rand = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const flick = (f: number) => 1 + 0.05 * Math.sin(f * 0.83) + 0.035 * Math.sin(f * 2.1 + 1) + 0.02 * Math.sin(f * 5.3);

/* ── 카메라: 컷 전체에 걸친 느린 이동 ───────── */
export const Cam: React.FC<{ dur: number; from?: [number, number, number]; to?: [number, number, number]; origin?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  dur,
  from = [1, 0, 0],
  to = [1.06, 0, 0],
  origin = "50% 50%",
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const k = ease(f, 0, dur, 0, 1, Easing.inOut(Easing.sin));
  const s = from[0] + (to[0] - from[0]) * k;
  const x = from[1] + (to[1] - from[1]) * k;
  const y = from[2] + (to[2] - from[2]) * k;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: origin, ...style }}>{children}</AbsoluteFill>;
};

/* ── 빛·분위기 ───────── */
export const Vig: React.FC<{ k?: number; color?: string; at?: string }> = ({ k = 0.88, color = "5,4,3", at = "50% 50%" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${at}, rgba(0,0,0,0) 32%, rgba(${color},${k}) 92%)`, pointerEvents: "none" }} />
);
export const Glow: React.FC<{ x: string; y: string; color?: string; k?: number; r?: number }> = ({ x, y, color = "255,190,110", k = 0.25, r = 45 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x} ${y}, rgba(${color},${k * flick(f)}) 0%, rgba(0,0,0,0) ${r}%)`, pointerEvents: "none" }} />;
};
export const Grade: React.FC<{ color: string; k: number; mode?: "multiply" | "screen" | "overlay" | "soft-light" }> = ({ color, k, mode = "soft-light" }) => (
  <AbsoluteFill style={{ background: color, opacity: k, mixBlendMode: mode, pointerEvents: "none" }} />
);

export const Dust: React.FC<{ n?: number; color?: string; seed?: number; area?: [number, number, number, number]; up?: number }> = ({ n = 36, color = "#FFD9A0", seed = 3, area = [0, 0, W, H], up = 1 }) => {
  const f = useCurrentFrame();
  const ps = useMemo(() => {
    const r = rand(seed);
    return [...Array(n)].map(() => ({ x: r(), y: r(), s: 0.8 + r() * 2.6, v: 0.15 + r() * 0.5, ph: r() * 6 }));
  }, [n, seed]);
  const [x0, y0, aw, ah] = area;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {ps.map((p, i) => {
        const x = x0 + ((((p.x * aw + Math.sin(f * 0.02 + p.ph) * 26) % aw) + aw) % aw);
        const y = y0 + ((((p.y * ah - f * p.v * up) % ah) + ah) % ah);
        return <circle key={i} cx={x} cy={y} r={p.s} fill={color} opacity={0.2 + 0.35 * Math.abs(Math.sin(f * 0.05 + p.ph))} />;
      })}
    </svg>
  );
};

/** 비스듬한 빛줄기(창살 달빛·새벽빛) */
export const Rays: React.FC<{ color?: string; k?: number; skew?: number; x?: number; cols?: number; rows?: number; size?: number; blur?: number }> = ({
  color = "#9FB6D6",
  k = 0.3,
  skew = -22,
  x = 560,
  cols = 3,
  rows = 4,
  size = 180,
  blur = 6,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", filter: `blur(${blur}px)`, pointerEvents: "none" }}>
    <defs>
      <linearGradient id={`ray${color}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={k} />
        <stop offset="100%" stopColor={color} stopOpacity={k * 0.15} />
      </linearGradient>
    </defs>
    <g transform={`skewX(${skew}) translate(${x} 110)`}>
      {[...Array(cols)].map((_, c) => [...Array(rows)].map((_, r) => <rect key={`${c}-${r}`} x={c * (size + 20)} y={r * (size + 20)} width={size} height={size} fill={`url(#ray${color})`} />))}
    </g>
  </svg>
);

/* ── 종이·글씨 ───────── */
export const Paper: React.FC<{ w: number; h: number; tint?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, tint = "#E7DABD", children, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: tint, overflow: "hidden", ...style }}>
    <Img src={staticFile("sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, mixBlendMode: "multiply" }} />
    {children}
  </div>
);

/** 초서 글씨(편지 질감). 실제 정조 편지 글이 아니라 천자문 글자를 초서체로 쓴 것 */
export const CHARS = "天地玄宇宙洪荒日月盈昃辰宿列寒暑往秋收冬藏成律致雨露霜金生水玉出巨珠夜光果珍李柰菜重芥海河淡羽翔火帝官人皇始制文字乃服衣裳推位有虞陶唐民伐罪周殷坐朝道垂拱平章育黎首臣伏戎羌遐壹率王在白食化被草木及方此身四大五常恭惟鞠敢女慕男效才良知必改得能莫忘罔彼短靡恃己信使可覆器欲量墨悲染羔羊景行克念作德建名立形端表正空谷堂因福善尺璧非寸是父事君曰敬孝竭力忠命深履薄夙似斯馨如松之盛川流不息澄取映容止若思言安定";
export const Calli: React.FC<{ w: number; h: number; cols?: number; seed?: number; color?: string; date?: boolean; reveal?: number }> = ({ w, h, cols = 7, seed = 7, color = INK, date = true, reveal = 1 }) => {
  const colW = (w - 150) / cols;
  const fs = colW * 0.78;
  const per = Math.max(1, Math.floor((h - 170) / (fs * 0.92)));
  const data = useMemo(() => {
    const r = rand(seed);
    const out: { x: number; chars: { c: string; o: number; dx: number; s: number }[] }[] = [];
    let k = Math.floor(r() * 200);
    for (let c = 0; c < cols; c++) {
      const len = c === cols - 1 ? Math.max(1, Math.floor(per * 0.55)) : per - Math.floor(r() * 3);
      const chars = [];
      let ink = 1;
      for (let i = 0; i < len; i++) {
        if (r() < 0.18) ink = 1;
        ink = Math.max(0.55, ink - 0.06);
        chars.push({ c: CHARS[k++ % CHARS.length], o: ink, dx: (r() - 0.5) * fs * 0.18, s: 0.85 + r() * 0.3 });
      }
      out.push({ x: w - 80 - c * colW - colW / 2, chars });
    }
    return out;
  }, [w, cols, per, fs, seed]);
  const total = data.reduce((a, c) => a + c.chars.length, 0);
  let idx = 0;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {data.map((col, ci) =>
        col.chars.map((ch, i) => {
          const my = idx++ / total;
          const vis = Math.min(1, Math.max(0, (reveal - my) * total * 0.25));
          return (
            <div key={`${ci}-${i}`} style={{ position: "absolute", left: col.x - fs / 2 + ch.dx, top: 80 + i * fs * 0.92, width: fs, textAlign: "center", fontFamily: CURSIVE, fontSize: fs * ch.s, lineHeight: 1, color, opacity: ch.o * vis }}>
              {ch.c}
            </div>
          );
        }),
      )}
      {date && [...Array(5)].map((_, i) => (
        <div key={`d${i}`} style={{ position: "absolute", left: 30, top: 110 + i * fs * 0.5, fontFamily: "'Zhi Mang Xing', cursive", fontSize: fs * 0.42, color: "#6A3A26", opacity: 0.8 }}>
          {"日月初十五"[i]}
        </div>
      ))}
    </div>
  );
};

/** 편지 한 장(초서 글씨 + 접힌 자국) */
export const Letter: React.FC<{ w?: number; h?: number; seed?: number; tint?: string; cols?: number; date?: boolean; fold?: boolean; style?: React.CSSProperties; reveal?: number }> = ({
  w = 760,
  h = 1000,
  seed = 11,
  tint,
  cols = 7,
  date = true,
  fold = true,
  style,
  reveal,
}) => (
  <Paper w={w} h={h} tint={tint} style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.55)", ...style }}>
    <Calli w={w} h={h} seed={seed} cols={cols} date={date} reveal={reveal} />
    {fold && <div style={{ position: "absolute", top: h / 2 - 4, width: w, height: 8, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,0))" }} />}
  </Paper>
);

/* ── 촛불 ───────── */
export const Flame: React.FC<{ x: number; y: number; s?: number; lit?: number; stick?: number; id?: string }> = ({ x, y, s = 1, lit = 1, stick = 260, id = "f" }) => {
  const f = useCurrentFrame();
  const k = flick(f);
  const sway = 3 * Math.sin(f * 0.31) + 1.5 * Math.sin(f * 0.9);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <radialGradient id={`fg-${id}`}>
          <stop offset="0%" stopColor="#FFD58A" stopOpacity={0.55} />
          <stop offset="40%" stopColor="#F29B3A" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#F29B3A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle cx={0} cy={-40} r={260 * k} fill={`url(#fg-${id})`} opacity={lit} />
        <g transform={`translate(${sway} 0) scale(1 ${k})`} opacity={lit}>
          <path d="M 0 -95 C 22 -55 24 -18 0 0 C -24 -18 -22 -55 0 -95 Z" fill="#F7A640" opacity={0.9} />
          <path d="M 0 -70 C 12 -44 13 -16 0 -4 C -13 -16 -12 -44 0 -70 Z" fill="#FFE7B0" />
          <ellipse cx={0} cy={-6} rx={5} ry={9} fill="#6A4CFF" opacity={0.35} />
        </g>
        {lit < 1 && (
          <path d={`M 0 0 C ${-8 + 6 * Math.sin(f * 0.2)} -40, ${10 * Math.sin(f * 0.13)} -80, ${-6 + 14 * Math.sin(f * 0.09)} -150`} stroke="#8C8C8C" strokeWidth={4} fill="none" opacity={(1 - lit) * 0.35} />
        )}
        <line x1={0} y1={0} x2={0} y2={10} stroke="#221A12" strokeWidth={3} />
        <rect x={-26} y={10} width={52} height={stick} rx={5} fill="#EFE3CB" />
        <rect x={-26} y={10} width={52} height={60} rx={5} fill="#FFD9A0" opacity={0.25 * lit} />
      </g>
    </svg>
  );
};

/* ── 실루엣 ───────── */
/** 왕(곤룡포, 익선관) 앉은 옆모습 */
export const King: React.FC<{ x: number; y: number; s?: number; fill?: string; flip?: boolean; pose?: "sit" | "stand" }> = ({ x, y, s = 1, fill = "#0E0A07", flip, pose = "sit" }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {pose === "sit" ? (
      <path d="M -150 0 C -160 -110 -120 -230 -40 -270 L 40 -270 C 110 -240 150 -130 170 -40 L 200 0 Z" fill={fill} />
    ) : (
      <path d="M -90 0 C -100 -180 -90 -330 -40 -380 L 40 -380 C 90 -330 100 -180 90 0 Z" fill={fill} />
    )}
    <g transform={`translate(0 ${pose === "sit" ? -270 : -380})`}>
      <ellipse cx={4} cy={-58} rx={50} ry={58} fill={fill} />
      <path d="M -52 -86 C -54 -150 56 -150 54 -86 Z" fill={fill} />
      {/* 익선관 뒤 날개(짧게) */}
      <path d="M -40 -118 C -76 -136 -86 -120 -66 -104 Z" fill={fill} />
      <path d="M -30 -132 C -60 -164 -76 -150 -56 -128 Z" fill={fill} />
    </g>
  </g>
);
/** 관리(사모·단령) 옆모습. pose: stand | bow | sit */
export const Official: React.FC<{ x: number; y: number; s?: number; fill?: string; flip?: boolean; pose?: "stand" | "bow" | "sit" }> = ({ x, y, s = 1, fill = "#0E0A07", flip, pose = "stand" }) => {
  const head = (
    <g>
      <ellipse cx={4} cy={-58} rx={46} ry={54} fill={fill} />
      <path d="M -44 -86 C -46 -140 48 -140 46 -86 Z" fill={fill} />
      <path d="M -30 -118 C -30 -150 20 -150 20 -118 Z" fill={fill} />
      <ellipse cx={-62} cy={-112} rx={40} ry={10} fill={fill} transform="rotate(-12 -62 -112)" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {pose === "stand" && (
        <>
          <path d="M -80 0 C -95 -160 -90 -300 -40 -350 L 40 -350 C 90 -300 95 -160 80 0 Z" fill={fill} />
          <path d="M 30 -300 C 90 -270 110 -200 90 -170 C 70 -190 50 -220 30 -240 Z" fill={fill} />
          <g transform="translate(0 -350)">{head}</g>
        </>
      )}
      {pose === "sit" && (
        <>
          <path d="M -140 0 C -150 -100 -110 -220 -40 -260 L 40 -260 C 100 -230 140 -120 160 -40 L 190 0 Z" fill={fill} />
          <g transform="translate(0 -260)">{head}</g>
        </>
      )}
      {pose === "bow" && (
        <>
          <path d="M -160 0 C -160 -80 -90 -150 10 -150 C 110 -150 170 -90 190 0 Z" fill={fill} />
          <g transform="translate(200 -40) rotate(70)">{head}</g>
        </>
      )}
    </g>
  );
};
/** 집에서의 선비(탕건) 앉은 모습 — 그림자용 */
export const Scholar: React.FC<{ x: number; y: number; s?: number; fill?: string; read?: number }> = ({ x, y, s = 1, fill = "#1A120B", read = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -170 0 C -170 -120 -120 -200 -60 -230 L 60 -230 C 120 -200 170 -120 170 0 Z" fill={fill} />
    <g transform={`translate(0 ${-290 + read * 12}) rotate(${read * 10})`}>
      <ellipse cx={0} cy={0} rx={56} ry={66} fill={fill} />
      <path d="M -52 -40 C -50 -90 50 -90 52 -40 Z" fill={fill} />
    </g>
    {read > 0 && <rect x={60} y={-190} width={90} height={12} fill={fill} transform="rotate(-20 60 -190)" />}
  </g>
);

/** 걷는 사람(옆모습, 다리 움직임) */
export const Walker: React.FC<{ x: number; y: number; s?: number; phase: number; fill?: string; flip?: boolean; lantern?: boolean }> = ({ x, y, s = 1, phase, fill = "#0E0A07", flip, lantern }) => {
  const a = Math.sin(phase) * 18;
  const bob = Math.abs(Math.cos(phase)) * 6;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`}>
      <path d={`M -10 -150 L ${-10 + a * 2.2} 0 L ${4 + a * 2.2} 0 L 10 -150 Z`} fill={fill} />
      <path d={`M -10 -150 L ${-10 - a * 2.2} 0 L ${4 - a * 2.2} 0 L 10 -150 Z`} fill={fill} />
      <path d="M -60 -120 C -70 -230 -60 -320 -30 -350 L 30 -350 C 60 -320 70 -230 60 -120 Z" fill={fill} />
      <ellipse cx={4} cy={-395} rx={40} ry={46} fill={fill} />
      <path d="M -40 -420 C -40 -470 44 -470 44 -420 Z" fill={fill} />
      {lantern && (
        <g transform={`translate(80 ${-170 + a * 0.3})`}>
          <line x1={0} y1={-60} x2={0} y2={-20} stroke={fill} strokeWidth={4} />
          <rect x={-20} y={-20} width={40} height={56} rx={10} fill="#FFB65C" />
          <circle cx={0} cy={8} r={90} fill="#FFB65C" opacity={0.12} />
        </g>
      )}
    </g>
  );
};

/* ── 건물·사물 ───────── */
/** 기와지붕 실루엣(전각) */
export const Hall: React.FC<{ x: number; y: number; w: number; s?: number; fill?: string; lit?: boolean }> = ({ x, y, w, s = 1, fill = "#0B0A0C", lit }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M ${-w / 2 - 80} 0 Q ${-w / 2} -30 ${-w / 2 + 40} -70 L ${w / 2 - 40} -70 Q ${w / 2} -30 ${w / 2 + 80} 0 Q ${w / 2 + 40} -6 ${w / 2} -2 L ${-w / 2} -2 Q ${-w / 2 - 40} -6 ${-w / 2 - 80} 0 Z`} fill={fill} />
    <rect x={-w / 2 + 60} y={-100} width={w - 120} height={34} fill={fill} />
    <path d={`M ${-w / 2 + 40} -98 Q 0 -120 ${w / 2 - 40} -98 L ${w / 2 - 60} -104 L ${-w / 2 + 60} -104 Z`} fill={fill} />
    <rect x={-w / 2 + 30} y={0} width={w - 60} height={170} fill={fill} />
    {lit && [...Array(5)].map((_, i) => <rect key={i} x={-w / 2 + 70 + i * ((w - 140) / 5)} y={40} width={(w - 140) / 5 - 20} height={110} fill="#E0A45A" opacity={0.75} />)}
    <rect x={-w / 2 - 20} y={170} width={w + 40} height={30} fill={fill} />
  </g>
);

/** 창호지 문(격자) */
export const PaperDoor: React.FC<{ w: number; h: number; glow?: string; children?: React.ReactNode }> = ({ w, h, glow = "rgba(236,200,140,0.5)", children }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 80% 70%, ${glow} 0%, rgba(120,90,55,0.25) 55%, rgba(30,22,15,0.65) 100%)` }} />
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {children}
      {[...Array(Math.floor(w / 86))].map((_, i) => <line key={`v${i}`} x1={(i + 1) * 86} y1={0} x2={(i + 1) * 86} y2={h} stroke="#2A1D12" strokeWidth={7} />)}
      {[...Array(Math.floor(h / 92))].map((_, i) => <line key={`h${i}`} x1={0} y1={(i + 1) * 92} x2={w} y2={(i + 1) * 92} stroke="#2A1D12" strokeWidth={7} />)}
      <rect x={0} y={0} width={w} height={h} fill="none" stroke="#1C140C" strokeWidth={26} />
    </svg>
  </div>
);

/** 책 더미 */
export const Books: React.FC<{ x: number; y: number; n?: number; w?: number; color?: string; s?: number }> = ({ x, y, n = 5, w = 240, color = "#E6D9BC", s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[...Array(n)].map((_, i) => (
      <g key={i} transform={`translate(${(i % 2) * 10 - 5} ${-i * 22})`}>
        <rect x={0} y={-20} width={w} height={20} fill={color} opacity={0.9} />
        <rect x={0} y={-20} width={10} height={20} fill="#5A3A26" />
        <line x1={w * 0.2} y1={-20} x2={w * 0.2} y2={0} stroke="#8B6A4A" strokeWidth={2} />
      </g>
    ))}
  </g>
);

/* ── 글자 효과 ───────── */
/** 흐림에서 선명해지며 나타나는 글자 */
export const Reveal: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; out?: number }> = ({ at, dur = 16, children, style, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + dur) * (out === undefined ? 1 : 1 - ease(f, out, out + 12));
  return <div style={{ opacity: p, filter: `blur(${(1 - Math.min(1, ease(f, at, at + dur))) * 8}px)`, transform: `translateY(${(1 - ease(f, at, at + dur)) * 14}px)`, ...style }}>{children}</div>;
};

/** 인용문: 단어별로 흐림→선명 */
export const QuoteText: React.FC<{ cut: Cut; lines: string[]; size?: number; color?: string; sent?: number; font?: string; glow?: string }> = ({ cut, lines, size = 66, color = C.cream, sent, font = SERIF, glow = "rgba(255,190,110,0.35)" }) => {
  const f = useCurrentFrame();
  const s = sent !== undefined ? cut.sentences[sent] : cut.sentences.find((x) => x.quote) ?? cut.sentences[0];
  const words = lines.join(" ").split(" ");
  const base = s ? fr(s.start) : 0;
  const span = s ? fr(s.end) - base : 60;
  let k = 0;
  return (
    <div style={{ fontFamily: font, fontWeight: 600, fontSize: size, color, lineHeight: 1.5, textAlign: "center", textShadow: `0 0 26px ${glow}` }}>
      {lines.map((ln, li) => (
        <div key={li}>
          {ln.split(" ").map((w, wi) => {
            const a = base - 4 + Math.round((k++ / words.length) * span * 0.85);
            const p = ease(f, a, a + 12);
            return (
              <span key={wi} style={{ opacity: p, filter: `blur(${(1 - p) * 8}px)`, display: "inline-block", margin: "0 10px" }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Ground: React.FC<{ color: string; children?: React.ReactNode }> = ({ color, children }) => <AbsoluteFill style={{ background: color, overflow: "hidden" }}>{children}</AbsoluteFill>;
