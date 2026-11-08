# Informe de Inspección Visual Verificable y Extracción Técnica (Tablero V2 — El Rescate) para Transferencia a ChatGPT

> [!NOTE]
> **Propósito de este documento:** Transferir a otro modelo (ChatGPT) una radiografía **100 % verificable, sin adornos promocionales y con distinción estricta entre datos extraídos del árbol de nodos y hallazgos de inspección visual sobre los píxeles renderizados**.
> - **Archivo de Figma:** `El Rescate — Rediseño Web & Design System` (`fileKey: VGktR37ZboN18jlZNoftLu`)
> - **Tablero inspeccionado:** `03 — Art Direction & Hero Redesign V2` — **Nodo raíz `15:2`** (`x=11656, y=-14, width=4320, height=3280`)
> - **Frames auditados:**
>   1. **Desktop (`1440 × 1060 px`):** Nodo `15:171` (`Artboard / Home V2 — Desktop 1440px`)
>   2. **Mobile (`390 × 1060 px`):** Nodo `15:290` (`Artboard / Home V2 — Mobile 390px`)
>   3. **Mobile Menu (`390 × 860 px`):** Nodo `15:341` (`Artboard / Mobile Menu Open V2 — 390px`)
> - **Archivos SVG independientes generados (sin modificar el diseño):**
>   - Desktop (`15:171`): [frame_15_171_desktop_1440.svg](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_171_desktop_1440.svg) | [frame_15_171_desktop_1440.svg.txt](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_171_desktop_1440.svg.txt) (`19,220 bytes`)
>   - Mobile (`15:290`): [frame_15_290_mobile_390.svg](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_290_mobile_390.svg) | [frame_15_290_mobile_390.svg.txt](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_290_mobile_390.svg.txt) (`8,164 bytes`)
>   - Mobile Menu (`15:341`): [frame_15_341_mobile_menu_390.svg](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_341_mobile_menu_390.svg) | [frame_15_341_mobile_menu_390.svg.txt](file:///c:/Users/Gwentakill/Documents/mockup%20el%20rescate/exports_v2/frame_15_341_mobile_menu_390.svg.txt) (`6,958 bytes`)

---

## 1. Metodología y Alcance de los Datos Extraídos

Para evitar cualquier invención de propiedades, este informe separa dos fuentes de evidencia:

1. **[DATOS EXTRAÍDOS]:** Coordenadas `(x, y)`, dimensiones `(width, height)`, jerarquía e identificadores de nodo (`15:...`) obtenidos de la herramienta `get_metadata` de Figma, combinados con las propiedades exactas de estilo (`fill`, `stroke`, `font-family`, `font-size`, `font-weight`, `letter-spacing`, `rx`, `filter`, `opacity`) definidas en el código SVG importado en Figma y los hashes de imagen devueltos por `upload_assets`.
   - *Nota técnica sobre el contenedor en Figma:* Debido a que la cuenta conectada tiene permiso `"seat": "View"` (`starter`), el tablero `15:2` fue creado importando un árbol vectorial SVG editable + inyección binaria de imágenes PNG/JPEG (`upload_assets`). Por tanto, los nodos en Figma son `FRAME`, `VECTOR` y `TEXT` con posicionamiento explícito `(x, y)` (no tienen `layoutMode: "HORIZONTAL" | "VERTICAL"` nativo de Auto Layout activado). Además, al solicitar `download_assets` adicional en este turno, el servidor MCP reportó el límite de llamadas del plan Starter (`You've reached the Figma MCP tool call limit on the Starter plan`), por lo que los SVG independientes se extrajeron directamente de los subárboles exactos que generaron los nodos `15:171`, `15:290` y `15:341`.
2. **[INSPECCIÓN VISUAL POR VISIÓN]:** Observación directa de los píxeles en las capturas renderizadas por Figma (`get_screenshot`) de `15:171` (`1440 × 1060 px`), `15:290` (`392 × 1062 px`) y `15:341` (`392 × 862 px`). Esto permite detectar colisiones reales entre textos e imágenes que no son evidentes leyendo únicamente nombres de capas.

---

## 2. Inspección Visual y Extracción Técnica — Frame 1: Desktop (`15:171`)

![Render real de Figma del nodo 15:171 (Desktop 1440x1060)](/Users/Gwentakill/.gemini/antigravity/brain/54873d3c-3565-49d6-bda3-119823f5aaa8/v2_desktop_1440_figma.png)

### 2.1 Descripción Precisa de la Composición Visual (`1440 × 1060 px`)

- **[DATOS EXTRAÍDOS — Partición del lienzo]:**
  - El lienzo de `1440 × 1060 px` está dividido verticalmente de forma asimétrica en **`x = 820 px`** (proporción horizontal **56.94 % izquierda / 43.06 % derecha**):
    - **Zona izquierda (`x = 0..820`, ancho `820 px`):** Fondo cálido color papel `#F7F6F2` (`15:172`).
    - **Zona derecha (`x = 820..1440`, ancho `620 px`):** Bloque vertical oscuro a sangre completa (`height = 1060 px`) con gradiente lineal de `#173B63` a `#0F2947` (`15:173`).
    - **Costura vertical:** Una línea vertical continua de `1.5 px` en color ámbar `#E8A04A` (`15:183`) recorre de `y = 0` a `y = 1060` exactamente en `x = 820`.
    - **Retícula editorial expuesta (`15:180`):** Línea vertical continua `#DCE5EE` (`1 px`) en `x = 56`; línea vertical discontinua (`stroke-dasharray="4 6"`, `#DCE5EE`) en `x = 438` (desde `y = 116` hasta `y = 1060`); línea horizontal continua en `y = 116` que separa el Header del Hero (`#DCE5EE` en el tramo claro `x = 0..820` y `#245B87` en el tramo oscuro `x = 820..1440`).
    - **Marca de agua geométrica (`15:174`):** En el interior del bloque oscuro derecho (`x = 880..1400, y = 130..990`), dos marcos rectangulares concéntricos, una cruz axial y dos círculos (`r = 140` y `r = 92`) trazados en `#EAF1F6` al `10 %` de opacidad.

- **[INSPECCIÓN VISUAL — Header (`y = 0..116 px`, nodo `15:191`)]:**
  - El Header no tiene una barra de fondo propia de extremo a extremo; sus elementos flotan directamente sobre la partición `#F7F6F2` (izquierda) y `#173B63` (derecha), delimitados abajo por la línea `y = 116`.
  - **Izquierda (`x = 56..346, y = 22..94`):** Una tarjeta blanca rectangular (`290 × 72 px`, radio `6 px`, borde `#D5E0EA`, filete izquierdo ámbar `#E8A04A` de `4 px` de ancho y sombra suave) actúa como soporte o plinto sobre el cual se muestra el **logotipo PNG oficial de El Rescate** (`264 × 50 px` en `x = 72, y = 33`). Visualmente, el logotipo mantiene intacto su bloque azul real `#254087` con el glifo mesoamericano blanco a la izquierda y las letras caligráficas blancas *"el rescate"*, rodeado por un margen blanco uniforme de ~`11–13 px` dentro del plinto.
  - **Centro-izquierda (`x = 384..808, y = 40..78.5`):** Los 5 ítems de navegación (`Nosotros`, `Servicios`, `Comunidad`, `Historia`, `Contacto`) se alinean horizontalmente sobre el fondo `#F7F6F2`. Encima de cada palabra aparece un número índice de dos dígitos (`01` a `05`) en `Manrope 10px`. El primer ítem (`01 Nosotros`) tiene el número en ámbar `#E8A04A`, el texto en `Manrope ExtraBold 15px` `#173B63` y un subrayado ámbar de `66 × 2.5 px`. Los otros cuatro (`02` a `05`) tienen el número en gris azulado `#64748B` y el texto en `Source Sans 3 SemiBold 15px` `#173B63`.
  - **Derecha, sobre el bloque oscuro (`x = 856..1326, y = 34..82`):**
    - Conmutador de idioma (`116 × 48 px`, fondo `#102A46`, borde `#245B87`): mitad izquierda activa con pastilla ámbar `#E8A04A` (`50 × 36 px`) y texto `ES` en `#173B63`; mitad derecha con texto `EN` en `#EAF1F6`.
    - Botón CTA principal `Solicitar orientación` (`236 × 48 px`, radio `6 px`, fondo sólido ámbar `#E8A04A`, texto `#173B63` `Manrope ExtraBold 14px` precedido por un punto circular `#173B63` de `8 px` de diámetro).
    - A la derecha del botón (`x = 1248`), un micro-texto en dos líneas: `ATENCIÓN` (`#E8A04A`, `10px`) / `Comunitaria LA` (`#EAF1F6`, `12px`).

- **[INSPECCIÓN VISUAL — Composición del Hero (`y = 116..1060 px`)]:**
  - **Columna/Zona Tipográfica y de Acción (Izquierda, con cruce hacia el centro):**
    - **Kicker (`x = 80, y = 154`):** Cuadrado ámbar de `10 × 10 px` seguido del texto en mayúsculas `ORGANIZACIÓN COMUNITARIA • LOS ÁNGELES, CALIFORNIA` (`Manrope ExtraBold 12px`, `#173B63`, tracking `1.8px`).
    - **Titular escalonado en 3 niveles (`Manrope ExtraBold 72px / 70px`):**
      - Nivel 1 (`x = 80, y_baseline = 246`, bounding box `y = 174..272, w = 544`): **`Una comunidad`** en `#173B63` sobre el fondo `#F7F6F2`.
      - Nivel 2 (`x = 140, y_baseline = 324`, bounding box `y = 252..350, w = 726`): Precedido a la izquierda por una barra horizontal ámbar (`44 × 6 px` en `x = 80, y = 286`), el texto **`más fuerte comienza`** en `#173B63` se desplaza `60 px` hacia la derecha y **se extiende hasta `x = 866`**, invadiendo `130 px` dentro de la fotografía principal (`x = 736`).
      - Nivel 3 (`x = 148, y_baseline = 402`, bounding box `y = 332..428, w = 664`): El texto **`con oportunidades.`** (`70px`, blanco `#FFFFFF` con el punto final en `#E8A04A`) descansa sobre un rectángulo azul profundo `#173B63` (`648 × 78 px` en `x = 132..780, y = 344..422`).
    - **Nota de gobernanza tipográfica (`x = 140, y = 442`):** Texto en cursiva gris `#64748B` (`12px`): `[Propuesta de titular editorial — Sujeto a confirmación institucional de El Rescate]`.
    - **Párrafo de apoyo (`x = 108, y = 455..593`, ancho `460 px`):** Dos bloques de texto en `Source Sans 3`: primero dos líneas en `19px SemiBold #173B63` (*"Desde 1981 caminamos junto a la población inmigrante / latina en Los Ángeles."*) y debajo tres líneas en `17px Regular #245B87` (*"Facilitamos orientación confiable, recursos comunitarios y un / espacio seguro donde cada persona y familia puede construir / su futuro con dignidad y respaldo humano."*).
    - **Grupo de botones CTA (`x = 108, y = 612..668`):**
      - Botón primario `Conoce nuestros servicios` (`264 × 56 px`, fondo `#173B63`, barra lateral izquierda `#E8A04A` de `6 × 56 px`, texto blanco `Manrope ExtraBold 16px`).
      - Botón secundario `Quiénes somos` (`164 × 56 px` en `x = 392..556, y = 612..668`, fondo azul pálido `#EAF1F6`, borde `#245B87` de `1.5px`, texto `#173B63` `Manrope Bold 16px` con línea inferior ámbar `#E8A04A` de `112 × 2 px`).
    - **Pie izquierdo de ejes e invitación al scroll (`x = 80, y = 888..1016`):** Línea divisoria `#D5E0EA` de `700 px`, título `EJES DE ACCIÓN COMUNITARIA` (`12px #173B63`), línea de texto separada por viñetas (`Orientación e Información • Acompañamiento Familiar • Memoria y Cultura Comunitaria` en `15px #245B87`) e icono de ratón (`28 × 44 px`, punto ámbar) junto a `DESPLAZA PARA EXPLORAR LA HISTORIA`.
  - **Zona Escenográfica Multicapa (Centro-Derecha, `x = 492..1384, y = 168..992`):**
    - **Plano Z-1.5 (Marco trasero en perspectiva, `15:218`):** Rectángulo `600 × 580 px` en `x = 768, y = 196` (relleno `#102A46`, borde `#E8A04A` de `1.5px`), desplazado `+26 px` a la derecha y `+22 px` hacia abajo respecto a la foto principal.
    - **Plano Z-2 (Fotografía documental principal, `15:219`):** Marco exterior `#F7F6F2` de `616 × 592 px` (`x = 736, y = 168`) con sombra profunda (`dx=-12, dy=28, stdDeviation=28`), que contiene la imagen de **La Placita / Olvera Street (`604 × 580 px`, `x = 742, y = 174`)** con un *overlay* de viñeta vertical (`#0D223A` de `18 %` arriba a `72 %` abajo). En su esquina superior izquierda (`x = 762, y = 194`) lleva una etiqueta oscura (`464 × 32 px`, `#173B63` al `92 %` con borde `#E8A04A`) con el texto `RECURSO PROVISIONAL (WIKIMEDIA: LA PLACITA, LOS ÁNGELES) • NO OFICIAL`.
    - **Plano Z-3 (Fotografía documental secundaria superpuesta, `15:230`):** Contenedor de `348 × 268 px` en **`x = 492..840, y = 564..832`** (fondo `#173B63`, borde `#E8A04A` de `2px`, sombra flotante), con la fotografía de **MacArthur Park / Westlake (`332 × 214 px`, `x = 500, y = 572`)** y una franja de pie de foto de `332 × 46 px` abajo (`PLANO Z-3 • WESTLAKE / MACARTHUR PARK (PROVISIONAL)`).
    - **Placa de archivo institucional (`15:236`, `Plane Z-3B`):** En la esquina inferior derecha sobre el monolito oscuro (`x = 868..1384, y = 796..992`, `516 × 196 px`), caja `#102A46` con borde `#245B87` y barra izquierda `#E8A04A` (`6 px`), titulada `TRAYECTORIA COMUNITARIA • DESDE 1981` / `Un refugio de dignidad, orientación y acompañamiento en el corazón de Los Ángeles.`

---

### 2.2 Hallazgos Críticos de Visión en Desktop (`15:171`): Solapamientos y Colisiones Reales

Al inspeccionar los píxeles renderizados en `v2_desktop_1440_figma.png`, se detectan **5 colisiones visuales concretas** provocadas por las coordenadas absolutas de los elementos:

1. **Pérdida de contraste en las letras «za» de `más fuerte comienza` (`15:259` sobre `15:221`):**
   - El renglón 2 del titular está en color azul oscuro `#173B63` sin caja de fondo propia. Cuando cruza el borde de la fotografía principal en `x = 736`, las letras **`za`** (`x = 736..866, y = 252..350`) caen directamente sobre las ramas y hojas oscuras del árbol de la fotografía de La Placita. Visualmente, el contraste cae drásticamente y las letras `za` se confunden con el fondo fotográfico.
2. **Desbordamiento horizontal del texto `con oportunidades.` (`15:261`) fuera de su plinto azul (`15:260`):**
   - El plinto azul `#173B63` (`15:260`) termina en `x = 780` (`x = 132 + width = 648`), pero el texto blanco `con oportunidades.` (`15:261`) se extiende hasta `x = 812` (`x = 148 + width = 664`). Como consecuencia, la mitad derecha de la letra **`s`** (en blanco) y el punto final **`.`** (en ámbar) quedan fuera del rectángulo azul `#173B63`, montándose sobre el marco blanco de la fotografía (`x = 736..742`) y el tronco/cruz de la imagen.
3. **Recorte (oclusión) del pie de foto principal (`15:227`) detrás del contenedor de la foto secundaria (`15:230`):**
   - El texto `PLANO DOCUMENTAL 01 — COMUNIDAD LATINA EN LOS ÁNGELES` / `Fotografía documental de referencia espacial...` (`15:227`) inicia en **`x = 766, y = 706`**. Sin embargo, el contenedor de la foto secundaria en primer plano (`15:230`, que está por encima en el orden de apilamiento Z) ocupa de **`x = 492` a `x = 840`** y de `y = 564` a `y = 832`.
   - En la imagen renderizada, el bloque `15:230` **tapa los primeros `74 px` izquierdos del pie de foto (`x = 766..840`)**, haciendo que se lea literalmente truncado como **`MENTAL 01 — COMUNIDAD LATINA EN LOS ÁNGELES`** y **`cumental de referencia espacial...`**. Además, la línea vertical punteada ámbar del conector (`15:247`, en `x = 896` del tablero / `x = 832` del frame) atraviesa por encima de esas letras.
4. **Solapamiento entre el botón secundario `Quiénes somos` (`15:274`) y la esquina superior izquierda de la foto secundaria (`15:230`):**
   - El contenedor de la foto secundaria (`15:230`) comienza en `x = 492, y = 564`. El botón `Quiénes somos` (`15:274`) ocupa `x = 392..556, y = 612..668` (y como el grupo tipográfico `15:253` se declara después de `15:217` en el SVG, se pinta encima). Visualmente, los últimos **`64 px` derechos del botón `Quiénes somos` (`x = 492..556, y = 612..668`) pisan la esquina superior izquierda de la fotografía de MacArthur Park**. Aunque el botón es legible porque tiene fondo opaco `#EAF1F6`, la intersección de ambas cajas (`64 × 56 px`) se percibe como una colisión accidental de maquetación y no como un solapamiento intencional.
5. **Apretamiento en el margen izquierdo (`15:186` vs. `15:258`):**
   - Los micro-textos `1981 — PRESENTE` y `LOS ÁNGELES, CA` (`x = 20..97, y = 302..334`) quedan muy próximos a la línea vertical de la retícula (`x = 56`) y a la pleca ámbar del segundo renglón del titular (`x = 80, y = 286`), generando una zona de congestión visual a la izquierda de `más fuerte`.

---

## 3. Inspección Visual y Extracción Técnica — Frame 2: Mobile (`15:290`)

![Render real de Figma del nodo 15:290 (Mobile 390x1060)](/Users/Gwentakill/.gemini/antigravity/brain/54873d3c-3565-49d6-bda3-119823f5aaa8/v2_mobile_390_figma.png)

### 3.1 Descripción Precisa de la Composición Visual (`390 × 1060 px`)

- **[DATOS EXTRAÍDOS — Estructura general]:**
  - Ubicado en `x = 1556, y = 1152` del tablero `15:2`, con dimensiones `390 × 1060 px`, fondo `#F7F6F2` y borde `#D5E0EA` (`1.5 px`).
  - **Bloque oscuro de inmersión (`15:292`):** En lugar de dividir la pantalla verticalmente de arriba abajo, presenta un bloque rectangular `#173B63` de **`306 × 432 px`** anclado al borde derecho (`x = 84..390, y = 316..748`), dejando un margen izquierdo de `84 px` en color `#F7F6F2`.
- **[INSPECCIÓN VISUAL — Header Móvil (`y = 0..76 px`, nodo `15:293`)]:**
  - Fondo `#F7F6F2` con línea inferior `#D5E0EA` en `y = 76`.
  - **Plinto del logotipo (`x = 16..210, y = 14..62`, `194 × 48 px`):** Tarjeta blanca con filete izquierdo ámbar (`3 px`) que contiene el logotipo oficial PNG (`176 × 33 px` en `x = 26, y = 21`). Se ve nítido y bien proporcionado.
  - **Selector de idioma (`x = 256..314, y = 18..58`, `58 × 40 px`):** Pastilla `#EAF1F6` con borde `#245B87` (`1 px`), mostrando `ES` en negrita `#173B63` y `EN` en `#64748B`.
  - **Botón de menú (`x = 324..374, y = 14..62`, `50 × 48 px`):** Botón cuadrado redondeado (`rx = 6`) en `#173B63` con tres líneas horizontales (`y = 30, 38, 46`); la línea central es más corta (`18 px` frente a `24 px`) y de color ámbar `#E8A04A`.
- **[INSPECCIÓN VISUAL — Titular Móvil (`y = 98..316 px`, nodo `15:306`)]:**
  - Kicker en `x = 20, y = 98`: cuadrado ámbar `8 × 8 px` + `LOS ÁNGELES • DESDE 1981` (`10px Manrope ExtraBold #173B63`).
  - Titular en 4 renglones (`Manrope ExtraBold`):
    - Renglón 1 (`x = 20, y_baseline = 154`, `40px`): `Una comunidad` (`#173B63`).
    - Renglón 2 (`x = 58, y_baseline = 196`, `38px`): Precedido por barra ámbar (`28 × 4 px` en `x = 20, y = 174`), texto `más fuerte` (`#173B63`).
    - Renglón 3 (`x = 58, y_baseline = 236`, `38px`): `comienza con` (`#173B63`).
    - Renglón 4 (`x = 20, y = 248..296`): Plinto azul `#173B63` de `318 × 48 px` con el texto **`oportunidades.`** (`38px`, blanco con punto final ámbar). A diferencia de Desktop, aquí **el plinto cubre el 100 % de la palabra con ~`22 px` de aire a la derecha**, sin desbordamientos.
  - Nota `[Titular propuesta inicial]` en `x = 20, y = 312` (`11px` cursiva `#64748B`), justo encima del borde superior (`y = 316`) del bloque oscuro `#173B63`.
- **[INSPECCIÓN VISUAL — Escenografía Fotográfica Móvil (`y = 316..748 px`, nodo `15:316`)]:**
  - **Fotografía principal (`15:318`):** Marco blanco `#F7F6F2` de `338 × 314 px` (`x = 36..374, y = 336..650`) con la imagen de La Placita (`330 × 306 px` en `x = 40, y = 340`). Su borde izquierdo (`x = 36`) sobresale `48 px` fuera del bloque oscuro (`x = 84`) hacia el fondo claro `#F7F6F2`. Lleva la etiqueta superior `FOTO PROVISIONAL WIKIMEDIA (LA) • NO INSTITUCIONAL` (`296 × 24 px`).
  - **Fotografía secundaria superpuesta (`15:321` / `15:322`):** En la esquina inferior izquierda (`x = 16..208, y = 576..722`), tarjeta de `192 × 146 px` (`#173B63` con borde `#E8A04A` de `2 px`) que contiene la foto de MacArthur Park (`184 × 114 px`) y el pie `PLANO Z-3 • MACARTHUR PARK`.
  - **Pie lateral sobre fondo oscuro (`x = 220, y = 674..712`):** En el espacio libre del bloque `#173B63` a la derecha de la foto secundaria y debajo de la foto principal, se lee con total claridad `DESDE 1981` (`#E8A04A`) / `Memoria viva y apoyo` / `comunitario en LA.` (`#FFFFFF` / `#EAF1F6`). **No hay ninguna colisión ni texto tapado en móvil.**
- **[INSPECCIÓN VISUAL — Párrafo y Botones Móviles (`y = 772..972 px`, nodo `15:327`)]:**
  - Tres líneas de texto centradas a la izquierda en `x = 20` (`344 px` de ancho): primera línea en `Source Sans 3 SemiBold 16px #173B63` y dos líneas en `15px Regular #245B87`.
  - Botón primario `Conoce nuestros servicios` (`x = 20..370, y = 858..912`, `350 × 54 px`, `#173B63` con barra izquierda `#E8A04A` de `6 px`).
  - Fila inferior de dos botones (`y = 924..972`, altura `48 px` cada uno, separación de `14 px`): a la izquierda `Quiénes somos` (`168 × 48 px`, `#EAF1F6` con borde `#245B87`) y a la derecha `Solicitar orientación` (`168 × 48 px`, fondo `#E8A04A` con texto `#173B63`).

---

## 4. Inspección Visual y Extracción Técnica — Frame 3: Mobile Menu (`15:341`)

![Render real de Figma del nodo 15:341 (Mobile Menu 390x860)](/Users/Gwentakill/.gemini/antigravity/brain/54873d3c-3565-49d6-bda3-119823f5aaa8/v2_mobile_menu_390_figma.png)

### 4.1 Descripción Precisa de la Composición Visual (`390 × 860 px`)

- **[DATOS EXTRAÍDOS — Contenedor]:**
  - Ubicado en `x = 1988, y = 1152` del tablero `15:2`, dimensiones `390 × 860 px`, fondo `#173B63` (`rx = 8`) con borde perimetral `#E8A04A` (`1.5 px`).
  - Líneas arquitectónicas internas en `#245B87` (`1 px`): una línea horizontal en `y = 76` (de `x = 0` a `x = 390`) y una línea vertical de margen izquierdo en `x = 24` (de `y = 76` a `y = 860`).
- **[INSPECCIÓN VISUAL — Elementos internos]:**
  - **Cabecera del cajón (`y = 0..76 px`):** Plinto blanco (`194 × 48 px` en `x = 16, y = 14`) con el logotipo oficial PNG (`176 × 33 px` en `x = 25, y = 21`) y botón de cierre a la derecha (`50 × 48 px` en `x = 324, y = 14`, fondo `#102A46`, borde `#E8A04A` de `1.5 px` e icono `×` de `20 × 20 px` en `#E8A04A`).
  - **Lista de navegación (`x = 36..354, y = 107..508`, nodo `15:350`):**
    - Encabezado `NAVEGACIÓN PRINCIPAL` (`11px Manrope ExtraBold #E8A04A`, tracking `1.6px`).
    - 5 filas de `56 px` de alto separadas cada `76 px` (`y_offset = 32, 108, 184, 260, 336` respecto a `y = 118`), cada una con una línea inferior `#245B87` de `318 px` de ancho:
      - `01` (`12px #E8A04A`) + `Nosotros` (`30px Manrope ExtraBold #FFFFFF`) con barra activa ámbar (`90 × 3 px`).
      - `02` (`12px #94A3B8`) + `Servicios` (`30px Manrope Bold #EAF1F6`).
      - `03` (`12px #94A3B8`) + `Comunidad` (`30px Manrope Bold #EAF1F6`).
      - `04` (`12px #94A3B8`) + `Historia` (`30px Manrope Bold #EAF1F6`).
      - `05` (`12px #94A3B8`) + `Contacto` (`30px Manrope Bold #EAF1F6`).
  - **Selector de idioma (`x = 36..354, y = 548..612`, nodo `15:373`):** Etiqueta `IDIOMA / LANGUAGE` (`11px #E8A04A`) y control segmentado de `318 × 48 px` (fondo `#102A46`, borde `#245B87`): botón izquierdo activo `Español (ES)` (`150 × 36 px`, fondo `#E8A04A`, texto `#173B63`) y opción derecha `English (EN)` (`#EAF1F6`).
  - **CTA principal del menú (`x = 36..354, y = 646..704`, nodo `15:379`):** Botón a ancho completo (`318 × 58 px`, radio `6 px`, fondo `#E8A04A`, punto circular `#173B63` de `10 px` de diámetro + texto `Solicitar orientación` en `Manrope ExtraBold 16px #173B63`).
  - **Pie del cajón (`x = 36, y = 756..814`):** `El Rescate • Los Ángeles, California` (`12px Bold #EAF1F6`), `Acompañamiento comunitario desde 1981.` (`12px #94A3B8`) y nota técnica `Curva de apertura: cubic-bezier(0.32, 0.72, 0, 1) • 280ms` (`11px #E8A04A`).

---

## 5. Evaluación Crítica: Qué se Percibe Realmente Moderno vs. Qué Sigue Pareciendo Convencional o Defectuoso

| Aspecto | Lo que realmente se percibe moderno y con dirección artística | Lo que sigue pareciendo convencional, rígido o presenta fallos visuales |
| :--- | :--- | :--- |
| **Arquitectura espacial y fondo** | La **bipartición asimétrica (`57 %` `#F7F6F2` / `43 %` `#173B63`)** con la línea de costura en `#E8A04A` y las líneas de retícula expuestas (`#DCE5EE`) rompe el molde de las secciones horizontales clásicas. El hecho de que el Header no tenga una banda propia sino que cambie de tratamiento al cruzar `x = 820` se percibe contemporáneo y editorial. | La marca de agua geométrica del códice (`15:174`) en el bloque derecho está construida con primitivas SVG muy básicas (dos rectángulos, una cruz y dos círculos concéntricos), por lo que parece más un diagrama técnico simple que un grabado orgánico inspirado en el glifo real de El Rescate. |
| **Tipografía y jerarquía** | El **escalonamiento de los 3 renglones del titular (`72px`)** con sangría de `+60 px` en el segundo renglón y un **plinto sólido `#173B63`** bajo el tercer renglón (`con oportunidades.`) tiene fuerza gráfica de revista editorial (*DeepBook*). La numeración `01–05` sobre los ítems de navegación funciona bien. | **Fallo de ejecución en Desktop (`15:171`):** Hacer que el segundo renglón (`más fuerte comienza` en `#173B63`) pise la zona oscura del árbol de la fotografía sin cambiar de color (por ejemplo, con `mix-blend-mode` o recorte) hace que las letras **`za`** se pierdan. Igualmente, el plinto azul del tercer renglón se quedó `32 px` corto (`648 px` vs. `664 px` del texto), dejando la `s.` fuera de la caja. |
| **Tratamiento fotográfico y profundidad Z** | La decisión de **hacer cruzar la fotografía principal (`604 × 580 px`) sobre la costura `x = 820`** con un marco en perspectiva detrás (`15:218`) y superponer una segunda fotografía en la esquina inferior izquierda (`15:230`) genera profundidad real en eje Z, superando claramente las tarjetas planas de V1. | **Tres problemas visuales en Desktop (`15:171`):**<br>1. Las fotografías siguen siendo rectángulos con bordes uniformes e insignias de advertencia (`RECURSO PROVISIONAL...`) muy prominentes que compiten con la imagen.<br>2. La foto secundaria (`15:230`) **tapa el inicio del pie de foto principal (`MENTAL 01...`)**.<br>3. El botón `Quiénes somos` (`15:274`) **choca y se superpone (`64 × 56 px`)** sobre la esquina superior izquierda de la foto secundaria (`15:230`). |
| **Elementos narrativos y conectores** | La intención conceptual de conectar el titular con las fotografías mediante un hilo conductor (`Hilo Narrativo: 1981 → Comunidad Hoy`) aporta identidad temática. | Visualmente, el conector (`15:245`) se percibe como un **diagrama de flujo ortogonal** (líneas en ángulo recto con puntos en los vértices y una etiqueta rectangular tipo *badge* `HILO NARRATIVO: 1981 → COMUNIDAD HOY`), más cercano a una infografía técnica que a un gesto editorial sutil. |
| **Adaptación Mobile (`15:290`) y Menú (`15:341`)** | **El frame Mobile (`15:290`) está visualmente mejor resuelto que el Desktop:** no tiene colisiones de texto, el plinto de `oportunidades.` calza exacto, el bloque azul lateral (`x = 84..390`) enmarca las dos fotografías con asimetría intencional y el texto `DESDE 1981` aprovecha el hueco inferior derecho con limpieza. | En Mobile (`15:290`), la zona inferior de 3 botones (`Conoce nuestros servicios` + `Quiénes somos` + `Solicitar orientación`) vuelve a verse algo densa y convencional (tres rectángulos apilados). El Menú Móvil (`15:341`), aunque elegante en color `#173B63`, tiene una distribución interior estándar de *drawer* (lista vertical con líneas divisorias + control segmentado + botón ancho). |

---

## 6. Tablas de Propiedades y Coordenadas Extraídas de los Nodos Principales

> [!IMPORTANT]
> **Convención de coordenadas en las tablas siguientes:**
> - **Coord. Tablero `(X_board, Y_board)`:** Coordenadas exactas devueltas por `get_metadata` de Figma dentro del nodo maestro `15:2`.
> - **Coord. Local Frame `(X_local, Y_local)`:** Coordenadas relativas a la esquina superior izquierda `(0, 0)` de cada artboard (`15:171`, `15:290`, `15:341`).
>   - Para `15:171` (Desktop): `X_local = X_board - 64`, `Y_local = Y_board - 1152`.
>   - Para `15:290` (Mobile): `X_local = X_board - 1556`, `Y_local = Y_board - 1152`.
>   - Para `15:341` (Mobile Menu): `X_local = X_board - 1988`, `Y_local = Y_board - 1152`.

### 6.1 Nodos Principales de Desktop (`15:171` — `1440 × 1060 px`)

| ID Nodo | Nombre de Capa en Figma | Tipo | Coord. Tablero `(X, Y)` | Coord. Local Frame `(X, Y)` | Dimensiones `(W × H)` | Propiedades Extraídas (Color, Tipografía, Bordes, Imagen) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `15:171` | `Artboard / Home V2 — Desktop 1440px` | `FRAME` | `(64, 1152)` | `(0, 0)` | `1440 × 1060` | Contenedor raíz del artboard Desktop. |
| `15:172` | `Desktop V2 Canvas #F7F6F2` | `VECTOR` | `(64, 1152)` | `(0, 0)` | `1440 × 1060` | `fill: #F7F6F2` (visible en `x=0..820`). |
| `15:173` | `Plane Z-1 / Architectural Monolith #173B63` | `VECTOR` | `(884, 1152)` | `(820, 0)` | `620 × 1060` | `fill: linear-gradient(#173B63 → #0F2947)`. |
| `15:174` | `Codex Architectural Watermark` | `FRAME` | `(944, 1282)` | `(880, 130)` | `520 × 860` | `opacity: 0.10`, `stroke: #EAF1F6 (1.5px)`, `fill: none`. |
| `15:183` | `Vector` (Costura vertical ámbar) | `VECTOR` | `(884, 1152)` | `(820, 0)` | `0 × 1060` | `stroke: #E8A04A (1.5px)`. |
| `15:186` | `Editorial Margin Metadata` | `FRAME` | `(84, 1290)` | `(20, 138)` | `137 × 196` | Textos `10px Manrope Bold #245B87` / `Source Sans 3 #64748B` + línea `#E8A04A`. |
| `15:191` | `Header V2 / Desktop 1440px` | `FRAME` | `(120, 1174)` | `(56, 22)` | `1270 × 72` | Grupo contenedor del Header Desktop. |
| `15:192` | `Logo Plinth Surface` | `VECTOR` | `(120, 1174)` | `(56, 22)` | `290 × 72` | `fill: #FFFFFF`, `stroke: #D5E0EA (1px)`, `rx: 6`, `filter: url(#shadow-plinth)`. |
| `15:193` | `Vector` (Filete ámbar plinto logo) | `VECTOR` | `(120, 1174)` | `(56, 22)` | `4 × 72` | `fill: #E8A04A`. |
| `15:194` | `Desktop V2 Official Logo Target` | `VECTOR` | `(136, 1185)` | `(72, 33)` | `264 × 50` | **Imagen PNG inyectada** (`imageHash: 18878091...`, `scaleMode: FIT`, `970×184 px`). |
| `15:195` | `Header V2 / Navigation Links` | `FRAME` | `(448, 1192)` | `(384, 40)` | `424 × 38.5` | Índices `01–05` (`Manrope 10px`) + links `Nosotros` (`Manrope 800 15px #173B63` + barra `#E8A04A` `66×2.5px`), `Servicios`, `Comunidad`, `Historia`, `Contacto` (`Source Sans 3 600 15px #173B63`). |
| `15:208` | `Language Switcher Surface` | `VECTOR` | `(920, 1186)` | `(856, 34)` | `116 × 48` | `fill: #102A46`, `stroke: #245B87 (1.5px)`, `rx: 6`. Pastilla activa `ES` (`15:209`, `50×36`, `#E8A04A`). |
| `15:212` | `CTA Solicitar Orientacion` | `VECTOR` | `(1056, 1186)` | `(992, 34)` | `236 × 48` | `fill: #E8A04A`, `rx: 6`. Texto `15:214` (`Manrope 800 14px #173B63`). |
| `15:218` | `Plane Z-1.5 / Perspective Offset Frame` | `VECTOR` | `(832, 1348)` | `(768, 196)` | `600 × 580` | `fill: #102A46`, `stroke: #E8A04A (1.5px)`, `rx: 4`. |
| `15:219` | `Plane Z-2 / Main Documentary Photo Container` | `FRAME` | `(800, 1320)` | `(736, 168)` | `616 × 592` | Marco exterior `15:220` (`fill: #F7F6F2`, `rx: 4`, `filter: url(#shadow-deep)`). |
| `15:221` | `Desktop V2 Hero Main Photo Target` | `VECTOR` | `(806, 1326)` | `(742, 174)` | `604 × 580` | **Imagen JPEG inyectada** (`imageHash: 9dcd782d...`, `scaleMode: FILL`, La Placita LA) + viñeta `15:222`. |
| `15:223` | `Governance Badge / Main Photo` | `FRAME` | `(826, 1346)` | `(762, 194)` | `464 × 32` | `fill: #173B63 (0.92)`, `stroke: #E8A04A (1.2px)`, texto `Manrope 700 11px #FFFFFF`. |
| `15:227` | `Main Photo Documentary Caption` | `FRAME` | `(830, 1863)` | `(766, 711)` | `569 × 35` | `15:228` (`Manrope 800 11px #E8A04A`) + `15:229` (`Source Sans 3 13px #FFFFFF`). **[Parcialmente ocluido en `x=766..840` por `15:230`]**. |
| `15:230` | `Plane Z-3 / Foreground Overlapping Photo Container` | `FRAME` | `(556, 1716)` | `(492, 564)` | `348 × 268` | Marco `15:231` (`fill: #173B63`, `stroke: #E8A04A 2px`, `rx: 4`, `filter: url(#shadow-float)`). |
| `15:232` | `Desktop V2 Hero Secondary Photo Target` | `VECTOR` | `(564, 1724)` | `(500, 572)` | `332 × 214` | **Imagen JPEG inyectada** (`imageHash: 97836df6...`, `scaleMode: FILL`, MacArthur Park LA). |
| `15:236` | `Plane Z-3B / Editorial Archive Plaque` | `FRAME` | `(932, 1948)` | `(868, 796)` | `516 × 196` | `fill: #102A46`, `stroke: #245B87 (1.5px)`, barra izq. `#E8A04A (6×196)`. Titular `Manrope 800 20px #FFFFFF` + cuerpo `Source Sans 3 14px #EAF1F6`. |
| `15:245` | `Visual Narrative Connector / Hilo de Memoria` | `FRAME` | `(139, 1485)` | `(75, 333)` | `826 × 468` | Trazos ortogonales `#E8A04A (2px)` + etiqueta `15:251` (`234×28 px`, `#EAF1F6`). |
| `15:254` | `Editorial Kicker` | `FRAME` | `(144, 1308)` | `(80, 156)` | `367 × 16` | Cuadrado `#E8A04A (10×10)` + texto `Manrope 800 12px #173B63`, `letter-spacing: 1.8px`. |
| `15:257` | `Hero Headline Line 1` (`Una comunidad`) | `TEXT` | `(144, 1326)` | `(80, 174)` | `544 × 98` | `Manrope ExtraBold (800)`, `72px`, `letter-spacing: -2.2px`, `fill: #173B63`. |
| `15:258` | `Headline Editorial Rule` | `VECTOR` | `(144, 1438)` | `(80, 286)` | `44 × 6` | `fill: #E8A04A`. |
| `15:259` | `Hero Headline Line 2` (`más fuerte comienza`) | `TEXT` | `(204, 1404)` | `(140, 252)` | `726 × 98` | `Manrope ExtraBold (800)`, `72px`, `letter-spacing: -2.2px`, `fill: #173B63`. **[Cruza sobre `15:221` en `x=736..866`]**. |
| `15:260` | `Headline Highlight Plinth` | `VECTOR` | `(196, 1496)` | `(132, 344)` | `648 × 78` | `fill: #173B63`, `rx: 4` (`x=132..780`). |
| `15:261` | `Hero Headline Line 3` (`con oportunidades.`) | `TEXT` | `(212, 1484)` | `(148, 332)` | `664 × 96` | `Manrope ExtraBold (800)`, `70px`, `letter-spacing: -2.0px`, `fill: #FFFFFF` (punto en `#E8A04A`). **[Llega hasta `x=812`, sobresaliendo `32px` de `15:260`]**. |
| `15:263` | `Hero V2 / Lead Paragraph` | `FRAME` | `(172, 1607)` | `(108, 455)` | `460 × 138` | Líneas 1–2: `Source Sans 3 600 19px #173B63`. Líneas 3–5: `Source Sans 3 400 17px #245B87`. |
| `15:270` | `Primary CTA / Conoce nuestros servicios` | `FRAME` | `(172, 1764)` | `(108, 612)` | `264 × 56` | `fill: #173B63`, `rx: 6`, filete izq. `#E8A04A (6×56)`, texto `Manrope 800 16px #FFFFFF`. |
| `15:274` | `Secondary CTA / Quienes somos` | `FRAME` | `(456, 1764)` | `(392, 612)` | `164 × 56` | `fill: #EAF1F6`, `stroke: #245B87 (1.5px)`, `rx: 6`, texto `Manrope 700 16px #173B63` + línea `#E8A04A`. **[Se superpone en `x=492..556` sobre la esquina de `15:230`]**. |
| `15:278` | `Hero V2 / Editorial Index & Scroll Cue` | `FRAME` | `(144, 2040)` | `(80, 888)` | `700 × 128` | Línea `#D5E0EA (700px)`, título `Manrope 800 12px #173B63`, ejes `Source Sans 3 15px #245B87` e icono scroll. |

---

### 6.2 Nodos Principales de Mobile (`15:290` — `390 × 1060 px`)

| ID Nodo | Nombre de Capa en Figma | Tipo | Coord. Tablero `(X, Y)` | Coord. Local Frame `(X, Y)` | Dimensiones `(W × H)` | Propiedades Extraídas (Color, Tipografía, Bordes, Imagen) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `15:290` | `Artboard / Home V2 — Mobile 390px` | `FRAME` | `(1556, 1152)` | `(0, 0)` | `390 × 1060` | Contenedor raíz Mobile. |
| `15:291` | `Mobile V2 Canvas #F7F6F2` | `VECTOR` | `(1556, 1152)` | `(0, 0)` | `390 × 1060` | `fill: #F7F6F2`, `stroke: #D5E0EA (1.5px)`. |
| `15:292` | `Mobile Plane Z-1 / Dark Immersion Block` | `VECTOR` | `(1640, 1468)` | `(84, 316)` | `306 × 432` | `fill: #173B63` (banda oscura asimétrica anclada a la derecha). |
| `15:293` | `Header V2 / Mobile 390px` | `FRAME` | `(1556, 1152)` | `(0, 0)` | `390 × 76` | Plinto blanco `15:296` (`194×48`, `x=16, y=14`), selector `ES/EN` `15:299` (`58×40`, `x=256, y=18`) y botón menú `15:302` (`50×48`, `x=324, y=14`, `#173B63`). |
| `15:298` | `Mobile V2 Official Logo Target` | `VECTOR` | `(1582, 1173)` | `(26, 21)` | `176 × 33` | **Imagen PNG inyectada** (`imageHash: 18878091...`, `scaleMode: FIT`). |
| `15:306` | `Mobile V2 / Editorial Headline` | `FRAME` | `(1576, 1251)` | `(20, 99)` | `318 × 218` | `Una comunidad` (`40px`), `más fuerte` (`38px`, `x=58`), `comienza con` (`38px`, `x=58`), plinto `15:313` (`318×48`, `#173B63`) + `oportunidades.` (`38px #FFFFFF`). |
| `15:316` | `Mobile V2 / Multi-Plane Photo Stage` | `FRAME` | `(1572, 1488)` | `(16, 336)` | `358 × 386` | Marco blanco `15:317` (`338×314`, `x=36, y=336`) + tarjeta secundaria `15:321` (`192×146`, `x=16, y=576`, `#173B63`, borde `#E8A04A 2px`). |
| `15:318` | `Mobile V2 Hero Main Photo Target` | `VECTOR` | `(1596, 1492)` | `(40, 340)` | `330 × 306` | **Imagen JPEG inyectada** (`imageHash: 9dcd782d...`, `scaleMode: FILL`, La Placita LA). |
| `15:322` | `Mobile V2 Hero Secondary Photo Target` | `VECTOR` | `(1576, 1732)` | `(20, 580)` | `184 × 114` | **Imagen JPEG inyectada** (`imageHash: 97836df6...`, `scaleMode: FILL`, MacArthur Park LA). |
| `15:327` | `Mobile V2 / Lead & Thumb Zone CTAs` | `FRAME` | `(1576, 1924)` | `(20, 772)` | `350 × 200` | Párrafo (`16px #173B63` / `15px #245B87`) + CTA primario `15:331` (`350×54`, `#173B63`) + fila inferior: `Quiénes somos` (`15:334`, `168×48`) y `Solicitar orientación` (`15:336`, `168×48`, `#E8A04A`). |

---

### 6.3 Nodos Principales de Mobile Menu (`15:341` — `390 × 860 px`)

| ID Nodo | Nombre de Capa en Figma | Tipo | Coord. Tablero `(X, Y)` | Coord. Local Frame `(X, Y)` | Dimensiones `(W × H)` | Propiedades Extraídas (Color, Tipografía, Bordes, Imagen) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `15:341` | `Artboard / Mobile Menu Open V2 — 390px` | `FRAME` | `(1988, 1152)` | `(0, 0)` | `390 × 860` | Contenedor raíz del Menú Móvil. |
| `15:342` | `Mobile Menu V2 Surface #173B63` | `VECTOR` | `(1988, 1152)` | `(0, 0)` | `390 × 860` | `fill: #173B63`, `stroke: #E8A04A (1.5px)`, `rx: 8`. |
| `15:345` | `Vector` (Plinto blanco logo en menú) | `VECTOR` | `(2004, 1166)` | `(16, 14)` | `194 × 48` | `fill: #FFFFFF`, `rx: 4`. |
| `15:346` | `Mobile Menu V2 Official Logo Target` | `VECTOR` | `(2013, 1173)` | `(25, 21)` | `176 × 33` | **Imagen PNG inyectada** (`imageHash: 18878091...`, `scaleMode: FIT`). |
| `15:347` | `Vector` (Botón cerrar `X`) | `VECTOR` | `(2312, 1166)` | `(324, 14)` | `50 × 48` | `fill: #102A46`, `stroke: #E8A04A (1.5px)`, `rx: 6`. Aspa `15:348`–`15:349` (`#E8A04A`, `2.2px`). |
| `15:350` | `Mobile Menu V2 / Editorial Links` | `FRAME` | `(2024, 1259)` | `(36, 107)` | `318 × 401` | 5 grupos (`15:352`, `15:357`, `15:361`, `15:365`, `15:369`), cada uno `318×56 px`, texto `Manrope 800/700 30px` + índice `12px`. |
| `15:373` | `Mobile Menu V2 / Language Selector` | `FRAME` | `(2024, 1689)` | `(36, 537)` | `318 × 75` | Contenedor `318×48` (`#102A46`, borde `#245B87`), pastilla activa `Español (ES)` (`150×36`, `#E8A04A`). |
| `15:379` | `Mobile Menu V2 / Primary CTA` | `FRAME` | `(2024, 1798)` | `(36, 646)` | `318 × 58` | `fill: #E8A04A`, `rx: 6`, texto `Solicitar orientación` (`Manrope 800 16px #173B63`). |

---

## 7. Comparación Estructural y Visual entre Desktop (`15:171`) y Mobile (`15:290` + `15:341`)

| Dimensión Comparada | Desktop (`15:171` — `1440 × 1060 px`) | Mobile (`15:290` — `390 × 1060 px`) + Menú (`15:341`) | Evaluación de Coherencia y Ejecución |
| :--- | :--- | :--- | :--- |
| **Geometría del bloque oscuro (`#173B63`)** | Columna vertical derecha a sangre completa (`x = 820..1440, y = 0..1060`, `620 × 1060 px`, `43 %` del ancho). | Banda lateral derecha a media altura (`x = 84..390, y = 316..748`, `306 × 432 px`, `78.5 %` del ancho en esa franja). | **Muy bien resuelto en Mobile:** en lugar de pintar la mitad derecha de toda la pantalla móvil (lo que habría estrangulado el texto) o pintar todo el fondo de azul oscuro, el bloque `#173B63` se convierte en un zócalo asimétrico central que abraza el titular y las dos fotografías. |
| **Escala y ajuste del titular** | `72px / 70px` en 3 renglones (`Una comunidad` / `más fuerte comienza` / `con oportunidades.`). Presenta colisión de las letras `za` con la foto y desbordamiento de `32 px` en el plinto del 3.er renglón. | `40px / 38px` en 4 renglones (`Una comunidad` / `más fuerte` / `comienza con` / `oportunidades.`). El plinto `#173B63` (`318 × 48 px`) contiene íntegramente la palabra `oportunidades.` sin colisiones. | **Mobile supera en limpieza técnica a Desktop:** al dividir el titular en 4 líneas antes de las fotografías, conserva la sangría editorial y el plinto oscuro sin chocar con las imágenes. |
| **Superposición de planos fotográficos (Z-2 y Z-3)** | Foto principal `604 × 580 px` + foto secundaria `332 × 214 px` en la esquina inferior izquierda. La foto secundaria tapa parcialmente el pie de foto principal (`MENTAL 01...`) y se solapa con el botón `Quiénes somos`. | Foto principal `330 × 306 px` + foto secundaria `184 × 114 px` en la esquina inferior izquierda (`x = 16, y = 576`). El texto de apoyo sobre fondo oscuro (`DESDE 1981...`) se ubica a la derecha de la foto secundaria (`x = 220`), libre de solapamientos. | **Mobile mantiene el concepto de 3 planos Z sin los errores de oclusión de Desktop.** |
| **Jerarquía de llamadas a la acción (CTAs)** | En el Hero hay 2 botones (`Conoce nuestros servicios` y `Quiénes somos`), mientras que `Solicitar orientación` está arriba a la derecha en el Header. | Como el Header móvil colapsa la navegación en el botón hamburguesa, `Solicitar orientación` se incorpora también en la fila inferior del Hero junto a `Quiénes somos`, debajo del botón primario a ancho completo. | **Decisiones ergonómicas acertadas en Mobile** (acceso directo en zona del pulgar sin obligar a abrir el menú), aunque visualmente genera una batería de 3 botones rectangulares seguidos. |

---

## 8. Contenidos Originales en Formato SVG de los Tres Frames (Sin Modificaciones)

*(Nota: En el código SVG original, los rectángulos de logotipo y fotografía llevan los `id` de destino —p. ej. `Desktop V2 Official Logo Target`, `Desktop V2 Hero Main Photo Target`— con su color base `#254087` / `#245B87`, sobre los cuales se inyectaron en Figma los rellenos binarios PNG/JPEG mediante `upload_assets`).*

### 8.1 SVG Original — Frame Desktop (`15:171` — `frame_15_171_desktop_1440.svg`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1060" viewBox="0 0 1440 1060" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow-deep" x="-12%" y="-10%" width="128%" height="132%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="-12" dy="28" stdDeviation="28" flood-color="#0B1F36" flood-opacity="0.34"/>
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0B1F36" flood-opacity="0.16"/>
    </filter>
    <filter id="shadow-float" x="-15%" y="-12%" width="135%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0B1F36" flood-opacity="0.28"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0B1F36" flood-opacity="0.14"/>
    </filter>
    <filter id="shadow-plinth" x="-8%" y="-8%" width="116%" height="124%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#173B63" flood-opacity="0.08"/>
    </filter>
    <linearGradient id="photo-vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D223A" stop-opacity="0.18"/>
      <stop offset="55%" stop-color="#0D223A" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#0D223A" stop-opacity="0.72"/>
    </linearGradient>
    <linearGradient id="monolith-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#173B63"/>
      <stop offset="100%" stop-color="#0F2947"/>
    </linearGradient>
  </defs>
  <g id="Artboard / Home V2 — Desktop 1440px" transform="translate(0, 0)">
        <!-- Base Warm Editorial Canvas (#F7F6F2) -->
        <rect id="Desktop V2 Canvas #F7F6F2" width="1440" height="1060" fill="#F7F6F2"/>

        <!-- Plane Z-1: Right Asymmetric Architectural Monolith (#173B63) -->
        <rect id="Plane Z-1 / Architectural Monolith #173B63" x="820" y="0" width="620" height="1060" fill="url(#monolith-grad)"/>

        <!-- Subtle Mesoamerican Codex Linear Motif on Dark Monolith (inspired by logo glyph, 8% opacity) -->
        <g id="Codex Architectural Watermark" opacity="0.10" stroke="#EAF1F6" stroke-width="1.5" fill="none">
          <rect x="880" y="130" width="520" height="860" rx="2"/>
          <rect x="904" y="154" width="472" height="812" rx="2"/>
          <path d="M 904 320 L 1376 320 M 904 680 L 1376 680 M 1140 154 L 1140 966"/>
          <circle cx="1140" cy="510" r="140"/>
          <circle cx="1140" cy="510" r="92"/>
        </g>

        <!-- Exposed Editorial Grid Hairlines (DeepBook v2 structural principle) -->
        <g id="Editorial Architectural Grid Lines">
          <line x1="56" y1="0" x2="56" y2="1060" stroke="#DCE5EE" stroke-width="1"/>
          <line x1="438" y1="116" x2="438" y2="1060" stroke="#DCE5EE" stroke-width="1" stroke-dasharray="4 6"/>
          <line x1="820" y1="0" x2="820" y2="1060" stroke="#E8A04A" stroke-width="1.5"/>
          <line x1="0" y1="116" x2="1440" y2="116" stroke="#DCE5EE" stroke-width="1"/>
          <line x1="820" y1="116" x2="1440" y2="116" stroke="#245B87" stroke-width="1"/>
        </g>

        <!-- Vertical Editorial Margin Coordinates (Left Rail) -->
        <g id="Editorial Margin Metadata" transform="translate(20, 148)">
          <text x="0" y="0" fill="#245B87" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1.8">EL RESCATE • ARCHIVO VIVO</text>
          <line x1="16" y1="24" x2="16" y2="140" stroke="#E8A04A" stroke-width="1.5"/>
          <text x="0" y="164" fill="#64748B" font-family="Source Sans 3, Inter, sans-serif" font-size="10" letter-spacing="1">1981 — PRESENTE</text>
          <text x="0" y="182" fill="#64748B" font-family="Source Sans 3, Inter, sans-serif" font-size="10" letter-spacing="1">LOS ÁNGELES, CA</text>
        </g>

        <!-- =============================================================== -->
        <!-- HEADER V2 (ARCHITECTURAL SEAM NAVIGATION)                       -->
        <!-- =============================================================== -->
        <g id="Header V2 / Desktop 1440px">
          <!-- Left Official Logo Plinth (#FFFFFF architectural card with subtle shadow) -->
          <rect id="Logo Plinth Surface" x="56" y="22" width="290" height="72" rx="6" fill="#FFFFFF" stroke="#D5E0EA" stroke-width="1" filter="url(#shadow-plinth)"/>
          <rect x="56" y="22" width="4" height="72" fill="#E8A04A"/>
          <!-- TARGET FOR OFFICIAL PNG LOGO (264 x 50 px -> exact 5.27:1 ratio) -->
          <rect id="Desktop V2 Official Logo Target" x="72" y="33" width="264" height="50" fill="#254087"/>

          <!-- Editorial Navigation Links (Sitting on Warm Paper #F7F6F2) -->
          <g id="Header V2 / Navigation Links" transform="translate(384, 42)">
            <!-- Item 1: Nosotros (Active) -->
            <text x="0" y="8" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800" letter-spacing="1">01</text>
            <text x="0" y="26" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="15" font-weight="800">Nosotros</text>
            <rect x="0" y="34" width="66" height="2.5" fill="#E8A04A"/>

            <!-- Item 2: Servicios -->
            <text x="92" y="8" fill="#64748B" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1">02</text>
            <text x="92" y="26" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="15" font-weight="600">Servicios</text>

            <!-- Item 3: Comunidad -->
            <text x="180" y="8" fill="#64748B" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1">03</text>
            <text x="180" y="26" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="15" font-weight="600">Comunidad</text>

            <!-- Item 4: Historia -->
            <text x="284" y="8" fill="#64748B" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1">04</text>
            <text x="284" y="26" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="15" font-weight="600">Historia</text>

            <!-- Item 5: Contacto -->
            <text x="364" y="8" fill="#64748B" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1">05</text>
            <text x="364" y="26" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="15" font-weight="600">Contacto</text>
          </g>

          <!-- Right Utility Zone (Sitting inside the #173B63 Monolith) -->
          <g id="Header V2 / Language &amp; Primary CTA" transform="translate(856, 30)">
            <!-- Language Selector ES / EN -->
            <rect id="Language Switcher Surface" x="0" y="4" width="116" height="48" rx="6" fill="#102A46" stroke="#245B87" stroke-width="1.5"/>
            <rect x="6" y="10" width="50" height="36" rx="4" fill="#E8A04A"/>
            <text x="21" y="33" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="13" font-weight="800">ES</text>
            <text x="73" y="33" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="13" font-weight="700">EN</text>

            <!-- Primary Header CTA: Solicitar orientación -->
            <rect id="CTA Solicitar Orientacion" x="136" y="4" width="236" height="48" rx="6" fill="#E8A04A"/>
            <circle cx="160" cy="28" r="4" fill="#173B63"/>
            <text x="174" y="33" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="14" font-weight="800">Solicitar orientación</text>

            <!-- Editorial Status Micro-tag -->
            <text x="392" y="24" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800" letter-spacing="1">ATENCIÓN</text>
            <text x="392" y="40" fill="#EAF1F6" font-family="Source Sans 3, Inter, sans-serif" font-size="12">Comunitaria LA</text>
          </g>
        </g>

        <!-- =============================================================== -->
        <!-- HERO V2 STAGE: MULTI-PLANE PHOTOGRAPHY (RIGHT / CENTER SEAM)    -->
        <!-- =============================================================== -->
        <g id="Hero V2 / Multi-Plane Documentary Stage">
          <!-- Perspective Depth Back-Frame (Simulated 3D Offset Plane Z-1.5) -->
          <rect id="Plane Z-1.5 / Perspective Offset Frame" x="768" y="196" width="600" height="580" rx="4" fill="#102A46" stroke="#E8A04A" stroke-width="1.5"/>

          <!-- PLANE Z-2: Protagonist Large-Format Documentary Photograph (Crosses the x=820 seam!) -->
          <g id="Plane Z-2 / Main Documentary Photo Container" filter="url(#shadow-deep)">
            <rect x="736" y="168" width="616" height="592" rx="4" fill="#F7F6F2"/>
            <!-- TARGET FOR PROVISIONAL PHOTO 1 (604 x 580 px) -->
            <rect id="Desktop V2 Hero Main Photo Target" x="742" y="174" width="604" height="580" fill="#245B87"/>
            <rect x="742" y="174" width="604" height="580" fill="url(#photo-vignette)"/>
          </g>

          <!-- Provisional Resource Governance Badge on Main Photo -->
          <g id="Governance Badge / Main Photo" transform="translate(762, 194)">
            <rect width="464" height="32" rx="4" fill="#173B63" fill-opacity="0.92" stroke="#E8A04A" stroke-width="1.2"/>
            <circle cx="16" cy="16" r="4" fill="#E8A04A"/>
            <text x="28" y="21" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">RECURSO PROVISIONAL (WIKIMEDIA: LA PLACITA, LOS ÁNGELES) • NO OFICIAL</text>
          </g>

          <!-- Editorial Caption Inside Main Photo Lower Edge -->
          <g id="Main Photo Documentary Caption" transform="translate(766, 706)">
            <text x="0" y="16" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2">PLANO DOCUMENTAL 01 — COMUNIDAD LATINA EN LOS ÁNGELES</text>
            <text x="0" y="34" fill="#FFFFFF" font-family="Source Sans 3, Inter, sans-serif" font-size="13">Fotografía documental de referencia espacial (pendiente de sustitución por archivo propio de El Rescate).</text>
          </g>

          <!-- PLANE Z-3: Overlapping Foreground Documentary Layer (Breaks onto #F7F6F2 canvas!) -->
          <g id="Plane Z-3 / Foreground Overlapping Photo Container" filter="url(#shadow-float)">
            <rect x="492" y="564" width="348" height="268" rx="4" fill="#173B63" stroke="#E8A04A" stroke-width="2"/>
            <!-- TARGET FOR PROVISIONAL PHOTO 2 (332 x 214 px) -->
            <rect id="Desktop V2 Hero Secondary Photo Target" x="500" y="572" width="332" height="214" fill="#245B87"/>
            <rect x="500" y="786" width="332" height="46" fill="#173B63"/>
            <text x="514" y="806" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800" letter-spacing="0.9">PLANO Z-3 • WESTLAKE / MACARTHUR PARK (PROVISIONAL)</text>
            <text x="514" y="822" fill="#EAF1F6" font-family="Source Sans 3, Inter, sans-serif" font-size="11">Entorno urbano e histórico de la diáspora centroamericana y latina.</text>
          </g>

          <!-- PLANE Z-3B: Dark Architectural Context Plaque (Bottom Right on #173B63 Monolith) -->
          <g id="Plane Z-3B / Editorial Archive Plaque" transform="translate(868, 796)">
            <rect width="516" height="196" rx="6" fill="#102A46" stroke="#245B87" stroke-width="1.5"/>
            <rect x="0" y="0" width="6" height="196" fill="#E8A04A"/>
            <text x="28" y="34" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4">TRAYECTORIA COMUNITARIA • DESDE 1981</text>
            <text x="28" y="64" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="20" font-weight="800">Un refugio de dignidad, orientación y</text>
            <text x="28" y="90" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="20" font-weight="800">acompañamiento en el corazón de Los Ángeles.</text>
            <text x="28" y="124" fill="#EAF1F6" font-family="Source Sans 3, Inter, sans-serif" font-size="14">Nacida en 1981 para responder a las necesidades urgentes de la población</text>
            <text x="28" y="146" fill="#EAF1F6" font-family="Source Sans 3, Inter, sans-serif" font-size="14">inmigrante, El Rescate articula apoyo humano, orientación y memoria colectiva.</text>
            <text x="28" y="176" fill="#94A3B8" font-family="Source Sans 3, Inter, sans-serif" font-size="12">[Contenido descriptivo honesto • Sin estadísticas ni promesas no verificadas]</text>
          </g>
        </g>

        <!-- =============================================================== -->
        <!-- NARRATIVE VISUAL THREAD ("HILO DE MEMORIA 1981 → HOY")          -->
        <!-- =============================================================== -->
        <g id="Visual Narrative Connector / Hilo de Memoria">
          <path d="M 80 338 L 80 698 L 492 698" stroke="#E8A04A" stroke-width="2" fill="none"/>
          <path d="M 840 698 L 896 698 L 896 796" stroke="#E8A04A" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
          <circle cx="80" cy="338" r="5" fill="#E8A04A"/>
          <circle cx="492" cy="698" r="5" fill="#E8A04A"/>
          <circle cx="896" cy="796" r="5" fill="#E8A04A"/>
          <rect x="96" y="682" width="234" height="28" rx="4" fill="#EAF1F6" stroke="#E8A04A" stroke-width="1"/>
          <text x="110" y="700" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800" letter-spacing="1">HILO NARRATIVO: 1981 → COMUNIDAD HOY</text>
        </g>

        <!-- =============================================================== -->
        <!-- HERO V2 EDITORIAL TYPOGRAPHY & ASYMMETRIC LEAD (LEFT / OVERLAP) -->
        <!-- =============================================================== -->
        <g id="Hero V2 / Protagonist Editorial Typography">
          <!-- Editorial Kicker -->
          <g id="Editorial Kicker" transform="translate(80, 154)">
            <rect width="10" height="10" y="4" fill="#E8A04A"/>
            <text x="22" y="14" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="800" letter-spacing="1.8">ORGANIZACIÓN COMUNITARIA • LOS ÁNGELES, CALIFORNIA</text>
          </g>

          <!-- Monumental Staggered Headline (72px Manrope ExtraBold) -->
          <!-- Line 1 -->
          <text id="Hero Headline Line 1" x="80" y="246" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="72" font-weight="800" letter-spacing="-2.2">Una comunidad</text>

          <!-- Line 2 (Indented Editorial Offset overlapping toward the photo seam) -->
          <rect id="Headline Editorial Rule" x="80" y="286" width="44" height="6" fill="#E8A04A"/>
          <text id="Hero Headline Line 2" x="140" y="324" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="72" font-weight="800" letter-spacing="-2.2">más fuerte comienza</text>

          <!-- Line 3 (Crosses onto a high-contrast editorial highlight block) -->
          <rect id="Headline Highlight Plinth" x="132" y="344" width="648" height="78" rx="4" fill="#173B63"/>
          <text id="Hero Headline Line 3" x="148" y="402" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="70" font-weight="800" letter-spacing="-2.0">con oportunidades<tspan fill="#E8A04A">.</tspan></text>

          <!-- Governance Micro-label for Provisional Copy -->
          <text x="140" y="442" fill="#64748B" font-family="Source Sans 3, Inter, sans-serif" font-size="12" font-style="italic">[Propuesta de titular editorial — Sujeto a confirmación institucional de El Rescate]</text>

          <!-- Editorial Lead Copy (Constrained to 400px for 60ch optimal reading) -->
          <g id="Hero V2 / Lead Paragraph" transform="translate(108, 474)">
            <text x="0" y="0" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="19" font-weight="600">Desde 1981 caminamos junto a la población inmigrante</text>
            <text x="0" y="28" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="19" font-weight="600">latina en Los Ángeles.</text>
            <text x="0" y="64" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="17">Facilitamos orientación confiable, recursos comunitarios y un</text>
            <text x="0" y="88" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="17">espacio seguro donde cada persona y familia puede construir</text>
            <text x="0" y="112" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="17">su futuro con dignidad y respaldo humano.</text>
          </g>

          <!-- Asymmetric CTA Group -->
          <g id="Hero V2 / CTA Actions" transform="translate(108, 612)">
            <!-- Primary CTA: Conoce nuestros servicios -->
            <g id="Primary CTA / Conoce nuestros servicios">
              <rect width="264" height="56" rx="6" fill="#173B63"/>
              <rect x="0" y="0" width="6" height="56" rx="3" fill="#E8A04A"/>
              <text x="28" y="34" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="16" font-weight="800">Conoce nuestros servicios</text>
            </g>

            <!-- Secondary Editorial CTA: Quiénes somos -->
            <g id="Secondary CTA / Quienes somos" transform="translate(284, 0)">
              <rect width="164" height="56" rx="6" fill="#EAF1F6" stroke="#245B87" stroke-width="1.5"/>
              <text x="26" y="34" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="16" font-weight="700">Quiénes somos</text>
              <line x1="26" y1="42" x2="138" y2="42" stroke="#E8A04A" stroke-width="2"/>
            </g>
          </g>

          <!-- Bottom-Left Editorial Index & Scroll Invitation (Replaces V1's 3 Rectangular Cards!) -->
          <g id="Hero V2 / Editorial Index &amp; Scroll Cue" transform="translate(80, 888)">
            <line x1="0" y1="0" x2="700" y2="0" stroke="#D5E0EA" stroke-width="1.5"/>
            <text x="0" y="32" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="800" letter-spacing="1.2">EJES DE ACCIÓN COMUNITARIA</text>
            <text x="0" y="56" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="15">Orientación e Información   •   Acompañamiento Familiar   •   Memoria y Cultura Comunitaria</text>
            <g transform="translate(0, 84)">
              <rect width="28" height="44" rx="14" fill="none" stroke="#173B63" stroke-width="1.5"/>
              <circle cx="14" cy="14" r="3" fill="#E8A04A"/>
              <text x="42" y="20" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2">DESPLAZA PARA EXPLORAR LA HISTORIA</text>
              <text x="42" y="38" fill="#64748B" font-family="Source Sans 3, Inter, sans-serif" font-size="12">Transición suave asistida por Lenis + GSAP ScrollTrigger</text>
            </g>
          </g>
        </g>
      </g>
</svg>
```

---

### 8.2 SVG Original — Frame Mobile (`15:290` — `frame_15_290_mobile_390.svg`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1060" viewBox="0 0 390 1060" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow-deep" x="-12%" y="-10%" width="128%" height="132%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="-12" dy="28" stdDeviation="28" flood-color="#0B1F36" flood-opacity="0.34"/>
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0B1F36" flood-opacity="0.16"/>
    </filter>
    <filter id="shadow-float" x="-15%" y="-12%" width="135%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0B1F36" flood-opacity="0.28"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0B1F36" flood-opacity="0.14"/>
    </filter>
    <filter id="shadow-plinth" x="-8%" y="-8%" width="116%" height="124%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#173B63" flood-opacity="0.08"/>
    </filter>
    <linearGradient id="photo-vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D223A" stop-opacity="0.18"/>
      <stop offset="55%" stop-color="#0D223A" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#0D223A" stop-opacity="0.72"/>
    </linearGradient>
    <linearGradient id="monolith-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#173B63"/>
      <stop offset="100%" stop-color="#0F2947"/>
    </linearGradient>
  </defs>
  <g id="Artboard / Home V2 — Mobile 390px" transform="translate(0, 0)">
        <rect id="Mobile V2 Canvas #F7F6F2" width="390" height="1060" fill="#F7F6F2" stroke="#D5E0EA" stroke-width="1.5"/>

        <!-- Mobile Architectural Dark Band (Middle-Right Immersion Block) -->
        <rect id="Mobile Plane Z-1 / Dark Immersion Block" x="84" y="316" width="306" height="432" fill="#173B63"/>

        <!-- Mobile Header V2 (Height 76px) -->
        <g id="Header V2 / Mobile 390px">
          <rect width="390" height="76" fill="#F7F6F2"/>
          <line x1="0" y1="76" x2="390" y2="76" stroke="#D5E0EA" stroke-width="1"/>
          <!-- Logo Plinth Mobile -->
          <rect x="16" y="14" width="194" height="48" rx="4" fill="#FFFFFF" stroke="#D5E0EA"/>
          <rect x="16" y="14" width="3" height="48" fill="#E8A04A"/>
          <!-- TARGET FOR MOBILE OFFICIAL PNG LOGO (176 x 33 px) -->
          <rect id="Mobile V2 Official Logo Target" x="26" y="21" width="176" height="33" fill="#254087"/>

          <!-- Compact Language Badge -->
          <rect x="256" y="18" width="58" height="40" rx="6" fill="#EAF1F6" stroke="#245B87" stroke-width="1"/>
          <text x="268" y="43" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="800">ES</text>
          <text x="290" y="43" fill="#64748B" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="600">EN</text>

          <!-- 48x48 Touch Target Menu Button -->
          <rect x="324" y="14" width="50" height="48" rx="6" fill="#173B63"/>
          <line x1="337" y1="30" x2="361" y2="30" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <line x1="337" y1="38" x2="355" y2="38" stroke="#E8A04A" stroke-width="2" stroke-linecap="round"/>
          <line x1="337" y1="46" x2="361" y2="46" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        </g>

        <!-- Mobile Editorial Kicker + Staggered Headline (Overlaps the Dark Band!) -->
        <g id="Mobile V2 / Editorial Headline" transform="translate(20, 98)">
          <rect x="0" y="3" width="8" height="8" fill="#E8A04A"/>
          <text x="16" y="11" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800" letter-spacing="1.4">LOS ÁNGELES • DESDE 1981</text>

          <text x="0" y="56" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="40" font-weight="800" letter-spacing="-1.2">Una comunidad</text>
          <rect x="0" y="76" width="28" height="4" fill="#E8A04A"/>
          <text x="38" y="98" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="38" font-weight="800" letter-spacing="-1.2">más fuerte</text>
          <text x="38" y="138" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="38" font-weight="800" letter-spacing="-1.2">comienza con</text>
          <rect x="0" y="150" width="318" height="48" rx="4" fill="#173B63"/>
          <text x="12" y="185" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="38" font-weight="800" letter-spacing="-1.0">oportunidades<tspan fill="#E8A04A">.</tspan></text>
          <text x="0" y="214" fill="#64748B" font-family="Source Sans 3, Inter, sans-serif" font-size="11" font-style="italic">[Titular propuesta inicial]</text>
        </g>

        <!-- Mobile Multi-Plane Documentary Stage (Y=332..736) -->
        <g id="Mobile V2 / Multi-Plane Photo Stage">
          <!-- Plane Z-2 Main Photo (334 x 310 px) -->
          <rect x="36" y="336" width="338" height="314" rx="4" fill="#F7F6F2"/>
          <!-- TARGET FOR MOBILE MAIN PHOTO -->
          <rect id="Mobile V2 Hero Main Photo Target" x="40" y="340" width="330" height="306" fill="#245B87"/>

          <!-- Governance Badge Mobile -->
          <rect x="50" y="352" width="296" height="24" rx="4" fill="#173B63" fill-opacity="0.92" stroke="#E8A04A" stroke-width="1"/>
          <text x="60" y="368" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="9" font-weight="800" letter-spacing="0.6">FOTO PROVISIONAL WIKIMEDIA (LA) • NO INSTITUCIONAL</text>

          <!-- Plane Z-3 Overlapping Secondary Photo (184 x 130 px) -->
          <rect x="16" y="576" width="192" height="146" rx="4" fill="#173B63" stroke="#E8A04A" stroke-width="2"/>
          <!-- TARGET FOR MOBILE SECONDARY PHOTO -->
          <rect id="Mobile V2 Hero Secondary Photo Target" x="20" y="580" width="184" height="114" fill="#245B87"/>
          <text x="28" y="710" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="9" font-weight="800">PLANO Z-3 • MACARTHUR PARK</text>

          <!-- Right Dark Caption Strip next to Z-3 -->
          <text x="220" y="674" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="10" font-weight="800">DESDE 1981</text>
          <text x="220" y="694" fill="#FFFFFF" font-family="Source Sans 3, Inter, sans-serif" font-size="12">Memoria viva y apoyo</text>
          <text x="220" y="712" fill="#EAF1F6" font-family="Source Sans 3, Inter, sans-serif" font-size="12">comunitario en LA.</text>
        </g>

        <!-- Mobile Copy & Thumb-Zone CTAs (Y=768..1040) -->
        <g id="Mobile V2 / Lead &amp; Thumb Zone CTAs" transform="translate(20, 772)">
          <text x="0" y="16" fill="#173B63" font-family="Source Sans 3, Inter, sans-serif" font-size="16" font-weight="600">Acompañamos a personas y familias inmigrantes</text>
          <text x="0" y="38" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="15">con orientación confiable, defensa de su dignidad y</text>
          <text x="0" y="60" fill="#245B87" font-family="Source Sans 3, Inter, sans-serif" font-size="15">caminos hacia el bienestar comunitario en Los Ángeles.</text>

          <!-- Full-width Primary CTA (54px height) -->
          <rect x="0" y="86" width="350" height="54" rx="6" fill="#173B63"/>
          <rect x="0" y="86" width="6" height="54" rx="3" fill="#E8A04A"/>
          <text x="74" y="119" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="16" font-weight="800">Conoce nuestros servicios</text>

          <!-- Secondary CTA + Quick Orientation CTA -->
          <rect x="0" y="152" width="168" height="48" rx="6" fill="#EAF1F6" stroke="#245B87" stroke-width="1.5"/>
          <text x="30" y="181" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="14" font-weight="700">Quiénes somos</text>

          <rect x="182" y="152" width="168" height="48" rx="6" fill="#E8A04A"/>
          <text x="200" y="181" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="13" font-weight="800">Solicitar orientación</text>
        </g>
      </g>
</svg>
```

---

### 8.3 SVG Original — Frame Mobile Menu (`15:341` — `frame_15_341_mobile_menu_390.svg`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="860" viewBox="0 0 390 860" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow-deep" x="-12%" y="-10%" width="128%" height="132%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="-12" dy="28" stdDeviation="28" flood-color="#0B1F36" flood-opacity="0.34"/>
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0B1F36" flood-opacity="0.16"/>
    </filter>
    <filter id="shadow-float" x="-15%" y="-12%" width="135%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0B1F36" flood-opacity="0.28"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0B1F36" flood-opacity="0.14"/>
    </filter>
    <filter id="shadow-plinth" x="-8%" y="-8%" width="116%" height="124%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#173B63" flood-opacity="0.08"/>
    </filter>
    <linearGradient id="photo-vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D223A" stop-opacity="0.18"/>
      <stop offset="55%" stop-color="#0D223A" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#0D223A" stop-opacity="0.72"/>
    </linearGradient>
    <linearGradient id="monolith-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#173B63"/>
      <stop offset="100%" stop-color="#0F2947"/>
    </linearGradient>
  </defs>
  <g id="Artboard / Mobile Menu Open V2 — 390px" transform="translate(0, 0)">
        <rect id="Mobile Menu V2 Surface #173B63" width="390" height="860" rx="8" fill="#173B63" stroke="#E8A04A" stroke-width="1.5"/>

        <!-- Subtle Grid Hairlines inside Drawer -->
        <line x1="24" y1="76" x2="24" y2="860" stroke="#245B87" stroke-width="1"/>
        <line x1="0" y1="76" x2="390" y2="76" stroke="#245B87" stroke-width="1"/>

        <!-- Top Bar inside Open Menu -->
        <rect x="16" y="14" width="194" height="48" rx="4" fill="#FFFFFF"/>
        <!-- TARGET FOR MOBILE MENU OFFICIAL PNG LOGO (176 x 33 px) -->
        <rect id="Mobile Menu V2 Official Logo Target" x="25" y="21" width="176" height="33" fill="#254087"/>

        <!-- Close Button (48x48) -->
        <rect x="324" y="14" width="50" height="48" rx="6" fill="#102A46" stroke="#E8A04A" stroke-width="1.5"/>
        <line x1="339" y1="28" x2="359" y2="48" stroke="#E8A04A" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="359" y1="28" x2="339" y2="48" stroke="#E8A04A" stroke-width="2.2" stroke-linecap="round"/>

        <!-- Editorial Navigation List (Large Scale Manrope Bold) -->
        <g id="Mobile Menu V2 / Editorial Links" transform="translate(36, 118)">
          <text x="0" y="0" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="1.6">NAVEGACIÓN PRINCIPAL</text>

          <!-- 01 Nosotros -->
          <g transform="translate(0, 32)">
            <text x="0" y="16" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="800">01</text>
            <text x="34" y="28" fill="#FFFFFF" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="800">Nosotros</text>
            <rect x="34" y="38" width="90" height="3" fill="#E8A04A"/>
            <line x1="0" y1="54" x2="318" y2="54" stroke="#245B87" stroke-width="1"/>
          </g>

          <!-- 02 Servicios -->
          <g transform="translate(0, 108)">
            <text x="0" y="16" fill="#94A3B8" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="700">02</text>
            <text x="34" y="28" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="700">Servicios</text>
            <line x1="0" y1="54" x2="318" y2="54" stroke="#245B87" stroke-width="1"/>
          </g>

          <!-- 03 Comunidad -->
          <g transform="translate(0, 184)">
            <text x="0" y="16" fill="#94A3B8" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="700">03</text>
            <text x="34" y="28" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="700">Comunidad</text>
            <line x1="0" y1="54" x2="318" y2="54" stroke="#245B87" stroke-width="1"/>
          </g>

          <!-- 04 Historia -->
          <g transform="translate(0, 260)">
            <text x="0" y="16" fill="#94A3B8" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="700">04</text>
            <text x="34" y="28" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="700">Historia</text>
            <line x1="0" y1="54" x2="318" y2="54" stroke="#245B87" stroke-width="1"/>
          </g>

          <!-- 05 Contacto -->
          <g transform="translate(0, 336)">
            <text x="0" y="16" fill="#94A3B8" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="700">05</text>
            <text x="34" y="28" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="700">Contacto</text>
            <line x1="0" y1="54" x2="318" y2="54" stroke="#245B87" stroke-width="1"/>
          </g>
        </g>

        <!-- Language Selector inside Drawer -->
        <g id="Mobile Menu V2 / Language Selector" transform="translate(36, 548)">
          <text x="0" y="0" fill="#E8A04A" font-family="Manrope, Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4">IDIOMA / LANGUAGE</text>
          <rect x="0" y="16" width="318" height="48" rx="6" fill="#102A46" stroke="#245B87" stroke-width="1.5"/>
          <rect x="6" y="22" width="150" height="36" rx="4" fill="#E8A04A"/>
          <text x="44" y="45" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="14" font-weight="800">Español (ES)</text>
          <text x="200" y="45" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="14" font-weight="600">English (EN)</text>
        </g>

        <!-- Primary Drawer CTA: Solicitar orientación -->
        <g id="Mobile Menu V2 / Primary CTA" transform="translate(36, 646)">
          <rect width="318" height="58" rx="6" fill="#E8A04A"/>
          <circle cx="58" cy="29" r="5" fill="#173B63"/>
          <text x="76" y="35" fill="#173B63" font-family="Manrope, Inter, sans-serif" font-size="16" font-weight="800">Solicitar orientación</text>
        </g>

        <!-- Drawer Footer Note -->
        <text x="36" y="756" fill="#EAF1F6" font-family="Manrope, Inter, sans-serif" font-size="12" font-weight="700">El Rescate • Los Ángeles, California</text>
        <text x="36" y="778" fill="#94A3B8" font-family="Source Sans 3, Inter, sans-serif" font-size="12">Acompañamiento comunitario desde 1981.</text>
        <text x="36" y="814" fill="#E8A04A" font-family="Source Sans 3, Inter, sans-serif" font-size="11">Curva de apertura: cubic-bezier(0.32, 0.72, 0, 1) • 280ms</text>
      </g>
</svg>
```
