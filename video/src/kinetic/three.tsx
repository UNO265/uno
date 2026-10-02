// 3D 空間の部品（CSS 3D: WebGL なしで速く描ける）
import React from "react";
import { C, F } from "./kit";

export type Cam = { x: number; y: number; z: number; rx: number; ry: number; rz?: number };
const P = 1200; // 視点の距離（px）

/** 3D の世界。カメラの逆変換を世界にかける */
export const World: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <div style={{ position: "absolute", inset: 0, perspective: P, perspectiveOrigin: "50% 50%", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: `rotateZ(${-(cam.rz ?? 0)}deg) rotateX(${-cam.rx}deg) rotateY(${-cam.ry}deg) translate3d(${-cam.x}px, ${-cam.y}px, ${-cam.z}px)`,
      }}
    >
      {children}
    </div>
  </div>
);

/** 世界の中の 1 点に置く（中心基準） */
export const At: React.FC<{ x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; s?: number; o?: number; children: React.ReactNode }> = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, o = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      transformStyle: "preserve-3d",
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`,
      opacity: o,
    }}
  >
    <div style={{ position: "absolute", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d", whiteSpace: "nowrap" }}>{children}</div>
  </div>
);

/** 厚みのある立体文字（層を奥に重ねる） */
export const Ex: React.FC<{ text: string; size: number; color?: string; side?: string; depth?: number; font?: string; italic?: boolean; spacing?: number }> = ({ text, size, color = C.ink, side = "#9a968e", depth = 26, font = F.jp, italic, spacing = 0 }) => {
  const n = Math.max(6, Math.round(depth / 2));
  const style: React.CSSProperties = { fontFamily: font, fontSize: size, lineHeight: 1, fontStyle: italic ? "italic" : "normal", letterSpacing: spacing, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ ...style, position: i ? "absolute" : "relative", left: 0, top: 0, color: side, transform: `translateZ(${-(n - i) * (depth / n)}px)`, filter: `brightness(${0.55 + (i / n) * 0.45})` }}>
          {text}
        </div>
      ))}
      <div style={{ ...style, position: "absolute", left: 0, top: 0, color, transform: "translateZ(0.5px)" }}>{text}</div>
    </div>
  );
};

/** 平らな文字 */
export const Txt: React.FC<{ text: React.ReactNode; size: number; color?: string; font?: string; italic?: boolean; spacing?: number; weight?: number }> = ({ text, size, color = C.ink, font = F.jp, italic, spacing = 0, weight }) => (
  <div style={{ fontFamily: font, fontSize: size, lineHeight: 1.05, color, fontStyle: italic ? "italic" : "normal", letterSpacing: spacing, fontWeight: weight }}>{text}</div>
);

/** 3D の角柱（棒グラフ） */
export const Prism: React.FC<{ w: number; h: number; d: number; color: string; dark: string; top: string }> = ({ w, h, d, color, dark, top }) => (
  <div style={{ position: "relative", width: w, height: h, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", width: w, height: h, background: color, transform: `translateZ(${d / 2}px)` }} />
    <div style={{ position: "absolute", width: d, height: h, left: w - d / 2, background: dark, transform: `rotateY(90deg)` }} />
    <div style={{ position: "absolute", width: w, height: d, top: -d / 2, background: top, transform: `rotateX(90deg)` }} />
  </div>
);
