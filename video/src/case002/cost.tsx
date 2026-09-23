/** S14–S28: 原価指数（EVIDENCE #01）→ 1000円の中身 → 1000円の壁 → 客単価 → CLUE 02・03 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  Bill, Bowl, Chip, ClueScene, Columns, EvidenceDoc, EvidenceMark, K, Lines, Pill, PriceCard, R, Sfx, Shop, Stage, Stock, Tag, Veil,
  count, ease, fade, mk, pop,
} from "./ui";
import { FONT } from "../theme";

const TDB_INDEX = "帝国データバンク「『ラーメン店』の倒産動向（2025年）」2026年1月";

/* S14 F: 画面を空にして「一つの数字」を予告 */
const S14 = mk(
  ({ f, s, d }) => {
    const clear = ease(f, s(1), s(1) + 20);
    return (
      <>
        <Stage>
          <g opacity={1 - clear}>
            <Bowl x={960} y={520} s={1.1} steam={1} />
          </g>
        </Stage>
        <Lines lines={[{ t: <>この1000円の中で、<R>大きな変化</R>が起きている。</>, at: s(2), size: 72, out: s(3) - 6 }]} y={-30} />
        <Lines lines={[{ t: "一つの数字を見てほしい。", at: s(3), size: 80 }]} y={-30} />
        <Veil o={ease(f, d - 10, d)} color="#FCFBF8" />
      </>
    );
  },
  { bg: "white", hideSubs: [2, 3] },
);

/* S15 C: 「100」だけ */
const S15 = mk(
  ({ f, s }) => (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 380, color: K.ink, opacity: ease(f, s(0) - 4, s(0) + 6), letterSpacing: 6 }}>100</div>
    </AbsoluteFill>
  ),
  { bg: "white", noSub: true },
);

/* S16 B: EVIDENCE #01 ラーメン原価指数の定義 */
const S16 = mk(
  ({ s }) => (
    <EvidenceDoc
      no="#01"
      org="帝国データバンク"
      title="ラーメン原価指数"
      at={0}
      zoomAt={s(1)}
      zoomTo={1.04}
      source={TDB_INDEX}
      note="（要約）"
      rows={[
        { t: "2020年平均 ＝ 100", at: s(0) + 20, hl: s(0) + 60, big: true },
        { t: "東京都区部の豚骨ベースのラーメンを想定", at: s(1), hl: s(1) + 8 },
        { t: "原材料コストの変化を指数化", at: s(1) + 50, hl: s(1) + 90 },
      ]}
    />
  ),
  { hideSubs: [] },
);

/* S17 D: 2020年 100 →（そして）→ 2025年 141 */
const S17 = mk(
  ({ f, s }) => {
    const plus = fade(f, s(4) + 26);
    return (
      <>
        <Stage>
          <Columns
            max={160}
            height={560}
            base={850}
            gap={560}
            width={260}
            cols={[
              { label: "2020年", value: 100, at: s(0) + 6, color: K.inkSoft, sub: "平均" },
              { label: "2025年", value: 141, at: s(4) - 4, color: K.red },
            ]}
          />
          <g opacity={plus}>
            <path d="M 800 480 C 900 380 1020 320 1080 310" fill="none" stroke={K.red} strokeWidth={8} strokeDasharray="18 12" />
            <Pill x={930} y={330} text="+41" at={s(4) + 26} color={K.red} size={56} />
          </g>
        </Stage>
        <EvidenceMark no="#01" source="帝国データバンク ラーメン原価指数（2020年＝100）" />
        <Sfx at={s(4) + 20} name="thud" volume={0.35} />
      </>
    );
  },
  { noSub: true },
);

