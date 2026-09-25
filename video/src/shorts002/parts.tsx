/**
 * CASE #002 ショート（縦 1080×1920）の共通部品。
 * 本編 CASE #002 の絵（丼・1000円札・値札）を縦画面用に大きく置く。
 * 成果改善指針 24-1: ヘッダー・エンドカードなし、左上に小さなロゴだけ。
 */
import React from "react";
import { Bill, Bowl, K, PriceCard } from "../case002/ui";
import { C, FONT, SERIF, V, ease, fade, pop, shortCut } from "../shorts001/kit";

export const mk = shortCut("");
export const NO_HEAD = { header: false, logo: true } as const;
export const WHITE = "#FCFBF8";
export const NIGHT = "radial-gradient(ellipse at 50% 42%, #1B2438 0%, #0E1320 80%)";

export { Bill, Bowl, C, FONT, K, PriceCard, SERIF, V, ease, fade, pop };

/** 縦の棒グラフ（値は公表数値。高さは max に対する比） */
export const Bars: React.FC<{
  f: number;
  items: { label: string; value: number; text: string; at: number; color: string }[];
  max: number;
  base?: number;
  h?: number;
  dark?: boolean;
}> = ({ f, items, max, base = 1080, h = 560, dark }) => {
  const w = 260;
  const gap = 420;
  const x0 = 540 - (gap * (items.length - 1)) / 2;
  return (
    <g>
      <line x1={100} x2={980} y1={base} y2={base} stroke={dark ? "#5A6478" : C.line} strokeWidth={6} />
      {items.map((it, i) => {
        const p = ease(f, it.at, it.at + 18);
        const bh = (h * it.value) / max * p;
        const x = x0 + i * gap;
        return (
          <g key={i}>
            <rect x={x - w / 2} y={base - bh} width={w} height={bh} rx={10} fill={it.color} />
            <text x={x} y={base - bh - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={it.color} opacity={fade(f, it.at + 8)}>
              {it.text}
            </text>
            <text x={x} y={base + 70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={dark ? "#C9C2B6" : C.inkSoft} opacity={fade(f, it.at)}>
              {it.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** 出典の小さな表示（画面上部、ロゴの下） */
export const Src: React.FC<{ f: number; at: number; text: string; dark?: boolean }> = ({ f, at, text, dark }) => (
  <text x={56} y={200} fontFamily={FONT} fontWeight={700} fontSize={30} fill={dark ? "#C9C2B6" : C.inkSoft} opacity={fade(f, at)}>
    {text}
  </text>
);

/** 丸い札（語を一つだけ載せる） */
export const Chip: React.FC<{ f: number; at: number; x: number; y: number; text: string; color?: string; size?: number; fill?: string }> = ({
  f,
  at,
  x,
  y,
  text,
  color = C.ink,
  size = 64,
  fill = C.white,
}) => {
  const p = pop(f, at);
  const w = [...text].length * size + 90;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={fill} stroke={color} strokeWidth={7} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** 上向き / 下向きの太い矢印 */
export const Arrow: React.FC<{ x: number; y: number; len: number; up?: boolean; color: string; w?: number; o?: number }> = ({ x, y, len, up = true, color, w = 34, o = 1 }) => {
  const k = up ? -1 : 1;
  return (
    <path
      d={`M ${x} ${y} L ${x} ${y + k * len} M ${x - 60} ${y + k * (len - 60)} L ${x} ${y + k * len} L ${x + 60} ${y + k * (len - 60)}`}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={o}
    />
  );
};

