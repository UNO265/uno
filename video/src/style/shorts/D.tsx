// D: あたたかいミニチュアのジオラマ（3D）+ 探偵キャラクター + テロップ
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, TiltShift2, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Shell, Telop, at, k, pop, useG } from "./common";

type V3 = [number, number, number];
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/* ── 素材 ───────────────── */
const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};
const useWood = () =>
  useMemo(
    () =>
      canvasTex(1024, 1024, (c) => {
        c.fillStyle = "#c8945e";
        c.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 260; i++) {
          const y = (i * 37.3) % 1024;
          c.strokeStyle = `rgba(${90 + (i % 5) * 8},${55 + (i % 7) * 4},${30},${0.06 + (i % 4) * 0.025})`;
          c.lineWidth = 1 + (i % 3);
          c.beginPath();
          c.moveTo(0, y);
          for (let x = 0; x <= 1024; x += 32) c.lineTo(x, y + Math.sin(x / 90 + i) * 6);
          c.stroke();
        }
        for (let p = 1; p < 4; p++) {
          c.fillStyle = "rgba(70,40,20,.25)";
          c.fillRect(0, p * 256 - 2, 1024, 4);
        }
      }),
    [],
  );
const useSign = (text: string, bg: string, fg: string) =>
  useMemo(
    () =>
      canvasTex(512, 160, (c) => {
        c.fillStyle = bg;
        c.fillRect(0, 0, 512, 160);
        c.fillStyle = fg;
        c.font = "900 104px 'Noto Sans CJK JP'";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(text, 256, 86);
      }),
    [text, bg, fg],
  );
const useOnigiriGeo = () =>
  useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.quadraticCurveTo(0.12, 0.52, 0.45, -0.18);
    s.quadraticCurveTo(0.55, -0.42, 0.3, -0.42);
    s.lineTo(-0.3, -0.42);
    s.quadraticCurveTo(-0.55, -0.42, -0.45, -0.18);
    s.quadraticCurveTo(-0.12, 0.52, 0, 0.5);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 5, curveSegments: 18 });
    g.center();
    return g;
  }, []);

const Std: React.FC<{ c: string; r?: number; m?: number; e?: string; ei?: number; map?: THREE.Texture }> = ({ c, r = 0.75, m = 0, e, ei = 0, map }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} />
);

/* ── 配置 ───────────────── */
const TABLE: V3 = [0.6, 0.25, 1.25];
const oniPos = (i: number): V3 => [-0.4 + (i % 5) * 0.5, 0.72, 1.08 + Math.floor(i / 5) * 0.34];
const CAN: V3 = [2.6, 0, 1.05];
const HQ: V3 = [-2.5, 0, -2.6];

const Onigiri: React.FC<{ p: V3; s: number; gray: number; geo: THREE.ExtrudeGeometry; sticker: number; rot?: number }> = ({ p, s, gray, geo, sticker, rot = 0.25 }) => {
  const col = new THREE.Color("#fffaf0").lerp(new THREE.Color("#a9a49a"), gray);
  return (
    <group position={p} scale={s} rotation={[0, rot, 0]}>
      <mesh geometry={geo} scale={0.42} castShadow receiveShadow>
        <meshStandardMaterial color={col} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.09, 0.09]} castShadow>
        <boxGeometry args={[0.18, 0.15, 0.03]} />
        <Std c={gray > 0.5 ? "#4a4f4a" : "#1c2620"} r={0.5} />
      </mesh>
      {sticker > 0 && (
        <mesh position={[0.1, 0.03, 0.115]} rotation={[Math.PI / 2, 0, 0]} scale={sticker}>
          <cylinderGeometry args={[0.075, 0.075, 0.012, 32]} />
          <Std c="#ffcf3f" e="#ffcf3f" ei={0.25} />
        </mesh>
      )}
    </group>
  );
};

