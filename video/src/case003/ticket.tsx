/** M12–M25: チケット代の行方 → 平均1454円 → 売店は別の売上（CLUE 01）→ 映画館のコスト */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceDoc, EvidenceMark, FlowLine, Lines, Pill, R, Stage, Tag, count, mk, yen } from "../case002/ui";
import { ClueStub, Cup, Easing, FONT, K, SERIF, Sfx, T, TheaterSection, TicketDoc, ease, fade, pop } from "./kit";

const EIREN = "日本映画製作者連盟「2025年 全国映画概況」";

/* M12 FLAT: 映画館で払うお金を二つに分ける */
const M12 = mk(({ f, s }) => (
  <Stage>
    <line x1={960} x2={960} y1={200} y2={900} stroke={K.line} strokeWidth={6} opacity={fade(f, s(0))} />
    <g opacity={fade(f, s(1))} transform="translate(520 520)">
      <rect x={-260} y={-110} width={520} height={220} rx={16} fill={T.ticket} stroke={T.velvet} strokeWidth={6} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={80} fill={T.velvet}>
        チケット
      </text>
    </g>
    <g opacity={fade(f, s(2))}>
      <Cup x={1400} y={470} s={0.6} fill={1} />
      <text x={1400} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
        売店
      </text>
    </g>
  </Stage>
), { hideSubs: [1, 2] });

/* M13 FLAT: 製作 → 配給 → 映画館（映画館は作品を借りて上映） */
const M13 = mk(({ f, s }) => {
  const NODES = [
    { t: "製作会社", x: 360, at: s(3) },
    { t: "配給会社", x: 960, at: s(3) + 30 },
    { t: "映画館", x: 1560, at: s(1) },
  ];
  return (
    <Stage>
      {NODES.map((n, i) => (
        <g key={i} opacity={fade(f, n.at)}>
          <rect x={n.x - 220} y={420} width={440} height={180} rx={20} fill={i === 2 ? K.ink : K.white} stroke={K.ink} strokeWidth={6} />
          <text x={n.x} y={512} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={64} fill={i === 2 ? K.paper : K.ink}>
            {n.t}
          </text>
        </g>
      ))}
      <g opacity={fade(f, s(3) + 50)}>
        <FlowLine d="M 590 510 L 730 510" at={s(3) + 50} color={K.inkSoft} w={10} />
        <FlowLine d="M 1190 510 L 1330 510" at={s(3) + 60} color={K.inkSoft} w={10} />
        <text x={960} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={K.inkSoft} opacity={fade(f, s(4))}>
          作品を借りて、上映する
        </text>
      </g>
      <g opacity={fade(f, s(1)) * (1 - fade(f, s(3)))} transform="translate(1560 300)">
        <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.red}>
          売上 ↓
        </text>
      </g>
    </Stage>
  );
});

/* M14 DOCUMENT: 興行収入を分け合う（目安：およそ半分。EVIDENCE ではない） */
const M14 = mk(({ f, s }) => {
  const split = ease(f, s(0) + 20, s(0) + 50, 0, 1, Easing.inOut(Easing.cubic));
  const late = ease(f, s(3), s(3) + 30);
  const early = ease(f, s(4), s(4) + 30);
  const theaterW = 0.5 + 0.12 * late - 0.2 * early;
  const W = 1300;
  return (
    <>
      <Stage>
        <text x={960} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
          興行収入（チケットの売上）
        </text>
        <rect x={310} y={330} width={W} height={180} rx={16} fill={K.white} stroke={K.ink} strokeWidth={6} />
        <rect x={316} y={336} width={(W - 12) * theaterW * split + (W - 12) * (1 - split)} height={168} rx={12} fill={K.ink} />
        <rect x={316 + (W - 12) * theaterW} y={336} width={(W - 12) * (1 - theaterW) * split} height={168} rx={12} fill={K.cost[0]} />
        <g opacity={split}>
          <text x={316 + ((W - 12) * theaterW) / 2} y={430} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.paper}>
            映画館
          </text>
          <text x={316 + (W - 12) * theaterW + ((W - 12) * (1 - theaterW)) / 2} y={430} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
            作品を届ける側
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={316 + (W - 12) * 0.5} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.red}>
            およそ半分（目安）
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={960} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={K.inkSoft}>
            ※ 作品・契約・上映期間によって異なる
          </text>
        </g>
        <g opacity={late * (1 - early)}>
          <text x={960} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.ink}>
            公開から時間がたつほど → 映画館の取り分が増える契約も
          </text>
        </g>
        <g opacity={early}>
          <text x={960} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.ink}>
            話題作の公開直後 → 作品を届ける側へ多く流れる
          </text>
        </g>
      </Stage>
      <Tag text="業界の目安（みずほ銀行 産業調査部ほか）" x={60} y={50} at={s(2)} />
    </>
  );
}, { bg: "white" });

