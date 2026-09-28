/** 정조 편 장면 1: 편지·방·촛불·문갑·장 제목·인용·인물·두 사람 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  BRUSH, C, Cam, mono, Calli, Cut, Dust, Flame, Glow, H, Hall, INK, King, Letter, Official, Paper, PaperDoor, QuoteText, Rays, Reveal, SANS, SERIF, SP, Scholar, Vig, W, clamp, ease, flick, fr, sAt, sEnd, wAt,
} from "./kit";

const Label: React.FC<{ at: number; top: string; big: string; hanja?: string; x?: number; y?: number; align?: "left" | "center" }> = ({ at, top, big, hanja, x = 1180, y = 250, align = "left" }) => (
  <Reveal at={at} dur={20} style={{ position: "absolute", left: align === "center" ? 0 : x, width: align === "center" ? W : undefined, top: y, textAlign: align }}>
    <div style={{ fontFamily: SERIF, fontSize: 30, color: "#B9A57F", letterSpacing: 8 }}>{top}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: C.cream, letterSpacing: 10, marginTop: 6 }}>
      {big} {hanja && <span style={{ fontWeight: 400, fontSize: 44, color: "#CDB98F", letterSpacing: 6 }}>{hanja}</span>}
    </div>
  </Reveal>
);

/* 1. 접힌 편지가 펼쳐진다 (O1 인용 / P1 가까이 / E5 날짜) */
export const Unfold: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const light = ease(f, 0, 30);
  const o0 = p.quote ? 26 : p.close ? sAt(cut, 1) - 10 : 18;
  const open = ease(f, o0, o0 + 46, 0, 1, Easing.inOut(Easing.quad));
  const dolly = p.close ? 1.25 + 0.25 * ease(f, 0, cut.duration, 0, 1, Easing.linear) : 1.12 + 0.1 * ease(f, 0, cut.duration, 0, 1, Easing.linear);
  const q = p.quote ? sAt(cut, 0) : 0;
  const dim = p.quote ? ease(f, q - 10, q + 10) : 0;
  const dateHi = p.date ? ease(f, sAt(cut, 1), sAt(cut, 1) + 20) : 0;
  return (
    <AbsoluteFill style={{ background: "#050403" }}>
      <AbsoluteFill style={{ perspective: 1700, transform: `scale(${dolly})`, opacity: light }}>
        <div style={{ position: "absolute", left: W / 2 - 380, top: 110, width: 760, height: 1000, transformStyle: "preserve-3d", transform: "rotateX(34deg) rotateZ(-3deg)" }}>
          <Paper w={760} h={500} style={{ top: 500 }}>
            <div style={{ position: "absolute", top: -500, width: 760, height: 1000 }}>
              <Calli w={760} h={1000} seed={11} />
            </div>
          </Paper>
          <div style={{ position: "absolute", top: 0, width: 760, height: 500, transformOrigin: "50% 100%", transformStyle: "preserve-3d", transform: `rotateX(${-178 * (1 - open)}deg)` }}>
            <Paper w={760} h={500} style={{ backfaceVisibility: "hidden" }}>
              <Calli w={760} h={1000} seed={11} />
              {p.date && <div style={{ position: "absolute", left: 16, top: 90, width: 70, height: 300, borderRadius: 40, boxShadow: `0 0 40px 20px rgba(255,200,120,${0.45 * dateHi})` }} />}
            </Paper>
            <Paper w={760} h={500} tint="#D9CBAD" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 78% 22%, rgba(255,190,110,${0.28 * flick(f) * light}) 0%, rgba(0,0,0,0) 45%), radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(5,4,3,0.92) 85%)` }} />
      <Dust n={36} seed={5} area={[900, 120, 1000, 800]} />
      {p.quote && (
        <>
          <AbsoluteFill style={{ background: `rgba(6,5,4,${0.74 * dim})` }} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <QuoteText cut={cut} lines={p.quote.split("|")} />
            <Reveal at={sEnd(cut, 0) - 20} style={{ marginTop: 30, fontFamily: SERIF, fontSize: 28, color: "#B9A57F", letterSpacing: 6 }}>{p.src}</Reveal>
          </AbsoluteFill>
        </>
      )}
      {p.date && <Label at={sAt(cut, 1) + 10} top="심환지가 적은" big="받은 날짜" x={1260} y={640} />}
    </AbsoluteFill>
  );
};

/* 2. 창호지 문의 그림자와 서안 (O2 / C19 생각 / C55 읽기) */
export const Room: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const k = flick(f);
  const p = cut.p;
  const lab = p.label ? sAt(cut, p.labelAt ?? 0) : 0;
  return (
    <AbsoluteFill style={{ background: "#090705", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.08, -20, 0]} origin="62% 60%">
        <div style={{ position: "absolute", left: 120, top: 150, width: 860, height: 640, filter: "blur(3px)" }}>
          <PaperDoor w={860} h={640} glow={`rgba(236,200,140,${0.5 * k})`}>
            <g transform={`translate(${470 + 4 * Math.sin(f * 0.05)} 640) scale(${1 + 0.2 * (k - 1)} 1)`} opacity={0.72}>
              <Scholar x={0} y={0} read={p.pose === "read" ? 1 : p.pose === "think" ? 0.3 * Math.sin(f * 0.03) : 0} />
            </g>
          </PaperDoor>
        </div>
        <div style={{ position: "absolute", left: 0, top: 780, width: W, height: 400, background: "linear-gradient(#1B130C, #0A0705)" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <path d="M 1000 700 L 1760 700 L 1840 800 L 920 800 Z" fill="#3A2616" />
          <path d="M 920 800 L 1840 800 L 1840 826 L 920 826 Z" fill="#24170D" />
          <rect x={960} y={826} width={26} height={150} fill="#1C120A" />
          <rect x={1780} y={826} width={26} height={150} fill="#1C120A" />
        </svg>
        <div style={{ position: "absolute", left: 1150, top: 700, width: 360, height: 90, transform: "perspective(600px) rotateX(62deg) rotateZ(-4deg)", transformOrigin: "50% 100%" }}>
          <Letter w={360} h={220} seed={5} cols={6} date={false} fold={false} style={{ top: -130 }} />
        </div>
        <Flame x={1640} y={640} s={0.62} id="room" />
      </Cam>
      <Glow x="82%" y="55%" k={0.16} r={40} />
      <Vig k={0.85} at="55% 55%" />
      <Dust n={30} seed={9} area={[1100, 200, 800, 700]} />
      {p.label && <Label at={lab} top={p.label[0]} big={p.label[1]} hanja={p.label[2]} />}
    </AbsoluteFill>
  );
};

/* 3. 편지 글씨 위를 흐르는 카메라 (O3 / P2 / C13 거칠게 / C33 도장 / C59 날짜) */
export const Macro: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const dur = cut.duration;
  const dir = p.dir ?? 1;
  const x = interpolate(f, [0, dur], dir > 0 ? [-120, p.date ? -1180 : -980] : [-1000, -160], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const blur = interpolate(f, [0, 18, dur - 14, dur], [6, 0, 0, 2], clamp);
  const shake = p.harsh ? Math.sin(f * 1.7) * 1.5 : 0;
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: x + shake, top: -420, transform: `scale(${p.harsh ? 2.6 : 2.3}) rotate(${p.harsh ? -5 : -2}deg)`, transformOrigin: "0 0", filter: `blur(${blur}px)` }}>
        <Letter w={760} h={1000} seed={p.seed ?? 11} fold={false} />
      </div>
      {p.harsh ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(255,120,70,${0.18 * flick(f)}) 0%, rgba(0,0,0,0) 55%)`, mixBlendMode: "screen" }} />
      ) : (
        <Glow x={`${70 - 30 * (f / dur)}%`} y="40%" k={0.22} r={50} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,3,0.85), rgba(5,4,3,0) 30%, rgba(5,4,3,0) 70%, rgba(5,4,3,0.8))" }} />
      <Vig k={0.8} />
      {p.stamps &&
        p.stamps.map((t: string, i: number) => {
          const key = ["의견", "당부", "꾸짖", "언제"][i] ?? t;
          const a = wAt(cut, key, 20 + i * 40);
          const sc = ease(f, a, a + 6, 1.5, 1, Easing.out(Easing.back(2)));
          return (
            <div key={i} style={{ position: "absolute", left: 300 + i * 360, top: 330 + (i % 2) * 180, opacity: ease(f, a, a + 5), transform: `scale(${sc}) rotate(${-6 + i * 4}deg)`, border: `5px solid ${C.red}`, padding: "10px 24px", fontFamily: SERIF, fontWeight: 600, fontSize: 52, color: C.red, background: "rgba(236,225,200,0.7)" }}>
              {t}
            </div>
          );
        })}
    </AbsoluteFill>
  );
};

