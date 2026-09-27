/** G12–G17B: CLUE 01 → 大人は何に → 1977年の値段の壁 → フチ子 → 値段の壁を越える → QUESTION 2 → 受注生産 → MONEY FLOW ① → 在庫リスク → CLUE 02 → いきもの大図鑑 → 裏側 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Capsule, Daishi, Easing, FONT, G, Head, K, Machine, MoneyFlow6, Person6, PillBug, SERIF, Sfx, Timeline6, ease, fade, pop } from "./kit";

/* G12 CLUE 01 */
const G12 = mk(({ s }) => <Daishi no="01" at={s(0) + 16} />, { bg: "paper", noSub: true });

/* G12D FLAT: 人気のジャンル（キャラクター・推し活）→ 19歳以下 約7割 / 20歳以上 約3割 → 子どもの上に大人が上乗せ */
const G12D = mk(({ f, s }) => {
  const a = 1 - fade(f, s(3) - 10, 12);
  const b = fade(f, s(3)) * (1 - fade(f, s(5) - 10, 12));
  const c = fade(f, s(5));
  const bar = (y: number, label: string, v: number, at: number, color: string) => {
    const w = ease(f, at, at + 30, 0, 1, Easing.out(Easing.cubic)) * v * 10;
    return (
      <g opacity={fade(f, at)}>
        <text x={560} y={y} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
          {label}
        </text>
        <rect x={600} y={y - 50} width={w} height={100} rx={14} fill={color} />
        <text x={620 + w} y={y} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill={color}>
          約{v / 10}割
        </text>
      </g>
    );
  };
  const up = ease(f, s(5) + 6, s(5) + 36, 0, 1, Easing.out(Easing.cubic));
  return (
    <>
      <Stage>
        <g opacity={a}>
          <Head text="大人は、何にお金を使う？" at={s(0)} y={180} size={60} />
          <Badge x={960} y={360} text="アニメ・ゲームのキャラクター" at={s(1) + 10} size={52} />
          <g opacity={fade(f, s(2))}>
            <Badge x={960} y={540} text="推し活" at={s(2) + 40} size={64} fill="#FFFFFF" color={G.red} />
            {[0, 1, 2, 3, 4].map((i) => (
              <Capsule key={i} x={560 + i * 200} y={730} r={52} color={G.cap[i]} o={fade(f, s(2) + 50 + i * 6)} />
            ))}
          </g>
        </g>
        <g opacity={b}>
          <Head text="カプセルトイを買ったことがある" at={s(3)} y={220} size={50} color={K.inkSoft} />
          {bar(420, "19歳以下", 70, s(4) + 30, "#3E8ED0")}
          {bar(640, "20歳以上", 30, s(4) + 80, G.red)}
        </g>
        <g opacity={c}>
          {/* 子どもの層の上に大人の層 */}
          <rect x={660} y={560} width={600} height={220} rx={16} fill="#3E8ED0" />
          <text x={960} y={670} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#FFFFFF">
            子どもの遊び
          </text>
          <g transform={`translate(0 ${-300 * (1 - up)})`} opacity={up}>
            <rect x={660} y={330} width={600} height={220} rx={16} fill={G.red} />
            <text x={960} y={440} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#FFFFFF">
              ＋ 大人の買い物
            </text>
          </g>
          <g opacity={fade(f, s(6))}>
            <path d="M 1380 760 L 1380 360 M 1330 410 L 1380 360 L 1430 410" stroke={G.red} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={1380} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={G.red}>
              市場
            </text>
          </g>
        </g>
      </Stage>
      <EvidenceMark no={b > 0.5 ? "#03" : "#02"} source={b > 0.5 ? "ハピネット 調査" : "クロス・マーケティング 調査（2025年8月）"} at={s(1)} />
    </>
  );
}, { bg: "paper" });

