// 写真のようなミニチュア（Poly Haven CC0 素材 + スタジオ HDRI + 被写界深度）
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField, Vignette, N8AO } from "@react-three/postprocessing";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
const body = new RoundedBoxGeometry(1.7, 0.55, 3.8, 6, 0.22);
const cabin = new RoundedBoxGeometry(1.45, 0.5, 2.0, 6, 0.2);
const glass = new RoundedBoxGeometry(1.48, 0.38, 1.85, 6, 0.16);

type V3 = [number, number, number];
const PH = (p: string) => staticFile(`polyhaven/${p}`);

/* ── 読み込み: Canvas の外でまとめて読み込み、終わってから描く ───────────────── */
const MODELS = ["potted_plant_01", "potted_plant_02", "planter_box_01", "shrub_01", "street_lamp_01", "outdoor_table_chair_set_01", "fire_hydrant", "metal_trash_can", "trashbag", "plastic_crate_01", "wooden_crate_01", "painted_wooden_bench", "flower_gazania"];
const TEXS = ["clay_plaster", "asphalt_02", "brick_pavement_02"];
type Store3D = { gltf: Record<string, THREE.Group>; tex: Record<string, THREE.Texture>; hdr: THREE.DataTexture | null };
const A: Store3D = { gltf: {}, tex: {}, hdr: null };
const loadAll = async () => {
  const gl = new GLTFLoader();
  const tl = new THREE.TextureLoader();
  await Promise.all([
    ...MODELS.map(async (m) => {
      A.gltf[m] = (await gl.loadAsync(PH(`${m}/${m}.gltf`))).scene;
    }),
    ...TEXS.flatMap((t) =>
      ["Diffuse", "nor_gl", "Rough"].map(async (k) => {
        A.tex[`${t}/${k}`] = await tl.loadAsync(PH(`tex/${t}/${k}.jpg`));
      }),
    ),
    (async () => {
      A.hdr = await new RGBELoader().loadAsync(PH("hdri/brown_photostudio_02.hdr"));
    })(),
  ]);
};
let loading: Promise<void> | null = null;

const Model: React.FC<{ name: string; p: V3; r?: number; s?: number }> = ({ name, p, r = 0, s = 1 }) => {
  const obj = useMemo(() => {
    const c = A.gltf[name].clone(true);
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return c;
  }, [name]);
  return <primitive object={obj} position={p} rotation={[0, r, 0]} scale={s} />;
};

const useTex = (name: string, kind: string, rep: [number, number], srgb = false) =>
  useMemo(() => {
    const t = A.tex[`${name}/${kind}`].clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...rep);
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [name, kind, rep[0], rep[1]]);
const Pbr: React.FC<{ name: string; rep: [number, number]; tint?: string; rough?: number }> = ({ name, rep, tint = "#fff", rough = 1 }) => {
  const d = useTex(name, "Diffuse", rep, true);
  const n = useTex(name, "nor_gl", rep);
  const r = useTex(name, "Rough", rep);
  return <meshStandardMaterial map={d} normalMap={n} roughnessMap={r} roughness={rough} color={tint} />;
};

