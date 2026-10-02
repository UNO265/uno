/**
 * KANENAZO モーション・テンプレート v1（docs/templates/motion-templates.md）
 * 各テンプレートは { f: 局所フレーム, dur } と内容だけを受け取る。強い場面は黒地、説明（弱）は紙の地。
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Blob, C, F, beatPulse, clamp, out, pop } from "../kinetic/kit";
import { At, Ex, Prism, Txt, World } from "../kinetic/three";

const PAPER = "#f3efe6", PINK = "#ffe14d";
type TP = { f: number; dur: number };
const backIn = (f: number, a: number, d: number, from: number) => interpolate(f, [a, a + d], [from, 0], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
/** 幅 w に収まる文字サイズ（英数字は約 0.5 字、和文は 1 字として数える） */
const fitSize = (t: string, w: number, max: number) => Math.min(max, w / [...t].reduce((a, ch) => a + (/[\x00-\x7f]/.test(ch) ? 0.52 : 1.02), 0));
const fadeOut = (f: number, dur: number, d = 8) => interpolate(f, [dur - d, dur], [1, 0], clamp);

/* T02 入体の数字 ─────────────────────────── */
export const NumberPunch: React.FC<TP & { value: string; label: string; source?: string; wall?: string }> = ({ f, dur, value, label, source, wall }) => (
  <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
    {/* 文字の壁は 3D 空間の外（平面）で描く。遠くの大きな文字を 3D 合成すると極端に重い */}
    <div style={{ position: "absolute", left: "50%", top: "50%", fontFamily: F.jp, fontSize: 84, lineHeight: 1.02, color: "#1b1b1f", width: 2400, transform: `translate(-50%, -50%) translateX(${interpolate(f, [0, dur], [20, -20])}px) scale(${interpolate(f, [0, dur], [1, 1.06])})` }}>
      {Array.from({ length: 7 }, (_, r) => (
        <div key={r} style={{ whiteSpace: "nowrap", transform: `translateX(${(r % 2 ? 1 : -1) * ((f * 3) % 400) - 200}px)` }}>{`${wall ?? value} `.repeat(8)}</div>
      ))}
    </div>
    <World cam={{ x: interpolate(f, [0, dur], [-40, 40]), y: 0, z: interpolate(f, [0, dur], [260, 140]), rx: 0, ry: interpolate(f, [0, dur], [-6, 6]) }}>
      <At y={-110} ry={backIn(f, 2, 18, 50)} s={0.85 + 0.15 * out(f, 2, 12)}>
        <Ex text={value} size={280} color={C.ink} side="#6a655d" depth={72} />
      </At>
      <At y={110} z={60} o={out(f, 12, 10)}>
        <div style={{ background: C.or, padding: "8px 30px" }}>
          <Txt text={label} size={56} color={C.bg} font={F.jpb} />
        </div>
      </At>
    </World>
    {source && <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: F.jpb, fontSize: 26, color: C.gray, opacity: out(f, 20, 10) }}>{source}</div>}
  </AbsoluteFill>
);

/* T03 回る問い ─────────────────────────── */
export const QuestionDrum: React.FC<TP & { text: string; hot: string; band: string }> = ({ f, dur, text, hot, band }) => (
  <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
    <World cam={{ x: 0, y: 0, z: 300, rx: 0, ry: 0 }}>
      <At y={-30} z={-1500} ry={interpolate(f, [0, dur * 0.8], [55, -4], { ...clamp, easing: Easing.out(Easing.cubic) })}>
        <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
          {text.split("").map((ch, i, arr) => (
            <div key={i} style={{ position: "absolute", left: -90, top: -100, width: 180, textAlign: "center", transform: `rotateY(${(i - (arr.length - 1) / 2) * 7.2}deg) translateZ(1250px)`, fontFamily: F.jp, fontSize: 150, color: hot.includes(ch) ? C.or : C.ink, opacity: f >= i * 1.6 ? 1 : 0, backfaceVisibility: "hidden" }}>
              {ch}
            </div>
          ))}
        </div>
      </At>
      {[{ y: -380, r: -6, s: 7, bg: C.or }, { y: 400, r: 5, s: -6, bg: C.ink }].map((m, i) => (
        <At key={i} y={m.y} z={-100 - i * 200} rz={m.r}>
          <div style={{ width: 3400, overflow: "hidden", background: m.bg, padding: "6px 0" }}>
            <div style={{ fontFamily: F.en, fontSize: 64, color: C.bg, whiteSpace: "nowrap", transform: `translateX(${((f * m.s) % 700) - 700}px)`, letterSpacing: 2 }}>{Array(10).fill(`${band}  ✦  `).join("")}</div>
          </div>
        </At>
      ))}
    </World>
  </AbsoluteFill>
);

