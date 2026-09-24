/**
 * ショート 3（v2）「100円を守れるのか？ — DAISOとSeria」
 * 成果改善指針 v1.0 の 24〜27 と 24-1 を反映:
 *   0〜1秒 価格 / 1〜3秒 質問 / 3〜7秒 意外な答え / 以降 説明
 *   ショートの中で答えを出し切り、本編へは「別の疑問」一行でつなぐ（ヘッダー・エンドカードなし）
 */
import React from "react";
import { At, PriceTag, Shelves } from "../art";
import { BRAND, Big, C, FONT, Red, Sfx, V, ease, fade, pop, shortCut } from "./kit";

const mk = shortCut("");
const NO_HEAD = { header: false, logo: true } as const;
const PINK = BRAND.daiso;
const TEAL = BRAND.seria;

/** 上下 2 分割の色面（DAISO / Seria） */
const Split: React.FC<{ f: number; at: number; labels?: boolean }> = ({ f, at, labels = true }) => {
  const p = ease(f, at, at + 12);
  return (
    <V>
      <rect x={0} y={0} width={1080} height={960 * p} fill={PINK} />
      <rect x={0} y={1920 - 960 * p} width={1080} height={960} fill={TEAL} />
      {labels && (
        <>
          <text x={540} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={C.white} opacity={fade(f, at + 6)} letterSpacing={8}>
            DAISO
          </text>
          <text x={540} y={1520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={C.white} opacity={fade(f, at + 10)} letterSpacing={8}>
            Seria
          </text>
        </>
      )}
    </V>
  );
};

/* D01 0〜1秒: 価格だけ（画面いっぱい） */
const D01 = mk(({ f }) => (
  <V>
    <At x={560} y={900} s={2.5 * (0.92 + 0.08 * pop(f, 0, 8))} r={-6}>
      <PriceTag string={false} />
    </At>
  </V>
), { ...NO_HEAD, noCap: true });

/* D02 1〜3秒: 質問（同じ値札が上からの圧力を受ける） */
const D02 = mk(({ f, s }) => {
  const press = ease(f, s(0), s(0) + 20);
  return (
    <V>
      {[260, 540, 820].map((x, i) => (
        <path key={i} d={`M ${x} ${260 + 120 * press} l 0 ${170} m -50 -50 l 50 50 l 50 -50`} stroke={C.red} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade(f, s(0) + i * 4)} />
      ))}
      <At x={560} y={900 + 20 * press} s={2.5} r={-6}>
        <PriceTag string={false} />
      </At>
      <text x={540} y={1240} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.ink} opacity={fade(f, s(1) - 4)}>
        守れる<tspan fill={C.red}>？</tspan>
      </text>
    </V>
  );
}, { ...NO_HEAD, hide: [1] });

/* D03 3〜7秒: 意外な答え「正反対」 */
const D03 = mk(({ f, s }) => {
  const badge = pop(f, s(1));
  return (
    <>
      <Split f={f} at={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, transform: `translateY(-50%) scale(${badge})`, display: "flex", justifyContent: "center", opacity: Math.min(1, badge * 1.4) }}>
        <div style={{ background: C.white, color: C.ink, fontFamily: FONT, fontWeight: 900, fontSize: 110, padding: "10px 50px", borderRadius: 24, boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>
          <Red>正反対</Red>の答え
        </div>
      </div>
      <Sfx at={s(1)} name="stamp" volume={0.5} />
    </>
  );
}, { ...NO_HEAD, noCap: true, dark: true });

/* D04 DAISO: 100 → 200 → 300 → 500 円 */
const D04 = mk(({ f, s }) => {
  const TAGS = ["100円", "200円", "300円", "500円"];
  return (
    <V>
      <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.white} letterSpacing={6}>
        DAISO
      </text>
      {TAGS.map((t, i) => (
        <At key={i} x={330 + i * 130} y={1150 - i * 190} s={1.0 * pop(f, i === 0 ? s(0) : s(i))} r={-5}>
          <PriceTag text={t} color={i === 0 ? C.red : C.ink} string={false} />
        </At>
      ))}
    </V>
  );
}, { ...NO_HEAD, bg: PINK, dark: true, hide: [1, 2, 3] });

