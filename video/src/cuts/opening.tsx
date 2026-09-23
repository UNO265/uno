/** 0. オープニング（C001–C005） */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { At, BasketBack, BasketFront, PRODUCTS, PriceTag, Bubble, Shelves, IconBox, IconFactory, IconPerson, IconStore, IconTruck } from "../art";
import { CutFrame, CutProps, Sfx, clamp, ease, segStart, usePop } from "../lib";
import { C, FONT } from "../theme";

export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {children}
  </svg>
);

/* かごに商品を入れて積み上げる共通部品 */
const SLOTS: [number, number, number][] = [
  [-165, -150, -8], [-55, -165, 6], [65, -155, -10], [175, -145, 12],
  [-120, -225, 14], [0, -240, -6], [120, -230, 8], [-190, -260, -14],
  [200, -250, 10], [-60, -305, -4], [60, -310, 12], [0, -365, -10],
];

const Item: React.FC<{ i: number; land: number; kind?: number; instant?: boolean }> = ({ i, land, kind, instant }) => {
  const f = useCurrentFrame();
  const [x, y, r] = SLOTS[i % SLOTS.length];
  const fall = instant ? 0 : 12;
  const p = fall === 0 ? 1 : interpolate(f, [land - fall, land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = f > land ? Math.exp(-(f - land) / 5) * Math.sin((f - land) / 2) * 14 : 0;
  if (f < land - fall) return null;
  const Icon = PRODUCTS[(kind ?? i) % PRODUCTS.length];
  return (
    <At x={x} y={interpolate(p, [0, 1], [-900, y]) - bounce} r={r * p} s={0.85}>
      <Icon />
    </At>
  );
};

export const Basket: React.FC<{ x?: number; y?: number; s?: number; lands: number[]; kinds?: number[]; tags?: boolean; instant?: number[] }> = ({
  x = 960,
  y = 760,
  s = 1,
  lands,
  kinds,
  tags,
  instant = [],
}) => {
  const f = useCurrentFrame();
  return (
    <At x={x} y={y} s={s}>
      <BasketBack w={620} />
      {lands.map((l, i) => (
        <Item key={i} i={i} land={l} kind={kinds?.[i]} instant={instant.includes(i)} />
      ))}
      <BasketFront w={620} />
      {tags &&
        lands.map((l, i) => {
          const p = interpolate(f, [l + 2, l + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
          const [sx, sy] = SLOTS[i];
          return (
            <At key={i} x={sx + 40} y={sy - 95} s={0.26 * p} r={-8 + i * 5}>
              <PriceTag string={false} />
            </At>
          );
        })}
    </At>
  );
};

/* C001 フック: 商品が増える → 暗転して最初の質問 */
export const C001: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const drop = 60;
  const lands = [drop, 96, 118];
  const qAt = Math.round((cut.segments[cut.segments.length - 1]?.end ?? 5.2) * 30) + 2;
  const hero = ease(f, 0, 12, 0, 1, Easing.out(Easing.back(1.8)));
  const move = ease(f, drop - 14, drop, 0, 1, Easing.in(Easing.quad));
  const dark = ease(f, qAt, qAt + 8);
  const q = ease(f, qAt + 4, qAt + 16, 0, 1, Easing.out(Easing.back(1.4)));
  const [sx, sy] = SLOTS[0];
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Shelves o={0.55} />
        <rect x={0} y={920} width={1920} height={160} fill={C.paperDeep} />
        <Basket lands={lands} kinds={[0, 1, 2]} instant={[0]} />
        {f < drop && (
          <g transform={`translate(${960 + (960 + sx - 960) * move} ${420 + (760 + sy - 420) * move}) scale(${(1.6 - 0.75 * move) * hero})`}>
            <IconBox />
            <At x={120} y={-40} s={0.42 * (1 - move)} r={-10}>
              <PriceTag />
            </At>
          </g>
        )}
      </Scene>
      <HookCounter n={lands.filter((l) => f >= l).length} lands={lands} o={1 - dark} />
      <AbsoluteFill style={{ background: C.night, opacity: dark * 0.86 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, opacity: q }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 140, color: C.paper, letterSpacing: 6, transform: `scale(${0.9 + 0.1 * q})` }}>
          なぜ、これで<span style={{ color: C.orange }}>儲かる</span>？
        </div>
      </AbsoluteFill>
      <Sfx at={2} name="pop" volume={0.7} />
      {lands.map((l, i) => (
        <Sfx key={i} at={l} name={`tok${i}`} volume={0.8} />
      ))}
      <Sfx at={qAt} name="thud" volume={0.9} />
    </CutFrame>
  );
};

/** 冒頭のフック: 「100円 × N」 */
const HookCounter: React.FC<{ n: number; lands: number[]; o?: number }> = ({ n, lands, o = 1 }) => {
  const f = useCurrentFrame();
  const bump = lands.some((l) => f >= l && f < l + 6) ? 1.1 : 1;
  const appear = ease(f, lands[0] - 4, lands[0] + 6);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, opacity: appear * o }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontFamily: FONT,
          background: C.white,
          borderRadius: 28,
          padding: "10px 40px",
          boxShadow: "0 10px 26px rgba(60,40,10,0.14)",
          transform: `scale(${bump})`,
        }}
      >
        <span style={{ background: C.red, color: C.white, fontWeight: 900, fontSize: 70, padding: "0 22px", borderRadius: 14 }}>100円</span>
        <span style={{ fontWeight: 900, fontSize: 96, color: C.ink, fontVariantNumeric: "tabular-nums" }}>× {n}</span>
      </div>
    </AbsoluteFill>
  );
};

