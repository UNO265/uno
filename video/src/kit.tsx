/**
 * 残りのカットで使い回すシーン部品。
 * 時刻はすべてカット内のフレーム番号（segStart などで求める）。
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { At, Gear, JapanMap, PRODUCTS, PriceTag, Bubble } from "./art";
import { Sfx, clamp, ease, usePop } from "./lib";
import { BRAND, C, FONT } from "./theme";

/* ── リッチテキスト: *赤*  ~取り消し~  _淡色_ ───────────────── */
export const Rich: React.FC<{ t: string; strike?: number; accent?: string }> = ({ t, strike = 0, accent = C.red }) => {
  const parts = t.split(/(\*[^*]+\*|~[^~]+~|_[^_]+_)/).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("*")) return <span key={i} style={{ color: accent }}>{p.slice(1, -1)}</span>;
        if (p.startsWith("_")) return <span key={i} style={{ color: C.inkSoft, fontWeight: 700 }}>{p.slice(1, -1)}</span>;
        if (p.startsWith("~"))
          return (
            <span key={i} style={{ position: "relative", opacity: 1 - strike * 0.45 }}>
              {p.slice(1, -1)}
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  top: "50%",
                  height: "0.12em",
                  width: `calc(${strike * 100}% + 12px)`,
                  background: C.red,
                  borderRadius: 6,
                }}
              />
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
};

/* ── 見出し（行ごとに登場） ───────────────── */
export type HL = { t: string; at: number; size?: number; strikeAt?: number; weight?: number };
export const Headline: React.FC<{ lines: HL[]; kicker?: { t: string; at: number }; dark?: boolean; top?: number; sfx?: boolean }> = ({
  lines,
  kicker,
  dark,
  top,
  sfx = true,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          justifyContent: top === undefined ? "center" : "flex-start",
          alignItems: "center",
          paddingBottom: top === undefined ? 150 : 0,
          paddingTop: top ?? 0,
          fontFamily: FONT,
          color: dark ? C.paper : C.ink,
          textAlign: "center",
        }}
      >
        {kicker && (
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: dark ? "#C9C2B6" : C.inkSoft,
              letterSpacing: 6,
              marginBottom: 24,
              opacity: ease(f, kicker.at, kicker.at + 10),
            }}
          >
            {kicker.t}
          </div>
        )}
        {lines.map((l, i) => {
          const p = ease(f, l.at, l.at + 12);
          const strike = l.strikeAt === undefined ? 0 : ease(f, l.strikeAt, l.strikeAt + 12, 0, 1, Easing.inOut(Easing.quad));
          return (
            <div
              key={i}
              style={{
                fontSize: l.size ?? 104,
                fontWeight: l.weight ?? 900,
                letterSpacing: 4,
                lineHeight: 1.35,
                opacity: p,
                transform: `translateY(${(1 - p) * 34}px)`,
                whiteSpace: "nowrap",
              }}
            >
              <Rich t={l.t} strike={strike} />
            </div>
          );
        })}
      </AbsoluteFill>
      {sfx && lines.map((l, i) => <Sfx key={i} at={l.at} name="whoosh" volume={0.35} />)}
      {lines
        .filter((l) => l.strikeAt !== undefined)
        .map((l, i) => (
          <Sfx key={`s${i}`} at={l.strikeAt!} name="chip" volume={0.6} />
        ))}
    </>
  );
};

/* ── 出典表記 ───────────────── */
export const Source: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        right: 48,
        top: 40,
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 700,
        color: C.inkSoft,
        background: "rgba(255,255,255,0.7)",
        padding: "6px 16px",
        borderRadius: 8,
        opacity: ease(f, at, at + 10),
      }}
    >
      {text}
    </div>
  );
};

/* ── 数字のカウントアップ ───────────────── */
export const fmtOku = (v: number) => {
  const r = Math.round(v);
  return r >= 10000 ? `${Math.floor(r / 10000)}兆${r % 10000 ? (r % 10000) + "億" : ""}円` : `${r}億円`;
};
export const fmtNum = (suffix: string) => (v: number) => `${Math.round(v).toLocaleString("ja-JP")}${suffix}`;

