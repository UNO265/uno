/**
 * 세종 쇼츠 1 「87세까지 퇴사 못 한 황희」 (1080×1920)
 * 다음 영상 지침(docs/sejong/next-video-guide.md) 적용: 큰 그림·큰 글자, 정교한 실루엣, 문장부호 없는 한 줄 우선 자막 + 핵심어 강조,
 * 강조 장면에만 효과음, 흐름에 따라 BGM 전환. 마지막 컷은 첫 화면(한지)으로 돌아가며 끝나 반복 재생이 이어진다.
 */
import "@fontsource/gowun-batang/400.css";
import "@fontsource/gowun-batang/700.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/noto-sans-kr/900.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/sejong_short1/timeline.json";
import cueList from "../../public/sejong_short1/music/cues.json";
import { Candle, S, SERIF, Seal, clamp, ease } from "../sejong/ui";

const FPS = 30;
const SANS = "'Noto Sans KR', sans-serif";
type Part = [string, boolean];
type Card = { start: number; end: number; lines: Part[][][] };
type Word = { text: string; start: number; end: number };
type Sent = { text: string; start: number; end: number; voice: string; words: Word[]; cards: Card[] };
type Cut = { id: string; scene: string; p?: any; sentences: Sent[]; from: number; duration: number };
type P = { cut: Cut };

export const cutsShort = timeline.cuts as unknown as Cut[];
export const totalShort = timeline.totalFrames;

/* ── 시간 도우미: 컷 안에서의 프레임 ───────── */
const fr = (s: number) => Math.round(s * FPS);
const sentAt = (c: Cut, i: number) => fr(c.sentences[Math.min(i, c.sentences.length - 1)].start);
const sentEnd = (c: Cut, i: number) => fr(c.sentences[Math.min(i, c.sentences.length - 1)].end);
const wordAt = (c: Cut, text: string) => {
  for (const s of c.sentences) for (const w of s.words) if (w.text.includes(text)) return fr(w.start);
  return 0;
};

/* ── 바탕·무대 ───────── */
const Ground: React.FC<{ dark?: boolean; zoom?: number; children?: React.ReactNode }> = ({ dark, zoom = 0.05, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: dark ? S.dark : S.paper, overflow: "hidden" }}>
      <Img src={staticFile(dark ? "sejong/meok.png" : "sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + zoom * Math.min(1, f / 240)})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    {children}
  </svg>
);
const Pop: React.FC<{ from: number; children: React.ReactNode; x?: number; y?: number; s0?: number }> = ({ from, children, x = 540, y = 960, s0 = 1.35 }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const p = ease(f, from, from + 8, 0, 1, Easing.out(Easing.back(2.2)));
  const sc = s0 - (s0 - 1) * p;
  return <g transform={`translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})`} opacity={Math.min(1, p * 1.5)}>{children}</g>;
};
const Fade: React.FC<{ from: number; to?: number; dy?: number; children: React.ReactNode }> = ({ from, to, dy = 30, children }) => {
  const f = useCurrentFrame();
  const a = from <= 0 ? from - 6 : from;
  const p = ease(f, a, a + 10) * (to === undefined ? 1 : 1 - ease(f, to, to + 8));
  return <g opacity={p} transform={`translate(0 ${(1 - ease(f, a, a + 10)) * dy})`}>{children}</g>;
};
const Txt: React.FC<{ x?: number; y: number; size: number; color?: string; serif?: boolean; w?: number; children: React.ReactNode; ls?: number }> = ({
  x = 540, y, size, color = S.ink, serif, w = 700, children, ls = 0,
}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={serif ? SERIF : SANS} fontWeight={w} fontSize={size} fill={color} letterSpacing={ls}>
    {children}
  </text>
);

/* ── 사직서 한 장 ───────── */
const Letter: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; title?: string }> = ({ x, y, w = 430, h = 560, rot = -3, title = "사직서" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} fill="rgba(0,0,0,0.18)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#F7F1E4" stroke={S.ink2} strokeWidth={3} />
    <rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h - 36} fill="none" stroke={S.line} strokeWidth={2} />
    {[...Array(6)].map((_, i) => (
      <line key={i} x1={-w / 2 + 50 + i * 44} y1={-h / 2 + 60} x2={-w / 2 + 50 + i * 44} y2={h / 2 - 60} stroke={S.line} strokeWidth={2} />
    ))}
    {title.split("").map((ch, i) => (
      <text key={i} x={w / 2 - 80} y={-h / 2 + 120 + i * 110} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={96} fill={S.ink}>
        {ch}
      </text>
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-w / 2 + 70 + i * 60} y={-h / 2 + 80} width={10} height={h - 220 - i * 50} rx={5} fill={S.mute} opacity={0.55} />
    ))}
  </g>
);

