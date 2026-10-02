// #006 ガチャガチャ、なぜ500円に？ ― カプセル + 500円 + なぜ売れる？
import React, { useMemo } from "react";
import * as THREE from "three";
import { Backdrop, Brand, Hero, PriceCard, Stage3D, ThumbShell } from "./kit";

const Capsule: React.FC<{ p: [number, number, number]; color: string; r?: number; rot?: [number, number, number] }> = ({ p, color, r = 1, rot = [0, 0, 0] }) => (
  <group position={p} rotation={rot} scale={r}>
    {/* 上: 透明 */}
    <mesh castShadow>
      <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.4} roughness={0.04} ior={1.45} clearcoat={1} transparent />
    </mesh>
    {/* 下: 色 */}
    <mesh castShadow>
      <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshPhysicalMaterial color={color} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.0, 0.035, 16, 96]} />
      <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} />
    </mesh>
    {/* 中の小さなおもちゃ（オリジナル: 星形のマスコット） */}
    <mesh position={[0, 0.28, 0]} castShadow>
      <icosahedronGeometry args={[0.42, 0]} />
      <meshStandardMaterial color="#ffd23f" roughness={0.35} flatShading />
    </mesh>
    {[-0.12, 0.12].map((x) => (
      <mesh key={x} position={[x, 0.36, 0.38]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    ))}
  </group>
);

const Coin: React.FC<{ p: [number, number, number]; rot: [number, number, number]; s?: number }> = ({ p, rot, s = 1 }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#c9a227";
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = "#8a6d12";
    g.lineWidth = 18;
    g.beginPath();
    g.arc(256, 256, 220, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#7a5f0e";
    g.font = "900 190px 'Noto Sans CJK JP'";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("500", 256, 270);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={p} rotation={rot} scale={s} castShadow>
      <cylinderGeometry args={[0.62, 0.62, 0.09, 96]} />
      <meshPhysicalMaterial attach="material-0" color="#c49a22" metalness={1} roughness={0.25} />
      <meshPhysicalMaterial attach="material-1" map={tex} metalness={1} roughness={0.28} />
      <meshPhysicalMaterial attach="material-2" map={tex} metalness={1} roughness={0.28} />
    </mesh>
  );
};

export const T006: React.FC = () => (
  <ThumbShell>
    <Backdrop hue="#2a0c1e" glow="#a8325a" />
    <Stage3D cam={[0, 0.6, 7.2]} target={[0, -0.1, 0]} fov={30}>
      <group position={[-2.5, 0, 0]}>
        <Capsule p={[0, 0.15, 0]} color="#e8343b" r={1.15} rot={[0.15, 0.4, -0.12]} />
        <Capsule p={[-1.25, -0.75, 1.0]} color="#2f7be5" r={0.6} rot={[0.5, -0.4, 0.3]} />
        <Capsule p={[1.2, -0.85, 1.3]} color="#1fb36b" r={0.48} rot={[-0.3, 0.6, 0.5]} />
        <Coin p={[0.9, -1.05, 1.9]} rot={[1.2, 0, -0.35]} s={0.85} />
      </group>
    </Stage3D>
    <svg viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <PriceCard x={930} y={190} text="500円" size={128} rot={-5} />
      <Hero id="q1" x={940} y={460} size={150}>なぜ</Hero>
      <Hero id="q2" x={940} y={640} size={150}>売れる？</Hero>
    </svg>
    <Brand />
  </ThumbShell>
);
