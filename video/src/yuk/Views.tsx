/** 육영수 편 장면: 3D 재구성(stage) + 조사자 화면(desk) */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SP, clamp, ease, fr, sAt, wAt } from "../jeongjo/kit";
import { Hall, Key, Label, PODIUM, Path, SEAT_YUK, Stage3D, V3 } from "./Theater";
import { COL, MONO, Note, SERIF, UI, fadeIn } from "./kit";

const Recon: React.FC = () => <Note style={{ right: 56, top: 54, fontSize: 32 }}>3D 재구성 · 배치와 비율은 실제와 다를 수 있음</Note>;

/* ───────── 3D ───────── */

export const Notice: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [30, 26, 34], look: [0, 0, 2] },
    { f: cut.duration + 20, pos: [22, 24, 38], look: [0, 0, 2] },
  ];
  const lines = [
    "본 영상은 판결 · 공식 발표 · 공개 외교문서 · 언론 보도를 바탕으로 제작되었습니다",
    "화면의 모든 장면은 기록을 바탕으로 한 그래픽 재구성이며 실제 촬영 영상이 아닙니다",
    "영화 「암살자(들)」과 제작상 관련이 없으며 특정 인물 · 단체의 주장을 대변하지 않습니다",
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <Stage3D keys={keys} light={0.6}>
          <Hall />
        </Stage3D>
      </div>
      <AbsoluteFill style={{ background: "rgba(5,6,8,0.55)", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: UI, fontWeight: 500, fontSize: 40, color: "#E8ECF0", opacity: fadeIn(f, 6 + i * 6, 14) }}>{l}</div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HookQuote: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [0, 5.5, 22], look: [0, 2.2, -1.5] },
    { f: cut.duration + 15, pos: [0, 3.4, 9.5], look: [0, 2.2, -1.5] },
  ];
  const q = "“여러분 하던 얘기를 계속하겠습니다”";
  const n = Math.floor(interpolate(f, [4, 4 + q.length * 1.6], [0, q.length], clamp));
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.45} spot={PODIUM}>
        <Hall />
      </Stage3D>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: "#FFFFFF", textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>
        {q.slice(0, n)}
      </div>
      <Note style={{ left: 0, right: 0, top: 290, textAlign: "center", color: "#C3CBD4", opacity: fadeIn(f, 30) }}>1974년 8월 15일 · 총격 몇 분 뒤 연단에서</Note>
      <Recon />
    </AbsoluteFill>
  );
};

export const FlyIn: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const keys: Key[] = [
    { f: 0, pos: [0.01, 46, 8], look: [0, 0, 4] },
    { f: d * 0.45, pos: [14, 22, 22], look: [0, 1, 0] },
    { f: d + 15, pos: [6, 5, 9], look: [0, 1.8, -1.5] },
  ];
  const lo = (a: number) => fadeIn(f, a, 8);
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.9} spot={PODIUM}>
        <Hall />
        <Label pos={[PODIUM[0], 3.4, PODIUM[2]]} text="연단" op={lo(8)} size={1.3} />
        <Label pos={[-3, 2.9, -3.4]} text="귀빈석" op={lo(16)} size={1.3} />
        <Label pos={[0, 1.2, 10]} text="객석 통로" op={lo(24)} size={1.3} />
        <Label pos={[-7.6, 1.6, 1.2]} text="합창단" op={lo(32)} size={1.3} />
        <Label pos={[0, 8.4, -6.9]} text="태극기" op={lo(40)} size={1.3} />
      </Stage3D>
      <Note style={{ left: 56, bottom: 170, fontFamily: MONO, color: "#C3CBD4" }}>1974.08.15 · 서울 장충동 국립극장</Note>
      <Recon />
    </AbsoluteFill>
  );
};

export const Seat: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const s2 = sAt(cut, 1);
  const keys: Key[] = [
    { f: 0, pos: [9, 5.5, 5], look: [SEAT_YUK[0], 1.6, SEAT_YUK[2]] },
    { f: d + 15, pos: [5.2, 3.4, 0.6], look: [SEAT_YUK[0], 1.7, SEAT_YUK[2]] },
  ];
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  const empty = ease(f, s2 - 6, s2 + 12);
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.7}>
        <Hall hiSeat={1 - empty} />
        <mesh position={[SEAT_YUK[0], 1.22, SEAT_YUK[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.9, 48]} />
          <meshBasicMaterial color={COL.rec} transparent opacity={pulse * (1 - 0.5 * empty)} />
        </mesh>
        <Label pos={[SEAT_YUK[0], 3.1, SEAT_YUK[2]]} text="육영수 여사 자리" op={fadeIn(f, 10)} size={0.9} />
      </Stage3D>
      <div style={{ position: "absolute", right: 90, bottom: 190, fontFamily: UI, textAlign: "right", opacity: empty }}>
        <div style={{ fontSize: 34, color: "#9AA4B0" }}>서울대병원</div>
        <div style={{ fontFamily: MONO, fontSize: 88, fontWeight: 600, color: "#FFFFFF" }}>오후 7시쯤</div>
        <div style={{ fontSize: 40, color: "#E8ECF0" }}>사망</div>
      </div>
      <Recon />
    </AbsoluteFill>
  );
};

