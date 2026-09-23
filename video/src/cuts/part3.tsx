/** 9〜17 章（C061–C131）: 心理・仕組み③・好循環・危機・DAISO/Seria・結論・エンディング */
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import {
  At,
  Bubble,
  IconBox,
  IconBox3D,
  IconDoc,
  IconFactory,
  IconHQ,
  IconLamp,
  IconMug,
  IconPan,
  IconPerson,
  IconStore,
  IconTruck,
  PriceTag,
  Shelves,
  StampTag,
} from "../art";
import {
  Balance,
  Bars,
  Bubbles,
  Cards,
  ChapterCard,
  Cycle,
  Flow,
  Fork,
  Headline,
  Ladder,
  Machine,
  MapCount,
  RiseArrows,
  Source,
  SplitBg,
  TagHero,
} from "../kit";
import { Sfx, clamp, ease } from "../lib";
import { BRAND, C, FONT } from "../theme";
import { Fade, GaugeRows, Pill, PriceShelf, Slots, Svg, mk } from "./common";
import { Basket } from "./opening";
import { ClueBoard, Clipping, Evidence, MoneyFlow, Question, Red } from "../case";
import { BrandPhotos, StoreFallback } from "./part2";

/* ── 9. 心理 ───────────────── */
const C061 = mk(({ f, s }) => (
  <>
    <AbsoluteFill style={{ opacity: 1 - ease(f, s(2) - 8, s(2)) }}>
      <Svg>
        <ClueBoard lit={[-100, -100, s(1)]} focus={2} title={{ at: -30 }} />
      </Svg>
    </AbsoluteFill>
    <Headline lines={[{ t: "値段を*考えなくていい*", at: s(2), size: 120 }]} />
  </>
));

const C062 = mk(({ s }) => (
  <Svg>
    <GaugeRows
      rows={[
        { price: "300円", level: 0.55, at: s(0), color: C.orange },
        { price: "500円", level: 0.92, at: s(1), color: C.ink },
      ]}
    />
  </Svg>
));

const C063 = mk(({ f, s }) => (
  <Svg>
    <GaugeRows
      rows={[
        { price: "300円", level: 0.55, at: -60, color: C.orange },
        { price: "500円", level: 0.92, at: -60, color: C.ink },
        { price: "100円", level: 0.03, at: s(0) },
      ]}
    />
    <At x={1250} y={620} s={0.75 * ease(f, s(1), s(1) + 10, 0, 1, Easing.out(Easing.back(2)))}>
      <Bubble text="まあ、いいか" size={60} tail="left" />
    </At>
    <Sfx at={s(1)} name="pop" volume={0.7} />
  </Svg>
));

const CountBox: React.FC<{ n: number; label?: string }> = ({ n, label = "カゴの中" }) => (
  <At x={1590} y={170}>
    <rect x={-190} y={-90} width={380} height={180} rx={28} fill={C.white} stroke={C.ink} strokeWidth={6} />
    <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.inkSoft}>
      {label}
    </text>
    <text y={40} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.red}>
      {n}
      <tspan fontSize={48} dx={8} fill={C.ink}>
        点
      </tspan>
    </text>
  </At>
);

const C064 = mk(({ f, s }) => {
  const lands = [s(0) + 8, s(1) + 8, s(2) + 8, s(3) + 8];
  return (
    <Svg>
      <Shelves o={0.5} />
      <Basket lands={lands} kinds={[0, 4, 6, 7]} />
      <CountBox n={lands.filter((l) => f >= l).length} />
      {lands.map((l, i) => (
        <Sfx key={i} at={l} name={`tok${i + 1}`} volume={0.8} />
      ))}
    </Svg>
  );
});

const C065 = mk(({ f, s }) => {
  const dark = ease(f, s(2) - 6, s(2) + 6);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - dark }}>
        <Headline lines={[{ t: "~1個 × 100円~", at: s(0), strikeAt: s(1) + 14, size: 110 }]} />
      </AbsoluteFill>
      <Fade o={dark} color={C.night} />
      <Question
        kicker="CLUE 03"
        lines={[
          { t: <>一人に、<Red>何個</Red>買ってもらえるか。</>, at: s(2) + 4, size: 104 },
        ]}
      />
    </>
  );
});

const C066 = mk(({ s }) => (
  <Svg>
    <TagHero y={450} glowAt={s(0) + 10} s={1.7} />
  </Svg>
));

/* ── 10. 仕組み③ 取引条件 ───────────────── */
const C067 = mk(({ s }) => (
  <Svg>
    <ClueBoard lit={[-100, -100, -100, s(1)]} focus={3} title={{ at: -30 }} />
  </Svg>
));

const C068 = mk(({ s }) => (
  <Clipping
    kind="公式サイト"
    source="セリア"
    title="取引条件について"
    lines={["メーカーと、原則として返品しない条件で契約", "それにより 110円（税込）の販売価格を実現"]}
    hl={0}
    hlAt={s(1)}
    y={170}
  />
));

const C069 = mk(({ f, s }) => {
  const at = s(1) + 16;
  const st = interpolate(f, [at - 6, at], [2.4, 1], clamp);
  return (
    <>
      <Svg>
        <At x={620} y={470}>
          <IconDoc w={440} h={560} lines={9} />
          <text y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.ink}>
            取引契約
          </text>
        </At>
        {f >= at - 6 && (
          <At x={620} y={520} s={st} r={-10} o={ease(f, at - 6, at)}>
            <StampTag text="原則返品なし" size={52} />
          </At>
        )}
        <At x={1380} y={470} s={1.3 * ease(f, s(2), s(2) + 12, 0, 1, Easing.out(Easing.back(2)))} r={-6}>
          <PriceTag text="110円" string={false} />
        </At>
        <text x={1400} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.inkSoft} opacity={ease(f, s(2) + 8, s(2) + 16)}>
          （税込）
        </text>
        <Sfx at={at} name="stamp" volume={1} />
        <Sfx at={s(2)} name="pop" volume={0.7} />
      </Svg>
      <Source text="出典：セリア公式サイト" />
    </>
  );
});

const MakerStore: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <At x={380} y={470} s={1.1}>
      <IconFactory />
    </At>
    <text x={380} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink}>
      メーカー
    </text>
    <At x={1540} y={500} s={0.6}>
      <IconStore />
    </At>
    <text x={1540} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink}>
      お店
    </text>
    {children}
  </g>
);

