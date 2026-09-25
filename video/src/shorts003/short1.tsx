/**
 * CASE #003 ショート 1「映画のチケット、平均はいくら？」
 * 0秒 チケット＋問い（文字）→ 2200円 → 答え 1454円（映連 2025年）→ 割引がいろいろ → 定価と実際は違う
 * → 本編への別の疑問「その1454円のうち、映画館に残るのは？」（本編の「およそ半分・目安」へ）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { BLACK, Bars, C, Chip, FONT, Hook, LoopTo, NAVY, NIGHT, NO_HEAD, SERIF, Src, T, TicketDoc, V, WHITE, comma, count, ease, fade, mk, pop } from "./parts";

/* P01 0秒: 動いているチケットと、問いの文字 */
const P01 = mk(({ f }) => {
  const q = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <>
      <Hook lines={["映画のチケット、", <>平均は<Red>いくら</Red>？</>]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", transform: `translateX(${520 * (1 - ease(f, -3, 16))}px) rotate(${10 * (1 - ease(f, -3, 16))}deg) scale(${1.02 + 0.03 * Math.sin(f / 9)})` }}>
        <TicketDoc w={900} at={-16} price="¥ ?" />
      </div>
      <Sfx at={0} name="whoosh" volume={0.4} />
      <div style={{ position: "absolute", right: 110, top: 610, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: C.red, opacity: 0.6 + 0.4 * q, transform: `rotate(12deg) scale(${0.95 + 0.08 * q})` }}>？</div>
    </>
  );
}, { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

/* P02 定価: 都心の一部で 2200円 */
const P02 = mk(({ f, s }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: C.inkSoft, opacity: fade(f, 0) }}>一般料金</div>
      <div style={{ fontSize: 250, fontWeight: 900, color: C.ink, lineHeight: 1.1, transform: `scale(${pop(f, 2)})` }}>
        2200<span style={{ fontSize: 120 }}>円</span>
      </div>
      <div style={{ fontSize: 40, fontWeight: 700, color: C.inkSoft, opacity: fade(f, s(1)) }}>都心の一部の映画館（2026年7月〜）</div>
    </div>
  </>
), { ...NO_HEAD, bg: WHITE });

/* P03 答え: 1454円 */
const P03 = mk(({ f, s }) => {
  const n = count(f, s(1) - 4, 18, 1454);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: C.inkSoft, opacity: fade(f, s(0)) }}>実際の平均は</div>
        <div style={{ fontSize: 290, fontWeight: 900, color: C.red, lineHeight: 1.15, opacity: fade(f, s(1) - 4, 4) }}>
          {comma(n)}
          <span style={{ fontSize: 130 }}>円</span>
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.inkSoft, opacity: fade(f, s(1) + 20), textDecoration: "line-through", textDecorationColor: C.red, textDecorationThickness: 8 }}>2200円</div>
      </div>
      <Sfx at={s(1) + 14} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE, noCap: true });

/* P04 EVIDENCE: 映連 2025年 全国映画概況 */
const P04 = mk(({ f, s }) => {
  const hl = ease(f, s(1), s(1) + 16);
  return (
    <V>
      <g transform={`translate(540 800) rotate(-1.5) scale(${0.96 + 0.04 * ease(f, 0, 14)})`} opacity={fade(f, 0)}>
        <rect x={-440} y={-300} width={880} height={600} rx={14} fill="#FFFFFF" stroke="#D8D0C2" strokeWidth={3} />
        <rect x={-400} y={-260} width={250} height={56} rx={6} fill={C.red} />
        <text x={-275} y={-222} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#FFFFFF" letterSpacing={3}>
          EVIDENCE
        </text>
        <text x={-400} y={-130} fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.inkSoft}>
          日本映画製作者連盟
        </text>
        <text x={-400} y={-60} fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.ink}>
          2025年 全国映画概況
        </text>
        <line x1={-400} x2={400} y1={-10} y2={-10} stroke={C.ink} strokeWidth={3} />
        <rect x={-410} y={50} width={820 * hl} height={110} fill="#F9D98A" opacity={0.8} />
        <text x={-390} y={128} fontFamily={FONT} fontWeight={900} fontSize={62} fill={C.ink}>
          平均入場料金
        </text>
        <text x={390} y={128} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.red}>
          1,454円
        </text>
        <text x={-400} y={250} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.inkSoft}>
          SOURCE: 日本映画製作者連盟「2025年 全国映画概況」
        </text>
      </g>
    </V>
  );
}, { ...NO_HEAD });

/* P05 いろいろな料金（金額は出さない: 劇場ごとに違う） */
const P05 = mk(({ f, s }) => (
  <V>
    <g transform="translate(540 800)">
      <rect x={-200} y={-90} width={400} height={180} rx={16} fill={T.ticket} opacity={fade(f, 0)} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={T.velvet} opacity={fade(f, 0)}>
        チケット
      </text>
    </g>
    <Chip f={f} at={s(0)} x={290} y={520} text="学生" color="#FFFFFF" fill={NAVY} size={60} />
    <Chip f={f} at={s(1)} x={790} y={520} text="子ども" color="#FFFFFF" fill={NAVY} size={60} />
    <Chip f={f} at={s(2)} x={290} y={990} text="シニア" color="#FFFFFF" fill={NAVY} size={60} />
    <Chip f={f} at={s(3)} x={790} y={990} text="割引の日" color="#FFFFFF" fill={NAVY} size={56} />
    <Chip f={f} at={s(3) + 14} x={540} y={1160} text="レイトショー" color={T.butter} fill={NAVY} size={52} />
  </V>
), { ...NO_HEAD, bg: NAVY, dark: true, hide: [0, 1, 2, 3] });

/* P06 KEY: 一つの値段ではない */
const P06 = mk(({ s }) => (
  <Big
    y={800}
    dark
    lines={[
      { t: "チケットは、", at: s(0), size: 96, serif: true },
      { t: <>一つの値段では<Red>ない</Red>。</>, at: s(1), size: 92, serif: true },
    ]}
  />
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

/* P07 定価と実際の差（棒の高さは実数の比） */
const P07 = mk(({ f, s }) => (
  <V>
    <Bars
      f={f}
      base={1120}
      h={620}
      max={2200}
      items={[
        { label: "一般料金（都心の一部）", value: 2200, text: "2200円", at: s(0), color: C.inkSoft },
        { label: "実際の平均", value: 1454, text: "1454円", at: s(0) + 10, color: C.red },
      ]}
    />
  </V>
), { ...NO_HEAD, bg: WHITE });

/* P08 本編への別の疑問。最後は P01 の黒へ戻る */
const P08 = mk(({ f, s, d }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", transform: `scale(${0.62 * pop(f, s(0))})`, transformOrigin: "50% 0" }}>
      <TicketDoc w={900} price="¥1,454" />
    </div>
    <Big
      y={960}
      dark
      lines={[
        { t: "1454円のうち、", at: s(1), size: 84, serif: true },
        { t: <>映画館に<Red>残る</Red>のは？</>, at: s(1) + 16, size: 104, serif: true },
      ]}
    />
    <LoopTo f={f} d={d} bg={BLACK} />
  </>
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

export const SHORT1 = { P01, P02, P03, P04, P05, P06, P07, P08 };
