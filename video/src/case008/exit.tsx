/** J30–J43: QUESTION 5 → ① 減らす ② 組む ③ 値段を動かす（本数を守る）④ 100円自販機 → 人の費用 → QUESTION 6 → これから → MONEY FLOW → FINAL CLUE → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, count, mk } from "../case002/ui";
import { Badge, FArrow, FNode, Head, Timeline6 } from "../case006/kit";
import { CanClue, Doc, Easing, FONT, K, Led, Machine, Mini, SERIF, Sfx, Street, Truck, V, Walker, ease, fade, pop } from "./kit";

/* 4 つの出口（見出しの共通部品） */
const ROUTES = ["減らす", "組む", "値段を動かす", "逆のモデル"];
const Routes: React.FC<{ f: number; active: number; at: number }> = ({ f, active, at }) => (
  <g opacity={fade(f, at)}>
    {ROUTES.map((r, i) => (
      <g key={r} transform={`translate(${330 + i * 420} 130)`}>
        <rect x={-190} y={-44} width={380} height={88} rx={44} fill={i === active ? V.band : "#FFFFFF"} stroke={i === active ? V.band : "#C9D1DB"} strokeWidth={4} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={i === active ? "#FFFFFF" : K.inkSoft}>
          {`${"①②③④"[i]} ${r}`}
        </text>
      </g>
    ))}
  </g>
);

/* J30 DARK: QUESTION 5 → 4 つの出口 */
const J30 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(1))}>
        {ROUTES.map((r, i) => (
          <g key={r} transform={`translate(${330 + i * 420} 700) scale(${pop(f, s(1) + i * 8)})`}>
            <rect x={-180} y={-60} width={360} height={120} rx={20} fill="rgba(31,122,140,0.25)" stroke={V.band} strokeWidth={5} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#F4EEE3">
              {`${"①②③④"[i]} ${r}`}
            </text>
          </g>
        ))}
      </g>
    </Stage>
    <Lines dark y={-200} lines={[{ t: <>悪循環から、<R>どう抜け出す</R>？</>, at: s(0), size: 96 }]} />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J31 ① 減らす: 売れない自販機が抜け、残った 1 台のゲージが上がる / ダイドー 2万台 */
const J31 = mk(({ f, s }) => {
  const rm = ease(f, s(1), s(1) + 30);
  const up = ease(f, s(2), s(2) + 30);
  const weak = [1, 3, 4, 6];
  return (
    <>
      <Stage>
        <Routes f={f} active={0} at={s(0)} />
        {Array.from({ length: 8 }, (_, i) => {
          const isWeak = weak.includes(i);
          return (
            <g key={i} opacity={isWeak ? 1 - rm : 1} transform={`translate(0 ${isWeak ? 60 * rm : 0})`}>
              <Mini x={250 + i * 200} y={640} s={1.1} />
              <rect x={210 + i * 200} y={680} width={80} height={24} rx={6} fill="#E8EBF0" />
              <rect x={210 + i * 200} y={680} width={isWeak ? 20 : 40 + 40 * up} height={24} rx={6} fill={isWeak ? V.red : V.green} />
            </g>
          );
        })}
        <text x={960} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft} opacity={fade(f, s(2))}>
          バー＝1台が売る本数（イメージ）
        </text>
        <Badge x={960} y={330} text="1台の本数 ↑ → 1本の費用 ↓" at={s(2)} size={44} fill={V.green} />
        <Badge x={960} y={450} text="ダイドー 約2万台の撤去" at={s(3)} size={38} fill={K.ink} />
      </Stage>
      <EvidenceMark no="#11" source="報道" at={s(3)} />
    </>
  );
}, { bg: "white" });