/* C002 収納ケース / キッチン用品 / 文房具 / 掃除グッズ */
export const C002: React.FC<CutProps> = ({ cut }) => {
  const lands = [0, 1, 2, 3].map((i) => segStart(cut, i) + 10);
  const kinds = [0, 1, 2, 3];
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Shelves o={0.55} />
        <rect x={0} y={920} width={1920} height={160} fill={C.paperDeep} />
        <Basket lands={lands} kinds={kinds} tags />
      </Scene>
      <HookCounter n={3 + lands.filter((l) => useCurrentFrame() >= l).length} lands={[-10, ...lands]} />
      {lands.map((l, i) => (
        <Sfx key={i} at={l} name={`tok${i}`} volume={0.8} />
      ))}
    </CutFrame>
  );
};

/* C003 「これも100円？」 */
export const C003: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const flip = Math.cos(interpolate(f, [0, 16], [Math.PI, 2 * Math.PI], clamp));
  const tagPop = usePop(12);
  const bubble = usePop(segStart(cut, 0) - 4, 9);
  const zoom = ease(f, 20, cut.duration, 1, 1.18, Easing.inOut(Easing.quad));
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Shelves o={0.35} />
        <g transform={`translate(1000 560) scale(${zoom}) translate(-1000 -560)`}>
          <At x={860} y={600} s={2.4}>
            <g transform={`scale(${Math.max(0.05, Math.abs(flip))} 1)`}>
              <IconBox />
            </g>
          </At>
          <At x={1270} y={560} s={0.9 * tagPop} r={-10 + (1 - tagPop) * 30}>
            <PriceTag />
          </At>
        </g>
        <At x={620} y={270} s={bubble}>
          <Bubble text="これも100円？" size={70} tail="right" />
        </At>
      </Scene>
      <Sfx at={12} name="whoosh" volume={0.4} />
      <Sfx at={segStart(cut, 0) - 4} name="pop" volume={0.8} />
      <Sfx at={segStart(cut, 0) + 6} name="question" volume={0.6} />
    </CutFrame>
  );
};

