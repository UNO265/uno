/** ショート 3「DAISOとSeria、答えは正反対？」 */
import React from "react";
import { At, PriceTag, Shelves } from "../art";
import { BRAND, Big, C, EndCard, FONT, Red, Sfx, V, ease, fade, pop, shortCut } from "./kit";

const mk = shortCut("DAISOとSeria、答えは正反対？");

/** 上下 2 分割のブランド札（ロゴは使わず色と名前だけ） */
const Brand: React.FC<{ name: string; color: string; x: number; y: number; at: number; f: number; w?: number }> = ({ name, color, x, y, at, f, w = 400 }) => {
  const p = pop(f, at);
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-w / 2} y={-70} width={w} height={140} rx={70} fill={color} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={68} fill={C.white} letterSpacing={4}>
        {name}
      </text>
    </g>
  );
};

const D01 = mk(({ f, s }) => (
  <V>
    <Brand name="DAISO" color={BRAND.daiso} x={300} y={760} at={s(0)} f={f} w={380} />
    <Brand name="Seria" color={BRAND.seria} x={780} y={760} at={s(0) + 8} f={f} w={380} />
    <g opacity={fade(f, s(1))}>
      <path d="M 300 880 C 300 1000 180 1040 160 1120" stroke={BRAND.daiso} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M 780 880 C 780 1000 900 1040 920 1120" stroke={BRAND.seria} strokeWidth={16} fill="none" strokeLinecap="round" />
      <text x={540} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.red}>
        ？
      </text>
    </g>
    <At x={540} y={560} s={0.8 * pop(f, 0)} r={-4}>
      <PriceTag string={false} />
    </At>
  </V>
));

const D02 = mk(({ f, s, e }) => {
  const W = ["原材料", "物流費", "人件費"];
  return (
    <V>
      {W.map((w, i) => {
        const at = s(0) + i * 12;
        const p = ease(f, at, at + 18);
        return (
          <g key={i} transform={`translate(${250 + i * 290} 820)`} opacity={fade(f, at)}>
            <path d={`M 0 200 L 0 ${200 - 300 * p} M -60 ${260 - 300 * p} L 0 ${200 - 300 * p} L 60 ${260 - 300 * p}`} stroke={C.red} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text y={290} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink}>
              {w}
            </text>
          </g>
        );
      })}
    </V>
  );
});

const D03 = mk(({ f, s }) => {
  const up = f >= s(1) + 10;
  const strike = ease(f, s(2), s(2) + 16);
  return (
    <>
      <V>
        <At x={540} y={620} s={1.1 * (up ? 1 + 0.06 * Math.exp(-(f - s(1) - 10) / 4) : 1)} r={-4}>
          <PriceTag text={up ? "値上げ？" : "100円"} color={up ? C.inkSoft : C.red} string={false} fontSize={up ? 64 : undefined} />
        </At>
      </V>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: FONT, fontSize: 84, fontWeight: 900, color: C.ink, opacity: fade(f, s(2)) }}>
        <span style={{ position: "relative" }}>
          100円ショップ
          <span style={{ position: "absolute", left: -8, top: "52%", height: 10, width: `calc(${strike * 100}% + 16px)`, background: C.red, borderRadius: 5 }} />
        </span>
      </div>
      <Sfx at={s(2) + 8} name="chip" volume={0.5} />
    </>
  );
});

const D04 = mk(({ f, s }) => {
  const TAGS = ["100円", "200円", "300円", "500円"];
  return (
    <V>
      <Brand name="DAISO" color={BRAND.daiso} x={540} y={470} at={s(0) - 6} f={f} />
      {TAGS.map((t, i) => {
        const at = i === 0 ? s(0) : s(i);
        return (
          <At key={i} x={290 + i * 170} y={1120 - i * 150} s={0.75 * pop(f, at)} r={-4}>
            <PriceTag text={t} color={i === 0 ? C.red : BRAND.daiso} string={false} />
          </At>
        );
      })}
    </V>
  );
}, { hide: [1, 2, 3] });

const D05 = mk(({ f, s }) => {
  const open = ease(f, s(1), s(1) + 30);
  return (
    <V>
      <Brand name="DAISO" color={BRAND.daiso} x={540} y={470} at={-30} f={f} />
      <g transform="translate(540 900)">
        <path d={`M -90 200 L -90 -60 L 90 -60 L 90 200`} fill="none" stroke={C.ink} strokeWidth={10} />
        <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.red}>
          100円
        </text>
        <text y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.inkSoft}>
          入口
        </text>
        {[-1, 1].map((k) => (
          <path key={k} d={`M ${k * 90} 60 L ${k * (90 + 280 * open)} ${60 - 160 * open} M ${k * 90} 60 L ${k * (90 + 280 * open)} ${60 + 160 * open}`} stroke={BRAND.daiso} strokeWidth={10} strokeLinecap="round" opacity={open} />
        ))}
      </g>
    </V>
  );
});

const D06 = mk(({ f, s }) => (
  <V>
    <Brand name="Seria" color={BRAND.seria} x={540} y={470} at={s(0)} f={f} />
    <At x={540} y={880} s={1.5 * pop(f, s(0) + 16)} r={-4}>
      <PriceTag string={false} color={BRAND.seria} />
    </At>
  </V>
));

const D07 = mk(({ f, s }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, bottom: 760, overflow: "hidden", opacity: fade(f, s(0)) }}>
      <svg viewBox="0 150 1920 800" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        <Shelves />
      </svg>
    </div>
    <V>
      {[0, 1, 2].map((i) => (
        <At key={i} x={250 + i * 290} y={760} s={0.5 * pop(f, s(0) + 8 + i * 5)} r={-4}>
          <PriceTag string={false} color={BRAND.seria} />
        </At>
      ))}
      <g opacity={fade(f, s(1))}>
        <rect x={190} y={880} width={700} height={110} rx={55} fill={C.white} stroke={BRAND.seria} strokeWidth={6} />
        <text x={540} y={936} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={54} fill={BRAND.seria}>
          分かりやすさ = 価値
        </text>
      </g>
    </V>
  </>
));

const D08 = mk(({ f, s }) => {
  const push = ease(f, s(0), s(0) + 30);
  return (
    <V>
      <Brand name="DAISO" color={BRAND.daiso} x={540} y={470} at={s(0) - 6} f={f} w={340} />
      <g transform="translate(540 700)" opacity={fade(f, s(0))}>
        <rect x={-100 - 180 * push} y={-60} width={20} height={140} fill={BRAND.daiso} />
        <rect x={80 + 180 * push} y={-60} width={20} height={140} fill={BRAND.daiso} />
        <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink}>
          広げる
        </text>
      </g>
      <Brand name="Seria" color={BRAND.seria} x={540} y={900} at={s(1) - 6} f={f} w={340} />
      <g transform="translate(540 1120)" opacity={fade(f, s(1))}>
        <rect x={-130} y={-60} width={26} height={140} fill={BRAND.seria} />
        <rect x={104} y={-60} width={26} height={140} fill={BRAND.seria} />
        <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink}>
          守る
        </text>
      </g>
    </V>
  );
});

const D09 = mk(({ f, s }) => <EndCard at={s(1)} qLine={<>未来は、<Red>どちら</Red>へ？</>} qAt={s(0)} />, { noCap: true });

export const SHORT3 = { D01, D02, D03, D04, D05, D06, D07, D08, D09 };