/* G12B TIMELINE: 1965 上陸 → 1977 バンダイ参入（20円の市場に100円）→ 今 シェア約57%・年約2.2億個 */
const G12B = mk(({ f, s }) => {
  const jump = pop(f, s(3) + 10);
  const now = fade(f, s(4));
  return (
    <>
      <Stage>
        <Timeline6
          y={250}
          items={[
            { year: "1965", text: "日本に上陸", at: s(1) + 10, color: K.inkSoft },
            { year: "1977", text: "バンダイが参入", at: s(2) + 10 },
            { year: "今", text: "ガシャポン", at: s(4), color: G.red },
          ]}
        />
        {/* 20円 → 100円 */}
        <g opacity={fade(f, s(2) + 40) * (1 - now)}>
          <g transform="translate(600 600)">
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={150} fill={K.inkSoft}>
              20円
            </text>
            <text y={120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
              当時の主流
            </text>
          </g>
          <path d="M 860 600 L 1060 600 M 1010 550 L 1060 600 L 1010 650" stroke={K.ink} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={jump} />
          <g transform={`translate(1360 600) scale(${jump})`} opacity={Math.min(1, jump * 1.4)}>
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={200} fill={G.red}>
              100円
            </text>
            <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.ink}>
              質の高い商品で
            </text>
          </g>
        </g>
        <g opacity={now}>
          <g transform="translate(620 600)">
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={170} fill={G.red}>
              約57<tspan fontSize={90}>%</tspan>
            </text>
            <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
              国内カプセルトイ売上のシェア
            </text>
          </g>
          <g transform="translate(1340 600)" opacity={fade(f, s(5))}>
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={150} fill={K.ink}>
              約2.2<tspan fontSize={90}>億個</tspan>
            </text>
            <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
              1年の出荷（2024年度）
            </text>
          </g>
        </g>
      </Stage>
      <EvidenceMark no="#04" source="バンダイ / 学研 / 東洋経済" at={s(1)} />
      <Sfx at={s(3) + 10} name="stamp" volume={0.55} />
    </>
  );
}, { bg: "white" });

/* G12E OBJECT: コップのふちの小さな人形（一般形のシルエット）→ 約1週間で10万個 → 累計2000万個 → 大人の机の上 */
const G12E = mk(({ f, s }) => {
  const n = count(f, s(3) + 30, 40, 0, 10);
  const tot = count(f, s(4) + 10, 40, 0, 2000);
  const desk = fade(f, s(5));
  return (
    <>
      <Stage>
        {/* 机 */}
        <rect x={0} y={820} width={1920} height={260} fill="#3A2F24" opacity={desk} />
        <line x1={0} x2={1920} y1={820} y2={820} stroke="#6E5A45" strokeWidth={6} opacity={desk} />
        {/* コップ（線画） */}
        <g transform="translate(560 540)" opacity={fade(f, s(0))}>
          <path d="M -170 -230 L -130 270 L 130 270 L 170 -230 Z" fill="rgba(220,235,245,0.12)" stroke="#DDEBF5" strokeWidth={8} />
          <ellipse cx={0} cy={-230} rx={170} ry={26} fill="none" stroke="#DDEBF5" strokeWidth={8} />
          {/* ふちに腰かける小さな人形（顔なしの一般形） */}
          <g transform={`translate(150 -236) scale(${pop(f, s(2))})`} opacity={fade(f, s(2))}>
            <circle cx={0} cy={-104} r={26} fill="#F4F1EA" />
            <rect x={-26} y={-78} width={52} height={70} rx={14} fill="#F4F1EA" />
            <path d="M -16 -10 L 24 -4 L 44 50" stroke="#F4F1EA" strokeWidth={16} fill="none" strokeLinecap="round" />
            <path d="M 10 -10 L 46 -2 L 62 46" stroke="#F4F1EA" strokeWidth={16} fill="none" strokeLinecap="round" />
          </g>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1300} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9D6E6">
            2012年7月 奇譚クラブ
          </text>
          <text x={1300} y={340} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={76} fill="#F4EEE3">
            「コップのフチ子」
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <text x={1300} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#C9D6E6">
            最初のシリーズ・約1週間で
          </text>
          <text x={1300} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#F5B83D">
            {Math.round(n)}
            <tspan fontSize={70}>万個</tspan>
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <text x={1300} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#C9D6E6">
            シリーズ累計
          </text>
          <text x={1300} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#F4EEE3">
            {Math.round(tot).toLocaleString("ja-JP")}
            <tspan fontSize={60}>万個</tspan>
          </text>
        </g>
        <text x={960} y={120} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill="#F4EEE3" opacity={desk}>
          ガチャの居場所 ＝ 大人の机の上
        </text>
      </Stage>
      <EvidenceMark no="#05" source="新R25 / ORICON" at={s(3)} dark />
    </>
  );
}, { bg: "black" });