/* ── 정교한 실루엣: 사모·단령 관복의 늙은 재상(앞모습) ───────── */
const Minister: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const breath = 1 + 0.008 * Math.sin(f * 0.12);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* 단령 관복: 넓은 어깨, 둥근 깃, 흉배, 각대, 소매 속으로 모은 손 */}
      <g transform={`scale(1 ${breath})`}>
        <path d="M -250 0 C -250 -150 -210 -300 -130 -350 L -60 -380 L 60 -380 L 130 -350 C 210 -300 250 -150 250 0 Z" fill={S.ink} />
        <path d="M -60 -380 C -40 -330 40 -330 60 -380" stroke={S.ink2} strokeWidth={10} fill="none" />
        <rect x={-78} y={-290} width={156} height={132} rx={4} fill="#34302A" />
        <g stroke={S.mute} strokeWidth={3} fill="none" opacity={0.45}>
          <path d="M -50 -200 C -20 -250 20 -250 50 -200" />
          <circle cx={0} cy={-235} r={16} />
          <path d="M -60 -175 L 60 -175" />
        </g>
        <path d="M -150 -120 C -120 -135 120 -135 150 -120 L 150 -100 C 120 -115 -120 -115 -150 -100 Z" fill={S.mute} opacity={0.7} />
        <path d="M -240 -40 C -200 -110 -110 -120 -40 -70 L 40 -70 C 110 -120 200 -110 240 -40 L 220 0 L -220 0 Z" fill="#2E2A25" />
        <path d="M -40 -70 C -20 -50 20 -50 40 -70" stroke={S.ink} strokeWidth={6} fill="none" />
      </g>
      {/* 얼굴(표정 없음) + 흰 수염 */}
      <ellipse cx={0} cy={-450} rx={62} ry={76} fill={S.ink} />
      <path d="M -44 -420 C -40 -350 -20 -300 0 -280 C 20 -300 40 -350 44 -420 C 20 -395 -20 -395 -44 -420 Z" fill="#E9E1CF" opacity={0.92} />
      {/* 사모: 앞은 낮고 뒤가 높은 관 + 양옆 날개 */}
      <path d="M -70 -500 C -72 -560 72 -560 70 -500 Z" fill={S.ink} />
      <path d="M -52 -540 C -52 -600 52 -600 52 -540 Z" fill={S.ink} />
      <ellipse cx={-96} cy={-562} rx={54} ry={24} fill={S.ink} transform="rotate(-8 -96 -562)" />
      <ellipse cx={96} cy={-562} rx={54} ry={24} fill={S.ink} transform="rotate(8 96 -562)" />
      <rect x={-72} y={-506} width={144} height={12} rx={4} fill={S.ink2} />
    </g>
  );
};

/* ── 뒷모습의 왕: 익선관(뒤쪽 두 날개) + 붉은 곤룡포의 둥근 용보 ───────── */
const KingBack: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 0 C -250 -170 -200 -300 -110 -340 L 110 -340 C 200 -300 250 -170 260 0 Z" fill="#3A1512" />
    <path d="M -260 0 C -250 -170 -200 -300 -110 -340 L 110 -340 C 200 -300 250 -170 260 0 Z" fill="url(#kingLight)" />
    <circle cx={0} cy={-200} r={80} fill="#6E4A1E" opacity={0.55} />
    <circle cx={0} cy={-200} r={80} fill="none" stroke="#B8893A" strokeWidth={6} opacity={0.9} />
    <g stroke="#C99B45" strokeWidth={5} fill="none" opacity={0.85} strokeLinecap="round">
      <path d="M -48 -170 C -60 -220 -10 -250 20 -225 C 45 -205 20 -175 0 -190 C -15 -200 -5 -220 12 -214" />
      <path d="M 20 -150 C 45 -160 58 -150 50 -135 M -52 -250 C -40 -262 -24 -262 -18 -250" />
    </g>
    <ellipse cx={0} cy={-400} rx={66} ry={72} fill={S.ink} />
    <path d="M -72 -440 C -74 -520 74 -520 72 -440 Z" fill={S.ink} />
    {/* 익선관 뒤 날개: 위로 선 좁은 잎 모양 */}
    <path d="M -46 -498 C -62 -528 -50 -548 -24 -540 C -18 -526 -18 -510 -20 -498 Z" fill={S.ink} />
    <path d="M 46 -498 C 62 -528 50 -548 24 -540 C 18 -526 18 -510 20 -498 Z" fill={S.ink} />
    <rect x={-74} y={-448} width={148} height={12} rx={4} fill="#2A2420" />
  </g>
);

