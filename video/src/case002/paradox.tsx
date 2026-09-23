/** S29–S47: 市場は過去最高・利益は半分（EVIDENCE #02）→ 店の仕組み → CLUE 04・05 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  Bowl, Chip, ClueScene, Columns, EvidenceDoc, EvidenceMark, FlowLine, K, Lines, Person, Pill, R, Sfx, Shop, Stage, Stock, Tag,
  count, ease, fade, mk, pop, yen,
} from "./ui";
import { FONT } from "../theme";

const TDB_MARKET = "帝国データバンク「全国『ラーメン店』市場動向調査（2025年度）」2026年7月";
const MARK = "帝国データバンク ラーメン店市場動向調査（2025年度）";

/* S29 A→F: 高い・重い・上げられない → 縮んでいてもおかしくない → その逆 */
const S29 = mk(({ f, s }) => {
  const W = [
    { t: "原材料", at: s(2) },
    { t: "人件費", at: s(3) },
    { t: "光熱費", at: s(4) },
    { t: "価格は上げにくい", at: s(5) },
  ];
  const down = ease(f, s(7), s(7) + 30);
  const flip = ease(f, s(10) - 4, s(10) + 16, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <Stage>
      {W.map((w, i) => (
        <g key={i} opacity={fade(f, w.at)} transform={`translate(${330 + i * 420} ${250 + 40 * ease(f, w.at, w.at + 12, -1, 0)})`}>
          <path d="M -150 -40 L 150 -40 L 180 70 L -180 70 Z" fill={K.inkSoft} />
          <text y={18} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={i === 3 ? 38 : 50} fill={K.white}>
            {w.t}
          </text>
        </g>
      ))}
      <g opacity={fade(f, s(7) - 4)} transform="translate(960 690)">
        <text x={-60} y={0} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={72} fill={K.ink}>
          ラーメン市場
        </text>
        <g transform={`translate(110 0) rotate(${180 * (1 - flip) * down})`}>
          <path d="M 0 65 L 0 -65 M -60 -5 L 0 -65 L 60 -5" stroke={flip > 0.5 ? K.red : K.inkSoft} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
      <Sfx at={s(10)} name="swell" volume={0.4} />
    </Stage>
  );
});

/* S30 C: 2025年度 8855億円 過去最高 */
const S30 = mk(
  ({ f, s }) => {
    const v = count(f, s(3) - 4, 34, 0, 8855);
    const stamp = pop(f, s(4));
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80, fontFamily: FONT, color: K.ink }}>
          <div style={{ fontSize: 56, fontWeight: 800, opacity: fade(f, s(0)) }}>2025年度　ラーメン店市場</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: K.inkSoft, opacity: fade(f, s(2)), marginTop: 6 }}>（見込み）</div>
          <div style={{ fontSize: 250, fontWeight: 900, letterSpacing: 2, opacity: f >= s(3) - 4 ? 1 : 0, fontVariantNumeric: "tabular-nums" }}>
            {yen(v)}
            <span style={{ fontSize: 110 }}>億円</span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 70,
              fontWeight: 900,
              color: K.red,
              border: `8px solid ${K.red}`,
              borderRadius: 14,
              padding: "2px 30px",
              transform: `scale(${1.3 - 0.3 * stamp}) rotate(-4deg)`,
              opacity: Math.min(1, stamp * 1.5),
            }}
          >
            過去最高
          </div>
        </AbsoluteFill>
        <EvidenceMark no="#02" source={MARK} />
        <Sfx at={s(4)} name="stamp" volume={0.45} />
      </>
    );
  },
  { bg: "white", noSub: true },
);

/* S31 D+H: 2015年度 5418億円 → 2025年度 8855億円（+63.4%） */
const S31 = mk(
  ({ f, s }) => (
    <>
      <Stage>
        <Columns
          max={10000}
          height={540}
          base={850}
          gap={640}
          width={280}
          unit="億円"
          cols={[
            { label: "2015年度", value: 5418, at: s(1), color: K.inkSoft },
            { label: "2025年度", value: 8855, at: s(1) + 6, color: K.red, sub: "見込み" },
          ]}
        />
        <line x1={420} x2={1500} y1={960} y2={960} stroke={K.ink} strokeWidth={4} opacity={0.4} />
        <text x={960} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill={K.inkSoft} opacity={fade(f, s(4))}>
          10年間
        </text>
        <Pill x={960} y={250} text="+63.4％" at={s(5)} size={80} color={K.red} />
      </Stage>
      <EvidenceMark no="#02" source={MARK} />
    </>
  ),
  { noSub: true },
);

