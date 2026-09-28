/** H21–H36: QUESTION 4 → 売上の中身と固定費 → 売れない今夜は0円 → CLUE 02 → MID REVEAL（三つの埋め方）→ CLUE 03 → QUESTION 5 → 建設費 → 人手不足 → 需要 → 土地オーナー方式 → 出張規程 → 宿泊税 → FINAL MONEY FLOW → FINAL CLUE → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, count, mk } from "../case002/ui";
import { Badge, Coin, FArrow, FNode, Head, Person6 } from "../case006/kit";
import { Building, Easing, FONT, H, K, Receipt, SERIF, Sfx, Sleeve, ease, fade, pop } from "./kit";

/* H21 DARK: QUESTION 4。三つの扉がどれも緑 */
const H21 = mk(({ f, s }) => (
  <>
    <Stage>
      {[
        { x: 560, c: H.apa, l: "値段を動かす" },
        { x: 960, c: H.toyoko, l: "値段を固定" },
        { x: 1360, c: H.dormy, l: "泊まる理由" },
      ].map((d, i) => (
        <g key={i} transform={`translate(${d.x} 620)`} opacity={fade(f, s(0) + i * 20)}>
          <rect x={-110} y={-200} width={220} height={320} rx={8} fill={d.c} opacity={0.85} />
          <circle cx={70} cy={-40} r={14} fill={H.green} />
          <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#EAF2FF">
            {d.l}
          </text>
        </g>
      ))}
    </Stage>
    <Lines
      dark
      y={-300}
      lines={[
        { t: "みんな、儲かっている。", at: s(0) + 60, size: 60 },
        { t: <>1泊1.5万円の<R>中身</R>は？</>, at: s(1), size: 100 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* H22 BLUEPRINT: 売上の85〜95%は部屋（と言われる）/ 費用 = 建物 + 人 = 毎晩ほぼ同じ */
const H22 = mk(({ f, s }) => {
  const room = ease(f, s(0) + 20, s(0) + 60) * 90;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))} transform="translate(480 470)">
          <text y={-250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#EAF2FF">
            売上
          </text>
          <circle r={190} fill="none" stroke="rgba(143,211,255,0.25)" strokeWidth={80} />
          <circle r={190} fill="none" stroke={H.lit} strokeWidth={80} strokeDasharray={`${(room / 100) * 2 * Math.PI * 190} 2000`} transform="rotate(-90)" />
          <text y={-10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#EAF2FF">
            部屋 85〜95%
          </text>
          <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#C9D6E6">
            （と言われる）
          </text>
          <text y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#C9D6E6" opacity={fade(f, s(1))}>
            レストランで稼ぐ商売ではない
          </text>
        </g>
        {/* 費用: 建物 + 人（毎晩同じ高さ） */}
        <g opacity={fade(f, s(2))} transform="translate(1100 180)">
          <text x={330} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#EAF2FF">
            費用（毎晩）
          </text>
          {["月", "火", "水", "木", "金"].map((d, i) => (
            <g key={d} transform={`translate(${i * 140} 60)`} opacity={fade(f, s(2) + i * 6)}>
              <rect x={0} y={0} width={110} height={300} rx={8} fill="#5A6B88" />
              <rect x={0} y={300} width={110} height={200} rx={8} fill="#8FA6BF" />
              <text x={55} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#EAF2FF">
                {d}
              </text>
            </g>
          ))}
          <text x={-20} y={220} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#EAF2FF">
            建物
          </text>
          <text x={-20} y={470} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#EAF2FF">
            人
          </text>
        </g>
        <Badge x={1430} y={820} text="泊まっても 泊まらなくても ほぼ同じ" at={s(3)} size={34} fill={H.lit} color={H.night} />
      </Stage>
      <EvidenceMark no="#12" source="業界解説（と言われる）" at={s(0)} dark />
    </>
  );
}, { bg: "blueprint" });

/* H23 BLUEPRINT: 100室・1万円・10室空き → 10万円が消える（イメージ）/ 費用は減らない / 明日に持ち越せない */
const H23 = mk(({ f, s }) => {
  const offAt = s(0) + 40;
  const offIdx = [3, 17, 28, 44, 51, 66, 72, 85, 90, 98];
  const k = Math.floor(ease(f, offAt, offAt + 40) * 10);
  const gone = fade(f, s(1));
  const flip = ease(f, s(3), s(3) + 30);
  return (
    <>
      <Stage>
        <g transform="translate(0 0)">
          <Building x={560} y={880} cols={10} rows={10} cell={46} lit={100} off={offIdx.slice(0, k)} />
        </g>
        <g opacity={gone}>
          <text x={1340} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C9D6E6">
            1万円 × 空き10室
          </text>
          <text x={1340} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={H.lit}>
            −10<tspan fontSize={60}>万円</tspan>
          </text>
          <text x={1340} y={410} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#C9D6E6">
            ※イメージ
          </text>
        </g>
        <Badge x={1340} y={500} text="家賃も 給料も 減らない" at={s(2)} size={36} fill="#EAF2FF" color={H.night} />
        {/* 今夜 → 明日（カレンダーがめくれて、空き部屋は消える） */}
        <g opacity={fade(f, s(3))} transform="translate(1340 690)">
          <g transform={`scale(1 ${1 - flip})`}>
            <rect x={-150} y={-100} width={300} height={200} rx={14} fill="#FFFFFF" />
            <rect x={-150} y={-100} width={300} height={50} rx={14} fill={H.red} />
            <text y={30} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
              今夜
            </text>
          </g>
          <g opacity={flip}>
            <rect x={-150} y={-100} width={300} height={200} rx={14} fill="#FFFFFF" />
            <rect x={-150} y={-100} width={300} height={50} rx={14} fill="#5A6B88" />
            <text y={30} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
              明日
            </text>
          </g>
          <text x={0} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={H.lit} opacity={fade(f, s(5))}>
            売れなかった今夜は 持ち越せない
          </text>
        </g>
      </Stage>
    </>
  );
}, { bg: "blueprint" });

/* H24 CLUE 02（BGM なし） */
const H24 = mk(({ s }) => <Sleeve no="02" at={s(0)} />, { bg: "paper", noSub: true });

/* H25 MONEY FLOW ②（MID REVEAL）: 三つのレーンが同じ「空き部屋」を埋める */
const H25 = mk(({ f, s }) => {
  const lanes = [
    { y: 330, c: H.apa, name: "アパ", how: "埋まる夜は高く・空く夜は安く", at: s(2) },
    { y: 520, c: H.toyoko, name: "東横イン", how: "値段を固定・出張の常連（会員800万人超）", at: s(3) },
    { y: 710, c: H.dormy, name: "ドーミーイン", how: "泊まりたくなる理由", at: s(5) },
  ];
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <text x={960} y={140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={K.ink}>
            1泊1.5万円 ＝ <tspan fill={H.red}>空き部屋が少ない夜</tspan>の値段
          </text>
        </g>
        {lanes.map((l, i) => (
          <g key={i} opacity={fade(f, l.at)}>
            <rect x={160} y={l.y - 60} width={260} height={120} rx={20} fill={l.c} />
            <text x={290} y={l.y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF">
              {l.name}
            </text>
            <FArrow d={`M 440 ${l.y} L 1320 ${l.y}`} o={1} color={l.c} label={l.how} lx={880} ly={l.y - 44} lsize={32} />
          </g>
        ))}
        {/* 同じ「空き部屋」 */}
        <g opacity={fade(f, s(6))} transform="translate(1560 520)">
          <Building x={0} y={260} cols={5} rows={8} cell={44} lit={ease(f, s(6), s(6) + 60, 0.5, 0.95)} />
          <text y={320} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
            売れ残った今夜を減らす
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#09" source="東横イン（会員数・報道）" at={s(4)} />
    </>
  );
}, { bg: "white" });

/* H26 CLUE 03 */
const H26 = mk(({ s }) => <Sleeve no="03" at={s(0)} />, { bg: "paper", noSub: true });

/* H27 DARK: QUESTION 5 */
const H27 = mk(({ f, s }) => (
  <>
    <Stage>
      <path d="M 860 620 L 1060 620 M 1010 570 L 1060 620 L 1010 670" transform="rotate(90 960 620)" stroke="#C9D6E6" strokeWidth={18} fill="none" strokeLinecap="round" opacity={fade(f, s(0) + 20)} />
    </Stage>
    <Lines
      dark
      y={-200}
      lines={[{ t: <>この値段は、<R>下がる</R>？</>, at: s(0), size: 110 }]}
    />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* H28 TIMELINE: 建設費↑ → 大型開発の延期（報道）→ 2026年 東京で開業（BH中心）→ その先は減る見込み */
const H28 = mk(({ f, s }) => {
  const years = [
    { y: "2026", n: 5, at: s(3) },
    { y: "2027", n: 3, at: s(4) },
    { y: "2028", n: 2, at: s(4) + 20 },
    { y: "2029", n: 1, at: s(4) + 40 },
  ];
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <text x={440} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            建設費
          </text>
          <path d="M 440 560 L 440 280 M 390 330 L 440 280 L 490 330" stroke={H.red} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <Badge x={440} y={680} text="大型開発の延期（報道）" at={s(2)} size={34} fill={K.ink} />
        {/* 年ごとの新しいホテル（クレーン） */}
        <g opacity={fade(f, s(3))}>
          <text x={1300} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            新しいホテルの計画（イメージ・報道）
          </text>
          {years.map((yr, i) => (
            <g key={i} opacity={fade(f, yr.at)} transform={`translate(${960 + i * 230} 640)`}>
              {Array.from({ length: yr.n }, (_, j) => (
                <rect key={j} x={-40} y={-60 - j * 70} width={80} height={60} rx={6} fill={i === 0 ? H.toyoko : "#9FB3C8"} />
              ))}
              <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
                {yr.y}
              </text>
            </g>
          ))}
        </g>
        <text x={960} y={820} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={K.ink} opacity={fade(f, s(5))}>
          部屋は、簡単には増えない
        </text>
      </Stage>
      <EvidenceMark no="#13" source="報道（建設費・開業計画）" at={s(2)} />
    </>
  );
}, { bg: "white" });

/* H28C EVIDENCE: 人手不足 5割超（正社員・非正社員）/ 清掃・フロント不足で稼働率を制限 / 人件費・リネン代↑ */
const H28C = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(1))}>
        <rect x={140} y={150} width={860} height={620} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
        <text x={190} y={230} fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
          旅館・ホテルの人手不足（2025年1月）
        </text>
        <line x1={190} x2={950} y1={260} y2={260} stroke={K.ink} strokeWidth={3} />
        {[
          { l: "正社員", v: 50, y: 360 },
          { l: "非正社員", v: 50, y: 480 },
        ].map((b, i) => {
          const w = ease(f, s(1) + 20 + i * 20, s(1) + 50 + i * 20) * 460;
          return (
            <g key={i}>
              <text x={190} y={b.y + 10} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
                {b.l}
              </text>
              <rect x={380} y={b.y - 36} width={w} height={70} rx={10} fill={H.red} />
              <text x={400 + w} y={b.y + 12} fontFamily={FONT} fontWeight={900} fontSize={40} fill={H.red} opacity={w > 420 ? 1 : 0}>
                5割超
              </text>
            </g>
          );
        })}
        <text x={190} y={640} fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink} opacity={fade(f, s(2))}>
          清掃・フロント不足で 稼働率を制限するケースも
        </text>
        <text x={190} y={710} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(3))}>
          人件費・シーツやタオルのクリーニング代も上昇
        </text>
      </g>
      {/* 部屋はあるのに売れない */}
      <g opacity={fade(f, s(2))} transform="translate(1440 560)">
        <rect x={-260} y={-300} width={520} height={560} rx={16} fill={H.night} />
        <Building x={0} y={180} cols={6} rows={7} cell={44} lit={0.55} />
        <g transform="translate(0 -120)" opacity={fade(f, s(2) + 20)}>
          <rect x={-160} y={-40} width={320} height={80} rx={40} fill={H.red} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#FFFFFF">
            清掃が間に合わない
          </text>
        </g>
      </g>
      <Badge x={960} y={830} text="値段を 下げにくい方向へ" at={s(4)} size={38} fill={K.ink} />
    </Stage>
    <EvidenceMark no="#04" source="帝国データバンク" at={s(1)} />
    <Sfx at={s(1) + 6} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* H28B DATA: 需要も変わる。アパ 2026年11月期 増収減益見込み（万博効果の剥落）/ 需要増 ≠ 利益増（TDB） */
