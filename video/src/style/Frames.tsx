import React from "react";
import { AbsoluteFill } from "remotion";

const SANS = "'Noto Sans CJK JP', sans-serif";
const SERIF = "'Noto Serif CJK JP', serif";
const ORANGE = "#ef8a2a";
const BLUE = "#3a7bd5";
const RED = "#d8443a";

const Sub: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", padding: "10px 28px", background: dark ? "rgba(10,14,28,.72)" : "rgba(40,30,20,.78)", borderRadius: 6 }}>{text}</div>
  </div>
);

// 切り抜いた紙のおにぎり
export const PaperOnigiri: React.FC<{ x: number; y: number; s?: number; r?: number; gray?: boolean }> = ({ x, y, s = 1, r = 0, gray }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} filter="url(#cut)">
    <path d="M0,-46 C10,-46 52,22 50,34 C48,46 -48,46 -50,34 C-52,22 -10,-46 0,-46Z" fill="#fff" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
    <path d="M0,-46 C10,-46 52,22 50,34 C48,46 -48,46 -50,34 C-52,22 -10,-46 0,-46Z" fill={gray ? "#d9d4c8" : "#fbf8f0"} />
    <rect x={-22} y={8} width={44} height={36} rx={3} fill={gray ? "#6d6a64" : "#1f2a24"} />
  </g>
);

export const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={6} cy={10} rx={14} ry={6} fill="rgba(0,0,0,.25)" />
    <circle r={15} fill={RED} />
    <circle cx={-5} cy={-5} r={5} fill="#ff9a8f" />
  </g>
);

export const Card: React.FC<{ x: number; y: number; w: number; h: number; r: number; children: React.ReactNode; color?: string }> = ({ x, y, w, h, r, children, color = "#f6f0e1" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} filter="url(#paper)" />
    {children}
  </g>
);

