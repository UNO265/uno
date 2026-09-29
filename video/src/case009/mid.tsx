/** CUT 014–027（D14–D26）。なぜ今 → アオキ（常識 ≠ 実際）→ 買う人 → コスモスの低コスト → 郊外 vs 駅前 → 三つの財布（HERO）→ 調剤の伸び → CLUE → 循環 */
import React from "react";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Cam, Coin8, CoinTrail, Person8 } from "../case008/kit2";
import { Lock } from "../case008/kit";
import { Basket, Easing, Egg, FONT, Front, HBar, InsCard, K, MedBag, MedBox, Milk, P, SERIF, Sfx, Shopper, StorePlan, Wallet, ease, fade, pop, PATH } from "./kit";

/* CUT 014 — [QUESTION / LEVEL 2] D14: カレンダーが 2009 → 2025 にめくれる */
const D14 = mk(({ f, s }) => {
  const yr = Math.round(2009 + 16 * ease(f, s(1), s(1) + 40));
  return (
    <>
      <Stage>
        <g transform="translate(960 470)">
          <rect x={-220} y={-200} width={440} height={400} rx={20} fill="#1B2433" stroke="#3B4B68" strokeWidth={6} />
          <rect x={-220} y={-200} width={440} height={90} rx={20} fill={P.food} />
          <text y={60} textAnchor="middle" dominantBaseline="central" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={130} fill="#F4EEE3">
            {yr}
          </text>
        </g>
      </Stage>
      <Sfx at={s(1)} name="question" volume={0.5} />
    </>
  );
}, { bg: "black" });

/* CUT 015 — [STORY / LEVEL 2] D15: 物価高。カゴの値札が上がり、人の点がスーパーからドラッグストアへ移る / 24.6%・67.4%・+9.9%・約3兆円 */
const D15 = mk(({ f, s }) => {
  const move = ease(f, s(3), s(3) + 60);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 700, y: 500 }, { at: s(3), s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(0))}>
            <Basket x={420} y={560} s={0.6} items={4} />
            <g transform={`translate(640 ${320 - 60 * ease(f, s(0), s(0) + 30)})`}>
              <path d="M 0 60 L 0 -40 M -30 -10 L 0 -40 L 30 -10" stroke={P.red} strokeWidth={14} fill="none" strokeLinecap="round" />
            </g>
          </g>
          <g opacity={fade(f, s(1))} transform="translate(420 760)">
            <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={P.red}>
              24.6%
            </text>
            <text y={44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.inkSoft}>
              食料品の支出が「増えた」／うち物価高 67.4%
            </text>
          </g>
          <g opacity={fade(f, s(3))}>
            <Front x={1060} y={620} s={0.55} kind="super" />
            <Front x={1560} y={620} s={0.55} kind="suburb" />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={1060 + 500 * Math.min(1, Math.max(0, move * 1.4 - i * 0.1))} cy={660 + i * 10} r={12} fill={P.dark} />
            ))}
          </g>
          <g opacity={fade(f, s(4))} transform="translate(1310 240)">
            <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
              ドラッグストアの食品（2025年上期）
            </text>
            <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={P.food}>
              +9.9%
            </text>
            <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink} opacity={fade(f, s(5))}>
              1年で 約3兆円
            </text>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no={f < s(3) ? "#28" : "#14"} source={f < s(3) ? "デロイト トーマツ（2025年）" : "経済産業省 商業動態統計・日本経済新聞"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 016 — [REAL(再現) / LEVEL 3] D16: 平面図に青果・精肉・惣菜の売り場が増える → 「損しない？」→ 営業利益 +43.3% の棒がむしろ伸びる（06-29） */
const D16 = mk(({ f, s }) => {
  const fresh = ease(f, s(2), s(2) + 30);
  const up = ease(f, s(5), s(5) + 40, 0, 1, Easing.out(Easing.back(1.2)));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(2), s: 1.15, x: 760, y: 420 }, { at: s(3), s: 1, x: 960, y: 540 }]}>
          <g transform="translate(-80 40) scale(0.9)">
            <StorePlan fresh={fresh} />
          </g>
        </Cam>
        <g opacity={fade(f, s(1))} transform="translate(1480 260)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            クスリのアオキ 売上に占める食品
          </text>
          <text y={100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={P.food}>
            51.3%
          </text>
        </g>
        <g opacity={fade(f, s(3))} transform="translate(1480 460)">
          <text textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={70} fill={K.ink}>
            ?
          </text>
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1300 800)">
          <rect x={0} y={-120} width={120} height={120} rx={8} fill="#9FB3C8" />
          <text x={60} y={-140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            売上 +14.8%
          </text>
          <rect x={200} y={-120 - 200 * up} width={120} height={120 + 200 * up} rx={8} fill={P.green} opacity={fade(f, s(5))} />
          <text x={260} y={-140 - 200 * up} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={P.green} opacity={fade(f, s(5))}>
            営業利益 +43.3%
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#07" source="クスリのアオキHD 決算（2025年5月期）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 017 — [STORY / LEVEL 2] D17: 家から近いドラッグストア、遠いスーパー。一つのカゴに薬・洗剤・食品 */
const D17 = mk(({ f, s }) => {
  const t = ((f - s(4)) % 180) / 180;
  const both = f > s(4);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <g transform="translate(260 620)">
            <path d="M -90 0 L -90 -120 L 0 -200 L 90 -120 L 90 0 Z" fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
            <rect x={-26} y={-70} width={52} height={70} fill="#C9A46A" />
          </g>
          <line x1={360} x2={1760} y1={640} y2={640} stroke="#C9D1DB" strokeWidth={10} strokeDasharray="30 20" />
        </g>
        <g opacity={fade(f, s(1))}>
          <Front x={700} y={620} s={0.5} kind="suburb" />
          <text x={700} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.food}>
            近い
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <Front x={1560} y={620} s={0.5} kind="super" />
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1100 320) scale(1.6)">
          <MedBox x={-120} y={0} s={1} />
          <rect x={-30} y={-40} width={60} height={80} rx={10} fill="#98C1D9" />
          <Egg x={120} y={0} s={0.9} />
        </g>
        {both && <circle cx={260 + 1300 * (t < 0.5 ? t * 2 : 2 - t * 2)} cy={640} r={16} fill={P.dark} />}
      </Stage>
      <EvidenceMark no="#18" source="消費者調査（2025年）" at={s(5)} />
    </>
  );
}, { bg: "white" });