/* 4. 촛불로 다가가는 편지 (O4 / C47) */
export const FlameScene: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const stop = wAt(cut, cut.p.stopWord ?? "없애", cut.duration - 30);
  const p = ease(f, stop - 70, stop + 10, 0, 1, Easing.out(Easing.cubic));
  const heat = ease(f, stop - 6, stop + 20);
  return (
    <AbsoluteFill style={{ background: "#040302", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.06, -30, 10]}>
        <div style={{ position: "absolute", left: -900 + 1060 * p, top: 360, transform: "rotate(-14deg)", transformOrigin: "100% 0", filter: "blur(1.2px)" }}>
          <Letter w={900} h={520} seed={4} cols={8} date={false} fold={false} />
          <div style={{ position: "absolute", right: 0, top: 0, width: 260, height: 520, background: `linear-gradient(90deg, rgba(255,150,60,0), rgba(255,140,50,${0.55 * heat}))` }} />
        </div>
        <Flame x={1260} y={600} s={2.4} id="big" />
      </Cam>
      <Vig k={0.9} at="64% 45%" />
      <Dust n={24} color="#FFC98A" seed={12} area={[900, 150, 700, 600]} />
    </AbsoluteFill>
  );
};

/* 5. 달빛 아래 문갑 (O5 제목 / C3H 열기 / C56 질문 / E6) */
export const Drawer: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const dur = cut.duration;
  const title = p.title ? sEnd(cut, cut.sentences.length - 1) + 6 : 0;
  const slide = p.open ? ease(f, 0, 50) : 1;
  return (
    <AbsoluteFill style={{ background: "#05070B", overflow: "hidden" }}>
      <Cam dur={dur} from={[1.04, 0, 0]} to={[1, 0, 0]}>
        <div style={{ position: "absolute", left: 560, top: 250 + (1 - slide) * 200, width: 800, height: 560, background: "#1D140D", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
          <div style={{ position: "absolute", inset: 34, background: "#120C08" }} />
          {[2, 1].map((k) => (
            <Paper key={k} w={620} h={400} tint="#BDB7A8" style={{ left: 92 + k * 8, top: 82 - k * 10, transform: `rotate(${k * 2}deg)` }} />
          ))}
          <Paper w={620} h={400} tint="#C9C4B6" style={{ left: 92, top: 82, transform: "rotate(-3deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            <Calli w={620} h={400} seed={21} cols={6} />
            <div style={{ position: "absolute", top: 196, width: 620, height: 6, background: "rgba(0,0,0,0.18)" }} />
          </Paper>
        </div>
        <Rays k={0.34} />
        <Dust n={40} color="#C9D8EE" seed={17} area={[500, 100, 1000, 800]} />
      </Cam>
      <Vig k={0.9} color="2,3,6" at="55% 50%" />
      {p.questions &&
        p.questions.map((q: string, i: number) => (
          <Reveal key={i} at={sAt(cut, 1) + i * 40} out={sAt(cut, 2)} style={{ position: "absolute", left: i ? 1300 : 140, top: 300 + i * 260, fontFamily: SERIF, fontSize: 44, color: "#DDE6F1", letterSpacing: 4 }}>
            {q}
          </Reveal>
        ))}
      {p.title && (
        <>
          <AbsoluteFill style={{ background: `rgba(3,4,7,${0.8 * ease(f, title - 6, title + 20)})` }} />
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Reveal at={title} dur={20} style={{ fontFamily: SERIF, fontSize: 60, color: "#DDE6F1", letterSpacing: 12 }}>{p.title[0]}</Reveal>
            <Reveal at={title + 16} dur={22} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 170, color: "#F1F5FA", letterSpacing: 8, textShadow: "0 0 40px rgba(160,190,230,0.45)" }}>
              {p.title[1].replace("통", "")}
              <span style={{ fontSize: 90 }}>통</span>
            </Reveal>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};

/* 6. 장 제목 */
export const Chapter: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const dur = cut.duration;
  const ink = ease(f, 10, 50, 0, 1, Easing.out(Easing.cubic));
  const bg = (() => {
    switch (p.bg) {
      case "palace":
        return (
          <AbsoluteFill style={{ background: "linear-gradient(#0B1220 0%, #22324A 62%, #05070C 80%)" }}>
            <svg width={W} height={H} style={{ position: "absolute" }}>
              <circle cx={1450} cy={300} r={70} fill="#DCE6F3" opacity={0.9} />
              <circle cx={1450} cy={300} r={200} fill="#9FB6D6" opacity={0.08} />
              <Hall x={700 - f * 0.3} y={620} w={900} fill="#070A10" lit />
              <Hall x={1500 - f * 0.6} y={700} w={600} s={0.8} fill="#05070A" />
            </svg>
          </AbsoluteFill>
        );
      case "moon":
        return (
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 35%, #1A2436, #05070B 70%)" }}>
            <svg width={W} height={H} style={{ position: "absolute" }}>
              <circle cx={1180} cy={380} r={120} fill="#E4ECF6" opacity={0.92} />
              {[0, 1, 2].map((i) => (
                <ellipse key={i} cx={((900 + i * 500 + f * (0.8 + i * 0.4)) % 2400) - 200} cy={330 + i * 70} rx={260} ry={34} fill="#0B111C" opacity={0.8} />
              ))}
            </svg>
          </AbsoluteFill>
        );
      case "court":
        return (
          <AbsoluteFill style={{ background: "linear-gradient(#56657A, #1E2531 60%, #0E1117)" }}>
            <svg width={W} height={H} style={{ position: "absolute" }}>
              <Hall x={960} y={460} w={1100} fill="#11151C" />
              {[...Array(6)].map((_, i) => (
                <g key={i}>
                  <rect x={700 - i * 60} y={680 + i * 50} width={16} height={24} fill="#1A1F28" />
                  <rect x={1204 + i * 60} y={680 + i * 50} width={16} height={24} fill="#1A1F28" />
                </g>
              ))}
            </svg>
          </AbsoluteFill>
        );
      case "draft":
        return (
          <AbsoluteFill style={{ background: "#0B0906" }}>
            <div style={{ position: "absolute", left: 360, top: 120, transform: "rotate(-4deg) scale(1.3)", opacity: 0.35, filter: "blur(2px)" }}>
              <Letter w={1200} h={620} seed={52} cols={12} date={false} fold={false} />
            </div>
          </AbsoluteFill>
        );
      case "phone":
        return (
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1B2230, #06070A 70%)" }}>
            {[...Array(14)].map((_, i) => (
              <div key={i} style={{ position: "absolute", left: (i * 157) % W, top: 200 + ((i * 97) % 600), width: 60 + (i % 4) * 30, height: 60 + (i % 4) * 30, borderRadius: "50%", background: i % 3 ? "#7FA2D6" : "#E6C38A", opacity: 0.12, filter: "blur(18px)" }} />
            ))}
          </AbsoluteFill>
        );
      default:
        return (
          <AbsoluteFill style={{ background: "#070504" }}>
            <svg width={W} height={H} style={{ position: "absolute", filter: "blur(10px)" }}>
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={960 + [-200, 180, -60, 260][i]} cy={540 + [60, -40, 120, 90][i]} r={ink * (160 + i * 60)} fill="#1C130C" opacity={0.8} />
              ))}
            </svg>
          </AbsoluteFill>
        );
    }
  })();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Cam dur={dur} to={[1.05, 0, 0]}>{bg}</Cam>
      <Vig k={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Reveal at={8} dur={20} style={{ fontFamily: SERIF, fontSize: 32, color: "#C9A66B", letterSpacing: 14 }}>{p.n}</Reveal>
        <Reveal at={20} dur={24} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: C.cream, letterSpacing: 8, marginTop: 18 }}>{p.title}</Reveal>
        <svg width={600} height={40} style={{ marginTop: 20 }}>
          <path d="M 20 22 Q 160 8 300 20 T 580 18" stroke="#8C2A22" strokeWidth={6} strokeLinecap="round" fill="none" strokeDasharray={620} strokeDashoffset={620 * (1 - ease(f, 34, 60))} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 7. 인용 카드 (C22 / C23 / C35 / C3A) */
