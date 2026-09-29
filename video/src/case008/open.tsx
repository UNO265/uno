/** J01–J16: 共感（駅の自販機 200円）→ 違和感（170万台消えた）→ 問い → 約束 → TITLE → 非公表 → 台数 → 原材料 → QUESTION 1 → 答え（先に）→ 1台の本数 → 割合 → コンビニ → 1台の費用 → 1台の売上 → 家計簿 → 定価 → CLUE 01 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Head } from "../case006/kit";
import { Can, CanClue, Doc, Easing, FONT, K, Led, Ledger, Lock, Machine, Mini, SERIF, Sfx, Street, Truck, V, Walker, ease, fade, pop } from "./kit";

const TITLE_Q = (
  <>
    自販機、<R>なぜ減っても値上げ？</R>
  </>
);

/* J01 OBJECT: 0 フレームから指が「200」のボタンを押す + 上に問い（BGM なし） */
const J01 = mk(
  ({ f, s }) => {
    const push = ease(f, 6, 20, 0, 1, Easing.out(Easing.cubic));
    return (
      <>
        <Stage>
          <rect x={0} y={760} width={1920} height={320} fill={V.street} />
          <Machine x={960} y={880} s={0.78} pressed={f > 18 ? 4 : -1} led={f > 18 ? "200" : "---"} />
          {/* 指（先端が「200」のボタンへ） */}
          <g transform={`translate(${1240 - 350 * push} ${600 - 36 * push})`}>
            <rect x={0} y={-22} width={220} height={44} rx={22} fill="#F2C9A8" stroke="#C9926B" strokeWidth={3} />
            <rect x={150} y={-40} width={170} height={80} rx={30} fill="#F2C9A8" stroke="#C9926B" strokeWidth={3} />
          </g>
          <g opacity={fade(f, s(1))}>
            <Led x={1520} y={420} text="200円" size={80} />
          </g>
        </Stage>
        <Lines dark y={-420} lines={[{ t: TITLE_Q, at: -10, size: 84 }]} />
        <Sfx at={18} name="tok" volume={0.5} />
      </>
    );
  },
  { bg: "night" },
);

/* J02 OBJECT: 硬貨が入り、ボトルが落ちる。「高いな…」 */
const J02 = mk(({ f, s }) => {
  const coin = ease(f, 2, 16);
  const drop = ease(f, 26, 46, 0, 1, Easing.bounce);
  return (
    <>
      <Stage>
        <rect x={0} y={760} width={1920} height={320} fill={V.street} />
        <Machine x={960} y={880} s={0.78} pressed={4} led="200" drop={drop} />
        <g opacity={1 - coin} transform={`translate(${1150 - 60 * coin} ${700 - 40 * coin})`}>
          <circle r={26} fill={V.coin} stroke="#B8902A" strokeWidth={4} />
        </g>
        <g transform={`translate(1420 360) scale(${pop(f, s(0) + 6)})`} opacity={fade(f, s(0))}>
          <path d="M -170 -80 L 170 -80 Q 200 -80 200 -50 L 200 50 Q 200 80 170 80 L -40 80 L -90 130 L -80 80 L -170 80 Q -200 80 -200 50 L -200 -50 Q -200 -80 -170 -80 Z" fill="#FFFFFF" />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={K.ink}>
            高いな…
          </text>
        </g>
      </Stage>
      <Sfx at={10} name="coin" volume={0.5} />
      <Sfx at={40} name="thud" volume={0.55} />
    </>
  );
}, { bg: "night" });

/* J03 OBJECT: 夜の街の自販機が次々に消える。560万 → 388万台 */
const J03 = mk(({ f, s }) => {
  const n = 14;
  const on = count(f, s(0) + 16, 90, n, n * 0.69);
  const num = Math.round(count(f, s(0) + 16, 90, 560, 388));
  return (
    <>
      <Stage>
        <Street n={n} on={on} y={820} s={1.15} />
        <g opacity={fade(f, s(0) + 6)}>
          <text x={960} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={160} fill="#FFFFFF">
            {num}
            <tspan fontSize={80}>万台</tspan>
          </text>
          <text x={960} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={V.led} opacity={fade(f, s(0) + 100)}>
            25年で −170万台
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(0)} dark />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={s(0) + 24 + i * 20} name="tok" volume={0.25} />
      ))}
    </>
  );
}, { bg: "night" });

