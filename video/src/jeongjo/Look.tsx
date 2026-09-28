/**
 * 정조 편 오프닝 룩 테스트 — 영화형 연출(편지가 주인공인 밤).
 * 2.35:1 레터박스, 카메라 이동·초점 이동, 촛불(따뜻함)↔달빛(차가움) 색 대비, 먼지·필름 입자, 손 대신 그림자.
 * 자막은 아래 검은 띠 안에 한 줄(문장부호 없음). 인용문은 화면에 크게.
 */
import "@fontsource/noto-serif-kr/400.css";
import "@fontsource/noto-serif-kr/600.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/liu-jian-mao-cao/400.css";
import "@fontsource/zhi-mang-xing/400.css";
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/jeongjo_look/timeline.json";

const FPS = 30;
const W = 1920;
const H = 1080;
const BAR = 132;
const SERIF = "'Noto Serif KR', serif";
const SANS = "'Noto Sans KR', sans-serif";
const INK = "#17110C";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

type Word = { text: string; start: number; end: number };
type Sent = { text: string; start: number; end: number; voice: string; words: Word[]; cards: { start: number; end: number; text: string }[] };
const SENTS = timeline.sentences as Sent[];
export const totalLook = timeline.totalFrames;
const fr = (s: number) => Math.round(s * FPS);
const S0 = (i: number) => fr(SENTS[i].start);
const E0 = (i: number) => fr(SENTS[i].end);

/* 장면 경계(프레임) */
const A_END = S0(1) - 8;
const B_END = S0(3) - 6;
const C_END = S0(4) - 6;
const BLACK = S0(5) - 36;
const E_START = S0(5) - 3;

/* ── 도구 ───────── */
const rand = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** 초서 글씨 줄(편지 질감용). 실제 정조 편지 글이 아니라 천자문 글자를 초서체로 쓴 것 */
const CHARS = "天地玄宇宙洪荒日月盈昃辰宿列寒暑往秋收冬藏成律致雨露霜金生水玉出巨珠夜光果珍李柰菜重芥海河淡羽翔火帝官人皇始制文字乃服衣裳推位有虞陶唐民伐罪周殷坐朝道垂拱平章育黎首臣伏戎羌遐壹率王在白食化被草木及方此身四大五常恭惟鞠敢女慕男效才良知必改得能莫忘罔彼短靡恃己信使可覆器欲量墨悲染羔羊景行克念作德建名立形端表正空谷堂因福善尺璧非寸是父事君曰敬孝竭力忠命深履薄夙似斯馨如松之盛川流不息澄取映容止若思言安定";
const Strokes: React.FC<{ w: number; h: number; cols?: number; seed?: number; color?: string; size?: number }> = ({ w, h, cols = 7, seed = 7, color = INK, size }) => {
  const colW = (w - 150) / cols;
  const fs = size ?? colW * 0.78;
  const per = Math.floor((h - 170) / (fs * 0.92));
  const r = useMemo(() => rand(seed), [seed]);
  const cols_ = useMemo(() => {
    const out: { x: number; chars: { c: string; o: number; dx: number; s: number }[]; len: number }[] = [];
    let k = Math.floor(r() * 200);
    for (let c = 0; c < cols; c++) {
      const len = c === cols - 1 ? Math.floor(per * 0.55) : per - Math.floor(r() * 3);
      const chars = [];
      let ink = 1;
      for (let i = 0; i < len; i++) {
        if (r() < 0.18) ink = 1; // 붓에 먹을 다시 묻힘
        ink = Math.max(0.55, ink - 0.06);
        chars.push({ c: CHARS[k++ % CHARS.length], o: ink, dx: (r() - 0.5) * fs * 0.18, s: 0.85 + r() * 0.3 });
      }
      out.push({ x: w - 80 - c * colW - colW / 2, chars, len });
    }
    return out;
  }, [w, h, cols, per, fs, r]);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {cols_.map((col, ci) =>
        col.chars.map((ch, i) => (
          <div key={`${ci}-${i}`} style={{ position: "absolute", left: col.x - fs / 2 + ch.dx, top: 80 + i * fs * 0.92, width: fs, textAlign: "center", fontFamily: "'Liu Jian Mao Cao', cursive", fontSize: fs * ch.s, lineHeight: 1, color, opacity: ch.o }}>
            {ch.c}
          </div>
        )),
      )}
      {/* 왼쪽 끝: 받은 날짜를 적은 작은 글씨(심환지의 표시) */}
      {[...Array(5)].map((_, i) => (
        <div key={`d${i}`} style={{ position: "absolute", left: 34, top: 110 + i * fs * 0.5, fontFamily: "'Zhi Mang Xing', cursive", fontSize: fs * 0.42, color: "#5A3A28", opacity: 0.75 }}>
          {"日月初十五"[i]}
        </div>
      ))}
    </div>
  );
};

