/** 세종 영상: 그림 중심 화면 (편전의 밤, 지도, 척추, 해시계, 측우기, 한글 등). 모두 먹선 실루엣 + 촛불색 한 점. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Candle, Figure, Ground, Rise, S, SANS, SERIF, SceneProps, Stage, at, clamp, ease, endAt } from "./ui";

/* ── 기와 지붕 전각 ───────────────── */
const Hall: React.FC<{ cx: number; y: number; w: number; lit?: number; fill?: string }> = ({ cx, y, w, lit = 0, fill = "#0B0A09" }) => {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const bodyH = w * 0.32;
  return (
    <g>
      <path d={`M ${l - 60} ${y - 22} Q ${l} ${y + 8} ${cx} ${y + 8} Q ${r} ${y + 8} ${r + 60} ${y - 22} L ${r - 40} ${y - w * 0.22} Q ${cx} ${y - w * 0.26} ${l + 40} ${y - w * 0.22} Z`} fill={fill} />
      <rect x={l + 20} y={y + 8} width={w - 40} height={bodyH} fill={fill} />
      {lit > 0 &&
        [0, 1, 2, 3].map((i) => {
          const ww = (w - 100) / 4;
          return (
            <g key={i}>
              <rect x={l + 40 + i * (ww + 6)} y={y + 30} width={ww} height={bodyH - 44} fill={S.glow} opacity={lit * (0.75 + 0.1 * Math.sin(i))} />
              {[1, 2].map((k) => (
                <line key={k} x1={l + 40 + i * (ww + 6) + (ww * k) / 3} y1={y + 30} x2={l + 40 + i * (ww + 6) + (ww * k) / 3} y2={y + bodyH - 14} stroke={fill} strokeWidth={3} opacity={0.7} />
              ))}
              <line x1={l + 40 + i * (ww + 6)} y1={y + 30 + (bodyH - 44) / 2} x2={l + 40 + i * (ww + 6) + ww} y2={y + 30 + (bodyH - 44) / 2} stroke={fill} strokeWidth={3} opacity={0.7} />
            </g>
          );
        })}
      <rect x={l - 10} y={y + 8 + bodyH} width={w + 20} height={26} fill={fill} />
    </g>
  );
};

/** 문서 더미 */
const Pile: React.FC<{ x: number; y: number; n?: number; s?: number }> = ({ x, y, n = 8, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={-90 + ((i * 37) % 13) - 6} y={-i * 16} width={180} height={14} rx={2} fill={i % 2 ? "#D9CFBA" : "#CFC4AD"} stroke="#6B6152" strokeWidth={1.5} />
    ))}
  </g>
);

/** 편전의 밤: outside / inside / whisper / king */
export const Night: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const mode = cut.p.mode as string;
  if (mode === "outside") {
    const lit = ease(f, at(cut, 1), at(cut, 1) + 30);
    const push = 1 + 0.12 * ease(f, at(cut, 2), cut.duration, 0, 1, Easing.inOut(Easing.cubic));
    return (
      <AbsoluteFill style={{ background: "linear-gradient(#07090F, #141820 70%, #0B0A09)" }}>
        <Stage style={{ transform: `scale(${push})`, transformOrigin: "50% 62%" }}>
          <circle cx={1500} cy={220} r={70} fill="#CFCBBE" opacity={0.25} />
          <ellipse cx={1480} cy={230} rx={320} ry={60} fill="#141820" opacity={0.9} />
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={(i * 211) % 1920} cy={40 + ((i * 97) % 300)} r={1.6} fill="#fff" opacity={0.25 + 0.2 * Math.sin(f * 0.05 + i)} />
          ))}
          <path d="M 0 760 Q 400 690 900 740 T 1920 720 L 1920 1080 L 0 1080 Z" fill="#0E0D0C" />
          <Hall cx={330} y={700} w={380} />
          <Hall cx={1560} y={690} w={420} />
          <Hall cx={960} y={640} w={560} lit={lit} />
          <ellipse cx={960} cy={900} rx={380} ry={40} fill={S.glow} opacity={0.12 * lit} />
        </Stage>
      </AbsoluteFill>
    );
  }
  // 실내 공통: 뒤편 창호 불빛, 바닥, 문서 더미
  const inner = (children: React.ReactNode, candleX = 960) => (
    <AbsoluteFill style={{ background: "#120F0C" }}>
      <Stage>
        <defs>
          <radialGradient id="room" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#6A4A26" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#120F0C" stopOpacity={0} />
          </radialGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={0.5}>
            <rect x={160 + i * 330} y={120} width={300} height={430} fill="#3B2A18" />
            {[1, 2, 3].map((k) => (
              <line key={k} x1={160 + i * 330 + k * 75} y1={120} x2={160 + i * 330 + k * 75} y2={550} stroke="#120F0C" strokeWidth={5} />
            ))}
            {[1, 2, 3, 4].map((k) => (
              <line key={k} x1={160 + i * 330} y1={120 + k * 86} x2={460 + i * 330} y2={120 + k * 86} stroke="#120F0C" strokeWidth={5} />
            ))}
          </g>
        ))}
        <rect x={0} y={600} width={1920} height={480} fill="#1A1410" />
        <rect x={0} y={0} width={1920} height={1080} fill="url(#room)" />
        {children}
        <Candle x={candleX} y={700} s={0.9} h={110} />
      </Stage>
    </AbsoluteFill>
  );
  if (mode === "whisper") {
    const poke = at(cut, 0) + 50;
    const dx = f > poke && f < poke + 14 ? Math.sin(((f - poke) / 14) * Math.PI) * 28 : 0;
    const jolt = f > poke + 6 && f < poke + 20 ? -10 * Math.sin(((f - poke - 6) / 14) * Math.PI) : 0;
    return inner(
      <g>
        <Pile x={420} y={820} n={12} />
        <Pile x={1500} y={830} n={9} />
        <g transform={`translate(0 ${jolt})`}>
          <Figure x={860} y={960} s={1.1} kind={f > poke + 6 ? "sit" : "slump"} fill="#050403" />
        </g>
        <g transform={`translate(${dx} 0)`}>
          <Figure x={1140} y={960} s={1.1} kind="sit" fill="#050403" flip />
        </g>
        {f > poke && f < poke + 30 && (
          <text x={990} y={640} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={60} fill={S.glow} opacity={1 - ease(f, poke + 14, poke + 30)}>
            쿡
          </text>
        )}
      </g>,
      1500,
    );
  }
  if (mode === "king") {
    const list = (cut.p.list ?? []) as string[];
    return inner(
      <g>
        <Pile x={640} y={880} n={10} />
        <Pile x={1300} y={880} n={14} />
        <rect x={700} y={760} width={520} height={30} fill="#2A1E14" />
        <Figure x={960} y={1010} s={1.5} kind="king" fill="#050403" />
        {list.length > 0 && <rect x={1250} y={200} width={640} height={400} rx={16} fill="rgba(10,8,6,0.72)" opacity={ease(f, at(cut, 2), at(cut, 2) + 16)} />}
        {list.map((it, i) => {
          const t = at(cut, i + 2);
          return (
            <text key={i} x={1570} y={310 + i * 110} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={48} fill={S.darkInk} opacity={ease(f, t, t + 16)}>
              {it}
            </text>
          );
        })}
      </g>,
      960,
    );
  }
  // inside
  return inner(
    <g>
      <Pile x={300} y={880} n={14} s={1.1} />
      <Pile x={560} y={900} n={9} />
      <Pile x={1380} y={890} n={12} />
      <Pile x={1640} y={870} n={16} s={1.1} />
      <Figure x={460} y={1000} s={0.95} kind="slump" fill="#050403" />
      <Figure x={760} y={1010} s={0.9} kind="sit" fill="#050403" />
      <Figure x={1200} y={1010} s={0.9} kind="slump" fill="#050403" flip />
      <Figure x={1500} y={1000} s={0.95} kind="sit" fill="#050403" flip />
    </g>,
  );
};

