/**
 * CASE #009「ドラッグストア、なぜ食品が安い？」の画面部品（06 DIRECTION）。
 * 主役はカゴ、繰り返す仕組みは「店の平面図（入口の食品 → 化粧品 → 奥の調剤）」と客の動線、
 * お金は「三つの財布」（オレンジ = 客の食品 / ピンク = ついでの薬・化粧品 / 青 = 保険証の調剤）。CLUE は薬袋。
 * 実写なし（C5）。実在の店のロゴ・商品は描かない（会社名は文字だけ）。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";
import { along } from "../case008/kit2";

export const P = {
  ...K,
  food: "#F28C28",
  beauty: "#E86A92",
  rx: "#2F7BD8",
  floor: "#F4F7FA",
  shelf: "#DDE4EC",
  green: "#3CAF7C",
  red: "#D9434B",
  dark: "#16202E",
  coin: "#E9C46A",
};

/* ── 食品・薬の小物 ───────────────── */
export const Egg: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-24} width={120} height={48} rx={10} fill="#F6E7C8" stroke="#C9B28A" strokeWidth={3} />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={-44 + i * 22} cy={-4} rx={9} ry={12} fill="#FFFFFF" stroke="#E0D2B4" strokeWidth={2} />
    ))}
  </g>
);
export const Milk: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -24 -40 L 0 -60 L 24 -40 L 24 50 L -24 50 Z" fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={3} />
    <rect x={-24} y={0} width={48} height={24} fill="#6FA8DC" />
  </g>
);
export const Bread: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 30 L -50 -10 Q -50 -40 -20 -40 L 20 -40 Q 50 -40 50 -10 L 50 30 Z" fill="#E8B96A" stroke="#B8894A" strokeWidth={3} />
  </g>
);
export const MedBox: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = P.beauty }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-30} width={80} height={60} rx={6} fill="#FFFFFF" stroke={color} strokeWidth={4} />
    <rect x={-8} y={-20} width={16} height={40} fill={color} />
    <rect x={-20} y={-8} width={40} height={16} fill={color} />
  </g>
);

/** カゴ。items: 入っている物の数（順に 薬・卵・牛乳・パン） */
export const Basket: React.FC<{ x: number; y: number; s?: number; items: number; o?: number }> = ({ x, y, s = 1, items, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {items > 3 && <Bread x={-30} y={-150} s={1.3} />}
    {items > 0 && <MedBox x={-130} y={-100} s={1.4} />}
    {items > 1 && <Egg x={20} y={-80} s={1.6} />}
    {items > 2 && <Milk x={140} y={-120} s={1.4} />}
    <path d="M -220 -40 L 220 -40 L 180 120 L -180 120 Z" fill="rgba(242,140,40,0.85)" stroke="#B8651A" strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={-170 + i * 68} y1={-30} x2={-150 + i * 60} y2={110} stroke="#B8651A" strokeWidth={4} opacity={0.6} />
    ))}
    <path d="M -160 -40 Q 0 -200 160 -40" fill="none" stroke="#B8651A" strokeWidth={10} />
  </g>
);

/* ── 三つの財布 ───────────────── */
export const Wallet: React.FC<{ x: number; y: number; color: string; label?: string; s?: number; o?: number }> = ({ x, y, color, label, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-80} y={-55} width={160} height={110} rx={16} fill={color} />
    <rect x={20} y={-22} width={70} height={44} rx={12} fill="rgba(255,255,255,0.35)" />
    <circle cx={50} cy={0} r={8} fill="#FFFFFF" />
    {label && (
      <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={color}>
        {label}
      </text>
    )}
  </g>
);
export const InsCard: React.FC<{ x: number; y: number; s?: number; o?: number; label?: string }> = ({ x, y, s = 1, o = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-90} y={-56} width={180} height={112} rx={12} fill="#FFFFFF" stroke={P.rx} strokeWidth={6} />
    <rect x={-90} y={-56} width={180} height={30} rx={12} fill={P.rx} />
    <text x={0} y={-35} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={20} fill="#FFFFFF">
      保険証
    </text>
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-70} y={-6 + i * 18} width={i === 2 ? 80 : 140} height={8} rx={4} fill="#C9D6E6" />
    ))}
    {label && (
      <text y={96} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.rx}>
        {label}
      </text>
    )}
  </g>
);

