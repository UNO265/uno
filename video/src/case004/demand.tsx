/** N23–N34: なぜ回す人がいる？ → 家にも洗濯機 → 1155億円（矢野）→ 店の数も（厚労省・日経）→ 何を買っている？ → 大容量・乾燥・時間 → CLUE 03 → 経産省 → 時間を減らしたい */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Columns, EvidenceDoc, EvidenceMark, Lines, Pill, R, Stage, count, mk, yen } from "../case002/ui";
import { CareTag, Clock, Dryer, Easing, FONT, HomeWasher, K, SERIF, Sfx, T, Washer, ease, fade, pop } from "./kit";

export const YANO = "矢野経済研究所「クリーニング関連市場に関する調査（2026年）」";
const MHLW = "厚生労働省「コインオペレーションクリーニング営業施設に関する調査」";
const NIKKEI = "日本経済新聞（2024年9月）";
const METI = "経済産業省「コインランドリー業界の現状と展望に関する研究会」報告書";

const Warm: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3A2E22 0%, #15110D 75%)" }} />;

/* N23 DARK: もっと大きな疑問 */
const N23 = mk(
  ({ s }) => (
    <Lines
      dark
      lines={[
        { t: "そもそも、なぜ", at: s(0) + 20, size: 80 },
        { t: <>そんなに<R>回す人</R>がいる？</>, at: s(1), size: 116 },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* N24 OBJECT（家の中）: 家庭用洗濯機。昔より便利 */
const N24 = mk(({ f, s }) => (
  <>
    <Warm />
    <Stage>
      <HomeWasher x={960} y={500} s={1.3} />
      {["自動おまかせ", "乾燥機能", "予約タイマー"].map((t, i) => (
        <Pill key={i} x={[520, 1400, 1400][i]} y={[380, 330, 560][i]} text={t} at={s(1) + i * 8} size={40} color="#FFFFFF" fill="#5A6478" />
      ))}
      <text x={960} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={T.glow} opacity={fade(f, s(2))}>
        自宅で洗えばいい
      </text>
    </Stage>
  </>
), { bg: "black", hideSubs: [2] });

/* N25 DATA + EVIDENCE #01: 1155億4000万円 */
const N25 = mk(({ f, s }) => {
  const v = count(f, s(2) - 6, 40, 0, 1155.4);
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110, fontFamily: FONT }}>
        <div style={{ fontSize: 54, fontWeight: 800, color: K.inkSoft, opacity: fade(f, s(0)) }}>2025年　日本のコインランドリー市場</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: K.inkSoft, opacity: fade(f, s(1)), marginTop: 6 }}>事業者売上高ベース</div>
        <div style={{ fontSize: 230, fontWeight: 900, color: K.ink, lineHeight: 1.1, opacity: fade(f, s(2) - 6, 4) }}>
          {yen(Math.floor(v))}
          <span style={{ fontSize: 100 }}>億</span>
          <span style={{ fontSize: 120 }}>{v >= 1155.4 ? "4000" : ""}</span>
          <span style={{ fontSize: 100 }}>{v >= 1155.4 ? "万円" : "円"}</span>
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: K.red, opacity: fade(f, s(3)) }}>前年比 100.9%　↑ わずかに拡大</div>
      </AbsoluteFill>
      <EvidenceMark no="#01" source={YANO} />
    </>
  );
}, { bg: "white", hideSubs: [2] });

/* N26 GRAPH/TIMELINE + EVIDENCE #02 #03: 1996年 10,228 → 2013年 16,693（実数の比）→ その後「10年で4割増」（報道） */
const N26 = mk(({ f, s }) => {
  const after = fade(f, s(4));
  return (
    <>
      <Stage>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink} opacity={fade(f, s(0))}>
          増えているのは、店の数も
        </text>
        <g transform="translate(-260 0)">
          <Columns
            cols={[
              { label: "1996年", value: 10228, at: s(1) + 10, color: K.inkSoft },
              { label: "2013年", value: 16693, at: s(2), color: K.red },
            ]}
            max={16693}
            base={780}
            height={430}
            gap={380}
            width={220}
            x0={960}
          />
        </g>
        <text x={890} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#FFFFFF" opacity={fade(f, s(3))}>
          約1.6倍
        </text>
        <g opacity={after}>
          <path d="M 1010 420 C 1150 380 1250 300 1380 260" fill="none" stroke={K.red} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={-f * 2} />
          <path d="M 1360 236 L 1400 256 L 1370 290" fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <text x={1560} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            その後も増え続けた
          </text>
          <g opacity={fade(f, s(5))}>
            <rect x={1300} y={420} width={520} height={200} rx={16} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
            <text x={1560} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.red}>
              10年で約4割増
            </text>
            <text x={1560} y={570} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={K.inkSoft}>
              日本経済新聞 2024年（報道）
            </text>
          </g>
        </g>
      </Stage>
      <EvidenceMark no="#02・#03" source={f < s(4) ? MHLW : NIKKEI} />
    </>
  );
}, { bg: "white", hideSubs: [2, 3] });

