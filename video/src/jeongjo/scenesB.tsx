/** 정조 편 장면 2: 생활·현대·기록·건물 장면 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BRUSH, Books, C, Cam, mono, Dust, Flame, Glow, H, Hall, INK, King, Letter, Official, Paper, PaperDoor, Rays, Reveal, SANS, SERIF, SP, Scholar, Vig, W, Walker, clamp, ease, flick, rand, sAt, sEnd, wAt,
} from "./kit";

/* 약탕기(김) */
const Pot: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${-20 + i * 20} -150 C ${-40 + i * 20 + 20 * Math.sin(f * 0.05 + i)} -220, ${i * 20 + 25 * Math.sin(f * 0.04 + i * 2)} -270, ${-10 + i * 20 + 30 * Math.sin(f * 0.03 + i)} -340`} stroke="#D8D2C6" strokeWidth={10} fill="none" opacity={0.12} strokeLinecap="round" />
      ))}
      <path d="M -110 -60 C -130 -140 -80 -150 0 -150 C 80 -150 130 -140 110 -60 C 100 -10 60 0 0 0 C -60 0 -100 -10 -110 -60 Z" fill="#5A3A26" />
      <path d="M 100 -110 C 160 -120 180 -90 190 -70" stroke="#5A3A26" strokeWidth={18} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-150} rx={70} ry={14} fill="#3A2416" />
      <path d="M -110 -80 C -40 -60 40 -60 110 -80" stroke="#7A5236" strokeWidth={4} fill="none" />
    </g>
  );
};
/* 약첩(종이에 싼 약) */
const Packet: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M -60 0 L 0 -40 L 60 0 L 0 40 Z" fill="#E6DBC2" />
    <path d="M -60 0 L 60 0 M 0 -40 L 0 40" stroke="#B9A57F" strokeWidth={2} />
    <line x1={-50} y1={-10} x2={50} y2={10} stroke="#A8322A" strokeWidth={3} />
  </g>
);

/* 1. 병과 약 (C11 / C15) */
export const Medicine: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  return (
    <AbsoluteFill style={{ background: "#0B0806", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.1, 40, 0]} to={[1.02, -40, 0]}>
        <div style={{ position: "absolute", left: 80, top: 260, width: 900, height: 560, filter: "blur(5px)", opacity: 0.8 }}>
          <svg width={900} height={560}>
            <rect x={60} y={380} width={760} height={120} rx={20} fill="#3A2E24" />
            <path d="M 160 380 C 200 330 300 320 360 350 L 760 350 C 800 360 820 380 820 380 Z" fill="#231A12" />
            <ellipse cx={180} cy={345} rx={60} ry={40} fill="#150F0A" />
          </svg>
        </div>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <path d="M 900 760 L 1780 760 L 1860 860 L 820 860 Z" fill="#3A2616" />
          <Pot x={1320} y={760} s={1.25} />
          <Packet x={1040} y={800} r={-12} />
          <Packet x={1600} y={810} r={18} />
          <Packet x={1700} y={780} r={-4} />
        </svg>
        <Flame x={1780} y={560} s={0.5} id="med" />
      </Cam>
      <Glow x="85%" y="45%" k={0.22} r={45} />
      <Vig k={0.88} at="65% 60%" />
      {p.date && <Reveal at={6} out={sAt(cut, 1)} style={{ position: "absolute", left: 140, top: 200, fontFamily: SERIF, fontSize: 56, color: C.cream, letterSpacing: 10 }}>{p.date}</Reveal>}
      <Reveal at={wAt(cut, "이질", sAt(cut, 1))} style={{ position: "absolute", left: 140, top: 300, fontFamily: SERIF, fontSize: 40, color: "#CDB98F", letterSpacing: 4, lineHeight: 1.6 }}>
        <div>어용겸 · 이질</div>
        <div style={{ color: "#D98C73" }}>엉뚱한 약</div>
      </Reveal>
      {p.calm && <Dust n={20} seed={31} area={[1100, 200, 600, 500]} />}
    </AbsoluteFill>
  );
};

/* 2. 거친 말 (C12) */
export const Angry: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const q = wAt(cut, "개돼지", sAt(cut, 0) + 20);
  const hit = ease(f, q - 2, q + 4);
  const shake = f > q && f < q + 12 ? Math.sin(f * 7) * (12 - (f - q)) : 0;
  const splats = React.useMemo(() => {
    const r = rand(77);
    return [...Array(18)].map(() => ({ x: 200 + r() * 1500, y: 180 + r() * 700, s: 6 + r() * 40 }));
  }, []);
  return (
    <AbsoluteFill style={{ background: "#0A0604", overflow: "hidden", transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <Cam dur={cut.duration} from={[1.2, 0, 0]} to={[1.35, 0, 0]}>
        <div style={{ position: "absolute", left: 260, top: -120, transform: "rotate(-6deg) scale(1.5)", filter: "blur(2px)", opacity: 0.6 }}>
          <Letter w={900} h={900} seed={29} cols={8} fold={false} />
        </div>
      </Cam>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {splats.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s * hit} fill="#0D0806" opacity={0.85} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: `rgba(150,20,10,${0.25 * hit * (1 - ease(f, q + 6, q + 40))})`, mixBlendMode: "screen" }} />
      <Vig k={0.9} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: BRUSH, fontSize: 210, color: "#E8D8C0", opacity: hit, transform: `scale(${1.3 - 0.3 * hit}) rotate(-3deg)`, textShadow: "0 0 30px rgba(180,40,20,0.6)" }}>개돼지만도 못하다</div>
        <Reveal at={q + 30} style={{ fontFamily: SERIF, fontSize: 28, color: "#B9A57F", letterSpacing: 6, marginTop: 10 }}>정조가 심환지에게 · 1798년 8월 · 국립중앙박물관 번역</Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 휴대전화 화면 */
const Phone: React.FC<{ x: number; y: number; title: string; msgs: { t: string; me?: boolean; at: number }[]; tone?: string; s?: number; dim?: number }> = ({ x, y, title, msgs, tone = "#1C2330", s = 1, dim = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 420, height: 760, borderRadius: 54, background: "#0B0C10", padding: 16, transform: `scale(${s})`, transformOrigin: "50% 50%", boxShadow: "0 40px 90px rgba(0,0,0,0.7)", filter: dim ? `blur(${dim * 6}px) brightness(${1 - dim * 0.5})` : undefined }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 40, background: tone, overflow: "hidden", position: "relative" }}>
        <div style={{ height: 90, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16, fontFamily: SANS, fontSize: 26, color: "#E8ECF2", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{title}</div>
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => {
            const p = ease(f, m.at, m.at + 8);
            return (
              <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "82%", padding: "14px 18px", borderRadius: 20, background: m.me ? "#E9C46A" : "#2E3746", color: m.me ? "#1A1A1A" : "#E8ECF2", fontFamily: SANS, fontSize: 24, lineHeight: 1.4, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
                {m.t}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* 3. 현대의 메시지 (C14 rant / C18 two / E1 three / E2 pick) */
export const PhoneScene: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const m = cut.p.mode;
  const a = sAt(cut, 0);
  let body: React.ReactNode;
  if (m === "rant") {
    body = (
      <Phone x={750} y={160} title="친구" tone="#1D2129" msgs={[
        { t: "오늘 회의 끝났어", at: a },
        { t: "근데 진짜 말이 안 되는 일이 있었어", me: true, at: a + 20 },
        { t: "회의에선 참았는데", me: true, at: a + 40 },
        { t: "여기서는 말할게 😤", me: true, at: a + 60 },
      ]} />
    );
  } else if (m === "two") {
    const b = sAt(cut, 1);
    body = (
      <>
        <Phone x={420} y={160} title="업무" tone="#1B2230" msgs={[
          { t: "자료 검토 부탁드립니다.", me: true, at: a + 6 },
          { t: "내일 오전까지 드리겠습니다.", at: a + 30 },
        ]} />
        <Phone x={1080} y={160} title="가족" tone="#2A2119" msgs={[
          { t: "어머니 몸은 좀 괜찮으세요?", me: true, at: a + 40 },
          { t: "좋은 소식 있으면 꼭 알려 줘", at: b },
        ]} />
      </>
    );
  } else if (m === "three") {
    const b = sAt(cut, 1);
    body = (
      <>
        <Phone x={180} y={200} s={0.88} title="업무" msgs={[{ t: "첨부 문서 확인 부탁드립니다.", me: true, at: b }]} />
        <Phone x={750} y={160} title="가족" tone="#2A2119" msgs={[{ t: "밥은 먹었어?", at: b + 30 }]} />
        <Phone x={1320} y={200} s={0.88} title="가까운 사람" tone="#231C26" msgs={[{ t: "사실 요즘 좀 힘들어", me: true, at: b + 60 }]} />
      </>
    );
  } else {
    const pick = ease(f, sAt(cut, 1), sAt(cut, 1) + 20);
    const pick2 = ease(f, sAt(cut, 2), sAt(cut, 2) + 20);
    body = (
      <>
        <Phone x={180} y={200} s={0.88} dim={pick2} title="업무" msgs={[{ t: "첨부 문서 확인 부탁드립니다.", me: true, at: 0 }]} />
        <Phone x={750} y={160} dim={Math.max(pick, pick2)} title="가족" tone="#2A2119" msgs={[{ t: "밥은 먹었어?", at: 0 }]} />
        <Phone x={1320} y={200} s={0.88} dim={pick * (1 - pick2)} title="친구" tone="#231C26" msgs={[{ t: "진짜 화나서 못 참겠어", me: true, at: 0 }]} />
      </>
    );
  }
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1A2130, #06070A 75%)", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>{body}</Cam>
      <Vig k={0.7} color="3,4,8" />
    </AbsoluteFill>
  );
};

/* 4. 학문하는 왕 (C16) */
export const Study: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const turn = ease(f, sAt(cut, 1), sAt(cut, 1) + 30);
  return (
    <AbsoluteFill style={{ background: "#D9CBB0", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.06, -20, 0]}>
        <AbsoluteFill style={{ background: "linear-gradient(#CDBB98, #A99372 70%, #6E5A42)" }} />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={120} y={170 + r * 150} width={1680} height={14} fill="#5A4430" />
              {[...Array(40)].map((_, i) => (
                <rect key={i} x={140 + i * 41} y={100 + r * 150} width={34} height={70} fill={["#E6DAC0", "#D8C9A8", "#CBB891"][(i + r) % 3]} opacity={0.9} />
              ))}
            </g>
          ))}
          <rect x={0} y={760} width={W} height={320} fill="#7E6649" />
          <King x={760} y={930} s={0.95} fill="#2A1E14" />
          <Official x={1260} y={930} s={0.8} pose="bow" flip fill="#2A1E14" />
          <Official x={1560} y={930} s={0.8} pose="bow" flip fill="#2A1E14" />
        </svg>
        <Rays color="#FFF1D0" k={0.35} skew={18} x={200} rows={3} size={200} blur={10} />
      </Cam>
      <AbsoluteFill style={{ background: `rgba(10,6,4,${0.75 * turn})` }} />
      <div style={{ position: "absolute", left: 520, top: 180, opacity: turn, transform: `rotate(-4deg) scale(${0.9 + 0.1 * turn})` }}>
        <Letter w={880} h={700} seed={29} cols={8} fold={false} />
      </div>
      <Vig k={0.6} color="40,28,18" />
    </AbsoluteFill>
  );
};

/* 5. 가족에게 보낸 편지 (C17) */
export const Family: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const petals = React.useMemo(() => {
    const r = rand(8);
    return [...Array(22)].map(() => ({ x: r() * W, y: r() * H, v: 0.6 + r(), ph: r() * 6 }));
  }, []);
  const keys = [
    ["병환", "어머니의 병환"],
    ["경사", "집안의 경사"],
    ["들려", "어머니께 전해 다오"],
  ];
  return (
    <AbsoluteFill style={{ background: "#E9DDC4", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.06, 20, 0]}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, filter: "blur(2px)" }}>
          <PaperDoor w={W} h={H} glow="rgba(255,240,210,0.9)">
            <g opacity={0.35} transform={`translate(${80 + 6 * Math.sin(f * 0.02)} 0)`}>
              <path d="M 1500 0 C 1400 200 1300 260 1100 420 M 1330 250 C 1250 240 1200 300 1180 360 M 1420 150 C 1500 220 1560 260 1640 260" stroke="#3E2E22" strokeWidth={16} fill="none" strokeLinecap="round" />
              {[...Array(14)].map((_, i) => (
                <circle key={i} cx={1150 + ((i * 97) % 480)} cy={100 + ((i * 61) % 340)} r={16} fill="#3E2E22" />
              ))}
            </g>
          </PaperDoor>
        </div>
        <div style={{ position: "absolute", left: 300, top: 250, transform: "rotate(-3deg)" }}>
          <Letter w={620} h={560} seed={44} cols={6} fold={false} tint="#F1E8D4" />
        </div>
      </Cam>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {petals.map((p, i) => (
          <ellipse key={i} cx={(p.x + Math.sin(f * 0.03 + p.ph) * 40 + f * 0.6) % W} cy={(p.y + f * p.v) % H} rx={7} ry={4} fill="#F4C9CF" opacity={0.7} />
        ))}
      </svg>
      <Vig k={0.45} color="90,60,30" />
      <Reveal at={wAt(cut, "외삼촌", sAt(cut, 1))} style={{ position: "absolute", left: 1060, top: 250, fontFamily: SERIF, color: "#3A2A1A" }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#7A6040" }}>외삼촌</div>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: 10 }}>홍낙임</div>
      </Reveal>
      {keys.map(([k, t], i) => (
        <Reveal key={i} at={wAt(cut, k, sAt(cut, 2) + i * 40)} style={{ position: "absolute", left: 1060, top: 460 + i * 80, fontFamily: SERIF, fontSize: 40, color: "#5A3A26", letterSpacing: 4 }}>
          · {t}
        </Reveal>
      ))}
    </AbsoluteFill>
  );
};

/* 6. 날짜 되감기 (C21) */
export const DateCard: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const flip = ease(f, 20, 70);
  const pages = [...Array(6)];
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.05, 0, 0]}>
        <div style={{ position: "absolute", left: 660, top: 220, width: 600, height: 640, perspective: 1600 }}>
          {pages.map((_, i) => {
            const t = Math.min(1, Math.max(0, flip * pages.length - i));
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transformOrigin: "50% 0", transform: `rotateX(${t * -170}deg)`, backfaceVisibility: "hidden", opacity: t >= 1 ? 0 : 1, zIndex: pages.length - i }}>
                <Paper w={600} h={640} tint="#E3D6BA" />
              </div>
            );
          })}
          <Paper w={600} h={640} tint="#EADFC6" style={{ zIndex: 0 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: SERIF, color: "#2A1E14" }}>
              <div style={{ fontSize: 44, letterSpacing: 8, opacity: 1 - flip }}>{p.from}</div>
              <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: 4, opacity: flip }}>{p.to.split(" ").slice(0, 1)}</div>
              <div style={{ fontSize: 110, fontWeight: 600, color: C.red, opacity: flip }}>{p.to.split(" ").slice(1).join(" ")}</div>
            </div>
          </Paper>
        </div>
      </Cam>
      <Glow x="50%" y="30%" k={0.2} r={50} />
      <Vig k={0.85} />
    </AbsoluteFill>
  );
};

/* 7. 한 낱말 (C24 태양증) */
export const Word: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const doubt = ease(f, sAt(cut, 1), sAt(cut, 1) + 30);
  return (
    <AbsoluteFill style={{ background: "#0A0705", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", filter: "blur(30px)" }}>
        <circle cx={960} cy={500} r={260 + 20 * Math.sin(f * 0.05)} fill="#C0602A" opacity={0.22 * (1 - doubt * 0.6)} />
      </svg>
      <Vig k={0.9} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Reveal at={4} dur={24} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 170, color: C.cream, letterSpacing: 24, filter: `blur(${doubt * 3}px)` }}>{p.big}</Reveal>
        <Reveal at={sAt(cut, 1) + 10} style={{ marginTop: 20, fontFamily: SERIF, fontSize: 38, color: "#CDB98F", letterSpacing: 6 }}>{p.sub}</Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 8. 밤에 벽을 도는 그림자 (C25 walk / C26 empty) */
export const Walk: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const empty = cut.p.mode === "empty";
  const rise = sAt(cut, 1);
  const go = sAt(cut, 2);
  const again = sAt(cut, 3);
  const dur = cut.duration;
  // 위치: 앉음(400) → 일어남 → 오른쪽으로(1300) → 돌아옴(600) → 다시(1200)
  const x = interpolate(f, mono([0, go, go + 80, again - 10, again + 70, dur]), [420, 420, 1300, 620, 1220, 1260], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const moving = (f > go && f < go + 80) || (f > again - 60 && f < again + 70);
  const standing = ease(f, rise, rise + 20);
  const flipBack = f > go + 80 && f < again - 10;
  const moonX = interpolate(f, [0, dur], [300, 900]);
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <Cam dur={dur} to={[1.04, 0, 0]}>
        <AbsoluteFill style={{ background: "linear-gradient(#2A2118 0%, #1E1811 62%, #120D09 62%, #0A0705 100%)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 55%, rgba(255,196,130,${0.38 * flick(f)}) 0%, rgba(0,0,0,0) 55%)` }} />
        <div style={{ position: "absolute", left: moonX, top: 700, width: 360, height: 200, background: "rgba(170,190,225,0.12)", transform: "skewX(-30deg)", filter: "blur(10px)" }} />
        {!empty && (
          <svg width={W} height={H} style={{ position: "absolute", filter: "blur(2.5px)" }}>
            <g opacity={0.92}>
              {standing < 0.5 ? (
                <g transform={`translate(${x} 700) scale(1.15)`}><Scholar x={0} y={0} fill="#0B0806" /></g>
              ) : (
                <Walker x={x} y={720} s={1.2} phase={moving ? f * 0.35 : 0} flip={flipBack} fill="#0B0806" />
              )}
            </g>
          </svg>
        )}
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <Books x={200} y={900} n={6} s={1.1} />
          <Books x={1500} y={930} n={4} s={1.2} />
          <rect x={700} y={880} width={380} height={40} fill="#3A2616" />
        </svg>
        <Flame x={1720} y={880} s={0.7} lit={empty ? 0.6 : 1} stick={empty ? 80 : 180} id="walk" />
      </Cam>
      <Glow x="88%" y="70%" k={0.25} r={50} />
      <Vig k={0.85} />
      <Dust n={30} seed={41} />
    </AbsoluteFill>
  );
};