/* CUT 018 — [QUESTION / LEVEL 2] D18: 残った 15円の硬貨だけ */
const D18 = mk(({ f }) => (
  <>
    <Stage>
      <g transform={`translate(960 460) scale(${1 + 0.1 * ease(f, 0, 60)})`}>
        <Coin8 x={0} y={0} r={110} label="15" />
      </g>
    </Stage>
    <Sfx at={4} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 019 — [INFOGRAPHIC / LEVEL 2] D19: チラシ・日替わり特売・ポイントカードが消え、値札だけが毎日同じ → 郊外の大型店、1年で120店 */
const D19 = mk(({ f, s }) => {
  const items = [
    { t: "チラシ", at: s(1) },
    { t: "日替わり・時間帯の特売", at: s(2) },
    { t: "ポイントカード", at: s(3) },
  ];
  const front = fade(f, s(5));
  return (
    <>
      <Stage>
        <g opacity={1 - front}>
          {items.map((it, i) => (
            <g key={it.t} transform={`translate(${440 + i * 520} 380)`} opacity={fade(f, it.at - 10)}>
              <rect x={-220} y={-90} width={440} height={180} rx={20} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={5} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={i === 1 ? 36 : 44} fill={K.inkSoft}>
                {it.t}
              </text>
              <g opacity={fade(f, it.at + 10)}>
                <line x1={-200} y1={-70} x2={200} y2={70} stroke={P.red} strokeWidth={12} />
                <line x1={-200} y1={70} x2={200} y2={-70} stroke={P.red} strokeWidth={12} />
              </g>
            </g>
          ))}
          <g opacity={fade(f, s(4))} transform="translate(960 680)">
            {["月", "火", "水", "木", "金", "土", "日"].map((d, i) => (
              <g key={d} transform={`translate(${(i - 3) * 150} 0)`}>
                <rect x={-60} y={-50} width={120} height={100} rx={12} fill={P.food} />
                <text y={-20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#FFFFFF">
                  {d}
                </text>
                <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
                  ¥
                </text>
              </g>
            ))}
          </g>
        </g>
        <g opacity={front}>
          <Cam keys={[{ at: s(5), s: 1.2, x: 960, y: 560 }, { at: s(6) + 40, s: 1, x: 960, y: 540 }]}>
            <rect x={0} y={0} width={1920} height={1080} fill="#DCEBF7" />
            <rect x={0} y={640} width={1920} height={440} fill="#9AA3AF" />
            <Front x={960} y={640} s={1} kind="suburb" />
          </Cam>
          <text x={1600} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={P.food} opacity={fade(f, s(6))}>
            +120店
          </text>
          <text x={1600} y={310} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.ink} opacity={fade(f, s(6))}>
            2025年5月期
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#16" source="日本経済新聞・FISCO / コスモス薬品 決算" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 020 — [GRAPH / LEVEL 2] D20: 販管費率 平均 21.2% → コスモス 15%、差が値札へ流れて値段が下がる */
const D20 = mk(({ f, s }) => {
  const base = 740;
  const k = 22;
  const flow = ease(f, s(2), s(2) + 40);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <rect x={360} y={base - 21.2 * k} width={220} height={21.2 * k} rx={10} fill="#9FB3C8" opacity={fade(f, s(1))} />
          <text x={470} y={base - 21.2 * k - 24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.inkSoft} opacity={fade(f, s(1))}>
            21.2%
          </text>
          <text x={470} y={base + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            業界平均
          </text>
          <rect x={680} y={base - 15 * k} width={220} height={15 * k} rx={10} fill={P.food} />
          <text x={790} y={base - 15 * k - 24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={P.food}>
            約15%
          </text>
          <text x={790} y={base + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            コスモス薬品
          </text>
          <text x={630} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            売上に対する販売管理費
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <rect x={680} y={base - 21.2 * k} width={220} height={6.2 * k} rx={10} fill="none" stroke={P.red} strokeWidth={5} strokeDasharray="12 8" />
          <CoinTrail pts={[[790, base - 18 * k], [1050, 360], [1240, 360]]} at={s(2)} n={5} dur={30} gap={8} r={14} />
          <g transform={`translate(1300 ${360 + 60 * flow})`}>
            <rect x={-60} y={-40} width={160} height={80} rx={10} fill="#FFFFFF" stroke={P.food} strokeWidth={5} />
            <text x={20} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={P.food}>
              ¥ ↓
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(3))} transform="translate(1440 640)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink}>
            1兆113億円
          </text>
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={P.green} opacity={fade(f, s(4))}>
            営業利益 +25.8%
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#16" source="FISCO（報道）・コスモス薬品 決算（2025年5月期）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 021 — [INFOGRAPHIC / LEVEL 3] D20B: 郊外の大型店（食品） vs 駅前の小型店（化粧品・訪日客）→ 営業利益率 4.0% vs 7.6%（計算） */
const D20B = mk(({ f, s }) => {
  const b = ease(f, s(4), s(5) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1), s: 1.1, x: 1300, y: 500 }, { at: s(4), s: 1, x: 960, y: 540 }]}>
          <rect x={0} y={0} width={960} height={1080} fill="#FFF3E6" />
          <rect x={960} y={0} width={960} height={1080} fill="#FBE9EF" />
          <Front x={480} y={470} s={0.7} kind="suburb" />
          <Front x={1440} y={470} s={0.6} kind="station" />
          <text x={480} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={P.food}>
            郊外・食品
          </text>
          <text x={1440} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={P.beauty}>
            駅前・化粧品
          </text>
          <g opacity={fade(f, s(1)) * (1 - fade(f, s(3)))} transform="translate(1440 580)">
            <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={P.beauty}>
              「美と健康」72.4%
            </text>
            <text y={50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
              マツキヨココカラ（2026年3月期）
            </text>
          </g>
          {[0, 1, 2].map((i) => (
            <Person8 key={i} x={1300 + i * 120} y={470} s={0.45} color={["#F2CC8F", "#98C1D9", "#E5989B"][i]} o={fade(f, s(2)) * (1 - fade(f, s(3)))} />
          ))}
          <g opacity={fade(f, s(3))}>
            <rect x={380} y={820 - 4.0 * 30 * b} width={200} height={4.0 * 30 * b} rx={8} fill={P.food} />
            <rect x={1340} y={820 - 7.6 * 30 * b} width={200} height={7.6 * 30 * b} rx={8} fill={P.beauty} />
            <text x={480} y={800 - 4.0 * 30 * b} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={P.food} opacity={b}>
              約4.0%
            </text>
            <text x={1440} y={800 - 7.6 * 30 * b} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={P.beauty} opacity={b}>
              約7.6%
            </text>
          </g>
        </Cam>
        <text x={960} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={K.inkSoft} opacity={fade(f, s(4))}>
          ※営業利益÷売上の計算（コスモス薬品 2025年5月期／マツキヨココカラ 2026年3月期）
        </text>
      </Stage>
      <EvidenceMark no="#21" source="各社 決算" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 022 — [QUESTION / LEVEL 2] D21: 小さな 15円と、巨大な 10兆円の山 */
const D21 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1.6, x: 520, y: 600 }, { at: s(1) + 20, s: 1, x: 960, y: 540 }]}>
        <Coin8 x={520} y={640} r={40} label="15" />
        <g opacity={fade(f, s(1))}>
          {Array.from({ length: 60 }, (_, i) => (
            <Coin8 key={i} x={1100 + (i % 10) * 64 - Math.floor(i / 10) * 0} y={760 - Math.floor(i / 10) * 60} r={30} />
          ))}
          <text x={1390} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#F4EEE3">
            10兆円
          </text>
        </g>
      </Cam>
    </Stage>
    <Sfx at={s(2)} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 023 — [MONEY FLOW / LEVEL 3] D22: 財布①（食品）②（ついでの薬・化粧品）の硬貨が店へ / +11.7% vs +2.1% */
const D22 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(560 120) scale(0.5)">
        <StorePlan />
      </g>
      <Wallet x={260} y={500} color={P.food} label="① 食品・日用品" o={fade(f, s(1))} />
      <Wallet x={260} y={700} color={P.beauty} label="② ついでの薬・化粧品" o={fade(f, s(3))} />
      <CoinTrail pts={[[340, 480], [700, 420], [760, 380]]} at={s(1) + 10} n={30} dur={40} gap={24} r={12} loop />
      <CoinTrail pts={[[340, 680], [700, 420], [760, 330]]} at={s(3) + 10} n={30} dur={36} gap={14} r={16} loop />
      <InsCard x={1640} y={300} s={0.9} o={0.25 * fade(f, s(0))} />
      <text x={1640} y={400} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill="#9FB3C8" opacity={0.6 * fade(f, s(0))}>
        ③ ?
      </text>
      <g opacity={fade(f, s(4))}>
        <HBar x={1300} y={560} w={420} v={11.7 / 14} color={P.beauty} label="化粧品など" value="+11.7%" h={60} />
        <HBar x={1300} y={660} w={420} v={2.1 / 14} color="#9FB3C8" label="日用品" value="+2.1%" h={60} o={fade(f, s(5))} />
      </g>
    </Stage>
    <EvidenceMark no="#01" source="日本チェーンドラッグストア協会（2024年度）" at={s(4)} />
  </>
), { bg: "white" });

/* CUT 024 — [MONEY FLOW / LEVEL 4 HERO] D23: 保険証 → 調剤カウンター。代金が 7（保険）: 3（本人）に分かれて入る → 値札に国の鍵（薬価・調剤報酬） */
const D23 = mk(({ f, s }) => {
  const counter: [number, number] = [960, 420];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.2, x: 1500, y: 400 }, { at: s(1), s: 1, x: 960, y: 540 }, { at: s(4), s: 1.12, x: 1300, y: 640 }, { at: s(6), s: 1, x: 960, y: 540 }]}>
          <InsCard x={1560} y={300} s={1.3} label="③ 調剤" />
          {/* 処方箋 → 調剤カウンター */}
          <g opacity={fade(f, s(1))}>
            <rect x={760} y={330} width={400} height={180} rx={16} fill={P.rx} />
            <text x={960} y={420} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#FFFFFF">
              調剤
            </text>
            <g transform={`translate(${300 + 380 * ease(f, s(1), s(1) + 40)} 420)`}>
              <rect x={-60} y={-80} width={120} height={160} rx={6} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={4} />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={-40} y={-50 + i * 30} width={80} height={10} rx={5} fill="#C9D1DB" />
              ))}
            </g>
          </g>
          {/* 代金 7:3 */}
          <g opacity={fade(f, s(2))}>
            <rect x={1360} y={560} width={360} height={140} rx={20} fill="#E8F1FA" stroke={P.rx} strokeWidth={5} />
            <text x={1540} y={630} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={P.rx}>
              公的医療保険
            </text>
            <CoinTrail pts={[[1360, 630], [1100, 560], counter]} at={s(2) + 10} n={7} dur={36} gap={8} r={16} stay />
          </g>
          <g opacity={fade(f, s(3))}>
            <Wallet x={420} y={660} color={P.food} label="本人" s={0.8} />
            <CoinTrail pts={[[480, 620], [760, 520], counter]} at={s(3)} n={3} dur={36} gap={8} r={16} stay />
            <text x={960} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
              7 : 3
            </text>
            <text x={960} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.inkSoft}>
              働く世代は原則3割負担
            </text>
          </g>
          {/* 国の鍵 */}
          <g opacity={fade(f, s(4))} transform="translate(1300 800)">
            <rect x={-200} y={-50} width={400} height={100} rx={14} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
            <text x={30} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
              薬価・調剤報酬
            </text>
            <Lock x={-150} y={-10} o={fade(f, s(5))} s={0.6} />
          </g>
        </Cam>
      </Stage>
      <Sfx at={s(2) + 20} name="coin" volume={0.4} />
      <Sfx at={s(5)} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* CUT 025 — [GRAPH / LEVEL 2] D24: 調剤医療費 8兆4008億円の円グラフでドラッグストアの 18.4% / +8.4% vs +1.6% / アオキ 66.1%・ウエルシア 2282店・22% */
