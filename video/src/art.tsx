/**
 * フラット 2D のイラスト部品。すべて原点 (0,0) 中心の <g> を返し、
 * 呼び出し側の <svg viewBox="0 0 1920 1080"> 内で transform して配置する。
 */
import React from "react";
import { C, FONT } from "./theme";

type G = { x?: number; y?: number; s?: number; r?: number; o?: number };
const tf = ({ x = 0, y = 0, s = 1, r = 0 }: G) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

export const At: React.FC<G & { children: React.ReactNode }> = ({ children, o = 1, ...g }) => (
  <g transform={tf(g)} opacity={o}>
    {children}
  </g>
);

/* ── 値札（メインモチーフ） ───────────────────────── */
export const PriceTag: React.FC<{ w?: number; h?: number; text?: string; color?: string; string?: boolean; fontSize?: number }> = ({
  w = 380,
  h = 180,
  text = "100円",
  color = C.red,
  string = true,
  fontSize,
}) => {
  const x0 = -w / 2;
  const tip = h * 0.42;
  const rr = 22;
  const d = `M ${x0} 0 L ${x0 + tip} ${-h / 2} H ${w / 2 - rr} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + rr} V ${
    h / 2 - rr
  } Q ${w / 2} ${h / 2} ${w / 2 - rr} ${h / 2} H ${x0 + tip} Z`;
  const hx = x0 + tip * 0.62;
  return (
    <g>
      {string && (
        <path
          d={`M ${hx} 0 C ${hx - 30} ${-h * 0.6}, ${hx + 40} ${-h * 1.1}, ${hx + 10} ${-h * 1.9}`}
          stroke={C.ink}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      )}
      <path d={d} fill="rgba(0,0,0,0.12)" transform="translate(8 10)" />
      <path d={d} fill={color} />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="10 8" transform={`scale(0.9)`} />
      <circle cx={hx} cy={0} r={h * 0.085} fill={C.paper} stroke="rgba(0,0,0,0.15)" strokeWidth={3} />
      <text
        x={tip * 0.45}
        y={h * 0.02}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={fontSize ?? h * 0.5}
        fill={C.white}
        letterSpacing={2}
      >
        {text}
      </text>
    </g>
  );
};

/* ── コイン（パイ状に削れる） ───────────────────────── */
const piePath = (r: number, f: number) => {
  if (f >= 0.999) return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
  const a = -Math.PI / 2 + f * 2 * Math.PI;
  const large = f > 0.5 ? 1 : 0;
  return `M 0 0 L 0 ${-r} A ${r} ${r} 0 ${large} 1 ${r * Math.cos(a)} ${r * Math.sin(a)} Z`;
};

export const Coin: React.FC<{ r?: number; fraction?: number; id: string; spin?: number; label?: boolean }> = ({
  r = 90,
  fraction = 1,
  id,
  spin = 0,
  label = true,
}) => (
  <g>
    <defs>
      <clipPath id={`coin-${id}`}>
        <path d={piePath(r + 2, Math.max(0.001, fraction))} />
      </clipPath>
    </defs>
    <ellipse cx={6} cy={r + 14} rx={r * 0.9 * Math.max(0.2, fraction)} ry={r * 0.12} fill="rgba(0,0,0,0.10)" />
    <g clipPath={`url(#coin-${id})`}>
      <g transform={`rotate(${spin})`}>
        <circle r={r} fill={C.gold} />
        <circle r={r * 0.82} fill="none" stroke={C.goldDeep} strokeWidth={r * 0.05} opacity={0.6} />
        {label && (
          <>
            <text
              y={-r * 0.02}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={FONT}
              fontWeight={900}
              fontSize={r * 0.66}
              fill={C.goldDeep}
            >
              100
            </text>
            <text y={r * 0.5} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={r * 0.24} fill={C.goldDeep}>
              円
            </text>
          </>
        )}
        <path d={`M ${-r * 0.55} ${-r * 0.55} A ${r * 0.78} ${r * 0.78} 0 0 1 ${r * 0.2} ${-r * 0.76}`} stroke="rgba(255,255,255,0.6)" strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
      </g>
    </g>
  </g>
);

