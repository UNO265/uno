/** 육영수 편 3D 장면: 극장 여러 각도(hall), 판결의 다섯 발(shots), 강선(rifling), 끝 화면 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { SP, clamp, ease, sAt } from "../jeongjo/kit";
import { Hall, Key, Label, PODIUM, Path, SEAT_YUK, Stage3D, V3 } from "./Theater";
import { COL, MONO, Note, UI, fadeIn } from "./kit";
import { Recon } from "./Views";

export const SHOOTER: V3 = [0, 1.4, 6.5];
export const HIT: V3 = [SEAT_YUK[0], 2.0, SEAT_YUK[2]];
export const EXIT: V3 = [SEAT_YUK[0] + 0.2, 2.02, SEAT_YUK[2] - 0.6];
const CHOIR: V3 = [-7.6, 0.6, 1.2];

/** 바닥에 놓인 빛나는 고리 */
const Ring: React.FC<{ pos: V3; r?: number; color?: string; op?: number }> = ({ pos, r = 0.8, color = COL.rec, op = 1 }) => (
  <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[r, r + 0.14, 56]} />
    <meshBasicMaterial color={color} transparent opacity={op} depthTest={false} />
  </mesh>
);

/** 방향 없는 점선 고리(행방 모름) */
export const LostRings: React.FC<{ pos: V3; grow: number; color?: string }> = ({ pos, grow, color = COL.miss }) => (
  <>
    {[0, 1, 2].map((k) => {
      const g = Math.max(0, Math.min(1, grow * 1.6 - k * 0.3));
      const r = 0.3 + g * (1.1 + k * 0.9);
      return [...Array(18)].map((_, i) => (
        <mesh key={`${k}-${i}`} position={pos} rotation={[Math.PI / 2, 0, (i / 18) * Math.PI * 2]}>
          <torusGeometry args={[r, 0.035, 6, 8, (Math.PI * 2) / 36]} />
          <meshBasicMaterial color={color} transparent opacity={g * (1 - k * 0.22)} />
        </mesh>
      ));
    })}
  </>
);

/** 사람 대신 쓰는 반투명 기둥 */
export const Marker: React.FC<{ pos: V3; color?: string; op?: number }> = ({ pos, color = COL.rec, op = 1 }) => (
  <mesh position={[pos[0], pos[1] + 0.9, pos[2]]}>
    <cylinderGeometry args={[0.28, 0.28, 1.8, 24]} />
    <meshBasicMaterial color={color} transparent opacity={0.45 * op} />
  </mesh>
);

const Chip: React.FC<{ o: number; label: string; big: string; color?: string; pos?: React.CSSProperties }> = ({ o, label, big, color = COL.rec, pos }) => (
  <div style={{ position: "absolute", right: 70, bottom: 190, textAlign: "right", fontFamily: UI, opacity: o, background: "rgba(8,10,12,0.85)", padding: "18px 34px", borderRadius: 8, borderRight: `4px solid ${color}`, ...pos }}>
    <div style={{ fontSize: 34, color: "#9AA4B0" }}>{label}</div>
    <div style={{ fontSize: 62, fontWeight: 700, color: "#FFFFFF" }}>{big}</div>
  </div>
);

const CAMS: Record<string, (d: number) => Key[]> = {
  orbit: (d) => [{ f: 0, pos: [28, 20, 30], look: [0, 1, 1] }, { f: d + 15, pos: [14, 13, 30], look: [0, 1.5, 0] }],
  audience: (d) => [{ f: 0, pos: [-15, 10, 22], look: [0, 0, 8] }, { f: d + 15, pos: [-8, 7, 20], look: [0, 0.5, 6] }],
  podium: (d) => [{ f: 0, pos: [0, 4.5, 15], look: [0.5, 2.2, -2] }, { f: d + 15, pos: [3.5, 4, 6.5], look: [1.3, 2, -2.6] }],
  chorus: (d) => [{ f: 0, pos: [-2, 5, 11], look: [-6, 1, 1] }, { f: d + 15, pos: [-4.5, 3.6, 7.5], look: [-7.6, 0.8, 1.2] }],
  aisle: (d) => [{ f: 0, pos: [7, 5.5, 17], look: [0, 1.5, 3] }, { f: d + 15, pos: [5, 4.2, 12.5], look: [0, 1.6, 2] }],
  chorusClose: (d) => [{ f: 0, pos: [-1.5, 4.5, 9], look: [-6.5, 0.8, 1.5] }, { f: d + 15, pos: [-4.5, 3.2, 5.8], look: [-7.6, 0.7, 1.2] }],
  return: (d) => [{ f: 0, pos: [0, 3.2, 17], look: [0, 3.2, -2] }, { f: d + 15, pos: [0, 2.9, 10], look: [0, 3.4, -2] }],
  top: (d) => [{ f: 0, pos: [0.01, 36, 5], look: [0, 0, 0] }, { f: d + 15, pos: [2.5, 26, 3], look: [2, 0, -2] }],
  blank: (d) => [{ f: 0, pos: [12, 10, 15], look: [1, 1.5, -1] }, { f: d + 15, pos: [8, 7.5, 8], look: [1.5, 1.8, -2.5] }],
  empty: (d) => [{ f: 0, pos: [0, 5.5, 25], look: [0, 3, -3] }, { f: d + 15, pos: [0, 4.2, 15], look: [0, 3.4, -3] }],
};

