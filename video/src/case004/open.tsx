/** N01–N12: 問い（0秒）→ 夜の店 → 店員0・レジ0 → 家にも洗濯機、なのに1000億円超 → QUESTION 1 → TITLE → 人件費？ → 半分は正しい → 設備の店（CLUE 01） */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lines, Pill, R, Stage, count, mk, yen } from "../case002/ui";
import { CareTag, Coin, Easing, FONT, Figure, HomeWasher, K, NightStore, SERIF, Sfx, T, Washer, Dryer, ease, fade, pop } from "./kit";

/* N01 OBJECT: 0 フレームからドラムが回り、問いが画面に出ている（BGM なし） */
const N01 = mk(
  ({ f }) => (
    <>
      <Stage>
        <g transform={`translate(0 ${-8 * ease(f, 0, 140)})`}>
          <Washer x={960} y={690} s={1.25 + 0.05 * ease(f, 0, 140)} spin={1.4} />
        </g>
      </Stage>
      <Lines
        dark
        y={-380}
        lines={[
          { t: "コインランドリーは、", at: -16, size: 74 },
          { t: <>人がいないのに、なぜ<R>儲かる</R>？</>, at: -8, size: 100 },
        ]}
      />
    </>
  ),
  { bg: "black", noSub: true },
);

/* N02 BLUEPRINT: 夜の街に明るい店。中には洗濯機と乾燥機 */
const N02 = mk(({ f, s }) => (
  <Stage>
    <NightStore at={0} lit={ease(f, s(0), s(0) + 20)} inside={fade(f, s(1))} y={470} s={1} />
  </Stage>
), { bg: "blueprint" });

/* N03 BLUEPRINT: 店員 0・レジ 0。それでも回る */
const N03 = mk(({ f, s }) => {
  const gone = ease(f, s(0) + 10, s(0) + 26);
  return (
    <Stage>
      <NightStore lit={1} inside={1} people={1 - gone} y={470} />
      <g opacity={fade(f, s(0) + 20)}>
        <Pill x={620} y={880 - 120} text="店員 0" at={s(0) + 20} size={50} color="#FFFFFF" fill={K.red} />
      </g>
      <Pill x={1300} y={760} text="レジ 0" at={s(1)} size={50} color="#FFFFFF" fill={K.red} />
    </Stage>
  );
}, { bg: "blueprint", hideSubs: [1] });

/* N04 DATA: 家にも洗濯機 → それなのに 1000億円超 */
const N04 = mk(({ f, s }) => {
  const n = count(f, s(1) + 20, 40, 0, 1000);
  return (
    <Stage>
      <HomeWasher x={430} y={470} s={1.05} />
      <text x={430} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft}>
        家にも洗濯機
      </text>
      <g opacity={fade(f, s(1))}>
        <text x={1320} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.inkSoft}>
          コインランドリーで動くお金
        </text>
        <text x={1320} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={K.red}>
          {yen(n)}
          <tspan fontSize={90}>億円超</tspan>
        </text>
      </g>
    </Stage>
  );
}, { bg: "white" });

/* N05 DARK: QUESTION 1 */
const N05 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "人がいない店は、", at: s(0), size: 84 },
        { t: <>何で<R>儲けている</R>？</>, at: s(0) + 14, size: 116 },
        { t: "まず、いちばん分かりやすい答えから", at: s(1), size: 48, serif: false, weight: 700, color: "#B8C2D4" },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* N06 TITLE */
const N06 = mk(
  ({ f, s }) => {
    const a = ease(f, 0, 14);
    const b = ease(f, s(1), s(1) + 16);
    const line = ease(f, s(1) + 10, s(1) + 40);
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: a }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 14, color: "#B8C2D4" }}>KANENAZO</div>
            <div style={{ background: K.red, color: K.white, fontWeight: 900, fontSize: 38, letterSpacing: 4, padding: "4px 18px", borderRadius: 8 }}>CASE #004</div>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#F4EEE3", marginTop: 44, opacity: b, letterSpacing: 4 }}>コインランドリー、</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 112, color: "#F4EEE3", opacity: b, letterSpacing: 4 }}>
            人がいないのになぜ<span style={{ color: T.glow }}>儲かる？</span>
          </div>
          <div style={{ height: 8, width: 1200 * line, background: K.red, borderRadius: 4, marginTop: 26 }} />
        </AbsoluteFill>
        <Sfx at={s(1)} name="jingle" volume={0.8} />
      </>
    );
  },
  { bg: "night", noSub: true },
);

