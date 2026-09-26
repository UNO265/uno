/** K27–K32: QUESTION 4 → 2017年（最初の表面化）→ 960時間 → 輸送力不足 → 運賃が上がる → 単価の逆転 → 物流コスト・荷主の義務 → 表示の見直しへ（時間 → お金） */
import React from "react";
import { EvidenceMark, Lines, R, Stage, Tag, count, mk } from "../case002/ui";
import { Clock, Easing, FONT, K, MoneyFlow5, SERIF, Sfx, T, TimelineH, Yen, ease, fade, pop } from "./kit";

/* K27 DARK: 秒針だけ。「続けられる？」 */
const K27 = mk(({ f, s }) => (
  <>
    <Stage>
      <Clock x={960} y={640} r={200} speed={1} face="#10151F" color="#EAF6FF" />
    </Stage>
    <Lines dark y={-390} lines={[{ t: <>この見えない支払いは、<R>続けられる</R>？</>, at: s(0) + 4, size: 78 }]} />
    <Sfx at={s(0)} name="question" volume={0.4} />
  </>
), { bg: "black", noSub: true });

/* K27B TIMELINE（縦）: 2017 年、最初の表面化 */
const K27B = mk(({ f, s }) => {
  const rows = [
    { t: "宅急便の基本運賃を27年ぶりに値上げ（＋140〜180円）", at: s(1) },
    { t: "理由（ヤマトの説明）：ネット通販で荷物が急増、体制が追いつかない", at: s(3) },
    { t: "大口の荷物の引き受けを抑え、Amazonの当日配送から撤退", at: s(4) },
  ];
  const a = count(f, s(5) + 10, 30, 280, 400);
  return (
    <>
      <Stage>
        <text x={240} y={220} fontFamily={FONT} fontWeight={900} fontSize={120} fill={K.red} opacity={fade(f, s(0))}>
          2017
        </text>
        <line x1={300} x2={300} y1={270} y2={900} stroke={K.ink} strokeWidth={6} opacity={fade(f, s(0))} />
        {rows.map((r, i) => (
          <g key={i} opacity={fade(f, r.at)} transform={`translate(${(1 - ease(f, r.at, r.at + 14)) * 40} 0)`}>
            <circle cx={300} cy={340 + i * 130} r={18} fill={K.red} />
            <text x={350} y={340 + i * 130} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
              {r.t}
            </text>
          </g>
        ))}
        <g opacity={fade(f, s(5))} transform="translate(1180 730)">
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            Amazon向け運賃（1個）
          </text>
          <text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
            約280円 → 約{Math.round(a)}円
          </text>
          <rect x={370} y={40} width={110} height={50} rx={10} fill="none" stroke={K.inkSoft} strokeWidth={3} />
          <text x={425} y={66} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            報道
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#10" source="ヤマト運輸 発表（2017年） / 日本経済新聞ほか" at={s(1)} />
      <Sfx at={s(1)} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* K28 KEY: 年960時間 ＝ 月80時間。2017：会社が抑えた → 2024：法律が上限 */
const K28 = mk(({ f, s }) => {
  const n = count(f, s(1) + 6, 30, 0, 960);
  return (
    <>
      <Stage>
        <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill="#C9D6E6" opacity={fade(f, s(0))}>
          2024年4月 時間外労働の上限
        </text>
        <text x={960} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={230} fill="#FFFFFF" opacity={fade(f, s(1))}>
          年{Math.round(n)}<tspan fontSize={110}>時間</tspan>
        </text>
        <text x={960} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={T.time} opacity={fade(f, s(2))}>
          ＝ 月80時間
        </text>
        <g opacity={fade(f, s(3))}>
          <text x={560} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#EAF6FF">
            2017：会社が荷物を抑えた
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <text x={960} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#EAF6FF">
            →
          </text>
          <text x={1380} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red}>
            2024：法律が時間に上限
          </text>
        </g>
      </Stage>
      <Sfx at={s(1)} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "night", hideSubs: [2] });

/* K29 GRAPH: 輸送能力の不足（対策なしの試算）。棒の上が削れて空欄になる */
const K29 = mk(({ f, s }) => {
  const bar = (x: number, label: string, pct: number, at: number, sub?: string) => {
    const cut = ease(f, at, at + 30) * pct;
    const H = 440;
    return (
      <g opacity={fade(f, at - 10)}>
        <rect x={x - 130} y={780 - H} width={260} height={H} rx={10} fill="none" stroke={K.ink} strokeWidth={4} strokeDasharray="14 10" />
        <rect x={x - 130} y={780 - H * (1 - cut)} width={260} height={H * (1 - cut)} rx={10} fill={T.road} />
        <text x={x} y={780 - H - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={K.red}>
          約{Math.round(cut * 100)}%不足
        </text>
        <text x={x} y={840} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
          {label}
        </text>
        {sub && (
          <text x={x} y={780 - H + 70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft} opacity={fade(f, s(1))}>
            {sub}
          </text>
        )}
      </g>
    );
  };
  return (
    <>
      <Stage>
        <line x1={420} x2={1500} y1={780} y2={780} stroke={K.ink} strokeWidth={5} />
        {bar(700, "2024年度", 0.14, s(0) + 40)}
        {bar(1220, "2030年度", 0.34, s(0) + 90, "約9億トン分")}
      </Stage>
      <EvidenceMark no="#09" source="政府「物流革新に向けた政策パッケージ」（2023年）" at={s(0)} />
      <Tag text="※何も対策をしない場合の試算" x={60} y={110} at={s(0)} />
    </>
  );
}, { bg: "white" });

/* K30 DATA（文書）: 運賃表に「↑」の判 */
const K30 = mk(({ f, s }) => {
  const sheet = (x: number, title: string, lines: string[], at: number) => {
    const p = ease(f, at, at + 14);
    const st = pop(f, at + 24);
    return (
      <g transform={`translate(${x} 560) rotate(${x < 960 ? -2 : 2})`} opacity={p}>
        <rect x={-340} y={-300} width={680} height={560} rx={10} fill="#FFFFFF" stroke="#D8D0C2" strokeWidth={3} />
        <text x={-290} y={-220} fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
          {title}
        </text>
        <line x1={-290} x2={290} y1={-180} y2={-180} stroke={K.ink} strokeWidth={3} />
        {lines.map((l, i) => (
          <text key={i} x={-290} y={-100 + i * 80} fontFamily={FONT} fontWeight={800} fontSize={42} fill={K.ink}>
            {l}
          </text>
        ))}
        <g transform={`translate(190 170) scale(${st}) rotate(-12)`} opacity={Math.min(1, st * 1.4)}>
          <circle r={80} fill="none" stroke={K.red} strokeWidth={8} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.red}>
            ↑
          </text>
        </g>
      </g>
    );
  };
  return (
    <>
      <Stage>
        <text x={960} y={140} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(0))}>
          見えなかったコストが、お金の形で表に出る
        </text>
        {sheet(560, "佐川急便", ["2023年 運賃改定", "2024年 運賃改定"], s(1))}
        {sheet(1360, "ヤマト運輸", ["2025年10月", "大きなサイズ", "平均 約3.5%"], s(2))}
      </Stage>
      <EvidenceMark no="#10" source="佐川急便・ヤマト運輸 発表" at={s(1)} />
      <Sfx at={s(1) + 24} name="stamp" volume={0.5} />
      <Sfx at={s(2) + 24} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* K30B GRAPH: 平均単価 −1.4% → 大口法人向け ＋4% 計画（折れ線が下がってから上へ） */
const K30B = mk(({ f, s }) => {
  const p1 = ease(f, s(1), s(1) + 30);
  const p2 = ease(f, s(3), s(3) + 30);
  const pts = [
    [420, 420],
    [960, 420 + 140 * p1],
    [1500, 420 + 140 - 260 * p2],
  ];
  return (
    <>
      <Stage>
        <text x={960} y={160} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(0))}>
          少し前まで、流れは逆だった
        </text>
        <polyline points={pts.slice(0, p2 > 0 ? 3 : 2).map((p) => p.join(" ")).join(" ")} fill="none" stroke={K.ink} strokeWidth={10} strokeLinejoin="round" opacity={fade(f, s(1))} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={18} fill={i === 2 ? K.red : K.ink} opacity={i === 2 ? p2 : fade(f, s(1))} />
        ))}
        <g opacity={p1}>
          <text x={960} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
            711円（前年比 −1.4%）
          </text>
          <text x={960} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            2025年3月期・大口の法人の荷物が増える中で
          </text>
        </g>
        <g opacity={p2}>
          <text x={1500} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.red}>
            大口法人向け ＋4%（計画）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#02" source="ヤマトHD 決算・計画（2025年5月）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* K31 DATA（暗）: 物流コスト比率 5.44% ＋ 荷主にも責任（2026年4月） */
const K31 = mk(({ f, s }) => {
  const v = count(f, s(0) + 20, 40, 0, 5.44);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <text x={560} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9D6E6">
            売上高に占める物流コスト
          </text>
          <text x={560} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill="#FFFFFF">
            {v.toFixed(2)}<tspan fontSize={100}>%</tspan>
          </text>
          <text x={560} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={T.time}>
            2024年度調査・過去20年で2番目
          </text>
        </g>
        <g opacity={fade(f, s(1))} transform="translate(1400 470)">
          <rect x={-340} y={-200} width={680} height={400} rx={14} fill="#FFFFFF" />
          <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            改正物流効率化法（2026年4月〜）
          </text>
          <text y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
            大量の荷物を扱う企業に
          </text>
          <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.red}>
            物流の責任者
          </text>
          <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.ink}>
            ＝ 荷物を出す側も向き合う
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#11・#12" source="日本ロジスティクスシステム協会 / 国土交通省" at={s(0)} dark />
    </>
  );
}, { bg: "night" });