/* S32 C: 上位 50 社の主要チェーン 6305店 過去最多 */
const S32 = mk(
  ({ f, s }) => {
    const n = Math.floor(count(f, s(3) - 20, 40, 0, 400));
    return (
      <>
        <Stage>
          {Array.from({ length: 400 }, (_, i) => (
            <circle key={i} cx={260 + (i % 40) * 36} cy={200 + Math.floor(i / 40) * 36} r={11} fill={i < n ? K.red : K.line} opacity={i < n ? 0.85 : 0.35} />
          ))}
        </Stage>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, fontFamily: FONT, color: K.ink }}>
          <div style={{ fontSize: 44, fontWeight: 800, opacity: fade(f, s(1)) }}>売上高上位50社の主要チェーン　店舗数（2025年度末）</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 30, opacity: fade(f, s(3) - 4) }}>
            <div style={{ fontSize: 170, fontWeight: 900 }}>
              {yen(count(f, s(3) - 4, 30, 0, 6305))}
              <span style={{ fontSize: 80 }}>店</span>
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, color: K.red, opacity: fade(f, s(4)) }}>過去最多</div>
          </div>
        </AbsoluteFill>
        <EvidenceMark no="#02" source={MARK} />
      </>
    );
  },
  { bg: "white", hideSubs: [1, 2, 3, 4] },
);

/* S33 F: 三本の上向き矢印 → 「結局、儲かっているんじゃないか？」 */
const S33 = mk(
  ({ f, s }) => {
    const q = fade(f, s(6) - 4);
    const A = [
      { t: "コスト", at: s(0) },
      { t: "市場", at: s(2) },
      { t: "店舗", at: s(3) },
    ];
    return (
      <>
        <Stage>
          <g opacity={1 - q * 0.8}>
            {A.map((a, i) => {
              const p = ease(f, a.at, a.at + 20, 0, 1, Easing.out(Easing.back(1.5)));
              return (
                <g key={i} transform={`translate(${520 + i * 440} 560)`} opacity={fade(f, a.at)}>
                  <path d={`M 0 180 L 0 ${180 - 300 * p} M -70 ${250 - 300 * p} L 0 ${180 - 300 * p} L 70 ${250 - 300 * p}`} stroke={i === 0 ? K.inkSoft : K.red} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <text y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#F4EEE3">
                    {a.t}
                  </text>
                </g>
              );
            })}
          </g>
        </Stage>
        <Lines
          dark
          y={-40}
          lines={[
            { t: "「結局、ラーメン屋は", at: s(6), size: 96 },
            { t: <><R>儲かっている</R>んじゃないか？」</>, at: s(6) + 14, size: 96 },
          ]}
        />
      </>
    );
  },
  { bg: "night", hideSubs: [6] },
);

/* S34 B→D: EVIDENCE #02 純損益合計 356億円 → 171億円 */
const S34 = mk(
  ({ f, s }) => {
    const chart = ease(f, s(3) - 6, s(3) + 10);
    return (
      <>
        <AbsoluteFill style={{ opacity: 1 - chart }}>
          <EvidenceDoc
            no="#02"
            org="帝国データバンク"
            title="全国「ラーメン店」市場動向調査（2025年度）"
            at={s(1)}
            source={TDB_MARKET}
            note="（要約）"
            rows={[{ t: "損益を確認できた企業の純損益合計", at: s(2), hl: s(2) + 20 }]}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: chart }}>
          <Stage>
            <Columns
              max={400}
              height={460}
              base={770}
              gap={620}
              width={280}
              unit="億円"
              dur={36}
              cols={[
                { label: "前年度", value: 356, at: s(4) - 6, color: K.inkSoft, sub: "純損益合計" },
                { label: "2025年度", value: 171, at: s(6) - 6, color: K.red, sub: "純損益合計" },
              ]}
            />
            <g opacity={fade(f, s(7))}>
              <rect x={60} y={700} width={250} height={60} rx={30} fill={K.white} stroke={K.ink} strokeWidth={4} />
              <text x={185} y={730} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.ink}>
                市場は過去最大
              </text>
              <path d="M 185 690 L 185 520 M 150 555 L 185 520 L 220 555" stroke={K.red} strokeWidth={12} strokeLinecap="round" fill="none" />
            </g>
            <Pill x={1270} y={200} text="ほぼ半分" at={s(9) + 10} size={64} color={K.red} />
          </Stage>
          <EvidenceMark no="#02" source={MARK} />
        </AbsoluteFill>
      </>
    );
  },
  { hideSubs: [4, 6] },
);

