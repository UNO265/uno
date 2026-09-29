/**
 * CUT 001–019（J01–J16）。06 DIRECTION 再制作。
 * 画面は語りを書き写さない（06-17）: 文字は数字・単位・出典・短いラベルだけ。例外は最初の答え（J11, C2）と CLUE。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Can, CanClue, Easing, FONT, K, Led, Lock, Machine, Mini, SERIF, Sfx, Street, Truck, V, ease, fade, pop } from "./kit";
import { Cam, Coin8, CoinTrail, DOT_COUNT, DrugStore, JapanMap, Person8, Platform, Sys, along } from "./kit2";

const TITLE_Q = (
  <>
    自販機、<R>なぜ減っても値上げ？</R>
  </>
);
/* 自販機（ホームの 1 台）の位置 */
const MX = 760;
const MY = 790;
const MS = 0.72;
const BTN: [number, number] = [MX - 126 * MS, MY - 405 * MS];

/* CUT 001 — [REAL(再現) / LEVEL 3] J01: 駅のホーム。指が「200」の前でためらい、押す。Close-up → Slow Zoom Out */
const J01 = mk(
  ({ f, s }) => {
    const reach = ease(f, 0, 14, 0, 1, Easing.out(Easing.cubic));
    const press = ease(f, 40, 46);
    const jitter = f > 14 && f < 40 ? Math.sin(f * 0.9) * 4 : 0; // 迷い
    const fx = BTN[0] + 40 + 260 * (1 - reach) - 30 * press + jitter;
    const fy = BTN[1] + 4;
    return (
      <>
        <Stage>
          <Cam keys={[{ at: 0, s: 2.1, x: BTN[0] + 60, y: BTN[1] }, { at: 30, s: 2.1, x: BTN[0] + 60, y: BTN[1] }, { at: s(1) + 10, s: 1, x: 960, y: 540 }]}>
            <Platform />
            <Machine x={MX} y={MY} s={MS} pressed={f > 44 ? 4 : -1} led="200" />
            {/* 指 */}
            <g transform={`translate(${fx} ${fy})`}>
              <rect x={0} y={-16} width={170} height={32} rx={16} fill="#F2C9A8" stroke="#C9926B" strokeWidth={3} />
              <rect x={120} y={-32} width={150} height={64} rx={26} fill="#F2C9A8" stroke="#C9926B" strokeWidth={3} />
            </g>
          </Cam>
          <defs>
            <linearGradient id="topfade8" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1220" stopOpacity={0.92} />
              <stop offset="100%" stopColor="#0B1220" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={1920} height={200} fill="url(#topfade8)" />
        </Stage>
        <Lines dark y={-420} lines={[{ t: TITLE_Q, at: -10, size: 84 }]} />
        <Sfx at={44} name="tok" volume={0.5} />
      </>
    );
  },
  { bg: "night" },
);

/* J02: 硬貨 2 枚が投入口へ（Tracking）→ ボトルが落ちる */
const J02 = mk(({ f }) => {
  const slot: [number, number] = [MX + 105 * MS, MY - 262 * MS];
  const drop = ease(f, 40, 60, 0, 1, Easing.bounce);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: 30, s: 1.25, x: MX + 60, y: MY - 240 }, { at: 70, s: 1.15, x: MX, y: MY - 200 }]}>
          <Platform />
          <Machine x={MX} y={MY} s={MS} pressed={4} led="200" drop={drop} />
          <CoinTrail pts={[[1300, 520], [1050, 560], slot]} at={2} n={2} dur={26} gap={10} r={14} />
        </Cam>
      </Stage>
      <Sfx at={20} name="coin" volume={0.5} />
      <Sfx at={54} name="thud" volume={0.55} />
    </>
  );
}, { bg: "night" });

/* CUT 002 — [IMPACT / LEVEL 4] J03: 1 OBJECT（夜の街の列）+ 1 NUMBER（560万→388万）+ 1 MESSAGE（−170万） */
const J03 = mk(({ f, s }) => {
  const n = 14;
  const on = count(f, s(0) + 16, 90, n, n * 0.69);
  const num = Math.round(count(f, s(0) + 16, 90, 560, 388));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.15, y: 600 }, { at: s(0) + 110, s: 1, y: 540 }]}>
          <Street n={n} on={on} y={820} s={1.15} />
          <text x={960} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={160} fill="#FFFFFF" opacity={fade(f, s(0) + 6)}>
            {num}
            <tspan fontSize={80}>万台</tspan>
          </text>
          <text x={960} y={450} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={V.led} opacity={fade(f, s(0) + 100)}>
            −170万台
          </text>
        </Cam>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(0)} dark />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={s(0) + 24 + i * 20} name="tok" volume={0.25} />
      ))}
    </>
  );
}, { bg: "night" });

