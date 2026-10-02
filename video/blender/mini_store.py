"""写真のようなミニチュアのコンビニ（Blender / Cycles）。

  python mini_store.py --out out.png [--res 1920 1080] [--samples 256] [--gpu]

座標は three.js 版（src/style/Mini.tsx）と同じ数字を使い、T() で Blender（Z が上）に変換する。
素材は public/polyhaven/（scripts/fetch_polyhaven.* で取得、CC0）。
"""
import argparse
import math
import random
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parent.parent
PH = ROOT / "public" / "polyhaven"
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"

ap = argparse.ArgumentParser()
ap.add_argument("--out", default=str(ROOT / "out" / "blender_mini.png"))
ap.add_argument("--res", nargs=2, type=int, default=[960, 540])
ap.add_argument("--samples", type=int, default=48)
ap.add_argument("--gpu", action="store_true")
args = ap.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:])


def T(x, y, z):
    """three.js（Y が上）→ Blender（Z が上）"""
    return Vector((x, -z, y))


# ── 初期化 ─────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection

# ── マテリアル ─────────────────
_mats = {}


def mat(name, color, rough=0.6, metal=0.0, emit=None, emit_s=0.0, coat=0.0, alpha=1.0, trans=0.0):
    key = (name, color)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    c = tuple(int(color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    b.inputs["Base Color"].default_value = (*[v ** 2.2 for v in c], 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Transmission Weight"].default_value = trans
    b.inputs["Alpha"].default_value = alpha
    if emit:
        e = tuple(int(emit[i:i + 2], 16) / 255 for i in (1, 3, 5))
        b.inputs["Emission Color"].default_value = (*[v ** 2.2 for v in e], 1)
        b.inputs["Emission Strength"].default_value = emit_s
    _mats[key] = m
    return m


def pbr(name, tex, color, scale=1.0, use_diffuse=False, bump=0.4):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])

    def img(kind, non_color=True):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(str(PH / "tex" / tex / f"{kind}.jpg"))
        n.projection = "BOX"
        n.projection_blend = 0.3
        if non_color:
            n.image.colorspace_settings.name = "Non-Color"
        nt.links.new(mp.outputs["Vector"], n.inputs["Vector"])
        return n

    c = tuple(int(color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    rgb = (*[v ** 2.2 for v in c], 1)
    if use_diffuse:
        d = img("Diffuse", False)
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs["Factor"].default_value = 1.0
        nt.links.new(d.outputs["Color"], mix.inputs["A"])
        mix.inputs["B"].default_value = rgb
        nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    else:
        b.inputs["Base Color"].default_value = rgb
    r = img("Rough")
    nt.links.new(r.outputs["Color"], b.inputs["Roughness"])
    n = img("nor_gl")
    nm = nt.nodes.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = bump
    nt.links.new(n.outputs["Color"], nm.inputs["Color"])
    nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    return m


# ── 形 ─────────────────
def box(c, size, m, bevel=0.02, name="box", rot=(0, 0, 0)):
    w, h, d = size
    bpy.ops.mesh.primitive_cube_add(size=1, location=T(*c))
    o = bpy.context.object
    o.name = name
    o.scale = (w, d, h)
    o.rotation_euler = rot
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bv = o.modifiers.new("bevel", "BEVEL")
        bv.width = bevel
        bv.segments = 3
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth_by_angle() if hasattr(bpy.ops.object, "shade_smooth_by_angle") else None
    return o


def cyl(c, r, h, m, verts=32, r2=None, name="cyl"):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=T(*c))
    o = bpy.context.object
    o.name = name
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def sphere(c, r, m, name="sph"):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=T(*c), segments=32, ring_count=16)
    o = bpy.context.object
    o.name = name
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def model(name, p, r=0.0, s=1.0):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(PH / name / f"{name}.gltf"))
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    for o in roots:
        o.location = T(*p)
        o.rotation_euler = (0, 0, r)
        o.scale = (s, s, s)


