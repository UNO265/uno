/** CUT 033–047（J30–J43）。出口はすべて悪循環のループの「どの枠を切るか」で結ぶ（06-38 PAYOFF: 新しい資料より手がかりの接続）→ ホームへ戻る → MONEY FLOW → FINAL → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, count, mk } from "../case002/ui";
import { FNode } from "../case006/kit";
import { CanClue, Easing, FONT, K, Led, Machine, Mini, SERIF, Sfx, Street, Truck, V, Walker, ease, fade, pop } from "./kit";
import { BottleTrail, Cam, CoinTrail, DrugStore, Person8, Platform, Sys, along } from "./kit2";

/* 小さな悪循環のループ（CUT 030 と同じ 5 枠）。hl: 光る枠、ok: 緑になった枠 */
const LOOP = ["値上げ", "本数 ↓", "1台の売上 ↓", "費用そのまま", "赤字 ↑"];
const loopPos = (i: number, cx: number, cy: number, r: number): [number, number] => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / LOOP.length;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const MiniLoop: React.FC<{ cx: number; cy: number; r?: number; hl?: number[]; ok?: number[]; o?: number; dark?: boolean }> = ({ cx, cy, r = 190, hl = [], ok = [], o = 1, dark }) => (
  <g opacity={o}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "#2E3C57" : "#E4DED2"} strokeWidth={10} />
    {LOOP.map((t, i) => {
      const [x, y] = loopPos(i, cx, cy, r);
      const c = ok.includes(i) ? V.green : hl.includes(i) ? V.red : dark ? "#5E6B7D" : "#9AA3AF";
      return (
        <g key={t} transform={`translate(${x} ${y})`}>
          <rect x={-100} y={-28} width={200} height={56} rx={28} fill={dark ? "#0D1628" : "#FFFFFF"} stroke={c} strokeWidth={5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={24} fill={c}>
            {t}
          </text>
        </g>
      );
    })}
  </g>
);
const ROUTES = [
  { t: "① 減らす", node: 1 },
  { t: "② 組む", node: 3 },
  { t: "③ 値段を動かす", node: 0 },
  { t: "④ 逆のモデル", node: 4 },
];
/* 右上の小さなループ（出口の説明中、今どの枠を切っているか） */
const Corner: React.FC<{ f: number; at: number; ok: number[] }> = ({ f, at, ok }) => <MiniLoop cx={1690} cy={230} r={120} ok={ok} o={fade(f, at) * 0.95} />;

/* CUT 033 — [INFOGRAPHIC / LEVEL 2] J30: ループ（小）と出口 4 つ。各出口がどの枠を切るかを線で */
const J30 = mk(({ f, s }) => (
  <>
    <Stage>
      <MiniLoop cx={560} cy={500} r={230} dark o={fade(f, 0)} />
      {ROUTES.map((r, i) => {
        const at = s(1) + i * 10;
        const [nx, ny] = loopPos(r.node, 560, 500, 230);
        const y = 260 + i * 150;
        return (
          <g key={r.t} opacity={fade(f, at)}>
            <line x1={nx + 100} y1={ny} x2={1180} y2={y} stroke={V.band} strokeWidth={4} strokeDasharray="10 8" />
            <g transform={`translate(1380 ${y}) scale(${pop(f, at)})`}>
              <rect x={-200} y={-50} width={400} height={100} rx={20} fill="rgba(31,122,140,0.25)" stroke={V.band} strokeWidth={5} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#F4EEE3">
                {r.t}
              </text>
            </g>
          </g>
        );
      })}
    </Stage>
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black" });

/* CUT 034 — [SIMULATION / LEVEL 2] J31: 弱い 4 台が抜け、残った 4 台の本数ゲージが上がる → 「本数」の枠が緑に */
const J31 = mk(({ f, s }) => {
  const rm = ease(f, s(1), s(1) + 30);
  const up = ease(f, s(2), s(2) + 30);
  const weak = [1, 3, 4, 6];
  return (
    <>
      <Stage>
        {Array.from({ length: 8 }, (_, i) => {
          const isWeak = weak.includes(i);
          const g = isWeak ? 0.2 : 0.45 + 0.4 * up;
          return (
            <g key={i} opacity={isWeak ? 1 - rm : 1} transform={`translate(0 ${isWeak ? 80 * rm : 0})`}>
              <Mini x={200 + i * 180} y={660} s={1.2} />
              <rect x={170 + i * 180} y={440} width={60} height={160} rx={10} fill="#E8EBF0" />
              <rect x={170 + i * 180} y={440 + 160 * (1 - g)} width={60} height={160 * g} rx={10} fill={isWeak ? V.red : V.blue} />
            </g>
          );
        })}
        <text x={900} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(2))}>
          棒 ＝ 1台が売る本数（イメージ）
        </text>
        <text x={400} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink} opacity={fade(f, s(3))}>
          ダイドー 約2万台（報道）
        </text>
        <Corner f={f} at={s(0)} ok={f > s(2) + 20 ? [1] : []} />
      </Stage>
      <EvidenceMark no="#11" source="報道" at={s(3)} />
    </>
  );
}, { bg: "white" });

