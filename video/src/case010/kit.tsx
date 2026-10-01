/**
 * CASE #010「コンビニ、なぜ値引きせず捨てる？」の画面部品（06 DIRECTION）。
 * 主役はおにぎりと弁当、繰り返す仕組みは「二つの皿」（左 = 本部・青 / 右 = 店・オレンジ）。
 * 売れた利益は二つの皿に分かれ、捨てた仕入れ値は灰色の硬貨になって皿から出ていく。
 * 夜の棚（正面）は 001 → 014 → 028 → 037 で同じアングルに戻る。CLUE はレシート。
 * 実写なし（C5）。実在の店のロゴ・商品パッケージ・各社のシールのデザインは描かない（会社名は文字だけ、シールは自前の絵 ※イメージ）。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const P = {
  ...K,
  hq: "#2F7BD8",
  store: "#F28C28",
  waste: "#8A94A3",
  sticker: "#F5C431",
  green: "#3CAF7C",
  red: "#D9434B",
  night: "#0E1626",
  shelf: "#E9EEF4",
  dark: "#16202E",
  coin: "#E9C46A",
};
export const MONO = "'DejaVu Sans Mono', monospace";

/* ── 小物 ───────────────── */
export const Onigiri: React.FC<{ x: number; y: number; s?: number; o?: number; sad?: boolean; gray?: boolean }> = ({ x, y, s = 1, o = 1, sad, gray }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M 0 -46 Q 10 -46 44 22 Q 50 40 30 40 L -30 40 Q -50 40 -44 22 Q -10 -46 0 -46 Z" fill={gray ? "#B8C0CC" : "#FFFFFF"} stroke={gray ? "#7D8796" : "#C9D1DB"} strokeWidth={3} />
    <rect x={-24} y={8} width={48} height={32} rx={3} fill={gray ? "#5E6B7D" : "#1F2A22"} />
    {sad && (
      <g>
        <circle cx={-14} cy={-6} r={6} fill="#1E2230" />
        <circle cx={14} cy={-6} r={6} fill="#1E2230" />
        <circle cx={-12} cy={-9} r={2.2} fill="#FFFFFF" />
        <circle cx={16} cy={-9} r={2.2} fill="#FFFFFF" />
        <path d="M -16 4 Q -20 14 -16 16" fill="none" stroke="#6FA8DC" strokeWidth={3} strokeLinecap="round" />
        <path d="M -6 2 Q 0 -2 6 2" fill="none" stroke="#1E2230" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    )}
  </g>
);
export const Bento: React.FC<{ x: number; y: number; s?: number; o?: number; gray?: boolean }> = ({ x, y, s = 1, o = 1, gray }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-60} y={-34} width={120} height={68} rx={8} fill={gray ? "#9AA3AF" : "#2A2F3A"} />
    <rect x={-54} y={-28} width={64} height={56} rx={4} fill={gray ? "#D5DAE1" : "#FFFFFF"} />
    <rect x={14} y={-28} width={40} height={26} rx={4} fill={gray ? "#B8C0CC" : "#E8B96A"} />
    <rect x={14} y={2} width={40} height={26} rx={4} fill={gray ? "#AEB6C2" : "#7BB661"} />
    <circle cx={-22} cy={0} r={8} fill={gray ? "#B8C0CC" : "#D9434B"} />
  </g>
);
/** 値引きシール（自前の絵）。kind: yellow = 一般 / green = セブン-イレブン（※イメージ） */
export const Sticker: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; color?: string; r?: number }> = ({ x, y, text, s = 1, o = 1, color = P.sticker, r = -8 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <circle r={46} fill={color} stroke="#FFFFFF" strokeWidth={4} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={text.length > 3 ? 24 : 30} fill={color === P.sticker ? "#5A3E00" : "#FFFFFF"}>
      {text}
    </text>
  </g>
);
export const TrashBag: React.FC<{ x: number; y: number; s?: number; o?: number; fill?: number }> = ({ x, y, s = 1, o = 1, fill = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -90 -60 Q -120 60 -70 110 L 70 110 Q 120 60 90 -60 Z" fill="rgba(220,230,240,0.55)" stroke="#9FB3C8" strokeWidth={4} />
    <path d="M -20 -60 L 0 -96 L 20 -60" fill="none" stroke="#9FB3C8" strokeWidth={6} />
    {fill > 0.2 && <Bento x={-30} y={60} s={0.6} gray />}
    {fill > 0.5 && <Onigiri x={36} y={50} s={0.6} gray />}
    {fill > 0.8 && <Bento x={6} y={6} s={0.55} gray />}
  </g>
);
export const Coin10: React.FC<{ x: number; y: number; r?: number; o?: number; label?: string; gray?: boolean; color?: string }> = ({ x, y, r = 22, o = 1, label, gray, color }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r} fill={gray ? "#B8C0CC" : color ?? P.coin} stroke={gray ? "#7D8796" : "#B8902A"} strokeWidth={r * 0.14} />
    {label && (
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r * 0.7} fill={gray ? "#3B4452" : "#7A5A10"}>
        {label}
      </text>
    )}
  </g>
);
export const Clock: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; dark?: boolean; color?: string }> = ({ x, y, text, s = 1, o = 1, dark = true, color }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-120} y={-48} width={240} height={96} rx={14} fill={dark ? "#0B1220" : "#FFFFFF"} stroke={dark ? "#3B4B68" : "#C9D1DB"} strokeWidth={4} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={MONO} fontWeight={700} fontSize={56} fill={color ?? (dark ? "#7FE0A8" : K.ink)}>
      {text}
    </text>
  </g>
);

