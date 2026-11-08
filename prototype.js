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
  // 4. CONMUTADOR BILINGÜE FUNCIONAL (ES / EN)
  // ==========================================================================
  const I18N_DICT = {
    es: {
      nav_home: "Inicio",
      nav_about: "Nosotros",
      nav_services: "Servicios",
      nav_archive: "Archivo 3D",
      nav_history: "Historia 3D",
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
      hero_z3_title: "Cuatro décadas de arraigo en L.A.",
      hero_z3_sub: "Orientación legal, clínicas de miércoles y sábados y defensa comunitaria sin barreras.",
      hero_badge_families: "+45,000 familias acompañadas",
      hero_cap_title: "Memoria viva y presente comunitario en Los Ángeles",
      hero_cap_desc:
        "Nacida en el corazón de Westlake en 1981, El Rescate camina junto a la población inmigrante construyendo arraigo, dignidad y futuro compartido.",
      why_tab: "¿Por qué confiar en El Rescate?"
    },
    en: {
      nav_home: "Home",
      nav_about: "About Us",
      nav_services: "Services",
      nav_archive: "3D Archive",
      nav_history: "3D History",
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
      hero_z3_title: "Four Decades of Roots in L.A.",
      hero_z3_sub: "Legal representation, Wednesday & Saturday clinics, and barrier-free community advocacy.",
      hero_badge_families: "+45,000 families supported",
      hero_cap_title: "Living Memory & Community Present in Los Angeles",
      hero_cap_desc:
        "Founded in the heart of Westlake in 1981, El Rescate walks alongside the immigrant community building roots, dignity, and a shared future.",
      why_tab: "Why Trust El Rescate?"
    }
  };

  document.querySelectorAll(".lang-pill__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang") || "es";
      document.querySelectorAll(".lang-pill__btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });
      const dict = I18N_DICT[lang] || I18N_DICT.es;
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
      });
      setTimeout(() => {
        const activeNav = document.querySelector(".gooey-nav-btn.is-active");
        if (activeNav) moveGooeyPillToButton(activeNav, true);
      }, 30);
    });
  });

  // ==========================================================================
  // 5. MANIFIESTO SCROLL-SCRUBBED PALABRA POR PALABRA (Video 1 NEXORA 0:05)
  // ==========================================================================
  const manifestoEl = document.getElementById("scrub-manifesto");
  if (manifestoEl) {
    const rawWords = manifestoEl.textContent.trim().split(/\s+/);
    const accentKeywords = new Set([
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
    ]);

    manifestoEl.innerHTML = rawWords
      .map((w) => {
        const cls = accentKeywords.has(w) ? "scrub-word scrub-word--accent" : "scrub-word";
        return `<span class="${cls}">${w}</span>`;
      })
      .join(" ");

    const wordSpans = manifestoEl.querySelectorAll(".scrub-word");

    if (typeof window.ScrollTrigger !== "undefined" && !reduceMotion) {
      gsap.to(wordSpans, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto-section",
          start: "top 72%",
          end: "center 42%",
          scrub: 0.4,
          onUpdate: (self) => {
            const litCount = Math.floor(self.progress * wordSpans.length);
            wordSpans.forEach((sp, idx) => {
              sp.classList.toggle("is-lit", idx <= litCount);
            });
          }
        }
      });
    } else {
      wordSpans.forEach((sp) => sp.classList.add("is-lit"));
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
  // 6. RIFF 28 "CARD SHUFFLE" (Video 4) + ARCO 3D (Video 2 C&A)
  // ==========================================================================
  const SERVICES_DECK = [
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
  ];

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

    SERVICES_DECK.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = "riff-card";
      card.setAttribute("data-theme", item.theme);
      card.setAttribute("data-deck-id", String(idx));
      card.innerHTML = `
        <div class="riff-card__top">
          <div class="riff-card__num">${item.num}</div>
          <span class="riff-card__pill">${item.pill}</span>
        </div>
        <button type="button" class="riff-card__center-play" aria-label="Pausar o reanudar barajado automático">
          <span class="play-pause-icon">${isAutoPlaying ? "❚❚" : "▶"}</span>
        </button>
        <div class="riff-card__bottom">
          <div>
            <div class="riff-card__title">${item.title}</div>
            <div class="riff-card__sub">${item.sub}</div>
          </div>
          <button type="button" class="riff-card__next-btn" aria-label="Siguiente tarjeta">→</button>
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
      dot.setAttribute("aria-label", `Ir a tarjeta ${item.num}`);
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
    const frontId = deckOrder[0];
    const activeService = SERVICES_DECK[frontId];

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

      // Posicionamiento apilado con bordes superiores asomando como en RIFF 28
      const targetY = -stackPos * 13;
      const targetScale = 1 - stackPos * 0.048;
      const targetRot = stackPos === 0 ? 0 : (stackPos % 2 === 0 ? 1.2 : -1.2);
      const zIndex = SERVICES_DECK.length - stackPos;

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

    // Coreografía exacta de RIFF 28: la tarjeta frontal se inclina y desliza hacia la derecha
    // y luego se inserta detrás del mazo
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

  // Conmutador entre Mazo Shuffle (Video 4) y Arco 3D (Video 2)
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
  // 7. GALERÍA ESPACIAL 3D ESTILO "UNVEIL® PROJECTS" (Imagen 2)
  // ==========================================================================
  const UNVEIL_PLANES = [
    {
      id: "01",
      category: "legal",
      tag: "DEFENSA LEGAL • 1981",
      title: "Brigadas de Asilo en Pico-Union",
      img: "assets/provisional-documentary-la-placita.jpg",
      tint: "rgba(15, 38, 66, 0.36)"
    },
    {
      id: "02",
      category: "comunidad",
      tag: "MEMORIA VIVA • LA PLACITA",
      title: "Encuentros Comunitarios en Olvera St.",
      img: "assets/provisional-documentary-macarthur-park.jpg",
      tint: "rgba(232, 160, 74, 0.32)"
    },
    {
      id: "03",
      category: "legal",
      tag: "JURISPRUDENCIA • 1991",
      title: "Acuerdo ABC & Registro Masivo TPS",
      img: "assets/provisional-documentary-la-placita.jpg",
      tint: "rgba(11, 101, 198, 0.38)"
    },
    {
      id: "04",
      category: "clinica",
      tag: "CLÍNICA SEMANAL • MIÉRCOLES",
      title: "Orientación Jurídica Confidencial",
      img: "assets/provisional-documentary-macarthur-park.jpg",
      tint: "rgba(18, 64, 89, 0.42)"
    },
    {
      id: "05",
      category: "comunidad",
      tag: "ECONOMÍA SOCIAL • 2004",
      title: "Red de Microempresas Migrantes",
      img: "assets/provisional-documentary-la-placita.jpg",
      tint: "rgba(212, 148, 58, 0.34)"
    },
    {
      id: "06",
      category: "legal",
      tag: "JUVENTUD • 2015",
      title: "Defensa de Dreamers y DACA en L.A.",
      img: "assets/provisional-documentary-macarthur-park.jpg",
      tint: "rgba(23, 59, 99, 0.40)"
    },
    {
      id: "07",
      category: "clinica",
      tag: "PRESENTE • 2026",
      title: "Plataforma Digital de Acceso Humanitario",
      img: "assets/provisional-documentary-la-placita.jpg",
      tint: "rgba(11, 101, 198, 0.32)"
    }
  ];

  const unveilCorridor = document.getElementById("unveil-3d-corridor");
  const unveilViewport = document.getElementById("unveil-viewport");
  const unveilCounter = document.getElementById("unveil-active-counter");

  function renderUnveilPlanes(filter = "all") {
    if (!unveilCorridor) return;
    const filtered =
      filter === "all"
        ? UNVEIL_PLANES
        : UNVEIL_PLANES.filter((p) => p.category === filter);

    unveilCorridor.innerHTML = "";
    const count = filtered.length;
    const mid = (count - 1) / 2;

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

      el.innerHTML = `
        <img src="${plane.img}" alt="${plane.title}" />
        <div class="unveil-plane__glass" style="background: linear-gradient(135deg, ${plane.tint} 0%, rgba(9,25,44,0.68) 100%);">
          <div class="unveil-plane__meta">
            <span>CAPA ${plane.id}</span>
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
  // ==========================================================================
  const TIMELINE_DATA = [
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
          sub: "ARCHIVO 1981 • LOS ÁNGELES"
        },
        {
          img: "assets/provisional-documentary-macarthur-park.jpg",
          caption: "Entorno vecinal de Westlake",
          sub: "ARCHIVO 1981 • CORREDOR CENTRAL"
        },
        {
          img: "assets/provisional-documentary-la-placita.jpg",
          caption: "Primeras brigadas de orientación legal",
          sub: "EXPEDIENTE #01 • PRO BONO"
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
          sub: "ARCHIVO 1991 • DEFENSA CIVIL"
        },
        {
          img: "assets/provisional-documentary-la-placita.jpg",
          caption: "Asesoría familiar para permisos de trabajo",
          sub: "ARCHIVO 1991 • CLÍNICA JURÍDICA"
        },
        {
          img: "assets/provisional-documentary-macarthur-park.jpg",
          caption: "Organización vecinal en el corazón de L.A.",
          sub: "EXPEDIENTE #104 • DERECHOS"
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
          sub: "ARCHIVO 2004 • DESARROLLO LOCAL"
        },
        {
          img: "assets/provisional-documentary-macarthur-park.jpg",
          caption: "Talleres comunitarios de ciudadanía",
          sub: "ARCHIVO 2004 • EDUCACIÓN CÍVICA"
        },
        {
          img: "assets/provisional-documentary-la-placita.jpg",
          caption: "Feria de servicios familiares en Olvera St.",
          sub: "EXPEDIENTE #218 • COMUNIDAD"
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
          sub: "ARCHIVO 2015 • FUTURO JOVEN"
        },
        {
          img: "assets/provisional-documentary-la-placita.jpg",
          caption: "Reunificación de familias en Los Ángeles",
          sub: "ARCHIVO 2015 • AMPARO LEGAL"
        },
        {
          img: "assets/provisional-documentary-macarthur-park.jpg",
          caption: "Foro de derechos constitucionales",
          sub: "EXPEDIENTE #389 • JUSTICIA"
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
          sub: "ARCHIVO 2026 • PRESENTE Y FUTURO"
        },
        {
          img: "assets/provisional-documentary-macarthur-park.jpg",
          caption: "Atención híbrida presencial y digital",
          sub: "ARCHIVO 2026 • INNOVACIÓN SOCIAL"
        },
        {
          img: "assets/provisional-documentary-la-placita.jpg",
          caption: "Cuatro décadas caminando junto al migrante",
          sub: "EXPEDIENTE #500 • EL RESCATE"
        }
      ]
    }
  ];

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

    let currentYearMeshGroup = build3DYearMeshGroup(TIMELINE_DATA[0].year, matYearMatteGold, matBusNavy);
    floatingYearPivot.add(currentYearMeshGroup);

    let currentIndex = 0;
    let isTransitioning = false;
    const motionState = { planetAngle: 0, lastPlanetAngle: 0, busSpeedBoost: 0 };

    const routeNodesEl = document.getElementById("nexora-route-nodes");
    const polaroidStackEl = document.getElementById("polaroid-stack");
    const polaroidYearBadge = document.getElementById("polaroid-year-badge");
    const panelPolaroids = document.getElementById("panel-polaroids");
    const panelClipboard = document.getElementById("panel-clipboard");

    if (routeNodesEl) {
      TIMELINE_DATA.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nexora-node-btn" + (idx === 0 ? " is-active" : "");
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

    function renderStepDOM(index) {
      const data = TIMELINE_DATA[index];
      if (polaroidYearBadge) polaroidYearBadge.textContent = data.year;
      if (polaroidStackEl) {
        polaroidStackEl.innerHTML = data.polaroids
          .map(
            (p) => `
            <figure class="polaroid-card">
              <div class="polaroid-card__photo-wrap">
                <img class="polaroid-card__photo" src="${p.img}" alt="${p.caption}" />
                <span class="polaroid-card__stamp">${data.year}</span>
              </div>
              <figcaption class="polaroid-card__caption">${p.caption}</figcaption>
              <div class="polaroid-card__sub">${p.sub}</div>
            </figure>
          `
          )
          .join("");
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

      const stepAngle = (Math.PI * 2) / TIMELINE_DATA.length;
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
          swap3DYearGeometry(TIMELINE_DATA[currentIndex].year);
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
        navigateToIndex((currentIndex - 1 + TIMELINE_DATA.length) % TIMELINE_DATA.length, -1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        navigateToIndex((currentIndex + 1) % TIMELINE_DATA.length, 1);
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
  // 9. CALENDARIO DE CLÍNICA LEGAL (Imagen 1 Exacta) + EVALUADOR DE CASO
  // ==========================================================================
  const CALENDAR_MONTHS = [
    {
      label: "Noviembre de 2026",
      monthName: "Noviembre",
      daysInMonth: 30,
      startDayOfWeek: 0, // 1 de Noviembre de 2026 es Domingo (0)
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
      startDayOfWeek: 2, // 1 de Diciembre de 2026 es Martes (2)
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
  ];

  const SLOTS_BY_DAY_TYPE = {
    Sábado: ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM", "12:00 PM – 1:00 PM"],
    Miércoles: ["2:00 PM – 3:00 PM", "3:00 PM – 4:00 PM", "4:00 PM – 5:00 PM"]
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
    const monthObj = CALENDAR_MONTHS[currentMonthIdx];
    if (calMonthLabel) calMonthLabel.textContent = monthObj.label;

    calGridEl.innerHTML = "";

    // Celdas vacías previas al día 1
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
    const monthObj = CALENDAR_MONTHS[currentMonthIdx];
    const dayType = monthObj.availableDays[selectedDay] || "Sábado";
    const slots = SLOTS_BY_DAY_TYPE[dayType];

    if (timeslotHeading) {
      timeslotHeading.textContent = `${dayType}, ${selectedDay} De ${monthObj.monthName} – Elige Un Horario`;
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
    const monthObj = CALENDAR_MONTHS[currentMonthIdx];
    const dayType = monthObj.availableDays[selectedDay] || "Sábado";
    selectionSummaryText.textContent = `${dayType}, ${selectedDay} De ${monthObj.monthName}, ${selectedSlot}`;
  }

  const prevMonthBtn = document.getElementById("cal-prev-month");
  const nextMonthBtn = document.getElementById("cal-next-month");
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentMonthIdx = (currentMonthIdx - 1 + CALENDAR_MONTHS.length) % CALENDAR_MONTHS.length;
      selectedDay = CALENDAR_MONTHS[currentMonthIdx].defaultSelectedDay;
      renderClinicCalendar();
      renderTimeSlots();
      updateSelectionBanner();
    });
    nextMonthBtn.addEventListener("click", () => {
      currentMonthIdx = (currentMonthIdx + 1) % CALENDAR_MONTHS.length;
      selectedDay = CALENDAR_MONTHS[currentMonthIdx].defaultSelectedDay;
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
      const nameVal = document.getElementById("input-name").value.trim() || "Integrante de la comunidad";
      const caseVal = document.getElementById("input-case-type").value || "Orientación General";
      const summary = selectionSummaryText ? selectionSummaryText.textContent : "";

      successToast.textContent = `✓ ¡Charla pre-confirmada para ${nameVal}! Te esperamos el ${summary} (${caseVal}). Recibirás confirmación confidencial.`;
      successToast.classList.add("is-visible");
    });
  }

  // Botón flotante "💬 Evaluador" (Imagen 1)
  const evalFab = document.getElementById("evaluador-fab");
  const evalModal = document.getElementById("evaluador-modal");
  const evalClose = document.getElementById("evaluador-close");
  const caseSelect = document.getElementById("input-case-type");

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

    document.querySelectorAll(".eval-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosenCase = btn.getAttribute("data-case");
        if (caseSelect && chosenCase) {
          caseSelect.value = chosenCase;
        }
        evalModal.classList.remove("is-open");
        const clinicSec = document.getElementById("clinica-citas");
        if (clinicSec) {
          if (lenis) lenis.scrollTo(clinicSec, { offset: -60 });
          else clinicSec.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }
})();