/* ── 店の平面図（上から見た図）。入口は下、食品 → 化粧品 → 奥に調剤 ───────────────── */
export const STORE = { x: 560, y: 150, w: 800, h: 620 };
export const PATH: [number, number][] = [
  [960, 800], // 入口
  [960, 700],
  [700, 650], // 食品
  [700, 520],
  [960, 470], // 化粧品
  [1220, 470],
  [1220, 330],
  [960, 230], // 調剤
];
export const StorePlan: React.FC<{ fresh?: number; o?: number; hl?: "food" | "beauty" | "rx" | null; dark?: boolean }> = ({ fresh = 0, o = 1, hl = null, dark }) => {
  const { x, y, w, h } = STORE;
  const zone = (zx: number, zy: number, zw: number, zh: number, color: string, label: string, on: boolean) => (
    <g>
      <rect x={zx} y={zy} width={zw} height={zh} rx={10} fill={color} opacity={on ? 0.95 : 0.35} />
      <text x={zx + zw / 2} y={zy + zh / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF" opacity={on ? 1 : 0.8}>
        {label}
      </text>
    </g>
  );
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={dark ? "#1F2A3A" : P.floor} stroke={dark ? "#3B4B68" : "#9FB3C8"} strokeWidth={6} />
      <rect x={x + w / 2 - 80} y={y + h - 6} width={160} height={12} fill={dark ? "#0E1320" : "#FFFFFF"} />
      <text x={x + w / 2} y={y + h + 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={dark ? "#C9D6E6" : K.inkSoft}>
        入口
      </text>
      {zone(x + 40, y + h - 220, 260, 170, P.food, "食品", hl === null || hl === "food")}
      {zone(x + w - 300, y + h - 220, 260, 170, P.food, "食品", hl === null || hl === "food")}
      {zone(x + 180, y + 250, w - 360, 110, P.beauty, "化粧品・薬", hl === null || hl === "beauty")}
      {zone(x + 220, y + 30, w - 440, 110, P.rx, "調剤", hl === null || hl === "rx")}
      {fresh > 0 && (
        <g opacity={fresh}>
          <rect x={x + 40} y={y + 30} width={150} height={320} rx={10} fill={P.green} />
          <text x={x + 115} y={y + 190} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#FFFFFF" style={{ writingMode: "vertical-rl" }}>
            青果・精肉・惣菜
          </text>
        </g>
      )}
    </g>
  );
};
/** 客の点。t: 0..1 で PATH 上を進む。pts を渡すと別の経路 */
export const Shopper: React.FC<{ t: number; pts?: [number, number][]; color?: string; r?: number; o?: number }> = ({ t, pts = PATH, color = P.dark, r = 18, o = 1 }) => {
  const [x, y] = along(pts, t);
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r + 8} fill={color} opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
};

/* ── 店の外観（郊外の大型店 / 駅前の小型店） ───────────────── */
export const Front: React.FC<{ x: number; y: number; s?: number; kind: "suburb" | "station" | "super"; lit?: number; o?: number }> = ({ x, y, s = 1, kind, lit = 1, o = 1 }) => {
  const w = kind === "suburb" ? 520 : kind === "super" ? 420 : 260;
  const h = kind === "station" ? 360 : 240;
  const band = kind === "super" ? "#6FA8DC" : kind === "suburb" ? P.food : P.beauty;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={lit > 0.5 ? "#F4F6F8" : "#39465A"} stroke="#0B1220" strokeWidth={4} />
      <rect x={-w / 2 - 10} y={-h - 50} width={w + 20} height={56} rx={6} fill={lit > 0.5 ? band : "#4A5568"} />
      <text y={-h - 14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF">
        {kind === "super" ? "SUPER" : "DRUG"}
      </text>
      <rect x={-w / 2 + 20} y={-h + 30} width={w - 40} height={h * 0.45} fill={lit > 0.5 ? "#DDEBF5" : "#2A3446"} />
      <rect x={-50} y={-100} width={100} height={100} fill={lit > 0.5 ? "#9FB3C8" : "#2A3446"} />
      {kind === "suburb" && (
        <g>
          <rect x={-w / 2 - 200} y={-6} width={w + 400} height={60} fill="#5E6B7D" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-w / 2 - 180 + i * 110} y={10} width={70} height={30} rx={6} fill="#C9D1DB" />
          ))}
        </g>
      )}
    </g>
  );
};

