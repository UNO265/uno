/**
 * CASE #006「ガチャガチャ、なぜ500円に？」の画面部品。
 * CASE #010 までは実写を使わない（v3 0番）。主役は半透明の 2 色カプセルとガチャの機械（OBJECT）、
 * CLUE は機械の前面に貼る「台紙」の形、場所は紺色の平面図（BLUEPRINT）。
 * 商標のキャラクター・商品写真は描かない（線画・一般形のカプセルだけ）。
 * 共通の骨組み（mk・字幕・EVIDENCE など）は case002/ui を使う。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const G = {
  ...K,
  red: "#E5484D",
  cap: ["#E5484D", "#F5B83D", "#3E8ED0", "#5BB974", "#B36AD8"],
  clear: "rgba(255,255,255,0.55)",
  glass: "#DDEBF5",
  navy: "#10294A",
  line: "#8FD3FF",
  body: "#E5484D",
  coin: "#F4D35E",
  hidden: "#9AA3AF",
  risk: "#8C5A2B",
};

/* ── 人のシルエット（顔なし）。grow: 0 = 子ども、1 = 大人 ───────────────── */
export const Person6: React.FC<{ x: number; y: number; s?: number; grow?: number; color?: string; o?: number }> = ({ x, y, s = 1, grow = 1, color = K.ink, o = 1 }) => {
  const h = 0.72 + 0.28 * grow;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <g transform={`scale(${0.9 + 0.1 * grow} ${h})`}>
        <path d="M -62 0 C -62 -110 62 -110 62 0 Z" fill={color} />
      </g>
      <circle cy={-110 * h - 38 + 6 * (1 - grow)} r={38 + 4 * (1 - grow)} fill={color} />
    </g>
  );
};