/* S35 G: 売れている。でも、残らない。（BGM は止める） */
const S35 = mk(
  ({ s }) => (
    <Lines
      dark
      gap={30}
      lines={[
        { t: "売れている。", at: s(0), size: 120 },
        { t: <>でも、<R>残らない</R>。</>, at: s(1), size: 120 },
      ]}
    />
  ),
  { bg: "night", noSub: true },
);

/* S36 D: なぜ？ → 最初の 1000円に戻る → 売上とコストの線 */
const S36 = mk(
  ({ f, s }) => {
    const chart = fade(f, s(10) - 6);
    const ITEMS = ["食材費", "人件費", "家賃", "水道光熱費", "設備費"];
    const t = ease(f, s(10), s(12) + 20, 0, 1, Easing.inOut(Easing.cubic));
    const P = (k: number, steep: number) => `${300 + k * 1300},${800 - k * steep}`;
    const line = (steep: number, prog: number) =>
      Array.from({ length: 21 }, (_, i) => i / 20)
        .filter((k) => k <= prog)
        .map((k) => P(k, steep))
        .join(" ");
    return (
      <>
        <Stage>
          <g opacity={fade(f, s(0)) * (1 - fade(f, s(2)))}>
            <text x={960} y={520} textAnchor="middle" fontFamily={"'Noto Serif CJK JP', serif"} fontWeight={900} fontSize={140} fill={K.ink}>
              なぜなのか？
            </text>
          </g>
          <g opacity={fade(f, s(2)) * (1 - chart)}>
            {ITEMS.map((it, i) => (
              <Pill key={i} x={320 + i * 320} y={470} text={it} at={s(4 + i)} size={44} color={K.soy} />
            ))}
          </g>
          <g opacity={chart}>
            <line x1={300} y1={800} x2={1640} y2={800} stroke={K.ink} strokeWidth={5} />
            <line x1={300} y1={800} x2={300} y2={200} stroke={K.ink} strokeWidth={5} />
            <polyline points={line(360, t)} fill="none" stroke={K.inkSoft} strokeWidth={14} strokeLinecap="round" />
            <polyline points={line(520, ease(f, s(11), s(12) + 20, 0, 1, Easing.inOut(Easing.cubic)))} fill="none" stroke={K.red} strokeWidth={14} strokeLinecap="round" />
            <text x={1660} y={800 - 360 * t + 10} fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft} opacity={t}>
              売上
            </text>
            <text x={1660} y={800 - 520 * ease(f, s(11), s(12) + 20) - 10} fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red} opacity={fade(f, s(11))}>
              コスト
            </text>
          </g>
        </Stage>
        <Tag text="※ イメージ図" at={s(10)} />
      </>
    );
  },
  { hideSubs: [0, 4, 5, 6, 7, 8] },
);

/* S37 G: CLUE 04 */
const S37 = mk(({ s }) => <ClueScene no={4} at={s(0) - 10} />, { noSub: true });

/* S38 F: 同じ 1000円前後なのに、残せる店と残せない店 */
const S38 = mk(
  ({ f, s }) => {
    const q = fade(f, s(3));
    return (
      <>
        <Stage>
          <line x1={960} x2={960} y1={120} y2={880} stroke="#3A465C" strokeWidth={4} />
          {[0, 1].map((k) => {
            const x = k ? 1440 : 480;
            return (
              <g key={k} opacity={fade(f, s(1))}>
                <Shop x={x} y={380} s={0.85} color={k ? "#3E7BA6" : K.red} />
                <rect x={x - 250} y={640} width={500} height={70} rx={10} fill="#2A3446" stroke="#F4EEE3" strokeWidth={4} />
                <rect x={x - 244} y={646} width={(k ? 470 : 420) * ease(f, s(2), s(2) + 20)} height={58} rx={6} fill={K.inkSoft} />
                <rect x={x - 244 + (k ? 470 : 420)} y={646} width={(k ? 18 : 68) * ease(f, s(2) + 20, s(2) + 30)} height={58} rx={6} fill={K.red} />
                <text x={x} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#F4EEE3" opacity={fade(f, s(2) + 30)}>
                  {k ? "残せない店" : "残せる店"}
                </text>
              </g>
            );
          })}
        </Stage>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
          <div style={{ fontFamily: "'Noto Serif CJK JP', serif", fontWeight: 900, fontSize: 150, color: K.red, opacity: q, textShadow: "0 0 30px #0E1320" }}>なぜ？</div>
        </AbsoluteFill>
      </>
    );
  },
  { bg: "night", hideSubs: [3] },
);

