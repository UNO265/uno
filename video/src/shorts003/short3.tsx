/**
 * CASE #003 ショート 3「映画は過去最高、なのに値上げ？」
 * 0秒 上がる二本の矢印＋問い（文字）→ 興行収入 2744億円（映連 2025年）→ TOHO 2000円(2023)・都心の一部 2200円(2026)
 * → 挙げられた理由（TOHO の告知）→ チケット代は分け合うお金 → ヒットしても、コストは待ってくれない
 * → 本編への別の疑問「チケットだけで、映画館は支えられるのか？」（本編の「売店＝もう一本の柱」へ）
 */
import React from "react";
import { Big, Red } from "../shorts001/kit";
import { Arrow, C, Chip, FONT, Hook, LoopTo, NAVY, NIGHT, NO_HEAD, SERIF, Src, T, V, WHITE, comma, count, ease, fade, mk, pop } from "./parts";

/* R01 0秒: 二本の矢印が伸びている。問いの文字 */
const R01 = mk(({ f }) => {
  const a = ease(f, -12, 24);
  const b = ease(f, -4, 32);
  return (
    <>
      <Hook dark={false} lines={["映画は過去最高のヒット。", <>なのに、<Red>値上げ</Red>？</>]} sizes={[80, 116]} />
      <V>
        <line x1={120} x2={960} y1={1150} y2={1150} stroke={C.line} strokeWidth={6} />
        <Arrow x={330} y={1140} len={80 + 380 * a} color={K_GOLD} w={44} />
        <text x={330} y={1215} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.inkSoft}>
          興行収入
        </text>
        <Arrow x={750} y={1140} len={80 + 300 * b} color={C.red} w={44} />
        <text x={750} y={1215} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.inkSoft}>
          チケット代
        </text>
      </V>
    </>
  );
}, { ...NO_HEAD, bg: WHITE, noCap: true });
const K_GOLD = "#C9962B";

/* R02 DATA: 2744億円（過去最高） */
const R02 = mk(({ f, s }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 54, fontWeight: 800, color: C.inkSoft }}>2025年 日本の映画 興行収入</div>
      <div style={{ fontSize: 230, fontWeight: 900, color: C.ink, lineHeight: 1.15 }}>
        {comma(count(f, s(0) + 16, 30, 2744))}
        <span style={{ fontSize: 110 }}>億円</span>
      </div>
      <div style={{ display: "inline-block", marginTop: 10, border: `8px solid ${C.red}`, color: C.red, borderRadius: 14, padding: "4px 30px", fontSize: 80, fontWeight: 900, transform: `rotate(-6deg) scale(${pop(f, s(0) + 50)})` }}>過去最高</div>
    </div>
    <V>
      <Src f={f} at={0} text="日本映画製作者連盟「2025年 全国映画概況」（2000年以降で最高）" />
    </V>
  </>
), { ...NO_HEAD, bg: WHITE });

/* R03 TIMELINE: 2023年 2000円 → 2026年 都心の一部 2200円 */
const R03 = mk(({ f, s }) => (
  <V>
    <line x1={200} x2={200} y1={460} y2={1150} stroke={C.ink} strokeWidth={6} opacity={fade(f, 0)} />
    {[
      { y: 600, year: "2023年6月", price: "2000円", note: "一般料金", at: s(0) },
      { y: 950, year: "2026年7月", price: "2200円", note: "都心の一部（劇場ごとの料金）", at: s(2) },
    ].map((it, i) => (
      <g key={i} opacity={fade(f, it.at)}>
        <circle cx={200} cy={it.y} r={22} fill={C.red} />
        <text x={260} y={it.y - 40} fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.inkSoft}>
          {it.year}
        </text>
        <text x={260} y={it.y + 70} fontFamily={FONT} fontWeight={900} fontSize={130} fill={i ? C.red : C.ink}>
          {it.price}
        </text>
        <text x={260} y={it.y + 130} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.inkSoft}>
          {it.note}
        </text>
      </g>
    ))}
    <Src f={f} at={0} text="TOHOシネマズ 料金改定のお知らせ（2023年・2026年）" />
  </V>
), { ...NO_HEAD, hide: [1, 2] });