export const Quote: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const qi = cut.sentences.findIndex((s) => s.quote);
  const at = qi >= 0 ? sAt(cut, qi) : sAt(cut, cut.sentences.length > 1 ? 1 : 0);
  const cold = p.cold;
  return (
    <AbsoluteFill style={{ background: cold ? "#06080C" : "#070504", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.2, 0, 0]} to={[1.3, -60, 0]}>
        <div style={{ position: "absolute", left: 300, top: -200, transform: "rotate(-8deg) scale(1.6)", filter: "blur(7px)", opacity: 0.45 }}>
          <Letter w={900} h={900} seed={cut.id.length * 13 + 7} cols={8} fold={false} tint={cold ? "#AEB6C2" : undefined} />
        </div>
      </Cam>
      <AbsoluteFill style={{ background: cold ? "rgba(4,6,10,0.55)" : "rgba(6,5,4,0.55)" }} />
      {cold ? <Glow x="50%" y="30%" color="160,185,220" k={0.18} r={55} /> : <Glow x="70%" y="30%" k={p.warm ? 0.3 : 0.2} r={50} />}
      <Vig k={0.9} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <QuoteText cut={cut} lines={p.quote.split("|")} sent={qi >= 0 ? qi : undefined} size={p.quote.length < 10 ? 110 : 70} color={cold ? "#E6ECF3" : C.cream} glow={cold ? "rgba(160,190,230,0.35)" : undefined} />
        <Reveal at={at + 20} style={{ marginTop: 30, fontFamily: SERIF, fontSize: 28, color: cold ? "#8FA3B8" : "#B9A57F", letterSpacing: 6 }}>{p.src}</Reveal>
        {p.note && (
          <Reveal at={sAt(cut, 1)} style={{ marginTop: 40, fontFamily: SERIF, fontSize: 38, color: "#DCC9A2", letterSpacing: 4, borderTop: "1px solid rgba(220,200,160,0.4)", paddingTop: 20 }}>
            {p.note}
          </Reveal>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 8. 두 사람 (P8 far / C32 facing / C36 side / C3B tension / C3F question / C46 flow / E4 close) */
export const Figures: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const dur = cut.duration;
  const floor = (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(#1E1915 0%, #2A221B 50%, #1A140F 64%, #0A0806 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 28% 45%, rgba(255,196,130,${0.32 * flick(f)}) 0%, rgba(0,0,0,0) 38%), radial-gradient(ellipse at 72% 45%, rgba(${p.mode === "tension" ? "170,190,225" : "255,196,130"},0.26) 0%, rgba(0,0,0,0) 38%)` }} />
    </>
  );
  const pool = (x: number, k = 0.22, color = "255,190,120") => (
    <div style={{ position: "absolute", left: x - 320, top: 520, width: 640, height: 560, background: `radial-gradient(ellipse at 50% 60%, rgba(${color},${k}) 0%, rgba(0,0,0,0) 60%)` }} />
  );
  const mode = p.mode;
  if (mode === "far") {
    return (
      <AbsoluteFill style={{ background: "#07060A", overflow: "hidden" }}>
        <Cam dur={dur} from={[1, 0, 0]} to={[1.35, 0, 60]} origin="50% 55%">
          <AbsoluteFill style={{ background: "linear-gradient(#1A1612, #241C15 55%, #16110C 55%, #07050A)" }} />
          <svg width={W} height={H} style={{ position: "absolute" }}>
            {[...Array(8)].map((_, i) => (
              <rect key={i} x={260 + i * 200} y={140} width={40} height={460} fill="#120E0C" />
            ))}
            <rect x={760} y={470} width={400} height={130} fill="#1A130D" />
            <King x={960} y={560} s={0.42} fill="#050404" />
            <circle cx={960} cy={420} r={260} fill="#FFB870" opacity={0.08 * flick(f)} />
          </svg>
          <Flame x={820} y={470} s={0.3} id="farL" />
          <Flame x={1100} y={470} s={0.3} id="farR" />
        </Cam>
        <Vig k={0.9} />
      </AbsoluteFill>
    );
  }
  if (mode === "close") {
    const shift = ease(f, sAt(cut, 2), sAt(cut, 2) + 30);
    return (
      <AbsoluteFill style={{ background: "#060505", overflow: "hidden" }}>
        <Cam dur={dur} to={[1.06, 0, 0]}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #3A3026 0%, #120E0B 55%)" }} />
          <svg width={W} height={H} style={{ position: "absolute" }}>
            <King x={640} y={1180} s={2.2} fill="#050403" />
            <Official x={1320} y={1180} s={2.2} flip pose="stand" fill="#050403" />
          </svg>
          <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,190,120,${0.18 * (1 - shift)}) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(150,170,210,${0.16 * shift}) 100%)`, mixBlendMode: "screen" }} />
        </Cam>
        <Vig k={0.85} />
      </AbsoluteFill>
    );
  }
  let kx = 520;
  let ox = 1400;
  let oFlip = true;
  let oPose: "stand" | "bow" | "sit" = "stand";
  let kPose: "sit" | "stand" = "stand";
  let extra: React.ReactNode = null;
  if (mode === "facing") {
    const la = sAt(cut, p.letterAt ?? 2);
    const near = ease(f, la, la + 60);
    kx = 420 + 220 * near;
    ox = 1500 - 220 * near;
    const lp = ease(f, la - 10, la + 20);
    extra = (
      <g opacity={lp} transform={`translate(960 ${520 - 10 * Math.sin(f * 0.05)})`}>
        <circle r={140} fill="#FFD9A0" opacity={0.12} />
        <rect x={-50} y={-34} width={100} height={68} fill="#E8DBBE" />
        <line x1={-30} y1={-20} x2={-30} y2={20} stroke={INK} strokeWidth={3} />
        <line x1={0} y1={-20} x2={0} y2={20} stroke={INK} strokeWidth={3} />
        <line x1={30} y1={-20} x2={30} y2={20} stroke={INK} strokeWidth={3} />
      </g>
    );
  } else if (mode === "side") {
    const k = ease(f, sAt(cut, 0) + 30, sAt(cut, 0) + 80);
    kx = 760;
    ox = 1460 - 380 * k;
    oFlip = false;
  } else if (mode === "tension") {
    kPose = "sit";
    kx = 420;
    const away = ease(f, sAt(cut, 1), sAt(cut, 1) + 80);
    ox = 1350 + 180 * away;
    oFlip = away < 0.5;
    extra = <path d={`M 560 470 Q 960 ${470 + 30 * (1 - away)} ${ox - 60} 480`} stroke="#C9A66B" strokeWidth={2} fill="none" opacity={0.5} strokeDasharray="10 12" />;
  } else if (mode === "question") {
    extra = (
      <text x={960} y={560} textAnchor="middle" fontFamily={SERIF} fontSize={260} fill="#C9A66B" opacity={0.18 + 0.05 * Math.sin(f * 0.08)}>
        ?
      </text>
    );
  } else if (mode === "flow") {
    extra = (
      <g>
        {[...Array(6)].map((_, i) => {
          const t = ((f / 70 + i / 6) % 1 + 1) % 1;
          const rev = i % 2 === 1;
          const u = rev ? 1 - t : t;
          const x = 600 + 720 * u;
          const y = 470 - Math.sin(u * Math.PI) * (rev ? 110 : 180);
          return <rect key={i} x={x - 26} y={y - 18} width={52} height={36} fill="#E8DBBE" opacity={Math.sin(t * Math.PI)} />;
        })}
      </g>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#08070A", overflow: "hidden" }}>
      <Cam dur={dur} to={[1.05, 0, 0]}>
        {floor}
        {pool(kx)}
        {pool(ox, 0.16, mode === "tension" ? "150,170,210" : "255,190,120")}
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <King x={kx} y={700} s={1} pose={kPose} fill="#050403" />
          <Official x={ox} y={700} s={1} flip={oFlip} pose={oPose} fill="#050403" />
          {extra}
        </svg>
      </Cam>
      <Vig k={0.85} />
    </AbsoluteFill>
  );
};

/* 9. 인물 카드 (C31 / C3E) */
export const Person: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  return (
    <AbsoluteFill style={{ background: "#0A0A0D", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1.05, 0, 0]} to={[1.12, -30, 0]} origin="30% 60%">
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 45%, rgba(${p.stand ? "170,190,220" : "230,190,140"},0.22) 0%, rgba(0,0,0,0) 45%)` }} />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <Official x={560} y={1060} s={1.9} pose="stand" flip={!p.stand} fill="#050506" />
          <Official x={560 + (p.stand ? 4 : -4)} y={1060} s={1.9} pose="stand" flip={!p.stand} fill="none" />
        </svg>
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 20%, rgba(${p.stand ? "150,170,210" : "255,190,120"},${0.12 * flick(f)}) 32%, rgba(0,0,0,0) 40%)`, mixBlendMode: "screen" }} />
      </Cam>
      <Vig k={0.8} at="35% 50%" />
      <div style={{ position: "absolute", left: 1040, top: 360 }}>
        <Reveal at={6}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 110, color: C.cream, letterSpacing: 14 }}>
            {p.name} <span style={{ fontSize: 56, fontWeight: 400, color: "#CDB98F" }}>{p.hanja}</span>
          </div>
        </Reveal>
        <Reveal at={20} style={{ marginTop: 18, fontFamily: SERIF, fontSize: 40, color: p.stand ? "#AFC1DA" : "#C9A66B", letterSpacing: 6 }}>{p.sub}</Reveal>
      </div>
    </AbsoluteFill>
  );
};

/* 10. 두 모습: 간직하고 싶은 글씨 / 간직해선 안 될 말 (P3) */
export const Duality: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const r = wAt(cut, "안", sAt(cut, 0) + 60);
  const cut2 = ease(f, r - 10, r + 20);
  return (
    <AbsoluteFill style={{ background: "#060504", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.05, 0, 0]}>
        <div style={{ position: "absolute", left: 460, top: 90, transform: "rotate(-2deg)" }}>
          <Letter w={1000} h={900} seed={61} cols={9} fold={false} />
        </div>
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,200,130,0.12) 0%, rgba(0,0,0,0) 50%, rgba(6,8,14,${0.2 + 0.6 * cut2}) 50%)` }} />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <line x1={960} y1={60} x2={960} y2={1020} stroke="#8C2A22" strokeWidth={4} strokeDasharray={1000} strokeDashoffset={1000 * (1 - cut2)} />
        </svg>
      </Cam>
      <Vig k={0.85} />
      <Reveal at={sAt(cut, 0) + 6} style={{ position: "absolute", left: 120, top: 460, fontFamily: SERIF, fontSize: 48, color: C.cream, letterSpacing: 4, textShadow: "0 0 20px #000" }}>{p.left}</Reveal>
      <Reveal at={r} style={{ position: "absolute", right: 120, top: 460, fontFamily: SERIF, fontSize: 48, color: "#C7D3E6", letterSpacing: 4, textShadow: "0 0 20px #000" }}>{p.right}</Reveal>
    </AbsoluteFill>
  );
};

