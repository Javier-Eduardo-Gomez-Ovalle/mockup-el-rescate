import bpy
import bmesh
import math
import random
import os
from mathutils import Vector, Matrix, Euler

# ==============================================================================
# PROTOTIPO VISUAL 3D EN BLENDER 5.2 — EL RESCATE: AUTOBÚS COMUNITARIO & PLANETA LOW-POLY
# ==============================================================================
# Especificación exacta del usuario:
# 1. El Terreno: Colina curva / planeta esférico grande cubierto de césped
#    estilizado tipo low-poly, adornado con árboles pequeños, flores y un
#    camino de tierra cálida que bordea la curva.
# 2. Vehículo Central: En el punto más alto del camino (centro de la pantalla),
#    un autobús de transporte comunitario en 3D con colores corporativos de
#    El Rescate: azul marino (#173B63), blanco (#F7F6F2) y detalles dorados
#    (#D49A3A / #E8A04A) con bordes/ventanas glass.
# 3. Fecha Flotante: Justo encima del techo del autobús flota el año actual
#    ("1981") renderizado en texto 3D color dorado mate.
# ==============================================================================

random.seed(1981)

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "exports_bus_timeline"))
os.makedirs(OUT_DIR, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ------------------------------------------------------------------------------
# 1. CONFIGURACIÓN DE RENDER CYCLES + ATMÓSFERA EDITORIAL EL RESCATE
# ------------------------------------------------------------------------------
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX' if 'AgX' in bpy.types.ColorManagedViewSettings.bl_rna.properties['view_transform'].enum_items.keys() else 'Filmic'
if 'AgX - Medium High Contrast' in [i.name for i in bpy.types.ColorManagedViewSettings.bl_rna.properties['look'].enum_items]:
    scene.view_settings.look = 'AgX - Medium High Contrast'

world = bpy.data.worlds.new("World_ElRescate_Timeline")
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

# Fondo institucional El Rescate (#173B63 arriba -> #245B87 medio -> #EAF1F6 horizonte) para máximo contraste del año 1981 en dorado mate
node_ramp.color_ramp.elements[0].position = 0.0
node_ramp.color_ramp.elements[0].color = (0.58, 0.72, 0.84, 1.0)
e_mid = node_ramp.color_ramp.elements.new(0.45)
e_mid.color = (0.08, 0.22, 0.39, 1.0)
node_ramp.color_ramp.elements[1].position = 0.88
node_ramp.color_ramp.elements[1].color = (0.025, 0.085, 0.19, 1.0)

node_bg.inputs['Strength'].default_value = 1.15
wlinks.new(node_tex_coord.outputs['Window'], node_sep_xyz.inputs['Vector'])
wlinks.new(node_sep_xyz.outputs['Y'], node_ramp.inputs['Fac'])
wlinks.new(node_ramp.outputs['Color'], node_bg.inputs['Color'])
wlinks.new(node_bg.outputs['Background'], node_out.inputs['Surface'])

# ------------------------------------------------------------------------------
# 2. PALETA DE MATERIALES CORPORATIVOS DE EL RESCATE
# ------------------------------------------------------------------------------
def set_input(bsdf, names, val):
    for n in names:
        if n in bsdf.inputs:
            bsdf.inputs[n].default_value = val
            return

def make_mat(name, color, roughness=0.5, metallic=0.0, clearcoat=0.0, transmission=0.0, emission_strength=0.0, flat=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    set_input(bsdf, ['Base Color'], color)
    set_input(bsdf, ['Roughness'], roughness)
    set_input(bsdf, ['Metallic'], metallic)
    set_input(bsdf, ['Coat Weight', 'Clearcoat'], clearcoat)
    set_input(bsdf, ['Transmission Weight', 'Transmission'], transmission)
    if emission_strength > 0.0:
        set_input(bsdf, ['Emission Color', 'Emission'], color)
        set_input(bsdf, ['Emission Strength'], emission_strength)
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    return mat

# Colores corporativos y de entorno
mat_grass_lowpoly = make_mat("Mat_LowPoly_Grass", (0.16, 0.44, 0.18, 1.0), roughness=0.78)
mat_grass_tuft    = make_mat("Mat_LowPoly_Grass_Tuft", (0.22, 0.54, 0.21, 1.0), roughness=0.65)
mat_dirt_road     = make_mat("Mat_Dirt_Road", (0.48, 0.34, 0.21, 1.0), roughness=0.88)
mat_dirt_edge     = make_mat("Mat_Dirt_Stone_Border", (0.62, 0.49, 0.34, 1.0), roughness=0.82)

# Autobús Comunitario: Azul Marino (#173B63), Blanco Cálido (#F7F6F2) y Dorado (#D89B3C)
mat_bus_navy      = make_mat("Mat_Bus_Navy_173B63", (0.028, 0.095, 0.225, 1.0), roughness=0.22, metallic=0.35, clearcoat=0.9)
mat_bus_white     = make_mat("Mat_Bus_White_F7F6F2", (0.94, 0.93, 0.89, 1.0), roughness=0.24, metallic=0.08, clearcoat=0.85)
mat_bus_gold      = make_mat("Mat_Bus_Gold_E8A04A", (0.85, 0.55, 0.16, 1.0), roughness=0.28, metallic=0.82, clearcoat=0.6)
mat_matte_gold_3d = make_mat("Mat_Year_Matte_Gold", (0.86, 0.58, 0.18, 1.0), roughness=0.46, metallic=0.68)
mat_bus_glass     = make_mat("Mat_Bus_Glass_Window", (0.42, 0.72, 0.92, 1.0), roughness=0.06, metallic=0.1, clearcoat=1.0, transmission=0.85)
mat_tire_dark     = make_mat("Mat_Bus_Tire", (0.04, 0.05, 0.07, 1.0), roughness=0.75)
mat_headlight     = make_mat("Mat_Bus_Headlight", (1.0, 0.94, 0.78, 1.0), roughness=0.1, emission_strength=3.5)

# Árboles y Flores Low-Poly
mat_tree_trunk    = make_mat("Mat_Tree_Trunk", (0.28, 0.17, 0.09, 1.0), roughness=0.85)
mat_tree_leaf_1   = make_mat("Mat_Tree_Leaf_Deep", (0.11, 0.34, 0.14, 1.0), roughness=0.72)
mat_tree_leaf_2   = make_mat("Mat_Tree_Leaf_Bright", (0.20, 0.48, 0.19, 1.0), roughness=0.70)
mat_flower_gold   = make_mat("Mat_Flower_Gold", (0.94, 0.62, 0.18, 1.0), roughness=0.45)
mat_flower_white  = make_mat("Mat_Flower_White", (0.98, 0.97, 0.94, 1.0), roughness=0.45)
mat_flower_blue   = make_mat("Mat_Flower_Blue", (0.18, 0.44, 0.72, 1.0), roughness=0.45)

# ------------------------------------------------------------------------------
# 3. PLANETA ESFÉRICO LOW-POLY + CAMINO DE TIERRA ECUATORIAL
# ------------------------------------------------------------------------------
PLANET_RADIUS = 12.0
PLANET_CENTER = Vector((0.0, 0.0, -PLANET_RADIUS))

planet_root = bpy.data.objects.new("Planet_Pivot_Group", None)
planet_root.location = PLANET_CENTER
scene.collection.objects.link(planet_root)

# Esfera geodésica Low-Poly (Icosphere subdivisión 4 con facetado flat-shaded)
bm_planet = bmesh.new()
bmesh.ops.create_icosphere(bm_planet, subdivisions=4, radius=PLANET_RADIUS)

# Camino de tierra que bordea la curva superior (en torno a X = 0, recorriendo el meridiano Y)
for v in bm_planet.verts:
    # Coordenadas sobre la esfera
    dist_from_path = abs(v.co.x - 0.55 * math.sin(v.co.y * 0.22))
    if dist_from_path < 1.35:
        # Aplanar ligeramente el lecho del camino de tierra
        v.co = v.co.normalized() * (PLANET_RADIUS - 0.03)
    else:
        # Relieve facetado low-poly en las colinas laterales
        n_val = 0.22 * math.sin(v.co.x * 0.65 + v.co.y * 0.55) + 0.14 * math.cos(v.co.z * 0.8 - v.co.x * 0.5)
        v.co = v.co.normalized() * (PLANET_RADIUS + max(0.0, n_val))

bmesh.ops.recalc_face_normals(bm_planet, faces=bm_planet.faces)
mesh_planet = bpy.data.meshes.new("Mesh_LowPoly_Planet")
bm_planet.to_mesh(mesh_planet)
bm_planet.free()
# Mantener flat shading auténtico para estética Low-Poly estilizada
for p in mesh_planet.polygons:
    p.use_smooth = False

obj_planet = bpy.data.objects.new("LowPoly_Planet_Meadow", mesh_planet)
obj_planet.location = (0, 0, 0)
obj_planet.parent = planet_root
obj_planet.data.materials.append(mat_grass_lowpoly)
scene.collection.objects.link(obj_planet)

# Cinta del Camino de Tierra (Dirt Road) que bordea la curvatura del planeta
bm_road = bmesh.new()
ROAD_STEPS = 140
ANGLE_MIN = -math.radians(78)
ANGLE_MAX = math.radians(78)
ROAD_HALF_W = 1.15

r_left, r_right, r_left_b, r_right_b = [], [], [], []
for i in range(ROAD_STEPS + 1):
    t = i / ROAD_STEPS
    theta = ANGLE_MIN + t * (ANGLE_MAX - ANGLE_MIN)
    # Punto sobre el meridiano superior (en coordenadas locales de planet_root)
    y_loc = PLANET_RADIUS * math.sin(theta)
    z_loc = PLANET_RADIUS * math.cos(theta)
    x_center = 0.55 * math.sin(theta * 2.4)

    pL = Vector((x_center - ROAD_HALF_W, y_loc, z_loc)).normalized() * (PLANET_RADIUS + 0.035)
    pR = Vector((x_center + ROAD_HALF_W, y_loc, z_loc)).normalized() * (PLANET_RADIUS + 0.035)
    pLb = Vector((x_center - ROAD_HALF_W * 1.06, y_loc, z_loc)).normalized() * (PLANET_RADIUS - 0.05)
    pRb = Vector((x_center + ROAD_HALF_W * 1.06, y_loc, z_loc)).normalized() * (PLANET_RADIUS - 0.05)

    r_left.append(bm_road.verts.new(pL))
    r_right.append(bm_road.verts.new(pR))
    r_left_b.append(bm_road.verts.new(pLb))
    r_right_b.append(bm_road.verts.new(pRb))

for i in range(ROAD_STEPS):
    bm_road.faces.new((r_left[i], r_right[i], r_right[i+1], r_left[i+1]))
    bm_road.faces.new((r_left_b[i], r_left[i], r_left[i+1], r_left_b[i+1]))
    bm_road.faces.new((r_right[i], r_right_b[i], r_right_b[i+1], r_right[i+1]))

bmesh.ops.recalc_face_normals(bm_road, faces=bm_road.faces)
mesh_dirt_road = bpy.data.meshes.new("Mesh_Curved_Dirt_Road")
bm_road.to_mesh(mesh_dirt_road)
bm_road.free()
for p in mesh_dirt_road.polygons:
    p.use_smooth = False

obj_dirt_road = bpy.data.objects.new("Curved_Dirt_Road", mesh_dirt_road)
obj_dirt_road.parent = planet_root
obj_dirt_road.data.materials.append(mat_dirt_road)
scene.collection.objects.link(obj_dirt_road)

# ------------------------------------------------------------------------------
# 4. ÁRBOLES PEQUEÑOS LOW-POLY, BRIZNAS FACETADAS Y FLORES SILVESTRES
# ------------------------------------------------------------------------------
props_col = bpy.data.collections.new("Collection_Planet_Nature_Props")
scene.collection.children.link(props_col)

def create_lowpoly_pine_tree(name, location_local, normal_vec, scale_factor=1.0):
    root = bpy.data.objects.new(name, None)
    root.location = location_local
    root.rotation_euler = normal_vec.to_track_quat('Z', 'Y').to_euler()
    root.scale = (scale_factor, scale_factor, scale_factor)
    root.parent = planet_root
    props_col.objects.link(root)

    # Tronco facetado
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.11, depth=0.48, location=(0, 0, 0.24))
    trunk = bpy.context.active_object
    trunk.data.materials.append(mat_tree_trunk)
    scene.collection.objects.unlink(trunk)
    props_col.objects.link(trunk)
    trunk.parent = root

    # 3 conos facetados superpuestos
    tiers = [(0.52, 0.65, 0.62), (0.40, 0.55, 1.00), (0.28, 0.45, 1.32)]
    for idx, (rad, depth, z_p) in enumerate(tiers):
        bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=rad, radius2=0.0, depth=depth, location=(0, 0, z_p))
        cone = bpy.context.active_object
        for poly in cone.data.polygons:
            poly.use_smooth = False
        cone.data.materials.append(mat_tree_leaf_1 if idx % 2 == 0 else mat_tree_leaf_2)
        scene.collection.objects.unlink(cone)
        props_col.objects.link(cone)
        cone.parent = root

