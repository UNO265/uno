/**
 * CASE #002 ショート 2「ラーメン店、過去最高なのに？」
 * 0秒 8855億円 → 1秒 儲かっている？ → 3秒 利益はほぼ半分 → 数字 → 答え「売れている。でも、残らない」
 * → 本編への別の疑問「利益を残せる店は、何が違うのか」（本編の「店の仕組み」へ）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Arrow, Bars, Bowl, C, Chip, FONT, K, NIGHT, NO_HEAD, SERIF, Src, V, WHITE, ease, fade, mk, pop } from "./parts";

const SRC = "出典：帝国データバンク（2025年度）";

/* F01 0〜1秒: 丼と 8855億円 */
const F01 = mk(({ f }) => (
  <V>
    <Bowl x={540} y={600} s={1.0 * (0.94 + 0.06 * pop(f, 0, 8))} />
    <text x={540} y={1180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={C.red} letterSpacing={-4}>
      8855<tspan fontSize={110}>億円</tspan>
    </text>
  </V>
), { ...NO_HEAD, bg: WHITE, noCap: true });

/* F02 1〜3秒: 過去最高 → 儲かっている？ */
const F02 = mk(({ f, s }) => (
  <>
    <V>
      <Bowl x={540} y={560} s={0.8} />
      <g opacity={fade(f, s(0))}>
        <text x={540} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.inkSoft}>
          ラーメン店の市場
        </text>
      </g>
      <Chip f={f} at={s(0) + 16} x={540} y={1080} text="過去最高" color={C.red} size={80} />
      <text x={540} y={1330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.ink} opacity={fade(f, s(1) - 4)}>
        儲かってる<tspan fill={C.red}>？</tspan>
      </text>
    </V>
    <Sfx at={s(0) + 16} name="pop" volume={0.5} />
  </>
), { ...NO_HEAD, bg: WHITE, noCap: true });

/* F03 3〜7秒: 利益はほぼ半分 */
const F03 = mk(({ f, s }) => {
  const half = ease(f, s(1) + 6, s(1) + 30);
  return (
    <V>
      <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#F4EEE3" opacity={fade(f, s(0))}>
        利益は
      </text>
      <rect x={140} y={700} width={800} height={180} rx={14} fill="#3A4458" opacity={fade(f, s(1))} />
      <rect x={140} y={700} width={800 * (1 - 0.52 * half)} height={180} rx={14} fill={C.red} opacity={fade(f, s(1))} />
      <text x={540} y={1100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={C.red} opacity={fade(f, s(1) + 20)}>
        ほぼ半分
      </text>
    </V>
  );
}, { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

/* F04 GRAPH: 市場 5418億円 → 8855億円 */
const F04 = mk(({ f, s }) => (
  <V>
    <Src f={f} at={0} text={SRC} />
    <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.ink}>
      ラーメン店の市場
    </text>
    <Bars
      f={f}
      max={8855}
      h={440}
      base={1100}
      items={[
        { label: "2015年度", value: 5418, text: "5418億", at: s(1), color: C.inkSoft },
        { label: "2025年度", value: 8855, text: "8855億", at: s(0) + 30, color: C.red },
      ]}
    />
    <Chip f={f} at={s(2)} x={540} y={450} text="＋63.4％" color={C.red} size={70} />
  </V>
), { ...NO_HEAD, bg: WHITE, hide: [2] });

/* F05 店舗数 6305店 過去最多（店の記号が並ぶ） */
const F05 = mk(({ f, s }) => (
  <V>
    {Array.from({ length: 40 }, (_, i) => {
      const x = 170 + (i % 5) * 185;
      const y = 360 + Math.floor(i / 5) * 95;
      const p = ease(f, i * 1.2, i * 1.2 + 8);
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
          <rect x={-60} y={-30} width={120} height={60} rx={6} fill={i % 7 === 3 ? K.brothDeep : "#C9C2B6"} />
          <rect x={-66} y={-42} width={132} height={16} rx={4} fill={C.red} />
        </g>
      );
    })}
    <rect x={130} y={1090} width={820} height={130} rx={65} fill={C.white} opacity={fade(f, s(1))} stroke={C.ink} strokeWidth={6} />
    <text x={540} y={1158} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={76} fill={C.ink} opacity={fade(f, s(1))}>
      <tspan fill={C.red}>6305店</tspan>・過去最多
    </text>
  </V>
), { ...NO_HEAD, hide: [1] });

/* F06 GRAPH: 純損益合計 356億円 → 171億円 */
const F06 = mk(({ f, s }) => (
  <V>
    <Src f={f} at={0} text={SRC} dark />
    <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#F4EEE3" opacity={fade(f, s(0))}>
      損益を確認できた企業の純損益合計
    </text>
    <Bars
      dark
      f={f}
      max={356}
      h={520}
      items={[
        { label: "前年度", value: 356, text: "356億", at: s(1), color: "#C9C2B6" },
        { label: "2025年度", value: 171, text: "171億", at: s(2), color: C.red },
      ]}
    />
  </V>
), { ...NO_HEAD, bg: NIGHT, dark: true });

/* F07 売上↑ コスト↑↑ → 利益は増えない */
const F07 = mk(({ f, s }) => (
  <V>
    <g opacity={fade(f, s(0))}>
      <Arrow x={270} y={1000} len={260 * ease(f, s(0), s(0) + 16)} color={K.brothDeep} />
      <text x={270} y={1090} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.brothDeep}>
        売上
      </text>
    </g>
    <g opacity={fade(f, s(1))}>
      <Arrow x={540} y={1000} len={480 * ease(f, s(1), s(1) + 20)} color={C.red} w={44} />
      <text x={540} y={1090} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.red}>
        コスト
      </text>
    </g>
    <g opacity={fade(f, s(2))}>
      <path d="M 740 880 L 920 880" stroke={C.inkSoft} strokeWidth={34} strokeLinecap="round" />
      <text x={830} y={1090} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.inkSoft}>
        利益
      </text>
    </g>
  </V>
), { ...NO_HEAD });

/* F08 答え: 売れている。でも、残らない。 */
const F08 = mk(({ f, s }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, background: WHITE }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 960, background: C.red, opacity: fade(f, s(1) - 4) }} />
    <Big y={640} lines={[{ t: "売れている。", at: s(0), size: 130, serif: true }]} />
    <Big y={1180} lines={[{ t: "でも、残らない。", at: s(1), size: 120, serif: true, color: C.white }]} />
  </>
), { ...NO_HEAD, noCap: true });

/* F09 本編への別の疑問。最後は F01 の白へ戻る */
const F09 = mk(({ f, s, d }) => (
  <>
    <Big
      y={820}
      dark
      lines={[
        { t: "では――", at: s(0), size: 70, color: "#C9C2B6" },
        { t: <>利益を<Red>残せる店</Red>は、</>, at: s(1), size: 104, serif: true },
        { t: "何が違うのか。", at: s(1) + 10, size: 120, serif: true },
      ]}
    />
    <div style={{ position: "absolute", inset: 0, background: WHITE, opacity: ease(f, d - 6, d) }} />
  </>
), { ...NO_HEAD, dark: true, noCap: true });

export const SHORT2 = { F01, F02, F03, F04, F05, F06, F07, F08, F09 };
export { SERIF };
