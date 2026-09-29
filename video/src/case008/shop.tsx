/** CUT 020–032（J17–J29）。なぜこんなに置かれたか → 定価の自分の店 → 台数で稼ぐ → 大手が手放す → 悪循環（HERO）→ CLUE 02 → 65万台の重さ */
import React from "react";
import { EvidenceMark, Stage, count, mk } from "../case002/ui";
import { FArrow, FNode } from "../case006/kit";
import { Can, CanClue, Easing, FONT, K, Led, Machine, Mini, SERIF, Sfx, Street, Truck, V, ease, fade, pop } from "./kit";
import { Cam, BottleTrail, Coin8, CoinTrail, JapanMap, Person8, Sys } from "./kit2";

/* CUT 020 — [QUESTION / LEVEL 2] J17: 街じゅうの自販機が次々に灯る（Slow Zoom Out） */
const J17 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1.6, x: 960, y: 820 }, { at: s(2) + 20, s: 1, x: 960, y: 560 }]}>
        <Street n={22} on={22 * ease(f, s(2), s(2) + 40)} y={420} s={0.45} />
        <Street n={16} on={16 * ease(f, s(1), s(1) + 60)} y={620} s={0.7} />
        <Street n={9} on={9 * ease(f, 0, 40)} y={900} s={1.2} x0={200} x1={1720} />
      </Cam>
    </Stage>
    <Sfx at={s(2)} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 021 — [INFOGRAPHIC / LEVEL 2] J18: 値段を決める手。スーパーは店員の手が「特売」に、自販機は飲料会社の手が定価に固定 */
const Hand: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 0, color = "#F2C9A8" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-20} y={0} width={40} height={140} rx={16} fill={color} stroke="#C9926B" strokeWidth={3} />
    <rect x={-40} y={-40} width={80} height={70} rx={24} fill={color} stroke="#C9926B" strokeWidth={3} />
  </g>
);
const J18 = mk(({ f, s }) => {
  const flip = ease(f, s(2), s(2) + 16);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 960, y: 520 }, { at: s(1), s: 1.15, x: 560, y: 520 }, { at: s(3), s: 1.15, x: 1360, y: 520 }, { at: s(3) + 80, s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(0))} transform="translate(560 540)">
            <g stroke={K.inkSoft} strokeWidth={5} fill="none">
              <rect x={-260} y={-200} width={520} height={360} />
              <line x1={-260} x2={260} y1={-80} y2={-80} />
              <line x1={-260} x2={260} y1={40} y2={40} />
            </g>
            {[0, 1, 2].map((i) => (
              <Can key={i} x={-160 + i * 160} y={-10} color="#81B29A" s={1.1} bottle />
            ))}
            <g transform={`translate(0 110) scale(1 ${Math.abs(1 - 2 * flip)})`}>
              <rect x={-110} y={-34} width={220} height={68} rx={10} fill={flip > 0.5 ? V.red : "#FFFFFF"} stroke={V.red} strokeWidth={4} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={flip > 0.5 ? "#FFFFFF" : V.red}>
                {flip > 0.5 ? "特売 ↓" : "定価"}
              </text>
            </g>
            <Hand x={150 - 40 * flip} y={150} r={-20} />
            <text y={240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.inkSoft}>
              店
            </text>
          </g>
          <g opacity={fade(f, s(3))} transform="translate(1360 540)">
            <Machine x={-60} y={200} s={0.5} led="200" />
            <Hand x={140} y={-20} r={-30} color="#DDE3EA" />
            <text x={140} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.band}>
              飲料会社
            </text>
            <Led x={140} y={-100} text="定価" size={46} w={150} />
          </g>
        </Cam>
      </Stage>
    </>
  );
}, { bg: "paper" });

/* CUT 022 — [EVIDENCE / LEVEL 1] J19: 円グラフが自販機の色で 8〜9割（中ほど表示）、缶コーヒー 1 本（カメラ固定） */
const J19 = mk(({ f, s }) => {
  const k = ease(f, s(1), s(1) + 30) * 0.85;
  const a = k * Math.PI * 2;
  const R = 220;
  const x = 700 + R * Math.sin(a);
  const y = 500 - R * Math.cos(a);
  return (
    <>
      <Stage>
        <circle cx={700} cy={500} r={R} fill="#E8EBF0" />
        {k > 0 && <path d={`M 700 500 L 700 ${500 - R} A ${R} ${R} 0 ${k > 0.5 ? 1 : 0} 1 ${x} ${y} Z`} fill={V.band} />}
        <text x={700} y={510} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#FFFFFF" opacity={fade(f, s(1) + 30)}>
          8〜9割
        </text>
        <text x={700} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(1))}>
          ダイドー 国内飲料の売上のうち自販機（報道）
        </text>
        <g opacity={fade(f, s(2))}>
          <Mini x={1300} y={700} s={2.2} />
          <Can x={1560} y={600} color="#8C6E3F" s={2.4} />
          <text x={1420} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
            25万台前後
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#11" source="報道（日本経済新聞 ほか）" at={s(1)} />
    </>
  );
}, { bg: "paper" });