/* T04 章の切り替え ─────────────────────────── */
export const Chapter: React.FC<TP & { no: number; title: string; sub?: string }> = ({ f, dur, no, title, sub }) => {
  const wipe = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, background: C.or, transform: `translateX(${(wipe - 1) * 100}%)` }} />
      <World cam={{ x: 0, y: 0, z: 200, rx: interpolate(f, [0, dur], [6, -2]), ry: interpolate(f, [0, dur], [-8, 4]) }}>
        <At x={-560} y={-60} z={-40} o={f > 6 && f < dur - 8 ? 1 : 0}>
          <div style={{ fontFamily: F.en, fontSize: 340, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${C.bg}` }}>{String(no).padStart(2, "0")}</div>
        </At>
        <At x={170} y={-90} z={20} o={out(f, 8, 8) * (f < dur - 8 ? 1 : 0)}>
          <div style={{ fontFamily: F.mono, fontSize: 30, color: C.bg, letterSpacing: 6 }}>CHAPTER {String(no).padStart(2, "0")}</div>
        </At>
        <At x={170} y={20} z={40} o={f > 10 && f < dur - 8 ? 1 : 0} ry={backIn(f, 10, 14, -50)}>
          <Txt text={title} size={110} color={C.bg} />
        </At>
        {sub && (
          <At x={170} y={120} z={30} o={out(f, 16, 8) * (f < dur - 8 ? 1 : 0)}>
            <Txt text={<span style={{ fontFamily: F.it, fontStyle: "italic" }}>{sub}</span>} size={48} color={C.bg} />
          </At>
        )}
      </World>
    </AbsoluteFill>
  );
};

/* T05 結論型の折れ線（紙） ─────────────────────────── */
export const LineChart: React.FC<TP & { title: string; sub: string; data: { x: number; y: number; label?: string }[]; unit: string; source: string; yMax: number }> = ({ f, dur, title, sub, data, unit, source, yMax }) => {
  const X0 = 240, X1 = 1680, Y0 = 660, Y1 = 310;
  const xs = data.map((d) => d.x), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const px = (x: number) => X0 + ((x - x0) / (x1 - x0)) * (X1 - X0);
  const py = (y: number) => Y0 - (y / yMax) * (Y0 - Y1);
  const draw = interpolate(f, [10, dur * 0.65], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pts = data.map((d) => [px(d.x), py(d.y)]);
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const sc = 1 + 0.04 * interpolate(f, [0, dur], [0, 1]);
  return (
    <AbsoluteFill style={{ background: PAPER, opacity: fadeOut(f, dur) }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${sc})` }}>
        <svg width={1920} height={1080}>
          <rect x={160} y={110} width={90} height={14} fill={C.or} />
          <text x={160} y={210} fontFamily={F.jp} fontSize={70} fill={C.bg} opacity={out(f, 0, 10)}>{title}</text>
          <text x={160} y={268} fontFamily={F.jpb} fontSize={32} fill="#6b6b70">{sub}</text>
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={X0} x2={X1} y1={py(yMax * t)} y2={py(yMax * t)} stroke="#d8d2c6" strokeWidth={2} />
              <text x={X1 + 20} y={py(yMax * t) + 10} fontFamily={F.mono} fontSize={24} fill="#8a8a90">{+(yMax * t).toFixed(1)}</text>
            </g>
          ))}
          <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.bg} strokeWidth={8} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
          {data.map((d, i) => {
            const at = 10 + (dur * 0.65 - 10) * (i / (data.length - 1));
            if (f < at) return null;
            const s = pop(f, at, 9);
            return (
              <g key={i} transform={`translate(${px(d.x)} ${py(d.y)}) scale(${s})`}>
                <circle r={14} fill={i === data.length - 1 ? C.or : C.bg} stroke={PAPER} strokeWidth={4} />
                <text y={-32} textAnchor="middle" fontFamily={F.en} fontSize={i === data.length - 1 ? 64 : 40} fill={i === data.length - 1 ? C.or : C.bg}>{d.label ?? d.y}{unit}</text>
                <text y={58} textAnchor="middle" fontFamily={F.mono} fontSize={24} fill="#6b6b70">{d.x}</text>
              </g>
            );
          })}
          <text x={X0} y={Y0 + 104} fontFamily={F.jpb} fontSize={26} fill="#8a8a90">{source}</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* T06 3D 棒の比較 ─────────────────────────── */
