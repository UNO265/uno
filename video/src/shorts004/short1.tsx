/**
 * CASE #004 入口ショート「コインランドリー、人がいないのになぜ儲かる？」（ショート指針 v1）
 * 0秒 ドラム＋本編タイトルの問い → 店員0・レジ0 → 答えは人件費？ 半分だけ正しい（本編 REWARD 1）
 * → 高価な機械に働いてもらう店 → 家にも洗濯機、なのに 1155億円（矢野経済研究所 2025年）
 * → 本編サムネイルと同じ「ドラムの丸窓 + 1155億円 + 何を買ってる？」→ 最後の 0.5 秒で W01 の画面へ戻る（ループ再生。宣伝文句なし）
 */
import React from "react";
import { Big, Red, Sfx } from "../shorts001/kit";
import { Dryer, HomeWasher, Washer } from "../case004/kit";
import { BLACK, C, Chip, FONT, Hook, NIGHT, NO_HEAD, Src, V, WHITE, comma, count, ease, fade, mk, pop } from "../shorts003/parts";

const YEN = "#FFE14D";

/* W01 0秒: 問いの文字とドラムは 0 フレームから出ていて、ドラムは回っている。W07 の最後がこの画面につながる（ループ） */
const HOOK = <Hook y={250} sizes={[92, 104, 136]} lines={["コインランドリー、", "人がいないのに、", <>なぜ<Red>儲かる</Red>？</>]} />;
const W01 = mk(() => (
  <>
    {HOOK}
    <V>
      <Washer x={540} y={1090} s={1.3} spin={1.6} />
    </V>
  </>
), { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

/* W02 店員 0・レジ 0。それでも回る */
const W02 = mk(({ f, s }) => (
  <V>
    <Washer x={540} y={800} s={1.05} spin={f >= s(2) ? 2.2 : 1.2} />
    <Chip f={f} at={s(0)} x={290} y={330} text="店員 0" color="#FFFFFF" fill={C.red} size={64} />
    <Chip f={f} at={s(1)} x={790} y={330} text="レジ 0" color="#FFFFFF" fill={C.red} size={64} />
  </V>
), { ...NO_HEAD, bg: NIGHT, dark: true });

/* W03 答えは人件費？ → 半分だけ正しい（円の半分だけが赤くなる） */
const W03 = mk(({ f, s }) => {
  const h = pop(f, s(1));
  return (
    <>
      <Big y={520} lines={[{ t: <>人件費<Red>？</Red></>, at: s(0) - 6, size: 170, serif: true }]} />
      <V>
        <g transform={`translate(540 860) scale(${0.9 + 0.1 * h})`} opacity={fade(f, s(1) - 4)}>
          <circle r={170} fill="#FFFFFF" stroke={C.ink} strokeWidth={10} />
          <path d="M 0 -170 A 170 170 0 0 0 0 170 Z" fill={C.red} opacity={h} />
          <line x1={0} x2={0} y1={-170} y2={170} stroke={C.ink} strokeWidth={8} />
        </g>
      </V>
      <Big y={1150} lines={[{ t: <>半分だけ、<Red>正しい</Red>。</>, at: s(1) + 6, size: 96, serif: true }]} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE, noCap: true });

/* W04 人の代わりに並ぶ機械。無料ではない。客が来なくても、そこにある（止まる） */
const W04 = mk(({ f, s }) => {
  const idle = f >= s(3);
  return (
    <V>
      {[0, 1, 2].map((i) => {
        const p = pop(f, s(0) + i * 6);
        const x = 250 + i * 290;
        return (
          <g key={i} transform={`translate(${x} 700) scale(${p}) translate(${-x} -700)`} opacity={Math.min(1, p * 1.4)}>
            {i < 2 ? <Washer x={x} y={700} s={0.62} spin={idle ? 0 : 1} /> : <Dryer x={x} y={700} s={0.62} spin={idle ? 0 : 1} />}
          </g>
        );
      })}
      <Chip f={f} at={s(2)} x={540} y={330} text="無料ではない" color="#FFFFFF" fill={C.red} size={62} />
      <Chip f={f} at={s(3)} x={540} y={1070} text="客 0 でも、そこにある" color={C.ink} size={54} />
    </V>
  );
}, { ...NO_HEAD, hide: [2, 3] });

/* W05 KEY: 高価な機械に、働いてもらう店 */
const W05 = mk(({ f, s }) => (
  <>
    <Big
      y={500}
      dark
      lines={[
        { t: <>高価な<Red>機械</Red>に</>, at: s(1), size: 110, serif: true },
        { t: "働いてもらう店", at: s(1) + 10, size: 120, serif: true },
      ]}
    />
    <V>
      <g opacity={fade(f, 0)}>
        <Washer x={540} y={970} s={0.78} spin={1.4} />
      </g>
    </V>
  </>
), { ...NO_HEAD, bg: NIGHT, dark: true, hide: [1] });

/* W06 家にも洗濯機 → それなのに市場は 1155億円（矢野経済研究所・2025年） */
const W06 = mk(({ f, s }) => {
  const b = ease(f, s(1) - 6, s(1) + 6);
  const n = count(f, s(1) + 4, 22, 1155);
  return (
    <>
      <V>
        <g opacity={1 - b}>
          <HomeWasher x={540} y={600} s={1.05} />
          <text x={540} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={C.ink}>
            家にも、洗濯機
          </text>
        </g>
        <Src f={f} at={s(1)} text="矢野経済研究所（2025年・事業者売上高ベース）" />
      </V>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: FONT, opacity: b }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: C.inkSoft }}>コインランドリー市場</div>
        <div style={{ fontSize: 210, fontWeight: 900, color: C.red, lineHeight: 1.2 }}>
          {comma(n)}
          <span style={{ fontSize: 110 }}>億円</span>
        </div>
      </div>
      <Sfx at={s(1) + 26} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, bg: WHITE });

/* W07 本編サムネイルと同じ絵: ドラムの丸窓 + 1155億円 + 何を買ってる？ → 最後の 0.5 秒で W01 の画面に戻る（ループ） */
const W07 = mk(({ f, s, d }) => {
  const L = ease(f, d - 15, d);
  // 最後のフレームでドラムの回転角が W01 の 0 フレームと同じ（360° の倍数）になる速さ（Washer は 1 フレーム 9°×spin）
  const spin = (Math.round((1.6 * 9 * d) / 360) * 360) / (9 * d);
  return (
    <>
      <V>
        <Washer x={540} y={1010 + 80 * L} s={1.25 + 0.05 * L} spin={spin} />
        <g transform={`translate(540 600) scale(${pop(f, -12)})`} opacity={1 - L}>
          <rect x={-250} y={-66} width={500} height={132} rx={20} fill={C.red} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#FFFFFF">
            1155億円
          </text>
        </g>
      </V>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - L }}>
        <Big
          y={330}
          dark
          lines={[
            { t: "客はいったい、", at: s(0) - 4, size: 72, serif: true },
            { t: <>何を<span style={{ color: YEN }}>買ってる</span>？</>, at: s(1) - 4, size: 140, serif: true },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: L }}>{HOOK}</div>
    </>
  );
}, { ...NO_HEAD, bg: BLACK, dark: true, noCap: true });

export const SHORT1 = { W01, W02, W03, W04, W05, W06, W07 };
