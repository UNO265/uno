/** 세종 영상: 글·문서 중심 화면 (인용, 핵심 단어, 실록 카드, 목록, 도장, 연표, 카운터 등) */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Brush, Candle, Cut, Figure, Ground, Rise, S, SANS, SERIF, SceneProps, Seal, Stage, at, clamp, ease, endAt } from "./ui";

const center: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" };
const color = (dark?: boolean) => (dark ? S.darkInk : S.ink);

/** 첫 문장: 어둠 속 인용 */
export const Quote: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const lines = (cut.p.text as string).split("\n");
  return (
    <Ground dark>
      <div style={{ ...center, paddingBottom: 120 }}>
        {lines.map((l, i) => (
          <Rise key={i} from={10 + i * 40} dur={30} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: S.darkInk, lineHeight: 1.5, letterSpacing: "0.01em" }}>
            {i === 0 ? "“" : ""}
            {l}
            {i === lines.length - 1 ? "”" : ""}
          </Rise>
        ))}
        <Rise from={100} style={{ marginTop: 50, fontFamily: SANS, fontSize: 30, color: S.mute, letterSpacing: "0.12em" }}>
          {cut.p.src}
        </Rise>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: S.flame, opacity: 0.15 * ease(f, 0, 60) }} />
    </Ground>
  );
};

/** 핵심 단어 한 개 (+ 한자, 설명) */
export const Word: React.FC<SceneProps> = ({ cut }) => {
  const { dark, big, sub, hanja } = cut.p;
  const lines = (big as string).split("\n");
  return (
    <Ground dark={dark}>
      <div style={{ ...center, paddingBottom: 110 }}>
        {hanja && (
          <Rise from={6} style={{ fontFamily: SERIF, fontSize: 64, color: S.seal, letterSpacing: "0.3em", marginBottom: 10 }}>
            {hanja}
          </Rise>
        )}
        {lines.map((l, i) => (
          <Rise key={i} from={10 + i * 10} dur={22} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: l.length > 8 ? 110 : 150, color: color(dark), lineHeight: 1.25, letterSpacing: "0.02em" }}>
            {l}
          </Rise>
        ))}
        {sub ? (
          <Rise from={Math.max(30, at(cut, Math.min(1, cut.segments.length - 1)) - 10)} style={{ marginTop: 34, fontFamily: SANS, fontSize: 40, color: dark ? S.mute : S.ink2 }}>
            {sub}
          </Rise>
        ) : null}
      </div>
      {dark ? (
        <Stage>
          <Candle x={1700} y={820} s={0.7} />
        </Stage>
      ) : (
        <Stage>
          <Brush x={760} y={700} w={400} from={24} color={S.seal} h={6} />
        </Stage>
      )}
    </Ground>
  );
};

/** 목록: 줄마다 한 항목씩 */
export const List: React.FC<SceneProps> = ({ cut }) => {
  const { dark, title, items } = cut.p as { dark?: boolean; title: string; items: string[] };
  const f = useCurrentFrame();
  return (
    <Ground dark={dark}>
      <div style={{ position: "absolute", left: 300, top: 170, right: 300 }}>
        <Rise from={4} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: dark ? S.flame : S.seal, marginBottom: 46 }}>
          {title}
        </Rise>
        {items.map((it, i) => {
          const t = at(cut, i);
          const p = ease(f, t, t + 14);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 40, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
              <svg width={62} height={62} viewBox="0 0 62 62">
                <circle cx={31} cy={31} r={26} fill="none" stroke={dark ? S.darkInk : S.ink} strokeWidth={4} opacity={0.7} />
                <path d="M 18 32 L 28 42 L 46 20" fill="none" stroke={dark ? S.flame : S.seal} strokeWidth={6} strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * (1 - ease(f, t + 6, t + 18))} />
              </svg>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: color(dark) }}>{it}</div>
            </div>
          );
        })}
      </div>
    </Ground>
  );
};

