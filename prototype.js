/* ==========================================================================
   EL RESCATE — PROTOTIPO WEB INTERACTIVO INTEGRAL (prototype.js)
   Incluye:
   1. Preloader + Lenis Smooth Scroll + GSAP ScrollTrigger
   2. Gooey Liquid Metaball Navigation (Video 3 Riff)
   3. Conmutador Bilingüe ES / EN
   4. Manifiesto Scroll-Scrubbed Palabra por Palabra (Video 1 Nexora)
   5. Sticky Split Scroll + Contadores Bento
   6. RIFF 28 "Card Shuffle" (Video 4) + Arco 3D (Video 2 C&A)
   7. Galería Espacial 3D "UNVEIL® PROJECTS" (Imagen 2)
   8. Escena 3D Three.js del Autobús Comunitario (1981–2026) + Ruta Nexora
   9. Calendario Interactivo de Clínica Legal (Noviembre/Diciembre 2026) + Evaluador (Imagen 1)
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================================================
  // 1. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER
  // ==========================================================================
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    lenis = new window.Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    if (typeof window.ScrollTrigger !== "undefined") {
      lenis.on("scroll", window.ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  if (typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  // ==========================================================================
  // 2. PRELOADER CINEMATOGRÁFICO + ENTRADA DEL HERO (Video 1 NEXORA + V3)
  // ==========================================================================
  const preloaderEl = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloader-bar");

  function runIntroChoreography() {
    if (!preloaderEl) return;

    if (reduceMotion) {
      preloaderEl.style.display = "none";
      return;
    }

    const introTl = gsap.timeline({
      onComplete: () => {
        preloaderEl.style.display = "none";
      }
    });

    introTl
      .to(preloaderBar, {
        width: "100%",
        duration: 0.65,
        ease: "power2.inOut"
      })
      .to(
        preloaderEl,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.72,
          ease: "power3.inOut"
        },
        "+=0.08"
      )
      .from(
        ".hero-headline__line-inner",
        {
          yPercent: 105,
          duration: 0.78,
          stagger: 0.08,
          ease: "power3.out"
        },
        "-=0.42"
      )
      .from(
        [".hero-lead", ".hero-cta-row", "#hero-plane-z3"],
        {
          y: 22,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out"
        },
        "-=0.48"
      )
      .from(
        "#hero-notched-stage",
        {
          y: 28,
          scale: 0.97,
          autoAlpha: 0,
          duration: 0.82,
          ease: "power3.out"
        },
        "-=0.62"
      );
  }

  window.addEventListener("DOMContentLoaded", runIntroChoreography);

  // Efecto 3D sutil de inclinación sobre el escenario biselado del Hero
  const heroTiltFrame = document.getElementById("hero-tilt-frame");
  const heroMainImg = document.getElementById("hero-main-img");
  if (heroTiltFrame && !reduceMotion) {
    heroTiltFrame.addEventListener("mousemove", (e) => {
      const rect = heroTiltFrame.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(heroTiltFrame, {
        rotateY: nx * 5.5,
        rotateX: -ny * 4.5,
        duration: 0.4,
        ease: "power2.out"
      });
      if (heroMainImg) {
        gsap.to(heroMainImg, {
          x: -nx * 14,
          y: -ny * 14,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });

    heroTiltFrame.addEventListener("mouseleave", () => {
      gsap.to(heroTiltFrame, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power3.out"
      });
      if (heroMainImg) {
        gsap.to(heroMainImg, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      }
    });
  }

  // ==========================================================================
  // 3. GOOEY LIQUID METABALL NAVIGATION (Video 3: riff-07c35a71)
  // ==========================================================================
  const navButtons = Array.from(document.querySelectorAll(".gooey-nav-btn"));
  const blobMain = document.getElementById("gooey-blob-main");
  const blobTrail = document.getElementById("gooey-blob-trail");

  function moveGooeyPillToButton(targetBtn, immediate = false) {
    if (!targetBtn || !blobMain || !blobTrail) return;

    navButtons.forEach((b) => b.classList.toggle("is-active", b === targetBtn));

    const listEl = targetBtn.closest(".gooey-nav-list");
    if (!listEl) return;

    const x = targetBtn.offsetLeft;
    const w = targetBtn.offsetWidth;

    if (immediate || reduceMotion) {
      gsap.set([blobMain, blobTrail], { x, width: w });
      return;
    }

    // La gota principal se desplaza con elasticidad rápida; la gota secundaria (trail)
    // la sigue unas milésimas después y se fusiona gracias al filtro SVG #gooey-metaball
    gsap.to(blobMain, {
      x,
      width: w,
      duration: 0.46,
      ease: "elastic.out(1, 0.76)",
      overwrite: "auto"
    });

    gsap.to(blobTrail, {
      x: x + w * 0.08,
      width: w * 0.84,
      duration: 0.64,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      moveGooeyPillToButton(btn);
      const targetSel = btn.getAttribute("data-target");
      const targetEl = targetSel ? document.querySelector(targetSel) : null;
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  window.addEventListener("load", () => {
    const activeBtn = document.querySelector(".gooey-nav-btn.is-active") || navButtons[0];
    moveGooeyPillToButton(activeBtn, true);
  });
  window.addEventListener("resize", () => {
    const activeBtn = document.querySelector(".gooey-nav-btn.is-active") || navButtons[0];
    moveGooeyPillToButton(activeBtn, true);
  });

  // ==========================================================================
  // 4. CONMUTADOR BILINGÜE INTEGRAL (ES / EN) — TODA LA PÁGINA Y VISTAS
  // ==========================================================================
  let currentLang = "es";

  const I18N_DICT = {
    es: {
      nav_home: "Inicio",
      nav_about: "Nosotros",
      nav_services: "Servicios",
      nav_archive: "Archivo 3D",
      nav_history: "Historia 3D",
      nav_donate: "Donaciones",
      nav_clinic: "Clínica / Citas",
      cta_header: "Solicitar orientación",
      hero_kicker: "LOS ÁNGELES, CALIFORNIA • DESDE 1981",
      hero_h1_1: "Una comunidad",
      hero_h1_2: "más fuerte comienza",
      hero_h1_3: "con oportunidades",
      hero_lead:
        "Desde 1981 acompañamos a personas y familias inmigrantes en Los Ángeles con orientación jurídica cercana, defensa de su dignidad y caminos reales hacia el bienestar comunitario.",
      hero_cta_primary: "Reservar charla en clínica",
      hero_cta_secondary: "Conoce nuestros servicios",
      hero_z3_tag: "PLANO DOCUMENTAL Z-3 • WESTLAKE",
      hero_z3_title: "Cuatro décadas de arraigo en L.A.",
      hero_z3_sub: "Orientación legal, clínicas de miércoles y sábados y defensa comunitaria sin barreras.",
      hero_badge_families: "+45,000 familias acompañadas",
      hero_route_status: "● CLÍNICA COMUNITARIA ACTIVA",
      hero_route_dest: "Comunidad",
      hero_route_hours: "Mié 2–5 PM • Sáb 10–1 PM",
      hero_route_conf: "100% Confidencial",
      hero_cap_title: "Memoria viva y presente comunitario en Los Ángeles",
      hero_cap_desc:
        "Nacida en el corazón de Westlake en 1981, El Rescate camina junto a la población inmigrante construyendo arraigo, dignidad y futuro compartido.",
      manifesto_eyebrow: "NUESTRA MISIÓN DESDE 1981 • SCROLL REVEAL",
      why_tab: "¿Por qué confiar en El Rescate?",
      why_1_title: "Defensa Legal con Historia",
      why_1_desc:
        "Pioneros desde 1981 en casos de asilo, acuerdos históricos ABC, TPS, NACARA, DACA y reunificación familiar en California.",
      why_2_title: "Trato Humano y Bilingüe",
      why_2_desc:
        "Cada consulta se realiza en tu idioma, con respeto absoluto por la historia de tu familia y sin tecnicismos intimidantes.",
      why_3_title: "Confidencialidad Absoluta",
      why_3_desc:
        "Tus datos y consultas están protegidos bajo secreto profesional. Jamás compartimos información con autoridades migratorias.",
      impact_kicker: "IMPACTO COMUNITARIO EN CIFRAS",
      impact_title_1: "Soluciones integrales construidas",
      impact_title_2: "para ir más lejos",
      impact_sub:
        "Combinamos rigor jurídico, clínicas comunitarias semanales y educación financiera para fortalecer a toda la comunidad inmigrante del sur de California.",
      impact_replay_btn: "↻ Decodificar cifras en tiempo real",
      bento_hero_kicker: "SEDE HISTÓRICA EN WESTLAKE, L.A.",
      bento_hero_title: "De refugio humanitario en 1981 a institución comunitaria de referencia",
      bento_hero_cta: "Explorar Autobús Histórico 3D →",
      split_kicker: "MODELO DE ATENCIÓN INTEGRAL",
      split_title_1: "Construido sobre confianza.",
      split_title_2: "Impulsado por dignidad.",
      split_sub:
        "A medida que avanzas, conoce los tres pilares con los que acompañamos a cada persona desde su primera charla hasta la resolución de su caso.",
      pillar_1_title: "Representación y Orientación Legal",
      pillar_1_body:
        "Evaluación honesta de elegibilidad para asilo, TPS, DACA, peticiones familiares, visas humanitarias (U/VAWA) y naturalización.",
      pillar_2_title: "Clínicas Legales de Miércoles y Sábados",
      pillar_2_body:
        "Jornadas semanales de orientación comunitaria con reserva en línea para resolver dudas urgentes en un entorno seguro.",
      pillar_3_title: "Empoderamiento Económico y Social",
      pillar_3_body:
        "Asesoría para pequeños negocios migrantes, talleres de ciudadanía y redes de apoyo familiar en Los Ángeles.",
      wipe_1_tag: "PILAR 01 • DEFENSA JURÍDICA",
      wipe_1_title: "Amparo y Representación Ética",
      wipe_1_desc: "Más de cuatro décadas defendiendo el derecho a permanecer en familia.",
      wipe_1_kpi1: "Casos con seguimiento",
      wipe_1_kpi2: "Origen en L.A.",
      wipe_2_tag: "PILAR 02 • CLÍNICAS SEMANALES",
      wipe_2_title: "Charlas Legales Miércoles y Sábados",
      wipe_2_desc: "Agenda tu horario en menos de un minuto sin compartir datos con terceros.",
      wipe_2_kpi1: "Jornadas por semana",
      wipe_2_kpi2: "Privacidad garantizada",
      wipe_3_tag: "PILAR 03 • COMUNIDAD Y FUTURO",
      wipe_3_title: "Raíz Cultural y Futuro Económico",
      wipe_3_desc: "Formación cívica, ciudadanía y fortalecimiento del tejido vecinal en Westlake.",
      wipe_3_kpi1: "Acompañamiento",
      wipe_3_kpi2: "Atención bilingüe",
      srv_eyebrow: "ÁREAS DE PRÁCTICA Y PROGRAMAS • INTERACTIVO",
      srv_title: "Explora nuestros servicios en Mazo Shuffle o Arco 3D",
      srv_mode_shuffle: "Mazo Interactivo (Card Shuffle)",
      srv_mode_arc: "Galería en Arco 3D",
      srv_cta_book: "Agendar consulta para este servicio →",
      srv_cta_shuffle: "Barajar siguiente tarjeta ↻",
      arc_1_tag: "01 • PROTECCIÓN",
      arc_1_title: "Asilo, Refugio y Visas U/VAWA",
      arc_2_tag: "02 • AMPARO LEGAL",
      arc_2_title: "Renovaciones TPS, DACA y NACARA",
      arc_3_tag: "03 • REUNIFICACIÓN",
      arc_3_title: "Peticiones Familiares y Residencia",
      arc_4_tag: "04 • CIUDADANÍA",
      arc_4_title: "Naturalización y Talleres Cívicos",
      arc_5_tag: "05 • COMUNIDAD",
      arc_5_title: "Clínicas Semanales y Microfinanzas",
      unveil_cell_1: "EL RESCATE® ARCHIVO VIVO",
      unveil_cell_3: "CAPAS DE IMPACTO 3D",
      unveil_cell_4_l: "INTERACCIÓN",
      unveil_cell_4_r: "CLICK PARA EXPANDIR IMAGEN",
      unveil_btn_overview: "OVERVIEW (CAPAS 3D)",
      unveil_btn_index: "INDEX (CUADRÍCULA)",
      unveil_f_all: "TODAS",
      unveil_f_legal: "DEFENSA LEGAL",
      unveil_f_comm: "COMUNIDAD & CULTURA",
      unveil_f_clinic: "CLÍNICAS SEMANALES",
      hist_eyebrow: "RECORRIDO HISTÓRICO INTERACTIVO EN THREE.JS / WEBGL",
      hist_route_title: "Cada década de compromiso comunitario, seguida paso a paso (1981 — 2026)",
      hist_route_hint: "Haz clic en cualquier año, polaroid o flecha para explorar e inspeccionar imágenes",
      hist_stage_sub: "IMMIGRATION, COMMUNITY & LEGAL SERVICES • ARCHIVO 3D",
      hist_polaroid_lbl: "ARCHIVO FOTOGRÁFICO",
      hist_clip_top: "EL RESCATE • LEGAL DOCKET",
      don_eyebrow: "SOLIDARIDAD EN ACCIÓN • ONG 501(c)(3) DESDE 1981",
      don_h2_pre: "Tu aporte construye un",
      don_h2_hi: "refugio seguro",
      don_h2_post: "para miles de familias.",
      don_lead:
        "Cada contribución sostiene directamente nuestras brigadas de defensa jurídica, clínicas gratuitas de miércoles y sábados y el acompañamiento humano a familias inmigrantes en Los Ángeles.",
      don_wid_top: "DESTINO DE TU APORTE SOLIDARIO",
      don_wid_badge: "● CAMPAÑAS HABILITADAS",
      camp_tab_org: "Organización General",
      camp_tab_asilo: "Defensa Legal y Asilo",
      camp_tab_clinicas: "Clínicas Comunitarias",
      camp_tab_daca: "Futuro Joven & DACA",
      don_amt_label: "Selecciona el monto de tu donación (USD)",
      don_other_amt: "Otra cantidad",
      don_ssl_note: "Pasarela Segura SSL • Organización 501(c)(3) Deducible de Impuestos",
      clinic_kicker: "ORIENTACIÓN LEGAL PRESENCIAL Y CONFIDENCIAL",
      clinic_title: "Agenda tu charla en la clínica",
      clinic_sub:
        "Selecciona uno de los días marcados en azul (miércoles o sábados), elige tu horario y confirmaremos tu cita.",
      clinic_avail_title: "Disponibilidad de la clínica",
      clinic_wed: "Miércoles",
      clinic_sat: "Sábados",
      wd_sun: "DOM",
      wd_mon: "LUN",
      wd_tue: "MAR",
      wd_wed: "MIÉ",
      wd_thu: "JUE",
      wd_fri: "VIE",
      wd_sat: "SÁB",
      clinic_legend: "Días con charla",
      clinic_form_title: "Tus datos",
      clinic_your_choice: "Tu elección:",
      lbl_fullname: "Nombre completo",
      ph_fullname: "Ej. María Elena Morales",
      lbl_phone: "Teléfono",
      lbl_email: "Correo electrónico",
      ph_email: "correo@ejemplo.com",
      lbl_case_type: "Tipo de caso",
      opt_select: "Selecciona una opción",
      opt_asilo: "Asilo / Refugio Humanitario",
      opt_tps: "TPS / Ley NACARA",
      opt_daca: "Renovación o Consulta DACA",
      opt_family: "Petición Familiar / Residencia",
      opt_cit: "Ciudadanía y Naturalización",
      opt_visau: "Visa U / Protección VAWA",
      opt_gen: "Orientación General en Clínica",
      btn_book_submit: "Reservar mi charla",
      clinic_privacy_note:
        "Usamos tus datos solo para confirmar tu charla. Nunca los compartimos con autoridades de inmigración.",
      chk_back_btn: "Volver al sitio principal de El Rescate",
      chk_portal_tag: "PORTAL OFICIAL DE DONACIONES • 501(c)(3)",
      chk_selected_kicker: "CAMPAÑA SELECCIONADA PARA TU APORTE",
      chk_switch_lbl: "¿Deseas cambiar la campaña destino?",
      chk_alloc_title: "Transparencia y destino de fondos en esta campaña",
      chk_deliv_title: "Lo que tu donación hace posible hoy:",
      chk_ngo_title: "El Rescate • Organización sin Fines de Lucro 501(c)(3)",
      chk_ngo_seal: "100% DEDUCIBLE",
      chk_sum_eyebrow: "RESUMEN DE TU DONACIÓN",
      chk_sec1_title: "1. Confirma el monto y frecuencia de tu aporte",
      chk_freq_once: "✓ Aporte Único Solidario",
      chk_freq_monthly: "↻ Aporte Mensual Continuo (Protector Comunitario)",
      chk_sec2_title: "2. Datos del donante (para recibo fiscal 501c3)",
      chk_lbl_fname: "Nombre(s) *",
      chk_ph_fname: "Ej. Carlos Alberto",
      chk_lbl_lname: "Apellidos *",
      chk_ph_lname: "Ej. Mendoza Ríos",
      chk_lbl_email: "Correo electrónico *",
      chk_lbl_phone: "Teléfono de contacto",
      chk_lbl_city: "Ciudad / Estado",
      chk_lbl_zip: "Código Postal",
      chk_lbl_msg: "Dedicatoria o nota para la campaña (Opcional)",
      chk_ph_msg: "Ej. En honor a las familias trabajadoras de nuestra comunidad en L.A.",
      chk_sec3_title: "3. Método de pago seguro",
      chk_pay_card: "💳 Tarjeta de Crédito / Débito",
      chk_pay_ach: "🏦 Transferencia ACH / Zelle",
      chk_pay_paypal: "🛡️ PayPal Solidario",
      chk_lbl_cholder: "Nombre en la tarjeta",
      chk_lbl_cnum: "Número de tarjeta",
      chk_lbl_cexp: "Vencimiento (MM/AA)",
      chk_lbl_ccvv: "Código CVV",
      chk_ach_title: "Transferencia Institucional Directa (Sin comisiones de red)",
      chk_ach_desc:
        "Puedes realizar tu aporte mediante transferencia bancaria ACH o Zelle oficial a nombre de El Rescate (501c3):",
      chk_ach_ref: "Referencia automática:",
      chk_pp_title: "PayPal Giving Fund & Billetera Digital",
      chk_pp_desc:
        "Al confirmar tu donación se vinculará directamente con la cuenta institucional verificada de El Rescate Los Ángeles con emisión inmediata de comprobante fiscal.",
      chk_sec_footer:
        "🔒 Transacción protegida con cifrado de 256 bits. El Rescate emite certificado fiscal deducible 501(c)(3) al instante.",
      fab_tooltip: "Asistente Virtual",
      bot_head_kicker: "● EN LÍNEA • PRE-EVALUACIÓN INTERACTIVA",
      bot_head_title: "Asistente de El Rescate",
      bot_opt_hint: "Selecciona un tema o respuesta para continuar la conversación:",
      lightbox_cta: "Solicitar orientación relacionada →",
      lightbox_close_btn: "Cerrar vista ampliada",
      footer_title: "El Rescate — Los Ángeles, California",
      footer_sub: "1501 W. 8th Street, Los Angeles, CA 90017 • Desde 1981 junto a la comunidad inmigrante",
      footer_badge: "PROTOTIPO INTERACTIVO INTEGRAL • THREE.JS + GSAP + LENIS"
    },
    en: {
      nav_home: "Home",
      nav_about: "About Us",
      nav_services: "Services",
      nav_archive: "3D Archive",
      nav_history: "3D History",
      nav_donate: "Donate",
      nav_clinic: "Legal Clinic",
      cta_header: "Request Guidance",
      hero_kicker: "LOS ANGELES, CALIFORNIA • SINCE 1981",
      hero_h1_1: "A stronger",
      hero_h1_2: "community begins",
      hero_h1_3: "with opportunity",
      hero_lead:
        "Since 1981 we have walked alongside immigrant individuals and families in Los Angeles with trusted legal guidance, dignity defense, and real pathways to community well-being.",
      hero_cta_primary: "Book a Legal Clinic Session",
      hero_cta_secondary: "Explore Our Services",
      hero_z3_tag: "DOCUMENTARY PLANE Z-3 • WESTLAKE",
      hero_z3_title: "Four Decades of Roots in L.A.",
      hero_z3_sub: "Legal representation, Wednesday & Saturday clinics, and barrier-free community advocacy.",
      hero_badge_families: "+45,000 families supported",
      hero_route_status: "● ACTIVE COMMUNITY CLINIC",
      hero_route_dest: "Community",
      hero_route_hours: "Wed 2–5 PM • Sat 10–1 PM",
      hero_route_conf: "100% Confidential",
      hero_cap_title: "Living Memory & Community Present in Los Angeles",
      hero_cap_desc:
        "Founded in the heart of Westlake in 1981, El Rescate walks alongside the immigrant community building roots, dignity, and a shared future.",
      manifesto_eyebrow: "OUR MISSION SINCE 1981 • SCROLL REVEAL",
      why_tab: "Why Trust El Rescate?",
      why_1_title: "Historic Legal Defense",
      why_1_desc:
        "Pioneers since 1981 in asylum representation, historic ABC settlement cases, TPS, NACARA, DACA, and family reunification across California.",
      why_2_title: "Human & Bilingual Care",
      why_2_desc:
        "Every consultation is conducted in your language, with deep respect for your family's story and zero intimidating jargon.",
      why_3_title: "Absolute Confidentiality",
      why_3_desc:
        "Your information and consultations are protected by strict legal privilege. We never share data with immigration authorities.",
      impact_kicker: "COMMUNITY IMPACT IN NUMBERS",
      impact_title_1: "Comprehensive solutions built",
      impact_title_2: "to go further",
      impact_sub:
        "We combine legal rigor, weekly community clinics, and financial empowerment to strengthen the entire immigrant community of Southern California.",
      impact_replay_btn: "↻ Decode figures in real time",
      bento_hero_kicker: "HISTORIC HEADQUARTERS IN WESTLAKE, L.A.",
      bento_hero_title: "From a humanitarian refuge in 1981 to a landmark community institution",
      bento_hero_cta: "Explore 3D Historic Bus →",
      split_kicker: "HOLISTIC CARE MODEL",
      split_title_1: "Built on trust.",
      split_title_2: "Driven by dignity.",
      split_sub:
        "As you scroll, explore the three pillars through which we accompany every person from their first clinic consultation to the resolution of their case.",
      pillar_1_title: "Legal Representation & Guidance",
      pillar_1_body:
        "Honest eligibility evaluations for asylum, TPS, DACA, family petitions, humanitarian visas (U/VAWA), and naturalization.",
      pillar_2_title: "Wednesday & Saturday Legal Clinics",
      pillar_2_body:
        "Weekly community orientation sessions with online booking to answer urgent legal questions in a safe environment.",
      pillar_3_title: "Economic & Social Empowerment",
      pillar_3_body:
        "Small-business advising for immigrant entrepreneurs, citizenship workshops, and family support networks in Los Angeles.",
      wipe_1_tag: "PILLAR 01 • LEGAL DEFENSE",
      wipe_1_title: "Ethical Protection & Advocacy",
      wipe_1_desc: "Over four decades defending the fundamental right to remain together as a family.",
      wipe_1_kpi1: "Active case follow-up",
      wipe_1_kpi2: "Founded in L.A.",
      wipe_2_tag: "PILLAR 02 • WEEKLY CLINICS",
      wipe_2_title: "Wednesday & Saturday Legal Sessions",
      wipe_2_desc: "Book your time slot in under a minute without ever sharing data with third parties.",
      wipe_2_kpi1: "Sessions per week",
      wipe_2_kpi2: "Guaranteed privacy",
      wipe_3_tag: "PILLAR 03 • COMMUNITY & FUTURE",
      wipe_3_title: "Cultural Roots & Economic Future",
      wipe_3_desc: "Civic education, citizenship preparation, and neighborhood empowerment in Westlake.",
      wipe_3_kpi1: "Holistic support",
      wipe_3_kpi2: "Bilingual care",
      srv_eyebrow: "PRACTICE AREAS & PROGRAMS • INTERACTIVE",
      srv_title: "Explore our services in Shuffle Deck or 3D Arc",
      srv_mode_shuffle: "Interactive Deck (Card Shuffle)",
      srv_mode_arc: "3D Arc Gallery",
      srv_cta_book: "Book consultation for this service →",
      srv_cta_shuffle: "Shuffle next card ↻",
      arc_1_tag: "01 • PROTECTION",
      arc_1_title: "Asylum, Refuge & U/VAWA Visas",
      arc_2_tag: "02 • LEGAL RELIEF",
      arc_2_title: "TPS, DACA & NACARA Renewals",
      arc_3_tag: "03 • REUNIFICATION",
      arc_3_title: "Family Petitions & Residency",
      arc_4_tag: "04 • CITIZENSHIP",
      arc_4_title: "Naturalization & Civic Workshops",
      arc_5_tag: "05 • COMMUNITY",
      arc_5_title: "Weekly Clinics & Microfinance",
      unveil_cell_1: "EL RESCATE® LIVING ARCHIVE",
      unveil_cell_3: "3D IMPACT LAYERS",
      unveil_cell_4_l: "INTERACTION",
      unveil_cell_4_r: "CLICK TO EXPAND IMAGE",
      unveil_btn_overview: "OVERVIEW (3D LAYERS)",
      unveil_btn_index: "INDEX (GRID VIEW)",
      unveil_f_all: "ALL",
      unveil_f_legal: "LEGAL DEFENSE",
      unveil_f_comm: "COMMUNITY & CULTURE",
      unveil_f_clinic: "WEEKLY CLINICS",
      hist_eyebrow: "INTERACTIVE 3D HISTORICAL JOURNEY IN THREE.JS / WEBGL",
      hist_route_title: "Every decade of community commitment, followed step by step (1981 — 2026)",
      hist_route_hint: "Click any year, polaroid, or arrow to move the 3D bus and inspect archival photos",
      hist_stage_sub: "IMMIGRATION, COMMUNITY & LEGAL SERVICES • 3D ARCHIVE",
      hist_polaroid_lbl: "PHOTO ARCHIVE",
      hist_clip_top: "EL RESCATE • LEGAL DOCKET",
      don_eyebrow: "SOLIDARITY IN ACTION • 501(c)(3) NONPROFIT SINCE 1981",
      don_h2_pre: "Your contribution builds a",
      don_h2_hi: "safe haven",
      don_h2_post: "for thousands of families.",
      don_lead:
        "Every contribution directly sustains our legal defense brigades, free Wednesday and Saturday clinics, and human accompaniment for immigrant families in Los Angeles.",
      don_wid_top: "DESTINATION OF YOUR SOLIDARITY GIFT",
      don_wid_badge: "● ACTIVE CAMPAIGNS",
      camp_tab_org: "General Organization",
      camp_tab_asilo: "Legal Defense & Asylum",
      camp_tab_clinicas: "Community Clinics",
      camp_tab_daca: "Youth Future & DACA",
      don_amt_label: "Select your donation amount (USD)",
      don_other_amt: "Custom amount",
      don_ssl_note: "Secure SSL Gateway • Tax-Deductible 501(c)(3) Nonprofit Organization",
      clinic_kicker: "IN-PERSON & CONFIDENTIAL LEGAL GUIDANCE",
      clinic_title: "Schedule your legal clinic session",
      clinic_sub:
        "Select one of the days highlighted in blue (Wednesdays or Saturdays), choose your time slot, and we will confirm your appointment.",
      clinic_avail_title: "Clinic availability",
      clinic_wed: "Wednesdays",
      clinic_sat: "Saturdays",
      wd_sun: "SUN",
      wd_mon: "MON",
      wd_tue: "TUE",
      wd_wed: "WED",
      wd_thu: "THU",
      wd_fri: "FRI",
      wd_sat: "SAT",
      clinic_legend: "Available clinic days",
      clinic_form_title: "Your details",
      clinic_your_choice: "Your selection:",
      lbl_fullname: "Full name",
      ph_fullname: "E.g. Maria Elena Morales",
      lbl_phone: "Phone number",
      lbl_email: "Email address",
      ph_email: "email@example.com",
      lbl_case_type: "Case type",
      opt_select: "Select an option",
      opt_asilo: "Asylum / Humanitarian Refuge",
      opt_tps: "TPS / NACARA Relief",
      opt_daca: "DACA Renewal or Consultation",
      opt_family: "Family Petition / Residency",
      opt_cit: "Citizenship & Naturalization",
      opt_visau: "U Visa / VAWA Protection",
      opt_gen: "General Clinic Orientation",
      btn_book_submit: "Book my clinic session",
      clinic_privacy_note:
        "We use your information solely to confirm your session. We never share it with immigration authorities.",
      chk_back_btn: "Back to El Rescate main website",
      chk_portal_tag: "OFFICIAL DONATION PORTAL • 501(c)(3)",
      chk_selected_kicker: "SELECTED CAMPAIGN FOR YOUR GIFT",
      chk_switch_lbl: "Would you like to switch the destination campaign?",
      chk_alloc_title: "Fund transparency & allocation in this campaign",
      chk_deliv_title: "What your donation makes possible today:",
      chk_ngo_title: "El Rescate • 501(c)(3) Nonprofit Organization",
      chk_ngo_seal: "100% TAX-DEDUCTIBLE",
      chk_sum_eyebrow: "DONATION SUMMARY",
      chk_sec1_title: "1. Confirm your gift amount and frequency",
      chk_freq_once: "✓ One-Time Solidarity Gift",
      chk_freq_monthly: "↻ Monthly Ongoing Gift (Community Sustainer)",
      chk_sec2_title: "2. Donor information (for 501c3 tax receipt)",
      chk_lbl_fname: "First name(s) *",
      chk_ph_fname: "E.g. Carlos Alberto",
      chk_lbl_lname: "Last name(s) *",
      chk_ph_lname: "E.g. Mendoza Rios",
      chk_lbl_email: "Email address *",
      chk_lbl_phone: "Contact phone",
      chk_lbl_city: "City / State",
      chk_lbl_zip: "ZIP Code",
      chk_lbl_msg: "Dedication or note for this campaign (Optional)",
      chk_ph_msg: "E.g. In honor of working immigrant families in Los Angeles.",
      chk_sec3_title: "3. Secure payment method",
      chk_pay_card: "💳 Credit / Debit Card",
      chk_pay_ach: "🏦 ACH / Official Zelle",
      chk_pay_paypal: "🛡️ PayPal Giving",
      chk_lbl_cholder: "Name on card",
      chk_lbl_cnum: "Card number",
      chk_lbl_cexp: "Expiration (MM/YY)",
      chk_lbl_ccvv: "CVV Code",
      chk_ach_title: "Direct Institutional Transfer (Zero network fees)",
      chk_ach_desc:
        "You can complete your contribution via ACH bank transfer or official Zelle to El Rescate (501c3):",
      chk_ach_ref: "Automatic reference:",
      chk_pp_title: "PayPal Giving Fund & Digital Wallet",
      chk_pp_desc:
        "Upon confirming your gift, it will link directly with the verified institutional account of El Rescate Los Angeles with instant tax receipt issuance.",
      chk_sec_footer:
        "🔒 256-bit encrypted transaction. El Rescate issues an instant 501(c)(3) tax-deductible receipt.",
      fab_tooltip: "Virtual Assistant",
      bot_head_kicker: "● ONLINE • INTERACTIVE PRE-EVALUATION",
      bot_head_title: "El Rescate Assistant",
      bot_opt_hint: "Select a topic or reply below to continue the conversation:",
      lightbox_cta: "Request related legal guidance →",
      lightbox_close_btn: "Close expanded view",
      footer_title: "El Rescate — Los Angeles, California",
      footer_sub: "1501 W. 8th Street, Los Angeles, CA 90017 • Standing with the immigrant community since 1981",
      footer_badge: "COMPREHENSIVE INTERACTIVE PROTOTYPE • THREE.JS + GSAP + LENIS"
    }
  };

  // ==========================================================================
  // 5. MANIFIESTO SCROLL-SCRUBBED PALABRA POR PALABRA (BILINGÜE ES / EN)
  // ==========================================================================
  const MANIFESTO_I18N = {
    es: {
      text: "Fundada en 1981 por una necesidad humanitaria urgente, nacimos para brindar representación legal ética, refugio comunitario y oportunidades económicas a cada familia inmigrante que construye su vida en Los Ángeles.",
      accents: new Set([
        "1981",
        "humanitaria",
        "representación",
        "legal",
        "ética,",
        "refugio",
        "oportunidades",
        "económicas",
        "Los",
        "Ángeles."
      ])
    },
    en: {
      text: "Founded in 1981 out of an urgent humanitarian need, we were born to provide ethical legal representation, community refuge, and economic opportunity to every immigrant family building a life in Los Angeles.",
      accents: new Set([
        "1981",
        "humanitarian",
        "ethical",
        "legal",
        "representation,",
        "refuge,",
        "economic",
        "opportunity",
        "Los",
        "Angeles."
      ])
    }
  };

  const manifestoEl = document.getElementById("scrub-manifesto");
  let manifestoScrollProgress = 1;

  function renderManifestoWords() {
    if (!manifestoEl) return;
    const cfg = MANIFESTO_I18N[currentLang] || MANIFESTO_I18N.es;
    const rawWords = cfg.text.trim().split(/\s+/);
    manifestoEl.innerHTML = rawWords
      .map((w) => {
        const cls = cfg.accents.has(w) ? "scrub-word scrub-word--accent" : "scrub-word";
        return `<span class="${cls}">${w}</span>`;
      })
      .join(" ");

    const wordSpans = manifestoEl.querySelectorAll(".scrub-word");
    const litCount = Math.floor(manifestoScrollProgress * wordSpans.length);
    wordSpans.forEach((sp, idx) => {
      sp.classList.toggle("is-lit", idx <= litCount);
      sp.style.opacity = idx <= litCount ? "1" : "";
    });
  }

  if (manifestoEl) {
    manifestoScrollProgress = reduceMotion ? 1 : 0.35;
    renderManifestoWords();

    if (typeof window.ScrollTrigger !== "undefined" && !reduceMotion) {
      window.ScrollTrigger.create({
        trigger: ".manifesto-section",
        start: "top 72%",
        end: "center 42%",
        scrub: 0.4,
        onUpdate: (self) => {
          manifestoScrollProgress = self.progress;
          const wordSpans = manifestoEl.querySelectorAll(".scrub-word");
          const litCount = Math.floor(self.progress * wordSpans.length);
          wordSpans.forEach((sp, idx) => {
            sp.classList.toggle("is-lit", idx <= litCount);
            sp.style.opacity = idx <= litCount ? "1" : "";
          });
        }
      });
    } else {
      manifestoScrollProgress = 1;
      renderManifestoWords();
    }
  }

  // Sincronización de pilares en la sección Sticky Split
  const pillarItems = Array.from(document.querySelectorAll(".sticky-pillar-item"));
  const wipeCards = Array.from(document.querySelectorAll(".wipe-media-card"));

  pillarItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      pillarItems.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      if (wipeCards[idx]) {
        wipeCards[idx].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  if (typeof window.ScrollTrigger !== "undefined") {
    wipeCards.forEach((card, idx) => {
      window.ScrollTrigger.create({
        trigger: card,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => pillarItems.forEach((p, i) => p.classList.toggle("is-active", i === idx)),
        onEnterBack: () => pillarItems.forEach((p, i) => p.classList.toggle("is-active", i === idx))
      });
    });
  }

  // ==========================================================================
  // 5.5. MODAL LIGHTBOX DE EXPANSIÓN DE IMAGEN (Ajuste #2: Galería 3D e Historia 3D)
  // ==========================================================================
  const lightboxModal = document.getElementById("media-lightbox-modal");
  const lightboxCloseBtn = document.getElementById("media-lightbox-close");
  const lightboxDismissBtn = document.getElementById("lightbox-btn-dismiss");
  const lightboxCtaClinic = document.getElementById("lightbox-cta-clinic");

  function openMediaLightbox(item) {
    if (!lightboxModal) return;
    const imgEl = document.getElementById("lightbox-img");
    const badgeEl = document.getElementById("lightbox-badge");
    const codeEl = document.getElementById("lightbox-code");
    const sourceEl = document.getElementById("lightbox-source");
    const titleEl = document.getElementById("lightbox-title");
    const descEl = document.getElementById("lightbox-desc");
    const statsEl = document.getElementById("lightbox-stats");

    if (imgEl) {
      imgEl.src = item.img || "assets/provisional-documentary-la-placita.jpg";
      imgEl.alt = item.title || "";
    }
    if (badgeEl) badgeEl.textContent = item.badge || "";
    if (codeEl) codeEl.textContent = item.code || "";
    if (sourceEl) sourceEl.textContent = item.source || "EL RESCATE • LOS ANGELES";
    if (titleEl) titleEl.textContent = item.title || "";
    if (descEl) descEl.textContent = item.desc || "";

    if (statsEl) {
      if (item.stats && item.stats.length) {
        statsEl.innerHTML = item.stats
          .map(
            (st) => `
            <div class="media-lightbox__stat-box">
              <div class="media-lightbox__stat-val">${st.val}</div>
              <div class="media-lightbox__stat-lbl">${st.lbl}</div>
            </div>
          `
          )
          .join("");
        statsEl.style.display = "grid";
      } else {
        statsEl.innerHTML = "";
        statsEl.style.display = "none";
      }
    }

    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
  }

  function closeMediaLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeMediaLightbox);
  if (lightboxDismissBtn) lightboxDismissBtn.addEventListener("click", closeMediaLightbox);
  if (lightboxCtaClinic) {
    lightboxCtaClinic.addEventListener("click", () => {
      closeMediaLightbox();
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeMediaLightbox();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("is-open")) {
      closeMediaLightbox();
    }
  });

  // ==========================================================================
  // 6. RIFF 28 "CARD SHUFFLE" (Video 4) + ARCO 3D (Video 2 C&A) — BILINGÜE
  // ==========================================================================
  const SERVICES_DECK_I18N = {
    es: [
      {
        num: "01",
        pill: "Protección",
        theme: "violet",
        title: "Asilo y Refugio",
        sub: "Defensa humanitaria integral",
        kicker: "PROGRAMA 01 DE 05 • DEFENSA DE ASILO",
        fullTitle: "Asilo, Refugio y Protección Humanitaria",
        fullDesc:
          "Representación legal especializada para personas y familias que buscan protección en Estados Unidos, incluyendo asilo afirmativo y defensivo, visas U para víctimas de delitos y peticiones VAWA."
      },
      {
        num: "02",
        pill: "Amparo",
        theme: "amber",
        title: "TPS y DACA",
        sub: "Permisos y protección temporal",
        kicker: "PROGRAMA 02 DE 05 • ESTATUS PROTEGIDO",
        fullTitle: "Renovaciones de TPS, DACA y Ley NACARA",
        fullDesc:
          "Desde las históricas clínicas ABC de 1991 hasta la defensa actual de Dreamers, gestionamos renovaciones de permisos de trabajo, amparos de deportación y beneficios bajo NACARA."
      },
      {
        num: "03",
        pill: "Familia",
        theme: "mint",
        title: "Residencia",
        sub: "Reunificación de familias",
        kicker: "PROGRAMA 03 DE 05 • UNIDAD FAMILIAR",
        fullTitle: "Peticiones Familiares y Ajuste de Estatus",
        fullDesc:
          "Acompañamiento jurídico paso a paso para reunir a cónyuges, hijos y padres, incluyendo perdones migratorios (waivers) y procesos consulares seguros."
      },
      {
        num: "04",
        pill: "Cívico",
        theme: "lavender",
        title: "Ciudadanía",
        sub: "Naturalización y voz plena",
        kicker: "PROGRAMA 04 DE 05 • NATURALIZACIÓN",
        fullTitle: "Talleres de Ciudadanía y Examen Cívico",
        fullDesc:
          "Preparamos tu solicitud N-400, evaluamos exenciones de pago o de idioma y realizamos simulacros de entrevista para que des el paso hacia la ciudadanía estadounidense."
      },
      {
        num: "05",
        pill: "Clínica",
        theme: "sand",
        title: "Clínicas L.A.",
        sub: "Miércoles y sábados en vivo",
        kicker: "PROGRAMA 05 DE 05 • ATENCIÓN SEMANAL",
        fullTitle: "Clínicas Legales Comunitarias y Microfinanzas",
        fullDesc:
          "Orientación directa todos los miércoles (2–5 PM) y sábados (10 AM–1 PM) junto con programas de educación financiera y apoyo a emprendedores migrantes."
      }
    ],
    en: [
      {
        num: "01",
        pill: "Protection",
        theme: "violet",
        title: "Asylum & Refuge",
        sub: "Comprehensive humanitarian defense",
        kicker: "PROGRAM 01 OF 05 • ASYLUM DEFENSE",
        fullTitle: "Asylum, Refuge & Humanitarian Protection",
        fullDesc:
          "Specialized legal representation for individuals and families seeking protection in the United States, including affirmative and defensive asylum, U Visas for crime victims, and VAWA petitions."
      },
      {
        num: "02",
        pill: "Relief",
        theme: "amber",
        title: "TPS & DACA",
        sub: "Work permits & temporary relief",
        kicker: "PROGRAM 02 OF 05 • PROTECTED STATUS",
        fullTitle: "TPS, DACA & NACARA Legal Renewals",
        fullDesc:
          "From our landmark 1991 ABC clinics to today's Dreamer defense, we handle work permit renewals, deportation relief, and NACARA adjustment benefits."
      },
      {
        num: "03",
        pill: "Family",
        theme: "mint",
        title: "Residency",
        sub: "Family reunification pathways",
        kicker: "PROGRAM 03 OF 05 • FAMILY UNITY",
        fullTitle: "Family Petitions & Adjustment of Status",
        fullDesc:
          "Step-by-step legal accompaniment to reunite spouses, children, and parents, including provisional waivers and safe consular processing."
      },
      {
        num: "04",
        pill: "Civic",
        theme: "lavender",
        title: "Citizenship",
        sub: "Naturalization & full civic voice",
        kicker: "PROGRAM 04 OF 05 • NATURALIZATION",
        fullTitle: "Citizenship Workshops & Civics Prep",
        fullDesc:
          "We prepare your N-400 application, evaluate fee or language exemptions, and run mock interviews so you can confidently take the step toward U.S. citizenship."
      },
      {
        num: "05",
        pill: "Clinics",
        theme: "sand",
        title: "L.A. Clinics",
        sub: "Live Wednesdays & Saturdays",
        kicker: "PROGRAM 05 OF 05 • WEEKLY CARE",
        fullTitle: "Community Legal Clinics & Microfinance",
        fullDesc:
          "Direct legal orientation every Wednesday (2–5 PM) and Saturday (10 AM–1 PM) alongside financial literacy programs and support for immigrant entrepreneurs."
      }
    ]
  };

  function getServicesDeck() {
    return SERVICES_DECK_I18N[currentLang] || SERVICES_DECK_I18N.es;
  }

  const riffStackEl = document.getElementById("riff-card-stack");
  const riffDotsEl = document.getElementById("riff-dots");
  const shuffleKicker = document.getElementById("shuffle-detail-kicker");
  const shuffleTitle = document.getElementById("shuffle-detail-title");
  const shuffleDesc = document.getElementById("shuffle-detail-desc");

  let deckOrder = [0, 1, 2, 3, 4];
  let isShuffling = false;
  let autoShuffleTimer = null;
  let isAutoPlaying = true;

  function renderRiffDeck() {
    if (!riffStackEl || !riffDotsEl) return;
    riffStackEl.innerHTML = "";
    riffDotsEl.innerHTML = "";
    const deck = getServicesDeck();

    deck.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = "riff-card";
      card.setAttribute("data-theme", item.theme);
      card.setAttribute("data-deck-id", String(idx));
      card.innerHTML = `
        <div class="riff-card__top">
          <div class="riff-card__num">${item.num}</div>
          <span class="riff-card__pill">${item.pill}</span>
        </div>
        <button type="button" class="riff-card__center-play" aria-label="Play / Pause">
          <span class="play-pause-icon">${isAutoPlaying ? "❚❚" : "▶"}</span>
        </button>
        <div class="riff-card__bottom">
          <div>
            <div class="riff-card__title">${item.title}</div>
            <div class="riff-card__sub">${item.sub}</div>
          </div>
          <button type="button" class="riff-card__next-btn" aria-label="Next card">→</button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".riff-card__center-play")) {
          e.stopPropagation();
          isAutoPlaying = !isAutoPlaying;
          document.querySelectorAll(".play-pause-icon").forEach((ic) => {
            ic.textContent = isAutoPlaying ? "❚❚" : "▶";
          });
          if (isAutoPlaying) startAutoShuffle();
          else stopAutoShuffle();
          return;
        }
        shuffleNextCard();
      });

      riffStackEl.appendChild(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "riff-dot";
      dot.setAttribute("aria-label", `Card ${item.num}`);
      dot.addEventListener("click", () => {
        if (deckOrder[0] !== idx && !isShuffling) {
          shuffleNextCard();
        }
      });
      riffDotsEl.appendChild(dot);
    });

    layoutDeckCards(true);
  }

  function layoutDeckCards(immediate = false) {
    if (!riffStackEl) return;
    const deck = getServicesDeck();
    const frontId = deckOrder[0];
    const activeService = deck[frontId];

    if (shuffleKicker) shuffleKicker.textContent = activeService.kicker;
    if (shuffleTitle) shuffleTitle.textContent = activeService.fullTitle;
    if (shuffleDesc) shuffleDesc.textContent = activeService.fullDesc;

    if (riffDotsEl) {
      Array.from(riffDotsEl.children).forEach((d, idx) => {
        d.classList.toggle("is-active", idx === frontId);
      });
    }

    deckOrder.forEach((cardId, stackPos) => {
      const cardEl = riffStackEl.querySelector(`[data-deck-id="${cardId}"]`);
      if (!cardEl) return;

      const targetY = -stackPos * 13;
      const targetScale = 1 - stackPos * 0.048;
      const targetRot = stackPos === 0 ? 0 : (stackPos % 2 === 0 ? 1.2 : -1.2);
      const zIndex = deck.length - stackPos;

      cardEl.style.zIndex = String(zIndex);

      if (immediate || reduceMotion) {
        gsap.set(cardEl, {
          x: 0,
          y: targetY,
          scale: targetScale,
          rotation: targetRot,
          opacity: stackPos > 3 ? 0.55 : 1
        });
      } else {
        gsap.to(cardEl, {
          x: 0,
          y: targetY,
          scale: targetScale,
          rotation: targetRot,
          opacity: stackPos > 3 ? 0.55 : 1,
          duration: 0.52,
          ease: "back.out(1.5)"
        });
      }
    });
  }

  function shuffleNextCard() {
    if (isShuffling || !riffStackEl) return;
    isShuffling = true;

    const frontId = deckOrder[0];
    const frontCardEl = riffStackEl.querySelector(`[data-deck-id="${frontId}"]`);

    if (!frontCardEl || reduceMotion) {
      deckOrder.push(deckOrder.shift());
      layoutDeckCards(true);
      isShuffling = false;
      return;
    }

    gsap.to(frontCardEl, {
      x: 245,
      y: 20,
      rotation: 12,
      scale: 0.92,
      duration: 0.32,
      ease: "power2.in",
      onComplete: () => {
        deckOrder.push(deckOrder.shift());
        layoutDeckCards(false);
        setTimeout(() => {
          isShuffling = false;
        }, 380);
      }
    });
  }

  function startAutoShuffle() {
    stopAutoShuffle();
    autoShuffleTimer = setInterval(() => {
      if (isAutoPlaying && !document.hidden) {
        shuffleNextCard();
      }
    }, 3600);
  }

  function stopAutoShuffle() {
    if (autoShuffleTimer) {
      clearInterval(autoShuffleTimer);
      autoShuffleTimer = null;
    }
  }

  renderRiffDeck();
  startAutoShuffle();

  const btnTriggerShuffle = document.getElementById("btn-trigger-shuffle");
  if (btnTriggerShuffle) {
    btnTriggerShuffle.addEventListener("click", shuffleNextCard);
  }

  const btnModeShuffle = document.getElementById("btn-mode-shuffle");
  const btnModeArc3d = document.getElementById("btn-mode-arc3d");
  const shuffleViewEl = document.getElementById("shuffle-view");
  const arc3dViewEl = document.getElementById("arc3d-view");

  if (btnModeShuffle && btnModeArc3d && shuffleViewEl && arc3dViewEl) {
    btnModeShuffle.addEventListener("click", () => {
      btnModeShuffle.classList.add("is-active");
      btnModeArc3d.classList.remove("is-active");
      shuffleViewEl.classList.remove("is-hidden");
      arc3dViewEl.classList.remove("is-visible");
    });

    btnModeArc3d.addEventListener("click", () => {
      btnModeArc3d.classList.add("is-active");
      btnModeShuffle.classList.remove("is-active");
      shuffleViewEl.classList.add("is-hidden");
      arc3dViewEl.classList.add("is-visible");
    });
  }

  // ==========================================================================
  // 7. GALERÍA ESPACIAL 3D ESTILO "UNVEIL® PROJECTS" + CLICK LIGHTBOX (Ajuste #2)
  // ==========================================================================
  const UNVEIL_PLANES_I18N = {
    es: [
      {
        id: "01",
        category: "legal",
        tag: "DEFENSA LEGAL • 1981",
        title: "Brigadas de Asilo en Pico-Union",
        desc: "Registro documental de las primeras jornadas de representación jurídica de emergencia en Pico-Union y Westlake para familias refugiadas recién llegadas a Los Ángeles.",
        code: "ARCHIVO #ER-UNV-01",
        stats: [
          { val: "1981", lbl: "Año fundacional" },
          { val: "Pico-Union", lbl: "Distrito histórico" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(15, 38, 66, 0.36)"
      },
      {
        id: "02",
        category: "comunidad",
        tag: "MEMORIA VIVA • LA PLACITA",
        title: "Encuentros Comunitarios en Olvera St.",
        desc: "Espacios de articulación vecinal, cultura e identidad migrante alrededor de La Placita Olvera, fortaleciendo las redes de solidaridad familiar en el centro de Los Ángeles.",
        code: "ARCHIVO #ER-UNV-02",
        stats: [
          { val: "+45,000", lbl: "Familias en red" },
          { val: "La Placita", lbl: "Corazón cultural" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(232, 160, 74, 0.32)"
      },
      {
        id: "03",
        category: "legal",
        tag: "JURISPRUDENCIA • 1991",
        title: "Acuerdo ABC & Registro Masivo TPS",
        desc: "Operativo jurídico comunitario histórico tras el acuerdo American Baptist Churches (ABC), permitiendo a decenas de miles de inmigrantes acceder a entrevistas justas de asilo y TPS.",
        code: "ARCHIVO #ER-UNV-03",
        stats: [
          { val: "ABC & TPS", lbl: "Precedente federal" },
          { val: "1991", lbl: "Hito de litigio" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(11, 101, 198, 0.38)"
      },
      {
        id: "04",
        category: "clinica",
        tag: "CLÍNICA SEMANAL • MIÉRCOLES",
        title: "Orientación Jurídica Confidencial",
        desc: "Sesiones presenciales todos los miércoles y sábados donde especialistas legales evalúan casos de asilo, peticiones familiares y permisos laborales bajo absoluta confidencialidad.",
        code: "ARCHIVO #ER-UNV-04",
        stats: [
          { val: "100%", lbl: "Secreto profesional" },
          { val: "Mié & Sáb", lbl: "Atención directa" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(18, 64, 89, 0.42)"
      },
      {
        id: "05",
        category: "comunidad",
        tag: "ECONOMÍA SOCIAL • 2004",
        title: "Red de Microempresas Migrantes",
        desc: "Iniciativa de desarrollo económico comunitario y educación financiera para impulsar pequeños negocios familiares y cooperativas de trabajadores migrantes en el sur de California.",
        code: "ARCHIVO #ER-UNV-05",
        stats: [
          { val: "360°", lbl: "Empoderamiento local" },
          { val: "Westlake", lbl: "Corredor comercial" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(212, 148, 58, 0.34)"
      },
      {
        id: "06",
        category: "legal",
        tag: "JUVENTUD • 2015",
        title: "Defensa de Dreamers y DACA en L.A.",
        desc: "Acompañamiento legal y becas de renovación para estudiantes y jóvenes beneficiarios de DACA, protegiendo su acceso a la educación superior y permisos de trabajo.",
        code: "ARCHIVO #ER-UNV-06",
        stats: [
          { val: "98%", lbl: "Éxito en renovaciones" },
          { val: "+3,400", lbl: "Jóvenes asesorados" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(23, 59, 99, 0.40)"
      },
      {
        id: "07",
        category: "clinica",
        tag: "PRESENTE • 2026",
        title: "Plataforma Digital de Acceso Humanitario",
        desc: "Integración de reservas de clínica en línea, pre-evaluación interactiva y archivo tridimensional para acercar la defensa legal de El Rescate a las nuevas generaciones.",
        code: "ARCHIVO #ER-UNV-07",
        stats: [
          { val: "2026", lbl: "Innovación social" },
          { val: "ES / EN", lbl: "Acceso bilingüe" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(11, 101, 198, 0.32)"
      }
    ],
    en: [
      {
        id: "01",
        category: "legal",
        tag: "LEGAL DEFENSE • 1981",
        title: "Asylum Brigades in Pico-Union",
        desc: "Documentary record of the first emergency legal representation brigades in Pico-Union and Westlake for newly arrived refugee families in Los Angeles.",
        code: "ARCHIVE #ER-UNV-01",
        stats: [
          { val: "1981", lbl: "Founding year" },
          { val: "Pico-Union", lbl: "Historic district" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(15, 38, 66, 0.36)"
      },
      {
        id: "02",
        category: "comunidad",
        tag: "LIVING MEMORY • LA PLACITA",
        title: "Community Gatherings at Olvera St.",
        desc: "Spaces of neighborhood organizing, culture, and immigrant identity around La Placita Olvera, strengthening family solidarity networks in downtown Los Angeles.",
        code: "ARCHIVE #ER-UNV-02",
        stats: [
          { val: "+45,000", lbl: "Families connected" },
          { val: "La Placita", lbl: "Cultural heart" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(232, 160, 74, 0.32)"
      },
      {
        id: "03",
        category: "legal",
        tag: "CASE LAW • 1991",
        title: "ABC Settlement & Mass TPS Registration",
        desc: "Historic community legal mobilization following the American Baptist Churches (ABC) settlement, enabling tens of thousands of immigrants to access fair asylum interviews and TPS.",
        code: "ARCHIVE #ER-UNV-03",
        stats: [
          { val: "ABC & TPS", lbl: "Federal precedent" },
          { val: "1991", lbl: "Litigation milestone" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(11, 101, 198, 0.38)"
      },
      {
        id: "04",
        category: "clinica",
        tag: "WEEKLY CLINIC • WEDNESDAYS",
        title: "Confidential Legal Orientation",
        desc: "In-person sessions every Wednesday and Saturday where legal specialists evaluate asylum cases, family petitions, and work permits under strict confidentiality.",
        code: "ARCHIVE #ER-UNV-04",
        stats: [
          { val: "100%", lbl: "Legal privilege" },
          { val: "Wed & Sat", lbl: "Direct care" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(18, 64, 89, 0.42)"
      },
      {
        id: "05",
        category: "comunidad",
        tag: "SOCIAL ECONOMY • 2004",
        title: "Immigrant Microenterprise Network",
        desc: "Community economic development and financial literacy initiative supporting family-owned small businesses and immigrant worker cooperatives across Southern California.",
        code: "ARCHIVE #ER-UNV-05",
        stats: [
          { val: "360°", lbl: "Local empowerment" },
          { val: "Westlake", lbl: "Commercial corridor" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(212, 148, 58, 0.34)"
      },
      {
        id: "06",
        category: "legal",
        tag: "YOUTH • 2015",
        title: "Dreamers & DACA Defense in L.A.",
        desc: "Legal accompaniment and renewal scholarships for DACA students and young workers, safeguarding their access to higher education and work authorization.",
        code: "ARCHIVE #ER-UNV-06",
        stats: [
          { val: "98%", lbl: "Renewal success" },
          { val: "+3,400", lbl: "Youth advised" }
        ],
        img: "assets/provisional-documentary-macarthur-park.jpg",
        tint: "rgba(23, 59, 99, 0.40)"
      },
      {
        id: "07",
        category: "clinica",
        tag: "PRESENT • 2026",
        title: "Digital Humanitarian Access Platform",
        desc: "Integration of online clinic booking, interactive pre-evaluation, and a 3D living archive to bring El Rescate's legal defense closer to new generations.",
        code: "ARCHIVE #ER-UNV-07",
        stats: [
          { val: "2026", lbl: "Social innovation" },
          { val: "ES / EN", lbl: "Bilingual access" }
        ],
        img: "assets/provisional-documentary-la-placita.jpg",
        tint: "rgba(11, 101, 198, 0.32)"
      }
    ]
  };

  const unveilCorridor = document.getElementById("unveil-3d-corridor");
  const unveilViewport = document.getElementById("unveil-viewport");
  const unveilCounter = document.getElementById("unveil-active-counter");
  let activeUnveilFilter = "all";

  function renderUnveilPlanes(filter = activeUnveilFilter) {
    activeUnveilFilter = filter;
    if (!unveilCorridor) return;
    const planesList = UNVEIL_PLANES_I18N[currentLang] || UNVEIL_PLANES_I18N.es;
    const filtered =
      filter === "all"
        ? planesList
        : planesList.filter((p) => p.category === filter);

    unveilCorridor.innerHTML = "";
    const count = filtered.length;
    const mid = (count - 1) / 2;
    const layerPrefix = currentLang === "en" ? "LAYER" : "CAPA";

    filtered.forEach((plane, idx) => {
      const offset = idx - mid;
      const tx = offset * 66;
      const ty = -offset * 34;
      const tz = -idx * 72;

      const el = document.createElement("article");
      el.className = "unveil-plane";
      el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;
      el.style.zIndex = String(count - idx);
      el.dataset.baseTransform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");

      el.innerHTML = `
        <img src="${plane.img}" alt="${plane.title}" />
        <div class="unveil-plane__glass" style="background: linear-gradient(135deg, ${plane.tint} 0%, rgba(9,25,44,0.68) 100%);">
          <div class="unveil-plane__meta">
            <span>${layerPrefix} ${plane.id}</span>
            <span>${plane.tag}</span>
          </div>
          <div class="unveil-plane__title">${plane.title}</div>
        </div>
      `;

      el.addEventListener("mouseenter", () => {
        if (unveilViewport && unveilViewport.classList.contains("is-index-mode")) return;
        el.style.transform = `translate3d(${tx - 18}px, ${ty - 22}px, ${tz + 55}px) scale(1.04)`;
        el.style.borderColor = "#E8A04A";
        if (unveilCounter) {
          unveilCounter.textContent = `${plane.id} / 0${filtered.length}`;
        }
      });

      el.addEventListener("mouseleave", () => {
        if (unveilViewport && unveilViewport.classList.contains("is-index-mode")) return;
        el.style.transform = el.dataset.baseTransform;
        el.style.borderColor = "rgba(255, 255, 255, 0.65)";
      });

      // Ajuste #2: Al dar click en la imagen se expande centrada con su respectiva información
      const handleExpandPlane = () => {
        openMediaLightbox({
          img: plane.img,
          badge: `${layerPrefix} ${plane.id} • ${plane.tag}`,
          code: plane.code,
          source: currentLang === "en" ? "3D GALLERY • WESTLAKE, L.A." : "GALERÍA 3D • WESTLAKE, L.A.",
          title: plane.title,
          desc: plane.desc,
          stats: plane.stats
        });
      };

      el.addEventListener("click", handleExpandPlane);
      el.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          handleExpandPlane();
        }
      });

      unveilCorridor.appendChild(el);
    });
  }

  renderUnveilPlanes("all");

  document.querySelectorAll(".unveil-filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".unveil-filter-pill").forEach((p) => {
        p.classList.toggle("is-active", p === pill);
      });
      renderUnveilPlanes(pill.getAttribute("data-filter") || "all");
    });
  });

  const btnOverview = document.getElementById("unveil-btn-overview");
  const btnIndex = document.getElementById("unveil-btn-index");
  if (btnOverview && btnIndex && unveilViewport) {
    btnOverview.addEventListener("click", () => {
      btnOverview.classList.add("is-active");
      btnIndex.classList.remove("is-active");
      unveilViewport.classList.remove("is-index-mode");
    });
    btnIndex.addEventListener("click", () => {
      btnIndex.classList.add("is-active");
      btnOverview.classList.remove("is-active");
      unveilViewport.classList.add("is-index-mode");
    });
  }

  // ==========================================================================
  // 8. ESCENA 3D THREE.JS: AUTOBÚS COMUNITARIO SOBRE PLANETA (1981–2026)
  //    + CLICK EN POLAROIDS PARA EXPANDIR LIGHTBOX (Ajuste #2) + BILINGÜE ES/EN
  // ==========================================================================
  const TIMELINE_DATA_I18N = {
    es: [
      {
        year: "1981",
        shortLabel: "Fundación en L.A.",
        docket: "EXP. #ER-1981-001",
        seal: "ACTA FUNDACIONAL",
        kicker: "ORIGEN HUMANITARIO • LOS ÁNGELES",
        title: "Fundación de El Rescate",
        description:
          "Establecida en Los Ángeles para ofrecer representación jurídica de asilo, orientación social y refugio de emergencia a miles de refugiados centroamericanos recién llegados al sur de California.",
        stat1Val: "1.ª Agencia",
        stat1Lbl: "De asilo centroamericano en EE. UU.",
        stat2Val: "Pico-Union",
        stat2Lbl: "Sede histórica comunitaria",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Encuentro comunitario en La Placita",
            sub: "ARCHIVO 1981 • LOS ÁNGELES",
            detail:
              "Primeras jornadas de acogida y orientación humanitaria en La Placita Olvera y Pico-Union para familias desplazadas en 1981."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Entorno vecinal de Westlake",
            sub: "ARCHIVO 1981 • CORREDOR CENTRAL",
            detail:
              "El corredor de Westlake y MacArthur Park se convirtió en el epicentro de organización vecinal y defensa de derechos humanos de El Rescate."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Primeras brigadas de orientación legal",
            sub: "EXPEDIENTE #01 • PRO BONO",
            detail:
              "Abogados y voluntarios comunitarios conformaron el primer equipo de defensa pro bono para frenar deportaciones y documentar casos de asilo."
          }
        ]
      },
      {
        year: "1991",
        shortLabel: "Acuerdo ABC & TPS",
        docket: "EXP. #ER-1991-104",
        seal: "DEFENSA ABC & TPS",
        kicker: "LITIGIO HISTÓRICO • DERECHOS MIGRATORIOS",
        title: "Victoria del Acuerdo ABC y Estatus TPS",
        description:
          "Tras una década de incidencia legal, El Rescate lidera las clínicas masivas para inscribir a decenas de miles de inmigrantes bajo el acuerdo American Baptist Churches (ABC) y el Estatus de Protección Temporal.",
        stat1Val: "+45,000",
        stat1Lbl: "Solicitudes procesadas en clínicas",
        stat2Val: "Ley NACARA",
        stat2Lbl: "Precedente de residencia legal",
        polaroids: [
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Jornadas de registro TPS en MacArthur Park",
            sub: "ARCHIVO 1991 • DEFENSA CIVIL",
            detail:
              "Miles de familias acudieron a las jornadas comunitarias de El Rescate para tramitar su Estatus de Protección Temporal (TPS) y amparo ABC."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Asesoría familiar para permisos de trabajo",
            sub: "ARCHIVO 1991 • CLÍNICA JURÍDICA",
            detail:
              "Revisión individualizada de expedientes y emisión de autorizaciones de empleo que transformaron la estabilidad laboral de la comunidad."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Organización vecinal en el corazón de L.A.",
            sub: "EXPEDIENTE #104 • DERECHOS",
            detail:
              "Articulación con iglesias, sindicatos y organizaciones civiles de California que sentó las bases de la posterior Ley NACARA."
          }
        ]
      },
      {
        year: "2004",
        shortLabel: "Clínicas & Economía",
        docket: "EXP. #ER-2004-218",
        seal: "DESARROLLO INTEGRAL",
        kicker: "ECONOMÍA SOCIAL • SALUD Y EDUCACIÓN",
        title: "Clínicas Integrales y Microfinanzas",
        description:
          "El Rescate amplía su misión más allá de los tribunales: inaugura programas de alfabetización financiera, apoyo a pequeños comercios de familias migrantes y orientación juvenil en el distrito de Westlake.",
        stat1Val: "360° Apoyo",
        stat1Lbl: "Legal, educativo y comunitario",
        stat2Val: "+12,000",
        stat2Lbl: "Familias atendidas anualmente",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Red de comercios y familias emprendedoras",
            sub: "ARCHIVO 2004 • DESARROLLO LOCAL",
            detail:
              "Capacitación y microcréditos comunitarios para que familias inmigrantes abrieran negocios propios en el centro de Los Ángeles."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Talleres comunitarios de ciudadanía",
            sub: "ARCHIVO 2004 • EDUCACIÓN CÍVICA",
            detail:
              "Preparación bilingüe para el examen de naturalización N-400 y formación en derechos constitucionales."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Feria de servicios familiares en Olvera St.",
            sub: "EXPEDIENTE #218 • COMUNIDAD",
            detail:
              "Jornadas integrales de salud, asesoría legal y reunificación familiar abiertas a todos los vecindarios del sur de California."
          }
        ]
      },
      {
        year: "2015",
        shortLabel: "Defensa DACA",
        docket: "EXP. #ER-2015-389",
        seal: "PROTECCIÓN DACA",
        kicker: "JUVENTUD Y REUNIFICACIÓN • CALIFORNIA",
        title: "Defensa de Dreamers y Menores",
        description:
          "Creación del equipo especializado en representación de jóvenes bajo el programa DACA y defensa humanitaria para menores y madres refugiadas en tribunales de inmigración de Los Ángeles.",
        stat1Val: "98% Éxito",
        stat1Lbl: "En renovaciones y amparos DACA",
        stat2Val: "Bilingüe",
        stat2Lbl: "Acompañamiento humano continuo",
        polaroids: [
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Juventud universitaria beneficiaria de DACA",
            sub: "ARCHIVO 2015 • FUTURO JOVEN",
            detail:
              "Acompañamiento legal a miles de estudiantes Dreamers para proteger su estatus y su acceso a universidades en California."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Reunificación de familias en Los Ángeles",
            sub: "ARCHIVO 2015 • AMPARO LEGAL",
            detail:
              "Representación ética en peticiones familiares, perdones migratorios y protección especial para menores inmigrantes (SIJS)."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Foro de derechos constitucionales",
            sub: "EXPEDIENTE #389 • JUSTICIA",
            detail:
              "Campañas permanentes de 'Conoce tus Derechos' y clínicas preventivas contra el fraude notarial en Los Ángeles."
          }
        ]
      },
      {
        year: "2026",
        shortLabel: "Era Digital 24/7",
        docket: "EXP. #ER-2026-500",
        seal: "ERA DIGITAL",
        kicker: "ACCESO UNIVERSAL • NUEVA PLATAFORMA",
        title: "Transformación Digital y Alcance Comunitario",
        description:
          "Hoy El Rescate conecta cuatro décadas de prestigio jurídico con una plataforma digital accesible y bilingüe para que cada familia inmigrante encuentre orientación confiable sin barreras.",
        stat1Val: "45 Años",
        stat1Lbl: "De servicio ininterrumpido en L.A.",
        stat2Val: "Mié & Sáb",
        stat2Lbl: "Clínicas con cita en línea",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Una comunidad más fuerte con oportunidades",
            sub: "ARCHIVO 2026 • PRESENTE Y FUTURO",
            detail:
              "Cuatro décadas y media caminando junto a la comunidad inmigrante de Los Ángeles con dignidad, rigor jurídico y calidez humana."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Atención híbrida presencial y digital",
            sub: "ARCHIVO 2026 • INNOVACIÓN SOCIAL",
            detail:
              "Reserva en línea para las clínicas de miércoles y sábados, pre-evaluación interactiva y protección absoluta de datos."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Cuatro décadas caminando junto al migrante",
            sub: "EXPEDIENTE #500 • EL RESCATE",
            detail:
              "Desde 1981 hasta 2026, nuestra sede en Westlake permanece abierta como refugio seguro y puente hacia nuevas oportunidades."
          }
        ]
      }
    ],
    en: [
      {
        year: "1981",
        shortLabel: "Founded in L.A.",
        docket: "CASE #ER-1981-001",
        seal: "FOUNDING CHARTER",
        kicker: "HUMANITARIAN ORIGIN • LOS ANGELES",
        title: "Founding of El Rescate",
        description:
          "Established in Los Angeles to provide asylum legal representation, social guidance, and emergency refuge to thousands of Central American refugees newly arrived in Southern California.",
        stat1Val: "1st Agency",
        stat1Lbl: "For Central American asylum in the U.S.",
        stat2Val: "Pico-Union",
        stat2Lbl: "Historic community headquarters",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Community gathering at La Placita",
            sub: "ARCHIVE 1981 • LOS ANGELES",
            detail:
              "First humanitarian reception and legal orientation sessions at La Placita Olvera and Pico-Union for displaced families in 1981."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Westlake neighborhood corridor",
            sub: "ARCHIVE 1981 • CENTRAL CORRIDOR",
            detail:
              "The Westlake and MacArthur Park corridor became the epicenter of El Rescate's neighborhood organizing and human rights defense."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "First pro bono legal defense brigades",
            sub: "DOCKET #01 • PRO BONO",
            detail:
              "Attorneys and community volunteers formed the first pro bono defense team to halt deportations and document asylum claims."
          }
        ]
      },
      {
        year: "1991",
        shortLabel: "ABC Settlement & TPS",
        docket: "CASE #ER-1991-104",
        seal: "ABC & TPS DEFENSE",
        kicker: "LANDMARK LITIGATION • IMMIGRANT RIGHTS",
        title: "ABC Settlement Victory & TPS Status",
        description:
          "After a decade of legal advocacy, El Rescate led massive community clinics to register tens of thousands of immigrants under the American Baptist Churches (ABC) settlement and Temporary Protected Status.",
        stat1Val: "+45,000",
        stat1Lbl: "Applications processed in clinics",
        stat2Val: "NACARA Act",
        stat2Lbl: "Permanent residency precedent",
        polaroids: [
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "TPS registration drives at MacArthur Park",
            sub: "ARCHIVE 1991 • CIVIL DEFENSE",
            detail:
              "Thousands of families attended El Rescate's community drives to file for Temporary Protected Status (TPS) and ABC relief."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Family counseling for work authorization",
            sub: "ARCHIVE 1991 • LEGAL CLINIC",
            detail:
              "Individualized case review and employment authorization filings that transformed economic stability for the community."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Grassroots organizing in the heart of L.A.",
            sub: "DOCKET #104 • CIVIL RIGHTS",
            detail:
              "Coalition building with churches, labor unions, and California civic groups that laid the groundwork for the NACARA Act."
          }
        ]
      },
      {
        year: "2004",
        shortLabel: "Clinics & Economy",
        docket: "CASE #ER-2004-218",
        seal: "HOLISTIC GROWTH",
        kicker: "SOCIAL ECONOMY • HEALTH & EDUCATION",
        title: "Comprehensive Clinics & Microfinance",
        description:
          "El Rescate expanded its mission beyond the courtroom: launching financial literacy programs, support for immigrant-owned small businesses, and youth guidance across the Westlake district.",
        stat1Val: "360° Care",
        stat1Lbl: "Legal, educational & community support",
        stat2Val: "+12,000",
        stat2Lbl: "Families served annually",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Immigrant entrepreneur business network",
            sub: "ARCHIVE 2004 • LOCAL ECONOMY",
            detail:
              "Training and community microloans empowering immigrant families to launch small businesses in central Los Angeles."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Community citizenship workshops",
            sub: "ARCHIVE 2004 • CIVIC EDUCATION",
            detail:
              "Bilingual preparation for the N-400 naturalization exam and constitutional rights education."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Family services fair at Olvera St.",
            sub: "DOCKET #218 • COMMUNITY",
            detail:
              "Comprehensive health, legal guidance, and family reunification fairs open to neighborhoods across Southern California."
          }
        ]
      },
      {
        year: "2015",
        shortLabel: "DACA Defense",
        docket: "CASE #ER-2015-389",
        seal: "DACA PROTECTION",
        kicker: "YOUTH & REUNIFICATION • CALIFORNIA",
        title: "Defense of Dreamers & Unaccompanied Youth",
        description:
          "Creation of the specialized legal team representing young immigrants under DACA and providing humanitarian defense for children and refugee mothers in Los Angeles immigration courts.",
        stat1Val: "98% Success",
        stat1Lbl: "In DACA renewals & legal relief",
        stat2Val: "Bilingual",
        stat2Lbl: "Continuous human accompaniment",
        polaroids: [
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "College youth supported through DACA",
            sub: "ARCHIVE 2015 • YOUTH FUTURE",
            detail:
              "Legal accompaniment for thousands of Dreamer students to protect their status and access to California universities."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Family reunification in Los Angeles",
            sub: "ARCHIVE 2015 • LEGAL RELIEF",
            detail:
              "Ethical representation in family petitions, provisional waivers, and Special Immigrant Juvenile Status (SIJS)."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Constitutional rights community forum",
            sub: "DOCKET #389 • JUSTICE",
            detail:
              "Permanent 'Know Your Rights' campaigns and preventive clinics against notary fraud in Los Angeles."
          }
        ]
      },
      {
        year: "2026",
        shortLabel: "24/7 Digital Era",
        docket: "CASE #ER-2026-500",
        seal: "DIGITAL ERA",
        kicker: "UNIVERSAL ACCESS • NEW PLATFORM",
        title: "Digital Transformation & Community Reach",
        description:
          "Today El Rescate connects four decades of legal prestige with an accessible, bilingual digital platform so every immigrant family can find trusted guidance without barriers.",
        stat1Val: "45 Years",
        stat1Lbl: "Of uninterrupted service in L.A.",
        stat2Val: "Wed & Sat",
        stat2Lbl: "Online-booked legal clinics",
        polaroids: [
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "A stronger community with opportunity",
            sub: "ARCHIVE 2026 • PRESENT & FUTURE",
            detail:
              "Four and a half decades walking alongside the immigrant community of Los Angeles with dignity, legal rigor, and human warmth."
          },
          {
            img: "assets/provisional-documentary-macarthur-park.jpg",
            caption: "Hybrid in-person & digital care",
            sub: "ARCHIVE 2026 • SOCIAL INNOVATION",
            detail:
              "Online booking for Wednesday and Saturday clinics, interactive pre-evaluation, and strict data privacy."
          },
          {
            img: "assets/provisional-documentary-la-placita.jpg",
            caption: "Four decades walking with immigrants",
            sub: "DOCKET #500 • EL RESCATE",
            detail:
              "From 1981 to 2026, our Westlake headquarters remains open as a safe haven and bridge toward new opportunities."
          }
        ]
      }
    ]
  };

  function getTimelineData() {
    return TIMELINE_DATA_I18N[currentLang] || TIMELINE_DATA_I18N.es;
  }

  let refreshTimelineLanguage = () => {};

  function init3DBusTimeline() {
    const canvas = document.getElementById("timeline-canvas");
    const wrap = document.getElementById("timeline-canvas-wrap");
    if (!canvas || !wrap || typeof window.THREE === "undefined") return;

    const DIGIT_PATHS = {
      "0": [
        [[-0.28, 0.0], [0.28, 0.0], [0.28, 0.92], [-0.28, 0.92]],
        [[-0.13, 0.15], [0.13, 0.15], [0.13, 0.77], [-0.13, 0.77]]
      ],
      "1": [
        [[-0.22, 0.0], [0.22, 0.0], [0.22, 0.14], [0.08, 0.14], [0.08, 0.92], [-0.07, 0.92], [-0.24, 0.76], [-0.16, 0.65], [-0.07, 0.73], [-0.07, 0.14], [-0.22, 0.14]]
      ],
      "2": [
        [[-0.28, 0.0], [0.28, 0.0], [0.28, 0.16], [-0.08, 0.16], [0.26, 0.54], [0.26, 0.92], [-0.26, 0.92], [-0.26, 0.74], [0.10, 0.74], [0.10, 0.58], [-0.28, 0.16]]
      ],
      "4": [
        [[0.04, 0.0], [0.20, 0.0], [0.20, 0.24], [0.30, 0.24], [0.30, 0.39], [0.20, 0.39], [0.20, 0.92], [0.02, 0.92], [-0.30, 0.36], [-0.30, 0.24], [0.04, 0.24]],
        [[-0.13, 0.39], [0.04, 0.39], [0.04, 0.69]]
      ],
      "5": [
        [[-0.28, 0.0], [0.26, 0.0], [0.26, 0.54], [-0.12, 0.54], [-0.12, 0.76], [0.25, 0.76], [0.25, 0.92], [-0.27, 0.92], [-0.27, 0.39], [0.10, 0.39], [0.10, 0.16], [-0.28, 0.16]]
      ],
      "6": [
        [[-0.28, 0.0], [0.28, 0.0], [0.28, 0.54], [-0.12, 0.54], [-0.12, 0.76], [0.24, 0.76], [0.24, 0.92], [-0.28, 0.92]],
        [[-0.12, 0.15], [0.12, 0.15], [0.12, 0.39], [-0.12, 0.39]]
      ],
      "8": [
        [[-0.28, 0.0], [0.28, 0.0], [0.28, 0.92], [-0.28, 0.92]],
        [[-0.12, 0.14], [0.12, 0.14], [0.12, 0.39], [-0.12, 0.39]],
        [[-0.12, 0.53], [0.12, 0.53], [0.12, 0.78], [-0.12, 0.78]]
      ],
      "9": [
        [[-0.26, 0.0], [0.28, 0.0], [0.28, 0.92], [-0.28, 0.92], [-0.28, 0.38], [0.12, 0.38], [0.12, 0.16], [-0.26, 0.16]],
        [[-0.12, 0.53], [0.12, 0.53], [0.12, 0.77], [-0.12, 0.77]]
      ]
    };

    function build3DYearMeshGroup(yearStr, matteGoldMaterial, navyOutlineMaterial) {
      const group = new THREE.Group();
      const spacing = 0.72;
      const startX = -((yearStr.length - 1) * spacing) / 2;

      for (let i = 0; i < yearStr.length; i++) {
        const ch = yearStr[i];
        const loops = DIGIT_PATHS[ch] || DIGIT_PATHS["0"];
        const outerPts = loops[0].map(([x, y]) => new THREE.Vector2(x, y));
        const shape = new THREE.Shape(outerPts);

        for (let h = 1; h < loops.length; h++) {
          const holePts = loops[h].map(([x, y]) => new THREE.Vector2(x, y));
          shape.holes.push(new THREE.Path(holePts));
        }

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 0.16,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.025,
          bevelThickness: 0.025
        });
        const mesh = new THREE.Mesh(geom, [matteGoldMaterial, navyOutlineMaterial]);
        mesh.position.set(startX + i * spacing, 0, -0.08);
        mesh.castShadow = true;
        group.add(mesh);
      }
      return group;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
    camera.position.set(0, 2.05, 8.35);
    camera.lookAt(0, 1.08, 0);

    scene.add(new THREE.AmbientLight(0xeaf1f6, 0.88));
    scene.add(new THREE.HemisphereLight(0xfff9ee, 0x173b63, 0.55));

    const dirLight = new THREE.DirectionalLight(0xfff3dc, 1.45);
    dirLight.position.set(5.5, 9.5, 6.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    const d = 6.5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const matGrassLowPoly = new THREE.MeshStandardMaterial({ color: 0x35823b, roughness: 0.78, flatShading: true });
    const matDirtRoad = new THREE.MeshStandardMaterial({ color: 0x8f653e, roughness: 0.9, flatShading: true });
    const matBusNavy = new THREE.MeshPhysicalMaterial({ color: 0x173b63, roughness: 0.22, metalness: 0.32, clearcoat: 0.9 });
    const matBusWhite = new THREE.MeshPhysicalMaterial({ color: 0xf7f6f2, roughness: 0.25, clearcoat: 0.85 });
    const matBusGold = new THREE.MeshStandardMaterial({ color: 0xe09c3e, roughness: 0.28, metalness: 0.82 });
    const matYearMatteGold = new THREE.MeshStandardMaterial({ color: 0xe5a140, roughness: 0.44, metalness: 0.65 });
    const matBusGlass = new THREE.MeshPhysicalMaterial({ color: 0x1e4b7a, roughness: 0.1, metalness: 0.22, clearcoat: 1.0 });
    const matTire = new THREE.MeshStandardMaterial({ color: 0x18202c, roughness: 0.82 });
    const matTreeTrunk = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.88, flatShading: true });
    const matLeafDark = new THREE.MeshStandardMaterial({ color: 0x24692c, roughness: 0.72, flatShading: true });
    const matLeafBright = new THREE.MeshStandardMaterial({ color: 0x43993e, roughness: 0.68, flatShading: true });

    const worldHeadingGroup = new THREE.Group();
    worldHeadingGroup.rotation.y = Math.PI * 0.38;
    scene.add(worldHeadingGroup);

    const PLANET_RADIUS = 10.5;
    const planetPivot = new THREE.Group();
    planetPivot.position.set(0, -PLANET_RADIUS, 0);
    worldHeadingGroup.add(planetPivot);

    const planetGeom = new THREE.IcosahedronGeometry(PLANET_RADIUS, 5);
    const posAttr = planetGeom.attributes.position;
    const vTemp = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      vTemp.fromBufferAttribute(posAttr, i);
      if (Math.abs(vTemp.x) < 1.32) {
        vTemp.normalize().multiplyScalar(PLANET_RADIUS - 0.02);
      } else {
        const hillNoise = 0.18 * Math.sin(vTemp.x * 0.8 + vTemp.y * 0.6) + 0.14 * Math.cos(vTemp.z * 0.7 - vTemp.x * 0.5);
        vTemp.normalize().multiplyScalar(PLANET_RADIUS + Math.max(0, hillNoise));
      }
      posAttr.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }
    planetGeom.computeVertexNormals();
    const planetMesh = new THREE.Mesh(planetGeom, matGrassLowPoly);
    planetMesh.receiveShadow = true;
    planetPivot.add(planetMesh);

    const roadRingGeom = new THREE.CylinderGeometry(PLANET_RADIUS + 0.025, PLANET_RADIUS + 0.025, 2.15, 96, 4, true);
    roadRingGeom.rotateZ(Math.PI / 2);
    const rPos = roadRingGeom.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      vTemp.fromBufferAttribute(rPos, i);
      const angle = Math.atan2(vTemp.z, vTemp.y);
      vTemp.x += 0.06 * Math.sin(angle * 5.0);
      vTemp.normalize().multiplyScalar(PLANET_RADIUS + 0.022);
      rPos.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }
    roadRingGeom.computeVertexNormals();
    const dirtRoadMesh = new THREE.Mesh(roadRingGeom, matDirtRoad);
    dirtRoadMesh.receiveShadow = true;
    planetPivot.add(dirtRoadMesh);

    function placeOnPlanet(obj, theta, latX, extraRadius = 0) {
      const waveX = 0.06 * Math.sin(theta * 5.0);
      const pos = new THREE.Vector3(waveX + latX, PLANET_RADIUS * Math.cos(theta), PLANET_RADIUS * Math.sin(theta))
        .normalize()
        .multiplyScalar(PLANET_RADIUS + extraRadius);
      obj.position.copy(pos);
      obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      planetPivot.add(obj);
    }

    const dashGeom = new THREE.BoxGeometry(0.1, 0.02, 0.44);
    for (let i = 0; i < 40; i++) {
      placeOnPlanet(new THREE.Mesh(dashGeom, matBusGold), (i / 40) * Math.PI * 2, 0, 0.025);
    }

    function createLowPolyTree(variant = 0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.42, 6), matTreeTrunk);
      trunk.position.y = 0.21;
      tree.add(trunk);
      if (variant % 2 === 0) {
        const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.58, 7), matLeafDark);
        c1.position.y = 0.56;
        const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.48, 7), matLeafBright);
        c2.position.y = 0.88;
        tree.add(c1, c2);
      } else {
        const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), matLeafBright);
        crown.position.y = 0.68;
        tree.add(crown);
      }
      return tree;
    }

    for (let i = 0; i < 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const side = i % 2 === 0 ? -1 : 1;
      const latX = side * (1.6 + (((i * 37) % 100) / 100) * 3.6);
      const tree = createLowPolyTree(i);
      tree.scale.setScalar(0.6 + (((i * 19) % 100) / 100) * 0.45);
      placeOnPlanet(tree, theta, latX, 0);
    }

    // Autobús Comunitario 3D de El Rescate
    const busAnchor = new THREE.Group();
    busAnchor.position.set(0, 0.04, 0);
    worldHeadingGroup.add(busAnchor);

    const busChassis = new THREE.Group();
    busAnchor.add(busChassis);

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.56, 2.75), matBusNavy);
    lowerBody.position.set(0, 0.52, 0);
    lowerBody.castShadow = true;
    busChassis.add(lowerBody);

    const upperCabin = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.52, 2.62), matBusWhite);
    upperCabin.position.set(0, 1.04, -0.02);
    upperCabin.castShadow = true;
    busChassis.add(upperCabin);

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.1, 2.46), matBusWhite);
    roofCap.position.set(0, 1.34, -0.02);
    busChassis.add(roofCap);

    const goldBelt = new THREE.Mesh(new THREE.BoxGeometry(1.31, 0.075, 2.79), matBusGold);
    goldBelt.position.set(0, 0.79, 0);
    busChassis.add(goldBelt);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.36, 0.08), matBusGlass);
    windshield.position.set(0, 1.05, 1.28);
    busChassis.add(windshield);

    [-0.9, -0.32, 0.26, 0.84].forEach((wz) => {
      const sideWin = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.33, 0.44), matBusGlass);
      sideWin.position.set(0, 1.05, wz);
      busChassis.add(sideWin);
    });

    const busWheels = [];
    [
      [-0.64, 0.28, -0.86],
      [0.64, 0.28, -0.86],
      [-0.64, 0.28, 0.86],
      [0.64, 0.28, 0.86]
    ].forEach(([wx, wy, wz]) => {
      const wg = new THREE.Group();
      wg.position.set(wx, wy, wz);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 24), matTire);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 16), matBusGold);
      rim.rotation.z = Math.PI / 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.04, 0.24), matBusWhite);
      wg.add(tire, rim, spoke);
      busAnchor.add(wg);
      busWheels.push(wg);
    });

    const floatingYearPivot = new THREE.Group();
    floatingYearPivot.position.set(0, 1.66, 0);
    scene.add(floatingYearPivot);

    let currentYearMeshGroup = build3DYearMeshGroup(getTimelineData()[0].year, matYearMatteGold, matBusNavy);
    floatingYearPivot.add(currentYearMeshGroup);

    let currentIndex = 0;
    let isTransitioning = false;
    const motionState = { planetAngle: 0, lastPlanetAngle: 0, busSpeedBoost: 0 };

    const routeNodesEl = document.getElementById("nexora-route-nodes");
    const polaroidStackEl = document.getElementById("polaroid-stack");
    const polaroidYearBadge = document.getElementById("polaroid-year-badge");
    const panelPolaroids = document.getElementById("panel-polaroids");
    const panelClipboard = document.getElementById("panel-clipboard");

    function renderRouteNodeButtons() {
      if (!routeNodesEl) return;
      routeNodesEl.innerHTML = "";
      const list = getTimelineData();
      list.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nexora-node-btn" + (idx === currentIndex ? " is-active" : "");
        btn.innerHTML = `
          <div class="nexora-node-btn__year">
            <span class="nexora-node-btn__dot"></span>
            <span>${item.year}</span>
          </div>
          <span class="nexora-node-btn__lbl">${item.shortLabel}</span>
        `;
        btn.addEventListener("click", () => {
          if (idx !== currentIndex) {
            navigateToIndex(idx, idx > currentIndex ? 1 : -1);
          }
        });
        routeNodesEl.appendChild(btn);
      });
    }

    renderRouteNodeButtons();

    function renderStepDOM(index) {
      const list = getTimelineData();
      const data = list[index] || list[0];
      if (polaroidYearBadge) polaroidYearBadge.textContent = data.year;
      if (polaroidStackEl) {
        polaroidStackEl.innerHTML = "";
        data.polaroids.forEach((p) => {
          const fig = document.createElement("figure");
          fig.className = "polaroid-card";
          fig.setAttribute("role", "button");
          fig.setAttribute("tabindex", "0");
          fig.innerHTML = `
            <div class="polaroid-card__photo-wrap">
              <img class="polaroid-card__photo" src="${p.img}" alt="${p.caption}" />
              <span class="polaroid-card__stamp">${data.year}</span>
            </div>
            <figcaption class="polaroid-card__caption">${p.caption}</figcaption>
            <div class="polaroid-card__sub">${p.sub}</div>
          `;

          // Ajuste #2: Al dar click en cualquier polaroid de Historia 3D se expande centrada con su información
          const handleExpandPolaroid = () => {
            openMediaLightbox({
              img: p.img,
              badge: `${data.year} • ${data.seal}`,
              code: `${data.docket} • ${p.sub}`,
              source: currentLang === "en" ? "3D HISTORICAL ARCHIVE • EL RESCATE" : "ARCHIVO HISTÓRICO 3D • EL RESCATE",
              title: p.caption,
              desc: `${p.detail || ""} ${data.description}`,
              stats: [
                { val: data.stat1Val, lbl: data.stat1Lbl },
                { val: data.stat2Val, lbl: data.stat2Lbl }
              ]
            });
          };

          fig.addEventListener("click", handleExpandPolaroid);
          fig.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              handleExpandPolaroid();
            }
          });
          polaroidStackEl.appendChild(fig);
        });
      }

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setTxt("clip-docket", data.docket);
      setTxt("clip-seal", data.seal);
      setTxt("clip-kicker", data.kicker);
      setTxt("clip-title", data.title);
      setTxt("clip-desc", data.description);
      setTxt("clip-stat-1-val", data.stat1Val);
      setTxt("clip-stat-1-lbl", data.stat1Lbl);
      setTxt("clip-stat-2-val", data.stat2Val);
      setTxt("clip-stat-2-lbl", data.stat2Lbl);

      if (routeNodesEl) {
        Array.from(routeNodesEl.children).forEach((b, i) => {
          b.classList.toggle("is-active", i === index);
        });
      }
    }

    refreshTimelineLanguage = () => {
      renderRouteNodeButtons();
      renderStepDOM(currentIndex);
    };

    function swap3DYearGeometry(newYearStr) {
      if (currentYearMeshGroup) {
        floatingYearPivot.remove(currentYearMeshGroup);
      }
      currentYearMeshGroup = build3DYearMeshGroup(newYearStr, matYearMatteGold, matBusNavy);
      floatingYearPivot.add(currentYearMeshGroup);
    }

    function navigateToIndex(targetIndex, direction = 1) {
      if (isTransitioning || targetIndex === currentIndex) return;
      isTransitioning = true;
      currentIndex = targetIndex;

      const list = getTimelineData();
      const stepAngle = (Math.PI * 2) / list.length;
      const targetAngle = motionState.planetAngle + direction * stepAngle;

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioning = false;
        }
      });

      tl.to([panelPolaroids, panelClipboard], {
        scale: 0.95,
        autoAlpha: 0,
        duration: 0.24,
        ease: "power2.out"
      }, 0)
        .to(motionState, {
          planetAngle: targetAngle,
          duration: 1.25,
          ease: "power3.inOut"
        }, 0)
        .to(busChassis.rotation, {
          x: direction * -0.032,
          duration: 0.35,
          ease: "power2.out"
        }, 0)
        .add(() => {
          renderStepDOM(currentIndex);
          swap3DYearGeometry(getTimelineData()[currentIndex].year);
        }, 0.82)
        .to(busChassis.rotation, {
          x: 0,
          duration: 0.45,
          ease: "back.out(2.2)"
        }, 0.88)
        .to([panelPolaroids, panelClipboard], {
          scale: 1,
          autoAlpha: 1,
          duration: 0.38,
          ease: "power3.out"
        }, 0.88);
    }

    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const len = getTimelineData().length;
        navigateToIndex((currentIndex - 1 + len) % len, -1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        const len = getTimelineData().length;
        navigateToIndex((currentIndex + 1) % len, 1);
      });
    }

    renderStepDOM(0);

    function handleResize() {
      const w = wrap.clientWidth || 1200;
      const h = wrap.clientHeight || 720;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const deltaAngle = motionState.planetAngle - motionState.lastPlanetAngle;
      motionState.lastPlanetAngle = motionState.planetAngle;

      planetPivot.rotation.x = -motionState.planetAngle;

      const wheelDelta = deltaAngle * (PLANET_RADIUS / 0.28);
      busWheels.forEach((w) => {
        w.rotation.x += wheelDelta;
      });

      if (!reduceMotion) {
        busChassis.position.y = Math.sin(t * 7.2) * 0.014;
        floatingYearPivot.position.y = 1.66 + Math.sin(t * 2.2) * 0.035;
        floatingYearPivot.rotation.y = Math.sin(t * 1.4) * 0.08;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  window.addEventListener("DOMContentLoaded", init3DBusTimeline);

  // ==========================================================================
  // 9. CALENDARIO DE CLÍNICA LEGAL (BILINGÜE ES / EN)
  // ==========================================================================
  const CALENDAR_MONTHS_I18N = {
    es: [
      {
        label: "Noviembre de 2026",
        monthName: "Noviembre",
        daysInMonth: 30,
        startDayOfWeek: 0,
        availableDays: {
          4: "Miércoles",
          7: "Sábado",
          11: "Miércoles",
          14: "Sábado",
          18: "Miércoles",
          21: "Sábado",
          25: "Miércoles",
          28: "Sábado"
        },
        defaultSelectedDay: 21
      },
      {
        label: "Diciembre de 2026",
        monthName: "Diciembre",
        daysInMonth: 31,
        startDayOfWeek: 2,
        availableDays: {
          2: "Miércoles",
          5: "Sábado",
          9: "Miércoles",
          12: "Sábado",
          16: "Miércoles",
          19: "Sábado"
        },
        defaultSelectedDay: 5
      }
    ],
    en: [
      {
        label: "November 2026",
        monthName: "November",
        daysInMonth: 30,
        startDayOfWeek: 0,
        availableDays: {
          4: "Wednesday",
          7: "Saturday",
          11: "Wednesday",
          14: "Saturday",
          18: "Wednesday",
          21: "Saturday",
          25: "Wednesday",
          28: "Saturday"
        },
        defaultSelectedDay: 21
      },
      {
        label: "December 2026",
        monthName: "December",
        daysInMonth: 31,
        startDayOfWeek: 2,
        availableDays: {
          2: "Wednesday",
          5: "Saturday",
          9: "Wednesday",
          12: "Saturday",
          16: "Wednesday",
          19: "Saturday"
        },
        defaultSelectedDay: 5
      }
    ]
  };

  function getCalendarMonths() {
    return CALENDAR_MONTHS_I18N[currentLang] || CALENDAR_MONTHS_I18N.es;
  }

  const SLOTS_BY_DAY_TYPE = {
    Sábado: ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM", "12:00 PM – 1:00 PM"],
    Saturday: ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM", "12:00 PM – 1:00 PM"],
    Miércoles: ["2:00 PM – 3:00 PM", "3:00 PM – 4:00 PM", "4:00 PM – 5:00 PM"],
    Wednesday: ["2:00 PM – 3:00 PM", "3:00 PM – 4:00 PM", "4:00 PM – 5:00 PM"]
  };

  let currentMonthIdx = 0;
  let selectedDay = 21;
  let selectedSlot = "11:00 AM – 12:00 PM";

  const calGridEl = document.getElementById("calendar-days-grid");
  const calMonthLabel = document.getElementById("cal-month-label");
  const timeslotHeading = document.getElementById("timeslot-heading");
  const timeslotPillsEl = document.getElementById("timeslot-pills");
  const selectionSummaryText = document.getElementById("selection-summary-text");

  function renderClinicCalendar() {
    if (!calGridEl) return;
    const months = getCalendarMonths();
    const monthObj = months[currentMonthIdx];
    if (calMonthLabel) calMonthLabel.textContent = monthObj.label;

    calGridEl.innerHTML = "";

    for (let e = 0; e < monthObj.startDayOfWeek; e++) {
      const empty = document.createElement("span");
      empty.className = "cal-day";
      calGridEl.appendChild(empty);
    }

    for (let day = 1; day <= monthObj.daysInMonth; day++) {
      const dayType = monthObj.availableDays[day];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(day);

      if (dayType) {
        btn.className =
          "cal-day cal-day--available" + (day === selectedDay ? " cal-day--selected" : "");
        btn.addEventListener("click", () => {
          selectedDay = day;
          const slots = SLOTS_BY_DAY_TYPE[dayType] || SLOTS_BY_DAY_TYPE["Sábado"];
          if (!slots.includes(selectedSlot)) {
            selectedSlot = slots[1] || slots[0];
          }
          renderClinicCalendar();
          renderTimeSlots();
          updateSelectionBanner();
        });
      } else {
        btn.className = "cal-day";
        btn.disabled = true;
      }

      calGridEl.appendChild(btn);
    }
  }

  function renderTimeSlots() {
    if (!timeslotPillsEl) return;
    const months = getCalendarMonths();
    const monthObj = months[currentMonthIdx];
    const dayType = monthObj.availableDays[selectedDay] || (currentLang === "en" ? "Saturday" : "Sábado");
    const slots = SLOTS_BY_DAY_TYPE[dayType] || SLOTS_BY_DAY_TYPE["Sábado"];

    if (timeslotHeading) {
      timeslotHeading.textContent =
        currentLang === "en"
          ? `${dayType}, ${monthObj.monthName} ${selectedDay} – Choose a Time Slot`
          : `${dayType}, ${selectedDay} De ${monthObj.monthName} – Elige Un Horario`;
    }

    timeslotPillsEl.innerHTML = "";
    slots.forEach((slot) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "timeslot-pill" + (slot === selectedSlot ? " is-selected" : "");
      pill.textContent = slot;
      pill.addEventListener("click", () => {
        selectedSlot = slot;
        renderTimeSlots();
        updateSelectionBanner();
      });
      timeslotPillsEl.appendChild(pill);
    });
  }

  function updateSelectionBanner() {
    if (!selectionSummaryText) return;
    const months = getCalendarMonths();
    const monthObj = months[currentMonthIdx];
    const dayType = monthObj.availableDays[selectedDay] || (currentLang === "en" ? "Saturday" : "Sábado");
    selectionSummaryText.textContent =
      currentLang === "en"
        ? `${dayType}, ${monthObj.monthName} ${selectedDay}, ${selectedSlot}`
        : `${dayType}, ${selectedDay} De ${monthObj.monthName}, ${selectedSlot}`;
  }

  const prevMonthBtn = document.getElementById("cal-prev-month");
  const nextMonthBtn = document.getElementById("cal-next-month");
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      const months = getCalendarMonths();
      currentMonthIdx = (currentMonthIdx - 1 + months.length) % months.length;
      selectedDay = months[currentMonthIdx].defaultSelectedDay;
      renderClinicCalendar();
      renderTimeSlots();
      updateSelectionBanner();
    });
    nextMonthBtn.addEventListener("click", () => {
      const months = getCalendarMonths();
      currentMonthIdx = (currentMonthIdx + 1) % months.length;
      selectedDay = months[currentMonthIdx].defaultSelectedDay;
      renderClinicCalendar();
      renderTimeSlots();
      updateSelectionBanner();
    });
  }

  renderClinicCalendar();
  renderTimeSlots();
  updateSelectionBanner();

  const bookingForm = document.getElementById("clinic-booking-form");
  const successToast = document.getElementById("booking-success-toast");
  if (bookingForm && successToast) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const defaultName = currentLang === "en" ? "Community Member" : "Integrante de la comunidad";
      const defaultCase = currentLang === "en" ? "General Orientation" : "Orientación General";
      const nameVal = document.getElementById("input-name").value.trim() || defaultName;
      const caseVal = document.getElementById("input-case-type").value || defaultCase;
      const summary = selectionSummaryText ? selectionSummaryText.textContent : "";

      successToast.textContent =
        currentLang === "en"
          ? `✓ Session pre-confirmed for ${nameVal}! We look forward to seeing you on ${summary} (${caseVal}). You will receive a confidential confirmation.`
          : `✓ ¡Charla pre-confirmada para ${nameVal}! Te esperamos el ${summary} (${caseVal}). Recibirás confirmación confidencial.`;
      successToast.classList.add("is-visible");
    });
  }

  // ==========================================================================
  // 9.5. AJUSTE #2: EFECTO CIFRADO / DECODIFICADOR / MATRIX + ODÓMETRO
  //      EN TARJETAS DE "IMPACTO COMUNITARIO EN CIFRAS" (#impacto)
  // ==========================================================================
  const CIPHER_GLYPHS = "0123456789@#$%&*!?/|>_~[]{}ΔΣΩ▒░";
  const MATRIX_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "#", "%", "+", "K", "Δ", "8", "4"];

  function buildOdometerColumns(odometerEl) {
    const finalStr = odometerEl.getAttribute("data-cipher-value") || odometerEl.textContent.trim();
    odometerEl.innerHTML = "";

    Array.from(finalStr).forEach((targetChar, charIdx) => {
      const col = document.createElement("span");
      col.className = "cipher-digit-col";

      const reel = document.createElement("span");
      reel.className = "cipher-digit-reel";

      // Creamos una tira vertical con caracteres de cifrado/matrix + dígitos y el carácter final al fondo
      const stepsCount = 9 + charIdx * 2;
      for (let s = 0; s < stepsCount; s++) {
        const cell = document.createElement("span");
        cell.className = "cipher-digit-cell" + (s < stepsCount - 1 ? " is-matrix-glyph" : "");
        if (s === 0) {
          cell.textContent = targetChar;
        } else {
          const rndGlyph = MATRIX_DIGITS[(s * 3 + charIdx * 7) % MATRIX_DIGITS.length];
          cell.textContent = rndGlyph;
        }
        reel.appendChild(cell);
      }

      // Última celda: valor real decodificado
      const finalCell = document.createElement("span");
      finalCell.className = "cipher-digit-cell";
      finalCell.textContent = targetChar;
      reel.appendChild(finalCell);

      col.appendChild(reel);
      odometerEl.appendChild(col);
    });
  }

  function decodeLabelText(labelEl, durationMs = 1150) {
    if (!labelEl) return;
    const langAttr = currentLang === "en" ? "data-cipher-text-en" : "data-cipher-text-es";
    const targetText =
      labelEl.getAttribute(langAttr) ||
      labelEl.getAttribute("data-cipher-text") ||
      labelEl.textContent.trim();
    if (labelEl._cipherRaf) {
      cancelAnimationFrame(labelEl._cipherRaf);
    }

    if (reduceMotion) {
      labelEl.textContent = targetText;
      return;
    }

    const startTime = performance.now();
    const len = targetText.length;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const lockedCount = Math.floor(progress * len);

      let htmlOut = "";
      for (let i = 0; i < len; i++) {
        const origChar = targetText[i];
        if (origChar === " ") {
          htmlOut += " ";
        } else if (i < lockedCount) {
          htmlOut += origChar;
        } else if (i < lockedCount + 4) {
          // Frontera activa de decodificación resaltada (exacto a Referencia_Efecto_Cifrado)
          const g = CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
          htmlOut += `<span class="cipher-char--scrambling">${g}</span>`;
        } else {
          const g = CIPHER_GLYPHS[(i * 5 + Math.floor(elapsed / 40)) % CIPHER_GLYPHS.length];
          htmlOut += `<span style="opacity:0.55;">${g}</span>`;
        }
      }

      labelEl.innerHTML = htmlOut;

      if (progress < 1) {
        labelEl._cipherRaf = requestAnimationFrame(tick);
      } else {
        labelEl.textContent = targetText;
      }
    }

    labelEl._cipherRaf = requestAnimationFrame(tick);
  }

  function triggerCipherCardAnimation(cardEl, delaySec = 0) {
    if (!cardEl) return;
    const odometerEl = cardEl.querySelector(".cipher-odometer");
    const labelEl = cardEl.querySelector(".cipher-label");

    if (odometerEl && !odometerEl.querySelector(".cipher-digit-col")) {
      buildOdometerColumns(odometerEl);
    }

    setTimeout(() => {
      cardEl.classList.add("is-decoding");

      if (odometerEl) {
        const reels = odometerEl.querySelectorAll(".cipher-digit-reel");
        reels.forEach((reel, idx) => {
          const totalCells = reel.children.length;
          const maxShiftPercent = -((totalCells - 1) / totalCells) * 100;

          if (reduceMotion) {
            gsap.set(reel, { yPercent: maxShiftPercent });
          } else {
            gsap.fromTo(
              reel,
              { yPercent: 0 },
              {
                yPercent: maxShiftPercent,
                duration: 0.95 + idx * 0.14,
                ease: "power3.inOut",
                overwrite: true
              }
            );
          }
        });
      }

      if (labelEl) {
        decodeLabelText(labelEl, 1180);
      }

      setTimeout(() => {
        cardEl.classList.remove("is-decoding");
      }, 1350);
    }, delaySec * 1000);
  }

  const cipherCards = Array.from(document.querySelectorAll(".cipher-stat-card"));
  cipherCards.forEach((card) => {
    const odometerEl = card.querySelector(".cipher-odometer");
    if (odometerEl) buildOdometerColumns(odometerEl);

    card.addEventListener("mouseenter", () => {
      triggerCipherCardAnimation(card, 0);
    });
  });

  function runAllCipherCards() {
    cipherCards.forEach((card, idx) => {
      triggerCipherCardAnimation(card, idx * 0.12);
    });
  }

  const btnReplayCipher = document.getElementById("btn-replay-cipher");
  if (btnReplayCipher) {
    btnReplayCipher.addEventListener("click", runAllCipherCards);
  }

  if (typeof window.ScrollTrigger !== "undefined" && cipherCards.length > 0) {
    window.ScrollTrigger.create({
      trigger: "#impacto",
      start: "top 78%",
      onEnter: () => runAllCipherCards(),
      onEnterBack: () => runAllCipherCards()
    });
  } else {
    setTimeout(runAllCipherCards, 900);
  }

  // ==========================================================================
  // 10. AJUSTE #5: ASISTENTE VIRTUAL CON SIMULACIÓN DE CONVERSACIÓN INTERACTIVA
  //     (Inspirado en Referencia_asistente_virtual.mp4 + Opciones ampliadas ES/EN)
  // ==========================================================================
  const ASSISTANT_FLOWS_I18N = {
    es: {
      greeting: "¡Hola! Cuéntame sobre tu caso. ¿Qué tipo de ayuda buscas hoy?",
      choosePrompt: "Elige una opción:",
      scheduleBtn: "📅 Agendar charla",
      donateBtn: "💛 Ir a Donaciones",
      backBtn: "← Volver al menú",
      topics: [
        {
          id: "daca",
          label: "DACA",
          question: "¿Tienes DACA activo o venció hace menos de un año?",
          options: [
            {
              label: "Sí, sigue activo o venció hace menos de 1 año",
              reply:
                "¡Excelente noticia! Podemos ayudarte a preparar tu renovación de DACA (Formularios I-821D e I-765) y evaluar si calificas para nuestro fondo de becas de tasas federales."
            },
            {
              label: "Venció hace más de 1 año / Es primera vez",
              reply:
                "Cuando DACA venció hace más de un año o es solicitud inicial, existen restricciones judiciales vigentes. Te recomendamos agendar una charla legal para evaluar otras vías migratorias como petición familiar o Visa U."
            }
          ]
        },
        {
          id: "tps",
          label: "TPS",
          question: "¿De qué país eres nacional o necesitas reinscribir tu TPS?",
          options: [
            {
              label: "El Salvador, Honduras, Nicaragua o Venezuela",
              reply:
                "En El Rescate somos especialistas históricos en TPS desde 1990. Te asistimos con la reinscripción dentro del periodo oficial del Registro Federal y la extensión automática de tu permiso laboral."
            },
            {
              label: "Otro país designado / Consulta de viaje (Advance Parole)",
              reply:
                "Revisamos la designación vigente de tu país y también tramitamos permisos de viaje humanitario (Advance Parole) para titulares de TPS que buscan ajustar su estatus."
            }
          ]
        },
        {
          id: "asilo",
          label: "Asilo",
          question: "¿Cuánto tiempo llevas en EE. UU.?",
          options: [
            {
              label: "Menos de 1 año",
              reply:
                "Estás a tiempo para solicitar asilo. Agenda tu charla para preparar tu caso (Formulario I-589) con nuestro equipo jurídico de derechos humanos."
            },
            {
              label: "Más de 1 año / Tengo cita en Corte",
              reply:
                "Aunque la regla general exige aplicar dentro del primer año, existen excepciones legales por cambio de circunstancias y defensas ante la corte (EOIR). Agenda una charla urgente para revisar tu expediente."
            }
          ]
        },
        {
          id: "familia",
          label: "Residencia Familiar",
          question: "¿Quién es el familiar que podría pedirte?",
          options: [
            {
              label: "Cónyuge, hijo(a) ciudadano mayor de 21 años o padres",
              reply:
                "Los familiares inmediatos de ciudadanos estadounidenses tienen prioridad sin lista de espera de visa. En tu charla evaluaremos si puedes hacer Ajuste de Estatus dentro de EE. UU. o Proceso Consular con perdón I-601A."
            },
            {
              label: "Esposo(a) Residente Permanente o hermano(a) ciudadano",
              reply:
                "Estas categorías se rigen por el Boletín de Visas mensual. Te ayudamos a presentar la petición I-130 correctamente para asegurar tu fecha de prioridad."
            }
          ]
        },
        {
          id: "visau",
          label: "Visa U / VAWA",
          question: "¿Fuiste víctima de un delito en EE. UU. o de maltrato familiar?",
          options: [
            {
              label: "Víctima de delito y colaboré con la policía (Visa U)",
              reply:
                "La Visa U protege a víctimas de delitos calificados que cooperaron con las autoridades, otorgando permiso de trabajo y camino a la residencia. Revisaremos tu reporte policial de forma 100% confidencial."
            },
            {
              label: "Maltrato por cónyuge, padre o hijo ciudadano/residente (VAWA)",
              reply:
                "Bajo la ley VAWA puedes solicitar tu estatus legal por cuenta propia, en total confidencialidad y sin que la persona agresora se entere. Nuestro equipo te acompaña con calidez y seguridad."
            }
          ]
        },
        {
          id: "ciudadania",
          label: "Ciudadanía",
          question: "¿Cuánto tiempo llevas con tu Residencia Permanente (Green Card)?",
          options: [
            {
              label: "5 años o más (o 3 años casado/a con ciudadano/a)",
              reply:
                "¡Ya cumples el requisito de tiempo para la Naturalización (N-400)! Evaluamos también si calificas para exención de pago de tarifa (I-912) o para hacer el examen en español por edad y años de residencia."
            },
            {
              label: "Aún me falta tiempo o debo renovar mi Green Card (I-90)",
              reply:
                "Podemos ayudarte desde ahora a renovar tu tarjeta de residencia (I-90), revisar tu récord antes de aplicar y prepararte en nuestros talleres comunitarios de educación cívica."
            }
          ]
        },
        {
          id: "horarios",
          label: "Horarios / Clínica",
          question: "¿Qué información necesitas sobre nuestra atención presencial?",
          options: [
            {
              label: "Días y horarios de las charlas legales gratuitas",
              reply:
                "Nuestras clínicas comunitarias se realizan todos los Miércoles de 2:00 PM a 5:00 PM y los Sábados de 10:00 AM a 1:00 PM en 1501 W. 8th St., Los Ángeles, CA 90017."
            },
            {
              label: "¿Qué documentos debo llevar a mi primera cita?",
              reply:
                "Trae tu identificación oficial o pasaporte, cualquier documento previo de inmigración (avisos de USCIS, corte o permisos) y reportes policiales si aplicas a Visa U."
            }
          ]
        },
        {
          id: "donar",
          label: "Donaciones ONG",
          question: "¿Cómo te gustaría apoyar la misión humanitaria de El Rescate?",
          options: [
            {
              label: "Apoyar una campaña activa (Asilo, Clínicas, DACA o General)",
              reply:
                "El 100% de tu aporte es deducible de impuestos bajo el estatus 501(c)(3) (EIN: 95-3759142). Puedes elegir entre Organización General, Defensa de Asilo, Clínicas Comunitarias o Futuro Joven DACA.",
              isDonation: true
            }
          ]
        }
      ]
    },
    en: {
      greeting: "Hello! Tell me about your case. What kind of legal help are you looking for today?",
      choosePrompt: "Choose an option:",
      scheduleBtn: "📅 Book a consultation",
      donateBtn: "💛 Go to Donations",
      backBtn: "← Back to main topics",
      topics: [
        {
          id: "daca",
          label: "DACA",
          question: "Is your DACA currently active or did it expire less than a year ago?",
          options: [
            {
              label: "Yes, still active or expired less than 1 year ago",
              reply:
                "Great news! We can help you prepare your DACA renewal (Forms I-821D & I-765) and check if you qualify for our federal fee scholarship fund."
            },
            {
              label: "Expired over 1 year ago / First-time applicant",
              reply:
                "When DACA has been expired for more than a year or is an initial request, federal court restrictions apply. Book a consultation so our attorneys can screen you for alternative relief such as family petitions or U Visas."
            }
          ]
        },
        {
          id: "tps",
          label: "TPS",
          question: "Which country are you a national of, or do you need TPS re-registration?",
          options: [
            {
              label: "El Salvador, Honduras, Nicaragua, or Venezuela",
              reply:
                "El Rescate has pioneered TPS legal defense since 1990. We assist you with timely re-registration under the Federal Register window and automatic work permit extensions."
            },
            {
              label: "Another designated country / Travel permit (Advance Parole)",
              reply:
                "We review your country's current TPS designation and also prepare humanitarian Advance Parole travel requests for TPS holders seeking pathways to permanent residence."
            }
          ]
        },
        {
          id: "asilo",
          label: "Asylum",
          question: "How long have you been in the United States?",
          options: [
            {
              label: "Less than 1 year",
              reply:
                "You are within the one-year filing window to apply for asylum. Book your legal consultation so our human rights legal team can help prepare your Form I-589."
            },
            {
              label: "More than 1 year / I have an Immigration Court date",
              reply:
                "While asylum generally requires filing within one year, legal exceptions exist for changed circumstances as well as defensive relief before EOIR court. Schedule an urgent consultation so we can review your file."
            }
          ]
        },
        {
          id: "familia",
          label: "Family Petition",
          question: "Which family member could petition for you?",
          options: [
            {
              label: "U.S. Citizen spouse, child over 21, or parent",
              reply:
                "Immediate relatives of U.S. citizens have priority without visa backlog wait times. During your session we will evaluate whether you qualify for Adjustment of Status inside the U.S. or Consular Processing with an I-601A waiver."
            },
            {
              label: "Permanent Resident spouse or U.S. Citizen sibling",
              reply:
                "These preference categories follow the monthly Visa Bulletin. We help you file Form I-130 accurately to lock in your priority date."
            }
          ]
        },
        {
          id: "visau",
          label: "U Visa / VAWA",
          question: "Were you a victim of a qualifying crime in the U.S. or domestic abuse?",
          options: [
            {
              label: "Victim of a crime & cooperated with police (U Visa)",
              reply:
                "The U Visa protects victims of qualifying crimes who assisted law enforcement, providing work authorization and a path to residency. We will review your police report with 100% confidentiality."
            },
            {
              label: "Abuse by a U.S. Citizen or Resident spouse/parent/child (VAWA)",
              reply:
                "Under VAWA you can self-petition for legal status in complete confidentiality without the abuser ever knowing. Our legal team supports you safely and compassionately."
            }
          ]
        },
        {
          id: "ciudadania",
          label: "Citizenship",
          question: "How long have you held your Permanent Residence (Green Card)?",
          options: [
            {
              label: "5+ years (or 3+ years married to a U.S. Citizen)",
              reply:
                "You meet the residence timeline for Naturalization (Form N-400)! We also check if you qualify for a federal fee waiver (I-912) or a Spanish-language civics exam exemption based on age and residency."
            },
            {
              label: "Not yet eligible or need to renew my Green Card (I-90)",
              reply:
                "We can assist you right away with renewing your Green Card (Form I-90), reviewing your record ahead of time, and joining our community civics workshops."
            }
          ]
        },
        {
          id: "horarios",
          label: "Clinic Hours",
          question: "What would you like to know about our in-person clinic?",
          options: [
            {
              label: "Days and hours for free legal orientation sessions",
              reply:
                "Our community legal clinics take place every Wednesday from 2:00 PM to 5:00 PM and Saturday from 10:00 AM to 1:00 PM at 1501 W. 8th St., Los Angeles, CA 90017."
            },
            {
              label: "What documents should I bring to my first appointment?",
              reply:
                "Please bring a valid photo ID or passport, any prior immigration notices (USCIS receipts, court notices, or work permits), and police reports if inquiring about a U Visa."
            }
          ]
        },
        {
          id: "donar",
          label: "NGO Donations",
          question: "How would you like to support El Rescate's humanitarian mission?",
          options: [
            {
              label: "Support an active campaign (Asylum, Clinics, DACA, or General)",
              reply:
                "100% of your contribution is tax-deductible under 501(c)(3) status (EIN: 95-3759142). You can direct your gift to General Organization, Asylum Defense, Community Clinics, or DACA Youth Future.",
              isDonation: true
            }
          ]
        }
      ]
    }
  };

  const evalFab = document.getElementById("evaluador-fab");
  const evalModal = document.getElementById("evaluador-modal");
  const evalClose = document.getElementById("evaluador-close");
  const evalReset = document.getElementById("evaluador-reset");
  const chatLogEl = document.getElementById("asistente-chat-log");
  const chatOptionsPillsEl = document.getElementById("asistente-options-pills");
  const chatOptionsLabelEl = document.getElementById("asistente-options-label");

  function appendChatMessage(role, htmlText) {
    if (!chatLogEl) return;
    const msg = document.createElement("div");
    msg.className = `chat-msg chat-msg--${role}`;
    msg.innerHTML = htmlText;
    chatLogEl.appendChild(msg);
    requestAnimationFrame(() => {
      chatLogEl.scrollTop = chatLogEl.scrollHeight;
    });
  }

  function renderMainTopicPills() {
    if (!chatOptionsPillsEl) return;
    const dict = ASSISTANT_FLOWS_I18N[currentLang] || ASSISTANT_FLOWS_I18N.es;
    if (chatOptionsLabelEl) chatOptionsLabelEl.textContent = dict.choosePrompt;
    chatOptionsPillsEl.innerHTML = "";

    dict.topics.forEach((topic) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "asistente-opt-btn";
      btn.textContent = topic.label;
      btn.addEventListener("click", () => handleTopicSelection(topic));
      chatOptionsPillsEl.appendChild(btn);
    });
  }

  function handleTopicSelection(topic) {
    const dict = ASSISTANT_FLOWS_I18N[currentLang] || ASSISTANT_FLOWS_I18N.es;
    appendChatMessage("user", topic.label);

    setTimeout(() => {
      appendChatMessage("bot", topic.question);
      if (!chatOptionsPillsEl) return;
      if (chatOptionsLabelEl) chatOptionsLabelEl.textContent = dict.choosePrompt;
      chatOptionsPillsEl.innerHTML = "";

      topic.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "asistente-opt-btn";
        btn.textContent = opt.label;
        btn.addEventListener("click", () => handleSubOptionSelection(opt));
        chatOptionsPillsEl.appendChild(btn);
      });

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "asistente-opt-btn asistente-opt-btn--secondary";
      backBtn.textContent = dict.backBtn;
      backBtn.addEventListener("click", () => {
        appendChatMessage("user", dict.backBtn);
        setTimeout(() => {
          appendChatMessage("bot", dict.greeting);
          renderMainTopicPills();
        }, 160);
      });
      chatOptionsPillsEl.appendChild(backBtn);
    }, 180);
  }

  function handleSubOptionSelection(opt) {
    const dict = ASSISTANT_FLOWS_I18N[currentLang] || ASSISTANT_FLOWS_I18N.es;
    appendChatMessage("user", opt.label);

    setTimeout(() => {
      appendChatMessage("bot", opt.reply);
      if (!chatOptionsPillsEl) return;
      chatOptionsPillsEl.innerHTML = "";

      if (opt.isDonation) {
        const donBtn = document.createElement("button");
        donBtn.type = "button";
        donBtn.className = "asistente-opt-btn asistente-opt-btn--cta";
        donBtn.textContent = dict.donateBtn;
        donBtn.addEventListener("click", () => {
          if (evalModal) evalModal.classList.remove("is-open");
          const donSec = document.getElementById("donaciones");
          if (donSec) donSec.scrollIntoView({ behavior: "smooth" });
        });
        chatOptionsPillsEl.appendChild(donBtn);
      } else {
        const schedBtn = document.createElement("button");
        schedBtn.type = "button";
        schedBtn.className = "asistente-opt-btn asistente-opt-btn--cta";
        schedBtn.textContent = dict.scheduleBtn;
        schedBtn.addEventListener("click", () => {
          if (evalModal) evalModal.classList.remove("is-open");
          const clinicaSec = document.getElementById("clinica-citas");
          if (clinicaSec) clinicaSec.scrollIntoView({ behavior: "smooth" });
        });
        chatOptionsPillsEl.appendChild(schedBtn);
      }

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "asistente-opt-btn asistente-opt-btn--secondary";
      backBtn.textContent = dict.backBtn;
      backBtn.addEventListener("click", () => {
        appendChatMessage("user", dict.backBtn);
        setTimeout(() => {
          appendChatMessage("bot", dict.greeting);
          renderMainTopicPills();
        }, 160);
      });
      chatOptionsPillsEl.appendChild(backBtn);
    }, 180);
  }

  function resetAssistantConversation() {
    if (!chatLogEl) return;
    const dict = ASSISTANT_FLOWS_I18N[currentLang] || ASSISTANT_FLOWS_I18N.es;
    chatLogEl.innerHTML = "";
    appendChatMessage("bot", dict.greeting);
    renderMainTopicPills();
  }

  resetAssistantConversation();

  if (evalReset) {
    evalReset.addEventListener("click", resetAssistantConversation);
  }

  if (evalFab && evalModal && evalClose) {
    evalFab.addEventListener("click", () => {
      evalModal.classList.add("is-open");
    });
    evalClose.addEventListener("click", () => {
      evalModal.classList.remove("is-open");
    });
    evalModal.addEventListener("click", (e) => {
      if (e.target === evalModal) evalModal.classList.remove("is-open");
    });
  }

  // ==========================================================================
  // 11. AJUSTES #1, #3 Y #4: MÓDULO DE DONACIONES ONG BILINGÜE (ES/EN)
  //     + CORRECCIÓN DE SCROLL CON RUEDITA DEL MOUSE EN #vista-donacion
  // ==========================================================================
  const DONATION_CAMPAIGNS_I18N = {
    es: {
      organizacion: {
        id: "organizacion",
        shortName: "Organización General",
        badge: "FONDO INSTITUCIONAL GENERAL",
        code: "CAMPAÑA #ER-ORG-2026",
        title: "Organización General — El Rescate Los Ángeles",
        lead:
          "Tu aporte fortalece de manera integral todas las áreas de impacto de El Rescate desde 1981: defensa jurídica de emergencia, clínicas gratuitas de miércoles y sábados y acompañamiento comunitario en Los Ángeles.",
        desc:
          "Este fondo general permite que El Rescate responda de inmediato donde la necesidad humanitaria es más urgente en el sur de California, sosteniendo nuestra sede histórica en Westlake y garantizando atención sin barreras.",
        callout: "Apoya a toda la organización en general o elige una campaña activa arriba",
        raised: "Recaudado: $84,500 USD",
        goal: "Meta: $100,000 USD (85%)",
        percent: 85,
        stat1Val: "100%",
        stat1Lbl: "Deducible de impuestos (501c3)",
        stat2Val: "+1,200",
        stat2Lbl: "Consultas gratuitas al año",
        img: "assets/provisional-documentary-la-placita.jpg",
        allocations: [
          { label: "Representación y defensa jurídica directa", pct: 76 },
          { label: "Clínicas comunitarias semanales (Mié y Sáb)", pct: 16 },
          { label: "Sostenimiento operativo y archivo histórico", pct: 8 }
        ],
        deliverables: [
          "Sostiene la operación continua de la sede comunitaria de El Rescate en 1501 W. 8th St., Los Ángeles.",
          "Garantiza intérpretes y orientación bilingüe gratuita para familias recién llegadas.",
          "Financia recursos de emergencia para casos humanitarios prioritarios."
        ],
        impactByAmount: {
          35: "Con $35 USD cubres el kit de orientación legal bilingüe y archivo inicial para una persona.",
          75: "Con $75 USD cubres la apertura de expediente y orientación jurídica inicial de una familia.",
          150: "Con $150 USD financias una sesión completa de preparación documental y traducción certificada.",
          250: "Con $250 USD respaldas media jornada de clínica legal gratuita para decenas de vecinos en Westlake.",
          500: "Con $500 USD patrocinas la defensa jurídica inicial de un caso humanitario ante tribunales.",
          1000: "Con $1,000 USD sostienes una brigada completa de protección legal y acompañamiento familiar."
        }
      },
      asilo: {
        id: "asilo",
        shortName: "Defensa Legal y Asilo",
        badge: "REPRESENTACIÓN URGENTE EN CORTE",
        code: "CAMPAÑA #ER-ASILO-2026",
        title: "Campaña de Defensa Legal, Asilo y Refugio Humanitario",
        lead:
          "Ninguna familia que busca refugio debería presentarse sola ante un tribunal de inmigración. Esta campaña financia abogados defensores, peritajes de derechos humanos y amparos urgentes.",
        desc:
          "Nacida de la misión fundacional de El Rescate en 1981, esta campaña provee representación legal ética en solicitudes de asilo afirmativo y defensivo, Visas U para víctimas de delitos y peticiones VAWA.",
        callout: "Estás respaldando la defensa legal directa de solicitantes de asilo y refugio",
        raised: "Recaudado: $62,800 USD",
        goal: "Meta: $80,000 USD (79%)",
        percent: 79,
        stat1Val: "98%",
        stat1Lbl: "Casos con seguimiento activo",
        stat2Val: "Pro Bono",
        stat2Lbl: "Defensa ética en tribunales de L.A.",
        img: "assets/provisional-documentary-macarthur-park.jpg",
        allocations: [
          { label: "Abogados litigantes de asilo y protección humanitaria", pct: 82 },
          { label: "Traducción de evidencias, peritajes y declaraciones juradas", pct: 12 },
          { label: "Acompañamiento psicosocial y preparación de audiencia", pct: 6 }
        ],
        deliverables: [
          "Preparación integral de expedientes de asilo afirmativo y defensivo en Los Ángeles.",
          "Representación legal especializada para mujeres y familias bajo protección VAWA y Visa U.",
          "Traducción oficial de documentos y pruebas de derechos humanos para tribunales."
        ],
        impactByAmount: {
          35: "Con $35 USD cubres la traducción certificada de actas y documentos probatorios de asilo.",
          75: "Con $75 USD financias una evaluación jurídica profunda de elegibilidad para asilo o Visa U.",
          150: "Con $150 USD cubres la redacción de declaraciones juradas con asistencia de intérprete.",
          250: "Con $250 USD respaldas la preparación de audiencia preliminar ante la corte de inmigración.",
          500: "Con $500 USD patrocinas el patrocinio legal de emergencia para una madre y sus hijos.",
          1000: "Con $1,000 USD financias la defensa técnica integral de un expediente de refugio humanitario."
        }
      },
      clinicas: {
        id: "clinicas",
        shortName: "Clínicas Comunitarias",
        badge: "JORNADAS GRATUITAS MIÉ & SÁB",
        code: "CAMPAÑA #ER-CLINICA-2026",
        title: "Campaña de Clínicas Legales Comunitarias de Miércoles y Sábados",
        lead:
          "Mantén abiertas las puertas de nuestras charlas legales presenciales todos los miércoles (2–5 PM) y sábados (10 AM–1 PM) para que cualquier persona reciba orientación confiable sin miedo a fraudes.",
        desc:
          "Nuestras clínicas semanales son el primer punto de contacto seguro para miles de trabajadores y familias en Los Ángeles. Tu donación permite ampliar cupos, horarios y asesores legales.",
        callout: "Estás financiando las clínicas gratuitas de miércoles y sábados en Westlake",
        raised: "Recaudado: $41,200 USD",
        goal: "Meta: $50,000 USD (82%)",
        percent: 82,
        stat1Val: "2 Jornadas",
        stat1Lbl: "Semanales abiertas a la comunidad",
        stat2Val: "0 Costo",
        stat2Lbl: "En orientación inicial comunitaria",
        img: "assets/provisional-documentary-la-placita.jpg",
        allocations: [
          { label: "Coordinadores legales y paralegales en jornadas de Mié y Sáb", pct: 74 },
          { label: "Plataforma digital de citas confidenciales y recordatorios", pct: 16 },
          { label: "Guías impresas de derechos constitucionales (Conoce tus Derechos)", pct: 10 }
        ],
        deliverables: [
          "Operación garantizada de las clínicas presenciales de miércoles (2–5 PM) y sábados (10 AM–1 PM).",
          "Distribución gratuita de tarjetas 'Conoce tus Derechos' en español e inglés.",
          "Prevención contra el fraude notarial mediante diagnóstico legal honesto."
        ],
        impactByAmount: {
          35: "Con $35 USD entregas 50 guías bilingües de 'Conoce tus Derechos' en vecindarios de L.A.",
          75: "Con $75 USD patrocinas el cupo de orientación gratuita para 3 familias en la clínica del sábado.",
          150: "Con $150 USD cubres las horas de un especialista legal durante una tarde completa de miércoles.",
          250: "Con $250 USD financias toda una jornada sabatina de recepción y diagnóstico comunitario.",
          500: "Con $500 USD sostienes dos semanas completas de clínicas jurídicas abiertas al público.",
          1000: "Con $1,000 USD impulsas un mes entero de clínicas comunitarias gratuitas en Westlake."
        }
      },
      daca: {
        id: "daca",
        shortName: "Futuro Joven & DACA",
        badge: "PROTECCIÓN DE DREAMERS Y MENORES",
        code: "CAMPAÑA #ER-DACA-2026",
        title: "Campaña Futuro Joven, Renovación DACA y Reunificación Familiar",
        lead:
          "Impulsa los sueños universitarios y laborales de jóvenes Dreamers y protege a menores inmigrantes mediante becas para tasas de renovación DACA, TPS y peticiones de unidad familiar.",
        desc:
          "Muchos estudiantes y jóvenes trabajadores enfrentan barreras económicas para cubrir las tarifas federales de renovación de sus permisos de trabajo. Este fondo otorga apoyo directo y asesoría legal.",
        callout: "Estás impulsando becas de renovación DACA, TPS y protección de jóvenes",
        raised: "Recaudado: $53,900 USD",
        goal: "Meta: $65,000 USD (83%)",
        percent: 83,
        stat1Val: "+3,400",
        stat1Lbl: "Jóvenes y estudiantes asesorados",
        stat2Val: "100%",
        stat2Lbl: "Acompañamiento en renovaciones",
        img: "assets/provisional-documentary-macarthur-park.jpg",
        allocations: [
          { label: "Fondo de becas para tasas de renovación DACA y permisos laborales", pct: 79 },
          { label: "Asesoría jurídica en peticiones familiares y estatus juvenil SIJS", pct: 15 },
          { label: "Talleres universitarios y educación financiera para jóvenes", pct: 6 }
        ],
        deliverables: [
          "Subvención parcial o total de tarifas de renovación para jóvenes beneficiarios de DACA.",
          "Representación legal en casos de Estatus Especial de Inmigrante Juvenil (SIJS).",
          "Talleres de ciudadanía y liderazgo juvenil en el corredor central de Los Ángeles."
        ],
        impactByAmount: {
          35: "Con $35 USD cubres la revisión legal completa de formularios de renovación para un estudiante.",
          75: "Con $75 USD aportas al fondo de beca para el permiso de trabajo de un joven Dreamer.",
          150: "Con $150 USD financias el acompañamiento jurídico en una solicitud de reunificación familiar.",
          250: "Con $250 USD cubres la mitad de la tasa de renovación DACA para un estudiante universitario.",
          500: "Con $500 USD becas la renovación completa de protección y permiso laboral de un joven.",
          1000: "Con $1,000 USD respaldas el proceso integral de protección para dos jóvenes inmigrantes."
        }
      }
    },
    en: {
      organizacion: {
        id: "organizacion",
        shortName: "General Organization",
        badge: "GENERAL INSTITUTIONAL FUND",
        code: "CAMPAIGN #ER-ORG-2026",
        title: "General Organization — El Rescate Los Angeles",
        lead:
          "Your contribution holistically strengthens all impact areas of El Rescate since 1981: emergency legal defense, free Wednesday & Saturday clinics, and community accompaniment across Los Angeles.",
        desc:
          "This general fund enables El Rescate to respond immediately wherever humanitarian need is most urgent in Southern California, sustaining our historic Westlake headquarters and barrier-free legal care.",
        callout: "Support the entire organization in general or choose an active campaign above",
        raised: "Raised: $84,500 USD",
        goal: "Goal: $100,000 USD (85%)",
        percent: 85,
        stat1Val: "100%",
        stat1Lbl: "Tax-deductible (501c3)",
        stat2Val: "+1,200",
        stat2Lbl: "Free consultations per year",
        img: "assets/provisional-documentary-la-placita.jpg",
        allocations: [
          { label: "Direct legal representation & courtroom defense", pct: 76 },
          { label: "Weekly community legal clinics (Wed & Sat)", pct: 16 },
          { label: "Operational sustainability & historical archive", pct: 8 }
        ],
        deliverables: [
          "Sustains daily operations at El Rescate's community headquarters at 1501 W. 8th St., Los Angeles.",
          "Guarantees free interpreters and bilingual legal orientation for newly arrived families.",
          "Funds emergency resources for high-priority humanitarian cases."
        ],
        impactByAmount: {
          35: "With $35 USD you cover the bilingual legal orientation kit and initial intake file for one person.",
          75: "With $75 USD you cover case opening and initial legal screening for an immigrant family.",
          150: "With $150 USD you fund a full document preparation session and certified translation.",
          250: "With $250 USD you sponsor half a day of free legal clinic service for dozens of neighbors in Westlake.",
          500: "With $500 USD you sponsor initial courtroom legal defense for an urgent humanitarian case.",
          1000: "With $1,000 USD you sustain a full legal protection and family accompaniment brigade."
        }
      },
      asilo: {
        id: "asilo",
        shortName: "Legal Defense & Asylum",
        badge: "URGENT COURT REPRESENTATION",
        code: "CAMPAIGN #ER-ASILO-2026",
        title: "Legal Defense, Asylum & Humanitarian Refuge Campaign",
        lead:
          "No family seeking refuge should ever stand alone before an immigration judge. This campaign funds defense attorneys, human rights country-condition experts, and urgent stays of removal.",
        desc:
          "Born from El Rescate's founding mission in 1981, this campaign provides ethical legal representation in affirmative and defensive asylum claims, U Visas for crime victims, and VAWA petitions.",
        callout: "You are backing direct legal defense for asylum seekers and refugees",
        raised: "Raised: $62,800 USD",
        goal: "Goal: $80,000 USD (79%)",
        percent: 79,
        stat1Val: "98%",
        stat1Lbl: "Cases with active follow-up",
        stat2Val: "Pro Bono",
        stat2Lbl: "Ethical defense in L.A. courts",
        img: "assets/provisional-documentary-macarthur-park.jpg",
        allocations: [
          { label: "Asylum & humanitarian protection trial attorneys", pct: 82 },
          { label: "Certified evidence translation, expert reports & affidavits", pct: 12 },
          { label: "Psychosocial support & court hearing preparation", pct: 6 }
        ],
        deliverables: [
          "Comprehensive preparation of affirmative and defensive asylum filings in Los Angeles.",
          "Specialized legal representation for women and families protected under VAWA and U Visas.",
          "Official translation of human rights evidence and vital records for immigration court."
        ],
        impactByAmount: {
          35: "With $35 USD you cover certified translation of vital records and asylum evidence.",
          75: "With $75 USD you fund an in-depth legal eligibility evaluation for asylum or a U Visa.",
          150: "With $150 USD you cover the drafting of sworn declarations with interpreter assistance.",
          250: "With $250 USD you back preliminary master calendar hearing preparation before immigration court.",
          500: "With $500 USD you sponsor emergency legal representation for a mother and her children.",
          1000: "With $1,000 USD you fund comprehensive technical defense for a humanitarian refuge case."
        }
      },
      clinicas: {
        id: "clinicas",
        shortName: "Community Clinics",
        badge: "FREE WED & SAT SESSIONS",
        code: "CAMPAIGN #ER-CLINICA-2026",
        title: "Wednesday & Saturday Community Legal Clinics Campaign",
        lead:
          "Keep the doors of our in-person legal consultations open every Wednesday (2–5 PM) and Saturday (10 AM–1 PM) so anyone can receive trustworthy legal orientation free from fraud.",
        desc:
          "Our weekly clinics are the safest first point of contact for thousands of workers and families in Los Angeles. Your gift expands appointment slots, hours, and legal counselors.",
        callout: "You are funding free Wednesday & Saturday community clinics in Westlake",
        raised: "Raised: $41,200 USD",
        goal: "Goal: $50,000 USD (82%)",
        percent: 82,
        stat1Val: "2 Sessions",
        stat1Lbl: "Weekly open to the community",
        stat2Val: "$0 Cost",
        stat2Lbl: "For initial community screening",
        img: "assets/provisional-documentary-la-placita.jpg",
        allocations: [
          { label: "Legal coordinators & paralegals on Wed & Sat sessions", pct: 74 },
          { label: "Confidential digital appointment & reminder platform", pct: 16 },
          { label: "Printed constitutional rights cards (Know Your Rights)", pct: 10 }
        ],
        deliverables: [
          "Guaranteed operation of in-person clinics every Wednesday (2–5 PM) and Saturday (10 AM–1 PM).",
          "Free distribution of bilingual 'Know Your Rights' cards in Spanish and English.",
          "Protection against notary fraud through honest legal diagnostics."
        ],
        impactByAmount: {
          35: "With $35 USD you distribute 50 bilingual 'Know Your Rights' guides across L.A. neighborhoods.",
          75: "With $75 USD you sponsor free legal orientation slots for 3 families at the Saturday clinic.",
          150: "With $150 USD you cover a legal specialist's hours for an entire Wednesday afternoon.",
          250: "With $250 USD you fund a full Saturday morning of community intake and legal screening.",
          500: "With $500 USD you sustain two full weeks of public community legal clinics.",
          1000: "With $1,000 USD you power an entire month of free community legal clinics in Westlake."
        }
      },
      daca: {
        id: "daca",
        shortName: "Youth Future & DACA",
        badge: "DREAMERS & YOUTH PROTECTION",
        code: "CAMPAIGN #ER-DACA-2026",
        title: "Youth Future, DACA Renewal & Family Reunification Campaign",
        lead:
          "Power the college and career dreams of young Dreamers and protect immigrant youth through scholarships for DACA renewal fees, TPS, and family unity petitions.",
        desc:
          "Many students and young workers face financial barriers covering federal work-permit renewal fees. This fund provides direct fee assistance and legal representation.",
        callout: "You are powering DACA renewal scholarships, TPS & youth protection",
        raised: "Raised: $53,900 USD",
        goal: "Goal: $65,000 USD (83%)",
        percent: 83,
        stat1Val: "+3,400",
        stat1Lbl: "Youth & students advised",
        stat2Val: "100%",
        stat2Lbl: "Accompaniment on renewals",
        img: "assets/provisional-documentary-macarthur-park.jpg",
        allocations: [
          { label: "Scholarship fund for DACA renewal & work permit fees", pct: 79 },
          { label: "Legal counsel on family petitions & SIJS youth status", pct: 15 },
          { label: "College readiness & financial literacy workshops for youth", pct: 6 }
        ],
        deliverables: [
          "Partial or full federal fee grants for young DACA renewal applicants.",
          "Legal representation in Special Immigrant Juvenile Status (SIJS) cases.",
          "Citizenship and youth leadership workshops across Central Los Angeles."
        ],
        impactByAmount: {
          35: "With $35 USD you cover complete legal review of renewal forms for a student.",
          75: "With $75 USD you contribute to the work-permit scholarship fund for a young Dreamer.",
          150: "With $150 USD you fund legal accompaniment on a family reunification petition.",
          250: "With $250 USD you cover half the DACA renewal fee for a university student.",
          500: "With $500 USD you sponsor the full DACA protection and work permit renewal of a young person.",
          1000: "With $1,000 USD you back comprehensive legal protection for two immigrant youths."
        }
      }
    }
  };

  let activeCampaignKey = "organizacion";
  let activeDonationAmount = 75;
  let activeDonationFreqKey = "once";

  const campaignTabs = Array.from(document.querySelectorAll(".donation-campaign-tab"));
  const checkoutPills = Array.from(document.querySelectorAll(".checkout-campaign-pill"));
  const amountBtns = Array.from(document.querySelectorAll(".donation-amount-btn"));
  const checkoutAmtChips = Array.from(document.querySelectorAll(".checkout-amt-chip"));
  const customAmountInput = document.getElementById("donation-custom-amount");
  const checkoutAmountInput = document.getElementById("checkout-amount-input");

  function getActiveCampaignObj() {
    const langSet = DONATION_CAMPAIGNS_I18N[currentLang] || DONATION_CAMPAIGNS_I18N.es;
    return langSet[activeCampaignKey] || langSet.organizacion;
  }

  function getActiveFreqLabel() {
    if (currentLang === "en") {
      return activeDonationFreqKey === "monthly" ? "Monthly Gift" : "One-Time Gift";
    }
    return activeDonationFreqKey === "monthly" ? "Donación Mensual" : "Donación Única";
  }

  function getImpactEquivalenceText(campaignObj, amount) {
    if (campaignObj.impactByAmount[amount]) {
      return `✨ ${campaignObj.impactByAmount[amount]}`;
    }
    if (currentLang === "en") {
      return `✨ With <strong>$${amount} USD</strong> you directly support <strong>${campaignObj.shortName}</strong> initiatives in Los Angeles.`;
    }
    return `✨ Con <strong>$${amount} USD</strong> respaldas directamente las acciones de <strong>${campaignObj.shortName}</strong> en Los Ángeles.`;
  }

  function syncDonationUI() {
    const camp = getActiveCampaignObj();
    const formattedAmt = `$${Number(activeDonationAmount || 75).toLocaleString("en-US")} USD`;
    const freqLabel = getActiveFreqLabel();

    // 1. Pestañas en la sección #donaciones
    campaignTabs.forEach((tab) => {
      const isMatch = tab.getAttribute("data-campaign") === activeCampaignKey;
      tab.classList.toggle("is-active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    // 2. Píldoras en la vista #donation-checkout-view
    checkoutPills.forEach((pill) => {
      pill.classList.toggle("is-active", pill.getAttribute("data-campaign") === activeCampaignKey);
    });

    // 3. Tarjeta izquierda de Spotlight en #donaciones
    const setElText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setElText("donation-live-lead", camp.lead);
    setElText("spotlight-badge", camp.badge);
    setElText("spotlight-code", camp.code);
    setElText("spotlight-title", camp.title);
    setElText("spotlight-desc", camp.desc);
    setElText("spotlight-raised", camp.raised);
    setElText("spotlight-goal", camp.goal);
    setElText("spotlight-stat1-val", camp.stat1Val);
    setElText("spotlight-stat1-lbl", camp.stat1Lbl);
    setElText("spotlight-stat2-val", camp.stat2Val);
    setElText("spotlight-stat2-lbl", camp.stat2Lbl);
    setElText("donation-callout-text", camp.callout);

    const barFill = document.getElementById("spotlight-bar-fill");
    if (barFill) barFill.style.width = `${camp.percent}%`;

    const bgImg = document.getElementById("donation-bg-preview-img");
    if (bgImg && bgImg.getAttribute("src") !== camp.img) {
      bgImg.src = camp.img;
    }

    // 4. Botones de monto y equivalencia en #donaciones
    amountBtns.forEach((btn) => {
      const btnVal = Number(btn.getAttribute("data-amount"));
      btn.classList.toggle("is-selected", btnVal === Number(activeDonationAmount));
    });

    checkoutAmtChips.forEach((chip) => {
      const chipVal = Number(chip.getAttribute("data-amount"));
      chip.classList.toggle("is-selected", chipVal === Number(activeDonationAmount));
    });

    const eqEl = document.getElementById("donation-impact-equivalence");
    if (eqEl) {
      eqEl.innerHTML = getImpactEquivalenceText(camp, activeDonationAmount);
    }

    setElText(
      "btn-donate-now-label",
      currentLang === "en"
        ? `DONATE NOW TO ${camp.shortName.toUpperCase()} • ${formattedAmt}`
        : `DONAR AHORA A ${camp.shortName.toUpperCase()} • ${formattedAmt}`
    );

    // 5. Actualizar toda la información en la Nueva Vista #donation-checkout-view
    const checkoutImg = document.getElementById("checkout-campaign-img");
    if (checkoutImg) checkoutImg.src = camp.img;

    setElText("checkout-campaign-badge", camp.badge);
    setElText("checkout-campaign-code", camp.code);
    setElText("checkout-campaign-title", camp.title);
    setElText("checkout-campaign-desc", camp.desc);
    setElText(
      "checkout-summary-campaign-name",
      currentLang === "en" ? `Designation: ${camp.title}` : `Destino: ${camp.title}`
    );
    setElText("checkout-summary-amount", formattedAmt);
    setElText(
      "ach-reference-code",
      `${camp.code.replace("CAMPAÑA #", "").replace("CAMPAIGN #", "")}-${activeDonationAmount}`
    );
    setElText(
      "btn-complete-donation-text",
      currentLang === "en"
        ? `Complete ${freqLabel} of ${formattedAmt} to ${camp.shortName}`
        : `Completar ${freqLabel} de ${formattedAmt} a ${camp.shortName}`
    );

    const allocListEl = document.getElementById("checkout-allocation-list");
    if (allocListEl) {
      allocListEl.innerHTML = camp.allocations
        .map(
          (a) => `
          <div class="checkout-allocation-item">
            <div class="checkout-allocation-item__row">
              <span>${a.label}</span>
              <span>${a.pct}%</span>
            </div>
            <div class="checkout-allocation-item__bar">
              <div class="checkout-allocation-item__fill" style="width:${a.pct}%;"></div>
            </div>
          </div>
        `
        )
        .join("");
    }

    const delivListEl = document.getElementById("checkout-deliverables-list");
    if (delivListEl) {
      delivListEl.innerHTML = camp.deliverables
        .map((d) => `<li><span>✓</span><span>${d}</span></li>`)
        .join("");
    }
  }

  campaignTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCampaignKey = tab.getAttribute("data-campaign") || "organizacion";
      syncDonationUI();
    });
  });

  checkoutPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCampaignKey = pill.getAttribute("data-campaign") || "organizacion";
      syncDonationUI();
    });
  });

  amountBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeDonationAmount = Number(btn.getAttribute("data-amount")) || 75;
      if (customAmountInput) customAmountInput.value = String(activeDonationAmount);
      if (checkoutAmountInput) checkoutAmountInput.value = String(activeDonationAmount);
      syncDonationUI();
    });
  });

  checkoutAmtChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeDonationAmount = Number(chip.getAttribute("data-amount")) || 75;
      if (customAmountInput) customAmountInput.value = String(activeDonationAmount);
      if (checkoutAmountInput) checkoutAmountInput.value = String(activeDonationAmount);
      syncDonationUI();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener("input", () => {
      const val = Math.max(1, Number(customAmountInput.value) || 0);
      activeDonationAmount = val;
      if (checkoutAmountInput) checkoutAmountInput.value = String(val);
      syncDonationUI();
    });
  }

  if (checkoutAmountInput) {
    checkoutAmountInput.addEventListener("input", () => {
      const val = Math.max(1, Number(checkoutAmountInput.value) || 0);
      activeDonationAmount = val;
      if (customAmountInput) customAmountInput.value = String(val);
      syncDonationUI();
    });
  }

  // Frecuencia en la vista de Checkout
  document.querySelectorAll(".checkout-freq-btn").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".checkout-freq-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });
      activeDonationFreqKey = idx === 1 ? "monthly" : "once";
      syncDonationUI();
    });
  });

  // Pestañas de Método de Pago en la vista de Checkout
  document.querySelectorAll(".checkout-pay-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const payMethod = tab.getAttribute("data-pay") || "card";
      document.querySelectorAll(".checkout-pay-tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
      });
      document.querySelectorAll(".checkout-pay-panel").forEach((panel) => {
        panel.classList.toggle("is-visible", panel.id === `pay-panel-${payMethod}`);
      });
    });
  });

  // AJUSTE #3: Navegación hacia #vista-donacion permitiendo scroll fluido con la ruedita del mouse
  const checkoutViewEl = document.getElementById("donation-checkout-view");
  const btnDonateNow = document.getElementById("btn-donate-now");
  const btnBackToSite = document.getElementById("btn-back-to-site");

  function openDonationCheckoutView() {
    syncDonationUI();
    document.body.classList.add("is-donation-checkout-open");
    if (checkoutViewEl) checkoutViewEl.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "auto" });
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        lenis.resize();
      });
    }
    if (window.location.hash !== "#vista-donacion") {
      history.pushState({ view: "donation-checkout" }, "", "#vista-donacion");
    }
  }

  function closeDonationCheckoutView() {
    document.body.classList.remove("is-donation-checkout-open");
    if (checkoutViewEl) checkoutViewEl.setAttribute("aria-hidden", "true");
    if (lenis) {
      lenis.start();
      requestAnimationFrame(() => {
        lenis.resize();
      });
    }
    const donSection = document.getElementById("donaciones");
    if (donSection) {
      donSection.scrollIntoView({ behavior: "smooth" });
    }
    if (window.location.hash === "#vista-donacion") {
      history.pushState({ view: "main" }, "", "#donaciones");
    }
  }

  if (btnDonateNow) {
    btnDonateNow.addEventListener("click", openDonationCheckoutView);
  }

  if (btnBackToSite) {
    btnBackToSite.addEventListener("click", closeDonationCheckoutView);
  }

  window.addEventListener("popstate", () => {
    if (window.location.hash === "#vista-donacion") {
      openDonationCheckoutView();
    } else if (document.body.classList.contains("is-donation-checkout-open")) {
      document.body.classList.remove("is-donation-checkout-open");
      if (checkoutViewEl) checkoutViewEl.setAttribute("aria-hidden", "true");
      if (lenis) {
        lenis.start();
        requestAnimationFrame(() => lenis.resize());
      }
    }
  });

  // Envío del formulario de donación en la nueva vista
  const donationCheckoutForm = document.getElementById("donation-checkout-form");
  const donationReceiptBox = document.getElementById("donation-receipt-box");
  if (donationCheckoutForm && donationReceiptBox) {
    donationCheckoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const defaultDonor = currentLang === "en" ? "Supporter" : "Donante Solidario";
      const firstName = (document.getElementById("donor-first-name")?.value || "").trim() || defaultDonor;
      const lastName = (document.getElementById("donor-last-name")?.value || "").trim();
      const email = (document.getElementById("donor-email")?.value || "").trim() || "correo@comunidad.org";
      const fullName = `${firstName} ${lastName}`.trim();
      const camp = getActiveCampaignObj();
      const freqLabel = getActiveFreqLabel();
      const receiptId = `ER-501C3-${Math.floor(100000 + Math.random() * 900000)}`;

      if (currentLang === "en") {
        donationReceiptBox.innerHTML = `
          <div style="font-family:var(--font-mono); font-size:11px; font-weight:700; color:#047857; margin-bottom:4px;">
            ✓ PRELIMINARY 501(c)(3) DONATION CERTIFICATE • RECEIPT #${receiptId}
          </div>
          <div style="font-family:var(--font-display); font-size:16px; font-weight:800; color:#064E3B; margin-bottom:6px;">
            Thank you for your solidarity, ${fullName}!
          </div>
          <p style="margin-bottom:8px;">
            We have recorded your <strong>${freqLabel}</strong> of <strong>$${Number(activeDonationAmount).toLocaleString("en-US")} USD</strong> designated to:
            <strong>${camp.title}</strong>.
          </p>
          <div style="font-size:12.5px; color:#047857;">
            A copy of your tax-deductible receipt (EIN: 95-3759142) has been sent to <strong>${email}</strong>.
          </div>
        `;
      } else {
        donationReceiptBox.innerHTML = `
          <div style="font-family:var(--font-mono); font-size:11px; font-weight:700; color:#047857; margin-bottom:4px;">
            ✓ CERTIFICADO PRELIMINAR DE DONACIÓN 501(c)(3) • FOLIO #${receiptId}
          </div>
          <div style="font-family:var(--font-display); font-size:16px; font-weight:800; color:#064E3B; margin-bottom:6px;">
            ¡Gracias por tu solidaridad, ${fullName}!
          </div>
          <p style="margin-bottom:8px;">
            Hemos registrado tu <strong>${freqLabel}</strong> por <strong>$${Number(activeDonationAmount).toLocaleString("en-US")} USD</strong> destinada a:
            <strong>${camp.title}</strong>.
          </p>
          <div style="font-size:12.5px; color:#047857;">
            Se ha enviado copia del recibo fiscal deducible (EIN: 95-3759142) a <strong>${email}</strong>.
          </div>
        `;
      }
      donationReceiptBox.classList.add("is-visible");
      if (typeof window.__registerPublicDonationInAdmin === "function") {
        window.__registerPublicDonationInAdmin({
          donorName: fullName,
          email,
          campaignKey: activeCampaignKey,
          amount: Number(activeDonationAmount) || 75,
          freq: freqLabel
        });
      }
    });
  }

  syncDonationUI();

  // ==========================================================================
  // 11.5. AJUSTES #1 Y #2 (NUEVA ETAPA):
  //       VISTA LOGIN / CREAR USUARIO (#auth-view) & PANEL ADMIN (#admin-view)
  // ==========================================================================
  Object.assign(I18N_DICT.es, {
    nav_portal: "Acceso / Admin",
    auth_back_site: "Volver al sitio público",
    auth_portal_badge: "PORTAL INSTITUCIONAL • EL RESCATE L.A.",
    auth_goto_admin_btn: "Ir directo al Panel Admin →",
    auth_login_title: "Iniciar Sesión",
    auth_login_user_ph: "Usuario o correo institucional",
    auth_login_pass_ph: "Contraseña",
    auth_login_btn: "Iniciar Sesión",
    auth_no_account: "¿No tienes una cuenta?",
    auth_signup_link: "Crear Usuario",
    auth_forgot_link: "¿Olvidaste tu contraseña?",
    auth_reg_title: "Crear Usuario",
    auth_reg_name_ph: "Nombre completo",
    auth_reg_email_ph: "Correo institucional (@elrescate.org)",
    auth_reg_pass_ph: "Crear contraseña segura",
    auth_reg_btn: "Registrar Usuario",
    auth_already_member: "¿Ya eres miembro?",
    auth_login_link: "Iniciar Sesión",
    auth_ov_hello_kicker: "COORDINACIÓN & CLÍNICA LEGAL",
    auth_ov_hello_title: "¡HOLA,<br />EQUIPO!",
    auth_ov_hello_desc: "Ingresa tus datos institucionales y comienza a gestionar citas comunitarias y campañas con nosotros.",
    auth_ov_create_btn: "Crear Usuario",
    auth_ov_welcome_kicker: "PORTAL EL RESCATE • DESDE 1981",
    auth_ov_welcome_title: "¡BIENVENIDO<br />DE NUEVO!",
    auth_ov_welcome_desc: "¿Ya eres miembro del equipo? Por favor inicia sesión con tus credenciales institucionales.",
    auth_ov_signin_btn: "Iniciar Sesión",
    adm_brand_title: "El Rescate Admin",
    adm_tab_overview: "Resumen",
    adm_tab_appts: "Citas y Horarios",
    adm_tab_donations: "Donaciones",
    adm_tab_reports: "Reportes",
    adm_switch_login: "Vista Login",
    adm_exit_site: "← Sitio Público",
    adm_ov_title: "Estadísticas Institucionales",
    adm_ov_seg1: "Métricas de Citas y Clínica",
    adm_ov_seg2: "Analítica de Donaciones ONG",
    adm_ov_kpi1_lbl: "Total recaudado en campañas",
    adm_ov_kpi2_lbl: "Citas activas en agenda",
    adm_ov_kpi3_lbl: "Fechas de clínica habilitadas",
    adm_spot_title: "Coordinación de Clínica",
    adm_spot_tag: "Sede Westlake",
    adm_coord_role: "Directora de Clínica Legal",
    adm_next_session_lbl: "Próxima jornada activa",
    adm_btn_config_hours: "Modificar horarios →",
    adm_gauge_title: "Avance de Campañas",
    adm_gauge_sub: "82% de la meta global ($295K USD) • 4 campañas",
    adm_dark_card_title: "Control de Agenda y Donantes",
    adm_dark_card_desc: "Habilita o bloquea fechas del calendario, edita bloques horarios y audita de quién proviene cada donación.",
    adm_dark_btn_appts: "Gestionar Citas y Días →",
    adm_dark_btn_don: "Ver Donantes →",
    adm_an_title: "Analítica por Campaña y Mes",
    adm_an_tab1: "Recaudación Campañas",
    adm_an_tab2: "Flujo de Citas",
    adm_an_c1_lbl: "Organización General",
    adm_an_c2_lbl: "Defensa y Asilo",
    adm_an_c3_lbl: "DACA + Clínicas",
    adm_strip_1: "Horarios activos Miércoles",
    adm_strip_2: "Horarios activos Sábados",
    adm_strip_3: "Citas listas para atención",
    adm_strip_4: "Promedio mensual en campañas",
    adm_appts_title: "Gestión de Citas, Días y Horarios",
    adm_appts_sub: "Habilita o deshabilita días del calendario, configura las horas disponibles y crea, modifica o elimina citas agendadas.",
    adm_btn_new_appt: "Crear Nueva Cita",
    adm_akpi1_title: "Total Citas Agendadas",
    adm_akpi2_title: "Confirmadas vs. Pendientes",
    adm_akpi2_sub: "Confirmadas • En revisión",
    adm_akpi3_title: "Días con Citas Habilitados",
    adm_akpi3_sub: "Sincronizados con calendario público",
    adm_akpi4_title: "Horas Disponibles Activas",
    adm_sched_title: "1. Modificar Días con Citas y Horas",
    adm_sched_hint: "Haz clic en cualquier día del calendario para habilitar o cerrar citas en esa fecha (se refleja en vivo en la página pública).",
    adm_Toggle_weekday_lbl: "Alternar día completo:",
    adm_slots_title: "2. Horas Disponibles por Jornada",
    adm_slot_wed: "Miércoles / Entre semana",
    adm_slot_sat: "Sábados / Fin de semana",
    adm_new_slot_ph: "Ej. 9:00 AM – 10:00 AM o 5:00 PM – 6:00 PM",
    adm_btn_add_slot: "+ Agregar Hora",
    adm_crud_title: "3. Citas Agendadas (Crear, Modificar y Eliminar)",
    adm_crud_hint: "Revisa todas las citas programadas, filtra por área legal o edita cualquier registro.",
    adm_appt_search_ph: "Buscar por nombre, teléfono, correo o folio...",
    adm_filter_all_cases: "Todos los tipos de caso",
    adm_filter_all_status: "Todos los estados",
    adm_don_title: "Métricas de Donaciones y Trazabilidad por Campaña",
    adm_don_sub: "Consulta el monto recaudado por campaña, identifica de quién proviene cada aporte y hacia qué programa institucional fue destinado.",
    adm_btn_export_csv: "↓ Exportar CSV 501(c)(3)",
    adm_btn_add_don: "+ Registrar Donación",
    adm_dkpi1_title: "Recaudación Total Consolidada",
    adm_dkpi1_sub: "82.1% de la meta anual ($295,000 USD)",
    adm_dkpi2_title: "Donantes Verificados",
    adm_dkpi2_sub: "100% con certificado fiscal 501(c)(3)",
    adm_dkpi3_title: "Aporte Promedio",
    adm_dkpi3_sub: "60% Donación Única • 40% Mensual",
    adm_dkpi4_title: "Campaña Principal",
    adm_don_search_ph: "Buscar donante por nombre, correo, ciudad o folio #ER-501C3...",
    adm_don_filter_all: "Todas las campañas destino",
    adm_th_folio: "Folio Fiscal / Fecha",
    adm_th_donor: "Donante (De quién proviene)",
    adm_th_campaign: "Campaña Destino (Hacia qué donó)",
    adm_th_amount: "Monto & Frecuencia",
    adm_th_method: "Método & Estado",
    adm_rep_title: "Reportes Ejecutivos de Impacto",
    adm_rep_sub: "Consolidado de desempeño por clínica semanal, origen de casos legales y distribución de fondos humanitarios.",
    adm_rep_c1_title: "Rendimiento por Jornada de Clínica",
    adm_rep_c2_title: "Canales de Origen de Citas y Donaciones"
  });

  Object.assign(I18N_DICT.en, {
    nav_portal: "Login / Admin",
    auth_back_site: "Back to public site",
    auth_portal_badge: "INSTITUTIONAL PORTAL • EL RESCATE L.A.",
    auth_goto_admin_btn: "Go directly to Admin Panel →",
    auth_login_title: "Login",
    auth_login_user_ph: "Username or institutional email",
    auth_login_pass_ph: "Password",
    auth_login_btn: "Login",
    auth_no_account: "Don't have an account?",
    auth_signup_link: "Sign Up",
    auth_forgot_link: "Forgot Password?",
    auth_reg_title: "Create Account",
    auth_reg_name_ph: "Full Name",
    auth_reg_email_ph: "Work Email (@elrescate.org)",
    auth_reg_pass_ph: "Create Password",
    auth_reg_btn: "Sign Up",
    auth_already_member: "Already a Member?",
    auth_login_link: "Login",
    auth_ov_hello_kicker: "LEGAL CLINIC & COORDINATION",
    auth_ov_hello_title: "HELLO,<br />FRIEND!",
    auth_ov_hello_desc: "Enter your institutional details and start managing community appointments and campaigns with us.",
    auth_ov_create_btn: "Create Account",
    auth_ov_welcome_kicker: "EL RESCATE PORTAL • EST. 1981",
    auth_ov_welcome_title: "WELCOME<br />BACK!",
    auth_ov_welcome_desc: "Already a Member? Please login with your institutional credentials.",
    auth_ov_signin_btn: "Sign In",
    adm_brand_title: "El Rescate Admin",
    adm_tab_overview: "Overview",
    adm_tab_appts: "Appointments & Hours",
    adm_tab_donations: "Donations",
    adm_tab_reports: "Reports",
    adm_switch_login: "Login View",
    adm_exit_site: "← Public Site",
    adm_ov_title: "Your Statistics",
    adm_ov_seg1: "Clinic & Appointment Metrics",
    adm_ov_seg2: "NGO Donation Analytics",
    adm_ov_kpi1_lbl: "Total raised across campaigns",
    adm_ov_kpi2_lbl: "Active scheduled appointments",
    adm_ov_kpi3_lbl: "Enabled clinic dates",
    adm_spot_title: "Clinic Coordination",
    adm_spot_tag: "Westlake HQ",
    adm_coord_role: "Legal Clinic Director",
    adm_next_session_lbl: "Active clinic schedule",
    adm_btn_config_hours: "Modify schedule →",
    adm_gauge_title: "Campaign Performance",
    adm_gauge_sub: "82% of global goal ($295K USD) • 4 campaigns",
    adm_dark_card_title: "Schedule & Donor Control",
    adm_dark_card_desc: "Enable or block calendar dates, edit available time slots, and audit who each donation comes from.",
    adm_dark_btn_appts: "Manage Appointments & Days →",
    adm_dark_btn_don: "View Donors →",
    adm_an_title: "Monthly & Campaign Analytics",
    adm_an_tab1: "Campaign Revenue",
    adm_an_tab2: "Appointment Flow",
    adm_an_c1_lbl: "General Organization",
    adm_an_c2_lbl: "Legal & Asylum",
    adm_an_c3_lbl: "DACA + Clinics",
    adm_strip_1: "Active Wednesday slots",
    adm_strip_2: "Active Saturday slots",
    adm_strip_3: "Confirmed appointments ready",
    adm_strip_4: "Monthly campaign average",
    adm_appts_title: "Appointments, Days & Available Hours",
    adm_appts_sub: "Enable or disable calendar dates, configure available time slots, and create, edit, or delete scheduled appointments.",
    adm_btn_new_appt: "Create Appointment",
    adm_akpi1_title: "Total Scheduled Appointments",
    adm_akpi2_title: "Confirmed vs. Pending",
    adm_akpi2_sub: "Confirmed • Under review",
    adm_akpi3_title: "Enabled Clinic Days",
    adm_akpi3_sub: "Synced with public calendar",
    adm_akpi4_title: "Active Time Slots",
    adm_sched_title: "1. Modify Clinic Days & Available Hours",
    adm_sched_hint: "Click any calendar date to enable or close appointments on that day (updates the public page in real time).",
    adm_Toggle_weekday_lbl: "Toggle full weekday:",
    adm_slots_title: "2. Available Hours by Session",
    adm_slot_wed: "Wednesdays / Weekdays",
    adm_slot_sat: "Saturdays / Weekends",
    adm_new_slot_ph: "E.g. 9:00 AM – 10:00 AM or 5:00 PM – 6:00 PM",
    adm_btn_add_slot: "+ Add Time Slot",
    adm_crud_title: "3. Scheduled Appointments (Create, Edit & Delete)",
    adm_crud_hint: "Review all scheduled appointments, filter by legal area, or edit any record.",
    adm_appt_search_ph: "Search by name, phone, email, or folio...",
    adm_filter_all_cases: "All case types",
    adm_filter_all_status: "All statuses",
    adm_don_title: "Donation Metrics & Campaign Traceability",
    adm_don_sub: "Track total funds raised per campaign, identify who each donation comes from, and see which campaign they supported.",
    adm_btn_export_csv: "↓ Export 501(c)(3) CSV",
    adm_btn_add_don: "+ Record Donation",
    adm_dkpi1_title: "Consolidated Funds Raised",
    adm_dkpi1_sub: "82.1% of annual goal ($295,000 USD)",
    adm_dkpi2_title: "Verified Donors",
    adm_dkpi2_sub: "100% with 501(c)(3) tax certificate",
    adm_dkpi3_title: "Average Gift",
    adm_dkpi3_sub: "60% One-Time • 40% Monthly",
    adm_dkpi4_title: "Leading Campaign",
    adm_don_search_ph: "Search donor by name, email, city, or #ER-501C3...",
    adm_don_filter_all: "All target campaigns",
    adm_th_folio: "Tax Folio / Date",
    adm_th_donor: "Donor (Who it comes from)",
    adm_th_campaign: "Target Campaign (Where it went)",
    adm_th_amount: "Amount & Frequency",
    adm_th_method: "Payment Method & Status",
    adm_rep_title: "Executive Impact Reports",
    adm_rep_sub: "Consolidated performance by weekly clinic session, legal case sources, and humanitarian fund distribution.",
    adm_rep_c1_title: "Performance by Clinic Session",
    adm_rep_c2_title: "Appointment & Donation Source Channels"
  });

  // --------------------------------------------------------------------------
  // DATOS INICIALES DEL PANEL ADMIN: CITAS AGENDADAS Y TRAZABILIDAD DE DONACIONES
  // --------------------------------------------------------------------------
  const ADMIN_APPOINTMENTS = [
    {
      id: "CITA-2026-101",
      name: "María Fernanda López",
      phone: "(213) 555-0184",
      email: "mflopez.la@gmail.com",
      caseType: "Asilo y Refugio",
      dateLabel: "Sábado, 21 De Noviembre",
      timeSlot: "10:00 AM – 11:00 AM",
      status: "Confirmada",
      notes: "Abog. Carlos Méndez • Solicitud I-589"
    },
    {
      id: "CITA-2026-102",
      name: "José Roberto Hernández",
      phone: "(323) 555-0241",
      email: "jrhernandez88@yahoo.com",
      caseType: "TPS (Estatus de Protección)",
      dateLabel: "Sábado, 21 De Noviembre",
      timeSlot: "11:00 AM – 12:00 PM",
      status: "Confirmada",
      notes: "Reinscripción El Salvador + Permiso I-765"
    },
    {
      id: "CITA-2026-103",
      name: "Valeria Ramírez Castillo",
      phone: "(213) 555-0915",
      email: "valeria.dreamer@ucla.edu",
      caseType: "Renovación DACA",
      dateLabel: "Sábado, 21 De Noviembre",
      timeSlot: "12:00 PM – 1:00 PM",
      status: "Confirmada",
      notes: "Aplica a beca del Fondo Futuro Joven"
    },
    {
      id: "CITA-2026-104",
      name: "Ana Lucía Morales",
      phone: "(818) 555-0377",
      email: "analucia.morales@outlook.com",
      caseType: "Visa U / Protección VAWA",
      dateLabel: "Miércoles, 25 De Noviembre",
      timeSlot: "2:00 PM – 3:00 PM",
      status: "Confirmada",
      notes: "Certificación policial LAPD lista (I-918B)"
    },
    {
      id: "CITA-2026-105",
      name: "Héctor Manuel Pineda",
      phone: "(310) 555-0642",
      email: "hpineda.familia@gmail.com",
      caseType: "Residencia / Petición Familiar",
      dateLabel: "Miércoles, 25 De Noviembre",
      timeSlot: "3:00 PM – 4:00 PM",
      status: "Pendiente",
      notes: "Petición I-130 cónyuge ciudadano"
    },
    {
      id: "CITA-2026-106",
      name: "Rosa Elvira Quintanilla",
      phone: "(213) 555-0729",
      email: "rosaquintanilla54@gmail.com",
      caseType: "Ciudadanía y Naturalización",
      dateLabel: "Miércoles, 25 De Noviembre",
      timeSlot: "4:00 PM – 5:00 PM",
      status: "Confirmada",
      notes: "Formulario N-400 con exención de inglés (55/15)"
    },
    {
      id: "CITA-2026-107",
      name: "Diego Alejandro Rivas",
      phone: "(323) 555-0518",
      email: "diego.rivas.sv@gmail.com",
      caseType: "Asilo y Refugio",
      dateLabel: "Sábado, 28 De Noviembre",
      timeSlot: "10:00 AM – 11:00 AM",
      status: "Pendiente",
      notes: "Preparación de audiencia preliminar EOIR"
    },
    {
      id: "CITA-2026-108",
      name: "Gabriela Beatriz Orellana",
      phone: "(213) 555-0833",
      email: "gb.orellana@gmail.com",
      caseType: "Renovación DACA",
      dateLabel: "Sábado, 28 De Noviembre",
      timeSlot: "11:00 AM – 12:00 PM",
      status: "Confirmada",
      notes: "Renovación bianual + consulta Advance Parole"
    },
    {
      id: "CITA-2026-109",
      name: "Marvin Antonio Zelaya",
      phone: "(626) 555-0412",
      email: "marvin.zelaya@hotmail.com",
      caseType: "TPS (Estatus de Protección)",
      dateLabel: "Miércoles, 18 De Noviembre",
      timeSlot: "2:00 PM – 3:00 PM",
      status: "Atendida",
      notes: "Expediente enviado a USCIS con recibo"
    },
    {
      id: "CITA-2026-110",
      name: "Claudia Patricia Mejía",
      phone: "(213) 555-0690",
      email: "claudia.mejia.la@gmail.com",
      caseType: "Visa U / Protección VAWA",
      dateLabel: "Sábado, 14 De Noviembre",
      timeSlot: "10:00 AM – 11:00 AM",
      status: "Atendida",
      notes: "Autopetición VAWA I-360 confidencial"
    },
    {
      id: "CITA-2026-111",
      name: "Óscar René Valladares",
      phone: "(323) 555-0944",
      email: "oscar.valladares@gmail.com",
      caseType: "Residencia / Petición Familiar",
      dateLabel: "Sábado, 5 De Diciembre",
      timeSlot: "11:00 AM – 12:00 PM",
      status: "Confirmada",
      notes: "Revisión de perdón provisional I-601A"
    },
    {
      id: "CITA-2026-112",
      name: "Karla Vanessa Portillo",
      phone: "(213) 555-0319",
      email: "kportillo.westlake@gmail.com",
      caseType: "Ciudadanía y Naturalización",
      dateLabel: "Miércoles, 2 De Diciembre",
      timeSlot: "3:00 PM – 4:00 PM",
      status: "Pendiente",
      notes: "Evaluación de exención de tarifa I-912"
    }
  ];

  const ADMIN_DONATIONS = [
    {
      folio: "ER-501C3-849210",
      date: "08 Nov 2026",
      donorName: "Fundación Solidaridad Californiana",
      email: "grants@solidaridadca.org",
      city: "Los Ángeles, CA",
      campaignKey: "organizacion",
      amount: 1000,
      freq: "Donación Mensual",
      method: "Transferencia ACH"
    },
    {
      folio: "ER-501C3-849198",
      date: "08 Nov 2026",
      donorName: "Dr. Alejandro Villalobos",
      email: "avillalobos@cedars-la.org",
      city: "Pasadena, CA",
      campaignKey: "asilo",
      amount: 500,
      freq: "Donación Única",
      method: "Tarjeta •••• 4821"
    },
    {
      folio: "ER-501C3-849174",
      date: "07 Nov 2026",
      donorName: "Sofía Castellanos & Familia",
      email: "sofia.castellanos@gmail.com",
      city: "Santa Monica, CA",
      campaignKey: "daca",
      amount: 250,
      freq: "Donación Mensual",
      method: "Tarjeta •••• 9104"
    },
    {
      folio: "ER-501C3-849152",
      date: "07 Nov 2026",
      donorName: "Colectivo Magisterial Bilingüe L.A.",
      email: "tesoreria@maestrosbilingues.org",
      city: "Westlake, L.A.",
      campaignKey: "clinicas",
      amount: 500,
      freq: "Donación Única",
      method: "Transferencia ACH"
    },
    {
      folio: "ER-501C3-849129",
      date: "06 Nov 2026",
      donorName: "Marco Antonio Solís Herrera",
      email: "masolis.arquitectura@gmail.com",
      city: "Culver City, CA",
      campaignKey: "organizacion",
      amount: 250,
      freq: "Donación Única",
      method: "PayPal Institucional"
    },
    {
      folio: "ER-501C3-849105",
      date: "06 Nov 2026",
      donorName: "Elena Beatriz Lemus",
      email: "elena.lemus.abogada@gmail.com",
      city: "Silver Lake, L.A.",
      campaignKey: "asilo",
      amount: 150,
      freq: "Donación Mensual",
      method: "Tarjeta •••• 3319"
    },
    {
      folio: "ER-501C3-849088",
      date: "05 Nov 2026",
      donorName: "Red de Ex-Becarios Dreamers UCLA",
      email: "alumni.dreamers@ucla.edu",
      city: "Westwood, L.A.",
      campaignKey: "daca",
      amount: 500,
      freq: "Donación Única",
      method: "PayPal Institucional"
    },
    {
      folio: "ER-501C3-849064",
      date: "04 Nov 2026",
      donorName: "Restaurante La Pupusa de Oro",
      email: "contacto@pupusadeorola.com",
      city: "Pico-Union, L.A.",
      campaignKey: "clinicas",
      amount: 150,
      freq: "Donación Mensual",
      method: "Tarjeta •••• 7742"
    },
    {
      folio: "ER-501C3-849031",
      date: "03 Nov 2026",
      donorName: "Patricia & David Montgomery",
      email: "pmontgomery@civicjustice.org",
      city: "Beverly Hills, CA",
      campaignKey: "asilo",
      amount: 1000,
      freq: "Donación Única",
      method: "Transferencia ACH"
    },
    {
      folio: "ER-501C3-849012",
      date: "02 Nov 2026",
      donorName: "Carlos Eduardo Figueroa",
      email: "ce.figueroa@gmail.com",
      city: "Koreatown, L.A.",
      campaignKey: "organizacion",
      amount: 75,
      freq: "Donación Única",
      method: "Tarjeta •••• 5510"
    }
  ];

  // Conectar formulario público de citas con la lista del Panel Admin
  if (bookingForm) {
    bookingForm.addEventListener("submit", () => {
      const nameVal = document.getElementById("input-name")?.value.trim() || "Integrante de la comunidad";
      const phoneVal = document.getElementById("input-phone")?.value.trim() || "(213) 555-0199";
      const emailVal = document.getElementById("input-email")?.value.trim() || "comunidad@elrescate.org";
      const caseVal = document.getElementById("input-case-type")?.value || "Asilo y Refugio";
      const months = getCalendarMonths();
      const monthObj = months[currentMonthIdx];
      const dayType = monthObj.availableDays[selectedDay] || "Sábado";
      const dateStr = `${dayType}, ${selectedDay} De ${monthObj.monthName}`;

      ADMIN_APPOINTMENTS.unshift({
        id: `CITA-2026-${101 + ADMIN_APPOINTMENTS.length}`,
        name: nameVal,
        phone: phoneVal,
        email: emailVal,
        caseType: caseVal,
        dateLabel: dateStr,
        timeSlot: selectedSlot,
        status: "Confirmada",
        notes: "Agendada desde el calendario web público"
      });
      refreshAdminUI();
    });
  }

  // Conectar formulario público de donaciones (#vista-donacion) con el Panel Admin
  window.__registerPublicDonationInAdmin = function (payload) {
    const receiptId = `ER-501C3-${Math.floor(850000 + Math.random() * 99999)}`;
    ADMIN_DONATIONS.unshift({
      folio: receiptId,
      date: "Hoy • En vivo",
      donorName: payload.donorName || "Donante Solidario",
      email: payload.email || "donante@comunidad.org",
      city: "Los Ángeles, CA (Web)",
      campaignKey: payload.campaignKey || "organizacion",
      amount: Number(payload.amount) || 75,
      freq: payload.freq || "Donación Única",
      method: "Portal Web 501(c)(3)"
    });
    refreshAdminUI();
  };

  // --------------------------------------------------------------------------
  // CONTROL DE NAVEGACIÓN ENTRE SITIO PÚBLICO, VISTA LOGIN (#auth-view) Y ADMIN (#admin-view)
  // --------------------------------------------------------------------------
  const authViewEl = document.getElementById("auth-view");
  const adminViewEl = document.getElementById("admin-view");
  const authGlassCard = document.getElementById("auth-glass-card");

  function closeAllSpecialViews() {
    document.body.classList.remove(
      "is-donation-checkout-open",
      "is-auth-view-open",
      "is-admin-view-open"
    );
    if (checkoutViewEl) checkoutViewEl.setAttribute("aria-hidden", "true");
    if (authViewEl) authViewEl.setAttribute("aria-hidden", "true");
    if (adminViewEl) adminViewEl.setAttribute("aria-hidden", "true");
    if (lenis) {
      lenis.start();
      requestAnimationFrame(() => lenis.resize());
    }
  }

  function openAuthView(startInRegister = false) {
    closeAllSpecialViews();
    document.body.classList.add("is-auth-view-open");
    if (authViewEl) authViewEl.setAttribute("aria-hidden", "false");
    setAuthCardMode(Boolean(startInRegister));
    window.scrollTo({ top: 0, behavior: "auto" });
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => lenis.resize());
    }
    if (window.location.hash !== "#vista-login") {
      history.pushState({ view: "auth" }, "", "#vista-login");
    }
  }

  function openAdminView(initialTab = "overview") {
    closeAllSpecialViews();
    document.body.classList.add("is-admin-view-open");
    if (adminViewEl) adminViewEl.setAttribute("aria-hidden", "false");
    switchAdminTab(initialTab);
    refreshAdminUI();
    window.scrollTo({ top: 0, behavior: "auto" });
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => lenis.resize());
    }
    if (window.location.hash !== "#vista-admin") {
      history.pushState({ view: "admin" }, "", "#vista-admin");
    }
  }

  // Botón en Header "Acceso / Admin"
  const btnOpenAuthView = document.getElementById("btn-open-auth-view");
  if (btnOpenAuthView) {
    btnOpenAuthView.addEventListener("click", () => openAuthView(false));
  }

  const btnAuthBackSite = document.getElementById("btn-auth-back-site");
  if (btnAuthBackSite) {
    btnAuthBackSite.addEventListener("click", () => {
      closeAllSpecialViews();
      history.pushState({ view: "main" }, "", "#inicio");
    });
  }

  const btnAuthGotoAdmin = document.getElementById("btn-auth-goto-admin");
  if (btnAuthGotoAdmin) {
    btnAuthGotoAdmin.addEventListener("click", () => openAdminView("overview"));
  }

  const btnAdminToLogin = document.getElementById("btn-admin-to-login");
  if (btnAdminToLogin) {
    btnAdminToLogin.addEventListener("click", () => openAuthView(false));
  }

  const btnAdminBackSite = document.getElementById("btn-admin-back-site");
  if (btnAdminBackSite) {
    btnAdminBackSite.addEventListener("click", () => {
      closeAllSpecialViews();
      history.pushState({ view: "main" }, "", "#inicio");
    });
  }

  // --------------------------------------------------------------------------
  // INTERACCIÓN DE LA TARJETA DE LOGIN Y CREAR USUARIO (Referencia_login_y_crear_usuario.mp4)
  // --------------------------------------------------------------------------
  function setAuthCardMode(isRegister) {
    if (!authGlassCard) return;
    authGlassCard.classList.add("is-morphing");
    authGlassCard.classList.toggle("is-register-mode", Boolean(isRegister));
    setTimeout(() => {
      authGlassCard.classList.remove("is-morphing");
    }, 340);
  }

  document.getElementById("btn-overlay-to-register")?.addEventListener("click", () => setAuthCardMode(true));
  document.getElementById("link-goto-signup")?.addEventListener("click", () => setAuthCardMode(true));
  document.getElementById("btn-overlay-to-login")?.addEventListener("click", () => setAuthCardMode(false));
  document.getElementById("link-goto-login")?.addEventListener("click", () => setAuthCardMode(false));

  // Mostrar / ocultar contraseña con el icono de ojo
  function wirePasswordEyeToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }
  wirePasswordEyeToggle("btn-toggle-login-pass", "auth-login-pass");
  wirePasswordEyeToggle("btn-toggle-reg-pass", "auth-reg-pass");

  // Parallax sutil del fondo poliédrico 3D en Login
  const authBackdrop = document.getElementById("auth-faceted-backdrop");
  if (authViewEl && authBackdrop && !reduceMotion) {
    authViewEl.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 16;
      const ny = (e.clientY / window.innerHeight - 0.5) * 12;
      const svgEl = authBackdrop.querySelector(".auth-faceted-svg");
      if (svgEl) {
        svgEl.style.transform = `translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
      }
    });
  }

  // Envío de Login -> Autentica y abre el Panel Admin
  const authLoginForm = document.getElementById("auth-login-form");
  const authLoginFeedback = document.getElementById("auth-login-feedback");
  if (authLoginForm) {
    authLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userVal = document.getElementById("auth-login-user")?.value.trim() || "elrescate_admin";
      if (authLoginFeedback) {
        authLoginFeedback.textContent =
          currentLang === "en"
            ? `✓ Welcome back, ${userVal}. Entering El Rescate Admin Panel...`
            : `✓ Acceso verificado para ${userVal}. Abriendo Panel Administrativo...`;
        authLoginFeedback.classList.add("is-visible");
      }
      setTimeout(() => {
        if (authLoginFeedback) authLoginFeedback.classList.remove("is-visible");
        openAdminView("overview");
      }, 650);
    });
  }

  // Envío de Crear Usuario -> Registra y abre el Panel Admin
  const authRegForm = document.getElementById("auth-register-form");
  const authRegFeedback = document.getElementById("auth-reg-feedback");
  if (authRegForm) {
    authRegForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("auth-reg-name")?.value.trim() || "Coordinador El Rescate";
      if (authRegFeedback) {
        authRegFeedback.textContent =
          currentLang === "en"
            ? `✓ Account created for ${nameVal}. Redirecting to Admin Panel...`
            : `✓ Usuario institucional creado para ${nameVal}. Ingresando al Panel Admin...`;
        authRegFeedback.classList.add("is-visible");
      }
      setTimeout(() => {
        if (authRegFeedback) authRegFeedback.classList.remove("is-visible");
        openAdminView("overview");
      }, 650);
    });
  }

  document.getElementById("btn-forgot-pass")?.addEventListener("click", () => {
    if (authLoginFeedback) {
      authLoginFeedback.textContent =
        currentLang === "en"
          ? "🔒 Password reset link sent to your @elrescate.org institutional email."
          : "🔒 Se ha enviado un enlace de recuperación a tu correo institucional @elrescate.org.";
      authLoginFeedback.classList.add("is-visible");
    }
  });

  // --------------------------------------------------------------------------
  // LÓGICA INTEGRAL DEL PANEL ADMINISTRATIVO (#admin-view)
  // --------------------------------------------------------------------------
  let activeAdminTab = "overview";
  let activeAdminChartMode = "campaigns";
  let adminCalMonthIdx = 0;
  let adminActiveSlotGroup = "Miércoles";

  function switchAdminTab(tabName) {
    activeAdminTab = tabName || "overview";
    document.querySelectorAll(".admin-nav-tab").forEach((btn) => {
      const match = btn.getAttribute("data-admin-tab") === activeAdminTab;
      btn.classList.toggle("is-active", match);
      btn.setAttribute("aria-selected", match ? "true" : "false");
    });
    document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === `admin-panel-${activeAdminTab}`);
    });
  }

  document.querySelectorAll(".admin-nav-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchAdminTab(btn.getAttribute("data-admin-tab") || "overview");
    });
  });

  document.querySelectorAll("[data-goto-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchAdminTab(btn.getAttribute("data-goto-tab") || "appointments");
    });
  });

  document.getElementById("btn-admin-quick-new-appt")?.addEventListener("click", () => {
    switchAdminTab("appointments");
    openAdminApptForm(null);
  });

  // Sub-pestañas en Overview
  document.querySelectorAll(".admin-sub-seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-sub-seg-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      const mode = btn.getAttribute("data-ov-mode");
      if (mode === "donations") {
        activeAdminChartMode = "campaigns";
      } else {
        activeAdminChartMode = "appointments";
      }
      renderAdminOverviewBars();
    });
  });

  document.querySelectorAll(".admin-mini-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-mini-tab").forEach((b) => b.classList.toggle("is-active", b === btn));
      activeAdminChartMode = btn.getAttribute("data-chart-mode") || "campaigns";
      renderAdminOverviewBars();
    });
  });

  function renderAdminOverviewBars() {
    const stage = document.getElementById("adm-overview-bars-stage");
    if (!stage) return;

    const barsData =
      activeAdminChartMode === "appointments"
        ? [
            { lbl: "Jun", val: "19", pct: 48, peak: false },
            { lbl: "Jul", val: "22", pct: 56, peak: false },
            { lbl: "Ago", val: "25", pct: 64, peak: false },
            { lbl: "Sep", val: "28", pct: 72, peak: false },
            { lbl: "Oct", val: "31", pct: 80, peak: false },
            { lbl: "Nov", val: `${ADMIN_APPOINTMENTS.length} act.`, pct: 94, peak: true }
          ]
        : [
            { lbl: "Jun", val: "$31K", pct: 46, peak: false },
            { lbl: "Jul", val: "$36K", pct: 54, peak: false },
            { lbl: "Ago", val: "$41K", pct: 62, peak: false },
            { lbl: "Sep", val: "$48K", pct: 74, peak: false },
            { lbl: "Oct", val: "$54K", pct: 82, peak: false },
            { lbl: "Nov", val: "$84.5K", pct: 95, peak: true }
          ];

    stage.innerHTML = barsData
      .map(
        (b) => `
        <div class="admin-pill-bar-col ${b.peak ? "is-peak" : ""}">
          <div class="admin-pill-bar-track">
            <div class="admin-pill-bar-fill" style="height:${b.pct}%;">
              <span class="admin-pill-bar-tag">${b.val}</span>
            </div>
          </div>
          <span class="admin-pill-bar-lbl">${b.lbl}</span>
        </div>
      `
      )
      .join("");
  }

  // 1. FLUJO DE MODIFICAR DÍAS CON CITAS Y HORAS DISPONIBLES
  function countTotalEnabledClinicDays() {
    const esMonths = CALENDAR_MONTHS_I18N.es;
    return esMonths.reduce((acc, m) => acc + Object.keys(m.availableDays).length, 0);
  }

  function renderAdminScheduleCalendar() {
    const grid = document.getElementById("admin-cal-grid");
    if (!grid) return;
    const esMonth = CALENDAR_MONTHS_I18N.es[adminCalMonthIdx];
    const enMonth = CALENDAR_MONTHS_I18N.en[adminCalMonthIdx];
    grid.innerHTML = "";

    for (let e = 0; e < esMonth.startDayOfWeek; e++) {
      const empty = document.createElement("span");
      empty.className = "admin-cal-day admin-cal-day--empty";
      grid.appendChild(empty);
    }

    const dowNamesEs = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dowNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let day = 1; day <= esMonth.daysInMonth; day++) {
      const isEnabled = Boolean(esMonth.availableDays[day]);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "admin-cal-day" + (isEnabled ? " is-enabled" : "");
      btn.innerHTML = `<span>${day}</span>`;
      btn.title = isEnabled
        ? "Día habilitado para citas (Clic para deshabilitar)"
        : "Día cerrado (Clic para habilitar citas)";

      btn.addEventListener("click", () => {
        const dow = (esMonth.startDayOfWeek + day - 1) % 7;
        if (esMonth.availableDays[day]) {
          delete esMonth.availableDays[day];
          delete enMonth.availableDays[day];
        } else {
          const dayLabelEs = dow === 6 ? "Sábado" : dowNamesEs[dow] || "Miércoles";
          const dayLabelEn = dow === 6 ? "Saturday" : dowNamesEn[dow] || "Wednesday";
          esMonth.availableDays[day] = dayLabelEs;
          enMonth.availableDays[day] = dayLabelEn;
          if (!SLOTS_BY_DAY_TYPE[dayLabelEs]) {
            SLOTS_BY_DAY_TYPE[dayLabelEs] = [...SLOTS_BY_DAY_TYPE["Miércoles"]];
            SLOTS_BY_DAY_TYPE[dayLabelEn] = [...SLOTS_BY_DAY_TYPE["Miércoles"]];
          }
        }
        // Si el día seleccionado en la vista pública fue deshabilitado, elegir el primer disponible
        const availKeys = Object.keys(esMonth.availableDays).map(Number);
        if (availKeys.length > 0 && !esMonth.availableDays[selectedDay]) {
          selectedDay = availKeys[0];
        }
        renderClinicCalendar();
        renderTimeSlots();
        updateSelectionBanner();
        refreshAdminUI();
      });

      grid.appendChild(btn);
    }
  }

  document.querySelectorAll(".admin-month-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-month-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      adminCalMonthIdx = Number(btn.getAttribute("data-adm-month")) || 0;
      renderAdminScheduleCalendar();
    });
  });

  // Alternar todos los días de una columna de la semana (Lun, Mar, Mié, Jue, Vie, Sáb)
  document.querySelectorAll(".admin-weekday-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetDow = Number(chip.getAttribute("data-Toggle-dow"));
      const esMonth = CALENDAR_MONTHS_I18N.es[adminCalMonthIdx];
      const enMonth = CALENDAR_MONTHS_I18N.en[adminCalMonthIdx];
      const dowNamesEs = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const dowNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const matchingDays = [];
      for (let d = 1; d <= esMonth.daysInMonth; d++) {
        if ((esMonth.startDayOfWeek + d - 1) % 7 === targetDow) {
          matchingDays.push(d);
        }
      }
      const allActive = matchingDays.every((d) => Boolean(esMonth.availableDays[d]));
      matchingDays.forEach((d) => {
        if (allActive) {
          delete esMonth.availableDays[d];
          delete enMonth.availableDays[d];
        } else {
          const lblEs = dowNamesEs[targetDow];
          const lblEn = dowNamesEn[targetDow];
          esMonth.availableDays[d] = lblEs;
          enMonth.availableDays[d] = lblEn;
          if (!SLOTS_BY_DAY_TYPE[lblEs]) {
            SLOTS_BY_DAY_TYPE[lblEs] = [...SLOTS_BY_DAY_TYPE["Miércoles"]];
            SLOTS_BY_DAY_TYPE[lblEn] = [...SLOTS_BY_DAY_TYPE["Miércoles"]];
          }
        }
      });
      chip.classList.toggle("is-active", !allActive);
      renderClinicCalendar();
      renderTimeSlots();
      updateSelectionBanner();
      refreshAdminUI();
    });
  });

  // 2. GESTOR DE HORAS DISPONIBLES POR JORNADA
  document.querySelectorAll(".admin-slot-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-slot-type-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      adminActiveSlotGroup = btn.getAttribute("data-slot-group") || "Miércoles";
      renderAdminSlotsEditor();
    });
  });

  function renderAdminSlotsEditor() {
    const listEl = document.getElementById("admin-slots-pills-list");
    const selectTimeEl = document.getElementById("adm-appt-time");
    const slots = SLOTS_BY_DAY_TYPE[adminActiveSlotGroup] || [];

    if (listEl) {
      listEl.innerHTML = slots
        .map(
          (slot, idx) => `
          <span class="admin-slot-chip">
            <span>🕒 ${slot}</span>
            <button type="button" class="admin-slot-chip__remove" data-remove-slot="${idx}" title="Eliminar horario">×</button>
          </span>
        `
        )
        .join("");

      listEl.querySelectorAll("[data-remove-slot]").forEach((rmBtn) => {
        rmBtn.addEventListener("click", () => {
          const idx = Number(rmBtn.getAttribute("data-remove-slot"));
          if (slots.length <= 1) return;
          slots.splice(idx, 1);
          if (adminActiveSlotGroup === "Miércoles") {
            SLOTS_BY_DAY_TYPE["Wednesday"] = [...slots];
          } else {
            SLOTS_BY_DAY_TYPE["Saturday"] = [...slots];
          }
          renderTimeSlots();
          updateSelectionBanner();
          refreshAdminUI();
        });
      });
    }

    if (selectTimeEl) {
      const allSlots = Array.from(
        new Set([...(SLOTS_BY_DAY_TYPE["Sábado"] || []), ...(SLOTS_BY_DAY_TYPE["Miércoles"] || [])])
      );
      selectTimeEl.innerHTML = allSlots.map((s) => `<option value="${s}">${s}</option>`).join("");
    }
  }

  document.getElementById("btn-admin-add-slot")?.addEventListener("click", () => {
    const inp = document.getElementById("admin-new-slot-input");
    const val = (inp?.value || "").trim();
    if (!val) return;
    const slots = SLOTS_BY_DAY_TYPE[adminActiveSlotGroup];
    if (slots && !slots.includes(val)) {
      slots.push(val);
      if (adminActiveSlotGroup === "Miércoles") {
        SLOTS_BY_DAY_TYPE["Wednesday"] = [...slots];
      } else {
        SLOTS_BY_DAY_TYPE["Saturday"] = [...slots];
      }
    }
    if (inp) inp.value = "";
    renderTimeSlots();
    updateSelectionBanner();
    refreshAdminUI();
  });

  // 3. CRUD DE CITAS AGENDADAS (CREAR, MODIFICAR, CAMBIAR ESTADO Y ELIMINAR)
  const apptFormEl = document.getElementById("admin-appt-editor-form");

  function openAdminApptForm(apptObj = null) {
    if (!apptFormEl) return;
    renderAdminSlotsEditor();
    apptFormEl.hidden = false;
    const titleEl = document.getElementById("admin-appt-form-title");
    document.getElementById("adm-appt-edit-id").value = apptObj ? apptObj.id : "";
    document.getElementById("adm-appt-name").value = apptObj ? apptObj.name : "";
    document.getElementById("adm-appt-phone").value = apptObj ? apptObj.phone : "";
    document.getElementById("adm-appt-email").value = apptObj ? apptObj.email : "";
    document.getElementById("adm-appt-case").value = apptObj ? apptObj.caseType : "Asilo y Refugio";
    document.getElementById("adm-appt-date").value = apptObj ? apptObj.dateLabel : "Sábado, 21 De Noviembre";
    document.getElementById("adm-appt-time").value = apptObj ? apptObj.timeSlot : "10:00 AM – 11:00 AM";
    document.getElementById("adm-appt-status").value = apptObj ? apptObj.status : "Confirmada";
    document.getElementById("adm-appt-notes").value = apptObj ? apptObj.notes : "";
    if (titleEl) {
      titleEl.textContent = apptObj
        ? `Modificar Cita ${apptObj.id} — ${apptObj.name}`
        : "Registrar Nueva Cita Legal";
    }
  }

  document.getElementById("btn-open-new-appt-form")?.addEventListener("click", () => openAdminApptForm(null));
  document.getElementById("btn-close-appt-form")?.addEventListener("click", () => {
    if (apptFormEl) apptFormEl.hidden = true;
  });
  document.getElementById("btn-cancel-appt")?.addEventListener("click", () => {
    if (apptFormEl) apptFormEl.hidden = true;
  });

  if (apptFormEl) {
    apptFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const editId = document.getElementById("adm-appt-edit-id").value;
      const payload = {
        id: editId || `CITA-2026-${101 + ADMIN_APPOINTMENTS.length}`,
        name: document.getElementById("adm-appt-name").value.trim() || "Solicitante Comunitario",
        phone: document.getElementById("adm-appt-phone").value.trim() || "(213) 555-0100",
        email: document.getElementById("adm-appt-email").value.trim() || "cita@elrescate.org",
        caseType: document.getElementById("adm-appt-case").value,
        dateLabel: document.getElementById("adm-appt-date").value.trim() || "Sábado, 21 De Noviembre",
        timeSlot: document.getElementById("adm-appt-time").value || "10:00 AM – 11:00 AM",
        status: document.getElementById("adm-appt-status").value || "Confirmada",
        notes: document.getElementById("adm-appt-notes").value.trim() || "Registrado en Panel Admin"
      };

      if (editId) {
        const idx = ADMIN_APPOINTMENTS.findIndex((a) => a.id === editId);
        if (idx !== -1) ADMIN_APPOINTMENTS[idx] = payload;
      } else {
        ADMIN_APPOINTMENTS.unshift(payload);
      }

      apptFormEl.hidden = true;
      refreshAdminUI();
    });
  }

  function renderAdminAppointmentsList() {
    const listEl = document.getElementById("admin-appointments-list");
    if (!listEl) return;

    const query = (document.getElementById("adm-appt-search")?.value || "").toLowerCase().trim();
    const caseFilter = document.getElementById("adm-appt-filter-case")?.value || "all";
    const statusFilter = document.getElementById("adm-appt-filter-status")?.value || "all";

    const filtered = ADMIN_APPOINTMENTS.filter((a) => {
      const matchSearch =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.phone.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query);
      const matchCase = caseFilter === "all" || a.caseType === caseFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchCase && matchStatus;
    });

    listEl.innerHTML = filtered
      .map((a) => {
        const badgeClass =
          a.status === "Confirmada"
            ? "admin-status-badge--confirmed"
            : a.status === "Atendida"
              ? "admin-status-badge--completed"
              : "admin-status-badge--pending";

        return `
          <div class="admin-appt-item">
            <div>
              <div class="admin-appt-item__top">
                <span class="admin-appt-folio">#${a.id}</span>
                <span class="admin-status-badge ${badgeClass}">${a.status}</span>
                <span class="admin-pill-tag">${a.caseType}</span>
              </div>
              <div class="admin-appt-name">${a.name}</div>
              <div class="admin-appt-meta">
                📅 <strong>${a.dateLabel}</strong> • 🕒 ${a.timeSlot} • 📞 ${a.phone} • ✉️ ${a.email}
              </div>
              <div class="admin-appt-meta" style="margin-top:2px;">
                📋 ${a.notes}
              </div>
            </div>
            <div class="admin-appt-item__actions">
              <button type="button" class="admin-mini-action-btn" data-edit-appt="${a.id}">Modificar</button>
              <button type="button" class="admin-mini-action-btn" data-toggle-appt="${a.id}">Estado</button>
              <button type="button" class="admin-mini-action-btn admin-mini-action-btn--danger" data-del-appt="${a.id}">Eliminar</button>
            </div>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-edit-appt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = ADMIN_APPOINTMENTS.find((x) => x.id === btn.getAttribute("data-edit-appt"));
        if (target) openAdminApptForm(target);
      });
    });

    listEl.querySelectorAll("[data-toggle-appt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = ADMIN_APPOINTMENTS.find((x) => x.id === btn.getAttribute("data-toggle-appt"));
        if (!target) return;
        const order = ["Confirmada", "Pendiente", "Atendida"];
        target.status = order[(order.indexOf(target.status) + 1) % order.length];
        refreshAdminUI();
      });
    });

    listEl.querySelectorAll("[data-del-appt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del-appt");
        const idx = ADMIN_APPOINTMENTS.findIndex((x) => x.id === id);
        if (idx !== -1) {
          ADMIN_APPOINTMENTS.splice(idx, 1);
          refreshAdminUI();
        }
      });
    });
  }

  document.getElementById("adm-appt-search")?.addEventListener("input", renderAdminAppointmentsList);
  document.getElementById("adm-appt-filter-case")?.addEventListener("change", renderAdminAppointmentsList);
  document.getElementById("adm-appt-filter-status")?.addEventListener("change", renderAdminAppointmentsList);

  // 4. GESTIÓN Y TRAZABILIDAD DE DONACIONES (QUIÉN DONÓ Y HACIA QUÉ CAMPAÑA DONÓ)
  const donFormEl = document.getElementById("admin-donation-editor-form");
  document.getElementById("btn-admin-new-donation")?.addEventListener("click", () => {
    if (donFormEl) donFormEl.hidden = !donFormEl.hidden;
  });
  document.getElementById("btn-close-don-form")?.addEventListener("click", () => {
    if (donFormEl) donFormEl.hidden = true;
  });

  if (donFormEl) {
    donFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const donorName = document.getElementById("adm-don-donor").value.trim() || "Donante Solidario";
      const email = document.getElementById("adm-don-email").value.trim() || "donante@comunidad.org";
      const campaignKey = document.getElementById("adm-don-campaign").value || "organizacion";
      const amount = Number(document.getElementById("adm-don-amount").value) || 150;
      const freq = document.getElementById("adm-don-freq").value || "Donación Única";
      const method = document.getElementById("adm-don-method").value || "Tarjeta •••• 4829";

      ADMIN_DONATIONS.unshift({
        folio: `ER-501C3-${Math.floor(850000 + Math.random() * 99999)}`,
        date: "09 Nov 2026",
        donorName,
        email,
        city: "Los Ángeles, CA",
        campaignKey,
        amount,
        freq,
        method
      });
      donFormEl.hidden = true;
      refreshAdminUI();
    });
  }

  function renderAdminDonationsTab() {
    const tbody = document.getElementById("admin-donations-tbody");
    const breakdownGrid = document.getElementById("admin-campaigns-breakdown-grid");
    const campDict = DONATION_CAMPAIGNS_I18N[currentLang] || DONATION_CAMPAIGNS_I18N.es;

    const baseCampaignTotals = {
      organizacion: { raised: 84500, goal: 100000 },
      asilo: { raised: 62800, goal: 80000 },
      daca: { raised: 53900, goal: 65000 },
      clinicas: { raised: 41200, goal: 50000 }
    };

    // Sumar donaciones adicionales registradas en la sesión
    const extraDonations = ADMIN_DONATIONS.slice(0, Math.max(0, ADMIN_DONATIONS.length - 10));
    extraDonations.forEach((d) => {
      if (baseCampaignTotals[d.campaignKey]) {
        baseCampaignTotals[d.campaignKey].raised += Number(d.amount) || 0;
      }
    });

    const grandTotal = Object.values(baseCampaignTotals).reduce((s, c) => s + c.raised, 0);
    const setTxt = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };

    setTxt("adm-dkpi-total", `$${grandTotal.toLocaleString("en-US")}`);
    setTxt("adm-ov-kpi-donations", `$${(grandTotal / 1000).toFixed(1)}K`);
    setTxt("adm-gauge-total-val", `$${(grandTotal / 1000).toFixed(1)}K`);
    setTxt("adm-dkpi-donors", `${ADMIN_DONATIONS.length} Registros`);

    const avgGift = Math.round(
      ADMIN_DONATIONS.reduce((s, d) => s + (Number(d.amount) || 0), 0) / Math.max(1, ADMIN_DONATIONS.length)
    );
    setTxt("adm-dkpi-avg", `$${avgGift.toLocaleString("en-US")} USD`);

    if (breakdownGrid) {
      breakdownGrid.innerHTML = Object.keys(baseCampaignTotals)
        .map((key) => {
          const cObj = campDict[key] || campDict.organizacion;
          const stats = baseCampaignTotals[key];
          const pct = Math.min(100, Math.round((stats.raised / stats.goal) * 100));
          const donorCount = ADMIN_DONATIONS.filter((d) => d.campaignKey === key).length;
          return `
            <div class="admin-camp-card">
              <div class="admin-camp-card__code">${cObj.code}</div>
              <div class="admin-camp-card__title">${cObj.shortName}</div>
              <div class="admin-camp-card__bar">
                <div class="admin-camp-card__fill" style="width:${pct}%;"></div>
              </div>
              <div class="admin-camp-card__nums">
                <span>$${stats.raised.toLocaleString("en-US")} / $${stats.goal.toLocaleString("en-US")}</span>
                <span>${donorCount} donantes (${pct}%)</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    if (!tbody) return;
    const query = (document.getElementById("adm-don-search")?.value || "").toLowerCase().trim();
    const campFilter = document.getElementById("adm-don-filter-campaign")?.value || "all";

    const filtered = ADMIN_DONATIONS.filter((d) => {
      const matchQuery =
        !query ||
        d.donorName.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query) ||
        d.folio.toLowerCase().includes(query) ||
        d.city.toLowerCase().includes(query);
      const matchCamp = campFilter === "all" || d.campaignKey === campFilter;
      return matchQuery && matchCamp;
    });

    tbody.innerHTML = filtered
      .map((d) => {
        const cObj = campDict[d.campaignKey] || campDict.organizacion;
        const initials = d.donorName
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0] || "")
          .join("")
          .toUpperCase();

        return `
          <tr>
            <td>
              <div style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; color:#0056B3;">#${d.folio}</div>
              <div style="font-size:12px; color:var(--text-muted);">${d.date}</div>
            </td>
            <td>
              <div class="admin-donor-cell">
                <span class="admin-donor-avatar">${initials}</span>
                <div>
                  <div style="font-weight:800; color:var(--navy-900);">${d.donorName}</div>
                  <div style="font-size:12px; color:var(--text-muted);">${d.email} • ${d.city}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="admin-campaign-pill-badge">● ${cObj.shortName}</span>
              <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-muted); margin-top:3px;">
                ${cObj.code}
              </div>
            </td>
            <td>
              <div style="font-family:var(--font-display); font-size:15px; font-weight:800; color:var(--navy-900);">
                $${Number(d.amount).toLocaleString("en-US")} USD
              </div>
              <div style="font-size:12px; color:var(--text-muted);">${d.freq}</div>
            </td>
            <td>
              <div style="font-size:12.5px; font-weight:700;">${d.method}</div>
              <span class="admin-status-badge admin-status-badge--completed">✓ 501(c)(3) Emitido</span>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  document.getElementById("adm-don-search")?.addEventListener("input", renderAdminDonationsTab);
  document.getElementById("adm-don-filter-campaign")?.addEventListener("change", renderAdminDonationsTab);

  // Exportar CSV de Donaciones
  document.getElementById("btn-admin-export-don-csv")?.addEventListener("click", () => {
    const campDict = DONATION_CAMPAIGNS_I18N[currentLang] || DONATION_CAMPAIGNS_I18N.es;
    const rows = [
      ["Folio", "Fecha", "Donante", "Correo", "Campana Destino", "Codigo Campana", "Monto USD", "Frecuencia", "Metodo"],
      ...ADMIN_DONATIONS.map((d) => {
        const cObj = campDict[d.campaignKey] || campDict.organizacion;
        return [d.folio, d.date, d.donorName, d.email, cObj.shortName, cObj.code, d.amount, d.freq, d.method];
      })
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "el_rescate_donaciones_campanas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  function refreshAdminUI() {
    const totalAppts = ADMIN_APPOINTMENTS.length;
    const confirmedCount = ADMIN_APPOINTMENTS.filter((a) => a.status === "Confirmada").length;
    const pendingCount = ADMIN_APPOINTMENTS.filter((a) => a.status === "Pendiente").length;
    const enabledDaysCount = countTotalEnabledClinicDays();
    const wedSlotsCount = (SLOTS_BY_DAY_TYPE["Miércoles"] || []).length;
    const satSlotsCount = (SLOTS_BY_DAY_TYPE["Sábado"] || []).length;

    const setTxt = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };

    setTxt("adm-nav-appts-count", String(totalAppts));
    setTxt("adm-nav-don-count", String(ADMIN_DONATIONS.length));
    setTxt("adm-ov-kpi-appts", `${totalAppts} Citas`);
    setTxt("adm-ov-kpi-days", `${enabledDaysCount} Días`);
    setTxt("adm-akpi-total", String(totalAppts));
    setTxt("adm-akpi-status", `${confirmedCount} / ${pendingCount}`);
    setTxt("adm-akpi-days", `${enabledDaysCount} Días`);
    setTxt("adm-akpi-slots", `${wedSlotsCount + satSlotsCount} Bloques`);
    setTxt("adm-akpi-slots-sub", `Miércoles (${wedSlotsCount}) • Sábados (${satSlotsCount})`);
    setTxt("adm-strip-wed-slots", `${wedSlotsCount} Bloques`);
    setTxt("adm-strip-sat-slots", `${satSlotsCount} Bloques`);
    setTxt("adm-strip-confirmed", `${confirmedCount} Confirmadas`);

    // Desglose por tipo de caso en Overview
    const breakdownEl = document.getElementById("adm-overview-case-breakdown");
    if (breakdownEl) {
      const counts = {};
      ADMIN_APPOINTMENTS.forEach((a) => {
        counts[a.caseType] = (counts[a.caseType] || 0) + 1;
      });
      breakdownEl.innerHTML = Object.entries(counts)
        .map(
          ([k, v]) => `
          <div class="admin-stat-row">
            <span>${k}</span>
            <strong>${v} citas</strong>
          </div>
        `
        )
        .join("");
    }

    renderAdminOverviewBars();
    renderAdminScheduleCalendar();
    renderAdminSlotsEditor();
    renderAdminAppointmentsList();
    renderAdminDonationsTab();
  }

  refreshAdminUI();

  // ==========================================================================
  // 12. AJUSTE #1: SWITCH GLOBAL DE IDIOMA (ES / EN) EN TODA LA PÁGINA
  // ==========================================================================
  function applySiteLanguage(lang) {
    currentLang = lang === "en" ? "en" : "es";
    document.documentElement.lang = currentLang;

    const dict = I18N_DICT[currentLang] || I18N_DICT.es;

    // 1. Traducir todos los elementos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 2. Traducir todos los placeholders con data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && dict[key] !== undefined) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // 3. Re-renderizar módulos dinámicos en el idioma seleccionado
    renderManifestoWords();
    runAllCipherCards();
    renderRiffDeck();
    renderUnveilPlanes(activeUnveilFilter);
    refreshTimelineLanguage();
    renderClinicCalendar();
    renderTimeSlots();
    updateSelectionBanner();
    syncDonationUI();
    resetAssistantConversation();
    refreshAdminUI();

    // 4. Re-alinear la píldora líquida de navegación tras el cambio de ancho de textos
    setTimeout(() => {
      const activeBtn =
        document.querySelector(".gooey-nav__btn.is-active") ||
        document.querySelector(".gooey-nav__btn");
      if (activeBtn && typeof moveGooeyPillToButton === "function") {
        moveGooeyPillToButton(activeBtn, true);
      }
    }, 50);
  }

  document.querySelectorAll(".lang-pill__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-pill__btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      const selectedLang = btn.getAttribute("data-lang") || "es";
      applySiteLanguage(selectedLang);
    });
  });

  window.addEventListener("popstate", () => {
    if (window.location.hash === "#vista-login") {
      openAuthView(false);
    } else if (window.location.hash === "#vista-admin") {
      openAdminView("overview");
    } else if (window.location.hash !== "#vista-donacion") {
      closeAllSpecialViews();
    }
  });

  if (window.location.hash === "#vista-donacion") {
    openDonationCheckoutView();
  } else if (window.location.hash === "#vista-login") {
    openAuthView(false);
  } else if (window.location.hash === "#vista-admin") {
    openAdminView("overview");
  }
})();