/* J32 ② 組む: 2 台の補充トラックが 1 本の道に / ダイドー×アサヒ飲料・伊藤園×キリン */
const J32 = mk(({ f, s }) => {
  const merge = ease(f, s(1), s(1) + 40);
  const t = (f % 180) / 180;
  return (
    <>
      <Stage>
        <Routes f={f} active={1} at={s(0)} />
        <path d="M 160 420 C 600 420 700 560 960 560 L 1760 560" stroke="#C9D1DB" strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d="M 160 700 C 600 700 700 560 960 560" stroke="#C9D1DB" strokeWidth={30} fill="none" strokeLinecap="round" />
        <Truck x={300 + 600 * merge} y={440 + 130 * merge} s={0.7} color={V.band} />
        <Truck x={300 + 800 * merge + 400 * t * merge} y={720 - 150 * merge} s={0.7} color="#C98A2B" />
        <g opacity={fade(f, s(2))}>
          <rect x={1100} y={640} width={680} height={100} rx={20} fill="#FFFFFF" stroke={V.band} strokeWidth={4} />
          <text x={1440} y={690} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
            ダイドー × アサヒ飲料：共同運営（2023年）
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <rect x={1100} y={760} width={680} height={90} rx={20} fill="#FFFFFF" stroke="#C98A2B" strokeWidth={4} />
          <text x={1440} y={805} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            伊藤園 × キリン：点検・修理で協力
          </text>
        </g>
        <Badge x={1300} y={300} text="1台ごとの費用を分け合う" at={s(4)} size={40} fill={K.ink} />
      </Stage>
      <EvidenceMark no="#17" source="報道（日本経済新聞・東洋経済）" at={s(2)} />
    </>
  );
}, { bg: "paper" });

/* J33 ③ 値段を動かす: 昼 200 / 夜 190（イメージ）/ CCBJ 2023年5月〜 */
const J33 = mk(({ f, s }) => {
  const night = ease(f, s(2), s(2) + 20);
  return (
    <>
      <Stage>
        <Routes f={f} active={2} at={s(0)} />
        <rect x={140} y={230} width={900} height={620} rx={24} fill={night > 0.5 ? V.night : "#DCEBF7"} />
        <circle cx={900} cy={330} r={50} fill={night > 0.5 ? "#F4EEE3" : "#FFD66E"} />
        <Machine x={480} y={840} s={0.8} lit={1} led={night > 0.5 ? "190" : "200"} />
        <text x={900} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={night > 0.5 ? "#F4EEE3" : K.ink}>
          {night > 0.5 ? "夜 −10円" : "昼"}
        </text>
        <g opacity={fade(f, s(1))}>
          <text x={1440} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            コカ･コーラ ボトラーズジャパン
          </text>
          <text x={1440} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink}>
            2023年5月〜
          </text>
          <text x={1440} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.ink}>
            通信でつながった自販機で
          </text>
          <text x={1440} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.ink}>
            時間帯などで値段を変える
          </text>
        </g>
        <text x={1440} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft} opacity={fade(f, s(2))}>
          ※夜 −10円は報道・画面の値段はイメージ
        </text>
        <Badge x={1440} y={740} text="自販機のダイナミックプライシング" at={s(3)} size={34} fill={V.band} />
      </Stage>
      <EvidenceMark no="#18" source="報道（日本経済新聞・時事通信）" at={s(1)} />
      <Sfx at={s(2) + 10} name="tok" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* J33B EVIDENCE: CCBJ 事業利益 245億円（2倍）/ 2026年1〜3月 自販機数量 前年並み / AI 品揃え・公式アプリ */