/* G12C KEY: 安さではなく「この値段を払ってでも欲しい」 */
const G12C = mk(({ f, s }) => (
  <>
    <Lines
      y={-120}
      lines={[
        { t: "安さではなく、", at: s(0), size: 70, color: K.inkSoft },
        { t: <>「この値段を払ってでも<R>欲しい</R>」</>, at: s(0) + 30, size: 96 },
      ]}
    />
    <Stage>
      <g opacity={fade(f, s(1))}>
        {["20円", "100円", "500円"].map((t, i) => (
          <g key={i} transform={`translate(${620 + i * 340} ${780 - i * 60})`} opacity={fade(f, s(1) + i * 12)}>
            <rect x={-130} y={-50} width={260} height={100} rx={16} fill={i === 2 ? G.red : "#FFFFFF"} stroke={K.ink} strokeWidth={4} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={54} fill={i === 2 ? "#FFFFFF" : K.ink}>
              {t}
            </text>
          </g>
        ))}
      </g>
    </Stage>
  </>
), { bg: "white" });

/* G13 DARK: 新作が次々 → バンダイだけで毎月120種類以上 → 売れ残ったら、誰が背負う？ */
const PILE = Array.from({ length: 60 }, (_, i) => ({ x: 960 + ((i * 131) % 900) - 450, y: 800 - Math.floor(i / 9) * 60 - ((i * 17) % 30), c: G.cap[i % 5], r: 36 + ((i * 11) % 10) }));
const G13 = mk(({ f, s }) => {
  const k = ease(f, s(2), s(3) + 60) * PILE.length;
  const q = fade(f, s(4));
  return (
    <>
      <Stage>
        <g opacity={1 - 0.6 * q}>
          {PILE.map((p, i) => (i < k ? <Capsule key={i} x={p.x} y={p.y - (1 - Math.min(1, k - i)) * 200} r={p.r} color={p.c} rot={(i * 53) % 360} /> : null))}
        </g>
        <g opacity={fade(f, s(1)) * (1 - q)}>
          <text x={960} y={220} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill="#F4EEE3">
            高いほど、売れ残りの損は大きい
          </text>
        </g>
        <g opacity={fade(f, s(3)) * (1 - q)}>
          <text x={960} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9D6E6">
            バンダイだけで、毎月の新商品
          </text>
          <text x={960} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#F5B83D">
            120<tspan fontSize={64}>種類以上</tspan>
          </text>
        </g>
      </Stage>
      <Lines
        dark
        y={-200}
        lines={[
          { t: "売れ残るリスクは、", at: s(4), size: 70 },
          { t: <><R>誰が</R>背負う？</>, at: s(5), size: 110 },
        ]}
      />
      <EvidenceMark no="#04" source="バンダイ" at={s(3)} dark />
      <Sfx at={s(5)} name="question" volume={0.5} />
    </>
  );
}, { bg: "black" });