/* N27 OBJECT（家の中）:「洗濯機がないから」ではない → 何を買っている？（サムネの問い） */
const N27 = mk(({ f, s }) => {
  const strike = ease(f, s(0) + 40, s(0) + 56);
  return (
    <>
      <Warm />
      <Stage>
        <HomeWasher x={500} y={560} s={1.0} o={1 - fade(f, s(1) - 6)} />
        <g opacity={1 - fade(f, s(1))}>
          <text x={1260} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill="#F4EEE3">
            「洗濯機がないから」
          </text>
          <line x1={880} x2={880 + 760 * strike} y1={530} y2={530} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
        </g>
      </Stage>
      <Lines
        dark
        x={0}
        y={-60}
        lines={[
          { t: "家に洗濯機がある人は、", at: s(1), size: 72 },
          { t: <>何を<R>買っている</R>？</>, at: s(1) + 14, size: 120 },
        ]}
      />
    </>
  );
}, { bg: "black", hideSubs: [1] });

/* N28 OBJECT: 毛布・布団・大量の衣類は、家の洗濯機では一度に難しい → 分けると時間がかかる */
const N28 = mk(({ f, s }) => {
  const ITEMS = [
    { t: "毛布", w: 360, h: 120, c: "#8FBBD6", at: s(1) },
    { t: "布団", w: 420, h: 160, c: "#E8A07A", at: s(2) },
    { t: "大量の衣類", w: 380, h: 140, c: "#9BCB8F", at: s(3) },
  ];
  const clock = fade(f, s(6));
  return (
    <Stage>
      <HomeWasher x={1420} y={470} s={0.9} />
      <text x={1420} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9C2B6" opacity={fade(f, s(4))}>
        一度には、難しい
      </text>
      {ITEMS.map((it, i) => {
        const p = pop(f, it.at);
        return (
          <g key={i} transform={`translate(560 ${260 + i * 200}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
            <rect x={-it.w / 2} y={-it.h / 2} width={it.w} height={it.h} rx={30} fill={it.c} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink}>
              {it.t}
            </text>
          </g>
        );
      })}
      <g opacity={clock}>
        <Clock x={1000} y={450} r={90} speed={4} />
        <text x={1000} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={T.glow}>
          分ければ、時間がかかる
        </text>
      </g>
    </Stage>
  );
}, { bg: "black", hideSubs: [1, 2, 3] });

/* N29 FLAT: 干して、待つ（雨・梅雨・花粉）→ 大型機でまとめて乾燥まで */
const N29 = mk(({ f, s }) => {
  const dry = fade(f, s(5));
  return (
    <Stage>
      <g opacity={1 - dry * 0.7}>
        <line x1={300} x2={1000} y1={260} y2={260} stroke={K.ink} strokeWidth={8} />
        {[380, 520, 660, 800, 920].map((x, i) => (
          <rect key={i} x={x - 45} y={270} width={90} height={150 + (i % 2) * 40} rx={10} fill={K.cost[i % 5]} opacity={fade(f, s(1))} />
        ))}
        <Clock x={650} y={620} r={80} speed={2} />
        <text x={650} y={770} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft} opacity={fade(f, s(1))}>
          干して、乾くのを待つ
        </text>
      </g>
      {["雨の日", "梅雨", "花粉"].map((t, i) => (
        <Pill key={i} x={1150 + i * 230} y={200} text={t} at={s(2 + i)} size={46} color="#FFFFFF" fill={["#5A7FA8", "#4F6F8F", "#C99A2E"][i]} />
      ))}
      <g opacity={dry}>
        <Dryer x={1380} y={560} s={0.72} />
        <text x={1380} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.red}>
          まとめて、乾燥まで
        </text>
      </g>
    </Stage>
  );
}, { hideSubs: [2, 3, 4] });

/* N30 KEY: 大容量 / 乾燥 / 時間 */
const N30 = mk(({ f, s }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110, fontFamily: FONT }}>
    <div style={{ fontSize: 50, fontWeight: 800, color: K.inkSoft, opacity: fade(f, s(0)) }}>客が買っているのは、「洗濯」だけではない</div>
    <div style={{ display: "flex", gap: 90, marginTop: 50 }}>
      {["大容量", "乾燥", "時間"].map((t, i) => (
        <div key={i} style={{ fontSize: i === 2 ? 200 : 140, fontWeight: 900, color: i === 2 ? K.red : K.ink, transform: `scale(${pop(f, s(1 + i) + (i === 2 ? 10 : 0))})` }}>
          {t}
        </div>
      ))}
    </div>
  </AbsoluteFill>
), { bg: "white", hideSubs: [1, 2, 3] });

/* N31 FLAT → CLUE 03: 家で分けて洗う・干す・待つ ⇔ 店でまとめて一回 → 「時間と手間を減らすサービス」 */
const N31 = mk(({ f, s }) => {
  const tag = fade(f, s(2) - 4);
  const HOME = [
    { t: "洗う", w: 150 }, { t: "洗う", w: 150 }, { t: "洗う", w: 150 }, { t: "干す", w: 220 }, { t: "乾くのを待つ", w: 520 },
  ];
  let x = 240;
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - tag }}>
        <Stage>
          <text x={220} y={300} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            家
          </text>
          {HOME.map((h, i) => {
            const el = (
              <g key={i} opacity={fade(f, s(0) + i * 8)}>
                <rect x={x} y={250} width={h.w - 10} height={90} rx={12} fill={i < 3 ? "#8FBBD6" : i === 3 ? "#9BCB8F" : "#C9C2B6"} />
                <text x={x + (h.w - 10) / 2} y={295} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
                  {h.t}
                </text>
              </g>
            );
            x += h.w;
            return el;
          })}
          <text x={220} y={560} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.red} opacity={fade(f, s(1))}>
            店
          </text>
          <g opacity={fade(f, s(1))}>
            <rect x={240} y={510} width={520 * ease(f, s(1), s(1) + 30)} height={90} rx={12} fill={K.red} />
            <text x={500} y={555} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF" opacity={fade(f, s(1) + 20)}>
              まとめて洗って、乾燥まで
            </text>
          </g>
          <text x={1500} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.red} opacity={fade(f, s(1) + 30)}>
            浮いた時間
          </text>
          <path d={`M 780 555 L ${780 + 840 * ease(f, s(1) + 30, s(1) + 50)} 555`} stroke={K.red} strokeWidth={6} strokeDasharray="14 10" />
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: tag }}>
        <CareTag no="3" at={s(2)} />
      </AbsoluteFill>
    </>
  );
}, { hideSubs: [2, 3] });

/* N32 FLAT: 家の洗濯機 ≠ コインランドリーの価値 */
const N32 = mk(({ f, s }) => (
  <Stage>
    <HomeWasher x={560} y={440} s={0.9} />
    <text x={560} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
      家の洗濯機
    </text>
    <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={K.red} opacity={fade(f, s(1))}>
      ≠
    </text>
    <g opacity={fade(f, s(1))}>
      <Washer x={1360} y={420} s={0.66} />
      <text x={1360} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
        大容量・乾燥・時間
      </text>
    </g>
    <text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.inkSoft} opacity={fade(f, s(2))}>
      この価値が、以前より重要に
    </text>
  </Stage>
));

/* N33 EVIDENCE #05: 経済産業省 */
const N33 = mk(({ s }) => (
  <EvidenceDoc
    no="#05"
    org="経済産業省"
    title="コインランドリー業界の現状と展望に関する研究会 報告書"
    at={0}
    source="経済産業省 研究会報告書 公表ページ"
    note="（要約）"
    rows={[
      { t: "共働き世帯・高齢者世帯の増加などにより", at: s(1), hl: s(1) + 20 },
      { t: "家事負担を軽減するサービスとして需要が高まる", at: s(1) + 30, hl: s(1) + 50, big: true },
    ]}
  />
), {});

/* N34 FLAT: 時間を減らしたい・手間を減らしたい・一度に終わらせたい */
const N34 = mk(({ f, s }) => (
  <Stage>
    <Clock x={960} y={400} r={140} speed={f >= s(1) ? 6 : 1} />
    {["時間を減らしたい", "手間を減らしたい", "一度に終わらせたい"].map((t, i) => (
      <Pill key={i} x={[480, 1440, 960][i]} y={[300, 300, 700][i]} text={t} at={s(1 + i)} size={48} color={K.red} />
    ))}
    <text x={960} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink} opacity={fade(f, s(4))}>
      ここに、選ばれる理由がある
    </text>
  </Stage>
), { hideSubs: [1, 2, 3, 4] });

export const DEMAND4 = { N23, N24, N25, N26, N27, N28, N29, N30, N31, N32, N33, N34 };
export { METI, Easing, Sfx };
