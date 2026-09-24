/**
 * CASE #002 の画面部品（KANENAZO STYLE v2）。
 * CASE #001 の部品は流用せず、ブランド（色・書体・CLUE / EVIDENCE / MONEY FLOW の文法）だけを引き継ぐ。
 * 時刻はすべてカット内のフレーム番号。
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import stock from "./stock.json";
import { CutData, CutProps, Paper, Sfx, clamp, ease, sec, segEnd, segStart, splitSub } from "../lib";
import { C, FONT } from "../theme";

export const SERIF = "'Noto Serif CJK JP', 'Noto Serif JP', serif";

/** CASE #002 の追加色（スープ・醤油・海苔など、題材の色を少しだけ） */
export const K = {
  ...C,
  broth: "#D9A441",
  brothDeep: "#B07A26",
  soy: "#8A5A36",
  noodle: "#F1D38C",
  nori: "#2E3A33",
  negi: "#7DAF6B",
  porcelain: "#FBF8F2",
  steel: "#2A3446",
  mist: "#E6E0D5",
  profit: "#E2452F",
  cost: ["#8FBBD6", "#7FBF9E", "#E9B949", "#C9A0DC", "#E8A07A"],
};

export type Bg = "paper" | "night" | "white" | "steel" | "black" | "blueprint" | "velvet";
export type Ctx = { cut: CutData; f: number; s: (i: number) => number; e: (i: number) => number; d: number };
type Opt = { bg?: Bg; noSub?: boolean; hideSubs?: number[] | ((x: Ctx) => number[]) };

const BGS: Record<Bg, React.ReactNode> = {
  paper: <Paper />,
  night: <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1B2438 0%, #0E1320 75%)" }} />,
  white: <AbsoluteFill style={{ background: "#FCFBF8" }} />,
  steel: <AbsoluteFill style={{ background: "linear-gradient(180deg, #243047 0%, #1A2233 100%)" }} />,
  // CASE #003 以降（実写の代わりの質感）
  black: <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1A1712 0%, #070707 70%)" }} />,
  blueprint: (
    <AbsoluteFill
      style={{
        background: "#10294A",
        backgroundImage:
          "linear-gradient(rgba(143,211,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(143,211,255,0.08) 2px, transparent 2px), linear-gradient(rgba(143,211,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(143,211,255,0.04) 1px, transparent 1px)",
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
      }}
    />
  ),
  velvet: <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #5A1418 0%, #2A080B 80%)" }} />,
};