/* CUT 003 — [QUESTION / LEVEL 3] J04: 残った 1 台。左は台数↓、右は値段↑ — 矛盾を同時に */
const J04 = mk(({ f }) => {
  const a = ease(f, 4, 30, 0, 1, Easing.out(Easing.cubic));
  const price = f < 30 ? "180" : "200";
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: 90, s: 1.12, y: 560 }]}>
          <Machine x={960} y={1000} s={0.62} lit={0.8} led={price} />
          <g opacity={fade(f, 2)} transform="translate(460 520)">
            {Array.from({ length: 5 }, (_, i) => (
              <Mini key={i} x={-120 + i * 60} y={-140 + 0} s={0.4} lit={i < 5 - Math.round(2 * a) ? 1 : 0.02} />
            ))}
            <path d={`M 0 -60 L 0 ${40 + 120 * a}`} stroke={V.blue} strokeWidth={20} strokeLinecap="round" />
            <path d={`M -40 ${10 + 120 * a} L 0 ${50 + 120 * a} L 40 ${10 + 120 * a}`} stroke={V.blue} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#C9D6E6">
              台数
            </text>
          </g>
          <g opacity={fade(f, 10)} transform="translate(1460 520)">
            <Led x={0} y={-160} text={price} size={60} w={180} />
            <path d={`M 0 ${170} L 0 ${50 - 120 * a}`} stroke={V.led} strokeWidth={20} strokeLinecap="round" />
            <path d={`M -40 ${10 - 120 * a + 80} L 0 ${-30 - 120 * a + 80} L 40 ${10 - 120 * a + 80}`} stroke={V.led} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#C9D6E6">
              値段
            </text>
          </g>
        </Cam>
      </Stage>
      <Sfx at={4} name="question" volume={0.5} />
    </>
  );
}, { bg: "black" });

/* CUT 004 — [QUESTION / LEVEL 2] J05: 時計 2:00 と、ぼやけた −881億円（予告） */
const J05 = mk(({ f, s }) => {
  const clock = ease(f, s(0), s(0) + 30);
  return (
    <>
      <Stage>
        <g transform="translate(960 330)" opacity={fade(f, s(0)) * (1 - 0.6 * fade(f, s(1)))}>
          <circle r={160} fill="none" stroke="#F4EEE3" strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-120} stroke="#F4EEE3" strokeWidth={10} strokeLinecap="round" transform={`rotate(${clock * 360})`} />
          <text y={250} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={80} fill={V.led}>
            2:00
          </text>
        </g>
        <text x={960} y={770} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={V.led} opacity={0.75 * fade(f, s(1) + 20)} style={{ filter: "blur(2px)" }}>
          −881億円
        </text>
      </Stage>
    </>
  );
}, { bg: "black" });

/* CUT 005 — [TITLE / LEVEL 2] J06 */
const J06 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 6, s(1) + 12, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #008</div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            background: V.body,
            borderRadius: 24,
            overflow: "hidden",
            border: `6px solid ${V.band}`,
            transform: `scale(${p})`,
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <div style={{ alignSelf: "stretch", background: V.band, color: "#FFFFFF", writingMode: "vertical-rl", fontSize: 26, fontWeight: 900, letterSpacing: 8, padding: "20px 14px" }}>KANENAZO</div>
          <div style={{ padding: "36px 56px 42px", fontFamily: SERIF, fontSize: 88, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>{TITLE_Q}</div>
          <div style={{ marginRight: 40, background: "#140808", color: V.led, fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 60, fontWeight: 700, padding: "10px 22px", borderRadius: 12, textShadow: "0 0 10px rgba(255,74,61,0.7)" }}>
            008
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.7} />
    </>
  );
}, { bg: "black", noSub: true });