/* 9. 잠 못 드는 밤 (C27) */
export const Sleepless: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const words: string[] = cut.p.words;
  return (
    <AbsoluteFill style={{ background: "#06070B", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.12, 0, 0]} to={[1.0, 0, 0]}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <rect x={560} y={260} width={800} height={560} rx={30} fill="#1E2331" />
          <rect x={560} y={260} width={800} height={180} rx={30} fill="#262C3C" />
          <ellipse cx={960} cy={330} rx={90} ry={60} fill="#D9D2C2" opacity={0.25} />
          <path d={`M 720 500 C 800 ${470 + 4 * Math.sin(f * 0.1)} 1120 ${470 + 4 * Math.sin(f * 0.1)} 1200 500 L 1200 780 L 720 780 Z`} fill="#151A26" />
          <ellipse cx={960} cy={390} rx={70} ry={80} fill="#0A0B10" />
        </svg>
        <Rays k={0.22} skew={-30} x={900} cols={2} rows={3} size={200} blur={14} />
      </Cam>
      <Vig k={0.9} color="2,3,6" />
      {words.map((w, i) => {
        const a = sAt(cut, Math.min(i + 1, cut.sentences.length - 1)) + i * 20;
        const x = [260, 1300, 700][i];
        const y = [300, 360, 760][i] - (f - a) * 0.15;
        return (
          <Reveal key={i} at={a} dur={30} style={{ position: "absolute", left: x, top: y, fontFamily: SERIF, fontSize: 40, color: "#AFC1DA", letterSpacing: 4, filter: "blur(1px)" }}>
            {w}
          </Reveal>
        );
      })}
    </AbsoluteFill>
  );
};

