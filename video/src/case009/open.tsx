/** CUT 001–013（D01–D13B）。06 DIRECTION。画面は語りを書き写さない（数字・ラベル・出典だけ。例外: 最初の答え D11 と CLUE） */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Cam, Coin8, CoinTrail, JapanMap } from "../case008/kit2";
import { Lock } from "../case008/kit";
import { Basket, Easing, Egg, FONT, HBar, InsCard, K, MedBox, P, SERIF, Sfx, Shopper, StorePlan, Wallet, ease, fade, pop, PATH } from "./kit";

const TITLE_Q = (
  <>
    ドラッグストア、<R>なぜ食品が安い？</R>
  </>
);

/* 店の通路（背景） */
const Aisle: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill={dark ? "#0F1622" : "#EEF2F6"} />
    {[0, 1].map((side) => (
      <g key={side} transform={`translate(${side ? 1500 : 0} 0)`}>
        <rect x={40} y={120} width={380} height={640} fill={dark ? "#1B2433" : "#FFFFFF"} stroke={dark ? "#2E3C57" : "#C9D1DB"} strokeWidth={4} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <line x1={40} x2={420} y1={260 + r * 140} y2={260 + r * 140} stroke={dark ? "#2E3C57" : "#C9D1DB"} strokeWidth={6} />
            {[0, 1, 2, 3, 4].map((c) => (
              <rect key={c} x={70 + c * 70} y={200 + r * 140} width={50} height={56} rx={4} fill={side ? ["#F6D6E0", "#F28C28", "#DDEBF5", "#F6E7C8"][r] : ["#DDEBF5", "#F6D6E0", "#FFFFFF", "#E8EBF0"][r]} opacity={dark ? 0.25 : 0.9} />
            ))}
          </g>
        ))}
      </g>
    ))}
    <rect x={0} y={780} width={1920} height={300} fill={dark ? "#141C28" : "#DDE4EC"} />
  </g>
);

/* CUT 001 — [REAL(再現) / LEVEL 3] D01: 薬売り場のカゴ。風邪薬の横に卵と牛乳が入る（Close-up → Zoom Out） */
const D01 = mk(({ f, s }) => {
  const items = f < s(1) ? 1 : f < s(1) + 14 ? 2 : 3;
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.7, x: 960, y: 640 }, { at: s(1) + 20, s: 1.7, x: 960, y: 640 }, { at: s(1) + 60, s: 1, x: 960, y: 540 }]}>
          <Aisle />
          <Basket x={960} y={700} s={0.9} items={items} />
        </Cam>
      </Stage>
      <Lines y={-420} lines={[{ t: TITLE_Q, at: -10, size: 80 }]} />
      <Sfx at={s(1)} name="pop" volume={0.4} />
      <Sfx at={s(1) + 14} name="pop" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* D02: 食パンも入る。値札の POP（数字は出さない） */
const D02 = mk(({ f }) => (
  <>
    <Stage>
      <Aisle />
      <Basket x={960} y={700} s={0.9} items={f > 20 ? 4 : 3} />
      <g transform={`translate(1360 330) rotate(8) scale(${pop(f, 6)})`} opacity={fade(f, 6)}>
        <rect x={-110} y={-70} width={220} height={140} rx={14} fill={P.food} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={90} fill="#FFFFFF">
          安
        </text>
      </g>
    </Stage>
    <Sfx at={20} name="pop" volume={0.4} />
  </>
), { bg: "white" });

/* CUT 002 — [IMPACT / LEVEL 4] D03: 4 つの伸び率の棒。食品だけが一番長く伸びる（Zoom In） */
const D03 = mk(({ f, s }) => {
  const g = (at: number) => ease(f, at, at + 30, 0, 1, Easing.out(Easing.cubic));
  const rows = [
    { l: "調剤・ヘルスケア", v: 8.7, c: "#9FB3C8" },
    { l: "化粧品など", v: 11.7, c: "#9FB3C8" },
    { l: "日用品", v: 2.1, c: "#9FB3C8" },
    { l: "食品", v: 13.2, c: P.food },
  ];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1), s: 1 }, { at: s(2) + 20, s: 1.15, x: 1000, y: 620 }]}>
          {rows.map((r, i) => {
            const on = i === 3 ? g(s(1)) : g(s(0) + 10);
            return <HBar key={r.l} x={620} y={220 + i * 130} w={1000} v={(r.v / 14) * on} color={r.c} label={r.l} value={on > 0.95 ? `+${r.v}%` : ""} o={i === 3 ? fade(f, s(1)) : fade(f, s(0))} />;
          })}
        </Cam>
      </Stage>
      <EvidenceMark no="#01" source="日本チェーンドラッグストア協会（2024年度）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 003 — [QUESTION / LEVEL 3] D04: 暗い薬の棚の中で、卵のパックだけが明るい */