const C070 = mk(({ f, s }) => {
  const go = ease(f, s(2), s(2) + 24);
  const back = ease(f, s(3), s(3) + 30);
  const x = ease(f, s(4), s(4) + 8, 0, 1, Easing.out(Easing.back(2)));
  return (
    <Svg>
      <MakerStore>
        <line x1={600} y1={380} x2={600 + 700 * go} y2={380} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        {go > 0.98 && <path d="M 1296 356 L 1330 380 L 1296 404 Z" fill={C.ink} />}
        <text x={960} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.inkSoft} opacity={go}>
          出荷
        </text>
        <g opacity={back}>
          <line x1={1320} y1={560} x2={1320 - 700 * back} y2={560} stroke={C.inkSoft} strokeWidth={10} strokeDasharray="20 16" strokeLinecap="round" />
          <text x={960} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.inkSoft}>
            売れ残りの返品
          </text>
          {[0, 1, 2].map((i) => (
            <At key={i} x={1250 - 600 * back + i * 60} y={520} s={0.45}>
              <IconBox3D />
            </At>
          ))}
        </g>
        <g transform={`translate(960 560) scale(${x})`}>
          <path d="M -90 -90 L 90 90 M 90 -90 L -90 90" stroke={C.red} strokeWidth={30} strokeLinecap="round" />
        </g>
      </MakerStore>
      <Sfx at={s(2)} name="whoosh" volume={0.5} />
      <Sfx at={s(4)} name="stamp" volume={1} />
    </Svg>
  );
});

const C071 = mk(({ f, s }) => {
  const p = ease(f, s(1), s(1) + 26, 0, 1, Easing.inOut(Easing.cubic));
  const x = 960 + 480 * p;
  const y = 360 - Math.sin(p * Math.PI) * 160 + p * 40;
  return (
    <Svg>
      <MakerStore>
        <g transform={`translate(${x} ${y})`}>
          <circle r={120} fill={C.red} />
          <text textAnchor="middle" y={-14} fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.white}>
            売り切る
          </text>
          <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.white}>
            リスク
          </text>
        </g>
      </MakerStore>
      <Sfx at={s(1)} name="whoosh" volume={0.5} />
      <Sfx at={s(1) + 26} name="thud" volume={0.7} />
    </Svg>
  );
});

const C072 = mk(({ f, s }) => {
  const tilt = 10 * Math.sin(f / 8) * (1 - ease(f, s(1), s(2) + 20));
  return (
    <Svg>
      <Balance
        cy={300}
        tilt={tilt}
        left={<At y={-80} s={0.6}><IconFactory /></At>}
        right={<At y={-110} s={0.32}><IconStore /></At>}
        leftLabel="メーカー"
        rightLabel="お店"
      />
    </Svg>
  );
});

const C073 = mk(({ s }) => (
  <Svg>
    <MoneyFlow
      moneyAt={s(1)}
      stops={[
        { label: "メーカー", at: s(0), icon: <At s={0.62}><IconFactory /></At> },
        { label: "物流", at: s(0) + 10, icon: <At s={0.62}><IconTruck /></At> },
        { label: "100円ショップ", at: s(0) + 20, icon: <At s={0.4}><IconStore /></At>, color: C.red },
        { label: "消費者", at: s(0) + 30, icon: <At s={0.8}><IconPerson /></At> },
      ]}
    />
  </Svg>
));

/* ── 11. 好循環 ───────────────── */
const C074 = mk(({ f, s }) => (
  <>
    <Clipping
      kind="分析"
      source="過去の決算比較（セリア・ワッツ）"
      title="仕入れ規模と原価"
      lines={["セリアの大きな仕入れ規模が", "原価を抑える要因の一つ"]}
      hl={1}
      hlAt={s(4)}
      at={s(2) - 4}
      x={70}
      y={170}
      w={880}
    />
    <Svg>
      <Bars
        max={1.1}
        cx={1420}
        width={200}
        gap={160}
        base={760}
        height={430}
        bars={[
          { label: "セリア", value: 1, color: BRAND.seria, at: s(3) - 10, valueText: "大" },
          { label: "ワッツ", value: 0.45, color: C.line, at: s(3), valueText: "小" },
        ]}
      />
      <text x={1420} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink} opacity={ease(f, s(3) - 10, s(3))}>
        仕入れ規模
      </text>
      <Pill x={1420} y={120} text="原価 ↓" color={C.green} at={s(4) + 8} size={46} />
      <Sfx at={s(4) + 8} name="ding" volume={0.6} />
      <Sfx at={s(0)} name="whoosh" volume={0.3} />
    </Svg>
    <AbsoluteFill style={{ opacity: 1 - ease(f, s(2) - 10, s(2) - 2) }}>
      <Headline lines={[{ t: "規模が大きくなるほど、*強くなる*", at: s(0), size: 90 }]} sfx={false} />
    </AbsoluteFill>
  </>
));

const CYCLE = ["安い", "たくさん売れる", "大量仕入れ", "コスト ↓"];
const CycleTag: React.FC<{ s?: number }> = ({ s = 0.55 }) => (
  <At s={s} r={-6}>
    <PriceTag string={false} />
  </At>
);

const C075 = mk(({ s }) => (
  <Svg>
    <Cycle labels={CYCLE} at={[s(0), s(1), s(2) + 6, s(4)]} spinFrom={s(5)} center={<CycleTag />} />
  </Svg>
));

const C076 = mk(({ f, s }) => (
  <Svg>
    <Cycle labels={CYCLE} at={[-40, -40, -40, -40]} spinFrom={-30} center={<CycleTag s={0.55 + 0.6 * ease(f, s(1), s(2) + 10, 0, 1, Easing.out(Easing.back(1.5)))} />} />
    <Sfx at={s(2)} name="thud" volume={0.7} />
  </Svg>
));

/* ── 12. 危機 ───────────────── */
const C077 = mk(
  () => (
    <>
      <Svg>
        <Cycle labels={CYCLE} at={[-40, -40, -40, -40]} spinFrom={-60} stopAt={3} center={<CycleTag />} />
      </Svg>
      <Fade o={0.45} color={C.night} />
      <Sfx at={3} name="thud" volume={1} />
    </>
  ),
  { bg: "dark" },
);

