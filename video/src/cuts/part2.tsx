/** 2〜8 章（C012–C060）: 市場規模・誕生・発想の転換・仕組み①② */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  At,
  Bubble,
  Coin,
  IconBox3D,
  IconDoc,
  IconFactory,
  IconMug,
  IconNotes,
  IconPan,
  IconPerson,
  IconShip,
  IconSticker,
  IconStore,
  IconTape,
  IconTruck,
  IconWarehouse,
  JapanMap,
  PRODUCTS,
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
  Counter,
  Flow,
  Headline,
  IconGrid,
  Machine,
  MapCount,
  Source,
  TagHero,
  fmtNum,
  fmtOku,
} from "../kit";
import { Sfx, clamp, ease } from "../lib";
import { BRAND, C, FONT } from "../theme";
import { Fade, Pill, Slots, Svg, mk } from "./common";
import { Basket } from "./opening";
import { ClueBoard, Clipping, Evidence, Question, Red } from "../case";

/* ── 2. 市場規模 ───────────────── */
const C012 = mk(({ f, s }) => {
  const z = ease(f, 0, s(1) + 10, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Svg>
      <At x={960} y={430} s={1.6 + z * 5} r={-6} o={0.1 + z * 0.05}>
        <PriceTag string={false} />
      </At>
      <At x={960} y={440} s={1.6 - z * 0.9} r={-6}>
        <PriceTag string={false} />
      </At>
      <Sfx at={4} name="whoosh" volume={0.5} />
      <Sfx at={s(1)} name="thud" volume={0.8} />
    </Svg>
  );
});

const C013 = mk(({ s }) => (
  <>
    <Clipping
      kind="調査"
      source="帝国データバンク"
      title="100円ショップ業界の動向"
      lines={["2025年度の国内市場規模を推計", "10年前と比べて拡大が続く"]}
      hl={0}
      hlAt={s(1)}
      out={s(2) - 12}
    />
    <Counter label="2025年度　国内100円ショップ市場" labelAt={s(2) - 8} value={11100} fmt={(v) => "約" + fmtOku(v)} at={s(2) - 4} dur={40} size={170} />
  </>
));

const C014 = mk(({ s }) => (
  <>
    <Svg>
      <Bars
        max={1.6}
        bars={[
          { label: "10年前", value: 1, color: C.line, at: s(0) + 4 },
          { label: "2025年度", value: 1.5, color: C.red, at: s(1), valueText: "約1兆1100億円" },
        ]}
        width={260}
        gap={260}
      />
      <Pill x={1340} y={250} text="× 1.5" color={C.ink} at={s(1) + 26} size={64} />
    </Svg>
    <Source text="出典：帝国データバンク" />
    <Sfx at={s(1) + 26} name="ding" volume={0.6} />
  </>
));

export const StoreFallback: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <g>
    <rect width={1920} height={1080} fill="#E6EEF2" />
    <rect y={820} width={1920} height={260} fill={C.paperDeep} />
    <At x={960} y={640} s={1.7}>
      <IconStore w={560} />
    </At>
    <g transform="translate(960 150)">
      <rect x={-300} y={-70} width={600} height={140} rx={24} fill={color} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.white} letterSpacing={6}>
        {name}
      </text>
    </g>
  </g>
);

const C015 = mk(({ s }) => (
  <>
    <Evidence no="01" file="daiso_store.jpg" caption="DAISO 店舗" x={430} y={70} w={1000} h={560} at={2} fallback={<StoreFallback name="DAISO" color={BRAND.daiso} />} />
    <Svg>
      <Pill x={1460} y={720} text="その象徴" color={C.ink} at={s(0) + 10} size={48} />
    </Svg>
  </>
));

const C016 = mk(({ s }) => (
  <>
    <Clipping kind="決算" source="大創産業" title="2026年2月期 連結決算" lines={["連結売上高を公表"]} hl={0} hlAt={s(0) + 20} out={s(1) - 12} x={460} w={1000} y={170} />
    <Counter label="大創産業　2026年2月期　連結売上高" labelAt={s(1) - 8} value={7710} fmt={fmtOku} at={s(1) - 4} dur={36} />
  </>
));

