/** G01–G11: 問い（0秒）→ 100円→500円 → 過去最高 1960億円 → QUESTION 1 → TITLE → 公表されていないもの → 市場 → 主流の値段 → ふつうは逆 → 答え（先に）→ 誰が買う */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, Capsule, Coin, Easing, FONT, G, Head, K, Machine, Person6, SERIF, Sfx, ease, fade, pop } from "./kit";

/* G01 OBJECT: 0 フレームからハンドルが回り、カプセルが転がり出る（BGM なし） */
const G01 = mk(
  ({ f }) => {
    const turn = ease(f, 0, 30, 0, 360, Easing.inOut(Easing.cubic));
    const drop = ease(f, 30, 44, 0, 1, Easing.in(Easing.quad));
    const roll = ease(f, 44, 80, 0, 1, Easing.out(Easing.cubic));
    const cx = 800 + 520 * roll;
    const cy = 620 + 110 * drop + 150 * Math.min(1, roll * 3) - 60 * Math.abs(Math.sin(roll * Math.PI * 2)) * (1 - roll);
    return (
      <>
        <Stage>
          <Machine x={760} y={660} s={0.8} turn={turn} />
          <Capsule x={cx} y={f < 30 ? -200 : cy} r={70} color={G.cap[1]} rot={roll * 540} />
          <line x1={500} x2={1700} y1={952} y2={952} stroke="#3A3A3A" strokeWidth={4} />
        </Stage>
        <Lines
          dark
          y={-390}
          lines={[
            { t: "ガチャガチャは、", at: -16, size: 76 },
            { t: <>なぜ<R>500円</R>に？</>, at: -8, size: 110 },
          ]}
        />
        <Sfx at={2} name="tok" volume={0.5} />
        <Sfx at={12} name="tok" volume={0.5} />
        <Sfx at={22} name="tok" volume={0.5} />
        <Sfx at={44} name="pop" volume={0.6} />
      </>
    );
  },
  { bg: "black", noSub: true },
);

/* G02 DATA: 100円 → 200円 → 400円 → 500円 の機械が並ぶ（右ほど大きく） */
const G02 = mk(({ f, s }) => {
  const items = [
    { p: "100円", x: 330, sc: 0.44, at: s(0) + 20, body: "#8FA6BF" },
    { p: "200円", x: 720, sc: 0.5, at: s(0) + 44, body: "#8FA6BF" },
    { p: "400円", x: 1140, sc: 0.58, at: s(1) + 20, body: G.body },
    { p: "500円", x: 1600, sc: 0.66, at: s(1) + 44, body: G.body },
  ];
  return (
    <>
      <Stage>
        {items.map((it, i) => {
          const p = pop(f, it.at);
          return (
            <g key={i} opacity={Math.min(1, p * 1.4)} transform={`translate(${it.x} ${880}) scale(${p}) translate(${-it.x} ${-880})`}>
              <Machine x={it.x} y={880 - 360 * it.sc} s={it.sc} price={it.p} body={it.body} />
            </g>
          );
        })}
        <text x={525} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft} opacity={fade(f, s(0))}>
          かつて
        </text>
        <text x={1370} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={G.red} opacity={fade(f, s(1))}>
          今
        </text>
        <line x1={960} x2={960} y1={130} y2={900} stroke="#DDD6C8" strokeWidth={4} strokeDasharray="14 12" opacity={fade(f, s(1))} />
        <line x1={120} x2={1800} y1={882} y2={882} stroke="#B9AE9C" strokeWidth={6} />
      </Stage>
      {items.map((it, i) => (
        <Sfx key={i} at={it.at} name="tok" volume={0.45} />
      ))}
    </>
  );
}, { bg: "white" });

/* G03 DATA: 値段↑ なのに 市場は過去最高 1960億円 +39% */
const G03 = mk(({ f, s }) => {
  const n = count(f, s(2) + 4, 40, 1000, 1960);
  const stamp = pop(f, s(1) + 20);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0)) * (1 - 0.6 * fade(f, s(2)))}>
          <text x={420} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.inkSoft}>
            値段
          </text>
          <path d="M 420 520 L 420 390 M 370 440 L 420 390 L 470 440" stroke={K.inkSoft} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={1150} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={K.inkSoft}>
            カプセルトイ市場（2025年度）
          </text>
          <text x={1150} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={K.ink}>
            約{Math.round(n).toLocaleString("ja-JP")}
            <tspan fontSize={96}>億円</tspan>
          </text>
        </g>
        <g transform={`translate(1150 690) scale(${pop(f, s(3) + 10)})`} opacity={fade(f, s(3) + 10)}>
          <path d="M -260 30 L -160 -30" stroke={G.red} strokeWidth={14} strokeLinecap="round" />
          <text x={40} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={120} fill={G.red}>
            +39%
          </text>
          <text x={40} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            前の年より
          </text>
        </g>
        <g transform={`translate(420 760) rotate(-8) scale(${stamp})`} opacity={Math.min(1, stamp * 1.4)}>
          <rect x={-190} y={-66} width={380} height={132} rx={14} fill="none" stroke={G.red} strokeWidth={10} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={80} fill={G.red}>
            過去最高
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本カプセルトイ協会" at={s(2)} />
      <Sfx at={s(1) + 20} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white" });

