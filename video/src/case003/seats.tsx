/** M26–M39: 席の限界（CLUE 02）→ シネコン → 客単価（CLUE 03）→ なぜポップコーン → もし売店がなかったら */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceDoc, EvidenceMark, FlowLine, Lines, Pill, R, Stage, Tag, count, mk, yen } from "../case002/ui";
import { Aroma, ClueStub, Cup, Draw, Easing, Figure, FONT, K, Note, PopPile, SERIF, Seats, T, ease, fade, pop } from "./kit";

const EIREN = "日本映画製作者連盟「2025年 全国映画概況」";

/* M26 CLUE 02 */
const M26 = mk(
  ({ f, s }) => (
    <>
      <Lines dark lines={[{ t: "映画館の、もう一つの特徴。", at: s(0), size: 84, out: s(1) - 12 }]} />
      <AbsoluteFill style={{ opacity: fade(f, s(1) - 8) }}>
        <ClueStub no="2" at={s(1) - 6} />
      </AbsoluteFill>
    </>
  ),
  { bg: "velvet", noSub: true },
);

/* M27 BLUEPRINT: 200席が埋まる → 満席 → 1日の上映回数 */
const M27 = mk(({ f, s }) => {
  const day = fade(f, s(2) - 6);
  return (
    <Stage>
      <g opacity={1 - day}>
        <Draw d="M 520 200 L 1440 200" at={0} w={14} len={1000} />
        <Note x={980} y={180} text="SCREEN" at={4} />
        <Seats at={s(0) + 10} dur={s(1) - s(0) - 10} x0={470} y0={290} gap={46} />
        <text x={980} y={880} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#FFFFFF" opacity={fade(f, s(1))}>
          満席 ＝ 200枚まで
        </text>
      </g>
      <g opacity={day}>
        <line x1={200} x2={1720} y1={560} y2={560} stroke={T.bp} strokeWidth={4} />
        {["10:00", "13:00", "16:00", "19:00", "22:00"].map((t, i) => (
          <text key={i} x={260 + i * 330} y={640} fontFamily={FONT} fontWeight={700} fontSize={32} fill={T.bp} opacity={0.8}>
            {t}
          </text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={260 + i * 330} y={470} width={250 * ease(f, s(2) + i * 6, s(2) + i * 6 + 20)} height={70} rx={10} fill={K.red} opacity={0.85} />
        ))}
        {["スクリーン", "座席", "上映時間"].map((t, i) => (
          <Pill key={i} x={560 + i * 400} y={300} text={t} at={s(3 + i)} size={52} color="#FFFFFF" fill="#10294A" />
        ))}
        <text x={960} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#FFFFFF" opacity={fade(f, s(7))}>
          1スクリーンで売れる席は、1日に数回分
        </text>
      </g>
    </Stage>
  );
}, { bg: "blueprint", hideSubs: [3, 4, 5] });

/* M28 BLUEPRINT/MAP: 3697スクリーン、うち3305がシネコン → 売店は一つ */
const M28 = mk(({ f, s }) => {
  const plan = fade(f, s(2) - 6);
  const walk = ease(f, s(2), s(3) + 30);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - plan, justifyContent: "center", alignItems: "center", paddingBottom: 80, fontFamily: FONT }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: T.bp }}>2025年　全国のスクリーン</div>
        <div style={{ fontSize: 200, fontWeight: 900, color: "#FFFFFF" }}>{yen(count(f, s(0) - 4, 30, 0, 3697))}</div>
        <div style={{ fontSize: 60, fontWeight: 900, color: K.gold, opacity: fade(f, s(1)) }}>うち シネコン {yen(count(f, s(1), 30, 0, 3305))}（約9割）</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - plan }}>
        <EvidenceMark no="#01" source={EIREN} dark />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: plan }}>
        <Stage>
          {Array.from({ length: 6 }, (_, i) => {
            const x = 300 + i * 264;
            return (
              <g key={i}>
                <Draw d={`M ${x} 180 L ${x + 220} 180 L ${x + 220} 420 L ${x} 420 Z`} at={s(2) - 6 + i * 3} len={1000} />
                <Note x={x + 110} y={315} text={`SCREEN ${i + 1}`} at={s(2) + i * 3} size={30} />
                <path d={`M ${x + 110} 420 L ${x + 110} ${420 + 240 * walk}`} stroke={K.red} strokeWidth={6} strokeDasharray="8 10" opacity={walk > 0 ? 0.8 : 0} />
              </g>
            );
          })}
          <rect x={560} y={640} width={800} height={160} rx={16} fill="rgba(226,69,47,0.2)" stroke={K.red} strokeWidth={6} opacity={fade(f, s(3))} />
          <text x={960} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#FFFFFF" opacity={fade(f, s(3))}>
            売店は、一つ
          </text>
          <Note x={960} y={870} text="全員が通るロビー" at={s(4)} size={44} color="#FFFFFF" />
        </Stage>
      </AbsoluteFill>
    </>
  );
}, { bg: "blueprint", hideSubs: [0, 1, 3] });