/* M15 MONEY FLOW ①: 観客 → チケット → 映画館 → 配給 → 製作 */
const M15 = mk(({ f, s }) => {
  const N = [
    { t: "観客", at: s(0) },
    { t: "チケット", at: s(1) },
    { t: "映画館", at: s(2) },
    { t: "配給会社", at: s(3) },
    { t: "製作側", at: s(4) },
  ];
  const coinT = ease(f, s(5), s(5) + 60);
  return (
    <Stage>
      {N.map((n, i) => {
        const x = 250 + i * 355;
        return (
          <g key={i}>
            {i > 0 && <FlowLine d={`M ${x - 355 + 130} 540 L ${x - 130} 540`} at={n.at} color={K.brothDeep} w={10} />}
            <Pill x={x} y={540} text={n.t} at={n.at} size={48} color={i === 2 ? K.red : K.ink} />
          </g>
        );
      })}
      <g opacity={fade(f, s(5))} transform={`translate(${250 + coinT * 1420} 420)`}>
        <circle r={40} fill={K.gold} stroke={K.goldDeep} strokeWidth={6} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.goldDeep}>
          円
        </text>
      </g>
      <text x={1840} y={1000} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft} opacity={fade(f, s(0))}>
        MONEY FLOW
      </text>
    </Stage>
  );
}, { hideSubs: [0, 1, 2, 3, 4] });

/* M16 DARK: 2200円の半分、1100円？ */
const M16 = mk(
  ({ f, s }) => (
    <>
    <Lines dark lines={[{ t: "もう一つの数字。", at: s(1), size: 90 }]} />
    <Lines
      dark
      lines={[
        { t: "2200円 ÷ 2 ＝", at: s(0) + 10, size: 110, serif: false, out: s(1) - 4 },
        { t: <R>1100円？</R>, at: s(0) + 40, size: 170, serif: false, out: s(1) - 4 },
      ]}
    />
    </>
  ),
  { bg: "night", hideSubs: [0, 1] },
);

/* M17 DATA: 1454円（BGM は無音に近く） */
const M17 = mk(
  ({ f, s }) => (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 320, color: K.ink, opacity: ease(f, s(0) - 4, s(0) + 6) }}>
        1454<span style={{ fontSize: 150 }}>円</span>
      </div>
    </AbsoluteFill>
  ),
  { bg: "white", noSub: true },
);

/* M18 EVIDENCE #01: 映連 平均入場料金 → いろいろな料金 */
const M18 = mk(({ f, s }) => {
  const chips = fade(f, s(2) - 6);
  const KINDS = ["学生", "子ども", "シニア", "割引の日", "レイトショー"];
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - chips }}>
        <EvidenceDoc
          no="#01"
          org="日本映画製作者連盟"
          title="2025年（令和7年）全国映画概況"
          at={0}
          source={EIREN}
          note="（要約）"
          rows={[
            { t: "平均入場料金　1,454円", at: s(0) + 10, hl: s(0) + 40, big: true },
            { t: "一般料金は2000円前後", at: s(1), hl: s(1) + 20 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: chips }}>
        <Stage>
          <text x={960} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
            チケットの値段は、一つではない
          </text>
          {KINDS.map((k, i) => (
            <Pill key={i} x={330 + i * 315} y={540} text={k} at={s(2 + Math.min(i, 3))} size={48} color={T.velvet} />
          ))}
          <text x={960} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.red} opacity={fade(f, s(6))}>
            平均 1,454円
          </text>
        </Stage>
        <EvidenceMark no="#01" source={EIREN} />
      </AbsoluteFill>
    </>
  );
}, { hideSubs: [2, 3, 4, 5] });