/* 10. 마음을 가라앉히는 독서 (C28) */
export const Reading: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const flip = ((f % 150) / 150);
  const pageTurn = f > 90 ? ease(f % 150, 60, 110) : 0;
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.15, 0, 0]} to={[1.05, 0, -20]}>
        <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 560, perspective: 1800 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 500, height: 560, transform: "rotateY(8deg)", transformOrigin: "100% 50%" }}>
            <Letter w={500} h={560} seed={101} cols={5} date={false} fold={false} tint="#E8DDC2" />
          </div>
          <div style={{ position: "absolute", left: 500, top: 0, width: 500, height: 560, transform: "rotateY(-8deg)", transformOrigin: "0 50%" }}>
            <Letter w={500} h={560} seed={103} cols={5} date={false} fold={false} tint="#E8DDC2" />
          </div>
          <div style={{ position: "absolute", left: 500, top: 0, width: 500, height: 560, transformOrigin: "0 50%", transform: `rotateY(${-8 - 170 * pageTurn}deg)`, backfaceVisibility: "hidden", opacity: pageTurn > 0.02 && pageTurn < 0.98 ? 1 : 0 }}>
            <Paper w={500} h={560} tint="#EFE5CE" />
          </div>
        </div>
        <Flame x={1600} y={640} s={0.7} id="read" />
      </Cam>
      <Glow x="80%" y="45%" k={0.26} r={50} />
      <Vig k={0.85} />
      <Dust n={24} seed={51} area={[1000, 200, 800, 600]} />
    </AbsoluteFill>
  );
};