/* CUT 006 — [INFOGRAPHIC / LEVEL 1] J07: 鍵のかかった 2 つ → 統計の報告書と決算書（カメラ固定） */
const Report: React.FC<{ x: number; y: number; label: string; o: number; bars?: boolean }> = ({ x, y, label, o, bars }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-110} y={-140} width={220} height={280} rx={12} fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
    {bars
      ? [0, 1, 2, 3].map((i) => <rect key={i} x={-70 + i * 40} y={60 - (i + 1) * 30} width={26} height={(i + 1) * 30} fill={V.band} />)
      : [0, 1, 2, 3, 4].map((i) => <rect key={i} x={-80} y={-100 + i * 36} width={i % 2 ? 110 : 160} height={14} rx={6} fill="#C9D1DB" />)}
    <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
      {label}
    </text>
  </g>
);
const J07 = mk(({ f, s }) => {
  const box = (x: number, title: string, sub: string, at: number) => (
    <g opacity={fade(f, at)} transform={`translate(${x} 300)`}>
      <rect x={-300} y={-130} width={600} height={260} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={6} />
      <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
        {title}
      </text>
      <text y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
        {sub}
      </text>
      <Lock x={-140} y={60} o={fade(f, at + 14)} />
      <text x={60} y={70} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#9AA3AF" opacity={fade(f, at + 14)}>
        非公表
      </text>
    </g>
  );
  return (
    <>
      <Stage>
        {box(560, "自販機全体の売上", "2017年〜", s(0) + 10)}
        {box(1360, "1台の儲け", "各社", s(1))}
        <Report x={760} y={640} label="業界統計" o={fade(f, s(2))} bars />
        <Report x={1160} y={640} label="決算" o={fade(f, s(2) + 12)} />
        <g opacity={fade(f, s(2) + 24)} transform="translate(1320 560)">
          <circle r={50} fill="none" stroke={K.ink} strokeWidth={12} />
          <line x1={36} y1={36} x2={90} y2={90} stroke={K.ink} strokeWidth={16} strokeLinecap="round" />
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(0)} />
      <Sfx at={s(0) + 24} name="tok" volume={0.5} />
      <Sfx at={s(1) + 14} name="tok" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* CUT 007 — [GRAPH / LEVEL 2] J08: 日本地図の点（1点 = 1万台）。2000年 560 → 2025年 388、飲料 220 を青に */
const J08 = mk(({ f, s }) => {
  const k = ease(f, s(1), s(1) + 90);
  const n = Math.round(560 - (560 - 388) * k);
  const year = Math.round(2000 + 25 * k);
  const blue = Math.round(220 * fade(f, s(2), 20));
  const n0 = f < s(1) ? 388 : n;
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.25, x: 760, y: 470 }, { at: s(1) + 90, s: 1, x: 960, y: 540 }]}>
          <JapanMap x={700} y={470} s={0.95} n={f < s(1) ? Math.round(388 * fade(f, s(0), 30)) : n0} blue={blue} />
        </Cam>
        <g opacity={fade(f, s(0))}>
          <text x={1500} y={300} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={64} fill={K.inkSoft}>
            {f < s(1) ? 2025 : year}
          </text>
          <text x={1500} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={f < s(1) ? V.red : K.ink}>
            {f < s(1) ? 388 : n}
            <tspan fontSize={60}>万台</tspan>
          </text>
          <text x={1500} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            ● = 1万台（※イメージ）
          </text>
        </g>
        <g opacity={fade(f, s(2))}>
          <circle cx={1350} cy={600} r={16} fill={V.blue} />
          <text x={1380} y={612} fontFamily={FONT} fontWeight={900} fontSize={44} fill={V.blue}>
            飲み物 約220万
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会（2025年末）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 008 — [GRAPH / LEVEL 2] J09: 原材料・物流が下から押し上げ、値段の階段を時間順に一段ずつ（Tracking） */
const J09 = mk(({ f, s }) => {
  const steps = [
    { p: 180, d: "〜2025.9", at: s(3) - 10 },
    { p: 200, d: "2025.10〜", at: s(3) + 30 },
    { p: 220, d: "2026.9〜", at: s(4) + 6 },
  ];
  const k = f < s(3) + 30 ? 0 : f < s(4) + 6 ? 1 : 2;
  const push = ease(f, s(1), s(1) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1, y: 560 }, { at: s(3), s: 1.1, x: 900, y: 560 }, { at: s(4) + 20, s: 1.1, x: 1050, y: 470 }]}>
          {/* 押し上げるもの */}
          {["原材料", "容器", "物流"].map((l, i) => (
            <g key={l} opacity={fade(f, s(1) + i * 8)} transform={`translate(${570 + i * 330} ${800 - 40 * push})`}>
              <rect x={-110} y={-40} width={220} height={80} rx={40} fill="#FFFFFF" stroke={K.inkSoft} strokeWidth={4} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
                {l} ↑
              </text>
            </g>
          ))}
          {/* 階段 */}
          {steps.map((st, i) => (
            <g key={i} opacity={fade(f, st.at)}>
              <rect x={420 + i * 330} y={620 - (st.p - 160) * 9} width={300} height={(st.p - 160) * 9} rx={8} fill={i === k ? V.red : "#C9D1DB"} />
              <Led x={570 + i * 330} y={560 - (st.p - 160) * 9} text={`${st.p}`} size={56} w={160} />
              <text x={570 + i * 330} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
                {st.d}
              </text>
            </g>
          ))}
          <Can x={300} y={520} color="#81B29A" s={2.2} bottle />
          <text x={300} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            500ml
          </text>
          <g transform={`translate(300 300) scale(${pop(f, s(2))})`} opacity={fade(f, s(2))}>
            <circle r={46} fill="none" stroke={V.green} strokeWidth={12} />
          </g>
        </Cam>
        <text x={1650} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft} opacity={fade(f, s(5))}>
          希望小売価格・税抜
        </text>
      </Stage>
      <EvidenceMark no="#04" source="各社 価格改定の発表" at={s(3)} />
      <Sfx at={s(3) + 30} name="tok" volume={0.4} />
      <Sfx at={s(4) + 6} name="tok" volume={0.4} />
    </>
  );
}, { bg: "white" });

