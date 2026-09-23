/** S48–S64: 価格帯の分化 → 最初の問いに戻る → 答え → MONEY FLOW → FINAL CLUE → エンディング */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  Bill, Bowl, CLUE_SHORT, EvidenceMark, FlowLine, K, Lines, MiniTicket, MoneyBar, Pill, R, SERIF, Sfx, Shop, Stage, Stock, Tag, Ticket, Veil,
  ease, fade, mk, pop,
} from "./ui";
import { FIVE } from "./open";
import { FONT } from "../theme";

const MARK = "帝国データバンク ラーメン店市場動向調査（2025年度）";

/* S48 A: CLUE の食券が脇へ → 道が分かれる */
const S48 = mk(({ f, s }) => {
  const road = ease(f, s(5), s(6) + 20, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 180, display: "flex", flexDirection: "column", gap: 18, opacity: 1 - road }}>
        {Array.from({ length: 5 }, (_, i) => (
          <MiniTicket key={i} i={i} />
        ))}
      </div>
      <Stage>
        <g opacity={1 - road}>
          {[0, 1].map((k) => (
            <g key={k}>
              <Bowl x={k ? 1480 : 820} y={520} s={0.5} steam={0.4} />
              <rect x={(k ? 1480 : 820) - 170} y={700} width={340} height={50} rx={10} fill={K.mist} />
              <rect x={(k ? 1480 : 820) - 170} y={700} width={k ? 20 : 70} height={50} rx={10} fill={K.red} opacity={fade(f, s(3))} />
            </g>
          ))}
        </g>
        <g opacity={road}>
          <path d="M 960 1000 L 960 700" stroke={K.ink} strokeWidth={30} strokeLinecap="round" />
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M 960 700 C 960 560 ${960 + k * 420} 520 ${960 + k * 560} 260`} stroke={K.ink} strokeWidth={24} fill="none" strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - road)} />
          ))}
        </g>
      </Stage>
    </>
  );
});

/* S49–S51 D: 三つの価格帯（境界の金額は示さない） */
const TIERS = [
  { name: "低価格帯", key: "安さと効率", color: "#3E7BA6" },
  { name: "1000円前後", key: "選ばれる理由", color: K.inkSoft },
  { name: "高価格・\nプレミアム帯", key: "付加価値", color: K.brothDeep },
];
const Tiers: React.FC<{ at: number[]; keys?: number[]; squeeze?: number; mark?: boolean }> = ({ at, keys, squeeze = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 - squeeze * 30 }}>
        {TIERS.map((t, i) => {
          const p = ease(f, at[i], at[i] + 16, 0, 1, Easing.out(Easing.cubic));
          const mid = i === 1;
          const w = mid ? 440 - squeeze * 120 : 440 + squeeze * 30;
          const h = [360, 480, 600][i];
          const k = keys ? ease(f, keys[i], keys[i] + 12) : 0;
          return (
            <div key={i} style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
              <div style={{ fontSize: 60, fontWeight: 900, color: t.color, opacity: k, marginBottom: 24, whiteSpace: "nowrap", transform: `translateY(${(1 - k) * 20}px)` }}>{t.key}</div>
              <div
                style={{
                  width: "100%",
                  height: h * p,
                  background: mid && squeeze > 0 ? `repeating-linear-gradient(135deg, ${t.color} 0 24px, #6B7489 24px 48px)` : t.color,
                  borderRadius: "18px 18px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: K.white,
                  fontSize: 54,
                  fontWeight: 900,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  lineHeight: 1.25,
                }}
              >
                {t.name}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ width: 1500, height: 6, background: K.ink, opacity: 0.7 }} />
    </AbsoluteFill>
  );
};

const S49 = mk(
  ({ f, s }) => (
    <>
      <Tiers at={[s(0), s(1), s(3)]} />
      <EvidenceMark no="#02" source={MARK} at={s(0)} />
    </>
  ),
  { hideSubs: [0, 1, 3] },
);
const S50 = mk(({ s }) => <Tiers at={[-30, -30, -30]} keys={[s(0), s(1), s(3)]} />);
const S51 = mk(({ f, s }) => {
  const sq = ease(f, s(3), s(5) + 20, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <Tiers at={[-30, -30, -30]} keys={[-30, -30, -30]} squeeze={sq} />
      <Stage>
        <g opacity={fade(f, s(3))}>
          <path d={`M ${380 + 60 * sq} 300 l 120 0 m -40 -40 l 40 40 l -40 40`} stroke={K.ink} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g opacity={fade(f, s(5))}>
          <path d={`M ${1540 - 60 * sq} 300 l -120 0 m 40 -40 l -40 40 l 40 40`} stroke={K.ink} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Stage>
    </>
  );
});