const Paper: React.FC<{ w: number; h: number; tint?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, tint = "#E7DABD", children, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: tint, overflow: "hidden", ...style }}>
    <Img src={staticFile("sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, mixBlendMode: "multiply" }} />
    {children}
  </div>
);

/** 떠다니는 먼지 */
const Dust: React.FC<{ n?: number; color: string; seed?: number; area?: [number, number, number, number] }> = ({ n = 40, color, seed = 3, area = [0, 0, W, H] }) => {
  const f = useCurrentFrame();
  const ps = useMemo(() => {
    const r = rand(seed);
    return [...Array(n)].map(() => ({ x: r(), y: r(), s: 1 + r() * 3, v: 0.2 + r() * 0.6, ph: r() * 6 }));
  }, [n, seed]);
  const [x0, y0, aw, ah] = area;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {ps.map((p, i) => {
        const x = x0 + ((p.x * aw + Math.sin(f * 0.02 + p.ph) * 30) % aw);
        const y = y0 + ((((p.y * ah - f * p.v) % ah) + ah) % ah);
        return <circle key={i} cx={x} cy={y} r={p.s} fill={color} opacity={0.25 + 0.35 * Math.abs(Math.sin(f * 0.05 + p.ph))} />;
      })}
    </svg>
  );
};

const flick = (f: number) => 1 + 0.05 * Math.sin(f * 0.83) + 0.035 * Math.sin(f * 2.1 + 1) + 0.02 * Math.sin(f * 5.3);

/** 촛불 불꽃(가까이서 보는 크기까지) */
const Flame: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = 1 }) => {
  const f = useCurrentFrame();
  const k = flick(f);
  const sway = 3 * Math.sin(f * 0.31) + 1.5 * Math.sin(f * 0.9);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id={`fg${x}${y}`}>
          <stop offset="0%" stopColor="#FFD58A" stopOpacity={0.55} />
          <stop offset="40%" stopColor="#F29B3A" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#F29B3A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={lit}>
        <circle cx={0} cy={-40} r={260 * k} fill={`url(#fg${x}${y})`} />
        <g transform={`translate(${sway} 0) scale(1 ${k})`}>
          <path d="M 0 -95 C 22 -55 24 -18 0 0 C -24 -18 -22 -55 0 -95 Z" fill="#F7A640" opacity={0.9} />
          <path d="M 0 -70 C 12 -44 13 -16 0 -4 C -13 -16 -12 -44 0 -70 Z" fill="#FFE7B0" />
          <ellipse cx={0} cy={-6} rx={5} ry={9} fill="#6A4CFF" opacity={0.35} />
        </g>
        <line x1={0} y1={0} x2={0} y2={10} stroke="#221A12" strokeWidth={3} />
        <rect x={-26} y={10} width={52} height={260} rx={5} fill="#EFE3CB" />
        <rect x={-26} y={10} width={52} height={260} rx={5} fill="url(#fg0)" opacity={0.2} />
      </g>
    </svg>
  );
};