# Distribuir 52 árboles pequeños low-poly a ambos lados del camino de tierra
for t_i in range(52):
    theta = random.uniform(-math.radians(65), math.radians(65))
    side = -1.0 if (t_i % 2 == 0) else 1.0
    lat_dist = random.uniform(1.65, 6.8)
    # Evitar tapar el autobús en el centro frontal
    if abs(theta) < math.radians(14) and lat_dist < 2.8:
        lat_dist += 1.6

    y_l = PLANET_RADIUS * math.sin(theta)
    z_l = PLANET_RADIUS * math.cos(theta)
    x_l = 0.55 * math.sin(theta * 2.4) + side * lat_dist
    pos_local = Vector((x_l, y_l, z_l)).normalized() * (PLANET_RADIUS + 0.02)
    norm_local = pos_local.normalized()
    sc = random.uniform(0.55, 1.15)
    create_lowpoly_pine_tree(f"LowPoly_Tree_{t_i:02d}", pos_local, norm_local, sc)

# Crear malla maestra de Flores Silvestres Low-Poly y Manojos de Césped Low-Poly
bm_flower = bmesh.new()
bmesh.ops.create_icosphere(bm_flower, subdivisions=1, radius=0.09)
mesh_flower = bpy.data.meshes.new("Mesh_LowPoly_Flower")
bm_flower.to_mesh(mesh_flower)
bm_flower.free()