/** 스마트폰 속 한글 */
export const Phone: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const msg = ["오늘도 수고했어", "집에 가는 중이야", "밥은 먹었어?"];
  const t = at(cut, 1);
  const clear = ease(f, t, t + 30);
  return (
    <Ground dark>
      <Stage>
        <rect x={760} y={120} width={400} height={800} rx={50} fill="#1c1c1c" stroke="#3a3a3a" strokeWidth={6} />
        <rect x={784} y={170} width={352} height={700} rx={16} fill="#EDEAE3" opacity={0.95} />
        <g style={{ filter: `blur(${(1 - clear) * 8}px)` }}>
          {msg.map((m, i) => {
            const s = t + 10 + i * 24;
            const n = Math.floor(interpolate(f, [s, s + 20], [0, m.length], clamp));
            return (
              <g key={i}>
                <rect x={i % 2 ? 830 : 804} y={230 + i * 130} width={300} height={90} rx={24} fill={i % 2 ? "#F7D46B" : "#fff"} opacity={f >= s ? 1 : 0} />
                <text x={(i % 2 ? 830 : 804) + 24} y={288 + i * 130} fontFamily={SANS} fontWeight={500} fontSize={36} fill="#222">
                  {m.slice(0, n)}
                </text>
              </g>
            );
          })}
        </g>
        <ellipse cx={960} cy={520} rx={500} ry={420} fill={S.glow} opacity={0.06 + 0.06 * clear} />
      </Stage>
    </Ground>
  );
};

/** 만 원권 (실제 도안이 아닌 일러스트) */
export const Bill: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = at(cut, 1);
  const zoom = 1 + 0.25 * ease(f, t - 10, t + 40, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Ground>
      <Stage style={{ transform: `scale(${zoom})`, transformOrigin: "62% 50%" }}>
        <g opacity={ease(f, 0, 14)}>
          <rect x={310} y={250} width={1300} height={600} rx={20} fill="#C9D6B8" stroke="#6E8260" strokeWidth={6} />
          <rect x={340} y={280} width={1240} height={540} rx={12} fill="none" stroke="#6E8260" strokeWidth={3} strokeDasharray="10 8" />
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={560} cy={550} r={40 + i * 14} fill="none" stroke="#9BB08A" strokeWidth={2} opacity={0.5} />
          ))}
          <text x={400} y={400} fontFamily={SERIF} fontWeight={800} fontSize={110} fill="#4A5E3E">
            10000
          </text>
          <text x={400} y={780} fontFamily={SERIF} fontWeight={800} fontSize={60} fill="#4A5E3E">
            만 원
          </text>
          <ellipse cx={1250} cy={560} rx={230} ry={250} fill="#B5C6A2" stroke="#6E8260" strokeWidth={4} />
          <g clipPath="url(#oval)">
            <Figure x={1250} y={830} s={1.35} kind="king" fill="#3F5236" />
          </g>
          <defs>
            <clipPath id="oval">
              <ellipse cx={1250} cy={560} rx={228} ry={248} />
            </clipPath>
          </defs>
        </g>
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", opacity: ease(f, t, t + 14), fontFamily: SERIF, fontWeight: 800, fontSize: 170, color: S.ink, textShadow: "0 0 30px #ECE4D2, 0 0 60px #ECE4D2" }}>
        세종대왕
      </div>
    </Ground>
  );
};