/* CUT 009 — [STORY / LEVEL 2] J10: 同じボトルがスーパーと自販機に。原材料は両方を押し上げる。視線が行き来して自販機で止まる */
const J10 = mk(({ f, s }) => {
  const up = ease(f, s(0), s(0) + 30);
  const eye = f < s(1) ? 560 + 800 * (0.5 + 0.5 * Math.sin(f / 9)) : interpolateEye(f, s(1));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(2), s: 1.15, x: 1300, y: 520 }]}>
          <g stroke="#C9D6E6" strokeWidth={5} fill="none">
            <rect x={320} y={440} width={480} height={330} />
            <line x1={320} x2={800} y1={550} y2={550} />
            <line x1={320} x2={800} y1={660} y2={660} />
          </g>
          {[0, 1, 2].map((i) => (
            <Can key={i} x={400 + i * 150} y={500} color="#81B29A" s={0.9} bottle />
          ))}
          <g transform={`translate(560 ${600 - 20 * up})`}>
            <rect x={-80} y={-30} width={160} height={60} rx={8} fill="#FFFFFF" />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill={K.ink}>
              ↑
            </text>
          </g>
          <text x={560} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#C9D6E6">
            スーパー
          </text>
          <Machine x={1360} y={820} s={0.5} lit={0.9} led="200" />
          <text x={1360} y={870} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#C9D6E6">
            自販機
          </text>
          {/* 視線 */}
          <g transform={`translate(${eye} 300)`} opacity={fade(f, s(0) + 10)}>
            <ellipse rx={46} ry={26} fill="#FFFFFF" />
            <circle r={16} fill={K.ink} />
          </g>
        </Cam>
      </Stage>
      <Sfx at={s(2)} name="question" volume={0.5} />
    </>
  );
}, { bg: "black" });
function interpolateEye(f: number, at: number) {
  return 1360 - 40 * Math.max(0, 1 - (f - at) / 20);
}

/* CUT 010 — [IMPACT / LEVEL 4] J11: 画面を空けて 1 台だけ。本数ゲージが下がり、費用ブロックは動かない（BGM なし） */
const J11 = mk(({ f, s }) => {
  const sales = ease(f, s(1) + 10, s(1) + 60, 1, 0.45, Easing.inOut(Easing.cubic));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 0.95, y: 600 }, { at: s(1) + 40, s: 1.05, y: 640 }]}>
          <Sys x={960} y={1010} s={0.9} sales={sales} coins={sales} />
        </Cam>
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 50, fontFamily: SERIF }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: K.inkSoft, opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 62, fontWeight: 900, color: K.ink, marginTop: 6, opacity: fade(f, s(1)), textAlign: "center", lineHeight: 1.35 }}>
          1台が売る<R c={V.blue}>本数は減っている</R>のに、
          <br />
          1台を動かす<R>費用は減らない</R>。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "white", noSub: true });

