/** M40–M49: MONEY FLOW 完成 → 答え（FINAL CLUE）→ 今の変化 → 逆転 → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FlowLine, Lines, Pill, R, Stage, Veil, mk } from "../case002/ui";
import { Aroma, ClueStub, Cup, Easing, Figure, FONT, K, SERIF, Sfx, T, ease, fade, pop } from "./kit";

/* M40 DARK: 転換の一文 */
const M40 = mk(
  ({ s }) => <Lines dark lines={[{ t: "追いかけてきたお金を、一つに。", at: s(0), size: 90 }]} />,
  { bg: "black", noSub: true },
);

/* M41 MONEY FLOW 完成: 二つの流れが映画館を支える */
const M41 = mk(({ f, s }) => {
  const merge = fade(f, s(5) - 4);
  return (
    <Stage>
      {/* 上: チケットの流れ */}
      <g opacity={fade(f, s(0))}>
        <Pill x={220} y={260} text="観客" at={s(0)} size={44} color={K.ink} />
        <FlowLine d="M 320 260 L 520 260" at={s(0) + 6} color={K.inkSoft} w={10} />
        <Pill x={640} y={260} text="チケット" at={s(0) + 10} size={44} color={T.velvet} />
        <FlowLine d="M 780 260 L 960 260" at={s(1)} color={K.inkSoft} w={10} />
        <Pill x={1080} y={260} text="映画館" at={s(1)} size={44} color={K.red} />
        <FlowLine d="M 1200 260 L 1380 200" at={s(1) + 16} color={K.inkSoft} w={8} />
        <FlowLine d="M 1200 260 L 1380 330" at={s(1) + 22} color={K.inkSoft} w={8} />
        <Pill x={1560} y={190} text="配給会社" at={s(1) + 16} size={40} color={K.inkSoft} />
        <Pill x={1560} y={340} text="製作側" at={s(1) + 22} size={40} color={K.inkSoft} />
      </g>
      {/* 下: 売店の流れ */}
      <g opacity={fade(f, s(2))}>
        <Pill x={220} y={560} text="観客" at={s(2)} size={44} color={K.ink} />
        <FlowLine d="M 320 560 L 520 560" at={s(2) + 6} color={K.brothDeep} w={10} />
        <Pill x={640} y={560} text="ポップコーン" at={s(2) + 10} size={40} color={K.brothDeep} />
        <FlowLine d="M 790 560 L 960 560" at={s(3)} color={K.brothDeep} w={10} />
        {["トウモロコシ", "オイル", "容器", "人件費"].map((t, i) => (
          <Pill key={i} x={1060 + i * 190} y={480} text={t} at={s(3) + i * 8} size={28} color={K.soy} />
        ))}
        <FlowLine d="M 960 560 L 1080 660" at={s(4)} color={K.red} w={12} />
        <Pill x={1240} y={680} text="映画館を動かすお金" at={s(4)} size={40} color={K.red} />
      </g>
      {/* 合流: 映画館を支えるもの */}
      <g opacity={merge}>
        <rect x={260} y={780} width={1400} height={120} rx={20} fill={K.ink} />
        <text x={960} y={840} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.paper}>
          スクリーン・座席・音響・スタッフ・平日の昼の上映
        </text>
        <FlowLine d="M 1000 290 C 860 380 760 620 700 780" at={s(5)} color={K.inkSoft} w={8} />
        <FlowLine d="M 1240 720 L 1240 780" at={s(5) + 6} color={K.red} w={10} />
      </g>
      <text x={1840} y={1050} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft}>
        MONEY FLOW
      </text>
    </Stage>
  );
}, { hideSubs: [0, 2, 3, 5, 6] });

/* M42 DARK: 最初の問いに戻る */
const M42 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "映画館のポップコーンは、", at: s(1), size: 90 },
        { t: <>なぜこんなに<R>高い</R>のか。</>, at: s(1) + 16, size: 118 },
      ]}
    />
  ),
  { bg: "night", hideSubs: [1] },
);