/** 말려 있는 상소 + 물음표 */
export const Scroll: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = at(cut, 3);
  const open = ease(f, t, t + 40, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Ground dark>
      <Stage>
        <g transform="translate(960 470)">
          <rect x={-60 - 360 * open} y={-160} width={120 + 720 * open} height={320} fill="#E9E1CF" />
          {open > 0.3 &&
            Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={260 * open - i * 70 * open} y={-120} width={16} height={240} fill={S.ink} opacity={0.35 * open} />
            ))}
          <rect x={-90 - 360 * open} y={-180} width={40} height={360} rx={16} fill="#6B4B2A" />
          <rect x={50 + 360 * open} y={-180} width={40} height={360} rx={16} fill="#6B4B2A" />
          <rect x={-70} y={-20} width={140} height={40} fill={S.seal} opacity={1 - open} />
        </g>
        <text x={960} y={780} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={64} fill={S.darkInk} opacity={ease(f, 10, 30)}>
          {cut.p.label}
        </text>
        <text x={960} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={120} fill={S.flame} opacity={ease(f, at(cut, 1), at(cut, 1) + 20) * (1 - open)}>
          ?
        </text>
        <text x={960} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={64} fill={S.flame} opacity={open}>
          반대한 사람들이 증명했다
        </text>
      </Stage>
    </Ground>
  );
};

/** 수라상 (위에서 본 모습). 상중에는 고기 접시가 사라짐 */
export const Table: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const gone = ease(f, at(cut, 1) + 20, at(cut, 1) + 40);
  const weak = ease(f, at(cut, 2), at(cut, 2) + 20);
  const dishes: [number, number, number, string][] = [
    [820, 420, 60, "#F3EFE6"],
    [1100, 420, 60, "#F3EFE6"],
    [720, 600, 50, "#D8CDB5"],
    [960, 640, 55, "#D8CDB5"],
    [1200, 600, 50, "#D8CDB5"],
  ];
  return (
    <Ground>
      <Stage>
        <circle cx={960} cy={540} r={330} fill="#7A4A2A" />
        <circle cx={960} cy={540} r={312} fill="#8A5634" />
        {dishes.map(([x, y, r, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={c} stroke="#5A3A20" strokeWidth={3} />
            <circle cx={x} cy={y} r={r * 0.6} fill={i < 2 ? "#FFFFFF" : "#8C9A5A"} opacity={0.8} />
          </g>
        ))}
        <g opacity={1 - gone}>
          <ellipse cx={960} cy={420} rx={90} ry={60} fill="#F3EFE6" stroke="#5A3A20" strokeWidth={3} />
          <ellipse cx={960} cy={420} rx={60} ry={36} fill="#9A4A2E" />
          <text x={960} y={330} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} fill={S.ink}>
            고기
          </text>
        </g>
        <text x={960} y={110} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={60} fill={S.seal} opacity={gone * (1 - weak)}>
          상중에는 고기를 끊는다
        </text>
        <text x={960} y={110} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={60} fill={S.seal} opacity={weak}>
          어머니의 상 · 몸이 크게 상하다
        </text>
      </Stage>
    </Ground>
  );
};

/** 사극 속 장면: 말리는 상궁 → ✕ */
export const Drama: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = at(cut, 2);
  const x = ease(f, endAt(cut, 2) - 10, endAt(cut, 2) + 4, 0, 1, Easing.out(Easing.back(2)));
  const show = ease(f, t - 6, t + 10);
  return (
    <Ground>
      <Stage>
        <g opacity={0.25 + 0.75 * show}>
          <rect x={360} y={150} width={1200} height={680} rx={30} fill="#1d1b19" />
          <rect x={390} y={180} width={1140} height={620} rx={10} fill="#3A3027" />
          <Figure x={1250} y={800} s={1.2} kind="king" fill="#15110D" />
          <g transform="translate(700 800)">
            <path d="M -60 -300 C -60 -350 60 -350 60 -300 C 90 -300 90 -260 60 -250 L -60 -250 C -90 -260 -90 -300 -60 -300 Z" fill="#15110D" />
            <circle cx={0} cy={-212} r={38} fill="#15110D" />
            <path d="M -70 -170 C -100 -120 -120 -40 -130 0 L 130 0 C 120 -40 100 -120 70 -170 Z" fill="#15110D" />
          </g>
          <g opacity={show}>
            <rect x={480} y={230} width={700} height={120} rx={20} fill="#fff" />
            <text x={830} y={305} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={44} fill="#222">
              기름진 것만 드시면 아니 되옵니다
            </text>
          </g>
          <text x={420} y={880} fontFamily={SANS} fontSize={34} fill={S.ink2}>
            사극 속 장면
          </text>
        </g>
        <g opacity={x} transform={`translate(960 490) scale(${0.6 + 0.4 * x})`}>
          <line x1={-260} y1={-260} x2={260} y2={260} stroke={S.seal} strokeWidth={40} strokeLinecap="round" />
          <line x1={260} y1={-260} x2={-260} y2={260} stroke={S.seal} strokeWidth={40} strokeLinecap="round" />
        </g>
      </Stage>
    </Ground>
  );
};