def flowers(c, w, d, n, seed, hang=0.0):
    """小さな球をたくさん（葉 1 メッシュ + 花 3 色）"""
    rnd = random.Random(seed)
    groups = {"leaf": [], "#e7a1a3": [], "#d65f6c": [], "#f3dcd0": []}
    for _ in range(n):
        u, v = rnd.random(), rnd.random()
        drop = hang * max(0, v - 0.75) * 4 * rnd.random()
        y = rnd.random() * 0.18 - drop
        x, z = (u - 0.5) * w, (v - 0.5) * d + drop * 0.2
        groups["leaf"].append(((x, y, z), 0.05 * (0.7 + rnd.random() * 0.6)))
        groups[rnd.choice(["#e7a1a3", "#d65f6c", "#f3dcd0"])].append(((x + (rnd.random() - 0.5) * 0.08, y + 0.07, z + (rnd.random() - 0.5) * 0.08), 0.032))
    for key, items in groups.items():
        bm = bmesh.new()
        for (x, y, z), rr in items:
            m_ = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rr)
            bmesh.ops.translate(bm, verts=m_["verts"], vec=T(c[0] + x, c[1] + y, c[2] + z))
        me = bpy.data.meshes.new(f"fl_{key}")
        bm.to_mesh(me)
        bm.free()
        o = bpy.data.objects.new(f"fl_{key}", me)
        col.objects.link(o)
        o.data.materials.append(mat("leaf", "#5d7a3c", 0.8) if key == "leaf" else mat("bloom" + key, key, 0.7))
        for poly in me.polygons:
            poly.use_smooth = True


def text(s, c, size, m, rot_x=90):
    cu = bpy.data.curves.new("t", "FONT")
    cu.body = s
    cu.font = bpy.data.fonts.load(FONT)
    cu.size = size
    cu.align_x = "CENTER"
    cu.align_y = "CENTER"
    cu.extrude = 0.01
    o = bpy.data.objects.new("text", cu)
    col.objects.link(o)
    o.location = T(*c)
    o.rotation_euler = (math.radians(rot_x), 0, 0)
    o.data.materials.append(m)


# ── 素材 ─────────────────
plaster = pbr("plaster", "clay_plaster", "#e8c49c", scale=0.6, bump=0.25)
plaster2 = pbr("plaster2", "clay_plaster", "#d9b48c", scale=0.6, bump=0.25)
asphalt = pbr("asphalt", "asphalt_02", "#9a9a9a", scale=0.25, use_diffuse=True, bump=0.6)
brick = pbr("brick", "brick_pavement_02", "#e0d4c4", scale=0.8, use_diffuse=True, bump=0.8)
trim = mat("trim", "#5a3a28", 0.6)
cream = mat("cream", "#fbf7ef", 0.5)
orange = mat("orange", "#d9652b", 0.85)
white_cloth = mat("cloth", "#f6efe2", 0.9)
black_metal = mat("bmetal", "#1e1a18", 0.4, 0.6)
glass = mat("glass", "#ffffff", 0.02, trans=1.0)
yellow = mat("yline", "#f2c94c", 0.6)

# ── 道と歩道 ─────────────────
box((0, -0.05, 4.5), (40, 0.1, 7), asphalt, bevel=0, name="road")
for z in (4.4, 4.62):
    box((0, 0.003, z), (40, 0.006, 0.1), yellow, bevel=0)
box((0, 0.075, -1), (40, 0.15, 4), brick, bevel=0.01, name="sidewalk")
box((0, 0.08, 1.02), (40, 0.16, 0.12), mat("curb", "#e9e5dd", 0.8), bevel=0.02)
box((0, -0.02, -8), (40, 0.1, 10), mat("lot", "#8e7a63", 1), bevel=0)