/* CUT 011 — [GRAPH / LEVEL 2] J12: 稼働台数 247万→204万（2 点だけ、途中は描かない）→ 線の先の 1 台に Close-up、箱 207ケースが 10 年で −8% */
const J12 = mk(({ f, s }) => {
  const draw = ease(f, s(0) + 10, s(0) + 60);
  const x0 = 220;
  const x1 = 820;
  const y0 = 700 - 247 * 1.6;
  const y1 = 700 - 204 * 1.6;
  const boxes = count(f, s(2), 40, 10, 9.2);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1) - 10, s: 1 }, { at: s(1) + 20, s: 1.15, x: 1300, y: 520 }]}>
          <line x1={180} x2={900} y1={700} y2={700} stroke={K.ink} strokeWidth={5} />
          <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * draw} y2={y0 + (y1 - y0) * draw} stroke={V.band} strokeWidth={10} strokeLinecap="round" />
          <circle cx={x0} cy={y0} r={14} fill={V.band} opacity={fade(f, s(0) + 10)} />
          <circle cx={x1} cy={y1} r={14} fill={V.band} opacity={fade(f, s(0) + 60)} />
          <text x={x0} y={y0 - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={K.inkSoft} opacity={fade(f, s(0) + 10)}>
            247万
          </text>
          <text x={x1} y={y1 - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={V.band} opacity={fade(f, s(0) + 60)}>
            204万台
          </text>
          <text x={x0} y={748} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            2014
          </text>
          <text x={x1} y={748} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            2024
          </text>
          {/* 1 台と箱 */}
          <g opacity={fade(f, s(1))}>
            <Mini x={1080} y={680} s={2} />
            {Array.from({ length: 10 }, (_, i) => {
              const part = Math.max(0, Math.min(1, boxes - i));
              return (
                <g key={i}>
                  <rect x={1200 + (i % 5) * 100} y={420 + Math.floor(i / 5) * 100} width={86} height={86} rx={8} fill="#EEE8DC" stroke="#8C6E3F" strokeWidth={3} />
                  <rect x={1200 + (i % 5) * 100} y={420 + Math.floor(i / 5) * 100 + 86 * (1 - part)} width={86} height={86 * part} rx={8} fill="#C9A46A" />
                </g>
              );
            })}
            <text x={1440} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.ink}>
              207<tspan fontSize={30}>ケース/年</tspan>
            </text>
            <text x={1440} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={V.red} opacity={fade(f, s(2))}>
              10年で −8%
            </text>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#02" source="飲料総研" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 012 — [GRAPH / LEVEL 2] J13: ボトル 100 本。1995 の自販機色 48 本 → 2024 は 23 本、抜けたボトルは右へ（他の売り場） */
const J13 = mk(({ f, s }) => {
  const k = ease(f, s(2), s(2) + 40);
  const vend = Math.round(48 - 25 * k);
  const year = f < s(2) ? 1995 : Math.round(1995 + 29 * k);
  return (
    <>
      <Stage>
        <g transform="translate(300 200)" opacity={fade(f, s(0))}>
          {Array.from({ length: 100 }, (_, i) => {
            const isV = i < 48;
            const leaving = isV && i >= vend;
            const dx = leaving ? 700 * k : 0;
            return <Can key={i} x={(i % 10) * 62 + dx} y={Math.floor(i / 10) * 58} color={isV && !leaving ? V.band : "#C9D1DB"} s={0.5} bottle o={leaving ? 1 - 0.6 * k : 1} />;
          })}
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1450} y={330} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={64} fill={K.inkSoft}>
            {year}
          </text>
          <text x={1450} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={V.band}>
            {f < s(2) ? 48 : vend}
            <tspan fontSize={70}>%</tspan>
          </text>
          <text x={1450} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            清涼飲料のうち自販機
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#03" source="日本経済新聞（業界統計）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 013 — [REAL(再現) / LEVEL 2] J13B: Pattern Interrupt。夜の地図にコンビニの灯りが広がる（Top View → Zoom Out） */
const J13B = mk(({ f, s }) => {
  const spread = ease(f, s(1), s(1) + 60);
  const pts = Array.from({ length: 48 }, (_, i) => [200 + ((i * 373) % 1520), 160 + ((i * 211) % 560)]);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.3, x: 960, y: 420 }, { at: s(1) + 60, s: 1, x: 960, y: 540 }]}>
          <g opacity={fade(f, s(0))} stroke="#2E3C57" strokeWidth={10}>
            {[260, 460, 660].map((y) => (
              <line key={y} x1={80} x2={1840} y1={y} y2={y} />
            ))}
            {[300, 700, 1100, 1500].map((x) => (
              <line key={x} x1={x} x2={x} y1={100} y2={760} />
            ))}
          </g>
          {[[500, 360], [1300, 560], [900, 200]].map(([x, y], i) => (
            <Mini key={i} x={x} y={y + 40} s={0.45} />
          ))}
          {pts.map(([x, y], i) => (
            <g key={i} opacity={i / pts.length < spread ? 1 : 0}>
              <circle cx={x} cy={y} r={30} fill="#FFE08A" opacity={0.18} />
              <rect x={x - 16} y={y - 12} width={32} height={24} rx={4} fill="#FFE08A" />
            </g>
          ))}
        </Cam>
        <g opacity={fade(f, s(1))}>
          <rect x={660} y={780} width={600} height={70} rx={35} fill="rgba(13,22,40,0.85)" />
          <text x={960} y={826} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFE08A">
            コンビニ 約5万6,000店
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#05" source="日本フランチャイズチェーン協会（2025年）" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 014 — [STORY / LEVEL 3] J13C: ホームの人々。急ぐ人はすぐ買う（便利さ）/ 次の人は 200円を見てためらい、ドラッグストアへ / 来る人の数が減る（イメージ） */
const Quote: React.FC<{ x: number; y: number; t: string; at: number; f: number; bad?: boolean }> = ({ x, y, t, at, f, bad }) => (
  <g transform={`translate(${x} ${y}) scale(${pop(f, at)})`} opacity={fade(f, at)}>
    <rect x={-250} y={-34} width={500} height={68} rx={12} fill="#FFFFFF" stroke={bad ? V.red : V.band} strokeWidth={4} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={30} fill={bad ? V.red : K.ink}>
      「{t}」
    </text>
  </g>
);
const J13C = mk(({ f, s }) => {
  // 1 人目: 走ってきてすぐ買う
  const a = ease(f, s(0), s(0) + 40);
  const aLeave = ease(f, s(1) + 60, s(1) + 110);
  const p1x = 1700 - 900 * a - 1200 * aLeave;
  // 2 人目: 来て、止まって、ドラッグストアへ
  const b = ease(f, s(3) - 20, s(3) + 30);
  const bGo = ease(f, s(4), s(4) + 90);
  const p2x = 1800 - 950 * b + 620 * bGo;
  const visitors = Math.round(count(f, s(4), 120, 5, 2));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3), s: 1.12, x: 900, y: 560 }, { at: s(4) + 40, s: 1, x: 960, y: 540 }]}>
          <Platform />
          <Machine x={MX} y={MY} s={MS} led="200" drop={f > s(0) + 44 && f < s(0) + 74 ? (f - s(0) - 44) / 30 : 0} />
          <DrugStore x={1640} y={790} s={0.7} o={fade(f, s(3))} />
          <Person8 x={p1x} y={MY} s={1} color="#F2CC8F" step={f / 3} o={1 - aLeave} />
          {a > 0.9 && aLeave < 0.1 && (
            <g transform={`translate(${p1x} ${MY - 300})`}>
              <circle r={26} fill="none" stroke="#FFD66E" strokeWidth={6} />
              <line x1={0} y1={0} x2={0} y2={-16} stroke="#FFD66E" strokeWidth={6} />
              <line x1={0} y1={0} x2={12} y2={0} stroke="#FFD66E" strokeWidth={6} />
            </g>
          )}
          <Person8 x={p2x} y={MY} s={1} color="#98C1D9" step={b < 1 || bGo > 0 ? f / 3 : 0} o={fade(f, s(3) - 20)} bag={bGo > 0.95} />
          {b > 0.95 && bGo < 0.05 && (
            <g transform={`translate(${p2x} ${MY - 290})`}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={-24 + i * 24} r={7} fill="#FFFFFF" opacity={0.3 + 0.7 * ((Math.floor(f / 8) % 3) === i ? 1 : 0)} />
              ))}
            </g>
          )}
        </Cam>
        <Quote x={1360} y={170} t="時間を気にせず買える" at={s(1) + 10} f={f} />
        <Quote x={1360} y={250} t="手間がかからない" at={s(1) + 30} f={f} />
        <Quote x={1360} y={330} t="お店に行かなくていい" at={s(1) + 50} f={f} />
        <Quote x={1360} y={430} t="お店より高いので、あまり買わない" at={s(3)} f={f} bad />
        <g opacity={fade(f, s(4))} transform="translate(260 200)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#C9D6E6">
            自販機に寄る人
          </text>
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={-80 + i * 40} cy={50} r={14} fill={i < visitors ? "#C9D6E6" : "#2A3446"} />
          ))}
          <text y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#9AA3AF">
            ※イメージ
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#22" source="クロス・マーケティング「自動販売機に関する調査」（2022年）" at={s(1)} dark />
    </>
  );
}, { bg: "night" });

