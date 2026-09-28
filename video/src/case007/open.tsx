/** H01–H12: 問い（0秒）→ 1万4463円 vs 8878円 → QUESTION 1 → TITLE → 公表されていないもの → 2.3倍 → 泊まる人 → 何が変わった → 答え（先に）→ 稼働率 → 業態別 → 市場と差 → 残りの部屋で決まる → CLUE 01 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Head } from "../case006/kit";
import { Building, CardKey, Door, Easing, FONT, H, K, PeopleGrid, Receipt, SERIF, Sfx, Sleeve, ease, fade, pop } from "./kit";

/* H01 OBJECT: 0 フレームからカードキーが扉のリーダーにかざされ、ランプが赤 → 緑（BGM なし） */
const H01 = mk(
  ({ f }) => {
    const move = ease(f, 0, 22, 0, 1, Easing.out(Easing.cubic));
    const lamp = f > 26 ? 1 : 0;
    return (
      <>
        <Stage>
          <Door x={960} y={720} s={0.78} lamp={lamp} />
          <CardKey x={1420 - 300 * move} y={760 - 60 * move} s={0.5} r={-18 + 18 * move} />
        </Stage>
        <Lines
          dark
          y={-400}
          lines={[
            { t: "ビジネスホテルは、", at: -16, size: 72 },
            { t: <>なぜ1泊<R>1.5万円</R>に？</>, at: -8, size: 104 },
          ]}
        />
        <Sfx at={24} name="tok" volume={0.5} />
        <Sfx at={27} name="ding" volume={0.35} />
      </>
    );
  },
  { bg: "black", noSub: true },
);

/* H02 DATA: 2 枚の明細。ホテル平均 1万4463円 vs 会社の宿泊費 8878円 → 差 5000円以上 / 大都市 1万1262円 */
const H02 = mk(({ f, s }) => {
  const gap = ease(f, s(2), s(2) + 20);
  const city = fade(f, s(3));
  return (
    <>
      <Stage>
        <Receipt x={540} y={130} s={1.25} title="ホテル（大手の平均）" lines={[{ k: "1泊", v: "14,463円", at: s(0) + 20, big: true, color: H.red }]} />
        <Receipt
          x={1380}
          y={130}
          s={1.25}
          title="会社の出張宿泊費"
          lines={[
            { k: "平均", v: "8,878円", at: s(1) + 20, big: true },
            { k: "大都市", v: "11,262円", at: s(3) + 10 },
          ]}
        />
        {/* 差 */}
        <g opacity={gap * (1 - city)}>
          <rect x={560} y={640} width={800} height={120} rx={60} fill={H.red} />
          <text x={960} y={700} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#FFFFFF">
            5,000円以上 足りない
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <rect x={560} y={640} width={800} height={120} rx={60} fill={K.ink} />
          <text x={960} y={700} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#FFFFFF">
            大都市でも 3,000円以上 足りない
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(1) ? "#01" : "#02"} source={f < s(1) ? "東京商工リサーチ（2025年度）" : "産労総合研究所（2025年度）"} at={s(0)} />
      <Sfx at={s(0) + 20} name="paper" volume={0.45} />
      <Sfx at={s(1) + 20} name="paper" volume={0.45} />
    </>
  );
}, { bg: "white" });

