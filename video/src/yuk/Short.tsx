/**
 * 육영수 편 쇼츠(1080×1920). 본편의 3D 극장·탄두를 세로 화면에 다시 배치한다.
 * 첫 화면(0프레임부터): 큰 탄두 + 큰 숫자 「5발」 + 짧은 질문 「그 1발은 어디로?」.
 * 쇼츠 화면 아래(약 25%)와 오른쪽 끝은 YouTube 버튼이 덮으므로 글자는 가운데 위쪽에 둔다.
 */
import "@fontsource/ibm-plex-sans-kr/400.css";
import "@fontsource/ibm-plex-sans-kr/500.css";
import "@fontsource/ibm-plex-sans-kr/600.css";
import "@fontsource/ibm-plex-sans-kr/700.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/noto-serif-kr/600.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/yuk_short/timeline.json";
import sound from "../../public/yuk_short/sound/cues.json";
import { Cut, FPS, SP, clamp, ease, fr, sAt } from "../jeongjo/kit";
import { GLYPHS } from "./glyphs";
import { COL, MONO, SERIF, TAGC, UI, fadeIn } from "./kit";
import { Hall, Key, Label, PODIUM, Path, SEAT_YUK, Stage3D, V3 } from "./Theater";
import { BulletMesh, EXIT, HIT, LostRings, Marker, SHOOTER, SHOTS } from "./Views3D";

export const cutsS = timeline.cuts as unknown as Cut[];
export const totalS = timeline.totalFrames;
const XF = 6;

/* ── 공통 ── */

const Head: React.FC<{ children: React.ReactNode; o?: number; top?: number; color?: string; size?: number }> = ({ children, o = 1, top = 250, color = "#FFFFFF", size = 96 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: size, color, opacity: o, textShadow: "0 6px 30px rgba(0,0,0,0.9)", lineHeight: 1.15 }}>{children}</div>
);

/** 위쪽 큰 글자 뒤를 어둡게(3D 태극기와 겹치지 않게) */
const TopShade: React.FC = () => <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 620, background: "linear-gradient(#0B0D10 55%, rgba(11,13,16,0))" }} />;

const Recon: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: UI, fontSize: 32, color: "#8E97A1" }}>3D 재구성 · 배치와 비율은 실제와 다를 수 있음</div>
);

/** 자막: 쇼츠 버튼·설명 영역 위(아래에서 약 560px), 한 줄 16자 안팎, 마침표·쉼표 없음 */
const SubsV: React.FC<{ cut: Cut }> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cards = cut.sentences.flatMap((s) => s.cards);
  const c = cards.find((c, k) => t >= c.start - 0.05 && t < Math.min((cards[k + 1]?.start ?? c.end + 0.5) - 0.02, c.end + 0.5));
  const cur = [...cut.sentences].reverse().find((s) => t >= s.start - 0.1);
  const tag = cur?.tag;
  return (
    <>
      {tag && (
        <div style={{ position: "absolute", left: 48, top: 110, display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 10px 20px", background: "rgba(8,10,12,0.8)", border: `3px solid ${TAGC[tag]}`, borderRadius: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: TAGC[tag] }} />
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 42, color: TAGC[tag] }}>{tag}</div>
        </div>
      )}
      {c && (
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 560, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "rgba(34,36,40,0.82)", padding: "14px 34px 18px", borderRadius: 10, fontFamily: UI, fontWeight: 700, fontSize: 66, color: "#FFFFFF", textAlign: "center" }}>{c.text.replace(/[.,]/g, "")}</div>
        </div>
      )}
    </>
  );
};

/* ── 장면 ── */

const VOpen: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [0, -0.2, 5.4], look: [0, -0.9, 0] },
    { f: cut.duration + 10, pos: [0, -0.1, 6.0], look: [0, -0.9, 0] },
  ];
  return (
    <AbsoluteFill style={{ background: COL.bg }}>
      <Stage3D keys={keys} light={1.2} fov={45}>
        <group position={[-0.4, -1.5, 0]} rotation={[0, 0, 0.5]}>
          <BulletMesh x={0} spin={f * 0.04} marks={0.8} />
        </group>
        <LostRings pos={[0, -1.3, 0]} grow={interpolate(f, [20, 80], [0.2, 1], clamp)} />
      </Stage3D>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: UI, fontSize: 46, color: "#C3CBD4" }}>1974 · 육영수 저격 사건</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: MONO, fontWeight: 600, fontSize: 300, color: "#FFFFFF", lineHeight: 1.1 }}>5발</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 104, color: COL.miss }}>그 1발은 어디로?</div>
    </AbsoluteFill>
  );
};

