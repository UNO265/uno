/**
 * CASE #005「送料無料、本当に無料？」の画面部品。
 * CASE #010 までは実写を使わない（v3 0番）。主役は「送料無料」ステッカーの段ボール箱（OBJECT）と、
 * スマホの注文画面（DOCUMENT）、夜の配送ルート（BLUEPRINT/MAP）。CLUE は送り状（伝票）の形。
 * 共通の骨組み（mk・字幕・EVIDENCE カードなど）は case002/ui を使う。
 */
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { K, SERIF, ease, fade, pop, Sfx } from "../case002/ui";
import { FONT } from "../theme";

export const T = {
  ...K,
  kraft: "#C89B62",
  kraftDark: "#A87C45",
  kraftLight: "#DDB883",
  tape: "#E8D3A6",
  sticker: "#E2452F",
  screen: "#FFFFFF",
  night: "#0F2340",
  road: "#8FD3FF",
  roadSoft: "rgba(143,211,255,0.35)",
  label: "#FFFDF6",
  hidden: "#9AA3AF",
  time: "#F2B94B", // 運ぶ人の時間
  lane: { price: "#E07A5F", line: "#3D8BD9", fee: "#8C6BC8" },
};

/* ── 段ボール箱（斜め上から見た形）。sticker: 「送料無料」の見え方(0..1)、ghost: ステッカーを透かす(0..1) ─── */
export const Box: React.FC<{ x: number; y: number; s?: number; sticker?: number; ghost?: number; label?: string; o?: number; r?: number }> = ({
  x,
  y,
  s = 1,
  sticker = 1,
  ghost = 0,
  label = "送料無料",
  o = 1,
  r = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={210} rx={330} ry={34} fill="rgba(0,0,0,0.25)" />
    {/* 上面 */}
    <path d="M -300 -120 L 0 -230 L 300 -120 L 0 -10 Z" fill={T.kraftLight} stroke={T.kraftDark} strokeWidth={5} />
    <path d="M -150 -175 L 150 -65" stroke={T.tape} strokeWidth={46} />
    {/* 正面・側面 */}
    <path d="M -300 -120 L 0 -10 L 0 200 L -300 90 Z" fill={T.kraft} stroke={T.kraftDark} strokeWidth={5} />
    <path d="M 300 -120 L 0 -10 L 0 200 L 300 90 Z" fill={T.kraftDark} stroke={T.kraftDark} strokeWidth={5} />
    {/* ステッカー */}
    <g transform="translate(-150 60) skewY(20)" opacity={sticker}>
      <rect x={-118} y={-58} width={236} height={116} rx={16} fill={T.sticker} opacity={1 - ghost * 0.75} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#FFFFFF" opacity={1 - ghost * 0.6}>
        {label}
      </text>
    </g>
  </g>
);

/* ── スマホの注文画面 ───────────────── */
export const Phone: React.FC<{ x: number; y: number; s?: number; tap?: number; price?: string; ship?: string; o?: number; dark?: boolean }> = ({
  x,
  y,
  s = 1,
  tap = -1,
  price = "¥2,000",
  ship = "¥0",
  o = 1,
}) => {
  const f = useCurrentFrame();
  const pressed = tap >= 0 && f >= tap && f < tap + 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-210} y={-400} width={420} height={800} rx={52} fill="#1B1F27" />
      <rect x={-190} y={-370} width={380} height={740} rx={34} fill={T.screen} />
      <rect x={-60} y={-390} width={120} height={18} rx={9} fill="#0E1116" />
      <text x={-160} y={-300} fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
        ご注文内容
      </text>
      <rect x={-160} y={-260} width={320} height={150} rx={14} fill="#F2EFE8" />
      <rect x={-140} y={-240} width={90} height={110} rx={8} fill="#6F8FB3" />
      <text x={-30} y={-195} fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.ink}>
        本 ×1
      </text>
      <text x={-30} y={-150} fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
        {price}
      </text>
      <line x1={-160} x2={160} y1={-70} y2={-70} stroke="#DDD6C8" strokeWidth={3} />
      <text x={-160} y={-20} fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
        送料
      </text>
      <text x={160} y={-20} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={44} fill={T.sticker}>
        {ship}
      </text>
      <text x={-160} y={50} fontFamily={FONT} fontWeight={800} fontSize={32} fill={K.inkSoft}>
        合計
      </text>
      <text x={160} y={50} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
        {price}
      </text>
      <rect x={-160} y={200} width={320} height={96} rx={48} fill={pressed ? "#B8331F" : T.sticker} />
      <text x={0} y={250} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
        注文を確定する
      </text>
    </g>
  );
};