/* S39 E: 職人の仕事（朝の仕込み・チャーシュー・一杯ずつ） */
const S39 = mk(({ f, s }) => {
  const STEPS = [
    { t: "朝からスープを仕込む", at: s(4) },
    { t: "チャーシューを作る", at: s(5) },
    { t: "一杯ずつ、丁寧に", at: s(6) },
  ];
  return (
    <Stock
      file="E5_craftsman.mp4"
      fallback={
        <Stage>
          <g opacity={fade(f, s(2))}>
            <g transform="translate(560 560)">
              <rect x={-230} y={-160} width={460} height={340} rx={30} fill="#9AA3AF" stroke={K.ink} strokeWidth={8} />
              <ellipse cx={0} cy={-160} rx={230} ry={50} fill={K.broth} stroke={K.ink} strokeWidth={8} />
              <rect x={-260} y={-60} width={40} height={40} rx={10} fill={K.ink} />
              <rect x={220} y={-60} width={40} height={40} rx={10} fill={K.ink} />
              <path d="M -150 190 L 150 190" stroke="#D2693C" strokeWidth={20} strokeLinecap="round" opacity={0.8 + 0.2 * Math.sin(f / 4)} />
            </g>
            <g transform="translate(560 380)">
              {[-80, 0, 80].map((dx, i) => {
                const t = ((f / 40 + i * 0.3) % 1);
                return <path key={i} d={`M ${dx} ${-t * 80} q 30 -40 0 -80 t 0 -80`} stroke="rgba(34,48,74,0.25)" strokeWidth={12} fill="none" strokeLinecap="round" opacity={Math.sin(Math.PI * t)} />;
              })}
            </g>
          </g>
          {STEPS.map((st, i) => (
            <g key={i} opacity={fade(f, st.at)} transform={`translate(1050 ${360 + i * 170})`}>
              <circle r={34} fill={K.red} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.white}>
                {i + 1}
              </text>
              <text x={70} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={58} fill={K.ink}>
                {st.t}
              </text>
            </g>
          ))}
          <text x={1050} y={250} fontFamily={FONT} fontWeight={800} fontSize={46} fill={K.inkSoft} opacity={fade(f, s(3))}>
            職人の仕事
          </text>
        </Stage>
      }
    />
  );
});