# ── コンビニ（three.js 版の Store を (0, 0.15, -3) に置いたのと同じ） ─────────────────
O = (0, 0.15, -3)


def S(x, y, z):
    return (O[0] + x, O[1] + y, O[2] + z)


box(S(0, 0.01, -0.2), (8, 0.02, 4.6), mat("floor", "#d8d2c6", 0.4), bevel=0)
box(S(0, 1.7, -2.5), (8, 3.4, 0.2), plaster)
for x in (-4, 4):
    box(S(x, 3.3, -0.2), (0.3, 6.6, 4.8), plaster2, bevel=0.04)
# 店内の棚と商品
cols = ["#e94f37", "#f6c63b", "#3f88c5", "#44bba4", "#f49d37", "#ffffff", "#d7263d", "#8ac926"]
for sh in range(3):
    for r in range(4):
        box(S(0, 0.45 + r * 0.42, -1.6 + sh * 1.1), (6.8, 0.03, 0.4), mat("shelf", "#e6e2da", 0.4), bevel=0.005)
        for i in range(18):
            h = 0.12 + ((i * 7 + r * 3) % 5) * 0.03
            box(S(-3.2 + i * 0.36, 0.5 + r * 0.42 + h / 2, -1.6 + sh * 1.1), (0.26, h, 0.18), mat("item" + str((i * 5 + r * 3 + sh) % 8), cols[(i * 5 + r * 3 + sh) % 8], 0.45), bevel=0.01)
for x in (-2, 0, 2):
    box(S(x, 3.0, -0.6), (1.4, 0.04, 0.12), mat("tube", "#ffffff", emit="#fff6e6", emit_s=8), bevel=0)
box(S(0, 3.25, -0.2), (8, 0.1, 4.6), mat("ceil", "#f4f1ea", 0.6), bevel=0)
# ガラスとサッシ
box(S(0, 1.55, 2.15), (7.7, 2.9, 0.02), glass, bevel=0)
for x in (-2.6, 0, 2.6):
    box(S(x, 1.55, 2.17), (0.08, 3.0, 0.08), mat("sash", "#3b3230", 0.4, 0.6), bevel=0.01)
# 看板帯 + ひさし（しま）
box(S(0, 3.35, 2.2), (8.1, 0.6, 0.25), cream)
for i in range(16):
    box(S(-3.75 + i * 0.5, 2.85, 2.6), (0.5, 0.04, 1.1), orange if i % 2 == 0 else white_cloth, bevel=0.01, rot=(math.radians(31), 0, 0))
# 2 階
box(S(0, 5.0, -0.3), (8.2, 2.8, 4.6), plaster, bevel=0.04)
box(S(0, 6.45, -0.3), (8.5, 0.15, 4.9), trim, bevel=0.03)
for x in (-2.4, 2.4):
    box(S(x, 5.0, 1.95), (1.8, 1.4, 0.1), trim, bevel=0.02)
    box(S(x, 5.0, 2.0), (1.6, 1.2, 0.02), mat("win", "#e9c08e", 0.15, emit="#ffb766", emit_s=1.5), bevel=0)
    box(S(x, 5.0, 2.02), (0.05, 1.2, 0.02), trim, bevel=0)
    box(S(x, 4.2, 2.05), (1.9, 0.18, 0.3), trim, bevel=0.02)
    flowers(S(x, 4.32, 2.08), 1.8, 0.26, 700, 7 if x > 0 else 11, 0.4)
# バルコニー
box(S(0, 3.62, 2.4), (8.2, 0.38, 1.0), trim, bevel=0.03)
text("コンビニ", S(0, 3.62, 2.92), 0.3, mat("signtxt", "#fbf7ef", 0.5, emit="#ffffff", emit_s=0.6))
flowers(S(0, 3.9, 2.75), 8.0, 0.45, 2600, 3, 0.12)
box(S(0, 4.35, 2.88), (8.2, 0.04, 0.04), black_metal, bevel=0)
for i in range(41):
    box(S(-4.05 + i * 0.2025, 4.1, 2.88), (0.018, 0.5, 0.018), black_metal, bevel=0)