/* ── トラック（横向き） ───────────────── */
export const Truck: React.FC<{ x: number; y: number; s?: number; color?: string; lights?: boolean; flip?: boolean }> = ({ x, y, s = 1, color = "#FFFFFF", lights, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {lights && <path d="M 150 10 L 420 -40 L 420 70 Z" fill="rgba(255,236,170,0.28)" />}
    <rect x={-160} y={-90} width={220} height={120} rx={8} fill={color} stroke={K.ink} strokeWidth={5} />
    <path d="M 60 -60 L 120 -60 L 150 -10 L 150 30 L 60 30 Z" fill={color} stroke={K.ink} strokeWidth={5} />
    <rect x={80} y={-50} width={40} height={32} rx={4} fill="#9CC6E8" />
    <circle cx={-110} cy={34} r={22} fill={K.ink} />
    <circle cx={100} cy={34} r={22} fill={K.ink} />
  </g>
);

/* ── 配送ルート（夜の地図）: 倉庫 → 仕分け拠点 → 幹線 → 営業所 → 玄関 ───────────────── */
export const ROUTE = [
  { x: 220, y: 700, label: "倉庫" },
  { x: 620, y: 420, label: "仕分けの拠点" },
  { x: 1180, y: 420, label: "夜の幹線" },
  { x: 1480, y: 700, label: "営業所" },
  { x: 1720, y: 520, label: "玄関" },
];
export const RouteMap: React.FC<{ at: number; step?: number; coins?: number[]; boxAt?: number }> = ({ at, step = 28, coins = [], boxAt }) => {
  const f = useCurrentFrame();
  const segs = ROUTE.slice(1).map((p, i) => ({ a: ROUTE[i], b: p, t: at + i * step }));
  // 箱の位置（区間ごとに補間）
  const bt = boxAt ?? at;
  const k = Math.min(segs.length - 0.001, Math.max(0, (f - bt) / step));
  const si = Math.floor(k);
  const u = Easing.inOut(Easing.cubic)(k - si);
  const bx = segs[si].a.x + (segs[si].b.x - segs[si].a.x) * u;
  const by = segs[si].a.y + (segs[si].b.y - segs[si].a.y) * u;
  return (
    <g>
      {segs.map((sg, i) => {
        const L = Math.hypot(sg.b.x - sg.a.x, sg.b.y - sg.a.y);
        const p = ease(f, sg.t, sg.t + step);
        return (
          <line
            key={i}
            x1={sg.a.x}
            y1={sg.a.y}
            x2={sg.b.x}
            y2={sg.b.y}
            stroke={i === 1 ? "#FFE9A8" : T.road}
            strokeWidth={i === 1 ? 10 : 7}
            strokeDasharray={i === 1 ? "30 18" : `${L}`}
            strokeDashoffset={i === 1 ? -f * 4 : L * (1 - p)}
            opacity={i === 1 ? p : 1}
          />
        );
      })}
      {ROUTE.map((p, i) => {
        const o = fade(f, at + Math.max(0, i - 1) * step + (i === 0 ? 0 : step - 6));
        return (
          <g key={i} opacity={o}>
            <circle cx={p.x} cy={p.y} r={26} fill={T.night} stroke={T.road} strokeWidth={6} />
            <text x={p.x} y={p.y + (p.y > 600 ? 78 : -50)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#EAF6FF">
              {p.label}
            </text>
          </g>
        );
      })}
      {/* 動く箱 */}
      <g transform={`translate(${bx} ${by - 44}) scale(0.16)`} opacity={fade(f, bt)}>
        <Box x={0} y={0} sticker={1} />
      </g>
      {/* 各地点に落ちるお金 */}
      {coins.map((t, i) => {
        const p = ROUTE[i + 1] ?? ROUTE[i];
        const dy = ease(f, t, t + 14, -120, 0, Easing.out(Easing.bounce));
        return (
          <g key={i} transform={`translate(${p.x + 60} ${p.y - 40 + dy})`} opacity={fade(f, t, 6)}>
            <circle r={34} fill="#F4D35E" stroke="#B8902A" strokeWidth={5} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#7A5A10">
              ¥
            </text>
          </g>
        );
      })}
    </g>
  );
};

/* ── CLUE（送り状の形）: 「0円」欄の下から本当の中身が透けて見える ───────────────── */
export const CLUES5: Record<string, { lines: string[]; under?: string }> = {
  "01": { lines: ["送料は、消えない。", "見えなくなるだけ。"], under: "711円" },
  "02": { lines: ["「送料無料」は、", "買い方を変える", "仕組み。"], under: "客単価・次の買い物" },
  "03": { lines: ["送料の一部は、", "「運ぶ人の時間」で", "払われてきた。"], under: "時間" },
  FINAL: { lines: ["送料を、", "誰が・どこで払うかを", "見えなくする仕組み。"], under: "客・店・運ぶ人" },
};
export const Waybill: React.FC<{ no: string; at: number }> = ({ no, at }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.back(1.3)));
  const c = CLUES5[no];
  const final = no === "FINAL";
  const maxChars = Math.max(...c.lines.map((l) => [...l].length));
  const size = Math.min(76, Math.floor(700 / maxChars));
  const see = ease(f, at + 40, at + 70); // 「0円」欄が透けていく
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
        <div
          style={{
            width: 1240,
            background: T.label,
            borderRadius: 8,
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            transform: `translateY(${(1 - p) * 220}px) rotate(${-1.2 + (1 - p) * 4}deg)`,
            opacity: Math.min(1, p * 1.5),
            fontFamily: FONT,
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            border: `4px solid ${final ? K.red : "#3B4556"}`,
          }}
        >
          <div style={{ borderRight: "3px solid #3B4556", padding: "28px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: final ? K.red : K.ink }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 6 }}>送り状</div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 8, marginTop: 10 }}>{final ? "FINAL" : "CLUE"}</div>
            <div style={{ fontSize: final ? 74 : 120, fontWeight: 900, lineHeight: 1 }}>{final ? "CLUE" : no}</div>
            {/* 送料欄: 0円 → 下の中身が透ける */}
            <div style={{ marginTop: 22, width: 220, border: "3px solid #3B4556", borderRadius: 6, position: "relative", height: 86, overflow: "hidden", background: "#FFFFFF" }}>
              <div style={{ position: "absolute", left: 8, top: 4, fontSize: 18, fontWeight: 800, color: K.inkSoft }}>送料</div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 14, fontSize: 40, fontWeight: 900, color: T.sticker, opacity: 1 - see }}>
                0円
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 14, fontSize: (c.under ?? "").length > 5 ? 20 : 34, fontWeight: 900, color: K.ink, opacity: see }}>
                {c.under}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, marginTop: 12, opacity: 0.7 }}>CASE #005</div>
          </div>
          <div style={{ padding: "46px 56px", fontFamily: SERIF, color: "#1E2230", backgroundImage: "repeating-linear-gradient(transparent 0 96px, rgba(59,69,86,0.12) 96px 99px)" }}>
            {c.lines.map((l, i) => (
              <div key={i} style={{ fontSize: size, fontWeight: 900, lineHeight: 1.36, whiteSpace: "nowrap", opacity: ease(f, at + 10 + i * 6, at + 22 + i * 6) }}>
                {l}
              </div>
            ))}
            <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 22, fontWeight: 900, letterSpacing: 10, color: K.red }}>KANENAZO</div>
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={at} name="paper" volume={0.6} />
      <Sfx at={at + 12} name="ding" volume={0.45} />
    </>
  );
};