/* H03 DARK: QUESTION 1。狭いシングルの線画にスポット */
const H03 = mk(({ f, s }) => (
  <>
    <Stage>
      <defs>
        <radialGradient id="spot7" cx="50%" cy="66%" r="36%">
          <stop offset="0%" stopColor="rgba(255,240,210,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#spot7)" />
      <g stroke="#C9D6E6" strokeWidth={5} fill="none" opacity={fade(f, 0)}>
        {/* ベッドと机（線画） */}
        <rect x={700} y={620} width={360} height={160} rx={12} />
        <rect x={700} y={590} width={110} height={50} rx={10} />
        <rect x={1100} y={640} width={140} height={20} />
        <line x1={1110} x2={1110} y1={660} y2={780} />
        <line x1={1230} x2={1230} y1={660} y2={780} />
        <rect x={660} y={520} width={620} height={280} />
      </g>
    </Stage>
    <Lines
      dark
      y={-300}
      lines={[
        { t: "同じようなシングルが、", at: s(0), size: 70 },
        { t: <>なぜ、<R>ここまで高く</R>？</>, at: s(1), size: 104 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* H04 TITLE: カードキーのスリーブ型タイトル */
const H04 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #007</div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "stretch",
            background: "#F4EFE4",
            borderRadius: 22,
            overflow: "hidden",
            border: `5px solid ${H.toyoko}`,
            transform: `scale(${p}) rotate(-1.5deg)`,
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <div style={{ background: H.toyoko, color: "#FFFFFF", writingMode: "vertical-rl", fontSize: 26, fontWeight: 900, letterSpacing: 8, padding: "20px 14px" }}>KANENAZO HOTEL</div>
          <div style={{ padding: "34px 64px 40px", fontFamily: SERIF, fontSize: 84, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>
            ビジネスホテル、<span style={{ color: H.red }}>なぜ1泊1.5万円に？</span>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* H05 KEY: 公表されていないもの → 決算と統計で追う */
const Lock: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d="M -34 -10 L -34 -40 A 34 34 0 0 1 34 -40 L 34 -10" fill="none" stroke={K.ink} strokeWidth={12} />
    <rect x={-52} y={-12} width={104} height={80} rx={12} fill={K.ink} />
    <circle cy={24} r={10} fill="#FCFBF8" />
  </g>
);
const H05 = mk(({ f, s }) => {
  const box = (x: number, title: string, at: number) => (
    <g opacity={fade(f, at)} transform={`translate(${x} 330)`}>
      <rect x={-330} y={-140} width={660} height={280} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
      <text y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
        {title}
      </text>
      <Lock x={-150} y={40} o={fade(f, at + 14)} />
      <text x={60} y={50} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#9AA3AF" opacity={fade(f, at + 14)}>
        非公表
      </text>
    </g>
  );
  const look = pop(f, s(1));
  return (
    <>
      <Stage>
        {box(560, "1部屋の原価", s(0) + 20)}
        {box(1360, "1泊の儲け", s(0) + 60)}
        <g transform={`translate(960 640) scale(${look})`} opacity={Math.min(1, look * 1.4)}>
          <rect x={-420} y={-70} width={840} height={140} rx={70} fill={K.ink} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#FFFFFF">
            決算 ＋ 統計 で追う
          </text>
        </g>
        <Badge x={960} y={800} text="値段は、何で決まる？" at={s(2) + 6} fill="#FFFFFF" color={K.ink} size={40} />
      </Stage>
      <Sfx at={s(0) + 34} name="tok" volume={0.5} />
      <Sfx at={s(0) + 74} name="tok" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* H06 GRAPH: 2021年度 約6,300円（逆算）→ 2025年度 1万4463円（+1190円）/ 大手12社 1万7818円 */
const H06 = mk(({ f, s }) => {
  const base = 780;
  const k = 0.028;
  const b1 = ease(f, s(2), s(2) + 24) * 6288 * k;
  const b2 = ease(f, s(0) + 30, s(0) + 60, 0, 1, Easing.out(Easing.cubic)) * 14463 * k;
  return (
    <>
      <Stage>
        <Head text="大手ビジネスホテルの客室単価（1泊）" at={s(0)} y={140} size={44} color={K.inkSoft} />
        <line x1={260} x2={1300} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        <g opacity={fade(f, s(2))}>
          <rect x={380} y={base - b1} width={240} height={b1} rx={10} fill="#9FB3C8" />
          <text x={500} y={base - b1 - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft}>
            約6,300円※
          </text>
          <text x={500} y={base + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            2021年度
          </text>
        </g>
        <g opacity={fade(f, s(0) + 30)}>
          <rect x={860} y={base - b2} width={240} height={b2} rx={10} fill={H.red} />
          <text x={980} y={base - b2 - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={H.red}>
            {Math.round(count(f, s(0) + 30, 30, 0, 14463)).toLocaleString("ja-JP")}円
          </text>
          <text x={980} y={base + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            2025年度
          </text>
        </g>
        <Badge x={1180} y={560} text="+1,190円（前年）" at={s(1)} size={32} fill="#FFFFFF" color={H.red} />
        <g transform={`translate(770 440) scale(${pop(f, s(2) + 30)})`} opacity={fade(f, s(2) + 30)}>
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            ×2.3
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <line x1={1340} x2={1780} y1={base - 17818 * k} y2={base - 17818 * k} stroke={K.inkSoft} strokeWidth={4} strokeDasharray="14 10" />
          <text x={1560} y={base - 17818 * k - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.inkSoft}>
            大手12社 17,818円
          </text>
          <text x={1560} y={base - 17818 * k + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            （シティホテル等を含む）
          </text>
        </g>
        <text x={500} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(2) + 10)}>
          ※2025年度÷2.3で逆算
        </text>
        <g transform="translate(1560 700)" opacity={fade(f, s(0) + 10)}>
          <Building x={0} y={100} cols={5} rows={5} cell={30} lit={0.84} />
        </g>
      </Stage>
      <EvidenceMark no="#01" source="東京商工リサーチ（2026年6月）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* H07 GRAPH: 日本人 −3.8% / 外国人 +8.2% / 合計ほぼ横ばい / 4人に1人以上が外国人（人の格子 100人中 27人） */
const H07 = mk(({ f, s }) => {
  const grid = fade(f, s(4));
  return (
    <>
      <Stage>
        <g opacity={1 - grid}>
          <Head text="延べ宿泊者数（2025年）" at={s(1)} y={160} size={46} color={K.inkSoft} />
          <g opacity={fade(f, s(1))} transform="translate(560 480)">
            <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={K.inkSoft}>
              日本人
            </text>
            <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={K.ink}>
              4億7,561<tspan fontSize={50}>万人泊</tspan>
            </text>
            <text y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#3E7FC1" opacity={fade(f, s(2))}>
              −3.8%
            </text>
          </g>
          <g opacity={fade(f, s(3))} transform="translate(1360 480)">
            <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={K.inkSoft}>
              外国人
            </text>
            <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={K.ink}>
              1億7,787<tspan fontSize={50}>万人泊</tspan>
            </text>
            <text y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={H.red}>
              +8.2%
            </text>
          </g>
        </g>
        <g opacity={grid}>
          <text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
            合計は ほぼ横ばい（−0.8%）
          </text>
          <PeopleGrid x={720} y={250} n={100} foreign={27} reveal={ease(f, s(4) + 10, s(4) + 70)} />
          <g opacity={fade(f, s(6))}>
            <text x={1360} y={460} fontFamily={FONT} fontWeight={900} fontSize={56} fill={H.dormy}>
              外国人 27%
            </text>
            <text x={1360} y={530} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.ink}>
              4人に1人以上
            </text>
          </g>
          <Badge x={960} y={820} text="中身が変わった" at={s(5)} size={40} fill={K.ink} />
        </g>
      </Stage>
      <EvidenceMark no="#03" source="観光庁 宿泊旅行統計調査（2025年・速報）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* H08 KEY: 客数 → / 値段 ↑ / 何が変わった？ */
const H08 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0))} transform="translate(620 440)">
        <path d="M -140 0 L 140 0 M 90 -50 L 140 0 L 90 50" stroke={K.inkSoft} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.inkSoft}>
          客の数
        </text>
      </g>
      <g opacity={fade(f, s(1))} transform="translate(1300 440)">
        <path d="M 0 120 L 0 -140 M -54 -86 L 0 -140 L 54 -86" stroke={H.red} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={H.red}>
          値段
        </text>
      </g>
      <text x={960} y={160} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={K.ink} opacity={fade(f, s(2))}>
        何が変わった？
      </text>
    </Stage>
  </>
), { bg: "white" });

/* H09 KEY: 答え（先に）。夜の建物の窓が一斉に灯る（BGM なし） */
const H09 = mk(({ f, s }) => {
  const lit = ease(f, s(1), s(1) + 30, 0.35, 0.86, Easing.out(Easing.cubic));
  return (
    <>
      <Stage>
        <rect x={0} y={0} width={1920} height={1080} fill={H.night} />
        <Building x={960} y={1010} cols={12} rows={9} cell={44} lit={lit} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, fontFamily: SERIF }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: "#C9D6E6", opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 96, fontWeight: 900, color: "#FFFFFF", marginTop: 6, opacity: fade(f, s(1)), textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          高くても、<span style={{ color: H.lit }}>部屋が埋まる</span>ようになった。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "night", noSub: true });

/* H10 OBJECT: 夜の建物 10×10 窓、84 窓が灯る / 東横イン 80.4%（7年ぶり8割） */
const H10 = mk(({ f, s }) => {
  const lit = Math.round(count(f, s(0) + 10, 50, 0, 84));
  return (
    <>
      <Stage>
        <Building x={620} y={900} cols={10} rows={10} cell={52} lit={lit} />
        <g opacity={fade(f, s(0))}>
          <text x={1420} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#C9D6E6">
            大手ビジネスホテルの稼働率（2025年度）
          </text>
          <text x={1420} y={410} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={H.lit}>
            {(lit === 84 ? 83.9 : lit).toFixed(lit === 84 ? 1 : 0)}
            <tspan fontSize={80}>%</tspan>
          </text>
        </g>
        <Badge x={1420} y={500} text="10部屋中 8部屋以上が 毎晩埋まる" at={s(1)} size={34} fill={H.lit} color={H.night} />
        <g opacity={fade(f, s(2))}>
          <text x={1420} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#C9D6E6">
            東横イン（2026年3月期）
          </text>
          <text x={1420} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill="#EAF2FF">
            80.4<tspan fontSize={56}>%</tspan>
          </text>
          <text x={1420} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={H.lit} opacity={fade(f, s(3))}>
            7年ぶりに 8割超え
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(2) ? "#01" : "#08"} source={f < s(2) ? "東京商工リサーチ" : "東横イン 決算発表"} at={s(0)} dark />
    </>
  );
}, { bg: "night" });

/* H10B GRAPH: 宿の種類別の稼働率（2025年）BH 75.3% / シティ 74.2% / リゾート 56.9% / 旅館 38.4%、2019年 75.2% */
const H10B = mk(({ f, s }) => {
  const rows = [
    { l: "ビジネスホテル", v: 75.3, c: H.red, at: s(0) + 20 },
    { l: "シティホテル", v: 74.2, c: "#9FB3C8", at: s(2) + 20 },
    { l: "旅館", v: 38.4, c: "#9FB3C8", at: s(2) + 50 },
  ];
  return (
    <>
      <Stage>
        <Head text="宿の種類別 客室稼働率（2025年）" at={s(0)} y={150} size={44} color={K.inkSoft} x={820} />
        {rows.map((r, i) => {
          const w = ease(f, r.at, r.at + 30, 0, 1, Easing.out(Easing.cubic)) * r.v * 11;
          return (
            <g key={i} opacity={fade(f, r.at)}>
              <text x={460} y={300 + i * 170} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
                {r.l}
              </text>
              <rect x={500} y={300 + i * 170 - 50} width={w} height={100} rx={12} fill={r.c} />
              <text x={520 + w} y={300 + i * 170} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={r.c === H.red ? H.red : K.ink}>
                {r.v}%
              </text>
            </g>
          );
        })}
        <g opacity={fade(f, s(1))}>
          <line x1={500 + 75.2 * 11} x2={500 + 75.2 * 11} y1={220} y2={660} stroke={K.ink} strokeWidth={4} strokeDasharray="12 8" />
          <text x={500 + 75.2 * 11} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.ink}>
            2019年 75.2%
          </text>
        </g>
        <Badge x={1500} y={800} text="駅前・観光地の大手ほど よく埋まる" at={s(3)} size={36} fill={K.ink} />
      </Stage>
      <EvidenceMark no="#03" source="観光庁 宿泊旅行統計調査（2025年・速報）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* H10C EVIDENCE: 市場 6.5兆円（過去最高見込み）/ 債務超過 約3割 → 灯る建物と暗い建物 */
const H10C = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0))}>
        <rect x={140} y={170} width={820} height={560} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
        <text x={180} y={240} fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
          旅館・ホテル市場（事業者売上高）
        </text>
        <line x1={180} x2={920} y1={270} y2={270} stroke={K.ink} strokeWidth={3} />
        <text x={180} y={390} fontFamily={FONT} fontWeight={900} fontSize={110} fill={K.ink}>
          6.5<tspan fontSize={60}>兆円</tspan>
        </text>
        <text x={180} y={450} fontFamily={FONT} fontWeight={800} fontSize={32} fill={H.red}>
          2025年度・過去最高の見込み（前年度 6兆652億円）
        </text>
        <g opacity={fade(f, s(1))}>
          <line x1={180} x2={920} y1={500} y2={500} stroke="#DDD6C8" strokeWidth={3} />
          <text x={180} y={590} fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            債務超過の会社
          </text>
          <text x={560} y={600} fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
            約3割
          </text>
          <text x={180} y={680} fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            借金が資産を上回る状態
          </text>
        </g>
      </g>
      <g opacity={fade(f, s(3))}>
        <rect x={1020} y={170} width={780} height={560} rx={20} fill={H.night} />
        <Building x={1230} y={640} cols={5} rows={7} cell={40} lit={0.9} label="埋まる場所" />
        <Building x={1600} y={640} cols={5} rows={7} cell={40} lit={0.3} label="そうでない場所" />
      </g>
      <Badge x={960} y={820} text="業界全体が もうかっているわけではない" at={s(2)} size={38} fill={K.ink} />
    </Stage>
    <EvidenceMark no="#04" source="帝国データバンク 全国「旅館・ホテル市場」動向調査" at={s(0)} />
    <Sfx at={s(0) + 6} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* H11 DATA: 残りの部屋が減るたびに値段が一段ずつ上がる（イメージ） */
const H11 = mk(({ f, s }) => {
  const steps = [
    { left: 10, price: 8000 },
    { left: 6, price: 10000 },
    { left: 3, price: 13000 },
    { left: 1, price: 18000 },
  ];
  const k = Math.min(3, Math.max(0, Math.floor((f - s(3)) / 30)));
  const st = f < s(3) ? steps[0] : steps[k];
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <text x={500} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            ✕ 作るのにかかったお金
          </text>
          <line x1={320} x2={680} y1={210} y2={210} stroke={H.red} strokeWidth={6} opacity={fade(f, s(2))} />
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={1400} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            ◎ 今夜の残りの部屋
          </text>
        </g>
        {/* 残り部屋 */}
        <g opacity={fade(f, s(2) + 10)} transform="translate(360 330)">
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={(i % 5) * 110} y={Math.floor(i / 5) * 110} width={90} height={90} rx={10} fill={i < st.left ? "#FFFFFF" : H.lit} stroke={K.ink} strokeWidth={4} />
          ))}
          <text x={270} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
            残り {st.left}室
          </text>
        </g>
        {/* 値段の階段 */}
        <g opacity={fade(f, s(3))} transform="translate(1080 700)">
          {steps.map((p, i) => (
            <g key={i} opacity={i <= k ? 1 : 0.2}>
              <rect x={i * 170} y={-(p.price - 6000) / 30} width={150} height={(p.price - 6000) / 30} rx={8} fill={i === k ? H.red : "#9FB3C8"} />
              <text x={i * 170 + 75} y={-(p.price - 6000) / 30 - 18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
                {p.price.toLocaleString("ja-JP")}
              </text>
            </g>
          ))}
          <text x={330} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft}>
            ※イメージ
          </text>
        </g>
        <Badge x={960} y={830} text="ダイナミックプライシング" at={s(4)} size={40} fill={K.ink} />
      </Stage>
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={s(3) + i * 30} name="tok" volume={0.35} />
      ))}
    </>
  );
}, { bg: "white" });

/* H12 CLUE 01 */
const H12 = mk(({ s }) => <Sleeve no="01" at={s(0) + 10} />, { bg: "paper", hideSubs: [0] });

export const OPEN7 = { H01, H02, H03, H04, H05, H06, H07, H08, H09, H10, H10B, H10C, H11, H12 };