/* 11. 밤길의 전령 (C29) */
export const Messenger: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const dur = cut.duration;
  const x = interpolate(f, [0, dur], [-200, 2100]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0C1422, #070A10 70%)", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <circle cx={1500} cy={260} r={60} fill="#DCE6F3" opacity={0.9} />
        <circle cx={1500} cy={260} r={180} fill="#9FB6D6" opacity={0.07} />
        <g transform={`translate(${-f * 0.2} 0)`}>
          <Hall x={500} y={560} w={700} s={0.8} fill="#080B12" />
          <Hall x={1300} y={590} w={520} s={0.6} fill="#070A10" />
        </g>
        <g transform={`translate(${-f * 0.5} 0)`}>
          <rect x={-200} y={620} width={3000} height={150} fill="#0A0D14" />
          <path d={`M -200 620 ${[...Array(40)].map((_, i) => `L ${-200 + i * 80} ${608 + (i % 2) * 8}`).join(" ")} L 3000 620 Z`} fill="#0D111A" />
        </g>
        <rect x={0} y={770} width={W} height={310} fill="#1A2130" />
        <rect x={0} y={770} width={W} height={6} fill="#3A4660" />
        <Walker x={x} y={900} s={0.9} phase={f * 0.32} lantern fill="#050608" />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${(x / W) * 100 + 4}% 72%, rgba(255,182,92,${0.18 * flick(f)}) 0%, rgba(0,0,0,0) 18%)` }} />
      <Vig k={0.8} color="2,3,6" />
    </AbsoluteFill>
  );
};

/* 12. 조정: 새벽의 공식 자리 (C34) */
export const Court: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const split = cut.p.split ? ease(f, sAt(cut, 1), sAt(cut, 1) + 30) : 0;
  return (
    <AbsoluteFill style={{ background: "#0E1117", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${50 * split}% 0 0)` }}>
        <Cam dur={cut.duration} to={[1.06, 0, 20]}>
          <AbsoluteFill style={{ background: "linear-gradient(#6D7D92, #3A4556 45%, #262C36 45%, #151920)" }} />
          <svg width={W} height={H} style={{ position: "absolute" }}>
            <Hall x={960} y={330} w={1200} fill="#161B23" />
            <path d="M 900 500 L 1020 500 L 1200 1080 L 720 1080 Z" fill="#3A4150" opacity={0.6} />
            {[...Array(5)].map((_, r) =>
              [...Array(6)].map((_, i) => (
                <Official key={`${r}-${i}`} x={380 + i * 70 - r * 40} y={620 + r * 90} s={0.28 + r * 0.05} pose="bow" fill="#0E1116" />
              )),
            )}
            {[...Array(5)].map((_, r) =>
              [...Array(6)].map((_, i) => (
                <Official key={`b${r}-${i}`} x={1540 - i * 70 + r * 40} y={620 + r * 90} s={0.28 + r * 0.05} pose="bow" flip fill="#0E1116" />
              )),
            )}
          </svg>
          <Rays color="#DDE6F1" k={0.18} skew={-12} x={500} rows={2} size={260} blur={20} />
        </Cam>
        <Reveal at={sAt(cut, 1)} style={{ position: "absolute", left: 140, top: 180, fontFamily: SERIF, fontSize: 42, color: "#E6ECF3", letterSpacing: 6 }}>조정에서 듣는 말</Reveal>
      </div>
      {split > 0 && (
        <div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", overflow: "hidden", opacity: split }}>
          <div style={{ position: "absolute", left: -480, top: 0, width: W, height: H, background: "#080604" }}>
            <div style={{ position: "absolute", left: 720, top: 260, transform: "rotate(-4deg)" }}>
              <Letter w={520} h={520} seed={37} cols={5} fold={false} />
            </div>
            <Flame x={1500} y={640} s={0.7} id="court" />
            <Glow x="75%" y="50%" k={0.26} />
            <Vig k={0.8} />
          </div>
          <Reveal at={sAt(cut, 1) + 20} style={{ position: "absolute", right: 120, top: 180, fontFamily: SERIF, fontSize: 42, color: C.cream, letterSpacing: 6 }}>따로 받는 글</Reveal>
        </div>
      )}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={960} y1={0} x2={960} y2={H} stroke="#C9A66B" strokeWidth={2} opacity={split} />
      </svg>
    </AbsoluteFill>
  );
};

