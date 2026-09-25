/**
 * 세종 영상 공통 부품: 색·글꼴, 한지/먹 바탕, 자막, 표시 태그, 시야 흐림, 촛불, 인물 실루엣.
 * 스타일: 한지 위 먹선 + 촛불 한 점(주황)만 포인트 색으로 쓴다.
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import BREAKS from "../../public/sejong/subtitle_breaks.json";

export const S = {
  paper: "#ECE4D2",
  ink: "#1E1B18",
  ink2: "#4A443C",
  mute: "#8C8273",
  dark: "#0F0D0B",
  darkInk: "#E9E1CF",
  flame: "#F2A33A",
  glow: "#F7C66B",
  seal: "#A8322A",
  line: "rgba(30,27,24,0.25)",
};
export const SERIF = "'Gowun Batang', 'Nanum Myeongjo', serif";
export const SANS = "'Gowun Dodum', 'Noto Sans KR', sans-serif";
export const FPS = 30;

export type Seg = { text: string; start: number; end: number; voice?: string };
export type Cut = {
  id: string;
  sec: string;
  scene: string;
  note?: string;
  vision?: number;
  visionTo?: number;
  visionAt?: number;
  p: any;
  lines: string[];
  segments: Seg[];
  from: number;
  duration: number;
};
export type SceneProps = { cut: Cut };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });
/** i 번째 줄이 시작하는 프레임 */
export const at = (cut: Cut, i: number) => Math.round((cut.segments[Math.min(i, cut.segments.length - 1)]?.start ?? 0) * FPS);
export const endAt = (cut: Cut, i: number) => Math.round((cut.segments[Math.min(i, cut.segments.length - 1)]?.end ?? 0) * FPS);

/** 등장: 투명 → 불투명 + 살짝 위로 */
export const Rise: React.FC<{ from: number; dur?: number; dy?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  from,
  dur = 16,
  dy = 24,
  style,
  children,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, from, from + dur);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

/** 바탕: 한지(밝음) 또는 먹(어두움). 천천히 확대되는 켄 번스. */
export const Ground: React.FC<{ dark?: boolean; children?: React.ReactNode; zoom?: number }> = ({ dark, children, zoom = 0.035 }) => {
  const f = useCurrentFrame();
  const z = 1 + zoom * Math.min(1, f / 600);
  return (
    <AbsoluteFill style={{ background: dark ? S.dark : S.paper, overflow: "hidden" }}>
      <Img src={staticFile(dark ? "sejong/meok.png" : "sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%" }} />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 화면 한가운데 SVG 캔버스(1920×1080 좌표) */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}>
    {children}
  </svg>
);

/**
 * 자막 줄바꿈: 26자를 넘으면 두 줄로 나눈다.
 * 가운데에 가까운 쉼표 뒤를 먼저 고르고, 없으면 가운데에 가까운 띄어쓰기에서 끊는다(어절 단위).
 */
