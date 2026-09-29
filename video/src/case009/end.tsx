/** CUT 028–039（D27–D39）。これから → 統合 → 備蓄米 → 消える地元スーパー → スーパーの反撃 → 三つ目の財布の限界 → 買う側（最初のカゴへ戻る）→ MONEY FLOW → FINAL → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, count, mk } from "../case002/ui";
import { Cam, Coin8, CoinTrail, Person8 } from "../case008/kit2";
import { Basket, Easing, FONT, Front, HBar, InsCard, K, MedBag, MedBox, P, SERIF, Sfx, StorePlan, Wallet, ease, fade, pop } from "./kit";

/* CUT 028 — [QUESTION / LEVEL 2] D27: 暗い平面図が引いていく */
const D27 = mk(({ f }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: 90, s: 0.8, y: 480 }]}>
        <StorePlan dark />
      </Cam>
    </Stage>
    <Sfx at={4} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 029 — [INFOGRAPHIC / LEVEL 3] D28: 「ウエルシア」「ツルハ」の二つのブロックが一つに → 仕入れのトラックが太くなり、食品の値札が下がる */
const D28 = mk(({ f, s }) => {
  const m = ease(f, s(1), s(1) + 30, 0, 1, Easing.inOut(Easing.cubic));
  const down = ease(f, s(4), s(4) + 40);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, y: 480 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(1))}>
            <rect x={560 + 20 * m} y={220} width={380} height={200} rx={20} fill={P.beauty} />
            <text x={750 + 20 * m} y={320} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#FFFFFF">
              ウエルシア
            </text>
            <rect x={980 - 20 * m} y={220} width={380} height={200} rx={20} fill={P.rx} />
            <text x={1170 - 20 * m} y={320} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#FFFFFF">
              ツルハ
            </text>
            <rect x={560} y={210} width={800} height={220} rx={26} fill="none" stroke={K.ink} strokeWidth={6} opacity={m} />
          </g>
          <g opacity={fade(f, s(2))}>
            <text x={960} y={530} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
              2兆3,124億円
            </text>
            <text x={960} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.inkSoft}>
              5,659店
            </text>
          </g>
          <text x={960} y={670} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={P.beauty} opacity={fade(f, s(3))}>
            世界6位（報道）
          </text>
          <g opacity={fade(f, s(4))}>
            <rect x={300} y={740} width={440} height={60 + 30 * down} rx={10} fill="#5E6B7D" />
            <text x={520} y={775 + 15 * down} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF">
              仕入れ
            </text>
            <g transform={`translate(1400 ${760 + 30 * down})`}>
              <rect x={-90} y={-40} width={180} height={80} rx={10} fill="#FFFFFF" stroke={P.food} strokeWidth={5} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={P.food}>
                食品 ¥↓
              </text>
            </g>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#09" source="イオン・ツルハ・ウエルシア 統合説明資料" at={s(1)} />
      <Sfx at={s(1) + 30} name="thud" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* CUT 030 — [REAL(再現) / LEVEL 2] D29: 5kg の米袋が積み上がる（1袋 = 10万袋、イメージ）/ 2万トン・400万袋・約2,000円 */
const RiceBag: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -40 -50 Q 0 -64 40 -50 L 46 50 Q 0 60 -46 50 Z" fill="#F4EEE3" stroke="#B8A27A" strokeWidth={3} />
    <text y={6} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#8C6E3F">
      米
    </text>
  </g>
);
const D29 = mk(({ f, s }) => {
  const n = Math.round(40 * ease(f, s(2), s(3) + 30));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 700, y: 600 }, { at: s(3) + 30, s: 1, x: 960, y: 540 }]}>
          {Array.from({ length: 40 }, (_, i) => (
            <RiceBag key={i} x={260 + (i % 10) * 100} y={800 - Math.floor(i / 10) * 110} s={0.9} o={i < n ? 1 : 0.08} />
          ))}
        </Cam>
        <g opacity={fade(f, s(2))} transform="translate(1520 330)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.ink}>
            2万トン
          </text>
          <text y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft} opacity={fade(f, s(3))}>
            5kg × 400万袋
          </text>
          <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={P.food} opacity={fade(f, s(3) + 20)}>
            1袋 約2,000円
          </text>
          <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={K.inkSoft}>
            ※袋1つ = 10万袋（イメージ）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#10" source="コスモス薬品 発表（2025年6月）" at={s(2)} />
    </>
  );
}, { bg: "paper" });