const C078 = mk(
  ({ s }) => (
    <Svg>
      <Machine y={430} crackAt={s(1) + 6} stopAt={s(1) + 6} />
    </Svg>
  ),
  { bg: "dark" },
);

const C079 = mk(
  ({ s }) => (
    <Svg>
      <RiseArrows
        items={[
          { label: "原材料", at: s(0) },
          { label: "物流費", at: s(1) },
          { label: "人件費", at: s(2) },
        ]}
      />
    </Svg>
  ),
  { bg: "dark" },
);

const C080 = mk(
  ({ f, s }) => {
    const p = ease(f, 4, s(1));
    const pts = Array.from({ length: 30 }, (_, i) => [220 + i * 30, 640 - i * 11 - Math.sin(i * 1.3) * 22]);
    const len = 1300;
    const drop = interpolate(f, [s(1) + 4, s(1) + 16], [-300, 0], { ...clamp, easing: Easing.in(Easing.quad) });
    return (
      <Svg>
        <line x1={200} y1={200} x2={200} y2={700} stroke={C.ink} strokeWidth={5} />
        <line x1={200} y1={700} x2={1100} y2={700} stroke={C.ink} strokeWidth={5} />
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.red} strokeWidth={10} strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
        <text x={230} y={240} fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.red}>
          円安 ↑
        </text>
        <At x={1480} y={640} s={1.8}>
          <IconBox3D />
        </At>
        {f >= s(1) + 4 && (
          <g transform={`translate(1480 ${480 + drop})`}>
            <path d="M -120 -110 H 120 L 150 60 H -150 Z" fill={C.ink} />
            <text textAnchor="middle" y={-5} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.white}>
              負担
            </text>
          </g>
        )}
        <text x={1480} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
          海外からの仕入れ
        </text>
        <Sfx at={s(1) + 16} name="thud" volume={0.9} />
      </Svg>
    );
  },
  { bg: "dark" },
);

const C081 = mk(
  ({ f, s }) => {
    const t = s(1);
    const flip = Math.abs(Math.cos(interpolate(f, [t - 6, t + 6], [0, Math.PI], clamp)));
    return (
      <Svg>
        <Pill x={960} y={140} text="普通の店なら" color={C.inkSoft} at={s(0)} size={48} />
        <g transform={`translate(960 480) scale(${1.6 * Math.max(0.05, flip)} 1.6) rotate(-5)`}>
          <PriceTag text={f < t ? "120円" : "150円"} color={C.orange} string={false} />
        </g>
        <Sfx at={t} name="tok2" volume={0.8} />
      </Svg>
    );
  },
  { bg: "dark" },
);

const C082 = mk(
  ({ s }) => (
    <>
      <Svg>
        <TagHero y={520} s={1.6} crackAt={s(0) + 20} />
      </Svg>
      <Headline lines={[{ t: "「~100円ショップ~」ではなくなる", at: s(2) - 4, strikeAt: s(2) + 14, size: 80 }]} top={70} />
    </>
  ),
  { bg: "dark" },
);

const C083 = mk(({ f, s }) => (
  <>
    <Svg>
      <SplitBg at={s(2)} />
      <g opacity={ease(f, s(2) + 4, s(2) + 16)}>
        <At x={480} y={500} s={1.2} r={-6}>
          <PriceTag string={false} />
        </At>
        <At x={1440} y={500} s={1.2} r={6}>
          <PriceTag string={false} />
        </At>
      </g>
    </Svg>
    <AbsoluteFill style={{ opacity: 1 - ease(f, s(2) - 8, s(2)) }}>
      <Headline lines={[{ t: "まったく*違う答え*", at: s(1), size: 120 }]} />
    </AbsoluteFill>
  </>
));

const Wall: React.FC<{ x: number; y?: number; h?: number; w?: number; p?: number; thick?: number }> = ({ x, y = 300, h = 520, w = 90, p = 1, thick = 0 }) => (
  <g transform={`translate(${x} ${y + h}) scale(1 ${p})`}>
    <rect x={-w / 2 - thick} y={-h} width={w + thick * 2} height={h} rx={10} fill={C.inkSoft} />
    {Array.from({ length: 7 }, (_, i) => (
      <line key={i} x1={-w / 2 - thick} y1={-h + i * (h / 7)} x2={w / 2 + thick} y2={-h + i * (h / 7)} stroke={C.paper} strokeWidth={4} opacity={0.4} />
    ))}
  </g>
);

const C084 = mk(({ f, s }) => (
  <Svg>
    <SplitBg at={-20} />
    <g transform="translate(-100 40)">
      <Ladder
        steps={[
          { text: "100円", at: s(1) },
          { text: "300円", at: s(1) + 8, color: BRAND.daiso },
          { text: "500円", at: s(1) + 16, color: C.ink },
        ]}
        x0={330}
        y0={760}
        dx={220}
        dy={150}
        s={0.55}
      />
    </g>
    <path d="M 300 640 L 820 300" stroke={BRAND.daiso} strokeWidth={14} strokeLinecap="round" opacity={ease(f, s(1) + 20, s(1) + 30)} />
    <path d="M 790 280 L 840 290 L 820 340" stroke={BRAND.daiso} strokeWidth={14} fill="none" strokeLinecap="round" opacity={ease(f, s(1) + 20, s(1) + 30)} />
    <Wall x={1600} p={ease(f, s(3), s(3) + 14, 0, 1, Easing.out(Easing.back(1.5)))} />
    <At x={1360} y={560} s={0.9 * ease(f, s(3), s(3) + 12)} r={-4}>
      <PriceTag string={false} />
    </At>
    <Sfx at={s(3)} name="stamp" volume={0.8} />
  </Svg>
));

const C085 = mk(({ e }) => (
  <>
    <Svg>
      <Fork at={0} />
    </Svg>
    <ChapterCard no="CHAPTER 2" title="DAISOとSeria、正反対の答え" at={e(3) + 4} />
  </>
));

/* ── 13. DAISO ───────────────── */
const ForkPan: React.FC<{ f: number; side: "left" | "right"; at: number }> = ({ f, side, at }) => {
  const p = ease(f, at, at + 36, 0, 1, Easing.inOut(Easing.cubic));
  const dx = (side === "left" ? 1 : -1) * 420 * p;
  return (
    <g transform={`translate(${960 + dx} 540) scale(${1 + 0.35 * p}) translate(-960 -540)`}>
      <Fork at={-60} focus={p > 0.3 ? side : undefined} />
    </g>
  );
};

