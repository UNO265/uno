/**
 * CASE #008「自販機、なぜ減っても値上げ？」の画面部品。
 * CASE #010 までは実写を使わない。主役は自販機の正面（見本の窓・LED の値段・取り出し口）、
 * 夜の街に並ぶ自販機（灯り = 動いている 1 台、消える = 撤去）、CLUE はボタンを押すと落ちてくる缶。
 * 実在の飲料会社のロゴ・自販機のデザイン・商品パッケージは描かない（無地の缶・ボトルの線画だけ）。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const V = {
  ...K,
  red: "#D9434B",
  led: "#FF4A3D",
  ledOff: "#4A1E1E",
  night: "#0D1628",
  street: "#18243A",
  body: "#EEF1F5",
  band: "#1F7A8C",
  glass: "#1B2433",
  dark: "#2A3446",
  lit: "#FFF4D6",
  coin: "#E9C46A",
  blue: "#3E7FC1",
  green: "#3CAF7C",
  cost: "#7A8699",
};
const CANS = ["#E07A5F", "#81B29A", "#F2CC8F", "#3D5A80", "#E5989B", "#98C1D9", "#B5838D", "#6D9DC5", "#F4A261", "#9CC5A1", "#E9C46A", "#A8DADC"];

/** LED の値段（赤い 7 セグ風の数字） */
export const Led: React.FC<{ x: number; y: number; text: string; size?: number; o?: number; w?: number }> = ({ x, y, text, size = 40, o = 1, w }) => {
  const width = w ?? [...text].length * size * 0.62 + size * 0.6;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-width / 2} y={-size * 0.72} width={width} height={size * 1.44} rx={size * 0.18} fill="#140808" stroke="#3A1A1A" strokeWidth={size * 0.06} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={size} fill={V.led} style={{ filter: "drop-shadow(0 0 6px rgba(255,74,61,0.7))" }}>
        {text}
      </text>
    </g>
  );
};