/* CUT 015 — [INFOGRAPHIC(BLUEPRINT) / LEVEL 2] J14: 設計図の自販機に費用が 3 つぶら下がる。補充のトラックを Tracking */
const J14 = mk(({ f, s }) => {
  const route: [number, number][] = [[120, 860], [420, 800], [760, 860], [1100, 800], [1440, 860], [1800, 800]];
  const t = ((f - s(1)) % 180) / 180;
  const [tx, ty] = along(route, Math.max(0, t));
  const hang = (i: number, at: number, label: string, sub: string, color: string) => {
    const p = ease(f, at, at + 18, 0, 1, Easing.out(Easing.back(1.4)));
    return (
      <g opacity={fade(f, at)} transform={`translate(${1060} ${230 + i * 190})`}>
        <line x1={-420} y1={0} x2={-40 * p} y2={0} stroke={color} strokeWidth={4} strokeDasharray="10 8" />
        <rect x={0} y={-64} width={700} height={128} rx={16} fill="rgba(16,41,74,0.9)" stroke={color} strokeWidth={5} />
        <text x={32} y={-10} fontFamily={FONT} fontWeight={900} fontSize={46} fill="#FFFFFF">
          {label}
        </text>
        <text x={32} y={38} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#BFE3FF">
          {sub}
        </text>
      </g>
    );
  };
  return (
    <>
      <Stage>
        <g stroke="#8FD3FF" strokeWidth={4} fill="none" opacity={fade(f, s(0))}>
          <rect x={300} y={150} width={340} height={580} rx={16} />
          <rect x={328} y={186} width={284} height={260} rx={6} />
          <rect x={328} y={470} width={284} height={110} rx={6} />
          <rect x={348} y={620} width={244} height={64} rx={8} />
        </g>
        {hang(0, s(1), "補充", "1日20〜30台・1人で150台ほど（という）", "#8FD3FF")}
        {hang(1, s(3), "場所代", "売上の2〜3割（と言われる）", "#FFD66E")}
        {hang(2, s(5), "機械・点検・修理", "", "#E0564E")}
        <g opacity={fade(f, s(1))}>
          <path d={`M ${route.map((p) => p.join(" ")).join(" L ")}`} stroke="#8FD3FF" strokeWidth={3} strokeDasharray="12 10" fill="none" opacity={0.6} />
          {route.map(([x, y], i) => (
            <Mini key={i} x={x} y={y - 18} s={0.28} lit={1} />
          ))}
          <Truck x={tx} y={ty} s={0.5} color="#3C8DBC" />
        </g>
      </Stage>
      <EvidenceMark no={f < s(3) ? "#06" : "#07"} source="業界の解説" at={s(1)} dark />
    </>
  );
}, { bg: "blueprint" });

