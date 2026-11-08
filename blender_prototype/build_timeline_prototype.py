import bpy
import bmesh
import math
import random
import os
from mathutils import Vector, Matrix, Euler

# ==============================================================================
# PROTOTIPO VISUAL 3D EN BLENDER (V5 DEFINITIVO) — EL RESCATE: LÍNEA DEL TIEMPO
# ==============================================================================
# Perfeccionamiento final:
# 1. Carro Azul Semi-Oscuro (#14355B / #173B63) con paneles de carrocería 100%
#    lisos y limpios (capó, puertas y techo sin cuadrícula) y BORDES GLASS
#    perimetrales continuos ("Glass Edges") integrados en la propia malla
#    subdividida mediante bandas de borde extruidas suavemente (beltline, arco
#    de techo/ventana, splitter inferior y rines de cristal).
# 2. Los 5 hitos (1981, 1992, 2005, 2016 y HOY • FUTURO) separados limpiamente
#    en perspectiva sin solaparse entre sí.
# ==============================================================================

random.seed(2026)

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "exports"))
os.makedirs(OUT_DIR, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ------------------------------------------------------------------------------
# 1. MOTOR DE RENDER CYCLES + GESTIÓN DE COLOR
# ------------------------------------------------------------------------------
scene.render.engine = 'CYCLES'
scene.cycles.samples = 44
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.transmission_bounces = 6
scene.cycles.glossy_bounces = 4
scene.cycles.diffuse_bounces = 2
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX' if 'AgX' in bpy.types.ColorManagedViewSettings.bl_rna.properties['view_transform'].enum_items.keys() else 'Filmic'
if 'AgX - Medium High Contrast' in [i.name for i in bpy.types.ColorManagedViewSettings.bl_rna.properties['look'].enum_items]:
    scene.view_settings.look = 'AgX - Medium High Contrast'

world = bpy.data.worlds.new("World_CurvedEarth_V5")
scene.world = world
world.use_nodes = True
wnodes = world.node_tree.nodes
wlinks = world.node_tree.links
wnodes.clear()

node_bg = wnodes.new(type='ShaderNodeBackground')
node_out = wnodes.new(type='ShaderNodeOutputWorld')
node_tex_coord = wnodes.new(type='ShaderNodeTexCoord')
node_sep_xyz = wnodes.new(type='ShaderNodeSeparateXYZ')
node_ramp = wnodes.new(type='ShaderNodeValToRGB')

node_ramp.color_ramp.elements[0].position = 0.0
node_ramp.color_ramp.elements[0].color = (0.012, 0.038, 0.082, 1.0)
e_h = node_ramp.color_ramp.elements.new(0.45)
e_h.color = (0.055, 0.165, 0.31, 1.0)
e_top = node_ramp.color_ramp.elements[1]
e_top.position = 0.78
e_top.color = (0.008, 0.022, 0.052, 1.0)

node_bg.inputs['Strength'].default_value = 1.15
wlinks.new(node_tex_coord.outputs['Generated'], node_sep_xyz.inputs['Vector'])
wlinks.new(node_sep_xyz.outputs['Z'], node_ramp.inputs['Fac'])
wlinks.new(node_ramp.outputs['Color'], node_bg.inputs['Color'])
wlinks.new(node_bg.outputs['Background'], node_out.inputs['Surface'])

# ------------------------------------------------------------------------------
# 2. MATERIALES PBR + SHADERS GLASSMORPHIC
# ------------------------------------------------------------------------------
def set_input(bsdf, names, val):
    for n in names:
        if n in bsdf.inputs:
            bsdf.inputs[n].default_value = val
            return

def make_curved_grass_material():
    mat = bpy.data.materials.new("Mat_Lush_Curved_Grass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    tex_coord = nodes.new('ShaderNodeTexCoord')
    noise_macro = nodes.new('ShaderNodeTexNoise')
    noise_micro = nodes.new('ShaderNodeTexNoise')
    mix_noise = nodes.new('ShaderNodeMix')
    mix_noise.data_type = 'FLOAT'
    ramp = nodes.new('ShaderNodeValToRGB')
    bump = nodes.new('ShaderNodeBump')

    noise_macro.inputs['Scale'].default_value = 6.0
    noise_macro.inputs['Detail'].default_value = 8.0
    noise_macro.inputs['Roughness'].default_value = 0.65

    noise_micro.inputs['Scale'].default_value = 160.0
    noise_micro.inputs['Detail'].default_value = 12.0

    mix_noise.inputs['Factor'].default_value = 0.42

    ramp.color_ramp.elements[0].position = 0.20
    ramp.color_ramp.elements[0].color = (0.018, 0.115, 0.032, 1.0)
    el_mid = ramp.color_ramp.elements.new(0.55)
    el_mid.color = (0.042, 0.22, 0.058, 1.0)
    ramp.color_ramp.elements[1].position = 0.88
    ramp.color_ramp.elements[1].color = (0.095, 0.34, 0.085, 1.0)

    bump.inputs['Strength'].default_value = 0.55
    bump.inputs['Distance'].default_value = 0.05

    set_input(bsdf, ['Roughness'], 0.78)
    set_input(bsdf, ['Subsurface Weight', 'Subsurface'], 0.15)
    set_input(bsdf, ['Specular IOR Level', 'Specular'], 0.20)

    links.new(tex_coord.outputs['Object'], noise_macro.inputs['Vector'])
    links.new(tex_coord.outputs['Object'], noise_micro.inputs['Vector'])
    links.new(noise_macro.outputs['Fac'], mix_noise.inputs['A'])
    links.new(noise_micro.outputs['Fac'], mix_noise.inputs['B'])
    links.new(mix_noise.outputs['Result'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(noise_micro.outputs['Fac'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_blade_grass_material():
    mat = bpy.data.materials.new("Mat_Grass_Blades")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    obj_info = nodes.new('ShaderNodeObjectInfo')
    ramp = nodes.new('ShaderNodeValToRGB')

    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.025, 0.16, 0.042, 1.0)
    el = ramp.color_ramp.elements.new(0.5)
    el.color = (0.065, 0.31, 0.082, 1.0)
    ramp.color_ramp.elements[1].position = 1.0
    ramp.color_ramp.elements[1].color = (0.15, 0.46, 0.115, 1.0)

    set_input(bsdf, ['Roughness'], 0.40)
    set_input(bsdf, ['Subsurface Weight', 'Subsurface'], 0.30)

    links.new(obj_info.outputs['Random'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_car_semi_dark_blue_material():
    """Azul semi-oscuro (#14355B / #173B63) con acabado metálico automotriz."""
    mat = bpy.data.materials.new("Mat_Car_SemiDarkBlue")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    layer_w = nodes.new('ShaderNodeLayerWeight')
    ramp = nodes.new('ShaderNodeValToRGB')

    layer_w.inputs['Blend'].default_value = 0.30
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.018, 0.075, 0.185, 1.0)
    el_m = ramp.color_ramp.elements.new(0.55)
    el_m.color = (0.038, 0.145, 0.315, 1.0)
    ramp.color_ramp.elements[1].position = 0.90
    ramp.color_ramp.elements[1].color = (0.11, 0.35, 0.64, 1.0)

    set_input(bsdf, ['Metallic'], 0.84)
    set_input(bsdf, ['Roughness'], 0.15)
    set_input(bsdf, ['Coat Weight', 'Clearcoat'], 1.0)
    set_input(bsdf, ['Coat Roughness', 'Clearcoat Roughness'], 0.03)

    links.new(layer_w.outputs['Facing'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_glass_edge_material(name="Mat_Glass_Edge", base_col=(0.68, 0.92, 1.0, 1.0), edge_emit=(0.45, 0.86, 1.0, 1.0), emit_strength=1.9, roughness=0.05):
    """Cristal translúcido esmerilado con luminiscencia Fresnel en las aristas (Bordes Glass)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    layer_w = nodes.new('ShaderNodeLayerWeight')
    ramp = nodes.new('ShaderNodeValToRGB')

    layer_w.inputs['Blend'].default_value = 0.32
    ramp.color_ramp.elements[0].position = 0.08
    ramp.color_ramp.elements[0].color = (0.08, 0.25, 0.48, 1.0)
    ramp.color_ramp.elements[1].position = 0.70
    ramp.color_ramp.elements[1].color = edge_emit

    set_input(bsdf, ['Base Color'], base_col)
    set_input(bsdf, ['Metallic'], 0.02)
    set_input(bsdf, ['Roughness'], roughness)
    set_input(bsdf, ['IOR'], 1.50)
    set_input(bsdf, ['Transmission Weight', 'Transmission'], 0.94)
    set_input(bsdf, ['Coat Weight', 'Clearcoat'], 1.0)
    set_input(bsdf, ['Emission Strength'], emit_strength)

    links.new(layer_w.outputs['Facing'], ramp.inputs['Fac'])
    if 'Emission Color' in bsdf.inputs:
        links.new(ramp.outputs['Color'], bsdf.inputs['Emission Color'])
    elif 'Emission' in bsdf.inputs:
        links.new(ramp.outputs['Color'], bsdf.inputs['Emission'])

    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_canopy_dark_glass():
    mat = bpy.data.materials.new("Mat_Car_Canopy_DarkGlass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    set_input(bsdf, ['Base Color'], (0.03, 0.10, 0.22, 1.0))
    set_input(bsdf, ['Metallic'], 0.35)
    set_input(bsdf, ['Roughness'], 0.02)
    set_input(bsdf, ['IOR'], 1.52)
    set_input(bsdf, ['Transmission Weight', 'Transmission'], 0.70)
    set_input(bsdf, ['Coat Weight', 'Clearcoat'], 1.0)
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_road_material():
    mat = bpy.data.materials.new("Mat_Timeline_Road")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    set_input(bsdf, ['Base Color'], (0.025, 0.065, 0.125, 1.0))
    set_input(bsdf, ['Metallic'], 0.28)
    set_input(bsdf, ['Roughness'], 0.26)
    set_input(bsdf, ['Coat Weight', 'Clearcoat'], 0.5)
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

def make_emissive_material(name, color, strength=3.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    set_input(bsdf, ['Base Color'], color)
    set_input(bsdf, ['Roughness'], 0.15)
    set_input(bsdf, ['Emission Color', 'Emission'], color)
    set_input(bsdf, ['Emission Strength'], strength)
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

mat_grass = make_curved_grass_material()
mat_blades = make_blade_grass_material()
mat_car_blue = make_car_semi_dark_blue_material()
mat_car_glass_edge = make_glass_edge_material(
    "Mat_Car_Glass_Edge",
    base_col=(0.74, 0.94, 1.0, 1.0),
    edge_emit=(0.58, 0.90, 1.0, 1.0),
    emit_strength=2.2,
    roughness=0.04,
)
mat_road_glass_edge = make_glass_edge_material(
    "Mat_Road_Glass_Edge",
    base_col=(0.55, 0.85, 1.0, 1.0),
    edge_emit=(0.38, 0.78, 0.98, 1.0),
    emit_strength=1.15,
    roughness=0.08,
)
mat_card_glass = make_glass_edge_material(
    "Mat_Milestone_Card_Glass",
    base_col=(0.14, 0.36, 0.58, 1.0),
    edge_emit=(0.52, 0.86, 1.0, 1.0),
    emit_strength=1.05,
    roughness=0.09,
)
mat_canopy = make_canopy_dark_glass()
mat_road = make_road_material()
mat_amber = make_emissive_material("Mat_Timeline_Amber", (0.95, 0.58, 0.15, 1.0), strength=2.8)
mat_headlight = make_emissive_material("Mat_Headlight_Ice", (0.82, 0.96, 1.0, 1.0), strength=5.0)
mat_white_text = make_emissive_material("Mat_Timeline_Text_White", (0.98, 0.98, 0.96, 1.0), strength=1.8)
mat_tire = make_road_material()

# ------------------------------------------------------------------------------
# 3. SUPERFICIE DE LA TIERRA CURVEADA
# ------------------------------------------------------------------------------
EARTH_RADIUS = 23.5
EARTH_CENTER = Vector((0.0, 0.0, -EARTH_RADIUS))

def road_center_x(y):
    return 3.4 * math.sin(y * 0.16 - 0.20) + 0.85 * math.cos(y * 0.085)

def road_tangent_2d(y):
    dx_dy = 3.4 * 0.16 * math.cos(y * 0.16 - 0.20) - 0.85 * 0.085 * math.sin(y * 0.085)
    return Vector((dx_dy, 1.0, 0.0)).normalized()

def terrain_height_offset(x, y):
    cx = road_center_x(y)
    dist = abs(x - cx)
    road_mask = min(1.0, max(0.0, (dist - 1.45) / 2.3))
    road_mask = road_mask * road_mask * (3.0 - 2.0 * road_mask)

    undulation = (
        0.34 * (0.5 + 0.5 * math.sin(x * 0.30 + 0.3) * math.cos(y * 0.25))
        + 0.20 * (0.5 + 0.5 * math.cos(x * 0.52 - y * 0.36))
    )
    return undulation * road_mask

def surface_point_and_normal(x, y, extra_offset=0.0):
    r_sq = EARTH_RADIUS * EARTH_RADIUS - x * x - y * y
    if r_sq < 0.5:
        r_sq = 0.5
    z_sphere = math.sqrt(r_sq) - EARTH_RADIUS
    p_sphere = Vector((x, y, z_sphere))
    normal = (p_sphere - EARTH_CENTER).normalized()
    h = terrain_height_offset(x, y) + extra_offset
    return p_sphere + normal * h, normal

bm_earth = bmesh.new()
GRID_NX = 160
GRID_NY = 160
SPAN_X = 21.0
SPAN_Y_MIN = -13.0
SPAN_Y_MAX = 20.0

verts_grid = []
for iy in range(GRID_NY + 1):
    ty = iy / GRID_NY
    y = SPAN_Y_MIN + ty * (SPAN_Y_MAX - SPAN_Y_MIN)
    row = []
    for ix in range(GRID_NX + 1):
        tx = ix / GRID_NX
        x = -SPAN_X + tx * (2.0 * SPAN_X)
        r2 = x * x + y * y
        max_r = EARTH_RADIUS * 0.94
        if r2 > max_r * max_r:
            scale_f = max_r / math.sqrt(r2)
            x_eff, y_eff = x * scale_f, y * scale_f
        else:
            x_eff, y_eff = x, y
        pt, _ = surface_point_and_normal(x_eff, y_eff)
        row.append(bm_earth.verts.new(pt))
    verts_grid.append(row)

for iy in range(GRID_NY):
    for ix in range(GRID_NX):
        v1 = verts_grid[iy][ix]
        v2 = verts_grid[iy][ix + 1]
        v3 = verts_grid[iy + 1][ix + 1]
        v4 = verts_grid[iy + 1][ix]
        bm_earth.faces.new((v1, v2, v3, v4))

bmesh.ops.recalc_face_normals(bm_earth, faces=bm_earth.faces)
mesh_earth = bpy.data.meshes.new("Mesh_Curved_Earth_Meadow")
bm_earth.to_mesh(mesh_earth)
bm_earth.free()
for poly in mesh_earth.polygons:
    poly.use_smooth = True

obj_earth = bpy.data.objects.new("Curved_Earth_Meadow", mesh_earth)
scene.collection.objects.link(obj_earth)
obj_earth.data.materials.append(mat_grass)

# ------------------------------------------------------------------------------
# 4. EL CAMINO DE LA LÍNEA DEL TIEMPO
# ------------------------------------------------------------------------------
def build_ribbon_mesh(name, y_start, y_end, steps, half_width_left, half_width_right, z_lift, thickness=0.05):
    bm = bmesh.new()
    top_left, top_right, bot_left, bot_right = [], [], [], []

    for i in range(steps + 1):
        t = i / steps
        y = y_start + t * (y_end - y_start)
        cx = road_center_x(y)
        tang = road_tangent_2d(y)
        perp = Vector((-tang.y, tang.x, 0.0)).normalized()

        pL, _ = surface_point_and_normal(cx + perp.x * half_width_left, y + perp.y * half_width_left, z_lift + thickness)
        pR, _ = surface_point_and_normal(cx + perp.x * half_width_right, y + perp.y * half_width_right, z_lift + thickness)
        pLb, _ = surface_point_and_normal(cx + perp.x * half_width_left, y + perp.y * half_width_left, z_lift - 0.02)
        pRb, _ = surface_point_and_normal(cx + perp.x * half_width_right, y + perp.y * half_width_right, z_lift - 0.02)

        top_left.append(bm.verts.new(pL))
        top_right.append(bm.verts.new(pR))
        bot_left.append(bm.verts.new(pLb))
        bot_right.append(bm.verts.new(pRb))

    for i in range(steps):
        bm.faces.new((top_left[i], top_right[i], top_right[i + 1], top_left[i + 1]))
        bm.faces.new((bot_left[i], top_left[i], top_left[i + 1], bot_left[i + 1]))
        bm.faces.new((top_right[i], bot_right[i], bot_right[i + 1], top_right[i + 1]))

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    for p in mesh.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    return obj

ROAD_Y_MIN = -11.5
ROAD_Y_MAX = 18.2
ROAD_STEPS = 220

obj_road = build_ribbon_mesh("Timeline_Path_Surface", ROAD_Y_MIN, ROAD_Y_MAX, ROAD_STEPS, -1.12, 1.12, 0.02, thickness=0.045)
obj_road.data.materials.append(mat_road)

obj_curb_left = build_ribbon_mesh("Timeline_Glass_Curb_L", ROAD_Y_MIN, ROAD_Y_MAX, ROAD_STEPS, -1.28, -1.10, 0.035, thickness=0.08)
obj_curb_left.data.materials.append(mat_road_glass_edge)

obj_curb_right = build_ribbon_mesh("Timeline_Glass_Curb_R", ROAD_Y_MIN, ROAD_Y_MAX, ROAD_STEPS, 1.10, 1.28, 0.035, thickness=0.08)
obj_curb_right.data.materials.append(mat_road_glass_edge)

DASH_COUNT = 44
for d in range(DASH_COUNT):
    y0 = ROAD_Y_MIN + 0.4 + d * ((ROAD_Y_MAX - ROAD_Y_MIN - 0.8) / DASH_COUNT)
    y1 = y0 + 0.36
    dash = build_ribbon_mesh(f"Timeline_Center_Dash_{d:02d}", y0, y1, 3, -0.045, 0.045, 0.068, thickness=0.016)
    dash.data.materials.append(mat_amber)

# ------------------------------------------------------------------------------
# 5. MUCHO CÉSPED DENSO DE PRINCIPIO A FIN (11,500 MANOJOS)
# ------------------------------------------------------------------------------
bm_tuft = bmesh.new()
for idx in range(12):
    ang = idx * (math.tau / 12.0) + random.uniform(-0.22, 0.22)
    dist_r = 0.02 + (idx % 4) * 0.055
    w = 0.026
    h = 0.16 + (idx % 4) * 0.055
    bend = 0.055 + (idx % 3) * 0.035
    ca, sa = math.cos(ang), math.sin(ang)
    rx, ry = dist_r * ca, dist_r * sa

    v0 = bm_tuft.verts.new((rx - w * sa, ry + w * ca, 0.0))
    v1 = bm_tuft.verts.new((rx + w * sa, ry - w * ca, 0.0))
    v2 = bm_tuft.verts.new((rx - w * 0.52 * sa + bend * 0.45 * ca, ry + w * 0.52 * ca + bend * 0.45 * sa, h * 0.55))
    v3 = bm_tuft.verts.new((rx + w * 0.52 * sa + bend * 0.45 * ca, ry - w * 0.52 * ca + bend * 0.45 * sa, h * 0.55))
    v_tip = bm_tuft.verts.new((rx + bend * ca, ry + bend * sa, h))

    bm_tuft.faces.new((v0, v1, v3, v2))
    bm_tuft.faces.new((v2, v3, v_tip))

mesh_tuft = bpy.data.meshes.new("Mesh_Grass_Tuft_Lush")
bm_tuft.to_mesh(mesh_tuft)
bm_tuft.free()
for p in mesh_tuft.polygons:
    p.use_smooth = True
mesh_tuft.materials.append(mat_blades)

grass_col = bpy.data.collections.new("Collection_Lush_Grass")
scene.collection.children.link(grass_col)

NUM_TUFTS = 11500
for i in range(NUM_TUFTS):
    if i < 4500:
        gy = random.uniform(-9.5, 6.5)
        cx = road_center_x(gy)
        side = -1.0 if (i % 2 == 0) else 1.0
        dist = 1.32 + (random.random() ** 1.15) * 9.5
        gx = cx + side * dist
    elif i < 8500:
        gy = random.uniform(-6.0, 16.5)
        cx = road_center_x(gy)
        side = -1.0 if (i % 2 == 0) else 1.0
        dist = 1.34 + (random.random() ** 1.2) * 15.0
        gx = cx + side * dist
    else:
        gy = random.uniform(-11.5, 17.5)
        gx = random.uniform(-18.5, 18.5)
        if abs(gx - road_center_x(gy)) < 1.34:
            continue

    if gx * gx + gy * gy > (EARTH_RADIUS * 0.90) ** 2:
        continue

    pt, norm = surface_point_and_normal(gx, gy, -0.015)
    tuft_obj = bpy.data.objects.new(f"GrassTuft_{i:05d}", mesh_tuft)
    tuft_obj.location = pt

    rot_quat = norm.to_track_quat('Z', 'Y')
    eul = rot_quat.to_euler()
    eul.rotate_axis('Z', random.uniform(0, math.tau))
    tuft_obj.rotation_euler = eul

    sc = random.uniform(0.90, 1.55)
    tuft_obj.scale = (sc, sc, sc * random.uniform(0.90, 1.35))
    grass_col.objects.link(tuft_obj)

# ------------------------------------------------------------------------------
# 6. CARRO AZUL SEMI-OSCURO CON BORDES GLASS INTEGRADOS EN LA MALLA (SIN CUADRÍCULA)
# ------------------------------------------------------------------------------
def get_road_frame(y_pos, z_offset=0.05):
    cx = road_center_x(y_pos)
    pt, up_vec = surface_point_and_normal(cx, y_pos, z_offset)

    dy = 0.25
    cx_next = road_center_x(y_pos + dy)
    pt_next, _ = surface_point_and_normal(cx_next, y_pos + dy, z_offset)

    forward = (pt_next - pt).normalized()
    right = forward.cross(up_vec).normalized()
    true_up = right.cross(forward).normalized()

    rot_mat = Matrix((right, forward, true_up)).transposed()
    return pt, rot_mat

car_col = bpy.data.collections.new("Collection_Hero_Blue_Glass_Car")
scene.collection.children.link(car_col)

CAR_Y = -2.8
car_pos, car_rot_mat = get_road_frame(CAR_Y, z_offset=0.045)

car_root = bpy.data.objects.new("Hero_Car_Blue_Glass", None)
car_root.location = car_pos
car_root.rotation_euler = car_rot_mat.to_euler()
car_col.objects.link(car_root)

def parent_to_car(obj):
    car_col.objects.link(obj)
    obj.parent = car_root

# Construimos el Coupé GT con bandas de borde dedicadas (narrow glass edge seams) en la propia malla:
# En cada estación transversal definimos 14 puntos para que existan 3 bandas de Borde Glass continuas
# (1: Faldón Glass inferior, 2: Cintura/Hombro Glass lateral, 3: Arco de Techo/Capó Glass)
# integradas al 100% en la misma superficie subdividida del carro:
car_stations = [
    # y,     w_sill, z_sill, w_belt, z_belt, w_roof, z_roof, z_spine
    (-1.52,  0.54,   0.22,   0.60,   0.50,   0.40,   0.53,   0.54),  # 0: Cola / Difusor trasero
    (-1.18,  0.66,   0.18,   0.72,   0.56,   0.46,   0.60,   0.62),  # 1: Guardabarros trasero / Maletero
    (-0.72,  0.68,   0.16,   0.74,   0.58,   0.46,   0.83,   0.86),  # 2: Pilar C / Luneta trasera
    (-0.15,  0.68,   0.16,   0.74,   0.57,   0.46,   0.88,   0.91),  # 3: Techo central
    ( 0.38,  0.68,   0.16,   0.72,   0.55,   0.45,   0.81,   0.84),  # 4: Pilar A superior
    ( 0.76,  0.66,   0.16,   0.71,   0.51,   0.46,   0.53,   0.54),  # 5: Base del parabrisas
    ( 1.22,  0.62,   0.17,   0.66,   0.44,   0.40,   0.46,   0.47),  # 6: Capó delantero
    ( 1.56,  0.48,   0.20,   0.52,   0.34,   0.30,   0.36,   0.36),  # 7: Frontal / Calandra (+Y)
]

bm_car = bmesh.new()
rings = []
for st in car_stations:
    (y_s, ws, zs, wb, zb, wr, zr, zsp) = st
    # Para cada lado creamos micro-bandas biseladas (ancho ~4.5cm) que serán los Bordes Glass al ras
    pts = [
        ( 0.0,       y_s, zs - 0.02),                     # 0: Centro piso
        ( ws - 0.03, y_s, zs),                            # 1: Interior faldón R
        ( ws + 0.02, y_s, zs + 0.035),                    # 2: Exterior faldón R  [Segmento 1->2 = GLASS SILL R]
        ( wb - 0.01, y_s, zb - 0.035),                    # 3: Bajo cintura R     [Segmento 2->3 = PUERTA AZUL R]
        ( wb + 0.02, y_s, zb + 0.020),                    # 4: Alto cintura R     [Segmento 3->4 = GLASS BELTLINE R]
        ( wr + 0.03, y_s, zr - 0.020),                    # 5: Bajo arco techo R  [Segmento 4->5 = VENTANA/HOMBRO R]
        ( wr - 0.02, y_s, zr + 0.015),                    # 6: Alto arco techo R  [Segmento 5->6 = GLASS ROOFLINE R]
        ( 0.0,       y_s, zsp),                           # 7: Centro techo/capó  [Segmento 6->7 = TECHO/CAPÓ R]
        (-wr + 0.02, y_s, zr + 0.015),                    # 8: Alto arco techo L  [Segmento 7->8 = TECHO/CAPÓ L]
        (-wr - 0.03, y_s, zr - 0.020),                    # 9: Bajo arco techo L  [Segmento 8->9 = GLASS ROOFLINE L]
        (-wb - 0.02, y_s, zb + 0.020),                    # 10: Alto cintura L    [Segmento 9->10 = VENTANA/HOMBRO L]
        (-wb + 0.01, y_s, zb - 0.035),                    # 11: Bajo cintura L    [Segmento 10->11 = GLASS BELTLINE L]
        (-ws - 0.02, y_s, zs + 0.035),                    # 12: Exterior faldón L [Segmento 11->12 = PUERTA AZUL L]
        (-ws + 0.03, y_s, zs),                            # 13: Interior faldón L [Segmento 12->13 = GLASS SILL L]
    ]
    rings.append([bm_car.verts.new(p) for p in pts])

# Materiales de Car_Body_SemiDarkBlue:
# 0 = Mat_Car_SemiDarkBlue (carrocería azul semi-oscura lisa)
# 1 = Mat_Car_Canopy_DarkGlass (parabrisas y cúpula oscura)
# 2 = Mat_Car_Glass_Edge (bordes glass continuos integrados)
glass_faces = []
for r_idx in range(len(rings) - 1):
    rA, rB = rings[r_idx], rings[r_idx + 1]
    n = len(rA)
    for k in range(n):
        kn = (k + 1) % n
        f = bm_car.faces.new((rA[k], rA[kn], rB[kn], rB[k]))
        # Bandas longitudinales de Borde Glass (Faldón, Cintura y Arco de Techo/Capó en ambos lados)
        if k in (1, 3, 5, 8, 10, 12):
            f.material_index = 2
            glass_faces.append(f)
        # Borde transversal delantero y trasero también en Glass en el anillo inicial y final
        elif r_idx in (0, len(rings) - 2) and k in (6, 7):
            f.material_index = 2
            glass_faces.append(f)
        # Ventanas laterales y parabrisas/techo acristalado en la cabina (estaciones 1..4)
        elif r_idx in (1, 2, 3, 4) and k in (4, 6, 7, 9):
            f.material_index = 1
        else:
            f.material_index = 0

f_back = bm_car.faces.new(rings[0][::-1])
f_back.material_index = 2
f_front = bm_car.faces.new(rings[-1])
f_front.material_index = 2
bmesh.ops.recalc_face_normals(bm_car, faces=bm_car.faces)

# Elevar suavemente (1.2 cm) los vértices de las bandas de Borde Glass manteniendo la topología 100% continua
glass_verts = set()
for f in glass_faces:
    for v in f.verts:
        glass_verts.add(v)
for v in glass_verts:
    v.co += v.normal * 0.012

bmesh.ops.recalc_face_normals(bm_car, faces=bm_car.faces)

mesh_car_body = bpy.data.meshes.new("Mesh_Car_GT_Body_With_Glass_Edges")
bm_car.to_mesh(mesh_car_body)
bm_car.free()
for p in mesh_car_body.polygons:
    p.use_smooth = True

obj_car_body = bpy.data.objects.new("Car_Body_SemiDarkBlue", mesh_car_body)
obj_car_body.data.materials.append(mat_car_blue)
obj_car_body.data.materials.append(mat_canopy)
obj_car_body.data.materials.append(mat_car_glass_edge)

sub_body = obj_car_body.modifiers.new("Subsurf", 'SUBSURF')
sub_body.levels = 2
sub_body.render_levels = 2
parent_to_car(obj_car_body)

# Faros delanteros LED hielo integrados en el frontal (+Y) y barra trasera ámbar (-Y)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 1.56, 0.28))
hl_bar = bpy.context.active_object
hl_bar.name = "Car_Front_LED_Blade"
hl_bar.scale = (0.76, 0.05, 0.032)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
hl_bar.data.materials.append(mat_headlight)
scene.collection.objects.unlink(hl_bar)
parent_to_car(hl_bar)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, -1.53, 0.44))
tl_bar = bpy.context.active_object
tl_bar.name = "Car_Rear_Amber_Blade"
tl_bar.scale = (0.84, 0.05, 0.030)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
tl_bar.data.materials.append(mat_amber)
scene.collection.objects.unlink(tl_bar)
parent_to_car(tl_bar)

# 6.3 Ruedas Deportivas con Rines y Bordes Glass
wheel_positions = [
    (-0.70, -0.94, 0.25),
    ( 0.70, -0.94, 0.25),
    (-0.68,  0.94, 0.25),
    ( 0.68,  0.94, 0.25),
]
for idx, (wx, wy, wz) in enumerate(wheel_positions):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.25, depth=0.20, location=(wx, wy, wz), rotation=(0, math.pi / 2, 0))
    w_tire = bpy.context.active_object
    w_tire.name = f"Car_Wheel_Tire_{idx}"
    for p in w_tire.data.polygons:
        p.use_smooth = True
    w_tire.data.materials.append(mat_tire)
    scene.collection.objects.unlink(w_tire)
    parent_to_car(w_tire)

    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.235,
        minor_radius=0.034,
        major_segments=48,
        minor_segments=16,
        location=(wx + (0.085 if wx > 0 else -0.085), wy, wz),
        rotation=(0, math.pi / 2, 0),
    )
    w_glass_rim = bpy.context.active_object
    w_glass_rim.name = f"Car_Wheel_Glass_Rim_{idx}"
    for p in w_glass_rim.data.polygons:
        p.use_smooth = True
    w_glass_rim.data.materials.append(mat_car_glass_edge)
    scene.collection.objects.unlink(w_glass_rim)
    parent_to_car(w_glass_rim)

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32,
        radius=0.14,
        depth=0.04,
        location=(wx + (0.08 if wx > 0 else -0.08), wy, wz),
        rotation=(0, math.pi / 2, 0),
    )
    w_hub = bpy.context.active_object
    w_hub.name = f"Car_Wheel_Glass_Hub_{idx}"
    w_hub.data.materials.append(mat_car_glass_edge)
    scene.collection.objects.unlink(w_hub)
    parent_to_car(w_hub)

# ------------------------------------------------------------------------------
# 7. LOS 5 HITOS DE LA LÍNEA DEL TIEMPO (SIN SOLAPAMIENTOS EN PERSPECTIVA)
# ------------------------------------------------------------------------------
milestones_data = [
    {"year": "1981", "label": "FUNDACION",      "y": -5.0, "side": -1.0, "dist": 2.30, "z_extra": 0.0},
    {"year": "1992", "label": "DERECHOS",       "y": -1.2, "side": -1.0, "dist": 2.35, "z_extra": 0.0},
    {"year": "2005", "label": "COMUNIDAD",      "y":  1.8, "side":  1.0, "dist": 2.85, "z_extra": 0.0},
    {"year": "2016", "label": "EXPANSION",      "y":  4.8, "side": -1.0, "dist": 2.45, "z_extra": 0.0},
    {"year": "HOY",  "label": "FUTURO DIGITAL", "y":  7.4, "side":  1.0, "dist": 1.80, "z_extra": 0.35},
]

timeline_col = bpy.data.collections.new("Collection_Timeline_Milestones")
scene.collection.children.link(timeline_col)

for idx, m in enumerate(milestones_data):
    my = m["y"]
    side = m["side"]
    cx = road_center_x(my)
    mx = cx + side * m["dist"]
    pt, norm = surface_point_and_normal(mx, my, m["z_extra"])

    m_root = bpy.data.objects.new(f"Milestone_{idx+1:02d}_{m['year']}", None)
    m_root.location = pt
    up_v = norm
    fwd_v = Vector((0.12, -1.0, 0.0)).normalized()
    right_v = fwd_v.cross(up_v).normalized()
    true_fwd = up_v.cross(right_v).normalized()
    m_rot = Matrix((right_v, true_fwd, up_v)).transposed()
    m_root.rotation_euler = m_rot.to_euler()
    timeline_col.objects.link(m_root)

    bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.032, major_segments=48, minor_segments=16, location=(0, 0, 0.05))
    ring_obj = bpy.context.active_object
    ring_obj.name = f"Milestone_Ring_{m['year']}"
    ring_obj.data.materials.append(mat_amber)
    scene.collection.objects.unlink(ring_obj)
    timeline_col.objects.link(ring_obj)
    ring_obj.parent = m_root

    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.045, depth=0.65, location=(0, 0, 0.35))
    stem_obj = bpy.context.active_object
    stem_obj.name = f"Milestone_Glass_Stem_{m['year']}"
    stem_obj.data.materials.append(mat_car_glass_edge)
    scene.collection.objects.unlink(stem_obj)
    timeline_col.objects.link(stem_obj)
    stem_obj.parent = m_root

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.08))
    card_obj = bpy.context.active_object
    card_obj.name = f"Milestone_Glass_Frame_{m['year']}"
    card_obj.scale = (1.42, 0.13, 0.86)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bev = card_obj.modifiers.new("Bevel", 'BEVEL')
    bev.width = 0.04
    bev.segments = 4
    for p in card_obj.data.polygons:
        p.use_smooth = True
    card_obj.data.materials.append(mat_card_glass)
    scene.collection.objects.unlink(card_obj)
    timeline_col.objects.link(card_obj)
    card_obj.parent = m_root

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.0, 1.08))
    core_obj = bpy.context.active_object
    core_obj.name = f"Milestone_Blue_Core_{m['year']}"
    core_obj.scale = (1.24, 0.07, 0.70)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    core_obj.data.materials.append(mat_car_blue)
    scene.collection.objects.unlink(core_obj)
    timeline_col.objects.link(core_obj)
    core_obj.parent = m_root

    font_curve = bpy.data.curves.new(type="FONT", name=f"Font_Year_{m['year']}")
    font_curve.body = m["year"]
    font_curve.size = 0.35
    font_curve.extrude = 0.04
    font_curve.bevel_depth = 0.006
    font_curve.align_x = 'CENTER'
    font_curve.align_y = 'CENTER'
    txt_year = bpy.data.objects.new(f"Text_Year_{m['year']}", font_curve)
    txt_year.location = (0, 0.075, 1.18)
    txt_year.rotation_euler = (math.pi / 2, 0, math.pi)
    txt_year.data.materials.append(mat_amber)
    timeline_col.objects.link(txt_year)
    txt_year.parent = m_root

    font_sub = bpy.data.curves.new(type="FONT", name=f"Font_Sub_{m['year']}")
    font_sub.body = m["label"]
    font_sub.size = 0.13
    font_sub.extrude = 0.025
    font_sub.align_x = 'CENTER'
    font_sub.align_y = 'CENTER'
    txt_sub = bpy.data.objects.new(f"Text_Sub_{m['year']}", font_sub)
    txt_sub.location = (0, 0.075, 0.88)
    txt_sub.rotation_euler = (math.pi / 2, 0, math.pi)
    txt_sub.data.materials.append(mat_white_text)
    timeline_col.objects.link(txt_sub)
    txt_sub.parent = m_root

# ------------------------------------------------------------------------------
# 8. ILUMINACIÓN CINEMATOGRÁFICA
# ------------------------------------------------------------------------------
light_col = bpy.data.collections.new("Collection_Lights")
scene.collection.children.link(light_col)

sun_data = bpy.data.lights.new(name="Sun_Golden_Horizon", type='SUN')
sun_data.energy = 3.5
sun_data.color = (1.0, 0.92, 0.78)
sun_data.angle = math.radians(4.0)
sun_obj = bpy.data.objects.new(name="Sun_Golden_Horizon", object_data=sun_data)
sun_obj.rotation_euler = (math.radians(68), math.radians(-24), math.radians(38))
light_col.objects.link(sun_obj)

key_data = bpy.data.lights.new(name="Area_Car_Key_Glass", type='AREA')
key_data.energy = 360.0
key_data.color = (0.82, 0.93, 1.0)
key_data.shape = 'RECTANGLE'
key_data.size = 5.0
key_data.size_y = 2.5
key_obj = bpy.data.objects.new(name="Area_Car_Key_Glass", object_data=key_data)
key_obj.location = (car_pos.x + 2.5, car_pos.y - 1.5, car_pos.z + 2.8)
key_obj.rotation_euler = (math.radians(42), math.radians(32), math.radians(-22))
light_col.objects.link(key_obj)

rim_data = bpy.data.lights.new(name="Area_Horizon_Rim", type='AREA')
rim_data.energy = 1400.0
rim_data.color = (0.35, 0.75, 1.0)
rim_data.shape = 'RECTANGLE'
rim_data.size = 24.0
rim_data.size_y = 4.0
rim_obj = bpy.data.objects.new(name="Area_Horizon_Rim", object_data=rim_data)
rim_obj.location = (0.0, 16.0, -1.5)
rim_obj.rotation_euler = (math.radians(-76), 0.0, 0.0)
light_col.objects.link(rim_obj)

# ------------------------------------------------------------------------------
# 9. CÁMARAS Y RENDERIZADO FINAL DE LAS 3 VISTAS PARA CODEX
# ------------------------------------------------------------------------------
def look_at(obj_camera, target_pt):
    direction = target_pt - obj_camera.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    obj_camera.rotation_euler = rot_quat.to_euler()

cam_hero_data = bpy.data.cameras.new("Cam_01_Hero_Timeline")
cam_hero_data.lens = 24.0
cam_hero_data.dof.use_dof = True
cam_hero_data.dof.focus_distance = 5.8
cam_hero_data.dof.aperture_fstop = 5.6
cam_hero = bpy.data.objects.new("Cam_01_Hero_Timeline", cam_hero_data)
cam_hero.location = (car_pos.x + 2.35, car_pos.y - 4.45, car_pos.z + 1.68)
look_at(cam_hero, Vector((car_pos.x - 0.15, car_pos.y + 3.2, car_pos.z + 0.25)))
scene.collection.objects.link(cam_hero)

cam_car_data = bpy.data.cameras.new("Cam_02_Car_Glass_Detail")
cam_car_data.lens = 38.0
cam_car_data.dof.use_dof = True
cam_car_data.dof.focus_distance = 3.1
cam_car_data.dof.aperture_fstop = 4.0
cam_car = bpy.data.objects.new("Cam_02_Car_Glass_Detail", cam_car_data)
cam_car.location = (car_pos.x + 2.15, car_pos.y + 2.25, car_pos.z + 0.98)
look_at(cam_car, Vector((car_pos.x - 0.05, car_pos.y - 0.05, car_pos.z + 0.42)))
scene.collection.objects.link(cam_car)

cam_overview_data = bpy.data.cameras.new("Cam_03_Curved_Earth_Timeline_Overview")
cam_overview_data.lens = 22.0
cam_overview = bpy.data.objects.new("Cam_03_Curved_Earth_Timeline_Overview", cam_overview_data)
cam_overview.location = (0.2, -11.5, 4.6)
look_at(cam_overview, Vector((0.0, 2.2, -0.1)))
scene.collection.objects.link(cam_overview)

blend_path = os.path.join(OUT_DIR, "el_rescate_timeline_curved_earth.blend")
scene.camera = cam_hero
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

# Render 1: Hero Principal (1920x1080)
scene.camera = cam_hero
scene.render.filepath = os.path.join(OUT_DIR, "01_hero_timeline_curved_earth.png")
bpy.ops.render.render(write_still=True)

# Render 2: Detalle del Carro Azul Semi-Oscuro con Bordes Glass (1600x900)
scene.render.resolution_x = 1600
scene.render.resolution_y = 900
scene.camera = cam_car
scene.render.filepath = os.path.join(OUT_DIR, "02_car_semi_dark_blue_glass_edges.png")
bpy.ops.render.render(write_still=True)

# Render 3: Panorama Completo de los 5 Hitos para Codex (1600x900)
scene.camera = cam_overview
scene.render.filepath = os.path.join(OUT_DIR, "03_timeline_path_overview_codex_ref.png")
bpy.ops.render.render(write_still=True)

# Exportar GLB limpio para Three.js / Codex
for obj in bpy.data.objects:
    obj.select_set(False)

export_collections = [car_col, timeline_col]
export_singles = [obj_earth, obj_road, obj_curb_left, obj_curb_right]
for o in export_singles:
    o.select_set(True)
for col in export_collections:
    for o in col.objects:
        if o.type in ('FONT', 'CURVE'):
            bpy.context.view_layer.objects.active = o
            o.select_set(True)
            bpy.ops.object.convert(target='MESH')
        else:
            o.select_set(True)

glb_path = os.path.join(OUT_DIR, "el_rescate_timeline_scene.glb")
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    use_selection=True,
    export_format='GLB',
    export_apply=True,
)
print("V5 Definitive Prototype & GLB completed successfully:", glb_path)