/* S52 G: 1000円という価格そのものが、新しい競争の真ん中にいる */
const S52 = mk(
  ({ s }) => (
    <Lines
      gap={16}
      lines={[
        { t: "1000円という価格そのものが、", at: s(1), size: 86 },
        { t: <>新しい競争の<R>真ん中</R>にいる。</>, at: s(3), size: 108 },
      ]}
    />
  ),
  { bg: "white", noSub: true },
);

/* S53 F: 最初の質問に戻る（S05 の画面を再現） */
const S53 = mk(
  ({ f, s }) => {
    const Big = ({ at, out, text, color = "#F4EEE3", size = 200 }: { at: number; out: number; text: string; color?: string; size?: number }) => (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color, opacity: ease(f, at, at + 10) * (1 - ease(f, out, out + 8)) }}>{text}</div>
      </AbsoluteFill>
    );
    return (
      <>
        <Lines
          dark
          y={-60}
          lines={[
            { t: "ラーメン一杯1000円。", at: s(2), size: 80, out: s(4) - 4 },
            { t: <>店には、<R>いくら残る？</R></>, at: s(3), size: 110, out: s(4) - 4 },
          ]}
        />
        <Big at={s(4)} out={s(5) - 3} text="100円？" />
        <Big at={s(5)} out={s(6) - 3} text="200円？" />
        <Big at={s(7)} out={9999} text="もっと少ない？" size={140} color={K.red} />
      </>
    );
  },
  { bg: "night", hideSubs: [2, 3, 4, 5, 7] },
);

/* S54 D: 答えは、メニューの値段には書かれていない（店ごとに違う五つの理由） */
const S54 = mk(({ f, s }) => {
  const R5 = ["食材", "家賃", "人件費", "杯数", "仕組み"];
  const menu = fade(f, s(1));
  const shops = fade(f, s(2) - 4);
  return (
    <Stage>
      <g opacity={menu * (1 - shops)}>
        <rect x={610} y={220} width={700} height={560} rx={16} fill={K.nori} />
        <text x={960} y={330} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={70} fill={K.paper}>
          お品書き
        </text>
        <text x={760} y={500} fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.paper}>
          ラーメン
        </text>
        <text x={1180} y={500} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.paper}>
          1000円
        </text>
        <text x={760} y={630} fontFamily={SERIF} fontWeight={900} fontSize={60} fill="rgba(244,238,227,0.4)">
          店に残る額
        </text>
        <text x={1180} y={630} textAnchor="end" fontFamily={SERIF} fontWeight={900} fontSize={60} fill="rgba(244,238,227,0.4)">
          ？
        </text>
      </g>
      <g opacity={shops}>
        {R5.map((r, i) => {
          const x = 250 + i * 355;
          const on = f >= s([2, 3, 4, 5, 7][i]);
          const prof = [44, 20, 64, 30, 12][i];
          return (
            <g key={i}>
              <Shop x={x} y={380} s={0.55} color={[K.red, "#3E7BA6", K.negi, K.brothDeep, K.soy][i]} />
              <rect x={x - 130} y={560} width={260} height={46} rx={8} fill={K.mist} />
              <rect x={x + 130 - prof} y={560} width={prof} height={46} rx={8} fill={K.red} />
              <Pill x={x} y={700} text={`${r}が違う`} at={s([2, 3, 4, 5, 7][i])} size={36} color={on ? K.ink : K.line} />
            </g>
          );
        })}
      </g>
    </Stage>
  );
});

/* S55 G: はっきり言えること（答え） */
const S55 = mk(
  ({ f, s }) => {
    const bar = fade(f, s(2)) * (1 - fade(f, s(5) - 6));
    return (
      <>
        <Stage>
          <g opacity={bar}>
            <MoneyBar y={520} parts={FIVE.map((p) => ({ ...p, at: s(2) }))} rest={{ label: "ほんの一部", at: s(3), glow: s(3) + 20 }} labels={false} title="1000円" />
          </g>
        </Stage>
        <Lines
          y={-250}
          lines={[{ t: "はっきり言えることは一つ。", at: s(1), size: 60, serif: false, weight: 800, color: K.inkSoft, out: s(5) - 6 }]}
        />
        <Lines
          y={20}
          gap={20}
          lines={[
            { t: "その一部を大きくするのは、", at: s(5), size: 76 },
            { t: <><span style={{ color: K.inkSoft, textDecoration: "line-through", textDecorationColor: K.red }}>値段</span>ではなく、</>, at: s(6), size: 96 },
            { t: <><R>店の仕組み</R>。</>, at: s(7), size: 150 },
          ]}
        />
        <Tag text="※ 割合はイメージ" x={1560} y={50} at={s(2)} />
      </>
    );
  },
  { hideSubs: [5, 6, 7] },
);

