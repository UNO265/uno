/**
 * CASE #004 ショート 3「コインランドリーに入れたお金、どこへ消える？」（お金の流れ）
 * 0秒 ドラム + 落ちる硬貨 + 問い → 押すだけ、でもそのまま利益ではない → 一回ごと（水道・電気/ガス・洗剤）
 * → 来ても来なくても（家賃・清掃・点検/修理）→ 設備そのもの → 置けば終わりではない → 無人だから利益、ではない
 * → 本編タイトルの問い「人がいないのに、なぜ儲かる？」→ 最後の 0.5 秒で V01 の画面へ戻る（反復再生）
 * 本編の答え（回るか・時間を売る店）は言わない。金額は出さない（店ごとに違う）。
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Coin, Dryer, T, Washer } from "../case004/kit";
import { BLACK, C, Chip, FONT, Hook, NIGHT, NO_HEAD, V, WHITE, ease, fade, mk, pop } from "../shorts003/parts";

const YEN = "#FFE14D";
const CYCLE = 36; // 硬貨が落ちる周期（フレーム）

/* V01 の絵: ドラムの上から硬貨が繰り返し落ちる。V06 の最後でも f=0 で描いてつなぐ */
const V01Visual: React.FC<{ f: number; spin?: number }> = ({ f, spin = 1.2 }) => {
  const k = (f % CYCLE) / CYCLE;
  return (
    <>
      <Hook y={250} sizes={[60, 126]} lines={["コインランドリーに入れたお金、", <><Red>どこへ</Red>消える？</>]} />
      <V>
        <Washer x={540} y={1110} s={1.2} spin={spin} />
        <g transform={`translate(${540 + 150} ${650 + 150 * k})`} opacity={1 - Math.max(0, k - 0.8) * 5}>
          <Coin x={0} y={0} r={48} rot={f / 4} />
        </g>
      </V>
    </>
  );
};
const V01 = mk(({ f }) => <V01Visual f={f} />, { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

/* V01B お金を入れてボタンを押すだけ → でもそのまま利益ではない */
const V01B = mk(({ f, s }) => (
  <V>
    <Washer x={540} y={800} s={1.05} spin={f >= s(0) + 30 ? 1.2 : 0} />
    <Chip f={f} at={s(0)} x={540} y={330} text="入れて、押すだけ" color={C.ink} size={60} />
    <g opacity={fade(f, s(1))} transform="translate(540 1180)">
      <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.ink}>
        そのまま利益 <tspan fill={C.red}>✕</tspan>
      </text>
    </g>
  </V>
), { ...NO_HEAD, bg: WHITE, hide: [1] });

/** レーンの見出し + 項目 3 つ（本編の MONEY FLOW と同じ色） */
const Lane: React.FC<{ f: number; title: string; color: string; items: string[]; ats: number[]; at: number }> = ({ f, title, color, items, ats, at }) => (
  <V>
    <g transform={`translate(540 330) scale(${pop(f, at)})`} opacity={Math.min(1, pop(f, at) * 1.4)}>
      <rect x={-360} y={-70} width={720} height={140} rx={70} fill={color} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#FFFFFF">
        {title}
      </text>
    </g>
    {items.map((it, i) => {
      const p = pop(f, ats[i]);
      return (
        <g key={i} transform={`translate(540 ${590 + i * 190}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
          <rect x={-300} y={-70} width={600} height={140} rx={24} fill="#FFFFFF" stroke={color} strokeWidth={8} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.ink}>
            {it}
          </text>
        </g>
      );
    })}
  </V>
);

/* V02 一回動くたびに: 水道・電気やガス・洗剤 */
const V02 = mk(({ f, s }) => <Lane f={f} title="一回動くたびに" color={T.lane1} items={["水道", "電気・ガス", "洗剤"]} ats={[s(1), s(2), s(3)]} at={s(0)} />, {
  ...NO_HEAD,
  bg: WHITE,
  hide: [1, 2, 3],
});

/* V03 来ても来なくても: 家賃・清掃・点検や修理 */
const V03 = mk(({ f, s }) => <Lane f={f} title="来ても、来なくても" color={T.lane2} items={["家賃", "清掃", "点検・修理"]} ats={[s(1), s(2), s(3)]} at={s(0)} />, {
  ...NO_HEAD,
  bg: WHITE,
  hide: [1, 2, 3],
});

/* V04 設備そのもの */
const V04 = mk(({ f, s }) => (
  <V>
    <g transform={`translate(540 330) scale(${pop(f, s(0))})`}>
      <rect x={-200} y={-70} width={400} height={140} rx={70} fill={T.lane3} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#FFFFFF">
        設備
      </text>
    </g>
    <g opacity={fade(f, s(0) + 8)}>
      <Washer x={330} y={820} s={0.8} spin={0.8} />
    </g>
    <g opacity={fade(f, s(0) + 16)}>
      <Dryer x={770} y={800} s={0.8} />
    </g>
  </V>
), { ...NO_HEAD, bg: WHITE });

/* V04B 何台もの大型の機械は、置けば終わりではない */
const V04B = mk(({ f, s }) => (
  <V>
    {[0, 1, 2, 3].map((i) => (
      <g key={i} opacity={pop(f, i * 4)}>
        <Washer x={200 + i * 230} y={760} s={0.5} spin={0.6} />
      </g>
    ))}
    <Chip f={f} at={s(1)} x={540} y={1120} text="置けば終わり、ではない" color="#FFFFFF" fill={C.red} size={56} />
  </V>
), { ...NO_HEAD, bg: NIGHT, dark: true, hide: [1] });

/* V05 無人だから、ほとんど利益？ → ではない */
const V05 = mk(({ f, s }) => (
  <Big
    y={760}
    dark
    lines={[
      { t: "無人だから、", at: s(0), size: 90, serif: true },
      { t: "売上のほとんどが利益？", at: s(0) + 10, size: 80, serif: true },
      { t: <><Red>というわけではない。</Red></>, at: s(1), size: 96, serif: true },
    ]}
  />
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

/* V06 本編タイトルの問い → 最後の 0.5 秒で V01 へ */
const V06 = mk(({ f, s, d }) => {
  const L = ease(f, d - 15, d);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - L }}>
        <V>
          <Washer x={540} y={1060} s={1.1} spin={0.8} />
        </V>
        <Big
          y={430}
          dark
          lines={[
            { t: "では、人がいないのに、", at: s(0) - 4, size: 80, serif: true },
            { t: <>なぜ<span style={{ color: YEN }}>儲かる</span>？</>, at: s(1) - 4, size: 140, serif: true },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: L }}>
        {/* Washer はこのカットのフレームで回るので、最後のフレームで回転角が 360° の倍数になる速さにする */}
        <V01Visual f={0} spin={(Math.round((1.2 * 9 * d) / 360) * 360) / (9 * d)} />
      </div>
    </>
  );
}, { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

export const SHORT3 = { V01, V01B, V02, V03, V04, V04B, V05, V06 };