/* M19 FLAT: 平均1454円の半分 ≒ 700円（目安）→ その中から家賃・給料・電気代 */
const M19 = mk(({ f, s }) => {
  const half = ease(f, s(0) + 10, s(0) + 40, 0, 1, Easing.inOut(Easing.cubic));
  const eat = ease(f, s(3) + 10, s(3) + 90);
  const W = 1300;
  return (
    <>
      <Stage>
        <text x={310} y={300} fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink}>
          平均 1,454円
        </text>
        <rect x={310} y={330} width={W} height={150} rx={14} fill={K.white} stroke={K.ink} strokeWidth={6} />
        <rect x={316} y={336} width={(W - 12) * (1 - 0.5 * half)} height={138} rx={10} fill={K.ink} />
        <rect x={316 + (W - 12) * 0.5} y={336} width={(W - 12) * 0.5 * half} height={138} rx={10} fill={K.cost[0]} opacity={half} />
        <g opacity={fade(f, s(1))}>
          <text x={316 + (W - 12) * 0.25} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={K.red}>
            約700円
          </text>
          <text x={316 + (W - 12) * 0.25} y={810} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={K.inkSoft}>
            映画館に残る目安（計算例）
          </text>
          <path d={`M ${316 + (W - 12) * 0.25} 500 l 0 90`} stroke={K.red} strokeWidth={8} />
        </g>
        {["家賃", "給料", "電気代"].map((t, i) => (
          <Pill key={i} x={1180 + i * 190} y={700} text={t} at={s(3) + 10 + i * 20} size={40} color={K.soy} />
        ))}
        <rect x={316} y={336} width={(W - 12) * 0.5 * eat * 0.8} height={138} rx={10} fill={K.cost[2]} opacity={0.9} />
      </Stage>
      <Tag text="※ 目安の計算" x={1580} y={50} at={s(1)} />
    </>
  );
}, { hideSubs: [1] });

/* M20 KEY TYPOGRAPHY */
const M20 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "チケット代は、", at: s(0), size: 100 },
        { t: <>映画館だけのお金では<R>ない</R>。</>, at: s(0) + 18, size: 110 },
      ]}
    />
  ),
  { bg: "black", noSub: true },
);

/* M21 FLAT: 二つのお金の流れ（チケットは分け合う / 売店は映画館のビジネス） */
const M21 = mk(({ f, s }) => {
  const right = fade(f, s(2) - 4);
  const costs = fade(f, s(5));
  const compare = fade(f, s(6));
  return (
    <Stage>
      <g opacity={0.35 + 0.65 * compare}>
        <text x={480} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={T.velvet}>
          チケット
        </text>
        <rect x={230} y={260} width={500} height={120} rx={14} fill={T.ticket} stroke={T.velvet} strokeWidth={5} />
        {[0, 1].map((k) => (
          <FlowLine key={k} d={`M 480 400 L ${k ? 660 : 300} 560`} at={s(6)} color={K.inkSoft} w={8} />
        ))}
        <Pill x={300} y={620} text="映画館" at={s(6)} size={40} color={K.ink} />
        <Pill x={660} y={620} text="作品を届ける側" at={s(6) + 6} size={34} color={K.inkSoft} />
      </g>
      <line x1={960} x2={960} y1={160} y2={940} stroke={K.line} strokeWidth={5} />
      <g opacity={right}>
        <text x={1440} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
          売店
        </text>
        <Cup x={1440} y={330} s={0.4} fill={1} />
        <FlowLine d="M 1440 460 L 1440 560" at={s(2)} color={K.brothDeep} w={10} />
        <Pill x={1440} y={620} text="映画館のビジネス" at={s(3)} size={44} color={K.red} />
        <g opacity={costs}>
          {["材料", "容器", "スタッフ"].map((t, i) => (
            <Pill key={i} x={1230 + i * 210} y={790} text={t} at={s(5) + i * 5} size={36} color={K.soy} />
          ))}
          <text x={1440} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={K.inkSoft} opacity={fade(f, s(4))}>
            売上 ≠ 利益
          </text>
        </g>
      </g>
    </Stage>
  );
});

/* M22 CLUE 01 */
const M22 = mk(({ s }) => <ClueStub no="1" at={s(1) - 6} />, { bg: "velvet", noSub: true });