/* CUT 023 — [MONEY FLOW / LEVEL 2] J20: ボトル → 客（右）、硬貨 → 自販機 → 飲料会社（左）、一部は場所の持ち主へ。補充トラックは会社 → 自販機。続いてビルの各階に自販機（47.7%） */
const J20 = mk(({ f, s }) => {
  const bld = fade(f, s(4));
  const floors = 10;
  return (
    <>
      <Stage>
        <g opacity={1 - bld}>
          <Cam keys={[{ at: 0, s: 1 }, { at: s(1), s: 1.1, x: 960, y: 620 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
            <FNode x={260} y={420} label="飲料会社" o={fade(f, s(0))} color={V.band} />
            <Machine x={960} y={560} s={0.36} led="200" />
            <Person8 x={1640} y={560} s={0.9} color="#5E6B7D" o={fade(f, s(0))} />
            <FNode x={960} y={760} label="場所の持ち主" o={fade(f, s(0))} color="#C98A2B" w={360} />
            <BottleTrail pts={[[1040, 470], [1580, 470]]} at={s(0) + 10} n={40} dur={40} gap={24} s={0.6} loop />
            <CoinTrail pts={[[1580, 380], [1040, 380]]} at={s(0) + 20} n={40} dur={36} gap={24} loop />
            <CoinTrail pts={[[880, 380], [420, 380]]} at={s(0) + 50} n={40} dur={36} gap={24} loop />
            <CoinTrail pts={[[960, 580], [960, 690]]} at={s(1)} n={40} dur={24} gap={30} loop />
            <g opacity={fade(f, s(2))}>
              <FArrow d="M 400 500 C 560 620 720 620 850 560" o={1} color={V.band} />
              <Truck x={560 + 200 * ((f % 120) / 120)} y={630} s={0.5} color={V.band} />
            </g>
          </Cam>
        </g>
        <g opacity={bld}>
          {/* ビルの断面: 各階に自販機の灯り */}
          <rect x={560} y={140} width={420} height={680} fill="#F2F4F7" stroke={K.ink} strokeWidth={5} />
          {Array.from({ length: floors }, (_, i) => (
            <g key={i}>
              <line x1={560} x2={980} y1={140 + (i + 1) * 68} y2={140 + (i + 1) * 68} stroke="#C9D1DB" strokeWidth={3} />
              <Mini x={640 + ((i * 3) % 4) * 80} y={140 + (i + 1) * 68 - 4} s={0.38} lit={i % 2 === 0 || i === 3 ? 1 : 0.02} />
            </g>
          ))}
          <text x={1400} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={K.ink}>
            47.7<tspan fontSize={70}>%</tspan>
          </text>
          <text x={1400} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            事業所に自販機がある会社
          </text>
          <text x={1400} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={V.band} opacity={fade(f, s(5))}>
            大企業 約8割
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(4) ? "#07" : "#12"} source={f < s(4) ? "業界の解説" : "東京商工リサーチ（2026年）"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 024 — [GRAPH / LEVEL 3] J21–J21B: 日本地図に点が増える（台数↑）。値段の線は 100 → 110 で平ら（価格は据え置き） */
const J21 = mk(({ f, s }) => {
  const n = Math.round(560 * ease(f, s(0), s(2) + 20, 0, 1, Easing.inOut(Easing.cubic)));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.3, x: 760, y: 470 }, { at: s(2) + 20, s: 1, x: 960, y: 540 }]}>
          <JapanMap x={700} y={470} s={0.95} n={n} />
        </Cam>
        <g opacity={fade(f, s(2))}>
          <text x={1500} y={330} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={60} fill={K.inkSoft}>
            2000
          </text>
          <text x={1500} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={V.red}>
            560<tspan fontSize={60}>万台</tspan>
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(2)} />
    </>
  );
}, { bg: "white" });
const J21B = mk(({ f, s }) => {
  const x0 = 260;
  const x1 = 1660;
  const X = (yr: number) => x0 + ((yr - 1980) / 22) * (x1 - x0);
  const Y = (p: number) => 640 - (p - 90) * 14;
  const draw = ease(f, s(1), s(1) + 60);
  const xEnd = x0 + (x1 - x0) * draw;
  return (
    <>
      <Stage>
        <JapanMap x={1740} y={580} s={0.24} n={560} o={0.9} r={4.5} />
        <line x1={x0} x2={x1} y1={720} y2={720} stroke={K.ink} strokeWidth={4} />
        {[1983, 1992, 2000].map((yr) => (
          <text key={yr} x={X(yr)} y={764} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft} opacity={fade(f, s(1))}>
            {yr}
          </text>
        ))}
        {/* 値段の階段（1983 100円 → 1992 110円） */}
        <clipPath id="clip21b">
          <rect x={0} y={0} width={xEnd} height={1080} />
        </clipPath>
        <path
          d={`M ${X(1983)} ${Y(100)} L ${X(1992)} ${Y(100)} L ${X(1992)} ${Y(110)} L ${X(2002)} ${Y(110)}`}
          stroke={V.led}
          strokeWidth={12}
          fill="none"
          clipPath="url(#clip21b)"
          strokeLinejoin="round"
        />
        <Led x={X(1983) + 100} y={Y(100) - 70} text="100" size={46} w={140} o={fade(f, s(1))} />
        <Led x={X(1992) + 100} y={Y(110) - 70} text="110" size={46} w={140} o={fade(f, s(1) + 40)} />
        <text x={x1} y={Y(110) - 40} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(1))}>
          缶の飲み物（と言われる）
        </text>
        {/* 台数は上へ（地図の点）、値段は横ばい → 2 本の矢印 */}
        <g opacity={fade(f, s(2))}>
          <path d="M 420 330 L 420 170" stroke={V.band} strokeWidth={16} strokeLinecap="round" />
          <path d="M 390 210 L 420 170 L 450 210" stroke={V.band} strokeWidth={16} fill="none" strokeLinecap="round" />
          <text x={420} y={375} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={V.band}>
            台数
          </text>
          <path d="M 560 250 L 760 250" stroke={V.led} strokeWidth={16} strokeLinecap="round" />
          <text x={660} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={V.led}>
            値段
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#14" source="日本経済新聞 ほか（報道）" at={s(1)} />
    </>
  );
}, { bg: "paper" });