const D04 = mk(({ f }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: 80, s: 1.15, y: 600 }]}>
        <Aisle dark />
        <ellipse cx={960} cy={640} rx={240} ry={120} fill="#FFF4D6" opacity={0.15} />
        <Egg x={960} y={640} s={2.2} />
        {[0, 1, 2].map((i) => (
          <MedBox key={i} x={700 + i * 260} y={420} s={0.8} color="#3B4B68" />
        ))}
      </Cam>
    </Stage>
    <Sfx at={4} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 004 — [QUESTION / LEVEL 2] D05: 時計 2:00、財布が二つと「?」の三つ目 */
const D05 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(960 300)" opacity={fade(f, s(0)) * (1 - 0.6 * fade(f, s(1)))}>
        <circle r={140} fill="none" stroke="#F4EEE3" strokeWidth={10} />
        <line x1={0} y1={0} x2={0} y2={-105} stroke="#F4EEE3" strokeWidth={10} strokeLinecap="round" transform={`rotate(${ease(f, s(0), s(0) + 30) * 360})`} />
        <text y={220} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={70} fill={P.food}>
          2:00
        </text>
      </g>
      <g opacity={fade(f, s(1))}>
        <Wallet x={700} y={700} color={P.food} />
        <Wallet x={960} y={700} color={P.beauty} />
        <g transform="translate(1220 700)">
          <rect x={-80} y={-55} width={160} height={110} rx={16} fill="none" stroke="#9FB3C8" strokeWidth={5} strokeDasharray="12 10" />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={80} fill="#9FB3C8">
            ?
          </text>
        </g>
      </g>
    </Stage>
  </>
), { bg: "black" });

/* CUT 005 — [TITLE / LEVEL 2] D06: 薬袋の形のタイトル */
const D06 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #009</div>
        <div style={{ marginTop: 40, background: "#FFFFFF", borderRadius: 18, overflow: "hidden", border: `6px solid ${P.rx}`, transform: `scale(${p})`, opacity: Math.min(1, p * 1.5) }}>
          <div style={{ background: P.rx, color: "#FFFFFF", textAlign: "center", fontSize: 28, fontWeight: 900, letterSpacing: 12, padding: "10px 0" }}>お薬袋 ― KANENAZO</div>
          <div style={{ padding: "34px 60px 40px", fontFamily: SERIF, fontSize: 84, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>{TITLE_Q}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* CUT 006 — [INFOGRAPHIC / LEVEL 1] D07: 黒く塗られたレシート 2 枚 → 業界統計と決算（カメラ固定） */
const Receipt9: React.FC<{ x: number; y: number; title: string; o: number; lockO: number }> = ({ x, y, title, o, lockO }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-230} y={-220} width={460} height={440} fill="#FFFFFF" stroke="#D8D2C6" strokeWidth={3} />
    <text y={-160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
      {title}
    </text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-180} y={-100 + i * 60} width={360} height={36} rx={4} fill="#1E2230" opacity={lockO} />
    ))}
    <text y={180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#9AA3AF" opacity={lockO}>
      非公表
    </text>
  </g>
);
const D07 = mk(({ f, s }) => (
  <>
    <Stage>
      <Receipt9 x={560} y={380} title="食品だけの利益" o={fade(f, s(0) + 10)} lockO={fade(f, s(0) + 30)} />
      <Receipt9 x={1360} y={380} title="商品ごとの原価" o={fade(f, s(1))} lockO={fade(f, s(1) + 16)} />
      <g opacity={fade(f, s(2))}>
        <rect x={700} y={660} width={220} height={150} rx={12} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={730 + i * 44} y={780 - (i + 1) * 26} width={30} height={(i + 1) * 26} fill={P.rx} />
        ))}
        <rect x={1000} y={660} width={220} height={150} rx={12} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={1030} y={690 + i * 28} width={i % 2 ? 110 : 160} height={12} rx={6} fill="#C9D1DB" />
        ))}
      </g>
    </Stage>
    <Sfx at={s(0) + 30} name="tok" volume={0.5} />
  </>
), { bg: "white" });