const H28B = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(1))}>
        <text x={560} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
          アパグループ 2026年11月期の見込み
        </text>
        <g transform="translate(400 460)">
          <path d="M 0 100 L 0 -100 M -50 -50 L 0 -100 L 50 -50" stroke={H.toyoko} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            売上
          </text>
        </g>
        <g transform="translate(720 460)">
          <path d="M 0 -100 L 0 100 M -50 50 L 0 100 L 50 50" stroke={H.red} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={H.red}>
            利益
          </text>
        </g>
        <text x={560} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
          大阪・関西万博の効果がなくなる
        </text>
      </g>
      <g opacity={fade(f, s(2))}>
        <rect x={1060} y={300} width={720} height={260} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
        <text x={1420} y={390} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
          帝国データバンクの見方
        </text>
        <text x={1420} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
          需要が増えても 利益は別
        </text>
      </g>
      <Badge x={1420} y={700} text="埋まる夜が減れば 値段の勢いも弱まる" at={s(3)} size={34} fill={K.ink} />
    </Stage>
    <EvidenceMark no={f < s(2) ? "#06" : "#04"} source={f < s(2) ? "アパグループ 決算発表" : "帝国データバンク"} at={s(1)} />
  </>
), { bg: "white" });

/* H29 MONEY FLOW ③: 土地オーナー（建てる）← 家賃（最長30年）← 東横イン（運営）← 常連客 */
const H29 = mk(({ f, s }) => (
  <>
    <Stage>
      <Head text="東横インの出店のしかた" at={s(0)} y={130} size={46} color={H.toyoko} />
      <g opacity={fade(f, s(1))}>
        <Person6 x={300} y={520} s={1} color="#7A6A55" />
        <text x={300} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
          土地の持ち主
        </text>
        <g transform="translate(300 360)">
          <rect x={-50} y={-80} width={100} height={30} fill="#7A6A55" />
        </g>
      </g>
      <g opacity={fade(f, s(1) + 30)}>
        <FArrow d="M 400 470 L 760 470" o={1} color="#7A6A55" label="東横イン仕様で建てる" lx={580} ly={430} lsize={30} />
        <Building x={900} y={620} cols={5} rows={7} cell={36} lit={0.8} />
      </g>
      <g opacity={fade(f, s(2))}>
        <FNode x={1500} y={470} label="東横イン" sub="一棟まるごと借りて運営" o={1} w={360} color={H.toyoko} />
        <FArrow d="M 1320 560 C 1100 700 600 700 330 600" o={1} color="#B8902A" label="家賃（最長30年）" lx={830} ly={740} lsize={34} />
        <Coin x={830 + 200 * Math.sin(f / 15)} y={690} r={26} text="¥" />
      </g>
      <Badge x={400} y={820} text="運営しなくても 長く家賃が入る" at={s(3)} size={30} fill="#FFFFFF" color={K.ink} />
      <Badge x={1500} y={640} text="土地・建物を買わない" at={s(4)} size={34} fill={H.toyoko} />
    </Stage>
    <EvidenceMark no="#14" source="東横インホテル企画開発" at={s(1)} />
  </>
), { bg: "white" });