/* ── 장면 A: 암전 속 촛불, 접힌 편지가 펼쳐지고 인용문 ───────── */
const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const light = ease(f, 0, 30);
  const open = ease(f, 26, 72, 0, 1, Easing.inOut(Easing.quad));
  const dolly = 1.12 + 0.1 * ease(f, 0, A_END, 0, 1, Easing.linear);
  const q = S0(0);
  const dim = ease(f, q - 10, q + 10);
  const words = SENTS[0].words;
  return (
    <AbsoluteFill style={{ background: "#050403" }}>
      <AbsoluteFill style={{ perspective: 1700, transform: `scale(${dolly})`, opacity: light }}>
        <div style={{ position: "absolute", left: W / 2 - 380, top: 110, width: 760, height: 1000, transformStyle: "preserve-3d", transform: "rotateX(34deg) rotateZ(-3deg)" }}>
          <Paper w={760} h={500} style={{ top: 500 }}>
            <div style={{ position: "absolute", top: -500, width: 760, height: 1000 }}>
              <Strokes w={760} h={1000} seed={11} />
            </div>
          </Paper>
          <div style={{ position: "absolute", top: 0, width: 760, height: 500, transformOrigin: "50% 100%", transformStyle: "preserve-3d", transform: `rotateX(${-178 * (1 - open)}deg)` }}>
            <Paper w={760} h={500} style={{ backfaceVisibility: "hidden" }}>
              <Strokes w={760} h={1000} seed={11} />
            </Paper>
            <Paper w={760} h={500} tint="#D9CBAD" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} />
          </div>
          <div style={{ position: "absolute", top: 496, width: 760, height: 8, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.25), rgba(0,0,0,0))", opacity: open }} />
        </div>
      </AbsoluteFill>
      {/* 촛불 빛: 오른쪽 위에서 떨어지는 따뜻한 빛 + 어둠 */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 78% 22%, rgba(255,190,110,${0.28 * flick(f) * light}) 0%, rgba(0,0,0,0) 45%), radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(5,4,3,0.92) 85%)` }} />
      <Dust n={36} color="#FFD9A0" seed={5} area={[900, 120, 1000, 800]} />
      {/* 인용문 */}
      <AbsoluteFill style={{ background: `rgba(6,5,4,${0.74 * dim})` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 66, color: "#F2E6CC", lineHeight: 1.55, textAlign: "center", maxWidth: 1200, textShadow: "0 0 24px rgba(255,190,110,0.35)" }}>
          {words.map((w, i) => {
            const a = fr(w.start) - 3;
            const p = ease(f, a, a + 12);
            return (
              <React.Fragment key={i}>
                {i === 3 && <br />}
                <span style={{ opacity: p, filter: `blur(${(1 - p) * 8}px)`, display: "inline-block", marginRight: 18 }}>{w.text}</span>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 34, fontFamily: SERIF, fontSize: 28, color: "#B9A57F", letterSpacing: 6, opacity: ease(f, E0(0) - 20, E0(0)) }}>정조의 편지 · 1798년</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── 장면 B: 창호지 문에 비친 그림자, 서안 위 편지 ───────── */
const SceneB: React.FC = () => {
  const f = useCurrentFrame(); // A_END 기준
  const t = f + A_END;
  const k = flick(t);
  const push = 1 + 0.07 * ease(f, 0, B_END - A_END, 0, 1, Easing.linear);
  const name = S0(2) - A_END;
  return (
    <AbsoluteFill style={{ background: "#090705", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "62% 60%" }}>
        {/* 창호지 문(뒤, 초점 밖) */}
        <div style={{ position: "absolute", left: 120, top: 150, width: 860, height: 640, filter: "blur(3px)" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 85% 70%, rgba(236,200,140,${0.5 * k}) 0%, rgba(120,90,55,0.25) 55%, rgba(30,22,15,0.6) 100%)` }} />
          <svg width={860} height={640} style={{ position: "absolute", inset: 0 }}>
            {/* 벽에 비친 앉은 사람의 그림자(탕건) */}
            <g transform={`translate(${470 + 4 * Math.sin(t * 0.05)} 640) scale(${1.02 + 0.02 * (k - 1) * 10} 1)`} opacity={0.72}>
              <path d="M -170 0 C -170 -120 -120 -200 -60 -230 L 60 -230 C 120 -200 170 -120 170 0 Z" fill="#1A120B" />
              <ellipse cx={0} cy={-290} rx={56} ry={66} fill="#1A120B" />
              <path d="M -52 -330 C -50 -380 50 -380 52 -330 Z" fill="#1A120B" />
            </g>
            {[...Array(9)].map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 86} y1={0} x2={(i + 1) * 86} y2={640} stroke="#2A1D12" strokeWidth={7} />
            ))}
            {[...Array(6)].map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i + 1) * 92} x2={860} y2={(i + 1) * 92} stroke="#2A1D12" strokeWidth={7} />
            ))}
            <rect x={0} y={0} width={860} height={640} fill="none" stroke="#1C140C" strokeWidth={26} />
          </svg>
        </div>
        {/* 바닥 */}
        <div style={{ position: "absolute", left: 0, top: 780, width: W, height: 400, background: "linear-gradient(#1B130C, #0A0705)" }} />
        {/* 서안(낮은 책상) + 편지 + 촛불 */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <path d="M 1000 700 L 1760 700 L 1840 800 L 920 800 Z" fill="#3A2616" />
          <path d="M 920 800 L 1840 800 L 1840 826 L 920 826 Z" fill="#24170D" />
          <rect x={960} y={826} width={26} height={150} fill="#1C120A" />
          <rect x={1780} y={826} width={26} height={150} fill="#1C120A" />
          <g transform="translate(1180 718) skewX(-18) rotate(-4)">
            <rect x={0} y={0} width={300} height={70} fill="#E3D4B3" />
            {[...Array(9)].map((_, i) => (
              <line key={i} x1={280 - i * 30} y1={8} x2={276 - i * 30} y2={60} stroke={INK} strokeWidth={3} opacity={0.7} />
            ))}
          </g>
        </svg>
        <Flame x={1640} y={640} s={0.62} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 82% 55%, rgba(255,180,100,${0.16 * k}) 0%, rgba(0,0,0,0) 40%), radial-gradient(ellipse at 55% 55%, rgba(0,0,0,0) 35%, rgba(4,3,2,0.85) 90%)` }} />
      <Dust n={30} color="#FFD9A0" seed={9} area={[1100, 200, 800, 700]} />
      {/* 이름 */}
      <div style={{ position: "absolute", left: 1180, top: 250, opacity: ease(f, name, name + 14), transform: `translateY(${(1 - ease(f, name, name + 20)) * 16}px)` }}>
        <div style={{ fontFamily: SERIF, fontSize: 30, color: "#B9A57F", letterSpacing: 8 }}>받는 사람</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: "#F2E6CC", letterSpacing: 10, marginTop: 6 }}>
          심환지 <span style={{ fontWeight: 400, fontSize: 44, color: "#CDB98F", letterSpacing: 6 }}>沈煥之</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 장면 C: 편지 글씨 위를 흐르는 카메라, 초점 이동 ───────── */
const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  const dur = C_END - B_END;
  const x = interpolate(f, [0, dur], [-120, -980], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const blur = interpolate(f, [0, 18, dur - 14, dur], [6, 0, 0, 2], clamp);
  const t = f + B_END;
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: x, top: -420, transform: "scale(2.3) rotate(-2deg)", transformOrigin: "0 0", filter: `blur(${blur}px)` }}>
        <Paper w={760} h={1000}>
          <Strokes w={760} h={1000} seed={11} />
        </Paper>
      </div>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${70 - 30 * (f / dur)}% 40%, rgba(255,190,110,${0.22 * flick(t)}) 0%, rgba(0,0,0,0) 50%), linear-gradient(90deg, rgba(5,4,3,0.85), rgba(5,4,3,0) 30%, rgba(5,4,3,0) 70%, rgba(5,4,3,0.8))` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(4,3,2,0.8) 95%)" }} />
    </AbsoluteFill>
  );
};