/* K32 EVIDENCE 回収: 政策パッケージ（2023）→「送料無料」表示の見直し。時間レーンが ¥ に変わる */
const K32 = mk(({ f, s }) => {
  const ty = ease(f, s(2), s(2) + 40, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <Stage>
        <g opacity={1 - fade(f, s(2) - 20, 16)}>
          <g transform="translate(960 480)" opacity={fade(f, s(0))}>
            <rect x={-520} y={-260} width={1040} height={520} rx={10} fill="#FFFFFF" stroke="#D8D0C2" strokeWidth={3} />
            <text x={-460} y={-170} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
              政府（2023年6月）
            </text>
            <text x={-460} y={-100} fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink}>
              物流革新に向けた政策パッケージ
            </text>
            <line x1={-460} x2={460} y1={-60} y2={-60} stroke={K.ink} strokeWidth={3} />
            <g opacity={fade(f, s(1))}>
              <rect x={-470} y={10} width={940} height={90} fill="rgba(243,163,58,0.35)" />
              <text x={-450} y={70} fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
                「送料無料」表示の見直し
              </text>
            </g>
            <text x={-460} y={190} fontFamily={FONT} fontWeight={700} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(1))}>
              → 消費者庁の呼びかけ（2023年12月）
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(2) - 10, 16)}>
          <MoneyFlow5 st={{ entries: 1, store: 1, carrier: 1, hidden: 0, driver: 1, timeToYen: ty }} />
        </g>
      </Stage>
      <EvidenceMark no="#03・#09" source="政府 政策パッケージ / 消費者庁" at={s(0)} />
      <Sfx at={s(2) + 30} name="coin" volume={0.5} />
    </>
  );
}, { bg: "paper" });

export const CHANGE5 = { K27, K27B, K28, K29, K30, K30B, K31, K32 };
export { TimelineH, Yen };