/* 13. 실록의 날짜들 (C37 / C38 / C45 연결 불가) */
export const Sillok: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const items = [
    { d: "8월 28일", t: "우의정 임명" },
    { d: "10월 4일", t: "다시 사직 상소" },
    { d: "10월 11일", t: "세 번째 사직 요청" },
  ];
  const at = (i: number) => (p.show === 1 ? sAt(cut, 1) : p.unlinked ? 10 + i * 12 : i === 0 ? 0 : sAt(cut, 1) + (i - 1) * 50);
  return (
    <AbsoluteFill style={{ background: "#0C0B0A", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 45%, rgba(230,210,170,0.16), rgba(0,0,0,0) 55%)" }} />
        <div style={{ position: "absolute", left: 220, top: 230, width: 420, height: 600, background: "#5B4A34", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(-3deg)" }}>
          <div style={{ position: "absolute", left: 290, top: 40, width: 90, height: 500, background: "#E3D6B8", display: "flex", justifyContent: "center", paddingTop: 16 }}>
            <div style={{ writingMode: "vertical-rl", fontFamily: SERIF, fontWeight: 600, fontSize: 38, color: "#3A2A1A", letterSpacing: 2, whiteSpace: "nowrap" }}>正祖實錄 卷四十九</div>
          </div>
        </div>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <line x1={860} y1={300} x2={860} y2={300 + 440 * ease(f, 0, 40)} stroke="#8C7A5C" strokeWidth={3} />
          {items.slice(0, p.show).map((it, i) => {
            const a = at(i);
            const o = ease(f, a, a + 16);
            return (
              <g key={i} opacity={o}>
                <circle cx={860} cy={330 + i * 190} r={14} fill={i === 0 ? "#C9A66B" : C.red} />
                <text x={910} y={320 + i * 190} fontFamily={SERIF} fontSize={34} fill="#B9A57F" letterSpacing={4}>1798년 {it.d}</text>
                <text x={910} y={380 + i * 190} fontFamily={SERIF} fontWeight={600} fontSize={52} fill="#F2E6CC" letterSpacing={4}>{it.t}</text>
              </g>
            );
          })}
          {p.unlinked && (
            <g>
              <rect x={1560} y={440} width={160} height={120} fill="#E7DABD" opacity={ease(f, sAt(cut, 0), sAt(cut, 0) + 20)} />
              {[0, 1, 2].map((i) => {
                const cutK = ease(f, sAt(cut, 0) + 40, sAt(cut, 0) + 70);
                return (
                  <g key={i}>
                    <line x1={1560} y1={500} x2={1280} y2={330 + i * 190} stroke="#C9A66B" strokeWidth={2} strokeDasharray="8 10" opacity={0.7 * (1 - cutK)} />
                    <text x={1400} y={420 + i * 110} fontFamily={SERIF} fontSize={44} fill="#C9A66B" opacity={cutK}>?</text>
                  </g>
                );
              })}
              <text x={1640} y={600} textAnchor="middle" fontFamily={SERIF} fontSize={24} fill="#B9A57F" opacity={ease(f, sAt(cut, 1), sAt(cut, 1) + 20)}>지시 편지 · 사례 있음</text>
            </g>
          )}
        </svg>
      </Cam>
      <Vig k={0.8} />
      <Reveal at={p.show === 1 ? sAt(cut, 2) : 10} style={{ position: "absolute", left: 220, top: 860, fontFamily: SANS, fontSize: 22, color: "#8C7A5C", letterSpacing: 2 }}>
        출처 · 『정조실록』 49권, 정조 22년 8월 28일 · 10월 4일 · 10월 11일
      </Reveal>
    </AbsoluteFill>
  );
};

/* 14. 의관을 갖추고 기다리는 왕 (C39) */
export const Wait: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0E1218", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1, 0, 0]} to={[1.18, 0, -30]} origin="50% 45%">
        <AbsoluteFill style={{ background: "linear-gradient(#1C2230, #0E1218 70%)" }} />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          {/* 일월오봉도 병풍 */}
          <rect x={560} y={170} width={800} height={460} fill="#1A2A34" />
          <path d="M 560 630 L 640 420 L 720 520 L 820 330 L 960 470 L 1100 330 L 1200 520 L 1280 420 L 1360 630 Z" fill="#0F1C24" />
          <circle cx={700} cy={260} r={40} fill="#C94A3A" opacity={0.8} />
          <circle cx={1220} cy={260} r={36} fill="#D8DCE2" opacity={0.8} />
          <rect x={760} y={520} width={400} height={150} fill="#2A1C14" />
          <King x={960} y={640} s={0.75} fill="#07080B" />
          {[0, 1].map((i) => (
            <rect key={i} x={i ? 1560 : 200} y={120} width={160} height={880} fill="#070A0E" />
          ))}
          <path d="M 860 1080 L 1060 1080 L 1000 700 L 920 700 Z" fill="#DDE6F1" opacity={0.06} />
        </svg>
        <Rays color="#DDE6F1" k={0.14} skew={0} x={780} cols={1} rows={3} size={360} blur={30} />
      </Cam>
      <Vig k={0.85} color="3,4,7" />
      <Dust n={30} color="#C9D8EE" seed={61} />
    </AbsoluteFill>
  );
};