/* ── 장면 D: 촛불로 다가가는 편지 모서리 ───────── */
const SceneD: React.FC = () => {
  const f = useCurrentFrame();
  const stop = fr(SENTS[4].words.find((w) => w.text.startsWith("없애"))?.start ?? SENTS[4].start) - C_END;
  const p = ease(f, 0, stop + 10, 0, 1, Easing.out(Easing.cubic));
  const heat = ease(f, stop - 6, stop + 20);
  return (
    <AbsoluteFill style={{ background: "#040302", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -900 + 1060 * p, top: 360, transform: "rotate(-14deg)", transformOrigin: "100% 0", filter: "blur(1.2px)" }}>
        <Paper w={900} h={520}>
          <div style={{ position: "absolute", top: -200 }}>
            <Strokes w={900} h={900} seed={4} cols={8} />
          </div>
          <div style={{ position: "absolute", right: 0, top: 0, width: 260, height: 520, background: `linear-gradient(90deg, rgba(255,150,60,0), rgba(255,140,50,${0.55 * heat}))` }} />
        </Paper>
      </div>
      <Flame x={1260} y={600} s={2.4} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 64% 45%, rgba(0,0,0,0) 25%, rgba(3,2,1,0.9) 80%)" }} />
      <Dust n={24} color="#FFC98A" seed={12} area={[900, 150, 700, 600]} />
    </AbsoluteFill>
  );
};