/* R04 挙げられた理由（TOHO の告知） */
const R04 = mk(({ f, s }) => (
  <V>
    <text x={540} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#F4EEE3" opacity={fade(f, s(0))}>
      値上げの理由（TOHOシネマズ）
    </text>
    <Chip f={f} at={s(1)} x={540} y={580} text="エネルギー価格の高騰" color="#FFFFFF" fill={NAVY} size={54} />
    <Chip f={f} at={s(2)} x={540} y={760} text="円安で仕入れコスト上昇" color="#FFFFFF" fill={NAVY} size={50} />
    <Chip f={f} at={s(3)} x={540} y={940} text="人件費" color="#FFFFFF" fill={NAVY} size={60} />
    <Chip f={f} at={s(3) + 10} x={540} y={1110} text="設備投資" color="#FFFFFF" fill={NAVY} size={60} />
  </V>
), { ...NO_HEAD, bg: NAVY, dark: true, hide: [1, 2, 3] });

/* R05 チケット代は分け合う（割合は出さない: 作品・契約で違う） */
const R05 = mk(({ f, s }) => {
  const split = ease(f, s(1), s(1) + 18);
  return (
    <V>
      <g transform={`translate(${540 - 130 * split} 760) rotate(${-4 * split})`}>
        <rect x={-260} y={-150} width={260} height={300} rx={14} fill={T.ticket} stroke={T.velvet} strokeWidth={5} />
        <text x={-130} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={T.velvet} opacity={1 - split}>
          チケ
        </text>
        <text x={-130} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink} opacity={split}>
          映画館
        </text>
      </g>
      <g transform={`translate(${540 + 130 * split} 760) rotate(${4 * split})`}>
        <rect x={0} y={-150} width={260} height={300} rx={14} fill={T.ticket} stroke={T.velvet} strokeWidth={5} />
        <text x={130} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill={T.velvet} opacity={1 - split}>
          ット
        </text>
        <text x={130} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink} opacity={split}>
          作品を届ける側
        </text>
      </g>
      <text x={540} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.red} opacity={fade(f, s(1) + 10)}>
        分け合うお金
      </text>
    </V>
  );
}, { ...NO_HEAD });

/* R06 KEY */
const R06 = mk(({ s }) => (
  <Big
    y={800}
    dark
    lines={[
      { t: "ヒットしても、", at: s(0), size: 96, serif: true },
      { t: <>コストは<Red>待ってくれない</Red>。</>, at: s(1), size: 86, serif: true },
    ]}
  />
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

/* R07 本編への別の疑問。最後は R01 の白へ戻る */
const R07 = mk(({ f, s, d }) => {
  const wob = Math.sin(f / 6) * 3 * ease(f, s(1), s(1) + 20);
  return (
    <>
      <V>
        <g opacity={fade(f, s(0))} transform={`rotate(${wob} 540 900)`}>
          <rect x={250} y={420} width={580} height={40} rx={6} fill="#C9C2B6" />
          <rect x={300} y={460} width={120} height={440} fill={T.ticket} />
          <text x={360} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={T.ticket}>
            チケット
          </text>
          <rect x={660} y={460} width={120} height={440} fill="none" stroke="#C9C2B6" strokeWidth={4} strokeDasharray="16 12" />
          <text x={720} y={700} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill={T.butter}>
            ？
          </text>
        </g>
      </V>
      <Big
        y={1130}
        dark
        lines={[
          { t: "チケットだけで、", at: s(1), size: 80, serif: true },
          { t: <>映画館は<Red>支えられる</Red>？</>, at: s(1) + 16, size: 100, serif: true },
        ]}
      />
      <LoopTo f={f} d={d} bg={WHITE} />
    </>
  );
}, { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

export const SHORT3 = { R01, R02, R03, R04, R05, R06, R07 };
