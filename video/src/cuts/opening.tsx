/** 0. オープニング（C001–C005） */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { At, BasketBack, BasketFront, PRODUCTS, PriceTag, Bubble, Shelves, IconBox } from "../art";
import { CutFrame, CutProps, Sfx, clamp, ease, segStart, usePop } from "../lib";
import { C, FONT } from "../theme";

export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {children}
  </svg>
);

/* C001 店の入口 → 自動ドアが開いて中へ */
export const C001: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const open = ease(f, 20, 48, 0, 1, Easing.inOut(Easing.cubic));
  const zoom = interpolate(f, [60, d], [1, 3.4], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flash = interpolate(f, [d - 14, d], [0, 1], clamp);
  const intro = ease(f, 0, 18, 0.94, 1);
  const stripes = 12;
  const sw = 900 / stripes;
  return (
    <CutFrame cut={cut}>
      <Scene>
        <g transform={`translate(960 720) scale(${zoom * intro}) translate(-960 -720)`}>
          <rect x={0} y={900} width={1920} height={200} fill={C.paperDeep} />
          <rect x={510} y={250} width={900} height={650} fill="#FBF7F0" stroke={C.ink} strokeWidth={8} />
          <rect x={600} y={160} width={720} height={120} rx={16} fill={C.ink} />
          <text x={960} y={243} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill={C.white} letterSpacing={8}>
            100円 SHOP
          </text>
          {Array.from({ length: stripes }, (_, i) => (
            <path
              key={i}
              d={`M ${510 + i * sw} 300 h ${sw} v 70 a ${sw / 2} ${sw / 2} 0 0 1 ${-sw} 0 Z`}
              fill={i % 2 ? C.white : C.red}
              stroke={C.ink}
              strokeWidth={4}
            />
          ))}
          {/* ショーウィンドウ */}
          {[560, 1130].map((x) => (
            <g key={x}>
              <rect x={x} y={470} width={230} height={260} fill="#DCEAF2" stroke={C.ink} strokeWidth={6} />
              <At x={x + 70} y={640} s={0.45}>
                <IconBox />
              </At>
              <At x={x + 165} y={600} s={0.32} r={-12}>
                <PriceTag string={false} />
              </At>
            </g>
          ))}
          {/* 店内の光とドア */}
          <rect x={825} y={500} width={270} height={400} fill="#FFF3D6" />
          <g opacity={0.6}>
            {[560, 650, 740, 830].map((y, i) => (
              <rect key={y} x={840} y={y} width={240} height={10} fill={[C.orange, C.blue, C.green, C.red][i]} opacity={0.5} />
            ))}
          </g>
          <clipPath id="doorclip">
            <rect x={825} y={500} width={270} height={400} />
          </clipPath>
          <g clipPath="url(#doorclip)">
            <rect x={825 - open * 130} y={500} width={135} height={400} fill="rgba(143,187,214,0.55)" stroke={C.ink} strokeWidth={6} />
            <rect x={960 + open * 130} y={500} width={135} height={400} fill="rgba(143,187,214,0.55)" stroke={C.ink} strokeWidth={6} />
          </g>
          <rect x={825} y={500} width={270} height={400} fill="none" stroke={C.ink} strokeWidth={8} />
          <rect x={835} y={470} width={250} height={22} rx={6} fill={C.inkSoft} />
          <rect x={800} y={900} width={320} height={16} rx={8} fill={C.inkSoft} />
        </g>
      </Scene>
      <AbsoluteFill style={{ background: "#FFF8EA", opacity: flash }} />
      <Sfx at={16} name="door" volume={0.9} />
    </CutFrame>
  );
};

/* かごに商品を入れて積み上げる共通部品 */
const SLOTS: [number, number, number][] = [
  [-165, -150, -8], [-55, -165, 6], [65, -155, -10], [175, -145, 12],
  [-120, -225, 14], [0, -240, -6], [120, -230, 8], [-190, -260, -14],
  [200, -250, 10], [-60, -305, -4], [60, -310, 12], [0, -365, -10],
];