/* G14 BLUEPRINT: 工場の線画に注文書が入る → 「受注生産」 */
const G14 = mk(({ f, s }) => {
  const paper = ease(f, s(1) - 10, s(1) + 20, 0, 1, Easing.out(Easing.cubic));
  const st = pop(f, s(1) + 40);
  return (
    <>
      <Stage>
        <g stroke={G.line} strokeWidth={6} fill="none" opacity={fade(f, s(0))}>
          <path d="M 900 800 L 900 460 L 1060 380 L 1060 460 L 1220 380 L 1220 460 L 1380 380 L 1380 460 L 1540 380 L 1540 800 Z" />
          <rect x={1440} y={220} width={60} height={200} />
          <rect x={980} y={560} width={120} height={100} />
          <rect x={1160} y={560} width={120} height={100} />
          <rect x={1340} y={560} width={120} height={100} />
          <line x1={760} x2={1680} y1={800} y2={800} />
        </g>
        <g transform={`translate(${380 + 380 * paper} ${520}) rotate(${-8 + 8 * paper})`} opacity={fade(f, s(0) + 10)}>
          <rect x={-140} y={-180} width={280} height={360} rx={10} fill="#FFFDF6" stroke={G.line} strokeWidth={4} />
          <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={G.navy}>
            注文書
          </text>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-100} x2={100} y1={-50 + i * 50} y2={-50 + i * 50} stroke="#B9C6D6" strokeWidth={6} />
          ))}
          <text x={60} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={G.red}>
            ×○○個
          </text>
        </g>
        <g transform={`translate(1220 250) rotate(-6) scale(${st})`} opacity={Math.min(1, st * 1.4)}>
          <rect x={-230} y={-70} width={460} height={140} rx={16} fill={G.navy} stroke="#F5B83D" strokeWidth={8} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={88} fill="#F5B83D">
            受注生産
          </text>
        </g>
      </Stage>
      <Sfx at={s(1) + 40} name="stamp" volume={0.55} />
    </>
  );
}, { bg: "blueprint" });