/* CUT 025 — [QUESTION / LEVEL 2] J22 */
const J22 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 20, s: 1.2, y: 640 }]}>
        <Machine x={960} y={1000} s={0.62} lit={0.8} led="---" tag={f > s(1) ? "撤去" : undefined} />
      </Cam>
    </Stage>
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* 帳簿の価値の棒（切り落とされる） */
const BookBar: React.FC<{ x: number; y: number; cut: number; label: string; amount: string; o?: number }> = ({ x, y, cut, label, amount, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <text x={0} y={-30} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
      {label}
    </text>
    <rect x={0} y={0} width={900} height={110} rx={10} fill={V.band} />
    <g transform={`translate(${520 + 60 * cut} ${cut * 130}) rotate(${cut * 10} 190 55)`} opacity={1 - cut * 0.5}>
      <rect x={0} y={0} width={380} height={110} rx={10} fill={V.red} />
      <text x={190} y={55} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#FFFFFF">
        {amount}
      </text>
    </g>
  </g>
);

/* CUT 026 — [IMPACT / LEVEL 4] J23: CCBJ の 65〜70万台（地図の点）→ 帳簿の棒が 881億円ぶん切り落とされる → −507億円 */
const J23 = mk(({ f, s }) => {
  const cut = ease(f, s(3) + 10, s(3) + 40, 0, 1, Easing.in(Easing.cubic));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(2), s: 1.08, x: 900, y: 500 }, { at: s(4), s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(1))}>
            <JapanMap x={1560} y={300} s={0.36} n={65} blue={65} r={5} />
            <text x={1560} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={V.blue}>
              約65万〜70万台
            </text>
            <text x={1560} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
              売上の約1/4が自販機
            </text>
          </g>
          <BookBar x={180} y={330} cut={cut} label="自販機事業の帳簿上の価値（イメージ）" amount="881億円" o={fade(f, s(2))} />
          <text x={630} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft} opacity={fade(f, s(3))}>
            減損 ＝ 稼げる見込みを下げ、価値を切り下げる
          </text>
          <text x={630} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={V.red} opacity={fade(f, s(4))}>
            −507億円
          </text>
        </Cam>
      </Stage>
      <EvidenceMark no="#15" source="CCBJH 決算（2025年12月期）" at={s(1)} />
      <Sfx at={s(3) + 30} name="thud" volume={0.6} />
    </>
  );
}, { bg: "paper" });

