/**
 * CASE #002 ショート 3「ラーメン、1000円の壁」
 * 0秒 壁＋丼 → 1秒 なぜ値上げできない？ → 3秒 ランチは超えているのに → 説明 → 答え「客単価を上げる」
 * → 本編への別の疑問「その1000円、最後に店に残るのは、いくら？」（本編の答えへ）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Arrow, Bill, Bowl, C, Chip, FONT, K, NIGHT, NO_HEAD, PriceCard, SERIF, V, ease, fade, mk, pop } from "./parts";

const BRICK = "#B4553A";

/** レンガの壁（上端 y0、高さ h）と「1000円」の札 */
const Wall: React.FC<{ y0?: number; h?: number; sign?: boolean; o?: number }> = ({ y0 = 300, h = 360, sign = true, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: Math.ceil(h / 90) }, (_, r) =>
      Array.from({ length: 7 }, (_, c) => (
        <rect key={`${r}-${c}`} x={-90 + c * 190 + (r % 2) * 95} y={y0 + r * 90} width={180} height={80} rx={6} fill={BRICK} stroke="#8A3B26" strokeWidth={4} />
      )),
    )}
    {sign && (
      <g transform={`translate(540 ${y0 + h / 2})`}>
        <rect x={-360} y={-90} width={720} height={180} rx={18} fill={C.white} stroke={C.ink} strokeWidth={8} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={104} fill={C.ink}>
          1000<tspan fill={C.red}>円</tspan>の壁
        </text>
      </g>
    )}
  </g>
);

/* G01 0〜1秒: 壁と丼 */
const G01 = mk(({ f }) => (
  <V>
    <Wall />
    <Bowl x={540} y={1000} s={1.15 * (0.94 + 0.06 * pop(f, 0, 8))} />
  </V>
), { ...NO_HEAD, noCap: true });

/* G02 1〜3秒: 値札が上がろうとして、壁にぶつかる */
const G02 = mk(({ f, s }) => {
  const up = ease(f, s(0), s(0) + 14);
  const bump = f > s(0) + 14 ? 14 * Math.exp(-(f - s(0) - 14) / 4) * Math.cos((f - s(0) - 14) / 1.6) : 0;
  return (
    <>
      <V>
        <Wall sign={false} />
        <PriceCard x={540} y={900 - 150 * up + bump} text="1000円" s={1.6} r={0} />
        <text x={540} y={1300} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={C.ink} opacity={fade(f, s(1) - 4)}>
          値上げできない<tspan fill={C.red}>？</tspan>
        </text>
      </V>
      <Sfx at={s(0) + 14} name="thud" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, noCap: true });

/* G03 3〜7秒: ランチは壁の上、ラーメンは壁の下 */
const G03 = mk(({ f, s }) => (
  <V>
    <line x1={60} x2={1020} y1={940} y2={940} stroke={BRICK} strokeWidth={14} strokeDasharray="40 20" />
    <text x={1010} y={1000} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={BRICK}>
      1000円
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${220 + i * 320} ${760}) scale(${pop(f, s(0) + i * 6)})`}>
        <rect x={-130} y={-110} width={260} height={220} rx={24} fill={C.white} stroke={C.ink} strokeWidth={6} />
        <ellipse cx={0} cy={10} rx={90} ry={50} fill="#F1E4C8" stroke={C.ink} strokeWidth={4} />
        <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.inkSoft}>
          ランチ
        </text>
      </g>
    ))}
    <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.red} opacity={fade(f, s(0) + 16)}>
      1000円超えは、珍しくない
    </text>
    <Bowl x={540} y={1180} s={0.72} />
  </V>
), { ...NO_HEAD, bg: "#FCFBF8", noCap: true });

/* G04 KEY TYPOGRAPHY: 安くて、うまい大衆食 */
const G04 = mk(({ s }) => (
  <Big
    y={800}
    lines={[
      { t: "「安くて、うまい」", at: s(1), size: 110, serif: true },
      { t: <><Red>大衆食</Red></>, at: s(1) + 14, size: 170, serif: true },
    ]}
  />
), { ...NO_HEAD, hide: [1] });

/* G05 コスト↑ でも値段は壁の下 */
const G05 = mk(({ f, s }) => (
  <V>
    <Wall y0={300} h={180} sign={false} />
    <PriceCard x={540} y={640} text="1000円" s={1.3} r={0} />
    <g opacity={fade(f, s(0))}>
      <Arrow x={260} y={1000} len={260 * ease(f, s(0), s(0) + 16)} color={C.red} />
      <text x={260} y={1070} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.red}>
        材料
      </text>
    </g>
    <g opacity={fade(f, s(1))}>
      <Arrow x={820} y={1000} len={260 * ease(f, s(1), s(1) + 16)} color={C.red} />
      <text x={820} y={1070} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.red}>
        人件費
      </text>
    </g>
  </V>
), { ...NO_HEAD, hide: [0, 1] });

/* G06 別の方法: 味玉・チャーシュー・餃子・セット */
const G06 = mk(({ f, s }) => (
  <V>
    <Bowl x={540} y={740} s={1.0} toppings={ease(f, s(1), s(3), 0, 1)} />
    <Chip f={f} at={s(1)} x={260} y={420} text="味玉" color={K.orange} size={60} />
    <Chip f={f} at={s(2)} x={800} y={420} text="チャーシュー" color={K.soy} size={56} />
    <Chip f={f} at={s(3)} x={260} y={1110} text="餃子" color={C.ink} size={60} />
    <Chip f={f} at={s(4)} x={800} y={1110} text="セット" color={C.red} size={60} />
  </V>
), { ...NO_HEAD, hide: [1, 2, 3, 4] });

/* G07 答え: 一杯の値段 → 一人の客が使う金額＝客単価 */
const G07 = mk(({ f, s }) => {
  const strike = ease(f, s(1) - 6, s(1) + 6);
  return (
    <V>
      <g opacity={fade(f, s(0))}>
        <text x={540} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={C.inkSoft}>
          一杯の値段
        </text>
        <line x1={320} x2={320 + 440 * strike} y1={444} y2={444} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
      </g>
      <g opacity={fade(f, s(1))}>
        <text x={540} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={C.ink}>
          一人の客が使う金額
        </text>
      </g>
      <g transform={`translate(540 950) scale(${pop(f, s(2))})`}>
        <rect x={-340} y={-120} width={680} height={240} rx={120} fill={C.red} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={C.white}>
          客単価 ↑
        </text>
      </g>
    </V>
  );
}, { ...NO_HEAD, bg: "#FCFBF8", hide: [1, 2] });

/* G08 本編への別の疑問。最後は G01 の紙の色へ戻る */
const G08 = mk(({ f, s, d }) => (
  <>
    <V>
      <g transform={`translate(540 480) scale(${pop(f, s(0))})`} opacity={0.9}>
        <Bill w={420} />
      </g>
    </V>
    <Big
      y={900}
      dark
      lines={[
        { t: "最後に店に残るのは、", at: s(1), size: 84, serif: true },
        { t: <><Red>いくら</Red>？</>, at: s(1) + 20, size: 170, serif: true },
      ]}
    />
    <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: ease(f, d - 6, d) }} />
  </>
), { ...NO_HEAD, bg: NIGHT, dark: true, noCap: true });

export const SHORT3 = { G01, G02, G03, G04, G05, G06, G07, G08 };