/* S18 A: 一律 41% ではない / 店ごとに違う / あくまで指標 / それでも上昇はわかる */
const S18 = mk(
  ({ f, s }) => {
    const strike = ease(f, s(2), s(2) + 14);
    const shops = fade(f, s(3) - 6);
    const idx = fade(f, s(6));
    const up = fade(f, s(8));
    return (
      <Stage>
        <g opacity={1 - shops}>
          <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={K.ink} opacity={fade(f, s(1))}>
            全店一律 +41％
          </text>
          <line x1={500} y1={440} x2={500 + 920 * strike} y2={440} stroke={K.red} strokeWidth={16} strokeLinecap="round" />
        </g>
        <g opacity={shops * (1 - up)}>
          {[
            ["材料", s(3)],
            ["仕入れ先", s(4)],
            ["作り方", s(5)],
          ].map(([t, at], i) => (
            <g key={i}>
              <Shop x={420 + i * 540} y={430} s={0.8} color={[K.red, "#3E7BA6", K.negi][i]} />
              <Pill x={420 + i * 540} y={700} text={`${t}が違う`} at={at as number} size={44} color={K.ink} />
            </g>
          ))}
        </g>
        <g opacity={idx * (1 - up)}>
          <rect x={660} y={780} width={600} height={110} rx={55} fill={K.ink} />
          <text x={960} y={836} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.paper}>
            変化を見るための「指標」
          </text>
        </g>
        <g opacity={up}>
          <text x={960} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            原材料コスト
          </text>
          <path d={`M 960 ${760 - 180 * ease(f, s(8), s(8) + 30)} l -70 70 m 70 -70 l 70 70 M 960 ${760 - 180 * ease(f, s(8), s(8) + 30)} L 960 780`} stroke={K.red} strokeWidth={22} strokeLinecap="round" fill="none" />
        </g>
      </Stage>
    );
  },
  { hideSubs: [] },
);

/* S19 D: 同じ 1000円の箱、昔と今で中身が違う */
const S19 = mk(
  ({ f, s }) => {
    const split = ease(f, s(6), s(6) + 24, 0, 1, Easing.inOut(Easing.cubic));
    const items = [
      { t: "原材料", at: s(1), c: K.cost[2] },
      { t: "光熱費", at: s(2), c: K.cost[4] },
      { t: "人件費", at: s(3), c: K.cost[0] },
      { t: "家賃", at: s(4), c: K.cost[1] },
      { t: "その他", at: s(5), c: K.cost[3] },
    ];
    const Box = ({ x, grow, title, o }: { x: number; grow: number; title: string; o: number }) => {
      let y = 880;
      return (
        <g opacity={o}>
          <text x={x} y={210} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.inkSoft}>
            {title}
          </text>
          <rect x={x - 230} y={250} width={460} height={640} rx={16} fill={K.white} stroke={K.ink} strokeWidth={7} />
          {items.map((it, i) => {
            const base = [110, 60, 130, 70, 50][i];
            const h = base * (1 + grow * [0.45, 0.35, 0.2, 0.1, 0.15][i]) * ease(f, it.at, it.at + 14);
            y -= h;
            return (
              <g key={i}>
                <rect x={x - 222} y={y} width={444} height={Math.max(0, h - 4)} rx={6} fill={it.c} />
                {h > 40 && (
                  <text x={x} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.ink}>
                    {it.t}
                  </text>
                )}
              </g>
            );
          })}
          <rect x={x - 222} y={258} width={444} height={Math.max(0, y - 262)} rx={8} fill={K.profit} opacity={0.18} />
          <text x={x} y={258 + Math.max(0, y - 262) / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.profit}>
            残り
          </text>
        </g>
      );
    };
    return (
      <>
        <Stage>
          <g transform={`translate(${-330 * split} 0)`}>
            <Box x={960} grow={0} title={split > 0.5 ? "昔" : "1000円"} o={1} />
          </g>
          <g transform={`translate(${330 * split} 0)`} opacity={split}>
            <Box x={960} grow={ease(f, s(7), s(8) + 20)} title="今" o={1} />
          </g>
        </Stage>
        <Tag text="※ 割合はイメージ" x={60} y={50} at={s(1)} />
      </>
    );
  },
  { hideSubs: [] },
);