/* ── 장면 E: 달빛 아래 문갑 속에 남은 편지 + 제목 ───────── */
const SceneE: React.FC = () => {
  const f = useCurrentFrame();
  const dur = totalLook - E_START;
  const title = E0(5) + 6 - E_START;
  const push = 1.04 - 0.04 * ease(f, 0, dur, 0, 1, Easing.linear);
  const reveal = ease(f, 0, 30);
  const out = ease(f, dur - 16, dur);
  return (
    <AbsoluteFill style={{ background: "#05070B", overflow: "hidden", opacity: 1 - out }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, opacity: reveal }}>
        {/* 문갑(위에서 본 열린 서랍) */}
        <div style={{ position: "absolute", left: 560, top: 250, width: 800, height: 560, background: "#1D140D", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
          <div style={{ position: "absolute", inset: 34, background: "#120C08" }} />
          <Paper w={620} h={400} tint="#C9C4B6" style={{ left: 92, top: 82, transform: "rotate(-3deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            <Strokes w={620} h={400} seed={21} cols={6} />
            <div style={{ position: "absolute", top: 196, width: 620, height: 6, background: "rgba(0,0,0,0.18)" }} />
          </Paper>
        </div>
        {/* 창살 달빛 */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", filter: "blur(6px)", opacity: 0.8 }}>
          <defs>
            <linearGradient id="moon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9FB6D6" stopOpacity={0.34} />
              <stop offset="100%" stopColor="#9FB6D6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <g transform="skewX(-22) translate(560 120)">
            {[0, 1, 2].map((c) =>
              [0, 1, 2, 3].map((r) => <rect key={`${c}${r}`} x={c * 190} y={r * 190} width={170} height={170} fill="url(#moon)" />),
            )}
          </g>
        </svg>
        <Dust n={40} color="#C9D8EE" seed={17} area={[500, 100, 1000, 800]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0) 30%, rgba(2,3,6,0.9) 90%)" }} />
      <AbsoluteFill style={{ background: `rgba(3,4,7,${0.8 * ease(f, title - 6, title + 20)})` }} />
      {/* 제목 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: ease(f, title, title + 20) }}>
        <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 60, color: "#DDE6F1", letterSpacing: 12, filter: `blur(${(1 - ease(f, title, title + 20)) * 6}px)` }}>정조가 없애라던 편지</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 170, color: "#F1F5FA", letterSpacing: 8, marginTop: 4, textShadow: "0 0 40px rgba(160,190,230,0.45)", opacity: ease(f, title + 14, title + 34), filter: `blur(${(1 - ease(f, title + 14, title + 34)) * 8}px)` }}>
          297<span style={{ fontSize: 90 }}>통</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── 전체 화면 위: 필름 입자·레터박스·자막 ───────── */
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 97} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

const Bars: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cards = SENTS.slice(1).flatMap((s) => s.cards);
  const c = cards.find((c, k) => t >= c.start - 0.05 && t < Math.min((cards[k + 1]?.start ?? c.end + 0.6) - 0.02, c.end + 0.6));
  const o = c ? ease(f, fr(c.start) - 3, fr(c.start) + 3) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BAR, background: "#000" }}>
        <div style={{ position: "absolute", right: 60, top: 54, fontFamily: SANS, fontSize: 22, color: "#6E6558", letterSpacing: 4 }}>재구성 화면</div>
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: BAR, background: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {c && (
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 48, color: "#EDE6D8", letterSpacing: "-0.01em", opacity: o }}>{c.text}</div>
        )}
      </div>
    </>
  );
};