/* ── 장면 ───────── */
const Open: React.FC<P> = () => (
  <Ground>
    <Stage>
      <Txt y={300} size={84} w={900}>퇴사가 안 된다고?</Txt>
      <Txt y={640} size={330} color={S.seal} serif w={700}>87세</Txt>
      <Letter x={540} y={960} w={400} h={480} />
      <Seal x={450} y={1110} text="반려" from={-20} size={180} rot={-12} />
    </Stage>
  </Ground>
);

const Person: React.FC<P> = () => {
  const f = useCurrentFrame();
  return (
    <Ground>
      <Stage>
        <Fade from={0}>
          <Txt y={330} size={200} serif>황희</Txt>
          <Txt y={420} size={50} color={S.ink2} w={500}>조선의 재상 · 영의정</Txt>
        </Fade>
        <g transform={`translate(0 ${(1 - ease(f, -6, 10)) * 60})`} opacity={ease(f, -6, 6)}>
          <Minister x={540} y={1160} s={1.08} />
        </g>
      </Stage>
    </Ground>
  );
};

const Reject: React.FC<P> = ({ cut }) => {
  const st = wordAt(cut, cut.p?.stampWord ?? "세종은");
  return (
    <Ground>
      <Stage>
        <Fade from={0}>
          <Txt y={500} size={280} color={S.seal} serif>70세</Txt>
          <Txt y={590} size={48} color={S.ink2} w={500}>1432년 · 물러나기를 청하다</Txt>
        </Fade>
        <Fade from={4} dy={80}>
          <Letter x={540} y={900} w={400} h={480} rot={3} />
        </Fade>
        <Seal x={450} y={1040} text="불허" from={st} size={190} rot={-10} />
      </Stage>
    </Ground>
  );
};

const Pile: React.FC<P> = ({ cut }) => {
  const f = useCurrentFrame();
  const also = wordAt(cut, "또");
  const drops = [0, 10, 20];
  return (
    <Ground>
      <Stage>
        {drops.map((d, i) => {
          const p = ease(f, d - 6, d + 8);
          return (
            <g key={i} opacity={p} transform={`translate(${(i - 1) * 40} ${(1 - p) * -160 + i * 36})`}>
              <Letter x={540} y={820} w={380} h={460} rot={[-7, 4, -2][i]} />
            </g>
          );
        })}
        <Seal x={470} y={1020} text="반려" from={also} size={190} rot={-8} />
        <Pop from={also} x={540} y={400}>
          <Txt y={440} size={200} color={S.seal} serif>또 반려</Txt>
        </Pop>
      </Stage>
    </Ground>
  );
};

const Home: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -30 0 L 0 -26 L 30 0 L 30 28 L -30 28 Z" fill={S.ink2} />
    <rect x={-8} y={8} width={16} height={20} fill={S.paper} />
  </g>
);
const Calendar: React.FC<P> = ({ cut }) => {
  const f = useCurrentFrame();
  const home = wordAt(cut, "집에서");
  const s2 = sentAt(cut, 1);
  const cx = (i: number) => 150 + (i % 5) * 195;
  const cy = (i: number) => 470 + Math.floor(i / 5) * 118;
  return (
    <Ground>
      <Stage>
        <Fade from={0}>
          <Txt y={330} size={96} w={900}>한 달에 <tspan fill={S.seal}>두 번</tspan> 출근</Txt>
        </Fade>
        {[...Array(30)].map((_, i) => {
          const meet = i === 0 || i === 14;
          const d = meet ? 6 + (i === 14 ? 6 : 0) : home + (i % 29) * 1.2;
          return (
            <g key={i} opacity={ease(f, i * 0.6 - 6, i * 0.6 + 4)}>
              <rect x={cx(i) - 86} y={cy(i) - 50} width={172} height={104} rx={8} fill="#F7F1E4" stroke={S.line} strokeWidth={2} />
              <text x={cx(i) - 72} y={cy(i) - 20} fontFamily={SANS} fontSize={24} fill={S.mute}>{i + 1}</text>
              {meet ? (
                <Pop from={d} x={cx(i)} y={cy(i) + 10}>
                  <circle cx={cx(i)} cy={cy(i) + 10} r={34} fill="none" stroke={S.seal} strokeWidth={6} />
                  <text x={cx(i)} y={cy(i) + 20} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill={S.seal}>조회</text>
                </Pop>
              ) : (
                <g opacity={ease(f, d, d + 6)}><Home x={cx(i) + 10} y={cy(i) + 4} /></g>
              )}
            </g>
          );
        })}
        <Pop from={s2} x={540} y={760} s0={1.25}>
          <rect x={120} y={600} width={840} height={330} rx={16} fill={S.ink} opacity={0.93} />
          <Txt y={720} size={70} color={S.darkInk} w={500}>600년 전의</Txt>
          <Txt y={860} size={130} color={S.flame} serif>재택근무</Txt>
        </Pop>
      </Stage>
    </Ground>
  );
};