/* S20 G: CLUE 02 */
const S20 = mk(({ s }) => <ClueScene no={2} at={s(0) - 10} />, { noSub: true });

/* S21 A: 値段も上げればいい？ 1000 → 1100 → 1200 */
const S21 = mk(({ f, s }) => {
  const price = f < s(3) ? "1000円" : f < s(4) ? "1100円" : "1200円";
  const bump = f >= s(3) ? 1 + 0.08 * Math.exp(-(f - (f < s(4) ? s(3) : s(4))) / 5) : 1;
  return (
    <Stage>
      <Bowl x={700} y={560} s={1.05} />
      <PriceCard x={1360} y={420} text={price} s={1.35 * bump} r={4} />
      <text x={1360} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.inkSoft} opacity={fade(f, s(5))}>
        簡単な話？
      </text>
      <Sfx at={s(3)} name="tok" volume={0.5} />
      <Sfx at={s(4)} name="tok" volume={0.5} />
    </Stage>
  );
});

/* S22 F: ある「壁」→「1000円の壁」 */
const S22 = mk(
  ({ f, s }) => {
    const rise = ease(f, s(1), s(2) + 30, 0, 1, Easing.inOut(Easing.cubic));
    const hit = f > s(2) + 30;
    const shake = hit ? Math.sin((f - s(2) - 30) * 1.7) * 10 * Math.exp(-(f - s(2) - 30) / 8) : 0;
    return (
      <>
        <Stage>
          <rect x={0} y={290} width={1920} height={40} fill="#C9C2B6" opacity={0.9} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={i * 124 + (i % 2) * 20} y={200} width={110} height={90} rx={6} fill="#2A3446" stroke="#3A465C" strokeWidth={4} />
          ))}
          <g transform={`translate(${960 + shake} ${820 - rise * 400})`}>
            <PriceCard x={0} y={0} text="1100円" s={1.1} r={0} />
          </g>
        </Stage>
        <Lines dark y={260} lines={[{ t: <>「<R>1000円の壁</R>」</>, at: s(4), size: 130 }]} />
        <Sfx at={s(2) + 30} name="thud" volume={0.5} />
      </>
    );
  },
  { bg: "night", hideSubs: [4] },
);

/* S23 A: 「ラーメンに1000円以上？」/ 他のランチは超えている / 大衆食のイメージ */
const S23 = mk(
  ({ f, s }) => {
    const lunch = fade(f, s(5) - 4);
    const image = fade(f, s(7) - 4);
    const wallY = 360;
    return (
      <Stage>
        <line x1={120} x2={1800} y1={wallY} y2={wallY} stroke={K.red} strokeWidth={8} strokeDasharray="30 18" />
        <text x={1790} y={wallY - 24} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.red}>
          1000円
        </text>
        <g opacity={1 - lunch * 0.5}>
          <Bowl x={560} y={640} s={0.62} steam={0} />
          <g transform={`translate(560 ${500 - 60 * ease(f, s(0), s(0) + 30)})`}>
            <PriceCard x={0} y={0} text="1000円+" s={0.8} r={0} />
          </g>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1000 560)">
          <rect x={-40} y={-80} width={760} height={150} rx={75} fill={K.white} stroke={K.ink} strokeWidth={6} />
          <text x={340} y={-4} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink}>
            ラーメンに1000円以上？
          </text>
        </g>
        <g opacity={lunch * (1 - image)}>
          {["定食", "パスタ", "ランチセット"].map((t, i) => {
            const y = 300 - 120 * ease(f, s(5) + i * 6, s(5) + i * 6 + 30);
            return <Pill key={i} x={1080 + i * 250} y={y} text={t} at={s(5) + i * 6} size={40} color={K.inkSoft} />;
          })}
        </g>
        <g opacity={image}>
          <text x={1340} y={820} textAnchor="middle" fontFamily={"'Noto Serif CJK JP', serif"} fontWeight={900} fontSize={76} fill={K.ink}>
            「安くて、うまい大衆食」
          </text>
        </g>
      </Stage>
    );
  },
  { hideSubs: [2, 7] },
);