const C086 = mk(({ f, s }) => (
  <Svg>
    <ForkPan f={f} side="left" at={s(2)} />
    <Sfx at={s(2)} name="whoosh" volume={0.5} />
  </Svg>
));

const C087 = mk(({ s }) => (
  <>
    <Evidence
      no="08"
      file="daiso_interior.jpg"
      caption="DAISO 店内"
      x={240}
      y={60}
      w={1400}
      h={660}
      rot={-1}
      at={s(0)}
      fallback={
        <g>
          <rect width={1920} height={1080} fill={C.paper} />
          <PriceShelf at={s(2) - s(0)} prices={["100円", "300円", "100円", "200円", "500円", "100円"]} />
        </g>
      }
    />
    <Svg>
      <Pill x={1610} y={120} text="DAISO" color={BRAND.daiso} at={s(0) + 8} size={48} />
    </Svg>
  </>
));

const C088 = mk(({ s }) => (
  <Svg>
    <Pill x={320} y={110} text="DAISO" color={BRAND.daiso} at={0} size={44} />
    <Ladder
      x0={280}
      dx={340}
      dy={115}
      y0={760}
      s={0.62}
      steps={[
        { text: "100円", at: 0 },
        { text: "200円", at: s(0), color: C.orange },
        { text: "300円", at: s(1), color: BRAND.daiso },
        { text: "500円", at: s(2), color: C.ink },
        { text: "それ以上", at: s(3) + 10, color: "#6B4B35" },
      ]}
    />
  </Svg>
));

const C089 = mk(({ f, s }) => {
  const q = ease(f, s(4), s(4) + 10, 0, 1, Easing.out(Easing.back(2)));
  const fade = ease(f, s(5), s(5) + 14);
  return (
    <Svg>
      <rect x={260} y={660} width={1400} height={24} rx={8} fill={C.inkSoft} />
      <At x={620} y={520} s={1.4 * ease(f, s(1), s(1) + 10)}>
        <IconPan />
      </At>
      <At x={660} y={760} s={0.5 * ease(f, s(1) + 6, s(1) + 16)} r={-4}>
        <PriceTag string={false} />
      </At>
      <At x={1280} y={500} s={1.4 * ease(f, s(2), s(2) + 10)}>
        <IconLamp />
      </At>
      <At x={1320} y={760} s={0.5 * ease(f, s(2) + 6, s(2) + 16)} r={4}>
        <PriceTag string={false} text="300円" color={BRAND.daiso} />
      </At>
      <At x={1500} y={260} s={0.8 * q} o={1 - fade * 0.8}>
        <Bubble text="高い？" size={70} tail="left" />
      </At>
      {fade > 0 && <path d={`M ${1340} 260 L ${1340 + 330 * fade} 260`} stroke={C.red} strokeWidth={12} strokeLinecap="round" />}
      <Sfx at={s(4)} name="question" volume={0.7} />
      <Sfx at={s(5)} name="chip" volume={0.7} />
    </Svg>
  );
});

const C090 = mk(({ f, s }) => (
  <Svg>
    <At x={460} y={440} s={1.3}>
      <IconLamp />
    </At>
    <At x={500} y={690} s={0.55} r={-4}>
      <PriceTag string={false} text="300円" color={BRAND.daiso} />
    </At>
    {[
      ["ホームセンター", "980円", s(2)],
      ["雑貨店", "1,500円", s(2) + 16],
    ].map(([label, price, at], i) => (
      <g key={i} opacity={ease(f, at as number, (at as number) + 10)}>
        <text x={1120 + i * 420} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
          {label as string}
        </text>
        <At x={1120 + i * 420} y={440 + i * 30} s={1 + i * 0.2}>
          <IconLamp />
        </At>
        <At x={1150 + i * 420} y={690} s={0.55} r={4}>
          <PriceTag string={false} text={price as string} color={C.ink} fontSize={70} />
        </At>
        <Sfx at={at as number} name="pop" volume={0.6} />
      </g>
    ))}
    <text x={1860} y={100} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.inkSoft} opacity={ease(f, s(2), s(2) + 10)}>
      ※価格はイメージ
    </text>
    <text x={880} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.red} opacity={ease(f, s(1), s(1) + 10)}>
      vs
    </text>
  </Svg>
));

const C091 = mk(({ s }) => (
  <Headline
    kicker={{ t: "価値の基準が変わる", at: s(0) }}
    lines={[
      { t: "~100円だから安い~", at: s(1), strikeAt: s(2) - 8, size: 84 },
      { t: "*この品質で、この値段*なら安い", at: s(2), size: 92 },
    ]}
  />
));

const C092 = mk(({ f, s }) => {
  const x = (yen: number) => 260 + (yen / 1000) * 1400;
  const band = ease(f, s(2), s(2) + 18);
  const show = ease(f, s(2) - 8, s(2));
  return (
    <>
      <Clipping kind="調査" source="帝国データバンク" title="100円ショップ市場の成長要因" lines={["中価格帯商品の拡充が成長を支える"]} hl={0} hlAt={s(1)} out={s(2) - 10} y={200} />
      <Svg>
        <g opacity={show}>
          <rect x={x(0)} y={420} width={1400} height={70} rx={35} fill={C.white} stroke={C.line} strokeWidth={4} />
          <rect x={x(150)} y={420} width={(x(500) - x(150)) * band} height={70} fill={C.red} opacity={0.85} />
          {[0, 150, 300, 500, 1000].map((v) => (
            <g key={v}>
              <line x1={x(v)} y1={500} x2={x(v)} y2={530} stroke={C.ink} strokeWidth={4} />
              <text x={x(v)} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.ink}>
                {v}円
              </text>
            </g>
          ))}
          <text x={(x(150) + x(500)) / 2} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.red} opacity={band}>
            中価格帯（150〜500円）
          </text>
        </g>
        <Pill x={960} y={720} text="市場成長を支える ↑" color={C.green} at={s(3)} size={50} />
        <Sfx at={s(2)} name="whoosh" volume={0.5} />
        <Sfx at={s(3)} name="ding" volume={0.6} />
      </Svg>
      <Source text="出典：帝国データバンク" at={s(2)} />
    </>
  );
});