export const Counter: React.FC<{
  label: string;
  value: number;
  fmt: (v: number) => string;
  at: number;
  dur?: number;
  labelAt?: number;
  size?: number;
  y?: number;
  color?: string;
}> = ({ label, value, fmt, at, dur = 36, labelAt = 0, size = 190, y = 0, color = C.red }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) });
  const done = f >= at + dur;
  const bump = done ? 1 + 0.06 * Math.exp(-(f - at - dur) / 5) : 1;
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 150, fontFamily: FONT, transform: `translateY(${y}px)` }}>
        <div style={{ fontSize: 50, fontWeight: 700, color: C.ink, letterSpacing: 4, opacity: ease(f, labelAt, labelAt + 10) }}>{label}</div>
        <div
          style={{
            fontSize: size,
            fontWeight: 900,
            color,
            letterSpacing: 2,
            opacity: f >= at ? 1 : 0,
            transform: `scale(${bump})`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmt(v)}
        </div>
      </AbsoluteFill>
      {Array.from({ length: Math.floor(dur / 3) }, (_, k) => (
        <Sfx key={k} at={at + k * 3} name="type" volume={0.35} />
      ))}
      <Sfx at={at + dur} name="ding" volume={0.8} />
    </>
  );
};

/* ── 棒グラフ（積み上げ対応） ───────────────── */
export type Bar = {
  label?: string;
  value?: number;
  parts?: { v: number; color: string; label?: string }[];
  color?: string;
  at: number;
  valueText?: string;
  icon?: React.ReactNode;
};
export const Bars: React.FC<{ bars: Bar[]; max: number; base?: number; height?: number; width?: number; gap?: number; cx?: number; sfx?: boolean }> = ({
  bars,
  max,
  base = 790,
  height = 470,
  width = 190,
  gap = 110,
  cx = 960,
  sfx = true,
}) => {
  const f = useCurrentFrame();
  const total = bars.length * width + (bars.length - 1) * gap;
  return (
    <g>
      <line x1={cx - total / 2 - 80} y1={base} x2={cx + total / 2 + 80} y2={base} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      {bars.map((b, i) => {
        const x = cx - total / 2 + i * (width + gap);
        const p = ease(f, b.at, b.at + 22, 0, 1, Easing.out(Easing.cubic));
        const parts = b.parts ?? [{ v: b.value ?? 0, color: b.color ?? C.red }];
        let acc = 0;
        const sum = parts.reduce((a, q) => a + q.v, 0);
        return (
          <g key={i}>
            {parts.map((q, k) => {
              const h = (q.v / max) * height * p;
              const y = base - acc - h;
              acc += h;
              return (
                <g key={k}>
                  <rect x={x} y={y} width={width} height={h} fill={q.color} rx={k === parts.length - 1 ? 10 : 0} />
                  {q.label && p > 0.9 && h > 50 && (
                    <text x={x + width / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.white}>
                      {q.label}
                    </text>
                  )}
                </g>
              );
            })}
            {(b.valueText || b.value !== undefined) && (
              <text
                x={x + width / 2}
                y={base - (sum / max) * height * p - 24}
                textAnchor="middle"
                fontFamily={FONT}
                fontWeight={900}
                fontSize={46}
                fill={C.ink}
                opacity={p}
              >
                {b.valueText ?? ""}
              </text>
            )}
            {b.label && (
              <text x={x + width / 2} y={base + 58} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink} opacity={ease(f, b.at - 6, b.at + 4)}>
                {b.label}
              </text>
            )}
            {b.icon && (
              <At x={x + width / 2} y={base + 70} s={0.42} o={ease(f, b.at - 6, b.at + 4)}>
                {b.icon}
              </At>
            )}
            {sfx && <Sfx at={b.at} name="whoosh" volume={0.35} />}
          </g>
        );
      })}
    </g>
  );
};