const VShots: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const shots: number[] = cut.p.shots;
  const done: number[] = cut.p.done;
  const when = (n: number) => (done.includes(n) ? -99 : sAt(cut, shots.indexOf(n)) + 4);
  const vis = (n: number) => done.includes(n) || shots.includes(n);
  const four = shots.includes(4);
  const keys: Key[] = four
    ? [
        { f: 0, pos: [8, 8, 19], look: [0.8, 2.4, -1] },
        { f: d + 10, pos: [6.5, 5.5, 5], look: [SEAT_YUK[0], 2, SEAT_YUK[2]] },
      ]
    : [
        { f: 0, pos: [10, 10, 23], look: [0.5, 2.6, -1] },
        { f: d + 10, pos: [8, 8.5, 20], look: [0.5, 2.8, -1.5] },
      ];
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.6} fov={50}>
        <Hall />
        <Marker pos={[SHOOTER[0], 0, SHOOTER[2]]} op={0.9} />
        {SHOTS.map((s, i) => {
          const n = i + 1;
          if (!vis(n)) return null;
          const p = ease(f, when(n), when(n) + 16);
          if (n === 3) return <Label key={n} pos={[SHOOTER[0] + 1, 2.3, SHOOTER[2]]} text="✕ 불발" color="#C3CBD4" op={p} size={1.3} />;
          const mid: V3 = [(SHOOTER[0] + s.to[0]) / 2, (SHOOTER[1] + s.to[1]) / 2 + 0.2, (SHOOTER[2] + s.to[2]) / 2];
          const hot = n === 4;
          return (
            <group key={n}>
              <Path pts={[SHOOTER, mid, s.to]} color={hot ? COL.miss : COL.rec} r={hot ? 0.07 : 0.05} prog={p} />
              <Label pos={[s.to[0] + 0.3, s.to[1] + 1, s.to[2]]} text={s.label} color={hot ? COL.miss : "#FFFFFF"} op={fadeIn(f, when(n) + 12)} size={hot ? 1.5 : 1.2} />
            </group>
          );
        })}
      </Stage3D>
      <TopShade />
      <Head top={200} color={four ? COL.miss : "#FFFFFF"} size={four ? 130 : 96}>{cut.p.head}</Head>
      <div style={{ position: "absolute", left: 90, right: 90, top: four ? 380 : 340, display: "flex", justifyContent: "space-between" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ width: 150, height: 150, borderRadius: 75, border: `5px solid ${n === 4 ? COL.miss : "#FFFFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 600, fontSize: 80, color: n === 4 ? COL.miss : "#FFFFFF", background: vis(n) && f >= when(n) ? (n === 4 ? "rgba(255,77,79,0.25)" : "rgba(255,255,255,0.18)") : "rgba(8,10,12,0.6)", opacity: vis(n) ? 1 : 0.35 }}>
            {n}
          </div>
        ))}
      </div>
      <Recon />
    </AbsoluteFill>
  );
};

const VExit: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const s1 = sAt(cut, 1);
  const keys: Key[] = [
    { f: 0, pos: [5.5, 4.2, 3.5], look: [SEAT_YUK[0], 2, SEAT_YUK[2]] },
    { f: d + 10, pos: [6.5, 6, 5], look: [SEAT_YUK[0] + 0.2, 2, SEAT_YUK[2] - 0.6] },
  ];
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.4} fov={50}>
        <Hall />
        <Path pts={[SHOOTER, [1.3, 1.8, 1.5], HIT]} color={COL.rec} r={0.045} />
        <Path pts={[HIT, EXIT]} color={COL.wit} r={0.06} prog={ease(f, 10, 30)} />
        <LostRings pos={EXIT} grow={interpolate(f, [s1 - 4, s1 + 40], [0, 1], clamp)} />
      </Stage3D>
      <TopShade />
      <Head top={200} color={COL.wit} size={100}>관통</Head>
      <Head top={330} size={60} color="#E8ECF0">집도의 증언</Head>
      <Head top={900} size={80} o={fadeIn(f, s1 + 10)}>식장 어딘가</Head>
      <Recon />
    </AbsoluteFill>
  );
};

const VChain: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s1 = sAt(cut, 1);
  const nodes: [string, string, string, number][] = [
    ["현장 수거", "증언", COL.wit, 6],
    ["누가 보관?", "?", COL.miss, s1 + 6],
    ["총과 대조?", "?", COL.miss, s1 + 30],
  ];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #1E232A 0%, #0B0D10 75%)" }}>
      {nodes.map(([t, s, c, at], i) => (
        <div key={i} style={{ position: "absolute", left: 120, right: 120, top: 220 + i * 290, height: 230, border: `5px ${i ? "dashed" : "solid"} ${c}`, borderRadius: 16, background: "rgba(14,17,21,0.9)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", fontFamily: UI, opacity: fadeIn(f, at, 10) }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#FFFFFF" }}>{t}</div>
          <div style={{ fontSize: i ? 130 : 56, fontWeight: 700, color: c }}>{s}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", opacity: fadeIn(f, s1 + 60, 6) }}>
        <span style={{ display: "inline-block", border: `10px solid ${COL.miss}`, borderRadius: 12, padding: "8px 34px", fontFamily: UI, fontWeight: 700, fontSize: 96, color: COL.miss, transform: "rotate(-4deg)" }}>공개 기록 없음</span>
      </div>
    </AbsoluteFill>
  );
};

const VAnswer: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #1E232A 0%, #0B0D10 75%)" }}>
      <Head top={220} size={56} color="#9AA4B0">판결 · 공식 결론</Head>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 210, color: "#FFFFFF", opacity: fadeIn(f, sAt(cut, 0) + 4, 12) }}>문세광</div>
      <Head top={610} size={64} o={fadeIn(f, sAt(cut, 1))}>뒤집는 기록 · 없음</Head>
      <div style={{ position: "absolute", left: 160, right: 160, top: 800, height: 280, border: `6px dashed ${COL.miss}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: UI, fontWeight: 700, fontSize: 84, color: COL.miss, opacity: fadeIn(f, sAt(cut, 2)) }}>빈칸 하나</div>
    </AbsoluteFill>
  );
};

