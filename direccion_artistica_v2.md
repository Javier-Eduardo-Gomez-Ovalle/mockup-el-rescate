# Dirección Artística V2 y Rediseño de Header + Hero — El Rescate (`direccion_artistica_v2.md`)

- **Archivo de Figma:** https://www.figma.com/design/VGktR37ZboN18jlZNoftLu
- **Sección / Tablero Maestro V2:** Nodo `15:2` (`03 — Art Direction & Hero Redesign V2`, `4320 × 3280 px`, ubicado a la derecha de los tableros `2:2`, `6:2` y `10:2` sin sobrescribir ni alterar ningún elemento previo).
- **Artboards principales dentro de `15:2`:**
  - `1. Referencias y principios visuales` (Nodo `15:17`)
  - `2. Concepto A — «Monolito Documental Oscuro»` (Nodo `15:54`)
  - `3. Concepto B — «Crónica Viva en Tres Planos»` (Nodo `15:83`)
  - `4. Comparación de alternativas` y `5. Propuesta seleccionada` (Nodos `15:118` y `15:156`)
  - `6. Desktop (1440 × 1060 px)` — `Artboard / Home V2 — Desktop 1440px` (Nodo `15:171`)
  - `7. Mobile (390 × 1060 px)` — `Artboard / Home V2 — Mobile 390px` (Nodo `15:290`)
  - `8. Menú móvil (390 × 860 px)` — `Artboard / Mobile Menu Open V2 — 390px` (Nodo `15:341`)
  - `9. Notas de implementación y movimiento` (Nodo `15:386`)

---

## 1. Auditoría Obligatoria de Skills Instaladas

Se inspeccionaron los archivos `SKILL.md` completos de las 10 habilidades de diseño, movimiento y 3D instaladas en `.agents/skills/`:

### 1.1 Mapeo de Skills por Disciplina