/* ── 買い物かご ───────────────────────── */
export const BasketBack: React.FC<{ w?: number }> = ({ w = 560 }) => (
  <g>
    <path d={`M ${-w / 2} ${-w * 0.2} H ${w / 2}`} stroke="#B8321F" strokeWidth={22} strokeLinecap="round" />
    <path
      d={`M ${-w * 0.36} ${-w * 0.21} C ${-w * 0.3} ${-w * 0.55}, ${w * 0.3} ${-w * 0.55}, ${w * 0.36} ${-w * 0.21}`}
      stroke="#B8321F"
      strokeWidth={16}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

export const BasketFront: React.FC<{ w?: number }> = ({ w = 560 }) => {
  const top = -w * 0.2;
  const bot = w * 0.26;
  const holes = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const t = (bot - top) * (0.22 + row * 0.25);
      const inset = (t / (bot - top)) * w * 0.07;
      const width = w - 2 * inset - 90;
      const cx = -width / 2 + (width / 6) * col;
      holes.push(<rect key={`${row}-${col}`} x={cx - 18} y={top + t - 14} width={36} height={28} rx={8} fill="#B8321F" />);
    }
  }
  return (
    <g>
      <path d={`M ${-w / 2} ${top} L ${w / 2} ${top} L ${w * 0.43} ${bot} L ${-w * 0.43} ${bot} Z`} fill={C.red} />
      {holes}
      <rect x={-w / 2 - 6} y={top - 16} width={w + 12} height={30} rx={12} fill="#EE5A43" />
      <rect x={-w * 0.43} y={bot - 12} width={w * 0.86} height={14} rx={7} fill="#B8321F" />
    </g>
  );
};

/* ── 商品アイコン ───────────────────────── */
export const IconBox: React.FC = () => (
  <g>
    <rect x={-85} y={-50} width={170} height={110} rx={12} fill={C.blue} opacity={0.9} />
    <rect x={-92} y={-66} width={184} height={28} rx={10} fill="#5E97BA" />
    <rect x={-60} y={-30} width={120} height={70} rx={8} fill="rgba(255,255,255,0.35)" />
    <rect x={-100} y={-44} width={12} height={34} rx={4} fill="#4A7C9C" />
    <rect x={88} y={-44} width={12} height={34} rx={4} fill="#4A7C9C" />
  </g>
);

export const IconPan: React.FC = () => (
  <g>
    <rect x={40} y={-12} width={110} height={24} rx={12} fill="#6B4B35" />
    <circle r={70} fill={C.ink} />
    <circle r={56} fill="#3D4E6E" />
    <path d="M -34 -30 A 45 45 0 0 1 10 -44" stroke="rgba(255,255,255,0.35)" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const IconPencil: React.FC = () => (
  <g transform="rotate(-35)">
    <rect x={-90} y={-18} width={150} height={36} fill={C.orange} />
    <rect x={-90} y={-18} width={150} height={12} fill="#F7BE68" />
    <rect x={-116} y={-18} width={28} height={36} rx={6} fill="#F29CA3" />
    <rect x={-92} y={-18} width={10} height={36} fill="#C9C2B6" />
    <path d="M 60 -18 L 104 0 L 60 18 Z" fill="#F1D9B5" />
    <path d="M 90 -6 L 104 0 L 90 6 Z" fill={C.ink} />
  </g>
);

export const IconSpray: React.FC = () => (
  <g>
    <rect x={-45} y={-20} width={90} height={120} rx={22} fill={C.green} />
    <rect x={-30} y={10} width={60} height={50} rx={8} fill="rgba(255,255,255,0.55)" />
    <rect x={-16} y={-50} width={32} height={32} fill="#5E9C7E" />
    <path d="M -30 -50 H 40 L 60 -38 L 40 -30 H -10 L -30 -12 Z" fill={C.ink} />
  </g>
);

export const IconMug: React.FC = () => (
  <g>
    <path d="M 55 -20 C 100 -20, 100 40, 55 40" stroke={C.ink} strokeWidth={14} fill="none" />
    <rect x={-60} y={-55} width={120} height={120} rx={16} fill={C.white} stroke={C.ink} strokeWidth={6} />
    <rect x={-60} y={-5} width={120} height={20} fill={C.orange} opacity={0.8} />
  </g>
);

export const IconTape: React.FC = () => (
  <g>
    <circle r={62} fill={C.orange} />
    <circle r={30} fill={C.paper} />
    <path d="M 40 45 L 110 60 L 105 80 L 30 62 Z" fill="#F7BE68" />
  </g>
);

export const IconNotes: React.FC = () => (
  <g>
    <rect x={-58} y={-58} width={100} height={100} fill="#F9E27D" transform="rotate(-8)" />
    <rect x={-40} y={-40} width={100} height={100} fill="#F6CF4A" transform="rotate(6)" />
    <rect x={-20} y={-10} width={50} height={6} fill="rgba(0,0,0,0.15)" transform="rotate(6)" />
  </g>
);

export const IconSponge: React.FC = () => (
  <g>
    <rect x={-80} y={-15} width={160} height={55} rx={14} fill="#F6CF4A" />
    <rect x={-80} y={-45} width={160} height={34} rx={12} fill={C.green} />
    {[-50, -10, 30].map((x) => (
      <circle key={x} cx={x} cy={12} r={6} fill="#E3B736" />
    ))}
  </g>
);

export const PRODUCTS = [IconBox, IconPan, IconPencil, IconSpray, IconMug, IconTape, IconNotes, IconSponge];

/* ── 物流・製造アイコン ───────────────────────── */
export const IconMaterials: React.FC = () => (
  <g>
    <rect x={-90} y={10} width={120} height={40} rx={20} fill="#B98555" />
    <circle cx={30} cy={30} r={20} fill="#D8B083" />
    <circle cx={30} cy={30} r={8} fill="#B98555" />
    {[
      [40, -10, C.blue],
      [70, 0, C.orange],
      [60, -35, C.green],
      [95, -15, C.red],
      [85, 25, C.blue],
      [115, 20, C.orange],
    ].map(([x, y, c], i) => (
      <circle key={i} cx={x as number} cy={y as number} r={16} fill={c as string} />
    ))}
  </g>
);

export const IconFactory: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const p = ((t / 50 + i / 3) % 1 + 1) % 1;
      return <circle key={i} cx={75 + p * 30} cy={-150 - p * 90} r={16 + p * 26} fill="#D8D2C6" opacity={1 - p} />;
    })}
    <rect x={55} y={-150} width={36} height={110} fill={C.inkSoft} />
    <path d="M -130 -20 L -130 -70 L -80 -40 L -80 -70 L -30 -40 L -30 -70 L 20 -40 L 20 -70 L 70 -40 L 130 -40 L 130 90 L -130 90 Z" fill={C.ink} />
    {[-100, -50, 0, 50, 100].map((x) => (
      <rect key={x} x={x - 14} y={10} width={28} height={36} rx={4} fill={C.orange} />
    ))}
  </g>
);