/* CUT 035 — [MONEY FLOW / LEVEL 2] J32: 2 社の補充トラックが 1 本の道に合流（Tracking）→ 費用ブロックを 2 社で分けて背負う */
const J32 = mk(({ f, s }) => {
  const merge = ease(f, s(1), s(1) + 50);
  const split = ease(f, s(4), s(4) + 30);
  const pA: [number, number][] = [[140, 380], [700, 380], [960, 520], [1300, 520]];
  const pB: [number, number][] = [[140, 700], [700, 700], [960, 540], [1300, 540]];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 600, y: 540 }, { at: s(1) + 50, s: 1, x: 960, y: 540 }]}>
          <path d="M 140 380 L 700 380 L 960 530 L 1400 530" stroke="#D5DBE3" strokeWidth={36} fill="none" strokeLinejoin="round" />
          <path d="M 140 700 L 700 700 L 960 530" stroke="#D5DBE3" strokeWidth={36} fill="none" strokeLinejoin="round" />
          {(() => {
            const [ax, ay] = along(pA, merge * 0.9);
            const [bx, by] = along(pB, merge * 0.78);
            return (
              <>
                <Truck x={ax} y={ay + 10} s={0.6} color={V.band} />
                <Truck x={bx} y={by + 10} s={0.6} color="#C98A2B" />
              </>
            );
          })()}
          <text x={300} y={330} fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.band} opacity={fade(f, s(2))}>
            ダイドー × アサヒ飲料（2023 共同運営）
          </text>
          <text x={300} y={780} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#C98A2B" opacity={fade(f, s(3))}>
            伊藤園 × キリン（点検・修理）
          </text>
          {/* 費用ブロックを二つに */}
          <g opacity={fade(f, s(4))} transform="translate(1600 520)">
            <rect x={-130 - 30 * split} y={-110} width={130} height={220} rx={12} fill={V.red} opacity={0.9} />
            <rect x={0 + 30 * split} y={-110} width={130} height={220} rx={12} fill={V.red} opacity={0.9} />
            <text x={-65 - 30 * split} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={V.band}>
              A
            </text>
            <text x={65 + 30 * split} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#C98A2B">
              B
            </text>
          </g>
        </Cam>
        <Corner f={f} at={s(0)} ok={f > s(4) + 20 ? [3] : []} />
      </Stage>
      <EvidenceMark no="#17" source="報道（日本経済新聞・東洋経済）" at={s(2)} />
    </>
  );
}, { bg: "paper" });

