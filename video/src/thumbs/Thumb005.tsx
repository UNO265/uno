/**
 * CASE #005「送料無料、本当に無料？」のサムネイル（1280×720）。
 * 成果改善指針 6〜8番: 物ひとつ（「送料無料」の段ボール箱）+ 数字ひとつ（0円）+ 短い問い（誰が払う？）。
 * 問いはタイトル（無料か？）と別の二つ目の疑問。本編 8:47 CLUE 03・12:12 答えで回収する。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Box } from "../case005/kit";
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

export const Thumb005: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 34% 58%, #3A3024 0%, #0F0F10 72%)" }}>
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Box x={620} y={620} s={1.45} r={-4} />
      {/* 0円の値札 */}
      <g transform="translate(1000 300) rotate(8)">
        <rect x={-230} y={-120} width={460} height={240} rx={28} fill="#FFFFFF" stroke="#E2452F" strokeWidth={14} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={170} fill="#E2452F">
          0円
        </text>
      </g>
      <Big x={1480} y={640} size={220} color="#FFE14D" serif>
        誰が
      </Big>
      <Big x={1480} y={880} size={230} color="#FFE14D" serif>
        払う？
      </Big>
    </svg>
  </AbsoluteFill>
);