/* ── 字幕（v2: 小さく・薄く。短い言葉は箱なし） ───────────────── */
const Sub: React.FC<{ cut: CutData; bg: Bg; hide: number[] }> = ({ cut, bg, hide }) => {
  const f = useCurrentFrame();
  const segs = cut.segments;
  const idx = segs.findIndex((s, i) => {
    const next = segs[i + 1];
    return f >= sec(s.start) - 3 && f < Math.min(next ? sec(next.start) - 3 : Infinity, sec(s.end) + 15);
  });
  if (idx < 0 || hide.includes(idx)) return null;
  const s = segs[idx];
  const opacity = interpolate(f, [sec(s.start) - 3, sec(s.start) + 2], [0, 1], clamp);
  const lines = splitSub(s.text);
  const longest = Math.max(...lines.map((l) => [...l].length));
  const short = [...s.text].length <= 9;
  const dark = bg === "night" || bg === "steel" || bg === "black" || bg === "blueprint" || bg === "velvet";
  const fontSize = Math.min(lines.length > 1 ? 58 : 64, Math.floor(1640 / Math.max(1, longest)));
  const boxed: React.CSSProperties = short
    ? {
        color: dark ? "#FFFFFF" : K.ink,
        textShadow: dark ? "0 2px 10px rgba(0,0,0,0.7)" : "0 0 12px rgba(252,250,245,0.95), 0 0 4px rgba(252,250,245,0.95)",
      }
    : {
        color: "#FFFFFF",
        background: "rgba(20, 27, 43, 0.58)",
        padding: "6px 30px 10px",
        borderRadius: 12,
        textShadow: "0 2px 3px rgba(0,0,0,0.35)",
      };
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 46 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize, lineHeight: 1.24, letterSpacing: 2, textAlign: "center", opacity, ...boxed }}>
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** カット部品を作る。render には現在フレームとセグメント時刻を渡す */
export const mk = (render: (x: Ctx) => React.ReactNode, opt: Opt = {}) => {
  const Comp: React.FC<CutProps> = ({ cut }) => {
    const f = useCurrentFrame();
    const x: Ctx = { cut, f, s: (i) => segStart(cut, i), e: (i) => segEnd(cut, i), d: cut.duration };
    const bg = opt.bg ?? "paper";
    const hide = typeof opt.hideSubs === "function" ? opt.hideSubs(x) : opt.hideSubs ?? [];
    return (
      <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
        {BGS[bg]}
        {render(x)}
        {!opt.noSub && <Sub cut={cut} bg={bg} hide={hide} />}
        {cut.voice ? (
          <Sequence from={sec(cut.voiceStart ?? 0)} layout="none">
            <Audio src={staticFile(cut.voice)} volume={1} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    );
  };
  return Comp;
};

/** 1920×1080 の SVG 舞台 */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}>
    {children}
  </svg>
);

export const pop = (f: number, at: number, dur = 12) => ease(f, at, at + dur, 0, 1, Easing.out(Easing.back(1.8)));
export const fade = (f: number, at: number, dur = 10) => ease(f, at, at + dur);
export const count = (f: number, at: number, dur: number, from: number, to: number) =>
  interpolate(f, [at, at + dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
export const yen = (v: number) => Math.round(v).toLocaleString("ja-JP");

/** 画面全体を覆う色（暗転・場面転換） */
export const Veil: React.FC<{ o: number; color?: string }> = ({ o, color = "#0E1320" }) =>
  o > 0 ? <AbsoluteFill style={{ background: color, opacity: o }} /> : null;

/* ── 文字 ───────────────── */
/** 中央タイポ（G / F 画面）。serif を基本にして CASE #001 のゴシック見出しと質感を変える */
export type Line = { t: React.ReactNode; at: number; size?: number; color?: string; serif?: boolean; out?: number; weight?: number };
export const Lines: React.FC<{ lines: Line[]; dark?: boolean; y?: number; gap?: number; align?: "center" | "left"; x?: number }> = ({
  lines,
  dark,
  y = -40,
  gap = 18,
  align = "center",
  x = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        paddingLeft: align === "left" ? x : 0,
        transform: `translateY(${y}px)`,
        gap,
      }}
    >
      {lines.map((l, i) => {
        const p = ease(f, l.at, l.at + 16);
        const o = l.out === undefined ? 1 : 1 - ease(f, l.out, l.out + 10);
        return (
          <div
            key={i}
            style={{
              fontFamily: l.serif === false ? FONT : SERIF,
              fontWeight: l.weight ?? 900,
              fontSize: l.size ?? 96,
              letterSpacing: 4,
              lineHeight: 1.3,
              color: l.color ?? (dark ? "#F4EEE3" : K.ink),
              opacity: p * o,
              transform: `translateY(${(1 - p) * 18}px)`,
              whiteSpace: "nowrap",
              textAlign: align,
            }}
          >
            {l.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const R: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = K.red }) => <span style={{ color: c }}>{children}</span>;

/** 小さなラベル（「イメージ」「※割合はイメージ」など） */
export const Tag: React.FC<{ text: string; x?: number; y?: number; at?: number; dark?: boolean }> = ({ text, x = 60, y = 50, at = 0, dark }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 2,
        color: dark ? "#D8D2C6" : K.inkSoft,
        border: `2px solid ${dark ? "rgba(216,210,198,0.6)" : K.line}`,
        borderRadius: 8,
        padding: "3px 14px",
        opacity: fade(f, at),
      }}
    >
      {text}
    </div>
  );
};

/** 出典（EVIDENCE の画面に必ず付ける） */
export const Source: React.FC<{ text: string; at?: number; dark?: boolean }> = ({ text, at = 0, dark }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        top: 44,
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 700,
        color: dark ? "#D8D2C6" : K.inkSoft,
        opacity: fade(f, at),
        letterSpacing: 1,
      }}
    >
      SOURCE: {text}
    </div>
  );
};