const Env: React.FC = () => {
  const { scene, gl } = useThree();
  useEffect(() => {
    const hdr = A.hdr!;
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromEquirectangular(hdr).texture;
    scene.environment = env;
    (scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = 1.0;
  }, []);
  return null;
};

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/* ── コンビニの建物 ───────────────── */
const Awning: React.FC<{ w: number; p: V3 }> = ({ w, p }) => {
  const tex = useMemo(
    () =>
      canvasTex(1024, 256, (c) => {
        for (let i = 0; i < 16; i++) {
          c.fillStyle = i % 2 ? "#f6efe2" : "#d9652b";
          c.fillRect(i * 64, 0, 64, 256);
        }
        const g = c.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,.25)");
        c.fillStyle = g;
        c.fillRect(0, 0, 1024, 256);
      }),
    [],
  );
  // 波打つ布（ひだ）
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, 1.1, 64, 8);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin((x / w) * Math.PI * 16) * 0.025 * (0.6 - y));
    }
    g.computeVertexNormals();
    return g;
  }, [w]);
  return (
    <group position={p} rotation={[-0.55, 0, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial map={tex} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* 縁のフリル */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + (i + 0.5) * (w / 16), -0.6, 0.02]} rotation={[0.55, 0, 0]} castShadow>
          <cylinderGeometry args={[w / 32, w / 32, 0.18, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={i % 2 ? "#f6efe2" : "#d9652b"} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

/** 店内（棚に色とりどりの商品） */
const Interior: React.FC = () => {
  const items = useMemo(() => {
    const cols = ["#e94f37", "#f6c63b", "#3f88c5", "#44bba4", "#f49d37", "#ffffff", "#d7263d", "#8ac926"];
    const a: { p: V3; s: V3; c: string }[] = [];
    for (let shelf = 0; shelf < 3; shelf++)
      for (let row = 0; row < 4; row++)
        for (let i = 0; i < 18; i++) {
          const h = 0.12 + ((i * 7 + row * 3) % 5) * 0.03;
          a.push({ p: [-3.2 + i * 0.36, 0.5 + row * 0.42 + h / 2, -1.6 + shelf * 1.1], s: [0.26, h, 0.18], c: cols[(i * 5 + row * 3 + shelf) % cols.length] });
        }
    return a;
  }, []);
  return (
    <group>
      {[0, 1, 2].map((s) => (
        <group key={s}>
          {[0, 1, 2, 3].map((r) => (
            <mesh key={r} position={[0, 0.45 + r * 0.42, -1.6 + s * 1.1]} receiveShadow>
              <boxGeometry args={[6.8, 0.03, 0.4]} />
              <meshStandardMaterial color="#e6e2da" />
            </mesh>
          ))}
        </group>
      ))}
      {items.map((it, i) => (
        <mesh key={i} position={it.p}>
          <boxGeometry args={it.s} />
          <meshStandardMaterial color={it.c} roughness={0.5} />
        </mesh>
      ))}
      {/* 天井の蛍光灯 */}
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, 3.0, -0.6]}>
          <boxGeometry args={[1.4, 0.04, 0.12]} />
          <meshStandardMaterial color="#fff" emissive="#fff6e6" emissiveIntensity={3} />
        </mesh>
      ))}
      <pointLight position={[0, 2.6, 0]} intensity={18} color="#fff1d8" distance={9} decay={1.6} />
    </group>
  );
};

const Store: React.FC = () => {
  const sign = useMemo(
    () =>
      canvasTex(1024, 192, (c) => {
        c.fillStyle = "#fbf7ef";
        c.fillRect(0, 0, 1024, 192);
        c.fillStyle = "#d9652b";
        c.fillRect(0, 150, 1024, 42);
        c.fillStyle = "#3a2a1e";
        c.font = "900 108px 'Noto Sans CJK JP'";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("コンビニ", 512, 80);
      }),
    [],
  );
  return (
    <group position={[0, 0.15, -3]}>
      {/* 1階: 床・奥の壁・側壁 */}
      <mesh position={[0, 0.01, -0.2]} receiveShadow>
        <boxGeometry args={[8, 0.02, 4.6]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.7, -2.5]} receiveShadow>
        <boxGeometry args={[8, 3.4, 0.2]} />
        <Pbr name="clay_plaster" rep={[3, 1.5]} tint="#efe6d6" />
      </mesh>
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, 3.3, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 6.6, 4.8]} />
          <Pbr name="clay_plaster" rep={[2, 3]} tint="#e9dcc6" />
        </mesh>
      ))}
      <Interior />
      {/* ガラス */}
      <mesh position={[0, 1.55, 2.15]}>
        <planeGeometry args={[7.7, 2.9]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} thickness={0.02} transparent opacity={0.18} />
      </mesh>
      {[-2.6, 0, 2.6].map((x) => (
        <mesh key={x} position={[x, 1.55, 2.17]} castShadow>
          <boxGeometry args={[0.08, 3.0, 0.08]} />
          <meshStandardMaterial color="#3b3230" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* 看板 */}
      <mesh position={[0, 3.35, 2.2]} castShadow>
        <boxGeometry args={[8.1, 0.6, 0.25]} />
        <meshStandardMaterial color="#fbf7ef" />
      </mesh>
      <mesh position={[0, 3.35, 2.33]}>
        <planeGeometry args={[6, 0.56]} />
        <meshStandardMaterial map={sign} emissive="#ffffff" emissiveMap={sign} emissiveIntensity={0.35} />
      </mesh>
      <Awning w={8} p={[0, 2.85, 2.6]} />
      {/* 2階（住まい） */}
      <mesh position={[0, 5.0, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 2.8, 4.6]} />
        <Pbr name="clay_plaster" rep={[3, 1]} tint="#f1e3cc" />
      </mesh>
      <mesh position={[0, 6.45, -0.3]} castShadow>
        <boxGeometry args={[8.5, 0.15, 4.9]} />
        <meshStandardMaterial color="#6b3f2a" roughness={0.7} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, 5.0, 1.95]}>
          <mesh>
            <boxGeometry args={[1.8, 1.4, 0.1]} />
            <meshStandardMaterial color="#5a3a28" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.6, 1.2]} />
            <meshStandardMaterial color="#ffd9a0" emissive="#ffb766" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.05, 1.2, 0.02]} />
            <meshStandardMaterial color="#5a3a28" />
          </mesh>
        </group>
      ))}
      {/* バルコニーの花 */}
      <mesh position={[0, 3.75, 2.4]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 0.12, 1.0]} />
        <meshStandardMaterial color="#6b3f2a" roughness={0.7} />
      </mesh>
      {[-3.2, -1.6, 1.2, 2.9].map((x, i) => (
        <Model key={x} name={i % 2 ? "potted_plant_02" : "planter_box_01"} p={[x, 3.81, 2.6]} s={i % 2 ? 1.0 : 1.2} r={i * 0.7} />
      ))}
      <Model name="potted_plant_01" p={[0.0, 3.81, 2.5]} s={1.1} />
    </group>
  );
};