flower_mats = [mat_flower_gold, mat_flower_white, mat_flower_blue]
for f_i in range(180):
    theta = random.uniform(-math.radians(62), math.radians(62))
    side = -1.0 if (f_i % 2 == 0) else 1.0
    lat_dist = random.uniform(1.32, 6.2)
    y_l = PLANET_RADIUS * math.sin(theta)
    z_l = PLANET_RADIUS * math.cos(theta)
    x_l = 0.55 * math.sin(theta * 2.4) + side * lat_dist
    pos_local = Vector((x_l, y_l, z_l)).normalized() * (PLANET_RADIUS + 0.08)

    f_obj = bpy.data.objects.new(f"LowPoly_Flower_{f_i:03d}", mesh_flower.copy())
    f_obj.data.materials.append(flower_mats[f_i % 3])
    f_obj.location = pos_local
    f_obj.parent = planet_root
    sc = random.uniform(0.7, 1.35)
    f_obj.scale = (sc, sc, sc * 0.65)
    props_col.objects.link(f_obj)

# Manojos de césped estilizado low-poly (cristales/prismas verdes) sobre la colina
bm_gtuft = bmesh.new()
for b_ang in [0.0, 2.1, 4.2]:
    ca, sa = math.cos(b_ang), math.sin(b_ang)
    v0 = bm_gtuft.verts.new((-0.05 * sa, 0.05 * ca, 0.0))
    v1 = bm_gtuft.verts.new(( 0.05 * sa, -0.05 * ca, 0.0))
    v2 = bm_gtuft.verts.new(( 0.08 * ca, 0.08 * sa, 0.24))
    bm_gtuft.faces.new((v0, v1, v2))