/* ── カプセル（上: 色、下: 透明）。who: 中のシルエット（0 = 子ども → 1 = 大人）、open: 上半分が開く ───── */
export const Capsule: React.FC<{ x: number; y: number; r?: number; color?: string; who?: number; showWho?: boolean; rot?: number; o?: number; open?: number }> = ({
  x,
  y,
  r = 80,
  color = G.cap[0],
  who = 0,
  showWho = false,
  rot = 0,
  o = 1,
  open = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <ellipse cx={0} cy={r * 1.05} rx={r * 0.9} ry={r * 0.12} fill="rgba(0,0,0,0.18)" />
    {/* 下: 透明 */}
    <path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 Z`} fill={G.clear} stroke="rgba(40,50,70,0.55)" strokeWidth={r * 0.05} />
    {showWho && (
      <g transform={`translate(0 ${r * 0.86}) scale(${r / 250})`}>
        <Person6 x={0} y={0} grow={who} color="#3B4556" />
      </g>
    )}
    <path d={`M ${-r * 0.7} ${r * 0.35} A ${r * 0.75} ${r * 0.75} 0 0 0 ${-r * 0.2} ${r * 0.72}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={r * 0.06} strokeLinecap="round" />
    {/* 上: 色 */}
    <g transform={`translate(${r} 0) rotate(${-open * 70}) translate(${-r} 0)`}>
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill={color} stroke="rgba(40,50,70,0.55)" strokeWidth={r * 0.05} />
      <path d={`M ${-r * 0.62} ${-r * 0.42} A ${r * 0.75} ${r * 0.75} 0 0 1 ${-r * 0.1} ${-r * 0.74}`} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={r * 0.08} strokeLinecap="round" />
    </g>
    <rect x={-r} y={-r * 0.04} width={r * 2} height={r * 0.08} fill="rgba(40,50,70,0.35)" />
  </g>
);

/* ── ガチャの機械（正面）。turn: ハンドルの角度、price: 値段の表示 ───────────────── */
const INSIDE = Array.from({ length: 22 }, (_, i) => ({
  x: -130 + ((i * 97) % 260),
  y: -100 - Math.floor(i / 5) * 62 - ((i * 31) % 14),
  c: G.cap[i % G.cap.length],
  r: 34 + ((i * 7) % 8),
}));
export const Machine: React.FC<{
  x: number;
  y: number;
  s?: number;
  turn?: number;
  price?: string;
  body?: string;
  empty?: number;
  o?: number;
  line?: boolean;
  soldOut?: number;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, turn = 0, price = "500円", body = G.body, empty = 0, o = 1, line = false, soldOut = 0, children }) => {
  const ink = line ? G.line : "#2B3140";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {/* ドーム */}
      <rect x={-190} y={-420} width={380} height={360} rx={40} fill={line ? "none" : G.glass} stroke={ink} strokeWidth={8} />
      {!line &&
        INSIDE.map((c, i) =>
          i / INSIDE.length < 1 - empty ? (
            <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${((i * 47) % 60) - 30})`}>
              <circle r={c.r} fill="#FFFFFF" stroke="rgba(40,50,70,0.5)" strokeWidth={3} />
              <path d={`M ${-c.r} 0 A ${c.r} ${c.r} 0 0 1 ${c.r} 0 Z`} fill={c.c} stroke="rgba(40,50,70,0.5)" strokeWidth={3} />
            </g>
          ) : null,
        )}
      <path d="M -160 -390 L -160 -120" stroke="rgba(255,255,255,0.7)" strokeWidth={14} strokeLinecap="round" opacity={line ? 0 : 1} />
      {/* 本体 */}
      <rect x={-200} y={-60} width={400} height={420} rx={24} fill={line ? "none" : body} stroke={ink} strokeWidth={8} />
      {/* 台紙の窓 */}
      <rect x={-160} y={-34} width={320} height={96} rx={10} fill={line ? "none" : "#FFFDF6"} stroke={ink} strokeWidth={5} />
      <text x={0} y={16} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={line ? G.line : K.ink}>
        {price}
      </text>
      {/* ハンドル */}
      <g transform={`translate(0 170) rotate(${turn})`}>
        <circle r={70} fill={line ? "none" : "#F4F1EA"} stroke={ink} strokeWidth={8} />
        <rect x={-18} y={-66} width={36} height={132} rx={14} fill={line ? "none" : "#C9CED8"} stroke={ink} strokeWidth={6} />
      </g>
      {/* 取り出し口 */}
      <rect x={-80} y={270} width={160} height={70} rx={14} fill={line ? "none" : "#2B3140"} stroke={ink} strokeWidth={6} />
      {soldOut > 0 && (
        <g transform={`translate(0 -240) rotate(-12) scale(${soldOut})`} opacity={Math.min(1, soldOut * 1.4)}>
          <rect x={-170} y={-50} width={340} height={100} rx={12} fill={G.red} stroke="#FFFFFF" strokeWidth={8} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#FFFFFF">
            SOLD OUT
          </text>
        </g>
      )}
      {children}
    </g>
  );
};

/* ── 台紙（CLUE カード）: 上の色帯 + ラインナップのカプセル 5 つ + 値段 ───────────────── */
export const CLUES6: Record<string, string[]> = {
  "01": ["子どもの遊び", "→ 大人の買い物"],
  "02": ["作る数は、", "先に決まっている。"],
  "03": ["500円は、", "場所と手間で", "売上を大きくする値段。"],
  FINAL: ["リスクを引き受け、", "場所と大人の「もう1回」で", "回す仕組み。"],
};
const LineupRow: React.FC<{ at: number; size?: number }> = ({ at, size = 70 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size * 5 * 1.5} height={size * 1.4} viewBox={`${-size * 1.2} ${-size * 0.7} ${size * 7.5} ${size * 1.4}`}>
      {G.cap.map((c, i) => {
        const p = pop(f, at + i * 4);
        return <Capsule key={i} x={i * size * 1.5 + size * 0.3} y={0} r={(size / 2) * p} color={c} o={Math.min(1, p * 1.5)} />;
      })}
    </svg>
  );
};
export const Daishi: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.back(1.3)));
  const lines = CLUES6[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const size = Math.min(92, Math.floor(1000 / maxChars));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
        <div
          style={{
            width: 1180,
            background: "#FFFDF6",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(0,0,0,0.28)",
            border: `6px solid ${final ? "#2B3140" : G.red}`,
            transform: `translateY(${(1 - p) * 200}px) scale(${0.9 + 0.1 * p})`,
            opacity: Math.min(1, p * 1.5),
            fontFamily: FONT,
          }}
        >
          <div style={{ background: final ? "#2B3140" : G.red, color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 40px" }}>
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 10 }}>{final ? "FINAL CLUE" : `CLUE ${no}`}</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 8, opacity: 0.85 }}>CASE #006</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 22 }}>
            <LineupRow at={at + 8} size={64} />
          </div>
          <div style={{ padding: "8px 60px 20px", fontFamily: SERIF, color: "#1E2230", textAlign: "center" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.34, whiteSpace: "nowrap", opacity: ease(f, at + 14 + i * 8, at + 26 + i * 8) }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px 22px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 10, color: G.red }}>KANENAZO</div>
            <div style={{ background: final ? "#2B3140" : G.red, color: "#FFFFFF", fontSize: 40, fontWeight: 900, padding: "4px 26px", borderRadius: 40 }}>1回 500円</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.55} />
      <Sfx at={at + 12} name="ding" volume={0.45} />
    </>
  );
};

/* ── 平面図（紺の線画）: 機械の枠が順に埋まる ───────────────── */
export const FloorGrid: React.FC<{ x: number; y: number; cols: number; rows: number; cell?: number; fill: number; label?: string; o?: number; color?: string }> = ({
  x,
  y,
  cols,
  rows,
  cell = 44,
  fill,
  label,
  o = 1,
  color = G.line,
}) => {
  const n = cols * rows;
  const k = Math.round(fill * n);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-12} y={-12} width={cols * cell + 24} height={rows * cell + 24} fill="none" stroke={color} strokeWidth={4} />
      {Array.from({ length: n }, (_, i) => {
        // 外周から埋まるように並べ替え
        const j = (i * 37) % n;
        const cx = (j % cols) * cell;
        const cy = Math.floor(j / cols) * cell;
        const on = i < k;
        return <rect key={i} x={cx + 4} y={cy + 4} width={cell - 8} height={cell - 8} rx={6} fill={on ? G.cap[i % 5] : "none"} stroke={color} strokeWidth={2} opacity={on ? 0.9 : 0.35} />;
      })}
      {label && (
        <text x={(cols * cell) / 2} y={rows * cell + 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#EAF6FF">
          {label}
        </text>
      )}
    </g>
  );
};

/* ── MONEY FLOW（CASE #006）: 客 → 500円 → オペレーター ⇄ メーカー、オペレーター → 設置場所 ───────────────── */
export type Flow6 = {
  customer?: number;
  pay?: number; // 客 → オペレーター（500円）
  op?: number;
  maker?: number;
  info?: number; // メーカー → オペレーター（新商品の案内）
  order?: number; // オペレーター → メーカー（約3か月前に数量）
  goods?: number; // メーカー → オペレーター（その数だけ）
  risk?: number; // 在庫リスクがオペレーターに乗る
  place?: number; // オペレーター → 設置場所
  placeQ?: number; // 割合「？」
  again?: number; // 客の「もう1回」
};
export const FNode: React.FC<{ x: number; y: number; label: string; sub?: string; o: number; color?: string; w?: number }> = ({ x, y, label, sub, o, color = K.ink, w = 280 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-w / 2} y={-66} width={w} height={132} rx={24} fill="#FFFFFF" stroke={color} strokeWidth={6} />
    <text y={sub ? -14 : 0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={color}>
      {label}
    </text>
    {sub && (
      <text y={34} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.inkSoft}>
        {sub}
      </text>
    )}
  </g>
);
export const FArrow: React.FC<{ d: string; o: number; color?: string; w?: number; label?: string; lx?: number; ly?: number; lsize?: number }> = ({
  d,
  o,
  color = K.ink,
  w = 9,
  label,
  lx = 0,
  ly = 0,
  lsize = 30,
}) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray="24 18" strokeDashoffset={-f * 3} />
      {label && (
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={lsize} fill={color} stroke="#FCFBF8" strokeWidth={8} paintOrder="stroke">
          {label}
        </text>
      )}
    </g>
  );
};
export const Coin: React.FC<{ x: number; y: number; r?: number; o?: number; text?: string }> = ({ x, y, r = 40, o = 1, text = "500" }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r} fill={G.coin} stroke="#B8902A" strokeWidth={r * 0.12} />
    <circle r={r * 0.72} fill="none" stroke="#B8902A" strokeWidth={r * 0.05} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r * (text.length > 3 ? 0.5 : 0.62)} fill="#7A5A10">
      {text}
    </text>
  </g>
);
export const MoneyFlow6: React.FC<{ st: Flow6; y?: number }> = ({ st, y = 470 }) => {
  const f = useCurrentFrame();
  const v = (k: keyof Flow6) => st[k] ?? 0;
  const OX = 960;
  const MX = 1620;
  const CX = 260;
  const coinT = ((f % 60) / 60) * v("pay");
  return (
    <g>
      {/* 客 */}
      <g opacity={v("customer")}>
        <Person6 x={CX} y={y + 70} s={1} />
        <text x={CX} y={y + 130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
          客
        </text>
      </g>
      {v("again") > 0 && (
        <g opacity={v("again")} transform={`translate(${CX} ${y - 150})`}>
          <rect x={-150} y={-40} width={300} height={80} rx={40} fill={G.red} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#FFFFFF">
            大人の「もう1回」
          </text>
        </g>
      )}
      <FArrow d={`M ${CX + 100} ${y} L ${OX - 170} ${y}`} o={v("pay")} color="#B8902A" />
      {v("pay") > 0 && <Coin x={CX + 110 + (OX - CX - 290) * coinT} y={y - 50} r={34} o={v("pay")} />}
      {/* オペレーター */}
      <FNode x={OX} y={y} label="オペレーター" sub="機械を置いて運営" o={v("op")} w={340} />
      {v("risk") > 0 && (
        <g opacity={v("risk")} transform={`translate(${OX} ${y - 150 - 60 * (1 - v("risk"))})`}>
          <path d="M -110 40 L -80 -40 L 80 -40 L 110 40 Z" fill={G.risk} />
          <text y={2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
            在庫リスク
          </text>
        </g>
      )}
      {/* メーカー */}
      <FNode x={MX} y={y} label="メーカー" sub="受注生産・新作" o={v("maker")} />
      <FArrow d={`M ${MX - 150} ${y - 90} C ${(MX + OX) / 2 + 60} ${y - 170} ${(MX + OX) / 2 - 60} ${y - 170} ${OX + 180} ${y - 90}`} o={v("info")} color="#3E8ED0" label="新商品の案内" lx={(MX + OX) / 2} ly={y - 190} />
      <FArrow d={`M ${OX + 180} ${y + 20} L ${MX - 150} ${y + 20}`} o={v("order")} color={G.red} label="約3か月前に数量" lx={(MX + OX) / 2 + 15} ly={y - 20} lsize={28} />
      <FArrow d={`M ${MX - 150} ${y + 90} C ${(MX + OX) / 2 + 60} ${y + 170} ${(MX + OX) / 2 - 60} ${y + 170} ${OX + 180} ${y + 90}`} o={v("goods")} color="#2E8B57" label="その数だけ作る" lx={(MX + OX) / 2} ly={y + 190} />
      {/* 設置場所 */}
      <FArrow d={`M ${OX} ${y + 76} L ${OX} ${y + 250}`} o={v("place")} color={v("placeQ") > 0 ? G.hidden : K.ink} />
      <g opacity={v("place")}>
        <FNode x={OX} y={y + 330} label="設置場所" sub="店・モール・書店" o={1} w={300} />
        <text x={OX - 30} y={y + 170} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.inkSoft}>
          売上の一部
        </text>
      </g>
      {v("placeQ") > 0 && (
        <g opacity={v("placeQ")} transform={`translate(${OX + 90} ${y + 165})`}>
          <circle r={46} fill="#FFFFFF" stroke={G.hidden} strokeWidth={5} strokeDasharray="12 9" />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={G.hidden}>
            ？
          </text>
        </g>
      )}
    </g>
  );
};

/* ── ダンゴムシ（線画・一般形。curl: 0 = のびる, 1 = 丸まる） ───────────────── */
export const PillBug: React.FC<{ x: number; y: number; s?: number; curl: number; color?: string }> = ({ x, y, s = 1, curl, color = "#5E6B7D" }) => {
  const n = 9;
  const span = (0.9 + 1.05 * curl) * Math.PI; // 弧の角度
  const L = 520;
  const R = L / span;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 - span / 2 + (span * (i + 0.5)) / n;
        const cx = R * Math.cos(a);
        const cy = R * Math.sin(a) + R;
        const w = i === 0 || i === n - 1 ? 44 : 66;
        return (
          <g key={i} transform={`translate(${cx} ${cy - R * (1 - curl) * 0.2}) rotate(${(a * 180) / Math.PI + 90})`}>
            <rect x={-w / 2} y={-40} width={w} height={80} rx={26} fill={color} stroke="#2B3140" strokeWidth={5} />
            <line x1={-w / 2 + 8} x2={w / 2 - 8} y1={-18} y2={-18} stroke="rgba(255,255,255,0.35)" strokeWidth={5} />
          </g>
        );
      })}
    </g>
  );
};

/* ── 年表（横） ───────────────── */
export type TL6 = { year: string; text: string; at: number; color?: string };
export const Timeline6: React.FC<{ items: TL6[]; y?: number; x0?: number; x1?: number }> = ({ items, y = 360, x0 = 300, x1 = 1620 }) => {
  const f = useCurrentFrame();
  const n = items.length;
  return (
    <g>
      <line x1={x0 - 100} x2={x1 + 100} y1={y} y2={y} stroke={K.ink} strokeWidth={6} opacity={0.6} />
      {items.map((it, i) => {
        const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
        const p = pop(f, it.at);
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={Math.min(1, p * 1.4)}>
            <circle r={18 * p} fill={it.color ?? G.red} />
            <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={it.color ?? K.ink}>
              {it.year}
            </text>
            {it.text.split("\n").map((l, j) => (
              <text key={j} y={80 + j * 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.ink}>
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
};

/** 画面の上の見出し */
export const Head: React.FC<{ text: React.ReactNode; at: number; y?: number; size?: number; color?: string; x?: number }> = ({ text, at, y = 150, size = 52, color = K.ink, x = 960 }) => {
  const f = useCurrentFrame();
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} opacity={fade(f, at)}>
      {text}
    </text>
  );
};

/** 角丸の札 */
export const Badge: React.FC<{ x: number; y: number; text: string; at: number; fill?: string; color?: string; size?: number; o?: number; w?: number }> = ({
  x,
  y,
  text,
  at,
  fill = G.red,
  color = "#FFFFFF",
  size = 38,
  o = 1,
  w,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  const width = w ?? [...text].length * size * 0.98 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4) * o}>
      <rect x={-width / 2} y={-size * 0.9} width={width} height={size * 1.8} rx={size * 0.9} fill={fill} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