for i, x in enumerate((-3.2, -1.6, 1.2, 2.9)):
    model("potted_plant_02" if i % 2 else "planter_box_01", S(x, 3.81, 2.6), i * 0.7, 1.0 if i % 2 else 1.2)
model("potted_plant_01", S(0, 3.81, 2.5), 0, 1.1)
# 店内の光
bpy.ops.object.light_add(type="AREA", location=T(*S(0, 3.0, 0)))
L = bpy.context.object
L.data.energy = 260
L.data.size = 6
L.data.color = (1, 0.93, 0.82)
L.rotation_euler = (0, 0, 0)

# ── となりの建物 ─────────────────
for x, h, tint in ((-9.2, 5.5, "#e3c3ae"), (9.2, 7.5, "#cfae8c")):
    box((x, 0.15 + h / 2, -3.2), (10, h, 5), pbr("nb" + str(x), "clay_plaster", tint, 0.6, bump=0.25), bevel=0.04)
    for r in range(int(h // 2)):
        for c in (-3, 0, 3):
            box((x + c, 0.15 + 1.4 + r * 2, -0.68), (1.3, 1.1, 0.06), trim, bevel=0.01)
            lit = (r + c) % 3 == 0
            box((x + c, 0.15 + 1.4 + r * 2, -0.64), (1.15, 0.95, 0.02), mat("nbw" + str(lit), "#e8c79a" if lit else "#5b6670", 0.1, 0.3, emit="#c98a4a" if lit else None, emit_s=1.2 if lit else 0), bevel=0)

# ── 歩道の小物 ─────────────────
for p, r in (((3.2, 0.15, 0.3), 0.4), ((-3.0, 0.15, 0.4), -0.3)):
    model("outdoor_table_chair_set_01", p, r)
    cyl((p[0], p[1] + 1.15, p[2]), 0.025, 2.3, mat("pole", "#d8d2c8", 0.4, 0.4))
    cyl((p[0], p[1] + 2.25, p[2]), 0.9, 0.35, mat("parasol", "#c9a283", 0.95), verts=12, r2=0.02)
model("street_lamp_01", (5.2, 0.15, 0.7), -1.57)
model("fire_hydrant", (-4.6, 0.15, 0.6))
model("metal_trash_can", (4.3, 0.15, -0.6))
model("trashbag", (4.9, 0.15, -0.9), 0.6)
model("trashbag", (4.6, 0.15, -1.6), 2.1, 0.9)
model("plastic_crate_01", (-4.2, 0.15, -1.6), 0.2)
model("plastic_crate_01", (-4.2, 0.41, -1.6), -0.1)
model("wooden_crate_01", (-3.4, 0.15, -1.9), 0.1)
model("painted_wooden_bench", (-6.4, 0.15, -0.4), 0.3)
model("potted_plant_01", (-4.6, 0.15, -0.8))
flowers((-6.0, 0.25, 0.7), 3, 0.5, 1400, 21)
flowers((6.6, 0.25, 0.7), 2.6, 0.5, 1200, 23)

# ── 探偵のフィギュア ─────────────────
D = (1.4, 0.15, 0.6)
k = 0.75
skin = mat("skin", "#ffe1c6", 0.5)
coat = mat("coat", "#c9a063", 0.7)
hat = mat("hat", "#6b4a33", 0.6)
for x in (-0.09, 0.09):
    cyl((D[0] + x * k, D[1] + 0.12 * k, D[2]), 0.06 * k, 0.24 * k, mat("shoe", "#4b3a2e", 0.5))
cyl((D[0], D[1] + 0.52 * k, D[2]), 0.3 * k, 0.6 * k, coat, r2=0.17 * k)
sphere((D[0], D[1] + 1.07 * k, D[2]), 0.34 * k, skin)
for x in (-0.12, 0.12):
    sphere((D[0] + x * k, D[1] + 1.09 * k, D[2] + 0.31 * k), 0.05 * k, mat("eye", "#2a211c", 0.15))
for x in (-0.2, 0.2):
    sphere((D[0] + x * k, D[1] + 0.98 * k, D[2] + 0.27 * k), 0.055 * k, mat("cheek", "#ffb3a7", 0.6))
cyl((D[0], D[1] + 1.32 * k, D[2]), 0.46 * k, 0.04 * k, hat)
cyl((D[0], D[1] + 1.46 * k, D[2]), 0.28 * k, 0.26 * k, hat, r2=0.24 * k)
cyl((D[0], D[1] + 1.36 * k, D[2]), 0.285 * k, 0.06 * k, mat("band", "#c9463d", 0.6))

# ── ミニカー ─────────────────
def car(p, color, rot):
    paint = mat("paint" + color, color, 0.25, coat=1.0)
    b1 = box((p[0], 0.48, p[2]), (3.8, 0.55, 1.7), paint, bevel=0.2)
    b2 = box((p[0] - 0.2, 0.88, p[2]), (2.0, 0.5, 1.45), paint, bevel=0.18)
    box((p[0] - 0.2, 0.9, p[2]), (1.85, 0.38, 1.48), mat("cglass", "#1b2026", 0.08, 0.5), bevel=0.14)
    for dx in (-1.2, 1.25):
        for dz in (-0.85, 0.85):
            o = cyl((p[0] + dx, 0.32, p[2] + dz), 0.32, 0.24, mat("tire", "#1a1a1a", 0.8))
            o.rotation_euler = (math.radians(90), 0, 0)
    for dz in (-0.55, 0.55):
        sphere((p[0] + 1.9 * rot, 0.5, p[2] + dz), 0.1, mat("head", "#ffffff", emit="#fff3c4", emit_s=8))


car((-6, 0, 3.0), "#bfe3ef", 1)
car((7, 0, 6.0), "#f2e1c2", -1)

# ── 光・カメラ ─────────────────
world = bpy.data.worlds.new("w")
scene.world = world
world.use_nodes = True
env = world.node_tree.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(str(PH / "hdri" / "brown_photostudio_02.hdr"))
bg = world.node_tree.nodes["Background"]
bg.inputs["Strength"].default_value = 0.55
world.node_tree.links.new(env.outputs["Color"], bg.inputs["Color"])

bpy.ops.object.light_add(type="SUN", location=(0, 0, 10))
sun = bpy.context.object
sun.data.energy = 2.6
sun.data.angle = math.radians(6)
sun.data.color = (1, 0.92, 0.82)
sun.rotation_euler = (math.radians(50), math.radians(-25), math.radians(-35))

cam_pos = T(4.5, 9.5, 17)
target = T(0.3, 2.2, -0.8)
bpy.ops.object.camera_add(location=cam_pos)
cam = bpy.context.object
cam.rotation_euler = (target - cam_pos).to_track_quat("-Z", "Y").to_euler()
cam.data.lens_unit = "FOV"
cam.data.angle = math.radians(27 * 16 / 9)
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (T(0.6, 1.6, 0.4) - cam_pos).length
cam.data.dof.aperture_fstop = 0.045  # ミニチュアに見える浅い被写界深度
scene.camera = cam

# ── レンダー設定 ─────────────────
scene.render.engine = "CYCLES"
scene.cycles.samples = args.samples
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = args.res
scene.render.film_transparent = False
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = args.out
if args.gpu:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for t in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
        try:
            prefs.compute_device_type = t
            prefs.get_devices()
            if any(d.type == t for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == t
                scene.cycles.device = "GPU"
                print("GPU:", t)
                break
        except TypeError:
            pass
bpy.ops.render.render(write_still=True)
print("saved", args.out)