/* S24 D: 1000円という箱は変わらない。中のコストは膨らむ → 利益のスペースが縮む */
const S24 = mk(
  ({ f, s }) => {
    const g1 = ease(f, s(1), s(1) + 20);
    const g2 = ease(f, s(2), s(2) + 20);
    const g3 = ease(f, s(3), s(3) + 20);
    const g4 = ease(f, s(7), s(7) + 40);
    const squeeze = ease(f, s(9), s(10) + 20);
    const W = 1300;
    const base = [0.3, 0.24, 0.1];
    const grow = [0.05 * g1 + 0.03 * g4, 0.04 * g2 + 0.02 * g4, 0.03 * g3 + 0.01 * g4];
    const ws = base.map((b, i) => b + grow[i]);
    const other = 0.1;
    let x = 310;
    return (
      <>
        <Stage>
          <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink} opacity={fade(f, s(5))}>
            1000円という「箱」
          </text>
          <rect x={300} y={330} width={W + 20} height={330} rx={20} fill={K.white} stroke={K.ink} strokeWidth={10} />
          {[["原材料", K.cost[2]], ["人件費", K.cost[0]], ["光熱費", K.cost[4]], ["その他", K.cost[3]]].map(([t, c], i) => {
            const w = (i < 3 ? ws[i] : other) * W;
            const r = (
              <g key={i}>
                <rect x={x} y={340} width={w - 4} height={310} rx={10} fill={c} />
                <text x={x + w / 2} y={495} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.ink}>
                  {t}
                </text>
              </g>
            );
            x += w;
            return r;
          })}
          <rect x={x} y={340} width={Math.max(0, 310 + W + 10 - x - 10)} height={310} rx={10} fill={K.profit} opacity={0.25 + 0.6 * squeeze} />
          <text x={(x + 1610) / 2} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.profit} opacity={fade(f, s(9))}>
            利益
          </text>
          <path d={`M ${(x + 1610) / 2} 690 l 0 -24`} stroke={K.profit} strokeWidth={6} opacity={fade(f, s(9))} />
        </Stage>
        <Tag text="※ 割合はイメージ" x={1560} y={50} at={s(1)} />
      </>
    );
  },
  { hideSubs: [] },
);

/* S25 A: 壁にひびが入る（値上げへの理解）。それでも全店が値上げで解決できるわけではない */
const S25 = mk(({ f, s }) => {
  const crack = ease(f, s(1), s(1) + 30);
  const understand = fade(f, s(3));
  const but = fade(f, s(5));
  return (
    <Stage>
      <g opacity={1 - but * 0.85}>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 9 }, (_, i) => (
            <rect key={`${row}-${i}`} x={250 + i * 160 + (row % 2) * 80} y={180 + row * 90} width={150} height={80} rx={6} fill="#D8D0C2" stroke={K.inkSoft} strokeWidth={3} />
          )),
        )}
        <text x={960} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={K.ink}>
          1000円の壁
        </text>
        <path
          d="M 960 180 L 930 260 L 990 320 L 940 390 L 1000 460 L 960 540"
          fill="none"
          stroke={K.ink}
          strokeWidth={8}
          strokeLinejoin="round"
          strokeDasharray={500}
          strokeDashoffset={500 * (1 - crack)}
        />
        <g opacity={understand} transform="translate(960 790)">
          <rect x={-420} y={-50} width={840} height={100} rx={50} fill={K.ink} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.paper}>
            値上げへの理解が、少しずつ広がる
          </text>
        </g>
      </g>
      <g opacity={but}>
        <rect x={460} y={380} width={1000} height={170} rx={85} fill={K.white} stroke={K.ink} strokeWidth={6} />
        <text x={960} y={465} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.ink}>
          値上げだけで解決？
        </text>
      </g>
    </Stage>
  );
});

