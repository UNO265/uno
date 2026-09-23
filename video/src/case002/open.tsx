/** S01–S13: 導入（1000円のラーメン）→ 1000円を追いかける → CLUE 01 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  Bill, Bowl, Chip, ClueScene, K, Lines, MoneyBar, Person, Pill, PriceCard, R, Sfx, Shop, Stage, Stock, Tag, TicketMachine, Veil,
  ease, fade, mk, pop,
} from "./ui";
import { FONT } from "../theme";

/* S01 E: 湯気の立つ一杯。実写（E1）が無いときはイラスト */
const S01 = mk(
  ({ f, s, d }) => (
    <>
      <Stock
        file="E1_bowl.mp4"
        fallback={
          <Stage>
            <Bowl x={900} y={540} s={1.35 * ease(f, 0, 60, 0.96, 1)} toppings={ease(f, 0, 40)} />
            <PriceCard x={1500} y={330} text="1000円" s={pop(f, s(0) + 22)} r={6} />
          </Stage>
        }
      >
        <Stage>
          <PriceCard x={1500} y={330} text="1000円" s={pop(f, s(0) + 22)} r={6} />
        </Stage>
      </Stock>
      <Veil o={ease(f, d - 6, d)} />
    </>
  ),
  { noSub: true },
);

/* S02 F: 最初の問い */
const S02 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "「1000円なら、", at: s(0), size: 104 },
        { t: <>けっこう<R>儲かる</R>んじゃない？」</>, at: s(0) + 14, size: 104 },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* S03 A: 払った 1000円 ≠ 店の利益 */
const S03 = mk(({ f, s }) => {
  const slide = ease(f, s(1), s(1) + 30, 0, 1, Easing.inOut(Easing.cubic));
  const cross = ease(f, s(1) + 40, s(1) + 56);
  return (
    <Stage>
      <g transform={`translate(${760 - slide * 260} 470)`}>
        <Bill w={460} />
      </g>
      <g opacity={fade(f, s(1) + 10)}>
        <text x={1000} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={K.inkSoft}>
          →
        </text>
        <Pill x={1380} y={470} text="店の利益" at={s(1) + 18} size={70} color={K.ink} />
        <line x1={1180} y1={540} x2={1580} y2={400} stroke={K.red} strokeWidth={14} strokeLinecap="round" opacity={cross} strokeDasharray={430} strokeDashoffset={430 * (1 - cross)} />
      </g>
    </Stage>
  );
});

/* S04 A: 食材・人・家賃・ガス電気水 → 客がいなくても出ていく */
const S04 = mk(
  ({ f, s, d }) => {
    const empty = ease(f, s(4) - 6, s(4) + 14);
    const ICONS = ["食材", "人", "家賃", "光熱"];
    return (
      <Stage>
        <g opacity={1 - empty}>
          {ICONS.map((t, i) => (
            <Chip key={i} x={390 + i * 380} y={470} text={t} at={s(i)} r={130} color={[K.brothDeep, K.ink, K.soy, "#3E7BA6"][i]} />
          ))}
        </g>
        <g opacity={empty}>
          <Shop x={960} y={430} s={1.1} lit={false} />
          <text x={960} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.inkSoft}>
            客 0人
          </text>
          {[0, 1, 2, 3, 4].map((k) => {
            const t = ((f - s(4) - k * 9) / 40) % 1;
            if (f < s(4) + k * 9) return null;
            return (
              <g key={k} transform={`translate(${1220 + t * 420} ${420 + Math.sin(t * 3) * 40})`} opacity={1 - t}>
                <circle r={34} fill={K.gold} stroke={K.goldDeep} strokeWidth={5} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.goldDeep}>
                  円
                </text>
              </g>
            );
          })}
        </g>
        <Veil o={ease(f, d - 8, d)} />
      </Stage>
    );
  },
  { hideSubs: [0, 1, 2, 3] },
);