bmesh.ops.recalc_face_normals(bm_gtuft, faces=bm_gtuft.faces)
mesh_gtuft = bpy.data.meshes.new("Mesh_LowPoly_GrassTuft")
bm_gtuft.to_mesh(mesh_gtuft)
bm_gtuft.free()
mesh_gtuft.materials.append(mat_grass_tuft)

for g_i in range(950):
    theta = random.uniform(-math.radians(65), math.radians(65))
    side = -1.0 if (g_i % 2 == 0) else 1.0
    lat_dist = random.uniform(1.28, 7.5)
    y_l = PLANET_RADIUS * math.sin(theta)
    z_l = PLANET_RADIUS * math.cos(theta)
    x_l = 0.55 * math.sin(theta * 2.4) + side * lat_dist
    pos_local = Vector((x_l, y_l, z_l)).normalized() * (PLANET_RADIUS + 0.01)
    norm_local = pos_local.normalized()

    g_obj = bpy.data.objects.new(f"LowPoly_GrassTuft_{g_i:03d}", mesh_gtuft)
    g_obj.location = pos_local
    eul = norm_local.to_track_quat('Z', 'Y').to_euler()
    eul.rotate_axis('Z', random.uniform(0, math.tau))
    g_obj.rotation_euler = eul
    g_obj.parent = planet_root
    sc = random.uniform(0.8, 1.5)
    g_obj.scale = (sc, sc, sc)
    props_col.objects.link(g_obj)