/* CUT 036 — [GRAPH / LEVEL 2] J33: 24 時間の値段の線。夜の区間で −10円（報道・イメージ） */
const J33 = mk(({ f, s }) => {
  const t = ease(f, s(1), s(2) + 40);
  const hour = Math.floor(24 * t);
  const night = hour >= 22 || hour < 6 ? 1 : 0;
  const X = (h: number) => 260 + h * 55;
  const Y = (h: number) => (h >= 22 || h < 6 ? 560 : 440);
  const pts = Array.from({ length: 25 }, (_, h) => `${X(h)} ${Y(h % 24)}`);
  return (
    <>
      <Stage>
        <rect x={200} y={300} width={1420} height={400} rx={20} fill={night ? V.night : "#DCEBF7"} opacity={0.9} />
        <line x1={X(0)} x2={X(24)} y1={640} y2={640} stroke={night ? "#5E6B7D" : K.ink} strokeWidth={3} />
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={X(h)} y={680} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontSize={26} fill={night ? "#C9D6E6" : K.inkSoft}>
            {h}時
          </text>
        ))}
        <clipPath id="c33">
          <rect x={0} y={0} width={X(24 * t)} height={1080} />
        </clipPath>
        <polyline points={pts.join(" ")} fill="none" stroke={V.led} strokeWidth={10} clipPath="url(#c33)" strokeLinejoin="round" />
        <Led x={X(24 * t)} y={Y(hour % 24) - 70} text={night ? "190" : "200"} size={44} w={130} o={fade(f, s(1))} />
        <text x={1560} y={260} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft} opacity={fade(f, s(1))}>
          コカ･コーラBJ 2023年5月〜（通信でつながった自販機）
        </text>
        <text x={1560} y={760} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(2))}>
          ※夜 −10円は報道・値段の線はイメージ
        </text>
        <Corner f={f} at={s(0)} ok={f > s(3) ? [0] : []} />
      </Stage>
      <EvidenceMark no="#18" source="報道（日本経済新聞・時事通信）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 037 — [EVIDENCE / LEVEL 2] J33B: 事業利益 245億円（2倍）/ 市場の線は下がり、CCBJ の線は平ら（イメージ） */
const J33B = mk(({ f, s }) => {
  const d = ease(f, s(2), s(2) + 50);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <text x={440} y={280} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            事業利益（2025年12月期）
          </text>
          <text x={440} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={V.green}>
            245<tspan fontSize={60}>億円</tspan>
          </text>
          <text x={440} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
            前期の 約2倍
          </text>
        </g>
        <g opacity={fade(f, s(2))} transform="translate(900 250)">
          <line x1={0} y1={400} x2={800} y2={400} stroke={K.ink} strokeWidth={4} />
          <line x1={0} y1={150} x2={800 * d} y2={150 + 180 * d} stroke="#9AA3AF" strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={150} x2={800 * d} y2={150} stroke={V.band} strokeWidth={10} strokeLinecap="round" />
          <text x={810} y={340} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#9AA3AF" opacity={d}>
            市場
          </text>
          <text x={810} y={160} fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.band} opacity={d}>
            前年並み
          </text>
          <text x={400} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            自販機の販売数量 2026年1〜3月（※線はイメージ）
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          {[0, 1, 2].map((i) => (
            <Machine key={i} x={250 + i * 200} y={860} s={0.28} prices={i === 1 ? Array(12).fill("180") : undefined} />
          ))}
          <text x={450} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
            AI 品ぞろえ ＋ 公式アプリ
          </text>
        </g>
        <Corner f={f} at={s(0)} ok={f > s(4) ? [1] : []} />
      </Stage>
      <EvidenceMark no="#15" source="CCBJH 決算（日本経済新聞・食品新聞）" at={s(1)} />
    </>
  );
}, { bg: "paper" });