const Count: React.FC<P> = ({ cut }) => {
  const f = useCurrentFrame();
  const yr = wordAt(cut, "1449");
  const s2 = sentAt(cut, 1);
  const out = wordAt(cut, "떠납니다");
  const n = Math.round(interpolate(f, [4, yr], [70, 87], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
  const swap = ease(f, s2, s2 + 10);
  return (
    <Ground dark zoom={0.03}>
      <Stage>
        <g opacity={1 - swap}>
          <Txt y={420} size={60} color={S.darkInk} w={500}>영의정에서 물러난 해</Txt>
          <Fade from={yr}><Txt y={540} size={110} color={S.flame} serif>1449년</Txt></Fade>
          <Txt y={900} size={380} color={S.darkInk} serif>{n}<tspan fontSize={150}>세</tspan></Txt>
        </g>
        <g opacity={swap}>
          <Txt y={500} size={80} color={S.darkInk} w={500}>3년 뒤</Txt>
          <Txt y={900} size={380} color={S.darkInk} serif>90<tspan fontSize={150}>세</tspan></Txt>
          <Txt y={1010} size={60} color={S.mute} w={500}>세상을 떠나다</Txt>
        </g>
        <Candle x={880} y={1060} s={0.9} lit={1 - ease(f, out, out + 18)} />
      </Stage>
    </Ground>
  );
};

const Bridge: React.FC<P> = ({ cut }) => {
  const f = useCurrentFrame();
  const end = sentEnd(cut, 0);
  const push = 1 + 0.08 * ease(f, 0, cut.duration, 0, 1, Easing.inOut(Easing.cubic));
  const back = ease(f, cut.duration - 12, cut.duration);
  return (
    <AbsoluteFill>
      <Ground dark zoom={0}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 60%" }}>
          <Stage>
            <defs>
              <radialGradient id="kingLight" cx="80%" cy="10%" r="80%">
                <stop offset="0%" stopColor={S.glow} stopOpacity={0.35} />
                <stop offset="100%" stopColor={S.glow} stopOpacity={0} />
              </radialGradient>
            </defs>
            <rect x={0} y={940} width={1080} height={40} fill="#2A2420" />
            <rect x={60} y={980} width={960} height={200} fill="#1A1613" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={700 + (i % 2) * 14} y={918 - i * 20} width={240} height={18} fill="#E9E1CF" opacity={0.85} />
            ))}
            {[0, 1, 2].map((i) => (
              <rect key={i} x={110 + (i % 2) * 12} y={918 - i * 20} width={200} height={18} fill="#E9E1CF" opacity={0.7} />
            ))}
            <Candle x={640} y={820} s={1.0} h={100} />
            <KingBack x={430} y={1160} s={1.05} />
          </Stage>
        </AbsoluteFill>
      </Ground>
      <AbsoluteFill>
        <Stage>
          <Fade from={end + 4}>
            <Txt y={300} size={88} color={S.darkInk} w={700}>가장 혹독하게</Txt>
            <Txt y={420} size={88} color={S.flame} w={900}>부린 사람은?</Txt>
          </Fade>
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: S.paper, opacity: back }} />
    </AbsoluteFill>
  );
};

/* ── 썸네일(정지 화면): 물체 하나(반려된 사직서) + 숫자 하나(87세) + 짧은 질문 ───────── */
export const ThumbSejong1: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: S.paper }}>
      <Img src={staticFile("sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(40,30,20,0.35) 100%)" }} />
      <Stage>
        <Txt y={330} size={128} w={900}>퇴사가</Txt>
        <Txt y={470} size={128} w={900}>안 된다고?</Txt>
        <Txt y={880} size={440} color={S.seal} serif w={700}>87<tspan fontSize={250}>세</tspan></Txt>
        <Letter x={540} y={1330} w={470} h={600} rot={-4} />
        <Seal x={420} y={1480} text="반려" from={-20} size={250} rot={-12} />
        <rect x={250} y={1700} width={580} height={96} rx={14} fill={S.ink} opacity={0.9} />
        <Txt y={1767} size={60} color={S.darkInk} w={700}>조선의 재상 <tspan fill={S.flame}>황희</tspan></Txt>
      </Stage>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<P>> = { open: Open, person: Person, reject: Reject, pile: Pile, calendar: Calendar, count: Count, bridge: Bridge };