/* G04 DARK: QUESTION 1。スポットライトの中のカプセル */
const G04 = mk(({ f, s }) => (
  <>
    <Stage>
      <defs>
        <radialGradient id="spot6" cx="50%" cy="66%" r="36%">
          <stop offset="0%" stopColor="rgba(255,240,210,0.24)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#spot6)" />
      <Capsule x={960} y={700} r={150} color={G.cap[0]} rot={-8 + 4 * Math.sin(f / 20)} />
    </Stage>
    <Lines
      dark
      y={-330}
      lines={[
        { t: "値段が上がったのに、", at: s(0), size: 70 },
        { t: <>なぜ、<R>売れ続ける</R>？</>, at: s(1), size: 108 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* G05 TITLE: 台紙の形のタイトルカード */
const G05 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #006</div>
        <div
          style={{
            marginTop: 40,
            background: "#FFFDF6",
            borderRadius: 26,
            overflow: "hidden",
            border: `6px solid ${G.red}`,
            transform: `scale(${p}) rotate(-1.5deg)`,
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <div style={{ background: G.red, height: 30 }} />
          <div style={{ padding: "30px 70px 40px", fontFamily: SERIF, fontSize: 118, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>
            ガチャガチャ、<span style={{ color: G.red }}>なぜ500円に？</span>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* G06 KEY: 公表されていないもの（先に言う）→ 公開データで追う */
const Lock: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d="M -34 -10 L -34 -40 A 34 34 0 0 1 34 -40 L 34 -10" fill="none" stroke={K.ink} strokeWidth={12} />
    <rect x={-52} y={-12} width={104} height={80} rx={12} fill={K.ink} />
    <circle cy={24} r={10} fill="#FCFBF8" />
  </g>
);
const G06 = mk(({ f, s }) => {
  const box = (x: number, title: string, at: number) => (
    <g opacity={fade(f, at)} transform={`translate(${x} 340)`}>
      <rect x={-330} y={-140} width={660} height={280} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
      <text y={-70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
        {title}
      </text>
      <Lock x={-150} y={40} o={fade(f, at + 14)} />
      <text x={60} y={50} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={G.hidden} opacity={fade(f, at + 14)}>
        非公表
      </text>
    </g>
  );
  const look = pop(f, s(2) + 6);
  return (
    <>
      <Stage>
        {box(560, "1回まわして、いくら儲かる？", s(0) + 30)}
        {box(1360, "機械を置く店の取り分", s(1) + 10)}
        <g transform={`translate(960 640) scale(${look})`} opacity={Math.min(1, look * 1.4)}>
          <rect x={-480} y={-70} width={960} height={140} rx={70} fill={K.ink} />
          <g transform="translate(-380 -4)">
            <circle r={34} fill="none" stroke="#FFFFFF" strokeWidth={10} />
            <path d="M 24 24 L 52 52" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" />
          </g>
          <text x={40} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#FFFFFF">
            公開されている数字で追う
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <Badge x={700} y={800} text="誰が何を背負う？" at={s(3) + 4} fill="#FFFFFF" color={K.ink} size={36} />
          <Badge x={1240} y={800} text="何で稼ぐ？" at={s(3) + 30} fill="#FFFFFF" color={K.ink} size={36} />
        </g>
      </Stage>
      <Sfx at={s(0) + 44} name="tok" volume={0.5} />
      <Sfx at={s(1) + 24} name="tok" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* G07 GRAPH: 2023 1150 → 2024 1410 → 2025 1960（2年で1.7倍）。2022 は +6割から逆算した参考値（点線） */
const G07 = mk(({ f, s }) => {
  const base = 790;
  const k = 0.25; // 1億円 → px
  const bars = [
    { x: 380, v: 719, label: "2022", at: s(4) + 10, ref: true },
    { x: 760, v: 1150, label: "2023", at: s(0) + 20 },
    { x: 1140, v: 1410, label: "2024", at: s(1) + 10 },
    { x: 1520, v: 1960, label: "2025", at: s(2) + 16 },
  ];
  const ext = ease(f, s(7) + 20, s(7) + 50);
  return (
    <>
      <Stage>
        <Head text="カプセルトイ市場（年度・億円）" at={s(0)} y={140} size={46} color={K.inkSoft} />
        <line x1={220} x2={1760} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        {bars.map((b, i) => {
          const h = ease(f, b.at, b.at + 26, 0, 1, Easing.out(Easing.cubic)) * b.v * k;
          const o = fade(f, b.at);
          return (
            <g key={i} opacity={o}>
              <rect
                x={b.x - 110}
                y={base - h}
                width={220}
                height={h}
                rx={10}
                fill={b.ref ? "none" : i === 3 ? G.red : "#8FA6BF"}
                stroke={b.ref ? K.inkSoft : "none"}
                strokeWidth={5}
                strokeDasharray={b.ref ? "16 12" : undefined}
              />
              <text x={b.x} y={base - h - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={b.ref ? 40 : 54} fill={b.ref ? K.inkSoft : i === 3 ? G.red : K.ink}>
                {b.ref ? "約720※" : `約${b.v.toLocaleString("ja-JP")}`}
              </text>
              <text x={b.x} y={base + 56} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
                {b.label}
              </text>
            </g>
          );
        })}
        {/* 2000億円超（イベント販売など含む） */}
        <g opacity={ext}>
          <rect x={1410} y={base - 2000 * k - 40 * ext} width={220} height={40 * ext + 2} fill="none" stroke={G.red} strokeWidth={5} strokeDasharray="12 8" />
          <text x={1520} y={base - 2000 * k - 110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={G.red}>
            イベント販売なども含め 2000億円超（見込み）
          </text>
        </g>
        {/* 2年で1.7倍 */}
        <g opacity={fade(f, s(3))}>
          <path d={`M 760 ${base - 1150 * k - 90} L 760 ${base - 1150 * k - 130} L 1520 ${base - 1150 * k - 130} L 1520 ${base - 1960 * k - 90}`} fill="none" stroke={K.ink} strokeWidth={4} opacity={1 - ext} />
          <text x={1140} y={base - 1150 * k - 150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink} opacity={1 - ext}>
            2年で 1.7倍
          </text>
        </g>
        <text x={380} y={base - 719 * k - 130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(4) + 10)}>
          ※「6割増」から逆算した参考値
        </text>
        <g opacity={fade(f, s(6))}>
          <rect x={120} y={190} width={600} height={70} rx={35} fill="#FFFFFF" stroke={K.ink} strokeWidth={3} />
          <text x={420} y={226} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.ink}>
            ガチャの機械で売る商品だけ
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本カプセルトイ協会" at={s(0)} />
    </>
  );
}, { bg: "white", hideSubs: [] });

/* G08 DATA: 主流の値段帯 200〜300円 → 400〜500円 */
const G08 = mk(({ f, s }) => {
  const x = (yen: number) => 260 + (yen - 100) * 2.8; // 100円 → 260px, 600円 → 1660px
  const mv = ease(f, s(2) + 6, s(2) + 40, 0, 1, Easing.inOut(Easing.cubic));
  const a = 200 + 200 * mv;
  const b = 300 + 200 * mv;
  return (
    <>
      <Stage>
        <Head text="1回の値段（主流）" at={s(0)} y={170} size={50} color={K.inkSoft} />
        <line x1={x(100)} x2={x(600)} y1={620} y2={620} stroke={K.ink} strokeWidth={6} />
        {[100, 200, 300, 400, 500, 600].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={600} y2={640} stroke={K.ink} strokeWidth={5} />
            <text x={x(v)} y={700} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft}>
              {v}円
            </text>
          </g>
        ))}
        <g opacity={fade(f, s(1))}>
          <rect x={x(a)} y={470} width={x(b) - x(a)} height={120} rx={18} fill={mv > 0.5 ? G.red : "#8FA6BF"} />
          <text x={(x(a) + x(b)) / 2} y={530} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#FFFFFF">
            主流
          </text>
          <Capsule x={(x(a) + x(b)) / 2} y={380} r={60} color={G.cap[1]} rot={mv * 360} />
        </g>
        <text x={x(250)} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft} opacity={fade(f, s(1) + 10)}>
          以前 200〜300円
        </text>
        <text x={x(460)} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={G.red} opacity={fade(f, s(2) + 30)}>
          今 400円・500円
        </text>
      </Stage>
      <EvidenceMark no="#01" source="日本カプセルトイ協会" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* G09 FLAT: ふつうは値段↑ → 客↓。ガチャは値段↑ → 市場↑ */
const Arrow: React.FC<{ x: number; y: number; up: number; color: string; label: string; o: number }> = ({ x, y, up, color, label, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <g transform={`rotate(${up > 0 ? 0 : 180})`}>
      <path d="M 0 90 L 0 -80 M -54 -26 L 0 -80 L 54 -26" stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
      {label}
    </text>
  </g>
);
const G09 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0))}>
        <rect x={140} y={170} width={760} height={600} rx={30} fill="#FFFFFF" opacity={0.6} />
        <text x={520} y={280} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.inkSoft}>
          ふつうは
        </text>
        <Arrow x={380} y={480} up={1} color={K.inkSoft} label="値段" o={1} />
        <Arrow x={660} y={480} up={-1} color={K.inkSoft} label="客" o={fade(f, s(0) + 30)} />
      </g>
      <g opacity={fade(f, s(1))}>
        <rect x={1020} y={170} width={760} height={600} rx={30} fill="#FFFFFF" stroke={G.red} strokeWidth={6} />
        <text x={1400} y={280} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={G.red}>
          ガチャは
        </text>
        <Arrow x={1260} y={480} up={1} color={G.red} label="値段" o={1} />
        <Arrow x={1540} y={480} up={1} color={G.red} label="市場" o={fade(f, s(2))} />
      </g>
    </Stage>
    <Sfx at={s(1)} name="tok" volume={0.5} />
  </>
), { bg: "paper" });

/* G10 KEY: 答え（先に）。カプセルの中のシルエットが子ども → 大人に変わる（BGM なし） */
const G10 = mk(({ f, s }) => {
  const who = ease(f, s(1) + 4, s(1) + 30, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <Stage>
        <Capsule x={960} y={650} r={200} color={G.cap[2]} who={who} showWho />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110, fontFamily: SERIF }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: K.inkSoft, opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 120, fontWeight: 900, color: K.ink, marginTop: 10, opacity: fade(f, s(1)) }}>
          <span style={{ color: G.red }}>買う人</span>が変わった。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white", noSub: true });

/* G11 GRAPH: 52.7% が購入経験（20〜69歳）/ 20代・30代 / 続けてまわす最高額 平均 1200〜1400円台 */
const G11 = mk(({ f, s }) => {
  const pct = ease(f, s(0) + 60, s(0) + 110) * 52.7;
  const R0 = 190;
  const ang = (pct / 100) * Math.PI * 2;
  const arc = `M 0 ${-R0} A ${R0} ${R0} 0 ${ang > Math.PI ? 1 : 0} 1 ${R0 * Math.sin(ang)} ${-R0 * Math.cos(ang)}`;
  const coins = Math.floor(ease(f, s(2) + 50, s(2) + 110) * 3);
  return (
    <>
      <Stage>
        {/* 円グラフ */}
        <g transform="translate(470 470)" opacity={fade(f, s(0))}>
          <circle r={R0} fill="none" stroke="#E6E0D5" strokeWidth={70} />
          <path d={arc} fill="none" stroke={G.red} strokeWidth={70} />
          <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            {pct.toFixed(1)}
            <tspan fontSize={50}>%</tspan>
          </text>
          <text y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            買ったことがある（20〜69歳）
          </text>
        </g>
        {/* 20代・30代 */}
        <g opacity={fade(f, s(1))}>
          <Person6 x={1120} y={420} s={1.1} color={G.red} />
          <Person6 x={1300} y={420} s={1.1} color={G.red} />
          <Badge x={1210} y={500} text="20代・30代" at={s(1) + 4} size={40} />
        </g>
        {/* 最高額 */}
        <g opacity={fade(f, s(2))}>
          <text x={1480} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            続けてまわしたときの最高額（平均）
          </text>
          <text x={1480} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={K.ink}>
            1200〜1400<tspan fontSize={52}>円台</tspan>
          </text>
          {Array.from({ length: coins }, (_, i) => (
            <Coin key={i} x={1560 + i * 90} y={370} r={40} />
          ))}
        </g>
        <Capsule x={860} y={230} r={64} color={G.cap[1]} rot={-14} o={fade(f, s(0) + 20)} />
      </Stage>
      <EvidenceMark no="#02" source="クロス・マーケティング 調査（2025年8月）" at={s(0)} />
    </>
  );
}, { bg: "white" });

export const OPEN6 = { G01, G02, G03, G04, G05, G06, G07, G08, G09, G10, G11 };
