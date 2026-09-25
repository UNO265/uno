/**
 * CASE #002 ショート 1「ラーメン原価、5年で？」
 * 0秒 丼＋1000円 → 1秒 原価は？ → 3秒 100→141 → 説明 → 答え「1000円の中身は変わる」
 * → 本編への別の疑問「値段を上げれば、いいのでは？」（本編の「1000円の壁」へ）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Arrow, Bars, Bill, Bowl, C, Chip, FONT, K, NIGHT, NO_HEAD, PriceCard, SERIF, Src, V, WHITE, ease, fade, mk, pop } from "./parts";

const SRC = "出典：帝国データバンク「ラーメン原価指数」";

/* E01 0〜1秒: 丼と 1000円 */
const E01 = mk(({ f }) => (
  <V>
    <Bowl x={540} y={760} s={1.35 * (0.94 + 0.06 * pop(f, 0, 8))} />
    <PriceCard x={540} y={1180} text="1000円" s={1.7} r={-4} />
  </V>
), { ...NO_HEAD, noCap: true });

/* E02 1〜3秒: 原価は？ */
const E02 = mk(({ f, s }) => (
  <V>
    <Bowl x={540} y={640} s={1.1} />
    <text x={540} y={1110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.inkSoft} opacity={fade(f, s(0))}>
      5年で、
    </text>
    <text x={540} y={1290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={C.ink} opacity={fade(f, s(1) - 4)}>
      原価は<tspan fill={C.red}>？</tspan>
    </text>
  </V>
), { ...NO_HEAD, noCap: true });

/* E03 3〜7秒: 100 → 141 */
const E03 = mk(({ f, s }) => {
  const n = Math.round(100 + 41 * ease(f, s(1) + 10, s(1) + 40));
  return (
    <>
      <V>
        <text x={540} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={C.inkSoft} opacity={fade(f, s(1))}>
          100
        </text>
        <Arrow x={540} y={830} len={130} up={false} color={C.inkSoft} w={26} o={fade(f, s(1) + 8)} />
        <text x={540} y={1250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={260} fill={C.red} opacity={fade(f, s(1) + 10)}>
          {n}
        </text>
      </V>
      <Sfx at={s(1) + 40} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE, noCap: true });

/* E04 DOCUMENT: 指数の説明 */
const E04 = mk(({ f, s }) => (
  <V>
    <g opacity={fade(f, 0)} transform={`translate(0 ${20 * (1 - fade(f, 0))})`}>
      <rect x={90} y={330} width={900} height={800} rx={10} fill="#FFFDF7" stroke={C.line} strokeWidth={4} />
      <rect x={90} y={330} width={900} height={20} fill={K.brothDeep} />
      <text x={150} y={440} fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.inkSoft}>
        帝国データバンク
      </text>
      <text x={150} y={540} fontFamily={FONT} fontWeight={900} fontSize={82} fill={C.ink}>
        ラーメン原価指数
      </text>
      <line x1={150} x2={930} y1={590} y2={590} stroke={C.line} strokeWidth={4} />
      {[
        { t: "東京都区部", at: s(1) },
        { t: "豚骨ベースのラーメン", at: s(1) + 12 },
        { t: "原材料コストを指数に", at: s(2) },
      ].map((r, i) => (
        <g key={i} opacity={fade(f, r.at)}>
          <rect x={150} y={650 + i * 140} width={[...r.t].length * 62 + 20} height={80} fill="#F7E08A" opacity={ease(f, r.at + 6, r.at + 20)} />
          <text x={160} y={712 + i * 140} fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.ink}>
            {r.t}
          </text>
        </g>
      ))}
    </g>
  </V>
), { ...NO_HEAD, bg: "#EDE7DC", hide: [1, 2] });

/* E05 GRAPH: 2020=100 → 2025=141 */
const E05 = mk(({ f, s }) => (
  <V>
    <Src f={f} at={0} text={SRC} />
    <Bars
      f={f}
      max={141}
      items={[
        { label: "2020年", value: 100, text: "100", at: s(0), color: C.inkSoft },
        { label: "2025年", value: 141, text: "141", at: s(1), color: C.red },
      ]}
    />
  </V>
), { ...NO_HEAD, bg: WHITE });

/* E06 「一律に +41％」ではない → でも材料の値段は上がった */
const E06 = mk(({ f, s }) => {
  const no = pop(f, s(0) + 30);
  return (
    <V>
      <g opacity={1 - 0.6 * fade(f, s(1))}>
        <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={C.ink} opacity={fade(f, s(0))}>
          すべての店が
        </text>
        <text x={540} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={C.ink} opacity={fade(f, s(0) + 6)}>
          ＋41％？
        </text>
        <g transform={`translate(540 640) scale(${no})`} opacity={Math.min(1, no)}>
          <path d="M -300 -140 L 300 140 M 300 -140 L -300 140" stroke={C.red} strokeWidth={30} strokeLinecap="round" />
        </g>
      </g>
      <g opacity={fade(f, s(1))}>
        <Arrow x={300} y={1150} len={260} color={C.red} o={1} />
        <text x={400} y={1020} fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.red}>
          材料の値段
        </text>
      </g>
    </V>
  );
}, { ...NO_HEAD });

