/**
 * CASE #003 ショート（縦 1080×1920）の共通部品。
 * 本編 CASE #003 の絵（ポップコーンのカップ・チケット・座席表）を縦画面用に大きく置く。
 * 成果改善指針 24-1（ヘッダー・エンドカードなし、左上に小さなロゴだけ）と
 * 25-1（最初の 1 秒: 0 フレームに問いの文字、声は問いから、0 フレームから動く）に従う。
 */
import React from "react";
import { Cup, Figure, Kernel, PopPile, Seats, T, TicketDoc } from "../case003/kit";
import { Arrow, Bars, C, Chip, FONT, K, NIGHT, NO_HEAD, SERIF, Src, V, WHITE, ease, fade, mk, pop } from "../shorts002/parts";

export const BLACK = "radial-gradient(ellipse at 50% 45%, #2A2118 0%, #0B0A09 75%)";
export const VELVET = "radial-gradient(ellipse at 50% 40%, #5A1218 0%, #1E0508 80%)";
export const NAVY = "#0F2748";

export { Arrow, Bars, C, Chip, Cup, FONT, Figure, K, Kernel, NIGHT, NO_HEAD, PopPile, SERIF, Seats, Src, T, TicketDoc, V, WHITE, ease, fade, mk, pop };

/** 最初の 1 秒の問い（0 フレームから見えている。y は上端からの位置） */
export const Hook: React.FC<{ lines: React.ReactNode[]; y?: number; dark?: boolean; sizes?: number[] }> = ({ lines, y = 330, dark = true, sizes = [84, 110] }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: sizes[i] ?? sizes[sizes.length - 1], color: dark ? "#F4EEE3" : C.ink, whiteSpace: "nowrap", letterSpacing: 2, lineHeight: 1.25 }}>
        {l}
      </div>
    ))}
  </div>
);

/** 最後のカットで、1 本目の背景へ戻す（ループ） */
export const LoopTo: React.FC<{ f: number; d: number; bg: string }> = ({ f, d, bg }) => (
  <div style={{ position: "absolute", inset: 0, background: bg, opacity: ease(f, d - 8, d) }} />
);

/** 数字のカウントアップ */
export const count = (f: number, at: number, dur: number, to: number) => Math.round(ease(f, at, at + dur, 0, to));
export const comma = (n: number) => n.toLocaleString("en-US");
