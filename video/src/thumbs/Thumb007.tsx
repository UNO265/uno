/**
 * CASE #007「ビジネスホテル、なぜ1泊1.5万円に？」のサムネイル（1280×720）。
 * 成果改善指針 6〜8・7-1番: 物ひとつ（カードキー）+ 数字ひとつ（15,000円）+ 短い問い（誰が決めた？）。
 * 答え（高くても埋まる／今夜の値段）は書かない。問いの答えは本編 2:00（先に）と 13:21（最後）。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Building, CardKey, H } from "../case007/kit";
import { FONT } from "../theme";

const SERIF = "'Noto Serif CJK JP', serif";
const Big: React.FC<{ x: number; y: number; size: number; color: string; children: React.ReactNode }> = ({ x, y, size, color, children }) => (
  <>
    <text x={x} y={y} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={size} fill="none" stroke="#101010" strokeWidth={size * 0.16} strokeLinejoin="round">
      {children}
    </text>
    <text x={x} y={y} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={size} fill={color}>
      {children}
    </text>
  </>
);

export const Thumb007: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 55%, #22365A 0%, #0A1120 72%)" }}>
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g opacity={0.55}>
        <Building x={420} y={1120} cols={8} rows={12} cell={46} lit={0.85} />
      </g>
      <CardKey x={520} y={560} s={1.7} r={-12} />
      <g transform="translate(1180 290) rotate(6)">
        <rect x={-440} y={-125} width={880} height={250} rx={30} fill="#FFFFFF" stroke={H.red} strokeWidth={16} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={150} fill={H.red}>
          15,000円
        </text>
      </g>
      <Big x={1480} y={690} size={190} color="#FFE14D">
        誰が
      </Big>
      <Big x={1480} y={900} size={180} color="#FFE14D">
        決めた？
      </Big>
    </svg>
  </AbsoluteFill>
);
