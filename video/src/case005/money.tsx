/** K09–K16: 運賃は 1 個ごと（EVIDENCE）→ CLUE 01 → 消費者庁 → QUESTION 2 → 入口①値段 ②ライン ③会費 → ラインは動く → MONEY FLOW ② */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceDoc, EvidenceMark, Lines, R, Stage, Tag, count, mk } from "../case002/ui";
import { Box, Easing, FONT, K, MoneyFlow5, SERIF, Sfx, T, TimelineH, Waybill, ease, fade, pop } from "./kit";

/* K09 EVIDENCE: ヤマトHD 決算 平均単価 711円 */
const K09 = mk(({ s }) => (
  <EvidenceDoc
    no="#02"
    org="ヤマトホールディングス 決算資料"
    title="宅配便3商品（2025年3月期）"
    at={4}
    rows={[
      { t: "運送会社は、荷物1個ごとに運賃を受け取る", at: s(0) + 6 },
      { t: <>平均単価 <R>711円</R></>, at: s(1), hl: s(1) + 20, big: true },
      { t: "※大口の法人向けの割引を含む平均。個人が窓口で払う料金とは違う", at: s(2) },
      { t: "1個動けば、どこかで数百円が動く", at: s(3) },
    ]}
    source="ヤマトHD 決算（2025年3月期）"
  />
), { bg: "paper" });

/* K10 CLUE 01 */
const K10 = mk(({ s }) => <Waybill no="01" at={s(0) + 6} />, { bg: "paper", noSub: true });

/* K11 EVIDENCE: 消費者庁。ステッカー「送料無料」がはがれて「送料当社負担」 */
const K11 = mk(({ f, s }) => {
  const peel = ease(f, s(2) + 10, s(2) + 40, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <Stage>
        <g transform="translate(560 540)" opacity={fade(f, s(1))}>
          <rect x={-380} y={-300} width={760} height={600} rx={10} fill="#FFFFFF" stroke="#D8D0C2" strokeWidth={3} />
          <rect x={-340} y={-262} width={260} height={52} rx={6} fill={K.red} />
          <text x={-210} y={-236} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#FFFFFF" letterSpacing={3}>
            EVIDENCE #03
          </text>
          <text x={-340} y={-150} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            消費者庁（2023年12月）
          </text>
          <text x={-340} y={-80} fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            「送料無料」表示について
          </text>
          <line x1={-340} x2={340} y1={-40} y2={-40} stroke={K.ink} strokeWidth={3} />
          {["運送にはコストがかかることを、", "消費者に説明するよう", "通販の事業者などに呼びかけ"].map((l, i) => (
            <text key={i} x={-340} y={30 + i * 64} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.ink} opacity={fade(f, s(1) + 10 + i * 8)}>
              {l}
            </text>
          ))}
          <text x={-340} y={250} fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft}>
            ※表示そのものの規制は見送り
          </text>
        </g>
        {/* ステッカーの書き換え */}
        <g transform="translate(1440 540)" opacity={fade(f, s(2) - 6)}>
          <rect x={-250} y={-90} width={500} height={180} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.ink}>
            送料当社負担
          </text>
          <g transform={`translate(${-250 + 500 * peel} ${-90}) rotate(${-25 * peel}) translate(${250 - 500 * peel} 90)`} opacity={1 - peel * 0.9}>
            <rect x={-250} y={-90} width={500} height={180} rx={20} fill={T.sticker} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#FFFFFF">
              送料無料
            </text>
          </g>
        </g>
      </Stage>
      <Sfx at={s(2) + 12} name="paper" volume={0.6} />
    </>
  );
}, { bg: "paper" });