/** 엎드린 신하들 + 말풍선 (상중이면 흰 상복 + 고기 한 상) */
export const Bow: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const mourn = !!cut.p.mourn;
  const sayAt = mourn ? at(cut, 3) : at(cut, 0) + 20;
  const tray = mourn ? ease(f, at(cut, 2), at(cut, 2) + 20) : 0;
  const robe = mourn ? "#DCD3BF" : undefined;
  return (
    <Ground>
      <Stage>
        {(mourn ? [820] : [340, 720, 1100, 1480]).map((x, i) => (
          <Figure key={i} x={x - 40} y={860} s={mourn ? 1.2 : 0.95} kind="bow" robe={robe} />
        ))}
        {mourn && (
          <g opacity={tray} transform={`translate(1560 ${780 - 30 * tray})`}>
            <rect x={-150} y={-20} width={300} height={40} rx={8} fill="#7A4A2A" />
            <ellipse cx={0} cy={-40} rx={90} ry={34} fill="#F3EFE6" stroke="#5A3A20" strokeWidth={3} />
            <ellipse cx={0} cy={-44} rx={58} ry={20} fill="#9A4A2E" />
            <text x={0} y={-110} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} fill={S.ink}>
              왕이 내린 고기 한 상
            </text>
          </g>
        )}
        <g opacity={ease(f, sayAt, sayAt + 14)}>
          <rect x={560} y={200} width={800} height={150} rx={30} fill="#F6F0E2" stroke={S.ink} strokeWidth={4} />
          <path d={`M ${mourn ? 1100 : 900} 348 L ${mourn ? 1130 : 880} 420 L ${mourn ? 1150 : 940} 348 Z`} fill="#F6F0E2" stroke={S.ink} strokeWidth={4} />
          <text x={960} y={298} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={60} fill={S.ink}>
            {cut.p.say}
          </text>
        </g>
      </Stage>
    </Ground>
  );
};

/** 산가요록 + 포계 */
export const Book: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const s = at(cut, 2);
  const e = endAt(cut, 2);
  const steps = ["닭을 잘게 토막 내고", "달군 그릇에 기름을 두르고", "재빨리 지져 익힌다"];
  return (
    <Ground>
      <Stage>
        <g opacity={ease(f, 0, 14)}>
          <rect x={260} y={170} width={420} height={640} fill="#6B4B2A" />
          <rect x={300} y={200} width={340} height={580} fill="#C8B48E" />
          <rect x={410} y={240} width={120} height={440} fill="#F3EDDC" stroke={S.ink2} strokeWidth={2} />
          {(cut.p.title as string).split("").map((ch, i) => (
            <text key={i} x={470} y={330 + i * 96} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={72} fill={S.ink}>
              {ch}
            </text>
          ))}
          <text x={470} y={870} textAnchor="middle" fontFamily={SANS} fontSize={34} fill={S.ink2}>
            {cut.p.by}
          </text>
        </g>
        <g opacity={ease(f, at(cut, 1), at(cut, 1) + 16)}>
          <text x={1240} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={110} fill={S.seal}>
            {cut.p.dish}
          </text>
          <ellipse cx={1240} cy={470} rx={260} ry={80} fill="#2A241E" />
          <ellipse cx={1240} cy={455} rx={230} ry={62} fill="#4A3A2A" />
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={i} cx={1110 + (i % 5) * 64} cy={440 + Math.floor(i / 5) * 34 + Math.sin(f * 0.3 + i) * 2} rx={30} ry={18} fill="#C98B4A" opacity={ease(f, s + i * 3, s + 10 + i * 3)} />
          ))}
        </g>
        {steps.map((st, i) => {
          const t = s + ((e - s) * i) / 3;
          return (
            <text key={i} x={960} y={660 + i * 76} fontFamily={SERIF} fontWeight={700} fontSize={50} fill={S.ink} opacity={ease(f, t, t + 14)}>
              {i + 1}. {st}
            </text>
          );
        })}
      </Stage>
    </Ground>
  );
};

