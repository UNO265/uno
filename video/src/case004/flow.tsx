/** N13–N22: 機械はどうやってお金を生む？ → MONEY FLOW ①②③ → 重要なのは何？ → 同じ機械で何度も → 1日1回 vs 何度も → CLUE 02「回るか」 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lines, Pill, R, Stage, mk } from "../case002/ui";
import { CareTag, Coin, Easing, FONT, K, LANES, MoneyLanes, SERIF, Sfx, T, Washer, ease, fade, pop } from "./kit";

/* N13 OBJECT: 投入口に硬貨が落ちる。「この機械は、どうやってお金を生む？」 */
const N13 = mk(({ f, s }) => {
  const drop = ease(f, s(1), s(1) + 22, 0, 1, Easing.in(Easing.quad));
  return (
    <>
      <Stage>
        <rect x={660} y={380} width={600} height={380} rx={30} fill={T.steelLight} stroke="#5E6878" strokeWidth={8} />
        <rect x={930} y={430} width={60} height={200} rx={20} fill="#2A3240" />
        <text x={960} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#3A4250">
          料金投入口
        </text>
        <g opacity={1 - ease(f, s(1) + 18, s(1) + 24)}>
          <Coin x={960} y={330 + 180 * drop} r={56} rot={f / 6} />
        </g>
      </Stage>
      <Lines dark y={-400} lines={[{ t: <>この機械は、どうやってお金を<R>生む</R>？</>, at: s(0), size: 80 }]} />
      <Sfx at={s(1) + 20} name="coin" volume={0.7} />
    </>
  );
}, { bg: "black", hideSubs: [0] });

/* N14 OBJECT: 客から見れば、入れて押すだけ → ＝利益？ × */
const N14 = mk(({ f, s }) => {
  const x = ease(f, s(3), s(3) + 12);
  return (
    <Stage>
      <Coin x={520} y={440} r={110} />
      <text x={760} y={470} fontFamily={FONT} fontWeight={900} fontSize={110} fill="#F4EEE3" opacity={fade(f, s(1))}>
        →
      </text>
      <g opacity={fade(f, s(1) + 10)}>
        <circle cx={1000} cy={440} r={90} fill={K.red} />
        <text x={1000} y={440} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#FFFFFF">
          START
        </text>
      </g>
      <text x={1400} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#F4EEE3" opacity={fade(f, s(3))}>
        ＝利益？
      </text>
      <g opacity={x}>
        <line x1={1200} y1={330} x2={1600} y2={560} stroke={K.red} strokeWidth={18} strokeLinecap="round" />
        <line x1={1600} y1={330} x2={1200} y2={560} stroke={K.red} strokeWidth={18} strokeLinecap="round" />
      </g>
    </Stage>
  );
}, { bg: "black" });

/* N15 MONEY FLOW ①: 一回ごと（水道・電気/ガス・洗剤） */
const N15 = mk(({ f, s }) => (
  <Stage>
    <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink} opacity={fade(f, 0)}>
      客が払ったお金は、どこへ？
    </text>
    <MoneyLanes show={[fade(f, 0), 0, 0]} itemAt={[[s(0), s(1), s(3)], [], []]} y0={330} />
    <text x={1380} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={T.lane1} opacity={fade(f, s(4))}>
      機械が一回動くたびに、かかる
    </text>
  </Stage>
), { bg: "white" });

/* N16 MONEY FLOW ②: 来ても来なくても（家賃・清掃・点検・修理・防犯/決済） */
const N16 = mk(({ f, s }) => (
  <Stage>
    <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
      客が払ったお金は、どこへ？
    </text>
    <MoneyLanes show={[1, fade(f, 0), 0]} itemAt={[[-99, -99, -99], [s(0), s(1), s(2), s(4)], []]} y0={330} />
    <text x={1380} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={T.lane2} opacity={fade(f, s(5))}>
      客が来ても来なくても、かかり続ける
    </text>
  </Stage>
), { bg: "white" });