/* H30 DOCUMENT: 出張の宿泊費を増額 31.1%・予定 8.7% / 国家公務員 2025年4月 実費（上限）へ・東京など 1万9,000円 */
const H30 = mk(({ f, s }) => {
  const up = ease(f, s(4), s(4) + 30, 0, 1, Easing.out(Easing.cubic));
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))} transform="translate(470 470)">
          <text y={-250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            直近3年で 宿泊費を
          </text>
          <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={H.red}>
            {count(f, s(1) + 10, 30, 0, 31.1).toFixed(1)}
            <tspan fontSize={60}>%</tspan>
          </text>
          <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            の会社が 増額
          </text>
          <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft} opacity={fade(f, s(2))}>
            増額予定 8.7%
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <rect x={940} y={160} width={840} height={640} rx={12} fill="#FFFDF6" stroke={K.ink} strokeWidth={4} />
          <text x={990} y={240} fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            国家公務員の旅費（2025年4月〜）
          </text>
          <line x1={990} x2={1740} y1={270} y2={270} stroke={K.ink} strokeWidth={3} />
          <text x={990} y={350} fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            決まった額を渡す
          </text>
          <text x={990} y={420} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            → 上限の範囲で 実際の額
          </text>
          <g opacity={fade(f, s(4))}>
            <line x1={1000} x2={1720} y1={720 - 200 * up} y2={720 - 200 * up} stroke={H.red} strokeWidth={6} strokeDasharray="16 10" />
            <text x={1720} y={700 - 200 * up} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={H.red}>
              東京など 上限 19,000円
            </text>
          </g>
        </g>
        <Badge x={960} y={850} text="上がった値段を 決まりが追いかける" at={s(5)} size={34} fill={K.ink} />
      </Stage>
      <EvidenceMark no={f < s(3) ? "#02" : "#15"} source={f < s(3) ? "産労総合研究所（2025年度）" : "改正旅費法"} at={s(1)} />
      <Sfx at={s(3) + 6} name="paper" volume={0.45} />
    </>
  );
}, { bg: "paper" });

