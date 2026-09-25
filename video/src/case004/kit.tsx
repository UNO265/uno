/**
 * CASE #004「コインランドリー、人がいないのになぜ儲かる？」の画面部品。
 * CASE #010 までは実写を使わない（v3 0番）。主役は業務用ドラム洗濯機の丸窓（OBJECT）と、
 * 夜の街・店・地図の線画（BLUEPRINT）。CLUE は洗濯表示タグ（ケアラベル）の形。
 * 共通の骨組み（mk・字幕・EVIDENCE カードなど）は case002/ui を使う。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const T = {
  ...K,
  night: "#0C1830",
  glow: "#FFF6D8",
  window: "#BFE3F2",
  steelLight: "#D9DEE5",
  steelDark: "#8E98A6",
  bp: "#8FD3FF",
  bpSoft: "rgba(143,211,255,0.35)",
  tag: "#F7F3EA",
  lane1: "#4F9BD8", // 一回ごと（水・電気・ガス・洗剤）
  lane2: "#E0A23A", // 来ても来なくても（家賃・清掃・点検…）
  lane3: "#8C6BC8", // 設備
};

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ── ドラムの中の洗濯物（回る） ───────────────── */
const Laundry: React.FC<{ r: number; turn: number; wet?: boolean }> = ({ r, turn, wet }) => (
  <g transform={`rotate(${turn})`}>
    {Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2;
      const rr = r * (0.35 + rnd(i) * 0.4);
      const colors = ["#E86A5B", "#F2C94C", "#6FA8DC", "#FFFFFF", "#9BCB8F", "#C9A0DC", "#F4A261"];
      return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr + r * 0.25} rx={r * 0.32} ry={r * 0.18} fill={colors[i]} opacity={wet ? 0.8 : 0.95} transform={`rotate(${i * 40} ${Math.cos(a) * rr} ${Math.sin(a) * rr})`} />;
    })}
  </g>
);

/** 業務用ドラム洗濯機（正面）。spin: 回転速度（0 で停止） */
export const Washer: React.FC<{ x: number; y: number; s?: number; spin?: number; lit?: boolean; label?: string; o?: number; dryer?: boolean }> = ({
  x,
  y,
  s = 1,
  spin = 1,
  lit = true,
  label,
  o = 1,
  dryer,
}) => {
  const f = useCurrentFrame();
  const turn = f * 9 * spin;
  const r = 118;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-190} y={-250} width={380} height={500} rx={26} fill={T.steelLight} stroke="#5E6878" strokeWidth={6} />
      <rect x={-190} y={-250} width={380} height={90} rx={26} fill="#C4CBD5" stroke="#5E6878" strokeWidth={6} />
      <rect x={-150} y={-225} width={120} height={40} rx={8} fill={lit ? "#1E2A3A" : "#3A4250"} />
      <text x={-90} y={-198} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={lit ? "#7CFFB2" : "#6B7380"}>
        {lit ? (spin > 0 ? "▶ 運転中" : "空き") : "--"}
      </text>
      <rect x={60} y={-222} width={90} height={34} rx={6} fill="#8E98A6" />
      <rect x={70} y={-214} width={50} height={8} rx={4} fill="#2A3240" />
      {label && (
        <text x={0} y={225} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#3A4250" letterSpacing={3}>
          {label}
        </text>
      )}
      <circle cx={0} cy={40} r={r + 34} fill="#B4BCC7" stroke="#5E6878" strokeWidth={6} />
      <circle cx={0} cy={40} r={r} fill={dryer ? "#2A2230" : "#1D3550"} />
      <g transform="translate(0 40)">
        <clipPath id="drumclip">
          <circle r={r - 6} />
        </clipPath>
        <g clipPath="url(#drumclip)">
          {!dryer && <rect x={-r} y={r * 0.15} width={r * 2} height={r} fill="#5FA8D3" opacity={0.55} />}
          <Laundry r={r} turn={turn} wet={!dryer} />
          {!dryer &&
            Array.from({ length: 6 }, (_, i) => (
              <circle key={i} cx={Math.cos(i + f / 12) * r * 0.6} cy={Math.sin(i * 2 + f / 10) * r * 0.5} r={6 + (i % 3) * 3} fill="#FFFFFF" opacity={0.35 * (spin > 0 ? 1 : 0)} />
            ))}
        </g>
        <circle r={r - 6} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={10} strokeDasharray="60 400" transform="rotate(-40)" />
      </g>
    </g>
  );
};

/** 乾燥機（2段。上下どちらも丸窓） */
export const Dryer: React.FC<{ x: number; y: number; s?: number; spin?: number; o?: number }> = ({ x, y, s = 1, spin = 1, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-170} y={-300} width={340} height={600} rx={22} fill={T.steelLight} stroke="#5E6878" strokeWidth={6} />
      {[-150, 150].map((cy, i) => (
        <g key={i} transform={`translate(0 ${cy})`}>
          <circle r={112} fill="#B4BCC7" stroke="#5E6878" strokeWidth={6} />
          <circle r={86} fill="#2A2230" />
          <clipPath id={`dry${i}`}>
            <circle r={80} />
          </clipPath>
          <g clipPath={`url(#dry${i})`}>
            <Laundry r={86} turn={f * 7 * spin + i * 70} />
          </g>
        </g>
      ))}
    </g>
  );
};