const VEnd: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [0.01, 40, 6], look: [0, 0, 1] },
    { f: cut.duration + 10, pos: [0.01, 34, 5], look: [0, 0, 1] },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
        <Stage3D keys={keys} light={0.6} fov={55} spot={PODIUM}>
          <Hall />
        </Stage3D>
      </div>
      <Head top={330} size={112}>
        육영수를 맞힌<br />
        <span style={{ color: COL.miss }}>총알</span>은<br />어디로 갔나
      </Head>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", opacity: fadeIn(f, 10) }}>
        <span style={{ display: "inline-block", background: "#FFFFFF", color: "#0B0D10", fontFamily: UI, fontWeight: 700, fontSize: 60, padding: "14px 44px", borderRadius: 60 }}>본편 전체 기록 ▶</span>
      </div>
    </AbsoluteFill>
  );
};

const VIEWS: Record<string, React.FC<SP>> = { vOpen: VOpen, vShots: VShots, vExit: VExit, vChain: VChain, vAnswer: VAnswer, vEnd: VEnd };

/* ── 본체 ── */

const Fade: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

type Cue = { file: string; from: number; to: number; vol: number };

export const ShortY: React.FC = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const text = JSON.stringify(timeline.cuts) + GLYPHS + "5발그1발은어디로?육영수저격사건관통집도의증언식장어딘가현장수거누가보관총과대조공개기록없음판결공식결론문세광뒤집는빈칸하나맞힌총알갔나본편전체▶";
    const specs = ["500 40px 'IBM Plex Sans KR'", "600 40px 'IBM Plex Sans KR'", "700 40px 'IBM Plex Sans KR'", "600 40px 'IBM Plex Mono'", "600 40px 'Noto Serif KR'"];
    Promise.all(specs.map((s) => document.fonts.load(s, text)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{ background: COL.bg }}>
      {cutsS.map((c, i) => {
        const View = VIEWS[c.p.view];
        return (
          <Sequence key={c.id} from={c.from} durationInFrames={c.duration + XF} name={`${c.id} ${c.p.view}`}>
            <Fade first={i === 0}>
              <View cut={c} />
            </Fade>
          </Sequence>
        );
      })}
      {cutsS.map((c) => (
        <Sequence key={`s${c.id}`} from={c.from} durationInFrames={c.duration} layout="none">
          <SubsV cut={c} />
          {(c as any).voice && (
            <Sequence from={fr((c as any).vat)} layout="none">
              <Audio src={staticFile((c as any).voice)} />
            </Sequence>
          )}
        </Sequence>
      ))}
      {(sound as Cue[]).map((q) => (
        <Sequence key={q.file} from={q.from} durationInFrames={q.to - q.from} layout="none">
          <Audio src={staticFile(q.file)} volume={q.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
