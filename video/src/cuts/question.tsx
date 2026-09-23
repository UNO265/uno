/** 1. 疑問提起（C006–C011） */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  At,
  Coin,
  IconFactory,
  IconMaterials,
  IconShip,
  IconStore,
  IconTruck,
  IconWarehouse,
  JapanMap,
  PriceTag,
  StampTag,
  Waves,
} from "../art";
import { CutFrame, CutProps, Paper, Sfx, clamp, ease, segEnd, segStart, usePop } from "../lib";
import { C, FONT } from "../theme";
import { Scene } from "./opening";

const ROAD_Y = 720;
const COIN_R = 80;

const Road: React.FC<{ from?: number; to?: number }> = ({ from = -100, to = 2020 }) => (
  <g>
    <line x1={from} y1={ROAD_Y + COIN_R + 6} x2={to} y2={ROAD_Y + COIN_R + 6} stroke={C.line} strokeWidth={8} strokeLinecap="round" />
    <line
      x1={from}
      y1={ROAD_Y + COIN_R + 34}
      x2={to}
      y2={ROAD_Y + COIN_R + 34}
      stroke={C.line}
      strokeWidth={4}
      strokeDasharray="18 22"
      opacity={0.7}
    />
  </g>
);

/** フレーム列 [f0,f1,...] と値列で区分補間し、削れ量をなめらかに */
const steps = (f: number, at: number[], values: number[]) => {
  let v = values[0];
  at.forEach((a, i) => {
    v += interpolate(f, [a, a + 8], [0, values[i + 1] - values[i]], { ...clamp, easing: Easing.out(Easing.cubic) });
  });
  return v;
};