/* 11. 머뭇거림: 편지가 불 쪽으로 갔다가 돌아온다 (P4 / C51 간직) */
export const Hesitate: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const dur = cut.duration;
  const x = interpolate(f, mono([0, dur * 0.35, dur * 0.55, dur * (cut.p.keep ? 0.8 : 1)]), [0, 420, 360, cut.p.keep ? -520 : 120], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const box = cut.p.keep ? ease(f, dur * 0.6, dur * 0.85) : 0;
  return (
    <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
      <Cam dur={dur} to={[1.04, 0, 0]}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <rect x={120} y={600 + (1 - box) * 30} width={520} height={260} fill="#1D140D" opacity={0.4 + 0.6 * box} />
          <rect x={150} y={630 + (1 - box) * 30} width={460} height={200} fill="#120C08" opacity={0.4 + 0.6 * box} />
        </svg>
        <div style={{ position: "absolute", left: 620 + x, top: 330 + (cut.p.keep ? box * 260 : 0), transform: `rotate(${-6 + x * 0.01}deg) scale(${1 - box * 0.25})`, filter: "blur(0.8px)" }}>
          <Letter w={560} h={380} seed={73} cols={6} fold />
          <div style={{ position: "absolute", right: 0, top: 0, width: 200, height: 380, background: `linear-gradient(90deg, rgba(255,150,60,0), rgba(255,140,50,${0.5 * ease(x, 250, 420)}))` }} />
        </div>
        <Flame x={1580} y={560} s={1.5} id="hes" />
      </Cam>
      <Vig k={0.9} at="60% 50%" />
      <Dust n={26} seed={21} area={[1000, 200, 800, 600]} />
    </AbsoluteFill>
  );
};

