/** N45–N53: 一つの流れに → FINAL MONEY FLOW → 最初の問い → 答え（先に）→ 理由 → FINAL CLUE「機械で時間を売る店」→ 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lines, Pill, R, Stage, Veil, mk } from "../case002/ui";
import { CareTag, Clock, Coin, Easing, FONT, K, MoneyLanes, NightStore, SERIF, Sfx, T, Washer, ease, fade, pop } from "./kit";

/* N45 MONEY FLOW: お金・機械・時間の三つが中央に集まる */
const N45 = mk(({ f, s }) => {
  const g = ease(f, s(1), s(1) + 30, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Stage>
      <g transform={`translate(${460 + 500 * g} 460)`} opacity={fade(f, s(0))}>
        <Coin x={0} y={0} r={90} />
      </g>
      <g opacity={fade(f, s(0) + 10)}>
        <Washer x={960} y={420 - 60 * g} s={0.55} />
      </g>
      <g transform={`translate(${1460 - 500 * g} 460)`} opacity={fade(f, s(1))}>
        <Clock x={0} y={0} r={90} speed={3} />
      </g>
      <text x={960} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink} opacity={fade(f, s(1) + 20)}>
        一つの流れに
      </text>
    </Stage>
  );
}, { bg: "white" });

/* N46 FINAL MONEY FLOW: 客の価値 → 料金 → 三つのレーン → 次の客でもう一度 */
const N46 = mk(({ f, s }) => {
  const loop = fade(f, s(5));
  const runs = [s(6), s(7)].filter((t) => f >= t).length;
  return (
    <Stage>
      <g opacity={fade(f, s(0))}>
        <rect x={60} y={100} width={420} height={170} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
        <text x={270} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
          客が買うもの
        </text>
        <text x={270} y={225} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.red}>
          大容量・乾燥・時間
        </text>
      </g>
      <g transform="translate(40 40) scale(0.92)">
        <MoneyLanes show={[fade(f, s(2)), fade(f, s(3)), fade(f, s(4))]} itemAt={[[s(2), s(2) + 8, s(2) + 16], [s(3), s(3) + 8, s(3) + 16, s(3) + 24], [s(4)]]} y0={330} gap={170} />
      </g>
      <g opacity={loop}>
        <path d="M 1380 720 C 1700 740 1820 520 1660 420" fill="none" stroke={K.red} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={-f * 3} />
        <text x={1560} y={810} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.red}>
          次の客で、もう一度 ×{runs + 1}
        </text>
      </g>
      <text x={960} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink} opacity={fade(f, s(8))}>
        コインランドリーの MONEY FLOW
      </text>
    </Stage>
  );
}, { bg: "white", hideSubs: [8] });

/* N47 DARK: 最初の問い（N01 と同じ文） */
const N47 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "コインランドリーは、", at: s(1), size: 74 },
        { t: <>人がいないのに、なぜ<R>儲かる</R>？</>, at: s(1) + 8, size: 100 },
      ]}
    />
  ),
  { bg: "night", hideSubs: [1] },
);

/* N48 KEY: 答えを先に */
const N48 = mk(({ f, s }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: SERIF }}>
    <div style={{ fontSize: 64, fontWeight: 900, color: K.inkSoft, opacity: fade(f, s(0)) }}>人件費が少ないから、だけではない。</div>
    <div style={{ fontSize: 74, fontWeight: 900, color: K.ink, marginTop: 40, lineHeight: 1.45, textAlign: "center", opacity: fade(f, s(1)) }}>
      客の<R>時間と手間</R>を減らす機械を、
      <br />
      <R>選ばれる場所</R>で、何度も回し続けられるから。
    </div>
  </AbsoluteFill>
), { bg: "white", noSub: true });

/* N49 FLAT: 理由（設備は無料ではない / 来なければ0円 / 選ばれない機械は止まる / 需要と店づくり） */
const N49 = mk(({ f, s }) => (
  <Stage>
    <Pill x={520} y={300} text="人が少ない＝特徴の一つ" at={s(0)} size={44} color={K.inkSoft} />
    <Pill x={1400} y={300} text="設備は無料ではない" at={s(1)} size={44} color={K.ink} />
    <Pill x={520} y={500} text="客が来なければ 0円" at={s(1) + 20} size={44} color={K.ink} />
    <Pill x={1400} y={500} text="選ばれない機械は止まる" at={s(2)} size={44} color={K.red} />
    <g opacity={fade(f, s(3))}>
      <text x={960} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
        回しているのは、「時間を減らしたい」需要と、選ばれる店づくり
      </text>
    </g>
  </Stage>
), { hideSubs: [1, 2, 3] });

/* N50 BLUEPRINT → FINAL CLUE: 夜の店に戻り、ドラムが回る → 「機械で時間を売る店」 */
const N50 = mk(({ f, s }) => {
  const tag = fade(f, s(3) - 4);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - tag }}>
        <Stage>
          <NightStore lit={1} inside={1} y={470} />
          <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={T.glow} opacity={fade(f, s(2))}>
            機械が働き、客は時間を買い、機械が繰り返し使われる
          </text>
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: tag }}>
        <CareTag no="FINAL" at={s(3)} />
      </AbsoluteFill>
    </>
  );
}, { bg: "blueprint", hideSubs: [2, 3] });

/* N51–N53: KANENAZO 固定エンディング */
const N51 = mk(
  ({ s }) => (
    <Lines
      lines={[
        { t: "身近なお金には、", at: s(0), size: 84, serif: false },
        { t: <>まだまだ<R>謎</R>がある。</>, at: s(0) + 26, size: 112, serif: false },
      ]}
    />
  ),
  { noSub: true },
);

const N52 = mk(
  ({ f, s }) => {
    const p = ease(f, s(0), s(0) + 16, 0, 1, Easing.out(Easing.back(1.6)));
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 100, fontFamily: FONT }}>
          <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
            <div style={{ fontSize: 170, fontWeight: 900, color: K.ink, letterSpacing: 28 }}>KANENAZO</div>
            <div style={{ display: "inline-block", marginTop: 8, background: K.red, color: K.white, fontSize: 48, fontWeight: 900, letterSpacing: 16, padding: "4px 30px", borderRadius: 12 }}>カネナゾ</div>
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: K.inkSoft, letterSpacing: 10, marginTop: 44, opacity: ease(f, s(2), s(2) + 12) }}>身近なお金の謎を解く。</div>
        </AbsoluteFill>
        <Sfx at={s(0)} name="jingle" volume={0.8} />
      </>
    );
  },
  { noSub: true },
);

const N53 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const FINALE4 = { N45, N46, N47, N48, N49, N50, N51, N52, N53 };
export { pop };