export const Bar3D: React.FC<TP & { title: string; items: { k: string; v: number; hot?: boolean }[]; unit: string; source: string }> = ({ f, dur, title, items, unit, source }) => {
  const max = Math.max(...items.map((i) => i.v));
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <World cam={{ x: interpolate(f, [0, dur], [-80, 140]), y: -40, z: 260, rx: -6, ry: interpolate(f, [0, dur], [-4, 12]) }}>
        <At y={-470} z={-100} o={out(f, 0, 10)}>
          <Txt text={title} size={64} font={F.jpb} />
        </At>
        {items.map((b, i) => {
          const h = (b.v / max) * 340 * out(f, 6 + i * 4, 18);
          return (
            <At key={b.k} x={-((items.length - 1) * 320) / 2 + i * 320} y={50 - h / 2} z={-40} ry={-24}>
              <div style={{ position: "relative" }}>
                <Prism w={170} h={Math.max(2, h)} d={120} color={b.hot ? C.or : "#3a3a40"} dark={b.hot ? "#b23c10" : "#232327"} top={b.hot ? "#ff8a5c" : "#55555c"} />
                <div style={{ position: "absolute", top: h + 24, width: 260, left: -45, textAlign: "center", fontFamily: F.jpb, fontSize: 34, lineHeight: 1.2, whiteSpace: "normal", color: b.hot ? C.or : "#a0a0a8" }}>{b.k}</div>
                <div style={{ position: "absolute", top: -90, width: 260, left: -45, textAlign: "center", fontFamily: F.en, fontSize: 66, color: b.hot ? C.or : C.ink, opacity: out(f, 18 + i * 4, 8) }}>{b.v}{unit}</div>
              </div>
            </At>
          );
        })}
      </World>
      <div style={{ position: "absolute", left: 0, right: 0, top: 745, textAlign: "center", fontFamily: F.jpb, fontSize: 26, color: C.gray }}>{source}</div>
    </AbsoluteFill>
  );
};

