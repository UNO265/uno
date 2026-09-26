/** K33–K39: FINAL MONEY FLOW（画面で）→ FINAL CLUE → 答え（先に）→ 最後の一文（最初の箱へ）→ 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lines, R, Stage, Veil, mk } from "../case002/ui";
import { Box, Easing, FONT, Figure, K, MoneyFlow5, SERIF, Sfx, T, Waybill, ease, fade, pop } from "./kit";

/* K33 FINAL MONEY FLOW: 全レーンを順に描き、最後に時間 → ¥。ナレーションは一行、字幕は隠す */
const K33 = mk(({ f, s }) => {
  const t0 = s(0);
  return (
    <Stage>
      <MoneyFlow5
        st={{
          entries: fade(f, t0 + 10),
          store: fade(f, t0 + 30),
          gain: fade(f, t0 + 60),
          carrier: fade(f, t0 + 90),
          hidden: 0,
          driver: fade(f, t0 + 120),
          handoff: fade(f, t0 + 150),
          timeToYen: ease(f, t0 + 200, t0 + 240),
        }}
      />
      <text x={960} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink} opacity={fade(f, t0)}>
        送料無料の MONEY FLOW
      </text>
    </Stage>
  );
}, { bg: "white", hideSubs: [0] });

/* K34 FINAL CLUE */
const K34 = mk(({ s }) => <Waybill no="FINAL" at={s(0) + 20} />, { bg: "paper", noSub: true });

/* K35 KEY: 答え（先に） */
const K35 = mk(({ f, s }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 140, fontFamily: SERIF }}>
    <div style={{ fontSize: 96, fontWeight: 900, color: K.ink, opacity: fade(f, s(0)) }}>
      答えは――<span style={{ color: K.red }}>無料ではない。</span>
    </div>
    <div style={{ fontSize: 64, fontWeight: 900, color: K.inkSoft, marginTop: 36, opacity: fade(f, s(1)) }}>送料は、消えていない。</div>
    <div style={{ display: "flex", gap: 120, marginTop: 50, opacity: fade(f, s(2)) }}>
      {["客", "店", "運ぶ人"].map((l, i) => (
        <div key={i} style={{ textAlign: "center", transform: `scale(${pop(f, s(2) + i * 8)})` }}>
          <svg width={140} height={150} viewBox="-70 -140 140 210">
            <circle cy={-90} r={40} fill={i === 2 ? T.night : K.ink} />
            <path d="M -70 60 C -70 -30 70 -30 70 60 Z" fill={i === 2 ? T.night : K.ink} />
          </svg>
          <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: K.ink }}>{l}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
), { bg: "white", noSub: true });

/* K36 OBJECT 回帰: 最初の箱。ステッカーがゆっくり透ける */
const K36 = mk(({ f, s }) => (
  <>
    <Stage>
      <Box x={960} y={700} s={0.9} ghost={ease(f, s(1), s(1) + 60, 0, 1, Easing.inOut(Easing.cubic))} />
    </Stage>
    <Lines
      dark
      y={-360}
      lines={[
        { t: "「送料無料」とは、送料が無い状態ではない。", at: s(0), size: 62 },
        { t: <>送料が、<R>見えなくなった</R>状態だ。</>, at: s(1), size: 88 },
      ]}
    />
  </>
), { bg: "black", noSub: true });

/* K37–K39: KANENAZO 固定エンディング */
const K37 = mk(
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

const K38 = mk(
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

const K39 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const FINALE5 = { K33, K34, K35, K36, K37, K38, K39 };
export { Figure };