/* ── カード並び ───────────────── */
export type Card = { title: string; sub?: string; color?: string; at: number; icon?: React.ReactNode; num?: string };
export const Cards: React.FC<{ items: Card[]; layout?: "row" | "col"; w?: number; top?: number; size?: number }> = ({
  items,
  layout = "row",
  w,
  top,
  size,
}) => {
  const f = useCurrentFrame();
  const width = w ?? (layout === "row" ? Math.min(520, 1640 / items.length - 40) : 1100);
  return (
    <>
      <AbsoluteFill
        style={{
          flexDirection: layout === "row" ? "row" : "column",
          justifyContent: top === undefined ? "center" : "flex-start",
          alignItems: "center",
          gap: layout === "row" ? 40 : 18,
          paddingBottom: top === undefined ? 150 : 0,
          paddingTop: top ?? 0,
          fontFamily: FONT,
        }}
      >
        {items.map((c, i) => {
          const p = ease(f, c.at, c.at + 12, 0, 1, Easing.out(Easing.back(1.6)));
          const o = ease(f, c.at, c.at + 6);
          return layout === "row" ? (
            <div
              key={i}
              style={{
                width,
                background: C.white,
                borderRadius: 26,
                boxShadow: "0 12px 30px rgba(60,40,10,0.12)",
                overflow: "hidden",
                opacity: o,
                transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 40}px)`,
                textAlign: "center",
                paddingBottom: 34,
              }}
            >
              <div style={{ height: 18, background: c.color ?? C.red }} />
              {c.icon && (
                <svg viewBox="-110 -100 220 200" style={{ width: 200, height: 180, marginTop: 20 }}>
                  {c.icon}
                </svg>
              )}
              <div style={{ fontSize: size ?? 50, fontWeight: 900, color: c.color ?? C.ink, marginTop: c.icon ? 0 : 36, padding: "0 16px" }}>{c.title}</div>
              {c.sub && <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 12, padding: "0 24px", lineHeight: 1.4 }}>{c.sub}</div>}
            </div>
          ) : (
            <div
              key={i}
              style={{
                width,
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: C.white,
                borderRadius: 20,
                padding: "16px 34px",
                boxShadow: "0 8px 20px rgba(60,40,10,0.10)",
                opacity: o,
                transform: `translateX(${(1 - p) * -80}px)`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: c.color ?? C.red,
                  color: C.white,
                  fontSize: 36,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.num ?? i + 1}
              </div>
              <div style={{ fontSize: size ?? 50, fontWeight: 900, color: C.ink }}>{c.title}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {items.map((c, i) => (
        <Sfx key={i} at={c.at} name={`tok${i % 6}`} volume={0.7} />
      ))}
    </>
  );
};

/* ── 横並びのフロー（矢印でつなぐ） ───────────────── */
export type FlowNode = { label: string; icon?: React.ReactNode; at: number; color?: string };
export const Flow: React.FC<{ nodes: FlowNode[]; y?: number; x0?: number; x1?: number; r?: number; font?: number }> = ({
  nodes,
  y = 440,
  x0 = 260,
  x1 = 1660,
  r = 118,
  font = 44,
}) => {
  const f = useCurrentFrame();
  const step = nodes.length > 1 ? (x1 - x0) / (nodes.length - 1) : 0;
  return (
    <g>
      {nodes.map((n, i) => {
        if (i === 0) return null;
        const xa = x0 + (i - 1) * step + r + 16;
        const xb = x0 + i * step - r - 22;
        const p = ease(f, n.at - 10, n.at);
        const xe = xa + (xb - xa) * p;
        return (
          <g key={`a${i}`} opacity={p > 0 ? 1 : 0}>
            <line x1={xa} y1={y} x2={xe} y2={y} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
            <path d={`M ${xe - 4} ${y - 22} L ${xe + 22} ${y} L ${xe - 4} ${y + 22} Z`} fill={C.ink} />
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const x = x0 + i * step;
        const p = ease(f, n.at, n.at + 12, 0, 1, Easing.out(Easing.back(1.8)));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
            <circle r={r} fill={C.white} stroke={n.color ?? C.red} strokeWidth={10} />
            {n.icon ? (
              <g transform="scale(0.72)">{n.icon}</g>
            ) : (
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={font} fill={n.color ?? C.ink}>
                {n.label}
              </text>
            )}
            {n.icon && (
              <text y={r + 62} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={font} fill={C.ink}>
                {n.label}
              </text>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <Sfx key={i} at={n.at} name={`tok${i % 6}`} volume={0.7} />
      ))}
    </g>
  );
};

/* ── 循環図 ───────────────── */
export const Cycle: React.FC<{ labels: string[]; at: number[]; center?: React.ReactNode; spinFrom?: number; stopAt?: number; cx?: number; cy?: number; R?: number }> = ({
  labels,
  at,
  center,
  spinFrom = 0,
  stopAt,
  cx = 960,
  cy = 450,
  R = 300,
}) => {
  const f = useCurrentFrame();
  const n = labels.length;
  const tt = stopAt !== undefined ? Math.min(f, stopAt) : f;
  const k = Math.max(0, tt - spinFrom);
  const angle = k * 1.2 + k * k * 0.03;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={R} fill="none" stroke={C.line} strokeWidth={14} />
      <g transform={`rotate(${angle})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M 0 -16 L 26 0 L 0 16 Z`}
              fill={C.red}
              transform={`translate(${Math.cos(a) * R} ${Math.sin(a) * R}) rotate(${(a * 180) / Math.PI + 90})`}
              opacity={ease(f, spinFrom - 10, spinFrom)}
            />
          );
        })}
      </g>
      {labels.map((l, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const p = ease(f, at[i], at[i] + 12, 0, 1, Easing.out(Easing.back(1.8)));
        const w = [...l].length * 46 + 70;
        return (
          <g key={i} transform={`translate(${Math.cos(a) * R} ${Math.sin(a) * R}) scale(${p})`}>
            <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill={C.white} stroke={C.ink} strokeWidth={6} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
              {l}
            </text>
          </g>
        );
      })}
      {center}
      {at.map((a, i) => (
        <Sfx key={i} at={a} name={`tok${i % 6}`} volume={0.7} />
      ))}
    </g>
  );
};

/* ── 左右分割（DAISO / Seria） ───────────────── */
export const SplitBg: React.FC<{ at?: number; left?: string; right?: string; dim?: "left" | "right" }> = ({ at = 0, left = "DAISO", right = "Seria", dim }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14);
  return (
    <g>
      <rect x={0} y={0} width={960 * p} height={1080} fill={BRAND.daiso} opacity={dim === "left" ? 0.03 : 0.08} />
      <rect x={1920 - 960 * p} y={0} width={960 * p} height={1080} fill={BRAND.seria} opacity={dim === "right" ? 0.03 : 0.08} />
      <line x1={960} y1={60} x2={960} y2={60 + 840 * p} stroke={C.line} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
      {[
        [480, left, BRAND.daiso, "left"],
        [1440, right, BRAND.seria, "right"],
      ].map(([x, t, c, side]) => (
        <g key={t as string} transform={`translate(${x} 130) scale(${p})`} opacity={dim === side ? 0.35 : 1}>
          <rect x={-150} y={-48} width={300} height={96} rx={48} fill={c as string} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.white} letterSpacing={4}>
            {t as string}
          </text>
        </g>
      ))}
    </g>
  );
};

/* ── 価格の階段 ───────────────── */
export const Ladder: React.FC<{ steps: { text: string; at: number; color?: string }[]; x0?: number; y0?: number; dx?: number; dy?: number; s?: number }> = ({
  steps,
  x0 = 330,
  y0 = 780,
  dx = 330,
  dy = 120,
  s = 0.75,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {steps.map((st, i) => {
        const x = x0 + i * dx;
        const y = y0 - i * dy;
        const p = ease(f, st.at, st.at + 14, 0, 1, Easing.out(Easing.back(1.6)));
        return (
          <g key={i}>
            <rect x={x - dx / 2 + 6} y={y + 80} width={dx - 12} height={Math.max(0, 900 - y - 80) * ease(f, st.at - 8, st.at + 4)} fill={C.paperDeep} stroke={C.line} strokeWidth={4} />
            <At x={x} y={y} s={s * p} r={-6}>
              <PriceTag text={st.text} color={st.color ?? C.red} string={false} />
            </At>
            <Sfx at={st.at} name={`tok${Math.min(5, i + 1)}`} volume={0.8} />
          </g>
        );
      })}
    </g>
  );
};

/* ── 商品アイコンのグリッド ───────────────── */
export const IconGrid: React.FC<{ from: number; to: number; cols?: number; rows?: number; newAt?: number; stampAt?: number; dim?: number }> = ({
  from,
  to,
  cols = 15,
  rows = 6,
  newAt,
  stampAt,
  dim = 1,
}) => {
  const f = useCurrentFrame();
  const total = cols * rows;
  const shown = interpolate(f, [from, to], [0, total], clamp);
  const cell = 112;
  const ox = 960 - ((cols - 1) * cell) / 2;
  const oy = 130;
  const NEW = [3, 17, 29, 41, 52, 66, 78, 84, 12, 60];
  return (
    <g opacity={dim}>
      {Array.from({ length: total }, (_, i) => {
        if (i >= shown) return null;
        const Icon = PRODUCTS[(i * 7 + Math.floor(i / cols)) % PRODUCTS.length];
        const x = ox + (i % cols) * cell;
        const y = oy + Math.floor(i / cols) * cell;
        const nIdx = NEW.indexOf(i);
        const np = newAt !== undefined && nIdx >= 0 ? ease(f, newAt + nIdx * 5, newAt + nIdx * 5 + 8, 0, 1, Easing.out(Easing.back(2))) : 0;
        return (
          <g key={i}>
            <rect x={x - 50} y={y - 50} width={100} height={100} rx={18} fill={C.white} opacity={0.7} />
            <At x={x} y={y} s={0.32}>
              <Icon />
            </At>
            {np > 0 && (
              <g transform={`translate(${x + 30} ${y - 38}) scale(${np}) rotate(-10)`}>
                <rect x={-40} y={-18} width={80} height={36} rx={18} fill={C.red} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={24} fill={C.white}>
                  NEW
                </text>
              </g>
            )}
          </g>
        );
      })}
      {stampAt !== undefined && f >= stampAt - 6 && (
        <At x={960} y={450} s={interpolate(f, [stampAt - 6, stampAt], [3, 1.3], clamp)} r={-8} o={ease(f, stampAt - 6, stampAt)}>
          <PriceTag string={false} />
        </At>
      )}
      {stampAt !== undefined && <Sfx at={stampAt} name="stamp" volume={0.9} />}
      {newAt !== undefined && NEW.map((_, k) => <Sfx key={k} at={newAt + k * 5} name={`tok${k % 6}`} volume={0.3} />)}
    </g>
  );
};

/* ── 日本地図 + 店舗数 ───────────────── */
export const MapCount: React.FC<{ from: number; to: number; value?: number }> = ({ from, to, value = 5891 }) => {
  const f = useCurrentFrame();
  const dots = interpolate(f, [from, to], [0, 24], clamp);
  const v = interpolate(f, [from, to], [0, value], { ...clamp, easing: Easing.out(Easing.cubic) });
  const world = interpolate(f, [from + (to - from) * 0.5, to], [0, 8], clamp);
  return (
    <g>
      <At x={620} y={470} s={1.45}>
        <JapanMap dots={dots} />
      </At>
      {Array.from({ length: Math.floor(world) }, (_, i) => (
        <circle key={i} cx={1150 + (i % 4) * 46} cy={300 + Math.floor(i / 4) * 50 + (i % 2) * 18} r={11} fill={C.orange} stroke={C.paper} strokeWidth={3} />
      ))}
      <text x={1240} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.inkSoft} opacity={world > 0 ? 1 : 0}>
        海外
      </text>
      <text x={1560} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={C.red} opacity={f >= from ? 1 : 0}>
        {Math.round(v).toLocaleString("ja-JP")}
      </text>
      <text x={1560} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill={C.ink} opacity={f >= from ? 1 : 0}>
        店舗（国内外）
      </text>
      {Array.from({ length: 12 }, (_, k) => (
        <Sfx key={k} at={from + ((to - from) * k) / 12} name={`tok${k % 6}`} volume={0.25} />
      ))}
      <Sfx at={to} name="ding" volume={0.7} />
    </g>
  );
};

/* ── 天秤 ───────────────── */
export const Balance: React.FC<{ tilt: number; left: React.ReactNode; right: React.ReactNode; leftLabel?: string; rightLabel?: string; cy?: number }> = ({
  tilt,
  left,
  right,
  leftLabel,
  rightLabel,
  cy = 300,
}) => {
  const L = 420;
  const a = (tilt * Math.PI) / 180;
  const lx = 960 - Math.cos(a) * L;
  const ly = cy - Math.sin(a) * L;
  const rx = 960 + Math.cos(a) * L;
  const ry = cy + Math.sin(a) * L;
  const pan = (x: number, y: number, content: React.ReactNode, label?: string) => (
    <g>
      <line x1={x} y1={y} x2={x - 130} y2={y + 220} stroke={C.inkSoft} strokeWidth={4} />
      <line x1={x} y1={y} x2={x + 130} y2={y + 220} stroke={C.inkSoft} strokeWidth={4} />
      <path d={`M ${x - 170} ${y + 220} H ${x + 170} Q ${x} ${y + 290} ${x - 170} ${y + 220} Z`} fill={C.ink} />
      <g transform={`translate(${x} ${y + 210})`}>{content}</g>
      {label && (
        <text x={x} y={y + 350} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.ink}>
          {label}
        </text>
      )}
    </g>
  );
  return (
    <g>
      <path d={`M 960 ${cy} L 900 820 H 1020 Z`} fill={C.inkSoft} />
      <rect x={860} y={810} width={200} height={24} rx={12} fill={C.ink} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <circle cx={960} cy={cy} r={20} fill={C.red} />
      {pan(lx, ly, left, leftLabel)}
      {pan(rx, ry, right, rightLabel)}
    </g>
  );
};

/* ── 章タイトル ───────────────── */
export const ChapterCard: React.FC<{ no: string; title: string; at: number }> = ({ no, title, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  const bar = ease(f, at + 8, at + 30);
  return (
    <>
      <AbsoluteFill style={{ background: C.ink, opacity: p }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 140, fontFamily: FONT, opacity: p }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.orange, letterSpacing: 16 }}>{no}</div>
        <div style={{ fontSize: 110, fontWeight: 900, color: C.paper, letterSpacing: 6, marginTop: 12, transform: `translateY(${(1 - p) * 30}px)` }}>
          {title}
        </div>
        <div style={{ width: 700 * bar, height: 10, background: C.red, borderRadius: 5, marginTop: 26 }} />
      </AbsoluteFill>
      <Sfx at={at} name="whoosh" volume={0.6} />
      <Sfx at={at + 14} name="ding" volume={0.6} />
    </>
  );
};

/* ── 主役の値札（光る・割れる・？） ───────────────── */
export const TagHero: React.FC<{ x?: number; y?: number; s?: number; text?: string; color?: string; crackAt?: number; glowAt?: number; qAt?: number; enterAt?: number }> = ({
  x = 960,
  y = 440,
  s = 1.6,
  text = "100円",
  color = C.red,
  crackAt,
  glowAt,
  qAt,
  enterAt = 0,
}) => {
  const f = useCurrentFrame();
  const pop = usePop(enterAt, 10);
  const swing = 5 * Math.sin((f - enterAt) / 16) * Math.exp(-Math.max(0, f - enterAt) / 90);
  const crack = crackAt === undefined ? 0 : ease(f, crackAt, crackAt + 10);
  const shake = crackAt !== undefined && f >= crackAt && f < crackAt + 12 ? Math.sin(f * 3) * 10 * (1 - (f - crackAt) / 12) : 0;
  const glow = glowAt === undefined ? 0 : ease(f, glowAt, glowAt + 20);
  return (
    <g>
      {glow > 0 && (
        <g transform={`translate(${x} ${y})`} opacity={glow}>
          <defs>
            <radialGradient id="tagGlow">
              <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#FFE9A8" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle r={520} fill="url(#tagGlow)" />
          <g transform={`rotate(${f * 0.6})`}>
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={-6} y={-470} width={12} height={110} rx={6} fill={C.orange} opacity={0.5} transform={`rotate(${i * 30})`} />
            ))}
          </g>
        </g>
      )}
      <At x={x + shake} y={y} s={s * pop} r={-6 + swing}>
        <PriceTag text={text} color={color} string={false} />
        {crack > 0 && (
          <path
            d="M 10 -90 L -10 -40 L 30 -10 L -5 30 L 25 90"
            stroke={C.paper}
            strokeWidth={9}
            fill="none"
            strokeLinejoin="round"
            strokeDasharray={300}
            strokeDashoffset={300 * (1 - crack)}
          />
        )}
      </At>
      {qAt !== undefined &&
        (
          [
            [x - 420, y - 120, 110, -12],
            [x + 440, y - 170, 140, 10],
            [x + 470, y + 170, 90, 18],
          ] as const
        ).map(([qx, qy, size, r], i) => (
          <At key={i} x={qx} y={qy} r={r} s={ease(f, qAt + i * 5, qAt + i * 5 + 10, 0, 1, Easing.out(Easing.back(2)))} o={0.4}>
            <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.ink}>
              ？
            </text>
          </At>
        ))}
      {crackAt !== undefined && <Sfx at={crackAt} name="chip" volume={1} />}
      {crackAt !== undefined && <Sfx at={crackAt + 2} name="thud" volume={0.6} />}
      {glowAt !== undefined && <Sfx at={glowAt} name="ding" volume={0.7} />}
    </g>
  );
};

/* ── 歯車の機械 ───────────────── */
export const Machine: React.FC<{ labels?: string[]; litAt?: number[]; crackAt?: number; stopAt?: number; y?: number; s?: number; o?: number }> = ({
  labels = [],
  litAt = [],
  crackAt,
  stopAt,
  y = 470,
  s = 1,
  o = 1,
}) => {
  const f = useCurrentFrame();
  const t = stopAt !== undefined ? Math.min(f, stopAt) : f;
  const gears = [
    [-420, 20, 150, 12, C.inkSoft],
    [-150, -40, 120, 10, C.red],
    [110, 30, 150, 12, C.orange],
    [380, -30, 120, 10, C.green],
  ] as const;
  const crack = crackAt === undefined ? 0 : ease(f, crackAt, crackAt + 12);
  return (
    <g transform={`translate(960 ${y}) scale(${s})`} opacity={o}>
      {gears.map(([gx, gy, r, n, c], i) => (
        <g key={i} transform={`translate(${gx} ${gy})`}>
          <Gear r={r} teeth={n} color={c} rot={(i % 2 ? -1 : 1) * t * (1.8 * (150 / r))} />
        </g>
      ))}
      {crack > 0 && (
        <path
          d="M 60 -150 L 20 -60 L 90 -10 L 30 60 L 80 160"
          stroke={C.night}
          strokeWidth={12}
          fill="none"
          strokeLinejoin="round"
          strokeDasharray={420}
          strokeDashoffset={420 * (1 - crack)}
        />
      )}
      {labels.map((l, i) => {
        const [gx] = gears[i];
        const p = ease(f, litAt[i] ?? 0, (litAt[i] ?? 0) + 10, 0, 1, Easing.out(Easing.back(2)));
        const w = [...l].length * 48 + 60;
        return (
          <g key={l} transform={`translate(${gx} 250) scale(${p})`}>
            <rect x={-w / 2} y={-42} width={w} height={84} rx={42} fill={C.ink} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.white}>
              {l}
            </text>
          </g>
        );
      })}
      {litAt.map((a, i) => (
        <Sfx key={i} at={a} name={`tok${i + 1}`} volume={0.7} />
      ))}
      {crackAt !== undefined && <Sfx at={crackAt} name="chip" volume={1} />}
    </g>
  );
};

/* ── 上昇する矢印（コスト高） ───────────────── */
export const RiseArrows: React.FC<{ items: { label: string; at: number }[]; cx?: number; gap?: number }> = ({ items, cx = 960, gap = 380 }) => {
  const f = useCurrentFrame();
  const x0 = cx - ((items.length - 1) * gap) / 2;
  return (
    <g>
      {items.map((it, i) => {
        const x = x0 + i * gap;
        const p = ease(f, it.at, it.at + 18, 0, 1, Easing.out(Easing.back(1.4)));
        const top = 780 - 480 * p;
        return (
          <g key={i}>
            <rect x={x - 45} y={top + 40} width={90} height={Math.max(0, 780 - top - 40)} fill={C.red} opacity={0.9} rx={10} />
            <path d={`M ${x - 95} ${top + 60} L ${x} ${top - 40} L ${x + 95} ${top + 60} Z`} fill={C.red} opacity={p > 0 ? 1 : 0} />
            <text x={x} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.ink} opacity={ease(f, it.at - 4, it.at + 6)}>
              {it.label}
            </text>
            <Sfx at={it.at} name={`tok${Math.min(5, i * 2 + 1)}`} volume={0.8} />
            <Sfx at={it.at} name="whoosh" volume={0.4} />
          </g>
        );
      })}
    </g>
  );
};

/* ── 吹き出しが増える ───────────────── */
export const Bubbles: React.FC<{ texts: string[]; times: number[]; clearAt?: number; spots?: [number, number, number][] }> = ({ texts, times, clearAt, spots }) => {
  const f = useCurrentFrame();
  const P: [number, number, number][] = spots ?? [
    [520, 250, -4], [1380, 230, 5], [860, 170, 2], [360, 480, 6], [1540, 470, -5], [1100, 380, -3],
    [640, 640, 4], [1300, 660, -6], [200, 250, 3], [1720, 260, -2], [960, 560, 5], [420, 780, -4],
  ];
  const clear = clearAt === undefined ? 0 : ease(f, clearAt, clearAt + 10);
  return (
    <g>
      {times.map((t, i) => {
        const p = ease(f, t, t + 10, 0, 1, Easing.out(Easing.back(2)));
        const [x, y, r] = P[i % P.length];
        if (p <= 0) return null;
        return (
          <At key={i} x={x} y={y} s={0.62 * p * (1 - clear)} r={r} o={1 - clear}>
            <Bubble text={texts[i % texts.length]} size={56} tail={i % 2 ? "right" : "left"} />
          </At>
        );
      })}
      {times.map((t, i) => (
        <Sfx key={i} at={t} name="pop" volume={0.5} />
      ))}
      {clearAt !== undefined && <Sfx at={clearAt} name="whoosh" volume={0.6} />}
    </g>
  );
};

/* ── 1970 年代の回想トーン ───────────────── */
export const Retro: React.FC<{ children: React.ReactNode; amount?: number }> = ({ children, amount = 1 }) => {
  const f = useCurrentFrame();
  const flick = 0.97 + 0.03 * Math.sin(f * 1.7) * Math.sin(f * 0.61);
  return (
    <AbsoluteFill style={{ filter: `sepia(${0.65 * amount}) saturate(${1 - 0.3 * amount}) contrast(1.04) brightness(${flick})` }}>
      {children}
      <AbsoluteFill style={{ opacity: 0.5 * amount, pointerEvents: "none" }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          {[0, 1, 2].map((k) => {
            const x = (Math.sin(f * 0.37 + k * 2.1) * 0.5 + 0.5) * 1920;
            return <line key={k} x1={x} y1={0} x2={x + 8} y2={1080} stroke="#6B5A3C" strokeWidth={1.5} opacity={(f + k) % 5 === 0 ? 0 : 0.35} />;
          })}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(60,40,15,0.35) 100%)", opacity: amount }} />
    </AbsoluteFill>
  );
};

/* ── 二股の道 ───────────────── */
export const Fork: React.FC<{ at: number; fog?: number; labels?: boolean; focus?: "left" | "right" }> = ({ at, fog = 1, labels = true, focus }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 30, 0, 1, Easing.inOut(Easing.cubic));
  const len = 1400;
  return (
    <g>
      <path d="M 960 900 L 960 640" stroke={C.ink} strokeWidth={60} strokeLinecap="round" />
      {[
        ["M 960 640 C 960 520, 620 470, 420 240", BRAND.daiso, "left"],
        ["M 960 640 C 960 520, 1300 470, 1500 240", BRAND.seria, "right"],
      ].map(([d, c, side]) => (
        <path
          key={side}
          d={d}
          stroke={c}
          strokeWidth={60}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - p)}
          opacity={focus && focus !== side ? 0.35 : 1}
        />
      ))}
      <defs>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.paper} stopOpacity={1} />
          <stop offset="100%" stopColor={C.paper} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={420} fill="url(#fog)" opacity={fog} />
      {labels &&
        (
          [
            [520, 380, "DAISO", BRAND.daiso],
            [1400, 380, "Seria", BRAND.seria],
          ] as const
        ).map(([x, y, t, c]) => (
          <g key={t} transform={`translate(${x} ${y}) scale(${ease(f, at + 20, at + 32, 0, 1, Easing.out(Easing.back(2)))})`}>
            <rect x={-130} y={-44} width={260} height={88} rx={44} fill={c} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.white}>
              {t}
            </text>
          </g>
        ))}
      <Sfx at={at} name="whoosh" volume={0.6} />
    </g>
  );
};