/** 家庭用のたて型洗濯機（家の中） */
export const HomeWasher: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-150} y={-190} width={300} height={380} rx={24} fill="#FFFFFF" stroke="#7A8494" strokeWidth={6} />
    <rect x={-150} y={-190} width={300} height={70} rx={24} fill="#EEF1F5" stroke="#7A8494" strokeWidth={6} />
    <circle cx={90} cy={-155} r={16} fill="#6FA8DC" />
    <rect x={-120} y={-168} width={130} height={26} rx={6} fill="#C9D3DE" />
    <rect x={-110} y={-100} width={220} height={40} rx={10} fill="#E3E8EE" />
  </g>
);

/** 硬貨（100円玉風。文字は「¥」だけ） */
export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number; rot?: number }> = ({ x, y, r = 40, o = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${Math.cos(rot)} 1)`} opacity={o}>
    <circle r={r} fill="#D9DCE0" stroke="#8E949C" strokeWidth={r * 0.12} />
    <circle r={r * 0.72} fill="none" stroke="#A7ADB5" strokeWidth={r * 0.05} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r * 0.9} fill="#6E747C">
      ¥
    </text>
  </g>
);

/** 夜の街の中の、明るいコインランドリー（線画）。lit: 窓の明るさ、inside: 中の機械の見え方 */
export const NightStore: React.FC<{ at?: number; lit?: number; inside?: number; people?: number; x?: number; y?: number; s?: number }> = ({
  at = 0,
  lit = 1,
  inside = 1,
  people = 0,
  x = 960,
  y = 540,
  s = 1,
}) => {
  const f = useCurrentFrame();
  const draw = ease(f, at, at + 30, 0, 1, Easing.inOut(Easing.cubic));
  const L = 6000;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* 街並み */}
      <path
        d="M -960 280 L 960 280 M -900 280 L -900 -60 L -700 -60 L -700 280 M -660 280 L -660 -160 L -480 -160 L -480 280 M 480 280 L 480 -120 L 660 -120 L 660 280 M 700 280 L 700 -20 L 900 -20 L 900 280"
        fill="none"
        stroke={T.bp}
        strokeWidth={4}
        strokeDasharray={L}
        strokeDashoffset={L * (1 - draw)}
        opacity={0.55}
      />
      {[-860, -800, -620, -560, 520, 600, 740, 820].map((wx, i) => (
        <rect key={i} x={wx} y={i % 2 ? 40 : -20} width={34} height={44} fill={T.bp} opacity={0.12 + 0.1 * (i % 3)} />
      ))}
      {/* 店 */}
      <g opacity={fade(f, at + 10, 20)}>
        <rect x={-400} y={-190} width={800} height={470} fill="none" stroke={T.bp} strokeWidth={5} />
        <rect x={-400} y={-260} width={800} height={70} fill="rgba(143,211,255,0.12)" stroke={T.bp} strokeWidth={5} />
        <text x={0} y={-212} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={T.glow} letterSpacing={10} opacity={lit}>
          COIN LAUNDRY
        </text>
        <rect x={-360} y={-150} width={720} height={390} fill={T.glow} opacity={0.85 * lit} />
        <g opacity={inside}>
          {[-240, -80, 80, 240].map((mx, i) => (
            <Washer key={i} x={mx} y={70} s={0.36} spin={i === 1 ? 0 : 1} dryer={i >= 2} />
          ))}
        </g>
        {people > 0 && (
          <g opacity={people}>
            <circle cx={-300} cy={60} r={28} fill="#3A4250" />
            <path d="M -345 170 C -345 100 -255 100 -255 170 Z" fill="#3A4250" />
          </g>
        )}
      </g>
      {/* 窓の光が道に落ちる */}
      <path d="M -360 280 L -520 420 L 520 420 L 360 280 Z" fill={T.glow} opacity={0.12 * lit} />
    </g>
  );
};

/* ── CLUE（洗濯表示タグの形） ───────────────── */
export const CLUES4: Record<string, string[]> = {
  "1": ["「人がいない店」は、", "「高価な設備に", "働いてもらう店」でもある。"],
  "2": ["重要なのは、", "機械がどれだけ「回るか」。"],
  "3": ["売っているのは、", "「時間と手間を", "減らすサービス」。"],
  "4": ["売上は、", "「選ばれて、回るかどうか」", "で決まる。"],
  FINAL: ["コインランドリーは、", "「機械で時間を売る店」", "だった。"],
};
export const CareTag: React.FC<{ no: string; at: number; y?: number }> = ({ no, at, y = 0 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 20, 0, 1, Easing.out(Easing.back(1.4)));
  const sway = Math.sin((f - at) / 14) * 2 * (1 - ease(f, at + 20, at + 70));
  const lines = CLUES4[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(72, Math.floor(740 / maxChars));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 70 + y }}>
        <div
          style={{
            width: 1160,
            background: T.tag,
            borderRadius: 10,
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            transform: `translateY(${(1 - p) * -260}px) rotate(${sway - 1}deg)`,
            opacity: Math.min(1, p * 1.5),
            display: "flex",
            fontFamily: FONT,
            position: "relative",
          }}
        >
          {/* 縫い目 */}
          <div style={{ position: "absolute", left: 16, right: 16, top: 12, bottom: 12, border: "3px dashed rgba(60,60,70,0.25)", borderRadius: 6 }} />
          <div style={{ width: 280, borderRight: "3px solid rgba(40,40,50,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: final ? K.red : K.ink }}>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 8 }}>{final ? "FINAL" : "CLUE"}</div>
            <div style={{ fontSize: final ? 76 : 124, fontWeight: 900, lineHeight: 1 }}>{final ? "CLUE" : no.padStart(2, "0")}</div>
            {/* 洗濯表示っぽい記号（たらい・四角） */}
            <svg width={150} height={60} viewBox="0 0 150 60" style={{ marginTop: 18 }}>
              <path d="M 8 14 L 18 50 L 56 50 L 66 14" fill="none" stroke="#3A4250" strokeWidth={5} />
              <path d="M 4 14 Q 20 4 36 14 T 70 14" fill="none" stroke="#3A4250" strokeWidth={5} />
              <rect x={86} y={10} width={48} height={42} fill="none" stroke="#3A4250" strokeWidth={5} />
              <circle cx={110} cy={31} r={14} fill="none" stroke="#3A4250" strokeWidth={5} />
            </svg>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, marginTop: 10, opacity: 0.7 }}>CASE #004</div>
          </div>
          <div style={{ flex: 1, padding: "50px 56px", fontFamily: SERIF, color: "#1E2230" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.4, whiteSpace: "nowrap", opacity: ease(f, at + 10 + i * 6, at + 22 + i * 6) }}>
                {l}
              </div>
            ))}
            <div style={{ marginTop: 16, fontFamily: FONT, fontSize: 22, fontWeight: 900, letterSpacing: 10, color: K.red }}>KANENAZO</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.6} />
    </>
  );
};

/* ── MONEY FLOW（三つのレーン） ───────────────── */
export const LANES = [
  { key: "a", label: "一回ごと", items: ["水道", "電気・ガス", "洗剤"], color: T.lane1 },
  { key: "b", label: "来ても来なくても", items: ["家賃", "清掃・管理", "点検・修理", "防犯・決済"], color: T.lane2 },
  { key: "c", label: "設備", items: ["洗濯機・乾燥機"], color: T.lane3 },
];

/** お金が左の硬貨から三つのレーンへ流れる。show: 各レーンの表示量(0..1)、itemAt: 各項目の出現フレーム */
export const MoneyLanes: React.FC<{ show: number[]; itemAt: number[][]; x0?: number; y0?: number; gap?: number; dim?: number }> = ({
  show,
  itemAt,
  x0 = 360,
  y0 = 230,
  gap = 210,
  dim = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <g opacity={1 - dim * 0.6}>
      <Coin x={x0 - 150} y={y0 + gap} r={70} />
      {LANES.map((ln, i) => {
        const y = y0 + i * gap;
        const o = show[i] ?? 0;
        if (o <= 0) return null;
        return (
          <g key={ln.key} opacity={o}>
            <path d={`M ${x0 - 80} ${y0 + gap} C ${x0 + 20} ${y0 + gap} ${x0 + 20} ${y} ${x0 + 120} ${y}`} fill="none" stroke={ln.color} strokeWidth={12} strokeDasharray="26 20" strokeDashoffset={-f * 3} />
            <rect x={x0 + 130} y={y - 46} width={330} height={92} rx={46} fill={ln.color} />
            <text x={x0 + 295} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={i === 1 ? 36 : 42} fill="#FFFFFF">
              {ln.label}
            </text>
            {ln.items.map((it, j) => {
              const at = itemAt[i]?.[j] ?? 0;
              const p = pop(f, at);
              return (
                <g key={j} transform={`translate(${x0 + 560 + j * 250} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
                  <rect x={-112} y={-38} width={224} height={76} rx={14} fill="#FFFFFF" stroke={ln.color} strokeWidth={5} />
                  <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={it.length > 5 ? 30 : 36} fill={K.ink}>
                    {it}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/* ── 人のアイコン（顔なし） ───────────────── */
export const Figure: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = K.ink, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-90} r={40} fill={color} />
    <path d="M -70 60 C -70 -30 70 -30 70 60 Z" fill={color} />
  </g>
);

/** 時計（針が回る） */
export const Clock: React.FC<{ x: number; y: number; r?: number; speed?: number; color?: string }> = ({ x, y, r = 80, speed = 1, color = K.ink }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#FFFFFF" stroke={color} strokeWidth={8} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.55} stroke={color} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 0.5 * speed})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.8} stroke={K.red} strokeWidth={5} strokeLinecap="round" transform={`rotate(${f * 6 * speed})`} />
      <circle r={8} fill={color} />
    </g>
  );
};

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