/* CUT 007 — [GRAPH / LEVEL 2] D08: 日本地図にピンクの十字（店）。10兆307億円のカウントアップ（Zoom Out） */
const D08 = mk(({ f, s }) => {
  const n = Math.round(593 * ease(f, s(0), s(2) + 20, 0, 1, Easing.inOut(Easing.cubic)));
  const oku = Math.round(count(f, s(0) + 10, 60, 0, 100307));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.25, x: 760, y: 470 }, { at: s(2) + 20, s: 1, x: 960, y: 540 }]}>
          <JapanMap x={700} y={470} s={0.95} n={n} cross={P.beauty} r={4.2} />
        </Cam>
        <g opacity={fade(f, s(0))}>
          <text x={1500} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={K.ink}>
            {oku >= 100000 ? `${Math.floor(oku / 10000)}兆${oku % 10000}` : `${(oku / 10000).toFixed(1)}兆`}
            <tspan fontSize={50}>億円</tspan>
          </text>
          <text x={1500} y={390} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            2024年度 全国の売上
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={1500} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={P.beauty}>
            2万3,723<tspan fontSize={44}>店</tspan>
          </text>
          <text x={1500} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.inkSoft}>
            ＋ = 約40店（※イメージ）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本チェーンドラッグストア協会（2024年度）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 008 — [GRAPH / LEVEL 2] D09: 10兆円を 4 つに分けた帯。最大は調剤・ヘルスケア、でも食品もほぼ同じ大きさ */
const SEG = [
  { l: "調剤・ヘルスケア", v: 3.3318, c: P.rx },
  { l: "化粧品など", v: 1.8272, c: P.beauty },
  { l: "日用品", v: 2.0388, c: "#9FB3C8" },
  { l: "食品など", v: 2.8329, c: P.food },
];
const Band: React.FC<{ f: number; at: number; hl: number[]; y?: number; detach?: number }> = ({ f, at, hl, y = 360, detach = 0 }) => {
  const total = SEG.reduce((a, b) => a + b.v, 0);
  let x = 160;
  return (
    <g>
      {SEG.map((sg, i) => {
        const w = (1600 * sg.v) / total;
        const x0 = x;
        x += w;
        const on = hl.length === 0 || hl.includes(i);
        const dy = i === 3 ? detach * 280 : 0;
        return (
          <g key={sg.l} opacity={fade(f, at + i * 8)} transform={`translate(0 ${dy})`}>
            <rect x={x0 + 3} y={y} width={w - 6} height={150} rx={10} fill={sg.c} opacity={on ? 1 : 0.25} />
            <text x={x0 + w / 2} y={y + 60} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#FFFFFF" opacity={on ? 1 : 0.6}>
              {sg.l}
            </text>
            <text x={x0 + w / 2} y={y + 108} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#FFFFFF" opacity={on ? 1 : 0.6}>
              {sg.v.toFixed(2)}兆
            </text>
          </g>
        );
      })}
    </g>
  );
};
const D09 = mk(({ f, s }) => {
  const hl = f < s(1) ? [] : f < s(3) ? [0, 1] : f < s(4) ? [0] : [0, 3];
  return (
    <>
      <Stage>
        <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft} opacity={fade(f, s(0))}>
          10兆307億円の内訳（2024年度）
        </text>
        <Band f={f} at={s(0)} hl={hl} />
        <g transform={`translate(960 680) scale(${pop(f, s(2))})`} opacity={fade(f, s(2)) * (1 - fade(f, s(3)))}>
          <circle r={70} fill="none" stroke={K.ink} strokeWidth={10} />
          <path d="M 0 -70 A 70 70 0 0 1 0 70 Z" fill={K.ink} />
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本チェーンドラッグストア協会" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 009 — [QUESTION / LEVEL 2] D10: 食品の帯が外れて天秤に乗る */
const D10 = mk(({ f, s }) => {
  const d = ease(f, s(0), s(0) + 30);
  const tilt = Math.sin(f / 8) * 6 * fade(f, s(1));
  return (
    <>
      <Stage>
        <Band f={f} at={-40} hl={[3]} detach={d} y={200} />
        <g opacity={fade(f, s(1))} transform="translate(960 760)">
          <g transform={`rotate(${tilt})`}>
            <line x1={-420} x2={420} y1={0} y2={0} stroke={K.ink} strokeWidth={10} />
          </g>
          <path d="M -30 60 L 0 6 L 30 60 Z" fill={K.ink} />
        </g>
        <text x={1560} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={P.food} opacity={fade(f, s(0) + 20)}>
          約3割
        </text>
        <text x={1560} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(0) + 20)}>
          ※2兆8,329億÷10兆307億
        </text>
      </Stage>
      <Sfx at={s(1)} name="question" volume={0.45} />
    </>
  );
}, { bg: "paper" });

