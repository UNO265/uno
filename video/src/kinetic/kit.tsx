// キネティック・タイポグラフィの部品（KANENAZO モーション v1）
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, interpolate, Easing, staticFile } from "remotion";

export const C = { bg: "#0b0b0c", ink: "#f4f1ea", or: "#ff5a1f", bl: "#2d5bff", gray: "#7d7f86", yel: "#ffd23f" };
export const F = {
  jp: "'Dela Gothic One', 'Noto Sans CJK JP', sans-serif",
  jpb: "'Zen Kaku Gothic New', 'Noto Sans CJK JP', sans-serif",
  en: "'Anton', sans-serif",
  it: "'Playfair Display', serif",
  mono: "'Space Mono', monospace",
};

const FONTS: [string, string, string?][] = [
  ["Dela Gothic One", "fonts/DelaGothicOne-Regular.ttf"],
  ["Zen Kaku Gothic New", "fonts/ZenKakuGothicNew-Black.ttf"],
  ["Anton", "fonts/Anton-Regular.ttf"],
  ["Playfair Display", "fonts/PlayfairDisplay-Italic[wght].ttf", "italic"],
  ["Space Mono", "fonts/SpaceMono-Bold.ttf"],
];
/** 同梱フォントを読み込むまで描画を待つ（どの PC でも同じ見た目にする） */
export const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(
      FONTS.map(([name, file, style]) => {
        const ff = new FontFace(name, `url('${staticFile(file)}')`, style ? { style, weight: "400 900" } : {});
        return ff.load().then((f) => document.fonts.add(f));
      }),
    ).then(() => continueRender(h));
  }, []);
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const k = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
export const out = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
/** ぽんと出る（少し行き過ぎて戻る） */
export const pop = (f: number, a: number, d = 9) => interpolate(f, [a, a + d * 0.6, a + d], [0, 1.12, 1], clamp);
/** 104bpm の拍（30fps） */
export const BEAT = (30 * 60) / 104;
export const beatPulse = (f: number) => {
  const p = (f % BEAT) / BEAT;
  return Math.exp(-p * 6);
};

/** 有機的な塊（ブロブ）。r を角度ごとに揺らして形を変え続ける */
export const Blob: React.FC<{ x: number; y: number; r: number; f: number; seed: number; color?: string; o?: number }> = ({ x, y, r, f, seed, color = C.bl, o = 1 }) => {
  const n = 48;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const w = 1 + 0.16 * Math.sin(a * 3 + f / 14 + seed) + 0.09 * Math.sin(a * 5 - f / 9 + seed * 2) + 0.05 * Math.sin(a * 2 + f / 21);
    return [x + Math.cos(a) * r * w, y + Math.sin(a) * r * w * 1.08];
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("") + "Z";
  return <path d={d} fill={color} opacity={o} />;
};

/** 白い箱に黒い文字（レファレンスの「I'M A」型） */
export const WordBox: React.FC<{ x: number; y: number; text: string; size: number; f: number; at: number; font?: string; invert?: boolean; pad?: number }> = ({ x, y, text, size, f, at, font = F.jp, invert, pad = 0.28 }) => {
  if (f < at) return null;
  const s = pop(f, at, 8);
  const w = text.length * size * (font === F.en ? 0.55 : 1.02) + size * pad * 2;
  const h = size * 1.35;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={invert ? C.bg : C.ink} />
      <text textAnchor="middle" y={size * 0.36} fontFamily={font} fontSize={size} fill={invert ? C.ink : C.bg}>
        {text}
      </text>
    </g>
  );
};

/** 下からせり上がる大きな文字（マスク） */
export const Rise: React.FC<{ x: number; y: number; text: string; size: number; f: number; at: number; font?: string; color?: string; anchor?: "start" | "middle" | "end"; id: string; skew?: number; spacing?: number }> = ({ x, y, text, size, f, at, font = F.jp, color = C.ink, anchor = "middle", id, skew = 0, spacing = 0 }) => {
  const p = out(f, at, 10);
  if (f < at) return null;
  return (
    <g>
      <defs>
        <clipPath id={`c${id}`}>
          <rect x={-4000} y={y - size * 1.05} width={8000} height={size * 1.32} />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <text x={x} y={y + (1 - p) * size * 1.2} textAnchor={anchor} fontFamily={font} fontSize={size} fill={color} transform={skew ? `skewX(${skew})` : undefined} letterSpacing={spacing}>
          {text}
        </text>
      </g>
    </g>
  );
};

