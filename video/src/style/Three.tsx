import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const SANS = "'Noto Sans CJK JP', sans-serif";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// 角の丸い三角柱（おにぎり）
const useOnigiri = () =>
  useMemo(() => {
    const s = new THREE.Shape();
    const r = 0.5;
    s.moveTo(0, r);
    s.quadraticCurveTo(0.12, r + 0.02, 0.45, -0.18);
    s.quadraticCurveTo(0.55, -0.42, 0.3, -0.42);
    s.lineTo(-0.3, -0.42);
    s.quadraticCurveTo(-0.55, -0.42, -0.45, -0.18);
    s.quadraticCurveTo(-0.12, r + 0.02, 0, r);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4, curveSegments: 16 });
    g.center();
    return g;
  }, []);

const Onigiri: React.FC<{ p: [number, number, number]; geo: THREE.ExtrudeGeometry; sticker?: boolean; ry?: number; s?: number }> = ({ p, geo, sticker, ry = 0, s = 1 }) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#fbf7ee" roughness={0.85} />
    </mesh>
    <mesh position={[0, -0.22, 0.2]} castShadow>
      <boxGeometry args={[0.42, 0.36, 0.06]} />
      <meshStandardMaterial color="#1c2620" roughness={0.6} />
    </mesh>
    {sticker && (
      <mesh position={[0.22, 0.05, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial color="#f6c63b" emissive="#f6c63b" emissiveIntensity={0.25} />
      </mesh>
    )}
  </group>
);

const Store: React.FC = () => (
  <group position={[1.6, 0, 0.4]}>
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 1.8, 2.2]} />
      <meshStandardMaterial color="#e8e2d6" roughness={0.9} />
    </mesh>
    <mesh position={[0, 1.95, 0]} castShadow>
      <boxGeometry args={[3.35, 0.3, 2.35]} />
      <meshStandardMaterial color="#ef8a2a" roughness={0.7} />
    </mesh>
    {/* 光る窓 */}
    <mesh position={[0, 0.85, 1.105]}>
      <planeGeometry args={[2.7, 1.2]} />
      <meshStandardMaterial color="#ffe6b0" emissive="#ffd28a" emissiveIntensity={1.6} />
    </mesh>
    {[-0.9, -0.3, 0.3, 0.9].map((x) => (
      <mesh key={x} position={[x, 0.85, 1.11]}>
        <planeGeometry args={[0.04, 1.2]} />
        <meshStandardMaterial color="#8a7e6a" />
      </mesh>
    ))}
    <pointLight position={[0, 0.9, 2.6]} color="#ffbf6b" intensity={9} distance={7} decay={1.6} />
  </group>
);

const Tower: React.FC = () => {
  const wins = useMemo(() => {
    const a: { p: [number, number, number]; on: boolean }[] = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) a.push({ p: [-0.75 + c * 0.5, 0.7 + r * 0.6, 1.01], on: (r * 7 + c * 3) % 5 !== 0 });
    return a;
  }, []);
  return (
    <group position={[-3.2, 0, -3.2]}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 6, 2]} />
        <meshStandardMaterial color="#2f4f86" roughness={0.5} metalness={0.2} />
      </mesh>
      {wins.map((w, i) => (
        <mesh key={i} position={w.p}>
          <planeGeometry args={[0.3, 0.36]} />
          <meshStandardMaterial color="#9fc3ff" emissive="#9fc3ff" emissiveIntensity={w.on ? 0.9 : 0.1} />
        </mesh>
      ))}
    </group>
  );
};