const C093 = mk(({ s }) => (
  <>
    <Svg>
      <Pill x={960} y={110} text="大創産業のブランド" color={C.ink} at={s(2) - 4} size={48} />
    </Svg>
    <BrandPhotos at={[s(3), s(4), s(5)]} y={230} />
  </>
));

const C094 = mk(({ f, s }) => (
  <>
    <Evidence no="03" file="standard_products.jpg" caption="Standard Products" x={120} y={110} w={760} h={460} rot={-2} at={s(0)} fallback={<StoreFallback name="Standard" color={BRAND.std} />} />
    <Evidence no="04" file="threeppy.jpg" caption="THREEPPY" x={1010} y={140} w={760} h={460} rot={2} at={s(2)} fallback={<StoreFallback name="THREEPPY" color={BRAND.threeppy} />} />
    <Svg>
      <text x={530} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={BRAND.std} opacity={ease(f, s(1), s(1) + 10)}>
        デザイン・素材にこだわる
      </text>
      <text x={1410} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={BRAND.threeppy} opacity={ease(f, s(3), s(3) + 10)}>
        300円中心の生活雑貨
      </text>
    </Svg>
  </>
));

const C095 = mk(({ s, e }) => (
  <>
    <Svg>
      <MapCount from={s(1)} to={e(2)} />
    </Svg>
    <Source text="出典：大創産業（2026年2月末）" />
  </>
));

const C096 = mk(({ s }) => (
  <Svg>
    <Flow
      y={440}
      x0={250}
      x1={1670}
      r={128}
      font={44}
      nodes={[
        { label: "入口100円", at: s(1), color: C.red },
        { label: "200円", at: s(2), color: C.orange },
        { label: "300円", at: s(2) + 10, color: BRAND.daiso },
        { label: "500円", at: s(2) + 20, color: C.ink },
        { label: "別ブランド", at: s(3), color: BRAND.std },
      ]}
    />
  </Svg>
));

const C097 = mk(({ f, s }) => {
  const inner = ease(f, s(1), s(1) + 14, 0, 1, Easing.out(Easing.back(1.6)));
  const outer = ease(f, s(2), s(2) + 30, 0, 1, Easing.out(Easing.cubic));
  return (
    <Svg>
      <circle cx={960} cy={470} r={410 * outer} fill={BRAND.daiso} opacity={0.14} />
      <circle cx={960} cy={470} r={410 * outer} fill="none" stroke={BRAND.daiso} strokeWidth={8} strokeDasharray="20 14" opacity={outer} />
      <text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={BRAND.daiso} opacity={outer}>
        低価格で生活用品を選ぶ場所
      </text>
      <circle cx={960} cy={500} r={180 * inner} fill={C.red} />
      <text x={960} y={500} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.white} opacity={inner}>
        100円ショップ
      </text>
      <Sfx at={s(1)} name="pop" volume={0.6} />
      <Sfx at={s(2)} name="whoosh" volume={0.6} />
    </Svg>
  );
});

/* ── 14. Seria ───────────────── */
const C098 = mk(({ s }) => (
  <>
    <Evidence no="09" file="seria_store.jpg" caption="Seria 店舗" x={430} y={70} w={1000} h={560} rot={2} at={s(0)} fallback={<StoreFallback name="Seria" color={BRAND.seria} />} />
    <Svg>
      <Pill x={1450} y={730} text="かなり違う戦略" color={BRAND.seria} at={s(2)} size={46} />
    </Svg>
  </>
));

const C099 = mk(({ f, s }) => {
  const up = ease(f, s(2) - 6, s(2) + 40, 0, 1, Easing.in(Easing.quad));
  const show = ease(f, s(2) - 14, s(2) - 4);
  return (
    <>
      <Clipping kind="分析" source="帝国データバンク" title="セリアの戦略" lines={["業界では「脱・100円」が進む", "セリアは「100円均一売場」に特化"]} hl={1} hlAt={s(1) + 20} out={s(2) - 16} y={180} />
      <Svg>
        <g opacity={show}>
          <line x1={160} y1={620} x2={1760} y2={620} stroke={C.red} strokeWidth={6} strokeDasharray="18 14" />
          <text x={180} y={600} fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.red}>
            100円
          </text>
          {[340, 560, 780, 1480, 1680].map((x, i) => (
            <At key={x} x={x} y={560 - up * (360 + i * 40)} s={0.35} r={-6 + i * 3} o={1 - up * 0.8}>
              <PriceTag string={false} text={["200円", "300円", "500円", "300円", "150円"][i]} color={C.line} />
            </At>
          ))}
          <text x={560} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.inkSoft}>
            業界は「脱・100円」
          </text>
        </g>
        <At x={1130} y={540} s={0.8 * ease(f, s(3), s(3) + 12, 0, 1, Easing.out(Easing.back(2)))} r={-4}>
          <PriceTag string={false} />
        </At>
        <Pill x={1130} y={380} text="Seria" color={BRAND.seria} at={s(3)} size={48} />
        <Pill x={1130} y={760} text="100円の価値を高める" color={BRAND.seria} at={s(4)} size={40} />
        <Sfx at={s(2)} name="whoosh" volume={0.6} />
        <Sfx at={s(3)} name="stamp" volume={0.7} />
      </Svg>
    </>
  );
});

const C100 = mk(
  ({ s }) => (
    <Svg>
      <RiseArrows
        items={[
          { label: "原材料費", at: s(1) },
          { label: "輸送費", at: s(2) },
          { label: "円安", at: s(3) },
        ]}
      />
    </Svg>
  ),
  { bg: "dark" },
);

const C101 = mk(({ s }) => (
  <Question
    lines={[
      { t: <>100円を<Red>やめたほうが</Red></>, at: s(1) - 2, size: 110 },
      { t: "簡単ではないだろうか？", at: s(2) - 2, size: 96 },
    ]}
  />
), { bg: "night", noSub: true });

const C102 = mk(({ s }) => (
  <Svg>
    <Pill x={960} y={110} text="Seria" color={BRAND.seria} at={s(0)} size={52} />
    <TagHero y={500} s={1.6} glowAt={s(1)} />
    <Pill x={960} y={830} text="ブランドの価値" color={BRAND.seria} at={s(2)} size={44} />
  </Svg>
));