/** 画面の四隅の計器（タイムコード・場面番号・ラベル） */
export const Hud: React.FC<{ f: number; scene: number; total: number; label?: string; dark?: boolean }> = ({ f, scene, total, label = "DRUGSTORE", dark = true }) => {
  const col = dark ? "rgba(244,241,234,.7)" : "rgba(11,11,12,.7)";
  return (
    <g fontFamily={F.mono} fontSize={18} fill={col} letterSpacing={2}>
      <text x={40} y={48}>KANENAZO — CASE #009</text>
      <text x={1880} y={48} textAnchor="end">ECONOMY × MYSTERY</text>
      {/* 右下は YouTube のブランディング透かし（チャンネルアイコン）の場所なので空けておく */}
      {/* 走るタイムコードは「誤り」に見えるので 2026-10 に削除。章番号だけ左下に残す */}
      <text x={40} y={1050}>
        {String(scene).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </text>
      <text x={960} y={48} textAnchor="middle" opacity={0.8}>{label}</text>
    </g>
  );
};

/** 流れる帯 */
export const Marquee: React.FC<{ y: number; text: string; f: number; speed?: number; size?: number; bg?: string; fg?: string; rot?: number }> = ({ y, text, f, speed = 6, size = 64, bg = C.or, fg = C.bg, rot = 0 }) => {
  const unit = text.length * size * 0.62;
  const off = -((f * speed) % unit);
  return (
    <g transform={`rotate(${rot} 960 ${y})`}>
      <rect x={-200} y={y - size * 0.85} width={2320} height={size * 1.2} fill={bg} />
      <text x={off - 200} y={y} fontFamily={F.en} fontSize={size} fill={fg} letterSpacing={2}>
        {Array.from({ length: 8 }, () => text).join("")}
      </text>
    </g>
  );
};

/** 字幕（2026-10 改訂）: 行をほぼ満たす大きさ・半透明の黒帯・白文字。背景が白でも黒でも読める。
 *  長い文は句読点で 2 行に分ける。右下（YouTube の透かしの場所）にはかからない幅 CAP_W に収める。 */
const CAP_W = 1480, CAP_MAX = 64, CAP_MIN = 44, CAP_BOTTOM = 1030;
const units = (t: string) => [...t].reduce((a, ch) => a + (/[\x00-\x7f]/.test(ch) ? 0.55 : 1), 0);
const splitCaption = (t: string): string[] => {
  if (units(t) * CAP_MAX * 0.8 <= CAP_W) return [t];
  // 真ん中に近い句読点（、。」）の後ろで切る。なければ真ん中で切る
  const chars = [...t], half = units(t) / 2;
  let best = -1, bestD = 1e9, acc = 0;
  chars.forEach((ch, i) => {
    acc += /[\x00-\x7f]/.test(ch) ? 0.55 : 1;
    if ("、。」）".includes(ch) && i < chars.length - 2 && Math.abs(acc - half) < bestD) { best = i; bestD = Math.abs(acc - half); }
  });
  if (best < 0 || bestD > half * 0.45) {
    // 句読点が遠いときは、真ん中に近い助詞（は・が・を・に・で・の・も・と・へ）の後ろで切る
    acc = 0; let pb = -1, pd = 1e9;
    chars.forEach((ch, i) => {
      acc += /[\x00-\x7f]/.test(ch) ? 0.55 : 1;
      if ("はがをにでのもとへ".includes(ch) && i < chars.length - 2 && !/[\x00-\x7fー]/.test(chars[i + 1]) && Math.abs(acc - half) < pd) { pb = i; pd = Math.abs(acc - half); }
    });
    if (pb >= 0 && pd < bestD) best = pb;
    if (best < 0) { let a = 0; best = chars.findIndex((ch) => (a += /[\x00-\x7f]/.test(ch) ? 0.55 : 1) >= half); }
  }
  return [chars.slice(0, best + 1).join(""), chars.slice(best + 1).join("")];
};
export const Caption: React.FC<{ text: string; dark?: boolean }> = ({ text }) => {
  if (!text) return null;
  const lines = splitCaption(text);
  const size = Math.max(CAP_MIN, Math.min(CAP_MAX, CAP_W / Math.max(...lines.map(units))));
  const lh = size * 1.28, padX = 28, padY = 14;
  const w = Math.min(CAP_W, Math.max(...lines.map(units)) * size) + padX * 2;
  const h = lh * lines.length + padY * 2;
  const top = CAP_BOTTOM - h;
  return (
    <g>
      <rect x={960 - w / 2} y={top} width={w} height={h} rx={14} fill="rgba(11,11,12,0.74)" />
      {lines.map((l, i) => (
        <text key={i} x={960} y={top + padY + lh * i + size * 1.02} textAnchor="middle" fontFamily={F.jpb} fontSize={size} fill="#f4f1ea" {...(units(l) * size > CAP_W ? { textLength: CAP_W, lengthAdjust: "spacingAndGlyphs" } : {})}>
          {l}
        </text>
      ))}
    </g>
  );
};