/* CUT 038 — [REAL(再現) / LEVEL 2] J34: 路地の 100円自販機。4 つの理由が費用ブロックを削る / 100 台の格子に 1 台だけ灯る（1% 未満） */
const J34 = mk(({ f, s }) => {
  const shave = (at: number) => ease(f, at, at + 20);
  const cuts = [
    { t: "賞味期限が近い", at: s(2) },
    { t: "複数メーカー", at: s(2) + 30 },
    { t: "古い機械", at: s(3) },
    { t: "安い場所", at: s(3) + 30 },
  ];
  const grid = fade(f, s(5));
  return (
    <>
      <Stage>
        <g opacity={1 - grid}>
          <Cam keys={[{ at: 0, s: 1.25, x: 520, y: 520 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
            <rect x={0} y={840} width={1920} height={240} fill={V.street} />
            <rect x={120} y={120} width={180} height={720} fill="#1B2740" />
            <rect x={820} y={160} width={220} height={680} fill="#1B2740" />
            <Machine x={520} y={840} s={0.72} prices={Array(12).fill("100")} led="100" o={fade(f, s(1))} />
            {cuts.map((c, i) => (
              <g key={i} transform={`translate(1400 ${230 + i * 140})`} opacity={fade(f, c.at)}>
                <rect x={-260} y={-50} width={520} height={100} rx={14} fill="rgba(224,86,78,0.85)" />
                <rect x={-260 + 520 * (1 - 0.35 * shave(c.at))} y={-50} width={520 * 0.35 * shave(c.at)} height={100} rx={14} fill="#0D1628" />
                <text x={-230} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#FFFFFF">
                  {c.t}
                </text>
              </g>
            ))}
            <text x={1400} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#FFD66E" opacity={fade(f, s(4))}>
              値段を決めるのは 持ち主
            </text>
          </Cam>
        </g>
        <g opacity={grid}>
          {Array.from({ length: 100 }, (_, i) => (
            <g key={i}>
              <rect x={360 + (i % 20) * 62 - 16} y={250 + Math.floor(i / 20) * 120 - 56} width={32} height={56} rx={4} fill="none" stroke="#3B4B68" strokeWidth={2} />
              {i === 47 && <Mini x={360 + (i % 20) * 62} y={250 + Math.floor(i / 20) * 120} s={0.4} lit={1} />}
            </g>
          ))}
          <text x={960} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#FFD66E">
            100円の自販機 1%未満（報道）
          </text>
        </g>
        <Corner f={f} at={s(0)} ok={f > s(3) + 30 ? [4] : []} />
      </Stage>
      <EvidenceMark no="#19" source="日本経済新聞・TOKYO MX（報道）" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 039 — [GRAPH / LEVEL 2] J35: 電気の棒は −52.5%、人の棒は変わらない（イメージ） */
const J35 = mk(({ f, s }) => {
  const e = ease(f, s(1) + 10, s(1) + 50);
  const base = 720;
  return (
    <>
      <Stage>
        <line x1={260} x2={1660} y1={base} y2={base} stroke={K.ink} strokeWidth={5} />
        <g opacity={fade(f, s(1))}>
          <rect x={360} y={base - 420} width={220} height={420} rx={10} fill="#9FB3C8" />
          <rect x={640} y={base - 420 * (1 - 0.525 * e)} width={220} height={420 * (1 - 0.525 * e)} rx={10} fill={V.green} />
          <text x={470} y={base + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            2005
          </text>
          <text x={750} y={base + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            2014
          </text>
          <text x={750} y={base - 420 * (1 - 0.525 * e) - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={V.green} opacity={e}>
            −52.5%
          </text>
          <text x={610} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            電気（1台・1年）
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <rect x={1100} y={base - 420} width={220} height={420} rx={10} fill={V.blue} />
          <rect x={1380} y={base - 420} width={220} height={420} rx={10} fill={V.blue} />
          {[1210, 1490].map((x) => (
            <Walker key={x} x={x} y={base - 120} s={1.1} color="#FFFFFF" />
          ))}
          <text x={1350} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
            補充の人手
          </text>
          <text x={1350} y={base + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
            ※イメージ / 人手不足・高齢化
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(2) ? "#20" : "#06"} source={f < s(2) ? "全国清涼飲料連合会" : "業界の解説"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 040 — [SIMULATION / LEVEL 3] J35B: 事務所の画面で売り切れ間近（赤）だけを見て、赤い台だけ回る（Top View, Tracking） */
const J35B = mk(({ f, s }) => {
  const low = [2, 5, 9];
  const pos = (i: number): [number, number] => [720 + (i % 6) * 190, 380 + Math.floor(i / 6) * 240];
  const oldRoute: [number, number][] = Array.from({ length: 12 }, (_, i) => pos(i < 6 ? i : 17 - i)).map(([x, y]) => [x, y + 40] as [number, number]);
  const newRoute: [number, number][] = [[620, 820], ...low.map((i) => [pos(i)[0], pos(i)[1] + 40] as [number, number]), [1860, 820]];
  const tOld = ((f - s(1)) % 200) / 200;
  const tNew = ease(f, s(2), s(2) + 120);
  const [ox, oy] = along(oldRoute, Math.max(0, tOld));
  const [nx, ny] = along(newRoute, tNew);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1))}>
          <rect x={120} y={200} width={420} height={300} rx={20} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          <text x={330} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            事務所の画面
          </text>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={160 + (i % 4) * 90} y={300 + Math.floor(i / 4) * 60} width={70} height={40} rx={6} fill={low.includes(i) ? V.red : V.green} opacity={0.85} />
          ))}
        </g>
        {Array.from({ length: 12 }, (_, i) => {
          const [x, y] = pos(i);
          return (
            <g key={i}>
              <Mini x={x} y={y} s={0.9} />
              <circle cx={x + 38} cy={y - 150} r={16} fill={low.includes(i) ? V.red : V.green} opacity={fade(f, s(1) + 10)} />
            </g>
          );
        })}
        <g opacity={f < s(2) ? fade(f, s(1)) : 0.25}>
          <path d={`M ${oldRoute.map((p) => p.join(" ")).join(" L ")}`} stroke="#9AA3AF" strokeWidth={6} fill="none" strokeDasharray="14 10" />
          {f < s(2) && <Truck x={ox} y={oy + 20} s={0.45} color="#9AA3AF" />}
        </g>
        <g opacity={fade(f, s(2))}>
          <path d={`M ${newRoute.map((p) => p.join(" ")).join(" L ")}`} stroke={V.blue} strokeWidth={10} fill="none" strokeDasharray="30 18" strokeDashoffset={-f * 3} />
          <Truck x={nx} y={ny + 20} s={0.5} color={V.blue} />
        </g>
        <g opacity={fade(f, s(3)) * (1 - fade(f, s(4)))}>
          <rect x={120} y={540} width={420} height={230} rx={20} fill="#F2F4F7" />
          <text x={330} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            ダイドー（2020年の計画）
          </text>
          <text x={330} y={665} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
            直営 約8万台を通信化
          </text>
          <text x={330} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={V.blue}>
            補充の人 3割減
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <rect x={120} y={540} width={420} height={230} rx={20} fill="#F2F4F7" />
          <text x={330} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            コカ･コーラBJ（報道）
          </text>
          <text x={330} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            データで 場所・品ぞろえ
          </text>
          <text x={330} y={710} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
            補充の回数を決める
          </text>
        </g>
        <Corner f={f} at={s(0)} ok={f > s(2) + 60 ? [3] : []} />
      </Stage>
      <EvidenceMark no="#23" source={f < s(4) ? "日本経済新聞（2020年）" : "日本経済新聞・時事通信（報道）"} at={s(3)} />
    </>
  );
}, { bg: "white" });

/* CUT 041 — [QUESTION / LEVEL 1] J36 */
const J36 = mk(({ s }) => (
  <>
    <Lines dark y={-60} lines={[{ t: <>自販機は、<R>これから</R>？</>, at: s(0), size: 96 }]} />
    <Sfx at={s(0)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* CUT 042 — [GRAPH / LEVEL 2] J37: 2050 へ飲料の自販機が半分に（報道）、冷凍の自販機が増える、1 回の金額が大きい */
const J37 = mk(({ f, s }) => {
  const half = ease(f, s(0) + 20, s(0) + 60);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 600, y: 480 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(0))}>
            {Array.from({ length: 10 }, (_, i) => (
              <Mini key={i} x={170 + (i % 5) * 150} y={360 + Math.floor(i / 5) * 190} s={0.9} lit={i >= 10 - 5 * half ? 0.02 : 1} />
            ))}
            <text x={480} y={200} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={50} fill={K.inkSoft}>
              {Math.round(2025 + 25 * half)}
            </text>
            <text x={480} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={V.red}>
              飲み物の自販機 半分も（報道）
            </text>
          </g>
          <g opacity={fade(f, s(2))} transform="translate(1380 380)">
            <rect x={-120} y={-200} width={240} height={330} rx={14} fill="#E8F1FA" stroke="#0B1220" strokeWidth={4} />
            <rect x={-100} y={-180} width={200} height={170} rx={6} fill="#BFDDF5" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-88 + (i % 2) * 92} y={-168 + Math.floor(i / 2) * 80} width={84} height={70} rx={6} fill="#FFFFFF" stroke="#9FB3C8" strokeWidth={3} />
            ))}
            <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={V.blue}>
              冷凍
            </text>
            <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={V.blue} opacity={fade(f, s(3))}>
              8万1,000台
            </text>
            <text y={270} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
              食品の自販機（2025年）
            </text>
          </g>
          <g opacity={fade(f, s(4))} transform="translate(1100 700)">
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={i * 40} cy={0} r={18} fill={V.coin} stroke="#B8902A" strokeWidth={3} />
            ))}
            <text x={80} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={K.inkSoft}>
              1回の金額
            </text>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#21" source="日本経済新聞・工業会（2次引用）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 043 — [STORY / LEVEL 3] J37B: 最初のホームへ戻る（CUT 001 のコールバック）。同じ人が今度はアプリ（スタンプ 15 個で 1 本）/ 急がない日はドラッグストアの袋 */
const J37B = mk(({ f, s }) => {
  const stamps = Math.round(count(f, s(4), 60, 0, 15));
  const walk = ease(f, s(1), s(1) + 60);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3), s: 1 }, { at: s(4), s: 1.2, x: 1000, y: 520 }, { at: s(6), s: 1, x: 960, y: 540 }]}>
          <Platform />
          <Machine x={760} y={790} s={0.72} led="200" />
          <DrugStore x={1640} y={790} s={0.7} o={fade(f, s(1))} />
          <Person8 x={1500 - 300 * walk} y={790} s={1} color="#C9D6E6" step={walk < 1 ? f / 3 : 0} bag={f > s(2)} o={fade(f, s(1))} />
          {/* アプリ */}
          <g opacity={fade(f, s(3))} transform="translate(1040 420)">
            <rect x={-130} y={-230} width={260} height={460} rx={30} fill="#0B1220" stroke="#EAF2FF" strokeWidth={5} />
            <rect x={-110} y={-200} width={220} height={400} rx={14} fill="#F4F6F8" />
            {Array.from({ length: 15 }, (_, i) => (
              <circle key={i} cx={-66 + (i % 3) * 66} cy={-150 + Math.floor(i / 3) * 64} r={24} fill={i < stamps ? V.red : "#DDE3EA"} />
            ))}
            {stamps >= 15 && (
              <g transform={`scale(${pop(f, s(4) + 62)})`}>
                <rect x={-100} y={140} width={200} height={50} rx={10} fill={V.green} />
                <text y={166} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#FFFFFF">
                  1本 無料
                </text>
              </g>
            )}
          </g>
          <text x={1040} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6" opacity={fade(f, s(5))}>
            サントリーも 2025年3月〜 全国
          </text>
        </Cam>
      </Stage>
      <EvidenceMark no="#24" source={f < s(5) ? "コカ･コーラ 公式アプリ" : "サントリー 発表（2025年3月）"} at={s(4)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 044 — [MONEY FLOW / LEVEL 3] J38: 全体の構造。ボトルは客へ、硬貨は自販機 → 場所・補充・原価・機械・会社へ分かれる（字幕なし） */
const J38 = mk(({ f }) => {
  const st = (k: number) => fade(f, 6 + k * 22);
  const m: [number, number] = [860, 360];
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.15, x: 860, y: 420 }, { at: 120, s: 1, x: 960, y: 540 }]}>
          <FNode x={1560} y={360} label="客" o={st(0)} />
          <Machine x={m[0]} y={500} s={0.3} led="200" />
          <FNode x={260} y={360} label="飲料会社" o={st(1)} color={V.band} />
          <BottleTrail pts={[[940, 330], [1440, 330]]} at={6} n={20} dur={40} gap={20} s={0.55} loop />
          <CoinTrail pts={[[1440, 400], [940, 400]]} at={10} n={20} dur={36} gap={20} loop />
          <CoinTrail pts={[[780, 400], [390, 400]]} at={30} n={20} dur={36} gap={20} loop />
          {[
            { l: "場所の持ち主", x: 520, c: "#C98A2B" },
            { l: "補充の人", x: 860, c: V.blue },
            { l: "機械", x: 1200, c: V.red },
          ].map((d, i) => (
            <g key={d.l}>
              <FNode x={d.x} y={660} label={d.l} o={st(2)} color={d.c} w={300} />
              <CoinTrail pts={[[m[0], 520], [d.x, 590]]} at={50 + i * 10} n={20} dur={30} gap={26} loop />
            </g>
          ))}
          <g opacity={st(3)}>
            <MiniLoop cx={1620} cy={790} r={95} hl={[0, 1, 2, 3, 4]} />
          </g>
        </Cam>
      </Stage>
      <Sfx at={8} name="whoosh" volume={0.35} />
    </>
  );
}, { bg: "white", noSub: true });