| Disciplina Requerida | Skills Instaladas Auditadas | Aplicación Específica en El Rescate V2 |
| :--- | :--- | :--- |
| **Dirección artística** | `frontend-design` (Anthropic)<br>`build-awwwards-quality-sites` | Anclar el diseño en la materia real de **El Rescate** (memoria migrante salvadoreña/centroamericana y latina en Los Ángeles desde 1981, códice mesoamericano del logotipo oficial). Concentrar la audacia visual en un gesto inconfundible: la costura arquitectónica entre papel cálido (`#F7F6F2`) y monolito azul profundo (`#173B63`) atravesada por el titular y la fotografía documental. |
| **Composición editorial** | `frontend-design`<br>`ckw-design` (CKW Design) | Ruptura de la grilla simétrica 50/50 de V1; uso de líneas arquitectónicas expuestas (`1px` *hairlines*), coordenadas de archivo en el margen izquierdo y titulares escalonados (*staggered display type*) de `72px` con un plinto de contraste en el tercer renglón. |
| **Diseño de interfaces** | `emil-design-eng` (Emil Kowalski)<br>`ckw-design` | Claridad funcional del Header bilingüe (`ES / EN`), áreas táctiles mínimas de `48 × 48 px` en móvil, jerarquía nítida entre el CTA primario (`Conoce nuestros servicios`) y el secundario (`Quiénes somos`), y eliminación de ruido decorativo. |
| **Animación y Microinteracciones** | `animate` (Emil Kowalski)<br>`find-animation-opportunities` | Regla de presupuesto de velocidad: toda interacción de interfaz (botones, selector de idioma, enlaces de navegación) se mantiene por debajo de `250ms` con curvas personalizadas fuertes (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`), feedback `:active` con `transform: scale(0.97)` y prohibición de animar desde `scale(0)` o animar navegación por teclado. |
| **GSAP y Storytelling por Scroll** | `gsap` (Meng To)<br>`cinematic-scroll-storytelling` | Coreografía de entrada mediante un único `gsap.timeline()` (revelado de fotografía por `clip-path`, entrada escalonada de los 3 niveles del titular y trazado progresivo del *Hilo de Memoria*) más paralaje diferencial vinculado a `ScrollTrigger` (`data-speed`) con un único motor de scroll suave (`Lenis`). |
| **Three.js y WebGL** | `threejs` (Meng To)<br>`webgl-landing-steering` | Selección del **Lane A (*Subtle Depth Field*)** de `webgl-landing-steering`: en lugar de figuras 3D abstractas que parezcan demos tecnológicas, se define un único plano `THREE.Mesh` con `ShaderMaterial` y mapa de profundidad (`uDepthMap`) sobre la fotografía protagonista (Plano Z-2), con `devicePixelRatio ≤ 2` y *fallback* estático inmediato. |
| **Auditoría visual** | `ckw-design`<br>`frontend-design` | Inspección obligatoria mediante capturas reales renderizadas (`get_screenshot`) tanto en `1440px` como en `390px` para verificar tensión compositiva, legibilidad y ausencia de desbordamiento horizontal. |

### 1.2 Contradicciones, Redundancias y Limitaciones Detectadas entre Skills (y cómo se resolvieron)

1. **Contradicción entre espectáculo de scroll (`cinematic-scroll-storytelling` / `build-awwwards-quality-sites`) y contención funcional (`emil-design-eng` / `animate`):**
   - *Conflicto:* `cinematic-scroll-storytelling` sugiere *preloaders* a pantalla completa (`1.4s`), texto dividido palabra por palabra con desenfoque (`0.95s`) y secciones fijadas (*pinned scrub*), mientras que las skills de Emil Kowalski advierten que las animaciones lentas o frecuentes entorpecen la tarea del usuario.
   - *Resolución de diseño para El Rescate:* Tratándose de una organización donde personas inmigrantes pueden acudir buscando orientación urgente, **se prohíbe cualquier *preloader* bloqueante**. Aplicamos estrictamente las reglas de Emil Kowalski (`140–280ms`, `cubic-bezier(0.23, 1, 0.32, 1)`) al **Header, selector de idioma, botones y menú móvil**, y reservamos la coreografía cinematográfica de **GSAP (`0.9s` no bloqueante) + paralaje multicapa** exclusivamente para la escenografía editorial del **Hero**.
2. **Contradicción sobre marcadores numerados y flechas en botones (`frontend-design` vs. convenciones usadas en V1):**
   - *Conflicto:* `frontend-design` advierte explícitamente contra los tics típicos de plantillas generadas por IA: numerar tarjetas con `01 / 02 / 03` cuando no son pasos secuenciales y añadir `→` al final de todos los botones. La versión V1 caía en ambos patrones.
   - *Resolución en V2:* Se eliminaron por completo las 3 tarjetas inferiores numeradas de V1 y las flechas repetitivas en los botones. Los botones V2 usan acentos arquitectónicos (barra vertical ámbar `#E8A04A` de `6px` en el CTA primario y subrayado editorial en el secundario), mientras que la numeración se reserva exclusivamente como índice editorial discreto en el menú de navegación (`01 Nosotros` … `05 Contacto`).
3. **Redundancia entre `animate`, `emil-design-eng` y `find-animation-opportunities`:**
   - Las tres comparten la misma tabla de curvas (`--ease-out`, `--ease-in-out`, `--ease-drawer`) y el mismo filtro de frecuencia. Se consolidaron como un único estándar de microinteracciones.

---

## 2. Dirección Artística V2: «Crónica Viva en Tres Planos» (70 % Editorial / 30 % Inmersivo)

### 2.1 Diagnóstico Crítico de la Propuesta V1
La primera propuesta (`10:2`) cumplía los requisitos funcionales, pero visualmente resultaba convencional por tres razones estructurales:
1. **Partición predecible 50/50:** Texto encerrado en la mitad izquierda y fotografía confinada en la mitad derecha sobre un único color de fondo uniforme (`#F7F6F2`).
2. **Fotografía domesticada en tarjetas:** Las imágenes parecían componentes de interfaz dentro de cajas con bordes redondeados, perdiendo fuerza documental.
3. **Exceso de rectángulos:** La franja inferior de 3 tarjetas horizontales (`01`, `02`, `03`) convertía el Hero en un *template* institucional estándar.

### 2.2 Principios Extraídos de las Referencias (Sin Copiar su Identidad)
- **De *DeepBook v2* (70 % — Arquitectura Editorial):**
  - Retícula arquitectónica visible mediante líneas de `1px` (`#DCE5EE`) que estructuran el lienzo como un pliego editorial contemporáneo.
  - Tipografía *display* protagonista (`Manrope ExtraBold`, `72px`) dispuesta con sangrías asimétricas escalonadas que rompen el eje vertical e invaden la zona visual.
  - Contraste dramático de bloques: el lienzo cálido `#F7F6F2` choca limpiamente en `x = 820px` contra un **monolito arquitectónico en azul profundo (`#173B63`)**.
- **De *Organimo / Unseen* (30 % — Profundidad Espacial y Materia Fotográfica):**
  - Construcción en **3 planos de profundidad reales sobre el eje Z**:
    - **Plano Z-1 (Fondo de inmersión):** Monolito `#173B63` grabado sutilmente (`10%` de opacidad) con una filigrana geométrica inspirada en el códice mesoamericano del logotipo oficial de El Rescate, acompañado de un marco desplazado en perspectiva (`#102A46` con borde `#E8A04A`).
    - **Plano Z-2 (Fotografía documental protagonista de gran formato):** Lienzo fotográfico de `604 × 580 px` que **cabalga la frontera** entre el bloque oscuro y el papel cálido, proyectando una sombra direccional profunda (`dx=-12, dy=28, blur=28`).
    - **Plano Z-3 (Recorte documental en primer plano + Hilo de Memoria):** Segunda fotografía documental (`332 × 214 px`) que se superpone en la esquina inferior izquierda del Plano Z-2 y se adentra en la zona editorial, unida físicamente al titular y a la placa de trayectoria mediante el **«Hilo Narrativo: 1981 → Comunidad Hoy»** en ámbar `#E8A04A`.

---

## 3. Comparación de Dos Conceptos Visuales (Concepto A vs. Concepto B)

En el tablero `15:2` de Figma se construyeron y compararon dos caminos visuales antes de desarrollar la propuesta final:

| Criterio | Propuesta V1 (Anterior — Nodo `10:2`) | Concepto A: «Monolito Documental Oscuro» (Nodo `15:54`) | Concepto B: «Crónica Viva en Tres Planos» (Nodo `15:83` — **Seleccionado ★**) |
| :--- | :--- | :--- | :--- |
| **Tesis compositiva** | Dos columnas simétricas 50/50 sobre fondo claro uniforme + 3 tarjetas inferiores. | Dominancia oscura (`65%` del Hero en `#173B63`) con titular blanco/ámbar y una gran ventana fotográfica a la derecha. | **Lienzo asimétrico dividido (`57%` papel cálido `#F7F6F2` / `43%` monolito `#173B63`) donde el titular de `72px` y las dos capas fotográficas cruzan la costura.** |
| **Protagonismo fotográfico** | Medio — fotos contenidas dentro de tarjetas redondeadas. | Alto en tamaño (`468 × 368 px`), pero en un único plano plano. | **Sobresaliente — gran formato (`604 × 580 px`) + segundo plano superpuesto (`332 × 214 px`) con marco en perspectiva.** |
| **Jerarquía tipográfica** | Correcta pero estática (alineada a un solo margen izquierdo). | Impactante por contraste blanco sobre azul oscuro, pero convencional en alineación. | **Editorial de autor: 3 niveles escalonados (`72px`) donde el tercer renglón («con oportunidades.») monta sobre su propio plinto `#173B63`.** |
| **Profundidad y potencial 3D** | Bajo. | Medio (desplazamiento simple). | **Alto: 3 planos Z diferenciados listos para paralaje diferencial (`data-speed`) y *Depth-Map Shader* en Three.js.** |
| **Calidez humana vs. autoridad** | Cercana pero genérica. | Muy solemne; el exceso de azul oscuro reduce la calidez comunitaria. | **Equilibrio óptimo: el papel cálido `#F7F6F2` recibe al visitante con cercanía humana y el monolito `#173B63` aporta respaldo institucional.** |
| **Traducción a Mobile (`390px`)** | Apilamiento simple. | Excesivamente oscuro en pantallas pequeñas. | **Coreografía vertical dinámica: el titular solapa el bloque oscuro central y las dos fotografías mantienen su superposición en eje Z.** |

---

## 4. Propuesta Seleccionada Desarrollada en Desktop (`1440 px`), Mobile (`390 px`) y Menú Móvil (`390 px`)

### 4.1 Rediseño del Header V2
- **En Desktop (`1440 px`, Nodo `15:191`):**
  - En lugar de una barra blanca genérica de extremo a extremo, el Header V2 **dialoga con la división arquitectónica del lienzo**:
  - **Plinto del logotipo (`15:192`):** A la izquierda (`x=56`), una placa arquitectónica blanca (`290 × 72 px`) con filete lateral ámbar (`#E8A04A`) aloja el **logotipo PNG oficial intacto (`15:194`, `264 × 50 px`, `scaleMode: "FIT"`)**, enmarcando con elegancia su pastilla azul real `#254087`.
  - **Navegación editorial indexada (`15:195`):** Sobre el papel cálido `#F7F6F2`, los 5 enlaces requeridos (`01 Nosotros`, `02 Servicios`, `03 Comunidad`, `04 Historia`, `05 Contacto`) incorporan micro-índices tipográficos en `Manrope` y una barra activa ámbar bajo `Nosotros`.
  - **Zona de utilidad sobre el monolito oscuro (`15:207`):** Al cruzar `x=820` hacia el bloque `#173B63`, el selector bilingüe `ES / EN` (`15:208`) y el CTA principal **`Solicitar orientación`** (`15:212`, en ámbar `#E8A04A` con texto `#173B63`) destacan con máximo contraste y prioridad visual, acompañados del micro-indicador `ATENCIÓN Comunitaria LA`.
- **En Mobile (`390 px`, Nodo `15:293`) y Menú Móvil Desplegado (`390 px`, Nodo `15:341`):**
  - El Header móvil conserva el plinto blanco con el logotipo oficial (`15:298`, `176 × 33 px`), el conmutador compacto `ES | EN` y un botón de menú táctil de `50 × 48 px` (`#173B63`) con tres trazos asimétricos (el central en `#E8A04A`).
  - Al abrirse (`15:341`), el **Menú Móvil V2** despliega un *overlay* arquitectónico en azul profundo `#173B63` con líneas de retícula expuestas, los 5 ítems en escala editorial (`Manrope Bold 30px`) con numeración `01–05`, el selector `Español (ES) / English (EN)` a ancho completo y el CTA prominente `Solicitar orientación` (`#E8A04A`).

### 4.2 Rediseño del Hero V2
- **En Desktop (`1440 × 1060 px`, Nodo `15:171`):**
  - **Titular protagonista escalonado (`15:253`):**
    - Renglón 1 (`x=80`): `Una comunidad` (`Manrope ExtraBold 72px`, `#173B63`).
    - Renglón 2 (`x=140`, precedido por pleca editorial ámbar `#E8A04A`): `más fuerte comienza`, cruzando hacia la frontera de la fotografía protagonista.
    - Renglón 3 (`x=132`): `con oportunidades.` en blanco `#FFFFFF` con punto final en `#E8A04A`, montado sobre su propio plinto `#173B63` que conecta visualmente con el bloque fotográfico.
  - **Escenografía fotográfica multicapa (`15:217`) y conexión narrativa (`15:245`):**
    - **Plano Z-1.5 (`15:218`):** Marco arquitectónico en perspectiva (`#102A46` con filete `#E8A04A`).
    - **Plano Z-2 (`15:221`):** Fotografía documental de gran formato (`604 × 580 px`) que rompe la costura `x=820`.
    - **Plano Z-3 (`15:232`):** Segunda capa documental (`332 × 214 px`) superpuesta en el cuadrante inferior central.
    - **Hilo Narrativo (`15:245`) y Placa de Trayectoria (`15:236`):** Un conector vectorial en `#E8A04A` enlaza la pleca del titular con el Plano Z-3 y con la placa oscura *«TRAYECTORIA COMUNITARIA • DESDE 1981: Un refugio de dignidad, orientación y acompañamiento en el corazón de Los Ángeles»*.
  - **Bloque de lectura y CTAs (`15:263`, `15:269`):** Texto breve y humano (`max-width: 460px`), seguido del CTA primario `Conoce nuestros servicios` (`#173B63` con acento lateral `#E8A04A`) y el CTA secundario `Quiénes somos` (`#EAF1F6` con subrayado `#E8A04A`).
  - **Índice editorial e invitación al scroll (`15:278`):** Reemplaza las antiguas 3 tarjetas por una línea editorial limpia (`Orientación e Información • Acompañamiento Familiar • Memoria y Cultura Comunitaria`) y un indicador de desplazamiento vertical.
- **En Mobile (`390 × 1060 px`, Nodo `15:290`):**
  - Reorganizado específicamente para lectura vertical: el titular escalonado (`40px / 38px`) culmina en el plinto `#173B63` (`oportunidades.`), que se funde con el bloque oscuro lateral (`x=84..390`). La fotografía principal (`330 × 306 px`, `15:318`) y la secundaria superpuesta (`184 × 114 px`, `15:322`) preservan la sensación tridimensional antes de entregar el párrafo de apoyo y los tres botones en la zona natural del pulgar (*thumb zone*).

---

## 5. Recursos Visuales Utilizados y Gobernanza de Contenido

| Recurso | Archivo Local / Nodo en Figma | Naturaleza y Estado de Validación | Acción Requerida Antes de Producción |
| :--- | :--- | :--- | :--- |
| **Logotipo oficial de El Rescate** | `assets/logo-el-rescate-oficial.png`<br>Nodos `15:62`, `15:95`, `15:194`, `15:298`, `15:346` | **OFICIAL CONFIRMADO.** PNG RGBA original (`970 × 184 px`, ratio `5.2717:1`, pastilla `#254087`). Inyectado sin recortar, redibujar ni alterar colores (`scaleMode: "FIT"`). | Ninguna (solicitar versión `.svg` vectorial únicamente si se desea optimización de peso en código). |
| **Fotografía Documental Plano Z-2 (Principal)** | `assets/provisional-documentary-la-placita.jpg`<br>Nodos `15:66`, `15:99`, `15:221`, `15:318` | **RECURSO PROVISIONAL TEMPORAL.** Fotografía documental de dominio público / CC (Wikimedia Commons: comunidad latina en La Placita / Olvera Street, Los Ángeles). | **Reemplazar obligatoriamente** por fotografía documental autorizada del archivo real de El Rescate. Etiquetada explícitamente en el diseño (`15:223`, `15:320`). |
| **Fotografía Documental Plano Z-3 (Secundaria)** | `assets/provisional-documentary-macarthur-park.jpg`<br>Nodos `15:100`, `15:232`, `15:322` | **RECURSO PROVISIONAL TEMPORAL.** Fotografía documental (Wikimedia Commons: entorno comunitario de Westlake / MacArthur Park, Los Ángeles). | **Reemplazar obligatoriamente** por fotografía propia de actividades comunitarias o fachada histórica de El Rescate. |
| **Titular y textos de apoyo** | Nodos `15:257`–`15:268`, `15:239`–`15:244` | **PROPUESTA DE COPY INICIAL.** Titular *«Una comunidad más fuerte comienza con oportunidades.»* y texto descriptivo sin estadísticas ni promesas inventadas. | Validar copy definitivo con la dirección ejecutiva/comunicación de El Rescate. |

---

## 6. Plan de Implementación Frontend: Movimiento (GSAP) y Experiencia 3D (Three.js / WebGL)

Cada efecto visual se clasifica en 4 niveles técnicos claramente diferenciados (documentados también en el Bloque 9 de Figma, nodo `15:386`):

### Nivel 1 — Profundidad Simulada Directamente en Figma (Estática)
- **Superposición de 3 planos espaciales (Z-1, Z-2, Z-3)** que cruzan la frontera cromática `x = 820px` entre `#F7F6F2` y `#173B63`.
- **Sombras direccionales compuestas (`shadow-deep` y `shadow-float`)** tintadas en azul noche `#0B1F36` (`34%` y `28%` de opacidad) que proyectan la elevación del Plano Z-2 sobre el monolito oscuro y del Plano Z-3 sobre el lienzo claro.
- **Marco desplazado en perspectiva (`Plane Z-1.5`)** y filigrana lineal inspirada en el códice del logotipo al `10%` de opacidad sobre el bloque `#173B63`.

### Nivel 2 — Animaciones Prototipables en Figma (*Smart Animate*)
- **Apertura y cierre del Menú Móvil (`15:290` ⇄ `15:341`):** Transición *Smart Animate* con curva de cajón iOS `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` y duración de `280ms`.
- **Conmutador bilingüe `ES / EN`:** Deslizamiento horizontal de la pastilla ámbar `#E8A04A` en `180ms` con `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- **Microinteracciones de botones y enlaces:** Subrayado editorial progresivo en navegación (`180ms`) y compresión táctil `:active` a `scale(0.97)` en `140ms`.

### Nivel 3 — Interacciones que Requieren Desarrollo Frontend (`GSAP` + `ScrollTrigger` + `Lenis`)
- **Motor único de *Smooth Scroll* (`Lenis`):** Inicializado una sola vez en escritorio y conectado a `ScrollTrigger.update` mediante `gsap.ticker.add`. Se desactiva automáticamente en pantallas táctiles y bajo `prefers-reduced-motion: reduce`.
- **Coreografía de entrada del Hero (`gsap.timeline()` de `1.05s`, sin *preloader* bloqueante):**
  1. `t = 0.00s`: El contenedor fotográfico principal (**Plano Z-2**) se revela de abajo hacia arriba mediante `clip-path: inset(100% 0% 0% 0%)` → `inset(0% 0% 0% 0%)` (`duration: 0.9s, ease: "power3.out"`), mientras la imagen interna pasa de `scale(1.08)` a `scale(1.0)`.
  2. `t = 0.12s`: Entrada escalonada de los **3 niveles del titular** (`y: 28 → 0, autoAlpha: 0 → 1, stagger: 0.07s, duration: 0.65s, ease: "power3.out"`).
  3. `t = 0.28s`: Emergencia del **Plano Z-3** (`y: 36 → 0, scale: 0.96 → 1, autoAlpha: 0 → 1`) sincronizada con la animación `stroke-dashoffset` que dibuja el **«Hilo Narrativo: 1981 → Comunidad Hoy»** en ámbar `#E8A04A`.
- **Paralaje diferencial en Scroll (`ScrollTrigger` con `scrub: 0.6`):**
  - **Plano Z-1 (Monolito y filigrana códice):** `data-speed="0.92"` (anclaje profundo).
  - **Plano Z-2 (Fotografía protagonista):** `data-speed="1.06"`.
  - **Plano Z-3 (Fotografía superpuesta en primer plano):** `data-speed="1.18"` (mayor desplazamiento relativo, acentuando la separación tridimensional al hacer scroll hacia la siguiente sección).

### Nivel 4 — Efectos 3D que Realmente Justifican WebGL (`Three.js` / `React Three Fiber`)
- **Justificación conceptual (*Lane A: Subtle Depth Field*):** Un sitio comunitario como El Rescate no debe mostrar esferas metálicas ni partículas abstractas. WebGL se justifica **exclusivamente** para dotar de relieve espacial orgánico a la fotografía documental del **Plano Z-2** (inspirado en *Organimo*).
- **Implementación técnica:**
  - Un único `THREE.Mesh` con `PlaneGeometry` sobre el contenedor del Plano Z-2 y un `ShaderMaterial` ligero que recibe dos texturas: la fotografía documental (`uTexture`) y su mapa de profundidad en escala de grises (`uDepthMap`).
  - Al mover el cursor en escritorio (solo cuando `@media (hover: hover) and (pointer: fine)` se cumple), el *fragment shader* aplica un desplazamiento UV proporcional a `uDepthMap` con interpolación amortiguada (`lerp: 0.06`, inclinación equivalente máxima de `±1.8°`), separando sutilmente a las personas en primer término respecto a la arquitectura del fondo.
- **Rendimiento y Accesibilidad (`prefers-reduced-motion`):**
  - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
  - `IntersectionObserver` detiene el bucle `requestAnimationFrame` en cuanto el Hero sale del viewport, y `dispose()` libera geometría, material y texturas al desmontar.
  - En dispositivos móviles o cuando `window.matchMedia('(prefers-reduced-motion: reduce)').matches` es verdadero, el componente WebGL no se instancia y se renderiza directamente el elemento `<img>` nativo con `srcset` estático.

---

## 7. Limitaciones Encontradas en Figma y sus Permisos (Reporte Transparente)

1. **Estado de permisos de la cuenta MCP (`whoami`):**
   - El servidor MCP autenticado (`figma_figma`) reporta el usuario `Javier Gomez` en el equipo `El equipo de Javier Gomez` con **`"seat": "View"`** sobre el plan **`"tier": "starter"`**.
   - Debido a este permiso de asiento `View`, la herramienta `use_figma` (ejecución directa de la Plugin API de Figma para crear componentes nativos, variables o activar `layoutMode`) no está expuesta en la sesión, y `create_generative_plugin` devuelve error de permisos (`You don't seem to have permission to do that`).
2. **Qué se realizó directamente en Figma dentro de los permisos actuales:**
   - Mediante `upload_assets`, se importó directamente en el lienzo de la página `0:1` (sin tocar las etapas previas `2:2`, `6:2` ni `10:2`) la sección completa **`03 — Art Direction & Hero Redesign V2`** (nodo raíz `15:2`, `4320 × 3280 px`), preservando **más de 380 nodos editables** (`<frame>`, `<vector>`, `<text>`) organizados semánticamente en los **9 bloques solicitados**.
   - Posteriormente, se inspeccionaron con `get_metadata` los IDs exactos de los rectángulos de imagen dentro de `15:2` y se inyectaron mediante llamadas adicionales a `upload_assets` tanto el **archivo binario PNG original del logotipo de El Rescate** (`scaleMode: "FIT"` en los nodos `15:62`, `15:95`, `15:194`, `15:298`, `15:346`) como las **fotografías documentales provisionales de alta resolución** (`scaleMode: "FILL"` en los nodos `15:66`, `15:99`, `15:100`, `15:221`, `15:232`, `15:318`, `15:322`).
3. **Qué requiere un asiento con permisos de edición (`Full/Edit`) en Figma:**
   - Convertir los marcos del Header V2 y botones en `ComponentSet` nativos, activar la propiedad nativa de *Auto Layout* (`Shift + A`) sobre los frames importados y mover el tablero `15:2` a una página independiente en el panel lateral de páginas (automatizado en `figma-console-setup.js`).

---

## 8. Justificación: Por Qué la Propuesta V2 Supera Visualmente a la Primera Versión (Control de Calidad — Sección 11)

1. **¿Tiene una identidad visual reconocible y no podría confundirse con una plantilla institucional genérica?**
   - **Sí.** Mientras V1 utilizaba el esquema universal de dos columnas 50/50 sobre fondo claro con tres tarjetas debajo, V2 introduce una arquitectura asimétrica de autor: el choque entre el papel editorial cálido (`#F7F6F2`) y el monolito azul profundo (`#173B63`) grabado con la geometría del códice mesoamericano de El Rescate crea una firma visual propia e irrepetible.
2. **¿La fotografía tiene protagonismo real y existe profundidad visual perceptible?**
   - **Sí.** La fotografía principal pasa de estar encerrada en una tarjeta lateral a convertirse en un lienzo de gran formato (`604 × 580 px`) que rompe la costura central del diseño, respaldado por un marco en perspectiva (Plano Z-1.5) y superpuesto en primer término por una segunda fotografía documental (Plano Z-3, `332 × 214 px`).
3. **¿La tipografía tiene una jerarquía editorial clara y personalidad?**
   - **Sí.** El titular en `Manrope ExtraBold 72px` abandona la alineación rígida de bloque para adoptar una composición escalonada de tres niveles que avanza hacia la fotografía y culmina sobre su propio plinto de alto contraste (`con oportunidades.`).
4. **¿El diseño tiene potencial real para convertirse en una experiencia interactiva y conserva su impacto en móvil?**
   - **Sí.** Cada plano Z (`Z-1`, `Z-2`, `Z-3`) y el *Hilo Narrativo* (`15:245`) han sido diseñados con separación espacial real para responder al scroll (`GSAP ScrollTrigger`) y al desplazamiento de profundidad (`Three.js Depth-Map Shader`). En `390px` (`15:290`), la composición no se limita a apilar cajas: mantiene el plinto tipográfico, la banda de inmersión `#173B63` y la doble capa fotográfica superpuesta.
5. **¿Respeta la identidad y el propósito de El Rescate?**
   - **Sí.** Conserva intacto el logotipo oficial PNG, respeta la paleta y tipografías de *Foundations*, mantiene una lectura clara y accesible para quien busca orientación (`Solicitar orientación` siempre visible en ámbar `#E8A04A`), no inventa cifras ni promesas institucionales, e identifica con total rigor ético las fotografías documentales provisionales.
