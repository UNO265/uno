/**
 * CASE FILE 系の部品: 証拠写真フレーム・資料カード・CLUE ボード・MONEY FLOW・質問画面。
 * 実写素材は public/evidence/ に置き、scripts/evidence.py で一覧を更新すると自動で差し替わる。
 */
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import manifest from "./evidence.json";
import { At, Coin } from "./art";
import { Sfx, clamp, ease } from "./lib";
import { C, FONT } from "./theme";

const has = (file: string) => (manifest.files as string[]).includes(file);

/* ── 証拠写真フレーム（ポラロイド + テープ + EVIDENCE ラベル） ───────────────── */
export const Evidence: React.FC<{
  no: string;
  file: string;
  caption: string;
  source?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  at?: number;
  fallback: React.ReactNode;
  viewBox?: string;
}> = ({ no, file, caption, source, x, y, w, h, rot = -2, at = 0, fallback, viewBox = "0 0 1920 1080" }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14, 0, 1, Easing.out(Easing.cubic));
  const zoom = 1 + 0.06 * interpolate(f, [at, at + 300], [0, 1], clamp);
  const real = has(file);
  const isVideo = /\.(mp4|webm|mov)$/i.test(file);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w + 32,
          background: "#FFFDF8",
          padding: "16px 16px 0",
          boxShadow: "0 18px 40px rgba(60,40,10,0.22)",
          transform: `translateY(${(1 - p) * 60}px) rotate(${rot + (1 - p) * 4}deg)`,
          opacity: p,
          fontFamily: FONT,
        }}
      >
        <div style={{ width: w, height: h, overflow: "hidden", background: C.paperDeep, position: "relative" }}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}>
            {real ? (
              isVideo ? (
                <OffthreadVideo src={staticFile(`evidence/${file}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Img src={staticFile(`evidence/${file}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )
            ) : (
              <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
                {fallback}
              </svg>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 6px 18px" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.ink }}>{caption}</div>
          {source && <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft }}>{source}</div>}
        </div>
        {/* テープ */}
        <div style={{ position: "absolute", left: -20, top: -14, width: 120, height: 36, background: "rgba(243,163,58,0.55)", transform: "rotate(-24deg)" }} />
        <div style={{ position: "absolute", right: -20, top: -14, width: 120, height: 36, background: "rgba(243,163,58,0.55)", transform: "rotate(22deg)" }} />
        {/* ラベル */}
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 30,
            background: C.red,
            color: C.white,
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: 3,
            padding: "4px 14px",
            borderRadius: 6,
            boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
          }}
        >
          EVIDENCE {no}
        </div>
      </div>
      <Sfx at={at} name="whoosh" volume={0.35} />
      <Sfx at={at + 10} name="stamp" volume={0.25} />
    </>
  );
};

/* ── 資料カード（調査・決算・公式サイト・報道の要約） ───────────────── */
export const Clipping: React.FC<{
  kind: string;
  source: string;
  title: string;
  lines: string[];
  hl?: number;
  hlAt?: number;
  at?: number;
  x?: number;
  y?: number;
  w?: number;
  rot?: number;
  out?: number;
}> = ({ kind, source, title, lines, hl, hlAt, at = 0, x = 360, y = 110, w = 1200, rot = -1.5, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14, 0, 1, Easing.out(Easing.cubic));
  const o = out === undefined ? 1 : 1 - ease(f, out, out + 10);
  const mark = hlAt === undefined ? 1 : ease(f, hlAt, hlAt + 16, 0, 1, Easing.inOut(Easing.quad));
  const zig = Array.from({ length: 41 }, (_, i) => `${(i / 40) * 100}% ${i % 2 ? 1.2 : 0}%`).join(",");
  const zigB = Array.from({ length: 41 }, (_, i) => `${100 - (i / 40) * 100}% ${i % 2 ? 98.8 : 100}%`).join(",");
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          transform: `translateY(${(1 - p) * 50}px) rotate(${rot}deg)`,
          opacity: p * o,
          filter: "drop-shadow(0 16px 26px rgba(60,40,10,0.2))",
          fontFamily: FONT,
        }}
      >
        <div style={{ background: "#FBF6EA", clipPath: `polygon(${zig},${zigB})`, padding: "44px 56px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ background: C.ink, color: C.paper, fontWeight: 900, fontSize: 26, padding: "4px 16px", borderRadius: 6, letterSpacing: 3 }}>{kind}</div>
            <div style={{ fontWeight: 900, fontSize: 30, color: C.inkSoft }}>{source}</div>
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: C.ink, marginTop: 20, lineHeight: 1.3 }}>{title}</div>
          <div style={{ height: 4, background: C.line, margin: "20px 0 18px" }} />
          {lines.map((l, i) => (
            <div key={i} style={{ fontSize: 38, fontWeight: 700, color: C.ink, lineHeight: 1.7, position: "relative", display: "table" }}>
              {i === hl && (
                <span
                  style={{
                    position: "absolute",
                    left: -8,
                    bottom: 6,
                    height: "45%",
                    width: `calc(${mark * 100}% + 16px)`,
                    background: "rgba(243,163,58,0.55)",
                    borderRadius: 4,
                  }}
                />
              )}
              <span style={{ position: "relative" }}>{l}</span>
            </div>
          ))}
          <div style={{ fontSize: 22, fontWeight: 700, color: C.inkSoft, marginTop: 16, textAlign: "right" }}>※公表資料の内容を要約</div>
        </div>
        <div style={{ position: "absolute", left: "44%", top: -18, width: 150, height: 40, background: "rgba(243,163,58,0.55)", transform: "rotate(-4deg)" }} />
      </div>
      <Sfx at={at} name="whoosh" volume={0.35} />
      {hlAt !== undefined && <Sfx at={hlAt} name="type" volume={0.4} />}
    </>
  );
};