/** 커피 ≈ 고기 한 점 */
export const Fuel: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const a = at(cut, 1);
  const b = at(cut, 2);
  return (
    <Ground>
      <Stage>
        <g opacity={ease(f, a, a + 16)} transform="translate(560 520)">
          <path d="M -120 -140 L 120 -140 L 96 150 L -96 150 Z" fill="#F6F0E2" stroke={S.ink} strokeWidth={6} />
          <rect x={-120} y={-170} width={240} height={36} rx={8} fill={S.ink} />
          <rect x={-104} y={-30} width={208} height={60} fill="#8A5A34" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M ${-40 + i * 40} -190 q 16 -30 0 -60 q -16 -30 0 -60`} stroke={S.ink2} strokeWidth={4} fill="none" opacity={0.5 + 0.3 * Math.sin(f * 0.1 + i)} />
          ))}
          <text x={0} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} fill={S.ink}>
            오늘의 야근
          </text>
        </g>
        <text x={960} y={540} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={120} fill={S.seal} opacity={ease(f, b, b + 12)}>
          ≈
        </text>
        <g opacity={ease(f, b, b + 16)} transform="translate(1360 520)">
          <ellipse cx={0} cy={40} rx={190} ry={70} fill="#F3EFE6" stroke={S.ink} strokeWidth={6} />
          <ellipse cx={0} cy={26} rx={110} ry={40} fill="#9A4A2E" />
          <text x={0} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} fill={S.ink}>
            15세기 세종의 수라상
          </text>
        </g>
      </Stage>
    </Ground>
  );
};

/** 한 걸음 앞 사람이 누구인지 모르는 눈 */
export const Eye: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = at(cut, 1);
  const blur = 4 + 14 * ease(f, 0, t + 40);
  return (
    <Ground dark>
      <Stage>
        <g style={{ filter: `blur(${blur}px)` }}>
          <Figure x={700} y={900} s={1.3} kind="stand" fill="#6B5E4E" />
          <Figure x={1000} y={930} s={1.5} kind="stand" fill="#7A6B58" />
          <Figure x={1300} y={900} s={1.3} kind="stand" fill="#6B5E4E" />
        </g>
        <g opacity={ease(f, t, t + 20)}>
          {[700, 1000, 1300].map((x, i) => (
            <text key={i} x={x} y={i === 1 ? 560 : 620} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={90} fill={S.flame}>
              ?
            </text>
          ))}
          <line x1={760} y1={1000} x2={1160} y2={1000} stroke={S.darkInk} strokeWidth={4} />
          <line x1={760} y1={980} x2={760} y2={1020} stroke={S.darkInk} strokeWidth={4} />
          <line x1={1160} y1={980} x2={1160} y2={1020} stroke={S.darkInk} strokeWidth={4} />
          <text x={960} y={970} textAnchor="middle" fontFamily={SANS} fontSize={34} fill={S.darkInk}>
            한 걸음
          </text>
        </g>
      </Stage>
    </Ground>
  );
};

/** 어두운 방의 지팡이 */
export const Cane: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const tap = (f % 50) / 50;
  return (
    <Ground dark>
      <Stage>
        <rect x={1380} y={180} width={260} height={380} fill="#3B2A18" opacity={0.35} />
        <g transform={`translate(${900 + f * 0.6} 0)`}>
          <line x1={0} y1={420} x2={-60} y2={900} stroke="#8A6A45" strokeWidth={14} strokeLinecap="round" />
          <path d="M 0 420 q 40 -30 70 0" stroke="#8A6A45" strokeWidth={14} fill="none" strokeLinecap="round" />
          <ellipse cx={-60} cy={905} rx={40 + tap * 160} ry={8 + tap * 30} fill="none" stroke={S.glow} strokeWidth={3} opacity={0.6 * (1 - tap)} />
        </g>
        <path d="M 0 905 L 1920 905" stroke="#2A221A" strokeWidth={4} />
      </Stage>
    </Ground>
  );
};

/** 척추가 굳어가는 단면 + 포도막염 */
export const Spine: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const fuse = ease(f, at(cut, 0), endAt(cut, 0) + 30, 0, 1, Easing.inOut(Easing.cubic));
  const eye = ease(f, at(cut, 1), at(cut, 1) + 20);
  const cmp = at(cut, 2);
  return (
    <Ground>
      <Stage>
        {Array.from({ length: 9 }, (_, i) => {
          const y = 150 + i * (84 - 14 * fuse);
          return (
            <g key={i}>
              <rect x={420} y={y} width={180} height={70} rx={20 - 12 * fuse} fill={interpolate(fuse, [0, 1], [0, 1]) > 0.5 ? "#C8BFA8" : "#E6DDC8"} stroke={S.ink} strokeWidth={4} />
              <path d={`M 600 ${y + 20} q 50 10 70 40`} stroke={S.ink} strokeWidth={4} fill="none" />
              {fuse > 0.6 && <line x1={410} y1={y + 72} x2={610} y2={y + 72} stroke={S.ink} strokeWidth={6} opacity={(fuse - 0.6) * 2.5} />}
            </g>
          );
        })}
        <text x={510} y={110} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={54} fill={S.seal} opacity={ease(f, at(cut, 0) + 20, at(cut, 0) + 40)}>
          강직성 척추염
        </text>
        <g opacity={eye} transform="translate(1260 330)">
          <path d="M -220 0 Q 0 -150 220 0 Q 0 150 -220 0 Z" fill="#F6F0E2" stroke={S.ink} strokeWidth={6} />
          <circle cx={0} cy={0} r={80} fill="none" stroke={S.seal} strokeWidth={24} opacity={0.6 + 0.2 * Math.sin(f * 0.2)} />
          <circle cx={0} cy={0} r={40} fill={S.ink} />
          <text x={0} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={54} fill={S.seal}>
            포도막염 · 눈의 염증
          </text>
        </g>
        <g opacity={ease(f, cmp, cmp + 16)}>
          <text x={900} y={740} fontFamily={SANS} fontSize={40} fill={S.ink2}>
            당뇨로 인한 눈병
          </text>
          <text x={1400} y={740} fontFamily={SERIF} fontWeight={700} fontSize={44} fill={S.ink}>
            통증이 적은 편
          </text>
          <text x={900} y={830} fontFamily={SANS} fontSize={40} fill={S.ink2}>
            세종의 기록
          </text>
          <text x={1400} y={830} fontFamily={SERIF} fontWeight={800} fontSize={44} fill={S.seal}>
            눈이 아프다
          </text>
        </g>
      </Stage>
    </Ground>
  );
};

/** 궤장: 안석과 지팡이 */
export const Gwejang: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t1 = at(cut, 1);
  const t3 = at(cut, 3);
  return (
    <Ground>
      <Stage>
        <g opacity={ease(f, 8, 24)} transform="translate(0 -80)">
          <rect x={420} y={520} width={520} height={120} rx={40} fill="#8A5634" stroke={S.ink} strokeWidth={5} />
          <rect x={440} y={430} width={120} height={120} rx={30} fill="#8A5634" stroke={S.ink} strokeWidth={5} />
          <rect x={800} y={430} width={120} height={120} rx={30} fill="#8A5634" stroke={S.ink} strokeWidth={5} />
          <text x={680} y={740} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} fill={S.ink}>
            안석
          </text>
        </g>
        <g opacity={ease(f, 20, 36)}>
          <line x1={1300} y1={260} x2={1300} y2={720} stroke="#6B4B2A" strokeWidth={22} strokeLinecap="round" />
          <path d="M 1300 270 q 70 -40 90 20 q -30 30 -60 10" stroke="#6B4B2A" strokeWidth={18} fill="none" strokeLinecap="round" />
          <text x={1430} y={620} textAnchor="start" fontFamily={SERIF} fontWeight={800} fontSize={56} fill={S.ink}>
            지팡이
          </text>
        </g>
        <text x={960} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={110} fill={S.seal} opacity={ease(f, t1, t1 + 14)}>
          궤장
        </text>
        <text x={960} y={850} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={64} fill={S.seal} opacity={ease(f, t3, t3 + 16)}>
          계속 일해 달라
        </text>
      </Stage>
    </Ground>
  );
};

/* ── 한반도 약도(양식화한 윤곽) ───────────────── */
const KOREA =
  "M 720 330 L 800 262 L 880 232 L 960 200 L 1010 152 L 1060 160 L 1110 150 L 1170 112 L 1232 100 L 1262 130 L 1232 190 L 1172 250 L 1122 300 L 1082 330 L 1100 382 L 1130 442 L 1150 522 L 1170 602 L 1190 682 L 1200 762 L 1190 832 L 1150 880 L 1090 892 L 1040 906 L 980 916 L 930 920 L 880 906 L 850 832 L 870 772 L 850 702 L 830 642 L 860 592 L 840 542 L 800 500 L 780 450 L 760 410 L 740 370 Z";
const YALU = "M 720 330 L 800 262 L 880 232 L 960 200 L 1010 152 L 1060 160";
const TUMEN = "M 1060 160 L 1110 150 L 1170 112 L 1232 100 L 1262 130";
const GUN4: [number, number][] = [[870, 240], [915, 222], [960, 206], [1000, 170]];
const JIN6: [number, number][] = [[1110, 162], [1150, 132], [1190, 116], [1232, 112], [1246, 146], [1205, 180]];

export const MapScene: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const mode = cut.p.mode as string;
  const draw = ease(f, 0, 40);
  const dot = (x: number, y: number, t: number, key: string, c = S.seal) => <circle key={key} cx={x} cy={y} r={11} fill={c} opacity={ease(f, t, t + 10)} />;
  return (
    <Ground>
      <Stage style={mode === "chosu" ? { transform: `scale(${1 + 0.5 * ease(f, 10, 80, 0, 1, Easing.inOut(Easing.cubic))})`, transformOrigin: "50% 58%" } : undefined}>
        <path d={KOREA} fill="#E2D8C3" stroke={S.ink} strokeWidth={4} strokeDasharray={4000} strokeDashoffset={4000 * (1 - draw)} strokeLinejoin="round" />
        {mode !== "chosu" && (
          <>
            <path d={YALU} fill="none" stroke="#3E6A8A" strokeWidth={mode === "border" ? 12 : 6} strokeLinecap="round" opacity={mode === "border" ? ease(f, at(cut, 1), at(cut, 1) + 20) : 0.4} />
            <path d={TUMEN} fill="none" stroke="#3E6A8A" strokeWidth={mode === "border" ? 12 : 6} strokeLinecap="round" opacity={mode === "border" ? ease(f, at(cut, 1) + 10, at(cut, 1) + 30) : 0.4} />
            <circle cx={900} cy={560} r={12} fill={S.ink} />
            <text x={870} y={570} textAnchor="end" fontFamily={SANS} fontSize={34} fill={S.ink}>
              한양
            </text>
          </>
        )}
        {mode === "north" && (
          <>
            <path d="M 900 560 Q 1080 420 1180 160" fill="none" stroke={S.seal} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f} opacity={ease(f, 20, 40)} />
            {JIN6.map(([x, y], i) => dot(x, y, at(cut, 1) + i * 8, `j${i}`))}
            <text x={1300} y={100} fontFamily={SERIF} fontWeight={800} fontSize={56} fill={S.seal} opacity={ease(f, at(cut, 1), at(cut, 1) + 16)}>
              6진
            </text>
            <text x={1290} y={260} fontFamily={SERIF} fontWeight={800} fontSize={60} fill={S.ink} opacity={ease(f, at(cut, 2), at(cut, 2) + 16)}>
              7년 넘게
            </text>
            <text x={1300} y={330} fontFamily={SANS} fontSize={34} fill={S.ink2} opacity={ease(f, at(cut, 2), at(cut, 2) + 16)}>
              김종서 · 1433년부터
            </text>
          </>
        )}
        {mode === "border" && (
          <>
            {GUN4.map(([x, y], i) => dot(x, y, at(cut, 0) + 10 + i * 8, `g${i}`))}
            {JIN6.map(([x, y], i) => dot(x, y, at(cut, 0) + 30 + i * 8, `j${i}`))}
            <text x={760} y={200} textAnchor="end" fontFamily={SERIF} fontWeight={800} fontSize={52} fill={S.seal} opacity={ease(f, at(cut, 0) + 10, at(cut, 0) + 26)}>
              4군
            </text>
            <text x={1300} y={100} fontFamily={SERIF} fontWeight={800} fontSize={52} fill={S.seal} opacity={ease(f, at(cut, 0) + 30, at(cut, 0) + 46)}>
              6진
            </text>
            <text x={700} y={330} textAnchor="end" fontFamily={SANS} fontSize={34} fill="#3E6A8A" opacity={ease(f, at(cut, 1), at(cut, 1) + 20)}>
              압록강
            </text>
            <text x={1300} y={170} fontFamily={SANS} fontSize={34} fill="#3E6A8A" opacity={ease(f, at(cut, 1) + 10, at(cut, 1) + 30)}>
              두만강
            </text>
          </>
        )}
        {mode === "chosu" && (
          <>
            <circle cx={900} cy={560} r={9} fill={S.ink} />
            <text x={880} y={570} textAnchor="end" fontFamily={SANS} fontSize={26} fill={S.ink}>
              한양
            </text>
            <path d="M 900 560 Q 950 590 975 630" fill="none" stroke={S.seal} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-f} opacity={ease(f, 20, 40)} />
            <circle cx={975} cy={632} r={16 + 4 * Math.sin(f * 0.2)} fill={S.seal} opacity={ease(f, 30, 44)} />
            <text x={1000} y={645} fontFamily={SERIF} fontWeight={800} fontSize={40} fill={S.seal} opacity={ease(f, 30, 44)}>
              청주 초수리
            </text>
            <text x={1000} y={690} fontFamily={SANS} fontSize={24} fill={S.ink2} opacity={ease(f, at(cut, 1), at(cut, 1) + 16)}>
              눈병을 고치러 간 곳 · 1444
            </text>
          </>
        )}
      </Stage>
    </Ground>
  );
};

/** 집현전에서 잠든 학자 + 담비 가죽옷 */
export const Sleep: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const dawn = !!cut.p.dawn;
  const coat = dawn ? 1 : ease(f, at(cut, 2) + 10, at(cut, 2) + 50, 0, 1, Easing.inOut(Easing.cubic));
  const light = dawn ? ease(f, 0, 90) : 0;
  return (
    <AbsoluteFill style={{ background: dawn ? `linear-gradient(90deg, #2A2018, #5A4632 ${60 + 20 * light}%, #C8A878)` : "#120F0C" }}>
      <Stage>
        <rect x={1380} y={140} width={380} height={460} fill={dawn ? "#F2DDB0" : "#2A2018"} opacity={dawn ? 0.5 + 0.4 * light : 0.4} />
        <rect x={0} y={700} width={1920} height={380} fill="#1A1410" />
        <rect x={560} y={660} width={700} height={50} fill="#3A2A1C" />
        <rect x={600} y={710} width={30} height={200} fill="#3A2A1C" />
        <rect x={1190} y={710} width={30} height={200} fill="#3A2A1C" />
        <rect x={700} y={620} width={220} height={40} fill="#D9CFBA" />
        <rect x={960} y={630} width={160} height={30} fill="#CFC4AD" />
        <Figure x={900} y={930} s={1.1} kind="slump" fill="#050403" />
        <path d={`M 700 ${760 - 400 * (1 - coat)} Q 900 ${620 - 400 * (1 - coat)} 1080 ${760 - 400 * (1 - coat)} L 1060 930 L 720 930 Z`} fill="#5A3E28" opacity={coat} />
        {!dawn && <Candle x={1200} y={660} s={0.6} h={40} />}
        {dawn && (
          <text x={960} y={160} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} fill="#2A2018" opacity={ease(f, at(cut, 3), at(cut, 3) + 16)}>
            내려놓을 수 없는 일
          </text>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

/** 앙부일구 */
export const Sundial: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const ang = -40 + 80 * ease(f, 0, cut.duration, 0, 1, Easing.linear);
  return (
    <Ground>
      <Stage>
        <circle cx={1500} cy={220} r={80} fill={S.flame} opacity={0.5} />
        <g transform="translate(960 560)">
          <rect x={-60} y={160} width={120} height={200} fill="#7A6B58" />
          <rect x={-160} y={340} width={320} height={40} fill="#6B5E4E" />
          <path d="M -300 0 A 300 200 0 0 0 300 0 Z" fill="#8C7A5E" stroke={S.ink} strokeWidth={6} />
          <ellipse cx={0} cy={0} rx={300} ry={60} fill="#D8CDB5" stroke={S.ink} strokeWidth={6} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={-240 + i * 60} y1={-40} x2={-200 + i * 50} y2={40} stroke={S.ink2} strokeWidth={2} />
          ))}
          <line x1={0} y1={0} x2={120} y2={-80} stroke={S.ink} strokeWidth={6} />
          <line x1={0} y1={0} x2={220 * Math.cos((ang * Math.PI) / 180)} y2={40 * Math.sin((ang * Math.PI) / 180) + 10} stroke="rgba(0,0,0,0.45)" strokeWidth={8} />
        </g>
        <text x={960} y={180} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={90} fill={S.ink} opacity={ease(f, at(cut, 1), at(cut, 1) + 14)}>
          앙부일구
        </text>
        <text x={420} y={200} fontFamily={SERIF} fontWeight={800} fontSize={80} fill={S.seal} opacity={ease(f, 4, 18)}>
          1434
        </text>
      </Stage>
    </Ground>
  );
};