/* ── MONEY FLOW（CASE #005）: 客 → 入口 3 つ → 店 → 運送会社 → 運ぶ人 ───────────────── */
export type FlowState = {
  entries: number; // 入口 3 つ（値段・ライン・会費）
  store: number;
  carrier: number;
  hidden: number; // 運送会社の右の灰色レーン「？」
  driver: number; // 運ぶ人（お金 + 時間）
  timeToYen?: number; // 時間レーンが ¥ に変わる(0..1)
  gain?: number; // 店が受け取るもの（買い物の大きさ・次の買い物）
  handoff?: number; // 受け取りの手間（客側）
};
const Node: React.FC<{ x: number; y: number; label: string; sub?: string; o: number; color?: string; w?: number }> = ({ x, y, label, sub, o, color = K.ink, w = 230 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-w / 2} y={-62} width={w} height={124} rx={22} fill="#FFFFFF" stroke={color} strokeWidth={6} />
    <text y={sub ? -12 : 0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill={color}>
      {label}
    </text>
    {sub && (
      <text y={34} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.inkSoft}>
        {sub}
      </text>
    )}
  </g>
);
const Arrow: React.FC<{ d: string; o: number; color?: string; w?: number; dash?: boolean }> = ({ d, o, color = K.ink, w = 9, dash = true }) => {
  const f = useCurrentFrame();
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? "24 18" : undefined} strokeDashoffset={-f * 3} opacity={o} />;
};
export const MoneyFlow5: React.FC<{ st: FlowState; y?: number }> = ({ st, y = 480 }) => {
  const f = useCurrentFrame();
  const ty = st.timeToYen ?? 0;
  const entries = [
    { label: "値段", color: T.lane.price, dy: -170 },
    { label: "ライン", color: T.lane.line, dy: 0 },
    { label: "会費", color: T.lane.fee, dy: 170 },
  ];
  return (
    <g>
      {/* 客 */}
      <g transform={`translate(160 ${y})`}>
        <circle cy={-40} r={40} fill={K.ink} />
        <path d="M -64 70 C -64 -6 64 -6 64 70 Z" fill={K.ink} />
        <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
          客
        </text>
      </g>
      {(st.handoff ?? 0) > 0 && (
        <g opacity={st.handoff}>
          <rect x={60} y={y + 170} width={200} height={60} rx={30} fill={T.time} />
          <text x={160} y={y + 200} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={26} fill={K.ink}>
            受け取りの手間
          </text>
        </g>
      )}
      {/* 入口 3 つ */}
      {entries.map((e, i) => (
        <g key={i} opacity={st.entries}>
          <Arrow d={`M 240 ${y} C 300 ${y} 300 ${y + e.dy} 360 ${y + e.dy}`} o={1} color={e.color} w={8} />
          <rect x={370} y={y + e.dy - 44} width={200} height={88} rx={44} fill={e.color} />
          <text x={470} y={y + e.dy} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF">
            {e.label}
          </text>
          <Arrow d={`M 580 ${y + e.dy} C 640 ${y + e.dy} 640 ${y} 700 ${y}`} o={1} color={e.color} w={8} />
        </g>
      ))}
      {st.entries <= 0 && <Arrow d={`M 240 ${y} L 700 ${y}`} o={st.store} />}
      {/* 店 */}
      <Node x={820} y={y} label="店" o={st.store} />
      {(st.gain ?? 0) > 0 && (
        <g opacity={st.gain}>
          <path d={`M 820 ${y + 66} L 820 ${y + 150}`} stroke={K.red} strokeWidth={6} />
          <rect x={660} y={y + 150} width={320} height={96} rx={16} fill="#FFF3EF" stroke={K.red} strokeWidth={4} />
          <text x={820} y={y + 184} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill={K.red}>
            買い物の大きさ
          </text>
          <text x={820} y={y + 222} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={28} fill={K.red}>
            次の買い物
          </text>
        </g>
      )}
      {/* 運賃 → 運送会社 */}
      <g opacity={st.carrier}>
        <Arrow d={`M 940 ${y} L 1130 ${y}`} o={1} />
        <text x={1035} y={y - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={K.ink}>
          運賃
        </text>
      </g>
      <Node x={1260} y={y} label="運送会社" o={st.carrier} w={260} />
      {/* 灰色のレーン → 運ぶ人 */}
      <g opacity={Math.max(st.hidden, st.driver)}>
        <Arrow d={`M 1395 ${y} L 1560 ${y}`} o={1} color={st.driver > 0.5 ? K.ink : T.hidden} />
      </g>
      <g opacity={st.hidden * (1 - st.driver)}>
        <circle cx={1700} cy={y} r={92} fill="none" stroke={T.hidden} strokeWidth={6} strokeDasharray="16 12" />
        <text x={1700} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={T.hidden}>
          ？
        </text>
      </g>
      <g opacity={st.driver}>
        <g transform={`translate(1700 ${y - 10})`}>
          <circle cy={-40} r={40} fill={T.night} />
          <path d="M -64 70 C -64 -6 64 -6 64 70 Z" fill={T.night} />
          <rect x={-58} y={-96} width={116} height={26} rx={10} fill={T.night} />
        </g>
        <text x={1700} y={y + 120} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.ink}>
          運ぶ人
        </text>
        {/* お金 + 時間 */}
        <g transform={`translate(1600 ${y - 190})`}>
          <circle r={36} fill="#F4D35E" stroke="#B8902A" strokeWidth={5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#7A5A10">
            ¥
          </text>
        </g>
        <g transform={`translate(1800 ${y - 190})`}>
          <g opacity={1 - ty}>
            <circle r={40} fill="#FFFFFF" stroke={T.time} strokeWidth={8} />
            <line x1={0} y1={0} x2={0} y2={-26} stroke={K.ink} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 6})`} />
          </g>
          <g opacity={ty} transform={`scale(${0.6 + 0.4 * ty})`}>
            <circle r={36} fill="#F4D35E" stroke="#B8902A" strokeWidth={5} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#7A5A10">
              ¥
            </text>
          </g>
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={ty > 0.5 ? K.ink : T.kraftDark}>
            {ty > 0.5 ? "お金" : "時間"}
          </text>
        </g>
      </g>
    </g>
  );
};

/* ── 時計 ───────────────── */
export const Clock: React.FC<{ x: number; y: number; r?: number; speed?: number; color?: string; face?: string }> = ({ x, y, r = 80, speed = 1, color = K.ink, face = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={face} stroke={color} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.7} stroke={color} strokeWidth={4} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={color} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 0.5 * speed})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.75} stroke={K.red} strokeWidth={5} strokeLinecap="round" transform={`rotate(${f * 6 * speed})`} />
      <circle r={8} fill={color} />
    </g>
  );
};

/* ── 人のシルエット（顔なし） ───────────────── */
export const Figure: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number; cap?: boolean }> = ({ x, y, s = 1, color = K.ink, o = 1, cap }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cy={-90} r={40} fill={color} />
    {cap && <rect x={-50} y={-138} width={100} height={24} rx={10} fill={color} />}
    <path d="M -70 60 C -70 -30 70 -30 70 60 Z" fill={color} />
  </g>
);

/* ── 硬貨 ───────────────── */
export const Yen: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 36, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r} fill="#F4D35E" stroke="#B8902A" strokeWidth={r * 0.14} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={r} fill="#7A5A10">
      ¥
    </text>
  </g>
);

/* ── 年表（横） ───────────────── */
export type TLItem = { year: string; text: string; at: number; color?: string; tag?: string };
export const TimelineH: React.FC<{ items: TLItem[]; y?: number; x0?: number; x1?: number; dark?: boolean }> = ({ items, y = 520, x0 = 200, x1 = 1720, dark }) => {
  const f = useCurrentFrame();
  const ink = dark ? "#EAF6FF" : K.ink;
  const n = items.length;
  return (
    <g>
      <line x1={x0 - 60} x2={x1 + 60} y1={y} y2={y} stroke={ink} strokeWidth={6} opacity={0.7} />
      {items.map((it, i) => {
        const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
        const p = pop(f, it.at);
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={Math.min(1, p * 1.4)}>
            <circle r={18 * p} fill={it.color ?? K.red} />
            <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={it.color ?? ink}>
              {it.year}
            </text>
            {it.text.split("\n").map((l, j) => (
              <text key={j} y={80 + j * 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={ink}>
                {l}
              </text>
            ))}
            {it.tag && (
              <g transform={`translate(0 ${80 + it.text.split("\n").length * 50 + 10})`}>
                <rect x={-60} y={-24} width={120} height={44} rx={10} fill="none" stroke={dark ? "#C9D6E6" : K.inkSoft} strokeWidth={3} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={24} fill={dark ? "#C9D6E6" : K.inkSoft}>
                  {it.tag}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export { AbsoluteFill, Easing, useCurrentFrame, fade, pop, ease, Sfx, K, SERIF, FONT };