/* ── 実写スロット（E 画面） ─────────────────
 * public/case002/stock/ に使用権を確認した素材を置き、scripts/evidence.py を実行すると差し替わる。
 * 素材が無いときは fallback（完成した KANENAZO グラフィック）を表示する。空の枠は出さない。
 */
const hasStock = (file: string) => (stock.files as string[]).includes(file);
export const Stock: React.FC<{ file: string; fallback: React.ReactNode; image?: boolean; from?: number; label?: string; children?: React.ReactNode }> = ({
  file,
  fallback,
  from = 0,
  label,
  children,
}) => {
  const f = useCurrentFrame();
  if (!hasStock(file)) return <>{fallback}</>;
  const isVideo = /\.(mp4|webm|mov)$/i.test(file);
  const zoom = 1.02 + 0.05 * interpolate(f, [from, from + 300], [0, 1], clamp);
  const src = staticFile(`case002/stock/${file}`);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {isVideo ? (
          <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)" }} />
      {label && <Tag text={label} dark />}
      {children}
    </AbsoluteFill>
  );
};
export const stockReady = hasStock;

/* ── ラーメン ───────────────── */
export const Steam: React.FC<{ x?: number; y?: number; w?: number; o?: number; dark?: boolean }> = ({ x = 0, y = 0, w = 1, o = 1, dark }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${w})`} opacity={o} fill="none" stroke={dark ? "rgba(255,255,255,0.45)" : "rgba(34,48,74,0.28)"} strokeWidth={12} strokeLinecap="round">
      {[-120, 0, 120].map((dx, i) => {
        const t = (f / 30 + i * 0.37) % 1;
        const rise = -60 * t;
        const op = Math.sin(Math.PI * t);
        const wob = 18 * Math.sin(f / 14 + i);
        return (
          <path
            key={i}
            d={`M ${dx} ${rise} c ${wob} -40 ${-wob - 30} -80 0 -120 s ${wob + 30} -80 0 -120`}
            opacity={op}
          />
        );
      })}
    </g>
  );
};

/** 斜め上から見たラーメン一杯（具は後から載せられる） */
export const Bowl: React.FC<{ x?: number; y?: number; s?: number; toppings?: number; steam?: number; dark?: boolean; price?: React.ReactNode }> = ({
  x = 960,
  y = 560,
  s = 1,
  toppings = 1,
  steam = 1,
  dark,
}) => {
  const t = (k: number) => Math.min(1, Math.max(0, toppings * 5 - k));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={250} rx={280} ry={30} fill="rgba(0,0,0,0.12)" />
      <path d="M -330 0 C -320 150 -200 240 -120 250 L 120 250 C 200 240 320 150 330 0 Z" fill={dark ? "#E9E4DA" : K.porcelain} stroke={K.ink} strokeWidth={8} />
      <path d="M -300 70 C -250 120 -170 160 -60 172" fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      <path d="M 300 70 C 250 120 170 160 60 172" fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      <ellipse cx={0} cy={0} rx={330} ry={92} fill={K.porcelain} stroke={K.ink} strokeWidth={8} />
      <ellipse cx={0} cy={6} rx={296} ry={74} fill={K.broth} />
      <ellipse cx={-40} cy={-6} rx={200} ry={40} fill="#E6B659" opacity={0.6} />
      {/* 麺 */}
      {[-150, -90, -30, 30, 90].map((dx, i) => (
        <path key={i} d={`M ${dx} 40 q 30 -30 60 0 t 60 0`} fill="none" stroke={K.noodle} strokeWidth={9} strokeLinecap="round" />
      ))}
      {/* 海苔 */}
      <g opacity={t(0)} transform={`translate(${150} ${-40 - (1 - t(0)) * 40}) rotate(12)`}>
        <rect x={-50} y={-110} width={100} height={130} rx={6} fill={K.nori} />
      </g>
      {/* チャーシュー */}
      <g opacity={t(1)} transform={`translate(-120 ${-4 - (1 - t(1)) * 40})`}>
        <ellipse rx={92} ry={42} fill="#C98C66" stroke={K.soy} strokeWidth={6} />
        <ellipse rx={56} ry={22} fill="#E2B08E" />
      </g>
      {/* 味玉 */}
      <g opacity={t(2)} transform={`translate(40 ${6 - (1 - t(2)) * 40})`}>
        <ellipse rx={54} ry={34} fill="#FFF8EA" stroke={K.ink} strokeWidth={4} />
        <ellipse rx={28} ry={18} fill={K.orange} />
      </g>
      {/* メンマ */}
      <g opacity={t(3)} transform={`translate(180 ${30 - (1 - t(3)) * 30})`}>
        {[-18, 0, 18].map((d, i) => (
          <rect key={i} x={d - 7} y={-26} width={14} height={50} rx={4} fill="#C8A060" transform={`rotate(${20 + i * 8})`} />
        ))}
      </g>
      {/* ねぎ */}
      <g opacity={t(4)}>
        {[[-20, -30], [-50, 30], [90, -20], [-200, 30], [110, 40], [0, 40]].map(([a, b], i) => (
          <circle key={i} cx={a} cy={b} r={9} fill={K.negi} stroke="#4E7E45" strokeWidth={3} />
        ))}
      </g>
      {steam > 0 && <Steam y={-70} o={steam} dark={dark} />}
    </g>
  );
};

/** 値札（丼の横に立つ短冊） */
export const PriceCard: React.FC<{ x: number; y: number; text: string; s?: number; r?: number; color?: string; o?: number }> = ({
  x,
  y,
  text,
  s = 1,
  r = -4,
  color = K.red,
  o = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <rect x={-150} y={-66} width={300} height={132} rx={14} fill={K.white} stroke={color} strokeWidth={8} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={76} fill={color} letterSpacing={2}>
      {text}
    </text>
  </g>
);

/** 券売機（特定の店・メーカーを連想させない汎用デザイン） */
export const TicketMachine: React.FC<{ x?: number; y?: number; s?: number; lit?: number; billIn?: number }> = ({ x = 960, y = 540, s = 1, lit = -1, billIn = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-380} width={520} height={760} rx={30} fill="#DCD6CB" stroke={K.ink} strokeWidth={8} />
    <rect x={-220} y={-340} width={440} height={80} rx={10} fill={K.ink} />
    <text y={-300} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.paper} letterSpacing={8}>
      食券
    </text>
    {Array.from({ length: 12 }, (_, i) => {
      const cx = -150 + (i % 3) * 150;
      const cy = -200 + Math.floor(i / 3) * 90;
      const on = i === lit;
      return (
        <g key={i}>
          <rect x={cx - 64} y={cy - 32} width={128} height={64} rx={10} fill={on ? K.red : K.white} stroke={K.ink} strokeWidth={4} />
          <rect x={cx - 40} y={cy - 6} width={80} height={12} rx={6} fill={on ? K.white : K.line} />
        </g>
      );
    })}
    <rect x={-200} y={180} width={180} height={24} rx={12} fill={K.ink} />
    <rect x={40} y={170} width={160} height={120} rx={12} fill="#BDB5A7" stroke={K.ink} strokeWidth={5} />
    <rect x={-200} y={300} width={400} height={40} rx={8} fill={K.ink} opacity={0.85} />
    {/* お札 */}
    {billIn < 1 && (
      <g transform={`translate(-110 ${120 - 260 * (1 - billIn)})`} opacity={1 - Math.max(0, billIn - 0.85) / 0.15}>
        <Bill w={220} />
      </g>
    )}
  </g>
);

/** 1000 円（紙幣の意匠はまねず、KANENAZO の記号として描く） */
export const Bill: React.FC<{ w?: number; label?: string }> = ({ w = 300, label = "1000円" }) => {
  const h = w * 0.5;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.05} fill="#F6F0DF" stroke={K.ink} strokeWidth={w * 0.022} />
      <rect x={-w / 2 + w * 0.06} y={-h / 2 + w * 0.05} width={w * 0.88} height={h - w * 0.1} rx={w * 0.03} fill="none" stroke={K.brothDeep} strokeWidth={w * 0.012} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={w * 0.2} fill={K.ink}>
        {label}
      </text>
    </g>
  );
};

/* ── 1000円の中身（コストの帯。割合はイメージ） ───────────────── */
export type Part = { label: string; w: number; at: number; color: string };
/** 1000 円の帯が左から順にコストで埋まり、右端に「残り」が残る */
export const MoneyBar: React.FC<{
  parts: Part[];
  x?: number;
  y?: number;
  width?: number;
  h?: number;
  show?: number;
  rest?: { label: string; at: number; glow?: number };
  labels?: boolean;
  title?: string;
  used?: number;
}> = ({ parts, x = 260, y = 460, width = 1400, h = 150, show = 0, rest, labels = true, title = "1000円", used }) => {
  const f = useCurrentFrame();
  let acc = 0;
  const total = parts.reduce((a, p) => a + p.w, 0);
  const restW = width * (1 - (used ?? total));
  return (
    <g opacity={fade(f, show)}>
      <text x={x} y={y - 40} fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
        {title}
      </text>
      {title !== "" && <rect x={x} y={y} width={width} height={h} rx={16} fill={K.white} stroke={K.ink} strokeWidth={6} />}
      {parts.map((p, i) => {
        const k = ease(f, p.at, p.at + 14, 0, 1, Easing.out(Easing.cubic));
        const px = x + acc * width;
        acc += p.w;
        const w = width * p.w * k;
        return (
          <g key={i}>
            <rect x={px + 3} y={y + 3} width={Math.max(0, w - 3)} height={h - 6} rx={i === 0 ? 13 : 2} fill={p.color} />
            {labels && k > 0.4 && (
              <text
                x={px + (width * p.w) / 2}
                y={y + h + 56}
                textAnchor="middle"
                fontFamily={FONT}
                fontWeight={800}
                fontSize={width * p.w > 180 ? 42 : 34}
                fill={K.ink}
                opacity={ease(f, p.at + 4, p.at + 14)}
              >
                {p.label}
              </text>
            )}
          </g>
        );
      })}
      {rest && (
        <g opacity={fade(f, rest.at)}>
          <rect
            x={x + width - restW + 3}
            y={y + 3}
            width={restW - 6}
            height={h - 6}
            rx={12}
            fill={K.profit}
            opacity={0.35 + 0.65 * (rest.glow === undefined ? 1 : ease(f, rest.glow, rest.glow + 12))}
          />
          <text x={x + width - restW / 2} y={y - 36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.profit}>
            {rest.label}
          </text>
          <path d={`M ${x + width - restW / 2} ${y - 22} l 0 18`} stroke={K.profit} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/* ── CLUE（食券のかたち） ───────────────── */
export const CLUE_TEXT: Record<string, string[]> = {
  "1": ["1000円は、", "売上であって、", "利益ではない。"],
  "2": ["1000円は変わらなくても、", "1000円の中身は変わる。"],
  "3": ["利益を増やす方法は、", "ラーメンの値段を", "上げることだけではない。"],
  "4": ["売上が増えることと、", "儲かることは、", "同じではない。"],
  "5": ["利益を決めるのは、", "値段だけではない。", "店の仕組みだ。"],
};
export const CLUE_SHORT = ["売上≠利益", "中身が変わる", "客単価", "売上≠儲け", "店の仕組み"];

/** 食券型の CLUE カード */
export const Ticket: React.FC<{ no: string; lines: string[]; w?: number; final?: boolean; lineAt?: number[] }> = ({ no, lines, w = 860, final, lineAt }) => {
  const f = useCurrentFrame();
  const maxChars = Math.max(...lines.map((l) => [...l].length));
  const font = Math.min(final ? 76 : 70, Math.floor((w - 130) / maxChars));
  const h = 170 + lines.length * Math.round(font * 1.37) + 90;
  const head = final ? K.brothDeep : K.red;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: K.porcelain,
        borderRadius: 18,
        boxShadow: "0 24px 50px rgba(40,30,10,0.25)",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      <div style={{ height: 110, background: head, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
        <div style={{ color: K.white, fontWeight: 900, fontSize: 52, letterSpacing: 8 }}>{final ? "FINAL CLUE" : `CLUE ${no.padStart(2, "0")}`}</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 26, letterSpacing: 4 }}>CASE #002</div>
      </div>
      <div style={{ padding: "40px 56px 0", fontFamily: SERIF, fontWeight: 900, color: K.ink }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: font,
              lineHeight: 1.37,
              whiteSpace: "nowrap",
              opacity: lineAt ? ease(f, lineAt[i], lineAt[i] + 12) : 1,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, borderTop: `4px dashed ${K.line}` }} />
      <div style={{ position: "absolute", left: -26, bottom: 44, width: 52, height: 52, borderRadius: 26, background: "rgba(0,0,0,0.08)" }} />
      <div style={{ position: "absolute", right: -26, bottom: 44, width: 52, height: 52, borderRadius: 26, background: "rgba(0,0,0,0.08)" }} />
      <div style={{ position: "absolute", left: 56, bottom: 18, fontSize: 24, fontWeight: 900, letterSpacing: 10, color: K.inkSoft }}>KANENAZO</div>
    </div>
  );
};

/** 小さな食券（画面の端に並ぶ、これまでの CLUE） */
export const MiniTicket: React.FC<{ i: number; lit?: boolean }> = ({ i, lit = true }) => (
  <div
    style={{
      width: 300,
      height: 92,
      borderRadius: 10,
      background: lit ? K.porcelain : "rgba(255,255,255,0.4)",
      boxShadow: lit ? "0 6px 14px rgba(40,30,10,0.18)" : "none",
      border: lit ? "none" : `3px dashed ${K.line}`,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      fontFamily: FONT,
    }}
  >
    <div style={{ width: 64, height: "100%", background: lit ? K.red : K.line, color: K.white, fontWeight: 900, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {String(i + 1).padStart(2, "0")}
    </div>
    <div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", color: lit ? K.ink : K.line }}>{lit ? CLUE_SHORT[i] : "？"}</div>
  </div>
);

/** CLUE 発見の画面: 券売機の口から食券が出てくる */
export const ClueScene: React.FC<{ no: number; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 20, 0, 1, Easing.out(Easing.cubic));
  const lines = CLUE_TEXT[String(no)];
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translateY(${(1 - p) * -120}px)`, opacity: p, marginTop: 10, marginLeft: 200 }}>
          <Ticket no={String(no)} lines={lines} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 50, top: 180, display: "flex", flexDirection: "column", gap: 18 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ opacity: i < no - 1 ? 0.95 : 0 }}>
            <MiniTicket i={i} />
          </div>
        ))}
      </div>
      <Sfx at={at} name="paper" volume={0.7} />
    </>
  );
};