/* ── 자막: 반투명 상자 + 핵심어 강조, 문장부호 없음 ───────── */
const Subtitle: React.FC<P> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cards = cut.sentences.flatMap((s) => s.cards);
  const i = cards.findIndex((c, k) => t >= c.start - 0.05 && t < Math.min((cards[k + 1]?.start ?? c.end + 0.5) - 0.02, c.end + 0.5));
  if (i < 0) return null;
  const c = cards[i];
  const o = ease(f, fr(c.start) - 2, fr(c.start) + 3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1220, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          padding: "14px 34px 18px",
          background: "rgba(12,10,8,0.78)",
          borderRadius: 14,
          color: "#F7F2E8",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 74,
          lineHeight: 1.3,
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        {c.lines.map((line, li) => (
          <div key={li} style={{ whiteSpace: "nowrap" }}>
            {line.map((w, wi) => (
              <React.Fragment key={wi}>
                {wi > 0 && " "}
                {w.map(([txt, hl], pi) => (
                  <span key={pi} style={{ color: hl ? S.flame : undefined }}>{txt}</span>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── 소리: BGM 두 곡(목소리 때 낮춤) + 강조 장면 효과음 ───────── */
type Cue = { file: string; from: number; to: number; mood: string };
const VOICE = cutsShort.flatMap((c) => c.sentences.map((s) => [c.from + fr(s.start), c.from + fr(s.end)] as [number, number]));
const duck = (f: number) => {
  let g = 1;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return 0.38;
    if (f < a && a - f < 8) g = Math.min(g, 0.38 + (0.62 * (a - f)) / 8);
    if (f > b && f - b < 15) g = Math.min(g, 0.38 + (0.62 * (f - b)) / 15);
  }
  return g;
};
const cut = (id: string) => cutsShort.find((c) => c.id === id)!;
const SFX: { at: number; file: string; vol: number }[] = [
  { at: cut("S3").from + wordAt(cut("S3"), "세종은"), file: "stamp", vol: 0.9 },
  { at: cut("S4").from + wordAt(cut("S4"), "또"), file: "stamp", vol: 0.9 },
  { at: cut("S6").from + wordAt(cut("S6"), "1449"), file: "tick", vol: 0.7 },
  { at: cut("S7").from + sentEnd(cut("S7"), 0) + 4, file: "bell", vol: 0.55 },
];

const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const text = JSON.stringify(timeline.cuts) + "퇴사가안된다고87세반려황희조선의재상영의정70세1432년물러나기를청하다불허또한달에두번출근조회600년전의재택근무물러난해1449년3년뒤90세상을떠나다가장혹독하게부린사람은?";
    const specs = ["400 40px 'Gowun Batang'", "700 40px 'Gowun Batang'", "500 40px 'Noto Sans KR'", "700 40px 'Noto Sans KR'", "900 40px 'Noto Sans KR'"];
    Promise.all(specs.map((s) => document.fonts.load(s, text))).then(() => document.fonts.ready).then(() => continueRender(h));
  }, [h]);
};

export const ShortSejong1: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: S.paper }}>
      {cutsShort.map((c) => {
        const Scene = SCENES[c.scene];
        return (
          <Sequence key={c.id} from={c.from} durationInFrames={c.duration} name={`${c.id} ${c.scene}`}>
            <Scene cut={c} />
            <Subtitle cut={c} />
            {c.sentences.map((s, i) => (
              <Sequence key={i} from={fr(s.start)} layout="none">
                <Audio src={staticFile(s.voice)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {(cueList as Cue[]).map((q) => {
        const len = q.to - q.from;
        return (
          <Sequence key={q.file} from={q.from} durationInFrames={len} layout="none">
            <Audio src={staticFile(q.file)} volume={(f) => 0.34 * interpolate(f, [0, 12, len - 18, len], [0, 1, 1, 0], clamp) * duck(q.from + f)} />
          </Sequence>
        );
      })}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={90} layout="none">
          <Audio src={staticFile(`sejong_short1/music/${s.file}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