/* M43 FINAL CLUE + 答え（答えを先に） */
const M43 = mk(({ f, s }) => {
  const clue = fade(f, s(3) - 10);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - clue }}>
        <Lines
          dark
          gap={24}
          lines={[
            { t: <>答えは、<R>トウモロコシの値段ではない</R>。</>, at: s(0), size: 84 },
            { t: "チケットと違い、映画館自身の売上になりやすい。", at: s(1), size: 58, serif: false, weight: 800, color: "#E9E4DA" },
            { t: "限られた座席の中で、一人の客が使う金額を増やす。", at: s(2), size: 58, serif: false, weight: 800, color: "#E9E4DA" },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: clue }}>
        <ClueStub no="FINAL" at={s(3) - 10} />
      </AbsoluteFill>
    </>
  );
}, { bg: "velvet", noSub: true });

/* M44 FLAT: 今の変化（コスト↑・チケット↑・来場者？ → 一人あたりの金額） */
const M44 = mk(({ f, s }) => {
  const A = [
    { t: "建物を保つコスト", at: s(1), up: true },
    { t: "チケット代", at: s(1) + 20, up: true },
    { t: "来場者", at: s(2), up: false },
  ];
  return (
    <Stage>
      {A.map((a, i) => {
        const x = 420 + i * 540;
        const p = ease(f, a.at, a.at + 20, 0, 1, Easing.out(Easing.back(1.4)));
        return (
          <g key={i} opacity={fade(f, a.at)} transform={`translate(${x} 520)`}>
            <path
              d={a.up ? `M 0 140 L 0 ${140 - 260 * p} M -60 ${200 - 260 * p} L 0 ${140 - 260 * p} L 60 ${200 - 260 * p}` : `M 0 -120 L 0 ${-120 + 200 * p} M -60 ${-180 + 200 * p} L 0 ${-120 + 200 * p} L 60 ${-180 + 200 * p}`}
              stroke={a.up ? K.red : K.inkSoft}
              strokeWidth={28}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
              {a.t}
            </text>
            {!a.up && (
              <text y={-170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.inkSoft}>
                ？
              </text>
            )}
          </g>
        );
      })}
      <g opacity={fade(f, s(3))}>
        <rect x={360} y={860} width={1200} height={120} rx={60} fill={K.red} />
        <text x={960} y={922} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.white}>
          一人の客が売店で使う金額 ＝ 大切な数字
        </text>
      </g>
    </Stage>
  );
}, { hideSubs: [3, 4] });

/* M45 VELVET: 逆転 — スクリーンの外のビジネス */
const M45 = mk(({ f, s }) => {
  const out = fade(f, s(3));
  const ITEMS = [
    { t: "ポップコーン", at: s(4), x: 300, y: 750 },
    { t: "ドリンク", at: s(5), x: 760, y: 790 },
    { t: "フード", at: s(6), x: 1180, y: 790 },
    { t: "過ごす時間", at: s(7), x: 1620, y: 750 },
  ];
  return (
    <Stage>
      <rect x={460} y={140} width={1000} height={420} rx={10} fill={T.screen} opacity={0.9 - 0.3 * out} />
      <text x={960} y={380} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={96} fill={K.ink} opacity={fade(f, s(1)) * (1 - 0.6 * out)}>
        映画
      </text>
      {ITEMS.map((it, i) => (
        <Pill key={i} x={it.x} y={it.y} text={it.t} at={it.at} size={48} color={T.butter} fill="#3A0A0E" />
      ))}
      <text x={960} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={T.butter} opacity={fade(f, s(8))}>
        映画を入口に、空間と体験をビジネスに
      </text>
    </Stage>
  );
}, { bg: "velvet", hideSubs: [4, 5, 6, 7, 8] });

/* M46 OBJECT: 冒頭のポップコーンに戻る */
const M46 = mk(({ f, s, d }) => (
  <>
    <Stage>
      <Cup x={960} y={560} s={1.05} fill={1} />
      <Aroma x={960} y={330} o={0.7} />
    </Stage>
    <Lines dark y={380} lines={[{ t: "「映画を見る場所」を、明日も開けておくために。", at: s(3), size: 56 }]} />
    <Veil o={ease(f, d - 12, d)} color="#070707" />
  </>
), { bg: "black", hideSubs: [3] });

/* M47–M49: KANENAZO 固定エンディング */
const M47 = mk(
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

const M48 = mk(
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

const M49 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const FINALE3 = { M40, M41, M42, M43, M44, M45, M46, M47, M48, M49 };
export { Figure, pop };