/** A → B 로 뒤집히는 두 단어 (+ 셋째 줄) */
export const Flip: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const { a, b, both } = cut.p;
  const t = at(cut, cut.p.at ?? 1);
  const strike = ease(f, t - 6, t + 10);
  const pb = ease(f, t + 4, t + 22);
  const t3 = both ? at(cut, 2) : 99999;
  return (
    <Ground>
      <div style={{ ...center, paddingBottom: 110, gap: 40 }}>
        <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 700, fontSize: a.length > 8 ? 84 : 120, color: S.ink, opacity: interpolate(ease(f, 4, 20), [0, 1], [0, 1]) * (1 - 0.55 * strike) }}>
          {a}
          {!both && <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 8, background: S.seal, transformOrigin: "left", transform: `scaleX(${strike})` }} />}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: b.length > 8 ? 84 : 120, color: both ? S.ink : S.seal, opacity: pb, transform: `translateY(${(1 - pb) * 20}px)` }}>{b}</div>
        {both && (
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: S.seal, opacity: ease(f, t3, t3 + 18) }}>{both}</div>
        )}
      </div>
    </Ground>
  );
};

/** 어두운 질문 화면 */
export const Question: React.FC<SceneProps> = ({ cut }) => {
  const lines = (cut.p.text as string).split("\n");
  return (
    <Ground dark>
      <div style={{ ...center, paddingBottom: 120 }}>
        {lines.map((l, i) => (
          <Rise key={i} from={8 + i * 12} dur={24} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 112, color: S.darkInk, lineHeight: 1.3 }}>
            {l}
          </Rise>
        ))}
      </div>
      <Stage>
        <Candle x={240} y={830} s={0.6} />
      </Stage>
    </Ground>
  );
};

/** 장 제목 */
export const Chapter: React.FC<SceneProps> = ({ cut }) => {
  const lines = (cut.p.title as string).split("\n");
  return (
    <Ground>
      <div style={{ ...center, paddingBottom: 90 }}>
        <Rise from={2} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: "0.4em", color: S.seal, marginBottom: 30 }}>
          {cut.p.n}
        </Rise>
        {lines.map((l, i) => (
          <Rise key={i} from={10 + i * 8} dur={24} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 108, color: S.ink, lineHeight: 1.3 }}>
            {l}
          </Rise>
        ))}
      </div>
      <Stage>
        <Brush x={810} y={lines.length > 1 ? 760 : 680} w={300} from={26} h={7} />
      </Stage>
    </Ground>
  );
};

/** 영상 제목 */
export const Title: React.FC<SceneProps> = ({ cut }) => {
  const lines = (cut.p.title as string).split("\n");
  return (
    <Ground dark>
      <Stage>
        <Candle x={960} y={700} s={1.1} h={160} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {lines.map((l, i) => (
          <Rise key={i} from={10 + i * 14} dur={28} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: S.darkInk, lineHeight: 1.35 }}>
            {l}
          </Rise>
        ))}
        <Rise from={50} style={{ marginTop: 26, fontFamily: SANS, fontSize: 36, letterSpacing: "0.2em", color: S.flame }}>
          {cut.p.sub}
        </Rise>
      </div>
    </Ground>
  );
};