const D24 = mk(({ f, s }) => {
  const k = ease(f, s(3), s(3) + 40) * 0.184;
  const a = k * Math.PI * 2;
  const R0 = 200;
  const cx = 520;
  const cy = 460;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(2))}>
          <circle cx={cx} cy={cy} r={R0} fill="#E8EBF0" />
          {k > 0 && <path d={`M ${cx} ${cy} L ${cx} ${cy - R0} A ${R0} ${R0} 0 0 1 ${cx + R0 * Math.sin(a)} ${cy - R0 * Math.cos(a)} Z`} fill={P.rx} />}
          <text x={cx} y={cy + R0 + 56} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            全国の調剤医療費 8兆4,008億円
          </text>
          <text x={cx + 150} y={cy - 150} fontFamily={FONT} fontWeight={900} fontSize={56} fill={P.rx} opacity={fade(f, s(3) + 30)}>
            18.4%
          </text>
        </g>
        <g opacity={fade(f, s(0))} transform="translate(1000 200)">
          <text fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            ドラッグストアの調剤（2024年度）
          </text>
          <text y={90} fontFamily={FONT} fontWeight={900} fontSize={80} fill={P.rx}>
            1兆5,205億円
          </text>
        </g>
        <g opacity={fade(f, s(1))} transform="translate(1000 330)">
          <HBar x={220} y={0} w={500} v={8.4 / 9} color={P.rx} label="ドラッグ" value="+8.4%" h={60} />
          <HBar x={220} y={90} w={500} v={1.6 / 9} color="#9FB3C8" label="全国" value="+1.6%" h={60} o={fade(f, s(2))} />
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1000 610)">
          <text fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            アオキ 調剤併設 66.1%
          </text>
          <text y={70} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink} opacity={fade(f, s(5))}>
            ウエルシア 2,282店・売上の22%
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#03" source="日本チェーンドラッグストア協会・厚生労働省 / 各社 決算" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 026 — [CLUE / LEVEL 3] D25 */
const D25 = mk(({ s }) => <MedBag no="01" at={s(0) + 8} />, { bg: "paper", noSub: true });

