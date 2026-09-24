/**
 * CASE #001 ショート（縦 1080×1920）の共通部品。
 * - 上部: KANENAZO / CASE #001 / ショートの題
 * - 中央: 図（SVG 1080×1920）
 * - 字幕: 画面中央やや下に大きく（YouTube の UI がかぶる下端 380px と右端は避ける）
 * - 最後: 「続きは本編で」エンドカード
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CutData, CutProps, Paper, Sfx, clamp, ease, sec, segEnd, segStart } from "../lib";
import { BRAND, C, FONT } from "../theme";

export const SERIF = "'Noto Serif CJK JP', serif";
export type Ctx = { cut: CutData; f: number; s: (i: number) => number; e: (i: number) => number; d: number };

/* ── 字幕: 13 字前後で句読点・助詞の後ろで折り返す ───────────────── */
const wrap = (t: string, max = 13): string[] => {
  const chars = [...t];
  if (chars.length <= max) return [t];
  // 行数を先に決めて、各行がほぼ同じ長さになる位置の近くで、句読点・助詞の後ろで折る
  const lines: string[] = [];
  let rest = chars;
  while (rest.length > max) {
    const target = Math.ceil(rest.length / Math.ceil(rest.length / max));
    let best = -1;
    let bestScore = Infinity;
    for (let i = 3; i <= Math.min(max, rest.length - 2); i++) {
      const prev = rest[i - 1];
      const next = rest[i];
      let pen = Infinity;
      if ("、。」".includes(prev)) pen = 0;
      else if ("はがをにでともへやの".includes(prev) && !"はがをにでともへやのっゃゅょー、。」".includes(next) && !/[0-9]/.test(next)) pen = 2;
      else if (!"っゃゅょァィゥェォッャュョー、。」".includes(next) && !(/[0-9]/.test(prev) && /[0-9円]/.test(next))) pen = 5;
      const score = pen + Math.abs(i - target);
      if (score < bestScore) { bestScore = score; best = i; }
    }
    if (best < 0) best = Math.min(max, target);
    lines.push(rest.slice(0, best).join(""));
    rest = rest.slice(best);
  }
  lines.push(rest.join(""));
  return lines;
};

