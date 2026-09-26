/** K01–K08C: 問い（0秒）→ 注文画面「送料¥0」→ 50億個・711円 vs 0円 → QUESTION 1 → TITLE → 予想される二つの答え → 箱の道のり → 規模 → ネット通販 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Tag, count, mk } from "../case002/ui";
import { Box, Easing, FONT, Figure, K, Phone, RouteMap, SERIF, Sfx, T, ease, fade, pop } from "./kit";

/* K01 OBJECT: 0 フレームから箱が滑り込み、問いが画面に出ている（BGM なし） */
const K01 = mk(
  ({ f }) => {
    const slide = ease(f, -4, 20, 1, 0, Easing.out(Easing.cubic));
    return (
      <>
        <Stage>
          <Box x={960 + 900 * slide} y={690 - 30 * slide} s={1.05} r={-4 * slide} ghost={0} />
        </Stage>
        <Lines
          dark
          y={-370}
          lines={[
            { t: "送料無料。", at: -16, size: 86 },
            { t: <>それは、本当に<R>無料</R>なのか？</>, at: -8, size: 100 },
          ]}
        />
        <Sfx at={14} name="thud" volume={0.5} />
      </>
    );
  },
  { bg: "black", noSub: true },
);

/* K02 DOCUMENT: 注文画面「送料 ¥0」→ 玄関に段ボール */
const K02 = mk(({ f, s }) => {
  const out = ease(f, s(1) - 8, s(1) + 10);
  return (
    <>
      <Stage>
        <g transform={`translate(${-700 * out} 0)`} opacity={1 - out * 0.9}>
          <Phone x={960} y={520} s={1.12} tap={s(0) + 40} />
          <circle cx={960} cy={520 + 250 * 1.12} r={30 * fade(f, s(0) + 34, 6) * (1 - fade(f, s(0) + 48, 8))} fill="rgba(0,0,0,0.25)" />
        </g>
        <g opacity={fade(f, s(1) - 2)}>
          {/* 玄関 */}
          <rect x={1080} y={150} width={420} height={680} rx={8} fill="#6E5540" stroke="#4A382A" strokeWidth={8} />
          <circle cx={1440} cy={500} r={16} fill="#E0C27A" />
          <rect x={760} y={830} width={980} height={26} fill="#B9AE9C" />
          <g transform={`translate(0 ${ease(f, s(1), s(1) + 12, -260, 0, Easing.out(Easing.bounce))})`}>
            <Box x={860} y={700} s={0.42} />
          </g>
        </g>
      </Stage>
      <Sfx at={s(0) + 40} name="tok" volume={0.5} />
      <Sfx at={s(1) + 10} name="thud" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* K03 DATA: 約50億個 → 1個711円 → それなのに 0円 */
const K03 = mk(({ f, s }) => {
  const n = count(f, s(0) + 16, 40, 0, 50);
  const y = count(f, s(1) + 20, 30, 0, 711);
  const clash = pop(f, s(2) + 8);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <text x={520} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.inkSoft}>
            宅配便（1年）
          </text>
          <text x={520} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={K.ink}>
            約{Math.round(n)}
            <tspan fontSize={90}>億個</tspan>
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1400} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.inkSoft}>
            1個あたりの平均単価
          </text>
          <text x={1400} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={K.ink}>
            {Math.round(y)}
            <tspan fontSize={90}>円</tspan>
          </text>
          <text x={1400} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={K.inkSoft}>
            ヤマト運輸・宅配便3商品（2025年3月期）
          </text>
        </g>
        <g transform={`translate(960 780) scale(${clash})`} opacity={Math.min(1, clash * 1.4)}>
          <rect x={-330} y={-100} width={660} height={200} rx={24} fill="#FFFFFF" stroke={T.sticker} strokeWidth={8} />
          <text x={-150} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.inkSoft}>
            画面では
          </text>
          <text x={150} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={120} fill={T.sticker}>
            0円
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01・#02" source="国土交通省（2024年度） / ヤマトHD 決算" at={s(0) + 10} />
      <Sfx at={s(2) + 8} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white", hideSubs: [] });

/* K05 DARK: QUESTION 1。スポットライトの中の箱、「無料」の文字だけ残る */
const K05 = mk(({ f, s }) => (
  <>
    <Stage>
      <defs>
        <radialGradient id="spot5" cx="50%" cy="60%" r="40%">
          <stop offset="0%" stopColor="rgba(255,240,210,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#spot5)" />
      <Box x={960} y={720} s={0.78} />
    </Stage>
    <Lines
      dark
      y={-330}
      lines={[
        { t: "運ぶお金は、どこへ？", at: s(0) + 4, size: 76 },
        { t: <>本当に<R>0円</R>？</>, at: s(1) + 4, size: 110 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.45} />
  </>
), { bg: "black", noSub: true });

/* K06 TITLE: 送り状の形のタイトルカード */
const K06 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #005</div>
        <div
          style={{
            marginTop: 40,
            background: T.label,
            border: "5px solid #3B4556",
            borderRadius: 10,
            padding: "36px 70px",
            transform: `scale(${p}) rotate(-1.5deg)`,
            opacity: Math.min(1, p * 1.5),
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: "#3B4556", writingMode: "vertical-rl", letterSpacing: 6 }}>送り状</div>
          <div style={{ fontFamily: SERIF, fontSize: 118, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>
            送料無料、<span style={{ color: K.red }}>本当に無料？</span>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* K06B KEY: 予想される二つの答え + 真ん中の空欄（3 人目の支払い手。K26 で回収） */
const K06B = mk(({ f, s }) => {
  const third = fade(f, s(3) + 20, 20);
  const bubble = (x: number, text: string, at: number) => {
    const p = pop(f, at);
    return (
      <g transform={`translate(${x} 470) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
        <rect x={-300} y={-120} width={600} height={240} rx={40} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
          {text}
        </text>
      </g>
    );
  };
  return (
    <Stage>
      <text x={960} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(0))}>
        浮かぶ答えは、二つ
      </text>
      {bubble(420, "店が負担？", s(1))}
      {bubble(1500, "値段に入っている？", s(2))}
      <g opacity={third}>
        <rect x={810} y={300} width={300} height={340} rx={30} fill="none" stroke={K.red} strokeWidth={6} strokeDasharray="20 14" />
        <Figure x={960} y={540} s={1.1} color="rgba(40,40,50,0.18)" />
        <text x={960} y={400} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={K.red}>
          ？
        </text>
        <text x={960} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.red}>
          もう一人の支払い手
        </text>
      </g>
    </Stage>
  );
}, { bg: "white" });

/* K07 BLUEPRINT/MAP: 箱の道のり（倉庫 → 仕分け → 夜の幹線 → 営業所 → 玄関） */
const K07 = mk(({ s }) => (
  <>
    <Stage>
      <RouteMap at={s(0) + 10} step={Math.max(30, Math.round((s(3) + 30 - s(0)) / 4))} />
    </Stage>
    <Tag text="配送の流れ（イメージ）" dark at={10} />
  </>
), { bg: "blueprint" });

/* K08 FLAT on MAP: 同じ地図の各地点にお金が落ちる（燃料・仕分け・倉庫・運ぶ人） */
const K08 = mk(({ f, s }) => (
  <>
    <Stage>
      <RouteMap at={-200} step={1} boxAt={-200} coins={[s(1) + 4, s(2) + 4, s(3) + 4, s(4) + 4]} />
      {[
        { x: 620, y: 230, t: "トラックの燃料", at: s(1) },
        { x: 1180, y: 230, t: "仕分けの機械", at: s(2) },
        { x: 220, y: 860, t: "倉庫で働く人", at: s(3) },
        { x: 1720, y: 330, t: "運ぶ人", at: s(4) },
      ].map((p, i) => {
        const o = pop(f, p.at);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${o})`} opacity={Math.min(1, o * 1.4)}>
            <rect x={-150} y={-36} width={300} height={72} rx={36} fill="#FFFFFF" />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
              {p.t}
            </text>
          </g>
        );
      })}
      <text x={960} y={140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill="#FFFFFF" opacity={fade(f, s(0))}>
        「タダで働く人」は、いない
      </text>
    </Stage>
    {[1, 2, 3, 4].map((i) => (
      <Sfx key={i} at={s(i) + 8} name="coin" volume={0.35} />
    ))}
  </>
), { bg: "blueprint", hideSubs: [1, 2, 3, 4] });

/* K08B DATA: 50億個 ÷ 人口 ＝ 約40個／人・年、上位3便で約95% */
const K08B = mk(({ f, s }) => {
  const boxes = Math.round(count(f, s(1) + 10, 60, 0, 40));
  const pie = ease(f, s(2) + 10, s(2) + 50);
  const a = 0.95 * pie * Math.PI * 2;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1)) * (1 - fade(f, s(2) - 10) * 0.75)}>
          <Figure x={320} y={640} s={1.4} />
          {Array.from({ length: boxes }, (_, i) => (
            <g key={i} transform={`translate(${520 + (i % 10) * 64} ${740 - Math.floor(i / 10) * 64})`}>
              <rect x={-26} y={-26} width={52} height={52} rx={4} fill={T.kraft} stroke={T.kraftDark} strokeWidth={3} />
              <rect x={-26} y={-5} width={52} height={10} fill={T.tape} />
            </g>
          ))}
          <text x={820} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            約{boxes}<tspan fontSize={54}>個</tspan>
          </text>
          <text x={820} y={410} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            50億個 ÷ 人口 ＝ 1人あたり・1年（単純計算）
          </text>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1500 460)">
          <circle r={230} fill="#E9E4DA" />
          <path d={`M 0 0 L 0 -230 A 230 230 0 ${a > Math.PI ? 1 : 0} 1 ${230 * Math.sin(a)} ${-230 * Math.cos(a)} Z`} fill={K.red} />
          <circle r={120} fill="#FFFFFF" />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
            約95%
          </text>
          <text y={290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.ink}>
            宅急便・飛脚宅配便・ゆうパック
          </text>
          <text y={335} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft}>
            トラック運送の宅配便に占める割合
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="国土交通省「令和6年度 宅配便・メール便取扱実績」" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* K08C GRAPH: 物販EC 15.2兆円、EC化率 9.78% → カートから箱がひとつ */
const K08C = mk(({ f, s }) => {
  const v = count(f, s(1) + 6, 36, 0, 15.2);
  const r = count(f, s(2) + 6, 36, 0, 9.78);
  const pb = pop(f, s(3) + 6);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <rect x={300} y={800 - 420 * (v / 15.2)} width={260} height={420 * (v / 15.2)} rx={10} fill={T.kraft} />
          <line x1={220} x2={640} y1={800} y2={800} stroke={K.ink} strokeWidth={5} />
          <text x={430} y={800 - 420 * (v / 15.2) - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
            {v.toFixed(1)}<tspan fontSize={44}>兆円</tspan>
          </text>
          <text x={430} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.ink}>
            物販のネット通販（2024年）
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={1100} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            物を買う取引のうち、ネット
          </text>
          <text x={1100} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={K.red}>
            {r.toFixed(2)}<tspan fontSize={80}>%</tspan>
          </text>
        </g>
        {/* カート → 箱 */}
        <g transform="translate(1600 760)" opacity={fade(f, s(3))}>
          <path d="M -120 -80 L -90 -80 L -50 40 L 90 40 L 120 -50 L -70 -50" fill="none" stroke={K.ink} strokeWidth={10} strokeLinejoin="round" />
          <circle cx={-30} cy={80} r={16} fill={K.ink} />
          <circle cx={70} cy={80} r={16} fill={K.ink} />
          <g transform={`translate(20 ${-80 - 140 * pb}) scale(${0.22 * pb})`}>
            <Box x={0} y={0} />
          </g>
        </g>
      </Stage>
      <EvidenceMark no="#04" source="経済産業省「電子商取引に関する市場調査」（2025年8月）" at={s(1)} />
      <Sfx at={s(3) + 6} name="pop" volume={0.5} />
    </>
  );
}, { bg: "white" });

export const OPEN5 = { K01, K02, K03, K05, K06, K06B, K07, K08, K08B, K08C };