const Store: React.FC<{ glow: number }> = ({ glow }) => {
  const sign = useSign("コンビニ", "#fffaf0", "#e0782a");
  return (
    <group position={[0.6, 0, -0.5]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.8, 2]} />
        <Std c="#fff1dc" r={0.9} />
      </mesh>
      {/* しま模様のひさし */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-1.35 + i * 0.3, 1.62, 1.18]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.05, 0.5]} />
          <Std c={i % 2 ? "#fffaf0" : "#ef8a2a"} />
        </mesh>
      ))}
      <mesh position={[0, 2.0, 1.01]}>
        <planeGeometry args={[1.6, 0.5]} />
        <meshStandardMaterial map={sign} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, 1.005]}>
        <planeGeometry args={[2.5, 1.0]} />
        <Std c="#fbe9c4" e="#ffd58f" ei={0.12 + glow * 0.6} />
      </mesh>
      <mesh position={[0, 1.83, 0]} castShadow>
        <boxGeometry args={[3.08, 0.08, 2.08]} />
        <Std c="#e8dcc6" />
      </mesh>
      <pointLight position={[0, 0.8, 1.6]} color="#ffbf6b" intensity={0.8 + glow * 3} distance={5} decay={1.8} />
    </group>
  );
};

const Tower: React.FC = () => {
  const sign = useSign("本部", "#dce9fb", "#2f5fa8");
  return (
    <group position={HQ}>
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 4.8, 1.6]} />
        <Std c="#a9c6ee" r={0.6} />
      </mesh>
      {Array.from({ length: 7 }, (_, r) =>
        [0, 1, 2].map((c) => (
          <mesh key={`${r}${c}`} position={[-0.5 + c * 0.5, 0.8 + r * 0.55, 0.805]}>
            <planeGeometry args={[0.3, 0.32]} />
            <Std c="#eef5ff" e="#cfe3ff" ei={(r + c) % 3 ? 0.35 : 0.05} />
          </mesh>
        )),
      )}
      <mesh position={[0, 4.95, 0]} castShadow>
        <boxGeometry args={[1.9, 0.12, 1.7]} />
        <Std c="#7fa4d8" />
      </mesh>
      <mesh position={[0, 0.45, 0.81]}>
        <planeGeometry args={[1.1, 0.34]} />
        <meshStandardMaterial map={sign} />
      </mesh>
    </group>
  );
};

const Can: React.FC<{ lid: number }> = ({ lid }) => (
  <group position={CAN}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.34, 0.3, 0.8, 32]} />
      <Std c="#8fb39a" r={0.6} />
    </mesh>
    <group position={[-0.34, 0.82, 0]} rotation={[0, 0, lid * 1.1]}>
      <mesh position={[0.34, 0, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.06, 32]} />
        <Std c="#6f9a7e" />
      </mesh>
    </group>
  </group>
);

/** 探偵（3頭身） */
const Detective: React.FC<{ g: number; look: number; shake: number; lens: number }> = ({ g, look, shake, lens }) => {
  const bob = Math.sin(g / 7) * 0.02;
  return (
    <group position={[-1.0, bob, 1.6]} rotation={[0, 0.55 + look, 0]}>
      <mesh position={[-0.09, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 12]} />
        <Std c="#4b3a2e" />
      </mesh>
      <mesh position={[0.09, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 12]} />
        <Std c="#4b3a2e" />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.3, 0.6, 24]} />
        <Std c="#d1a866" r={0.8} />
      </mesh>
      <mesh position={[0, 0.66, 0.13]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.24, 0.12, 0.04]} />
        <Std c="#b88e4e" />
      </mesh>
      <group position={[0, 1.07, 0]} rotation={[0, Math.sin(g / 2.2) * 0.4 * shake, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 32, 32]} />
          <Std c="#ffe1c6" r={0.7} />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.02, 0.31]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <Std c="#2a211c" r={0.3} />
          </mesh>
        ))}
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, -0.09, 0.27]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <Std c="#ffb3a7" />
          </mesh>
        ))}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
          <Std c="#6b4a33" />
        </mesh>
        <mesh position={[0, 0.39, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 0.26, 32]} />
          <Std c="#6b4a33" />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <cylinderGeometry args={[0.285, 0.285, 0.06, 32]} />
          <Std c="#c9463d" />
        </mesh>
      </group>
      {/* 虫めがね */}
      <group position={[0.34, 0.62 + lens * 0.3, 0.12 + lens * 0.12]} rotation={[0, 0, -0.5 + lens * 0.3]}>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
          <Std c="#5a3e2b" />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.022, 12, 32]} />
          <Std c="#d9b25a" m={0.6} r={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 32]} />
          <meshStandardMaterial color="#cfe8ff" transparent opacity={0.35} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