/** 大創産業の 3 ブランド構造（EVIDENCE 02） */
export const BrandTree: React.FC<{ at: [number, number, number, number] }> = ({ at }) => {
  const f = useCurrentFrame();
  const top = ease(f, at[0], at[0] + 12, 0, 1, Easing.out(Easing.back(1.6)));
  const brands = [
    ["DAISO", "100円が中心", BRAND.daiso, 420],
    ["Standard Products", "デザイン・素材にこだわる", BRAND.std, 960],
    ["THREEPPY", "300円が中心", BRAND.threeppy, 1500],
  ] as const;
  return (
    <Svg>
      <g transform="translate(150 110)" opacity={ease(f, at[0], at[0] + 10)}>
        <rect x={-6} y={-24} width={196} height={46} rx={8} fill={C.red} />
        <text x={92} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={24} fill={C.white} letterSpacing={3}>
          EVIDENCE 02
        </text>
      </g>
      <g transform={`translate(960 230) scale(${top})`}>
        <rect x={-230} y={-60} width={460} height={120} rx={24} fill={C.ink} />
        <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={62} fill={C.paper} letterSpacing={6}>
          大創産業
        </text>
      </g>
      {brands.map(([name, sub, color, x], i) => {
        const a = at[i + 1];
        const line = ease(f, a - 10, a + 4);
        const p = ease(f, a, a + 14, 0, 1, Easing.out(Easing.back(1.6)));
        return (
          <g key={name}>
            <path d={`M 960 290 V 360 H ${x} V ${360 + 90 * line}`} fill="none" stroke={C.inkSoft} strokeWidth={6} strokeLinecap="round" opacity={line > 0 ? 1 : 0} />
            <g transform={`translate(${x} 580) scale(${p})`}>
              <rect x={-230} y={-130} width={460} height={260} rx={26} fill={C.white} stroke={color} strokeWidth={8} />
              <rect x={-230} y={-130} width={460} height={24} rx={12} fill={color} />
              <At x={0} y={-40} s={0.22}>
                <IconStore />
              </At>
              <text y={48} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={name.length > 10 ? 40 : 54} fill={color}>
                {name}
              </text>
              <text y={98} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.inkSoft}>
                {sub}
              </text>
            </g>
            <Sfx at={a} name="tok" volume={0.5} />
          </g>
        );
      })}
    </Svg>
  );
};

export const BrandPhotos: React.FC<{ at: number[]; y?: number }> = ({ at, y = 180 }) => (
  <>
    {(
      [
        ["02", "daiso_store.jpg", "DAISO", BRAND.daiso],
        ["03", "standard_products.jpg", "Standard Products", BRAND.std],
        ["04", "threeppy.jpg", "THREEPPY", BRAND.threeppy],
      ] as const
    ).map(([no, file, name, color], i) => (
      <Evidence
        key={no}
        no={no}
        file={file}
        caption={name}
        x={90 + i * 600}
        y={y + (i % 2) * 30}
        w={520}
        h={330}
        rot={[-3, 2, -1.5][i]}
        at={at[i]}
        fallback={<StoreFallback name={name === "Standard Products" ? "Standard" : name} color={color} />}
      />
    ))}
  </>
);

const C017 = mk(({ f, s, e }) => {
  const out = ease(f, s(2) - 8, s(2) + 4);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <BrandTree at={[s(0) - 4, s(0) + 8, s(1), s(1) + 18]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: out }}>
        <Svg>
          <MapCount from={s(2)} to={e(2)} />
        </Svg>
      </AbsoluteFill>
      <Source text="出典：大創産業（2026年2月末）" at={s(2)} />
    </>
  );
});

const C018 = mk(({ s }) => (
  <>
    <Svg>
      <TagHero y={500} s={1.5} qAt={s(1)} />
    </Svg>
    <Headline lines={[{ t: "なぜ「*100円*」から生まれた？", at: s(1), size: 80 }]} top={90} />
  </>
));

/* ── 3. 誕生（回想トーン） ───────────────── */
const C019 = mk(
  ({ s, e }) => <Headline kicker={{ t: "その始まりは", at: 0 }} lines={[{ t: "~緻密な経営戦略~", at: s(1) - 4, strikeAt: e(1) - 14, size: 120 }]} />,
  { bg: "retro" },
);

const C020 = mk(
  ({ f }) => {
    const p = ease(f, 4, 24);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 140 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 280, fontWeight: 700, color: "#5B4630", letterSpacing: 20, opacity: p, transform: `scale(${1.15 - 0.15 * p})` }}>
          1970s
        </div>
        <div style={{ width: 800 * p, height: 6, background: "#5B4630", marginTop: 10 }} />
        <Sfx at={4} name="whoosh" volume={0.5} />
        <Sfx at={10} name="thud" volume={0.5} />
      </AbsoluteFill>
    );
  },
  { bg: "retro" },
);

/** 移動販売の屋台 */
const Stall: React.FC<{ prices?: string[]; priceAt?: number; flipAt?: number; f: number; shake?: number }> = ({ prices, priceAt = 0, flipAt, f, shake = 0 }) => (
  <g transform={`translate(${shake} 0)`}>
    <At x={430} y={560} s={2.1}>
      <IconTruck />
    </At>
    <rect x={800} y={560} width={900} height={36} rx={10} fill="#8C6A45" />
    <rect x={830} y={596} width={24} height={220} fill="#6B4B35" />
    <rect x={1646} y={596} width={24} height={220} fill="#6B4B35" />
    <path d="M 780 300 L 1720 300 L 1680 380 L 820 380 Z" fill={C.red} />
    {Array.from({ length: 6 }, (_, i) => (
      <path key={i} d={`M ${820 + i * 150} 380 h 150 v 20 a 75 20 0 0 1 -150 0 Z`} fill={i % 2 ? C.white : C.red} />
    ))}
    {Array.from({ length: 5 }, (_, i) => {
      const Icon = PRODUCTS[(i * 3 + 2) % PRODUCTS.length];
      const x = 900 + i * 180;
      const flipped = flipAt !== undefined && f >= flipAt + i * 5;
      const flip = flipAt === undefined ? 1 : Math.abs(Math.cos(interpolate(f, [flipAt + i * 5 - 5, flipAt + i * 5 + 5], [0, Math.PI], clamp)));
      const tp = prices ? ease(f, priceAt + i * 5, priceAt + i * 5 + 10, 0, 1, Easing.out(Easing.back(2))) : 0;
      return (
        <g key={i}>
          <At x={x} y={500} s={0.5}>
            <Icon />
          </At>
          {prices && (
            <g transform={`translate(${x + 10} 650) scale(${0.28 * tp * Math.max(0.05, flip)} ${0.28 * tp}) rotate(-6)`}>
              <PriceTag text={flipped ? "100円" : prices[i]} color={flipped ? C.red : C.orange} string={false} />
            </g>
          )}
        </g>
      );
    })}
  </g>
);

