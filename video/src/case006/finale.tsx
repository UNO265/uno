/** G22–G32: MID REVEAL（×2.5）→ CLUE 03 → QUESTION 4 → 500円の先 → 海外 → FINAL MONEY FLOW（画面で）→ FINAL CLUE → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, count, mk } from "../case002/ui";
import { Badge, Capsule, Daishi, Easing, FONT, G, Head, K, Machine, MoneyFlow6, Person6, SERIF, Sfx, ease, fade, pop } from "./kit";

/* G22 DATA: 同じ場所・同じ 1 台・同じ手間 → 200円 → 500円 ＝ 1回の売上 ×2.5（イメージ） */
const G22 = mk(({ f, s }) => {
  const k = 0.8;
  const h1 = ease(f, s(3), s(3) + 24) * 200 * k;
  const h2 = ease(f, s(4) - 10, s(4) + 30, 0, 1, Easing.out(Easing.cubic)) * 500 * k;
  return (
    <>
      <Stage>
        <Machine x={480} y={560} s={0.7} price={f < s(4) - 10 ? "200円" : "500円"} />
        <g opacity={fade(f, s(1))}>
          <Badge x={480} y={120} text="同じ場所・同じ1台" at={s(1)} size={40} fill={K.ink} />
        </g>
        <g opacity={fade(f, s(2))}>
          <Badge x={480} y={200} text="補充・集金の手間も ほぼ同じ" at={s(2)} size={34} fill="#FFFFFF" color={K.ink} />
        </g>
        <line x1={1000} x2={1800} y1={800} y2={800} stroke={K.ink} strokeWidth={5} opacity={fade(f, s(3))} />
        <g opacity={fade(f, s(3))}>
          <rect x={1080} y={800 - h1} width={240} height={h1} rx={10} fill="#8FA6BF" />
          <text x={1200} y={800 - h1 - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.ink}>
            200円
          </text>
        </g>
        <g opacity={fade(f, s(4) - 10)}>
          <rect x={1460} y={800 - h2} width={240} height={h2} rx={10} fill={G.red} />
          <text x={1580} y={800 - h2 - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={G.red}>
            500円
          </text>
        </g>
        <g transform={`translate(1200 460) scale(${pop(f, s(4) + 30)})`} opacity={fade(f, s(4) + 30)}>
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={120} fill={G.red}>
            ×2.5
          </text>
        </g>
        <text x={1400} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(3))}>
          1回まわるごとの売上 ※イメージ
        </text>
      </Stage>
      <Sfx at={s(4) + 30} name="stamp" volume={0.55} />
    </>
  );
}, { bg: "white" });

/* G23 CLUE 03 */
const G23 = mk(({ s }) => <Daishi no="03" at={s(0) + 10} />, { bg: "paper", noSub: true });