/** 無地の缶・ボトル（見本） */
export const Can: React.FC<{ x: number; y: number; color: string; s?: number; bottle?: boolean; o?: number; r?: number }> = ({ x, y, color, s = 1, bottle, o = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    {bottle ? (
      <>
        <rect x={-10} y={-78} width={20} height={12} rx={3} fill="#DDE3EA" />
        <path d="M -10 -66 C -10 -52 -24 -46 -24 -30 L -24 34 C -24 40 -20 44 -14 44 L 14 44 C 20 44 24 40 24 34 L 24 -30 C 24 -46 10 -52 10 -66 Z" fill="rgba(210,235,245,0.85)" stroke="#9FB3C8" strokeWidth={2} />
        <rect x={-24} y={-8} width={48} height={26} fill={color} />
      </>
    ) : (
      <>
        <rect x={-22} y={-40} width={44} height={84} rx={8} fill={color} />
        <rect x={-22} y={-40} width={44} height={9} rx={4} fill="#C9D1DB" />
        <rect x={-22} y={35} width={44} height={9} rx={4} fill="#C9D1DB" />
        <rect x={-14} y={-18} width={28} height={30} rx={4} fill="rgba(255,255,255,0.35)" />
      </>
    )}
  </g>
);

/**
 * 自販機の正面。x, y は下端の中心。
 * lit: 0 = 灯りが消えたシルエット, 1 = 点灯。pressed: 押されたボタン（0..11）。led: 右の小窓の表示。
 * drop: 0..1 取り出し口にボトルが落ちる。prices: 12 個のボタンの値段。
 */
export const Machine: React.FC<{
  x: number;
  y: number;
  s?: number;
  lit?: number;
  prices?: string[];
  pressed?: number;
  led?: string;
  drop?: number;
  o?: number;
  tag?: string;
  free?: boolean;
}> = ({ x, y, s = 1, lit = 1, prices, pressed = -1, led, drop = 0, o = 1, tag, free }) => {
  const P = prices ?? Array.from({ length: 12 }, (_, i) => (i % 3 === 0 ? "200" : i % 3 === 1 ? "180" : "160"));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {/* 灯りのにじみ */}
      <ellipse cx={0} cy={-360} rx={330} ry={440} fill={V.lit} opacity={0.12 * lit} />
      <rect x={-190} y={-720} width={380} height={720} rx={18} fill={lit > 0.02 ? V.body : "#1C2433"} stroke="#0B1220" strokeWidth={6} />
      <rect x={-190} y={-720} width={380} height={62} rx={18} fill={lit > 0.02 ? V.band : "#232D40"} />
      <text x={0} y={-680} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#FFFFFF" letterSpacing={6} opacity={lit}>
        つめた〜い
      </text>
      {/* 見本の窓 */}
      <rect x={-170} y={-640} width={340} height={330} rx={8} fill={V.glass} />
      {P.map((p, i) => {
        const cx = -126 + (i % 4) * 84;
        const cy = -560 + Math.floor(i / 4) * 106;
        return (
          <g key={i} opacity={lit > 0.02 ? 1 : 0.18}>
            <Can x={cx} y={cy} color={CANS[i % CANS.length]} s={0.72} bottle={i % 2 === 1} />
            <rect x={cx - 34} y={cy + 36} width={68} height={24} rx={4} fill={i === pressed ? V.led : "#140808"} />
            <text x={cx} y={cy + 49} textAnchor="middle" dominantBaseline="central" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={free ? 16 : 19} fill={i === pressed ? "#FFFFFF" : V.led}>
              {free ? "0" : p}
            </text>
          </g>
        );
      })}
      {/* 窓の反射 */}
      <path d="M -160 -630 L -80 -630 L -150 -330 L -165 -330 Z" fill="#FFFFFF" opacity={0.06 * lit} />
      {/* お金の入口 */}
      <rect x={-170} y={-296} width={340} height={150} rx={8} fill={lit > 0.02 ? "#DDE3EA" : "#232D40"} />
      <rect x={70} y={-270} width={70} height={16} rx={6} fill="#0B1220" />
      <rect x={82} y={-222} width={46} height={46} rx={8} fill="#8A96A8" />
      {led !== undefined && <Led x={-60} y={-222} text={led} size={46} w={180} o={lit > 0.02 ? 1 : 0.2} />}
      {/* 取り出し口 */}
      <rect x={-150} y={-120} width={300} height={78} rx={10} fill="#0B1220" />
      {drop > 0 && (
        <g>
          <clipPath id={`slot${Math.round(x)}${Math.round(y)}`}>
            <rect x={-150} y={-120} width={300} height={78} rx={10} />
          </clipPath>
          <g clipPath={`url(#slot${Math.round(x)}${Math.round(y)})`}>
            <Can x={-20 + 40 * drop} y={-150 + 90 * Math.min(1, drop * 1.3)} color={CANS[1]} s={0.72} bottle r={90 * drop} />
          </g>
        </g>
      )}
      {tag && (
        <g transform="translate(120 -420) rotate(12)">
          <rect x={-90} y={-36} width={180} height={72} rx={10} fill="#FFFFFF" stroke={V.red} strokeWidth={6} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={V.red}>
            {tag}
          </text>
        </g>
      )}
    </g>
  );
};

/** 小さな自販機（街の列・格子用）。lit 0..1 */
export const Mini: React.FC<{ x: number; y: number; s?: number; lit?: number; color?: string }> = ({ x, y, s = 1, lit = 1, color }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit > 0.02 && <ellipse cx={0} cy={-60} rx={70} ry={90} fill={V.lit} opacity={0.14 * lit} />}
    <rect x={-40} y={-140} width={80} height={140} rx={6} fill={lit > 0.02 ? color ?? V.body : "#1C2433"} stroke="#0B1220" strokeWidth={3} opacity={0.35 + 0.65 * Math.max(lit, 0.3)} />
    <rect x={-32} y={-126} width={64} height={62} rx={3} fill={lit > 0.02 ? V.glass : "#141B28"} />
    {lit > 0.02 &&
      [0, 1, 2].map((i) => <rect key={i} x={-26 + i * 20} y={-116} width={12} height={20} rx={3} fill={CANS[i + 2]} opacity={lit} />)}
    <rect x={-28} y={-26} width={56} height={14} rx={3} fill="#0B1220" />
  </g>
);