/** コインから飛び散る欠片 */
const Chip: React.FC<{ at: number; x: number; y: number; dir?: number }> = ({ at, x, y, dir = 1 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const px = x + dir * t * 7;
  const py = y - 60 - t * 12 + t * t * 0.9;
  return (
    <g transform={`translate(${px} ${py}) rotate(${t * 18})`} opacity={interpolate(t, [25, 40], [1, 0], clamp)}>
      <path d="M 0 0 L 34 -8 L 22 26 Z" fill={C.gold} stroke={C.goldDeep} strokeWidth={3} />
    </g>
  );
};

const CostTag: React.FC<{ at: number; x: number; y: number; text: string; r?: number }> = ({ at, x, y, text, r = -6 }) => {
  const p = usePop(at, 9);
  return (
    <At x={x} y={y} s={p} r={r}>
      <StampTag text={text} size={46} />
    </At>
  );
};

/* C006 材料 → 工場 */
export const C006: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const e1 = segEnd(cut, 0) - 12;
  const e2 = segEnd(cut, 1) - 16;
  const X1 = 620;
  const X2 = 1300;
  const x = interpolate(f, [0, e1, e1 + 14, e2, e2 + 14, d], [-160, X1, X1, X2, X2, 2080], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const frac = steps(f, [e1, e2], [1, 0.85, 0.72]);
  return (
    <CutFrame cut={cut}>
      <Scene>
        <Road />
        <At x={X1} y={420} s={1.3}>
          <IconMaterials />
        </At>
        <At x={X2} y={440} s={1.15}>
          <IconFactory t={f} />
        </At>
        <CostTag at={e1} x={X1} y={210} text="材料費" />
        <CostTag at={e2} x={X2 + 20} y={180} text="加工費" r={5} />
        <At x={x} y={ROAD_Y}>
          <Coin id="c6" r={COIN_R} fraction={frac} spin={(x / COIN_R) * 57.3} />
        </At>
        <Chip at={e1} x={X1} y={ROAD_Y} />
        <Chip at={e2} x={X2} y={ROAD_Y} dir={-1} />
      </Scene>
      <Sfx at={0} name="roll" volume={0.6} />
      <Sfx at={e2 + 10} name="roll" volume={0.5} />
      <Sfx at={e1} name="chip" />
      <Sfx at={e1 + 2} name="pop" volume={0.5} />
      <Sfx at={e2} name="chip" />
      <Sfx at={e2 + 2} name="pop" volume={0.5} />
    </CutFrame>
  );
};

/* C007 海上輸送 → 倉庫 → 全国の店舗へ */
export const C007: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const e1 = segEnd(cut, 0) - 14;
  const e2 = segEnd(cut, 1) - 10;
  const s2 = segStart(cut, 2);
  const e3 = s2 + 12;
  const X = [380, 900, 1400];
  const pan = interpolate(f, [e3 + 6, e3 + 50], [0, -820], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const truckX = interpolate(f, [e3 + 6, e3 + 50], [X[2], 2120], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const coinX = interpolate(f, [0, e1, e1 + 12, e2, e2 + 12, e3], [-160, X[0], X[0], X[1], X[1], X[2]], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const onTruck = f >= e3;
  const frac = steps(f, [e1, e2, e3], [0.72, 0.6, 0.5, 0.4]);
  const dots = interpolate(f, [e3 + 44, cut.duration - 10], [0, 24], clamp);
  return (
    <CutFrame cut={cut}>
      <Scene>
        <g transform={`translate(${pan} 0)`}>
          <Road to={2900} />
          <At x={X[0]} y={480}>
            <Waves t={f} w={420} />
            <IconShip t={f} />
          </At>
          <At x={X[1]} y={470} s={1.1}>
            <IconWarehouse />
          </At>
          <At x={truckX} y={ROAD_Y + 10} s={1.1}>
            <IconTruck t={f > e3 ? f - e3 : 0} />
          </At>
          <CostTag at={e1} x={X[0]} y={220} text="海上輸送" />
          <CostTag at={e2} x={X[1]} y={230} text="保管" r={5} />
          <CostTag at={e3} x={X[2] + 60} y={230} text="配送" r={-4} />
          <At x={onTruck ? truckX - 40 : coinX} y={onTruck ? ROAD_Y - 150 : ROAD_Y} s={onTruck ? 0.7 : 1}>
            <Coin id="c7" r={COIN_R} fraction={frac} spin={(coinX / COIN_R) * 57.3} />
          </At>
          <Chip at={e1} x={X[0]} y={ROAD_Y} />
          <Chip at={e2} x={X[1]} y={ROAD_Y} dir={-1} />
          <Chip at={e3} x={X[2]} y={ROAD_Y - 100} />
          <At x={2420} y={440} s={1.35}>
            <JapanMap dots={dots} />
          </At>
        </g>
      </Scene>
      <Sfx at={0} name="roll" volume={0.5} />
      <Sfx at={e1 - 16} name="horn" volume={0.6} />
      <Sfx at={e1} name="chip" />
      <Sfx at={e2} name="chip" />
      <Sfx at={e3} name="chip" />
      <Sfx at={e3 + 4} name="truck" volume={0.8} />
      {[0, 6, 12, 18].map((k) => (
        <Sfx key={k} at={e3 + 44 + k * 4} name={`tok${k % 6}`} volume={0.25} />
      ))}
    </CutFrame>
  );
};

/* C008 家賃・電気代・人件費 */
export const C008: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const a1 = segEnd(cut, 0) - 14;
  const a2 = segStart(cut, 1) + 14;
  const a3 = segEnd(cut, 1) - 14;
  const frac = steps(f, [a1, a2, a3], [0.4, 0.3, 0.2, 0.1]);
  const enter = ease(f, 0, 18, 200, 0);
  const stamp = (at: number) => {
    const p = interpolate(f, [at - 6, at], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return { s: f < at - 6 ? 0 : 2.2 - 1.2 * p, o: p };
  };
  const st = [a1, a2, a3].map(stamp);
  const shake = [a1, a2, a3].reduce((acc, a) => acc + (f >= a && f < a + 8 ? Math.sin((f - a) * 3) * 6 * (1 - (f - a) / 8) : 0), 0);
  return (
    <CutFrame cut={cut}>
      <Scene>
        <g transform={`translate(${shake} 0)`}>
          <rect x={0} y={880} width={1920} height={200} fill={C.paperDeep} />
          <At x={1240 + enter} y={620} s={1.35}>
            <IconStore w={560} />
            {/* 店内: 照明と人 */}
            <circle cx={-150} cy={10} r={22} fill="#F6CF4A" />
            <line x1={-150} y1={-20} x2={-150} y2={-12} stroke={C.ink} strokeWidth={4} />
            {[-40, 60, 150].map((x, i) => (
              <g key={x} transform={`translate(${x} 120)`}>
                <circle cy={-60} r={20} fill={C.inkSoft} />
                <rect x={-24} y={-38} width={48} height={70} rx={20} fill={[C.red, C.green, C.orange][i]} />
              </g>
            ))}
          </At>
          <At x={400} y={640}>
            <Coin id="c8" r={110} fraction={frac} />
          </At>
          {(
            [
              ["家賃", 1060, 470, -8],
              ["電気代", 1420, 640, 7],
              ["人件費", 1120, 810, -4],
            ] as const
          ).map(([text, x, y, r], i) => (
            <At key={text} x={x} y={y} s={st[i].s} o={st[i].o} r={r}>
              <StampTag text={text} size={54} />
            </At>
          ))}
          <Chip at={a1} x={400} y={600} />
          <Chip at={a2} x={400} y={600} />
          <Chip at={a3} x={400} y={600} />
        </g>
      </Scene>
      {[a1, a2, a3].map((a) => (
        <React.Fragment key={a}>
          <Sfx at={a} name="stamp" volume={0.9} />
          <Sfx at={a + 2} name="chip" volume={0.6} />
        </React.Fragment>
      ))}
    </CutFrame>
  );
};

/* C009 それなのに―― */
export const C009: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const spot = ease(f, 0, 24, 1400, 330);
  const hit = segEnd(cut, 0) + 4;
  const pulse = f >= hit ? 1 + 0.12 * Math.exp(-(f - hit) / 5) : 1;
  return (
    <CutFrame cut={cut} dark bg={<AbsoluteFill style={{ background: C.night }} />}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 48%, rgba(255,240,200,0.28) 0px, rgba(255,240,200,0.10) ${spot * 0.6}px, rgba(0,0,0,0) ${spot}px)`,
        }}
      />
      <Scene>
        <At x={960} y={520} s={1.6 * pulse}>
          <Coin id="c9" r={110} fraction={0.1} />
        </At>
      </Scene>
      <Sfx at={hit} name="thud" volume={1} />
    </CutFrame>
  );
};

/* C010 たった100円で、本当に利益が出るのだろうか？ */
export const C010: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const l1 = ["たった", "100円", "で、"];
  const l2 = "本当に利益が出る？";
  const chars = 3 + 4 + 2 + l2.length;
  const t0 = segStart(cut, 0);
  const span = segEnd(cut, 0) - t0;
  const shown = Math.floor(interpolate(f, [t0 - 2, t0 + span * 0.95], [0, chars], clamp));
  const lens = [3, 4, 2];
  let used = 0;
  const part = (s: string, len: number) => {
    const n = Math.max(0, Math.min(len, shown - used));
    used += len;
    return s.slice(0, n === len ? s.length : n);
  };
  const a = part(l1[0], lens[0]);
  const b = part(l1[1], lens[1]);
  const c = part(l1[2], lens[2]);
  const d2 = part(l2, l2.length);
  const qBounce = shown >= chars ? 1 + 0.25 * Math.exp(-(f - (t0 + span * 0.95)) / 6) * Math.abs(Math.cos((f - t0 - span) / 3)) : 1;
  const typeTimes = Array.from({ length: Math.ceil(chars / 2) }, (_, k) => t0 + (span * 0.95 * (k * 2)) / chars);
  return (
    <CutFrame cut={cut} bg={<Paper />}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, color: C.ink }}>
        <div style={{ fontSize: 96, fontWeight: 700, height: 150, letterSpacing: 4 }}>
          {a}
          <span style={{ color: C.red, fontWeight: 900, fontSize: 124 }}>{b}</span>
          {c}
        </div>
        <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: 6, height: 210 }}>
          {d2.replace("？", "")}
          {d2.endsWith("？") && <span style={{ display: "inline-block", color: C.red, transform: `scale(${qBounce})` }}>？</span>}
        </div>
      </AbsoluteFill>
      {typeTimes.map((t, k) => (
        <Sfx key={k} at={t} name="type" volume={0.45} />
      ))}
    </CutFrame>
  );
};

/* C011 タイトルカード */
export const C011: React.FC<CutProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const tag = usePop(4, 10);
  const t1 = ease(f, 10, 28);
  const t2 = ease(f, 18, 36);
  const bar = ease(f, 30, 50);
  const logo = usePop(40, 12);
  const out = interpolate(f, [cut.duration - 14, cut.duration], [1, 0], clamp);
  const swing = 6 * Math.sin(f / 18);
  return (
    <CutFrame cut={cut}>
      <AbsoluteFill style={{ opacity: out }}>
        <Scene>
          <At x={380} y={520} s={1.25 * tag} r={-10 + swing}>
            <PriceTag />
          </At>
        </Scene>
        <div style={{ position: "absolute", left: 700, top: 350, fontFamily: FONT, color: C.ink }}>
          <div style={{ fontSize: 78, fontWeight: 700, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`, letterSpacing: 4 }}>
            <span style={{ color: C.red, fontWeight: 900 }}>100円</span>ショップは、
          </div>
          <div style={{ fontSize: 96, fontWeight: 900, whiteSpace: "nowrap", opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`, letterSpacing: 4, marginTop: 10 }}>
            なぜ<span style={{ color: C.red }}>100円</span>で儲かるのか
          </div>
          <div style={{ height: 10, width: 1000 * bar, background: C.red, borderRadius: 5, marginTop: 18 }} />
        </div>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}>
          <div style={{ transform: `scale(${logo})`, display: "flex", alignItems: "center", gap: 24, fontFamily: FONT }}>
            <div style={{ background: C.ink, color: C.paper, fontWeight: 900, fontSize: 54, padding: "10px 34px", borderRadius: 18, letterSpacing: 8 }}>
              カネナゾ
            </div>
            <div style={{ color: C.inkSoft, fontWeight: 700, fontSize: 34, letterSpacing: 4 }}>身近なお金の謎を解く</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Sfx at={4} name="jingle" volume={0.9} />
    </CutFrame>
  );
};