/* S56 D: MONEY FLOW（v2 変形）— 1000円が店の中を巡り、次の一杯を作る */
const S56 = mk(({ f, s }) => {
  const NODES = [
    { t: "食材を買う", at: s(5), x: 960, y: 170 },
    { t: "人が働く", at: s(6), x: 1470, y: 330 },
    { t: "店を借りる", at: s(7), x: 1560, y: 690 },
    { t: "火・水・電気", at: s(8), x: 960, y: 880 },
    { t: "設備を維持", at: s(11), x: 360, y: 690 },
  ];
  const loop = ease(f, s(13), s(13) + 30);
  return (
    <>
      <Stage>
        {NODES.map((n, i) => (
          <FlowLine key={i} d={`M 960 520 L ${n.x} ${n.y}`} at={n.at} color={K.brothDeep} w={10} />
        ))}
        <g opacity={fade(f, s(1))} transform="translate(960 520)">
          <rect x={-190} y={-110} width={380} height={250} rx={24} fill={K.paper} />
          <Bill w={300} />
        </g>
        <text x={960} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft} opacity={fade(f, s(1))}>
          客が払った
        </text>
        {NODES.map((n, i) => (
          <Pill key={i} x={n.x} y={n.y} text={n.t} at={n.at} size={44} color={K.ink} />
        ))}
        <g opacity={loop}>
          <path d="M 380 620 C 260 420 420 220 700 180" fill="none" stroke={K.red} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={-(f - s(13)) * 3} />
          <g transform="translate(300 330)">
            <Bowl x={0} y={0} s={0.3} steam={0.6} />
          </g>
          <text x={300} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.red}>
            次の一杯
          </text>
        </g>
        <text x={1740} y={1000} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft} opacity={fade(f, s(5))}>
          MONEY FLOW
        </text>
      </Stage>
    </>
  );
}, { hideSubs: [5, 6, 7, 8, 9, 10, 11, 13] });

/* S57 G: ラーメン屋が売っているもの（言葉が丼の中へ） */
const S57 = mk(
  ({ f, s }) => {
    const W = ["食材", "人", "時間", "場所", "仕組み"];
    return (
      <>
        <Stage>
          <Bowl x={960} y={720} s={0.85} toppings={0} steam={0.5} />
          {W.map((w, i) => {
            const at = s(4 + i);
            const drop = ease(f, at, at + 16, 0, 1, Easing.out(Easing.cubic));
            const x = 960 + (i - 2) * 290;
            return (
              <text
                key={i}
                x={x}
                y={340 + drop * 120}
                textAnchor="middle"
                fontFamily={SERIF}
                fontWeight={900}
                fontSize={i === 4 ? 96 : 84}
                fill={i === 4 ? K.red : K.ink}
                opacity={fade(f, at - 2, 8)}
              >
                {w}
              </text>
            );
          })}
        </Stage>
        <Lines y={-400} lines={[{ t: "ラーメン屋が売っているのは、ラーメンだけではない。", at: s(1), size: 56, serif: false, weight: 800 }]} />
      </>
    );
  },
  { hideSubs: [1, 2, 4, 5, 6, 7] },
);

/* S58 D: 残るお金を決める式（杯数 × 客単価 − 時間とコスト） */
const S58 = mk(({ f, s }) => {
  const T = [
    { t: "杯数", at: s(4), c: K.ink },
    { t: "×", at: s(5), c: K.inkSoft, op: true },
    { t: "客単価", at: s(6), c: K.ink },
    { t: "−", at: s(8), c: K.inkSoft, op: true },
    { t: "時間とコスト", at: s(9), c: K.ink },
  ];
  const result = fade(f, s(11));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: FONT, gap: 50 }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: K.inkSoft, opacity: fade(f, s(2)) * (1 - fade(f, s(4))) }}>一杯をいくらで作れるか、だけではない</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {T.map((x, i) => {
            const p = pop(f, x.at);
            return (
              <div
                key={i}
                style={{
                  fontSize: x.op ? 100 : 80,
                  fontWeight: 900,
                  color: x.c,
                  opacity: Math.min(1, p * 1.4),
                  transform: `scale(${p})`,
                  ...(x.op ? {} : { background: K.white, border: `6px solid ${K.ink}`, borderRadius: 20, padding: "16px 34px" }),
                }}
              >
                {x.t}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: result }}>
          <div style={{ fontSize: 100, fontWeight: 900, color: K.inkSoft }}>＝</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: K.white, background: K.red, borderRadius: 20, padding: "14px 44px" }}>最後に残るお金</div>
        </div>
      </AbsoluteFill>
      <Tag text="※ 考え方の図" x={60} y={50} at={s(4)} />
    </>
  );
}, { hideSubs: [4, 6, 11] });