/* S40 C: ビジネスとして見ると、別の数字（運営の 5 つの問い） */
const S40 = mk(
  ({ f, s }) => {
    const Q = [
      { k: "仕込み", v: "何時間？", at: s(3) },
      { k: "提供", v: "何分？", at: s(4) },
      { k: "スタッフ1人で", v: "何人？", at: s(5) },
      { k: "1日に", v: "何杯？", at: s(6) },
      { k: "食材ロス", v: "どれだけ？", at: s(7) },
    ];
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110, fontFamily: FONT }}>
          <div style={{ fontSize: 50, fontWeight: 800, color: "#C9C2B6", marginBottom: 40, opacity: fade(f, s(1)) }}>ビジネスとして見ると</div>
          <div style={{ display: "flex", gap: 26 }}>
            {Q.map((q, i) => {
              const p = pop(f, q.at);
              return (
                <div key={i} style={{ width: 300, height: 300, borderRadius: 24, background: "#243047", border: "4px solid #3A465C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p * 1.4), transform: `scale(${p})` }}>
                  <div style={{ fontSize: [...q.k].length > 5 ? 34 : 42, fontWeight: 800, color: "#C9C2B6" }}>{q.k}</div>
                  <div style={{ fontSize: 64, fontWeight: 900, color: K.gold, marginTop: 20, fontVariantNumeric: "tabular-nums" }}>{q.v}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </>
    );
  },
  { bg: "steel", hideSubs: [3, 4, 5, 6, 7] },
);

/* S41 D: 同じ 1000円でも、時間と人の数が違えば残るお金も変わる */
const S41 = mk(({ f, s }) => (
  <Stage>
    {[0, 1].map((k) => {
      const x = k ? 1360 : 560;
      const people = k ? 2 : 4;
      const time = k ? 0.45 : 0.9;
      return (
        <g key={k} opacity={fade(f, s(0))}>
          <Bowl x={x} y={330} s={0.45} steam={0.5} />
          <text x={x} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            1000円
          </text>
          {Array.from({ length: people }, (_, i) => (
            <Person key={i} x={x - (people - 1) * 55 + i * 110} y={620} s={0.75} color={K.inkSoft} o={fade(f, s(1) + i * 4)} />
          ))}
          <rect x={x - 300} y={720} width={600} height={40} rx={20} fill={K.mist} />
          <rect x={x - 300} y={720} width={600 * time * ease(f, s(1), s(1) + 30)} height={40} rx={20} fill={K.inkSoft} />
          <text x={x - 310} y={740} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            時間
          </text>
          <g opacity={fade(f, s(2))}>
            <rect x={x - 90} y={820} width={180} height={(k ? 90 : 34)} rx={8} fill={K.red} />
            <text x={x + 110} y={850} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.red}>
              残る
            </text>
          </g>
        </g>
      );
    })}
  </Stage>
));

/* S42 D: チェーンの 4 つの武器 */
const S42 = mk(
  ({ f, s }) => {
    const WEAP = ["大量調達", "セントラル\nキッチン", "券売機・\n注文システム", "オペレーション\nの標準化"];
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110, fontFamily: FONT }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: K.ink, marginBottom: 50, opacity: fade(f, s(1)) }}>規模の大きなチェーンの武器</div>
        <div style={{ display: "flex", gap: 34 }}>
          {WEAP.map((w, i) => {
            const on = ease(f, s(i + 2), s(i + 2) + 10);
            return (
              <div
                key={i}
                style={{
                  width: 360,
                  height: 280,
                  borderRadius: 20,
                  border: `6px solid ${on > 0.5 ? K.red : K.line}`,
                  background: on > 0.5 ? K.white : "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  fontSize: 44,
                  fontWeight: 900,
                  lineHeight: 1.3,
                  color: on > 0.5 ? K.ink : K.line,
                  transform: `translateY(${(1 - on) * 16}px)`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  },
  { hideSubs: [2, 3, 4, 5] },
);

/* S43 E→D: 作業をまとめる → 効率化 → 少人数 → 原価管理 → コスト構造が変わる */
const S43 = mk(({ f, s }) => {
  const structure = ease(f, s(5), s(6) + 10);
  return (
    <>
      <Stock
        file="E6_central_kitchen.mp4"
        label="イメージ"
        fallback={
          <Stage>
            <g opacity={1 - structure}>
              <g transform="translate(420 520)" opacity={fade(f, s(0))}>
                <rect x={-200} y={-150} width={400} height={300} rx={20} fill={K.white} stroke={K.ink} strokeWidth={7} />
                <text textAnchor="middle" y={-60} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
                  まとめて
                </text>
                <text textAnchor="middle" y={10} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
                  仕込む拠点
                </text>
              </g>
              {[0, 1, 2].map((i) => (
                <g key={i} opacity={fade(f, s(1) + i * 6)}>
                  <FlowLine d={`M 640 520 C 820 520 900 ${260 + i * 260} 1080 ${260 + i * 260}`} at={s(1) + i * 6} color={K.inkSoft} w={8} />
                  <Shop x={1320} y={260 + i * 260} s={0.45} />
                </g>
              ))}
              <g opacity={fade(f, s(2))} transform="translate(1700 300)">
                <rect x={-70} y={-100} width={140} height={200} rx={16} fill={K.ink} />
                <rect x={-56} y={-82} width={112} height={150} rx={8} fill={K.blue} />
                <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.ink}>
                  注文・会計
                </text>
              </g>
              <g opacity={fade(f, s(3))} transform="translate(1700 700)">
                <Person x={-40} y={0} s={0.6} color={K.inkSoft} />
                <Person x={40} y={0} s={0.6} color={K.inkSoft} />
                <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.ink}>
                  少ない人数
                </text>
              </g>
              <Pill x={420} y={820} text="原価管理を高度化" at={s(4)} size={40} color={K.soy} />
            </g>
          </Stage>
        }
      />
      <AbsoluteFill style={{ opacity: structure, background: K.paper }}>
        <Stage>
          <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
            同じ1000円でも
          </text>
          {[0, 1].map((k) => {
            const x0 = k ? 1010 : 250;
            const ws = k ? [0.3, 0.2, 0.12, 0.08, 0.1] : [0.3, 0.3, 0.14, 0.1, 0.12];
            let acc = 0;
            const g = ease(f, s(7), s(7) + 40);
            return (
              <g key={k}>
                <text x={x0} y={420} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
                  {k ? "仕組みを変えた店" : "これまで"}
                </text>
                {ws.map((w, i) => {
                  const ww = 660 * (k ? w * g + [0.3, 0.3, 0.14, 0.1, 0.12][i] * (1 - g) : w);
                  const r = <rect key={i} x={x0 + acc} y={450} width={ww - 3} height={120} rx={6} fill={K.cost[[2, 0, 1, 4, 3][i]]} />;
                  acc += ww;
                  return r;
                })}
                <rect x={x0 + acc} y={450} width={Math.max(0, 660 - acc)} height={120} rx={6} fill={K.profit} />
                <rect x={x0} y={450} width={660} height={120} rx={8} fill="none" stroke={K.ink} strokeWidth={5} />
              </g>
            );
          })}
          <text x={960} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(7) + 20)}>
            コスト構造が変わる
          </text>
        </Stage>
        <Tag text="※ 割合はイメージ" x={1560} y={50} />
      </AbsoluteFill>
    </>
  );
});

/* S44 G: 「いくらで売るか」だけではない →「どうやって作り、どうやって売るか」 */
const S44 = mk(
  ({ f, s }) => {
    const strike = ease(f, s(2) + 16, s(2) + 32);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80, gap: 40 }}>
        <div style={{ position: "relative", fontFamily: "'Noto Serif CJK JP', serif", fontWeight: 900, fontSize: 90, color: K.inkSoft, opacity: fade(f, s(1)) * (1 - 0.4 * strike) }}>
          「いくらで売るか」だけ
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, width: `${strike * 104}%`, background: K.red, borderRadius: 5 }} />
        </div>
        <div style={{ fontFamily: "'Noto Serif CJK JP', serif", fontWeight: 900, fontSize: 104, color: K.ink, opacity: fade(f, s(3)) }}>
          「どうやって<span style={{ color: K.red }}>作り</span>、どうやって<span style={{ color: K.red }}>売る</span>か」
        </div>
      </AbsoluteFill>
    );
  },
  { noSub: true },
);