/* K12 DARK: QUESTION 2。店に「？」 */
const K12 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(960 560)" opacity={fade(f, 0)}>
        <rect x={-200} y={-120} width={400} height={260} fill="#2A3446" stroke="#8C99AE" strokeWidth={6} />
        <path d="M -240 -120 L -200 -200 L 200 -200 L 240 -120 Z" fill="#8C99AE" />
        <text y={-160} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#0E1320" letterSpacing={8}>
          SHOP
        </text>
        <text y={20} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={170} fill={K.red} opacity={pop(f, s(1))}>
          ？
        </text>
      </g>
    </Stage>
    <Lines dark y={-360} lines={[{ t: <>店は、<R>どこから</R>出している？</>, at: s(1) + 4, size: 88 }]} />
    <Sfx at={s(1)} name="question" volume={0.45} />
  </>
), { bg: "night", hideSubs: [1] });

/* K13 FLAT: 入口①値段。値札の中身は「？」（確認できない） */
const K13 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(700 520)" opacity={fade(f, s(0))}>
        <path d="M -260 -160 L 200 -160 L 300 0 L 200 160 L -260 160 Z" fill="#FFFFFF" stroke={K.ink} strokeWidth={7} />
        <circle cx={220} cy={0} r={22} fill="none" stroke={K.ink} strokeWidth={6} />
        <text x={-30} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
          商品の値段
        </text>
        <text x={-30} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={K.ink}>
          ¥2,000
        </text>
        {/* 中身: 送料？ */}
        <g opacity={fade(f, s(1))}>
          <rect x={-230} y={-130} width={420} height={260} rx={14} fill="rgba(252,251,248,0.82)" />
          <text x={-20} y={-20} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={140} fill={T.hidden} style={{ filter: "blur(2px)" }}>
            ？
          </text>
          <text x={-20} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            送料はいくら入っている？
          </text>
        </g>
      </g>
      <g transform="translate(1440 520)" opacity={fade(f, s(3))}>
        <rect x={-300} y={-150} width={600} height={300} rx={20} fill="#FFFFFF" stroke="#D8D0C2" strokeWidth={3} />
        <text y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
          消費者庁（2023年・半年の意見交換）
        </text>
        <text y={0} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
          値段への上乗せは
        </text>
        <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red}>
          「確認できなかった」
        </text>
      </g>
      <rect x={190} y={170} width={180} height={64} rx={32} fill={T.lane.price} opacity={fade(f, s(0))} />
      <text x={280} y={202} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF" opacity={fade(f, s(0))}>
        入口①
      </text>
    </Stage>
    <EvidenceMark no="#03" source="消費者庁「送料無料」表示について" at={s(3)} />
  </>
), { bg: "paper" });

