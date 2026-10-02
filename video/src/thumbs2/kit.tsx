// 썸네일 v2: 3D 제품 렌더(three.js) + 입체 타이포. 형식은 그대로(물체 1 + 숫자 1 + 질문 1).
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const SANS = "'Noto Sans CJK JP', sans-serif";

const Env: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = intensity;
  }, [gl, scene, intensity]);
  return null;
};

const Cam: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

/** 3D の物（スタジオ照明）。背景は透明にして下の 2D 背景を見せる */
export const Stage3D: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; target?: [number, number, number]; fov?: number; key?: string; env?: number }> = ({ children, cam = [0, 0.4, 6], target = [0, 0, 0], fov = 30, env = 1 }) => (
  <ThreeCanvas width={1280} height={720} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ fov }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }} style={{ position: "absolute", inset: 0 }}>
    <Cam pos={cam} target={target} />
    <Env intensity={env} />
    <directionalLight position={[-4, 6, 5]} intensity={2.2} color="#fff4e6" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={8} />
    <directionalLight position={[5, 2, -3]} intensity={2.5} color="#7fb2ff" />
    <pointLight position={[3, -1, 3]} intensity={6} color="#ffcf7a" distance={10} />
    {/* 影を受ける床（影だけ見える） */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <shadowMaterial opacity={0.45} />
    </mesh>
    {children}
    <EffectComposer multisampling={4}>
      <Bloom luminanceThreshold={0.85} intensity={0.6} mipmapBlur />
    </EffectComposer>
  </ThreeCanvas>
);

/** 背景: スタジオのグラデーション + 光の筋 + うっすら上がる折れ線（経済チャンネルの印） */
export const Backdrop: React.FC<{ hue?: string; glow?: string }> = ({ hue = "#0c1830", glow = "#2a5aa8" }) => (
  <svg viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <defs>
      <radialGradient id="bg" cx="34%" cy="52%" r="80%">
        <stop offset="0" stopColor={glow} />
        <stop offset="0.45" stopColor={hue} />
        <stop offset="1" stopColor="#04070e" />
      </radialGradient>
      <linearGradient id="ray" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity={0.14} />
        <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
      </filter>
    </defs>
    <rect width={1280} height={720} fill="url(#bg)" />
    {[0, 1, 2].map((i) => (
      <polygon key={i} points={`${120 + i * 140},0 ${260 + i * 140},0 ${620 + i * 90},720 ${420 + i * 90},720`} fill="url(#ray)" />
    ))}
    {/* グリッドと折れ線 */}
    <g opacity={0.16} stroke="#9fc3ff" strokeWidth={1}>
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} x2={1280} y1={80 + i * 80} y2={80 + i * 80} />)}
    </g>
    <polyline points="0,610 160,590 300,600 440,540 600,560 760,470 900,500 1060,400 1280,330" fill="none" stroke="#6fb0ff" strokeWidth={4} opacity={0.22} />
    <rect width={1280} height={720} filter="url(#grain)" />
  </svg>
);

/** 立体の文字: 外側の白フチ → 濃い縁 → グラデーション塗り + 影 */
export const Hero: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; from?: string; to?: string; anchor?: "start" | "middle" | "end"; rot?: number; id: string }> = ({ x, y, size, children, from = "#fff6a8", to = "#ffb300", anchor = "middle", rot = 0, id }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <defs>
      <linearGradient id={`g${id}`} x1="0" y1="-1" x2="0" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
      <filter id={`s${id}`} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx={0} dy={size * 0.06} stdDeviation={size * 0.04} floodColor="#000" floodOpacity={0.7} />
      </filter>
    </defs>
    <g filter={`url(#s${id})`} fontFamily={SANS} fontWeight={900} fontSize={size} textAnchor={anchor} letterSpacing={-size * 0.02}>
      <text stroke="#ffffff" strokeWidth={size * 0.26} strokeLinejoin="round">{children}</text>
      <text stroke="#120a00" strokeWidth={size * 0.15} strokeLinejoin="round">{children}</text>
      <text fill={`url(#g${id})`}>{children}</text>
    </g>
  </g>
);

/** 値札（白いカード + 赤い縁 + 光沢） */
export const PriceCard: React.FC<{ x: number; y: number; text: string; size?: number; rot?: number }> = ({ x, y, text, size = 120, rot = -4 }) => {
  const w = text.length * size * 0.62 + size * 0.9;
  const h = size * 1.45;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9edf3" />
        </linearGradient>
        <filter id="cardsh" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx={0} dy={14} stdDeviation={14} floodOpacity={0.55} />
        </filter>
      </defs>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.18} fill="url(#card)" stroke="#d6261c" strokeWidth={size * 0.11} filter="url(#cardsh)" />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h * 0.32} rx={h * 0.14} fill="#ffffff" opacity={0.6} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={size} fill="#d6261c" letterSpacing={-size * 0.02}>
        {text}
      </text>
    </g>
  );
};

export const Brand: React.FC = () => (
  <svg viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <rect x={40} y={36} width={56} height={9} fill="#e0352b" />
    <text x={40} y={78} fontFamily={SANS} fontWeight={900} fontSize={24} letterSpacing={4} fill="#ffffff" opacity={0.85}>KANENAZO</text>
  </svg>
);

export const ThumbShell: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#05080f" }}>{children}</AbsoluteFill>;