export const IconShip: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g transform={`translate(0 ${Math.sin(t / 9) * 4}) rotate(${Math.sin(t / 13) * 1.5})`}>
    {[
      [-110, -50, C.red],
      [-50, -50, C.blue],
      [10, -50, C.orange],
      [-80, -95, C.green],
      [-20, -95, C.red],
    ].map(([x, y, c], i) => (
      <rect key={i} x={x as number} y={y as number} width={56} height={42} rx={3} fill={c as string} />
    ))}
    <rect x={70} y={-110} width={50} height={100} rx={4} fill={C.white} stroke={C.ink} strokeWidth={4} />
    <path d="M -160 -6 H 170 L 130 60 H -130 Z" fill={C.ink} />
    <rect x={-150} y={10} width={300} height={8} fill={C.red} />
  </g>
);

export const Waves: React.FC<{ t?: number; w?: number }> = ({ t = 0, w = 460 }) => (
  <g>
    {[0, 1].map((k) => (
      <path
        key={k}
        d={Array.from({ length: 14 }, (_, i) => {
          const x = -w / 2 + (i * w) / 13;
          const y = 58 + k * 18 + Math.sin(i + t / 8 + k) * 5;
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ")}
        stroke={C.blue}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        opacity={0.8 - k * 0.3}
      />
    ))}
  </g>
);

export const IconWarehouse: React.FC = () => (
  <g>
    <path d="M -150 -30 Q 0 -120 150 -30 V 90 H -150 Z" fill="#6E7F99" />
    <rect x={-80} y={0} width={160} height={90} fill="#A9B5C6" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-80} y={8 + i * 14} width={160} height={4} fill="#8796AC" />
    ))}
    {[-120, 100].map((x) => (
      <rect key={x} x={x} y={10} width={20} height={20} fill={C.orange} opacity={0.8} />
    ))}
  </g>
);