export const HallView: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const m: string[] = cut.p.marks ?? [];
  const at = (i: number) => sAt(cut, i);
  const has = (k: string) => m.includes(k);
  const dim = cut.p.cam === "empty" ? interpolate(f, [0, d], [0.8, 0.45], clamp) : 1;
  const walk = ease(f, at(1), at(1) + 40);
  const shooterPos: V3 = [0, 0, 11 - walk * 4.5];
  return (
    <AbsoluteFill>
      <Stage3D keys={CAMS[cut.p.cam](d)} light={cut.p.cam === "top" || cut.p.cam === "blank" ? 0.45 : 0.85 * dim} spot={has("podium") || cut.p.cam === "return" || cut.p.cam === "empty" ? PODIUM : null}>
        <Hall />
        {has("podium") && <Label pos={[PODIUM[0], 3.6, PODIUM[2]]} text="연단" op={fadeIn(f, at(0) + 4)} size={1.6} />}
        {has("seat") && (
          <>
            <Ring pos={[SEAT_YUK[0], 1.22, SEAT_YUK[2]]} op={fadeIn(f, at(1)) * (0.6 + 0.4 * Math.sin(f / 6))} />
            <Label pos={[SEAT_YUK[0], 3.1, SEAT_YUK[2]]} text="귀빈석 · 육영수 여사" op={fadeIn(f, at(1) + 4)} size={1.2} />
          </>
        )}
        {has("chorus") && (
          <>
            <Ring pos={[CHOIR[0], 0.62, CHOIR[2]]} r={2.2} op={fadeIn(f, at(0)) * 0.8} />
            <Label pos={[CHOIR[0], 2.2, CHOIR[2]]} text="합창단" op={fadeIn(f, at(0) + 6)} size={1.5} />
          </>
        )}
        {has("shooter") && (
          <>
            <Marker pos={shooterPos} op={fadeIn(f, at(1))} />
            <Label pos={[shooterPos[0] + 0.2, 2.8, shooterPos[2]]} text="문세광 · 재구성 위치" op={fadeIn(f, at(1) + 6)} size={1.1} />
          </>
        )}
        {has("jang") && (
          <>
            <Ring pos={[CHOIR[0] + 0.8, 0.62, CHOIR[2]]} r={0.45} op={fadeIn(f, at(2)) * (0.6 + 0.4 * Math.sin(f / 6))} />
            <Label pos={[CHOIR[0] + 0.8, 2.0, CHOIR[2]]} text="장봉화 학생" op={fadeIn(f, at(2) + 6)} size={1.2} />
          </>
        )}
        {has("question") && (
          <>
            <Ring pos={[SEAT_YUK[0], 1.22, SEAT_YUK[2]]} color={COL.miss} op={fadeIn(f, at(1))} />
            <Label pos={[SEAT_YUK[0], 3.6, SEAT_YUK[2]]} text="?" color={COL.miss} op={fadeIn(f, at(1) + 8)} size={2.2} />
          </>
        )}
        {has("paths") && (
          <>
            <Path pts={[SHOOTER, [1.3, 1.8, 1.5], HIT]} color={COL.rec} r={0.045} />
            <Path pts={[HIT, EXIT]} color={COL.wit} r={0.05} />
            <LostRings pos={EXIT} grow={interpolate(f, [at(0), at(0) + 60], [0, 1], clamp)} />
            <Label pos={[EXIT[0], EXIT[1] + 1.3, EXIT[2]]} text="빈칸" color={COL.miss} op={fadeIn(f, at(0) + 20)} size={1.2} />
          </>
        )}
      </Stage3D>
      {cut.p.cam === "orbit" && <Chip o={fadeIn(f, at(1))} label="1974.8.15 · 국립극장" big="제29회 광복절 기념식" />}
      {cut.p.chip && <Chip o={fadeIn(f, at(0) + 10)} label="객석" big={cut.p.chip} />}
      {has("broadcast") && <Chip o={fadeIn(f, at(1))} label="전국 중계" big="텔레비전 · 라디오" />}
      {has("guards") && <Chip o={fadeIn(f, at(0))} label="경호원 응사" big="한 발이 빗나감" color={COL.rec} />}
      {has("question") && <Chip o={fadeIn(f, at(1) + 12)} label="탄두 행방" big="공개 기록 없음" color={COL.miss} pos={{ bottom: undefined, top: 130 }} />}
      <Recon />
    </AbsoluteFill>
  );
};