export const breakLine = (text: string): string[] => {
  const manual = (BREAKS as Record<string, string[]>)[text];
  if (manual) return manual;
  const MAX = 27;
  if (text.length <= MAX) return [text];
  const mid = text.length / 2;
  let best = -1;
  let score = Infinity;
  for (let i = 1; i < text.length - 1; i++) {
    if (text[i] !== " ") continue;
    const a = text.slice(0, i);
    const b = text.slice(i + 1);
    const longest = Math.max(a.length, b.length);
    let sc = Math.abs(i - mid) + Math.max(0, longest - 30) * 4;
    if (a.endsWith(",")) sc -= text.length * 0.3; // 쉼표 뒤는 자연스러운 쉼
    // 보조 용언·의존 명사 앞(읽고 / 있는), 관형어 뒤(한 / 왕)에서는 끊지 않는다
    if (/^(있|했|하|않|못|수 |것|때|줄|뿐|듯|적|거|된|되|싶|버|보|주)/.test(b)) sc += 14;
    if (/(^| )(한|그|이|저|두|세|네|몇|각|온|새|옛|헌|첫|더|덜|잘|안|못|꼭|또)$/.test(a)) sc += 14;
    if (/(고|어|아|여|해|야|게|지)$/.test(a) && /^(있|했|하|않|싶|버|보|주|두|놓|내)/.test(b)) sc += 20;
    if (/["“]$/.test(a)) sc += 20;
    if (sc < score) {
      score = sc;
      best = i;
    }
  }
  return best < 0 ? [text] : [text.slice(0, best), text.slice(best + 1)];
};

/** 자막: 지금 말하고 있는 줄을 아래에 */
export const Subtitle: React.FC<{ cut: Cut }> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seg = cut.segments.find((s, i) => t >= s.start - 0.05 && t < (cut.segments[i + 1]?.start ?? s.end + 0.6) - 0.05);
  if (!seg) return null;
  const s0 = Math.round(seg.start * FPS);
  const o = ease(f, s0 - 2, s0 + 5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 40,
        display: "flex",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <div
        style={{
          maxWidth: 1720,
          padding: "12px 40px 16px",
          background: "rgba(12,10,8,0.7)",
          borderRadius: 8,
          color: "#F4EEE2",
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 52,
          lineHeight: 1.38,
          WebkitTextStroke: "0.5px #F4EEE2",
          textAlign: "center",
          wordBreak: "keep-all",
          letterSpacing: "-0.01em",
        }}
      >
        {breakLine(seg.text).map((l, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

/** 재구성·가설·야사 표시 */
export const NoteTag: React.FC<{ text?: string }> = ({ text }) => {
  const f = useCurrentFrame();
  if (!text) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        right: 52,
        opacity: ease(f, 6, 20) * 0.92,
        padding: "8px 18px",
        border: "2px solid rgba(233,225,207,0.7)",
        background: "rgba(15,13,11,0.55)",
        color: "#E9E1CF",
        fontFamily: SANS,
        fontSize: 26,
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </div>
  );
};

/** 시야 흐림: 세종의 눈. v=0 선명, v=1 가장 흐림(가장자리 어둡게 + 흐림) */
export const visionAt = (cut: Cut, f: number, prev: number) => {
  const v0 = cut.vision ?? 0;
  const enter = interpolate(f, [0, 24], [prev, v0], clamp);
  if (cut.visionTo === undefined) return enter;
  const s = cut.visionAt !== undefined ? at(cut, cut.visionAt) : 0;
  const e = cut.visionAt !== undefined ? endAt(cut, cut.visionAt) : cut.duration;
  return f < s ? enter : interpolate(f, [s, e], [v0, cut.visionTo], { ...clamp, easing: Easing.inOut(Easing.cubic) });
};

export const Vignette: React.FC<{ v: number }> = ({ v }) =>
  v <= 0.01 ? null : (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) ${Math.round(58 - v * 38)}%, rgba(6,5,4,${(0.55 + v * 0.4).toFixed(2)}) 100%)`,
      }}
    />
  );

/** 촛불 한 자루 (x, y = 심지 아래) */
export const Candle: React.FC<{ x: number; y: number; s?: number; h?: number; lit?: number }> = ({ x, y, s = 1, h = 120, lit = 1 }) => {
  const f = useCurrentFrame();
  const flick = 1 + 0.06 * Math.sin(f * 0.9) + 0.04 * Math.sin(f * 2.3 + 1);
  const sway = 2 * Math.sin(f * 0.37);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="cglow">
          <stop offset="0%" stopColor={S.glow} stopOpacity={0.55} />
          <stop offset="100%" stopColor={S.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      {lit > 0 && <circle cx={0} cy={-36} r={230 * flick} fill="url(#cglow)" opacity={lit} />}
      <rect x={-22} y={0} width={44} height={h} rx={4} fill="#EFE7D6" />
      <rect x={-22} y={0} width={44} height={h} rx={4} fill="url(#cglow)" opacity={0.25} />
      <path d={`M -22 4 q 6 16 0 28`} stroke="#DCD2BE" strokeWidth={6} fill="none" />
      <line x1={0} y1={0} x2={0} y2={-12} stroke="#2A241E" strokeWidth={3} />
      {lit > 0 && (
        <g opacity={lit} transform={`translate(${sway} -12) scale(1 ${flick})`}>
          <path d="M 0 -62 C 16 -34 16 -8 0 0 C -16 -8 -16 -34 0 -62 Z" fill={S.flame} />
          <path d="M 0 -40 C 7 -24 7 -8 0 -3 C -7 -8 -7 -24 0 -40 Z" fill="#FFF1C9" />
        </g>
      )}
      <ellipse cx={0} cy={h} rx={60} ry={10} fill="rgba(0,0,0,0.35)" />
    </g>
  );
};

/** 조선 관리 실루엣(사모를 쓴 옆모습·절하는 모습 등). kind: stand | bow | sit | slump | king */
export const Figure: React.FC<{ x: number; y: number; s?: number; kind?: string; fill?: string; flip?: boolean; robe?: string }> = ({
  x,
  y,
  s = 1,
  kind = "sit",
  fill = S.ink,
  flip,
  robe,
}) => {
  const body = robe ?? fill;
  const hat =
    kind === "king" ? (
      // 익선관 느낌: 둥근 관 + 뒤로 솟은 날개
      <g>
        <path d="M -40 -250 C -40 -300 40 -300 40 -250 L 40 -235 L -40 -235 Z" fill={fill} />
        <ellipse cx={30} cy={-292} rx={20} ry={13} fill={fill} />
        <ellipse cx={-30} cy={-292} rx={20} ry={13} fill={fill} />
      </g>
    ) : (
      // 사모: 둥근 관 + 양옆 날개
      <g>
        <path d="M -34 -250 C -34 -292 34 -292 34 -250 L 34 -236 L -34 -236 Z" fill={fill} />
        <rect x={-74} y={-262} width={148} height={10} rx={5} fill={fill} />
      </g>
    );
  const poses: Record<string, React.ReactNode> = {
    sit: (
      <g>
        {hat}
        <circle cx={0} cy={-212} r={38} fill={fill} />
        <path d="M -70 -170 C -100 -120 -120 -40 -130 0 L 130 0 C 120 -40 100 -120 70 -170 Z" fill={body} />
      </g>
    ),
    king: (
      <g>
        {hat}
        <circle cx={0} cy={-212} r={40} fill={fill} />
        <path d="M -80 -170 C -120 -120 -140 -40 -150 0 L 150 0 C 140 -40 120 -120 80 -170 Z" fill={body} />
      </g>
    ),
    stand: (
      <g>
        {hat}
        <circle cx={0} cy={-212} r={38} fill={fill} />
        <path d="M -62 -172 C -80 -60 -86 120 -96 250 L 96 250 C 86 120 80 -60 62 -172 Z" fill={body} />
      </g>
    ),
    bow: (
      <g>
        <path d="M -150 0 C -150 -90 -60 -140 40 -130 C 120 -120 170 -60 190 0 Z" fill={body} stroke={fill} strokeWidth={robe ? 5 : 0} />
        <g transform="translate(190 -30) rotate(75)">
          <circle cx={0} cy={0} r={36} fill={fill} />
          <path d="M -32 -30 C -32 -70 32 -70 32 -30 L 32 -18 L -32 -18 Z" fill={fill} />
          <rect x={-66} y={-40} width={132} height={10} rx={5} fill={fill} />
        </g>
      </g>
    ),
    slump: (
      <g>
        <g transform="translate(60 40) rotate(38)">{hat}<circle cx={0} cy={-212} r={38} fill={fill} /></g>
        <path d="M -80 -150 C -110 -100 -125 -40 -130 0 L 130 0 C 125 -60 110 -110 60 -160 Z" fill={body} />
      </g>
    ),
  };
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{poses[kind] ?? poses.sit}</g>;
};

/** 붓으로 긋는 선(왼쪽→오른쪽으로 그려짐) */
export const Brush: React.FC<{ x: number; y: number; w: number; from: number; color?: string; h?: number }> = ({ x, y, w, from, color = S.ink, h = 10 }) => {
  const f = useCurrentFrame();
  const p = ease(f, from, from + 18);
  return (
    <path
      d={`M ${x} ${y} q ${w * 0.25} ${-h * 0.6} ${w * 0.5} 0 t ${w * 0.5} 0`}
      stroke={color}
      strokeWidth={h}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={w * 1.2}
      strokeDashoffset={w * 1.2 * (1 - p)}
      opacity={0.85}
    />
  );
};

/** 빨간 도장(인장) */
export const Seal: React.FC<{ x: number; y: number; text: string; from: number; size?: number; rot?: number }> = ({ x, y, text, from, size = 150, rot = -8 }) => {
  const f = useCurrentFrame();
  const p = ease(f, from, from + 6, 0, 1, Easing.out(Easing.back(3)));
  if (f < from) return null;
  const sc = 1.6 - 0.6 * p;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={10} fill="none" stroke={S.seal} strokeWidth={9} />
      <text x={0} y={size * 0.16} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size * (text.length > 1 ? 0.42 : 0.6)} fill={S.seal}>
        {text}
      </text>
    </g>
  );
};
