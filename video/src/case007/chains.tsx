/** H13–H20C: QUESTION 2 → アパ（4倍・曜日・決算・値段を動かす・デイユース）→ 反転 → 東横イン（ワンプライス・決算・2倍・出張の上限）→ ドーミーイン → 予約サイトの手数料 */
import React from "react";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Coin, FArrow, FNode, Head, Person6 } from "../case006/kit";
import { Building, Calendar, CardKey, Easing, FONT, H, K, Receipt, SERIF, Sfx, ease, fade, pop } from "./kit";

/* アパ池袋 5月（イメージ: 報道の最安 6,000円・最高 2万6,200円、月・水が安く土曜が高い） */
const APA = Array.from({ length: 35 }, (_, i) => {
  const d = (i + 5) % 7; // 5月1日 = 金曜（2026年）
  const base = [15000, 7000, 9500, 6500, 10000, 14500, 24000][d];
  const wobble = ((i * 37) % 9) * 350;
  if (i === 16) return 26200; // 最高（土）
  if (i === 10) return 6000; // 最安（月）
  return Math.min(25800, base + wobble);
}).slice(0, 35);
const TOYOKO = Array.from({ length: 35 }, (_, i) => ((i + 5) % 7 === 6 || (i + 5) % 7 === 5 ? 11000 : 9800));

/* H13 DARK: QUESTION 2 */
const H13 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform={`translate(960 760) rotate(${6 * Math.sin(f / 5)})`}>
        <rect x={-200} y={-80} width={400} height={160} rx={20} fill="#F4EFE4" />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={84} fill={H.red}>
          ¥↑
        </text>
      </g>
    </Stage>
    <Lines
      dark
      y={-240}
      lines={[
        { t: "値段を上げれば、客は逃げるはず。", at: s(0), size: 64 },
        { t: <>本当に<R>上げたほうが儲かる</R>？</>, at: s(1), size: 96 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* H14 DATA: アパ池袋 5月のシングル、6,000円〜2万6,200円（4倍超）、1日最大6回の変更 */
const H14 = mk(({ f, s }) => (
  <>
    <Stage>
      <Head text="アパホテル池袋駅北口 5月のシングル（報道の例・色はイメージ）" at={s(0)} y={120} size={34} color={K.inkSoft} />
      <Calendar x={120} y={230} prices={APA} lo={6000} hi={26200} reveal={ease(f, s(1), s(1) + 60)} cell={100} hl={f > s(1) + 80 ? [10, 16] : []} showNum={false} />
      <g opacity={fade(f, s(1) + 80)}>
        <text x={1400} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
          いちばん安い日
        </text>
        <text x={1400} y={400} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#3E7FC1">
          6,000円
        </text>
        <text x={1400} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
          いちばん高い日
        </text>
        <text x={1400} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={H.red}>
          26,200円
        </text>
      </g>
      <g transform={`translate(1400 700) scale(${pop(f, s(2))})`} opacity={fade(f, s(2))}>
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={72} fill={K.ink}>
          同じ部屋で 4倍超
        </text>
      </g>
      <Badge x={1400} y={810} text="1日に最大6回 値段を変える" at={s(3) + 10} size={34} fill={K.ink} />
    </Stage>
    <EvidenceMark no={f < s(3) ? "#05" : "#07"} source={f < s(3) ? "ITmedia（2026年4月）" : "日経クロステック"} at={s(0)} />
  </>
), { bg: "white" });

/* H14B DATA: 同じカレンダーで 月・水 が安く、土 が高い / 平日 = 出張、週末 = 旅行・訪日 */
const H14B = mk(({ f, s }) => (
  <>
    <Stage>
      <Calendar x={120} y={230} prices={APA} lo={6000} hi={26200} reveal={1} cell={100} showNum={false} hlCol={f < s(1) ? [1, 3] : [6]} />
      <g opacity={fade(f, s(2))}>
        <g transform="translate(1300 360)">
          <rect x={-70} y={-50} width={140} height={100} rx={12} fill={K.ink} />
          <rect x={-30} y={-70} width={60} height={24} rx={6} fill="none" stroke={K.ink} strokeWidth={8} />
          <text x={120} y={0} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            平日 = 出張
          </text>
        </g>
        <g transform="translate(1300 560)" opacity={fade(f, s(2) + 40)}>
          <rect x={-60} y={-70} width={120} height={150} rx={16} fill={H.dormy} />
          <circle cx={-34} cy={90} r={12} fill={K.ink} />
          <circle cx={34} cy={90} r={12} fill={K.ink} />
          <text x={120} y={0} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            週末 = 旅行・訪日
          </text>
        </g>
      </g>
      <Badge x={1460} y={790} text="曜日で 部屋を欲しい人の数が違う" at={s(3)} size={34} fill={K.ink} />
    </Stage>
    <EvidenceMark no="#05" source="ITmedia（2026年4月）" at={s(0)} />
  </>
), { bg: "white" });

/* H15 EVIDENCE: アパグループ 2025年11月期 売上 2,667億円・経常利益 996億円（約37%）・3期連続最高 */
const H15 = mk(({ f, s }) => {
  const w = ease(f, s(2), s(2) + 30) * 37;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <rect x={140} y={150} width={900} height={620} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
          <text x={190} y={230} fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
            アパグループ 決算（2025年11月期）
          </text>
          <line x1={190} x2={990} y1={260} y2={260} stroke={K.ink} strokeWidth={3} />
          <text x={190} y={360} fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.inkSoft}>
            売上高
          </text>
          <text x={460} y={365} fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.ink}>
            2,667億円
          </text>
          <g opacity={fade(f, s(1))}>
            <rect x={450} y={400} width={ease(f, s(1) + 6, s(1) + 26) * 380} height={76} fill="rgba(217,67,75,0.2)" />
            <text x={190} y={460} fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.inkSoft}>
              経常利益
            </text>
            <text x={460} y={465} fontFamily={FONT} fontWeight={900} fontSize={64} fill={H.red}>
              996億円
            </text>
          </g>
          <g opacity={fade(f, s(3))}>
            <text x={190} y={580} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
              3期連続で 過去最高
            </text>
          </g>
        </g>
        {/* 100円のうち 37円 */}
        <g opacity={fade(f, s(2))} transform="translate(1180 300)">
          <text x={280} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            売上100円のうち
          </text>
          <rect x={0} y={0} width={560} height={110} rx={14} fill="#E6E0D5" />
          <rect x={0} y={0} width={w * 5.6} height={110} rx={14} fill={H.red} />
          <text x={280} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={H.red}>
            約{Math.round(w)}円
          </text>
          <text x={280} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            が経常利益（計算）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#06" source="アパグループ 決算発表" at={s(0)} />
      <Sfx at={s(0) + 6} name="paper" volume={0.45} />
    </>
  );
}, { bg: "paper" });

