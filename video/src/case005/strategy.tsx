/** K17–K21: QUESTION 3（なぜ無料と書く？）→ 3980円の算数 → 会費は回数を増やす → CLUE 02 → 公取委 */
import React from "react";
import { EvidenceDoc, Lines, R, Stage, Tag, mk } from "../case002/ui";
import { Box, Easing, FONT, K, SERIF, Sfx, T, Waybill, ease, fade, pop } from "./kit";

/* K17 DARK: ステッカー「送料無料」が裏返って「？」 */
const K17 = mk(({ f, s }) => {
  const flip = ease(f, s(3) - 10, s(3) + 8);
  const sx = Math.abs(Math.cos(flip * Math.PI));
  return (
    <>
      <Stage>
        <g transform={`translate(960 560) scale(${sx} 1)`}>
          <rect x={-300} y={-140} width={600} height={280} rx={30} fill={flip > 0.5 ? "#FFFFFF" : T.sticker} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={flip > 0.5 ? SERIF : FONT} fontWeight={900} fontSize={flip > 0.5 ? 200 : 110} fill={flip > 0.5 ? K.red : "#FFFFFF"}>
            {flip > 0.5 ? "？" : "送料無料"}
          </text>
        </g>
      </Stage>
      <Lines
        dark
        y={-390}
        lines={[
          { t: "全部、客が払うなら", at: s(1), size: 64 },
          { t: <>なぜ「<R>無料</R>」と書く？</>, at: s(3), size: 86 },
        ]}
      />
      <Sfx at={s(3)} name="whoosh" volume={0.4} />
    </>
  );
}, { bg: "night", hideSubs: [3] });

/* K18 FLAT: 2000円 → ＋1980円 → 約4000円（売上 約2倍）、同じ箱、送料の割合 ↓ */
const K18 = mk(({ f, s }) => {
  const add = pop(f, s(1) + 20);
  const shrink = ease(f, s(4), s(4) + 40);
  const share = 0.3 - 0.15 * shrink; // イメージ
  const a = share * Math.PI * 2;
  return (
    <>
      <Stage>
        {/* 注文 */}
        <g transform="translate(420 560)">
          <rect x={-190} y={-150} width={170} height={220} rx={10} fill="#6F8FB3" opacity={fade(f, s(0))} />
          <text x={-105} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink} opacity={fade(f, s(0))}>
            2000円
          </text>
          <g transform={`translate(0 ${(1 - add) * -200})`} opacity={add}>
            <rect x={20} y={-150} width={170} height={220} rx={10} fill={T.kraftLight} />
            <text x={105} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.red}>
              ＋1980円
            </text>
          </g>
          <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink} opacity={fade(f, s(2))}>
            約4000円 → 売上 約2倍
          </text>
        </g>
        {/* 同じ箱 */}
        <g opacity={fade(f, s(3))}>
          <Box x={1000} y={560} s={0.45} sticker={0} />
          <text x={1000} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
            同じ箱
          </text>
        </g>
        {/* 送料の割合 */}
        <g transform="translate(1520 520)" opacity={fade(f, s(4) - 10)}>
          <circle r={200} fill="#E9E4DA" />
          <path d={`M 0 0 L 0 -200 A 200 200 0 0 1 ${200 * Math.sin(a)} ${-200 * Math.cos(a)} Z`} fill={K.red} />
          <text y={270} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            売上に占める送料
          </text>
          <text y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red} opacity={shrink}>
            小さくなる
          </text>
        </g>
      </Stage>
      <Tag text="※計算の例・割合はイメージ" at={s(1)} />
    </>
  );
}, { bg: "paper" });

/* K19 FLAT: 会費 → 注文のたびに送料を気にしない → 注文の回数が増えやすい（カレンダー） */
const K19 = mk(({ f, s }) => {
  const n = Math.round(ease(f, s(2), s(2) + 60, 1, 6));
  return (
    <>
      <Stage>
        <g transform="translate(960 560)">
          <rect x={-520} y={-300} width={1040} height={600} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          <rect x={-520} y={-300} width={1040} height={90} rx={20} fill={T.lane.fee} />
          <text y={-255} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#FFFFFF">
            会員の買い物
          </text>
          {Array.from({ length: 28 }, (_, i) => {
            const x = -450 + (i % 7) * 150;
            const y = -150 + Math.floor(i / 7) * 110;
            const lit = [2, 9, 13, 17, 22, 26].indexOf(i);
            const on = lit >= 0 && lit < n;
            return (
              <g key={i}>
                <rect x={x - 55} y={y - 40} width={110} height={80} rx={10} fill="#F4F1EA" />
                {on && (
                  <g transform={`translate(${x} ${y}) scale(0.075)`}>
                    <Box x={0} y={0} sticker={0} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
        <text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink} opacity={fade(f, s(1))}>
          注文のたびに、送料を気にしなくていい
        </text>
      </Stage>
      <Tag text="※イメージ" at={s(2)} />
    </>
  );
}, { bg: "paper" });

/* K20 CLUE 02 */
const K20 = mk(({ s }) => <Waybill no="02" at={s(0) + 6} />, { bg: "paper", noSub: true });

/* K21 EVIDENCE: 公取委の申立て → 出店者も反発 → 選べる形に → 取下げ */
const K21 = mk(({ s }) => (
  <EvidenceDoc
    no="#05"
    org="公正取引委員会 / 楽天グループ"
    title="「共通の送料込みライン」（2020年）"
    at={s(1) - 6}
    rows={[
      { t: "独占禁止法違反のおそれ → 緊急停止命令を申し立て", at: s(1) + 10 },
      { t: "一部の出店者からも、負担が店に偏ると反発", at: s(2) },
      { t: "出店者が参加を選べる形に → 申し立て取り下げ", at: s(3) },
      { t: <>送料は、店どうしが<span style={{ color: K.red }}>争うほどのお金</span></>, at: s(4), hl: s(4) + 16, big: true },
    ]}
    source="公正取引委員会 / 楽天グループ 発表（2020〜2021年）"
  />
), { bg: "paper" });

export const STRATEGY5 = { K17, K18, K19, K20, K21 };
export { Easing, fade };