/* M29 DARK: 枚数を増やせないなら？ */
const M29 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "チケットを増やせないなら――", at: s(0), size: 80, serif: false, weight: 800, color: "#C9C2B6" },
        { t: <>売上は、<R>どう増やす？</R></>, at: s(1), size: 120 },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* M30 FLAT: Aさん と Bさん */
const M30 = mk(({ f, s }) => {
  const same = [s(3), s(4), s(5)];
  return (
    <Stage>
      {[0, 1].map((k) => {
        const x = k ? 1400 : 520;
        return (
          <g key={k} opacity={fade(f, s(1 + k))}>
            <Figure x={x} y={520} s={1.3} color={k ? K.ink : K.inkSoft} />
            <text x={x} y={210} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.ink}>
              {k ? "Bさん" : "Aさん"}
            </text>
            <rect x={x - 180} y={700} width={360} height={80} rx={12} fill={T.ticket} stroke={T.velvet} strokeWidth={5} />
            <text x={x} y={742} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={T.velvet}>
              チケット
            </text>
            {k === 1 && (
              <g opacity={fade(f, s(2) + 20)}>
                <Cup x={x + 260} y={560} s={0.3} fill={1} />
                <rect x={x + 180} y={640} width={60} height={110} rx={8} fill="#2A5A8A" />
              </g>
            )}
          </g>
        );
      })}
      {same.map((at, i) => (
        <Pill key={i} x={960} y={340 + i * 110} text={["同じ映画", "同じ座席", "同じ上映時間"][i]} at={at} size={40} color={K.inkSoft} />
      ))}
      <g opacity={fade(f, s(6))}>
        <rect x={260} y={560 - 90} width={70} height={90} rx={8} fill={K.inkSoft} />
        <rect x={1660} y={560 - 90} width={70} height={90} rx={8} fill={K.inkSoft} />
        <rect x={1660} y={560 - 90 - 170} width={70} height={170} rx={8} fill={K.red} />
        <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
          使った金額が違う
        </text>
      </g>
    </Stage>
  );
}, { hideSubs: [1, 3, 4, 5] });

/* M31 CLUE 03 → メニューの大きさとセット */
const M31 = mk(({ f, s }) => {
  const menu = fade(f, s(2) - 6);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - menu }}>
        <ClueStub no="3" at={s(0)} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: menu }}>
        <Stage>
          <g opacity={fade(f, s(2))}>
            <Cup x={420} y={560} s={0.75} fill={1} />
            <text x={420} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={T.butter}>
              大きなポップコーン
            </text>
          </g>
          <g opacity={fade(f, s(3))} transform="translate(960 560)">
            <rect x={-90} y={-170} width={180} height={320} rx={18} fill="#2A5A8A" />
            <rect x={-100} y={-190} width={200} height={34} rx={10} fill="#DDE8F2" />
            <text y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={T.butter}>
              大きなドリンク
            </text>
          </g>
          <g opacity={fade(f, s(4))}>
            <rect x={1260} y={380} width={520} height={360} rx={24} fill="none" stroke={T.butter} strokeWidth={6} strokeDasharray="20 14" />
            <Cup x={1440} y={560} s={0.4} fill={1} />
            <rect x={1600} y={500} width={80} height={150} rx={10} fill="#2A5A8A" />
            <text x={1520} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={T.butter}>
              セット
            </text>
          </g>
        </Stage>
      </AbsoluteFill>
    </>
  );
}, { bg: "velvet", hideSubs: [0, 2, 3, 4] });

/* M32 BLUEPRINT: 入口 → 確認 → スクリーン。その通り道に売店 */
const M32 = mk(({ f, s }) => {
  const steps = [
    { t: "入口", x: 300, y: 820, at: s(1) },
    { t: "チケット確認", x: 300, y: 480, at: s(2) },
    { t: "スクリーン", x: 1560, y: 300, at: s(3) },
  ];
  return (
    <Stage>
      <Draw d="M 300 820 L 300 480 L 960 480 L 960 300 L 1560 300" at={s(1)} dur={s(3) - s(1) + 20} w={8} color="#FFFFFF" len={2400} />
      {steps.map((st, i) => (
        <g key={i} opacity={fade(f, st.at)}>
          <circle cx={st.x} cy={st.y} r={18} fill="#FFFFFF" />
          <text x={st.x + (i === 2 ? 0 : 40)} y={st.y + (i === 2 ? -40 : 14)} textAnchor={i === 2 ? "middle" : "start"} fontFamily={FONT} fontWeight={800} fontSize={42} fill={T.bp}>
            {st.t}
          </text>
        </g>
      ))}
      <g opacity={fade(f, s(4))}>
        <rect x={700} y={540} width={520} height={170} rx={14} fill="rgba(226,69,47,0.25)" stroke={K.red} strokeWidth={7} />
        <text x={960} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#FFFFFF">
          売店
        </text>
      </g>
      <text x={960} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={T.bp} opacity={fade(f, s(5))}>
        通り道にある ＝ 気づきやすく、足を止めやすい（効果として考えられる）
      </text>
    </Stage>
  );
}, { bg: "blueprint", hideSubs: [1, 2, 3, 4] });