/* T07 比較カード ─────────────────────────── */
export const CompareCards: React.FC<TP & { lead: string; cards: { title: string; value: string; note?: string; hot?: boolean }[]; source?: string }> = ({ f, dur, lead, cards, source }) => (
  <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
    <World cam={{ x: 0, y: 0, z: interpolate(f, [0, dur], [300, 220]), rx: 0, ry: interpolate(f, [0, dur], [-5, 5]) }}>
      <At y={-430} z={-60} o={out(f, 0, 10)}>
        <Txt text={lead} size={58} font={F.jpb} />
      </At>
      {cards.map((c, i) => {
        const a = 6 + i * 7;
        const flip = interpolate(f, [a, a + 16], [180, 0], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
        const n = cards.length;
        return (
          <At key={i} x={(i - (n - 1) / 2) * 470} y={-70} z={c.hot ? 40 : -40} ry={(i - (n - 1) / 2) * -10 + flip} o={f >= a ? 1 : 0}>
            <div style={{ width: 400, height: 400, borderRadius: 28, background: c.hot ? C.or : "#222227", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 40px 80px rgba(0,0,0,.55)", backfaceVisibility: "hidden" }}>
              <div style={{ fontFamily: F.jpb, fontSize: 44, color: c.hot ? C.bg : "#c8c8cf" }}>{c.title}</div>
              <div style={{ fontFamily: F.en, fontSize: fitSize(c.value, 330, 170), lineHeight: 1, color: c.hot ? C.bg : C.ink, whiteSpace: "nowrap" }}>{c.value}</div>
              {c.note && <div style={{ fontFamily: F.jpb, fontSize: 28, color: c.hot ? C.bg : C.gray }}>{c.note}</div>}
            </div>
          </At>
        );
      })}
    </World>
    {source && <div style={{ position: "absolute", left: 0, right: 0, top: 745, textAlign: "center", fontFamily: F.jpb, fontSize: 26, color: C.gray }}>{source}</div>}
  </AbsoluteFill>
);

/* T08 お金の流れ ─────────────────────────── */
export const MoneyFlow: React.FC<TP & { nodes: { id: string; label: string; x: number; y: number; hot?: boolean }[]; edges: { from: string; to: string; label: string; hot?: boolean }[]; title: string }> = ({ f, dur, nodes, edges, title }) => {
  const N = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <text x={960} y={130} textAnchor="middle" fontFamily={F.jpb} fontSize={56} fill={C.ink} opacity={out(f, 0, 10)}>{title}</text>
        {/* 図は字幕の帯（y≈800〜）にかからないよう上に縮める */}
        <g transform="translate(960 40) scale(0.86) translate(-960 0)">
        {edges.map((e, i) => {
          const a = N[e.from], b = N[e.to];
          const at = 10 + i * 10;
          const p = out(f, at, 16);
          const bend = [-220, 60, 200][i % 3];
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + bend;
          const d = `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
          return (
            <g key={i} opacity={f >= at ? 1 : 0}>
              <path d={d} fill="none" stroke={e.hot ? C.or : "#55555c"} strokeWidth={8} strokeDasharray="1600" strokeDashoffset={1600 * (1 - p)} />
              {Array.from({ length: 4 }, (_, k) => {
                const t = ((f - at) / 40 + k / 4) % 1;
                if (f < at + 10) return null;
                const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
                const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t * t * b.y;
                return <circle key={k} cx={x} cy={y} r={14} fill={e.hot ? C.yel : "#c9c9cf"} />;
              })}
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const s = pop(f, 2 + i * 4, 10);
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y}) scale(${s})`}>
              <rect x={-boxW(n.label) / 2} y={-60} width={boxW(n.label)} height={120} rx={24} fill={n.hot ? C.or : C.ink} />
              <text y={16} textAnchor="middle" fontFamily={F.jp} fontSize={46} fill={C.bg}>{n.label}</text>
            </g>
          );
        })}
        {edges.map((e, i) => {
          const a = N[e.from], b = N[e.to];
          const at = 10 + i * 10;
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + [-220, 60, 200][i % 3] / 2;
          return (
            <text key={i} x={mx} y={my - 26} textAnchor="middle" fontFamily={F.jpb} fontSize={34} fill={e.hot ? C.or : "#c8c8cf"} stroke={C.bg} strokeWidth={10} paintOrder="stroke" opacity={f >= at ? out(f, at + 10, 8) : 0}>{e.label}</text>
          );
        })}
      </g>
      </svg>
    </AbsoluteFill>
  );
};

/* T09 文書のハイライト（紙） ─────────────────────────── */
export const Document: React.FC<TP & { name: string; lines: string[]; mark: number; source: string }> = ({ f, dur, name, lines, mark, source }) => (
  <AbsoluteFill style={{ background: "#e9e4d9", opacity: fadeOut(f, dur) }}>
    <World cam={{ x: 0, y: interpolate(f, [0, dur], [-20, 40]), z: interpolate(f, [0, dur], [380, 200]), rx: 0, ry: 0 }}>
      <At y={-80} rx={interpolate(f, [0, 16], [30, 10], { ...clamp, easing: Easing.out(Easing.cubic) })} ry={-8} rz={-2}>
        <div style={{ width: 1100, padding: "60px 80px", background: "#fffdf7", boxShadow: "0 50px 90px rgba(0,0,0,.25)", fontFamily: F.jpb }}>
          <div style={{ fontSize: 30, color: "#6b6b70", letterSpacing: 2, marginBottom: 30, borderBottom: "2px solid #ddd6c8", paddingBottom: 16 }}>{name}</div>
          {lines.map((l, i) => (
            <div key={i} style={{ position: "relative", fontSize: 44, lineHeight: 1.7, color: i === mark ? C.bg : "#9a968e" }}>
              {i === mark && <div style={{ position: "absolute", left: -12, right: -12, top: 12, bottom: 12, background: PINK, transformOrigin: "left", transform: `scaleX(${out(f, 18, 14)})`, zIndex: 0 }} />}
              <span style={{ position: "relative" }}>{l}</span>
            </div>
          ))}
          <div style={{ marginTop: 26, paddingTop: 14, borderTop: "2px solid #ddd6c8", fontSize: 26, color: "#6b6b70" }}>{source}</div>
        </div>
      </At>
    </World>
  </AbsoluteFill>
);