/* J04 DARK: 暗がりの自販機ひとつ。「減っているのに、なぜ値上げ？」 */
const J04 = mk(({ f, s }) => (
  <>
    <Stage>
      <Machine x={960} y={1060} s={0.62} lit={0.7} led="200" o={fade(f, 0)} />
    </Stage>
    <Lines dark y={-330} lines={[{ t: <>減っているのに、<R>なぜ値上げ？</R></>, at: s(0), size: 100 }]} />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J05 DARK: 「答えは2分で」→ 881億円がかすめる */
const J05 = mk(({ f, s }) => {
  const clock = ease(f, s(0), s(0) + 30);
  return (
    <>
      <Stage>
        <g transform="translate(960 300)" opacity={fade(f, s(0)) * (1 - 0.6 * fade(f, s(1)))}>
          <circle r={150} fill="none" stroke="#F4EEE3" strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-115} stroke="#F4EEE3" strokeWidth={10} strokeLinecap="round" transform={`rotate(${clock * 360})`} />
          <text y={235} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={72} fill="#F4EEE3">
            答えは <tspan fill={V.led}>2分</tspan> で出る
          </text>
        </g>
        <text x={960} y={770} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={V.led} opacity={0.75 * fade(f, s(1) + 20)} style={{ filter: "blur(2px)" }}>
          −881億円
        </text>
      </Stage>
    </>
  );
}, { bg: "black" });

/* J06 TITLE: 自販機のボタン列の形のタイトル（LED「008」） */
const J06 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #008</div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            background: V.body,
            borderRadius: 24,
            overflow: "hidden",
            border: `6px solid ${V.band}`,
            transform: `scale(${p})`,
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <div style={{ alignSelf: "stretch", background: V.band, color: "#FFFFFF", writingMode: "vertical-rl", fontSize: 26, fontWeight: 900, letterSpacing: 8, padding: "20px 14px" }}>KANENAZO</div>
          <div style={{ padding: "36px 56px 42px", fontFamily: SERIF, fontSize: 88, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>{TITLE_Q}</div>
          <div
            style={{
              marginRight: 40,
              background: "#140808",
              color: V.led,
              fontFamily: "'DejaVu Sans Mono', monospace",
              fontSize: 60,
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: 12,
              textShadow: "0 0 10px rgba(255,74,61,0.7)",
            }}
          >
            008
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* J07 KEY: 公表されていないもの → 統計と決算で追う */
const J07 = mk(({ f, s }) => {
  const box = (x: number, title: string, sub: string, at: number) => (
    <g opacity={fade(f, at)} transform={`translate(${x} 330)`}>
      <rect x={-340} y={-150} width={680} height={300} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
      <text y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
        {title}
      </text>
      <text y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
        {sub}
      </text>
      <Lock x={-150} y={60} o={fade(f, at + 14)} />
      <text x={60} y={70} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#9AA3AF" opacity={fade(f, at + 14)}>
        非公表
      </text>
    </g>
  );
  const look = pop(f, s(2));
  return (
    <>
      <Stage>
        {box(560, "自販機全体の売上", "2017年から", s(0) + 10)}
        {box(1360, "1台の儲け", "どの会社も", s(1))}
        <g transform={`translate(960 680) scale(${look})`} opacity={Math.min(1, look * 1.4)}>
          <rect x={-440} y={-70} width={880} height={140} rx={70} fill={K.ink} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#FFFFFF">
            業界の統計 ＋ 決算 で追う
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(0)} />
      <Sfx at={s(0) + 24} name="tok" volume={0.5} />
      <Sfx at={s(1) + 14} name="tok" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* J08 GRAPH: 560万 → 388万台 / 飲料 約220万 / たばこ 約63万 → 6万5900 */
const J08 = mk(({ f, s }) => {
  const base = 720;
  const k = 0.9;
  const bar = (x: number, v: number, label: string, top: string, at: number, color: string, w = 200) => {
    const h = ease(f, at, at + 26, 0, 1, Easing.out(Easing.cubic)) * v * k;
    return (
      <g opacity={fade(f, at)}>
        <rect x={x - w / 2} y={base - h} width={w} height={h} rx={10} fill={color} />
        <text x={x} y={base - h - 24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={color === V.red ? V.red : K.ink}>
          {top}
        </text>
        <text x={x} y={base + 48} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
          {label}
        </text>
      </g>
    );
  };
  const tob = count(f, s(3) + 10, 40, 63, 6.59);
  return (
    <>
      <Stage>
        <Head text="自販機の台数" at={s(0)} y={130} size={46} color={K.inkSoft} x={620} />
        <line x1={160} x2={1080} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        {bar(340, 560, "2000年ごろ", "約560万", s(1), "#9FB3C8")}
        {bar(620, 388, "2025年末", "388万台", s(0) + 20, V.red)}
        <Badge x={480} y={250} text="約3割減" at={s(1) + 30} size={40} fill={K.ink} />
        {bar(900, 220, "うち飲み物", "約220万", s(2), V.band, 160)}
        {/* たばこ */}
        <g opacity={fade(f, s(3))} transform="translate(1480 200)">
          <rect x={-300} y={0} width={600} height={520} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
            たばこの自販機
          </text>
          <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
            ピーク 約63万台
          </text>
          <text y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.inkSoft}>
            ↓
          </text>
          <text y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={V.red}>
            {tob < 7 ? "6万5,900" : `${Math.round(tob)}万`}
            <tspan fontSize={50}>台</tspan>
          </text>
          <g transform="translate(0 470)">
            {Array.from({ length: 10 }, (_, i) => (
              <Mini key={i} x={-225 + i * 50} y={30} s={0.3} lit={i === 0 ? 1 : 0.02} />
            ))}
          </g>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会（2025年末）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* J09 DATA: 「原材料が上がった」→ 正しい / LED 180 → 200 → 220（税抜） */
const J09 = mk(({ f, s }) => {
  const price = f < s(3) + 20 ? "180" : f < s(4) + 10 ? "200" : "220";
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <rect x={200} y={180} width={640} height={130} rx={65} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          <text x={520} y={245} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.ink}>
            原材料が上がったから
          </text>
        </g>
        <g transform={`translate(520 420) scale(${pop(f, s(2))})`} opacity={fade(f, s(2))}>
          <circle r={74} fill="none" stroke={V.green} strokeWidth={14} />
          <text x={120} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={V.green}>
            正しい
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <text x={1350} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            500mlペットボトル メーカー希望小売価格
          </text>
          <Can x={1030} y={420} color="#81B29A" s={2.2} bottle />
          <Led x={1450} y={400} text={price} size={150} w={420} />
          <text x={1450} y={570} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            {price === "180" ? "〜2025年9月" : price === "200" ? "2025年10月〜" : "2026年9月出荷分〜"}
          </text>
          <text x={1450} y={625} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(5))}>
            ※いずれも税抜
          </text>
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1350 720)">
          {["180", "200", "220"].map((p, i) => (
            <g key={p}>
              <text x={-260 + i * 260} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={54} fill={i === 2 ? V.red : K.inkSoft}>
                {p}円
              </text>
              {i < 2 && (
                <text x={-130 + i * 260} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.inkSoft}>
                  →
                </text>
              )}
            </g>
          ))}
        </g>
      </Stage>
      <EvidenceMark no="#04" source="各社 価格改定の発表" at={s(3)} />
      <Sfx at={s(3) + 20} name="tok" volume={0.4} />
      <Sfx at={s(4) + 10} name="tok" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* J10 DARK: QUESTION 1。スーパーの棚 vs 自販機 */
const J10 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0)) * 0.9} stroke="#C9D6E6" strokeWidth={5} fill="none">
        <rect x={320} y={560} width={460} height={300} />
        <line x1={320} x2={780} y1={660} y2={660} />
        <line x1={320} x2={780} y1={760} y2={760} />
        <text x={550} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#C9D6E6" stroke="none">
          スーパー
        </text>
      </g>
      <Machine x={1360} y={870} s={0.44} lit={0.8} led="200" o={fade(f, s(0))} />
    </Stage>
    <Lines
      dark
      y={-300}
      lines={[
        { t: "原材料は、どこでも同じ。", at: s(0), size: 64 },
        { t: <>なぜ<R>自販機だけ</R>高く感じる？</>, at: s(1), size: 92 },
      ]}
    />
    <Sfx at={s(2)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J11 KEY: 答え（先に）。販売本数 ↓ / 費用 →（BGM なし） */
const J11 = mk(({ f, s }) => {
  const g = ease(f, s(1) + 10, s(1) + 50);
  return (
    <>
      <Stage>
        <Machine x={400} y={1040} s={0.82} led="200" />
        <g transform="translate(900 820)" opacity={fade(f, s(1) + 10)}>
          <text x={150} y={-420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.inkSoft}>
            売る本数
          </text>
          <rect x={60} y={-380 + 280 * g} width={180} height={380 - 280 * g} rx={10} fill={V.blue} />
          <text x={560} y={-420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.inkSoft}>
            動かす費用
          </text>
          <rect x={470} y={-300} width={180} height={300} rx={10} fill={V.red} />
          <line x1={0} x2={760} y1={0} y2={0} stroke={K.ink} strokeWidth={5} />
          <text x={150} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={V.blue}>
            ↓
          </text>
          <text x={560} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={V.red}>
            →
          </text>
        </g>
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 60, fontFamily: SERIF }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: K.inkSoft, opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 66, fontWeight: 900, color: K.ink, marginTop: 8, opacity: fade(f, s(1)), textAlign: "center", lineHeight: 1.35 }}>
          1台が売る<R c={V.blue}>本数は減っている</R>のに、
          <br />
          1台を動かす<R>費用は減らない</R>。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white", noSub: true });

/* J12 GRAPH: 稼働台数 247万 → 204万 / 1台 年207ケース（10年で −8%） */
const J12 = mk(({ f, s }) => {
  const base = 700;
  const b1 = ease(f, s(0) + 10, s(0) + 36) * 247 * 1.8;
  const b2 = ease(f, s(0) + 50, s(0) + 76) * 204 * 1.8;
  const boxes = Math.round(count(f, s(3), 40, 10, 9.2));
  return (
    <>
      <Stage>
        <Head text="動いている飲み物の自販機" at={s(0)} y={150} size={42} color={K.inkSoft} x={520} />
        <line x1={180} x2={860} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        <g opacity={fade(f, s(0) + 10)}>
          <rect x={250} y={base - b1} width={200} height={b1} rx={10} fill="#9FB3C8" />
          <text x={350} y={base - b1 - 24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.inkSoft}>
            247万
          </text>
          <text x={350} y={base + 48} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            2014年
          </text>
        </g>
        <g opacity={fade(f, s(0) + 50)}>
          <rect x={590} y={base - b2} width={200} height={b2} rx={10} fill={V.band} />
          <text x={690} y={base - b2 - 24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={V.band}>
            204万台
          </text>
          <text x={690} y={base + 48} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
            2024年
          </text>
        </g>
        <text x={520} y={810} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={V.red} opacity={fade(f, s(1))}>
          2025年は 195万台（報道）
        </text>
        {/* 1台あたり */}
        <g opacity={fade(f, s(2))} transform="translate(1400 180)">
          <rect x={-420} y={0} width={840} height={600} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            1台が1年に売る量（平均）
          </text>
          <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={K.ink}>
            207<tspan fontSize={60}>ケース</tspan>
          </text>
          <Mini x={-260} y={540} s={1.6} />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={-120 + (i % 5) * 90} y={330 + Math.floor(i / 5) * 90} width={76} height={76} rx={8} fill={i < boxes ? "#C9A46A" : "#EEE8DC"} stroke="#8C6E3F" strokeWidth={3} />
          ))}
          <text x={100} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={V.red} opacity={fade(f, s(3))}>
            10年で −8%
          </text>
        </g>
        <Badge x={1400} y={840} text="残った1台も、売れなくなっている" at={s(5)} size={36} fill={K.ink} />
      </Stage>
      <EvidenceMark no="#02" source="飲料総研（2024年）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* J13 GRAPH: 自販機の割合 48% → 23%（ボトル 4 本のうち自販機の色） */
const J13 = mk(({ f, s }) => {
  const share = f < s(2) ? 48 : count(f, s(2), 30, 48, 23);
  const Row: React.FC<{ y: number; v: number; label: string; at: number }> = ({ y, v, label, at }) => (
    <g opacity={fade(f, at)}>
      <text x={280} y={y} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
        {label}
      </text>
      <rect x={320} y={y - 60} width={1200} height={120} rx={14} fill="#E8EBF0" />
      <rect x={320} y={y - 60} width={1200 * (v / 100)} height={120} rx={14} fill={V.band} />
      <text x={340 + 1200 * (v / 100)} y={y} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={64} fill={V.band}>
        {Math.round(v)}%
      </text>
    </g>
  );
  return (
    <>
      <Stage>
        <Head text="清涼飲料のうち、自販機で売れた割合" at={s(0)} y={150} size={44} color={K.inkSoft} />
        <Row y={330} v={48} label="1995年" at={s(1)} />
        <Row y={530} v={f < s(2) ? 0 : share} label="2024年" at={s(2)} />
        <g opacity={fade(f, s(3))} transform="translate(960 740)">
          {[0, 1, 2, 3].map((i) => (
            <Can key={i} x={-180 + i * 120} y={0} color={i === 0 ? V.band : "#C9D1DB"} s={1.1} bottle />
          ))}
          <text x={320} y={10} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            4本に1本を切る
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#03" source="日本経済新聞（業界統計）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* J13B MAP: 夜の地図にコンビニの灯りが広がり、人が自販機の前を通り過ぎる */
const J13B = mk(({ f, s }) => {
  const spread = ease(f, s(1), s(1) + 60);
  const pts = Array.from({ length: 40 }, (_, i) => [200 + ((i * 373) % 1520), 160 + ((i * 211) % 520)]);
  const walk = ease(f, s(2), s(2) + 90);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))} stroke="#2E3C57" strokeWidth={10}>
          {[260, 460, 660].map((y) => (
            <line key={y} x1={80} x2={1840} y1={y} y2={y} />
          ))}
          {[300, 700, 1100, 1500].map((x) => (
            <line key={x} x1={x} x2={x} y1={100} y2={740} />
          ))}
        </g>
        {pts.map(([x, y], i) => (
          <g key={i} opacity={i / pts.length < spread ? 1 : 0}>
            <circle cx={x} cy={y} r={30} fill="#FFE08A" opacity={0.18} />
            <rect x={x - 16} y={y - 12} width={32} height={24} rx={4} fill="#FFE08A" />
          </g>
        ))}
        <g opacity={fade(f, s(1))}>
          <rect x={620} y={300} width={680} height={170} rx={20} fill="rgba(13,22,40,0.85)" />
          <text x={960} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C9D6E6">
            全国のコンビニ（2025年）
          </text>
          <text x={960} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#FFE08A">
            約5万6,000店
          </text>
        </g>
        <rect x={0} y={760} width={1920} height={320} fill={V.street} />
        <Mini x={960} y={860} s={0.9} />
        <Walker x={200 + 1500 * walk} y={860} s={0.8} o={fade(f, s(2))} />
      </Stage>
      <EvidenceMark no="#05" source="日本フランチャイズチェーン協会" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* J13C OBJECT（S10 ① 買う人）: よいところ（時間を気にせず・手間がかからない・店に行かなくていい）＝便利さの値段 / 「店より高いのであまり買わない」 */
const J13C = mk(({ f, s }) => {
  const good = ["時間を気にせず買える", "手間がかからない", "お店に行かなくていい"];
  return (
    <>
      <Stage>
        <Machine x={400} y={840} s={0.7} led={f > s(5) ? "---" : "200"} lit={1 - 0.6 * ease(f, s(5), s(5) + 40)} />
        <text x={1200} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft} opacity={fade(f, s(1))}>
          自販機のよいところ（クロス・マーケティング 2022年）
        </text>
        {good.map((r, i) => (
          <g key={r} transform={`translate(1200 ${250 + i * 110}) scale(${pop(f, s(1) + 20 + i * 18)})`} opacity={fade(f, s(1) + 20 + i * 18)}>
            <rect x={-320} y={-44} width={640} height={88} rx={44} fill="#FFFFFF" stroke={V.band} strokeWidth={5} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
              {r}
            </text>
          </g>
        ))}
        <text x={1200} y={620} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={46} fill={V.band} opacity={fade(f, s(2))}>
          200円 ＝ 飲み物 ＋「今ここで買える」
        </text>
        <g transform={`translate(1200 720) scale(${pop(f, s(3))})`} opacity={fade(f, s(3))}>
          <rect x={-420} y={-44} width={840} height={88} rx={44} fill="#FFFFFF" stroke={V.red} strokeWidth={5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={V.red}>
            「お店より高いので、あまり買わない」
          </text>
        </g>
        </Stage>
      <EvidenceMark no="#22" source="クロス・マーケティング「自動販売機に関する調査」（2022年）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* J14 BLUEPRINT: 1台ごとの費用。補充（1日20〜30台・1人150台）/ 場所代（売上の2〜3割）/ 機械・点検・修理 */
const J14 = mk(({ f, s }) => {
  const block = (y: number, label: string, sub: string, at: number, color: string) => (
    <g opacity={fade(f, at)} transform={`translate(${1060 + 40 * (1 - ease(f, at, at + 14))} ${y})`}>
      <rect x={0} y={-70} width={720} height={140} rx={16} fill="rgba(16,41,74,0.9)" stroke={color} strokeWidth={5} />
      <text x={36} y={-14} fontFamily={FONT} fontWeight={900} fontSize={48} fill="#FFFFFF">
        {label}
      </text>
      <text x={36} y={38} fontFamily={FONT} fontWeight={800} fontSize={28} fill="#BFE3FF">
        {sub}
      </text>
    </g>
  );
  const drive = (f % 150) / 150;
  return (
    <>
      <Stage>
        <g stroke="#8FD3FF" strokeWidth={4} fill="none" opacity={fade(f, s(0))}>
          <rect x={260} y={180} width={380} height={640} rx={16} />
          <rect x={290} y={220} width={320} height={290} rx={6} />
          <rect x={290} y={540} width={320} height={120} rx={6} />
          <rect x={310} y={700} width={280} height={70} rx={8} />
          <text x={450} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#8FD3FF" stroke="none">
            自販機 1台
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <path d="M 120 820 C 400 780 700 840 1000 800" stroke="#8FD3FF" strokeWidth={4} strokeDasharray="14 10" fill="none" />
          <Truck x={120 + 820 * drive} y={835} s={0.6} color="#3C8DBC" />
        </g>
        {block(260, "補充", "1日20〜30台を回る・1人で150台ほど（という）", s(1), "#8FD3FF")}
        {block(480, "場所代", "売上の2〜3割ほど（と言われる）", s(3), "#FFD66E")}
        {block(700, "機械・点検・修理", "機械そのものの費用", s(5), "#E0564E")}
      </Stage>
      <EvidenceMark no={f < s(3) ? "#06" : "#07"} source="業界の解説" at={s(1)} dark />
    </>
  );
}, { bg: "blueprint" });

/* J14B MONEY FLOW ①: 4万台・96億3900万円 → 1台 年約24万円・1日約660円（計算）/ ダイドー 2021年 1日約930円 */
const J14B = mk(({ f, s }) => {
  const perDay = Math.round(count(f, s(4), 30, 0, 660));
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(2))}>
          <Doc
            x={120}
            y={150}
            w={760}
            title="ポッカサッポロ 自販機事業"
            rows={[
              { k: "台数", v: "約4万台", at: s(2) + 10 },
              { k: "売上（2025年12月期）", v: "96億3,900万円", at: s(2) + 40 },
            ]}
          />
        </g>
        <g opacity={fade(f, s(3))}>
          <text x={500} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
            96億3,900万円 ÷ 4万台
          </text>
          <text x={500} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={V.band}>
            1台 年 約24万円
          </text>
          <text x={500} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft}>
            ※売上÷台数の単純計算
          </text>
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1400 160)">
          <rect x={-380} y={0} width={760} height={420} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <Mini x={-250} y={330} s={1.6} />
          <text x={80} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={K.inkSoft}>
            1日あたり
          </text>
          <text x={80} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={V.red}>
            {perDay}
            <tspan fontSize={60}>円</tspan>
          </text>
          <text x={80} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft}>
            ※計算
          </text>
        </g>
        <g opacity={fade(f, s(5))} transform="translate(1400 640)">
          <rect x={-380} y={-60} width={760} height={130} rx={20} fill="#F2F4F7" />
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            ダイドー（2021年の数字）
          </text>
          <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
            1台 1日 約930円
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(5) ? "#08" : "#09"} source={f < s(5) ? "ポッカサッポロ 発表（2026年3月）" : "ITmedia（2021年）"} at={s(2)} />
      <Sfx at={s(2) + 10} name="paper" volume={0.45} />
      <Sfx at={s(4)} name="coin" volume={0.45} />
    </>
  );
}, { bg: "white" });

/* J14C MONEY FLOW ①: 1日数百円 → 場所の持ち主 / 補充の人件費 / 原価 / 機械（イメージ）・新品70万〜150万円・耐用年数5年 */
const J14C = mk(({ f, s }) => (
  <>
    <Stage>
      <Ledger
        x={200}
        y={260}
        w={1520}
        h={150}
        total="1日の売上（数百円）の行き先"
        note="※割合はイメージ"
        parts={[
          { label: "場所の持ち主", w: 0.25, at: s(0) + 30, color: "#C98A2B" },
          { label: "補充の人件費", w: 0.25, at: s(0) + 60, color: V.blue },
          { label: "飲み物の原価", w: 0.3, at: s(0) + 90, color: "#7A8699" },
          { label: "機械", w: 0.2, at: s(0) + 120, color: V.red },
        ]}
      />
      <g opacity={fade(f, s(1))}>
        <Machine x={480} y={850} s={0.46} led="---" />
        <text x={1100} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
          自販機の新品（と言われる）
        </text>
        <text x={1100} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={K.ink}>
          70万〜150万円
        </text>
      </g>
      <Badge x={1100} y={820} text="売れない1台ほど 重い" at={s(2)} size={38} fill={V.red} />
    </Stage>
    <EvidenceMark no="#10" source="業界の解説" at={s(1)} />
  </>
), { bg: "white" });

/* J15 FLAT: 費用はそのまま、本数が減ると 1本の重さが増える / 特売なし・定価 */
const J15 = mk(({ f, s }) => {
  const n = Math.round(count(f, s(1), 40, 8, 4));
  return (
    <>
      <Stage>
        <g transform="translate(560 720)">
          <rect x={-300} y={-120} width={600} height={120} rx={14} fill={V.red} opacity={fade(f, s(0))} />
          <text y={-60} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#FFFFFF" opacity={fade(f, s(0))}>
            1台の費用（ほぼ同じ）
          </text>
          {Array.from({ length: n }, (_, i) => (
            <Can key={i} x={-260 + (i * 520) / Math.max(1, n - 1)} y={-200} color="#81B29A" s={1.1} bottle />
          ))}
          <text y={-330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink} opacity={fade(f, s(1))}>
            {n}本で割る → 1本が重くなる
          </text>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(1420 440)">
          <rect x={-300} y={-220} width={600} height={440} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.inkSoft}>
            <tspan textDecoration="line-through">特売</tspan>
          </text>
          <line x1={-90} x2={90} y1={-146} y2={-146} stroke={V.red} strokeWidth={8} />
          <Led x={0} y={0} text="定価" size={90} w={300} o={fade(f, s(3))} />
          <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={V.red} opacity={fade(f, s(4))}>
            値上げがそのまま出る
          </text>
        </g>
      </Stage>
    </>
  );
}, { bg: "paper" });

/* J16 CLUE 01 */
const J16 = mk(({ s }) => <CanClue no="01" at={s(0) + 8} />, { bg: "paper", noSub: true });

export const OPEN8 = { J01, J02, J03, J04, J05, J06, J07, J08, J09, J10, J11, J12, J13, J13B, J13C, J14, J14B, J14C, J15, J16 };