/** 측우기 */
export const Rain: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const level = ease(f, 20, cut.duration, 0, 1, Easing.linear);
  const t = at(cut, 1);
  return (
    <Ground>
      <Stage>
        {Array.from({ length: 60 }, (_, i) => {
          const x = (i * 97) % 1920;
          const y = ((f * 18 + i * 131) % 1200) - 100;
          return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="#5B7A94" strokeWidth={3} opacity={0.35} />;
        })}
        <g transform="translate(760 0)">
          <rect x={-200} y={760} width={400} height={160} fill="#8C8273" stroke={S.ink} strokeWidth={5} />
          <rect x={-90} y={300} width={180} height={460} fill="#B8A98C" stroke={S.ink} strokeWidth={6} />
          <rect x={-80} y={750 - 380 * level} width={160} height={380 * level} fill="#5B7A94" opacity={0.7} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={-90} y1={400 + i * 80} x2={-60} y2={400 + i * 80} stroke={S.ink} strokeWidth={4} />
          ))}
          <text x={0} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={80} fill={S.ink}>
            측우기
          </text>
        </g>
        <g opacity={ease(f, t, t + 16)}>
          <text x={1380} y={420} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={90} fill={S.seal}>
            1441
          </text>
          <text x={1380} y={520} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill={S.ink}>
            이듬해부터 전국 기록
          </text>
        </g>
      </Stage>
    </Ground>
  );
};