/* M33 OBJECT: なぜポップコーン？ 作りやすい・食べやすい・香り */
const M33 = mk(({ f, s }) => {
  const R3 = [
    { t: "まとめて作りやすい", at: s(1) },
    { t: "暗い中でも食べやすい", at: s(2) },
    { t: "ロビーで気づかせる", at: s(3) },
  ];
  const aroma = ease(f, s(3), s(4) + 10);
  return (
    <Stage>
      <Cup x={560} y={600} s={1} fill={1} />
      <Aroma x={560} y={380} o={0.3 + 0.7 * aroma} />
      {R3.map((r, i) => (
        <g key={i} opacity={fade(f, r.at)}>
          <text x={1000} y={400 + i * 130} fontFamily={FONT} fontWeight={900} fontSize={56} fill={i === 2 ? T.butter : "#F4EEE3"}>
            {i + 1}. {r.t}
          </text>
        </g>
      ))}
      <text x={1000} y={860} fontFamily={SERIF} fontWeight={900} fontSize={110} fill={T.butter} opacity={fade(f, s(4))}>
        香り
      </text>
    </Stage>
  );
}, { bg: "black", hideSubs: [1, 2, 4] });

/* M34 EVIDENCE #03: TOHOシネマズの説明（要約） */
const M34 = mk(({ f, s }) => (
  <EvidenceDoc
    no="#03"
    org="TOHOシネマズ"
    title="ＴＯＨＯシネマズ ポップコーン（公式発表・要約）"
    at={0}
    source="TOHOシネマズ「ジャパン・フード・セレクション〈グランプリ〉受賞」2026年"
    note="（要約）"
    zoomAt={s(7)}
    zoomTo={1.04}
    rows={[
      { t: "各劇場の専用マシンで、豆の状態からポップ", at: s(1), hl: s(1) + 30 },
      { t: "豆・オイル・塩・食感・香りにこだわり", at: s(2), hl: s(6) },
      { t: "2026年 ジャパン・フード・セレクション〈グランプリ〉", at: s(7), hl: s(8) },
    ]}
  />
), { hideSubs: [2, 3, 4, 5, 6] });

/* M35 EVIDENCE #04: アメリカの大手チェーン（CNN / AMC 10-K） */
const M35 = mk(({ f, s }) => (
  <>
    <EvidenceDoc
      no="#04"
      org="海外の例（アメリカ）"
      title="大手映画館チェーンの売店"
      at={s(0)}
      source="CNN（2024年5月）／AMC Entertainment 年次報告書（2025年度）"
      rows={[
        { t: "AMC・シネマーク：売店＝国内売上の約3分の1", at: s(2), hl: s(2) + 20 },
        { t: "売店の利益率は8割超と報道", at: s(2) + 40, hl: s(2) + 60 },
        { t: "AMC：観客1人あたり売店売上 ＋10%（2025年）", at: s(5), hl: s(6) },
        { t: "理由：値上げ・売店で買う人の割合の増加", at: s(7), hl: s(7) + 20 },
      ]}
    />
    <Tag text="※ 日本とは条件も数字も違う" x={1460} y={50} at={s(3)} />
  </>
), { bg: "white", hideSubs: [2, 6, 7] });

/* M36 DATA: 仮に 1000円、1500円なら？ */
const M36 = mk(({ f, s }) => {
  const price = f < s(2) ? "1000円" : "1500円";
  const show = fade(f, s(1) - 4);
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80, fontFamily: FONT }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: K.inkSoft, opacity: fade(f, s(0)) }}>もし、ポップコーンが――</div>
        <div style={{ fontSize: 260, fontWeight: 900, color: K.red, opacity: show }}>{price}</div>
        <div style={{ fontSize: 44, fontWeight: 700, color: K.inkSoft, opacity: fade(f, s(3)) }}>一つ売れたときの売上は大きくなる。でも――</div>
      </AbsoluteFill>
      <Tag text="仮の値段" x={60} y={50} at={s(1)} />
    </>
  );
}, { bg: "white", hideSubs: [1, 2] });