/* ── CASE タイトル ───────────────── */
export const CaseTitle: React.FC<{ no: string; q1: React.ReactNode; q2: React.ReactNode; at?: number }> = ({ no, q1, q2, at = 0 }) => {
  const f = useCurrentFrame();
  const a = ease(f, at, at + 12);
  const b = ease(f, at + 10, at + 24);
  const c = ease(f, at + 18, at + 32);
  const bar = ease(f, at + 26, at + 46);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", paddingLeft: 700, paddingBottom: 120, fontFamily: FONT, color: C.ink }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: a }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 10, color: C.inkSoft }}>KANENAZO</div>
        <div style={{ background: C.red, color: C.white, fontWeight: 900, fontSize: 34, letterSpacing: 4, padding: "4px 18px", borderRadius: 8 }}>CASE {no}</div>
      </div>
      <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: 4, marginTop: 28, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>{q1}</div>
      <div style={{ fontSize: 100, fontWeight: 900, letterSpacing: 4, whiteSpace: "nowrap", opacity: c, transform: `translateY(${(1 - c) * 26}px)` }}>{q2}</div>
      <div style={{ height: 10, width: 1000 * bar, background: C.red, borderRadius: 5, marginTop: 20 }} />
    </AbsoluteFill>
  );
};

/* ── CLUE ボード（手がかりのファイル） ───────────────── */
export const CLUES = ["大量仕入れ", "商品構成", "まとめ買い", "取引条件"];
export const ClueBoard: React.FC<{ lit: (number | undefined)[]; focus?: number; y?: number; title?: { at: number } }> = ({ lit, focus, y = 480, title }) => {
  const f = useCurrentFrame();
  const W = 380;
  const gap = 36;
  const x0 = 960 - (CLUES.length * W + (CLUES.length - 1) * gap) / 2;
  return (
    <g>
      {title && (
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.inkSoft} letterSpacing={10} opacity={ease(f, title.at, title.at + 10)}>
          CLUE BOARD
        </text>
      )}
      {CLUES.map((l, i) => {
        const at = lit[i];
        const on = at !== undefined && f >= at;
        const p = at === undefined ? 0 : ease(f, at, at + 14, 0, 1, Easing.out(Easing.back(1.8)));
        const isFocus = focus === i && on;
        const dim = focus !== undefined && focus !== i ? 0.45 : 1;
        const s = isFocus ? 1 + 0.12 * p : 1;
        const x = x0 + i * (W + gap) + W / 2;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={dim}>
            <path d={`M ${-W / 2} -150 h 150 l 24 -34 h 110 l 24 34 h ${W - 308} v 300 h ${-W} Z`} fill={on ? "#E9D8B4" : "rgba(233,216,180,0.45)"} stroke={on ? C.ink : C.line} strokeWidth={5} strokeDasharray={on ? "0" : "14 10"} />
            <text x={-W / 2 + 212} y={-160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill={on ? C.ink : C.line} letterSpacing={2}>
              CLUE 0{i + 1}
            </text>
            {on ? (
              <g transform={`scale(${p})`}>
                <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={[...l].length > 4 ? 52 : 60} fill={C.ink}>
                  {l}
                </text>
                <rect x={-120} y={70} width={240} height={10} rx={5} fill={C.red} />
              </g>
            ) : (
              <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.line}>
                ？
              </text>
            )}
          </g>
        );
      })}
      {lit.map((a, i) => (a !== undefined && a >= 0 ? <Sfx key={i} at={a} name="ding" volume={0.55} /> : null))}
    </g>
  );
};

