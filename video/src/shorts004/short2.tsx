/**
 * CASE #004 ショート 2「コインランドリー、店の数は何倍？」（意外な数字）
 * 0秒 店のアイコン + 問い → 1996年 約1万店 → 2013年 1万6693店（約1.6倍, 厚労省）→ この10年でさらに約4割増（日経 2024）
 * → 市場 1155億円（矢野経済研究所 2025）→ 家に洗濯機があるのに、店は増えている
 * → 本編サムネイルと同じ「ドラムの丸窓 + 1155億円 + 何を買ってる？」→ 最後の 0.5 秒で U01 の画面へ戻る（反復再生）
 * 本編の MID REVEAL（クリーニング店の縮小）と最終答えは言わない。
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { HomeWasher, Washer } from "../case004/kit";
import { C, Chip, FONT, Hook, NIGHT, NO_HEAD, Src, V, WHITE, comma, count, ease, fade, mk, pop } from "../shorts003/parts";

const YEN = "#FFE14D";
const NAVY = "radial-gradient(ellipse at 50% 42%, #173257 0%, #0C1830 80%)";

/** 小さな店のアイコン（灯りの点いた窓） */
const Shop: React.FC<{ x: number; y: number; s?: number; lit?: number; o?: number }> = ({ x, y, s = 1, lit = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-60} y={-40} width={120} height={90} rx={6} fill="#1E3558" stroke="#8FD3FF" strokeWidth={5} />
    <rect x={-48} y={-26} width={96} height={52} rx={4} fill="#FFF6D8" opacity={0.25 + 0.75 * lit} />
    <rect x={-66} y={-58} width={132} height={22} rx={4} fill="#8FD3FF" />
  </g>
);
/** 店のグリッド。n 店、1 店ずつ順に灯る */
const ShopGrid: React.FC<{ f: number; n: number; at: number; cols?: number; x0?: number; y0?: number; s?: number }> = ({ f, n, at, cols = 5, x0 = 190, y0 = 760, s = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + (i % cols) * 175 * s;
      const y = y0 + Math.floor(i / cols) * 140 * s;
      return <Shop key={i} x={x} y={y} s={s} o={pop(f, at + i * 2)} lit={fade(f, at + i * 2 + 4)} />;
    })}
  </g>
);

/* U01 の絵（0 フレームから店の灯りが順に明滅）。U06 の最後でも同じ絵を f=0 で描いてつなぐ */
const U01Visual: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Hook y={260} sizes={[100, 126]} lines={["コインランドリー、", <>店の数は<Red>何倍</Red>？</>]} />
    <V>
      {Array.from({ length: 6 }, (_, i) => (
        <Shop key={i} x={240 + (i % 3) * 300} y={880 + Math.floor(i / 3) * 230} s={1.6} lit={0.5 + 0.5 * Math.cos(f / 6 + i * 1.3)} />
      ))}
    </V>
  </>
);
const U01 = mk(({ f }) => <U01Visual f={f} />, { ...NO_HEAD, bg: NAVY, dark: true, noCap: true });