// 店 → 本部 へ流れるコイン
const Coins: React.FC<{ f: number }> = ({ f }) => {
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(1.2, 2.3, 0.6), new THREE.Vector3(-1.2, 6.2, -0.6), new THREE.Vector3(-2.6, 5.2, -2.1)), []);
  return (
    <group>
      {Array.from({ length: 6 }, (_, i) => {
        const t = (f / 75 + i / 6) % 1;
        const p = curve.getPoint(t);
        const o = Math.min(1, t * 6, (1 - t) * 6);
        return (
          <mesh key={i} position={p} rotation={[Math.PI / 2 - 0.4, f / 8 + i, 0]} scale={o}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
            <meshStandardMaterial color="#f2c14e" metalness={0.8} roughness={0.25} emissive="#7a5200" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const geo = useOnigiri();
  const k = ease(f, 0, 170);
  // ゆっくり寄りながら回り込むカメラ
  const ang = interpolate(k, [0, 1], [1.0, 0.6]);
  const dist = interpolate(k, [0, 1], [22, 16]);
  const cam = new THREE.Vector3(Math.sin(ang) * dist, interpolate(k, [0, 1], [11, 6.5]), Math.cos(ang) * dist);
  return (
    <>
      <CameraRig pos={cam} target={[1.6, 2.2, 0.6]} />
      <color attach="background" args={["#0b1122"]} />
      <fog attach="fog" args={["#0b1122", 26, 48]} />
      <ambientLight intensity={0.7} color="#6d84c4" />
      <hemisphereLight args={["#3d5aa0", "#0b1122", 0.5]} />
      <directionalLight position={[-6, 10, 6]} intensity={1.1} color="#b9cbff" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#22305a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2.6]} receiveShadow>
        <planeGeometry args={[18, 1.4]} />
        <meshStandardMaterial color="#232f52" roughness={1} />
      </mesh>
      <Store />
      <Tower />
      {/* 店先の台：おにぎり10個（2個は値引きシール） */}
      <mesh position={[1.6, 0.2, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#cfc6b6" roughness={0.9} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <Onigiri key={i} geo={geo} p={[0.75 + (i % 5) * 0.42, 0.58, 1.85 + Math.floor(i / 5) * 0.26]} s={0.34} ry={0.5} sticker={i >= 8} />
      ))}
      <Coins f={f} />
    </>
  );
};

import { useThree } from "@react-three/fiber";
const CameraRig: React.FC<{ pos: THREE.Vector3; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.copy(pos);
  camera.lookAt(...target);
  return null;
};

export const Style3D: React.FC = () => {
  const f = useCurrentFrame();
  const shop = Math.round(interpolate(f, [60, 120], [-56, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const hq = Math.round(interpolate(f, [60, 120], [56, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const o = ease(f, 20, 45);
  return (
    <AbsoluteFill style={{ background: "#0b1122" }}>
      <ThreeCanvas width={1920} height={1080} shadows camera={{ fov: 35 }}>
        <Scene f={f} />
      </ThreeCanvas>
      {/* 2D の UI を重ねる */}
      <div style={{ position: "absolute", right: 70, top: 110, width: 520, padding: "28px 34px", borderRadius: 22, background: "rgba(16,24,44,.78)", border: "2px solid #33446e", opacity: o, fontFamily: SANS, color: "#fff" }}>
        <div style={{ fontSize: 22, letterSpacing: 3, color: "#7f8db0" }}>売れ残り 2個 を 50円で</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 34, fontWeight: 700 }}>
          <span style={{ color: "#ffc98a" }}>店</span>
          <span style={{ fontWeight: 900, fontSize: 56, color: shop < 0 ? "#ff7a6e" : "#ffb04a" }}>{shop > 0 ? "+" : shop < 0 ? "−" : ""}{Math.abs(shop)}円</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 30, fontWeight: 700 }}>
          <span style={{ color: "#9fc3ff" }}>本部</span>
          <span style={{ fontWeight: 900, fontSize: 40, color: "#7fb0ff" }}>+{hq}円</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 26, fontWeight: 900, color: "#ffb04a", opacity: ease(f, 120, 140) }}>店 +106円 ／ 本部 −6円</div>
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 150, fontFamily: SANS, fontSize: 20, color: "#7f8db0" }}>※計算・イメージ（仕入れ80円・売値100円・利益を半分ずつ、捨てた分は本部15%）</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", padding: "10px 28px", background: "rgba(10,14,28,.72)", borderRadius: 6 }}>値引きすると、店は106円よくなり、本部は6円減る。</div>
      </div>
    </AbsoluteFill>
  );
};