/* S26 E: 別の方法（トッピング・サイド・セット・限定） */
const S26 = mk(
  ({ f, s }) => {
    const ITEMS = ["味玉", "チャーシュー", "海苔", "ライス", "餃子", "セット", "期間限定"];
    return (
      <Stock
        file="E7_toppings.mp4"
        fallback={
          <Stage>
            <rect x={380} y={740} width={1160} height={60} rx={20} fill="#B8926A" />
            <Bowl x={960} y={560} s={0.72} steam={0.6} />
            <text x={960} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(1))}>
              別の方法
            </text>
            {ITEMS.map((t, i) => {
              const ang = Math.PI + (i / (ITEMS.length - 1)) * Math.PI;
              const x = 960 + Math.cos(ang) * 700;
              const y = 640 + Math.sin(ang) * 400;
              return <Pill key={i} x={x} y={y} text={t} at={s(i + 3)} size={46} color={i >= 5 ? K.red : K.brothDeep} />;
            })}
          </Stage>
        }
      />
    );
  },
  { hideSubs: [3, 4, 5, 6, 7, 8, 9] },
);

/* S27 C+D: レシートが伸びる → 「客単価」 → 一杯の価格だけでなく… */
const S27 = mk(
  ({ f, s, d }) => {
    const rec = fade(f, s(0));
    const lines = [
      { t: "ラーメン", at: s(0) },
      { t: "味玉", at: s(1) + 10 },
      { t: "ライス", at: s(1) + 24 },
      { t: "餃子", at: s(1) + 38 },
    ];
    const toKey = ease(f, s(6), s(7) + 10, 0, 1, Easing.inOut(Easing.cubic));
    const quote = fade(f, s(10));
    return (
      <>
        <Stage>
          <g opacity={rec * (1 - quote)}>
            <g transform={`translate(${620 - 240 * toKey} 0)`}>
              <path d={`M -230 170 L 230 170 L 230 ${360 + lines.filter((l) => f >= l.at).length * 110} L -230 ${360 + lines.filter((l) => f >= l.at).length * 110} Z`} fill={K.white} stroke={K.line} strokeWidth={4} />
              <text y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
                ご注文
              </text>
              {lines.map((l, i) => (
                <g key={i} opacity={fade(f, l.at)}>
                  <text x={-180} y={340 + i * 110} fontFamily={FONT} fontWeight={800} fontSize={50} fill={K.ink}>
                    {l.t}
                  </text>
                  <rect x={60} y={310 + i * 110} width={120 * (i === 0 ? 1 : 0.35)} height={36} rx={8} fill={i === 0 ? K.inkSoft : K.brothDeep} />
                </g>
              ))}
            </g>
            <g opacity={fade(f, s(4)) * (1 - toKey)}>
              <Pill x={1360} y={440} text="一杯の値段" at={s(4)} size={70} color={K.inkSoft} />
              <text x={1360} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.inkSoft} opacity={fade(f, s(5))}>
                だけではない
              </text>
            </g>
            <g opacity={toKey}>
              <text x={1260} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={K.inkSoft}>
                一人の客が、店全体で使う金額
              </text>
              <text x={1260} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={K.red} transform={`scale(1)`}>
                客単価
              </text>
            </g>
          </g>
        </Stage>
        <Lines
          y={-40}
          lines={[
            { t: "一杯の価格だけでなく、", at: s(11), size: 86, out: s(12) + 10 },
            { t: <>一人の客が使う<R>金額</R>を上げる。</>, at: s(11) + 24, size: 96, out: s(12) + 10 },
          ]}
        />
      </>
    );
  },
  { hideSubs: [7, 11] },
);

/* S28 G: CLUE 03 */
const S28 = mk(({ s }) => <ClueScene no={3} at={s(0) - 10} />, { noSub: true });

export const COST = { S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28 };