/* G24 DARK: QUESTION 4 */
const G24 = mk(({ f, s }) => (
  <>
    <Stage>
      <Capsule x={960} y={760} r={110} color={G.cap[4]} rot={f * 0.6} />
    </Stage>
    <Lines
      dark
      y={-240}
      lines={[
        { t: "この形は、", at: s(0), size: 70 },
        { t: <><R>どこまで</R>続く？</>, at: s(0) + 18, size: 116 },
      ]}
    />
    <Sfx at={s(0) + 18} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* G25 DATA: これまでの上限 500円 → プレミアムガシャポン 最大2500円 / 原料の影響は小さい（報道）/ 500円未満の人も約半分 */
const G25 = mk(({ f, s }) => {
  const top = ease(f, s(1), s(1) + 40, 0, 1, Easing.out(Easing.cubic));
  const y = (v: number) => 760 - (v / 2500) * 540;
  const half = ease(f, s(3) + 20, s(3) + 60);
  return (
    <>
      <Stage>
        {/* 値段のはしご */}
        <line x1={300} x2={300} y1={760} y2={200} stroke={K.ink} strokeWidth={6} />
        {[500, 1000, 1500, 2000, 2500].map((v) => (
          <g key={v} opacity={v === 500 ? fade(f, s(0)) : fade(f, s(1) + (v / 500) * 6)}>
            <line x1={270} x2={330} y1={y(v)} y2={y(v)} stroke={K.ink} strokeWidth={5} />
            <text x={250} y={y(v)} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
              {v}円
            </text>
          </g>
        ))}
        <g opacity={fade(f, s(0))}>
          <line x1={330} x2={900} y1={y(500)} y2={y(500)} stroke={K.inkSoft} strokeWidth={4} strokeDasharray="14 10" />
          <text x={620} y={y(500) + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.inkSoft}>
            これまでの上限
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <rect x={380} y={y(500 + 2000 * top)} width={160} height={y(0) - y(500 + 2000 * top) - 0} rx={10} fill={G.red} opacity={0.85} />
          <text x={580} y={y(2500) + 10} fontFamily={FONT} fontWeight={900} fontSize={50} fill={G.red} opacity={fade(f, s(1) + 30)}>
            最大 2500円
          </text>
          <text x={580} y={y(2500) + 70} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.ink} opacity={fade(f, s(1) + 30)}>
            プレミアムガシャポン
          </text>
        </g>
        <Badge x={640} y={830} text="原料の影響は、今のところ小さい（報道）" at={s(2) + 10} size={32} fill="#FFFFFF" color={K.ink} />
        {/* 500円未満の人が約半分 */}
        <g opacity={fade(f, s(3))} transform="translate(1440 430)">
          <text y={-220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            続けてまわしても 500円未満
          </text>
          <circle r={160} fill="#E6E0D5" />
          <path d={`M 0 -160 A 160 160 0 0 1 ${160 * Math.sin(half * Math.PI)} ${-160 * Math.cos(half * Math.PI)} L 0 0 Z`} fill="#3E8ED0" />
          <text y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#3E8ED0">
            約半分
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <rect x={1060} y={760} width={760} height={90} rx={45} fill={K.ink} />
          <text x={1440} y={806} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#FFFFFF">
            誰がまわす場所なのか、を読む
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(2) ? "#16" : f < s(3) ? "#17" : "#02"} source={f < s(2) ? "バンダイ" : f < s(3) ? "日本経済新聞（報道）" : "クロス・マーケティング 調査（2025年8月）"} at={s(0)} />
    </>
  );
}, { bg: "white" });

/* G25B MAP: 2022 北京に海外 1 号店 → 2026年7月末 169店（アジア中心）→ 500店計画（報道） */
const DOTS = Array.from({ length: 60 }, (_, i) => ({
  x: 700 + ((i * 173) % 820) + Math.sin(i) * 30,
  y: 260 + ((i * 97) % 520),
}));
const G25B = mk(({ f, s }) => {
  const n = count(f, s(2) + 10, 50, 1, 169);
  const k = Math.round((n / 169) * 34);
  const plan = fade(f, s(3));
  return (
    <>
      <Stage>
        {/* 日本 */}
        <g opacity={fade(f, s(0))}>
          <path d="M 1640 300 C 1700 360 1720 460 1680 560 C 1650 640 1580 700 1520 760" stroke={G.line} strokeWidth={28} fill="none" strokeLinecap="round" />
          <text x={1760} y={500} fontFamily={FONT} fontWeight={900} fontSize={40} fill="#EAF6FF">
            日本
          </text>
        </g>
        {/* 北京 */}
        <g opacity={fade(f, s(1))}>
          <circle cx={1180} cy={360} r={22 * pop(f, s(1) + 10)} fill="#F5B83D" />
          <text x={1180} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#F5B83D">
            2022 北京（海外1号店）
          </text>
        </g>
        {DOTS.map((d, i) => (i < k ? <circle key={i} cx={d.x} cy={d.y} r={12} fill={G.red} opacity={0.85} /> : null))}
        {DOTS.map((d, i) =>
          i >= k && i < k + Math.round(plan * 26) ? <circle key={`p${i}`} cx={d.x} cy={d.y} r={12} fill="none" stroke="#EAF6FF" strokeWidth={3} strokeDasharray="5 4" opacity={0.8} /> : null,
        )}
        <g opacity={fade(f, s(2))}>
          <text x={380} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C9D6E6">
            海外の店（2026年7月末）
          </text>
          <text x={380} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill="#EAF6FF">
            {Math.round(n)}
            <tspan fontSize={64}>店</tspan>
          </text>
          <text x={380} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#C9D6E6">
            アジアを中心に
          </text>
        </g>
        <g opacity={plan}>
          <text x={380} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#F5B83D">
            → 500店 計画
          </text>
          <text x={380} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#C9D6E6">
            （報道）
          </text>
        </g>
        <text x={1110} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#C9D6E6" opacity={0.7}>
          ※点は店の数のイメージ。位置は正確ではない
        </text>
      </Stage>
      <EvidenceMark no="#18" source="NNA / animationbusiness（報道）" at={s(2)} dark />
    </>
  );
}, { bg: "blueprint" });

/* G27 FINAL MONEY FLOW: 全部を順に描く（字幕は隠す） */
const G27 = mk(({ f, s }) => {
  const t0 = s(0);
  return (
    <Stage>
      <Head text="ガチャガチャの MONEY FLOW" at={t0} y={110} size={48} />
      <MoneyFlow6
        y={450}
        st={{
          customer: fade(f, t0 + 10),
          again: fade(f, t0 + 30),
          pay: fade(f, t0 + 55),
          op: fade(f, t0 + 55),
          maker: fade(f, t0 + 100),
          order: fade(f, t0 + 120),
          goods: fade(f, t0 + 140),
          risk: ease(f, t0 + 175, t0 + 200, 0, 1, Easing.out(Easing.back(1.6))),
          place: fade(f, t0 + 220),
          placeQ: fade(f, t0 + 240),
        }}
      />
    </Stage>
  );
}, { bg: "white", hideSubs: [0] });

/* G28 FINAL CLUE */
const G28 = mk(({ s }) => <Daishi no="FINAL" at={s(0) + 10} />, { bg: "paper", noSub: true });

/* G29 KEY: 答え。カプセルが大人の手に */
const G29 = mk(({ f, s }) => {
  const up = ease(f, s(0) + 30, s(0) + 60, 0, 1, Easing.out(Easing.cubic));
  return (
    <>
      <Stage>
        <Person6 x={960} y={1040} s={1.8} color="#3B4556" o={fade(f, s(0) + 20)} />
        <Capsule x={1150} y={860 - 60 * up} r={70} color={G.cap[0]} who={1} showWho o={fade(f, s(0) + 30)} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130, fontFamily: SERIF }}>
        <div style={{ fontSize: 100, fontWeight: 900, color: K.ink, opacity: fade(f, s(0)) }}>
          答えは――<span style={{ color: G.red }}>買う人が変わった</span>から。
        </div>
        <div style={{ fontSize: 54, fontWeight: 900, color: K.inkSoft, marginTop: 40, opacity: fade(f, s(1)), textAlign: "center", lineHeight: 1.5 }}>
          リスクを引き受ける仕組みが、
          <br />
          500円でも回り続けるガチャを支えている。
        </div>
      </AbsoluteFill>
    </>
  );
}, { bg: "white", noSub: true });

/* G30–G32: KANENAZO 固定エンディング */
const G30 = mk(
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

const G31 = mk(
  ({ f, s }) => {
    const p = ease(f, s(0), s(0) + 16, 0, 1, Easing.out(Easing.back(1.6)));
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 100, fontFamily: FONT }}>
          <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
            <div style={{ fontSize: 170, fontWeight: 900, color: K.ink, letterSpacing: 28 }}>KANENAZO</div>
            <div style={{ display: "inline-block", marginTop: 8, background: K.red, color: K.white, fontSize: 48, fontWeight: 900, letterSpacing: 16, padding: "4px 30px", borderRadius: 12 }}>カネナゾ</div>
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: K.inkSoft, letterSpacing: 10, marginTop: 44, opacity: ease(f, s(2), s(2) + 12) }}>身近なお金の謎を解く。</div>
        </AbsoluteFill>
        <Sfx at={s(0)} name="jingle" volume={0.8} />
      </>
    );
  },
  { noSub: true },
);

const G32 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const FINALE6 = { G22, G23, G24, G25, G25B, G27, G28, G29, G30, G31, G32 };
export { Person6 };