/* M37 FLAT: 高すぎれば「もう買わない」「高い場所」→ 全体で考える */
const M37 = mk(({ f, s }) => {
  const tilt = ease(f, s(1), s(1) + 30, 0, -12);
  const whole = fade(f, s(3));
  return (
    <Stage>
      <g opacity={1 - whole * 0.8}>
        <g transform={`rotate(${tilt} 960 520)`}>
          <rect x={460} y={510} width={1000} height={16} rx={8} fill={K.ink} />
          <g transform="translate(560 440)">
            <Cup x={0} y={0} s={0.28} fill={1} />
            <text y={-110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.red}>
              値段↑
            </text>
          </g>
          <g transform="translate(1360 430)">
            {[-60, 0, 60].map((dx, i) => (
              <circle key={i} cx={dx} cy={0} r={26} fill={K.inkSoft} opacity={1 - ease(f, s(1) + i * 8, s(1) + i * 8 + 20) * 0.8} />
            ))}
            <text y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
              来場者
            </text>
          </g>
        </g>
        <path d="M 960 520 L 900 660 L 1020 660 Z" fill={K.inkSoft} />
        <Pill x={560} y={820} text="「もう買わない」" at={s(0)} size={44} color={K.ink} />
        <Pill x={1360} y={820} text="「高い場所」" at={s(1)} size={44} color={K.ink} />
      </g>
      <g opacity={whole}>
        {["来てもらう", "時間を過ごす", "いくら使う？"].map((t, i) => (
          <g key={i}>
            <Pill x={440 + i * 520} y={500} text={t} at={s(3) + i * 12} size={56} color={i === 2 ? K.red : K.ink} />
            {i < 2 && <FlowLine d={`M ${640 + i * 520} 500 L ${740 + i * 520} 500`} at={s(3) + i * 12 + 6} color={K.inkSoft} w={8} />}
          </g>
        ))}
        <text x={960} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink} opacity={fade(f, s(4))}>
          値段は、その全体の中で決まる
        </text>
      </g>
    </Stage>
  );
}, { hideSubs: [4] });

/* M38 FLAT/TIMELINE: 上映前の短い時間に客が集中 → すくって出せる */
const M38 = mk(({ f, s }) => (
  <Stage>
    <line x1={240} x2={1680} y1={620} y2={620} stroke={K.ink} strokeWidth={5} />
    {[0, 1, 2].map((i) => {
      const x = 360 + i * 480;
      return (
        <g key={i}>
          <rect x={x + 220} y={420} width={200} height={200} rx={8} fill={K.ink} opacity={0.15} />
          <text x={x + 320} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={K.inkSoft}>
            上映
          </text>
          <rect x={x + 120} y={620 - 180 * ease(f, s(0) + i * 8, s(0) + i * 8 + 20)} width={90} height={180 * ease(f, s(0) + i * 8, s(0) + i * 8 + 20)} rx={6} fill={K.red} />
        </g>
      );
    })}
    <text x={960} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink} opacity={fade(f, s(0))}>
      売店が混むのは、上映前の短い時間
    </text>
    <g opacity={fade(f, s(2))}>
      <Pill x={560} y={840} text="作り置きできる" at={s(2)} size={48} color={K.soy} />
      <Pill x={1300} y={840} text="すくって出すだけ" at={s(2) + 20} size={48} color={K.soy} />
    </g>
  </Stage>
));

/* M39 DARK → 二本の柱（もし売店がなかったら） */
const M39 = mk(({ f, s }) => {
  const one = fade(f, s(2));
  const two = fade(f, s(4));
  const sag = one * (1 - two);
  return (
    <Stage>
      <text x={960} y={220} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={80} fill="#F4EEE3" opacity={fade(f, s(1)) * (1 - one)}>
        もし、売店がなかったら。
      </text>
      <g opacity={one}>
        <path d={`M 560 ${300 + 30 * sag} L 1360 ${300 - 10 * sag} L 1360 340 L 560 ${340 + 30 * sag} Z`} fill="#C9C2B6" />
        <text x={960} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#F4EEE3">
          建物・スクリーン・スタッフ
        </text>
        <rect x={600} y={360} width={140} height={440} fill={T.ticket} />
        <text x={670} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={T.ticket}>
          チケット
        </text>
        <text x={670} y={910} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#C9C2B6" opacity={fade(f, s(3))}>
          （分け合ったあと）
        </text>
      </g>
      <g opacity={two}>
        <rect x={1180} y={360} width={140} height={440} fill={T.butter} />
        <text x={1250} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={T.butter}>
          売店
        </text>
        <text x={960} y={990} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9C2B6">
          もう一本の柱、と見ることもできる
        </text>
      </g>
    </Stage>
  );
}, { bg: "night", hideSubs: [1] });

export const SEATS3 = { M26, M27, M28, M29, M30, M31, M32, M33, M34, M35, M36, M37, M38, M39 };
export { PopPile, R, Easing };