/* E07 材料だけではない: 光熱費・人件費・家賃 */
const E07 = mk(({ f, s }) => (
  <V>
    <Bowl x={540} y={720} s={0.95} />
    <Chip f={f} at={s(0) + 20} x={540} y={400} text="材料" color={K.brothDeep} />
    <Chip f={f} at={s(1)} x={250} y={1060} text="光熱費" />
    <Chip f={f} at={s(2)} x={780} y={1060} text="人件費" />
    <Chip f={f} at={s(3)} x={540} y={1200} text="家賃" />
  </V>
), { ...NO_HEAD, hide: [1, 2, 3] });

/* E08 答え: 1000円の中身は変わる（割合はイメージ） */
const E08 = mk(({ f, s, d }) => {
  const grow = ease(f, s(1) - 6, s(1) + 30);
  const cost = 0.62 + 0.26 * grow;
  const W = 860;
  return (
    <V>
      <g transform="translate(540 470)" opacity={fade(f, 0)}>
        <Bill w={520} />
      </g>
      <g opacity={fade(f, 6)}>
        <rect x={110} y={760} width={W} height={200} rx={16} fill={C.white} stroke={C.ink} strokeWidth={8} />
        <rect x={110} y={760} width={W * cost} height={200} rx={16} fill="#8FBBD6" />
        <text x={110 + (W * cost) / 2} y={862} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.ink}>
          コスト
        </text>
        <text x={110 + W * cost + (W * (1 - cost)) / 2} y={862} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={Math.max(30, 60 - 30 * grow)} fill={C.red}>
          残り
        </text>
        <text x={970} y={1010} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.inkSoft}>
          ※ 割合はイメージ
        </text>
      </g>
      <rect x={0} y={0} width={1080} height={1920} fill="#0E1320" opacity={ease(f, d - 8, d)} />
    </V>
  );
}, { ...NO_HEAD });

/* E09 本編への別の疑問。最後は E01 の紙の色へ戻る */
const E09 = mk(({ f, s, d }) => (
  <>
    <Big
      y={820}
      dark
      lines={[
        { t: "では――", at: s(0), size: 70, color: "#C9C2B6" },
        { t: <>値段を<Red>上げれば</Red>、</>, at: s(1), size: 120, serif: true },
        { t: "いいのでは？", at: s(1) + 10, size: 120, serif: true },
      ]}
    />
    <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: ease(f, d - 6, d) }} />
  </>
), { ...NO_HEAD, dark: true, noCap: true });

export const SHORT1 = { E01, E02, E03, E04, E05, E06, E07, E08, E09 };
export { SERIF };