/* ── 夜の棚（正面）。n: 並んでいるおにぎりの数（最大 12）、stickers: シールを貼る位置 ───────────────── */
export const SHELF = { x: 360, y: 230, w: 1200, h: 560 };
export const slot = (i: number): [number, number] => [SHELF.x + 110 + (i % 6) * 196, SHELF.y + 190 + Math.floor(i / 6) * 230];
export const NightShelf: React.FC<{ n?: number; bento?: number; stickers?: { i: number; text: string; o: number; color?: string }[]; window?: boolean; price?: string; children?: React.ReactNode; dim?: number }> = ({
  n = 12,
  bento = 0,
  stickers = [],
  window = true,
  price,
  children,
  dim = 0,
}) => {
  const { x, y, w, h } = SHELF;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill={P.night} />
      {window && (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={60 + i * 610} y={40} width={580} height={140} fill="#13213A" stroke="#22314F" strokeWidth={4} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={200 + i * 380} cy={110} r={4} fill="#FFE9B0" opacity={0.5} />
          ))}
        </g>
      )}
      <rect x={x - 20} y={y - 20} width={w + 40} height={h + 40} rx={10} fill="#1B2638" />
      <rect x={x} y={y} width={w} height={h} fill={P.shelf} />
      <rect x={x} y={y} width={w} height={30} fill="#FFFFFF" opacity={0.9} />
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={x} y={y + 250 + r * 230} width={w} height={22} fill="#C9D1DB" />
          <rect x={x + 30} y={y + 252 + r * 230} width={140} height={18} rx={3} fill="#FFFFFF" />
          {price && (
            <text x={x + 100} y={y + 262 + r * 230} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={16} fill={K.ink}>
              {price}
            </text>
          )}
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const [sx, sy] = slot(i);
        if (i < bento) return <Bento key={i} x={sx} y={sy + 10} s={1.2} />;
        return i < n ? <Onigiri key={i} x={sx} y={sy} s={1.4} /> : null;
      })}
      {stickers.map((st) => {
        const [sx, sy] = slot(st.i);
        return <Sticker key={st.i} x={sx + 34} y={sy - 30} text={st.text} s={0.8 * Math.min(1, st.o * 1.4)} o={Math.min(1, st.o * 2)} color={st.color} />;
      })}
      {children}
      {dim > 0 && <rect x={0} y={0} width={1920} height={1080} fill="#000000" opacity={dim} />}
    </g>
  );
};