/** 실록 카드: 세로쓰기, 줄에 맞춰 한 열씩 */
export const Record: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const cols = (cut.p.text as string).split("\n");
  const s = at(cut, cut.segments.length > 1 && cut.lines[0].startsWith("\"") === false ? 1 : 0);
  const e = endAt(cut, cut.segments.length - 1);
  const mark: string | undefined = cut.p.mark;
  // 가장 긴 열이 카드 높이(약 600px)에 들어가도록 글자 크기를 정한다
  const maxLen = Math.max(...cols.map((c) => c.length));
  const fs = Math.min(52, Math.floor(600 / (maxLen * 1.1)));
  const colW = Math.round(fs * 2);
  const w = cols.length * colW + 160;
  return (
    <Ground>
      <div
        style={{
          position: "absolute",
          left: 960 - w / 2,
          top: 90,
          width: w,
          height: 740,
          background: "#F4EEDF",
          boxShadow: "0 18px 50px rgba(40,30,20,0.25)",
          border: `3px solid ${S.ink2}`,
          outline: `1px solid ${S.ink2}`,
          outlineOffset: -14,
          opacity: ease(f, 0, 14),
        }}
      >
        <div style={{ position: "absolute", right: 70, top: 60, bottom: 70, display: "flex", flexDirection: "row-reverse", gap: 0 }}>
          {cols.map((c, i) => {
            const t0 = s + ((e - s) * i) / Math.max(1, cols.length);
            const p = ease(f, t0, t0 + 20);
            const parts = mark && c.includes(mark) ? c.split(mark) : null;
            return (
              <div
                key={i}
                style={{
                  writingMode: "vertical-rl",
                  width: colW,
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: fs,
                  lineHeight: `${colW}px`,
                  letterSpacing: "0.08em",
                  color: S.ink,
                  borderLeft: `1px solid ${S.line}`,
                  clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
                }}
              >
                {parts ? (
                  <>
                    {parts[0]}
                    <span style={{ color: S.seal, borderLeft: `5px solid ${S.seal}` }}>{mark}</span>
                    {parts[1]}
                  </>
                ) : (
                  c
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Rise from={10} style={{ position: "absolute", left: 0, right: 0, top: 856, textAlign: "center", fontFamily: SANS, fontSize: 30, letterSpacing: "0.1em", color: S.ink2 }}>
        {cut.p.src}
      </Rise>
      <Stage>
        <Seal x={960 + w / 2 - 20} y={790} text="실록" from={20} size={96} />
      </Stage>
    </Ground>
  );
};

/** 낱말 풀이 카드 */
export const Gloss: React.FC<SceneProps> = ({ cut }) => {
  const items = cut.p.items as [string, string][];
  return (
    <Ground>
      <div style={{ position: "absolute", left: 250, right: 250, top: 190 }}>
        {items.map(([k, v], i) => (
          <Rise key={i} from={at(cut, i)} style={{ display: "flex", alignItems: "baseline", gap: 40, padding: "26px 0", borderBottom: `2px solid ${S.line}` }}>
            <div style={{ width: 420, fontFamily: SERIF, fontWeight: 700, fontSize: 66, color: S.seal }}>{k}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: S.ink }}>→ {v}</div>
          </Rise>
        ))}
      </div>
    </Ground>
  );
};

/** 현대 진료 기록부 패러디 */
export const Chart: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const items = cut.p.items as string[];
  const dept: Record<string, string> = { 다리: "정형외과", 등: "척추·통증", 당뇨: "내분비내과", 배뇨: "비뇨의학과", 눈: "안과" };
  const s = at(cut, 0);
  const e = endAt(cut, 0);
  return (
    <AbsoluteFill style={{ background: "#F7F7F4" }}>
      <div style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 780, background: "#fff", border: "2px solid #C9CDD2", borderRadius: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.08)", opacity: ease(f, 0, 12) }}>
        <div style={{ height: 96, background: "#2F5D7C", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", padding: "0 44px", color: "#fff", fontFamily: SANS, fontSize: 40, fontWeight: 700 }}>
          진료 기록부
          <span style={{ marginLeft: "auto", fontSize: 30, fontWeight: 400 }}>환자: 세종 · 마흔 초반 · 1439년</span>
        </div>
        <div style={{ padding: "30px 60px" }}>
          {items.map((it, i) => {
            const t = s + ((e - s) * i) / items.length;
            const p = ease(f, t, t + 10);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: 112, borderBottom: "1px solid #E3E6EA", opacity: 0.25 + 0.75 * p }}>
                <div style={{ width: 54, height: 54, border: "4px solid #2F5D7C", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#C0392B", fontSize: 50, fontWeight: 700, fontFamily: SANS }}>
                  {p > 0.5 ? "✓" : ""}
                </div>
                <div style={{ width: 200, fontFamily: SANS, fontWeight: 700, fontSize: 50, color: "#1d2a33" }}>{it}</div>
                <div style={{ fontFamily: SANS, fontSize: 40, color: "#5b6b77" }}>{dept[it] ?? ""}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 730, transform: "rotate(-10deg)", opacity: ease(f, at(cut, 2), at(cut, 2) + 10), color: "#C0392B", border: "6px solid #C0392B", padding: "8px 26px", fontFamily: SANS, fontWeight: 700, fontSize: 52, borderRadius: 10 }}>
        종합병원급
      </div>
    </AbsoluteFill>
  );
};

/** 가로 연표 */
export const Years: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const items = cut.p.items as [string, string][];
  const n = items.length;
  const xs = items.map((_, i) => 460 + (1000 * i) / Math.max(1, n - 1));
  const segFor = (i: number) => at(cut, Math.min(cut.segments.length - 1, i + (cut.segments.length > n ? 1 : 0)));
  return (
    <Ground>
      <Stage>
        <line x1={300} y1={500} x2={300 + 1320 * ease(f, 0, 30)} y2={500} stroke={S.ink} strokeWidth={4} />
        {items.map(([y, label], i) => {
          const t = i === 0 ? 4 : segFor(i);
          const p = ease(f, t, t + 16);
          return (
            <g key={i} opacity={p}>
              <circle cx={xs[i]} cy={500} r={18} fill={S.seal} />
              <text x={xs[i]} y={430} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={92} fill={S.ink}>
                {y}
              </text>
              <text x={xs[i]} y={590} textAnchor="middle" fontFamily={SANS} fontSize={40} fill={S.ink2}>
                {label}
              </text>
            </g>
          );
        })}
        {cut.p.tail && (
          <text x={960} y={760} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill={S.seal} opacity={ease(f, at(cut, 0), at(cut, 0) + 20)}>
            {cut.p.tail}
          </text>
        )}
      </Stage>
    </Ground>
  );
};

/** 황희의 나이 카운터: 70 → 87 → 90 */
export const Counter: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t1 = at(cut, 1);
  const t2 = at(cut, 2);
  const age = f < t1 ? 70 + Math.round(17 * ease(f, 10, t1 - 10, 0, 1, Easing.inOut(Easing.cubic))) : f < t2 ? 87 : 87 + Math.round(3 * ease(f, t2, t2 + 30));
  const year = f < t2 ? (f < t1 - 10 ? 1432 + Math.round(17 * ease(f, 10, t1 - 10, 0, 1, Easing.inOut(Easing.cubic))) : 1449) : 1452;
  const label = f < t1 ? "영의정 재직 중" : f < t2 ? "마침내 은퇴" : "세상을 떠나다";
  return (
    <Ground>
      <div style={{ ...center, paddingBottom: 120 }}>
        <div style={{ fontFamily: SANS, fontSize: 44, color: S.ink2, letterSpacing: "0.1em" }}>황희 · {year}년</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 300, color: f >= t1 ? S.seal : S.ink, lineHeight: 1.1 }}>
          {age}
          <span style={{ fontSize: 110 }}>세</span>
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: S.ink }}>{label}</div>
      </div>
    </Ground>
  );
};

