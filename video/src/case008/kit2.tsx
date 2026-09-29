/**
 * CASE #008 再制作（06 DIRECTION）の共通部品。
 * - Cam: 2D の仮想カメラ（06-30）。キーフレームで拡大率と注視点を動かす
 * - Sys: 映像全体で同じ「自販機 1 台の経済システム」（本数ゲージ・固定費ブロック・売上の硬貨）
 * - CoinTrail: 硬貨が実際に移動して分かれる MONEY FLOW（06-8）。商品 → 客、お金 → 会社（06-9）
 * - JapanMap: 大きな台数を日本地図の点で（06-16）
 * - Platform / DrugStore: 実写の代わりの再現場面（C5, 06 関係①）
 */
import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { K } from "../case002/ui";
import { FONT } from "../theme";
import { Can, Machine, V } from "./kit";

const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ── カメラ ───────────────── */
export type Key = { at: number; s: number; x?: number; y?: number };
export const Cam: React.FC<{ keys: Key[]; children: React.ReactNode }> = ({ keys, children }) => {
  const f = useCurrentFrame();
  const ks = keys.length === 1 ? [keys[0], { ...keys[0], at: keys[0].at + 1 }] : keys;
  const at = ks.map((k) => k.at);
  const ez = { ...clampX, easing: Easing.inOut(Easing.cubic) };
  const s = interpolate(f, at, ks.map((k) => k.s), ez);
  const x = interpolate(f, at, ks.map((k) => k.x ?? 960), ez);
  const y = interpolate(f, at, ks.map((k) => k.y ?? 540), ez);
  return <g transform={`translate(960 540) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
};

/* ── 硬貨 ───────────────── */
export const Coin8: React.FC<{ x: number; y: number; r?: number; o?: number; label?: string }> = ({ x, y, r = 20, o = 1, label }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r} fill={V.coin} stroke="#B8902A" strokeWidth={r * 0.14} />
    <circle r={r * 0.68} fill="none" stroke="#B8902A" strokeWidth={r * 0.06} />
    {label && (
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r * 0.62} fill="#7A5A10">
        {label}
      </text>
    )}
  </g>
);

/** 折れ線に沿った位置（t: 0..1） */
export const along = (pts: [number, number][], t: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const L = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * L;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? d / seg[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};

/** 硬貨の列が経路を流れる。at から dur フレームで n 枚が順に到着する。stay: 到着後も終点に残す */
export const CoinTrail: React.FC<{ pts: [number, number][]; at: number; n?: number; dur?: number; gap?: number; r?: number; stay?: boolean; color?: string; loop?: boolean }> = ({
  pts,
  at,
  n = 5,
  dur = 36,
  gap = 7,
  r = 16,
  stay = false,
  loop = false,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        let t = (f - at - i * gap) / dur;
        if (loop && t > 1) t = t % 1;
        if (t < 0) return null;
        if (t > 1 && !stay) return null;
        const [x, y] = along(pts, Math.min(1, t));
        return <Coin8 key={i} x={x} y={y} r={r} o={t > 1 ? 1 : Math.min(1, t * 6)} />;
      })}
    </g>
  );
};

/** 商品（ボトル）が客へ動く */
export const BottleTrail: React.FC<{ pts: [number, number][]; at: number; n?: number; dur?: number; gap?: number; s?: number; loop?: boolean }> = ({ pts, at, n = 3, dur = 40, gap = 16, s = 0.6, loop = false }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        let t = (f - at - i * gap) / dur;
        if (loop && t > 1) t = t % 1;
        if (t < 0 || t > 1) return null;
        const [x, y] = along(pts, t);
        return <Can key={i} x={x} y={y} color="#81B29A" s={s} bottle o={Math.min(1, t * 6, (1 - t) * 6)} />;
      })}
    </g>
  );
};

/* ── 自販機 1 台の経済システム ───────────────── */
/** sales: 本数ゲージ 0..1（青）、cost: 固定費ブロック（赤、常に同じ高さ）、coins: 売上の硬貨 0..1、red: 赤字の色 0..1 */
export const Sys: React.FC<{ x: number; y: number; s?: number; sales: number; coins?: number; red?: number; led?: string; labels?: boolean; o?: number; costO?: number }> = ({
  x,
  y,
  s = 1,
  sales,
  coins = sales,
  red = 0,
  led = "200",
  labels = true,
  o = 1,
  costO = 1,
}) => {
  const gH = 300;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {red > 0 && <ellipse cx={0} cy={-360} rx={300} ry={420} fill={V.red} opacity={0.18 * red} />}
      <Machine x={0} y={0} s={0.8} led={led} />
      {/* 本数ゲージ */}
      <g transform="translate(-260 0)">
        <rect x={-34} y={-gH - 40} width={68} height={gH} rx={12} fill="#E8EBF0" stroke="#C9D1DB" strokeWidth={3} />
        <rect x={-34} y={-40 - gH * sales} width={68} height={gH * sales} rx={12} fill={V.blue} />
        {labels && (
          <text y={-gH - 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.blue}>
            本数
          </text>
        )}
      </g>
      {/* 固定費ブロック */}
      <g transform="translate(250 0)" opacity={costO}>
        {["補充", "場所", "機械"].map((l, i) => (
          <g key={l}>
            <rect x={-60} y={-40 - (i + 1) * 90} width={120} height={84} rx={10} fill={V.red} opacity={0.92} />
            <text x={0} y={-40 - (i + 1) * 90 + 42} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF">
              {l}
            </text>
          </g>
        ))}
        {labels && (
          <text y={-gH - 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.red}>
            費用
          </text>
        )}
      </g>
      {/* 売上の硬貨 */}
      <g transform="translate(0 40)">
        {Array.from({ length: 8 }, (_, i) => (
          <Coin8 key={i} x={-105 + i * 30} y={0} r={15} o={i < Math.round(coins * 8) ? 1 : 0.12} />
        ))}
      </g>
    </g>
  );
};

/* ── 日本地図（点 1 つ = 1 万台など） ───────────────── */
const ISLANDS: [number, number][][] = [
  [[700, 60], [780, 40], [860, 90], [900, 150], [840, 200], [760, 210], [720, 170], [690, 120]],
  [[690, 230], [740, 260], [735, 330], [720, 420], [700, 500], [660, 560], [600, 610], [520, 640], [440, 660], [360, 690], [300, 720], [262, 700], [300, 660], [380, 628], [460, 590], [540, 556], [600, 506], [640, 440], [660, 360], [662, 290]],
  [[380, 720], [460, 702], [500, 730], [452, 762], [380, 760]],
  [[220, 720], [282, 742], [292, 800], [250, 862], [200, 842], [190, 770]],
];
const inPoly = (p: [number, number], poly: [number, number][]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const DOTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let y = 40; y < 870; y += 11) for (let x = 180; x < 910; x += 11) {
    const p: [number, number] = [x + ((y * 7) % 5) - 2, y + ((x * 3) % 5) - 2];
    if (ISLANDS.some((poly) => inPoly(p, poly))) out.push(p);
  }
  // 並びをばらす（決定的）
  return out.map((p, i) => ({ p, k: (i * 7919) % 104729 })).sort((a, b) => a.k - b.k).map((d) => d.p);
})();
export const DOT_COUNT = DOTS.length;
/** n: 灯る点の数（最大 DOT_COUNT）、blue: そのうち青（飲料）の数、red: 赤い点の数 */
export const JapanMap: React.FC<{ x: number; y: number; s?: number; n: number; blue?: number; red?: number; dark?: boolean; o?: number; r?: number }> = ({
  x,
  y,
  s = 1,
  n,
  blue = 0,
  red = 0,
  dark = false,
  o = 1,
  r = 3.6,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) translate(-545 -450)`} opacity={o}>
    {ISLANDS.map((poly, i) => (
      <polygon key={i} points={poly.map((p) => p.join(",")).join(" ")} fill={dark ? "#1B2740" : "#E8EBF0"} stroke={dark ? "#2E3C57" : "#C9D1DB"} strokeWidth={4} strokeLinejoin="round" />
    ))}
    {DOTS.map((p, i) => {
      if (i >= n) return null;
      const c = i < red ? V.red : i < red + blue ? V.blue : dark ? "#FFE9B0" : "#5E6B7D";
      return <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={c} />;
    })}
  </g>
);

