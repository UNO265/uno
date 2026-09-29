/**
 * 육영수 편 3D 재구성: 1974년 국립극장 무대·객석을 단순한 회색 모형으로 세우고 카메라를 움직인다.
 * 좌표(미터 느낌): x 왼쪽(-)·오른쪽(+) (객석에서 무대를 볼 때), y 위, z 객석 쪽(+)·무대 안쪽(-).
 * 배치·비율은 기록을 바탕으로 한 재구성이며 실제와 다를 수 있다(화면에 표시).
 */
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { COL, UI } from "./kit";

export type V3 = [number, number, number];
export type Key = { f: number; pos: V3; look: V3 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** 키프레임 사이를 부드럽게 잇는 카메라 */
const Rig: React.FC<{ keys: Key[]; fov?: number }> = ({ keys, fov = 40 }) => {
  const f = useCurrentFrame();
  const { camera } = useThree();
  let i = 0;
  while (i < keys.length - 2 && f > keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const t = b.f === a.f ? 1 : smooth(Math.min(1, Math.max(0, (f - a.f) / (b.f - a.f))));
  const p = a.pos.map((v, k) => lerp(v, b.pos[k], t)) as V3;
  const l = a.look.map((v, k) => lerp(v, b.look[k], t)) as V3;
  camera.position.set(...p);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.lookAt(...l);
  camera.updateProjectionMatrix();
  return null;
};

/** 모서리 선이 보이는 상자(도면 느낌) */
const Block: React.FC<{ pos: V3; size: V3; color?: string; edge?: string; edgeOp?: number; op?: number }> = ({
  pos, size, color = COL.model, edge = COL.edge, edgeOp = 0.55, op = 1,
}) => {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size[0], size[1], size[2]]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  return (
    <group position={pos}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.9} transparent={op < 1} opacity={op} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={edge} transparent opacity={edgeOp} />
      </lineSegments>
    </group>
  );
};

/** 객석 의자(인스턴스) */
const Seats: React.FC<{ rows: number; cols: number; x0: number; z0: number; dx: number; dz: number; gap?: [number, number]; rise?: number }> = ({
  rows, cols, x0, z0, dx, dz, gap, rise = 0.12,
}) => {
  const mesh = useMemo(() => {
    const g = new THREE.BoxGeometry(0.46, 0.5, 0.46);
    const m = new THREE.MeshStandardMaterial({ color: COL.seat, roughness: 1 });
    const im = new THREE.InstancedMesh(g, m, rows * cols);
    const o = new THREE.Object3D();
    let n = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = x0 + c * dx;
        if (gap && x > gap[0] && x < gap[1]) continue;
        o.position.set(x, 0.25 + r * rise, z0 + r * dz);
        o.updateMatrix();
        im.setMatrixAt(n++, o.matrix);
      }
    im.count = n;
    return im;
  }, [rows, cols, x0, z0, dx, dz]);
  return <primitive object={mesh} />;
};