/** 한 달 달력: 조회는 두 번, 나머지는 집 */
export const Calendar: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = at(cut, 2);
  const t3 = at(cut, 3);
  return (
    <Ground>
      <Stage>
        <text x={960} y={150} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={60} fill={S.ink}>
          황희의 한 달
        </text>
        {Array.from({ length: 30 }, (_, i) => {
          const c = i % 10;
          const r = Math.floor(i / 10);
          const x = 360 + c * 124;
          const y = 220 + r * 170;
          const court = i === 0 || i === 14;
          const p = ease(f, t + (court ? 0 : 12 + i * 1.2), t + (court ? 10 : 22 + i * 1.2));
          return (
            <g key={i} opacity={ease(f, 2 + i * 0.6, 12 + i * 0.6)}>
              <rect x={x} y={y} width={112} height={150} rx={8} fill="#F6F0E2" stroke={S.line} strokeWidth={2} />
              <text x={x + 14} y={y + 38} fontFamily={SANS} fontSize={28} fill={S.ink2}>
                {i + 1}
              </text>
              {court ? (
                <g opacity={p}>
                  <circle cx={x + 56} cy={y + 92} r={40} fill="none" stroke={S.seal} strokeWidth={6} />
                  <text x={x + 56} y={y + 104} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} fill={S.seal}>
                    조회
                  </text>
                </g>
              ) : (
                <g opacity={p * 0.85} transform={`translate(${x + 56} ${y + 96})`}>
                  <path d="M -30 0 L 0 -26 L 30 0 L 30 30 L -30 30 Z" fill={S.ink2} />
                  <rect x={-8} y={10} width={16} height={20} fill="#F6F0E2" />
                </g>
              )}
            </g>
          );
        })}
        <text x={960} y={830} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={72} fill={S.seal} opacity={ease(f, t3, t3 + 16)}>
          600년 전의 재택근무
        </text>
      </Stage>
    </Ground>
  );
};