/* H30B DATA: 宿泊税。京都市 2026年3月〜（6,000〜2万円未満 400円・最高1万円・税収 52→126億円）/ 東京都 2027年4月〜 1万3,000円以上に3% → 1万5千円で450円 */
const H30B = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(1))}>
        <text x={500} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
          京都市（2026年3月〜）
        </text>
        {[
          { l: "6,000円未満", v: "200円" },
          { l: "6,000〜2万円未満", v: "400円", hl: true },
          { l: "2万〜5万円未満", v: "1,000円" },
          { l: "5万〜10万円未満", v: "4,000円" },
          { l: "10万円以上", v: "1万円", top: true },
        ].map((r, i) => (
          <g key={i} opacity={fade(f, s(1) + 20 + i * 14)} transform={`translate(160 ${230 + i * 84})`}>
            <rect width={680} height={70} rx={10} fill={r.hl ? "rgba(217,67,75,0.15)" : "#FFFFFF"} stroke={K.ink} strokeWidth={3} />
            <text x={24} y={46} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
              {r.l}
            </text>
            <text x={656} y={48} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={38} fill={r.top || r.hl ? H.red : K.ink}>
              {r.v}
            </text>
          </g>
        ))}
        <text x={500} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink} opacity={fade(f, s(2))}>
          税収 52億円 → 126億円（見込み）
        </text>
      </g>
      <g opacity={fade(f, s(3))}>
        <Receipt
          x={1400}
          y={150}
          w={560}
          title="東京都（2027年4月〜）"
          lines={[
            { k: "宿泊料金", v: "15,000円", at: s(3) + 20 },
            { k: "宿泊税（3%）", v: "450円", at: s(4), color: H.red, big: true },
          ]}
        />
        <text x={1400} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
          1泊1万3,000円以上が対象
        </text>
      </g>
      <Badge x={1400} y={720} text="部屋の値段だけでは 決まらない" at={s(5)} size={34} fill={K.ink} />
    </Stage>
    <EvidenceMark no={f < s(3) ? "#16" : "#17"} source={f < s(3) ? "京都市" : "東京都主税局"} at={s(1)} />
    <Sfx at={s(4)} name="coin" volume={0.35} />
  </>
), { bg: "white" });