/* 15. 마흔다섯 자 (C3C) */
export const Count: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const a = wAt(cut, "25자", sAt(cut, 2));
  const b = wAt(cut, "20자", a + 30);
  const c = wAt(cut, "45자", b + 30);
  const r = rand(5);
  const boxes = [...Array(45)].map((_, i) => ({ i, row: i < 25 ? 0 : 1 }));
  return (
    <AbsoluteFill style={{ background: "#0C0A08", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        <div style={{ position: "absolute", left: 160, top: 240, width: 1600, height: 520 }}>
          <Paper w={1600} h={520} tint="#E5D8BB" />
          {boxes.map(({ i, row }) => {
            const col = row ? i - 25 : i;
            const x = 1600 - 90 - col * 60;
            const y = 90 + row * 220;
            const on = ease(f, (row ? b : a) + col * 2, (row ? b : a) + col * 2 + 6);
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 44, height: 150, border: `2px solid rgba(90,60,40,${0.3 + on * 0.5})`, background: `rgba(168,50,42,${0.25 * on})` }}>
                <div style={{ position: "absolute", left: 6, top: 10 + (i % 3) * 8, width: 30, height: 110, background: `rgba(30,20,12,${0.5 + r() * 0.3})`, borderRadius: 6, opacity: 0.5 }} />
                <div style={{ position: "absolute", left: -4, top: 70, width: 52 * on, height: 6, background: C.red, transform: "rotate(-60deg)" }} />
              </div>
            );
          })}
        </div>
      </Cam>
      <Vig k={0.75} />
      <Reveal at={a} style={{ position: "absolute", right: 200, top: 780, fontFamily: SERIF, fontSize: 48, color: C.cream }}>25자</Reveal>
      <Reveal at={b} style={{ position: "absolute", right: 420, top: 780, fontFamily: SERIF, fontSize: 48, color: C.cream }}>+ 20자</Reveal>
      <Reveal at={c} style={{ position: "absolute", left: 200, top: 770, fontFamily: SERIF, fontWeight: 600, fontSize: 80, color: "#E8A28F" }}>45자</Reveal>
      <Reveal at={sAt(cut, 1)} out={a - 10} style={{ position: "absolute", left: 0, width: W, top: 150, textAlign: "center", fontFamily: SERIF, fontSize: 40, color: "#CDB98F", letterSpacing: 6 }}>왕이 내린 글의 특정 대목</Reveal>
    </AbsoluteFill>
  );
};

/* 16. 되돌릴 수 없는 명령 (C3D) */
export const Decree: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const st = sAt(cut, 0) + 30;
  const hit = ease(f, st, st + 5, 0, 1, Easing.out(Easing.back(2)));
  return (
    <AbsoluteFill style={{ background: "#0C0906", overflow: "hidden", transform: f > st && f < st + 8 ? `translateY(${Math.sin(f * 6) * 5}px)` : undefined }}>
      <Cam dur={cut.duration} to={[1.06, 0, 0]}>
        <div style={{ position: "absolute", left: 460, top: 180 }}>
          <Letter w={1000} h={660} seed={121} cols={9} fold={false} date={false} tint="#EADCBC" />
        </div>
        <div style={{ position: "absolute", left: 1040, top: 560, width: 220, height: 220, border: `12px solid ${C.red}`, opacity: hit, transform: `scale(${1.6 - 0.6 * hit}) rotate(-6deg)`, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(168,50,42,0.12)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 70, color: C.red, lineHeight: 1.05, textAlign: "center" }}>王命</div>
        </div>
      </Cam>
      <Glow x="60%" y="30%" k={0.22} />
      <Vig k={0.85} />
      <Reveal at={st + 20} style={{ position: "absolute", left: 160, top: 780, fontFamily: SERIF, fontSize: 44, color: C.cream, letterSpacing: 6 }}>이미 내린 명령</Reveal>
    </AbsoluteFill>
  );
};

/* 17. 오늘의 사직서와 다르다 (C3G) */
export const Resign: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const neq = ease(f, sAt(cut, 1) - 10, sAt(cut, 1) + 20);
  return (
    <AbsoluteFill style={{ background: "#101214", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        <div style={{ position: "absolute", left: 240, top: 200, width: 460, height: 640, background: "#F4F4F2", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(-3deg)", padding: 50, boxSizing: "border-box" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: "#222", textAlign: "center", letterSpacing: 14 }}>사 직 서</div>
          {[...Array(9)].map((_, i) => <div key={i} style={{ height: 10, background: "#D8D8D6", marginTop: 34, width: `${70 + (i % 3) * 10}%` }} />)}
        </div>
        <div style={{ position: "absolute", left: 1180, top: 220, transform: "rotate(3deg)" }}>
          <Letter w={520} h={600} seed={131} cols={5} fold={false} date={false} />
        </div>
      </Cam>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(200,215,230,0.06), rgba(0,0,0,0) 45%, rgba(255,190,120,0.08))" }} />
      <Vig k={0.75} />
      <div style={{ position: "absolute", left: 0, width: W, top: 420, textAlign: "center", fontFamily: SERIF, fontSize: 160, color: C.red, opacity: neq, transform: `scale(${1.3 - 0.3 * neq})` }}>≠</div>
      <Reveal at={10} style={{ position: "absolute", left: 240, width: 460, top: 870, textAlign: "center", fontFamily: SANS, fontSize: 30, color: "#AAB3BE" }}>오늘의 사직서</Reveal>
      <Reveal at={24} style={{ position: "absolute", left: 1180, width: 520, top: 870, textAlign: "center", fontFamily: SERIF, fontSize: 30, color: "#CDB98F" }}>1798년의 사직 상소</Reveal>
    </AbsoluteFill>
  );
};

/* 18. 신하의 글에 들어온 왕의 손 (C41 / C43) */
export const Draft: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const stage = cut.p.stage;
  const write = stage === 1 ? ease(f, 10, sEnd(cut, 0)) : 1;
  const king = stage === 2 ? ease(f, 10, cut.duration - 30) : ease(f, sAt(cut, 1), sEnd(cut, 1));
  return (
    <AbsoluteFill style={{ background: "#0B0907", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.02, 0, 0]} to={[1.12, -60, 0]} origin="60% 50%">
        <div style={{ position: "absolute", left: 360, top: 170 }}>
          <Paper w={1200} h={700} tint="#E6D9BE">
            <Letter w={1200} h={700} seed={52} cols={12} date={false} fold={false} reveal={write} tint="transparent" style={{ boxShadow: "none", background: "transparent" }} />
          </Paper>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 700, clipPath: `inset(0 0 0 ${100 - king * 100}%)` }}>
            <svg width={1200} height={700}>
              {[...Array(5)].map((_, i) => (
                <g key={i}>
                  <path d={`M ${1080 - i * 190} 120 C ${1060 - i * 190} 260, ${1100 - i * 190} 420, ${1070 - i * 190} 590`} stroke="#7A1E18" strokeWidth={5} fill="none" opacity={0.85} />
                  <circle cx={1040 - i * 190} cy={200 + (i % 3) * 120} r={34} fill="none" stroke="#7A1E18" strokeWidth={4} opacity={0.8} />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </Cam>
      <Glow x="70%" y="30%" k={0.2} />
      <Vig k={0.8} />
      <Reveal at={stage === 1 ? 10 : 0} style={{ position: "absolute", left: 140, top: 180, fontFamily: SERIF, fontSize: 36, color: "#CDB98F", letterSpacing: 4, lineHeight: 1.7 }}>
        <div>신하가 올릴 글</div>
        <div style={{ color: "#D98C73", opacity: king }}>+ 왕의 붓</div>
      </Reveal>
      <Reveal at={stage === 1 ? sAt(cut, 1) : 0} style={{ position: "absolute", left: 140, top: 860, fontFamily: SANS, fontSize: 22, color: "#8C7A5C" }}>※ 초고 글씨는 재구성 · 구체적 문구는 싣지 않음</Reveal>
    </AbsoluteFill>
  );
};

/* 19. 박물관 (C42 / C57) */
export const Museum: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const vx = interpolate(f, [0, cut.duration], [-300, 2100]);
  return (
    <AbsoluteFill style={{ background: "#0B0C0E", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.1, 0, 0]} to={[1.0, 0, 0]}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(240,235,220,0.18), rgba(0,0,0,0) 50%)" }} />
        <div style={{ position: "absolute", left: 560, top: 420, width: 800, height: 380, background: "rgba(200,215,225,0.06)", border: "2px solid rgba(220,230,240,0.25)" }}>
          <div style={{ position: "absolute", left: 90, top: 60, display: "flex", gap: 10, transform: "perspective(900px) rotateX(40deg)" }}>
            <Letter w={300} h={240} seed={141} cols={4} date={false} fold={false} />
            <Letter w={300} h={240} seed={143} cols={4} date={false} fold={false} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 560, top: 800, width: 800, height: 200, background: "#15171B" }} />
        <div style={{ position: "absolute", left: 1400, top: 640, width: 240, height: 110, background: "#E8E4DA", padding: 14, boxSizing: "border-box", fontFamily: SANS, fontSize: 20, color: "#333" }}>
          <div style={{ fontWeight: 700 }}>정조 어찰첩</div>
          <div style={{ fontSize: 16, marginTop: 6, color: "#666" }}>正祖御札帖</div>
        </div>
      </Cam>
      <svg width={W} height={H} style={{ position: "absolute", filter: "blur(8px)" }}>
        <Walker x={vx} y={1180} s={1.8} phase={f * 0.25} fill="#050505" />
      </svg>
      <Vig k={0.8} color="3,3,4" />
      {p.year && <Reveal at={10} style={{ position: "absolute", left: 160, top: 220, fontFamily: SERIF, fontWeight: 600, fontSize: 120, color: "#E8E6E0" }}>{p.year}</Reveal>}
      <Reveal at={20} style={{ position: "absolute", left: 160, top: p.year ? 370 : 220, fontFamily: SANS, fontSize: 34, color: "#C9CCD2", letterSpacing: 2 }}>{p.label}</Reveal>
    </AbsoluteFill>
  );
};