/** 夜の街に並ぶ自販機。n 台のうち on 台が灯る（order で消える順をばらす） */
export const Street: React.FC<{ n: number; on: number; y?: number; s?: number; x0?: number; x1?: number }> = ({ n, on, y = 760, s = 1, x0 = 120, x1 = 1800 }) => (
  <g>
    <rect x={0} y={y} width={1920} height={1080 - y} fill={V.street} />
    <line x1={0} x2={1920} y1={y} y2={y} stroke="#2E3C57" strokeWidth={4} />
    {Array.from({ length: n }, (_, i) => {
      const order = (i * 7 + 3) % n;
      const lit = Math.max(0, Math.min(1, on - order));
      return <Mini key={i} x={x0 + ((x1 - x0) * i) / Math.max(1, n - 1)} y={y} s={s} lit={lit} />;
    })}
  </g>
);

/** 1 台の家計簿（横に積む帯）。parts の w は合計 1 に対する割合 */
export type Part8 = { label: string; w: number; at: number; color: string };
export const Ledger: React.FC<{ x: number; y: number; w: number; h?: number; parts: Part8[]; total?: string; note?: string }> = ({ x, y, w, h = 120, parts, total, note }) => {
  const f = useCurrentFrame();
  let acc = 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={14} fill="#E8EBF0" />
      {parts.map((p, i) => {
        const x0 = acc * w;
        acc += p.w;
        const g = ease(f, p.at, p.at + 16, 0, 1, Easing.out(Easing.cubic));
        return (
          <g key={i} opacity={g}>
            <rect x={x0 + 3} y={3} width={p.w * w * g - 6} height={h - 6} rx={10} fill={p.color} />
            <text x={x0 + (p.w * w) / 2} y={h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={p.w * w > 300 ? 38 : 30} fill="#FFFFFF">
              {p.label}
            </text>
          </g>
        );
      })}
      {total && (
        <text x={w / 2} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
          {total}
        </text>
      )}
      {note && (
        <text x={w} y={h + 44} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft}>
          {note}
        </text>
      )}
    </g>
  );
};

/* ── CLUE: ボタンを押すと落ちてくる缶。缶の胴に文章 ───────────────── */
export const CLUES8: Record<string, string[]> = {
  "01": ["値段は、原材料だけでなく", "「1台が売る本数」で決まる。"],
  "02": ["台数で稼ぐ仕組みが、", "今は、逆に回っている。"],
  FINAL: ["定価の店を台数で増やす商売が、", "逆に回り始めた。", "値上げは、その重さを1本にのせた値段。"],
};
export const CanClue: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const press = f >= at ? 1 : 0;
  const drop = ease(f, at + 4, at + 22, 0, 1, Easing.bounce);
  const roll = ease(f, at + 20, at + 40, 0, 1, Easing.out(Easing.cubic));
  const lines = CLUES8[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(76, Math.floor(1000 / maxChars));
  const band = final ? V.red : V.band;
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90, fontFamily: FONT }}>
        <div style={{ position: "relative", width: 1600, height: 620 }}>
          {/* ボタン */}
          <div style={{ position: "absolute", left: 0, top: 150, width: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: fade(f, at - 8) }}>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 8, color: K.inkSoft }}>CLUE</div>
            <div
              style={{
                marginTop: 14,
                width: 220,
                height: 120,
                borderRadius: 20,
                background: press ? V.led : "#140808",
                color: press ? "#FFFFFF" : V.led,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'DejaVu Sans Mono', monospace",
                fontSize: final ? 50 : 76,
                fontWeight: 700,
                boxShadow: press ? "0 0 30px rgba(255,74,61,0.6)" : "none",
                transform: `scale(${press ? 0.95 : 1})`,
              }}
            >
              {final ? "FINAL" : no}
            </div>
            <div style={{ marginTop: 20, fontSize: 20, fontWeight: 800, letterSpacing: 4, color: K.inkSoft }}>CASE #008</div>
          </div>
          {/* 缶（横倒しで転がり、胴に文章） */}
          <div
            style={{
              position: "absolute",
              left: 300 + 30 * (1 - roll),
              top: -260 + 400 * drop,
              width: 1280,
              height: 440,
              borderRadius: 60,
              background: "#FFFFFF",
              border: `6px solid ${band}`,
              boxShadow: "0 24px 50px rgba(0,0,0,0.22)",
              overflow: "hidden",
              display: "flex",
              opacity: Math.min(1, drop * 2),
            }}
          >
            <div style={{ width: 46, background: "linear-gradient(90deg,#B9C2CE,#E6EAF0,#B9C2CE)" }} />
            <div style={{ width: 22, background: band }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 50px", fontFamily: SERIF, color: "#1E2230" }}>
              {lines.map((l, i) => (
                <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.4, whiteSpace: "nowrap", opacity: ease(f, at + 30 + i * 8, at + 42 + i * 8) }}>
                  {l}
                </div>
              ))}
            </div>
            <div style={{ width: 22, background: band }} />
            <div style={{ width: 46, background: "linear-gradient(90deg,#B9C2CE,#E6EAF0,#B9C2CE)" }} />
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="tok" volume={0.5} />
      <Sfx at={at + 12} name="thud" volume={0.55} />
      <Sfx at={at + 26} name="ding" volume={0.45} />
    </>
  );
};