/* N07 DARK: 人がいないから？ それとも別の仕組み？ */
const N07 = mk(({ f, s }) => {
  const split = ease(f, s(1), s(1) + 18, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: SERIF }}>
      <div style={{ display: "flex", gap: 120 * split + 40, alignItems: "center" }}>
        <div style={{ fontSize: 86, fontWeight: 900, color: "#F4EEE3", opacity: fade(f, s(0)) }}>人がいないから？</div>
        <div style={{ fontSize: 86, fontWeight: 900, color: T.glow, opacity: split }}>別の仕組み？</div>
      </div>
    </AbsoluteFill>
  );
}, { bg: "night", hideSubs: [0] });

/* N08 KEY: 人件費 */
const N08 = mk(({ f, s }) => (
  <>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90, fontFamily: FONT }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: K.inkSoft, opacity: fade(f, s(0)) }}>いちばん分かりやすい答え</div>
      <div style={{ fontSize: 230, fontWeight: 900, color: K.ink, transform: `scale(${pop(f, s(1))})`, letterSpacing: 10 }}>人件費</div>
    </AbsoluteFill>
    <Sfx at={s(1)} name="stamp" volume={0.6} />
  </>
), { bg: "white", hideSubs: [1] });

/* N09 FLAT: 人がやっていた仕事を、機械が代わりに */
const N09 = mk(({ f, s }) => {
  const swap = ease(f, s(3), s(3) + 20);
  const STEPS = ["入れる", "払う", "取り出す"];
  return (
    <Stage>
      <g opacity={1 - fade(f, s(1))}>
        <text x={960} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
          普通の店
        </text>
        {[560, 960, 1360].map((x, i) => (
          <g key={i}>
            <Figure x={x} y={520} s={1.2} color={K.ink} />
            <text x={x} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={K.inkSoft}>
              {["売る", "接客", "サービス"][i]}
            </text>
          </g>
        ))}
      </g>
      <g opacity={fade(f, s(1))}>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
          コインランドリー
        </text>
        {STEPS.map((t, i) => (
          <g key={i} opacity={fade(f, s(2) + i * 12)}>
            <Figure x={380 + i * 260} y={470} s={0.9} color="#5A6478" />
            <text x={380 + i * 260} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
              {t}
            </text>
            <text x={380 + i * 260} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={K.inkSoft}>
              客が自分で
            </text>
          </g>
        ))}
        <g opacity={swap}>
          <Washer x={1380} y={450} s={0.62} />
          <Dryer x={1640} y={450} s={0.5} />
          <text x={1510} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.red}>
            洗う・乾かす＝機械
          </text>
        </g>
      </g>
    </Stage>
  );
});

/* N10 KEY: 「人件費が少ないから儲かる」→ 半分は、正しい */
const N10 = mk(({ f, s }) => {
  const st = pop(f, s(1), 14);
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: SERIF }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: K.ink, opacity: fade(f, s(0)) }}>「人件費が少ないから儲かる」</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 260 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 84,
            fontWeight: 900,
            color: K.red,
            border: `10px solid ${K.red}`,
            borderRadius: 18,
            padding: "0 40px",
            transform: `rotate(-6deg) scale(${st})`,
            opacity: Math.min(1, st * 1.4),
          }}
        >
          半分は、正しい
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "white", noSub: true });

/* N11 OBJECT: 人の代わりに、大型の機械がずらり（無料ではない・設置して終わりではない） */
const N11 = mk(({ f, s }) => {
  const pan = ease(f, s(2) - 10, s(2) + 90, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Stage>
      <g transform={`translate(${-520 * pan} 0)`}>
        {Array.from({ length: 7 }, (_, i) => (i % 2 === 0 ? <Washer key={i} x={420 + i * 330} y={520} s={0.78} spin={1} /> : <Dryer key={i} x={420 + i * 330} y={500} s={0.66} />))}
      </g>
      <g opacity={fade(f, s(3))}>
        <Pill x={600} y={130} text="無料ではない" at={s(3)} size={50} color={K.red} />
      </g>
      <Pill x={1320} y={130} text="設置して終わり、ではない" at={s(4)} size={46} color="#FFFFFF" fill={K.inkSoft} />
      <text x={960} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={T.glow} opacity={fade(f, s(5) + 10)}>
        客が来なくても、機械はそこにある
      </text>
    </Stage>
  );
}, { bg: "black", hideSubs: [3, 4, 5] });

/* N12 CLUE 01 */
const N12 = mk(({ s }) => <CareTag no="1" at={s(0) + 10} />, { bg: "night", noSub: true });

export const OPEN4 = { N01, N02, N03, N04, N05, N06, N07, N08, N09, N10, N11, N12 };
export { Coin };