/* ── CLUE: 薬袋 ───────────────── */
export const CLUES9: Record<string, string[]> = {
  "01": ["安い卵の向こうに、", "処方箋がある。"],
  FINAL: ["安い食品で「来店」を呼び、", "薬と化粧品、", "そして保険から払われる調剤で回収する。"],
};
export const MedBag: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.back(1.3)));
  const out = ease(f, at + 12, at + 36, 0, 1, Easing.out(Easing.cubic));
  const lines = CLUES9[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(74, Math.floor(820 / maxChars));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90, fontFamily: FONT }}>
        <div style={{ position: "relative", width: 1480, height: 620, transform: `translateY(${(1 - p) * 180}px)`, opacity: Math.min(1, p * 1.5) }}>
          {/* 薬袋 */}
          <div style={{ position: "absolute", left: 0, top: 30, width: 420, height: 560, background: "#FFFFFF", border: `5px solid ${P.rx}`, borderRadius: 14, boxShadow: "0 24px 50px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", background: P.rx, color: "#FFFFFF", textAlign: "center", fontSize: 30, fontWeight: 900, letterSpacing: 10, padding: "14px 0" }}>お薬袋</div>
            <div style={{ marginTop: 40, fontSize: 26, fontWeight: 800, color: K.inkSoft, letterSpacing: 6 }}>KANENAZO</div>
            <div style={{ marginTop: 10, fontSize: 28, fontWeight: 900, color: P.rx, letterSpacing: 8 }}>CLUE</div>
            <div style={{ fontSize: final ? 76 : 150, fontWeight: 900, color: final ? P.red : K.ink, lineHeight: 1.1 }}>{final ? "FINAL" : no}</div>
            <div style={{ marginTop: "auto", marginBottom: 30, fontSize: 20, fontWeight: 800, color: K.inkSoft, letterSpacing: 4 }}>CASE #009</div>
          </div>
          {/* 説明書（文章） */}
          <div style={{ position: "absolute", left: 330 + 120 * out, top: 90, width: 1020, height: 440, background: "#FFFDF6", border: `4px solid ${final ? P.red : "#9FB3C8"}`, borderRadius: 18, boxShadow: "0 18px 36px rgba(0,0,0,0.16)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px", fontFamily: SERIF, color: "#1E2230", opacity: out }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.42, whiteSpace: "nowrap", opacity: ease(f, at + 28 + i * 8, at + 40 + i * 8) }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.55} />
      <Sfx at={at + 16} name="ding" volume={0.45} />
    </>
  );
};

/** 横棒（ラベル付き）。v: 0..1 の長さ */
export const HBar: React.FC<{ x: number; y: number; w: number; v: number; color: string; label: string; value: string; o?: number; h?: number }> = ({ x, y, w, v, color, label, value, o = 1, h = 80 }) => (
  <g opacity={o}>
    <text x={x - 20} y={y + h / 2} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
      {label}
    </text>
    <rect x={x} y={y} width={w} height={h} rx={12} fill="#E8EBF0" />
    <rect x={x} y={y} width={w * v} height={h} rx={12} fill={color} />
    <text x={x + w * v + 16} y={y + h / 2} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={color}>
      {value}
    </text>
  </g>
);

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