/** 항상 카메라를 보는 글자표(캔버스 텍스처) */
export const Label: React.FC<{ pos: V3; text: string; color?: string; size?: number; op?: number; bg?: string }> = ({
  pos, text, color = "#FFFFFF", size = 1, op = 1, bg = "rgba(10,12,15,0.82)",
}) => {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas");
    const ctx = cv.getContext("2d")!;
    const fs = 64;
    ctx.font = `600 ${fs}px ${UI}`;
    const w = Math.ceil(ctx.measureText(text).width) + 56;
    cv.width = w;
    cv.height = fs + 40;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, cv.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, cv.height - 4);
    ctx.font = `600 ${fs}px ${UI}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 28, cv.height / 2 + 3);
    const t = new THREE.CanvasTexture(cv);
    t.anisotropy = 4;
    return { t, aspect: w / cv.height };
  }, [text, color, bg]);
  return (
    <sprite position={pos} scale={[size * tex.aspect * 0.5, size * 0.5, 1]}>
      <spriteMaterial map={tex.t} transparent opacity={op} depthTest={false} />
    </sprite>
  );
};

/** 관 모양 선(굵게 보이도록). dash 면 끊어서 그린다. prog 0~1 만큼만 그린다. */
export const Path: React.FC<{ pts: V3[]; color: string; r?: number; dash?: boolean; prog?: number; op?: number }> = ({
  pts, color, r = 0.06, dash, prog = 1, op = 1,
}) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), [JSON.stringify(pts)]);
  const n = dash ? 22 : 1;
  const segs = [];
  for (let i = 0; i < n; i++) {
    const a = dash ? i / n : 0;
    const b = dash ? (i + 0.55) / n : 1;
    const e = Math.min(b, prog);
    if (e <= a) break;
    segs.push([a, e]);
  }
  return (
    <group>
      {segs.map(([a, b], i) => {
        const sub = new THREE.CatmullRomCurve3(
          [...Array(12)].map((_, k) => curve.getPoint(a + ((b - a) * k) / 11)),
        );
        return (
          <mesh key={i}>
            <tubeGeometry args={[sub, 24, r, 8, false]} />
            <meshBasicMaterial color={color} transparent opacity={op} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * 태극기(국기법 도안 비율): 가로:세로 3:2, 태극 지름 = 세로의 1/2(빨강 위·파랑 아래, 대각선 방향으로 기울임),
 * 네 모서리 괘(건 왼쪽 위 · 곤 오른쪽 아래 · 감 오른쪽 위 · 리 왼쪽 아래), 괘 길이 = 세로/4, 막대 두께 = 세로/24, 간격 = 세로/48.
 */
const flagTexture = () => {
  const W = 1200;
  const H = 800;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#FFFFFF";
  g.fillRect(0, 0, W, H);
  const r = H / 4;
  const ang = Math.atan2(H, W); // 왼쪽 위 → 오른쪽 아래 대각선
  g.save();
  g.translate(W / 2, H / 2);
  g.rotate(ang);
  // 위 반원 빨강, 아래 반원 파랑
  g.fillStyle = "#CD2E3A";
  g.beginPath();
  g.arc(0, 0, r, Math.PI, 0);
  g.fill();
  g.fillStyle = "#0047A0";
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI);
  g.fill();
  // 작은 원 두 개로 물결 경계(왼쪽은 빨강이 아래로, 오른쪽은 파랑이 위로)
  g.fillStyle = "#CD2E3A";
  g.beginPath();
  g.arc(-r / 2, 0, r / 2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#0047A0";
  g.beginPath();
  g.arc(r / 2, 0, r / 2, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // 괘: 1 = 이어진 막대, 0 = 끊어진 막대(안쪽부터)
  const bar = H / 24;
  const gap = H / 48;
  const len = H / 4;
  const dist = H / 4 + H / 8; // 태극 가장자리 → 괘 안쪽 막대까지
  const TRI: [number, number[]][] = [
    [Math.PI + ang, [1, 1, 1]], // 건: 왼쪽 위
    [-ang, [0, 1, 0]], // 감: 오른쪽 위
    [Math.PI - ang, [1, 0, 1]], // 리: 왼쪽 아래
    [ang, [0, 0, 0]], // 곤: 오른쪽 아래
  ];
  g.fillStyle = "#111111";
  for (const [a, bars] of TRI) {
    g.save();
    g.translate(W / 2, H / 2);
    g.rotate(a);
    bars.forEach((b, i) => {
      const x = dist + i * (bar + gap);
      if (b) g.fillRect(x, -len / 2, bar, len);
      else {
        g.fillRect(x, -len / 2, bar, len / 2 - gap / 2);
        g.fillRect(x, gap / 2, bar, len / 2 - gap / 2);
      }
    });
    g.restore();
  }
  const t = new THREE.CanvasTexture(cv);
  t.anisotropy = 8;
  return t;
};

const Flag: React.FC<{ pos: V3; w?: number }> = ({ pos, w = 4.2 }) => {
  const tex = useMemo(flagTexture, []);
  return (
    <group position={pos}>
      <mesh>
        <planeGeometry args={[w, (w * 2) / 3]} />
        <meshStandardMaterial map={tex} roughness={0.95} />
      </mesh>
    </group>
  );
};

export const SEAT_YUK: V3 = [2.6, 1.75, -3.4]; // 귀빈석(재구성 위치)
export const PODIUM: V3 = [0, 1.2, -1.2];

/** 국립극장 모형 */
export const Hall: React.FC<{ dim?: number; hiSeat?: number }> = ({ dim = 1, hiSeat = 0 }) => (
  <group>
    {/* 바닥 */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 6]}>
      <planeGeometry args={[60, 50]} />
      <meshStandardMaterial color={COL.floor} roughness={1} />
    </mesh>
    <gridHelper args={[60, 60, "#2A3038", "#1C2127"]} position={[0, 0, 6]} />
    {/* 무대 */}
    <Block pos={[0, 0.6, -3.5]} size={[20, 1.2, 7]} color={COL.stage} />
    {/* 무대 뒤 벽 + 태극기 자리 */}
    <Block pos={[0, 5, -7.2]} size={[22, 10, 0.4]} color={COL.wall} edgeOp={0.35} />
    <Flag pos={[0, 6.2, -6.97]} />
    {/* 연단 */}
    <Block pos={[PODIUM[0], 1.8, PODIUM[2]]} size={[1.2, 1.2, 0.8]} color="#9AA3AE" edge="#FFFFFF" edgeOp={0.9} />
    {/* 귀빈석 */}
    {[-6.2, -4.6, -3, 1, 2.6, 4.2, 5.8].map((x) => (
      <Block key={x} pos={[x, 1.55, -3.4]} size={[0.8, 0.7, 0.7]} color={x === SEAT_YUK[0] && hiSeat ? "#F4F4F2" : "#6C7580"} edgeOp={0.6} />
    ))}
    {/* 객석 */}
    <Seats rows={16} cols={34} x0={-10} z0={2.4} dx={0.6} dz={1.05} gap={[-0.7, 0.7]} />
    {/* 앞쪽 합창단 자리 */}
    <Block pos={[-7.6, 0.3, 1.2]} size={[4, 0.6, 1.6]} color="#5A6470" edgeOp={0.7} />
    {/* 옆벽 */}
    <Block pos={[-11.5, 4, 8]} size={[0.3, 8, 30]} color={COL.wall} op={0.35 * dim} edgeOp={0.2} />
    <Block pos={[11.5, 4, 8]} size={[0.3, 8, 30]} color={COL.wall} op={0.35 * dim} edgeOp={0.2} />
  </group>
);

/** 3D 장면 틀: 캔버스 + 조명 + 카메라 */
export const Stage3D: React.FC<{ keys: Key[]; fov?: number; light?: number; spot?: V3 | null; children?: React.ReactNode }> = ({
  keys, fov, light = 1, spot = null, children,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} style={{ background: COL.bg }} gl={{ antialias: true }}>
      <color attach="background" args={[COL.bg]} />
      <fog attach="fog" args={[COL.bg, 30, 75]} />
      <ambientLight intensity={0.55 * light} />
      <directionalLight position={[12, 20, 14]} intensity={1.1 * light} />
      <directionalLight position={[-14, 10, -6]} intensity={0.35 * light} color="#9FB4D0" />
      {spot && <pointLight position={[spot[0], spot[1] + 4, spot[2] + 2]} intensity={60} distance={14} color="#FFF3DA" />}
      <Rig keys={keys} fov={fov} />
      {children}
    </ThreeCanvas>
  );
};