/* ── MONEY FLOW（商品は右へ、お金は左へ） ───────────────── */
export type FlowStop = { label: string; icon: React.ReactNode; at: number; color?: string };
export const MoneyFlow: React.FC<{ stops: FlowStop[]; moneyAt?: number; y?: number; highlight?: number }> = ({ stops, moneyAt, y = 430, highlight }) => {
  const f = useCurrentFrame();
  const x0 = 230;
  const x1 = 1690;
  const step = (x1 - x0) / (stops.length - 1);
  const r = 110;
  const money = moneyAt === undefined ? 0 : ease(f, moneyAt, moneyAt + 12);
  const glow = highlight === undefined ? 0 : ease(f, highlight, highlight + 14);
  return (
    <g>
      <g transform="translate(150 110)" opacity={ease(f, 0, 10)}>
        <rect x={-10} y={-34} width={300} height={68} rx={34} fill={C.ink} />
        <text x={140} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.gold} letterSpacing={4}>
          MONEY FLOW
        </text>
      </g>
      {stops.map((st, i) => {
        if (i === 0) return null;
        const xa = x0 + (i - 1) * step + r + 14;
        const xb = x0 + i * step - r - 20;
        const p = ease(f, st.at - 10, st.at);
        return (
          <g key={`a${i}`} opacity={p > 0 ? 1 : 0}>
            <line x1={xa} y1={y - 40} x2={xa + (xb - xa) * p} y2={y - 40} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
            <path d={`M ${xa + (xb - xa) * p - 2} ${y - 58} L ${xa + (xb - xa) * p + 18} ${y - 40} L ${xa + (xb - xa) * p - 2} ${y - 22} Z`} fill={C.ink} />
            <g opacity={money}>
              <line x1={xb} y1={y + 40} x2={xa} y2={y + 40} stroke={C.gold} strokeWidth={8} strokeDasharray="4 14" strokeLinecap="round" />
              {[0, 1].map((k) => {
                const t = (((f - (moneyAt ?? 0)) / 40 + k / 2 + i * 0.13) % 1 + 1) % 1;
                return (
                  <At key={k} x={xb - (xb - xa) * t} y={y + 40} s={1}>
                    <Coin id={`mf${i}${k}`} r={20} label={false} />
                  </At>
                );
              })}
            </g>
          </g>
        );
      })}
      {stops.map((st, i) => {
        const x = x0 + i * step;
        const p = ease(f, st.at, st.at + 12, 0, 1, Easing.out(Easing.back(1.8)));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
            <circle r={r + 16 * glow} fill={C.red} opacity={0.15 * glow} />
            <circle r={r} fill={C.white} stroke={st.color ?? C.ink} strokeWidth={8} />
            {st.icon}
            <text y={r + 58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={st.color ?? C.ink}>
              {st.label}
            </text>
          </g>
        );
      })}
      <text x={x1 + 60} y={y - 34} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.ink} opacity={ease(f, stops[stops.length - 1].at, stops[stops.length - 1].at + 10)} textAnchor="middle">
        商品
      </text>
      <text x={x0 - 70} y={y + 50} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.goldDeep} opacity={money} textAnchor="middle">
        お金
      </text>
      {stops.map((st, i) => (
        <Sfx key={i} at={st.at} name={`tok${i % 6}`} volume={0.6} />
      ))}
      {moneyAt !== undefined && <Sfx at={moneyAt} name="roll" volume={0.4} />}
    </g>
  );
};

/* ── 質問の独立画面（暗転） ───────────────── */
export const Question: React.FC<{ lines: { t: React.ReactNode; size?: number; at: number }[]; kicker?: string }> = ({ lines, kicker }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT, color: C.paper, textAlign: "center" }}>
      {kicker && <div style={{ fontSize: 40, fontWeight: 700, color: "#9AA3B5", letterSpacing: 10, marginBottom: 26, opacity: ease(f, 0, 12) }}>{kicker}</div>}
      {lines.map((l, i) => {
        const p = ease(f, l.at, l.at + 14);
        return (
          <div key={i} style={{ fontSize: l.size ?? 110, fontWeight: 900, letterSpacing: 4, lineHeight: 1.35, whiteSpace: "nowrap", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
            {l.t}
          </div>
        );
      })}
      {lines.map((l, i) => (
        <Sfx key={i} at={l.at} name="thud" volume={i === 0 ? 0.6 : 0.3} />
      ))}
    </AbsoluteFill>
  );
};

export const Red: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.red }}>{children}</span>;
export const Gold: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.orange }}>{children}</span>;