const C103 = mk(({ s }) => (
  <>
    <Evidence
      no="10"
      file="seria_interior.jpg"
      caption="Seria 店内"
      x={240}
      y={60}
      w={1400}
      h={660}
      rot={1}
      at={0}
      fallback={
        <g>
          <rect width={1920} height={1080} fill={C.paper} />
          <PriceShelf at={-60} prices={["100円"]} />
        </g>
      }
    />
    <Svg>
      <Bubbles
        texts={["これは300円かな？", "これは500円かな？"]}
        times={[s(2), s(3)]}
        clearAt={s(4)}
        spots={[
          [600, 330, -4],
          [1320, 470, 5],
        ]}
      />
    </Svg>
  </>
));

const C104 = mk(({ f, s }) => {
  const p = ease(f, s(2), s(2) + 18, 0, 1, Easing.out(Easing.back(1.3)));
  const swing = 3 * Math.sin((f - s(2)) / 10) * Math.exp(-Math.max(0, f - s(2)) / 40);
  return (
    <Svg>
      <Pill x={960} y={110} text="店のルール" color={C.inkSoft} at={s(0)} size={44} />
      <g transform={`translate(960 ${-400 + 820 * p}) rotate(${swing})`}>
        <line x1={-280} y1={-420} x2={-280} y2={-150} stroke={C.ink} strokeWidth={6} />
        <line x1={280} y1={-420} x2={280} y2={-150} stroke={C.ink} strokeWidth={6} />
        <rect x={-460} y={-160} width={920} height={300} rx={26} fill={BRAND.seria} />
        <rect x={-440} y={-140} width={880} height={260} rx={18} fill="none" stroke={C.white} strokeWidth={4} opacity={0.6} />
        <text y={-50} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={700} fontSize={58} fill={C.white}>
          ここでは、すべて
        </text>
        <text y={50} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={110} fill={C.white}>
          100円
        </text>
      </g>
      <Sfx at={s(2) + 14} name="stamp" volume={0.6} />
    </Svg>
  );
});

/* ── 15. 対比と中間まとめ ───────────────── */
const C105 = mk(({ f, s }) => {
  const p = ease(f, s(2), s(3) + 10, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Svg>
      <SplitBg at={-20} dim="right" />
      <Wall x={320 - 160 * p} y={300} h={480} w={60} />
      <Wall x={640 + 160 * p} y={300} h={480} w={60} />
      {Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const show = i < 2 ? 1 : ease(f, s(3) + (i - 2) * 6, s(3) + (i - 2) * 6 + 10);
        return (
          <At key={i} x={480 + (col - 1) * (100 + 110 * p)} y={480 + row * 180} s={0.36 * show} r={-4}>
            <PriceTag string={false} text={["100円", "100円", "200円", "300円", "500円", "1000円"][i]} color={[C.red, C.red, C.orange, BRAND.daiso, C.ink, "#6B4B35"][i]} fontSize={i === 5 ? 72 : undefined} />
          </At>
        );
      })}
      <Sfx at={s(2)} name="whoosh" volume={0.6} />
    </Svg>
  );
});

const C106 = mk(({ f, s }) => {
  const th = ease(f, s(1), s(1) + 16) * 26;
  return (
    <Svg>
      <SplitBg at={-20} dim="left" />
      <Wall x={1220} y={300} h={480} w={60} thick={th} />
      <Wall x={1660} y={300} h={480} w={60} thick={th} />
      <TagHero x={1440} y={540} s={0.8} glowAt={s(2)} />
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </Svg>
  );
});

const C107 = mk(({ s }) => (
  <Svg>
    <Fork at={s(2)} fog={0.6} />
  </Svg>
));

const C108 = mk(({ s }) => (
  <Question
    kicker="最初の疑問"
    lines={[
      { t: "なぜ100円ショップは、", at: s(2) - 2, size: 88 },
      { t: <><Red>100円</Red>で儲けることができたのか。</>, at: s(3) - 2, size: 96 },
    ]}
  />
), { bg: "night" });

const C109 = mk(({ s }) => (
  <Headline
    lines={[
      { t: "~安い商品を売ったから~", at: s(1) - 4, strikeAt: s(1) + 22, size: 100 },
      { t: "…だけではない", at: s(1) + 26, size: 80, weight: 700 },
    ]}
  />
));

const C110 = mk(({ f, s }) => (
  <Svg>
    <ClueBoard lit={[s(0), s(3), s(4), -100]} title={{ at: 0 }} />
    <g opacity={ease(f, s(5), s(5) + 10)}>
      <text x={960} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.red}>
        一人が買う点数 ↑
      </text>
    </g>
    {[s(1), s(2)].map((a, i) => (
      <Sfx key={i} at={a} name={`tok${i + 2}`} volume={0.5} />
    ))}
  </Svg>
));

const C111 = mk(({ f, s }) => (
  <Svg>
    <SplitBg at={s(1) - 10} />
    <g opacity={ease(f, s(2), s(2) + 12)}>
      <Ladder x0={260} dx={200} dy={130} y0={720} s={0.45} steps={[{ text: "100円", at: s(2) }, { text: "300円", at: s(2) + 8, color: BRAND.daiso }, { text: "500円", at: s(2) + 16, color: C.ink }]} />
      <text x={480} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={BRAND.daiso}>
        ルールを広げる
      </text>
    </g>
    <g opacity={ease(f, s(2) + 10, s(2) + 22)}>
      <TagHero x={1440} y={540} s={0.8} glowAt={s(2) + 14} />
      <text x={1440} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={BRAND.seria}>
        ルールを守る
      </text>
    </g>
  </Svg>
));

const C112 = mk(({ s }) => <Headline kicker={{ t: "今、起きているのは", at: s(0) }} lines={[{ t: "単なる「~値上げ~」ではない", at: s(2) - 4, strikeAt: s(2) + 20, size: 110 }]} />);

const C113 = mk(({ f, s }) => {
  const k = ease(f, s(2), s(3) + 20);
  const text = "100円ショップ";
  return (
    <Svg>
      <g transform="translate(960 460)">
        <rect x={-560} y={-130} width={1120} height={260} rx={24} fill={C.ink} />
        {[...text].map((ch, i) => {
          const x = -430 + i * 124;
          const r = Math.sin(i * 2.1 + f / 8) * 14 * k;
          const dy = Math.sin(i * 1.7 + f / 10) * 18 * k;
          return (
            <text key={i} x={x} y={dy} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={120} fill={i < 4 ? C.red : C.white} transform={`rotate(${r} ${x} ${dy})`} opacity={1 - k * 0.35}>
              {ch}
            </text>
          );
        })}
      </g>
      <text x={960} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.ink} opacity={ease(f, s(3), s(3) + 12)}>
        変わり始めている…？
      </text>
    </Svg>
  );
});