const ROUTE: [number, number][] = [
  [330, -150], [250, -60], [200, 20], [120, 60], [20, 100], [-80, 130], [-140, 190], [-150, 240],
];
const C021 = mk(
  ({ f, s, d }) => {
    const t = interpolate(f, [s(1), d - 10], [0, ROUTE.length - 1], clamp);
    const i = Math.min(ROUTE.length - 2, Math.floor(t));
    const k = t - i;
    const [x0, y0] = ROUTE[i];
    const [x1, y1] = ROUTE[i + 1];
    const tx = x0 + (x1 - x0) * k;
    const ty = y0 + (y1 - y0) * k;
    const p = ease(f, s(0), s(0) + 14, 0, 1, Easing.out(Easing.back(1.4)));
    return (
      <Svg>
        <At x={620} y={470} s={1.5}>
          <JapanMap />
          <polyline points={ROUTE.slice(0, i + 2).map(([x, y], j) => (j === i + 1 ? `${tx},${ty}` : `${x},${y}`)).join(" ")} fill="none" stroke="#8C6A45" strokeWidth={6} strokeDasharray="10 10" />
          {ROUTE.slice(0, i + 1).map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={9} fill="#8C6A45" />
          ))}
          <At x={tx} y={ty - 30} s={0.35}>
            <IconTruck t={f} />
          </At>
        </At>
        {/* 創業者の情報グラフィック（写真枠ではない） */}
        <g transform={`translate(1450 360) scale(${p})`}>
          <circle r={150} fill="#E3D6BD" stroke="#8C6A45" strokeWidth={8} />
          <At y={40} s={1.6}>
            <IconPerson color="#8C6A45" />
          </At>
        </g>
        <text x={1450} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#8C6A45" opacity={ease(f, s(0) + 6, s(0) + 16)}>
          創業者
        </text>
        <text x={1450} y={670} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#5B4630" opacity={ease(f, s(0) + 8, s(0) + 18)}>
          矢野博丈
        </text>
        <g transform="translate(1450 740)" opacity={ease(f, s(0) + 12, s(0) + 22)}>
          <rect x={-120} y={-30} width={240} height={60} rx={30} fill="#8C6A45" />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#F4EEE3" letterSpacing={2}>
            1970年代
          </text>
        </g>
        <Sfx at={s(1)} name="swell" volume={0.4} />
      </Svg>
    );
  },
  { bg: "retro" },
);

const PRICES = ["80円", "150円", "230円", "120円", "300円"];

const C022 = mk(
  ({ f }) => (
    <Evidence
      no="06"
      file="mobile_sales.jpg"
      caption="移動販売（1970年代）"
      x={330}
      y={60}
      w={1220}
      h={640}
      at={0}
      fallback={
        <g>
          <rect width={1920} height={1080} fill="#EFE4CC" />
          <Stall f={f} />
        </g>
      }
    />
  ),
  { bg: "retro" },
);

const C023 = mk(
  ({ f, s }) => (
    <Svg>
      <Stall f={f} prices={PRICES} priceAt={s(0) + 12} />
      <Sfx at={s(0) + 14} name="thud" volume={0.6} />
    </Svg>
  ),
  { bg: "retro" },
);

const People: React.FC = () => (
  <g>
    {[250, 560, 1360, 1680].map((x, i) => (
      <At key={x} x={x} y={820} s={0.9}>
        <IconPerson color={["#B07B4F", "#8C6A45", "#A5694A", "#7E6448"][i]} />
      </At>
    ))}
  </g>
);

const ASK = ["これいくら？", "いくら？", "これは？"];
const C024 = mk(
  ({ s, e }) => (
    <Svg>
      <People />
      <Bubbles texts={ASK} times={Array.from({ length: 7 }, (_, k) => s(1) + ((e(1) - s(1)) * k) / 7)} />
    </Svg>
  ),
  { bg: "retro" },
);

