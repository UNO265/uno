/**
 * CASE #006「ガチャガチャ、なぜ500円に？」のサムネイル（1280×720）。
 * 成果改善指針 6〜8・7-1番: 物ひとつ（ガチャの機械とカプセル）+ 数字ひとつ（500円）+ 短い問い（なぜ売れる？）。
 * 答え（買う人が変わった）は書かない。問いの答えは本編 1:54（先に）と 12:05（最後）。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Capsule, G, Machine } from "../case006/kit";
import { FONT } from "../theme";

const SERIF = "'Noto Serif CJK JP', serif";
const Big: React.FC<{ x: number; y: number; size: number; color: string; children: React.ReactNode; serif?: boolean }> = ({ x, y, size, color, children, serif }) => (
  <>
    <text x={x} y={y} textAnchor="middle" fontFamily={serif ? SERIF : FONT} fontWeight={900} fontSize={size} fill="none" stroke="#101010" strokeWidth={size * 0.16} strokeLinejoin="round">
      {children}
    </text>
    <text x={x} y={y} textAnchor="middle" fontFamily={serif ? SERIF : FONT} fontWeight={900} fontSize={size} fill={color}>
      {children}
    </text>
  </>
);

export const Thumb006: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 55%, #243A5C 0%, #0B1220 72%)" }}>
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Machine x={500} y={640} s={1.12} turn={-30} price="？" />
      <Capsule x={960} y={900} r={150} color={G.cap[1]} rot={-18} />
      {/* 500円の札 */}
      <g transform="translate(1000 330) rotate(7)">
        <rect x={-300} y={-130} width={600} height={260} rx={30} fill="#FFFFFF" stroke={G.red} strokeWidth={16} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={190} fill={G.red}>
          500円
        </text>
      </g>
      <Big x={1530} y={650} size={190} color="#FFE14D" serif>
        なぜ
      </Big>
      <Big x={1530} y={880} size={180} color="#FFE14D" serif>
        売れる？
      </Big>
    </svg>
  </AbsoluteFill>
);
