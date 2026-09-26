/** K22–K26: まだ描いていない線 → ドライバーの所得・時間 → 再配達 → 受け取り方 → 画面の0円 vs 夜の時間 → CLUE 03 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Stage, Tag, count, mk } from "../case002/ui";
import { Box, Clock, Easing, FONT, Figure, K, MoneyFlow5, Phone, SERIF, Sfx, T, Truck, Waybill, ease, fade, pop } from "./kit";

/* K22 MONEY FLOW ③: K16 の図に戻り、灰色のレーンへ寄っていく */
const K22 = mk(({ f, s }) => {
  const z = ease(f, s(1), s(3) + 20, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Stage>
      <g transform={`translate(${-900 * z} ${-240 * z}) scale(${1 + 0.5 * z})`} style={{ transformOrigin: "0 0" }}>
        <MoneyFlow5 st={{ entries: 1, store: 1, carrier: 1, hidden: 1, driver: 0 }} />
      </g>
    </Stage>
  );
}, { bg: "white" });

/* K23 GRAPH（夜）: 所得は全産業平均より低く、労働時間は長い */
const K23 = mk(({ f, s }) => {
  const bars = (x0: number, title: string, items: { l: string; v: number; t: string }[], at: number, dir: 1 | -1, color: string) => (
    <g opacity={fade(f, at)}>
      <text x={x0 + 200} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#EAF6FF">
        {title}
      </text>
      <line x1={x0 - 40} x2={x0 + 440} y1={560} y2={560} stroke="#EAF6FF" strokeWidth={4} strokeDasharray="14 10" />
      <text x={x0 + 450} y={560} dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#C9D6E6">
        全産業平均
      </text>
      {items.map((it, i) => {
        const h = ease(f, at + 10 + i * 10, at + 40 + i * 10) * it.v;
        const x = x0 + i * 270;
        return (
          <g key={i}>
            <rect x={x} y={dir > 0 ? 560 - h : 560} width={160} height={h} rx={8} fill={color} />
            <text x={x + 80} y={dir > 0 ? 560 - h - 24 : 560 + h + 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={color}>
              {it.t}
            </text>
            <text x={x + 80} y={dir > 0 ? 610 : 520} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#EAF6FF">
              {it.l}
            </text>
          </g>
        );
      })}
    </g>
  );
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0)) * (1 - fade(f, s(1) - 12, 12))}>
          <Figure x={760} y={560} s={1.6} color="#EAF6FF" cap />
          <Truck x={1180} y={600} s={1.3} lights />
        </g>
        {bars(220, "年間所得", [{ l: "大型", v: 70, t: "約−5%" }, { l: "中小型", v: 170, t: "約−12%" }], s(1), -1, "#8FD3FF")}
        {bars(1160, "年間労働時間", [{ l: "大型", v: 230, t: "+432時間" }, { l: "中小型", v: 205, t: "+384時間" }], s(2), 1, T.time)}
      </Stage>
      <EvidenceMark no="#07" source="厚生労働省（賃金構造基本統計調査より）" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* K24 DATA（夜）: 再配達 8.3%、ドライバー約6万人分・CO2 約25万トン */
const K24 = mk(({ f, s }) => {
  const r = count(f, s(2) + 6, 30, 0, 8.3);
  const knock = pop(f, s(1));
  return (
    <>
      <Stage>
        {/* 玄関と不在票 */}
        <g transform="translate(420 560)">
          <rect x={-170} y={-300} width={340} height={560} rx={8} fill="#3A4A63" stroke="#8C99AE" strokeWidth={6} />
          <circle cx={120} cy={0} r={14} fill="#E0C27A" />
          <g transform={`translate(-40 -60) rotate(-6) scale(${knock})`} opacity={Math.min(1, knock * 1.4)}>
            <rect x={-90} y={-60} width={180} height={120} rx={6} fill="#FFFFFF" />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.red}>
              ご不在
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(2))}>
          <text x={1240} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C9D6E6">
            再配達率（2025年10月）
          </text>
          <text x={1240} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={T.time}>
            {r.toFixed(1)}<tspan fontSize={90}>%</tspan>
          </text>
        </g>
        <g opacity={fade(f, s(3))}>
          <text x={1240} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6">
            再配達率 約10%のころの試算（国土交通省）
          </text>
          <text x={1000} y={730} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#EAF6FF">
            約6万人分
          </text>
          <text x={1000} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6">
            ドライバーの労働力
          </text>
        </g>
        <g opacity={fade(f, s(4))}>
          <text x={1500} y={730} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#EAF6FF">
            約25万トン
          </text>
          <text x={1500} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6">
            CO2（年間）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#08" source="国土交通省 宅配便の再配達率サンプル調査 / 試算" at={s(2)} dark />
      <Sfx at={s(1)} name="tok" volume={0.6} />
      <Sfx at={s(1) + 6} name="tok" volume={0.5} />
    </>
  );
}, { bg: "night" });

