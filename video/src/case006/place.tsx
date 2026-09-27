/** G18–G21: QUESTION 3 → 場所（専門店 900店）→ 場所の契約（MONEY FLOW ②）→ 空き区画 → FC の想定 → どこで買う → 新しい機械 → ハピネットの決算 → 一社の数字 */
import React from "react";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Capsule, Coin, Easing, FONT, FloorGrid, G, Head, K, Machine, MoneyFlow6, Person6, SERIF, Sfx, ease, fade, pop } from "./kit";

/* G18 DARK: QUESTION 3 */
const G18 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0))}>
        <Person6 x={960} y={880} s={1.4} color="#3B4556" />
        <Capsule x={1180} y={820} r={60} color={G.cap[0]} />
        <Capsule x={760} y={840} r={50} color={G.cap[2]} />
      </g>
    </Stage>
    <Lines
      dark
      y={-260}
      lines={[
        { t: "リスクを背負うオペレーターは、", at: s(0), size: 64 },
        { t: <><R>何で</R>稼ぐ？</>, at: s(1), size: 120 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* G19 BLUEPRINT: 平面図の機械の枠が埋まる。専門店 900店以上（+200）→ 書店・モールの一角 → 池袋 3000台以上 */
const G19 = mk(({ f, s }) => {
  const n = count(f, s(1) + 20, 40, 0, 900);
  const fill = ease(f, s(3), s(4) + 120);
  return (
    <>
      <Stage>
        <text x={480} y={170} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={80} fill="#F5B83D" opacity={fade(f, s(0))}>
          鍵は「場所」
        </text>
        <g opacity={fade(f, s(1))}>
          <text x={480} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C9D6E6">
            全国の専門店（2026年1月末）
          </text>
          <text x={480} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill="#EAF6FF">
            {Math.round(n)}
            <tspan fontSize={64}>店以上</tspan>
          </text>
        </g>
        <Badge x={480} y={570} text="1年で +200店以上" at={s(2)} size={40} fill="#F5B83D" color={G.navy} />
        {/* 書店・モールの一角 */}
        <g opacity={fade(f, s(3))}>
          <rect x={940} y={160} width={860} height={500} fill="none" stroke={G.line} strokeWidth={5} />
          <rect x={960} y={180} width={360} height={220} fill="none" stroke={G.line} strokeWidth={3} strokeDasharray="10 8" />
          <text x={1140} y={290} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#C9D6E6">
            書店
          </text>
          <rect x={960} y={420} width={360} height={220} fill="none" stroke={G.line} strokeWidth={3} strokeDasharray="10 8" />
          <text x={1140} y={530} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#C9D6E6">
            モールの通路
          </text>
          <FloorGrid x={1370} y={196} cols={8} rows={9} cell={46} fill={fill} />
        </g>
        <g opacity={fade(f, s(5))}>
          <rect x={200} y={710} width={1520} height={120} rx={20} fill={G.navy} stroke="#F5B83D" strokeWidth={5} />
          <text x={960} y={771} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#F5B83D">
            池袋：3000台以上 ＝ ギネス世界記録
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(5) ? "#01" : "#09"} source={f < s(5) ? "日本カプセルトイ協会" : "バンダイナムコアミューズメント"} at={s(1)} dark />
    </>
  );
}, { bg: "blueprint" });

/* G19E MONEY FLOW ②: オペレーター → 設置場所（売上の一部・割合は非公表）→ 専門店は店ごと借りる → ガチャガチャの森・オリックス出資 */
const G19E = mk(({ f, s }) => {
  const flowO = 1 - fade(f, s(2) + 10, 16);
  const shop = fade(f, s(2) + 20);
  return (
    <>
      <Stage>
        <g opacity={flowO}>
          <MoneyFlow6 y={330} st={{ customer: 1, pay: fade(f, s(0)), op: 1, maker: 0.25, place: fade(f, s(0) + 50), placeQ: fade(f, s(1)) }} />
          <text x={1400} y={710} fontFamily={FONT} fontWeight={900} fontSize={44} fill={G.hidden} opacity={fade(f, s(1))}>
            割合は 非公表
          </text>
        </g>
        <g opacity={shop}>
          <rect x={160} y={160} width={760} height={560} rx={30} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          <text x={540} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
            専門店 ＝ 店ごと借りる
          </text>
          <Machine x={380} y={470} s={0.36} />
          <Machine x={540} y={470} s={0.36} body={G.cap[2]} />
          <Machine x={700} y={470} s={0.36} body={G.cap[1]} />
          <text x={540} y={670} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={G.red}>
            場所代も売上も、自分で決める
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <rect x={1000} y={160} width={760} height={560} rx={30} fill="#FFFFFF" stroke={G.red} strokeWidth={5} />
          <text x={1380} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
            「ガチャガチャの森」
          </text>
          <Person6 x={1180} y={440} s={0.8} color="#3B4556" />
          <text x={1260} y={390} fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            スタッフ常駐
          </text>
          <text x={1260} y={440} fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            補充・故障にすぐ対応
          </text>
          <g opacity={fade(f, s(4))}>
            <text x={1380} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={G.red}>
              1000台を超える店も
            </text>
            <rect x={1080} y={600} width={600} height={90} rx={45} fill={K.ink} opacity={fade(f, s(4) + 60)} />
            <text x={1380} y={646} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF" opacity={fade(f, s(4) + 60)}>
              2025年 オリックスが出資
            </text>
          </g>
        </g>
        <text x={960} y={800} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={50} fill={K.ink} opacity={fade(f, s(5))}>
          お金の世界からも注目される商売に
        </text>
      </Stage>
      <EvidenceMark no="#10" source="オリックス / ルルアーク" at={s(3)} />
      <Sfx at={s(1)} name="tok" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* G19C BLUEPRINT: モールの平面図。建設費・賃料↑ → 空き区画（報道）→ ガチャの専門店が入る → 少ない人数 → 両方の都合が合う */
const TENANTS = [
  { x: 180, y: 180, w: 380, h: 240 },
  { x: 580, y: 180, w: 380, h: 240 },
  { x: 980, y: 180, w: 380, h: 240 },
  { x: 1380, y: 180, w: 360, h: 240 },
  { x: 180, y: 500, w: 380, h: 240 },
  { x: 580, y: 500, w: 380, h: 240 },
  { x: 980, y: 500, w: 380, h: 240 },
  { x: 1380, y: 500, w: 360, h: 240 },
];
const G19C = mk(({ f, s }) => {
  const vacant = [2, 5];
  const fill = ease(f, s(2) + 10, s(3) + 40);
  return (
    <>
      <Stage>
        <text x={960} y={460} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6" opacity={0.7}>
          ― 通路 ―
        </text>
        {TENANTS.map((t, i) => {
          const isV = vacant.includes(i);
          const v = isV ? fade(f, s(1) + 30 + vacant.indexOf(i) * 16) : 0;
          return (
            <g key={i}>
              <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={isV ? `rgba(154,163,175,${0.35 * v})` : "rgba(143,211,255,0.08)"} stroke={G.line} strokeWidth={4} />
              {isV && (
                <g opacity={v * (1 - fill)}>
                  <text x={t.x + t.w / 2} y={t.y + t.h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#EAF6FF">
                    空き
                  </text>
                </g>
              )}
              {isV && <FloorGrid x={t.x + 40} y={t.y + 30} cols={7} rows={4} cell={42} fill={fill} o={fade(f, s(2))} />}
            </g>
          );
        })}
        <Badge x={960} y={120} text="建設費・賃料↑ → 空いた区画が埋まらない（報道）" at={s(1) + 10} size={36} fill="#EAF6FF" color={G.navy} o={1 - fade(f, s(3) - 10)} />
        <g opacity={fade(f, s(3)) * (1 - fade(f, s(5) - 10))}>
          <Badge x={620} y={120} text="少ない人数で回せる" at={s(3)} size={40} fill="#F5B83D" color={G.navy} />
          <Badge x={1320} y={120} text="厨房も店員も いらない" at={s(4)} size={40} fill="#F5B83D" color={G.navy} />
        </g>
        <g opacity={fade(f, s(5))}>
          <rect x={300} y={770} width={1320} height={100} rx={50} fill={G.navy} stroke="#F5B83D" strokeWidth={5} />
          <text x={960} y={820} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#EAF6FF">
            埋めたい建物 ⇄ 場所がほしいオペレーター
          </text>
        </g>
        <Badge x={960} y={120} text="両方の都合が、ぴたりと合った" at={s(6)} size={44} fill={G.red} />
      </Stage>
      <EvidenceMark no="#11" source="デイリー新潮（報道）" at={s(1)} dark />
    </>
  );
}, { bg: "blueprint" });

/* G19F DOCUMENT: ガシャココ FC の募集資料 → 想定年商 6000万円 ÷ 500円 ＝ 年約12万回 ＝ 1日約330回（計算） */
const G19F = mk(({ f, s }) => {
  const row = (y: number, k: string, v: string, at: number, hl?: boolean) => (
    <g opacity={fade(f, at)}>
      <text x={200} y={y} fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.inkSoft}>
        {k}
      </text>
      {hl && <rect x={480} y={y - 44} width={ease(f, at + 10, at + 30) * 330} height={58} fill="rgba(245,184,61,0.5)" />}
      <text x={490} y={y} fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
        {v}
      </text>
    </g>
  );
  const calc = (y: number, t: React.ReactNode, at: number, big?: boolean) => (
    <text x={1340} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={big ? 76 : 50} fill={big ? G.red : K.ink} opacity={fade(f, at)}>
      {t}
    </text>
  );
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <rect x={140} y={170} width={740} height={640} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
          <rect x={140} y={170} width={740} height={100} fill={K.ink} />
          <text x={510} y={222} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF">
            ガシャココ FC 加盟募集（ハピネット）
          </text>
          <text x={200} y={340} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            2023年から フランチャイズでも展開
          </text>
          {row(460, "広さ", "20〜50坪", s(1))}
          {row(580, "開業まで", "契約から2か月", s(2))}
          {row(700, "想定年商", "約6000万円", s(2) + 90, true)}
        </g>
        <g>
          {calc(360, "6000万円 ÷ 500円", s(3) + 20)}
          {calc(470, <>＝ 1年 約<tspan fill={G.red}>12万回</tspan></>, s(3) + 90)}
          {calc(600, "÷ 365日", s(4))}
          {calc(730, <>1日 約330回</>, s(4) + 30, true)}
          <text x={1340} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={K.inkSoft} opacity={fade(f, s(4) + 40)}>
            ※すべて500円のガチャと仮定した計算。想定の数字
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#12" source="ハピネット ガシャココ FC 募集資料" at={s(1)} />
      <Sfx at={s(0) + 6} name="paper" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* G19B GRAPH: どこで買う？ スーパー・モール 76.6% / 専門店 2割台 → 何回もまわす大人 + 訪日客 */
const G19B = mk(({ f, s }) => {
  const w1 = ease(f, s(0) + 40, s(0) + 80) * 76.6 * 9;
  const w2 = ease(f, s(1) + 10, s(1) + 40) * 25 * 9;
  return (
    <>
      <Stage>
        <Head text="カプセルトイを買った場所" at={s(0)} y={150} size={46} color={K.inkSoft} x={700} />
        <g opacity={fade(f, s(0))}>
          <text x={120} y={300} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            スーパー・ショッピングモール
          </text>
          <rect x={120} y={330} width={w1} height={90} rx={12} fill="#3E8ED0" />
          <text x={140 + w1} y={390} fontFamily={FONT} fontWeight={900} fontSize={60} fill="#3E8ED0">
            76.6%
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={120} y={530} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            専門店
          </text>
          <rect x={120} y={560} width={w2} height={90} rx={12} fill={G.red} />
          <text x={140 + w2} y={620} fontFamily={FONT} fontWeight={900} fontSize={60} fill={G.red}>
            2割台
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <Person6 x={1320} y={520} s={1.1} color={K.ink} />
          {[0, 1, 2].map((i) => (
            <Capsule key={i} x={1220 + i * 100} y={620} r={36} color={G.cap[i]} o={fade(f, s(2) + 20 + i * 8)} />
          ))}
          <text x={1320} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
            何回もまわす大人
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <g transform="translate(1640 470)">
            <rect x={-80} y={-100} width={160} height={200} rx={20} fill="#F5B83D" stroke={K.ink} strokeWidth={5} />
            <path d="M -40 -100 L -40 -140 L 40 -140 L 40 -100" fill="none" stroke={K.ink} strokeWidth={8} />
            <circle cx={-44} cy={116} r={14} fill={K.ink} />
            <circle cx={44} cy={116} r={14} fill={K.ink} />
          </g>
          <text x={1640} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
            訪日客のお土産
          </text>
        </g>
        <Badge x={1100} y={810} text="観光地の近くでは、客の半数以上が訪日客の店も（報道）" at={s(4)} size={34} fill={K.ink} />
      </Stage>
      <EvidenceMark no={f < s(4) ? "#02" : "#13"} source={f < s(4) ? "クロス・マーケティング 調査（2025年8月）" : "INBOUND PLUS ほか（報道）"} at={s(0)} />
    </>
  );
}, { bg: "white" });

/* G19D OBJECT: 新しい機械。現金 + スマホ決済 + 海外決済、500円玉 4 枚、最大 2500円 */
const G19D = mk(({ f, s }) => {
  const coins = Math.floor(ease(f, s(2) + 50, s(2) + 110) * 4);
  const price = count(f, s(3) + 10, 40, 500, 2500);
  const icon = (y: number, t: string, at: number, color: string) => (
    <g opacity={fade(f, at)} transform={`translate(1300 ${y})`}>
      <rect x={-40} y={-40} width={80} height={80} rx={18} fill={color} transform={`scale(${pop(f, at)})`} />
      <text x={70} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
        {t}
      </text>
    </g>
  );
  return (
    <>
      <Stage>
        <Machine x={600} y={560} s={0.8} price={`${Math.round(price / 10) * 10}円`} />
        {icon(290, "現金", s(1) + 10, G.coin)}
        {icon(390, "スマホ決済", s(1) + 60, "#3E8ED0")}
        {icon(490, "海外の決済サービス", s(2) + 10, "#5BB974")}
        <g opacity={fade(f, s(2) + 40)}>
          {[0, 1, 2, 3].map((i) => (
            <Coin key={i} x={1350 + i * 110} y={610} r={46} o={i < coins ? 1 : 0.2} />
          ))}
          <text x={1510} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            500円玉 4枚まで
          </text>
        </g>
        <Badge x={1500} y={800} text="最大 2500円まで設定できる" at={s(3) + 10} size={40} />
        <g opacity={fade(f, s(4))}>
          <rect x={1050} y={120} width={820} height={80} rx={40} fill={K.ink} />
          <text x={1460} y={160} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
            500円超えも、訪日客も、最初から想定
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#14" source="バンダイ" at={s(1)} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={s(2) + 50 + i * 15} name="coin" volume={0.35} />
      ))}
    </>
  );
}, { bg: "white" });

/* G20 EVIDENCE: ハピネット アミューズメント事業（2026年3月期）売上約654億円・利益約52億円（+71%）→ 100円あたり約8円 → 全社営業利益155億円の約3分の1 */
const G20 = mk(({ f, s }) => {
  const hl = (at: number) => ease(f, at, at + 20);
  const share = ease(f, s(7) + 10, s(7) + 50) * (52 / 155);
  const ang = share * Math.PI * 2;
  const R0 = 130;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <rect x={120} y={140} width={1000} height={700} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
          <text x={170} y={220} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            ハピネット 決算（2026年3月期）
          </text>
          <line x1={170} x2={1070} y1={250} y2={250} stroke={K.ink} strokeWidth={3} />
          <text x={170} y={320} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft} opacity={fade(f, s(1))}>
            アミューズメント事業（ガシャココ など）
          </text>
          <g opacity={fade(f, s(2))}>
            <rect x={400} y={350} width={hl(s(2) + 10) * 460} height={70} fill="rgba(245,184,61,0.5)" />
            <text x={170} y={405} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
              売上高
            </text>
            <text x={410} y={405} fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
              約654億円
            </text>
          </g>
          <g opacity={fade(f, s(3))}>
            <rect x={400} y={450} width={hl(s(3) + 10) * 600} height={70} fill="rgba(229,72,77,0.25)" />
            <text x={170} y={505} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
              利益
            </text>
            <text x={410} y={505} fontFamily={FONT} fontWeight={900} fontSize={60} fill={G.red}>
              約52億円 <tspan fontSize={44}>（+71%）</tspan>
            </text>
          </g>
          <g opacity={fade(f, s(4))}>
            <text x={170} y={590} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
              前の年（計算）：売上 約520億円 / 利益 約30億円
            </text>
          </g>
          <g opacity={fade(f, s(5))}>
            <line x1={170} x2={1070} y1={630} y2={630} stroke="#DDD6C8" strokeWidth={3} />
            <Coin x={260} y={730} r={60} text="100" />
            <path d="M 350 730 L 460 730 M 430 700 L 460 730 L 430 760" stroke={K.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
            <Coin x={540} y={730} r={40 * pop(f, s(5) + 20)} text="8" />
            <text x={620} y={750} fontFamily={FONT} fontWeight={900} fontSize={46} fill={G.red}>
              約8円が利益（計算）
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(6))} transform="translate(1500 520)">
          <text y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            全社の営業利益
          </text>
          <text y={-180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
            約155億円
          </text>
          <circle r={R0} fill="#E6E0D5" />
          <path d={`M 0 0 L 0 ${-R0} A ${R0} ${R0} 0 ${ang > Math.PI ? 1 : 0} 1 ${R0 * Math.sin(ang)} ${-R0 * Math.cos(ang)} Z`} fill={G.red} />
          <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={G.red} opacity={fade(f, s(7) + 40)}>
            約3分の1
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#15" source="ハピネット 決算資料" at={s(1)} />
      <Sfx at={s(0) + 6} name="paper" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* G21 KEY: 一社の数字（業界平均ではない）→ それでも、在庫リスクを背負う側が利益を伸ばしている */
const G21 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(960 380)" opacity={fade(f, s(0))}>
        <rect x={-560} y={-110} width={1120} height={220} rx={20} fill="#FFFFFF" stroke={K.inkSoft} strokeWidth={4} strokeDasharray="14 10" />
        <text y={-30} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
          一社の数字
        </text>
        <text y={48} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
          業界全体の平均ではない
        </text>
      </g>
      <g opacity={fade(f, s(1))} transform="translate(960 700)">
        <path d="M -460 30 L -300 30" stroke={G.risk} strokeWidth={50} />
        <text x={-380} y={32} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#FFFFFF">
          在庫リスク
        </text>
        <text x={-260} y={30} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
          を背負う側が、利益を伸ばしている
        </text>
      </g>
    </Stage>
  </>
), { bg: "white" });

export const PLACE6 = { G18, G19, G19E, G19C, G19F, G19B, G19D, G20, G21 };