const J33B = mk(({ f, s }) => (
  <>
    <Stage>
      <Doc
        x={120}
        y={180}
        w={940}
        title="コカ･コーラ ボトラーズジャパン"
        rows={[
          { k: "事業利益（2025年12月期）", v: "245億円", at: s(1) + 10, color: V.green, big: true },
          { k: "前の期と比べて", v: "約2倍", at: s(1) + 40 },
          { k: "自販機の販売数量（2026年1〜3月）", v: "前年並み", at: s(2) + 10 },
        ]}
      />
      <g opacity={fade(f, s(3))}>
        {[0, 1, 2].map((i) => (
          <Machine key={i} x={1250 + i * 230} y={800} s={0.42} prices={i === 0 ? undefined : Array(12).fill(i === 1 ? "180" : "200")} />
        ))}
        <text x={1480} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
          AIで 1台ごとに品ぞろえ
        </text>
        <text x={1480} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
          ＋ 公式アプリでポイント
        </text>
      </g>
      <Badge x={960} y={840} text="1台ごとに、売れる本数を守る" at={s(4)} size={38} fill={K.ink} />
    </Stage>
    <EvidenceMark no="#15" source="CCBJH 決算（日本経済新聞・食品新聞）" at={s(1)} />
    <Sfx at={s(1) + 10} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* J34 ④ 逆のモデル: 路地の 100円自販機 / 4 つの理由 / 出会える割合 1%未満（報道） */
const J34 = mk(({ f, s }) => {
  const tags = [
    { t: "賞味期限が近い", at: s(2) },
    { t: "いろいろなメーカー", at: s(2) + 30 },
    { t: "古い機械", at: s(3) },
    { t: "場所代が安い", at: s(3) + 30 },
  ];
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          {ROUTES.map((r, i) => (
            <text key={r} x={330 + i * 420} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={i === 3 ? "#FFD66E" : "#5E6B7D"}>
              {`${"①②③④"[i]} ${r}`}
            </text>
          ))}
        </g>
        <rect x={0} y={860} width={1920} height={220} fill={V.street} />
        <Machine x={480} y={960} s={0.85} prices={Array(12).fill("100")} led="100" o={fade(f, s(1))} />
        {tags.map((g, i) => (
          <g key={i} transform={`translate(1260 ${260 + i * 120}) scale(${pop(f, g.at)})`} opacity={fade(f, g.at)}>
            <rect x={-280} y={-44} width={560} height={88} rx={44} fill="rgba(255,214,110,0.15)" stroke="#FFD66E" strokeWidth={4} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFD66E">
              {g.t}
            </text>
          </g>
        ))}
        <text x={1260} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#F4EEE3" opacity={fade(f, s(4))}>
          値段を決めるのは 自販機の持ち主
        </text>
        <g opacity={fade(f, s(5))}>
          <rect x={940} y={800} width={640} height={60} rx={30} fill={V.red} />
          <text x={1260} y={830} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
            出会える割合 1%未満（報道）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#19" source="日本経済新聞・TOKYO MX（報道）" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* J35 GRAPH: 消費電力 −52.5%（2005→2014）/ 補充の人の手間は減らない */
const J35 = mk(({ f, s }) => {
  const base = 720;
  const e2 = ease(f, s(1) + 20, s(1) + 50) * 0.475;
  return (
    <>
      <Stage>
        <Head text="飲み物の自販機 1台の年間消費電力" at={s(1)} y={150} size={42} color={K.inkSoft} x={560} />
        <line x1={180} x2={940} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        <g opacity={fade(f, s(1))}>
          <rect x={260} y={base - 440} width={220} height={440} rx={10} fill="#9FB3C8" />
          <text x={370} y={base + 48} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            2005年
          </text>
          <rect x={620} y={base - 440 * (1 - e2 * (1 / 0.475) * 0.525)} width={220} height={440 * (1 - e2 * (1 / 0.475) * 0.525)} rx={10} fill={V.green} />
          <text x={730} y={base + 48} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            2014年
          </text>
          <text x={730} y={base - 440 * 0.475 - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={V.green} opacity={fade(f, s(1) + 40)}>
            −52.5%
          </text>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1440 200)">
          <rect x={-360} y={0} width={720} height={560} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            補充する人の手間
          </text>
          {[0, 1, 2].map((i) => (
            <Walker key={i} x={-180 + i * 180} y={330} s={1} color={V.blue} />
          ))}
          <text y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={V.red} opacity={fade(f, s(3))}>
            人手不足・高齢化
          </text>
          <text y={500} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft} opacity={fade(f, s(4))}>
            いちばん減らしにくい費用
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(2) ? "#20" : "#06"} source={f < s(2) ? "全国清涼飲料連合会" : "業界の解説"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* J36 DARK: QUESTION 6 */
const J36 = mk(({ s }) => (
  <>
    <Lines dark y={-60} lines={[{ t: <>自販機は、<R>これからどうなる</R>？</>, at: s(0), size: 96 }]} />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J37 TIMELINE: 2050年 半減も（報道）/ 食品の自販機 8万1000台 / 売上は非公表のまま */
const J37 = mk(({ f, s }) => {
  const half = ease(f, s(0) + 20, s(0) + 60);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <text x={480} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            飲み物の自販機
          </text>
          {Array.from({ length: 10 }, (_, i) => (
            <Mini key={i} x={170 + (i % 5) * 150} y={380 + Math.floor(i / 5) * 190} s={0.9} lit={i >= 10 - 5 * half ? 0.02 : 1} />
          ))}
          <text x={480} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={V.red}>
            2050年に 半分も（報道）
          </text>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1400 380)">
          <rect x={-120} y={-200} width={240} height={330} rx={14} fill="#E8F1FA" stroke="#0B1220" strokeWidth={4} />
          <rect x={-100} y={-180} width={200} height={170} rx={6} fill="#BFDDF5" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-88 + (i % 2) * 92} y={-168 + Math.floor(i / 2) * 80} width={84} height={70} rx={6} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={3} />
          ))}
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.blue}>
            冷凍
          </text>
          <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            食品の自販機（2025年）
          </text>
          <text y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={V.blue} opacity={fade(f, s(3))}>
            8万1,000台
          </text>
        </g>
        <Badge x={1400} y={800} text="1回が高い → 同じ手間で 1台の売上↑" at={s(4)} size={30} fill={K.ink} />
        <g opacity={fade(f, s(5))}>
          <rect x={160} y={740} width={680} height={100} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text x={500} y={790} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
            業界の売上：2017年から非公表
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#21" source="日本経済新聞・工業会（2次引用）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* J38 FINAL MONEY FLOW: 客 → 自販機（定価）→ 飲料会社 / 場所・補充・機械 / 悪循環 + 4 つの出口（字幕なし） */
const J38 = mk(({ f }) => {
  const st = (k: number) => fade(f, 8 + k * 22);
  return (
    <>
      <Stage>
        <FNode x={260} y={330} label="客" o={st(0)} />
        <FNode x={860} y={330} label="自販機" sub="定価" o={st(0)} color={V.band} />
        <FNode x={1560} y={330} label="飲料会社" sub="ボトラー" o={st(1)} />
        <FArrow d="M 410 330 L 710 330" o={st(0)} label="200円" lx={560} ly={290} />
        <FArrow d="M 1010 330 L 1410 330" o={st(1)} label="売上" lx={1210} ly={290} />
        <FNode x={560} y={620} label="場所の持ち主" o={st(2)} color="#C98A2B" w={330} />
        <FNode x={960} y={620} label="補充の人" o={st(2)} color={V.blue} w={300} />
        <FNode x={1360} y={620} label="機械" o={st(2)} color={V.red} w={260} />
        <FArrow d="M 860 400 L 600 550" o={st(2)} color="#C98A2B" />
        <FArrow d="M 900 400 L 950 550" o={st(2)} color={V.blue} />
        <FArrow d="M 960 400 L 1320 550" o={st(2)} color={V.red} />
        <g opacity={st(3)}>
          <rect x={360} y={740} width={1200} height={100} rx={50} fill={K.ink} />
          <text x={960} y={790} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={38} fill="#FFFFFF">
            本数↓ → 1台の売上↓ → 費用そのまま → 値上げ　｜　出口：減らす・組む・動かす・逆のモデル
          </text>
        </g>
      </Stage>
      <Sfx at={8} name="whoosh" volume={0.35} />
    </>
  );
}, { bg: "white", noSub: true });

/* J39 FINAL CLUE */
const J39 = mk(({ s }) => <CanClue no="FINAL" at={s(0) + 8} />, { bg: "paper", noSub: true });

/* J40 KEY: 答え + 街の自販機の灯りがひとつ消える */
const J40 = mk(({ f, s }) => (
  <>
    <Stage>
      <Street n={9} on={f > s(2) + 20 ? 8 : 9} y={880} s={1.1} x0={200} x1={1720} />
    </Stage>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110, fontFamily: SERIF }}>
      <div style={{ fontSize: 70, fontWeight: 900, color: "#FFFFFF", opacity: fade(f, s(0)), textAlign: "center", lineHeight: 1.4, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
        答えは――1台が売る本数が減っても、
        <br />
        <span style={{ color: "#FFD66E" }}>1台を動かす費用は減らない</span>から。
      </div>
      <div style={{ fontSize: 46, fontWeight: 900, color: "#C9D6E6", marginTop: 34, textAlign: "center", lineHeight: 1.5 }}>
        <span style={{ opacity: fade(f, s(1)) }}>売れる本数が減るほど、1本にのる費用は重くなる。</span>
        <br />
        <span style={{ opacity: fade(f, s(2)) }}>その重さに耐えられない自販機から、街から消えていく。</span>
      </div>
    </AbsoluteFill>
  </>
), { bg: "night", noSub: true });

/* J41–J43: KANENAZO 固定エンディング（名前は音声で 1 回。画面はロゴ） */
const J41 = mk(
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

const J42 = mk(
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

const J43 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const EXIT8 = { J30, J31, J32, J33, J33B, J34, J35, J36, J37, J38, J39, J40, J41, J42, J43 };