/* ── 16. 結論 ───────────────── */
const C114 = mk(({ f, s }) => (
  <>
    <Headline lines={[{ t: "なぜ*100円*で儲かるのか", at: s(3) - 4, size: 110 }]} />
    <AbsoluteFill style={{ opacity: 1 - ease(f, s(2) - 8, s(2) + 4) }}>
      <ChapterCard no="CHAPTER 3" title="答え" at={0} />
    </AbsoluteFill>
  </>
));

const C115 = mk(({ s }) => (
  <Headline
    lines={[
      { t: "答えは*意外とシンプル*", at: s(1), size: 100 },
      { t: "~大きく儲ける~わけではない", at: s(3), strikeAt: s(3) + 16, size: 72, weight: 700 },
    ]}
  />
));

const C116 = mk(({ s }) => (
  <Svg>
    <ClueBoard lit={[s(0), s(2), -100, -100]} title={{ at: 0 }} />
  </Svg>
));

const C117 = mk(({ f, s }) => {
  const lands = [-100, -100, s(1) + 6, s(3) + 6];
  return (
    <Svg>
      <Shelves o={0.5} />
      <Basket lands={lands} kinds={[0, 1, 6, 5]} />
      <CountBox n={lands.filter((l) => f >= l).length} />
      <At x={560} y={200} s={0.75 * ease(f, s(1), s(1) + 10, 0, 1, Easing.out(Easing.back(2)))}>
        <Bubble text="100円なら、もう一つ" size={56} tail="right" />
      </At>
      <Sfx at={s(1)} name="pop" volume={0.6} />
      <Sfx at={s(1) + 6} name="tok3" volume={0.8} />
      <Sfx at={s(3) + 6} name="tok4" volume={0.8} />
    </Svg>
  );
});

const C118 = mk(({ f, s }) => {
  const t = s(3) - 4;
  const flip = Math.abs(Math.cos(interpolate(f, [t - 7, t + 7], [0, Math.PI], clamp)));
  const after = f >= t;
  return (
    <Svg>
      <g transform={`translate(960 470) scale(${1.4 * Math.max(0.05, flip)} 1.4) rotate(-4)`}>
        <PriceTag string={false} w={after ? 700 : 380} text={after ? "迷わず買える" : "100円"} fontSize={after ? 80 : undefined} />
      </g>
      <Sfx at={t} name="whoosh" volume={0.6} />
      <Sfx at={t + 8} name="ding" volume={0.7} />
    </Svg>
  );
});

const C119 = mk(({ f, d }) => (
  <Svg>
    <TagHero y={460} s={1.6 + 0.5 * (f / d)} />
  </Svg>
));

const RING = [
  ["作る", <IconFactory key="a" />, 0.55],
  ["仕入れる", <IconHQ key="b" />, 0.6],
  ["運ぶ", <IconTruck key="c" />, 0.6],
  ["売る", <IconStore key="d" />, 0.36],
  ["選ぶ", <IconPerson key="e" />, 0.75],
] as const;

const PIECES = ["商品構成", "大量仕入れ", "取引条件", "物流", "価格戦略", "まとめ買い"];
const C120 = mk(({ f, s }) => {
  const times = [s(0), s(1), s(1) + 12, s(2), s(3), s(5)];
  const merge = ease(f, s(6) - 4, s(6) + 20, 0, 1, Easing.inOut(Easing.cubic));
  const final = ease(f, s(6) + 16, s(6) + 30);
  return (
    <>
      <Svg>
        <g opacity={1 - final * 0.85}>
          <TagHero y={440} s={0.9 + 0.5 * merge} glowAt={s(6) + 14} />
        </g>
        {PIECES.map((label, i) => {
          const a = -Math.PI / 2 + (i / PIECES.length) * Math.PI * 2;
          const x = 960 + Math.cos(a) * 600 * (1 - merge);
          const y = 440 + Math.sin(a) * 300 * (1 - merge);
          const p = ease(f, times[i], times[i] + 12, 0, 1, Easing.out(Easing.back(2)));
          const w = [...label].length * 50 + 70;
          return (
            <g key={label} transform={`translate(${x} ${y}) scale(${p * (1 - 0.7 * merge)})`} opacity={1 - merge}>
              <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill={i === 5 ? C.red : C.ink} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.white}>
                {label}
              </text>
              <Sfx at={times[i]} name={`tok${i % 6}`} volume={0.6} />
            </g>
          );
        })}
        <Sfx at={s(6) - 4} name="whoosh" volume={0.7} />
      </Svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 170, fontFamily: FONT, color: C.ink, textAlign: "center", opacity: final }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: 4 }}>
          <span style={{ color: C.red, fontWeight: 900 }}>100円</span>は、ただの値段ではない。
        </div>
        <div style={{ fontSize: 124, fontWeight: 900, letterSpacing: 6, marginTop: 14, transform: `scale(${0.94 + 0.06 * final})` }}>
          ビジネスの<span style={{ color: C.red }}>ルール</span>だった。
        </div>
      </AbsoluteFill>
      <Sfx at={s(6) + 16} name="thud" volume={0.7} />
    </>
  );
});

const C121 = mk(({ f, s }) => (
  <Svg>
    <SplitBg at={-20} />
    <g opacity={ease(f, s(3), s(3) + 12)}>
      <TagHero x={480} y={500} s={0.75} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const r = 230 + 40 * ease(f, s(3), s(4) + 20);
        return <path key={i} d="M 0 -26 L 44 0 L 0 26 Z" fill={BRAND.daiso} transform={`translate(${480 + Math.cos(a) * r} ${500 + Math.sin(a) * r}) rotate(${(a * 180) / Math.PI})`} />;
      })}
      <text x={480} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={BRAND.daiso}>
        100円の外側へ
      </text>
    </g>
    <g opacity={ease(f, s(5), s(5) + 12)}>
      <circle cx={1440} cy={500} r={250} fill="none" stroke={BRAND.seria} strokeWidth={18} />
      <TagHero x={1440} y={500} s={0.75} />
      <text x={1440} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={BRAND.seria}>
        100円のルールを守る
      </text>
    </g>
  </Svg>
));

