/** 残りのカットで共有するヘルパー */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { At, PRODUCTS, PriceTag } from "../art";
import { Retro } from "../kit";
import { CutData, CutFrame, CutProps, Paper, Sfx, ease, segEnd, segStart } from "../lib";
import { BRAND, C, FONT } from "../theme";
import { Scene } from "./opening";

export type Ctx = { cut: CutData; f: number; s: (i: number) => number; e: (i: number) => number; d: number };

type Opt = { bg?: "paper" | "dark" | "night" | "retro"; retro?: (x: Ctx) => number };

const BG: Record<string, React.ReactNode> = {
  paper: <Paper />,
  dark: <Paper color="#E3DACA" />,
  retro: <Paper color="#EFE4CC" />,
  night: <AbsoluteFill style={{ background: C.night }} />,
};

/** カット部品を作る: render には現在フレームとセグメント時刻を渡す */
export const mk = (render: (x: Ctx) => React.ReactNode, opt: Opt = {}) => {
  const Comp: React.FC<CutProps> = ({ cut }) => {
    const f = useCurrentFrame();
    const x: Ctx = { cut, f, s: (i) => segStart(cut, i), e: (i) => segEnd(cut, i), d: cut.duration };
    const body = render(x);
    const bg = opt.bg ?? "paper";
    return (
      <CutFrame cut={cut} bg={BG[bg]} dark={bg === "night"}>
        {bg === "retro" || opt.retro ? <Retro amount={opt.retro ? opt.retro(x) : 1}>{body}</Retro> : body}
      </CutFrame>
    );
  };
  return Comp;
};

export const Svg = Scene;

/** ブランド名の丸いラベル */
export const Pill: React.FC<{ x: number; y: number; text: string; color: string; at?: number; size?: number }> = ({ x, y, text, color, at = 0, size = 52 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 12, 0, 1, Easing.out(Easing.back(2)));
  const w = [...text].length * size * 0.72 + 90;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={color} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.white} letterSpacing={3}>
        {text}
      </text>
    </g>
  );
};

/** 共通点 ①②③ のスロット */
export const SLOT_LABELS = ["大量仕入れ", "利益の組み合わせ", "取引条件"];
export const Slots: React.FC<{ lit: (number | undefined)[]; y?: number; focus?: number }> = ({ lit, y = 440, focus }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {SLOT_LABELS.map((l, i) => {
        const x = 960 + (i - 1) * 560;
        const at = lit[i];
        const on = at !== undefined && f >= at;
        const p = at === undefined ? 0 : ease(f, at, at + 12, 0, 1, Easing.out(Easing.back(2)));
        const dim = focus !== undefined && focus !== i ? 0.4 : 1;
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={dim}>
            <rect x={-240} y={-170} width={480} height={340} rx={30} fill={on ? C.white : "rgba(255,255,255,0.5)"} stroke={on ? C.red : C.line} strokeWidth={8} strokeDasharray={on ? "0" : "18 14"} />
            <circle cx={0} cy={-170} r={52} fill={on ? C.red : C.line} />
            <text y={-170} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.white}>
              {"①②③"[i]}
            </text>
            {on ? (
              <text y={20} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={[...l].length > 6 ? 50 : 60} fill={C.ink} transform={`scale(${p})`}>
                {l}
              </text>
            ) : (
              <text y={20} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={90} fill={C.line}>
                ？
              </text>
            )}
          </g>
        );
      })}
      {lit.map((a, i) => (a !== undefined && a >= 0 ? <Sfx key={i} at={a} name="ding" volume={0.6} /> : null))}
    </g>
  );
};

/** 迷い度ゲージ */
export const GaugeRows: React.FC<{ rows: { price: string; level: number; at: number; color?: string }[] }> = ({ rows }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <text x={1180} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.inkSoft}>
        迷い度
      </text>
      {rows.map((r, i) => {
        const y = 290 + i * 210;
        const p = ease(f, r.at, r.at + 24, 0, 1, Easing.out(Easing.cubic));
        const o = ease(f, r.at - 6, r.at + 4);
        const col = r.level > 0.7 ? C.red : r.level > 0.3 ? C.orange : C.green;
        return (
          <g key={i} opacity={o}>
            <At x={480} y={y} s={0.62} r={-4}>
              <PriceTag text={r.price} color={r.color ?? C.red} string={false} />
            </At>
            <rect x={760} y={y - 34} width={840} height={68} rx={34} fill={C.white} stroke={C.line} strokeWidth={5} />
            <rect x={766} y={y - 28} width={Math.max(0, 828 * r.level * p)} height={56} rx={28} fill={col} />
            <text x={1640} y={y} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill={col}>
              {r.level > 0.7 ? "！？" : r.level > 0.3 ? "…" : "OK"}
            </text>
            <Sfx at={r.at} name={r.level > 0.3 ? "question" : "pop"} volume={0.6} />
          </g>
        );
      })}
    </g>
  );
};

/** 値札つきの棚（DAISO 店内） */
export const PriceShelf: React.FC<{ at: number; prices: string[] }> = ({ at, prices }) => {
  const f = useCurrentFrame();
  const colors: Record<string, string> = { "100円": C.red, "200円": C.orange, "300円": BRAND.daiso, "500円": C.ink, "1000円": "#6B4B35" };
  return (
    <g>
      {[0, 1].map((row) => (
        <g key={row}>
          <rect x={160} y={410 + row * 300} width={1600} height={20} rx={6} fill={C.inkSoft} />
          {Array.from({ length: 6 }, (_, i) => {
            const k = row * 6 + i;
            const Icon = PRODUCTS[(k * 3 + 1) % PRODUCTS.length];
            const price = prices[k % prices.length];
            const tp = ease(f, at + k * 3, at + k * 3 + 10, 0, 1, Easing.out(Easing.back(2)));
            const x = 290 + i * 268;
            const y = 330 + row * 300;
            return (
              <g key={i}>
                <At x={x} y={y} s={0.6}>
                  <Icon />
                </At>
                <At x={x + 20} y={y + 115} s={0.3 * tp} r={-4}>
                  <PriceTag text={price} color={colors[price] ?? C.red} string={false} />
                </At>
              </g>
            );
          })}
        </g>
      ))}
      {Array.from({ length: 12 }, (_, k) => (
        <Sfx key={k} at={at + k * 3} name={`tok${k % 6}`} volume={0.25} />
      ))}
    </g>
  );
};

/** 画面を覆うフェード */
export const Fade: React.FC<{ o: number; color?: string }> = ({ o, color = C.paper }) => <AbsoluteFill style={{ background: color, opacity: o }} />;