/* K14 OBJECT: 入口②ライン。カートの金額ゲージが 3980円の線で「送料無料」 */
const K14 = mk(({ f, s }) => {
  const v = count(f, s(2) - 10, 60, 1200, 4200);
  const hit = v >= 3980;
  const H = 480;
  const y = (x: number) => 790 - (H * x) / 4500;
  return (
    <>
      <Stage>
        <rect x={190} y={170} width={180} height={64} rx={32} fill={T.lane.line} />
        <text x={280} y={202} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
          入口②
        </text>
        <rect x={820} y={y(4500)} width={280} height={H} rx={20} fill="#F0ECE3" stroke={K.ink} strokeWidth={5} />
        <rect x={830} y={y(v)} width={260} height={790 - y(v)} rx={14} fill={hit ? T.lane.line : T.kraft} />
        <line x1={760} x2={1160} y1={y(3980)} y2={y(3980)} stroke={K.red} strokeWidth={8} strokeDasharray="22 12" />
        <text x={1190} y={y(3980)} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
          3,980円
        </text>
        <text x={960} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
          カートの合計 ¥{Math.round(v).toLocaleString("ja-JP")}
        </text>
        <g transform={`translate(560 ${y(3980)}) scale(${pop(f, s(2) + 40)}) rotate(-12)`} opacity={hit ? 1 : 0}>
          <rect x={-170} y={-60} width={340} height={120} rx={16} fill="none" stroke={K.red} strokeWidth={8} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
            送料無料
          </text>
        </g>
        <text x={960} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft} opacity={fade(f, s(1))}>
          楽天市場「共通の送料込みライン」
        </text>
      </Stage>
      <EvidenceMark no="#05" source="楽天グループ 発表" at={s(1)} />
      <Sfx at={s(2) + 40} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white" });

/* K15 DOCUMENT: 入口③会費。会員カードが裏返って「配送料 無料」 */
const K15 = mk(({ f, s }) => {
  const flip = ease(f, s(2) - 6, s(2) + 12);
  const sx = Math.abs(Math.cos(flip * Math.PI));
  const back = flip > 0.5;
  return (
    <>
      <Stage>
        <rect x={190} y={170} width={180} height={64} rx={32} fill={T.lane.fee} />
        <text x={280} y={202} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
          入口③
        </text>
        <g transform={`translate(760 520) scale(${sx} 1)`} opacity={fade(f, s(0))}>
          <rect x={-340} y={-210} width={680} height={420} rx={34} fill={back ? "#FFFFFF" : T.lane.fee} stroke={K.ink} strokeWidth={5} />
          {back ? (
            <>
              <text textAnchor="middle" y={-40} fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
                対象の商品
              </text>
              <text textAnchor="middle" y={60} fontFamily={FONT} fontWeight={900} fontSize={80} fill={T.lane.fee}>
                配送料 無料
              </text>
            </>
          ) : (
            <>
              <text x={-290} y={-120} fontFamily={FONT} fontWeight={900} fontSize={44} fill="#FFFFFF">
                MEMBER
              </text>
              <text textAnchor="middle" y={40} fontFamily={FONT} fontWeight={900} fontSize={96} fill="#FFFFFF">
                会費
              </text>
            </>
          )}
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1440} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            Amazonプライム
          </text>
          <text x={1440} y={530} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.ink}>
            月600円
          </text>
          <text x={1440} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.ink}>
            年5,900円
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <text x={1440} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.red}>
            2023年 4,900円 → 5,900円
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#06" source="Amazon 発表（2023年8月）" at={s(1)} />
      <Sfx at={s(2)} name="whoosh" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* K15B TIMELINE: 無料の基準線は動く（2010 全品無料 → 2016 2000円未満 350円 → 2024 基準 3500円） */
const K15B = mk(({ f, s }) => (
  <>
    <Stage>
      <TimelineH
        y={470}
        x0={360}
        x1={1560}
        items={[
          { year: "2010年11月", text: "どの商品も\n配送料無料", at: s(1), color: T.lane.line },
          { year: "2016年4月", text: "2000円未満は\n350円（会員以外）", at: s(2), color: T.lane.price },
          { year: "2024年3月29日", text: "無料の基準\n3500円に", at: s(3), color: K.red },
        ]}
      />
      <text x={960} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={K.ink} opacity={fade(f, s(0))}>
        無料の「線」は、動いてきた
      </text>
      <text x={960} y={930} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red} opacity={fade(f, s(4))}>
        線が動けば、客が払うお金の形も変わる
      </text>
    </Stage>
    <EvidenceMark no="#06" source="Amazon.co.jp 発表（各年）" at={s(1)} />
    <Tag text="Amazon.co.jp の通常配送" x={60} y={110} at={s(1)} />
  </>
), { bg: "paper", hideSubs: [4] });

/* K16 MONEY FLOW ②: 入口 3 つ → 店 → 運送会社。その先は灰色 */
const K16 = mk(({ f, s }) => (
  <>
    <Stage>
      <MoneyFlow5 st={{ entries: fade(f, s(1)), store: fade(f, s(1) + 20), carrier: fade(f, s(1) + 40), hidden: fade(f, s(1) + 70), driver: 0 }} />
      <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink} opacity={fade(f, s(0))}>
        MONEY FLOW ②
      </text>
    </Stage>
  </>
), { bg: "white" });

export const MONEY5 = { K09, K10, K11, K12, K13, K14, K15, K15B, K16 };
export { AbsoluteFill, Box };