export const Bullet: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const s2 = sAt(cut, 1);
  const shooter: V3 = [0, 1.4, 6.5];
  const hit: V3 = [SEAT_YUK[0], 2.0, SEAT_YUK[2]];
  const exit: V3 = [SEAT_YUK[0] + 0.25, 2.05, SEAT_YUK[2] - 0.7];
  const lost: V3[] = [exit, [3.4, 2.6, -5.2], [4.6, 3.6, -6.2], [6.5, 5.6, -6.6]];
  const keys: Key[] = [
    { f: 0, pos: [8.5, 4.6, 7], look: [1.4, 1.8, -1.5] },
    { f: s2, pos: [7.5, 4.2, 1.5], look: [3, 2.2, -4] },
    { f: d + 15, pos: [9.5, 4.8, -1], look: [4.2, 3.2, -5.6] },
  ];
  const p1 = ease(f, 6, 26);
  const p2 = ease(f, 26, 36);
  const p3 = interpolate(f, [s2 - 4, s2 + 30], [0, 1], clamp);
  const q = fadeIn(f, s2 + 26, 8);
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.35}>
        <Hall />
        <Path pts={[shooter, [1.3, 1.8, 1.5], hit]} color={COL.rec} r={0.045} prog={p1} />
        <Label pos={[0.6, 2.4, 4]} text="판결 · 네 번째 총알" op={fadeIn(f, 10)} size={0.8} />
        <Path pts={[hit, exit]} color={COL.wit} r={0.05} prog={p2} />
        <Label pos={[SEAT_YUK[0] + 0.3, 3.1, SEAT_YUK[2] - 0.3]} text="관통 · 집도의 증언" color={COL.wit} op={fadeIn(f, 30)} size={0.75} />
        <Path pts={lost} color={COL.miss} r={0.05} dash prog={p3} />
        <Label pos={[6.8, 6.4, -6.6]} text="?" color={COL.miss} op={q} size={1.6} />
      </Stage3D>
      <div style={{ position: "absolute", right: 80, top: 150, textAlign: "right", fontFamily: UI, opacity: q }}>
        <div style={{ fontSize: 36, color: COL.miss, letterSpacing: 2 }}>탄두 행방</div>
        <div style={{ fontSize: 60, fontWeight: 700, color: "#FFFFFF" }}>공개 기록 없음</div>
      </div>
      <Recon />
    </AbsoluteFill>
  );
};

export const Title: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [0.01, 40, 4], look: [0, 0, 3] },
    { f: cut.duration + 15, pos: [0.01, 34, 4.5], look: [0, 0, 3] },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
        <Stage3D keys={keys} light={0.6}>
          <Hall />
        </Stage3D>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 120, color: "#FFFFFF", opacity: fadeIn(f, 0, 8), transform: `scale(${interpolate(f, [0, 90], [1.04, 1], clamp)})` }}>
          육영수를 맞힌 <span style={{ color: COL.miss }}>총알</span>은
        </div>
        <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 120, color: "#FFFFFF", opacity: fadeIn(f, 8, 8) }}>어디로 갔나</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── 조사자 화면(desk) ───────── */

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={40} height={52} style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.6))" }}>
    <path d="M 2 2 L 2 40 L 12 30 L 19 47 L 26 44 L 19 28 L 33 28 Z" fill="#FFFFFF" stroke="#111" strokeWidth={2} />
  </svg>
);

const Desk: React.FC<{ title: string; children: React.ReactNode; zoom?: number }> = ({ title, children, zoom = 1 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1E232A 0%, #0B0D10 75%)" }}>
    <div style={{ position: "absolute", left: 210, top: 120, width: 1500, height: 780, background: "#F5F5F2", borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
      <div style={{ height: 64, background: "#E3E4E1", display: "flex", alignItems: "center", padding: "0 28px", fontFamily: UI, fontSize: 32, color: "#3A3F46", borderBottom: "1px solid #CFD1CD" }}>{title}</div>
      <div style={{ position: "relative", height: 716 }}>{children}</div>
    </div>
  </AbsoluteFill>
);

export const DateView: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const txt = "1974. 8. 15.";
  const n = Math.floor(interpolate(f, [6, 6 + txt.length * 2], [0, txt.length], clamp));
  const zoom = interpolate(f, [0, cut.duration], [1, 1.06], clamp);
  return (
    <Desk title="사건 기록 · 메모" zoom={zoom}>
      <div style={{ position: "absolute", left: 90, top: 70, fontFamily: MONO, fontSize: 30, color: "#7A8089" }}>사건일</div>
      <div style={{ position: "absolute", left: 84, top: 130, fontFamily: MONO, fontWeight: 600, fontSize: 190, color: "#15181D" }}>
        {txt.slice(0, n)}
        <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 420, fontFamily: UI, fontSize: 44, color: "#3A3F46", opacity: fadeIn(f, 30) }}>제29회 광복절 기념식 · 서울 장충동 국립극장</div>
    </Desk>
  );
};