/* S59 G: FINAL CLUE（五枚の食券が一枚にまとまる → 最後の言葉） */
const S59 = mk(
  ({ f, s, d }) => {
    const gather = ease(f, 0, 30, 0, 1, Easing.inOut(Easing.cubic));
    const final = ease(f, 26, 44);
    return (
      <>
        {Array.from({ length: 5 }, (_, i) => {
          const x0 = 50;
          const y0 = 180 + i * 110;
          const x = x0 + (835 - x0) * gather;
          const y = y0 + (440 - y0) * gather;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, opacity: 1 - final }}>
              <MiniTicket i={i} />
            </div>
          );
        })}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: final, transform: `scale(${0.9 + 0.1 * final})` }}>
          <Ticket
            no="F"
            final
            w={1320}
            lines={["1000円の価値を決めるのは、", "値段だけではない。", "その1000円の中に作られた、", "ビジネスの仕組みだ。"]}
            lineAt={[s(0), s(0) + 45, s(1), s(1) + 50]}
          />
        </AbsoluteFill>
        <Sfx at={26} name="paper" volume={0.6} />
      </>
    );
  },
  { noSub: true },
);

/* S60 E→D: 次に 1000円を払うとき → レジから五つの行き先へ流れる */
const S60 = mk(({ f, s }) => {
  const flow = fade(f, s(3) - 6);
  const DEST = [
    { t: "食材へ", at: s(5) },
    { t: "人へ", at: s(6) },
    { t: "場所へ", at: s(7) },
    { t: "エネルギーへ", at: s(8) },
    { t: "店の未来へ", at: s(10), red: true },
  ];
  return (
    <>
      <Stock file="E1_bowl.mp4" fallback={<Stage><g opacity={1 - flow}><Bowl x={960} y={560} s={1.25} /></g></Stage>} />
      <AbsoluteFill style={{ opacity: flow, background: K.paper }}>
        <Stage>
          <g transform="translate(260 540)">
            <rect x={-150} y={-110} width={300} height={220} rx={20} fill={K.ink} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.paper}>
              レジ
            </text>
          </g>
          {DEST.map((d0, i) => {
            const y = 170 + i * 185;
            return (
              <g key={i}>
                <FlowLine d={`M 420 540 C 700 540 800 ${y} 1150 ${y}`} at={d0.at} color={d0.red ? K.red : K.brothDeep} w={10} />
                <Pill x={1420} y={y} text={d0.t} at={d0.at} size={50} color={d0.red ? K.red : K.ink} />
              </g>
            );
          })}
        </Stage>
      </AbsoluteFill>
    </>
  );
}, { hideSubs: [5, 6, 7, 8, 10] });

/* S61 D: 最後に残ったほんの一部 → 店の利益（S12 の回収） */
const S61 = mk(
  ({ f, s, d }) => (
    <>
      <Stage>
        <g opacity={0.45}>
          <MoneyBar y={440} parts={FIVE.map((p) => ({ ...p, at: -30 }))} labels={false} />
        </g>
        <MoneyBar y={440} parts={[]} used={0.92} rest={{ label: "店の利益", at: s(1), glow: s(3) }} labels={false} title="" />
      </Stage>
      <Lines y={300} lines={[{ t: <>それが――<R>店の利益</R>になる。</>, at: s(2), size: 72 }]} />
      <Veil o={ease(f, d - 12, d)} color={K.paper} />
    </>
  ),
  { hideSubs: [2, 3] },
);

/* S62–S64: KANENAZO 固定エンディング */
const S62 = mk(
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

const S63 = mk(
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

const S64 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const FINALE = { S48, S49, S50, S51, S52, S53, S54, S55, S56, S57, S58, S59, S60, S61, S62, S63, S64 };