/* ── 探偵（3 頭身のフィギュア） ───────────────── */
const Detective: React.FC<{ p: V3; r: number }> = ({ p, r }) => (
  <group position={p} rotation={[0, r, 0]} scale={0.75}>
    {[-0.09, 0.09].map((x) => (
      <mesh key={x} position={[x, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 12]} />
        <meshStandardMaterial color="#4b3a2e" />
      </mesh>
    ))}
    <mesh position={[0, 0.52, 0]} castShadow>
      <cylinderGeometry args={[0.17, 0.3, 0.6, 24]} />
      <meshStandardMaterial color="#c9a063" roughness={0.85} />
    </mesh>
    <group position={[0, 1.07, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color="#ffe1c6" roughness={0.6} />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <mesh key={x} position={[x, 0.02, 0.31]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#2a211c" roughness={0.2} />
        </mesh>
      ))}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, -0.09, 0.27]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ffb3a7" />
        </mesh>
      ))}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
        <meshStandardMaterial color="#6b4a33" />
      </mesh>
      <mesh position={[0, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.26, 32]} />
        <meshStandardMaterial color="#6b4a33" />
      </mesh>
      <mesh position={[0, 0.29, 0]}>
        <cylinderGeometry args={[0.285, 0.285, 0.06, 32]} />
        <meshStandardMaterial color="#c9463d" />
      </mesh>
    </group>
  </group>
);

/** 小さな車（ミニカー風） */
const ToyCar: React.FC<{ p: V3; color: string; dir?: number }> = ({ p, color, dir = 1 }) => (
  <group position={p} rotation={[0, (dir * Math.PI) / 2, 0]}>
    <mesh position={[0, 0.48, 0]} geometry={body} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
    <mesh position={[0, 0.88, -0.2]} geometry={cabin} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
    </mesh>
    <mesh position={[0, 0.9, -0.2]} geometry={glass}>
      <meshStandardMaterial color="#1b2026" roughness={0.1} metalness={0.5} />
    </mesh>
    {[-0.85, 0.85].map((x) => [-1.2, 1.25].map((z) => (
      <mesh key={`${x}${z}`} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    )))}
    {[-0.55, 0.55].map((x) => (
      <mesh key={x} position={[x, 0.5, 1.91]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff3c4" emissiveIntensity={1.5} />
      </mesh>
    ))}
  </group>
);

const Road: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4.5]} receiveShadow>
      <planeGeometry args={[40, 7]} />
      <Pbr name="asphalt_02" rep={[10, 2]} tint="#8a8a8a" />
    </mesh>
    {Array.from({ length: 14 }, (_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-19 + i * 3, 0.005, 4.5]}>
        <planeGeometry args={[1.6, 0.14]} />
        <meshStandardMaterial color="#f2c94c" roughness={0.6} />
      </mesh>
    ))}
    {/* 歩道 */}
    <mesh position={[0, 0.075, -1]} receiveShadow castShadow>
      <boxGeometry args={[40, 0.15, 4]} />
      <Pbr name="brick_pavement_02" rep={[16, 1.6]} tint="#d9cfc0" />
    </mesh>
    <mesh position={[0, -0.02, -8]} receiveShadow>
      <boxGeometry args={[40, 0.1, 10]} />
      <meshStandardMaterial color="#8e7a63" />
    </mesh>
  </group>
);