# ------------------------------------------------------------------------------
# 5. VEHÍCULO CENTRAL: AUTOBÚS DE TRANSPORTE COMUNITARIO EN 3D (AZUL MARINO, BLANCO Y DORADO)
# ------------------------------------------------------------------------------
bus_col = bpy.data.collections.new("Collection_Community_Bus")
scene.collection.children.link(bus_col)

# Ubicado en el punto más alto del camino (z = 0, x = 0, y = 0)
bus_root = bpy.data.objects.new("Community_Bus_Root", None)
bus_root.location = (0.0, 0.0, 0.06)
# Orientar el frente del autobús (que apunta a +Y local) hacia la cámara en 3/4 (-Y global)
bus_root.rotation_euler = (0.0, 0.0, math.radians(156))
bus_col.objects.link(bus_root)

def add_bus_part(name, size_xyz, loc_xyz, mat, bevel_w=0.04):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc_xyz)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size_xyz
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel_w > 0:
        bev = obj.modifiers.new("Bevel", 'BEVEL')
        bev.width = bevel_w
        bev.segments = 3
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.data.materials.append(mat)
    scene.collection.objects.unlink(obj)
    bus_col.objects.link(obj)
    obj.parent = bus_root
    return obj

# 1. Carrocería Inferior Azul Marino Corporativo (#173B63)
add_bus_part("Bus_Lower_Body_Navy", (1.35, 3.10, 0.68), (0.0, 0.0, 0.56), mat_bus_navy, bevel_w=0.06)