/* 12. 받은 날짜를 적는 붓 (P5 / C52) */
export const DateMark: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const a = sAt(cut, 1) - 10;
  const chars = "戊午三月十四日到";
  return (
    <AbsoluteFill style={{ background: "#0A0806", overflow: "hidden" }}>
      <Cam dur={cut.duration} from={[1, 0, 0]} to={[1.12, 40, -20]} origin="30% 50%">
        <div style={{ position: "absolute", left: -900, top: -700, transform: "scale(2.6) rotate(-3deg)", transformOrigin: "0 0", filter: "blur(1.5px)" }}>
          <Letter w={760} h={1000} seed={11} date={false} fold={false} />
        </div>
        <div style={{ position: "absolute", left: 380, top: 180 }}>
          {chars.split("").map((c, i) => {
            const t = a + i * 9;
            const p = ease(f, t, t + 10);
            return (
              <div key={i} style={{ fontFamily: "'Zhi Mang Xing', cursive", fontSize: 78, lineHeight: 1.02, color: "#5A2E1C", opacity: p, filter: `blur(${(1 - p) * 4}px)` }}>
                {c}
              </div>
            );
          })}
        </div>
      </Cam>
      <Glow x="25%" y="40%" k={0.28} r={40} />
      <Vig k={0.85} at="30% 50%" />
      <Reveal at={a + 40} style={{ position: "absolute", left: 620, top: 420, fontFamily: SERIF, fontSize: 46, color: C.cream, letterSpacing: 6, textShadow: "0 0 20px #000" }}>
        받은 날짜를 적다
      </Reveal>
      <Reveal at={a + 60} style={{ position: "absolute", left: 620, top: 490, fontFamily: SANS, fontSize: 24, color: "#9C8B6E", letterSpacing: 2 }}>
        ※ 날짜 글씨는 재구성
      </Reveal>
    </AbsoluteFill>
  );
};