/* CUT 010 — [IMPACT / LEVEL 4] D11: 平面図だけ。客の点が食品売り場に何度も入ってくる（BGM なし） */
const D11 = mk(({ f, s }) => {
  const toFood: [number, number][] = [PATH[0], PATH[1], PATH[2]];
  return (
    <>
      <Stage>
        <g transform="translate(240 330) scale(0.75)">
          <StorePlan hl="food" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = ((f - s(1) - i * 22) % 132) / 66;
            if (f < s(1) + i * 22 || t > 1) return null;
            return <Shopper key={i} t={t} pts={toFood} color={P.dark} />;
          })}
        </g>
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 40, fontFamily: SERIF }}>
        <div style={{ fontSize: 46, fontWeight: 900, color: K.inkSoft, opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 60, fontWeight: 900, color: K.ink, marginTop: 6, opacity: fade(f, s(1)), textAlign: "center", lineHeight: 1.35 }}>
          食品は、儲けるための商品ではない。
          <br />
          <span style={{ opacity: fade(f, s(2)) }}>
            客を、<R c={P.food}>何度も来させる</R>ための値段だ。
          </span>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white", noSub: true });

/* CUT 011 — [MONEY FLOW / LEVEL 3] D12: 100円の硬貨を二つ。食品は 85円が仕入れへ出て 15円だけ残り、そこから給料・家賃・電気も出る / 薬は 42円残る */
const Pie: React.FC<{ x: number; y: number; keep: number; color: string; label: string; o: number; eat?: number }> = ({ x, y, keep, color, label, o, eat = 0 }) => {
  const a = keep * Math.PI * 2;
  const R0 = 150;
  const ex = x + R0 * Math.sin(a);
  const ey = y - R0 * Math.cos(a);
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={R0} fill="#E8EBF0" stroke="#C9D1DB" strokeWidth={4} />
      <path d={`M ${x} ${y} L ${x} ${y - R0} A ${R0} ${R0} 0 ${keep > 0.5 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={color} opacity={1 - 0.6 * eat} />
      <text x={x} y={y + R0 + 56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={K.ink}>
        {label}
      </text>
    </g>
  );
};
const D12 = mk(({ f, s }) => {
  const k1 = ease(f, s(0) + 20, s(0) + 60);
  const k2 = ease(f, s(4), s(4) + 40);
  const eat = ease(f, s(3), s(3) + 40);
  return (
    <>
      <Stage>
        <Pie x={560} y={430} keep={1 - 0.849 * k1} color={P.food} label="食品 100円分" o={fade(f, s(0))} eat={eat} />
        <text x={560} y={440} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.ink} opacity={k1}>
          15円
        </text>
        <CoinTrail pts={[[620, 380], [880, 200], [960, 180]]} at={s(0) + 20} n={5} dur={30} gap={6} r={14} />
        <g opacity={fade(f, s(0) + 20)} transform="translate(960 160)">
          <rect x={-90} y={-36} width={180} height={72} rx={14} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={4} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.inkSoft}>
            仕入れ
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          {["給料", "家賃", "電気"].map((t, i) => (
            <g key={t} transform={`translate(${380 + i * 180} 740)`}>
              <rect x={-70} y={-30} width={140} height={60} rx={30} fill="#FFFFFF" stroke={P.red} strokeWidth={4} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill={P.red}>
                {t}
              </text>
            </g>
          ))}
        </g>
        <Pie x={1360} y={430} keep={1 - 0.577 * k2} color={P.beauty} label="薬 100円分" o={fade(f, s(4))} />
        <text x={1360} y={440} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.ink} opacity={k2}>
          42円
        </text>
        <CoinTrail pts={[[1300, 380], [1040, 200], [960, 180]]} at={s(4)} n={3} dur={30} gap={6} r={14} />
        <text x={1860} y={880} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={22} fill={K.inkSoft}>
          ※粗利率（2019年の報道）から計算
        </text>
      </Stage>
      <EvidenceMark no="#05" source="ダイヤモンド・オンライン（2019年）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 012 — [STORY / LEVEL 3] D13: 1 週間のカレンダー（薬は 1 回、卵・牛乳は何度も）→ 平面図を歩く客、化粧品の前で「ついで」の硬貨 */
const D13 = mk(({ f, s }) => {
  const walk = ((f - s(2)) % 150) / 150;
  const days = ["月", "火", "水", "木", "金", "土", "日"];
  const drop = f > s(3) && walk > 0.5;
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))} transform="translate(560 170)">
          {days.map((d, i) => (
            <g key={d} transform={`translate(${i * 115} 0)`}>
              <rect x={0} y={0} width={100} height={150} rx={10} fill="#FFFFFF" stroke="#C9D1DB" strokeWidth={3} />
              <text x={50} y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={K.inkSoft}>
                {d}
              </text>
              {i === 2 && <MedBox x={50} y={96} s={0.6} />}
              {[0, 3, 5].includes(i) && <Egg x={50} y={96} s={0.6} />}
            </g>
          ))}
          {[0, 3, 5].map((i) => (
            <rect key={i} x={i * 115} y={0} width={100} height={150} rx={10} fill="none" stroke={P.food} strokeWidth={5} opacity={fade(f, s(1))} />
          ))}
        </g>
        <g transform="translate(384 390) scale(0.6)" opacity={fade(f, s(2))}>
          <StorePlan />
          {f > s(2) && <Shopper t={walk} r={22} />}
          {drop && <Coin8 x={960} y={440} r={22} />}
        </g>
      </Stage>
    </>
  );
}, { bg: "white" });

/* CUT 013 — [GRAPH / LEVEL 2] D13B: 2000 約2.6兆 → 2009 登録販売者 → 2020 8兆 → 2024 10兆（点だけ、間は点線・イメージ） */
const D13B = mk(({ f, s }) => {
  const X = (y: number) => 260 + ((y - 1998) / 28) * 1400;
  const Y = (v: number) => 780 - v * 52;
  const pts = [
    { y: 2000, v: 2.6, at: s(1), l: "約2.6兆" },
    { y: 2020, v: 8.0363, at: s(7), l: "8兆" },
    { y: 2024, v: 10.0307, at: s(7) + 30, l: "10兆" },
  ];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.15, x: 600, y: 600 }, { at: s(4), s: 1.1, x: 900, y: 560 }, { at: s(7) + 40, s: 1, x: 960, y: 540 }]}>
          <line x1={220} x2={1720} y1={780} y2={780} stroke={K.ink} strokeWidth={4} />
          {[2000, 2009, 2020, 2024].map((y) => (
            <text key={y} x={X(y)} y={826} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft} opacity={fade(f, s(1))}>
              {y}
            </text>
          ))}
          <path d={`M ${X(2000)} ${Y(2.6)} L ${X(2020)} ${Y(8.0363)} L ${X(2024)} ${Y(10.0307)}`} stroke="#C9D1DB" strokeWidth={6} strokeDasharray="14 10" fill="none" opacity={fade(f, s(7) + 30)} />
          {pts.map((p) => (
            <g key={p.y} opacity={fade(f, p.at)}>
              <circle cx={X(p.y)} cy={Y(p.v)} r={18} fill={P.beauty} />
              <text x={X(p.y)} y={Y(p.v) - 36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={P.beauty}>
                {p.l}
              </text>
            </g>
          ))}
          <g opacity={fade(f, s(3))}>
            <line x1={X(2009)} x2={X(2009)} y1={300} y2={780} stroke={P.rx} strokeWidth={5} strokeDasharray="12 8" />
            <g transform={`translate(${X(2009)} 270)`}>
              <rect x={-150} y={-40} width={300} height={80} rx={14} fill="#FFFFFF" stroke={P.rx} strokeWidth={5} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={32} fill={P.rx}>
                登録販売者
              </text>
            </g>
          </g>
          <text x={1700} y={880} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={22} fill={K.inkSoft} opacity={fade(f, s(7))}>
            ※点の間はイメージ
          </text>
        </Cam>
      </Stage>
      <EvidenceMark no="#19" source="日本チェーンドラッグストア協会・大和総研" at={s(1)} />
    </>
  );
}, { bg: "white" });

export const OPEN9 = { D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D13B };
export { InsCard, Lock };
