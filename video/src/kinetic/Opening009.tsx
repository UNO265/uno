/**
 * #009 導入（D01〜D06・36 秒）を 3D キネティック・タイポで。カメラが奥へ飛びながら場面がつながる。
 * 内容は確定台本のまま（C6）。13.2% と各部門の伸びは JACDS 2024 年度（research R2）。
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import tl from "../../public/case009/timeline.json";
import { BEAT, Blob, C, Caption, F, Hud, beatPulse, clamp, k, out, pop, useFonts } from "./kit";
import { At, Cam, Ex, Prism, Txt, World } from "./three";

type Cut = (typeof tl.cuts)[number];
const cut = (id: string) => tl.cuts.find((c) => c.id === id) as Cut;
const seg = (id: string, i: number) => Math.round(cut(id).from + cut(id).segments[i].start * 30);
const segEnd = (id: string, i: number) => Math.round(cut(id).from + cut(id).segments[i].end * 30);
/** 文の中の語が読まれる時刻（文字数で按分） */
const wt = (id: string, i: number, word: string) => {
  const s = cut(id).segments[i];
  const idx = s.text.indexOf(word);
  return Math.round(cut(id).from + (s.start + ((s.end - s.start) * Math.max(0, idx)) / s.text.length) * 30);
};
export const TOTAL009 = cut("D06").from + cut("D06").duration;

/* ── カメラの道（場面ごとに奥の Z へ） ───────────────── */
const Z = { s1: 0, s2: -2600, s3: -5200, s4: -8200, s5: -11000, s6: -13800 };
const KEYS: { at: number; cam: Cam }[] = [
  { at: 0, cam: { x: -60, y: 20, z: 300, rx: 0, ry: -6 } },
  { at: 120, cam: { x: 40, y: 0, z: 120, rx: 0, ry: 5 } },
  { at: cut("D02").from, cam: { x: 0, y: 0, z: Z.s2 + 200, rx: 0, ry: 0 } },
  { at: cut("D02").from + 100, cam: { x: 0, y: -40, z: Z.s2 + 60, rx: 4, ry: -8, rz: -2 } },
  { at: cut("D03").from, cam: { x: 0, y: -260, z: Z.s3 + 900, rx: -28, ry: 0 } },
  { at: seg("D03", 1) - 4, cam: { x: 0, y: -120, z: Z.s3 + 500, rx: -14, ry: 0 } },
  { at: seg("D03", 2), cam: { x: 120, y: 0, z: Z.s3 + 200, rx: 0, ry: 10 } },
  { at: cut("D03").from + cut("D03").duration - 10, cam: { x: 200, y: 20, z: Z.s3 + 120, rx: 2, ry: 18 } },
  { at: cut("D04").from + 8, cam: { x: 0, y: 0, z: Z.s4 + 300, rx: 0, ry: 0 } },
  { at: cut("D05").from, cam: { x: 0, y: 0, z: Z.s4 + 150, rx: 0, ry: 0 } },
  { at: cut("D05").from + 18, cam: { x: -80, y: 0, z: Z.s5 + 260, rx: 0, ry: -12 } },
  { at: seg("D05", 1) + 50, cam: { x: 60, y: 30, z: Z.s5 + 140, rx: 4, ry: 10 } },
  { at: cut("D06").from + 6, cam: { x: 0, y: 0, z: Z.s6 + 700, rx: 0, ry: 0 } },
  { at: TOTAL009, cam: { x: 0, y: 0, z: Z.s6 + 420, rx: 0, ry: 0 } },
];
const camAt = (f: number): Cam => {
  let i = 0;
  for (let j = 0; j < KEYS.length - 1; j++) if (f >= KEYS[j].at) i = j;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const span = Math.max(1, b.at - a.at);
  // 区間の大半はゆっくり漂い（18%）、次の鍵の直前 20 フレームで素早く移る（カメラは鍵の時刻にちょうど着く）
  const fast = Math.min(20, span);
  const t1 = span - fast >= 1 ? interpolate(f - a.at, [0, span - fast], [0, 0.18], clamp) : 0.18;
  const t2 = interpolate(f - a.at, [span - fast, span], [0, 0.82], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const t = Math.min(1, t1 + t2);
  const L = (p: number, q: number) => p + (q - p) * t;
  return { x: L(a.cam.x, b.cam.x), y: L(a.cam.y, b.cam.y), z: L(a.cam.z, b.cam.z), rx: L(a.cam.rx, b.cam.rx), ry: L(a.cam.ry, b.cam.ry), rz: L(a.cam.rz ?? 0, b.cam.rz ?? 0) };
};

/** 場面の表示範囲（カメラが通り過ぎたら消す） */
const live = (f: number, a: number, b: number, fade = 8) => interpolate(f, [a - fade, a, b, b + fade], [0, 1, 1, 0], clamp);

/* ── 小物 ───────────────── */
const Egg: React.FC = () => (
  <svg width={180} height={220} viewBox="0 0 180 220">
    <ellipse cx={90} cy={120} rx={74} ry={96} fill="#fbf3e4" />
    <ellipse cx={64} cy={86} rx={18} ry={26} fill="#fff" opacity={0.7} />
  </svg>
);
const Milk: React.FC = () => (
  <svg width={180} height={300} viewBox="0 0 180 300">
    <path d="M30 70 L90 20 L150 70 L150 290 L30 290 Z" fill="#f4f1ea" />
    <path d="M30 70 L90 20 L150 70 Z" fill="#d9d4c8" />
    <rect x={30} y={140} width={120} height={80} fill={C.bl} />
    <text x={90} y={194} textAnchor="middle" fontFamily={F.en} fontSize={44} fill="#fff">MILK</text>
  </svg>
);
const Basket: React.FC = () => (
  <svg width={560} height={340} viewBox="0 0 560 340">
    <path d="M20 90 L540 90 L490 320 L70 320 Z" fill={C.or} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={90 + i * 68} y={140} width={34} height={140} rx={8} fill="#c43d0e" />)}
    <path d="M150 90 Q280 -40 410 90" fill="none" stroke={C.or} strokeWidth={22} />
  </svg>
);