/** 인물 카드 */
export const Person: React.FC<SceneProps> = ({ cut }) => {
  const { name, years, role } = cut.p;
  return (
    <Ground>
      <Stage>
        <circle cx={640} cy={470} r={250} fill="#E2D8C3" />
        <Figure x={640} y={690} s={1.25} kind="sit" />
      </Stage>
      <div style={{ position: "absolute", left: 1000, top: 290 }}>
        <Rise from={6} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 150, color: S.ink }}>
          {name}
        </Rise>
        <Rise from={14} style={{ fontFamily: SANS, fontSize: 44, color: S.seal, marginTop: 8 }}>
          {years}
        </Rise>
        <Rise from={22} style={{ fontFamily: SANS, fontSize: 40, color: S.ink2, marginTop: 20, maxWidth: 780 }}>
          {role}
        </Rise>
      </div>
    </Ground>
  );
};

/** 사직서 + 반려 도장 (+ 집) */
export const Stamp: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const n = cut.segments.length;
  const stampAt = cut.p.home ? at(cut, 1) + 20 : at(cut, n - 1) + 8;
  const homeAt = cut.p.home ? at(cut, 2) : 99999;
  const shake = f >= stampAt && f < stampAt + 6 ? Math.sin(f * 3) * 6 : 0;
  return (
    <Ground>
      <Stage>
        <g transform={`translate(${cut.p.home ? 720 : 960} ${540 + shake}) rotate(-3)`} opacity={ease(f, 0, 12)}>
          <rect x={-230} y={-360} width={460} height={660} fill="#F6F0E2" stroke={S.ink2} strokeWidth={3} />
          <rect x={-206} y={-336} width={412} height={612} fill="none" stroke={S.line} strokeWidth={2} />
          {[...Array(7)].map((_, i) => (
            <line key={i} x1={-150 + i * 50} y1={-310} x2={-150 + i * 50} y2={250} stroke={S.line} strokeWidth={1} />
          ))}
          <text x={160} y={-250} fontFamily={SERIF} fontWeight={700} fontSize={84} fill={S.ink} style={{ writingMode: "vertical-rl" } as any}>
            {cut.p.doc}
          </text>
          <text x={-150} y={-250} fontFamily={SANS} fontSize={30} fill={S.ink2} style={{ writingMode: "vertical-rl" } as any}>
            {cut.p.by}
          </text>
        </g>
        <Seal x={cut.p.home ? 700 : 940} y={560} text={cut.p.stamp} from={stampAt} size={220} rot={-12} />
        {cut.p.home && (
          <g opacity={ease(f, homeAt, homeAt + 16)} transform={`translate(1360 ${560 - 20 * ease(f, homeAt, homeAt + 16)})`}>
            <path d="M -170 0 L 0 -150 L 170 0 L 170 180 L -170 180 Z" fill="none" stroke={S.ink} strokeWidth={10} strokeLinejoin="round" />
            <rect x={-40} y={80} width={80} height={100} fill={S.ink} />
            <text x={0} y={280} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={56} fill={S.seal}>
              집에서라도
            </text>
          </g>
        )}
      </Stage>
    </Ground>
  );
};

/** 영수증 */
export const Receipt: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const rows: [string, string][] = [
    ["측우기", "1441"],
    ["앙부일구", "1434"],
    ["4군 6진", "1433~"],
    ["훈민정음", "1443·1446"],
  ];
  const h = 760 * ease(f, 0, 60, 0, 1, Easing.inOut(Easing.cubic));
  const t = at(cut, 1);
  return (
    <Ground dark>
      <div style={{ position: "absolute", left: 660, top: 60, width: 600, height: h, overflow: "hidden", background: "#F4F1EA", boxShadow: "0 0 60px rgba(247,198,107,0.25)" }}>
        <div style={{ padding: "40px 50px", fontFamily: SANS, color: "#222" }}>
          <div style={{ textAlign: "center", fontSize: 46, fontWeight: 700, letterSpacing: "0.3em" }}>영 수 증</div>
          <div style={{ textAlign: "center", fontSize: 24, color: "#666", marginTop: 8 }}>1418 — 1450 · 편전</div>
          <div style={{ borderTop: "3px dashed #999", margin: "26px 0" }} />
          {rows.map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 36, margin: "14px 0" }}>
              <span>{a}</span>
              <span style={{ color: "#666" }}>{b}</span>
            </div>
          ))}
          <div style={{ borderTop: "3px dashed #999", margin: "26px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 700 }}>
            <span>지불</span>
            <span>시간 · 건강</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, marginTop: 18 }}>
            <span>받는 사람</span>
            <span style={{ color: S.seal, fontWeight: 700, opacity: ease(f, t, t + 14) }}>오늘의 우리</span>
          </div>
        </div>
      </div>
    </Ground>
  );
};