const C122 = mk(({ f, s }) => (
  <Svg>
    <Fork at={-60} fog={1.3} />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={200} fill={C.ink} opacity={0.55 * ease(f, s(1), s(1) + 12)}>
      ？
    </text>
    <Sfx at={s(1)} name="question" volume={0.6} />
  </Svg>
));

/* ── 17. エンディング ───────────────── */
const C123 = mk(({ f, s }) => {
  const lift = ease(f, s(1), s(2) + 10, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Svg>
      <Shelves o={0.35} />
      <At x={900} y={560 - lift * 60} s={2.4} r={-lift * 4}>
        <IconBox />
      </At>
      <At x={1280} y={520 - lift * 60} s={0.8} r={-8}>
        <PriceTag />
      </At>
    </Svg>
  );
});


const CHAIN = (s: (i: number) => number, all = false): { label: string; at: number; icon: React.ReactNode; color?: string }[] => [
  { label: "メーカー", at: all ? -30 : s(1), icon: <At s={0.62}><IconFactory /></At> },
  { label: "企業", at: all ? -30 : s(2), icon: <At s={0.7}><IconHQ /></At> },
  { label: "物流", at: all ? -30 : s(3), icon: <At s={0.62}><IconTruck /></At> },
  { label: "店舗", at: all ? -30 : s(4), icon: <At s={0.4}><IconStore /></At>, color: C.red },
];

const C124 = mk(({ f, s }) => (
  <Svg>
    <g opacity={ease(f, s(1) - 6, s(1) + 6)}>
      <MoneyFlow stops={CHAIN(s)} />
    </g>
    <g opacity={1 - ease(f, s(1) - 10, s(1))}>
      <TagHero y={450} s={1.4} />
    </g>
  </Svg>
));

const C125 = mk(({ s }) => (
  <Svg>
    <MoneyFlow
      stops={[...CHAIN(s, true), { label: "私たち", at: s(1), color: C.red, icon: <At s={0.8}><IconPerson /></At> }]}
      moneyAt={s(1) + 10}
      highlight={s(2)}
    />
    <Sfx at={s(2)} name="jingle" volume={0.5} />
  </Svg>
));

const C126 = mk(({ f, s }) => {
  const focus = ease(f, s(3), s(3) + 20);
  return (
    <>
      <Evidence
        no="11"
        file="shelf_100yen.jpg"
        caption="100円ショップの棚"
        x={240}
        y={60}
        w={1400}
        h={660}
        rot={-1}
        at={0}
        fallback={
          <g>
            <rect width={1920} height={1080} fill={C.paper} />
            <PriceShelf at={-60} prices={["100円"]} />
          </g>
        }
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 40% 45%, rgba(0,0,0,0) ${260 - 120 * focus}px, rgba(20,27,43,${0.65 * focus}) ${420 - 100 * focus}px)`,
        }}
      />
      <Sfx at={s(3)} name="whoosh" volume={0.4} />
    </>
  );
});

const C127 = mk(({ f, s }) => {
  const chars = "100円";
  const n = [0, 1, 2, 3].filter((k) => f >= s(2) + k * 7).length;
  return (
    <Svg>
      <At x={960} y={460} s={2.4} r={-4}>
        <PriceTag string={false} text={chars.slice(0, n)} />
      </At>
      {[0, 1, 2, 3].map((k) => (
        <Sfx key={k} at={s(2) + k * 7} name="tok2" volume={0.7} />
      ))}
      <Sfx at={s(2) + 30} name="ding" volume={0.6} />
    </Svg>
  );
});

const C128 = mk(({ f }) => (
  <Svg>
    <Machine y={470} s={1.2} o={0.15 + 0.35 * ease(f, 10, 60)} />
    <TagHero y={470} s={1.3} />
  </Svg>
));

const C129 = mk(({ s }) => <Headline lines={[{ t: "身近なお金には、", at: s(0), size: 90 }, { t: "まだまだ*謎*がある。", at: s(1), size: 120 }]} />, { noSub: true });

const C130 = mk(({ f, s }) => {
  const p = ease(f, s(0), s(0) + 16, 0, 1, Easing.out(Easing.back(1.6)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: FONT }}>
        <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
          <div style={{ fontSize: 170, fontWeight: 900, color: C.ink, letterSpacing: 28 }}>KANENAZO</div>
          <div style={{ display: "inline-block", marginTop: 8, background: C.red, color: C.white, fontSize: 48, fontWeight: 900, letterSpacing: 16, padding: "4px 30px", borderRadius: 12 }}>カネナゾ</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: C.inkSoft, letterSpacing: 10, marginTop: 44, opacity: ease(f, s(1), s(1) + 12) }}>身近なお金の謎を解く。</div>
      </AbsoluteFill>
      <Sfx at={s(0)} name="jingle" volume={1} />
    </>
  );
}, { noSub: true });

const C131 = mk(({ f, s, d }) => {
  const p = ease(f, s(0) + 16, s(0) + 30);
  const out = ease(f, d - 30, d);
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120, fontFamily: FONT, opacity: 1 - out }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: C.ink, marginBottom: 50 }}>では、次の謎で。</div>
        <div style={{ display: "flex", gap: 60, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
          <div style={{ width: 640, height: 360, border: `6px dashed ${C.line}`, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: C.inkSoft }}>
            次の動画
          </div>
          <div style={{ width: 640, height: 360, border: `6px dashed ${C.line}`, borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ background: C.red, color: C.white, fontSize: 48, fontWeight: 900, padding: "16px 48px", borderRadius: 16 }}>チャンネル登録</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.inkSoft }}>カネナゾ</div>
          </div>
        </div>
      </AbsoluteFill>
      <Fade o={out} color={C.night} />
    </>
  );
}, { noSub: true });

export const PART3 = {
  C061, C062, C063, C064, C065, C066, C067, C068, C069, C070, C071, C072, C073, C074, C075, C076, C077, C078, C079,
  C080, C081, C082, C083, C084, C085, C086, C087, C088, C089, C090, C091, C092, C093, C094, C095, C096, C097, C098,
  C099, C100, C101, C102, C103, C104, C105, C106, C107, C108, C109, C110, C111, C112, C113, C114, C115, C116, C117,
  C118, C119, C120, C121, C122, C123, C124, C125, C126, C127, C128, C129, C130, C131,
};