# 2. Carrocería Superior / Techo Blanco Marfil (#F7F6F2)
add_bus_part("Bus_Upper_Cabin_White", (1.30, 2.96, 0.62), (0.0, -0.03, 1.14), mat_bus_white, bevel_w=0.08)

# 3. Franja Cinturón Dorada Corporativa (#E8A04A) alrededor de todo el autobús
add_bus_part("Bus_Gold_Belt_Trim", (1.38, 3.14, 0.085), (0.0, 0.0, 0.88), mat_bus_gold, bevel_w=0.015)

# 4. Parachoques Delantero y Trasero Dorados
add_bus_part("Bus_Front_Gold_Bumper", (1.42, 0.16, 0.14), (0.0, 1.56, 0.28), mat_bus_gold, bevel_w=0.03)
add_bus_part("Bus_Rear_Gold_Bumper", (1.42, 0.16, 0.14), (0.0, -1.56, 0.28), mat_bus_gold, bevel_w=0.03)

# 5. Parabrisas panorámico y Ventanas laterales en Cristal Translúcido (Glass)
add_bus_part("Bus_Front_Windshield_Glass", (1.16, 0.12, 0.42), (0.0, 1.46, 1.14), mat_bus_glass, bevel_w=0.02)
add_bus_part("Bus_Rear_Window_Glass", (1.12, 0.10, 0.38), (0.0, -1.49, 1.14), mat_bus_glass, bevel_w=0.02)

for w_idx, wy in enumerate([-1.02, -0.36, 0.30, 0.94]):
    add_bus_part(f"Bus_Side_Window_Glass_{w_idx}", (1.33, 0.50, 0.36), (0.0, wy, 1.15), mat_bus_glass, bevel_w=0.015)

# 6. Portaequipajes / Rieles de Techo en Dorado Mate
add_bus_part("Bus_Roof_Rack_Gold_L", (0.04, 2.20, 0.05), (-0.52, -0.05, 1.47), mat_bus_gold, bevel_w=0.01)
add_bus_part("Bus_Roof_Rack_Gold_R", (0.04, 2.20, 0.05), ( 0.52, -0.05, 1.47), mat_bus_gold, bevel_w=0.01)

# 7. Faros Delanteros Redondos Clásicos con Aro Dorado
for side_x in [-0.46, 0.46]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.11, depth=0.08, location=(side_x, 1.56, 0.52), rotation=(math.pi / 2, 0, 0))
    hl = bpy.context.active_object
    hl.data.materials.append(mat_headlight)
    scene.collection.objects.unlink(hl)
    bus_col.objects.link(hl)
    hl.parent = bus_root

# 8. Las 4 Ruedas con Rines Dorados (listas para girar sobre su eje X local)
wheel_coords = [
    (-0.68, -0.95, 0.30),
    ( 0.68, -0.95, 0.30),
    (-0.68,  0.95, 0.30),
    ( 0.68,  0.95, 0.30),
]
for idx, (wx, wy, wz) in enumerate(wheel_coords):
    bpy.ops.mesh.primitive_cylinder_add(vertices=36, radius=0.30, depth=0.22, location=(wx, wy, wz), rotation=(0, math.pi / 2, 0))
    tire = bpy.context.active_object
    tire.name = f"Bus_Wheel_{idx}"
    for p in tire.data.polygons:
        p.use_smooth = True
    tire.data.materials.append(mat_tire_dark)
    scene.collection.objects.unlink(tire)
    bus_col.objects.link(tire)
    tire.parent = bus_root

    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.17, depth=0.24, location=(wx, wy, wz), rotation=(0, math.pi / 2, 0))
    rim = bpy.context.active_object
    rim.name = f"Bus_Wheel_Gold_Rim_{idx}"
    rim.data.materials.append(mat_bus_gold)
    scene.collection.objects.unlink(rim)
    bus_col.objects.link(rim)
    rim.parent = bus_root