/* ── 再現場面: 駅のホーム ───────────────── */
export const Platform: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <g opacity={o}>
    <rect x={0} y={0} width={1920} height={1080} fill="#0F1A2E" />
    {/* 屋根と柱 */}
    <rect x={0} y={0} width={1920} height={90} fill="#1B2740" />
    {[200, 760, 1320, 1880].map((x) => (
      <rect key={x} x={x - 22} y={90} width={44} height={700} fill="#243552" />
    ))}
    {/* 蛍光灯 */}
    {[480, 1040, 1600].map((x) => (
      <g key={x}>
        <rect x={x - 90} y={96} width={180} height={12} rx={6} fill="#EAF2FF" />
        <path d={`M ${x - 90} 108 L ${x - 220} 600 L ${x + 220} 600 L ${x + 90} 108 Z`} fill="#EAF2FF" opacity={0.035} />
      </g>
    ))}
    {/* 発車標 */}
    <g transform="translate(380 430)">
      <rect x={-200} y={-40} width={400} height={80} rx={8} fill="#0A0F18" stroke="#3B4B68" strokeWidth={4} />
      <text x={-170} y={8} fontFamily="'DejaVu Sans Mono', monospace" fontSize={30} fill="#FFB347">
        普通 18:42
      </text>
      <text x={60} y={8} fontFamily="'DejaVu Sans Mono', monospace" fontSize={30} fill="#7CFC9A">
        2番線
      </text>
    </g>
    {/* ホーム */}
    <rect x={0} y={790} width={1920} height={290} fill="#2A3446" />
    <rect x={0} y={790} width={1920} height={16} fill="#E8C547" />
    {Array.from({ length: 30 }, (_, i) => (
      <rect key={i} x={i * 66} y={812} width={40} height={10} rx={3} fill="#E8C547" opacity={0.5} />
    ))}
  </g>
);