/* S05 F: 残るのはいくら？ 100円？ 200円？ もっと少ない？ */
const S05 = mk(
  ({ f, s }) => {
    const Q = ({ at, out, text, size = 230, color = "#F4EEE3" }: { at: number; out: number; text: string; size?: number; color?: string }) => {
      const p = ease(f, at, at + 10);
      const o = 1 - ease(f, out, out + 8);
      return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color, opacity: p * o, transform: `scale(${0.94 + 0.06 * p})` }}>{text}</div>
        </div>
      );
    };
    return (
      <>
        <Lines
          dark
          y={-60}
          lines={[
            { t: "あなたが払った1000円。", at: s(1), size: 70, serif: false, weight: 700, out: s(2) - 6, color: "#C9C2B6" },
            { t: <>最後に店に残るのは、<R>いくら</R>？</>, at: s(2), size: 96, out: s(3) - 4 },
          ]}
        />
        <Q at={s(3)} out={s(4) - 3} text="100円？" />
        <Q at={s(4)} out={s(5) - 3} text="200円？" />
        <Q at={s(5)} out={9999} text="もっと少ない？" size={150} color={K.red} />
      </>
    );
  },
  { bg: "night", noSub: true },
);

/* S06 G: CASE タイトル */
const S06 = mk(
  ({ f, s }) => {
    const a = ease(f, s(0), s(0) + 14);
    const b = ease(f, s(1), s(1) + 16);
    const line = ease(f, s(1) + 10, s(1) + 40);
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: a }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 14, color: K.inkSoft }}>KANENAZO</div>
            <div style={{ background: K.red, color: K.white, fontWeight: 900, fontSize: 38, letterSpacing: 4, padding: "4px 18px", borderRadius: 8 }}>CASE #002</div>
          </div>
          <div style={{ fontFamily: "'Noto Serif CJK JP', serif", fontWeight: 900, fontSize: 92, color: K.ink, marginTop: 44, opacity: b, letterSpacing: 4 }}>ラーメン一杯1000円。</div>
          <div style={{ fontFamily: "'Noto Serif CJK JP', serif", fontWeight: 900, fontSize: 118, color: K.ink, opacity: b, letterSpacing: 4 }}>
            店には、<span style={{ color: K.red }}>いくら残る？</span>
          </div>
          <div style={{ height: 8, width: 1100 * line, background: K.red, borderRadius: 4, marginTop: 26 }} />
        </AbsoluteFill>
        <Sfx at={s(1)} name="jingle" volume={0.8} />
      </>
    );
  },
  { noSub: true },
);

/* S07 E→D: 券売機に 1000円 → 売上 1000円（まだ儲けではない） */
const S07 = mk(({ f, s }) => {
  const bill = ease(f, s(1) + 20, s(1) + 50, 0, 1, Easing.inOut(Easing.cubic));
  const sale = pop(f, s(2));
  const warn = fade(f, s(4));
  return (
    <>
      <Stock file="E2_ticket_machine.mp4" fallback={<Stage><TicketMachine x={620} y={500} s={0.95} billIn={bill} lit={bill >= 1 ? 1 : -1} /></Stage>} />
      <Stage>
        <g transform={`translate(1360 470) scale(${sale})`} opacity={Math.min(1, sale * 1.3)}>
          <rect x={-300} y={-120} width={600} height={240} rx={24} fill={K.white} stroke={K.ink} strokeWidth={8} />
          <text y={-44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.inkSoft}>
            売上
          </text>
          <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={K.ink}>
            1000円
          </text>
        </g>
        <g opacity={warn} transform="translate(1360 690)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
            ≠ 儲け
          </text>
        </g>
      </Stage>
      <Sfx at={s(1) + 50} name="coin" volume={0.5} />
    </>
  );
});