export const Verdict: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s2 = sAt(cut, 1);
  const rows = [
    ["1974. 10. 19.", "1심 사형 선고"],
    ["1974. 11. 20.", "항소 기각"],
    ["1974. 12. 17.", "대법원 사형 확정"],
    ["1974. 12. 20.", "사형 집행"],
  ];
  const at = (i: number) => 8 + i * 12;
  const hl = ease(f, s2 - 4, s2 + 10);
  const stamp = interpolate(f, [s2 + 6, s2 + 12], [2.2, 1], clamp);
  const cur = { x: interpolate(f, [0, at(3)], [1300, 1150], clamp), y: interpolate(f, [0, at(3)], [700, 560], clamp) };
  return (
    <Desk title="재판 기록 정리 · 문세광 사건 (재구성 문서)">
      {rows.map(([d, t], i) => (
        <div key={i} style={{ position: "absolute", left: 90, top: 70 + i * 120, display: "flex", gap: 60, alignItems: "baseline", opacity: fadeIn(f, at(i), 8) }}>
          <div style={{ fontFamily: MONO, fontSize: 48, color: "#5A606A", width: 420 }}>{d}</div>
          <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 56, color: "#15181D", position: "relative" }}>
            {i === 2 && <div style={{ position: "absolute", left: -10, right: -10, top: 8, bottom: 0, background: "#FFE27A", transform: `scaleX(${hl})`, transformOrigin: "left", zIndex: 0 }} />}
            <span style={{ position: "relative" }}>{t}</span>
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 90, top: 560, fontFamily: UI, fontSize: 40, color: "#3A3F46", opacity: fadeIn(f, at(3) + 10) }}>
        사건부터 집행까지 <b style={{ fontFamily: MONO, color: "#15181D" }}>127일</b>
      </div>
      <div style={{ position: "absolute", right: 110, top: 300, width: 250, height: 250, border: "10px solid #C8262B", borderRadius: 125, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: UI, fontWeight: 700, fontSize: 88, color: "#C8262B", transform: `rotate(-12deg) scale(${stamp})`, opacity: f > s2 + 6 ? 0.9 : 0 }}>
        확정
      </div>
      <Cursor x={cur.x} y={cur.y} />
    </Desk>
  );
};

export const Memo: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const rows: [string, string, string, string][] = [
    ["범인", "문세광 · 현장 체포", "✓", "기록"],
    ["사망", "육영수 여사 · 장봉화 학생", "✓", "기록"],
    ["판결", "사형 확정 · 집행", "✓", "기록"],
    ["탄두", "육 여사를 맞힌 총알의 행방", "?", "미공개"],
  ];
  const at = (i: number) => 6 + i * 14;
  const last = wAt(cut, "하나", at(3) + 20);
  const blink = f > last ? 0.55 + 0.45 * Math.abs(Math.sin((f - last) / 6)) : 1;
  return (
    <Desk title="확인표 · 무엇이 기록으로 남았나">
      <div style={{ position: "absolute", left: 70, top: 40, right: 70, display: "grid", gridTemplateColumns: "180px 1fr 110px 220px", fontFamily: UI, fontSize: 30, color: "#7A8089", borderBottom: "2px solid #CFD1CD", paddingBottom: 12 }}>
        <div>항목</div><div>내용</div><div>확인</div><div>등급</div>
      </div>
      {rows.map(([k, v, c, g], i) => {
        const miss = g === "미공개";
        return (
          <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 110 + i * 140, height: 120, display: "grid", gridTemplateColumns: "180px 1fr 110px 220px", alignItems: "center", fontFamily: UI, fontSize: 48, color: "#15181D", opacity: fadeIn(f, miss ? last - 8 : at(i), 8), background: miss ? `rgba(255,77,79,${0.12 * blink})` : "transparent", borderBottom: "1px solid #E0E1DE" }}>
            <div style={{ fontWeight: 700 }}>{k}</div>
            <div>{v}</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 60, color: miss ? COL.miss : "#1F9D55" }}>{c}</div>
            <div style={{ fontWeight: 700, color: miss ? COL.miss : "#3A3F46" }}>{g}</div>
          </div>
        );
      })}
    </Desk>
  );
};

export const VIEWS: Record<string, React.FC<SP>> = {
  notice: Notice, hookQuote: HookQuote, flyin: FlyIn, seat: Seat, bullet: Bullet, title: Title,
  date: DateView, verdict: Verdict, memo: Memo,
};