/* H16 FLAT: 埋まる夜 ↑ / 空く夜 ↓ → 1部屋あたりの売上を最大に */
const H16 = mk(({ f, s }) => {
  const t = Math.sin(f / 18);
  return (
    <>
      <Stage>
        <g transform="translate(960 480)">
          <path d="M -60 180 L 0 60 L 60 180 Z" fill={K.ink} />
          <g transform={`rotate(${12 * t})`}>
            <rect x={-520} y={40} width={1040} height={24} rx={12} fill={K.ink} />
            <g transform="translate(-420 0)">
              <rect x={-110} y={-110} width={220} height={140} rx={16} fill={H.night} />
              <text y={-40} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={H.lit}>
                埋まる夜 ¥↑
              </text>
            </g>
            <g transform="translate(420 0)">
              <rect x={-110} y={-110} width={220} height={140} rx={16} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
              <text y={-40} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#3E7FC1">
                空く夜 ¥↓
              </text>
            </g>
          </g>
        </g>
        <Badge x={960} y={820} text="1部屋あたりの売上を 最大に" at={s(1)} size={42} fill={H.red} />
      </Stage>
    </>
  );
}, { bg: "paper" });

/* H16B OBJECT: デイユース。カードキー → 返却ポスト → 清掃のスマホに通知 → 1日2回 → 稼働率100%超（報道） */
const H16B = mk(({ f, s }) => {
  const drop = ease(f, s(2), s(2) + 24, 0, 1, Easing.in(Easing.quad));
  const ping = pop(f, s(2) + 30);
  const sun = ease(f, s(1), s(1) + 60);
  return (
    <>
      <Stage>
        {/* 返却ポスト */}
        <g transform="translate(420 520)">
          <rect x={-130} y={-200} width={260} height={400} rx={18} fill="#2F3B52" />
          <rect x={-70} y={-150} width={140} height={16} rx={8} fill="#0B1220" />
          <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#EAF2FF">
            返却ポスト
          </text>
          <CardKey x={0} y={-340 + 190 * drop} s={0.4} o={fade(f, s(2) - 10) * (1 - fade(f, s(2) + 20, 6))} />
        </g>
        {/* スマホ通知 */}
        <g transform={`translate(860 480) scale(${ping})`} opacity={Math.min(1, ping * 1.4)}>
          <rect x={-110} y={-200} width={220} height={400} rx={30} fill="#1B1F27" />
          <rect x={-94} y={-180} width={188} height={360} rx={20} fill="#FFFFFF" />
          <rect x={-80} y={-120} width={160} height={90} rx={12} fill={H.green} />
          <text y={-76} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#FFFFFF">
            812号室 空き
          </text>
          <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.ink}>
            清掃へ
          </text>
        </g>
        {/* 昼と夜の 2 回 */}
        <g transform="translate(1440 420)" opacity={fade(f, s(1))}>
          <circle r={170} fill="#F4EFE4" stroke={K.ink} strokeWidth={5} />
          <path d={`M 0 0 L 0 -170 A 170 170 0 0 1 ${170 * Math.sin(sun * Math.PI)} ${-170 * Math.cos(sun * Math.PI)} Z`} fill="#F5C542" />
          <path d={`M 0 0 L 0 170 A 170 170 0 0 1 ${-170 * Math.sin(ease(f, s(3), s(3) + 40) * Math.PI)} ${170 * Math.cos(ease(f, s(3), s(3) + 40) * Math.PI)} Z`} fill={H.night} />
          <text x={-50} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            昼
          </text>
          <text x={50} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={ease(f, s(3), s(3) + 40) > 0.5 ? "#FFFFFF" : K.ink}>
            夜
          </text>
          <text y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            1日に2回 売る
          </text>
        </g>
        <Badge x={1440} y={780} text="稼働率 100%超のホテルも（報道）" at={s(3) + 30} size={34} fill={H.red} />
        <text x={960} y={140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={K.ink} opacity={fade(f, s(4))}>
          売っているのは「空いている時間」
        </text>
      </Stage>
      <EvidenceMark no="#07" source="日経クロステック" at={s(2)} />
      <Sfx at={s(2) + 22} name="tok" volume={0.5} />
      <Sfx at={s(2) + 30} name="ding" volume={0.35} />
    </>
  );
}, { bg: "white" });