/* U02 1996年 約1万店（アイコン 1 つ = 約1000店） */
const U02 = mk(({ f, s }) => (
  <>
    <V>
      <text x={540} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#EAF6FF" opacity={fade(f, s(0))}>
        1996年
      </text>
      <text x={540} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={YEN} opacity={fade(f, s(1))}>
        約1万店
      </text>
      <ShopGrid f={f} n={10} at={s(1)} />
      <text x={540} y={1110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill="#C9D6E6" opacity={fade(f, s(1))}>
        アイコン1つ ＝ 約1000店
      </text>
      <Src f={f} at={s(0)} text="厚生労働省「コインオペレーションクリーニング営業施設に関する調査」" dark />
    </V>
  </>
), { ...NO_HEAD, bg: NAVY, dark: true });

/* U03 2013年 1万6693店、約1.6倍 */
const U03 = mk(({ f, s }) => {
  const n = count(f, s(1) - 4, 20, 16693);
  return (
    <>
      <V>
        <text x={540} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#EAF6FF" opacity={fade(f, s(0))}>
          2013年
        </text>
        <text x={540} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={YEN} opacity={fade(f, s(1) - 4)}>
          {comma(n)}
          <tspan fontSize={80}>店</tspan>
        </text>
        <ShopGrid f={f} n={17} at={-40} s={0.78} cols={6} x0={150} y0={700} />
        <Chip f={f} at={s(2)} x={540} y={1150} text="約1.6倍" color="#FFFFFF" fill={C.red} size={64} />
        <Src f={f} at={0} text="厚生労働省（2013年）" dark />
      </V>
      <Sfx at={s(2)} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: NAVY, dark: true, hide: [2] });

/* U04 この10年でさらに約4割増（日経 2024） */
const U04 = mk(({ f, s }) => {
  const up = ease(f, s(1), s(1) + 30);
  return (
    <V>
      <path d={`M 250 1100 L 250 ${1100 - 520 * up}`} stroke={YEN} strokeWidth={30} strokeLinecap="round" />
      <path d={`M 190 ${1150 - 520 * up} L 250 ${1060 - 520 * up} L 310 ${1150 - 520 * up}`} fill="none" stroke={YEN} strokeWidth={30} strokeLinejoin="round" strokeLinecap="round" opacity={up} />
      <text x={640} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#EAF6FF" opacity={fade(f, s(1))}>
        この10年で
      </text>
      <text x={640} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={YEN} opacity={fade(f, s(1) + 10)}>
        約4割増
      </text>
      <Src f={f} at={s(1)} text="日本経済新聞（2024年9月）" dark />
    </V>
  );
}, { ...NO_HEAD, bg: NAVY, dark: true });

/* U04B 市場 1155億円（矢野経済研究所 2025年） */
const U04B = mk(({ f, s }) => {
  const n = count(f, s(2) - 4, 20, 1155);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.inkSoft, opacity: fade(f, s(1)) }}>コインランドリー市場（2025年）</div>
        <div style={{ fontSize: 230, fontWeight: 900, color: C.red, lineHeight: 1.2, opacity: fade(f, s(2) - 4) }}>
          {comma(n)}
          <span style={{ fontSize: 110 }}>億円</span>
        </div>
      </div>
      <V>
        <Src f={f} at={s(1)} text="矢野経済研究所（2026年発表）" />
      </V>
      <Sfx at={s(2) + 16} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE, hide: [2] });

/* U05 家にも洗濯機 ⇄ それなのに店は増えている */
const U05 = mk(({ f, s }) => (
  <V>
    <HomeWasher x={300} y={760} s={0.9} />
    <text x={300} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink} opacity={fade(f, s(0))}>
      家にも洗濯機
    </text>
    <g opacity={fade(f, s(1))}>
      <text x={780} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={C.red}>
        ↑
      </text>
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i} transform={`translate(${720 + (i % 2) * 130} ${680 + Math.floor(i / 2) * 120}) scale(0.75)`} opacity={pop(f, s(1) + i * 4)}>
          <rect x={-60} y={-40} width={120} height={90} rx={6} fill="#FFFFFF" stroke={C.ink} strokeWidth={6} />
          <rect x={-48} y={-26} width={96} height={52} rx={4} fill="#FCE7B8" />
        </g>
      ))}
      <text x={780} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink}>
        店は増えている
      </text>
    </g>
  </V>
), { ...NO_HEAD, bg: WHITE });

/* U06 本編サムネイルと同じ絵: ドラムの丸窓 + 1155億円 + 何を買ってる？ → 最後の 0.5 秒で U01 へ */
const U06 = mk(({ f, s, d }) => {
  const L = ease(f, d - 15, d);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, #1A1712 0%, #070707 70%)", opacity: 1 - L }} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - L }}>
        <V>
          <Washer x={540} y={1010} s={1.25} spin={1} />
          <g transform={`translate(540 600) scale(${pop(f, -12)})`}>
            <rect x={-250} y={-66} width={500} height={132} rx={20} fill={C.red} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#FFFFFF">
              1155億円
            </text>
          </g>
        </V>
        <Big
          y={330}
          dark
          lines={[
            { t: "客はいったい、", at: s(0) - 4, size: 72, serif: true },
            { t: <>何を<span style={{ color: YEN }}>買ってる</span>？</>, at: s(1) - 4, size: 140, serif: true },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: NAVY, opacity: L }}>
        <U01Visual f={0} />
      </div>
    </>
  );
}, { ...NO_HEAD, bg: NAVY, dark: true, noCap: true });

export const SHORT2 = { U01, U02, U03, U04, U04B, U05, U06 };
export { NIGHT };