/* ── EVIDENCE（公式資料を要約した資料カード。原本の図表は使わない） ───────────────── */
export type DocRow = { t: React.ReactNode; at: number; hl?: number; big?: boolean };
export const EvidenceDoc: React.FC<{
  no: string;
  org: string;
  title: string;
  rows: DocRow[];
  source: string;
  at?: number;
  zoomTo?: number;
  zoomAt?: number;
  note?: string;
}> = ({ no, org, title, rows, source, at = 0, zoomTo = 1, zoomAt = 0, note }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  const z = interpolate(f, [zoomAt, zoomAt + 60], [1, zoomTo], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90 }}>
        <div
          style={{
            width: 1360,
            background: K.white,
            borderRadius: 8,
            boxShadow: "0 30px 60px rgba(30,25,15,0.22)",
            padding: "56px 76px 44px",
            fontFamily: FONT,
            color: K.ink,
            opacity: p,
            transform: `translateY(${(1 - p) * 40}px) scale(${z})`,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: -26, left: 60, background: K.red, color: K.white, fontWeight: 900, fontSize: 30, letterSpacing: 4, padding: "8px 20px", borderRadius: 6 }}>
            EVIDENCE {no}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: K.inkSoft, letterSpacing: 2 }}>{org}</div>
          <div style={{ fontSize: 50, fontWeight: 900, marginTop: 8, letterSpacing: 2 }}>{title}</div>
          <div style={{ height: 4, background: K.ink, margin: "26px 0 30px", opacity: 0.8 }} />
          {rows.map((r, i) => {
            const o = ease(f, r.at, r.at + 12);
            const hl = r.hl === undefined ? 0 : ease(f, r.hl, r.hl + 16, 0, 1, Easing.inOut(Easing.quad));
            return (
              <div key={i} style={{ fontSize: r.big ? 60 : 42, fontWeight: r.big ? 900 : 700, lineHeight: 1.5, opacity: o, marginBottom: 8 }}>
                <span
                  style={{
                    backgroundImage: `linear-gradient(transparent 58%, rgba(243,163,58,0.55) 58%)`,
                    backgroundSize: `${hl * 100}% 100%`,
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {r.t}
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700, color: K.inkSoft }}>
            <span>SOURCE: {source}</span>
            {note && <span>{note}</span>}
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.55} />
    </>
  );
};

/** EVIDENCE を元にした画面の隅の小さな表示（グラフの根拠を示す） */
export const EvidenceMark: React.FC<{ no: string; source: string; at?: number; dark?: boolean }> = ({ no, source, at = 0, dark }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 56, top: 44, display: "flex", alignItems: "center", gap: 16, opacity: fade(f, at), fontFamily: FONT }}>
      <div style={{ background: K.red, color: K.white, fontWeight: 900, fontSize: 24, letterSpacing: 3, padding: "4px 14px", borderRadius: 6 }}>EVIDENCE {no}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: dark ? "#D8D2C6" : K.inkSoft }}>{source}</div>
    </div>
  );
};