/* H17 DARK: 反転予告 */
const H17 = mk(({ f, s }) => (
  <>
    <Lines
      dark
      y={-60}
      lines={[
        { t: "ところが。", at: s(0), size: 70 },
        { t: <>値上げしないのに、<R>利益が増えた</R>ホテル</>, at: s(1), size: 84 },
      ]}
    />
    <Sfx at={s(1)} name="stamp" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* H18 OBJECT: 東横イン 361店・約7万9,000室、原則ワンプライス、都心シングル上限（平日1万2,000円・休前日1万7,000円） */
const H18 = mk(({ f, s }) => {
  const lim = fade(f, s(3));
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <text x={440} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={H.toyoko}>
            東横イン
          </text>
          <text x={440} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            {Math.round(count(f, s(1), 30, 0, 361))}
            <tspan fontSize={50}>店</tspan>
          </text>
          <text x={440} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            客室 約7万9,000室
          </text>
        </g>
        <Badge x={440} y={560} text="原則ワンプライス" at={s(2)} size={46} fill={H.toyoko} />
        {/* 上限線 */}
        <g opacity={lim}>
          <text x={1340} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            東京都心のシングル この値段を超えない（上限・報道）
          </text>
          {[
            { l: "平日", v: 12000, at: s(3) },
            { l: "土・祝前日", v: 17000, at: s(4) },
          ].map((b, i) => {
            const h = ease(f, b.at, b.at + 24) * b.v * 0.03;
            return (
              <g key={i} opacity={fade(f, b.at)}>
                <rect x={1080 + i * 300} y={760 - h} width={200} height={h} rx={10} fill={H.toyoko} />
                <line x1={1050 + i * 300} x2={1310 + i * 300} y1={760 - b.v * 0.03} y2={760 - b.v * 0.03} stroke={H.red} strokeWidth={6} strokeDasharray="14 8" />
                <text x={1180 + i * 300} y={760 - b.v * 0.03 - 22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={H.red}>
                  {b.v.toLocaleString("ja-JP")}円
                </text>
                <text x={1180 + i * 300} y={805} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
                  {b.l}
                </text>
              </g>
            );
          })}
        </g>
      </Stage>
      <EvidenceMark no="#09" source="プレジデント / ITmedia / 東横イン" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* H19 EVIDENCE: 東横イン 2026年3月期 客室単価 8,172円（平均の6割未満）/ 売上 1,623億円 / 利益 232億円（+45%）/ 営業利益率 20.4% */
const H19 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0))}>
        <rect x={140} y={150} width={900} height={640} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
        <text x={190} y={230} fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
          東横イン 決算（2026年3月期）
        </text>
        <line x1={190} x2={990} y1={260} y2={260} stroke={K.ink} strokeWidth={3} />
        <text x={190} y={350} fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
          客室単価
        </text>
        <text x={470} y={355} fontFamily={FONT} fontWeight={900} fontSize={64} fill={H.toyoko}>
          8,172円
        </text>
        <g opacity={fade(f, s(2))}>
          <text x={190} y={450} fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            売上高
          </text>
          <text x={470} y={455} fontFamily={FONT} fontWeight={900} fontSize={58} fill={K.ink}>
            1,623億円
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <rect x={460} y={490} width={ease(f, s(3) + 6, s(3) + 26) * 520} height={76} fill="rgba(47,111,181,0.18)" />
          <text x={190} y={550} fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            利益
          </text>
          <text x={470} y={555} fontFamily={FONT} fontWeight={900} fontSize={58} fill={H.red}>
            232億円 <tspan fontSize={40}>（+45%）</tspan>
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <text x={190} y={660} fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            営業利益率
          </text>
          <text x={470} y={665} fontFamily={FONT} fontWeight={900} fontSize={58} fill={K.ink}>
            20.4%
          </text>
        </g>
      </g>
      {/* 単価の比較 */}
      <g opacity={fade(f, s(1))} transform="translate(1180 760)">
        {[
          { l: "大手平均", v: 14463, c: "#9FB3C8" },
          { l: "東横イン", v: 8172, c: H.toyoko },
        ].map((b, i) => {
          const h = ease(f, s(1) + i * 10, s(1) + 24 + i * 10) * b.v * 0.032;
          return (
            <g key={i}>
              <rect x={i * 280} y={-h} width={200} height={h} rx={10} fill={b.c} />
              <text x={i * 280 + 100} y={-h - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={b.c === H.toyoko ? H.toyoko : K.ink}>
                {b.v.toLocaleString("ja-JP")}円
              </text>
              <text x={i * 280 + 100} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
                {b.l}
              </text>
            </g>
          );
        })}
        <text x={240} y={-560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink} opacity={fade(f, s(1) + 30)}>
          平均の 6割未満
        </text>
      </g>
    </Stage>
    <EvidenceMark no="#08" source="東横イン 決算発表 / 日本経済新聞" at={s(0)} />
    <Sfx at={s(0) + 6} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* H19B GRAPH: 売上 807 → 1,228 → 1,439 → 1,623億円 / 2024年度 2,532万人 = 1日約7万人（計算） */
const H19B = mk(({ f, s }) => {
  const bars = [
    { y: "2023/3", v: 807, at: s(0) + 20 },
    { y: "2024/3", v: 1228, at: s(0) + 40 },
    { y: "2025/3", v: 1439, at: s(0) + 60 },
    { y: "2026/3", v: 1623, at: s(1) },
  ];
  return (
    <>
      <Stage>
        <Head text="東横イン 売上高（億円）" at={s(0)} y={140} size={44} color={K.inkSoft} x={620} />
        <line x1={160} x2={1080} y1={780} y2={780} stroke={K.ink} strokeWidth={5} />
        {bars.map((b, i) => {
          const h = ease(f, b.at, b.at + 24, 0, 1, Easing.out(Easing.cubic)) * b.v * 0.33;
          return (
            <g key={i} opacity={fade(f, b.at)}>
              <rect x={200 + i * 220} y={780 - h} width={160} height={h} rx={10} fill={i === 3 ? H.toyoko : "#9FB3C8"} />
              <text x={280 + i * 220} y={780 - h - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
                {b.v.toLocaleString("ja-JP")}
              </text>
              <text x={280 + i * 220} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
                {b.y}
              </text>
            </g>
          );
        })}
        <Badge x={620} y={250} text="3年で 約2倍" at={s(2)} size={44} fill={H.red} />
        <g opacity={fade(f, s(3))}>
          <text x={1480} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            2024年度の利用者（海外含む）
          </text>
          <text x={1480} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={K.ink}>
            2,532<tspan fontSize={56}>万人</tspan>
          </text>
          {Array.from({ length: 10 }, (_, i) => (
            <Person6 key={i} x={1250 + (i % 5) * 115} y={580 + Math.floor(i / 5) * 130} s={0.45} color={i < ease(f, s(3) + 20, s(3) + 60) * 10 ? H.toyoko : "#DDD6C8"} />
          ))}
        </g>
        <Badge x={1480} y={800} text="1日 7万人近く（計算）" at={s(4)} size={38} fill={K.ink} />
      </Stage>
      <EvidenceMark no="#08" source="東横イン 決算 / プレジデント" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* H20 FLAT: 出張の上限の下に、いつも同じ値段 → 迷わず選ぶ。訪日客 約1割 vs 業界 約25% */
const H20 = mk(({ f, s }) => {
  const cap = 680;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <rect x={160} y={180} width={900} height={620} rx={16} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text x={210} y={250} fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
            出張規程（宿泊費）
          </text>
          <line x1={200} x2={1020} y1={cap - 300} y2={cap - 300} stroke={H.red} strokeWidth={6} strokeDasharray="16 10" />
          <text x={1010} y={cap - 320} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={32} fill={H.red}>
            上限
          </text>
          {Array.from({ length: 6 }, (_, i) => {
            const h = 220 + (i % 2) * 6;
            const o = fade(f, s(2) + i * 8);
            return <rect key={i} x={230 + i * 130} y={cap - h} width={90} height={h} rx={8} fill={H.toyoko} opacity={o} />;
          })}
          <text x={610} y={cap + 70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={H.toyoko} opacity={fade(f, s(2))}>
            毎回同じ値段 → 迷わず選べる
          </text>
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1480 470)">
          <text y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            宿泊客に占める訪日客
          </text>
          {[
            { l: "東横イン", v: 10, c: H.toyoko, x: -120 },
            { l: "業界全体", v: 25, c: "#9FB3C8", x: 120 },
          ].map((b, i) => {
            const h = ease(f, s(4) + i * 40, s(4) + 30 + i * 40) * b.v * 12;
            return (
              <g key={i}>
                <rect x={b.x - 80} y={180 - h} width={160} height={h} rx={10} fill={b.c} />
                <text x={b.x} y={180 - h - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
                  約{b.v === 10 ? "1割" : "25%"}
                </text>
                <text x={b.x} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
                  {b.l}
                </text>
              </g>
            );
          })}
        </g>
        <text x={960} y={120} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={44} fill={K.ink} opacity={fade(f, s(3))}>
          日本の出張客との縁を大切に（社長）
        </text>
      </Stage>
      <EvidenceMark no="#09" source="プレジデント / ITmedia" at={s(3)} />
    </>
  );
}, { bg: "paper" });

/* H20B OBJECT: ドーミーイン（大浴場・夜食ラーメン・朝食）+ 共立メンテナンス 決算 + 会員・訪日客 */
const H20B = mk(({ f, s }) => {
  const icon = (x: number, label: string, at: number, draw: React.ReactNode) => {
    const p = pop(f, at);
    return (
      <g transform={`translate(${x} 330) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
        <circle r={110} fill="#FFF6E6" stroke={H.dormy} strokeWidth={6} />
        {draw}
        <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
          {label}
        </text>
      </g>
    );
  };
  const steam = (dx: number) => <path d={`M ${dx} -40 C ${dx - 14} -60 ${dx + 14} -76 ${dx} -96`} stroke="#C9B79C" strokeWidth={6} fill="none" strokeLinecap="round" />;
  return (
    <>
      <Stage>
        <text x={960} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={H.dormy} opacity={fade(f, s(1))}>
          ドーミーイン
        </text>
        {icon(560, "大浴場", s(1) + 10, <g><path d="M -70 0 L 70 0 L 56 50 L -56 50 Z" fill="#8FC4E8" />{steam(-30)}{steam(0)}{steam(30)}</g>)}
        {icon(960, "夜食のラーメン", s(1) + 30, <g><path d="M -70 -6 L 70 -6 C 60 50 -60 50 -70 -6 Z" fill="#F2E3C4" stroke={K.ink} strokeWidth={4} /><path d="M -40 -6 C -20 -30 20 -30 40 -6" stroke="#E9C46A" strokeWidth={6} fill="none" />{steam(-10)}{steam(20)}</g>)}
        {icon(1360, "朝食", s(1) + 50, <g><circle r={50} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} /><circle r={20} fill="#F5C542" /></g>)}
        <g opacity={fade(f, s(2))}>
          <rect x={260} y={560} width={1400} height={140} rx={20} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
          <text x={960} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            共立メンテナンス（2026年3月期）
          </text>
          <text x={960} y={670} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
            売上高 2,752億円 / 営業利益 248億円 / 3期連続 最高益
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <Badge x={700} y={790} text="会員 200万人超" at={s(3)} size={36} fill={H.dormy} />
          <Badge x={1220} y={790} text="訪日客 21.4%" at={s(3) + 20} size={36} fill="#FFFFFF" color={K.ink} />
        </g>
      </Stage>
      <EvidenceMark no="#10" source="共立メンテナンス 決算短信・説明資料" at={s(2)} />
    </>
  );
}, { bg: "white" });

/* H20C MONEY FLOW ①: 予約の 2 つの道。予約サイト（国内 8〜10%・海外 12〜15%）→ 1万5千円なら 1,200〜2,000円超 / 自社予約 25.8% */
const H20C = mk(({ f, s }) => {
  const coinT = (f % 50) / 50;
  return (
    <>
      <Stage>
        <Head text="予約の 2 つの道" at={s(0)} y={130} size={46} />
        <g opacity={fade(f, s(0))}>
          <Person6 x={220} y={540} s={1} />
          <text x={220} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
            客
          </text>
        </g>
        <FNode x={1600} y={470} label="ホテル" o={fade(f, s(0))} w={260} />
        {/* 上: 予約サイト */}
        <g opacity={fade(f, s(1))}>
          <FArrow d="M 320 440 C 460 300 620 280 760 280" o={1} color="#9AA3AF" />
          <FNode x={900} y={280} label="予約サイト" sub="国内 8〜10% / 海外 12〜15%" o={1} w={330} />
          <FArrow d="M 1070 280 C 1260 280 1400 360 1470 420" o={1} color="#9AA3AF" />
          <Coin x={1100 + 300 * coinT} y={240 + 120 * coinT} r={30} text="¥" />
          {/* 手数料が抜ける */}
          <g transform={`translate(900 ${200 - 40 * coinT})`} opacity={1 - coinT}>
            <Coin x={0} y={0} r={22} text="¥" />
          </g>
        </g>
        {/* 下: 自社予約 */}
        <g opacity={fade(f, s(0) + 20)}>
          <FArrow d="M 320 600 C 700 700 1200 660 1470 520" o={1} color={H.dormy} label="自社予約 25.8%（ドーミーイン）" lx={900} ly={720} lsize={34} />
        </g>
        <Receipt
          x={1560}
          y={600}
          w={600}
          title="1泊 15,000円なら"
          lines={[{ k: "手数料", v: "1,200〜2,000円超", at: s(2), color: H.red }]}
          o={fade(f, s(2))}
        />
      </Stage>
      <EvidenceMark no={f < s(1) ? "#10" : "#11"} source={f < s(1) ? "共立メンテナンス" : "予約サイト手数料（業界資料・と言われる）"} at={s(0)} />
      <Sfx at={s(2)} name="coin" volume={0.4} />
    </>
  );
}, { bg: "white" });

export const CHAINS7 = { H13, H14, H14B, H15, H16, H16B, H17, H18, H19, H19B, H20, H20B, H20C };
export { Building, R };