/* ── 再現場面: ドラッグストアの店先 ───────────────── */
export const DrugStore: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-220} y={-420} width={440} height={420} fill="#F4F6F8" stroke="#0B1220" strokeWidth={4} />
    <rect x={-240} y={-470} width={480} height={70} rx={6} fill="#3CAF7C" />
    <text y={-424} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF">
      DRUG
    </text>
    <rect x={-190} y={-370} width={380} height={220} fill="#DDEBF5" />
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} x={-176 + c * 72} y={-356 + r * 70} width={56} height={56} rx={6} fill={["#81B29A", "#F2CC8F", "#98C1D9"][r]} />),
    )}
    <rect x={-70} y={-130} width={140} height={130} fill="#9FB3C8" />
    <rect x={120} y={-130} width={80} height={60} rx={6} fill="#FFFFFF" stroke={V.red} strokeWidth={4} />
    <text x={160} y={-92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.red}>
      特価
    </text>
  </g>
);

/** 人（横向きに歩く・止まる）。dir: 1 右向き */
export const Person8: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number; step?: number; bag?: boolean; phone?: boolean }> = ({
  x,
  y,
  s = 1,
  color = "#C9D6E6",
  o = 1,
  step = 0,
  bag,
  phone,
}) => {
  const sw = Math.sin(step) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cy={-190} r={26} fill={color} />
      <path d="M -30 -156 L 30 -156 L 24 -60 L -24 -60 Z" fill={color} />
      <rect x={-20} y={-62} width={16} height={62} rx={7} fill={color} transform={`rotate(${sw} -12 -62)`} />
      <rect x={4} y={-62} width={16} height={62} rx={7} fill={color} transform={`rotate(${-sw} 12 -62)`} />
      {bag && <rect x={28} y={-110} width={36} height={44} rx={6} fill="#3CAF7C" />}
      {phone && <rect x={30} y={-150} width={22} height={38} rx={5} fill="#0B1220" stroke="#EAF2FF" strokeWidth={3} />}
    </g>
  );
};

export { K, V, clampX };