/* H31 FINAL MONEY FLOW（字幕は隠す）: 客 → 予約（サイト／自社）→ ホテル（今夜の部屋）→ 建物・人・税 / 三つの埋め方 */
const H31 = mk(({ f, s }) => {
  const t0 = s(0);
  return (
    <Stage>
      <Head text="ビジネスホテルの MONEY FLOW" at={t0} y={110} size={48} />
      <g opacity={fade(f, t0 + 10)}>
        <Person6 x={200} y={520} s={1} />
        <text x={200} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
          客
        </text>
      </g>
      <FArrow d="M 290 420 C 420 320 520 300 620 300" o={fade(f, t0 + 30)} color="#9AA3AF" label="予約サイト（手数料）" lx={480} ly={270} lsize={28} />
      <FArrow d="M 290 520 L 760 480" o={fade(f, t0 + 50)} color={H.dormy} label="自社予約" lx={520} ly={540} lsize={28} />
      <g opacity={fade(f, t0 + 70)}>
        <rect x={780} y={260} width={420} height={360} rx={20} fill={H.night} />
        <Building x={990} y={560} cols={6} rows={5} cell={40} lit={ease(f, t0 + 70, t0 + 130, 0.3, 0.9)} />
        <text x={990} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
          ホテル（今夜の部屋）
        </text>
      </g>
      {[
        { l: "建物（家賃）", y: 300, at: t0 + 120 },
        { l: "人（清掃ほか）", y: 440, at: t0 + 140 },
        { l: "宿泊税", y: 580, at: t0 + 160 },
      ].map((c, i) => (
        <g key={i} opacity={fade(f, c.at)}>
          <FArrow d={`M 1210 440 L 1440 ${c.y}`} o={1} color="#B8902A" />
          <FNode x={1620} y={c.y} label={c.l} o={1} w={360} />
        </g>
      ))}
      <g opacity={fade(f, t0 + 200)}>
        {[
          { l: "値段を動かす", c: H.apa },
          { l: "値段を固定", c: H.toyoko },
          { l: "泊まる理由", c: H.dormy },
        ].map((b, i) => (
          <g key={i} transform={`translate(${620 + i * 340} 780)`}>
            <rect x={-150} y={-40} width={300} height={80} rx={40} fill={b.c} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#FFFFFF">
              {b.l}
            </text>
          </g>
        ))}
      </g>
    </Stage>
  );
}, { bg: "white", hideSubs: [0] });