/* S08 E: 食材が出ていく（10 品目が棚に並ぶ） */
const FOODS = ["麺", "豚肉", "鶏肉", "豚骨", "野菜", "卵", "海苔", "メンマ", "油", "調味料"];
const S08 = mk(
  ({ f, s }) => (
    <Stock
      file="E3_ingredients.mp4"
      fallback={
        <Stage>
          <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={62} fill={K.ink} opacity={fade(f, s(0))}>
            食材のお金
          </text>
          {FOODS.map((t, i) => (
            <Chip key={i} x={320 + (i % 5) * 320} y={i < 5 ? 420 : 720} text={t} at={s(i + 1)} r={112} color={[K.brothDeep, K.soy, K.soy, K.inkSoft, K.negi, K.orange, K.nori, "#A67C3D", K.brothDeep, K.ink][i]} />
          ))}
        </Stage>
      }
    />
  ),
  { hideSubs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
);

/* S09 E→A: エネルギーと人 */
const S09 = mk(
  ({ f, s }) => {
    const people = ease(f, s(4), s(4) + 14);
    const ROLES = ["作る", "受ける", "運ぶ", "片付ける"];
    return (
      <Stock
        file="E4_kitchen.mp4"
        fallback={
          <Stage>
            <g opacity={1 - people}>
              {[
                ["ガス", "#D2693C"],
                ["水", "#3E7BA6"],
                ["電気", K.goldDeep],
              ].map(([t, c], i) => (
                <Chip key={i} x={520 + i * 440} y={470} text={t} at={s(i + 1)} r={150} color={c} />
              ))}
            </g>
            <g opacity={people}>
              {ROLES.map((t, i) => {
                const at = s(i + 5);
                const p = pop(f, at);
                return (
                  <g key={i} transform={`translate(${390 + i * 380} 520)`} opacity={Math.min(1, p * 1.5)}>
                    <Person x={0} y={0} s={1.3 * p} color={f >= at ? K.ink : K.line} />
                    <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
                      {t}人
                    </text>
                  </g>
                );
              })}
            </g>
          </Stage>
        }
      />
    );
  },
  { hideSubs: [5, 6, 7, 8] },
);

/* S10 D: 店を動かすお金（チップが箱に落ちる） */
const S10 = mk(
  ({ f, s }) => {
    const ITEMS = ["家賃", "設備", "修理", "清掃", "消耗品", "決済手数料"];
    return (
      <Stage>
        <text x={960} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill={K.ink} opacity={fade(f, s(0))}>
          店を動かすお金
        </text>
        <path d="M 160 640 L 1760 640 L 1700 800 L 220 800 Z" fill={K.mist} />
        {ITEMS.map((t, i) => {
          const at = s(i + 1);
          const drop = ease(f, at, at + 14, 0, 1, Easing.out(Easing.bounce));
          const x = 330 + i * 252;
          return (
            <g key={i} opacity={fade(f, at - 2, 6)} transform={`translate(${x} ${300 + drop * 400})`}>
              <rect x={-120} y={-54} width={240} height={108} rx={54} fill={K.white} stroke={K.soy} strokeWidth={6} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={[...t].length > 4 ? 38 : 48} fill={K.soy}>
                {t}
              </text>
            </g>
          );
        })}
        <path d="M 160 640 L 1760 640 L 1700 800 L 220 800 Z" fill="none" stroke={K.ink} strokeWidth={8} strokeLinejoin="round" />
      </Stage>
    );
  },
  { hideSubs: [1, 2, 3, 4, 5, 6] },
);

/* S11 D: 1000円の中から 5 つの行き先へ（割合はイメージ） */
export const FIVE: { label: string; w: number; color: string }[] = [
  { label: "食材", w: 0.3, color: K.cost[2] },
  { label: "人", w: 0.28, color: K.cost[0] },
  { label: "場所", w: 0.12, color: K.cost[1] },
  { label: "エネルギー", w: 0.1, color: K.cost[4] },
  { label: "設備", w: 0.12, color: K.cost[3] },
];
const S11 = mk(
  ({ f, s }) => (
    <>
      <Stage>
        <MoneyBar y={440} show={s(0)} parts={FIVE.map((p, i) => ({ ...p, at: s(3 + i) }))} />
      </Stage>
      <Tag text="※ 割合はイメージ" at={s(3)} x={1560} y={290} />
    </>
  ),
  { hideSubs: [3, 4, 5, 6, 7] },
);

/* S12 D: すべてを払ったあとに残った、最後の小さな一片 */
const S12 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={1 - 0.55 * fade(f, s(1))}>
        <MoneyBar y={440} parts={FIVE.map((p) => ({ ...p, at: -30 }))} labels />
      </g>
      <MoneyBar y={440} parts={[]} used={0.92} rest={{ label: "利益", at: s(1), glow: s(2) }} labels={false} title="" />
    </Stage>
    <Tag text="※ 割合はイメージ" x={1560} y={290} />
  </>
));

/* S13 G: CLUE 01 */
const S13 = mk(({ s }) => <ClueScene no={1} at={s(0) - 10} />, { noSub: true });

export const OPEN = { S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13 };