/* CUT 031 — [REAL(再現) / LEVEL 3] D30: 地元スーパーの灯りが消え、隣でドラッグストアの灯りがつく / 358件 */
const D30 = mk(({ f, s }) => {
  const off = ease(f, s(1), s(2) + 20);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.2, x: 500, y: 600 }, { at: s(3), s: 1, x: 960, y: 560 }]}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F1622" />
          <rect x={0} y={760} width={1920} height={320} fill="#1B2433" />
          {[0, 1, 2].map((i) => (
            <Front key={i} x={300 + i * 520} y={760} s={0.55} kind="super" lit={off > (i + 1) * 0.3 ? 0 : 1} />
          ))}
          <Front x={1700} y={760} s={0.45} kind="suburb" lit={1} />
        </Cam>
        <g opacity={fade(f, s(1))}>
          <text x={960} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={P.red}>
            358件
          </text>
          <text x={960} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#C9D6E6">
            飲食料品小売の倒産（2025年度）・4年連続増
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#11" source="帝国データバンク" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 032 — [INFOGRAPHIC / LEVEL 1] D30B: スーパーの建物に調剤の十字、ドラッグストアの隣にスーパー（報道、カメラ固定） */
const D30B = mk(({ f, s }) => (
  <>
    <Stage>
      <rect x={0} y={700} width={1920} height={380} fill="#DDE4EC" />
      <Front x={700} y={700} s={0.8} kind="super" o={fade(f, s(0))} />
      <g opacity={fade(f, s(1))} transform="translate(860 360)">
        <circle r={56} fill="#FFFFFF" stroke={P.rx} strokeWidth={6} />
        <rect x={-10} y={-36} width={20} height={72} fill={P.rx} />
        <rect x={-36} y={-10} width={72} height={20} fill={P.rx} />
      </g>
      <Front x={1300} y={700} s={0.6} kind="suburb" o={fade(f, s(1) + 20)} />
    </Stage>
    <EvidenceMark no="#26" source="ダイヤモンド・チェーンストア（報道）" at={s(1)} />
  </>
), { bg: "white" });