export const IconTruck: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect x={-150} y={-90} width={200} height={120} rx={8} fill={C.white} stroke={C.ink} strokeWidth={5} />
    <rect x={-130} y={-60} width={70} height={30} rx={4} fill={C.red} />
    <text x={-95} y={-38} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill={C.white}>
      100
    </text>
    <path d="M 50 -50 H 110 L 145 -10 V 30 H 50 Z" fill={C.orange} stroke={C.ink} strokeWidth={5} />
    <path d="M 64 -40 H 104 L 128 -12 H 64 Z" fill={C.blue} />
    {[-100, 90].map((x) => (
      <g key={x} transform={`translate(${x} 36) rotate(${t * 12})`}>
        <circle r={26} fill={C.ink} />
        <circle r={10} fill="#C9C2B6" />
        <rect x={-2} y={-24} width={4} height={14} fill="#C9C2B6" />
      </g>
    ))}
  </g>
);

export const IconStore: React.FC<{ w?: number }> = ({ w = 420 }) => {
  const stripes = 8;
  const sw = w / stripes;
  return (
    <g>
      <rect x={-w / 2} y={-120} width={w} height={300} fill="#FBF7F0" stroke={C.ink} strokeWidth={6} />
      <rect x={-w / 2 + 30} y={-200} width={w - 60} height={70} rx={10} fill={C.ink} />
      <text x={0} y={-152} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.white} letterSpacing={4}>
        100円 SHOP
      </text>
      {Array.from({ length: stripes }, (_, i) => (
        <path
          key={i}
          d={`M ${-w / 2 + i * sw} -120 h ${sw} v 50 a ${sw / 2} ${sw / 2} 0 0 1 ${-sw} 0 Z`}
          fill={i % 2 ? C.white : C.red}
          stroke={C.ink}
          strokeWidth={3}
        />
      ))}
      <rect x={-w / 2 + 40} y={-20} width={w - 80} height={200} fill="#DCEAF2" stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

/* ── 日本地図（様式化） ───────────────────────── */
export const JapanMap: React.FC<{ dots?: number; color?: string }> = ({ dots = 0, color = C.red }) => {
  const land = "#D9CFBF";
  const pts = MAP_DOTS.slice(0, Math.max(0, Math.floor(dots)));
  return (
    <g>
      <path d="M 250 -190 C 300 -215, 350 -180, 330 -140 C 310 -110, 260 -120, 240 -150 Z" fill={land} stroke={land} strokeWidth={30} strokeLinejoin="round" />
      <path d="M 250 -85 C 260 -20, 230 40, 150 70 S 20 110, -80 130" stroke={land} strokeWidth={56} fill="none" strokeLinecap="round" />
      <path d="M -60 185 L 30 170" stroke={land} strokeWidth={34} strokeLinecap="round" />
      <path d="M -170 160 C -160 200, -150 240, -130 260" stroke={land} strokeWidth={48} strokeLinecap="round" fill="none" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={9} fill={color} stroke={C.paper} strokeWidth={3} />
      ))}
    </g>
  );
};

const MAP_DOTS: [number, number][] = [
  [150, 75], [210, 20], [240, -40], [100, 90], [290, -170], [40, 105], [-20, 118], [250, -80],
  [-140, 190], [-10, 178], [180, 50], [-70, 128], [230, -10], [310, -150], [-150, 235], [70, 98],
  [120, 85], [30, 176], [260, -170], [195, 38], [-120, 210], [245, -60], [0, 110], [-40, 125],
];

/* ── スタンプ（コスト名） ───────────────────────── */
export const StampTag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.red, size = 48 }) => {
  const w = text.length * size + 60;
  const h = size + 40;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.paper} stroke={color} strokeWidth={7} />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={8} fill="none" stroke={color} strokeWidth={2} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} letterSpacing={4}>
        {text}
      </text>
    </g>
  );
};

/* ── 吹き出し ───────────────────────── */
export const Bubble: React.FC<{ text: string; size?: number; tail?: "left" | "right" }> = ({ text, size = 64, tail = "left" }) => {
  const w = text.length * size + 90;
  const h = size + 70;
  const tx = tail === "left" ? -w / 2 + 70 : w / 2 - 70;
  return (
    <g>
      <g transform="translate(8 10)" opacity={0.12}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#000" />
      </g>
      <path d={`M ${tx - 25} ${h / 2 - 10} L ${tx + (tail === "left" ? -40 : 40)} ${h / 2 + 50} L ${tx + 25} ${h / 2 - 10} Z`} fill={C.white} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={C.white} stroke={C.ink} strokeWidth={6} />
      <path d={`M ${tx - 22} ${h / 2 - 3} L ${tx + (tail === "left" ? -40 : 40)} ${h / 2 + 50} L ${tx + 22} ${h / 2 - 3}`} fill={C.white} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <rect x={tx - 26} y={h / 2 - 12} width={52} height={12} fill={C.white} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.ink}>
        {text}
      </text>
    </g>
  );
};