/** となりの建物 */
const Neighbor: React.FC<{ x: number; tint: string; h: number }> = ({ x, tint, h }) => (
  <group position={[x, 0.15, -3.2]}>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[10, h, 5]} />
      <Pbr name="clay_plaster" rep={[4, 2]} tint={tint} />
    </mesh>
    {Array.from({ length: Math.floor(h / 2) }, (_, r) =>
      [-3, 0, 3].map((c) => (
        <group key={`${r}${c}`} position={[c, 1.4 + r * 2, 2.52]}>
          <mesh>
            <boxGeometry args={[1.3, 1.1, 0.06]} />
            <meshStandardMaterial color="#4a3326" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.15, 0.95]} />
            <meshStandardMaterial color={(r + c) % 2 ? "#ffcf8f" : "#3a4048"} emissive={(r + c) % 2 ? "#ffad55" : "#000"} emissiveIntensity={0.6} />
          </mesh>
        </group>
      )),
    )}
  </group>
);

/* ── カメラ ───────────────── */
const CameraRig: React.FC<{ pos: V3; target: V3 }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const t = interpolate(f, [0, 149], [0, 1], { easing: Easing.inOut(Easing.cubic) });
  const pos: V3 = [interpolate(t, [0, 1], [11, 6]), interpolate(t, [0, 1], [10, 7]), interpolate(t, [0, 1], [19, 15])];
  const focus = new THREE.Vector3(1.4, 0.7, 0.6);
  return (
    <>
      <CameraRig pos={pos} target={[0.4, 1.4, -1.0]} />
      <color attach="background" args={["#2b211b"]} />
      <Env />
      <directionalLight position={[-8, 12, 10]} intensity={3.4} color="#ffd6a3" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.02} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} />
      <Road />
      <Store />
      {/* 歩道の小物 */}
      <Model name="outdoor_table_chair_set_01" p={[2.9, 0.15, 0.1]} r={0.4} />
      <Model name="outdoor_table_chair_set_01" p={[-2.6, 0.15, 0.3]} r={-0.3} />
      <Model name="street_lamp_01" p={[5.2, 0.15, 0.7]} r={-1.57} />
      <Model name="fire_hydrant" p={[-4.6, 0.15, 0.6]} />
      <Model name="metal_trash_can" p={[4.3, 0.15, -0.6]} />
      <Model name="trashbag" p={[4.9, 0.15, -0.9]} r={0.6} />
      <Model name="trashbag" p={[4.6, 0.15, -1.6]} r={2.1} s={0.9} />
      <Model name="plastic_crate_01" p={[-4.2, 0.15, -1.6]} r={0.2} />
      <Model name="plastic_crate_01" p={[-4.2, 0.41, -1.6]} r={-0.1} />
      <Model name="wooden_crate_01" p={[-3.4, 0.15, -1.9]} r={0.1} />
      <Model name="painted_wooden_bench" p={[-6.4, 0.15, -0.4]} r={0.3} />
      <Model name="shrub_01" p={[-7.5, 0.15, -1.9]} />
      <Model name="shrub_01" p={[7.6, 0.15, -1.9]} />
      <Model name="potted_plant_01" p={[-4.6, 0.15, -0.8]} />
      <Model name="flower_gazania" p={[7.2, 0.15, -0.6]} s={0.6} />
      <Detective p={[1.4, 0.15, 0.6]} r={0.5} />
      <ToyCar p={[interpolate(f, [0, 149], [-13, -6]), 0, 3.0]} color="#bfe3ef" />
      <ToyCar p={[interpolate(f, [0, 149], [12, 7]), 0, 6.0]} color="#f2e1c2" dir={-1} />
      <Neighbor x={-9.2} tint="#d9c2a8" h={5.5} />
      <Neighbor x={9.2} tint="#c9b8a4" h={7.5} />
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={0.6} intensity={2.5} distanceFalloff={0.5} />
        <DepthOfField target={focus} focalLength={0.04} bokehScale={7} height={540} />
        <Bloom luminanceThreshold={0.9} intensity={0.4} mipmapBlur />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    </>
  );
};

export const MiniStill: React.FC = () => {
  const f = useCurrentFrame();
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("polyhaven assets", { timeoutInMilliseconds: 180000 }));
  useEffect(() => {
    loading ??= loadAll();
    loading.then(() => {
      setReady(true);
      continueRender(h);
    });
  }, []);
  if (!ready) return null;
  return (
    <AbsoluteFill style={{ background: "#2b211b" }}>
      <ThreeCanvas width={1920} height={1080} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ fov: 30, near: 0.5, far: 80 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35 }}>
        <Scene f={f} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