/* CUT 016 — [IMPACT / LEVEL 4] J14B: 4万台・96億 → 1 台に Zoom In → 年24万 → 月約2万 → 1日約660円 → 「？」で静止 */
const J14B = mk(({ f, s }) => {
  const zoom = ease(f, s(3) - 10, s(3) + 30);
  const conv = [
    { t: "年 約24万円", at: s(3) },
    { t: "月 約2万円", at: s(3) + 45 },
    { t: "1日 約660円", at: s(4) },
  ];
  const cur = f < conv[1].at ? 0 : f < conv[2].at ? 1 : 2;
  return (
    <>
      <Stage>
        {/* 4万台の格子 */}
        <g opacity={fade(f, s(2)) * (1 - zoom)}>
          {Array.from({ length: 400 }, (_, i) => (
            <rect key={i} x={560 + (i % 25) * 32} y={220 + Math.floor(i / 25) * 32} width={24} height={24} rx={4} fill={i === 212 ? V.band : "#C9D1DB"} />
          ))}
          <text x={960} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            ■ = 100台（約4万台）
          </text>
        </g>
        {/* 1 台 */}
        <g opacity={zoom}>
          <Machine x={620} y={820} s={0.62} led="---" />
          {conv.map((c, i) => (
            <text
              key={i}
              x={1320}
              y={i === cur ? 470 : 470 - (cur - i) * 110}
              textAnchor="middle"
              fontFamily={FONT}
              fontWeight={900}
              fontSize={i === cur ? 110 : 48}
              fill={i === cur ? V.red : "#9AA3AF"}
              opacity={f >= c.at ? (i <= cur ? 1 : 0) : 0}
            >
              {c.t}
            </text>
          ))}
          <text x={1320} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={K.inkSoft}>
            ※売上÷台数の計算（売上であって利益ではない）
          </text>
          <g opacity={fade(f, s(5))} transform="translate(1320 650)">
            <rect x={-260} y={-40} width={520} height={80} rx={16} fill="#F2F4F7" />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.ink}>
              ダイドー（2021年）1日 約930円
            </text>
          </g>
          <g transform={`translate(880 420) scale(${pop(f, s(6))})`} opacity={fade(f, s(6))}>
            <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={900} fontSize={180} fill={K.ink}>
              ?
            </text>
          </g>
          {[0, 1, 2].map((i) => (
            <Coin8 key={i} x={560 + i * 44} y={860} r={18} o={fade(f, s(4))} />
          ))}
        </g>
        <g opacity={fade(f, s(2)) * (1 - zoom)} transform="translate(120 170)">
          <text fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.ink}>
            ポッカサッポロ 自販機事業
          </text>
          <text y={56} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            約4万台 / 売上 96億3,900万円
          </text>
        </g>
      </Stage>
      <EvidenceMark no={f < s(5) ? "#08" : "#09"} source={f < s(5) ? "ポッカサッポロ 発表（2026年3月）" : "ITmedia（2021年）"} at={s(2)} />
      <Sfx at={s(4)} name="coin" volume={0.45} />
    </>
  );
}, { bg: "white" });