/** 훈민정음: 서문(preface) / 스물여덟 자(letters) */
const LETTERS = "ㄱㅋㆁㄷㅌㄴㅂㅍㅁㅈㅊㅅㆆㅎㅇㄹㅿㆍㅡㅣㅗㅏㅜㅓㅛㅑㅠㅕ".split("");
export const Hangul: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  if (cut.p.mode === "preface") {
    const cols = ["나랏말씀이 중국과 달라", "문자와 서로 통하지 아니하니", "어리석은 백성이", "이르고자 하는 바가 있어도", "마침내 제 뜻을", "펴지 못하는 사람이 많다"];
    const s = at(cut, 1);
    const e = endAt(cut, 3);
    const fs = Math.min(64, Math.floor(680 / (Math.max(...cols.map((c) => c.length)) * 1.1)));
    return (
      <Ground>
        <Rise from={4} style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: S.seal }}>
          훈민정음
        </Rise>
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "row-reverse", justifyContent: "center" }}>
          {cols.map((c, i) => {
            const t0 = s + ((e - s) * i) / cols.length;
            return (
              <div key={i} style={{ writingMode: "vertical-rl", width: fs * 2.6, fontFamily: SERIF, fontWeight: 800, fontSize: fs, lineHeight: `${fs * 2.6}px`, letterSpacing: "0.06em", color: S.ink, clipPath: `inset(0 0 ${(1 - ease(f, t0, t0 + 24)) * 100}% 0)` }}>
                {c}
              </div>
            );
          })}
        </div>
      </Ground>
    );
  }
  const s = 6;
  const e = at(cut, 1) + 10;
  return (
    <Ground dark>
      <div style={{ position: "absolute", left: 210, right: 210, top: 150, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px 26px" }}>
        {LETTERS.map((l, i) => {
          const t0 = s + ((e - s) * i) / LETTERS.length;
          const p = ease(f, t0, t0 + 12);
          return (
            <div key={i} style={{ width: 110, height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 96, color: S.glow, opacity: p, textShadow: `0 0 ${24 * p}px rgba(247,198,107,0.8)`, transform: `translateY(${(1 - p) * 20}px)` }}>
              {l}
            </div>
          );
        })}
      </div>
      <Rise from={at(cut, 1) + 20} style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 60, color: S.darkInk }}>
        스물여덟 자
      </Rise>
    </Ground>
  );
};