/* CUT 027 — [SIMULATION / LEVEL 3] D26: 処方箋のカレンダー → 調剤 → 待つ間に売り場を一回り → 卵・牛乳 → 出口 … 何度も回る */
const LOOP_PATH: [number, number][] = [PATH[0], PATH[1], [960, 330], [960, 230], [1220, 330], [1220, 470], [960, 470], [700, 520], [700, 650], [960, 700], [960, 800]];
const D26 = mk(({ f, s }) => {
  const t = ((f - s(1)) % 200) / 200;
  return (
    <>
      <Stage>
        <g transform="translate(240 90) scale(0.75)">
          <StorePlan />
          {f > s(1) && <Shopper t={t} pts={LOOP_PATH} r={22} />}
          {f > s(1) && t > 0.2 && t < 0.3 && <Coin8 x={960} y={200} r={20} />}
          {f > s(3) && t > 0.62 && t < 0.8 && <Coin8 x={700} y={600} r={20} />}
        </g>
        <g opacity={fade(f, s(0))} transform="translate(1480 240)">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${i * 120})`}>
              <rect x={-150} y={-44} width={300} height={88} rx={12} fill="#FFFFFF" stroke={P.rx} strokeWidth={4} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.rx}>
                {`処方箋 ${i + 1}回目`}
              </text>
            </g>
          ))}
        </g>
      </Stage>
    </>
  );
}, { bg: "white" });

export const MID9 = { D14, D15, D16, D17, D18, D19, D20, D20B, D21, D22, D23, D24, D25, D26 };
export { Milk, Lines, R, count, pop, Egg, Basket };