/* M23 DARK: なぜもっと安く売らない？ */
const M23 = mk(
  ({ s }) => <Lines dark lines={[{ t: <>なぜ、もっと<R>安く</R>売らない？</>, at: s(0), size: 110 }]} />,
  { bg: "night", hideSubs: [0] },
);

/* M24 BLUEPRINT: 映画館の断面（コストの正体） */
const M24 = mk(({ f, s }) => (
  <Stage>
    <TheaterSection
      at={0}
      labels={[
        { t: "スクリーン", at: s(1), x: 330, y: 270 },
        { t: "映写機", at: s(2), x: 1630, y: 440 },
        { t: "音響設備", at: s(3), x: 330, y: 760 },
        { t: "座席", at: s(4), x: 1100, y: 930 },
        { t: "空調", at: s(5), x: 960, y: 190 },
        { t: "清掃", at: s(6), x: 1500, y: 930 },
        { t: "スタッフ", at: s(7), x: 700, y: 930 },
      ]}
    />
    <g opacity={fade(f, s(9))}>
      <rect x={660} y={440} width={600} height={120} rx={60} fill="#10294A" stroke={K.red} strokeWidth={6} />
      <text x={960} y={502} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#FFFFFF">
        客が少なくても、止まらない
      </text>
    </g>
  </Stage>
), { bg: "blueprint", hideSubs: [1, 2, 3, 4, 5, 6, 7] });

/* M25 DATA → EVIDENCE → TIMELINE: 過去最高 2744億円、それでも値上げ */
const M25 = mk(({ f, s }) => {
  const rec = fade(f, s(1) - 4) * (1 - fade(f, s(3) - 6));
  const tl = fade(f, s(3) - 6);
  const v = count(f, s(1), 34, 0, 2744);
  return (
    <>
      <AbsoluteFill style={{ opacity: rec, justifyContent: "center", alignItems: "center", paddingBottom: 80, fontFamily: FONT, color: K.ink }}>
        <div style={{ fontSize: 50, fontWeight: 800 }}>2025年　日本の映画 興行収入</div>
        <div style={{ fontSize: 240, fontWeight: 900 }}>
          {yen(v)}
          <span style={{ fontSize: 110 }}>億円</span>
        </div>
        <div style={{ fontSize: 70, fontWeight: 900, color: K.red, border: `8px solid ${K.red}`, borderRadius: 14, padding: "2px 30px", transform: "rotate(-4deg)", opacity: fade(f, s(2)) }}>過去最高</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: rec }}>
        <EvidenceMark no="#01" source={EIREN} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: tl }}>
        <Stage>
          <line x1={260} x2={1660} y1={420} y2={420} stroke={K.ink} strokeWidth={6} />
          {[
            { x: 560, y: "2023年6月", p: "2000円", at: s(3) },
            { x: 1360, y: "2026年7月", p: "2000〜2200円", at: s(6) },
          ].map((m, i) => (
            <g key={i} opacity={fade(f, m.at)}>
              <circle cx={m.x} cy={420} r={22} fill={K.red} />
              <text x={m.x} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.inkSoft}>
                {m.y}
              </text>
              <text x={m.x} y={530} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={i ? 70 : 90} fill={K.ink}>
                {m.p}
              </text>
            </g>
          ))}
          {["エネルギー価格の高騰", "円安で仕入れコスト上昇", "人件費・設備投資の負担"].map((t, i) => (
            <Pill key={i} x={560} y={620 + i * 88} text={t} at={i === 0 ? s(4) : s(5) + (i - 1) * 20} size={38} color={K.soy} />
          ))}
          <text x={1360} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={K.inkSoft} opacity={fade(f, s(6))}>
            劇場ごとの料金に（都心の一部は2200円）
          </text>
        </Stage>
        <EvidenceMark no="#02" source="TOHOシネマズ「映画鑑賞料金 改定のお知らせ」（2023年・2026年）" />
      </AbsoluteFill>
    </>
  );
}, { bg: "white", hideSubs: [1, 4, 5] });

export const TICKET3 = { M12, M13, M14, M15, M16, M17, M18, M19, M20, M21, M22, M23, M24, M25 };
export { TicketDoc, pop, SERIF, Sfx };