const Coin: React.FC<{ p: V3; s?: number; tint?: number; big?: boolean }> = ({ p, s = 1, tint = 0, big }) => (
  <mesh position={p} scale={[big ? 1.5 : 1, s, big ? 1.5 : 1]} castShadow>
    <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
    <meshStandardMaterial color={new THREE.Color("#f2c14e").lerp(new THREE.Color("#ff5a4a"), tint)} metalness={0.75} roughness={0.28} emissive="#6b4800" emissiveIntensity={0.25} />
  </mesh>
);

const Flag: React.FC<{ x: number; text: string; bg: string; fg: string }> = ({ x, text, bg, fg }) => {
  const t = useSign(text, bg, fg);
  return (
    <group position={[x, 0, 2.0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
        <Std c="#8a6a4a" />
      </mesh>
      <mesh position={[0, 0.82, 0.02]} castShadow>
        <planeGeometry args={[0.6, 0.19]} />
        <meshStandardMaterial map={t} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const CameraRig: React.FC<{ pos: V3; target: V3 }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

/* ── カメラの台本 ───────────────── */
const KEYS: { id: string; pos: V3; target: V3 }[] = [
  { id: "T01", pos: [-0.4, 1.7, 5.4], target: [-0.4, 0.75, 1.3] },
  { id: "T02", pos: [0.2, 3.3, 8.6], target: [0.3, 0.8, 1.0] },
  { id: "T03", pos: [1.3, 2.9, 7.8], target: [1.0, 0.75, 1.0] },
  { id: "T04", pos: [0.3, 3.1, 8.2], target: [0.4, 0.8, 1.0] },
  { id: "T05", pos: [0.3, 1.6, 5.9], target: [0.3, 0.25, 2.35] },
  { id: "T06", pos: [1.9, 2.0, 5.2], target: [2.3, 0.75, 1.05] },
];
const camAt = (g: number) => {
  let i = 0;
  for (let j = 0; j < KEYS.length; j++) if (g >= at(KEYS[j].id)) i = j;
  const a = at(KEYS[i].id);
  const prev = KEYS[Math.max(0, i - 1)];
  const t = i === 0 ? 0 : k(g, a, a + 20);
  // カットの中でもゆっくり寄る
  const drift = Math.min(1, (g - a) / 120) * 0.06;
  const pos = lerp3(prev.pos, KEYS[i].pos, t);
  const tg = lerp3(prev.target, KEYS[i].target, t);
  return { pos: lerp3(pos, tg, drift), target: tg };
};

const Scene: React.FC<{ g: number }> = ({ g }) => {
  const geo = useOnigiriGeo();
  const wood = useWood();
  const t2 = at("T02"), t3 = at("T03"), t4 = at("T04"), t5 = at("T05"), t6 = at("T06");
  const t2b = at("T02", 1), t4b = at("T04", 1), t5b = at("T05", 1);
  const eve = k(g, t6, t6 + 25);
  const cam = camAt(g);
  const lid = g >= t3 && g < t4 ? k(g, t3, t3 + 8) * (1 - k(g, t3 + 34, t3 + 44)) : g >= t6 ? 0.6 * k(g, t6 + 10, t6 + 20) : 0;
  return (
    <>
      <CameraRig pos={cam.pos} target={cam.target} />
      <color attach="background" args={[new THREE.Color("#f2dfc2").lerp(new THREE.Color("#6d5a7a"), eve * 0.7).getStyle()]} />
      <fog attach="fog" args={[new THREE.Color("#f2dfc2").lerp(new THREE.Color("#6d5a7a"), eve * 0.7).getStyle(), 12, 26]} />
      <hemisphereLight args={["#fff1dc", "#8a6a50", 0.9 - eve * 0.4]} />
      <directionalLight position={[-4, 7, 6]} intensity={2.2 - eve * 1.4} color="#ffd9a8" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-radius={6} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} />
      <directionalLight position={[5, 3, -4]} intensity={0.5} color="#b9d4ff" />
      {/* 机 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={wood} roughness={0.85} />
      </mesh>
      {/* 道（紙） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.35]} receiveShadow>
        <planeGeometry args={[14, 0.9]} />
        <Std c="#e9e2d4" r={1} />
      </mesh>
      <Store glow={eve} />
      <Tower />
      <Can lid={lid} />
      <mesh position={TABLE} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.5, 0.8]} />
        <Std c="#f4e6cf" r={0.9} />
      </mesh>
      {g >= t2 - 2 &&
        g < t5 &&
        Array.from({ length: 10 }, (_, i) => {
          const left = i >= 8;
          const base = oniPos(i);
          const appear = pop(g, t2 + i * 2, 10);
          const gray = left && g < t4 ? k(g, t2b, t2b + 8) : 0;
          let p = base;
          let s = appear;
          if (left && g >= t3 && g < t4) {
            const f = k(g, t3 + 8, t3 + 30, (x) => x);
            const top: V3 = [CAN[0], 1.0, CAN[2]];
            p = lerp3(base, top, f);
            p = [p[0], p[1] + Math.sin(Math.PI * f) * 0.9, p[2]];
            s = 1 - k(g, t3 + 26, t3 + 32);
          }
          if (left && g >= t4) s = pop(g, t4 + 2 + (i - 8) * 3, 10);
          const sold = g >= t4b ? k(g, t4b + i * 1.2, t4b + i * 1.2 + 10) : 0;
          if (sold > 0) {
            p = [p[0], p[1] + sold * 0.8, p[2]];
            s *= 1 - sold;
          }
          return s > 0.01 ? <Onigiri key={i} p={p} s={s} gray={gray} geo={geo} sticker={left && g >= t4 ? pop(g, t4 + 8 + (i - 8) * 3) : 0} /> : null;
        })}
      {g < t2 && <Onigiri p={[0.05, 0.78, 1.3]} s={1.5 + 0.04 * Math.sin(g / 5)} gray={0} geo={geo} sticker={1.2} rot={0.15} />}
      {/* 売れたあと: コインが店と本部へ */}
      {g >= t4b + 6 &&
        g < t5 &&
        Array.from({ length: 8 }, (_, i) => {
          const f = k(g, t4b + 6 + i * 2, t4b + 26 + i * 2);
          const toHQ = i % 2 === 1;
          const a: V3 = [oniPos(i)[0], 1.0, oniPos(i)[2]];
          const b: V3 = toHQ ? [HQ[0], 5.1, HQ[2]] : [0.6, 2.1, 0.55];
          const p = lerp3(a, b, f);
          return f > 0 && f < 1 ? <Coin key={i} p={[p[0], p[1] + Math.sin(Math.PI * f) * 1.2, p[2]]} /> : null;
        })}
      {/* 比べる: 道の上に 2 つのコインの山。店は伸び、本部は 1 枚が赤くなって欠けるだけ */}
      {g >= t5 && (
        <group>
          <Flag x={1.0} text="店" bg="#fff3e2" fg="#e0782a" />
          <Flag x={-0.4} text="本部" bg="#e6f0ff" fg="#2f5fa8" />
          {Array.from({ length: 11 }, (_, i) => (g >= t5 + 6 + i * 2 ? <Coin key={i} p={[1.0, 0.03 + i * 0.055, 2.35]} s={1} big /> : null))}
          {Array.from({ length: 6 }, (_, i) => (
            <Coin key={`h${i}`} p={[-0.4, 0.03 + i * 0.055, 2.35]} s={i === 5 ? 1 - 0.6 * k(g, t5b, t5b + 10) : 1} tint={i === 5 ? k(g, t5b, t5b + 6) : 0} big />
          ))}
        </group>
      )}
      <Detective g={g} look={g < t2 ? -0.2 : g >= t3 && g < t4 ? 0.45 : g >= t6 ? 0.7 : 0} shake={g >= at("T03", 1) && g < t4 ? 1 : 0} lens={g < t2 ? 1 : g >= t6 ? 0.8 : 0} />
      <EffectComposer multisampling={4}>
        <TiltShift2 blur={0.18} taper={0.6} start={[0.5, 0.0]} end={[0.5, 1.0]} />
        <Bloom luminanceThreshold={0.9} intensity={0.35} mipmapBlur />
        <Vignette offset={0.25} darkness={0.55} />
      </EffectComposer>
    </>
  );
};

const INK = "#3b2a1c";
export const ShortD: React.FC = () => {
  const g = useG();
  const t2 = at("T02"), t3 = at("T03"), t4 = at("T04"), t5 = at("T05"), t6 = at("T06");
  const t2b = at("T02", 1), t3b = at("T03", 1), t4b = at("T04", 1), t5b = at("T05", 1), t6b = at("T06", 1);
  return (
    <Shell bg="#f2dfc2">
      <AbsoluteFill>
        <ThreeCanvas width={1080} height={1920} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ fov: 50 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
          <Scene g={g} />
        </ThreeCanvas>
      </AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {g < t2 && (
          <g>
            <Telop x={540} y={330} size={88} color={INK}>値引きで、本部の損は</Telop>
            <Telop x={540} y={490} size={150} color="#e8452f" s={1 + 0.03 * Math.sin(g / 4)}>6円だけ？</Telop>
          </g>
        )}
        {g >= t2 && g < t3 && (
          <g>
            <Telop x={540} y={330} size={70} color={INK} o={k(g, t2, t2 + 6)}>仕入れ 80円 → 売値 100円</Telop>
            <Telop x={540} y={460} size={90} color="#e8452f" o={pop(g, t2b)} s={pop(g, t2b)}>売れ残り 2個</Telop>
          </g>
        )}
        {g >= t3 && g < t4 && (
          <g>
            <Telop x={540} y={300} size={60} color={INK} o={k(g, t3, t3 + 6)}>① 捨てると…</Telop>
            <Telop x={540} y={430} size={96} color="#2f6fc9" s={pop(g, t3 + 16)} o={g >= t3 + 16 ? 1 : 0}>本部 +56円</Telop>
            <Telop x={540} y={560} size={110} color="#e8452f" s={pop(g, t3b)} o={g >= t3b ? 1 : 0}>店 −56円</Telop>
          </g>
        )}
        {g >= t4 && g < t5 && (
          <g>
            <Telop x={540} y={300} size={60} color={INK} o={k(g, t4, t4 + 6)}>② 50円で売り切ると…</Telop>
            <Telop x={540} y={430} size={96} color="#2f6fc9" s={pop(g, t4b)} o={g >= t4b ? 1 : 0}>本部 +50円</Telop>
            <Telop x={540} y={560} size={110} color="#e57f1e" s={pop(g, t4b + 10)} o={g >= t4b + 10 ? 1 : 0}>店 +50円</Telop>
          </g>
        )}
        {g >= t5 && g < t6 && (
          <g>
            <Telop x={540} y={360} size={150} color="#e57f1e" s={pop(g, t5 + 4)}>店 +106円</Telop>
            <Telop x={540} y={500} size={70} color="#2f6fc9" s={pop(g, t5b)} o={g >= t5b ? 1 : 0}>本部は −6円 だけ</Telop>
          </g>
        )}
        {g >= t6 && (
          <g>
            <Telop x={540} y={330} size={84} color="#fff" edge={INK} o={k(g, t6, t6 + 6)}>コンビニ、なぜ</Telop>
            <Telop x={540} y={460} size={100} color="#ffd84d" edge={INK} o={k(g, t6, t6 + 6)}>値引きせず捨てる？</Telop>
            <Telop x={540} y={1150} size={66} color="#fff" edge={INK} o={k(g, t6b, t6b + 8)}>1店 年468万円</Telop>
          </g>
        )}
      </svg>
    </Shell>
  );
};