/** 마지막 질문: 응답 / 도망 */
export const Choice: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const ta = at(cut, 1);
  const tb = at(cut, 2);
  const box = (label: string, t: number, x: number, c: string) => (
    <div style={{ position: "absolute", left: x, top: 330, width: 560, height: 260, border: `5px solid ${c}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: c, opacity: ease(f, t, t + 16), transform: `scale(${0.92 + 0.08 * ease(f, t, t + 16)})` }}>
      {label}
    </div>
  );
  return (
    <Ground dark>
      <Rise from={6} style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: S.darkInk }}>
        600년 전, 당신이 천재 관료라면?
      </Rise>
      {box(cut.p.a, ta, 330, S.flame)}
      {box(cut.p.b, tb, 1030, S.darkInk)}
    </Ground>
  );
};

/** 끝: 댓글 · 구독, 촛불이 꺼짐 */
export const End: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const out = ease(f, cut.duration - 60, cut.duration - 20);
  return (
    <Ground dark>
      <Stage>
        <Candle x={960} y={640} s={1} h={140} lit={1 - out} />
        {out > 0 && <path d={`M 960 ${590 - out * 120} q 20 -40 -10 -80 q -20 -40 10 -80`} stroke="#8C8273" strokeWidth={4} fill="none" opacity={0.6 * (1 - ease(f, cut.duration - 20, cut.duration))} />}
      </Stage>
      <Rise from={at(cut, 0)} style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: S.darkInk }}>
        여러분의 생각을 댓글로
      </Rise>
      <Rise from={at(cut, 1)} style={{ position: "absolute", left: 0, right: 0, top: 280, textAlign: "center", fontFamily: SANS, fontSize: 40, color: S.flame, letterSpacing: "0.2em" }}>
        구독 · 좋아요
      </Rise>
    </Ground>
  );
};

/** 하루 일과 */
export const Day: React.FC<SceneProps> = ({ cut }) => {
  const f = useCurrentFrame();
  const items = cut.p.items as [string, string][];
  const icon = (i: number) =>
    i === 0 ? (
      <g>
        <circle cx={0} cy={0} r={34} fill={S.flame} opacity={0.8} />
        <line x1={-70} y1={30} x2={70} y2={30} stroke={S.ink} strokeWidth={4} />
      </g>
    ) : i === 1 ? (
      <circle cx={0} cy={0} r={40} fill={S.flame} />
    ) : (
      <path d="M 12 -40 A 40 40 0 1 0 12 40 A 30 30 0 1 1 12 -40 Z" fill={S.ink2} />
    );
  return (
    <Ground>
      <Stage>
        {items.map(([k, v], i) => {
          const t = at(cut, i + 1);
          const p = ease(f, t, t + 16);
          const y = 240 + i * 220;
          return (
            <g key={i} opacity={p} transform={`translate(${(1 - p) * -40} 0)`}>
              <g transform={`translate(420 ${y})`}>{icon(i)}</g>
              <text x={540} y={y + 26} fontFamily={SERIF} fontWeight={700} fontSize={76} fill={S.seal}>
                {k}
              </text>
              <text x={780} y={y + 22} fontFamily={SERIF} fontWeight={700} fontSize={60} fill={S.ink}>
                {v}
              </text>
            </g>
          );
        })}
      </Stage>
    </Ground>
  );
};

/** 사용하지 않는 컷 방지용 */
export const Missing: React.FC<{ cut: Cut }> = ({ cut }) => (
  <AbsoluteFill style={{ background: "#300", color: "#fff", fontSize: 60, alignItems: "center", justifyContent: "center" }}>
    {cut.id} {cut.scene}
  </AbsoluteFill>
);
export { clamp };
