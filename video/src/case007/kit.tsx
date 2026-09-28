/**
 * CASE #007「ビジネスホテル、なぜ1泊1.5万円に？」の画面部品。
 * CASE #010 までは実写を使わない（v3 0番）。主役はカードキーと客室の扉（OBJECT）、
 * 夜のホテル正面（窓ひとつ = 部屋ひとつ、灯り = 売れた部屋）、CLUE はカードキーのスリーブ（封筒）。
 * 実在ホテルのロゴ・建物は描かない（一般形の建物・カードキー・線画だけ）。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const H = {
  ...K,
  red: "#D9434B",
  night: "#0E1A30",
  wall: "#24324C",
  wallLine: "#3B4B68",
  lit: "#FFD66E",
  dark: "#1A2436",
  key: "#2F3B52",
  green: "#3CC47C",
  apa: "#D9434B",
  toyoko: "#2F6FB5",
  dormy: "#C98A2B",
  cheap: "#8FC4E8",
  pricey: "#E0564E",
};

/* ── 夜のホテル正面。lit: 灯る窓の数（または 0..1 の割合）、order: 灯る順番をばらす ───────────────── */
export const Building: React.FC<{
  x: number;
  y: number;
  cols?: number;
  rows?: number;
  cell?: number;
  lit: number;
  o?: number;
  off?: number[]; // 消える窓（index）
  label?: string;
}> = ({ x, y, cols = 10, rows = 10, cell = 46, lit, o = 1, off = [], label }) => {
  const n = cols * rows;
  const k = lit <= 1 ? Math.round(lit * n) : Math.round(lit);
  const W = cols * cell + 60;
  const Ht = rows * cell + 90;
  return (
    <g transform={`translate(${x - W / 2} ${y - Ht})`} opacity={o}>
      <rect x={0} y={0} width={W} height={Ht} rx={6} fill={H.wall} stroke={H.wallLine} strokeWidth={4} />
      <rect x={-14} y={-18} width={W + 28} height={24} rx={4} fill={H.wallLine} />
      {Array.from({ length: n }, (_, i) => {
        const order = (i * 37 + 11) % n; // 灯る順番（ばらばらに）
        const on = order < k && !off.includes(i);
        const cx = 30 + (i % cols) * cell;
        const cy = 24 + Math.floor(i / cols) * cell;
        return <rect key={i} x={cx + 5} y={cy + 5} width={cell - 10} height={cell - 12} rx={3} fill={on ? H.lit : H.dark} opacity={on ? 1 : 0.9} />;
      })}
      {/* 入口 */}
      <rect x={W / 2 - 60} y={Ht - 56} width={120} height={56} fill="#FFE9B0" opacity={0.85} />
      {label && (
        <text x={W / 2} y={Ht + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#EAF2FF">
          {label}
        </text>
      )}
    </g>
  );
};

/* ── カードキー ───────────────── */
export const CardKey: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; color?: string }> = ({ x, y, s = 1, r = 0, o = 1, color = "#E9EEF5" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <rect x={-90} y={-140} width={180} height={280} rx={16} fill={color} stroke="#0B1220" strokeWidth={4} />
    <rect x={-90} y={-140} width={180} height={70} rx={16} fill={H.toyoko} />
    <rect x={-60} y={-40} width={120} height={16} rx={8} fill="rgba(0,0,0,0.18)" />
    <circle cx={0} cy={60} r={38} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={6} />
    <path d="M -14 50 L 0 64 L 20 40" stroke="rgba(0,0,0,0.35)" strokeWidth={6} fill="none" />
  </g>
);

/* ── 客室の扉とカードリーダー（lamp: 0 = 赤, 1 = 緑） ───────────────── */
export const Door: React.FC<{ x: number; y: number; s?: number; lamp: number; no?: string }> = ({ x, y, s = 1, lamp, no = "812" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-230} y={-420} width={460} height={840} rx={10} fill="#6B4E3A" stroke="#3F2D20" strokeWidth={8} />
    <rect x={-190} y={-380} width={380} height={340} rx={6} fill="none" stroke="#5A4030" strokeWidth={6} />
    <rect x={-190} y={0} width={380} height={380} rx={6} fill="none" stroke="#5A4030" strokeWidth={6} />
    <rect x={-70} y={-470} width={140} height={46} rx={8} fill="#E9E1D2" />
    <text x={0} y={-440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
      {no}
    </text>
    {/* リーダー */}
    <rect x={120} y={-80} width={90} height={170} rx={12} fill="#1E2533" />
    <rect x={140} y={-40} width={50} height={8} rx={4} fill="#556" />
    <circle cx={165} cy={50} r={14} fill={lamp > 0.5 ? H.green : "#E24B4B"} />
    <circle cx={165} cy={50} r={26} fill={lamp > 0.5 ? H.green : "#E24B4B"} opacity={0.25} />
    <rect x={120} y={110} width={40} height={24} rx={8} fill="#C9B79C" />
  </g>
);

/* ── カレンダー（5週 × 7日）。prices: 35日分の値段、色で高さを示す ───────────────── */
const lerpColor = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
};
export const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
export const Calendar: React.FC<{ x: number; y: number; prices: number[]; lo: number; hi: number; reveal: number; cell?: number; hl?: number[]; showNum?: boolean; hlCol?: number[] }> = ({
  x,
  y,
  prices,
  lo,
  hi,
  reveal,
  cell = 110,
  hl = [],
  showNum = true,
  hlCol = [],
}) => {
  const n = Math.round(reveal * prices.length);
  return (
    <g transform={`translate(${x} ${y})`}>
      {WEEK.map((w, i) => (
        <g key={w}>
          {hlCol.includes(i) && <rect x={i * cell} y={-50} width={cell - 8} height={50 + 5 * cell} rx={10} fill="none" stroke={K.ink} strokeWidth={5} />}
          <text x={i * cell + (cell - 8) / 2} y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={i === 0 ? H.red : i === 6 ? H.toyoko : K.inkSoft}>
            {w}
          </text>
        </g>
      ))}
      {prices.map((p, i) => {
        const t = Math.max(0, Math.min(1, (p - lo) / Math.max(1, hi - lo)));
        const on = i < n;
        return (
          <g key={i} transform={`translate(${(i % 7) * cell} ${Math.floor(i / 7) * cell})`} opacity={on ? 1 : 0.15}>
            <rect width={cell - 8} height={cell - 8} rx={10} fill={lerpColor(H.cheap, H.pricey, t)} stroke={hl.includes(i) ? K.ink : "none"} strokeWidth={6} />
            <text x={10} y={26} fontFamily={FONT} fontWeight={800} fontSize={20} fill="rgba(0,0,0,0.55)">
              {i + 1 <= 31 ? i + 1 : ""}
            </text>
            {showNum && (
              <text x={(cell - 8) / 2} y={cell * 0.66} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={cell * 0.22} fill="#FFFFFF">
                {(p / 1000).toFixed(p % 1000 ? 1 : 0)}k
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

/* ── CLUE: カードキーのスリーブ ───────────────── */
export const CLUES7: Record<string, string[]> = {
  "01": ["値段は、原価ではなく", "「残りの部屋の数」で決まる。"],
  "02": ["ホテルが売っているのは、", "部屋ではない。「今夜」だ。"],
  "03": ["値段の違いは、", "空き部屋の埋め方の違い。"],
  FINAL: ["売れ残れば0円になる「今夜」を、", "どう埋めるか。", "その答えが、値段になる。"],
};
export const Sleeve: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.back(1.3)));
  const out = ease(f, at + 10, at + 34, 0, 1, Easing.out(Easing.cubic)); // カードがスリーブから出る
  const lines = CLUES7[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(80, Math.floor(740 / maxChars));
  const band = final ? "#1E2533" : H.toyoko;
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
        <div style={{ position: "relative", width: 1320, height: 600, transform: `translateY(${(1 - p) * 200}px)`, opacity: Math.min(1, p * 1.5) }}>
          {/* スリーブ（封筒） */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 400,
              height: 600,
              background: "#F4EFE4",
              borderRadius: 18,
              border: `5px solid ${band}`,
              boxShadow: "0 24px 50px rgba(0,0,0,0.25)",
              fontFamily: FONT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", background: band, color: "#FFFFFF", textAlign: "center", fontSize: 26, fontWeight: 900, letterSpacing: 8, padding: "14px 0", borderRadius: "12px 12px 0 0" }}>
              KANENAZO HOTEL
            </div>
            <div style={{ marginTop: 50, fontSize: 26, fontWeight: 800, color: K.inkSoft, letterSpacing: 6 }}>ROOM</div>
            <div style={{ fontSize: final ? 70 : 150, fontWeight: 900, color: final ? H.red : K.ink, lineHeight: 1.1 }}>{final ? "FINAL" : no}</div>
            <div style={{ marginTop: 16, fontSize: 30, fontWeight: 900, letterSpacing: 10, color: band }}>{final ? "CLUE" : "CLUE"}</div>
            <div style={{ marginTop: "auto", marginBottom: 30, fontSize: 20, fontWeight: 800, color: K.inkSoft, letterSpacing: 4 }}>CASE #007</div>
          </div>
          {/* 中から出るカード（文章） */}
          <div
            style={{
              position: "absolute",
              left: 300 + 120 * out,
              top: 70,
              width: 880,
              height: 460,
              background: "#FFFFFF",
              borderRadius: 26,
              border: `5px solid ${final ? H.red : "#1E2533"}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 56px",
              fontFamily: SERIF,
              color: "#1E2230",
              opacity: out,
            }}
          >
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.36, whiteSpace: "nowrap", opacity: ease(f, at + 24 + i * 8, at + 36 + i * 8) }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.55} />
      <Sfx at={at + 14} name="ding" volume={0.45} />
    </>
  );
};

/* ── 領収書（明細） ───────────────── */
export type RLine = { k: string; v: string; at: number; color?: string; big?: boolean };
export const Receipt: React.FC<{ x: number; y: number; title: string; lines: RLine[]; w?: number; o?: number; r?: number; s?: number }> = ({ x, y, title, lines, w = 520, o = 1, r = 0, s = 1 }) => {
  const f = useCurrentFrame();
  const h = 140 + lines.length * 76;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      <path
        d={`M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2} ${h} ${Array.from({ length: 12 }, (_, i) => `L ${w / 2 - ((i + 0.5) * w) / 12} ${h + 16} L ${w / 2 - ((i + 1) * w) / 12} ${h}`).join(" ")} Z`}
        fill="#FFFFFF"
        stroke="#D8D2C6"
        strokeWidth={3}
      />
      <text y={64} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
        {title}
      </text>
      <line x1={-w / 2 + 30} x2={w / 2 - 30} y1={92} y2={92} stroke={K.ink} strokeWidth={3} strokeDasharray="8 6" />
      {lines.map((l, i) => (
        <g key={i} opacity={fade(f, l.at)}>
          <text x={-w / 2 + 34} y={150 + i * 76} fontFamily={FONT} fontWeight={800} fontSize={l.big ? 34 : 30} fill={K.inkSoft}>
            {l.k}
          </text>
          <text x={w / 2 - 34} y={150 + i * 76} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={l.big ? 50 : 38} fill={l.color ?? K.ink}>
            {l.v}
          </text>
        </g>
      ))}
    </g>
  );
};

/* ── 人のグリッド（100人） ───────────────── */
export const PeopleGrid: React.FC<{ x: number; y: number; n: number; foreign: number; reveal: number; cell?: number }> = ({ x, y, n, foreign, reveal, cell = 52 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => {
      const on = i < reveal * n;
      const isF = i >= n - foreign;
      const cx = (i % 10) * cell;
      const cy = Math.floor(i / 10) * cell;
      return (
        <g key={i} transform={`translate(${cx} ${cy})`} opacity={on ? 1 : 0.12}>
          <circle cy={-12} r={9} fill={isF ? H.dormy : K.inkSoft} />
          <path d="M -14 16 C -14 -4 14 -4 14 16 Z" fill={isF ? H.dormy : K.inkSoft} />
        </g>
      );
    })}
  </g>
);

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