# ------------------------------------------------------------------------------
# 6. FECHA FLOTANTE 3D ("1981") EN DORADO MATE JUSTO ENCIMA DEL TECHO DEL AUTOBÚS
# ------------------------------------------------------------------------------
font_year = bpy.data.curves.new(type="FONT", name="Font_Floating_Year_1981")
font_year.body = "1981"
font_year.size = 0.78
font_year.extrude = 0.11
font_year.bevel_depth = 0.018
font_year.bevel_resolution = 3
font_year.align_x = 'CENTER'
font_year.align_y = 'BOTTOM'

obj_year_3d = bpy.data.objects.new("Floating_Year_3D_1981", font_year)
obj_year_3d.location = (0.0, 0.0, 1.72)
# Orientado de frente a la cámara principal
obj_year_3d.rotation_euler = (math.pi / 2, 0.0, 0.0)
obj_year_3d.data.materials.append(mat_matte_gold_3d)
bus_col.objects.link(obj_year_3d)

# ------------------------------------------------------------------------------
# 7. ILUMINACIÓN EDITORIAL CÁLIDA Y CÁMARA CENTRAL FIJA
# ------------------------------------------------------------------------------
light_col = bpy.data.collections.new("Collection_Lights")
scene.collection.children.link(light_col)

sun_data = bpy.data.lights.new(name="Sun_Key_Warm", type='SUN')
sun_data.energy = 3.8
sun_data.color = (1.0, 0.95, 0.86)
sun_data.angle = math.radians(5.0)
sun_obj = bpy.data.objects.new(name="Sun_Key_Warm", object_data=sun_data)
sun_obj.rotation_euler = (math.radians(52), math.radians(-28), math.radians(24))
light_col.objects.link(sun_obj)

fill_data = bpy.data.lights.new(name="Area_Fill_Soft", type='AREA')
fill_data.energy = 280.0
fill_data.color = (0.88, 0.94, 1.0)
fill_data.size = 6.0
fill_obj = bpy.data.objects.new(name="Area_Fill_Soft", object_data=fill_data)
fill_obj.location = (-4.5, -5.0, 4.0)
fill_obj.rotation_euler = (math.radians(55), 0.0, math.radians(-35))
light_col.objects.link(fill_obj)

def look_at(obj_camera, target_pt):
    direction = target_pt - obj_camera.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    obj_camera.rotation_euler = rot_quat.to_euler()

# Cámara Hero Central (encuadra el planeta curvo abajo, el autobús en la cima central,
# el año 1981 en dorado mate sobre el techo, y deja espacio a izquierda y derecha para
# la galería Polaroid y el portapapeles legal corporativo)
cam_data = bpy.data.cameras.new("Cam_Hero_Bus_Timeline")
cam_data.lens = 32.0
cam_obj = bpy.data.objects.new("Cam_Hero_Bus_Timeline", cam_data)
cam_obj.location = (0.0, -7.8, 1.85)
look_at(cam_obj, Vector((0.0, 0.0, 1.05)))
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

blend_path = os.path.join(OUT_DIR, "el_rescate_bus_timeline.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

render_path = os.path.join(OUT_DIR, "hero_bus_timeline_1981_blender.png")
scene.render.filepath = render_path
bpy.ops.render.render(write_still=True)

# Convertir el texto 3D a malla y exportar .glb listo para React Three Fiber / Three.js
bpy.context.view_layer.objects.active = obj_year_3d
obj_year_3d.select_set(True)
bpy.ops.object.convert(target='MESH')

for o in bpy.data.objects:
    o.select_set(o.type == 'MESH' or o.type == 'EMPTY')

glb_path = os.path.join(OUT_DIR, "el_rescate_bus_timeline.glb")
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    use_selection=True,
    export_format='GLB',
    export_apply=True,
)
print("Bus Timeline Blend + GLB exported:", glb_path)