/* 판결에 적힌 다섯 발 */
export const SHOTS: { to: V3; label: string; text: string }[] = [
  { to: [0.3, 0.5, 6.9], label: "① 허벅지", text: "자기 허벅지" },
  { to: [0, 1.9, -0.8], label: "② 연단", text: "연단" },
  { to: SHOOTER, label: "③ 불발", text: "불발" },
  { to: HIT, label: "④ 육 여사", text: "육 여사 머리" },
  { to: [0.9, 6.0, -6.9], label: "⑤ 태극기", text: "무대 뒤 태극기" },
];

export const Shots: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const shots: number[] = cut.p.shots ?? [];
  const done: number[] = cut.p.done ?? [];
  const when = (n: number) => (done.includes(n) ? -99 : sAt(cut, shots.indexOf(n)) + 6);
  const vis = (n: number) => done.includes(n) || shots.includes(n);
  const keys: Key[] = [
    { f: 0, pos: [11, 7.5, 15], look: [0.5, 2.2, 0] },
    { f: d + 15, pos: [8, 6.2, 11.5], look: [0.6, 2.6, -1] },
  ];
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={0.6}>
        <Hall />
        <Marker pos={[SHOOTER[0], 0, SHOOTER[2]]} op={0.9} />
        <Label pos={[0.2, 2.9, SHOOTER[2]]} text="문세광 · 재구성 위치" size={1} op={0.9} />
        {SHOTS.map((s, i) => {
          const n = i + 1;
          if (!vis(n)) return null;
          const p = ease(f, when(n), when(n) + 18);
          if (n === 3)
            return <Label key={n} pos={[SHOOTER[0] + 0.9, 2.2, SHOOTER[2]]} text="✕ 불발" color="#C3CBD4" op={p} size={1} />;
          const mid: V3 = [(SHOOTER[0] + s.to[0]) / 2, (SHOOTER[1] + s.to[1]) / 2 + 0.2, (SHOOTER[2] + s.to[2]) / 2];
          return (
            <group key={n}>
              <Path pts={[SHOOTER, mid, s.to]} color={COL.rec} r={0.04} prog={p} />
              <Label pos={[s.to[0] + 0.4, s.to[1] + 0.8, s.to[2]]} text={s.label} op={fadeIn(f, when(n) + 14)} size={0.95} />
            </group>
          );
        })}
      </Stage3D>
      <div style={{ position: "absolute", right: 60, top: 150, width: 440, background: "rgba(8,10,12,0.86)", border: "2px solid #2C333C", borderRadius: 10, padding: "22px 30px", fontFamily: UI }}>
        <div style={{ fontSize: 32, color: "#9AA4B0", marginBottom: 10 }}>대법원 판결 · 다섯 발</div>
        {SHOTS.map((s, i) => {
          const n = i + 1;
          const o = vis(n) ? fadeIn(f, when(n) + 4) : 0.25;
          return (
            <div key={n} style={{ display: "flex", gap: 18, alignItems: "baseline", fontSize: 40, color: "#FFFFFF", opacity: Math.max(0.25, o), lineHeight: 1.6 }}>
              <span style={{ fontFamily: MONO, color: "#9AA4B0", width: 36 }}>{n}</span>
              <span>{vis(n) ? s.text : "—"}</span>
            </div>
          );
        })}
      </div>
      <Recon />
    </AbsoluteFill>
  );
};

/* 강선: 총신 속 나선 홈 → 총알 표면의 긁힌 자국 → 대조 */
const Helix: React.FC<{ len: number; r: number; turns: number; phase: number; color: string; op?: number }> = ({ len, r, turns, phase, color, op = 1 }) => {
  const curve = useMemo(() => {
    const pts = [...Array(80)].map((_, i) => {
      const t = i / 79;
      const a = phase + t * turns * Math.PI * 2;
      return new THREE.Vector3(-len / 2 + t * len, Math.cos(a) * r, Math.sin(a) * r);
    });
    return new THREE.CatmullRomCurve3(pts);
  }, [len, r, turns, phase]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 160, 0.035, 6, false]} />
      <meshBasicMaterial color={color} transparent opacity={op} />
    </mesh>
  );
};