/* D05 100円を入口に、その先の選択肢を広げる */
const D05 = mk(({ f, s }) => {
  const open = ease(f, s(1), s(1) + 26);
  return (
    <V>
      <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.white} letterSpacing={6}>
        DAISO
      </text>
      <g transform="translate(540 820)">
        {[-1, 1].map((k) => (
          <path key={k} d={`M ${k * 130} 0 L ${k * (130 + 330 * open)} ${-280 * open} M ${k * 130} 0 L ${k * (130 + 330 * open)} ${280 * open} M ${k * 130} 0 L ${k * (130 + 380 * open)} 0`} stroke={C.white} strokeWidth={16} strokeLinecap="round" opacity={0.3 + 0.7 * open} />
        ))}
        <rect x={-130} y={-200} width={260} height={400} rx={20} fill={C.white} />
        <text y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={PINK}>
          入口
        </text>
        <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={C.red}>
          100円
        </text>
      </g>
    </V>
  );
}, { ...NO_HEAD, bg: PINK, dark: true });

/* D06 Seria: 100円にこだわる */
const D06 = mk(({ f, s }) => (
  <V>
    <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.white} letterSpacing={6}>
      Seria
    </text>
    <g transform={`translate(560 860) scale(${0.9 + 0.1 * pop(f, s(1))}) translate(-560 -860)`}>
      <At x={560} y={860} s={2.3} r={-4}>
        <PriceTag string={false} color={C.white} text="" />
      </At>
      <text x={590} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={200} fill={TEAL} transform="rotate(-4 560 860)">
        100円
      </text>
    </g>
  </V>
), { ...NO_HEAD, bg: TEAL, dark: true });

/* D07 値段を確かめずに選べる → 分かりやすさ = 価値 */
const D07 = mk(({ f, s }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 640, overflow: "hidden", opacity: fade(f, 0) }}>
      <svg viewBox="0 150 1920 800" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <Shelves />
      </svg>
    </div>
    <V>
      {[0, 1, 2].map((i) => (
        <At key={i} x={230 + i * 310} y={700} s={0.62 * pop(f, 4 + i * 4)} r={-4}>
          <PriceTag string={false} color={TEAL} />
        </At>
      ))}
      <g opacity={fade(f, s(1))}>
        <rect x={120} y={1060} width={840} height={130} rx={65} fill={TEAL} />
        <text x={540} y={1128} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={66} fill={C.white}>
          分かりやすさ ＝ 価値
        </text>
      </g>
    </V>
  </>
), { ...NO_HEAD, hide: [1] });

/* D08 答え: 広げる DAISO / 守る Seria → 戦い方は正反対 */
const D08 = mk(({ f, s }) => {
  const push = ease(f, s(0), s(0) + 26);
  const answer = ease(f, s(2) - 4, s(2) + 10);
  return (
    <>
      <Split f={f} at={-30} labels={false} />
      <V>
        <g opacity={1 - answer}>
          <g transform="translate(540 480)">
            <rect x={-150 - 250 * push} y={-150} width={30} height={300} rx={8} fill={C.white} />
            <rect x={120 + 250 * push} y={-150} width={30} height={300} rx={8} fill={C.white} />
            <text y={-20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.white}>
              DAISO
            </text>
            <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={C.white}>
              広げる
            </text>
          </g>
          <g transform="translate(540 1440)" opacity={fade(f, s(1))}>
            <rect x={-190} y={-150} width={44} height={300} rx={8} fill={C.white} />
            <rect x={146} y={-150} width={44} height={300} rx={8} fill={C.white} />
            <text y={-20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.white}>
              Seria
            </text>
            <text y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill={C.white}>
              守る
            </text>
          </g>
        </g>
      </V>
      <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: answer }} />
      <Big
        y={880}
        lines={[
          { t: "同じ100円ショップでも、", at: s(2), size: 70, serif: true },
          { t: <>戦い方は<Red>正反対</Red>。</>, at: s(2) + 8, size: 120, serif: true },
        ]}
      />
    </>
  );
}, { ...NO_HEAD, hide: [2] });

/* D09 本編への「別の疑問」一行。最初の「100円。」へ戻るループ */
const D09 = mk(({ f, s, d }) => (
  <>
    <Big
      y={860}
      dark
      lines={[
        { t: "では、そもそも――", at: s(0), size: 70, color: "#C9C2B6" },
        { t: <><Red>100円</Red>で、</>, at: s(1), size: 150 },
        { t: "なぜ儲かるのか。", at: s(1) + 10, size: 110 },
      ]}
    />
    <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: ease(f, d - 6, d) }} />
  </>
), { ...NO_HEAD, dark: true, noCap: true });

export const SHORT3 = { D01, D02, D03, D04, D05, D06, D07, D08, D09 };