/* 20. 회의 전에 전해진 초안 (C44) */
export const Meeting: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const send = ease(f, 20, 90);
  return (
    <AbsoluteFill style={{ background: "#14171B", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.05, 0, 0]}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <rect x={460} y={380} width={1000} height={320} rx={40} fill="#2A2F36" />
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <rect x={540 + i * 190} y={300} width={110} height={60} rx={14} fill="#1E2227" />
              <rect x={540 + i * 190} y={720} width={110} height={60} rx={14} fill="#1E2227" />
            </g>
          ))}
          <rect x={1520} y={500} width={70} height={110} rx={14} fill="#3A3F46" />
          <g transform={`translate(${1600 - 780 * send} ${560 - 170 * send})`}>
            <rect x={-40} y={-50} width={80} height={100} fill="#E8E8E4" />
            <rect x={-30} y={-30} width={60} height={6} fill="#999" />
            <rect x={-30} y={-14} width={50} height={6} fill="#999" />
          </g>
          <circle cx={820} cy={390} r={90} fill="#E9C46A" opacity={0.12 * send} />
        </svg>
      </Cam>
      <Vig k={0.7} color="4,5,7" />
      <Reveal at={40} style={{ position: "absolute", left: 700, top: 170, fontFamily: SANS, fontSize: 32, color: "#E9C46A" }}>회의 전에 먼저 · 의견과 초안</Reveal>
      <Reveal at={sAt(cut, 1)} style={{ position: "absolute", left: 160, top: 820, fontFamily: SANS, fontSize: 28, color: "#AAB3BE" }}>회의장에서 오간 말만으로는 알기 어려운 준비 과정</Reveal>
    </AbsoluteFill>
  );
};

/* 21. 297통이 쌓여 첩이 되다 (C53) */
export const Stack: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const dur = cut.duration;
  const n = Math.round(interpolate(f, [10, dur - 60], [0, 297], { ...clamp, easing: Easing.in(Easing.quad) }));
  const bound = ease(f, dur - 50, dur - 20);
  const year = Math.round(interpolate(f, [10, dur - 60], [1796, 1800], clamp));
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <Cam dur={dur} to={[1.05, 0, 0]}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          {[...Array(Math.min(60, Math.ceil(n / 5)))].map((_, i) => (
            <rect key={i} x={760 + ((i * 37) % 13) - 6} y={760 - i * 6} width={400} height={20} fill={i % 2 ? "#E3D6B8" : "#D8CAA9"} transform={`rotate(${((i * 53) % 7) - 3} 960 ${760 - i * 6})`} opacity={1 - bound} />
          ))}
          <g opacity={bound} transform={`translate(760 ${400 + (1 - bound) * 20})`}>
            <rect x={0} y={0} width={400} height={380} fill="#3A2A1E" />
            <rect x={300} y={30} width={70} height={260} fill="#E3D6B8" />
            <text x={335} y={70} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={34} fill="#3A2A1A" style={{ writingMode: "vertical-rl" } as React.CSSProperties}>正祖御札帖</text>
          </g>
        </svg>
      </Cam>
      <Glow x="50%" y="35%" k={0.22} />
      <Vig k={0.8} />
      <div style={{ position: "absolute", left: 1320, top: 360, fontFamily: SERIF, color: C.cream }}>
        <div style={{ fontSize: 150, fontWeight: 600 }}>{n}<span style={{ fontSize: 60 }}>통</span></div>
        <div style={{ fontSize: 40, color: "#CDB98F", letterSpacing: 4 }}>{year}년</div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line x1={300} y1={900} x2={1620} y2={900} stroke="#5A4A34" strokeWidth={3} />
        <line x1={300} y1={900} x2={300 + 1320 * ((year - 1796) / 4)} y2={900} stroke="#C9A66B" strokeWidth={5} />
        {[1796, 1797, 1798, 1799, 1800].map((y, i) => (
          <text key={y} x={300 + i * 330} y={940} textAnchor="middle" fontFamily={SERIF} fontSize={24} fill="#8C7A5C">{y}</text>
        ))}
      </svg>
      <Reveal at={dur - 40} style={{ position: "absolute", left: 120, top: 360, fontFamily: SERIF, fontSize: 52, color: C.cream, letterSpacing: 6 }}>『정조 어찰첩』</Reveal>
    </AbsoluteFill>
  );
};

