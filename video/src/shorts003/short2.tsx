/**
 * CASE #003 ショート 2「映画館は、なぜポップコーンを売る？」
 * 0秒 弾けるポップコーン＋問い（文字）→ 主役は映画なのに → 答え: 席の数に限界 → 200席・上映中は入れ替えなし
 * → 売店なら一人の客が使う金額を増やせる＝客単価
 * → 本編への別の疑問「なぜポップコーンは、あんなに高いのか？」（本編のタイトルの問いへ）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { BLACK, C, Cup, FONT, Figure, Hook, LoopTo, NAVY, NIGHT, NO_HEAD, PopPile, SERIF, Seats, T, V, VELVET, WHITE, ease, fade, mk, pop } from "./parts";

/* Q01 0秒: カップに弾けるポップコーンと、問いの文字 */
const Q01 = mk(({ f }) => (
  <>
    <Hook lines={["映画館は、なぜ", <><Red>ポップコーン</Red>を売る？</>]} sizes={[88, 96]} />
    <V>
      <Cup x={540} y={1030} s={1.25} fill={ease(f, -10, 40)} />
      <PopPile at={-12} n={34} dur={70} cx={540} base={930} w={560} s={1.25} />
    </V>
    {[0, 9, 17, 26, 38, 52].map((k, i) => (
      <Sfx key={i} at={k} name="pop" volume={0.3} />
    ))}
  </>
), { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

/* Q02 主役は映画。なのに売店 */
const Q02 = mk(({ f, s }) => (
  <V>
    <rect x={90} y={400} width={900} height={420} rx={10} fill={T.screen} opacity={0.15 + 0.8 * ease(f, 0, 16)} />
    <text x={540} y={650} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={C.ink} opacity={fade(f, 6)}>
      主役は、映画
    </text>
    {Array.from({ length: 6 }, (_, i) => (
      <circle key={i} cx={140 + i * 160} cy={950} r={56} fill="#1A0507" />
    ))}
    <g opacity={fade(f, s(1))} transform={`translate(820 ${1120 - 30 * ease(f, s(1), s(1) + 12)})`}>
      <Cup x={0} y={0} s={0.45} fill={1} />
    </g>
    <text x={580} y={1140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={96} fill={T.butter} opacity={fade(f, s(1) + 8)}>
      なぜ？
    </text>
  </V>
), { ...NO_HEAD, bg: VELVET, dark: true });

/* Q03 答え（KEY） */
const Q03 = mk(({ s }) => (
  <Big
    y={800}
    dark
    lines={[
      { t: "売れる席の数には、", at: s(1), size: 96, serif: true },
      { t: <><Red>限界</Red>がある。</>, at: s(1) + 12, size: 150, serif: true },
    ]}
  />
), { ...NO_HEAD, bg: NIGHT, dark: true, hide: [1] });

/* Q04 BLUEPRINT: 200席が埋まる → 満席＝200枚 */
const Q04 = mk(({ f, s }) => (
  <V>
    <line x1={190} x2={890} y1={440} y2={440} stroke={T.bp} strokeWidth={12} strokeLinecap="round" opacity={fade(f, 0)} />
    <text x={540} y={410} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={T.bp} letterSpacing={6} opacity={fade(f, 0)}>
      SCREEN
    </text>
    <Seats at={s(0)} dur={s(1) - s(0) + 10} cols={20} rows={10} x0={180} y0={540} gap={35} />
    <text x={540} y={1040} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#FFFFFF" opacity={fade(f, s(1) + 10)}>
      満席 ＝ <tspan fill={C.red}>200枚</tspan>まで
    </text>
  </V>
), { ...NO_HEAD, bg: NAVY, dark: true, noCap: true });

/* Q05 上映中は、次の客を入れられない */
const Q05 = mk(({ f, s }) => (
  <V>
    <line x1={120} x2={960} y1={820} y2={820} stroke={T.bp} strokeWidth={4} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={140 + i * 290} y={700} width={240 * ease(f, i * 6, i * 6 + 20)} height={100} rx={12} fill={C.red} opacity={0.9} />
        <text x={260 + i * 290} y={880} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={T.bp}>
          上映
        </text>
      </g>
    ))}
    <g opacity={fade(f, s(1))}>
      <rect x={140} y={520} width={800} height={110} rx={55} fill="rgba(226,69,47,0.18)" stroke={C.red} strokeWidth={5} />
      <text x={540} y={594} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#FFFFFF">
        上映中は、入れ替えなし
      </text>
    </g>
  </V>
), { ...NO_HEAD, bg: NAVY, dark: true });

/* Q06 同じ座席、使う金額が違う */
const Q06 = mk(({ f, s }) => {
  const b = fade(f, s(1));
  const grow = ease(f, s(2), s(2) + 18);
  return (
    <V>
      <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.red} opacity={fade(f, s(2) + 12)}>
        座席は同じ。使う金額が違う
      </text>
      <text x={300} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink}>
        Aさん
      </text>
      <text x={780} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink}>
        Bさん
      </text>
      <Figure x={300} y={660} s={1.1} color="#5A6478" />
      <Figure x={780} y={660} s={1.1} color={C.ink} />
      <g opacity={b} transform="translate(930 600)">
        <Cup x={0} y={0} s={0.32} fill={1} />
      </g>
      <text x={300} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.inkSoft}>
        チケット
      </text>
      <text x={780} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.inkSoft} opacity={b}>
        チケット＋売店
      </text>
      <rect x={210} y={1180 - 120} width={180} height={120} rx={10} fill="#5A6478" />
      <rect x={690} y={1180 - 120 - 190 * grow} width={180} height={120 + 190 * grow} rx={10} fill={C.red} />
      <line x1={120} x2={960} y1={1180} y2={1180} stroke={C.line} strokeWidth={6} />
    </V>
  );
}, { ...NO_HEAD });

/* Q07 答え: 客単価 */
const Q07 = mk(({ f, s }) => (
  <V>
    <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.inkSoft} opacity={fade(f, s(0))}>
      一人の客が使う金額
    </text>
    <g transform={`translate(540 860) scale(${pop(f, s(1))})`}>
      <rect x={-340} y={-120} width={680} height={240} rx={120} fill={C.red} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={C.white}>
        客単価 ↑
      </text>
    </g>
  </V>
), { ...NO_HEAD, bg: WHITE, hide: [1] });

/* Q08 本編への別の疑問。最後は Q01 の黒へ戻る */
const Q08 = mk(({ f, s, d }) => (
  <>
    <V>
      <g transform={`translate(540 560) scale(${0.8 * pop(f, s(0))})`}>
        <Cup x={0} y={0} s={1} fill={1} />
      </g>
    </V>
    <Big
      y={1000}
      dark
      lines={[
        { t: "なぜポップコーンは、", at: s(1), size: 88, serif: true },
        { t: <>あんなに<Red>高い</Red>のか？</>, at: s(1) + 16, size: 120, serif: true },
      ]}
    />
    <LoopTo f={f} d={d} bg={BLACK} />
  </>
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

export const SHORT2 = { Q01, Q02, Q03, Q04, Q05, Q06, Q07, Q08 };