/* N17 OBJECT: 忘れてはいけないもの＝機械そのもの */
const N17 = mk(({ f, s }) => {
  const spot = ease(f, s(1) - 6, s(1) + 10);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,246,216,${0.25 * spot}) 0%, transparent 45%)` }} />
      <Stage>
        <Washer x={960} y={500} s={1.0 * (0.9 + 0.1 * spot)} spin={0.4} o={0.4 + 0.6 * spot} />
        <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#C9B6F0" opacity={fade(f, s(1) + 10)}>
          設備
        </text>
      </Stage>
    </>
  );
}, { bg: "black" });

/* N18 MONEY FLOW ③: 三つを一枚に → 残るお金は「？」、「売上のほとんどが利益」ではない */
const N18 = mk(({ f, s }) => {
  const rest = fade(f, s(9));
  const no = ease(f, s(10), s(10) + 16);
  return (
    <>
      <Stage>
        <text x={960} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink} opacity={fade(f, s(0))}>
          最初の MONEY FLOW
        </text>
        <g transform="translate(-40 20) scale(0.92)">
          <MoneyLanes
            show={[fade(f, s(2)), fade(f, s(5)), fade(f, s(8))]}
            itemAt={[[s(2), s(3), s(4)], [s(5), s(6), s(7), s(7) + 6], [s(8)]]}
          />
        </g>
        <g opacity={rest} transform="translate(1500 640)">
          <rect x={-190} y={-60} width={380} height={120} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            残るお金 ？
          </text>
        </g>
      </Stage>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: no }}>
        <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 900, color: K.inkSoft, position: "relative" }}>
          「無人だから、売上のほとんどが利益」
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: K.red, transform: `scaleX(${no})`, transformOrigin: "left" }} />
        </div>
      </AbsoluteFill>
    </>
  );
}, { bg: "white", hideSubs: [2, 3, 4, 5, 6, 7, 10] });

/* N19 DARK: 本当に重要なのは？ */
const N19 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "このビジネスで、", at: s(0), size: 80 },
        { t: <>本当に<R>重要</R>なのは？</>, at: s(0) + 14, size: 116 },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* N20 FLAT: 小売は棚の商品が減る / 機械は同じ一台が何度も */
const N20 = mk(({ f, s }) => {
  const sold = Math.floor(ease(f, s(1), s(2), 0, 6));
  const runs = [s(4), s(7)].filter((t) => f >= t).length;
  return (
    <Stage>
      <text x={480} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
        普通の小売店
      </text>
      <rect x={200} y={260} width={560} height={420} rx={10} fill="none" stroke={K.ink} strokeWidth={6} />
      {[0, 1].map((row) => (
        <line key={row} x1={200} x2={760} y1={400 + row * 140} y2={400 + row * 140} stroke={K.ink} strokeWidth={5} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={240 + (i % 3) * 170} y={300 + Math.floor(i / 3) * 140} width={120} height={90} rx={10} fill={K.cost[i % 5]} opacity={i < 9 - sold ? 1 : 0.12} />
      ))}
      <text x={480} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
        売れた商品は、棚から消える
      </text>
      <line x1={960} x2={960} y1={180} y2={780} stroke={K.line} strokeWidth={5} />
      <text x={1440} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink} opacity={fade(f, s(2) - 6)}>
        コインランドリー
      </text>
      <g opacity={fade(f, s(2) - 6)}>
        <Washer x={1440} y={470} s={0.72} spin={f >= s(4) ? 1.2 : 0} />
        <text x={1440} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red} opacity={runs > 0 ? 1 : 0}>
          同じ機械で {runs} 回目の売上
        </text>
      </g>
      {[s(5), s(8)].map((t, i) => (
        <g key={i} opacity={fade(f, t) * (1 - ease(f, t + 20, t + 34))} transform={`translate(${1700} ${420 - 80 * ease(f, t, t + 30)})`}>
          <Coin x={0} y={0} r={42} />
        </g>
      ))}
    </Stage>
  );
}, { hideSubs: [3, 4, 5, 6, 7, 8] });

/* N21 GRAPH: 同じ機械でも、1日1回と何度も → 売上がまったく違う（※イメージ） */
const N21 = mk(({ f, s }) => {
  const many = Math.floor(ease(f, s(2), s(2) + 50, 0, 6));
  const idle = fade(f, s(6));
  return (
    <Stage>
      <text x={1840} y={80} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={28} fill={K.inkSoft}>
        ※ イメージ
      </text>
      {[560, 1360].map((x, i) => (
        <g key={i} opacity={fade(f, s(1 + i))}>
          <Washer x={x} y={330} s={0.5} spin={i === 0 ? (idle > 0.5 ? 0 : 0.4) : 1.3} />
          <text x={x} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            {i === 0 ? "1日に1回" : "1日に何度も"}
          </text>
          <line x1={x - 220} x2={x + 220} y1={830} y2={830} stroke={K.ink} strokeWidth={5} />
          {Array.from({ length: i === 0 ? 1 : many }, (_, k) => (
            <rect key={k} x={x - 90} y={830 - (k + 1) * 44} width={180} height={38} rx={6} fill={i === 0 ? K.inkSoft : K.red} />
          ))}
        </g>
      ))}
      <text x={960} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.inkSoft} opacity={fade(f, s(3))}>
        機械は同じ・家賃も設備もほぼ同じ
      </text>
      <text x={560} y={440 + 150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.red} opacity={idle}>
        止まっている間は、売上ゼロ
      </text>
    </Stage>
  );
}, { bg: "white", hideSubs: [1, 2] });

/* N22 GRAPH → CLUE 02: 回転カウンター → 「回るか」 */
const N22 = mk(({ f, s }) => {
  const n = Math.floor(ease(f, s(1), s(3), 0, 12));
  const tag = fade(f, s(3) - 4);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - tag }}>
        <Stage>
          <Washer x={700} y={470} s={0.9} spin={1.5} />
          <text x={1300} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={K.inkSoft} opacity={fade(f, s(0))}>
            持っている「だけ」ではない
          </text>
          <text x={1300} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={K.red} opacity={fade(f, s(1))}>
            {n}
            <tspan fontSize={80}>回</tspan>
          </text>
          <text x={1300} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft} opacity={fade(f, s(2))}>
            料金を払って、動いた回数
          </text>
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: tag }}>
        <CareTag no="2" at={s(3)} />
      </AbsoluteFill>
    </>
  );
}, { bg: "white", hideSubs: [3] });

export const FLOW4 = { N13, N14, N15, N16, N17, N18, N19, N20, N21, N22 };
export { LANES, pop, SERIF };