/* 22. 297이라는 숫자 (C54) */
export const Number: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const words: string[] = cut.p.words;
  const w0 = sAt(cut, 3);
  return (
    <AbsoluteFill style={{ background: "#08070A", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1, 0, 0]} to={[1.12, 0, 0]}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 340, color: C.cream, opacity: 0.9 - 0.6 * ease(f, sAt(cut, 2), sAt(cut, 2) + 40), textShadow: "0 0 60px rgba(255,190,110,0.25)" }}>297</div>
        </AbsoluteFill>
      </Cam>
      <Vig k={0.85} />
      {words.map((w, i) => (
        <Reveal key={i} at={wAt(cut, ["털어", "당부", "알려"][i], w0 + i * 50)} dur={24} style={{ position: "absolute", left: [180, 1100, 560][i], top: [320, 460, 720][i], fontFamily: SERIF, fontSize: 48, color: ["#E8A28F", "#E6D2A8", "#AFC1DA"][i], letterSpacing: 4 }}>
          {w}
        </Reveal>
      ))}
    </AbsoluteFill>
  );
};

/* 23. 뒤집힌 시간의 방향 (C58) */
export const Time: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const flip = ease(f, sAt(cut, 3), sAt(cut, 3) + 40);
  const lx = interpolate(f, mono([sAt(cut, 1), sAt(cut, 3)]), [520, 1400], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: "#08080A", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 16% 55%, rgba(255,180,100,${0.2 + 0.25 * (1 - flip)}) 0%, rgba(0,0,0,0) 30%), radial-gradient(ellipse at 85% 55%, rgba(160,185,230,${0.2 + 0.25 * flip}) 0%, rgba(0,0,0,0) 30%)` }} />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <King x={300} y={760} s={0.9} fill="#050403" />
          <g transform="translate(1640 760) scale(-0.9 0.9)">
            <path d="M -110 0 C -110 -140 -80 -220 -30 -250 L 40 -250 C 90 -220 110 -140 110 0 Z" fill="#0C0D10" />
            <circle cx={0} cy={-300} r={50} fill="#0C0D10" />
          </g>
          <line x1={420} y1={820} x2={1520} y2={820} stroke="#5A4A34" strokeWidth={2} />
          <text x={420} y={870} fontFamily={SERIF} fontSize={28} fill="#B9A57F">1798</text>
          <text x={960} y={870} textAnchor="middle" fontFamily={SERIF} fontSize={28} fill="#8C7A5C">2009</text>
          <text x={1520} y={870} textAnchor="end" fontFamily={SERIF} fontSize={28} fill="#AFC1DA">오늘</text>
          <g transform={`translate(${lx} 600)`}>
            <rect x={-60} y={-40} width={120} height={80} fill="#E7DABD" />
            <path d={flip > 0.5 ? "M -110 0 L -80 -14 L -80 14 Z" : "M 110 0 L 80 -14 L 80 14 Z"} fill="#C9A66B" />
          </g>
        </svg>
      </Cam>
      <Vig k={0.85} />
      <Reveal at={sAt(cut, 1)} out={sAt(cut, 3)} style={{ position: "absolute", left: 160, top: 240, fontFamily: SERIF, fontSize: 40, color: "#E6D2A8" }}>그때의 상대를 향한 글</Reveal>
      <Reveal at={sAt(cut, 3) + 20} style={{ position: "absolute", right: 160, top: 240, fontFamily: SERIF, fontSize: 40, color: "#C7D3E6" }}>글을 쓴 왕을 보는 눈</Reveal>
    </AbsoluteFill>
  );
};

/* 24. 여러분이라면 (E7) */
export const Choice: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const sway = Math.sin(f * 0.04) * 60;
  return (
    <AbsoluteFill style={{ background: "#060505", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <rect x={1260} y={600} width={420} height={220} fill="#1D140D" />
        <rect x={1290} y={630} width={360} height={170} fill="#120C08" />
      </svg>
      <Flame x={420} y={640} s={1.2} id="ch" />
      <div style={{ position: "absolute", left: 800 + sway, top: 320, transform: `rotate(${sway * 0.05}deg)` }}>
        <Letter w={320} h={240} seed={151} cols={4} fold />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(255,150,70,0.12), rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(150,175,215,0.12))" }} />
      <Vig k={0.85} />
      <Reveal at={sAt(cut, 1)} style={{ position: "absolute", left: 320, top: 860, width: 200, textAlign: "center", fontFamily: SERIF, fontSize: 48, color: "#F0B27A", letterSpacing: 8 }}>{p.left}</Reveal>
      <Reveal at={sAt(cut, 2)} style={{ position: "absolute", left: 1370, top: 860, width: 200, textAlign: "center", fontFamily: SERIF, fontSize: 48, color: "#C7D3E6", letterSpacing: 8 }}>{p.right}</Reveal>
    </AbsoluteFill>
  );
};

/* 25. 마무리 인사 (E8) */
export const Outro: React.FC<SP> = ({ cut }) => (
  <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
    <Cam dur={cut.duration} to={[1.05, 0, 0]}>
      <div style={{ position: "absolute", left: 560, top: 420, transform: "perspective(900px) rotateX(55deg) rotate(-4deg)" }}>
        <Letter w={520} h={360} seed={11} cols={5} fold />
      </div>
      <Flame x={1320} y={560} s={0.8} id="out" />
    </Cam>
    <Glow x="68%" y="45%" k={0.25} />
    <Vig k={0.88} />
    <Reveal at={sAt(cut, 0)} style={{ position: "absolute", left: 0, width: W, top: 230, textAlign: "center", fontFamily: SERIF, fontSize: 44, color: C.cream, letterSpacing: 6 }}>여러분의 생각을 댓글로</Reveal>
  </AbsoluteFill>
);

/* 26. 최종 화면 20초 (END): 편지와 촛불만 */
export const EndScreen: React.FC<SP> = () => (
  <AbsoluteFill style={{ background: "#040302", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 300, top: 470, transform: "perspective(900px) rotateX(55deg) rotate(-4deg)", opacity: 0.7 }}>
      <Letter w={440} h={300} seed={11} cols={4} fold />
    </div>
    <Flame x={900} y={600} s={0.6} id="end" />
    <Glow x="45%" y="50%" k={0.18} />
    <Vig k={0.9} />
  </AbsoluteFill>
);

export const unused = [H, INK, King, Hall, Paper, flick];