/* T10 年表（紙・カメラが横に動く） ─────────────────────────── */
export const Timeline: React.FC<TP & { events: { year: string; text: string; hot?: boolean }[]; title: string }> = ({ f, dur, events, title }) => {
  const gap = 560;
  const camX = interpolate(f, [8, dur - 10], [0, (events.length - 1) * gap], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: PAPER, opacity: fadeOut(f, dur) }}>
      <div style={{ position: "absolute", left: 160, top: 120, fontFamily: F.jp, fontSize: 60, color: C.bg }}>{title}</div>
      <World cam={{ x: camX, y: 0, z: 260, rx: 0, ry: -14 }}>
        <At x={((events.length - 1) * gap) / 2} y={-50} z={-2}>
          <div style={{ width: events.length * gap + 600, height: 6, background: C.bg }} />
        </At>
        {events.map((e, i) => {
          const d = i * gap - camX;
          const near = Math.abs(d) < gap * 0.6;
          const s = near ? 1 : 0.82;
          const o = d < -gap * 0.6 ? interpolate(d, [-gap * 1.1, -gap * 0.6], [0, 0.4], clamp) : near ? 1 : 0.4;
          return (
            <At key={i} x={i * gap} y={-60} s={s} o={o}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: F.en, fontSize: 120, color: e.hot ? C.or : C.bg, lineHeight: 1 }}>{e.year}</div>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: e.hot ? C.or : C.bg, margin: "26px auto" }} />
                <div style={{ fontFamily: F.jpb, fontSize: 40, color: C.bg, width: 460, whiteSpace: "normal" }}>{e.text}</div>
              </div>
            </At>
          );
        })}
      </World>
    </AbsoluteFill>
  );
};

/* T11 要点の一文（紙） ─────────────────────────── */
export const KeyLine: React.FC<TP & { parts: { t: string; hot?: boolean }[]; note?: string }> = ({ f, dur, parts, note }) => (
  <AbsoluteFill style={{ background: PAPER, opacity: fadeOut(f, dur), alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: 230 }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 1500, transform: `scale(${1 + 0.03 * interpolate(f, [0, dur], [0, 1])})` }}>
      {parts.map((p, i) => {
        const a = 4 + i * 5;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", fontFamily: F.jp, fontSize: 96, lineHeight: 1.4, color: C.bg, opacity: out(f, a, 8), transform: `translateY(${(1 - out(f, a, 10)) * 40}px)` }}>
            {p.hot && <span style={{ position: "absolute", left: -6, right: -6, bottom: 18, height: 34, background: C.or, opacity: 0.85, transformOrigin: "left", transform: `scaleX(${out(f, a + 8, 10)})`, zIndex: 0 }} />}
            <span style={{ position: "relative" }}>{p.t}</span>
          </span>
        );
      })}
    </div>
    {note && <div style={{ marginTop: 34, fontFamily: F.jpb, fontSize: 28, color: "#8a8a90", opacity: out(f, 20, 10) }}>{note}</div>}
  </AbsoluteFill>
);

/* 背景のブロブ（強い場面に足す飾り） */
export const BlobLayer: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {[0, 1, 2, 3].map((i) => <Blob key={i} x={[180, 1760, 260, 1680][i]} y={[200, 260, 900, 880][i]} r={60 + i * 10 + beatPulse(f) * 6} f={f} seed={i} color={i === 2 ? C.or : C.bl} />)}
  </svg>
);

/* ── 追加テンプレート（#009 本編） ─────────────────────────── */

/** T11 の黒地版（答え・CLUE の一文。強い） */
export const KeyLineDark: React.FC<TP & { parts: { t: string; hot?: boolean; at?: number }[]; size?: number; note?: string }> = ({ f, dur, parts, size = 110, note }) => (
  <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur), alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: 230 }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", maxWidth: 1600, rowGap: 10, transform: `scale(${1 + 0.035 * interpolate(f, [0, dur], [0, 1])}) perspective(1200px) rotateX(${interpolate(f, [0, dur], [6, -2])}deg)` }}>
      {parts.map((p, i) => {
        const a = p.at ?? 3 + i * 6;
        const s = pop(f, a, 9);
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: F.jp, fontSize: p.hot ? size * 1.15 : size, lineHeight: 1.3, color: p.hot ? C.bg : C.ink, background: p.hot ? C.or : "transparent", padding: p.hot ? "0 18px" : 0, margin: "0 6px", opacity: f >= a ? 1 : 0, transform: `scale(${s})` }}>
            {p.t}
          </span>
        );
      })}
    </div>
    {note && <div style={{ marginTop: 34, fontFamily: F.jpb, fontSize: 28, color: C.gray }}>{note}</div>}
  </AbsoluteFill>
);