/* G15 MONEY FLOW ①: メーカー → 案内 → オペレーター → 約3か月前に数量 → その数だけ作る。足りなければ中止・作り足さない */
const G15 = mk(({ f, s }) => {
  const cal = Math.floor(ease(f, s(2) + 20, s(2) + 80) * 3);
  return (
    <>
      <Stage>
        <g transform="translate(-380 0)">
        <MoneyFlow6
          y={400}
          st={{
            maker: fade(f, s(0)),
            info: fade(f, s(0) + 30),
            op: fade(f, s(1) + 20),
            order: fade(f, s(2) + 10),
            goods: fade(f, s(3)),
          }}
        />
        </g>
        {/* 3か月のカレンダー */}
        <g transform="translate(1520 330)" opacity={fade(f, s(2) + 10)}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 90} 0)`} opacity={i < cal ? 1 : 0.3}>
              <rect x={-38} y={-40} width={76} height={80} rx={8} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
              <rect x={-38} y={-40} width={76} height={20} fill={G.red} />
              <text y={14} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
                {i + 1}
              </text>
            </g>
          ))}
          <text x={90} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            発売の約3か月前
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <rect x={220} y={700} width={700} height={110} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text x={570} y={755} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            注文が集まらない → 作らない
          </text>
        </g>
        <g opacity={fade(f, s(5))}>
          <rect x={1000} y={700} width={700} height={110} rx={20} fill={G.red} />
          <text x={1350} y={755} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF">
            売り切れても、作り足さない
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#06" source="業界の説明（新R25 / NEWSポストセブン）" at={s(1)} />
      <Sfx at={s(0) + 30} name="paper" volume={0.5} />
      <Sfx at={s(2) + 10} name="paper" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* G16 KEY: 天びん。「売れ残りリスク」の重りがオペレーター側に落ちる */
const G16 = mk(({ f, s }) => {
  const drop = ease(f, s(0) + 30, s(0) + 50, 0, 1, Easing.in(Easing.quad));
  const tilt = ease(f, s(0) + 50, s(0) + 66, 0, 1, Easing.out(Easing.back(2))) * -12;
  return (
    <>
      <Stage>
        <g transform="translate(0 -130)">
        <path d="M 960 560 L 900 820 L 1020 820 Z" fill={K.ink} />
        <g transform={`rotate(${tilt} 960 560)`}>
          <rect x={460} y={548} width={1000} height={24} rx={12} fill={K.ink} />
          <g transform="translate(560 560)">
            <line x1={0} x2={0} y1={0} y2={120} stroke={K.ink} strokeWidth={6} />
            <rect x={-150} y={120} width={300} height={24} rx={8} fill={K.ink} />
            <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
              オペレーター
            </text>
            <g transform={`translate(0 ${-480 * (1 - drop) + 60})`} opacity={fade(f, s(0) + 20)}>
              <path d="M -165 60 L -135 -30 L 135 -30 L 165 60 Z" fill={G.risk} />
              <text y={18} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
                売れ残りリスク
              </text>
            </g>
          </g>
          <g transform="translate(1360 560)">
            <line x1={0} x2={0} y1={0} y2={120} stroke={K.ink} strokeWidth={6} />
            <rect x={-150} y={120} width={300} height={24} rx={8} fill={K.ink} />
            <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.inkSoft}>
              メーカー
            </text>
          </g>
        </g>
        </g>
      </Stage>
      <Sfx at={s(0) + 50} name="thud" volume={0.6} />
    </>
  );
}, { bg: "white" });

/* G17 CLUE 02（最初の 2 文は台紙と同じ。以降は字幕） */
const G17 = mk(({ s }) => <Daishi no="02" at={s(1)} />, { bg: "paper", hideSubs: [0, 1] });

/* G17C OBJECT: 線画のダンゴムシが丸まる・のびる → 累計1690万個（キャラクターではない） */
const G17C = mk(({ f, s }) => {
  const curl = 0.5 + 0.5 * Math.sin(f / 22);
  const n = count(f, s(2) + 20, 40, 0, 1690);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <PillBug x={560} y={360} s={0.95} curl={curl} />
          <line x1={200} x2={920} y1={760} y2={760} stroke="#DDD6C8" strokeWidth={6} />
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1370} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            バンダイ
          </text>
          <text x={1370} y={290} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={76} fill={K.ink}>
            「いきもの大図鑑」
          </text>
          <text x={1370} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            本物そっくりに動く生き物のシリーズ
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <Badge x={1370} y={440} text="キャラクターではない" at={s(2)} size={34} fill="#FFFFFF" color={K.ink} />
          <text x={1370} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={G.red}>
            {Math.round(n).toLocaleString("ja-JP")}
            <tspan fontSize={70}>万個</tspan>
          </text>
          <text x={1370} y={665} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            累計の出荷
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <rect x={960} y={720} width={820} height={96} rx={48} fill={K.ink} />
          <text x={1370} y={768} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#FFFFFF">
            在庫を抱えにくい → 当たるか分からない企画も
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#07" source="JBpress" at={s(2)} />
    </>
  );
}, { bg: "white" });

/* G17B FLAT: 裏側。並んだ機械に SOLD OUT → ガチャ活疲れ（報道）→ メーカーは守られる / 客は出会えないかも */
const G17B = mk(({ f, s }) => {
  const split = fade(f, s(4) - 6);
  return (
    <>
      <Stage>
        <g opacity={1 - split * 0.85}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Machine
              key={i}
              x={330 + i * 315}
              y={600}
              s={0.55}
              body={G.cap[i]}
              price={`${[300, 400, 500, 500, 400][i]}円`}
              empty={ease(f, s(2) + i * 12, s(2) + 30 + i * 12)}
              soldOut={pop(f, s(1) + 10 + i * 10)}
            />
          ))}
        </g>
        <g opacity={fade(f, s(3)) * (1 - split)}>
          <Badge x={960} y={130} text="「ガチャ活疲れ」（報道）" at={s(3)} size={48} fill={K.ink} />
        </g>
        <g opacity={split}>
          <rect x={200} y={300} width={700} height={400} rx={30} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          <text x={550} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
            メーカー
          </text>
          <text x={550} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#2E8B57">
            作りすぎない
          </text>
          <rect x={1020} y={300} width={700} height={400} rx={30} fill="#FFFFFF" stroke={G.red} strokeWidth={5} />
          <text x={1370} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
            客
          </text>
          <text x={1370} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={G.red}>
            出会えないかも
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#08" source="ビジネス+IT（報道）" at={s(3)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={s(1) + 10 + i * 10} name="tok" volume={0.35} />
      ))}
    </>
  );
}, { bg: "paper" });

export const MAKER6 = { G12, G12D, G12B, G12E, G12C, G13, G14, G15, G16, G17, G17C, G17B };
export { Person6, AbsoluteFill };