/* ── 棒グラフ（2〜3 本。ナレーションに合わせて伸びる） ───────────────── */
export type Col = { label: string; value: number; at: number; color?: string; fmt?: (v: number) => string; sub?: string };
export const Columns: React.FC<{
  cols: Col[];
  max: number;
  x0?: number;
  gap?: number;
  base?: number;
  height?: number;
  width?: number;
  dur?: number;
  dark?: boolean;
  unit?: string;
}> = ({ cols, max, x0 = 960, gap = 420, base = 860, height = 560, width = 240, dur = 30, dark, unit = "" }) => {
  const f = useCurrentFrame();
  const n = cols.length;
  const ink = dark ? "#F4EEE3" : K.ink;
  return (
    <g>
      <line x1={x0 - (gap * n) / 2 - 40} x2={x0 + (gap * n) / 2 + 40} y1={base} y2={base} stroke={ink} strokeWidth={5} opacity={0.6} />
      {cols.map((c, i) => {
        const x = x0 + (i - (n - 1) / 2) * gap;
        const v = count(f, c.at, dur, 0, c.value);
        const hh = (v / max) * height;
        const o = fade(f, c.at - 8);
        return (
          <g key={i} opacity={o}>
            <rect x={x - width / 2} y={base - hh} width={width} height={hh} rx={8} fill={c.color ?? K.inkSoft} />
            <text x={x} y={base - hh - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={c.color ?? ink}>
              {(c.fmt ?? yen)(v)}
              {unit && (
                <tspan fontSize={40} dx={6}>
                  {unit}
                </tspan>
              )}
            </text>
            <text x={x} y={base + 64} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={ink}>
              {c.label}
            </text>
            {c.sub && (
              <text x={x} y={base + 112} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={dark ? "#C9C2B6" : K.inkSoft}>
                {c.sub}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** アイコン: 丸の中に文字（素材・人・場所など） */
export const Chip: React.FC<{ x: number; y: number; text: string; color?: string; at: number; r?: number; font?: number; dark?: boolean }> = ({
  x,
  y,
  text,
  color = K.ink,
  at,
  r = 90,
  font,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  const size = font ?? Math.min(r * 0.62, (r * 1.55) / Math.max(1, [...text].length));
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <circle r={r} fill={K.white} stroke={color} strokeWidth={7} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** 角丸のラベル */
export const Pill: React.FC<{ x: number; y: number; text: string; color?: string; at: number; size?: number; fill?: string; o?: number }> = ({
  x,
  y,
  text,
  color = K.ink,
  at,
  size = 46,
  fill,
  o = 1,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  const w = [...text].reduce((a, ch) => a + (/[\x00-\x7F]/.test(ch) ? 0.6 : 1.02), 0) * size + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4) * o}>
      <rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.8} rx={size * 0.9} fill={fill ?? K.white} stroke={color} strokeWidth={5} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={fill ? K.white : color}>
        {text}
      </text>
    </g>
  );
};

/** 店（正面の簡略図。のれん付き） */
export const Shop: React.FC<{ x: number; y: number; s?: number; color?: string; lit?: boolean; o?: number; label?: string }> = ({
  x,
  y,
  s = 1,
  color = K.red,
  lit = true,
  o = 1,
  label = "ラーメン",
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-220} y={-120} width={440} height={300} fill={K.porcelain} stroke={K.ink} strokeWidth={7} />
    <path d="M -250 -120 L -220 -200 L 220 -200 L 250 -120 Z" fill={K.ink} />
    <rect x={-150} y={-60} width={300} height={240} fill={lit ? "#FCE7B8" : "#9AA0AA"} stroke={K.ink} strokeWidth={6} />
    {[-110, -37, 37, 110].map((dx, i) => (
      <rect key={i} x={dx - 34} y={-66} width={68} height={100} fill={color} stroke={K.ink} strokeWidth={4} />
    ))}
    <text x={0} y={-160} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.paper} letterSpacing={6}>
      {label}
    </text>
  </g>
);

/** 人のアイコン */
export const Person: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = K.ink, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-70} r={42} fill={color} />
    <path d="M -70 60 C -70 -10 70 -10 70 60 Z" fill={color} />
  </g>
);

/** 流れる点線（MONEY FLOW 用） */
export const FlowLine: React.FC<{ d: string; at: number; color?: string; w?: number; speed?: number; dash?: number }> = ({ d, at, color = K.brothDeep, w = 10, speed = 3, dash = 26 }) => {
  const f = useCurrentFrame();
  const o = fade(f, at, 14);
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 0.8}`} strokeDashoffset={-(f - at) * speed} opacity={o} />;
};

export { Easing, interpolate, ease, clamp, Sfx, FONT };
