/**
 * CASE #001「100均、なぜ100円で儲かる？」の差し替え用サムネイル（1280×720）。
 * 成果改善指針 6〜8番: 物ひとつ + 数字ひとつ + 短い問い。タイトルの文を繰り返さない。
 * A: 買い物かご + 100円 + 「どこで稼ぐ？」（本編 3:41〜6:42 で回収）
 * B: 同じ 100円の値札が二つ + 「答えは正反対？」（本編 8:52 の問い、9:14〜12:25 で回収）
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { At, BasketBack, BasketFront, PRODUCTS, PriceTag } from "../art";
import { C, FONT } from "../theme";

const SERIF = "'Noto Serif CJK JP', serif";
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {children}
  </svg>
);

/** 縁取り付きの太い文字（小さな画面でも読める） */
const Big: React.FC<{ x: number; y: number; size: number; color: string; children: React.ReactNode; anchor?: "start" | "middle" | "end"; serif?: boolean }> = ({
  x,
  y,
  size,
  color,
  children,
  anchor = "middle",
  serif,
}) => (
  <>
    <text x={x} y={y} textAnchor={anchor} fontFamily={serif ? SERIF : FONT} fontWeight={900} fontSize={size} fill="none" stroke="#101010" strokeWidth={size * 0.16} strokeLinejoin="round">
      {children}
    </text>
    <text x={x} y={y} textAnchor={anchor} fontFamily={serif ? SERIF : FONT} fontWeight={900} fontSize={size} fill={color}>
      {children}
    </text>
  </>
);

/* A: 商品でいっぱいの買い物かご + 100円 + どこで稼ぐ？ */
export const Thumb001A: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 34% 55%, #3A3326 0%, #121212 70%)" }}>
    <Stage>
      <At x={600} y={700} s={1.45}>
        <BasketBack w={560} />
        {PRODUCTS.map((P, i) => {
          const pos = [
            [-190, -250, -14], [-50, -300, 8], [100, -270, -6], [215, -230, 14],
            [-120, -190, 4], [30, -200, -10], [160, -175, 6], [-230, -170, 18],
          ][i];
          return (
            <At key={i} x={pos[0]} y={pos[1]} r={pos[2]} s={1.1}>
              <P />
            </At>
          );
        })}
        <BasketFront w={560} />
      </At>
      <At x={820} y={250} r={-10} s={1.2}>
        <PriceTag w={460} h={220} text="100円" color={C.red} string={false} fontSize={124} />
      </At>
      <Big x={1500} y={500} size={210} color="#FFE14D" serif>
        どこで
      </Big>
      <Big x={1500} y={760} size={230} color="#FFE14D" serif>
        稼ぐ？
      </Big>
    </Stage>
  </AbsoluteFill>
);

/* B: 同じ 100円 の値札が二つ（赤と紺）+ 答えは正反対？ */
export const Thumb001B: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #C73A28 0%, #C73A28 50%, #16233B 50%, #16233B 100%)" }} />
    <Stage>
      <At x={480} y={390} r={-8} s={1.5}>
        <PriceTag w={460} h={220} text="100円" color="#FFFFFF" string={false} fontSize={124} />
      </At>
      <At x={1440} y={390} r={8} s={1.5}>
        <PriceTag w={460} h={220} text="100円" color="#E2452F" string={false} fontSize={124} />
      </At>
      {/* 白い値札の文字を赤に */}
      <At x={480} y={390} r={-8} s={1.5}>
        <text x={40} y={4} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontWeight={900} fontSize={124} fill="#C73A28" letterSpacing={2}>
          100円
        </text>
      </At>
      <text x={960} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#FFFFFF">
        ⇄
      </text>
      <Big x={960} y={900} size={200} color="#FFE14D" serif>
        答えは正反対？
      </Big>
    </Stage>
  </AbsoluteFill>
);