/* CUT 045 — [CLUE / LEVEL 3] J39 */
const J39 = mk(({ s }) => <CanClue no="FINAL" at={s(0) + 8} />, { bg: "paper", noSub: true });

/* CUT 046 — [IMPACT / LEVEL 4 HERO] J40: 最終の答え。最後の一文で列の端の 1 台の灯りが消える */
const J40 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: s(2) + 40, s: 1.08, y: 600 }]}>
        <Street n={9} on={f > s(2) + 30 ? 8 : 9} y={880} s={1.1} x0={200} x1={1720} />
      </Cam>
    </Stage>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110, fontFamily: SERIF }}>
      <div style={{ fontSize: 70, fontWeight: 900, color: "#FFFFFF", opacity: fade(f, s(0)), textAlign: "center", lineHeight: 1.4, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
        答えは――1台が売る本数が減っても、
        <br />
        <span style={{ color: "#FFD66E" }}>1台を動かす費用は減らない</span>から。
      </div>
    </AbsoluteFill>
    <Sfx at={s(2) + 30} name="tok" volume={0.35} />
  </>
), { bg: "night", noSub: true });

/* CUT 047 — [ENDING] J41–J43: 固定エンディング（名前は音声で 1 回、画面はロゴ） */
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

export const EXIT8 = { J30, J31, J32, J33, J33B, J34, J35, J35B, J36, J37, J37B, J38, J39, J40, J41, J42, J43 };
export { Sys };
