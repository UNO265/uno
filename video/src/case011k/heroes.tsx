/** #011 お米 の HERO 場面（docs/case011-conti-v5.md）。すべて黒地、グラフは y≈790 より上に収める（03 字幕帯）。 */
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, F, clamp, out, pop } from "../kinetic/kit";
import { At, Prism, Txt, World } from "../kinetic/three";

type TP = { f: number; dur: number };
const fadeOut = (f: number, dur: number, d = 8) => interpolate(f, [dur - d, dur], [1, 0], clamp);
const GREEN = "#3ecf8e";
const yen = (n: number) => Math.round(n).toLocaleString();
/** 静止を避けるゆっくりした寄り（中央上寄せ） */
const drift = (f: number, dur: number): React.CSSProperties => ({ transformOrigin: "50% 35%", transform: `scale(${1 + 0.045 * interpolate(f, [0, dur], [0, 1])})` });

/** HERO1 「5キロの中身」: 費用 4 段階を下から積み上げる 3D 柱（生産が一番厚い） */
export const StackBag: React.FC<TP & { parts: { k: string; v: number; at: number; hot?: boolean }[]; total: number; source: string }> = ({ f, dur, parts, total, source }) => {
  const H = 480, BASE = 110; // 下端（World 座標）。字幕帯にかからない高さ
  // ラベルの縦位置: 各段の中心を目安に、重ならないよう 84px 以上あける（下から順に）
  let acc = 0;
  const seg = parts.map((p) => { const h = (p.v / total) * H * out(f, p.at, 14); const c = BASE - acc - h / 2; acc += h; return { h, c }; });
  const ly: number[] = [];
  seg.forEach((g, i) => { ly[i] = i === 0 ? g.c : Math.min(g.c, ly[i - 1] - 84); });
  acc = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <World cam={{ x: interpolate(f, [0, dur], [-40, 40]), y: -60, z: 240, rx: -6, ry: interpolate(f, [0, dur], [-12, 6]) }}>
        <At y={-560} z={-80} o={out(f, 0, 10)}>
          <Txt text={`お米5キロ ${yen(total)}円 の中身（費用のみ）`} size={56} font={F.jpb} />
        </At>
        {parts.map((p, i) => {
          const { h, c } = seg[i];
          return (
            <React.Fragment key={p.k}>
              <At x={-260} y={c} z={-20} ry={-18}>
                <Prism w={300} h={Math.max(2, h)} d={200} color={p.hot ? C.or : ["#3a3a40", "#4a4a52", "#5a5a63"][i % 3]} dark={p.hot ? "#b23c10" : "#232327"} top={p.hot ? "#ff8a5c" : "#6a6a72"} />
              </At>
              <At x={230} y={ly[i]} z={20} o={out(f, p.at + 8, 8)}>
                <div style={{ whiteSpace: "nowrap", width: 620, display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span style={{ fontFamily: F.jpb, fontSize: 40, color: p.hot ? C.or : "#c8c8cf", width: 300, textAlign: "right" }}>{p.k}</span>
                  <span style={{ fontFamily: F.en, fontSize: p.hot ? 96 : 64, color: p.hot ? C.or : C.ink }}>{yen(p.v)}</span>
                  <span style={{ fontFamily: F.jpb, fontSize: 36, color: p.hot ? C.or : C.ink }}>円</span>
                </div>
              </At>
            </React.Fragment>
          );
        })}
      </World>
      <div style={{ position: "absolute", left: 0, right: 0, top: 745, textAlign: "center", fontFamily: F.jpb, fontSize: 26, color: C.gray }}>{source}</div>
    </AbsoluteFill>
  );
};

/** HERO2 「天びん」: 受け取るお金 vs 作る費用。差が残れば緑、足りなければ赤。states を順に切り替える */
export const Balance: React.FC<TP & { title: string; states: { at: number; label: string; recv: number; cost: number }[]; note?: string; source: string }> = ({ f, dur, title, states, note, source }) => {
  let i = 0;
  for (let k = 0; k < states.length; k++) if (f >= states[k].at) i = k;
  const prev = states[Math.max(0, i - 1)], cur = states[i];
  const t = i === 0 ? out(f, cur.at, 16) : out(f, cur.at, 18);
  const lerp = (a: number, b: number) => (i === 0 ? b * t : a + (b - a) * t);
  const recv = lerp(prev.recv, cur.recv), cost = lerp(prev.cost, cur.cost);
  const diff = recv - cost;
  const max = Math.max(...states.map((s) => Math.max(s.recv, s.cost))) * 1.1;
  const H = 360, BASE = 680;
  const ang = interpolate(diff / max, [-0.5, 0.5], [9, -9], clamp);
  const col = diff >= 0 ? GREEN : "#ff4d3d";
  const bar = (x: number, v: number, label: string, color: string) => (
    <g>
      <rect x={x} y={BASE - (v / max) * H} width={260} height={(v / max) * H} rx={10} fill={color} />
      <text x={x + 130} y={BASE - (v / max) * H - 22} textAnchor="middle" fontFamily={F.en} fontSize={70} fill={C.ink}>{yen(v)}<tspan fontFamily={F.jpb} fontSize={34}>円</tspan></text>
      <text x={x + 130} y={BASE + 46} textAnchor="middle" fontFamily={F.jpb} fontSize={36} fill="#c8c8cf">{label}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <svg width={1920} height={1080} style={drift(f, dur)}>
        <text x={960} y={110} textAnchor="middle" fontFamily={F.jpb} fontSize={54} fill={C.ink} opacity={out(f, 0, 10)}>{title}</text>
        <text x={960} y={162} textAnchor="middle" fontFamily={F.jpb} fontSize={40} fill={C.or} opacity={out(f, cur.at, 8)}>{cur.label}</text>
        {/* 天びんの棒（差で傾く） */}
        <g transform={`rotate(${ang} 960 215)`} opacity={0.9}>
          <rect x={560} y={209} width={800} height={12} rx={6} fill="#55555c" />
          <circle cx={960} cy={215} r={18} fill="#55555c" />
        </g>
        {bar(560, recv, "受け取るお金", "#4a4a52")}
        {bar(1100, cost, "作る費用", "#3a3a40")}
        {/* 差 */}
        <g opacity={out(f, cur.at + 14, 10)}>
          <rect x={860} y={430} width={200} height={100} rx={16} fill={col} />
          <text x={960} y={498} textAnchor="middle" fontFamily={F.en} fontSize={62} fill={C.bg}>{diff >= 0 ? "+" : "−"}{yen(Math.abs(diff))}</text>
        </g>
        {note && <text x={960} y={BASE + 88} textAnchor="middle" fontFamily={F.jpb} fontSize={26} fill={C.gray}>{note}</text>}
        <text x={960} y={BASE + 120} textAnchor="middle" fontFamily={F.jpb} fontSize={26} fill={C.gray}>{source}</text>
      </svg>
    </AbsoluteFill>
  );
};

/** HERO3 「田んぼの大きさ」: 規模別の費用の棒 + 受け取る値段の基準線。線より上（費用が高い）は赤 */
export const SizeBars: React.FC<TP & { title: string; items: { k: string; v: number; at?: number }[]; line: number; lineLabel: string; source: string; lineAt: number }> = ({ f, dur, title, items, line, lineLabel, source, lineAt }) => {
  const max = Math.max(...items.map((i) => i.v)) * 1.08;
  const X0 = 220, W = 1480, H = 440, BASE = 690;
  const bw = (W / items.length) * 0.62;
  const ly = BASE - (line / max) * H;
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <svg width={1920} height={1080} style={drift(f, dur)}>
        <text x={960} y={120} textAnchor="middle" fontFamily={F.jpb} fontSize={52} fill={C.ink} opacity={out(f, 0, 10)}>{title}</text>
        {items.map((it, i) => {
          const a = it.at ?? 6 + i * 5;
          const h = (it.v / max) * H * out(f, a, 16);
          const x = X0 + (W / items.length) * i + ((W / items.length) - bw) / 2;
          const over = f >= lineAt && it.v > line;
          const under = f >= lineAt && it.v <= line;
          const color = over ? "#ff4d3d" : under ? GREEN : "#4a4a52";
          return (
            <g key={it.k}>
              <rect x={x} y={BASE - h} width={bw} height={h} rx={8} fill={color} />
              <text x={x + bw / 2} y={BASE - h - 16} textAnchor="middle" fontFamily={F.en} fontSize={44} fill={C.ink} opacity={out(f, a + 10, 8)}>{yen(it.v)}</text>
              <text x={x + bw / 2} y={BASE + 42} textAnchor="middle" fontFamily={F.jpb} fontSize={28} fill="#c8c8cf">{it.k}</text>
            </g>
          );
        })}
        <g opacity={out(f, lineAt, 10)}>
          {/* 凡例（線のラベルは棒の数字とぶつかるので、タイトルの下に置く） */}
          <line x1={X0 + W - 640} x2={X0 + W - 560} y1={170} y2={170} stroke={C.yel} strokeWidth={6} strokeDasharray="18 12" />
          <text x={X0 + W} y={181} textAnchor="end" fontFamily={F.jpb} fontSize={32} fill={C.yel}>{lineLabel}</text>
          <line x1={X0 - 20} x2={X0 + W + 20} y1={ly} y2={ly} stroke={C.yel} strokeWidth={6} strokeDasharray="18 12" />
          
        </g>
        <text x={960} y={BASE + 92} textAnchor="middle" fontFamily={F.jpb} fontSize={26} fill={C.gray}>{source}</text>
      </svg>
    </AbsoluteFill>
  );
};