/* H32 FINAL CLUE */
const H32 = mk(({ s }) => <Sleeve no="FINAL" at={s(0) + 10} />, { bg: "paper", noSub: true });

/* H33 KEY: 答え。夜の建物の窓が灯る */
const H33 = mk(({ f, s }) => (
  <>
    <Stage>
      <rect x={0} y={0} width={1920} height={1080} fill={H.night} />
      <Building x={960} y={1030} cols={14} rows={7} cell={44} lit={ease(f, s(0), s(0) + 60, 0.4, 0.9)} />
    </Stage>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, fontFamily: SERIF }}>
      <div style={{ fontSize: 88, fontWeight: 900, color: "#FFFFFF", opacity: fade(f, s(0)), textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
        答えは――<span style={{ color: H.lit }}>高くても埋まる</span>ようになったから。
      </div>
      <div style={{ fontSize: 50, fontWeight: 900, color: "#C9D6E6", marginTop: 30, opacity: fade(f, s(1)), textAlign: "center", lineHeight: 1.5 }}>
        空き部屋が少ない夜ほど、値段は上がる。
        <br />
        <span style={{ opacity: fade(f, s(2)) }}>その埋め方の違いが、ホテルごとの値段の違い。</span>
      </div>
    </AbsoluteFill>
  </>
), { bg: "night", noSub: true });

/* H34–H36: KANENAZO 固定エンディング */
const H34 = mk(
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

const H35 = mk(
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

const H36 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const TONIGHT7 = { H21, H22, H23, H24, H25, H26, H27, H28, H28C, H28B, H29, H30, H30B, H31, H32, H33, H34, H35, H36 };
export { pop };