/** 項目が順に出るリスト（紙）。strike: 取り消し線で「やらないこと」 */
export const ListCard: React.FC<TP & { title: string; items: { t: string; at: number; strike?: boolean; hot?: boolean }[]; dark?: boolean }> = ({ f, dur, title, items, dark }) => {
  const bg = dark ? C.bg : PAPER, ink = dark ? C.ink : C.bg;
  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeOut(f, dur), transformOrigin: "20% 30%", transform: `scale(${1 + 0.05 * interpolate(f, [0, dur], [0, 1])}) translateY(${interpolate(f, [0, dur], [0, -14])}px)` }}>
      <div style={{ position: "absolute", left: 220, top: 150, fontFamily: F.jp, fontSize: 64, color: ink, opacity: out(f, 0, 10) }}>{title}</div>
      <div style={{ position: "absolute", left: 220, top: 280, display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((it, i) => {
          const o = out(f, it.at, 8);
          const strike = it.strike ? out(f, it.at + 10, 8) : 0;
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 30, opacity: o, transform: `translateX(${(1 - o) * -60}px)` }}>
              <div style={{ width: 54, height: 54, borderRadius: 12, background: it.hot ? C.or : it.strike ? "#c94a3a" : ink, color: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.en, fontSize: 40 }}>{it.strike ? "×" : it.hot ? "!" : "✓"}</div>
              <div style={{ position: "relative", fontFamily: F.jp, fontSize: it.hot ? 92 : 74, color: it.hot ? C.or : ink }}>
                {it.t}
                {it.strike && <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, background: "#c94a3a", transformOrigin: "left", transform: `scaleX(${strike})` }} />}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 円を回るお金の輪（来店のループ） */
const boxW = (t: string) => Math.max(300, [...t].reduce((a, ch) => a + (/[\x00-\x7f]/.test(ch) ? 26 : 46), 0) + 80);
export const LoopFlow: React.FC<TP & { title: string; nodes: { label: string; at: number; hot?: boolean }[] }> = ({ f, dur, title, nodes }) => {
  const cx = 960, cy = 470, R = 260;
  const n = nodes.length;
  const pos = (i: number) => [cx + R * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n), cy + R * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / n)];
  const all = nodes[n - 1].at + 10;
  const spin = Math.max(0, f - all) / 60;
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <svg width={1920} height={1080}>
        <text x={960} y={120} textAnchor="middle" fontFamily={F.jpb} fontSize={54} fill={C.ink} opacity={out(f, 0, 10)}>{title}</text>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3a3a40" strokeWidth={10} strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - out(f, 2, all))} />
        {f > all &&
          Array.from({ length: 6 }, (_, k) => {
            const a = -Math.PI / 2 + ((spin + k / 6) % 1) * 2 * Math.PI;
            return <circle key={k} cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={16} fill={C.yel} />;
          })}
        {nodes.map((nd, i) => {
          const [x, y] = pos(i);
          const s = pop(f, nd.at, 10);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <rect x={-boxW(nd.label) / 2} y={-62} width={boxW(nd.label)} height={124} rx={28} fill={nd.hot ? C.or : C.ink} />
              <text y={17} textAnchor="middle" fontFamily={F.jp} fontSize={44} fill={C.bg}>{nd.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** 「非公開」の判子が押される */
export const Stamp: React.FC<TP & { lines: string[]; stamp: string; at: number }> = ({ f, dur, lines, stamp, at }) => {
  const p = interpolate(f, [at, at + 6], [2.4, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur), alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", transform: "translateY(-150px)" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: F.jp, fontSize: 96, color: C.ink, opacity: out(f, 2 + i * 6, 8), lineHeight: 1.35 }}>{l}</div>
        ))}
      </div>
      {f >= at && (
        <div style={{ position: "absolute", transform: `translateY(120px) rotate(-8deg) scale(${p})`, border: `14px solid ${C.or}`, borderRadius: 24, padding: "10px 60px", fontFamily: F.jp, fontSize: 170, color: C.or, opacity: 0.92 }}>{stamp}</div>
      )}
    </AbsoluteFill>
  );
};

/** 数字のカウントアップ表示（NumberPunch の値を数える） */
export const countText = (f: number, a: number, d: number, to: number, fmt: (n: number) => string) => fmt(interpolate(f, [a, a + d], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