export const BulletMesh: React.FC<{ x: number; spin: number; marks?: number; color?: string }> = ({ x, spin, marks = 0, color = "#B08A4E" }) => (
  <group position={[x, 0, 0]} rotation={[spin, 0, 0]}>
    <mesh rotation={[0, 0, -Math.PI / 2]}>
      <cylinderGeometry args={[0.45, 0.45, 1.2, 40]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.35} />
    </mesh>
    <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <coneGeometry args={[0.45, 0.8, 40]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.35} />
    </mesh>
    {[...Array(6)].map((_, i) => (
      <mesh key={i} rotation={[(i / 6) * Math.PI * 2, 0, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[1.18, 0.05, 0.92]} />
        <meshBasicMaterial color="#2A1D0E" transparent opacity={marks * 0.9} />
      </mesh>
    ))}
  </group>
);

export const Rifling: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const d = cut.duration;
  const step = cut.p.step;
  if (step === 0) {
    const bx = interpolate(f, [sAt(cut, 2), d], [-7, 6], clamp);
    const keys: Key[] = [
      { f: 0, pos: [0, 3.2, 9], look: [0, 0, 0] },
      { f: d + 15, pos: [-2.5, 2, 7], look: [0, 0, 0] },
    ];
    return (
      <AbsoluteFill>
        <Stage3D keys={keys} light={1}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.62, 0.62, 16, 48, 1, true]} />
            <meshStandardMaterial color="#5E6873" transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <Helix key={i} len={16} r={0.6} turns={2.2} phase={(i / 6) * Math.PI * 2} color={COL.rec} op={fadeIn(f, sAt(cut, 1)) * 0.9} />
          ))}
          <BulletMesh x={bx} spin={f * 0.25} />
        </Stage3D>
        <Note style={{ left: 56, bottom: 180, color: "#C3CBD4" }}>총신 속 나선형 홈(강선) · 도식</Note>
      </AbsoluteFill>
    );
  }
  const cmp = ease(f, sAt(cut, 3), sAt(cut, 3) + 20);
  const keys: Key[] = [
    { f: 0, pos: [0.4, 1.4, 4.2], look: [0.3, 0, 0] },
    { f: d + 15, pos: [0.4, 1.2, 6.2], look: [0.3, -0.35, 0] },
  ];
  return (
    <AbsoluteFill>
      <Stage3D keys={keys} light={1.1}>
        <group position={[0, cmp * 0.55, 0]}>
          <BulletMesh x={0} spin={f * 0.03} marks={fadeIn(f, sAt(cut, 0) + 6, 20)} />
        </group>
        {cmp > 0 && (
          <group position={[0, -1.15 * cmp, 0]}>
            <BulletMesh x={0} spin={f * 0.03 + 0.4} marks={cmp} color="#8E97A1" />
          </group>
        )}
      </Stage3D>
      <div style={{ position: "absolute", right: 70, top: 150, textAlign: "right", fontFamily: UI, opacity: fadeIn(f, sAt(cut, 2)), background: "rgba(8,10,12,0.85)", padding: "18px 34px", borderRadius: 8, borderRight: `4px solid ${COL.rec}` }}>
        <div style={{ fontSize: 34, color: "#9AA4B0" }}>강선 자국</div>
        <div style={{ fontSize: 62, fontWeight: 700, color: "#FFFFFF" }}>총의 지문</div>
      </div>
      <Note style={{ left: 56, bottom: 180, color: "#C3CBD4", opacity: cmp }}>현장 탄두 ↔ 용의 총기 시험 발사 탄두 대조 · 도식</Note>
    </AbsoluteFill>
  );
};

export const EndScreen: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const keys: Key[] = [
    { f: 0, pos: [0, 4.2, 15], look: [0, 3.4, -3] },
    { f: cut.duration + 15, pos: [0, 4.0, 12], look: [0, 3.4, -3] },
  ];
  const src = [
    "대법원 판결(1974. 12. 17) · 외교부 공개 외교문서(2005)",
    "국사편찬위원회 공개 주한미국대사관 문서(1974. 8. 20)",
    "경향신문 · 매일신문 · 국민일보 · 한국일보(2005)",
    "주간경향 · JBC뉴스(2026) · 한국민족문화대백과사전",
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
        <Stage3D keys={keys} light={0.4} spot={PODIUM}>
          <Hall />
        </Stage3D>
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 60, fontFamily: UI, opacity: fadeIn(f, 20, 20) }}>
        <div style={{ fontSize: 32, color: "#C3CBD4", marginBottom: 8 }}>출처</div>
        {src.map((s) => (
          <div key={s} style={{ fontSize: 32, color: "#8E97A1", lineHeight: 1.45 }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