/* CUT 017 — [MONEY FLOW / LEVEL 3] J14C: 660円の硬貨が自販機から出て 4 方向に分かれる（Tracking）→ 手元にほとんど残らない */
const J14C = mk(({ f, s }) => {
  const src: [number, number] = [470, 560];
  const dests = [
    { l: "場所の持ち主", x: 1200, y: 230, c: "#C98A2B", at: s(0) + 20 },
    { l: "補充の人件費", x: 1500, y: 420, c: V.blue, at: s(0) + 55 },
    { l: "飲み物の原価", x: 1500, y: 620, c: "#7A8699", at: s(0) + 90 },
    { l: "機械", x: 1200, y: 790, c: V.red, at: s(1) },
  ];
  const left = 8 - dests.filter((d) => f > d.at + 30).length * 2;
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 700, y: 540 }, { at: s(0) + 90, s: 1, x: 960, y: 540 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
          <Machine x={470} y={840} s={0.55} led="---" />
          {Array.from({ length: 8 }, (_, i) => (
            <Coin8 key={i} x={380 + (i % 4) * 44} y={890 + Math.floor(i / 4) * 0} r={18} o={i < left ? 1 : 0.1} />
          ))}
          {dests.map((d, i) => (
            <g key={i}>
              <g opacity={fade(f, d.at - 10)} transform={`translate(${d.x} ${d.y})`}>
                <rect x={-190} y={-50} width={380} height={100} rx={20} fill="#FFFFFF" stroke={d.c} strokeWidth={6} />
                <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={38} fill={d.c}>
                  {d.l}
                </text>
              </g>
              <CoinTrail pts={[src, [(src[0] + d.x) / 2, (src[1] + d.y) / 2 - 40], [d.x - 200, d.y]]} at={d.at} n={2} dur={30} gap={8} r={16} stay />
            </g>
          ))}
          <g opacity={fade(f, s(1))} transform="translate(470 250)">
            <rect x={-170} y={-44} width={340} height={88} rx={14} fill="#FFFFFF" stroke={V.red} strokeWidth={5} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={36} fill={V.red}>
              70万〜150万円
            </text>
          </g>
          <text x={470} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(1))}>
            新品1台（と言われる）
          </text>
        </Cam>
        <text x={1860} y={880} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={22} fill={K.inkSoft}>
          ※分け方はイメージ
        </text>
      </Stage>
      <EvidenceMark no="#10" source="業界の解説" at={s(1)} />
      {dests.map((d, i) => (
        <Sfx key={i} at={d.at + 30} name="coin" volume={0.3} />
      ))}
    </>
  );
}, { bg: "white" });

/* CUT 018 — [SIMULATION / LEVEL 3] J15: 固定費をボトルで分けて背負う。8 本 → 4 本で 1 本の重さが倍 / スーパーは特売、自販機は定価のまま → 値上げがそのまま通る */
const J15 = mk(({ f, s }) => {
  const n = Math.round(count(f, s(1), 40, 8, 4));
  const w = 520 / n;
  const pass = ease(f, s(4), s(4) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 40, s: 1.12, x: 600, y: 560 }, { at: s(2), s: 1, x: 960, y: 540 }]}>
          <g transform="translate(560 700)">
            <rect x={-300} y={-420} width={600} height={100} rx={14} fill={V.red} opacity={fade(f, s(0))} />
            <text y={-370} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#FFFFFF" opacity={fade(f, s(0))}>
              1台の費用
            </text>
            {Array.from({ length: n }, (_, i) => {
              const x = -260 + (i * 520) / Math.max(1, n - 1);
              return (
                <g key={i}>
                  <rect x={x - w * 0.35} y={-300} width={w * 0.7} height={30 + 240 / n} rx={6} fill={V.red} opacity={0.35} />
                  <Can x={x} y={-80} color="#81B29A" s={1.1} bottle />
                </g>
              );
            })}
          </g>
          <g opacity={fade(f, s(2))} transform="translate(1420 420)">
            <rect x={-300} y={-230} width={600} height={500} rx={24} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
            <text x={-150} y={-160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.inkSoft}>
              スーパー
            </text>
            <text x={150} y={-160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={V.band}>
              自販機
            </text>
            <g transform={`translate(-150 ${-40 + 40 * fade(f, s(2) + 10)})`}>
              <rect x={-100} y={-34} width={200} height={68} rx={10} fill={V.red} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#FFFFFF">
                特売 ↓
              </text>
            </g>
            <Led x={150} y={-20} text={pass > 0.5 ? "220" : "200"} size={60} w={180} o={fade(f, s(3))} />
            <path d={`M 150 ${200} L 150 ${200 - 150 * pass}`} stroke={V.red} strokeWidth={14} strokeLinecap="round" opacity={pass} />
            <text x={150} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={V.red} opacity={pass}>
              原材料 ↑
            </text>
          </g>
        </Cam>
      </Stage>
    </>
  );
}, { bg: "paper" });

/* CUT 019 — [CLUE / LEVEL 3] J16 */
const J16 = mk(({ s }) => <CanClue no="01" at={s(0) + 8} />, { bg: "paper", noSub: true });

export const OPEN8 = { J01, J02, J03, J04, J05, J06, J07, J08, J09, J10, J11, J12, J13, J13B, J13C, J14, J14B, J14C, J15, J16 };
export { DOT_COUNT, Mini };
