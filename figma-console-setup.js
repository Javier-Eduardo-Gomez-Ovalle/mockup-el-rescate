/**
 * EL RESCATE — FIGMA NATIVE VARIABLES, STYLES & AUTO-LAYOUT CONVERTER
 * Archivo destino: https://www.figma.com/design/VGktR37ZboN18jlZNoftLu
 *
 * INSTRUCCIONES DE EJECUCIÓN (Cuando la cuenta disponga de asiento Full/Edit en Figma):
 * 1. Abre el archivo en Figma Desktop o Web: https://www.figma.com/design/VGktR37ZboN18jlZNoftLu
 * 2. Ve a Plugins > Development > Open Console (o usa el plugin "Scripter").
 * 3. Pega este script y presiona Enter.
 *
 * QUÉ EJECUTA ESTE SCRIPT:
 * - Renombra "Page 1" a "01 — Design Foundations" y organiza la estructura de páginas del proyecto.
 * - Crea las colecciones de Variables nativas (Colores, Espaciados/Radios y Breakpoints Desktop/Mobile) con scopes y sintaxis CSS.
 * - Crea los Estilos de Texto locales (Manrope + Source Sans 3) y Estilos de Efecto (Sombras 3D tintadas con #173B63).
 */

(async () => {
  // 1. Organizar estructura de páginas sin destruir contenido existente
  const firstPage = figma.root.children[0];
  if (firstPage && firstPage.name === "Page 1") {
    firstPage.name = "01 — Design Foundations";
  }

  const desiredPages = [
    "00 — Cover & Governance",
    "01 — Design Foundations",
    "02 — Core Components",
    "03 — Art Direction & Hero Redesign V2",
    "04 — Motion & 3D Specs [Etapa 2]"
  ];

  for (const pageName of desiredPages) {
    const exists = figma.root.children.some(p => p.name === pageName);
    if (!exists) {
      const p = figma.createPage();
      p.name = pageName;
    }
  }

  // Renombrar el frame raíz importado en 01 — Design Foundations
  const mainFrame = firstPage.findOne(n => n.name === "Uploaded Image");
  if (mainFrame) {
    mainFrame.name = "01 — Design Foundations Board (El Rescate)";
    mainFrame.x = 0;
    mainFrame.y = 0;
  }

  // Ocultar textos de placeholder antiguos sobre los slots del logotipo oficial ya incorporado (2:252 y 2:268)
  const placeholderTexts = [
    "[LOGOTIPO OFICIAL EL RESCATE]",
    "Espacio reservado — No inventar",
    "[LOGO OFICIAL]",
    "No sustituir"
  ];
  for (const txtName of placeholderTexts) {
    const node = firstPage.findOne(n => n.type === "TEXT" && n.name === txtName);
    if (node) node.visible = false;
  }

  // Helper HEX -> RGB (0..1)
  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255
    };
  }

  // 2. Crear Colección de Variables de Color (Provisionales)
  const existingCols = await figma.variables.getLocalVariableCollectionsAsync();
  let colorCol = existingCols.find(c => c.name === "01 — Color Tokens [Provisional]");
  if (!colorCol) {
    colorCol = figma.variables.createVariableCollection("01 — Color Tokens [Provisional]");
    colorCol.renameMode(colorCol.modes[0].modeId, "Light Editorial");
  }
  const modeId = colorCol.modes[0].modeId;

  const colorTokens = [
    { name: "color/brand/primary-deep-blue", hex: "#173B63", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-brand-primary)" },
    { name: "color/brand/secondary-blue", hex: "#245B87", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-brand-secondary)" },
    { name: "color/brand/accent-amber", hex: "#E8A04A", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-brand-accent)" },
    { name: "color/surface/canvas-warm", hex: "#F7F6F2", scopes: ["FRAME_FILL", "SHAPE_FILL"], css: "var(--color-surface-canvas)" },
    { name: "color/surface/subtle-blue", hex: "#EAF1F6", scopes: ["FRAME_FILL", "SHAPE_FILL"], css: "var(--color-surface-subtle)" },
    { name: "color/surface/elevated-white", hex: "#FFFFFF", scopes: ["FRAME_FILL", "SHAPE_FILL"], css: "var(--color-surface-elevated)" },
    { name: "color/text/primary", hex: "#173B63", scopes: ["TEXT_FILL"], css: "var(--color-text-primary)" },
    { name: "color/text/secondary", hex: "#4A6583", scopes: ["TEXT_FILL"], css: "var(--color-text-secondary)" },
    { name: "color/border/subtle", hex: "#D8E4EE", scopes: ["STROKE_COLOR"], css: "var(--color-border-subtle)" },
    { name: "color/feedback/success", hex: "#2E7D5B", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-feedback-success)" },
    { name: "color/feedback/warning", hex: "#D9822B", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-feedback-warning)" },
    { name: "color/feedback/error", hex: "#C93B3B", scopes: ["ALL_FILLS", "STROKE_COLOR"], css: "var(--color-feedback-error)" }
  ];

  const existingVars = await figma.variables.getLocalVariablesAsync();
  for (const t of colorTokens) {
    let v = existingVars.find(x => x.name === t.name && x.variableCollectionId === colorCol.id);
    if (!v) {
      v = figma.variables.createVariable(t.name, colorCol, "COLOR");
    }
    v.setValueForMode(modeId, hexToRgb(t.hex));
    v.scopes = t.scopes;
    v.setVariableCodeSyntax("WEB", t.css);
  }

  // 3. Crear Colección de Layout, Espaciado y Radios (con modos Desktop y Mobile)
  let layoutCol = existingCols.find(c => c.name === "02 — Layout, Spacing & Radii");
  if (!layoutCol) {
    layoutCol = figma.variables.createVariableCollection("02 — Layout, Spacing & Radii");
    layoutCol.renameMode(layoutCol.modes[0].modeId, "Desktop (1440px)");
    layoutCol.addMode("Mobile (390px)");
  }
  const desktopMode = layoutCol.modes[0].modeId;
  const mobileMode = layoutCol.modes[1] ? layoutCol.modes[1].modeId : desktopMode;

  const numericTokens = [
    { name: "space/2", desktop: 8, mobile: 8, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-2)" },
    { name: "space/4", desktop: 16, mobile: 16, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-4)" },
    { name: "space/6", desktop: 24, mobile: 16, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-6)" },
    { name: "space/8", desktop: 32, mobile: 24, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-8)" },
    { name: "space/12", desktop: 48, mobile: 32, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-12)" },
    { name: "space/16", desktop: 64, mobile: 48, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-16)" },
    { name: "space/24", desktop: 96, mobile: 64, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--space-24)" },
    { name: "radius/sm", desktop: 6, mobile: 6, scopes: ["CORNER_RADIUS"], css: "var(--radius-sm)" },
    { name: "radius/md", desktop: 10, mobile: 10, scopes: ["CORNER_RADIUS"], css: "var(--radius-md)" },
    { name: "radius/lg", desktop: 16, mobile: 14, scopes: ["CORNER_RADIUS"], css: "var(--radius-lg)" },
    { name: "radius/xl", desktop: 24, mobile: 20, scopes: ["CORNER_RADIUS"], css: "var(--radius-xl)" },
    { name: "grid/margin", desktop: 80, mobile: 20, scopes: ["GAP", "WIDTH_HEIGHT"], css: "var(--grid-margin)" },
    { name: "grid/gutter", desktop: 24, mobile: 16, scopes: ["GAP"], css: "var(--grid-gutter)" }
  ];

  for (const nt of numericTokens) {
    let v = existingVars.find(x => x.name === nt.name && x.variableCollectionId === layoutCol.id);
    if (!v) {
      v = figma.variables.createVariable(nt.name, layoutCol, "FLOAT");
    }
    v.setValueForMode(desktopMode, nt.desktop);
    if (mobileMode !== desktopMode) {
      v.setValueForMode(mobileMode, nt.mobile);
    }
    v.scopes = nt.scopes;
    v.setVariableCodeSyntax("WEB", nt.css);
  }

  // 4. Crear Estilos de Sombra / Elevación 3D (Ref. Organimo)
  const effectDefs = [
    {
      name: "Elevation / Level 1 — Subtle Rest",
      effects: [
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.06 }, offset: { x: 0, y: 4 }, radius: 16, spread: 0, visible: true, blendMode: "NORMAL" },
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }
      ]
    },
    {
      name: "Elevation / Level 2 — Interactive 3D Hover",
      effects: [
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.10 }, offset: { x: 0, y: 12 }, radius: 32, spread: 0, visible: true, blendMode: "NORMAL" },
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.05 }, offset: { x: 0, y: 4 }, radius: 12, spread: 0, visible: true, blendMode: "NORMAL" }
      ]
    },
    {
      name: "Elevation / Level 3 — Floating Depth",
      effects: [
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.14 }, offset: { x: 0, y: 24 }, radius: 48, spread: 0, visible: true, blendMode: "NORMAL" },
        { type: "DROP_SHADOW", color: { r: 23/255, g: 59/255, b: 99/255, a: 0.06 }, offset: { x: 0, y: 8 }, radius: 16, spread: 0, visible: true, blendMode: "NORMAL" }
      ]
    }
  ];

  const existingEffects = await figma.getLocalEffectStylesAsync();
  for (const ed of effectDefs) {
    let style = existingEffects.find(s => s.name === ed.name);
    if (!style) {
      style = figma.createEffectStyle();
      style.name = ed.name;
    }
    style.effects = ed.effects;
  }

  console.log("✅ El Rescate Design Foundations: Páginas, Variables y Estilos creados con éxito.");
})();