/* ── 店内の背景（棚） ───────────────────────── */
export const Shelves: React.FC<{ o?: number }> = ({ o = 1 }) => {
  const colors = [C.blue, C.orange, C.green, "#F29CA3", "#F6CF4A", "#A9B5C6"];
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x={0} y={170 + row * 190} width={1920} height={14} fill={C.line} />
          {Array.from({ length: 22 }, (_, i) => {
            const h = 70 + ((i * 37 + row * 13) % 60);
            const w = 50 + ((i * 23 + row * 7) % 30);
            return (
              <rect
                key={i}
                x={20 + i * 88}
                y={170 + row * 190 - h}
                width={w}
                height={h}
                rx={8}
                fill={colors[(i + row * 2) % colors.length]}
                opacity={0.35}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
};

/* ── 追加部品 ───────────────────────── */
export const Gear: React.FC<{ r?: number; teeth?: number; color?: string; rot?: number }> = ({ r = 100, teeth = 10, color = C.inkSoft, rot = 0 }) => {
  const pts: string[] = [];
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r * 0.8;
    pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`);
  }
  return (
    <g transform={`rotate(${rot})`}>
      <polygon points={pts.join(" ")} fill={color} strokeLinejoin="round" />
      <circle r={r * 0.32} fill={C.paper} />
      <circle r={r * 0.12} fill={color} />
    </g>
  );
};

export const IconHQ: React.FC = () => (
  <g>
    <rect x={-70} y={-130} width={140} height={220} fill={C.inkSoft} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={-50 + (i % 3) * 38} y={-110 + Math.floor(i / 3) * 44} width={24} height={26} fill={C.orange} opacity={0.85} />
    ))}
    <rect x={-20} y={50} width={40} height={40} fill={C.ink} />
  </g>
);

export const IconPerson: React.FC<{ color?: string }> = ({ color = C.red }) => (
  <g>
    <circle cy={-70} r={36} fill={C.inkSoft} />
    <rect x={-48} y={-28} width={96} height={120} rx={44} fill={color} />
  </g>
);

export const IconDoc: React.FC<{ w?: number; h?: number; lines?: number; hl?: number }> = ({ w = 360, h = 460, lines = 8, hl = -1 }) => (
  <g>
    <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx={14} fill="rgba(0,0,0,0.1)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.white} stroke={C.ink} strokeWidth={5} />
    {Array.from({ length: lines }, (_, i) => (
      <rect
        key={i}
        x={-w / 2 + 36}
        y={-h / 2 + 50 + i * ((h - 90) / lines)}
        width={(w - 72) * (i % 3 === 2 ? 0.6 : 1)}
        height={14}
        rx={7}
        fill={i === hl ? C.orange : C.line}
      />
    ))}
  </g>
);

export const IconBox3D: React.FC<{ color?: string }> = ({ color = "#C9A06A" }) => (
  <g>
    <path d="M -50 -20 L 0 -45 L 50 -20 L 0 5 Z" fill="#DDB982" />
    <path d="M -50 -20 L 0 5 L 0 60 L -50 35 Z" fill={color} />
    <path d="M 50 -20 L 0 5 L 0 60 L 50 35 Z" fill="#A9814C" />
  </g>
);

export const IconSticker: React.FC = () => (
  <g>
    <rect x={-70} y={-55} width={140} height={110} rx={12} fill={C.white} stroke={C.line} strokeWidth={4} />
    <circle cx={-30} cy={-10} r={20} fill="#F29CA3" />
    <path d="M 10 -30 l 10 20 l 22 3 l -16 15 l 4 22 l -20 -11 l -20 11 l 4 -22 l -16 -15 l 22 -3 Z" fill="#F6CF4A" />
    <circle cx={40} cy={30} r={12} fill={C.blue} />
  </g>
);

export const IconLamp: React.FC = () => (
  <g>
    <path d="M -70 20 L -40 -60 H 40 L 70 20 Z" fill="#F6CF4A" />
    <rect x={-8} y={20} width={16} height={100} fill={C.inkSoft} />
    <rect x={-50} y={115} width={100} height={16} rx={8} fill={C.ink} />
  </g>
);