/** 決算カード */
export type DRow = { k: string; v: string; at: number; color?: string; big?: boolean; sub?: string };
export const Doc: React.FC<{ x: number; y: number; w?: number; title: string; rows: DRow[]; o?: number }> = ({ x, y, w = 820, title, rows, o = 1 }) => {
  const f = useCurrentFrame();
  const h = 110 + rows.reduce((a, r) => a + (r.big ? 110 : 82), 0);
  let yy = 110;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={0} y={0} width={w} height={h} rx={14} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
      <text x={36} y={62} fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
        {title}
      </text>
      <line x1={36} x2={w - 36} y1={86} y2={86} stroke={K.ink} strokeWidth={3} />
      {rows.map((r, i) => {
        const rh = r.big ? 110 : 82;
        const cy = yy + rh / 2;
        yy += rh;
        return (
          <g key={i} opacity={fade(f, r.at)}>
            <text x={36} y={cy} dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
              {r.k}
            </text>
            <text x={w - 36} y={cy} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r.big ? 72 : 46} fill={r.color ?? K.ink}>
              {r.v}
            </text>
            {i < rows.length - 1 && <line x1={36} x2={w - 36} y1={yy} y2={yy} stroke="#E4DED2" strokeWidth={2} />}
          </g>
        );
      })}
    </g>
  );
};

/** 錠前 */
export const Lock: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -34 -10 L -34 -40 A 34 34 0 0 1 34 -40 L 34 -10" fill="none" stroke={K.ink} strokeWidth={12} />
    <rect x={-52} y={-12} width={104} height={80} rx={12} fill={K.ink} />
    <circle cy={24} r={10} fill="#FCFBF8" />
  </g>
);

/** 人（線画） */
export const Walker: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = "#C9D6E6", o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-150} r={22} fill={color} />
    <path d="M -26 -120 L 26 -120 L 20 -40 L -20 -40 Z" fill={color} />
    <rect x={-18} y={-42} width={14} height={42} rx={6} fill={color} />
    <rect x={4} y={-42} width={14} height={42} rx={6} fill={color} />
  </g>
);

/** 補充のトラック */
export const Truck: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number; flip?: boolean }> = ({ x, y, s = 1, color = V.band, o = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={o}>
    <rect x={-120} y={-110} width={170} height={90} rx={8} fill={color} />
    <path d="M 50 -80 L 100 -80 L 124 -48 L 124 -20 L 50 -20 Z" fill="#DDE3EA" stroke="#0B1220" strokeWidth={3} />
    <circle cx={-80} cy={-16} r={18} fill="#0B1220" />
    <circle cx={80} cy={-16} r={18} fill="#0B1220" />
    <rect x={-108} y={-96} width={60} height={30} rx={4} fill="rgba(255,255,255,0.3)" />
  </g>
);

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