// B: 紙の質感 + 捜査ボード
export const StyleB: React.FC = () => (
  <AbsoluteFill style={{ background: "#a87b4f" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <defs>
        <filter id="cork">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.16  0 0 0 0.55 0" />
        </filter>
        <filter id="paper" x="-10%" y="-10%" width="120%" height="125%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={2} result="n" />
          <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" result="spots" />
          <feComposite in="spots" in2="SourceGraphic" operator="in" result="tex" />
          <feMerge result="m"><feMergeNode in="SourceGraphic" /><feMergeNode in="tex" /></feMerge>
          <feDropShadow in="m" dx={6} dy={12} stdDeviation={8} floodOpacity={0.35} />
        </filter>
        <filter id="cut" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx={3} dy={6} stdDeviation={3} floodOpacity={0.3} />
        </filter>
        <radialGradient id="vig" cx="50%" cy="45%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} filter="url(#cork)" />

      {/* マスキングテープの見出し */}
      <g transform="translate(250 92) rotate(-2)">
        <rect x={-150} y={-30} width={300} height={60} fill="#efe3b8" opacity={0.92} filter="url(#cut)" />
        <text textAnchor="middle" y={12} fontFamily={SANS} fontWeight={900} fontSize={30} fill="#5a4630" letterSpacing={3}>CLUE 03 ／ 計算</text>
      </g>

      {/* 赤い糸 */}
      <g stroke={RED} strokeWidth={4} fill="none" opacity={0.9}>
        <path d="M520,188 Q700,520 940,560" />
        <path d="M1380,170 Q1200,480 980,560" />
        <path d="M1000,560 Q1300,640 1560,610" />
      </g>

      {/* ① 捨てる */}
      <Card x={520} y={380} w={600} h={400} r={-3}>
        <text x={-270} y={-140} fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#3a2e22">① 2個を捨てる</text>
        {Array.from({ length: 8 }, (_, i) => <PaperOnigiri key={i} x={-230 + (i % 4) * 78} y={-60 + Math.floor(i / 4) * 84} s={0.62} r={(i * 7) % 9 - 4} />)}
        {/* ごみ袋の2個 */}
        <g transform="translate(180 -20)">
          <path d="M-70,-60 L70,-60 L84,80 Q0,100 -84,80Z" fill="#dfe6ea" opacity={0.85} filter="url(#cut)" />
          <PaperOnigiri x={-28} y={10} s={0.55} r={-20} gray />
          <PaperOnigiri x={30} y={30} s={0.55} r={25} gray />
        </g>
        <line x1={-270} y1={92} x2={270} y2={92} stroke="#c9bda4" strokeWidth={2} strokeDasharray="6 6" />
        <text x={-270} y={150} fontFamily={SANS} fontWeight={700} fontSize={36} fill={BLUE}>本部 +56円</text>
        <text x={40} y={150} fontFamily={SANS} fontWeight={900} fontSize={36} fill={RED}>店 −56円</text>
      </Card>
      <Pin x={520} y={188} />

      {/* ② 値引き */}
      <Card x={1380} y={360} w={600} h={400} r={2.5}>
        <text x={-270} y={-140} fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#3a2e22">② 50円で売り切る</text>
        {Array.from({ length: 10 }, (_, i) => <PaperOnigiri key={i} x={-230 + (i % 5) * 112} y={-60 + Math.floor(i / 5) * 84} s={0.62} r={(i * 5) % 7 - 3} />)}
        {[3, 4].map((i) => (
          <g key={i} transform={`translate(${-230 + i * 112 + 30} ${-60 + 84 - 40}) rotate(-12)`}>
            <circle r={24} fill="#f6c63b" filter="url(#cut)" />
            <text textAnchor="middle" y={8} fontFamily={SANS} fontWeight={900} fontSize={20} fill="#6b3d00">50円</text>
          </g>
        ))}
        <line x1={-270} y1={92} x2={270} y2={92} stroke="#c9bda4" strokeWidth={2} strokeDasharray="6 6" />
        <text x={-270} y={150} fontFamily={SANS} fontWeight={700} fontSize={36} fill={BLUE}>本部 +50円</text>
        <text x={40} y={150} fontFamily={SANS} fontWeight={900} fontSize={36} fill={ORANGE}>店 +50円</text>
      </Card>
      <Pin x={1380} y={170} />

      {/* 差：大きさの違いがそのまま答え */}
      <Card x={960} y={720} w={560} h={290} r={-1} color="#fffaf0">
        <text x={0} y={-90} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} fill="#6b5a44">値引きすると</text>
        <text x={-100} y={20} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={34} fill="#3a2e22">店</text>
        <text x={-40} y={30} fontFamily={SANS} fontWeight={900} fontSize={88} fill={ORANGE}>+106円</text>
        <text x={-100} y={100} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={28} fill="#3a2e22">本部</text>
        <text x={-40} y={102} fontFamily={SANS} fontWeight={900} fontSize={40} fill={BLUE}>−6円</text>
      </Card>
      <Pin x={960} y={560} />

      {/* 付箋：次の問い */}
      <g transform="translate(1600 680) rotate(6)">
        <rect x={-150} y={-110} width={300} height={220} fill="#ffe26a" filter="url(#paper)" />
        <text textAnchor="middle" y={-30} fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#4a3a10">本部の損は</text>
        <text textAnchor="middle" y={18} fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#4a3a10">6円だけ。</text>
        <text textAnchor="middle" y={72} fontFamily={SERIF} fontWeight={700} fontSize={38} fill={RED}>なのに、なぜ？</text>
      </g>
      <Pin x={1610} y={580} />

      <text x={60} y={900} fontFamily={SANS} fontSize={20} fill="#f3e6cf" opacity={0.85}>※計算・イメージ（仕入れ80円・売値100円・利益を半分ずつ、捨てた分は本部15%）</text>
      <rect width={1920} height={1080} fill="url(#vig)" />
    </svg>
    <Sub text="値引きすると、店は106円よくなり、本部は6円減る。" />
  </AbsoluteFill>
);
