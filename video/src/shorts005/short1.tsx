/**
 * CASE #005 入口ショート「送料無料、本当に無料？」（ショート指針 v1 + CASE #004 と同じ反復再生形）
 * 0秒 箱 + 本編タイトルの問い → 注文画面「送料0円」→ 箱の道のり → 1個711円（ヤマト 2025年3月期）→ 1個ごとに運賃
 * → 0円ではない（本編 REWARD 1）→ 本編サムネイルと同じ「箱 + 0円 + 誰が払う？」→ 最後の 0.5 秒で S01 の画面へ戻る
 * 本編の MID REVEAL（運ぶ人の時間）と最終答えは言わない。
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Box, Phone } from "../case005/kit";
import { BLACK, C, Chip, FONT, Hook, NIGHT, NO_HEAD, Src, V, WHITE, count, ease, fade, mk, pop } from "../shorts003/parts";

const YEN = "#FFE14D";
const HOOK = <Hook y={300} sizes={[110, 130]} lines={["送料無料、", <>本当に<Red>無料</Red>？</>]} />;
/** S01 と S06 の最後で同じ位置・同じ大きさの箱（ループのつなぎ目） */
const HeroBox: React.FC<{ s?: number; ghost?: number }> = ({ s = 1.05, ghost = 0 }) => <Box x={540} y={1060} s={s} ghost={ghost} />;

/* S01 0秒: 問いの文字と箱。箱は 0 フレームから小さく脈打つ */
const S01 = mk(({ f }) => (
  <>
    {HOOK}
    <V>
      <HeroBox s={1.05 + 0.025 * Math.sin(f / 5)} />
    </V>
  </>
), { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

/* S02 注文画面「送料 ¥0」→ でも運ぶ仕事はある */
const S02 = mk(({ f, s }) => (
  <V>
    <Phone x={540} y={800} s={0.95} tap={s(0) + 18} />
    <Chip f={f} at={s(1)} x={540} y={300} text="運ぶ仕事は、ある" color="#FFFFFF" fill={C.red} size={60} />
  </V>
), { ...NO_HEAD, bg: WHITE });

/* S02B 箱の道のり（縦）: 倉庫 → 仕分けの拠点 → 夜のトラック → 玄関 */
const S02B = mk(({ f, s }) => {
  const nodes = [
    { y: 360, t: "倉庫" },
    { y: 590, t: "仕分けの拠点" },
    { y: 820, t: "夜のトラック" },
    { y: 1050, t: "玄関" },
  ];
  const k = Math.min(3, Math.max(0, (f - 4) / ((s(1) + 30 - 4) / 3)));
  const by = 360 + 230 * k;
  return (
    <V>
      <line x1={330} x2={330} y1={360} y2={360 + 690 * Math.min(1, k / 3 + 0.02)} stroke="#8FD3FF" strokeWidth={10} />
      {nodes.map((n, i) => (
        <g key={i} opacity={fade(f, i * ((s(1) + 30) / 4))}>
          <circle cx={330} cy={n.y} r={30} fill="#0F2340" stroke="#8FD3FF" strokeWidth={8} />
          <text x={400} y={n.y} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#EAF6FF">
            {n.t}
          </text>
        </g>
      ))}
      <g transform={`translate(230 ${by}) scale(0.2)`}>
        <Box x={0} y={0} />
      </g>
    </V>
  );
}, { ...NO_HEAD, bg: NIGHT, dark: true });

/* S03 1個 711円（ヤマト運輸・宅配便3商品の平均, 2025年3月期）。※大口の割引を含む */
const S03 = mk(({ f, s }) => {
  const n = count(f, s(1) - 4, 20, 711);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.inkSoft, opacity: fade(f, s(0)) }}>宅配便 1個の平均単価</div>
        <div style={{ fontSize: 280, fontWeight: 900, color: C.ink, lineHeight: 1.15, opacity: fade(f, s(1) - 4, 4) }}>
          {n}
          <span style={{ fontSize: 130 }}>円</span>
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: C.inkSoft, opacity: fade(f, s(2)) }}>※大口の割引を含む平均</div>
      </div>
      <V>
        <Src f={f} at={s(0)} text="ヤマトHD 決算・宅配便3商品（2025年3月期）" />
      </V>
      <Sfx at={s(1) + 14} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE, noCap: true });

/* S04 1個ごとに運賃: 箱 → 運送会社へ ¥ */
const S04 = mk(({ f, s }) => {
  const m = ease(f, s(0) + 10, s(0) + 40);
  return (
    <V>
      <Box x={300} y={760} s={0.45} sticker={0} />
      <path d="M 460 760 L 700 760" stroke={C.ink} strokeWidth={10} strokeDasharray="26 18" strokeDashoffset={-f * 3} />
      <g transform={`translate(${460 + 240 * m} ${700})`} opacity={fade(f, s(0) + 6)}>
        <circle r={46} fill="#F4D35E" stroke="#B8902A" strokeWidth={6} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#7A5A10">
          ¥
        </text>
      </g>
      <rect x={720} y={680} width={300} height={160} rx={24} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
      <text x={870} y={760} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink}>
        運送会社
      </text>
      <Chip f={f} at={s(0) + 20} x={540} y={420} text="1個ごとに運賃" color={C.ink} size={64} />
    </V>
  );
}, { ...NO_HEAD, bg: WHITE });

/* S05 0円ではない（本編 REWARD 1）。ステッカーが透ける */
const S05 = mk(({ f, s }) => (
  <>
    <Big
      y={470}
      dark
      lines={[
        { t: "運ぶお金は、", at: s(0), size: 96, serif: true },
        { t: <><Red>0円</Red>ではない。</>, at: s(0) + 12, size: 130, serif: true },
      ]}
    />
    <V>
      <Box x={540} y={960} s={0.8} ghost={ease(f, s(1), s(1) + 30)} />
    </V>
  </>
), { ...NO_HEAD, bg: NIGHT, dark: true, hide: [0] });

/* S06 本編サムネイルと同じ絵: 箱 + 0円 + 誰が払う？ → 最後の 0.5 秒で S01 へ（ループ） */
const S06 = mk(({ f, s, d }) => {
  const L = ease(f, d - 15, d);
  return (
    <>
      <V>
        <HeroBox />
        <g transform={`translate(760 700) rotate(8) scale(${pop(f, -10)})`} opacity={1 - L}>
          <rect x={-170} y={-90} width={340} height={180} rx={22} fill="#FFFFFF" stroke="#E2452F" strokeWidth={12} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#E2452F">
            0円
          </text>
        </g>
      </V>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - L }}>
        <Big
          y={400}
          dark
          lines={[
            { t: "その送料は、", at: s(0) - 4, size: 84, serif: true },
            { t: <><span style={{ color: YEN }}>誰が</span>払う？</>, at: s(1) - 4, size: 150, serif: true },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: L }}>{HOOK}</div>
    </>
  );
}, { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

export const SHORT1 = { S01, S02, S02B, S03, S04, S05, S06 };