/* S45 B: EVIDENCE #02 業界の動き（要約） */
const S45 = mk(({ s }) => (
  <EvidenceDoc
    no="#02"
    org="帝国データバンク"
    title="全国「ラーメン店」市場動向調査（2025年度）"
    at={0}
    source={TDB_MARKET}
    note="（要約）"
    zoomAt={s(2)}
    zoomTo={1.05}
    rows={[
      { t: "業界の動き", at: s(1) },
      { t: "セントラルキッチンやタブレット等の注文システム", at: s(2), hl: s(2) + 10 },
      { t: "少ない人数でも店舗を運営できる仕組みづくり", at: s(3), hl: s(3) + 10 },
    ]}
  />
));

/* S46 A: 単なる機械化ではない。店の動かし方を変えている */
const S46 = mk(({ f, s }) => {
  const rot = (f - s(3)) * 1.2;
  return (
    <Stage>
      <g opacity={fade(f, s(1))}>
        <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.inkSoft}>
          単なる機械化 ではない
        </text>
      </g>
      <g opacity={fade(f, s(3))} transform="translate(960 600)">
        <Shop x={0} y={0} s={1.0} />
        {[
          [-330, -60, 70, 1],
          [330, -20, 90, -1],
          [0, 260, 60, 1],
        ].map(([x, y, r, dir], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot * dir})`}>
            {Array.from({ length: 8 }, (_, k) => (
              <rect key={k} x={-12} y={-r - 18} width={24} height={30} rx={4} fill={K.soy} transform={`rotate(${k * 45})`} />
            ))}
            <circle r={r} fill={K.soy} />
            <circle r={r * 0.4} fill={K.paper} />
          </g>
        ))}
      </g>
    </Stage>
  );
});

/* S47 G: CLUE 05 */
const S47 = mk(({ s }) => <ClueScene no={5} at={s(0) - 10} />, { noSub: true });

export const PARADOX = { S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47 };