/* C004 気づけばかごがいっぱい */
export const C004: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const n = 12;
  const span = cut.duration - 40;
  const lands = Array.from({ length: n }, (_, i) => 10 + Math.round((span * i) / (n - 1)) + (i < 4 ? -6 : 0));
  const landed = lands.filter((l) => f >= l).length;
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Shelves o={0.55} />
        <rect x={0} y={920} width={1920} height={160} fill={C.paperDeep} />
        <Basket lands={lands} kinds={[0, 1, 2, 3, 4, 5, 6, 7, 3, 1, 5, 0]} />
      </Scene>
      <HookCounter n={7 + Math.round((landed * 5) / n)} lands={[-10, ...lands]} />
      {lands.map((l, i) => (
        <React.Fragment key={i}>
          <Sfx at={l} name={`tok${i % 6}`} volume={0.55} />
          {i % 3 === 2 && <Sfx at={l + 3} name="beep" volume={0.35} />}
        </React.Fragment>
      ))}
    </CutFrame>
  );
};

/* C005 質問の発展: コスト要素が 100円 の値札のまわりに集まる */
const COSTS: [string, number, number, React.ReactNode, number][] = [
  ["工場", 330, 360, <IconFactory key="f" />, 0.75],
  ["物流", 330, 690, <IconTruck key="t" />, 0.75],
  ["店舗", 1590, 360, <IconStore key="s" />, 0.42],
  ["人件費", 1590, 690, <IconPerson key="p" />, 0.9],
];

export const C005: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const out = ease(f, 0, 18, 1, 0);
  const t = Math.max(0, f - 14);
  const drop = interpolate(t, [0, 16], [-700, 0], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const angle = 28 * Math.exp(-t / 22) * Math.cos(t / 7);
  const g0 = 16;
  const head = ease(f, g0 + 10, g0 + 24);
  // 値札の穴の位置（PriceTag の既定サイズ × 1.2）
  const hx = (-190 + 180 * 0.42 * 0.62) * 1.2;
  return (
    <CutFrame cut={cut}>
      <Scene>
        <g opacity={out}>
          <Basket lands={Array.from({ length: 12 }, () => -100)} kinds={[0, 1, 2, 3, 4, 5, 6, 7, 3, 1, 5, 0]} s={0.6 + 0.4 * out} />
        </g>
        {COSTS.map(([label, x, y, icon, sc], i) => {
          const p = ease(f, g0 + i * 5, g0 + i * 5 + 18, 0, 1, Easing.out(Easing.cubic));
          const fromX = x < 960 ? -300 : 2220;
          const cx = fromX + (x - fromX) * p;
          return (
            <g key={label} opacity={p}>
              <line x1={cx} y1={y} x2={960 + (cx - 960) * 0.55} y2={560 + (y - 560) * 0.55} stroke={C.line} strokeWidth={5} strokeDasharray="10 10" />
              <circle cx={cx} cy={y} r={112} fill={C.white} stroke={C.ink} strokeWidth={6} />
              <At x={cx} y={y} s={sc}>
                {icon}
              </At>
              <text x={cx} y={y + 160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
                {label}
              </text>
              <Sfx at={g0 + i * 5} name="whoosh" volume={0.3} />
            </g>
          );
        })}
        <g transform={`translate(960 ${drop}) rotate(${angle})`}>
          <line x1={0} y1={-20} x2={hx} y2={560} stroke={C.ink} strokeWidth={4} />
          <At x={0} y={560} s={1.2}>
            <PriceTag string={false} />
          </At>
        </g>
      </Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 60, opacity: head }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 78, color: C.ink, letterSpacing: 4, transform: `translateY(${(1 - head) * 20}px)` }}>
          たった<span style={{ color: C.red }}>100円</span>で、本当に利益が出るのか？
        </div>
      </AbsoluteFill>
      <Sfx at={2} name="whoosh" volume={0.3} />
      <Sfx at={30} name="stamp" volume={0.4} />
      <Sfx at={g0 + 24} name="thud" volume={0.6} />
    </CutFrame>
  );
};