/* CUT 033 — [GRAPH / LEVEL 2] D31: 調剤報酬のメーターは +0.08% でほぼ動かない / 店の棒 2万3,723 → 3万5,000（目標）とコンビニ約5万6,000 / 夜の店の灯りが一部消える */
const D31 = mk(({ f, s }) => {
  const needle = -80 + 2 * ease(f, s(1), s(1) + 30);
  const b = ease(f, s(4), s(5) + 30);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0)) * (1 - fade(f, s(4)))} transform="translate(960 560)">
          <path d="M -300 0 A 300 300 0 0 1 300 0" fill="none" stroke="#E8EBF0" strokeWidth={50} />
          <path d="M -300 0 A 300 300 0 0 1 -290 -77" fill="none" stroke={P.rx} strokeWidth={50} />
          <line x1={0} y1={0} x2={0} y2={-260} stroke={K.ink} strokeWidth={12} strokeLinecap="round" transform={`rotate(${needle})`} />
          <circle r={20} fill={K.ink} />
          <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={P.rx}>
            +0.08%
          </text>
          <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            2026年度 調剤報酬の改定
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <HBar x={560} y={260} w={900} v={23723 / 56000 * b} color={P.beauty} label="いま" value={b > 0.9 ? "2万3,723店" : ""} />
          <HBar x={560} y={400} w={900} v={35000 / 56000 * b} color={P.beauty} label="2030年目標" value={b > 0.9 ? "3万5,000店" : ""} />
          <HBar x={560} y={540} w={900} v={b} color="#9FB3C8" label="コンビニ" value={b > 0.9 ? "約5万6,000店" : ""} o={fade(f, s(5))} />
        </g>
        <g opacity={fade(f, s(7))} transform="translate(960 760)">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={-330 + i * 110} y={-40} width={90} height={80} rx={8} fill={i % 3 === 1 ? "#39465A" : "#FFE9B0"} />
          ))}
        </g>
      </Stage>
      <EvidenceMark no={f < s(4) ? "#12" : f < s(7) ? "#04" : "#25"} source={f < s(4) ? "調剤報酬改定（2026年度）" : f < s(7) ? "日本チェーンドラッグストア協会・JFA" : "ウエルシアHD"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 034 — [QUESTION / LEVEL 1] D32 */
const D32 = mk(({ s }) => (
  <>
    <Lines dark y={-60} lines={[{ t: <>買う側は、<R>どう使う</R>？</>, at: s(0), size: 96 }]} />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* CUT 035 — [STORY / LEVEL 3] D33: 最初のカゴへ戻る。普段の食品はドラッグストア、生鮮を選ぶ日はスーパー / 毎月20日 ×1.5 */
const D33 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1.3, x: 960, y: 640 }, { at: s(1), s: 1, x: 960, y: 540 }]}>
        <rect x={0} y={0} width={1920} height={1080} fill="#EEF2F6" />
        <rect x={0} y={780} width={1920} height={300} fill="#DDE4EC" />
        <Basket x={560} y={700} s={0.8} items={4} />
        <g opacity={fade(f, s(1))}>
          <Front x={1360} y={780} s={0.6} kind="super" />
          <text x={1360} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            生鮮を選ぶ日
          </text>
        </g>
      </Cam>
      <g opacity={fade(f, s(3))} transform="translate(1500 200)">
        <rect x={-150} y={-100} width={300} height={200} rx={16} fill="#FFFFFF" stroke={P.beauty} strokeWidth={6} />
        <rect x={-150} y={-100} width={300} height={50} rx={16} fill={P.beauty} />
        <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
          20
        </text>
        <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={P.beauty}>
          ×1.5
        </text>
      </g>
    </Stage>
    <EvidenceMark no="#17" source="ウエルシア お客様感謝デー" at={s(3)} />
  </>
), { bg: "white" });

/* D33B: 対象の市販薬の目印マーク、1万2000円 → 上限8万8000円のゲージ / 薬剤師に相談 */
const D33B = mk(({ f, s }) => {
  const g = ease(f, s(1), s(2) + 30);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <MedBox x={500} y={420} s={3} color={P.rx} />
          <g opacity={fade(f, s(3))} transform="translate(610 330)">
            <circle r={40} fill={P.green} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#FFFFFF">
              控除
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(1))} transform="translate(1000 360)">
          <rect x={0} y={0} width={760} height={70} rx={14} fill="#E8EBF0" />
          <rect x={0} y={0} width={760 * 0.12} height={70} rx={14} fill="#9FB3C8" />
          <rect x={760 * 0.12} y={0} width={760 * 0.88 * g} height={70} rx={0} fill={P.green} />
          <text x={760 * 0.12} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.inkSoft}>
            1万2,000円
          </text>
          <text x={760} y={120} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={30} fill={P.green} opacity={fade(f, s(2))}>
            上限 8万8,000円
          </text>
          <text x={380} y={-24} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.ink}>
            セルフメディケーション税制
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <Person8 x={1300} y={820} s={1} color={P.rx} />
          <rect x={1200} y={580} width={200} height={60} rx={30} fill="#FFFFFF" stroke={P.rx} strokeWidth={4} />
          <text x={1300} y={610} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill={P.rx}>
            相談
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#22" source="厚生労働省・税制改正" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 036 — [MONEY FLOW / LEVEL 3] D34: 三つの財布 → 店 → 仕入れ・給料・家賃へ、横に循環の輪（字幕なし） */
const D34 = mk(({ f }) => {
  const st = (k: number) => fade(f, 6 + k * 20);
  const store: [number, number] = [960, 420];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.12, y: 480 }, { at: 120, s: 1, y: 540 }]}>
          <Wallet x={240} y={250} color={P.food} label="① 食品" o={st(0)} />
          <Wallet x={240} y={480} color={P.beauty} label="② ついで" o={st(0)} />
          <InsCard x={240} y={720} label="③ 調剤" o={st(1)} />
          <g opacity={st(0)}>
            <rect x={760} y={300} width={400} height={240} rx={20} fill={P.floor} stroke="#9FB3C8" strokeWidth={6} />
            <text x={960} y={420} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
              店
            </text>
          </g>
          <CoinTrail pts={[[330, 250], store]} at={10} n={30} dur={40} gap={20} r={12} loop />
          <CoinTrail pts={[[330, 480], store]} at={20} n={30} dur={40} gap={14} r={14} loop />
          <CoinTrail pts={[[340, 720], store]} at={30} n={30} dur={40} gap={14} r={14} loop />
          {["仕入れ", "給料", "家賃"].map((t, i) => (
            <g key={t} opacity={st(2)}>
              <rect x={1400} y={260 + i * 150} width={220} height={90} rx={16} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={4} />
              <text x={1510} y={305 + i * 150} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.inkSoft}>
                {t}
              </text>
              <CoinTrail pts={[[1160, 420], [1400, 305 + i * 150]]} at={60 + i * 10} n={20} dur={30} gap={26} r={10} loop />
            </g>
          ))}
          <g opacity={st(3)} transform="translate(960 790)">
            <circle r={90} fill="none" stroke={P.food} strokeWidth={10} strokeDasharray="30 16" strokeDashoffset={-f * 2} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill={P.food}>
              来店
            </text>
          </g>
        </Cam>
      </Stage>
      <Sfx at={8} name="whoosh" volume={0.35} />
    </>
  );
}, { bg: "white", noSub: true });