const C025 = mk(
  ({ f, d }) => {
    const n = Math.floor(interpolate(f, [0, d], [7, 60], clamp));
    return (
      <>
        <Svg>
          <People />
          <Bubbles texts={ASK} times={Array.from({ length: 11 }, (_, k) => (k < 7 ? -20 : 10 + (k - 7) * 14))} />
        </Svg>
        <div style={{ position: "absolute", right: 60, top: 40, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#5B4630", background: "rgba(255,255,255,0.7)", padding: "8px 26px", borderRadius: 14 }}>
          質問 × {n}
        </div>
      </>
    );
  },
  { bg: "retro" },
);

const C026 = mk(
  ({ f, d }) => {
    const shake = f < d - 12 ? Math.sin(f * 2.3) * interpolate(f, [0, d - 12], [2, 9], clamp) : 0;
    return (
      <Svg>
        <g transform={`translate(${shake} ${shake * 0.4})`}>
          <People />
          <Bubbles texts={ASK} times={Array.from({ length: 12 }, (_, k) => (k < 11 ? -20 : 6))} />
        </g>
      </Svg>
    );
  },
  { bg: "retro" },
);

const C027 = mk(
  () => (
    <>
      <Svg>
        <People />
        <Bubbles texts={ASK} times={Array.from({ length: 12 }, () => -20)} />
      </Svg>
      <Fade o={0.35} color="#3A2E1E" />
    </>
  ),
  { bg: "retro" },
);

const C028 = mk(
  ({ f, s }) => (
    <Svg>
      <Stall f={f} prices={PRICES} priceAt={-100} flipAt={s(0) + 4} />
      {Array.from({ length: 5 }, (_, i) => (
        <Sfx key={i} at={s(0) + 4 + i * 5} name={`tok${i + 1}`} volume={0.9} />
      ))}
      <Sfx at={s(0) + 30} name="ding" volume={0.9} />
    </Svg>
  ),
  { bg: "retro" },
);

const C029 = mk(
  ({ s }) => <Headline kicker={{ t: "のちのビジネスモデル", at: s(0) }} lines={[{ t: "*100円均一*", at: s(1) - 4, size: 170 }]} />,
  { bg: "paper", retro: ({ f }) => 1 - ease(f, 0, 24) },
);

/* ── 4. 発想の転換 ───────────────── */
const C030 = mk(({ s }) => <Headline lines={[{ t: "これは、かなり*大胆*だ。", at: s(0), size: 120 }]} />);

const Row: React.FC<{ y: number; icon: React.ReactNode; cost: string; price: string; big: boolean; at: number; f: number }> = ({ y, icon, cost, price, big, at, f }) => {
  const p = ease(f, at, at + 14);
  return (
    <g opacity={p}>
      <At x={380} y={y} s={0.9}>
        {icon}
      </At>
      <text x={380} y={y + 120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={C.ink}>
        {cost}
      </text>
      <line x1={600} y1={y} x2={600 + 520 * ease(f, at + 6, at + 20)} y2={y} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <At x={1450} y={y} s={(big ? 0.9 : 0.5) * ease(f, at + 16, at + 28, 0, 1, Easing.out(Easing.back(2)))} r={-5}>
        <PriceTag text={price} color={big ? C.red : C.orange} string={false} />
      </At>
      <Sfx at={at + 16} name="pop" volume={0.6} />
    </g>
  );
};

const C031 = mk(({ f, s }) => (
  <>
    <Svg>
      <Pill x={960} y={120} text="普通の商売" color={C.inkSoft} at={s(0)} size={48} />
      <Row y={360} icon={<IconPan />} cost="仕入れ値：高" price="高く売る" big at={s(1)} f={f} />
      <Row y={680} icon={<IconNotes />} cost="仕入れ値：安" price="安く売る" big={false} at={s(2)} f={f} />
    </Svg>
  </>
));

const C032 = mk(({ s }) => (
  <Headline
    lines={[
      { t: "_仕入れ値 → 販売価格_", at: 0, size: 70, strikeAt: s(0) + 12 },
      { t: "*100円* → 商品", at: s(1), size: 140 },
    ]}
  />
));

const C033 = mk(({ s }) => (
  <Svg>
    <Flow
      y={420}
      nodes={[
        { label: "100円", at: s(0), color: C.red },
        { label: "探す", at: s(0) + 22, icon: <At s={0.7}><IconDoc w={200} h={240} lines={5} hl={2} /></At> },
        { label: "作る", at: s(1), icon: <At s={0.75}><IconFactory /></At> },
        { label: "運ぶ", at: s(1) + 12, icon: <At s={0.8}><IconTruck /></At> },
        { label: "並べる", at: s(1) + 26, icon: <At s={0.5}><IconStore /></At> },
      ]}
    />
  </Svg>
));

const C034 = mk(({ s, e }) => (
  <Headline kicker={{ t: "つまり", at: s(0) }} lines={[{ t: "~商品の値段を100円にした~", at: s(1) - 4, strikeAt: e(1) - 10, size: 100 }]} />
));

const C035 = mk(({ f, s }) => {
  const items = [
    [-210, 0, <IconFactory key="f" />],
    [-40, 10, <IconShip key="s" />],
    [140, 0, <IconWarehouse key="w" />],
    [310, 10, <IconStore key="st" w={300} />],
  ] as const;
  return (
    <>
      <Svg>
        <At x={960} y={500} s={2.9} r={-3}>
          <PriceTag string={false} text="" />
        </At>
        {items.map(([x, y, el], i) => (
          <At key={i} x={960 + (x as number) * 1.4} y={500 + (y as number)} s={0.5 * ease(f, s(0) + i * 8, s(0) + i * 8 + 12, 0, 1, Easing.out(Easing.back(2)))}>
            {el}
          </At>
        ))}
        {items.map((_, i) => (
          <Sfx key={i} at={s(0) + i * 8} name={`tok${i + 1}`} volume={0.6} />
        ))}
      </Svg>
      <Headline lines={[{ t: "*商売そのもの*を作り変えた", at: s(1), size: 76 }]} top={70} />
    </>
  );
});

/* ── 5. 巨大な仕組みの予告 ───────────────── */
const C036 = mk(({ s }) => <Question lines={[{ t: <>では、一体<Red>どうやって？</Red></>, at: s(0) - 2, size: 130 }]} />, { bg: "night", noSub: true });

const C037 = mk(({ s, d }) => (
  <>
    <Svg>
      <IconGrid from={0} to={d} dim={0.3} />
    </Svg>
    <Counter label="DAISOの取扱商品" value={58000} fmt={(v) => "約" + fmtNum("種類")(v)} at={s(0) + 20} dur={40} size={160} />
  </>
));

const C038 = mk(({ s }) => (
  <>
    <Svg>
      <IconGrid from={-200} to={-199} newAt={s(1) - 6} dim={0.25} />
    </Svg>
    <Headline kicker={{ t: "毎月の新商品", at: s(1) - 6 }} lines={[{ t: "約*1,600種類*", at: s(1) - 2, size: 170 }]} />
  </>
));

const C039 = mk(({ s }) => (
  <Svg>
    <IconGrid from={-200} to={-199} stampAt={s(1) + 4} />
  </Svg>
));

const C040 = mk(({ f, s }) => {
  const p = ease(f, s(0) + 10, s(1) + 10, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Svg>
      <g transform={`translate(0 ${-p * 360})`}>
        <Shelves o={0.8} />
        <rect x={0} y={880} width={1920} height={30} fill={C.inkSoft} opacity={1 - p * 0.7} />
      </g>
      <Machine y={560} s={0.9} o={p} />
      <Sfx at={s(0) + 10} name="thud" volume={0.5} />
    </Svg>
  );
});

const C041 = mk(({ s }) => (
  <Svg>
    <Machine y={400} labels={["大量仕入れ", "商品設計", "物流", "売り方"]} litAt={[s(0), s(1), s(2), s(3) + 8]} />
  </Svg>
));

const C042 = mk(({ f, s }) => {
  const t0 = s(1) - 14;
  const flip = Math.cos(interpolate(f, [t0, t0 + 14], [0, Math.PI], clamp));
  const back = f >= t0 + 7;
  return (
    <>
      <Svg>
        <g transform={`translate(960 520) scale(${2.4 * Math.max(0.04, Math.abs(flip))} 2.4) rotate(-4)`}>
          <PriceTag string={false} color={back ? C.ink : C.red} text={back ? "" : "100円"} />
        </g>
        {back && <Machine y={520} s={0.32} o={ease(f, t0 + 8, t0 + 20)} />}
        <Sfx at={t0} name="whoosh" volume={0.6} />
      </Svg>
      <Headline lines={[{ t: "「*利益を生み出す仕組み*」", at: s(1), size: 76 }]} top={70} />
    </>
  );
});

const C043 = mk(({ s }) => (
  <>
    <AbsoluteFill style={{ filter: "grayscale(1)", opacity: 0.55 }}>
      <Svg>
        <Shelves o={0.5} />
        <Basket lands={Array.from({ length: 12 }, () => -100)} kinds={[0, 1, 2, 3, 4, 5, 6, 7, 3, 1, 5, 0]} y={800} />
      </Svg>
    </AbsoluteFill>
    <Headline lines={[{ t: "なぜ*予定より多く*買ってしまうのか", at: s(1), size: 76 }]} top={80} />
    <Sfx at={0} name="whoosh" volume={0.5} />
  </>
));

const C044 = mk(({ s }) => (
  <>
    <Svg>
      <TagHero y={460} />
    </Svg>
    <ChapterCard no="CHAPTER 1" title="100円の中身を分解する" at={s(1) - 10} />
  </>
));

/* ── 6. 100円の中身 ───────────────── */
const C045 = mk(({ f, s }) => (
  <Svg>
    <At x={620} y={450} s={ease(f, 0, 14, 0, 1, Easing.out(Easing.back(2)))}>
      <Coin id="c45" r={170} />
    </At>
    <text x={1300} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={C.ink} opacity={ease(f, s(1), s(1) + 10)}>
      利益＝<tspan fill={C.red}>？</tspan>
    </text>
    <Sfx at={s(1)} name="question" volume={0.7} />
  </Svg>
));

const C046 = mk(({ f, s }) => {
  const p = ease(f, s(2), s(2) + 20);
  const a = -Math.PI / 2 + 0.3 * 2 * Math.PI * p;
  const R = 250;
  return (
    <Svg>
      <Pill x={960} y={110} text="よくある誤解" color={C.inkSoft} at={s(0)} size={44} />
      <g transform="translate(760 470)" opacity={ease(f, s(2) - 6, s(2))}>
        <circle r={R} fill={C.red} />
        <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 0 1 ${R * Math.cos(a)} ${R * Math.sin(a)} Z`} fill={C.ink} />
        <text x={130} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.white} opacity={p}>
          原価30円
        </text>
        <text x={-60} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.white} opacity={p}>
          利益70円
        </text>
      </g>
      <g transform={`translate(760 470) scale(${ease(f, s(3), s(3) + 8, 2, 1)})`} opacity={ease(f, s(3), s(3) + 8)}>
        <path d="M -230 -230 L 230 230 M 230 -230 L -230 230" stroke={C.red} strokeWidth={46} strokeLinecap="round" />
      </g>
      <text x={1420} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={C.ink} opacity={ease(f, s(3) + 6, s(3) + 16)}>
        単純ではない
      </text>
      <Sfx at={s(3)} name="stamp" volume={1} />
    </Svg>
  );
});

const PRODUCT_BARS = (at: (i: number) => number, showProfit = false) =>
  [55, 30, 72, 22, 45].map((cost, i) => ({
    at: at(i),
    icon: React.createElement(PRODUCTS[[1, 2, 4, 6, 3][i]]),
    parts: showProfit
      ? [
          { v: cost, color: C.inkSoft, label: "原価" },
          { v: 100 - cost, color: C.red },
        ]
      : [{ v: cost, color: C.inkSoft, label: "原価" }],
  }));

const Hundred: React.FC<{ base?: number; height?: number }> = ({ base = 740, height = 470 }) => (
  <g>
    <line x1={250} y1={base - height * (100 / 110)} x2={1670} y2={base - height * (100 / 110)} stroke={C.red} strokeWidth={5} strokeDasharray="16 12" />
    <text x={1690} y={base - height * (100 / 110) + 14} fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.red}>
      100円
    </text>
  </g>
);

const C047 = mk(({ s }) => (
  <Svg>
    <Hundred />
    <Bars max={110} base={740} bars={PRODUCT_BARS((i) => s(0) + i * 6)} width={170} gap={110} />
  </Svg>
));

const C048 = mk(({ f, s }) => (
  <Svg>
    <g opacity={1 - ease(f, s(1) - 10, s(1))}>
      <Hundred />
      <Bars max={110} base={740} bars={PRODUCT_BARS(() => -60)} width={170} gap={110} sfx={false} />
    </g>
    <g opacity={ease(f, s(1) - 6, s(1) + 6)}>
      <ClueBoard lit={[]} title={{ at: s(1) }} />
    </g>
    <Sfx at={s(1)} name="whoosh" volume={0.5} />
  </Svg>
));

/* ── 7. 仕組み① 大量仕入れ ───────────────── */
const C049 = mk(({ s }) => (
  <Svg>
    <ClueBoard lit={[s(1)]} focus={0} title={{ at: -30 }} />
  </Svg>
));

const BoxPile: React.FC<{ n: number; x: number; y: number; at: number; f: number; s?: number }> = ({ n, x, y, at, f, s = 1 }) => {
  const shown = Math.floor(interpolate(f, [at, at + 20], [0, n], clamp));
  const cols = Math.ceil(Math.sqrt(n * 2));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: shown }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const offset = (row % 2) * 50;
        return (
          <At key={i} x={(col - (cols - 1) / 2) * 100 + offset - 25} y={-row * 78} s={1}>
            <IconBox3D />
          </At>
        );
      })}
    </g>
  );
};

const C050 = mk(({ f, s, e }) => {
  const zoom = interpolate(f, [s(1), e(1)], [1, 0.62], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const big = f >= s(1) + (e(1) - s(1)) * 0.45;
  return (
    <Svg>
      <BoxPile n={3} x={420} y={600} at={s(0)} f={f} />
      <text x={420} y={720} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink} opacity={ease(f, s(0), s(0) + 8)}>
        100個
      </text>
      <g transform={`translate(1300 640) scale(${zoom})`}>
        <BoxPile n={big ? 60 : 24} x={0} y={-40} at={s(1)} f={f} />
      </g>
      <text x={1300} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.red} opacity={ease(f, s(1), s(1) + 8)}>
        {big ? "100万個" : "10万個"}
      </text>
      <Sfx at={s(0)} name="tok1" volume={0.7} />
      {Array.from({ length: 8 }, (_, k) => (
        <Sfx key={k} at={s(1) + k * 4} name="stamp" volume={0.25} />
      ))}
    </Svg>
  );
});

const C051 = mk(({ f, s }) => {
  const tilt = interpolate(f, [s(0) + 4, s(0) + 24], [0, 13], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <Svg>
      <Balance
        cy={330}
        tilt={tilt}
        left={<At y={-60} s={0.8}><IconBox3D /></At>}
        right={<g transform="translate(0 -40) scale(0.55)"><BoxPile n={18} x={0} y={0} at={-100} f={f} /></g>}
        leftLabel="100個"
        rightLabel="100万個"
      />
      <Pill x={960} y={150} text="交渉力" color={C.red} at={s(0) + 20} size={56} />
      <Sfx at={s(0) + 20} name="thud" volume={0.8} />
    </Svg>
  );
});

const C052 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 40, 0, 1, Easing.inOut(Easing.quad));
  const X0 = 960;
  const W = 820;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    return [X0 + x * W, 200 + 500 * (0.12 + 0.88 * Math.exp(-x * 3.2))];
  });
  const len = 1100;
  const idx = Math.floor(p * 40);
  return (
    <>
      <Evidence
        no="07"
        file="factory.mp4"
        caption="大量生産"
        x={70}
        y={170}
        w={720}
        h={440}
        at={0}
        fallback={
          <g>
            <rect width={1920} height={1080} fill="#E6EEF2" />
            <rect y={800} width={1920} height={280} fill={C.paperDeep} />
            <At x={960} y={620} s={3.2}>
              <IconFactory t={f} />
            </At>
          </g>
        }
      />
      <Svg>
        <line x1={X0} y1={200} x2={X0} y2={760} stroke={C.ink} strokeWidth={6} />
        <line x1={X0} y1={760} x2={X0 + W + 40} y2={760} stroke={C.ink} strokeWidth={6} />
        <text x={X0 + W + 20} y={830} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={42} fill={C.ink}>
          作る量 →
        </text>
        <text x={X0 + 20} y={170} fontFamily={FONT} fontWeight={900} fontSize={42} fill={C.ink}>
          1個あたりのコスト
        </text>
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
        {p > 0 && <circle cx={pts[idx][0]} cy={pts[idx][1]} r={20} fill={C.red} stroke={C.white} strokeWidth={6} />}
        <Sfx at={s(1) - 6} name="whoosh" volume={0.5} />
      </Svg>
    </>
  );
});

const C053 = mk(({ f, s }) => {
  const items = [
    ["包装", <IconBox3D key="b" />],
    ["輸送", <IconTruck key="t" />],
    ["発注", <IconDoc key="d" w={180} h={220} lines={5} />],
  ] as const;
  return (
    <Svg>
      {items.map(([label, icon], i) => {
        const x = 420 + i * 540;
        const at = s(0) + i * 12;
        const shrink = ease(f, s(1) + i * 8, s(1) + i * 8 + 18);
        return (
          <g key={i} opacity={ease(f, at, at + 10)}>
            <At x={x} y={330} s={0.9}>
              {icon}
            </At>
            <text x={x} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.ink}>
              {label}
            </text>
            <rect x={x - 180} y={580} width={360} height={50} rx={25} fill={C.white} stroke={C.line} strokeWidth={4} />
            <rect x={x - 175} y={585} width={350 * (1 - 0.65 * shrink)} height={40} rx={20} fill={shrink > 0.5 ? C.green : C.red} />
            <text x={x} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.inkSoft}>
              1個あたりの手間
            </text>
            <Sfx at={at} name={`tok${i + 1}`} volume={0.6} />
          </g>
        );
      })}
    </Svg>
  );
});

const C054 = mk(({ s }) => (
  <Svg>
    <Flow
      y={440}
      x0={560}
      x1={1360}
      r={150}
      nodes={[
        { label: "たくさん売る", at: s(1), color: C.ink },
        { label: "売上 ↑", at: s(2), color: C.red },
      ]}
      font={46}
    />
    <Pill x={960} y={130} text="つまり" color={C.inkSoft} at={s(0)} size={44} />
  </Svg>
));

const C055 = mk(({ s }) => (
  <Headline
    lines={[
      { t: "_たくさん売る → 売上 ↑_", at: 0, size: 64 },
      { t: "たくさん売る → *安く作れる*", at: s(0), size: 110 },
    ]}
  />
));

/* ── 8. 仕組み② 利益の組み合わせ ───────────────── */
const C056 = mk(({ s }) => (
  <Svg>
    <ClueBoard lit={[-100, s(0) + 10]} focus={1} title={{ at: -30 }} />
  </Svg>
));

const C057 = mk(({ f, s }) => (
  <Svg>
    <Bars
      max={110}
      base={760}
      height={500}
      width={260}
      gap={420}
      bars={[
        { at: s(0), icon: <IconPan />, parts: [{ v: 85, color: C.inkSoft, label: "原価" }, { v: 15, color: C.red }] },
        { at: s(2), icon: <IconSticker />, parts: [{ v: 25, color: C.inkSoft, label: "原価" }, { v: 75, color: C.red, label: "利益" }] },
      ]}
    />
    <At x={430} y={170} s={0.8 * ease(f, s(0), s(0) + 10, 0, 1, Easing.out(Easing.back(2)))}>
      <Bubble text="これが100円？" size={56} tail="right" />
    </At>
    <text x={1300} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink} opacity={ease(f, s(2), s(2) + 10)}>
      小さくて軽い商品
    </text>
    <Sfx at={s(0)} name="pop" volume={0.6} />
  </Svg>
));

const C058 = mk(({ f, s }) => (
  <>
    <Clipping
      kind="報道"
      source="2026年"
      title="セリア　シールなどの販売が伸びる"
      lines={["仕入れ原価の低い商品が好調", "粗利益率の改善につながった"]}
      hl={1}
      hlAt={s(2)}
      x={90}
      y={150}
      w={1040}
    />
    <Svg>
      <At x={1520} y={300} s={1.2 * ease(f, s(1), s(1) + 12, 0, 1, Easing.out(Easing.back(2)))}>
        <IconSticker />
      </At>
      {[0.35, 0.55, 0.95].map((h, i) => {
        const p = ease(f, s(1) + i * 6, s(1) + i * 6 + 16);
        return <rect key={i} x={1340 + i * 130} y={760 - 300 * h * p} width={100} height={300 * h * p} rx={10} fill={i === 2 ? C.red : C.line} />;
      })}
      <line x1={1310} y1={760} x2={1740} y2={760} stroke={C.ink} strokeWidth={5} />
      <text x={1525} y={820} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={C.ink} opacity={ease(f, s(1), s(1) + 10)}>
        シール類の販売
      </text>
      <Pill x={1525} y={140} text="粗利益率 ↑" color={C.green} at={s(2) + 10} size={48} />
      <Sfx at={s(2) + 10} name="ding" volume={0.6} />
    </Svg>
  </>
));

const PROFITS = [15, 70, 40, 60, 25];
const C059 = mk(({ f, s }) => {
  const merge = ease(f, s(2), s(2) + 24, 0, 1, Easing.inOut(Easing.cubic));
  const total = PROFITS.reduce((a, b) => a + b, 0);
  return (
    <Svg>
      {PROFITS.map((v, i) => {
        const x0 = 330 + i * 300;
        const h = v * 4.4;
        const x = x0 + (960 - 80 - x0) * merge;
        const yTop = 760 - h;
        const stackOffset = PROFITS.slice(0, i).reduce((a, b) => a + b, 0) * 2.4;
        const y = yTop + (760 - stackOffset - v * 2.4 - yTop) * merge;
        const hh = h + (v * 2.4 - h) * merge;
        return (
          <g key={i} opacity={ease(f, s(0) + i * 4, s(0) + i * 4 + 8)}>
            <rect x={x} y={y} width={160} height={hh} rx={8} fill={[C.red, C.orange, "#EE5A43", C.orange, C.red][i]} stroke={C.paper} strokeWidth={4} />
            <At x={x0 + 80} y={830} s={0.4} o={1 - merge}>
              {React.createElement(PRODUCTS[[1, 6, 4, 5, 3][i]])}
            </At>
          </g>
        );
      })}
      <text x={960} y={760 - total * 2.4 - 40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.ink} opacity={merge}>
        店全体の利益
      </text>
      <text x={960} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.inkSoft} opacity={ease(f, s(1), s(1) + 10) * (1 - merge)}>
        1つずつの利益ではなく…
      </text>
      <Sfx at={s(2)} name="whoosh" volume={0.6} />
      <Sfx at={s(2) + 24} name="ding" volume={0.6} />
    </Svg>
  );
});

const C060 = mk(({ f }) => {
  const total = PROFITS.reduce((a, b) => a + b, 0);
  const shine = interpolate(f, [6, 40], [-200, 400], clamp);
  return (
    <Svg>
      <defs>
        <clipPath id="blk">
          <rect x={880} y={760 - total * 2.4} width={160} height={total * 2.4} rx={8} />
        </clipPath>
      </defs>
      {PROFITS.map((v, i) => {
        const off = PROFITS.slice(0, i).reduce((a, b) => a + b, 0) * 2.4;
        return <rect key={i} x={880} y={760 - off - v * 2.4} width={160} height={v * 2.4} fill={[C.red, C.orange, "#EE5A43", C.orange, C.red][i]} stroke={C.paper} strokeWidth={4} />;
      })}
      <rect x={880 + shine} y={200} width={60} height={600} fill="rgba(255,255,255,0.5)" transform="skewX(-20)" clipPath="url(#blk)" />
      <text x={960} y={760 - total * 2.4 - 40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.ink}>
        店全体の利益
      </text>
      <text x={1400} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.red} opacity={ease(f, 10, 20)}>
        ＝ 組み合わせ
      </text>
      <Sfx at={8} name="ding" volume={0.6} />
    </Svg>
  );
});

export const PART2 = {
  C012, C013, C014, C015, C016, C017, C018, C019, C020, C021, C022, C023, C024, C025, C026, C027, C028, C029, C030,
  C031, C032, C033, C034, C035, C036, C037, C038, C039, C040, C041, C042, C043, C044, C045, C046, C047, C048, C049,
  C050, C051, C052, C053, C054, C055, C056, C057, C058, C059, C060,
};