/* 13. 두 기록 나란히 (P6 / C5B) */
export const Scales: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const over = p.caveat ? ease(f, sAt(cut, 3), sAt(cut, 3) + 30) * (1 - ease(f, sAt(cut, 4), sAt(cut, 4) + 30)) : 0;
  const link = ease(f, p.caveat ? sAt(cut, 4) + 20 : sAt(cut, 0) + 40, (p.caveat ? sAt(cut, 4) : sAt(cut, 0)) + 90);
  return (
    <AbsoluteFill style={{ background: "#0B0A09", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(230,210,170,0.14), rgba(0,0,0,0) 60%)" }} />
        {/* 실록: 책 표지 */}
        <div style={{ position: "absolute", left: 360, top: 250, width: 440, height: 600, background: "#5B4A34", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(-2deg)" }}>
          <div style={{ position: "absolute", left: 300, top: 40, width: 90, height: 380, background: "#E3D6B8", display: "flex", justifyContent: "center", paddingTop: 20 }}>
            <div style={{ writingMode: "vertical-rl", fontFamily: SERIF, fontWeight: 600, fontSize: 48, color: "#3A2A1A", letterSpacing: 8 }}>正祖實錄</div>
          </div>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: 80 + i * 150, width: 18, height: 4, background: "#2A2018" }} />)}
        </div>
        <div style={{ position: "absolute", left: 1100 - 520 * over, top: 240 + 20 * over, transform: `rotate(${3 - 5 * over}deg)` }}>
          <Letter w={520} h={620} seed={83} cols={5} fold={false} />
        </div>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <path d="M 800 560 Q 950 500 1100 560" stroke="#E0C58F" strokeWidth={3} fill="none" strokeDasharray={320} strokeDashoffset={320 * (1 - link)} opacity={0.8} />
        </svg>
      </Cam>
      <Vig k={0.85} />
      <Reveal at={10} style={{ position: "absolute", left: 360, top: 880, width: 440, textAlign: "center", fontFamily: SERIF, fontSize: 34, color: "#CDB98F", letterSpacing: 6 }}>{p.left}</Reveal>
      <Reveal at={20} style={{ position: "absolute", left: 1100, top: 880, width: 520, textAlign: "center", fontFamily: SERIF, fontSize: 34, color: "#CDB98F", letterSpacing: 6 }}>{p.right}</Reveal>
      {p.caveat && (
        <Reveal at={sAt(cut, 3)} out={sAt(cut, 4)} style={{ position: "absolute", left: 0, width: W, top: 170, textAlign: "center", fontFamily: SERIF, fontSize: 44, color: "#E6C3B0", letterSpacing: 6 }}>
          정답지가 아니다
        </Reveal>
      )}
    </AbsoluteFill>
  );
};

