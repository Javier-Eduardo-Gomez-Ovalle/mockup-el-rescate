# Especificación Técnica y Guía de Implementación 3D — Hero Línea de Tiempo "El Rescate"

## 1. Resumen Ejecutivo y Paleta Oficial ("El Rescate")

Esta especificación documenta tanto el **prototipo visual 3D generado en Blender 5.2 LTS** como la **implementación interactiva lista para producción en WebGL (`Three.js` / `React Three Fiber` + `GSAP`)** de la sección **Hero de Línea de Tiempo** para la ONG **El Rescate** ([elrescate.org](https://www.elrescate.org/)).

| Token Semántico | Valor Hex | Aplicación en Escena 3D y UI |
| :--- | :--- | :--- |
| `brand.primary` (Azul Marino Institucional) | `#173B63` | Chasis inferior del autobús comunitario, titular serif `"EL RESCATE"`, marco del portapapeles legal y botones circulares |
| `brand.secondary` (Azul Cívico Profundo) | `#245B87` | Cristales tintados del autobús (`#1E4B7A`), flores silvestres azules, acentos de expediente (`EXP. #ER-...`) |
| `brand.accent` (Dorado / Ámbar Institucional) | `#D4943A` / `#E8A04A` | Año flotante 3D en dorado mate sobre el techo del autobús, franja cinturón, parachoques, rines, rieles de techo, bordes tipográficos y pinza metálica |
| `surface.warm` (Blanco Cálido Editorial) | `#F7F6F2` | Cabina superior y techo del autobús comunitario, papel de expediente legal y marcos de fotos estilo Polaroid |
| `terrain.grass` (Verde Pradera Low-Poly) | `#35823B` / `#43993E` | Esfera del planeta facetada (`flatShading: true`) y copas de pinos/robles low-poly |
| `terrain.road` (Camino de Tierra Cálido) | `#8F653E` | Camino ecuatorial que bordea la curva del planeta directamente bajo las ruedas del autobús |

---

## 2. Entregables del Proyecto

### A. Prototipo Visual 3D en Blender 5.2 LTS
- **Script generador reproducible**: [`blender_prototype/build_bus_timeline_prototype.py`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/blender_prototype/build_bus_timeline_prototype.py)
- **Archivo nativo Blender**: [`blender_prototype/exports_bus_timeline/el_rescate_bus_timeline.blend`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/blender_prototype/exports_bus_timeline/el_rescate_bus_timeline.blend)
- **Modelo 3D exportado para Web (`.glb`)**: [`blender_prototype/exports_bus_timeline/el_rescate_bus_timeline.glb`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/blender_prototype/exports_bus_timeline/el_rescate_bus_timeline.glb)
- **Render de alta resolución (`1920x1080`, Cycles)**: [`blender_prototype/exports_bus_timeline/hero_bus_timeline_1981_blender.png`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/blender_prototype/exports_bus_timeline/hero_bus_timeline_1981_blender.png)

### B. Implementación Frontend Interactiva (Three.js + React Three Fiber + GSAP)
- **Aplicación Web Interactiva Standalone (`Three.js` + `GSAP`)**: [`web_timeline_hero/index.html`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/web_timeline_hero/index.html)
- **Componente Modular `React Three Fiber` + `@react-three/drei` + `GSAP`**: [`web_timeline_hero/ElRescateTimelineHero.jsx`](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/web_timeline_hero/ElRescateTimelineHero.jsx)

---

## 3. Arquitectura de la Escena 3D y Mecánica Crítica de Animación

### 3.1. Ilusión de Avance (Cámara y Autobús Fijos + Rotación Esférica del Terreno)
- Tanto el `planetPivot` (posicionado en `[0, -10.5, 0]`) como el `busAnchor` (posicionado en la cima `[0, 0.04, 0]`) comparten un contenedor padre (`worldHeadingGroup`) rotado `rotation.y = Math.PI * 0.38` para presentar el autobús en un ángulo 3/4 editorial.
- Al hacer clic en los botones circulares izquierdo/derecho (`#btn-prev` / `#btn-next`), un timeline de **GSAP** interpola `motionState.planetAngle` con `ease: "power3.inOut"` (`1.28s`).
- El planeta gira exclusivamente sobre su eje local transversal (`planetPivot.rotation.x = -motionState.planetAngle`), garantizando que el camino de tierra permanezca **siempre alineado bajo los 4 neumáticos** mientras los árboles low-poly, flores silvestres y piedras bordean el camino en movimiento.

### 3.2. Sincronización Cinemática de las Ruedas y Motor del Autobús
- **Velocidad Angular Proporcional (Sin Deslizamiento)**:
  $$\Delta \theta_{\text{rueda}} = \Delta \theta_{\text{planeta}} \times \frac{R_{\text{planeta}}}{r_{\text{rueda}}} = \Delta \theta_{\text{planeta}} \times \frac{10.5}{0.28} = 37.5 \cdot \Delta \theta_{\text{planeta}}$$
- **Rebote Sutil en Bucle (Motor Encendido)**:
  En el bucle `useFrame` / `requestAnimationFrame`, el chasis (`busChassis`) aplica una oscilación vertical sinusoidal continua:
  `busChassis.position.y = Math.sin(t * idleFreq) * idleAmp`, incrementando su frecuencia y amplitud durante el tránsito entre fechas junto con un ligero cabeceo de tracción (`busChassis.rotation.x`).

### 3.3. Coreografía de Transición por Fecha (GSAP)
1. **Salida (`0.00s -> 0.24s`)**: El año 3D dorado mate sobre el techo del autobús reduce su escala a `0.88` y se eleva ligeramente, mientras la galería izquierda de **Polaroids** y el **Portapapeles Legal Corporativo** derecho salen con `scale: 0.95`, `autoAlpha: 0` y `filter: blur(2px)` (nunca desde `scale: 0`, siguiendo principios de física natural UI).
2. **Rotación del Mundo (`0.00s -> 1.28s`)**: La esfera gira un arco de `72°` (`2π / 5` hitos: `1981`, `1991`, `2004`, `2015`, `2026`).
3. **Reemplazo y Asentamiento (`0.86s -> 1.28s`)**: Se actualiza la geometría extruida 3D del año en dorado mate y los contenidos del DOM; los paneles reingresan con `cubic-bezier(0.23, 1, 0.32, 1)` y el autobús asienta su suspensión con `back.out(2.2)`.