const Caption: React.FC<{ cut: CutData; hide: number[]; dark?: boolean }> = ({ cut, hide, dark }) => {
  const f = useCurrentFrame();
  const segs = cut.segments;
  const idx = segs.findIndex((s, i) => {
    const next = segs[i + 1];
    return f >= sec(s.start) - 3 && f < Math.min(next ? sec(next.start) - 3 : Infinity, sec(s.end) + 12);
  });
  if (idx < 0 || hide.includes(idx)) return null;
  const s = segs[idx];
  const p = interpolate(f, [sec(s.start) - 3, sec(s.start) + 3], [0, 1], clamp);
  const lines = wrap(s.text.replace("――", "―"));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1250, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: Math.min(70, Math.floor(920 / [...l].length)),
            lineHeight: 1.3,
            color: dark ? "#FFFFFF" : C.ink,
            background: dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.88)",
            padding: "2px 22px",
            marginBottom: 8,
            borderRadius: 10,
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - p) * 10}px)`,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

/* ── 上部の見出し ───────────────── */
const Header: React.FC<{ title: string; dark?: boolean }> = ({ title, dark }) => (
  <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 10, color: dark ? "#C9C2B6" : C.inkSoft }}>KANENAZO</div>
      <div style={{ background: C.red, color: C.white, fontWeight: 900, fontSize: 30, letterSpacing: 3, padding: "2px 14px", borderRadius: 8 }}>CASE #001</div>
    </div>
    <div style={{ fontSize: 62, fontWeight: 900, color: dark ? "#F4EEE3" : C.ink, marginTop: 14, letterSpacing: 2 }}>{title}</div>
  </div>
);

type Opt = { dark?: boolean; noCap?: boolean; hide?: number[]; header?: boolean; sepia?: (x: Ctx) => number };

export const shortCut = (title: string) => (render: (x: Ctx) => React.ReactNode, opt: Opt = {}) => {
  const Comp: React.FC<CutProps> = ({ cut }) => {
    const f = useCurrentFrame();
    const x: Ctx = { cut, f, s: (i) => segStart(cut, i), e: (i) => segEnd(cut, i), d: cut.duration };
    const sep = opt.sepia ? opt.sepia(x) : 0;
    return (
      <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
        {opt.dark ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1B2438 0%, #0E1320 80%)" }} /> : <Paper />}
        <AbsoluteFill style={{ filter: sep ? `sepia(${0.6 * sep}) saturate(${1 - 0.3 * sep})` : undefined }}>{render(x)}</AbsoluteFill>
        {opt.header !== false && <Header title={title} dark={opt.dark} />}
        {!opt.noCap && <Caption cut={cut} hide={opt.hide ?? []} dark={opt.dark} />}
        {cut.voice ? (
          <Sequence from={sec(cut.voiceStart ?? 0)} layout="none">
            <Audio src={staticFile(cut.voice)} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    );
  };
  return Comp;
};

/** 縦の SVG 舞台 */
export const V: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {children}
  </svg>
);

export const pop = (f: number, at: number, dur = 12) => ease(f, at, at + dur, 0, 1, Easing.out(Easing.back(1.8)));
export const fade = (f: number, at: number, dur = 10) => ease(f, at, at + dur);

/** 中央の大きな文字（図の領域 y≈420〜1200 の中央） */
export const Big: React.FC<{ lines: { t: React.ReactNode; at: number; size?: number; color?: string; serif?: boolean; out?: number }[]; y?: number; dark?: boolean }> = ({
  lines,
  y = 800,
  dark,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {lines.map((l, i) => {
        const p = ease(f, l.at, l.at + 14);
        const o = l.out === undefined ? 1 : 1 - ease(f, l.out, l.out + 8);
        return (
          <div
            key={i}
            style={{
              fontFamily: l.serif ? SERIF : FONT,
              fontWeight: 900,
              fontSize: l.size ?? 96,
              color: l.color ?? (dark ? "#F4EEE3" : C.ink),
              opacity: p * o,
              transform: `translateY(${(1 - p) * 20}px)`,
              whiteSpace: "nowrap",
              letterSpacing: 2,
              lineHeight: 1.25,
            }}
          >
            {l.t}
          </div>
        );
      })}
    </div>
  );
};

export const Red: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.red }}>{children}</span>;

/** 手がかり ①②③ のスロット（縦並び） */
export const CLUE3 = ["大量仕入れ", "商品の組み合わせ", "ついで買い"];
export const Slots3: React.FC<{ lit: (number | undefined)[]; focus?: number; y?: number }> = ({ lit, focus, y = 520 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {CLUE3.map((l, i) => {
        const at = lit[i];
        const on = at !== undefined && f >= at;
        const p = at === undefined ? 0 : pop(f, at);
        const dim = focus !== undefined && focus !== i ? 0.35 : 1;
        const yy = y + i * 190;
        return (
          <g key={i} opacity={dim} transform={`translate(540 ${yy})`}>
            <rect x={-420} y={-70} width={840} height={140} rx={24} fill={on ? C.white : "rgba(255,255,255,0.5)"} stroke={on ? C.red : C.line} strokeWidth={7} strokeDasharray={on ? "0" : "16 12"} />
            <circle cx={-340} cy={0} r={46} fill={on ? C.red : C.line} />
            <text x={-340} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.white}>
              {"①②③"[i]}
            </text>
            <text x={40} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={on ? 60 : 70} fill={on ? C.ink : C.line} transform={`scale(${on ? 0.9 + 0.1 * p : 1})`}>
              {on ? l : "？"}
            </text>
          </g>
        );
      })}
      {lit.map((a, i) => (a !== undefined && a >= 0 ? <Sfx key={i} at={a} name="ding" volume={0.5} /> : null))}
    </g>
  );
};

/** エンドカード: 「続きは本編で」→ 本編のタイトル */
export const EndCard: React.FC<{ at: number; qLine?: React.ReactNode; qAt?: number }> = ({ at, qLine, qAt = 0 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16, 0, 1, Easing.out(Easing.back(1.4)));
  const logo = fade(f, at + 30);
  return (
    <>
      {qLine && <Big y={560} lines={[{ t: qLine, at: qAt, size: 88, out: at - 6 }]} />}
      <div style={{ position: "absolute", left: 90, right: 90, top: 520, opacity: Math.min(1, p * 1.3), transform: `scale(${0.9 + 0.1 * p})`, fontFamily: FONT }}>
        <div style={{ textAlign: "center", fontSize: 92, fontWeight: 900, color: C.ink, marginBottom: 40 }}>
          続きは<Red>本編</Red>で
        </div>
        <div style={{ background: C.white, borderRadius: 28, boxShadow: "0 20px 40px rgba(40,30,10,0.18)", padding: "44px 40px", border: `6px solid ${C.ink}` }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 8, color: C.inkSoft }}>KANENAZO</div>
            <div style={{ background: C.red, color: C.white, fontWeight: 900, fontSize: 28, padding: "2px 12px", borderRadius: 8 }}>CASE #001</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 64, fontWeight: 900, color: C.ink, marginTop: 24, lineHeight: 1.3 }}>
            100円ショップは、
            <br />
            なぜ<Red>100円</Red>で儲かるのか
          </div>
          <div style={{ textAlign: "center", fontSize: 34, fontWeight: 700, color: C.inkSoft, marginTop: 20 }}>本編 16分</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 50, opacity: logo }}>
          <span style={{ background: C.red, color: C.white, fontSize: 44, fontWeight: 900, letterSpacing: 14, padding: "6px 28px", borderRadius: 12 }}>カネナゾ</span>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.inkSoft, marginTop: 22, letterSpacing: 6 }}>身近なお金の謎を解く。</div>
        </div>
      </div>
      <Sfx at={at} name="jingle" volume={0.7} />
    </>
  );
};

export { BRAND, C, FONT, ease, clamp, Sfx, Easing, interpolate };