const Item: React.FC<{ i: number; land: number; kind?: number }> = ({ i, land, kind }) => {
  const f = useCurrentFrame();
  const [x, y, r] = SLOTS[i % SLOTS.length];
  const fall = 12;
  const p = interpolate(f, [land - fall, land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = f > land ? Math.exp(-(f - land) / 5) * Math.sin((f - land) / 2) * 14 : 0;
  if (f < land - fall) return null;
  const Icon = PRODUCTS[(kind ?? i) % PRODUCTS.length];
  return (
    <At x={x} y={interpolate(p, [0, 1], [-900, y]) - bounce} r={r * p} s={0.85}>
      <Icon />
    </At>
  );
};

export const Basket: React.FC<{ x?: number; y?: number; s?: number; lands: number[]; kinds?: number[]; tags?: boolean }> = ({
  x = 960,
  y = 760,
  s = 1,
  lands,
  kinds,
  tags,
}) => {
  const f = useCurrentFrame();
  return (
    <At x={x} y={y} s={s}>
      <BasketBack w={620} />
      {lands.map((l, i) => (
        <Item key={i} i={i} land={l} kind={kinds?.[i]} />
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
      <HookCounter n={lands.filter((l) => useCurrentFrame() >= l).length} lands={lands} />
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
  const span = cut.duration - 70;
  const lands = Array.from({ length: n }, (_, i) => 10 + Math.round((span * i) / (n - 1)) + (i < 4 ? -6 : 0));
  const landed = lands.filter((l) => f >= l).length;
  const qAt = cut.duration - 50;
  const q = ease(f, qAt, qAt + 12);
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Shelves o={0.55} />
        <rect x={0} y={920} width={1920} height={160} fill={C.paperDeep} />
        <Basket lands={lands} kinds={[0, 1, 2, 3, 4, 5, 6, 7, 3, 1, 5, 0]} />
      </Scene>
      <HookCounter n={Math.max(4, 4 + Math.round((landed * 8) / n))} lands={[-10, ...lands]} o={1 - q} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 60, opacity: q }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 110,
            color: C.paper,
            background: C.night,
            padding: "10px 60px 18px",
            borderRadius: 24,
            letterSpacing: 4,
            transform: `scale(${0.9 + 0.1 * q})`,
          }}
        >
          なぜ、これで<span style={{ color: C.orange }}>儲かる</span>？
        </div>
      </AbsoluteFill>
      {lands.map((l, i) => (
        <React.Fragment key={i}>
          <Sfx at={l} name={`tok${i % 6}`} volume={0.55} />
          {i % 3 === 2 && <Sfx at={l + 3} name="beep" volume={0.35} />}
        </React.Fragment>
      ))}
      <Sfx at={qAt} name="thud" volume={0.8} />
    </CutFrame>
  );
};

/* C005 かごが消え、値札ひとつだけが残る */
export const C005: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const out = ease(f, 0, 18, 1, 0);
  const t = Math.max(0, f - 14);
  const drop = interpolate(t, [0, 16], [-700, 0], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const angle = 28 * Math.exp(-t / 22) * Math.cos(t / 7);
  const q = usePop(segStart(cut, 1));
  // 値札の穴の位置（PriceTag の既定サイズ × 1.35）
  const hx = (-190 + 180 * 0.42 * 0.62) * 1.35;
  return (
    <CutFrame cut={cut}>
      <Scene>
        <g opacity={out}>
          <Basket lands={Array.from({ length: 12 }, () => -100)} kinds={[0, 1, 2, 3, 4, 5, 6, 7, 3, 1, 5, 0]} s={0.6 + 0.4 * out} />
        </g>
        <g transform={`translate(960 ${drop}) rotate(${angle})`}>
          <line x1={0} y1={-20} x2={hx} y2={520} stroke={C.ink} strokeWidth={4} />
          <At x={0} y={520} s={1.35}>
            <PriceTag string={false} />
          </At>
        </g>
        {[
          [600, 380, 90, -12],
          [1350, 330, 120, 10],
          [1400, 700, 70, 18],
        ].map(([x, y, size, r], i) => (
          <At key={i} x={x} y={y} r={r} s={q} o={0.35}>
            <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.ink}>
              ？
            </text>
          </At>
        ))}
      </Scene>
      <Sfx at={2} name="whoosh" volume={0.3} />
      <Sfx at={30} name="stamp" volume={0.4} />
      <Sfx at={segStart(cut, 1)} name="thud" volume={0.7} />
    </CutFrame>
  );
};