/* 14. 세 가지 목소리 (P7 / C5A 합쳐짐 / E3) */
export const Moods: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = cut.p;
  const tones = ["255,110,70", "140,165,210", "255,190,120"];
  const merge = p.merge !== undefined ? ease(f, sAt(cut, p.merge), sAt(cut, p.merge) + 50) : 0;
  const n = cut.sentences.length;
  return (
    <AbsoluteFill style={{ background: "#070605", overflow: "hidden" }}>
      <Cam dur={cut.duration} to={[1.04, 0, 0]}>
        {[0, 1, 2].map((i) => {
          const at = n >= 3 ? sAt(cut, Math.min(i + (p.merge !== undefined ? 1 : 0), n - 1)) - 10 : sAt(cut, n - 1) + i * 45;
          const o = ease(f, Math.max(0, at), Math.max(0, at) + 20);
          const x = (360 + i * 600) * (1 - merge) + 960 * merge;
          return (
            <div key={i} style={{ position: "absolute", left: x - 220, top: 230 + (i === 1 ? -20 : 20) * (1 - merge), opacity: i === 1 || merge < 0.95 ? o : 0, transform: `rotate(${(i - 1) * 4 * (1 - merge)}deg)` }}>
              <Letter w={440} h={560} seed={91 + i * 7} cols={5} fold={false} />
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, rgba(${tones[i]},${0.35 * (1 - merge)}) 0%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
            </div>
          );
        })}
      </Cam>
      <Vig k={0.85} />
      {p.labels.map((t: string, i: number) => {
        const at = n >= 3 ? sAt(cut, Math.min(i + (p.merge !== undefined ? 1 : 0), n - 1)) : sAt(cut, n - 1) + i * 45;
        return (
          <Reveal key={i} at={at} out={p.merge !== undefined ? sAt(cut, p.merge) : undefined} style={{ position: "absolute", left: 100 + i * 600, width: 520, top: 830, textAlign: "center", fontFamily: SERIF, fontSize: t.length > 9 ? 34 : 40, color: `rgb(${tones[i]})`, letterSpacing: 4 }}>
            {t}
          </Reveal>
        );
      })}
      {p.merge !== undefined && (
        <Reveal at={sAt(cut, p.merge + 1)} style={{ position: "absolute", left: 0, width: W, top: 840, textAlign: "center", fontFamily: SERIF, fontSize: 44, color: C.cream, letterSpacing: 6 }}>
          한 사람의 서로 다른 목소리
        </Reveal>
      )}
    </AbsoluteFill>
  );
};

export { Label };
