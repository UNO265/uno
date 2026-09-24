/** ショート 1「なぜ100円で儲かる？」 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { At, BasketBack, BasketFront, Coin, IconBox3D, PRODUCTS, PriceTag } from "../art";
import { Big, C, EndCard, Easing, FONT, Red, Sfx, Slots3, V, ease, fade, pop, shortCut } from "./kit";

const mk = shortCut("なぜ100円で儲かる？");

const A01 = mk(({ f, s }) => (
  <V>
    <At x={540} y={820} s={1.7 * pop(f, 0, 10)} r={-6}>
      <PriceTag string={false} />
    </At>
    <text x={860} y={620} fontFamily={FONT} fontWeight={900} fontSize={220} fill={C.red} opacity={fade(f, s(0) + 20)}>
      ？
    </text>
  </V>
));

const A02 = mk(({ f, s }) => {
  const v = ease(f, s(1) - 4, s(1) + 30, 0, 11100);
  const cho = Math.floor(v / 10000);
  const oku = Math.round(v % 10000);
  return (
    <>
      <Big
        y={760}
        lines={[
          { t: "国内の100円ショップ市場", at: s(0), size: 56 },
          { t: <>約{cho > 0 ? <>{cho}<span style={{ fontSize: 90 }}>兆</span></> : ""}{oku.toLocaleString("ja-JP")}<span style={{ fontSize: 90 }}>億円</span></>, at: s(1) - 4, size: 150, color: C.red },
          { t: "2025年度（帝国データバンク）", at: s(1) + 20, size: 34, color: C.inkSoft },
        ]}
      />
      <Sfx at={s(1) + 30} name="ding" volume={0.5} />
    </>
  );
}, { hide: [1] });

const A03 = mk(({ f, s }) => {
  const shrink = ease(f, s(1), s(1) + 30, 1, 0.1, Easing.inOut(Easing.cubic));
  return (
    <V>
      <At x={540} y={800} s={2.4}>
        <Coin id="a03" fraction={1} label />
      </At>
      <g opacity={fade(f, s(1))}>
        <path d={`M 540 800 L 540 ${800 - 216} A 216 216 0 0 1 ${540 + 216 * Math.sin(shrink * 0.9)} ${800 - 216 * Math.cos(shrink * 0.9)} Z`} fill={C.red} opacity={0.85} />
        <text x={1030} y={540} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.red}>
          1個の利益
        </text>
      </g>
    </V>
  );
});

const A04 = mk(({ f, s }) => (
  <V>
    <Slots3 lit={[]} y={600} />
  </V>
));

const A05 = mk(({ f, s }) => (
  <V>
    <Slots3 lit={[s(0)]} focus={0} y={480} />
    <g opacity={fade(f, s(1))}>
      {Array.from({ length: 9 }, (_, i) => (
        <At key={i} x={380 + (i % 3) * 110} y={1110 - Math.floor(i / 3) * 90} s={0.5 * pop(f, s(1) + i * 3)}>
          <IconBox3D />
        </At>
      ))}
      <text x={820} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink} opacity={fade(f, s(2))}>
        1個あたり
      </text>
      <path d={`M 820 990 L 820 ${990 + 110 * ease(f, s(2), s(2) + 20)}`} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
      <path d={`M 780 ${1060 + 40 * ease(f, s(2), s(2) + 20)} l 40 40 l 40 -40`} stroke={C.red} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade(f, s(2) + 10)} />
    </g>
  </V>
), { hide: [] });

const A06 = mk(({ f, s }) => {
  const items = [
    { t: "利益 小", c: C.inkSoft, x: 330 },
    { t: "利益 大", c: C.red, x: 750 },
  ];
  const tilt = ease(f, s(2), s(2) + 24, -10, 0);
  return (
    <V>
      <Slots3 lit={[-30, s(0)]} focus={1} y={480} />
      <g opacity={fade(f, s(1))} transform={`rotate(${tilt} 540 1000)`}>
        <rect x={180} y={990} width={720} height={16} rx={8} fill={C.ink} />
        {items.map((it, i) => {
          const Icon = PRODUCTS[i * 3 + 1];
          return (
            <g key={i}>
              <At x={it.x} y={920} s={0.45}>
                <Icon />
              </At>
              <text x={it.x} y={1070} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={it.c}>
                {it.t}
              </text>
            </g>
          );
        })}
      </g>
      <path d="M 540 1000 L 500 1100 L 580 1100 Z" fill={C.inkSoft} opacity={fade(f, s(1))} />
      <text x={540} y={1170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.red} opacity={fade(f, s(2))}>
        店全体で利益
      </text>
    </V>
  );
});

const A07 = mk(({ f, s }) => {
  const n = Math.floor(ease(f, s(1), s(2) + 30, 0, 5));
  return (
    <V>
      <Slots3 lit={[-30, -30, s(0)]} focus={2} y={480} />
      <At x={540} y={1130} s={0.6}>
        <BasketBack />
        {Array.from({ length: n }, (_, i) => {
          const Icon = PRODUCTS[(i * 2 + 3) % PRODUCTS.length];
          return (
            <At key={i} x={-160 + i * 80} y={-150 - (i % 2) * 60} s={0.45} r={(i - 2) * 8}>
              <Icon />
            </At>
          );
        })}
        <BasketFront />
      </At>
    </V>
  );
});

const A08 = mk(({ f, s }) => (
  <>
    <V>
      <At x={540} y={620} s={1.1 * pop(f, 0)} r={-4}>
        <PriceTag string={false} />
      </At>
    </V>
    <Big
      y={1000}
      lines={[
        { t: "100円は、ただの値段ではない。", at: s(0), size: 64, serif: true },
        { t: <>ビジネスの<Red>ルール</Red>だった。</>, at: s(1), size: 80, serif: true },
      ]}
    />
  </>
), { noCap: true });

const A09 = mk(({ f, s }) => <EndCard at={s(0)} />, { noCap: true });

export const SHORT1 = { A01, A02, A03, A04, A05, A06, A07, A08, A09 };