/* CUT 027 — [EVIDENCE / LEVEL 2] J24: 同じ帳簿の棒が 298億円。国内飲料 −20億円、ボトルの山が −2.7% */
const J24 = mk(({ f, s }) => {
  const cut = ease(f, s(1), s(1) + 30, 0, 1, Easing.in(Easing.cubic));
  const k = ease(f, s(3), s(3) + 30);
  return (
    <>
      <Stage>
        <BookBar x={180} y={260} cut={cut} label="ダイドー（2026年1月期）" amount="298億円" o={fade(f, s(0))} />
        <g opacity={fade(f, s(1) + 30)}>
          <text x={380} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            最終損益
          </text>
          <text x={380} y={770} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={V.red}>
            −307億
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={820} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            国内飲料の営業損益
          </text>
          <text x={820} y={770} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={V.red}>
            −20億
          </text>
        </g>
        <g opacity={fade(f, s(3))} transform="translate(1440 520)">
          {Array.from({ length: 36 }, (_, i) => (
            <Can key={i} x={-180 + (i % 9) * 45} y={-140 + Math.floor(i / 9) * 70} color={V.blue} s={0.55} bottle o={i === 35 && k > 0.5 ? 0.15 : 1} />
          ))}
          <text y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={V.blue}>
            −2.7%
          </text>
          <text y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            自販機で売れた数量
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#11" source="DyDo 決算（2026年1月期）" at={s(0)} />
      <Sfx at={s(1) + 20} name="thud" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* CUT 028 — [REAL(再現) / LEVEL 3] J25: 夜の街から自販機が運ばれていく（Tracking）。約2万台 / 約4万台 */
const J25 = mk(({ f, s }) => {
  const n = 18;
  const on = count(f, s(0) + 10, 90, n, n * 0.62);
  const tr = ease(f, s(0), s(3) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.2, x: 400, y: 700 }, { at: s(3) + 30, s: 1.2, x: 1500, y: 700 }]}>
          <Street n={n} on={on} y={860} s={0.95} />
          <Truck x={-100 + 2100 * tr} y={1000} s={1} color="#5E6B7D" />
        </Cam>
        <g opacity={fade(f, s(0))}>
          <text x={540} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#C9D6E6">
            ダイドー（報道）
          </text>
          <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={V.led}>
            約2万台 撤去
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1380} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#C9D6E6">
            ポッカサッポロ
          </text>
          <text x={1380} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#FFD66E">
            約4万台 → 別会社へ
          </text>
          <text x={1380} y={390} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#C9D6E6">
            2026年10月
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(1) ? "#11" : "#08"} source={f < s(1) ? "報道" : "ポッカサッポロ 発表"} at={s(0)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 029 — [QUESTION / LEVEL 2] J26 */
const J26 = mk(({ f }) => (
  <>
    <Stage>
      <Street n={12} on={12 * (1 - 0.3 * ease(f, 10, 60))} y={760} s={1} />
    </Stage>
    <Sfx at={10} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 030 — [SIMULATION / LEVEL 4 HERO] J27: 常識 ≠ 実際。1 台のシステムが一周ずつ回る。二周目は速くなる */
const J27 = mk(({ f, s }) => {
  const nodes = [
    { t: "値上げ", at: s(1), c: V.red },
    { t: "本数 ↓", at: s(2), c: V.blue },
    { t: "1台の売上 ↓", at: s(3), c: V.blue },
    { t: "費用はそのまま", at: s(4), c: K.ink },
    { t: "赤字の自販機 ↑", at: s(5), c: V.red },
  ];
  const sales = 1 - 0.55 * ease(f, s(2), s(2) + 40);
  const coins = 1 - 0.6 * ease(f, s(3), s(3) + 30);
  const red = ease(f, s(5), s(5) + 30);
  const spinSpeed = f > s(7) ? 3.2 : 1;
  const spin = f > s(1) ? (f - s(1)) * 0.6 + (f > s(7) ? (f - s(7)) * (spinSpeed - 1) * 0.6 : 0) : 0;
  const cx = 1280;
  const cy = 470;
  const R0 = 330;
  const walk = ease(f, s(2), s(2) + 70);
  return (
    <>
      <Stage>
        {/* 常識 ≠ 実際 */}
        <g opacity={fade(f, s(1))} transform="translate(300 170)">
          <rect x={-230} y={-60} width={460} height={120} rx={20} fill="#FFFFFF" stroke={K.inkSoft} strokeWidth={4} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.inkSoft}>
            値上げ → 売上 ↑ ?
          </text>
          <g opacity={fade(f, s(2) + 10)}>
            <line x1={-200} y1={-40} x2={200} y2={40} stroke={V.red} strokeWidth={10} />
            <line x1={-200} y1={40} x2={200} y2={-40} stroke={V.red} strokeWidth={10} />
          </g>
        </g>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(7), s: 1 }, { at: s(7) + 40, s: 1.06, x: 1020, y: 560 }]}>
          {/* 1 台のシステム */}
          <Sys x={480} y={900} s={0.62} sales={sales} coins={coins} red={red} led={f > s(1) + 10 ? "220" : "200"} />
          <Person8 x={120 + 700 * walk} y={900} s={0.7} color="#9FB3C8" step={f / 3} o={walk > 0 && walk < 1 ? 1 : 0} />
          {/* ループ */}
          <circle cx={cx} cy={cy} r={R0} fill="none" stroke="#E4DED2" strokeWidth={16} />
          <g transform={`rotate(${spin} ${cx} ${cy})`} opacity={fade(f, s(1))}>
            <path d={`M ${cx + R0} ${cy} A ${R0} ${R0} 0 0 1 ${cx} ${cy + R0}`} fill="none" stroke={V.red} strokeWidth={16} strokeLinecap="round" />
            <path d={`M ${cx + 22} ${cy + R0 - 26} L ${cx - 8} ${cy + R0} L ${cx + 22} ${cy + R0 + 26}`} fill="none" stroke={V.red} strokeWidth={14} strokeLinecap="round" />
          </g>
          {nodes.map((n, i) => {
            const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
            const p = pop(f, n.at);
            return (
              <g key={i} transform={`translate(${cx + R0 * Math.cos(a)} ${cy + R0 * Math.sin(a)}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
                <rect x={-170} y={-46} width={340} height={92} rx={46} fill="#FFFFFF" stroke={n.c} strokeWidth={6} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={n.c}>
                  {n.t}
                </text>
              </g>
            );
          })}
          <text x={cx} y={cy + 10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(0))}>
            ※イメージ
          </text>
          <g opacity={fade(f, s(6))} transform={`translate(${cx} ${cy + R0 + 110})`}>
            <rect x={-220} y={-34} width={440} height={68} rx={34} fill={V.red} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF">
              赤字機 2〜3割とも（報道）
            </text>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#16" source="東洋経済（2025年）" at={s(6)} />
      {nodes.map((n, i) => (
        <Sfx key={i} at={n.at} name="tok" volume={0.3} />
      ))}
    </>
  );
}, { bg: "white" });

/* CUT 031 — [CLUE / LEVEL 3] J28 */
const J28 = mk(({ s }) => <CanClue no="02" at={s(0) + 6} />, { bg: "paper", noSub: true });

/* CUT 032 — [IMPACT / LEVEL 3] J29: 地図の 65 点（1点 = 1万台）に小さな赤字が一つずつ灯り、右の塊に積もる */
const J29 = mk(({ f, s }) => {
  const reds = Math.round(65 * ease(f, s(2), s(2) + 70));
  const pile = ease(f, s(2) + 20, s(3));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.15, x: 700, y: 480 }, { at: s(2), s: 1, x: 960, y: 540 }, { at: s(3) + 20, s: 1.1, x: 1300, y: 500 }]}>
          <JapanMap x={700} y={480} s={0.95} n={65} blue={65 - reds} red={reds} r={6} />
          <g opacity={fade(f, s(1))}>
            <text x={700} y={880} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
              ● = 1万台（65万台）
            </text>
          </g>
          <g opacity={fade(f, s(2))} transform="translate(1400 700)">
            {Array.from({ length: 20 }, (_, i) => (
              <rect key={i} x={-120 + (i % 4) * 62} y={-Math.floor(i / 4) * 62 - 60} width={56} height={56} rx={6} fill={V.red} opacity={i < pile * 20 ? 0.9 : 0.08} />
            ))}
            <text y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={V.red} opacity={fade(f, s(3))}>
              881億・298億
            </text>
          </g>
        </Cam>
      </Stage>
    </>
  );
}, { bg: "white" });

export const SHOP8 = { J17, J18, J19, J20, J21, J21B, J22, J23, J24, J25, J26, J27, J28, J29 };
export { Coin8, SERIF };
