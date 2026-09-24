/** ショート 2「なぜ全部100円？」— 100円均一の始まり */
import React from "react";
import { At, Bubble, IconDoc, IconFactory, IconPerson, IconStore, IconTruck, PriceTag } from "../art";
import { Big, C, EndCard, FONT, Red, Sfx, V, ease, fade, pop, shortCut } from "./kit";

const mk = shortCut("なぜ全部100円？");
const PRICES = ["80円", "150円", "120円", "230円", "60円", "180円"];
const TAG_POS: [number, number, number][] = [
  [300, 560, -8], [760, 520, 6], [300, 800, 5], [770, 780, -6], [300, 1040, -4], [760, 1040, 8],
];

/** 値段がばらばらの値札 → 同じ 100円 に揃う */
const Tags: React.FC<{ f: number; unify?: number; at?: number }> = ({ f, unify = 99999, at = 0 }) => (
  <>
    {TAG_POS.map(([x, y, r], i) => {
      const done = f >= unify + i * 3;
      return (
        <At key={i} x={x} y={y} s={0.8 * pop(f, at + i * 3) * (done ? 1 + 0.08 * Math.exp(-(f - unify - i * 3) / 4) : 1)} r={done ? 0 : r}>
          <PriceTag text={done ? "100円" : PRICES[i]} color={done ? C.red : C.inkSoft} string={false} />
        </At>
      );
    })}
  </>
);

const B01 = mk(({ f, s }) => (
  <V>
    <Tags f={f} at={0} unify={s(0) + 24} />
    <text x={540} y={1210} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.red} opacity={fade(f, s(0) + 36)}>
      ？
    </text>
  </V>
));

const B02 = mk(({ f, s }) => <Big y={820} lines={[{ t: "1970年代", at: s(0), size: 180 }]} />, { noCap: true, sepia: () => 1 });

const B03 = mk(({ f, s, d }) => (
  <>
    <V>
      <At x={540} y={880} s={2.1 * pop(f, s(1) - 6)}>
        <IconTruck t={f / 6} />
      </At>
      <At x={220} y={900} s={1.1} o={fade(f, s(1))}>
        <IconPerson />
      </At>
      <g opacity={fade(f, s(2))}>
        <rect x={340} y={1040} width={400} height={100} rx={50} fill={C.ink} />
        <text x={540} y={1092} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.paper}>
          移動販売
        </text>
      </g>
    </V>
    <Big
      y={560}
      lines={[
        { t: "DAISO 創業者", at: s(0), size: 44, color: C.inkSoft },
        { t: "矢野博丈", at: s(0) + 6, size: 90 },
      ]}
    />
  </>
), { sepia: () => 1 });

const B04 = mk(({ f, s }) => (
  <V>
    <At x={540} y={1000} s={1.2}>
      <IconPerson />
    </At>
    {[
      [300, 560, s(1)],
      [780, 660, s(1) + 12],
      [330, 780, s(1) + 24],
      [760, 880, s(2)],
    ].map(([x, y, at], i) => (
      <At key={i} x={x} y={y} s={0.75 * pop(f, at)}>
        <Bubble text="これいくら？" size={50} tail={i % 2 ? "left" : "right"} />
      </At>
    ))}
  </V>
), { sepia: () => 1 });

const B05 = mk(({ f, s }) => (
  <>
    <V>
      <Tags f={f} at={-30} unify={s(1) + 6} />
    </V>
    <Sfx at={s(1) + 6} name="stamp" volume={0.5} />
  </>
), { sepia: (x) => 1 - ease(x.f, x.s(1), x.s(1) + 20) });

const B06 = mk(({ f, s }) => <Big y={820} lines={[{ t: "本当にすごいのは、", at: s(0), size: 76 }, { t: <><Red>ここから</Red>。</>, at: s(0) + 16, size: 110 }]} />, { noCap: true });

const B07 = mk(({ f, s, e }) => {
  const step = (k: number) => s(1) + Math.round(((e(1) - s(1)) * k) / 4);
  const STEPS = [
    { t: "探す", icon: <IconDoc w={160} h={200} lines={5} />, at: step(0) },
    { t: "作る", icon: <IconFactory t={f / 10} />, at: step(1) },
    { t: "運ぶ", icon: <IconTruck t={f / 6} />, at: step(2) },
    { t: "並べる", icon: <IconStore w={260} />, at: step(3) },
  ];
  return (
    <V>
      <At x={540} y={500} s={0.9 * pop(f, s(0))} r={-4}>
        <PriceTag string={false} />
      </At>
      <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.inkSoft} opacity={fade(f, s(0) + 10)}>
        先に値段を決める
      </text>
      {STEPS.map((st, i) => {
        const x = i % 2 ? 790 : 290;
        const y = 790 + Math.floor(i / 2) * 290;
        return (
          <g key={i} opacity={fade(f, st.at)}>
            <At x={x} y={y} s={0.55}>
              {st.icon}
            </At>
            <text x={x} y={y + 130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.ink}>
              {i + 1}. {st.t}
            </text>
          </g>
        );
      })}
    </V>
  );
});

const B08 = mk(({ f, s, e }) => {
  const third = (k: number) => s(1) + Math.round(((e(1) - s(1)) * k) / 3);
  const strike = ease(f, s(0) + 30, s(0) + 44);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONT, fontSize: 64, fontWeight: 900, color: C.inkSoft, opacity: fade(f, s(0)) * (1 - 0.4 * strike) }}>
        <span style={{ position: "relative" }}>
          商品を100円に
          <span style={{ position: "absolute", left: -8, top: "52%", height: 9, width: `calc(${strike * 100}% + 16px)`, background: C.red, borderRadius: 5 }} />
        </span>
      </div>
      <Big
        y={880}
        lines={[
          { t: "商売そのものを", at: s(1), size: 84, serif: true },
          { t: <><Red>100円</Red>で成り立つように</>, at: third(1), size: 76, serif: true },
          { t: "作り変えた", at: third(2), size: 96, serif: true },
        ]}
      />
    </>
  );
}, { hide: [1] });

const B09 = mk(({ f, s }) => <EndCard at={s(1)} qLine={<>では、<Red>どうやって</Red>？</>} qAt={s(0)} />, { noCap: true });

export const SHORT2 = { B01, B02, B03, B04, B05, B06, B07, B08, B09 };
