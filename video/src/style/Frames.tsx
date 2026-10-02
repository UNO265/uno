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
const PaperOnigiri: React.FC<{ x: number; y: number; s?: number; r?: number; gray?: boolean }> = ({ x, y, s = 1, r = 0, gray }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} filter="url(#cut)">
    <path d="M0,-46 C10,-46 52,22 50,34 C48,46 -48,46 -50,34 C-52,22 -10,-46 0,-46Z" fill="#fff" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
    <path d="M0,-46 C10,-46 52,22 50,34 C48,46 -48,46 -50,34 C-52,22 -10,-46 0,-46Z" fill={gray ? "#d9d4c8" : "#fbf8f0"} />
    <rect x={-22} y={8} width={44} height={36} rx={3} fill={gray ? "#6d6a64" : "#1f2a24"} />
  </g>
);

const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={6} cy={10} rx={14} ry={6} fill="rgba(0,0,0,.25)" />
    <circle r={15} fill={RED} />
    <circle cx={-5} cy={-5} r={5} fill="#ff9a8f" />
  </g>
);

const Card: React.FC<{ x: number; y: number; w: number; h: number; r: number; children: React.ReactNode; color?: string }> = ({ x, y, w, h, r, children, color = "#f6f0e1" }) => (
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

// アイソメトリック座標
const S = 30;
const iso = (x: number, y: number, z = 0): [number, number] => [600 + (x - y) * 0.866 * S, 650 + (x + y) * 0.5 * S - z * S];
const pts = (a: [number, number][]) => a.map((p) => p.join(",")).join(" ");
const Box: React.FC<{ x: number; y: number; w: number; d: number; h: number; top: string; left: string; right: string; z?: number }> = ({ x, y, w, d, h, top, left, right, z = 0 }) => (
  <g>
    <polygon points={pts([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} fill={left} />
    <polygon points={pts([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)])} fill={right} />
    <polygon points={pts([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)])} fill={top} />
  </g>
);
const Coin: React.FC<{ p: [number, number]; o?: number; r?: number }> = ({ p, o = 1, r = 16 }) => (
  <g transform={`translate(${p[0]} ${p[1]})`} opacity={o}>
    <ellipse rx={r} ry={r * 0.62} cy={4} fill="#a87a12" />
    <ellipse rx={r} ry={r * 0.62} fill="#f6c63b" stroke="#ffe48a" strokeWidth={2} />
  </g>
);

// C: ミニチュアの街 + シミュレーター
export const StyleC: React.FC = () => {
  const store = iso(2.5, 1, 0);
  const hq = iso(-6, -7, 0);
  const fa = iso(2.5, 1, 3.6), fc = iso(0, -9, 10), fb = iso(-4, -7, 5.5);
  const flow = `M${fa.join(",")} Q${fc.join(",")} ${fb.join(",")}`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 45%, #1d2a4a 0%, #0b1122 70%)" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={18} /></filter>
          <filter id="sh"><feDropShadow dx={0} dy={14} stdDeviation={14} floodOpacity={0.45} /></filter>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f2b48" stopOpacity={0.92} /><stop offset="1" stopColor="#141c33" stopOpacity={0.92} /></linearGradient>
        </defs>
        {/* 地面 */}
        <polygon points={pts([iso(-12, -12), iso(12, -12), iso(12, 12), iso(-12, 12)])} fill="#17223d" />
        {Array.from({ length: 13 }, (_, i) => -12 + i * 2).map((v) => (
          <g key={v} stroke="#22305a" strokeWidth={1}>
            <line x1={iso(v, -12)[0]} y1={iso(v, -12)[1]} x2={iso(v, 12)[0]} y2={iso(v, 12)[1]} />
            <line x1={iso(-12, v)[0]} y1={iso(-12, v)[1]} x2={iso(12, v)[0]} y2={iso(12, v)[1]} />
          </g>
        ))}
        {/* 道 */}
        <polygon points={pts([iso(-12, 6), iso(12, 6), iso(12, 8), iso(-12, 8)])} fill="#202c4c" />

        {/* 本部ビル */}
        <Box x={-8} y={-9} w={4} d={4} h={7} top="#5b86c9" left="#2f4f86" right="#3d64a6" />
        {Array.from({ length: 5 }, (_, r) => [0, 1, 2].map((c) => (
          <g key={`${r}${c}`}>
            <polygon points={pts([iso(-7.6 + c * 1.2, -5, 1 + r * 1.2), iso(-6.9 + c * 1.2, -5, 1 + r * 1.2), iso(-6.9 + c * 1.2, -5, 1.7 + r * 1.2), iso(-7.6 + c * 1.2, -5, 1.7 + r * 1.2)])} fill="#9fc3ff" opacity={0.3 + ((r + c) % 3) * 0.25} />
            <polygon points={pts([iso(-4, -8.6 + c * 1.2, 1 + r * 1.2), iso(-4, -7.9 + c * 1.2, 1 + r * 1.2), iso(-4, -7.9 + c * 1.2, 1.7 + r * 1.2), iso(-4, -8.6 + c * 1.2, 1.7 + r * 1.2)])} fill="#9fc3ff" opacity={0.2 + ((r + c + 1) % 3) * 0.2} />
          </g>
        )))}
        <text x={hq[0]} y={iso(-6, -7, 7)[1] - 70} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#9fc3ff">本部</text>

        {/* 店：窓の明かり */}
        <ellipse cx={iso(3.5, 4)[0]} cy={iso(3.5, 4)[1]} rx={230} ry={90} fill="#ffb347" opacity={0.35} filter="url(#glow)" />
        <Box x={0} y={-1} w={5} d={4} h={3} top="#e9e4da" left="#cfc7b8" right="#bfb6a6" />
        <Box x={0} y={-1} w={5} d={4} h={0.6} z={3} top="#f39a3c" left="#d8742a" right="#c4651f" />
        <polygon points={pts([iso(0.5, 3, 0.2), iso(4.5, 3, 0.2), iso(4.5, 3, 2.4), iso(0.5, 3, 2.4)])} fill="#ffe2a6" />
        {[0, 1, 2, 3].map((i) => <polygon key={i} points={pts([iso(0.9 + i, 3, 1.3), iso(1.6 + i, 3, 1.3), iso(1.6 + i, 3, 1.7), iso(0.9 + i, 3, 1.7)])} fill="#fff" opacity={0.9} />)}
        <text x={store[0] + 150} y={iso(2.5, 1, 3.6)[1] - 10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#ffc98a">店</text>

        {/* ごみ袋：薄く（捨てなかった） */}
        <g opacity={0.3}>
          <path d={`M${iso(6.5, 2.5)[0] - 26},${iso(6.5, 2.5)[1]} q26,-70 52,0 q-26,14 -52,0z`} fill="#c9d4da" />
        </g>
        <text x={iso(6.5, 2.5)[0] + 20} y={iso(6.5, 2.5)[1] + 30} textAnchor="middle" fontFamily={SANS} fontSize={20} fill="#7f8db0">廃棄 0個</text>

        {/* お金の流れ（店 → 本部） */}
        <path d={flow} fill="none" stroke="#f6c63b" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" opacity={0.7} />
        {[0.15, 0.4, 0.65].map((t, i) => {
          const a = fa, c = fc, b = fb;
          const q = (k: number) => (1 - t) ** 2 * a[k] + 2 * (1 - t) * t * c[k] + t * t * b[k];
          return <Coin key={i} p={[q(0), q(1)]} o={0.55 + i * 0.2} />;
        })}
        <text x={fc[0] + 10} y={fc[1] + 120} fontFamily={SANS} fontWeight={700} fontSize={24} fill="#f6c63b">チャージ</text>

        {/* シミュレーター */}
        <g transform="translate(1180 120)" filter="url(#sh)">
          <rect width={660} height={700} rx={22} fill="url(#glass)" stroke="#33446e" strokeWidth={2} />
          <text x={36} y={62} fontFamily={MONO} fontSize={22} fill="#7f8db0" letterSpacing={2}>SIMULATOR</text>
          <text x={36} y={110} fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff">売れ残り 2個 を…</text>
          {/* トグル */}
          <rect x={36} y={140} width={588} height={64} rx={32} fill="#0e1528" />
          <rect x={330} y={146} width={288} height={52} rx={26} fill={ORANGE} />
          <text x={183} y={182} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} fill="#7f8db0">捨てる</text>
          <text x={474} y={182} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill="#fff">50円で売り切る</text>
          {/* 0軸の棒：薄い棒 = 捨てたとき */}
          <line x1={330} y1={240} x2={330} y2={470} stroke="#55648c" strokeWidth={2} />
          <text x={330} y={490} textAnchor="middle" fontFamily={SANS} fontSize={18} fill="#7f8db0">0</text>
          <text x={36} y={302} fontFamily={SANS} fontWeight={700} fontSize={30} fill="#9fc3ff">本部</text>
          <rect x={330} y={268} width={56 * 2.4} height={46} rx={6} fill="none" stroke={BLUE} strokeWidth={2} strokeDasharray="6 5" />
          <rect x={330} y={268} width={50 * 2.4} height={46} rx={6} fill={BLUE} />
          <text x={470} y={302} fontFamily={SANS} fontWeight={900} fontSize={30} fill="#fff">50円</text>
          <g transform="translate(560 291)"><rect x={-4} y={-22} width={64} height={40} rx={20} fill="#2b3a63" /><text x={28} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#9fc3ff">−6</text></g>
          <text x={36} y={412} fontFamily={SANS} fontWeight={700} fontSize={30} fill="#ffc98a">店</text>
          <rect x={330 - 56 * 2.4} y={378} width={56 * 2.4} height={46} rx={6} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="6 5" />
          <rect x={330} y={378} width={50 * 2.4} height={46} rx={6} fill={ORANGE} />
          <text x={470} y={412} fontFamily={SANS} fontWeight={900} fontSize={30} fill="#fff">50円</text>
          <g transform="translate(560 401)"><rect x={-20} y={-24} width={96} height={44} rx={22} fill={ORANGE} /><text x={28} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill="#fff">+106</text></g>
          <text x={36} y={460} fontFamily={SANS} fontSize={18} fill="#7f8db0">点線 = 捨てたとき（店 −56円）</text>
          {/* 条件スライダー：次の章（新契約）へつながる変数 */}
          <line x1={36} y1={548} x2={624} y2={548} stroke="#33446e" strokeWidth={2} />
          <text x={36} y={600} fontFamily={SANS} fontWeight={700} fontSize={26} fill="#fff">捨てた分の本部負担</text>
          <rect x={36} y={630} width={588} height={10} rx={5} fill="#0e1528" />
          <rect x={36} y={630} width={588 * 0.15} height={10} rx={5} fill={BLUE} />
          <circle cx={36 + 588 * 0.15} cy={635} r={16} fill="#fff" />
          <text x={36 + 588 * 0.15} y={680} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#9fc3ff">15%</text>
          <line x1={36 + 588 * 0.5} y1={622} x2={36 + 588 * 0.5} y2={648} stroke="#55648c" strokeWidth={3} />
          <text x={36 + 588 * 0.5} y={680} textAnchor="middle" fontFamily={SANS} fontSize={20} fill="#55648c">50%（新契約）</text>
        </g>
        <text x={60} y={900} fontFamily={SANS} fontSize={20} fill="#7f8db0">※計算・イメージ（仕入れ80円・売値100円・利益を半分ずつ、捨てた分は本部15%）</text>
      </svg>
      <Sub text="値引きすると、店は106円よくなり、本部は6円減る。" dark />
    </AbsoluteFill>
  );
};
const MONO = "'DejaVu Sans Mono', monospace";