const Cross: React.FC<{ from: number; to: number; fadeIn?: number; fadeOut?: number; children: React.ReactNode }> = ({ from, to, fadeIn = 12, fadeOut = 12, children }) => {
  const f = useCurrentFrame();
  const len = to - from;
  const o = (fadeIn ? interpolate(f, [0, fadeIn], [0, 1], clamp) : 1) * (fadeOut ? interpolate(f, [len - fadeOut, len], [1, 0], clamp) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const text = JSON.stringify(SENTS) + "받는사람심환지沈煥之정조의편지1798년재구성화면가없애라던297통";
    const fonts = ["400 40px 'Noto Serif KR'", "600 40px 'Noto Serif KR'", "500 40px 'Noto Sans KR'"].map((s) => document.fonts.load(s, text));
    fonts.push(document.fonts.load("400 40px 'Liu Jian Mao Cao'", CHARS), document.fonts.load("400 40px 'Zhi Mang Xing'", "日月初十五"));
    Promise.all(fonts)
      .then(() => document.fonts.ready)
      .then(() => continueRender(h));
  }, [h]);
};

export const JeongjoLook: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={A_END + 12}>
        <Cross from={0} to={A_END + 12} fadeIn={0}>
          <SceneA />
        </Cross>
      </Sequence>
      <Sequence from={A_END} durationInFrames={B_END - A_END + 12}>
        <Cross from={A_END} to={B_END + 12}>
          <SceneB />
        </Cross>
      </Sequence>
      <Sequence from={B_END} durationInFrames={C_END - B_END + 12}>
        <Cross from={B_END} to={C_END + 12}>
          <SceneC />
        </Cross>
      </Sequence>
      <Sequence from={C_END} durationInFrames={BLACK - C_END}>
        <Cross from={C_END} to={BLACK} fadeOut={0}>
          <SceneD />
        </Cross>
      </Sequence>
      <Sequence from={E_START} durationInFrames={totalLook - E_START}>
        <Cross from={E_START} to={totalLook} fadeIn={20} fadeOut={0}>
          <SceneE />
        </Cross>
      </Sequence>
      <Grain />
      <Bars />
      {SENTS.map((s, i) => (
        <Sequence key={i} from={fr(s.start)} layout="none">
          <Audio src={staticFile(s.voice)} />
        </Sequence>
      ))}
      <Audio src={staticFile("jeongjo_look/bed.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