/** HERO4 「揺れのループ」: 足りない→上がる→作る→余る→下がる の円と、左右に揺れる値段の振り子 */
export const SwingLoop: React.FC<TP & { title: string; nodes: { label: string; num?: string; at: number; hot?: boolean }[] }> = ({ f, dur, title, nodes }) => {
  const cx = 960, cy = 450, R = 270;
  const n = nodes.length;
  const pos = (i: number) => [cx + R * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n), cy + R * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / n)];
  const all = nodes[n - 1].at + 10;
  const swing = Math.sin(Math.max(0, f - all) / 22) * 28 * out(f, all, 20);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeOut(f, dur) }}>
      <svg width={1920} height={1080}>
        <text x={960} y={100} textAnchor="middle" fontFamily={F.jpb} fontSize={54} fill={C.ink} opacity={out(f, 0, 10)}>{title}</text>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3a3a40" strokeWidth={10} strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - out(f, 2, all))} />
        {/* 振り子: 中心から下がる値段のおもり */}
        <g transform={`rotate(${swing} ${cx} ${cy - 60})`} opacity={out(f, all, 14)}>
          <line x1={cx} y1={cy - 60} x2={cx} y2={cy + 70} stroke={C.yel} strokeWidth={6} />
          <circle cx={cx} cy={cy + 100} r={48} fill={C.yel} />
          <text x={cx} y={cy + 114} textAnchor="middle" fontFamily={F.jpb} fontSize={34} fill={C.bg}>値段</text>
        </g>
        {nodes.map((nd, i) => {
          const [x, y] = pos(i);
          const s = pop(f, nd.at, 10);
          const w = Math.max(240, [...nd.label].length * 46 + 70);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <rect x={-w / 2} y={-56} width={w} height={112} rx={26} fill={nd.hot ? C.or : C.ink} />
              <text y={16} textAnchor="middle" fontFamily={F.jp} fontSize={42} fill={C.bg}>{nd.label}</text>
              {nd.num && <text y={96} textAnchor="middle" fontFamily={F.en} fontSize={40} fill={C.yel}>{nd.num}</text>}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