/* K24B OBJECT: 目標 7.5%、置き配・宅配ボックス・コンビニ受け取り、「標準」に */
const K24B = mk(({ f, s }) => {
  const icon = (x: number, label: string, at: number, draw: React.ReactNode) => {
    const p = pop(f, at);
    return (
      <g transform={`translate(${x} 450) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
        <circle r={130} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
        {draw}
        <text y={190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={K.ink}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <>
      <Stage>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={K.ink} opacity={fade(f, s(0))}>
          再配達率の目標 <tspan fill={K.red}>7.5%</tspan>（2025年度）
        </text>
        {icon(480, "置き配", s(0) + 50, <g transform="scale(0.2)"><Box x={0} y={0} sticker={0} /></g>)}
        {icon(960, "宅配ボックス", s(0) + 70, <g><rect x={-70} y={-90} width={140} height={180} rx={8} fill="#8C99AE" /><rect x={-50} y={-70} width={100} height={60} rx={4} fill="#DCE3EC" /><rect x={-50} y={10} width={100} height={60} rx={4} fill="#DCE3EC" /></g>)}
        {icon(1440, "コンビニ受け取り", s(0) + 90, <g><rect x={-90} y={-50} width={180} height={110} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} /><rect x={-90} y={-80} width={180} height={36} fill="#3D8BD9" /></g>)}
        <g opacity={fade(f, s(1))} transform="translate(960 790)">
          <rect x={-560} y={-44} width={1120} height={88} rx={44} fill={K.red} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={38} fill="#FFFFFF">
            2025年11月 置き配などを宅配便の「標準」に（方針）
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#08" source="国土交通省（2025年）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* K25 分割: 左は画面の「送料 ¥0」（止まっている）、右は夜の道で時計だけが速く進む */
const K25 = mk(({ f, s }) => (
  <>
    <AbsoluteFill style={{ width: 960, background: "#FCFBF8" }} />
    <AbsoluteFill style={{ left: 960, width: 960, background: "radial-gradient(ellipse at 50% 45%, #1B2438 0%, #0E1320 80%)" }} />
    <Stage>
      <Phone x={480} y={520} s={0.95} />
      <g opacity={fade(f, s(2) - 10)}>
        <Clock x={1440} y={420} r={170} speed={8} face="#0F2340" color="#EAF6FF" />
      </g>
      <g transform={`translate(${((f * 3) % 1100) + 200} 0)`}>
        <Truck x={960} y={760} s={0.7} lights />
      </g>
      <line x1={960} x2={1920} y1={800} y2={800} stroke="#3A4A63" strokeWidth={6} />
      <text x={1440} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={T.time} opacity={fade(f, s(2))}>
        運ぶ人の時間
      </text>
      <text x={480} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink} opacity={fade(f, s(0))}>
        客の画面
      </text>
    </Stage>
  </>
), { bg: "white" });

/* K26 CLUE 03（MID REVEAL）: K06B の空欄が埋まる → 送り状 */
const K26 = mk(({ f, s }) => {
  const card = s(1) + 36;
  const pre = 1 - fade(f, card - 10, 10);
  return (
    <>
      <AbsoluteFill style={{ opacity: pre }}>
        <Stage>
          <rect x={810} y={300} width={300} height={340} rx={30} fill="none" stroke={K.red} strokeWidth={6} strokeDasharray="20 14" />
          <Figure x={960} y={560} s={1.1} color={T.night} cap o={fade(f, s(1) - 4, 16)} />
          <g opacity={fade(f, s(1) + 6)}>
            <Clock x={1060} y={380} r={60} speed={4} />
          </g>
          <text x={960} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.red} opacity={fade(f, s(1))}>
            もう一人の支払い手
          </text>
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - pre }}>
        <Waybill no="03" at={card} />
      </AbsoluteFill>
    </>
  );
}, { bg: "paper", noSub: true });

export const NIGHT5 = { K22, K23, K24, K24B, K25, K26 };
export { SERIF, Tag };