/* ── 本体 ───────────────── */
export const Opening009: React.FC<{ audio?: boolean }> = ({ audio = true }) => {
  useFonts();
  const f = useCurrentFrame();
  const cam = camAt(f);
  const bp = beatPulse(f);
  const d2 = cut("D02").from, d3 = cut("D03").from, d4 = cut("D04").from, d5 = cut("D05").from, d6 = cut("D06").from;

  // 字幕（全文）
  let cap = "";
  for (const c of tl.cuts) {
    if (c.from >= TOTAL009) break;
    c.segments.forEach((s) => {
      if (f >= c.from + s.start * 30 - 2 && f < c.from + c.duration) cap = s.text;
    });
  }
  const scene = f < d2 ? 1 : f < d3 ? 2 : f < d4 ? 3 : f < d5 ? 4 : f < d6 ? 5 : 6;
  const white = f >= seg("D03", 1) - 2 && f < seg("D03", 2) - 4; // 「食品だ。」で反転
  const bg = white ? C.ink : C.bg;

  // 13.2% のカウントアップ
  const pct = interpolate(f, [wt("D03", 2, "13.2"), wt("D03", 2, "13.2") + 24], [0, 13.2], clamp);
  const bars = [
    { k: "フーズ", v: 13.2, hot: true },
    { k: "ビューティ", v: 11.7 },
    { k: "調剤・ヘルス", v: 8.7 },
    { k: "ホーム", v: 2.1 },
  ];

  return (
    <AbsoluteFill style={{ background: bg }}>
      <World cam={cam}>
        {/* 背景のブロブ（奥の板にばらまいて視差を出す） */}
        {[...Array(14)].map((_, i) => {
          const z = 200 - i * 1100;
          const side = i % 2 ? 1 : -1;
          const x = side * (720 + ((i * 233) % 520));
          const y = ((i * 419) % 1100) - 550;
          // カメラのすぐ前に来たら消す（画面を覆わない）
          const ahead = cam.z - z;
          const o = interpolate(ahead, [-200, 500, 900], [0, 0, 0.9], clamp);
          return (
            <At key={i} x={x} y={y} z={z} o={o}>
              <svg width={420} height={420} viewBox="-210 -210 420 420" style={{ overflow: "visible" }}>
                <Blob x={0} y={0} r={90 + (i % 4) * 30 + bp * 8} f={f} seed={i} color={i % 5 === 2 ? C.or : C.bl} />
              </svg>
            </At>
          );
        })}

        {/* S1 風邪薬 → カゴに卵と牛乳 */}
        <At z={Z.s1} o={live(f, 0, d2 - 6)}>
          <div />
        </At>
        {f < d2 + 10 && (
          <>
            <At x={-300} y={-170} z={Z.s1} o={live(f, wt("D01", 0, "風邪薬"), d2 - 4)} s={pop(f, wt("D01", 0, "風邪薬"))}>
              <div style={{ background: C.ink, padding: "10px 34px" }}>
                <Txt text="風邪薬" size={150} color={C.bg} />
              </div>
            </At>
            <At x={-300} y={20} z={Z.s1 + 40} o={out(f, wt("D01", 0, "を買い"), 8)}>
              <Txt text="を買いに来たはずが、" size={54} font={F.jpb} />
            </At>
            <At x={420} y={120} z={Z.s1 - 200} ry={-18} o={out(f, seg("D01", 1) - 4, 10)} s={0.6 + 0.4 * out(f, seg("D01", 1) - 4, 12)}>
              <Basket />
            </At>
            <At x={330} y={-60 - 260 * out(f, wt("D01", 1, "卵"), 12)} z={Z.s1 - 120 + 200 * out(f, wt("D01", 1, "卵"), 12)} rz={-12} o={f >= wt("D01", 1, "卵") ? 1 : 0}>
              <Egg />
            </At>
            <At x={540} y={-100 - 240 * out(f, wt("D01", 1, "牛乳"), 12)} z={Z.s1 - 140 + 220 * out(f, wt("D01", 1, "牛乳"), 12)} rz={10} o={f >= wt("D01", 1, "牛乳") ? 1 : 0}>
              <Milk />
            </At>
            <At x={420} y={-330} z={Z.s1 - 40} o={out(f, wt("D01", 1, "卵"), 8)}>
              <Txt text={<>卵<span style={{ color: C.or }}>と</span>牛乳</>} size={96} />
            </At>
          </>
        )}

        {/* S2 安いから、つい、ここで買ってしまう */}
        {f > d2 - 30 && f < d3 + 20 && (
          <>
            <At x={0} y={-60} z={Z.s2} ry={interpolate(f, [wt("D02", 0, "安い"), wt("D02", 0, "安い") + 18], [-70, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) })} o={f >= wt("D02", 0, "安い") ? live(f, d2, d3 - 4) : 0}>
              <Ex text="安いから、" size={215} color={C.ink} side="#5a5650" depth={60} />
            </At>
            <At x={-420} y={210} z={Z.s2 + 260 - 300 * out(f, wt("D02", 0, "つい"), 14)} rz={-6} o={f >= wt("D02", 0, "つい") ? live(f, d2, d3 - 4) : 0}>
              <Txt text="つい、" size={120} font={F.jp} color={C.or} italic />
            </At>
            <At x={330} y={170} z={Z.s2 + 80} o={out(f, wt("D02", 0, "ここで"), 8) * live(f, d2, d3 - 4)}>
              <div style={{ background: C.ink, padding: "6px 22px" }}>
                <Txt text="ここで買ってしまう。" size={64} color={C.bg} font={F.jpb} />
              </div>
            </At>
          </>
        )}

        {/* S3 床一面の「薬」→ 立ち上がる「食品だ。」→ 3D 棒グラフ */}
        {f > d3 - 30 && f < d4 + 20 && (
          <>
            {/* 床: 薬の文字のタイル */}
            <At x={0} y={260} z={Z.s3} rx={90} o={live(f, d3, d4 - 4)}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 220px)", gap: 0, opacity: 0.85 }}>
                {Array.from({ length: 54 }, (_, i) => (
                  <div key={i} style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.jp, fontSize: 150, color: i % 7 === 3 ? C.or : "#2b2b2e" }}>
                    薬
                  </div>
                ))}
              </div>
            </At>
            <At x={0} y={-330} z={Z.s3 + 300} o={out(f, d3 + 10, 8) * (f < seg("D03", 1) - 2 ? 1 : 0)}>
              <Txt text={<>いちばん<span style={{ color: C.or }}>伸びている</span>のは、</>} size={72} font={F.jpb} />
            </At>
            <At x={0} y={-120} z={Z.s3 + 300} o={f >= wt("D03", 0, "薬では") && f < seg("D03", 1) - 2 ? 1 : 0} s={pop(f, wt("D03", 0, "薬では"))}>
              <div style={{ position: "relative" }}>
                <Txt text="薬" size={300} />
                <div style={{ position: "absolute", left: -40, right: -40, top: 150, height: 26, background: C.or, transform: `scaleX(${out(f, wt("D03", 0, "ではない"), 8)}) rotate(-8deg)`, transformOrigin: "left" }} />
              </div>
            </At>
            {/* 食品だ。（白背景で黒の立体文字） */}
            <At x={0} y={-60} z={Z.s3 + 160} rx={interpolate(f, [seg("D03", 1) - 2, seg("D03", 1) + 14], [-80, 0], { ...clamp, easing: Easing.out(Easing.back(1.6)) })} o={f >= seg("D03", 1) - 2 && f < seg("D03", 2) - 4 ? 1 : 0}>
              <Ex text="食品だ。" size={330} color={C.bg} side="#b9b4aa" depth={70} />
            </At>
            {/* 3D 棒グラフ */}
            {f >= seg("D03", 2) - 4 &&
              bars.map((b, i) => {
                const h = (b.v / 13.2) * 520 * out(f, seg("D03", 2) + i * 4, 18);
                return (
                  <At key={b.k} x={-480 + i * 320} y={320 - h / 2} z={Z.s3 + 40} ry={-24}>
                    <div style={{ position: "relative" }}>
                      <Prism w={170} h={Math.max(2, h)} d={120} color={b.hot ? C.or : "#3a3a40"} dark={b.hot ? "#b23c10" : "#232327"} top={b.hot ? "#ff8a5c" : "#55555c"} />
                      <div style={{ position: "absolute", top: h + 24, width: 240, left: -35, textAlign: "center", fontFamily: F.jpb, fontSize: 34, color: b.hot ? C.or : C.gray }}>{b.k}</div>
                      <div style={{ position: "absolute", top: -84, width: 240, left: -35, textAlign: "center", fontFamily: F.en, fontSize: 64, color: b.hot ? C.or : C.ink, opacity: out(f, seg("D03", 2) + 14 + i * 4, 8) }}>+{b.v}%</div>
                    </div>
                  </At>
                );
              })}
            {f >= wt("D03", 2, "13.2") && (
              <At x={-430} y={-370} z={Z.s3 + 160} ry={-10}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <Ex text={`+${pct.toFixed(1)}%`} size={170} font={F.en} color={C.or} side="#7a2a0a" depth={40} />
                  <Txt text="1年で" size={48} font={F.jpb} />
                </div>
              </At>
            )}
            {f >= seg("D03", 2) && (
              <At x={0} y={470} z={Z.s3 + 60} o={0.8}>
                <Txt text="出典：日本チェーンドラッグストア協会 実態調査（2024年度・部門別の伸び率）" size={22} font={F.jpb} color={C.gray} />
              </At>
            )}
          </>
        )}

        {/* S4 回るドラムに問い */}
        {f > d4 - 30 && f < d5 + 20 && (
          <>
            <At x={0} y={-40} z={Z.s4 - 1500} ry={interpolate(f, [d4, d5], [62, -8], { ...clamp, easing: Easing.out(Easing.cubic) })} o={live(f, d4, d5 - 2)}>
              <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
                {"薬屋なのに、なぜ食品が安い？".split("").map((ch, i, arr) => {
                  const step = 7.2;
                  const a = (i - (arr.length - 1) / 2) * step;
                  const shown = f >= wt("D04", 0, "薬屋") + i * 2.2;
                  const hot = "食品安い".includes(ch);
                  return (
                    <div key={i} style={{ position: "absolute", left: -90, top: -100, width: 180, textAlign: "center", transform: `rotateY(${a}deg) translateZ(1250px)`, fontFamily: F.jp, fontSize: 150, color: hot ? C.or : C.ink, opacity: shown ? 1 : 0, backfaceVisibility: "hidden" }}>
                      {ch}
                    </div>
                  );
                })}
              </div>
            </At>
            {[{ y: -380, r: -6, s: 7 }, { y: 400, r: 5, s: -6 }].map((m, i) => (
              <At key={i} x={0} y={m.y} z={Z.s4 - 100 - i * 200} rz={m.r} o={live(f, d4 + 6, d5 - 2)}>
                <div style={{ width: 3400, overflow: "hidden", background: i ? C.ink : C.or, padding: "6px 0" }}>
                  <div style={{ fontFamily: F.en, fontSize: 64, color: C.bg, whiteSpace: "nowrap", transform: `translateX(${((f * m.s) % 700) - 700}px)`, letterSpacing: 2 }}>
                    {Array(10).fill("WHY CHEAP?  ✦  なぜ安い？  ✦  ").join("")}
                  </div>
                </div>
              </At>
            ))}
          </>
        )}

        {/* S5 答えは 2 分 → 10兆円 → 三つの財布 */}
        {f > d5 - 30 && f < d6 + 20 && (
          <>
            <At x={-420} y={-300} z={Z.s5 + 120} o={live(f, d5 + 4, seg("D05", 1) + 4)}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Txt text="答えは" size={64} font={F.jpb} />
                <div style={{ fontFamily: F.mono, fontSize: 120, color: C.or, border: `6px solid ${C.or}`, padding: "0 20px" }}>
                  {`0${Math.max(0, 1 - Math.floor((f - d5) / 60)) + 1}:00`.slice(-5)}
                </div>
                <Txt text="で出る。" size={64} font={F.jpb} />
              </div>
            </At>
            {/* 10兆円: 奥に同じ言葉を敷き詰めた壁 */}
            {f >= wt("D05", 1, "10兆円") - 6 && (
              <>
                <At x={0} y={0} z={Z.s5 - 500} o={0.9 * live(f, wt("D05", 1, "10兆円") - 6, d6 - 2)}>
                  <div style={{ fontFamily: F.jp, fontSize: 150, lineHeight: 1, color: "#1c1c20", width: 3600 }}>
                    {Array.from({ length: 6 }, (_, r) => (
                      <div key={r} style={{ whiteSpace: "nowrap", transform: `translateX(${(r % 2 ? 1 : -1) * ((f * 4) % 600)}px)` }}>
                        {"10兆円 ドラッグストア 10兆円 ドラッグストア ".repeat(3)}
                      </div>
                    ))}
                  </div>
                </At>
                <At x={0} y={-80} z={Z.s5 + 60} ry={interpolate(f, [wt("D05", 1, "10兆円") - 6, wt("D05", 1, "10兆円") + 14], [40, 0], { ...clamp, easing: Easing.out(Easing.back(1.3)) })} o={f < wt("D05", 1, "三つ目") - 2 ? 1 : 0}>
                  <Ex text="10兆円" size={300} color={C.ink} side="#6a655d" depth={70} />
                </At>
              </>
            )}
            {f >= wt("D05", 1, "三つ目") - 2 &&
              [0, 1, 2].map((i) => {
                const a = wt("D05", 1, "三つ目") - 2 + i * 6;
                const flip = i === 2 ? interpolate(f, [a + 14, a + 30], [180, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) }) : 0;
                return (
                  <At key={i} x={-420 + i * 420} y={-40 + (1 - out(f, a, 12)) * 500} z={Z.s5 + 80} ry={-18 + i * 18 + flip} rz={(i - 1) * 4} o={f >= a ? 1 : 0}>
                    <div style={{ width: 320, height: 420, borderRadius: 26, background: i === 2 ? C.or : "#26262b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px rgba(0,0,0,.5)", backfaceVisibility: "hidden" }}>
                      <div style={{ fontFamily: F.mono, fontSize: 26, color: i === 2 ? C.bg : C.gray, letterSpacing: 3 }}>WALLET 0{i + 1}</div>
                      <div style={{ fontFamily: i === 2 ? F.en : F.jp, fontSize: i === 2 ? 220 : 90, color: i === 2 ? C.bg : C.ink, marginTop: 10 }}>{i === 2 ? "?" : ["財布", "財布"][i]}</div>
                    </div>
                  </At>
                );
              })}
          </>
        )}

        {/* S6 タイトル */}
        {f > d6 - 30 && (
          <>
            <At x={0} y={-250} z={Z.s6 + 40} o={out(f, seg("D06", 0), 8)}>
              <Txt text="今日のカネナゾは――" size={56} font={F.jpb} color={C.gray} />
            </At>
            <At x={0} y={-60} z={Z.s6} rx={interpolate(f, [seg("D06", 1) - 4, seg("D06", 1) + 14], [70, 0], { ...clamp, easing: Easing.out(Easing.back(1.3)) })} o={f >= seg("D06", 1) - 4 ? 1 : 0}>
              <Ex text="ドラッグストア、" size={170} color={C.ink} side="#5a5650" depth={44} />
            </At>
            <At x={0} y={150} z={Z.s6 + 30} o={f >= wt("D06", 1, "なぜ") ? 1 : 0} s={pop(f, wt("D06", 1, "なぜ"))}>
              <div style={{ background: C.or, padding: "8px 40px" }}>
                <Txt text="なぜ食品が安い？" size={150} color={C.bg} />
              </div>
            </At>
            <At x={0} y={330} z={Z.s6 + 60} o={out(f, wt("D06", 1, "なぜ") + 10, 10)}>
              <Txt text={<span style={{ fontFamily: F.it, fontStyle: "italic" }}>the third wallet</span>} size={60} color={C.ink} />
            </At>
          </>
        )}
      </World>

      {/* 前面の 2D: 拍で光る縁・計器・字幕 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={20} y={20} width={1880} height={1040} fill="none" stroke={white ? C.bg : C.ink} strokeOpacity={0.08 + bp * 0.12} strokeWidth={2} />
        <Hud f={f} scene={1} total={6} dark={!white} />
        <Caption text={cap} dark={!white} />
      </svg>

      {audio && tl.cuts
        .filter((c) => c.from < TOTAL009)
        .map((c) => (
          <Sequence key={c.id} from={c.from} durationInFrames={c.duration}>
            <Audio src={staticFile(c.voice)} />
          </Sequence>
        ))}
      {audio && <Audio src={staticFile("case009/music/c9_03_shop.wav")} volume={(fr) => 0.2 * interpolate(fr, [0, 10, TOTAL009 - 25, TOTAL009], [0.4, 1, 1, 0], clamp)} />}
    </AbsoluteFill>
  );
};
void BEAT;
void k;