/** 세종 시대의 유산 네 가지 → 촛불 아래에서 태운 것 */
export const Legacy: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const items = ["측우기", "앙부일구", "4군 6진", "한글"];
  const s = at(cut, 0);
  const e = endAt(cut, 0);
  const burn = ease(f, at(cut, 3), at(cut, 3) + 40);
  return (
    <AbsoluteFill style={{ background: interpolate(burn, [0, 1], [0, 1]) > 0.5 ? S.dark : S.paper }}>
      <Ground dark={burn > 0.5}>
        <div style={{ position: "absolute", left: 180, right: 180, top: 250, display: "flex", justifyContent: "space-between" }}>
          {items.map((it, i) => {
            const t0 = s + ((e - s) * i) / 4;
            return (
              <div key={it} style={{ width: 340, height: 340, border: `4px solid ${burn > 0.5 ? S.flame : S.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 66, color: burn > 0.5 ? S.darkInk : S.ink, opacity: ease(f, t0, t0 + 12) }}>
                {it}
              </div>
            );
          })}
        </div>
        {burn > 0.5 && (
          <Stage>
            <Candle x={960} y={820} s={0.8} h={60} />
          </Stage>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: 60, color: S.flame, opacity: ease(f, at(cut, 4), at(cut, 4) + 16) }}>
          시간과 건강을 태워 남긴 것
        </div>
      </Ground>
    </AbsoluteFill>
  );
};

/** 퇴근길 지하철의 스마트폰 */
export const Subway: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const lines = ["오늘도 고생했어", "조심히 들어가", "내일 봐!"];
  return (
    <AbsoluteFill style={{ background: "#141820" }}>
      <Stage>
        <rect x={120} y={140} width={1680} height={460} rx={30} fill="#0B0E14" />
        {Array.from({ length: 8 }, (_, i) => {
          const x = ((i * 300 - f * 22) % 2000 + 2000) % 2000 - 40;
          return <rect key={i} x={x} y={300 + (i % 3) * 60} width={140} height={10} rx={5} fill="#F7C66B" opacity={0.35} />;
        })}
        <rect x={0} y={600} width={1920} height={480} fill="#1E2430" />
        <g transform={`translate(0 ${4 * Math.sin(f * 0.25)})`}>
          <rect x={800} y={420} width={320} height={600} rx={40} fill="#111" stroke="#333" strokeWidth={6} />
          <rect x={820} y={470} width={280} height={500} rx={12} fill="#EDEAE3" />
          {lines.map((l, i) => {
            const t = at(cut, 1) + i * 20;
            return (
              <g key={i} opacity={ease(f, t, t + 10)}>
                <rect x={i % 2 ? 870 : 836} y={500 + i * 110} width={210} height={80} rx={20} fill={i % 2 ? "#F7D46B" : "#fff"} />
                <text x={(i % 2 ? 870 : 836) + 18} y={550 + i * 110} fontFamily={SANS} fontWeight={500} fontSize={28} fill="#222">
                  {l}
                </text>
              </g>
            );
          })}
          <path d="M 760 1080 C 760 900 800 860 860 900 L 900 960 L 900 1080 Z" fill="#3A2E26" />
        </g>
        <text x={960} y={1060} textAnchor="middle" fontFamily={SANS} fontSize={1} fill="#000">
          .
        </text>
      </Stage>
    </AbsoluteFill>
  );
};