/* ── 二つの皿（本部 = 青 / 店 = オレンジ）。値の符号で皿が上下し、数字を出す ───────────────── */
export const Plates: React.FC<{
  hq: number | null;
  store: number | null;
  x?: number;
  y?: number;
  s?: number;
  o?: number;
  k?: number;
  fmt?: (v: number) => string;
  hqO?: number;
  storeO?: number;
}> = ({ hq, store, x = 960, y = 640, s = 1, o = 1, k = 1.1, fmt = (v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v))}円`, hqO = 1, storeO = 1 }) => {
  const one = (cx: number, v: number | null, color: string, label: string, oo: number) => {
    const dy = v === null ? 0 : Math.max(-180, Math.min(180, -v * k));
    return (
      <g opacity={oo}>
        <line x1={cx} y1={0} x2={cx} y2={dy} stroke={color} strokeWidth={6} opacity={0.5} />
        <g transform={`translate(${cx} ${dy})`}>
          <ellipse cx={0} cy={0} rx={150} ry={34} fill="#FFFFFF" stroke={color} strokeWidth={8} />
          <ellipse cx={0} cy={-6} rx={110} ry={18} fill={color} opacity={0.18} />
          {v !== null && (
            <text y={-58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={v < 0 ? P.red : color}>
              {fmt(v)}
            </text>
          )}
        </g>
        <text x={cx} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={color}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <line x1={-480} y1={0} x2={480} y2={0} stroke="#9FB3C8" strokeWidth={3} strokeDasharray="10 10" />
      <text x={-500} y={0} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={24} fill="#9FB3C8">
        0
      </text>
      {one(-260, hq, P.hq, "本部", hqO)}
      {one(260, store, P.store, "店", storeO)}
    </g>
  );
};

/* ── 書類（契約書・判決・命令） ───────────────── */
export const Doc: React.FC<{ x: number; y: number; w?: number; h?: number; title: string; s?: number; o?: number; rot?: number; color?: string; children?: React.ReactNode; dust?: number }> = ({
  x,
  y,
  w = 520,
  h = 640,
  title,
  s = 1,
  o = 1,
  rot = 0,
  color = K.ink,
  children,
  dust = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-w / 2 + 12} y={-h / 2 + 14} width={w} height={h} fill="rgba(0,0,0,0.18)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FFFDF6" stroke="#D8D2C6" strokeWidth={3} />
    <text y={-h / 2 + 70} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={color}>
      {title}
    </text>
    {Array.from({ length: Math.floor((h - 180) / 46) }, (_, i) => (
      <rect key={i} x={-w / 2 + 50} y={-h / 2 + 120 + i * 46} width={i % 3 === 2 ? w * 0.5 : w - 100} height={12} rx={6} fill="#E3DDD0" />
    ))}
    {children}
    {dust > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#B8A88A" opacity={0.35 * dust} />}
  </g>
);
export const StampMark: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; color?: string }> = ({ x, y, text, s = 1, o = 1, color = P.red }) => (
  <g transform={`translate(${x} ${y}) rotate(-12) scale(${s})`} opacity={o}>
    <rect x={-110} y={-48} width={220} height={96} rx={10} fill="none" stroke={color} strokeWidth={8} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={color}>
      {text}
    </text>
  </g>
);

/* ── 本部の建物 / 店 ───────────────── */
export const HQBuilding: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-110} y={-320} width={220} height={320} fill="#DCE8F7" stroke={P.hq} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={-80 + (i % 3) * 60} y={-290 + Math.floor(i / 3) * 70} width={40} height={40} fill={P.hq} opacity={0.35} />
    ))}
    <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={P.hq}>
      本部
    </text>
  </g>
);
export const StoreFront: React.FC<{ x: number; y: number; s?: number; o?: number; lit?: number; label?: string }> = ({ x, y, s = 1, o = 1, lit = 1, label = "店" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-150} y={-200} width={300} height={200} fill={lit > 0.5 ? "#F7F2E8" : "#39465A"} stroke="#0B1220" strokeWidth={4} />
    <rect x={-160} y={-240} width={320} height={46} rx={6} fill={lit > 0.5 ? P.store : "#4A5568"} />
    <rect x={-130} y={-170} width={260} height={90} fill={lit > 0.5 ? "#FFF6DD" : "#2A3446"} />
    <rect x={-40} y={-80} width={80} height={80} fill={lit > 0.5 ? "#C9D6E6" : "#2A3446"} />
    <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={P.store}>
      {label}
    </text>
  </g>
);

/* ── CLUE: レシート ───────────────── */
export const CLUES10: Record<string, string[]> = {
  "01": ["捨てるか、値引きするか。", "決めていたのは、", "「捨てた分を、誰が払うか」。"],
  FINAL: ["捨てた値段を、誰が払うか。", "本部は棚を埋め、店は捨てた分を払ってきた。", "その負担が、本部へ動き始めている。"],
};
export const ReceiptClue: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 26, 0, 1, Easing.out(Easing.cubic));
  const lines = CLUES10[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(66, Math.floor(980 / maxChars));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT }}>
        <div style={{ width: 1180, background: "#FFFFFF", boxShadow: "0 24px 50px rgba(0,0,0,0.35)", clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, padding: "40px 70px 50px", fontFamily: MONO, color: "#1E2230" }}>
          <div style={{ textAlign: "center", fontSize: 30, fontWeight: 700, letterSpacing: 8 }}>KANENAZO ― RECEIPT</div>
          <div style={{ borderTop: "4px dashed #9AA3AF", margin: "20px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 700 }}>
            <span>CLUE</span>
            <span style={{ color: final ? P.red : K.ink }}>{final ? "FINAL" : no}</span>
          </div>
          <div style={{ borderTop: "4px dashed #9AA3AF", margin: "20px 0 26px" }} />
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: SERIF, fontSize: size, fontWeight: 900, lineHeight: 1.45, whiteSpace: "nowrap", opacity: ease(f, at + 24 + i * 10, at + 36 + i * 10) }}>
              {l}
            </div>
          ))}
          <div style={{ borderTop: "4px dashed #9AA3AF", margin: "26px 0 12px" }} />
          <div style={{ textAlign: "right", fontSize: 24, color: "#6B7280" }}>CASE #010</div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.55} />
      <Sfx at={at + 24} name="ding" volume={0.45} />
    </>
  );
};

/** 計算の注記（右下） */
export const CalcNote: React.FC<{ at?: number; text?: string }> = ({ at = 0, text = "※計算・イメージ（仕入れ80円・売値100円・利益を半分ずつ）" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: 56, top: 44, fontFamily: FONT, fontSize: 24, fontWeight: 800, color: "#9FB3C8", opacity: fade(f, at) }}>{text}</div>
  );
};

/** 横棒 */
export const HBar: React.FC<{ x: number; y: number; w: number; v: number; color: string; label: string; value: string; o?: number; h?: number; dark?: boolean }> = ({ x, y, w, v, color, label, value, o = 1, h = 70, dark }) => (
  <g opacity={o}>
    <text x={x - 20} y={y + h / 2} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={dark ? "#E8EBF0" : K.ink}>
      {label}
    </text>
    <rect x={x} y={y} width={w} height={h} rx={12} fill={dark ? "#1F2A3A" : "#E8EBF0"} />
    <rect x={x} y={y} width={Math.max(0, w * v)} height={h} rx={12} fill={color} />
    <text x={x + w * v + 16} y={y + h / 2} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={42} fill={color}>
      {value}
    </text>
  </g>
);

export const T: React.FC<{ x: number; y: number; size?: number; color?: string; o?: number; anchor?: "start" | "middle" | "end"; weight?: number; children: React.ReactNode; serif?: boolean }> = ({
  x,
  y,
  size = 40,
  color = K.ink,
  o = 1,
  anchor = "middle",
  weight = 900,
  children,
  serif,
}) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fontFamily={serif ? SERIF : FONT} fontWeight={weight} fontSize={size} fill={color} opacity={o}>
    {children}
  </text>
);

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