/* CUT 037 — [CLUE / LEVEL 3] D35 */
const D35 = mk(({ s }) => <MedBag no="FINAL" at={s(0) + 8} />, { bg: "paper", noSub: true });

/* CUT 038 — [IMPACT / LEVEL 4 HERO] D36: 最終の答え。カゴの横の三つの財布が一つの輪でつながる */
const D36 = mk(({ f, s }) => {
  const ring = ease(f, s(1), s(1) + 40);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 40, s: 1.06, y: 600 }]}>
          <Basket x={960} y={780} s={0.7} items={4} />
          {[P.food, P.beauty].map((c, i) => (
            <Wallet key={c} x={560 + i * 800} y={560} color={c} s={0.8} />
          ))}
          <InsCard x={960} y={420} s={0.8} />
          <ellipse cx={960} cy={600} rx={440} ry={220} fill="none" stroke={P.food} strokeWidth={8} strokeDasharray={`${2200 * ring} 2200`} />
        </Cam>
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, fontFamily: SERIF }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: K.ink, opacity: fade(f, s(0)), textAlign: "center", lineHeight: 1.4 }}>
          答えは――食品は、
          <br />
          <span style={{ color: P.food }}>客を何度も来させるための値段</span>だから。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1) + 20} name="ding" volume={0.35} />
    </>
  );
}, { bg: "white", noSub: true });

/* CUT 039 — [ENDING] D37–D39: 固定エンディング（名前は音声で 1 回、画面はロゴ） */
const D37 = mk(
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
const D38 = mk(
  ({ f, s }) => {
    const p = ease(f, s(0), s(0) + 16, 0, 1, Easing.out(Easing.back(1.6)));
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 100, fontFamily: FONT }}>
          <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
            <div style={{ fontSize: 170, fontWeight: 900, color: K.ink, letterSpacing: 28 }}>KANENAZO</div>
            <div style={{ display: "inline-block", marginTop: 8, background: K.red, color: K.white, fontSize: 48, fontWeight: 900, letterSpacing: 16, padding: "4px 30px", borderRadius: 12 }}>カネナゾ</div>
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: K.inkSoft, letterSpacing: 10, marginTop: 44, opacity: ease(f, s(1), s(1) + 12) }}>身近なお金の謎を解く。</div>
        </AbsoluteFill>
        <Sfx at={s(0)} name="jingle" volume={0.8} />
      </>
    );
  },
  { noSub: true },
);
const D39 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const END9 = { D27, D28, D29, D30, D30B, D31, D32, D33, D33B, D34, D35, D36, D37, D38, D39 };
export { Coin8, count, pop };
