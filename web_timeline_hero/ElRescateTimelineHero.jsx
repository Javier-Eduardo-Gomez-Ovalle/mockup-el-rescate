import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

/**
 * ============================================================================
 * EL RESCATE — HERO INTERACTIVO DE LÍNEA DE TIEMPO (React Three Fiber + GSAP)
 * ============================================================================
 * Paleta oficial acorde a https://www.elrescate.org/ y Design System:
 * - Navy Primario:   #173B63
 * - Azul Secundario: #245B87
 * - Dorado / Ámbar:  #D4943A / #E8A04A
 * - Blanco Cálido:   #F7F6F2
 */

export const TIMELINE_MILESTONES = [
  {
    year: "1981",
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
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Encuentro comunitario en La Placita",
        sub: "ARCHIVO 1981 • LOS ÁNGELES",
      },
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Entorno vecinal de Westlake",
        sub: "ARCHIVO 1981 • CORREDOR CENTRAL",
      },
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Primeras brigadas de orientación legal",
        sub: "EXPEDIENTE #01 • PRO BONO",
      },
    ],
  },
  {
    year: "1991",
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
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Jornadas de registro TPS en MacArthur Park",
        sub: "ARCHIVO 1991 • DEFENSA CIVIL",
      },
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Asesoría familiar para permisos de trabajo",
        sub: "ARCHIVO 1991 • CLÍNICA JURÍDICA",
      },
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Organización vecinal en el corazón de L.A.",
        sub: "EXPEDIENTE #104 • DERECHOS",
      },
    ],
  },
  {
    year: "2004",
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
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Red de comercios y familias emprendedoras",
        sub: "ARCHIVO 2004 • DESARROLLO LOCAL",
      },
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Talleres comunitarios de ciudadanía",
        sub: "ARCHIVO 2004 • EDUCACIÓN CÍVICA",
      },
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Feria de servicios familiares en Olvera St.",
        sub: "EXPEDIENTE #218 • COMUNIDAD",
      },
    ],
  },
  {
    year: "2015",
    docket: "EXP. #ER-2015-389",
    seal: "PROTECCIÓN DACA",
    kicker: "JUVENTUD Y REUNIFICACIÓN • CALIFORNIA",
    title: "Defensa de Dreamers y Menores No Acompañados",
    description:
      "Creación del equipo especializado en representación de jóvenes bajo el programa DACA y defensa humanitaria para menores y madres refugiadas en tribunales de inmigración de Los Ángeles.",
    stat1Val: "98% Éxito",
    stat1Lbl: "En renovaciones y amparos DACA",
    stat2Val: "Bilingüe",
    stat2Lbl: "Acompañamiento humano continuo",
    polaroids: [
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Juventud universitaria beneficiaria de DACA",
        sub: "ARCHIVO 2015 • FUTURO JOVEN",
      },
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Reunificación de familias en Los Ángeles",
        sub: "ARCHIVO 2015 • AMPARO LEGAL",
      },
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Foro de derechos constitucionales",
        sub: "EXPEDIENTE #389 • JUSTICIA",
      },
    ],
  },
  {
    year: "2026",
    docket: "EXP. #ER-2026-500",
    seal: "ERA DIGITAL",
    kicker: "ACCESO UNIVERSAL • NUEVA PLATAFORMA",
    title: "Transformación Digital y Alcance Comunitario",
    description:
      "Hoy El Rescate conecta cuatro décadas de prestigio jurídico con una plataforma digital accesible y bilingüe para que cada familia inmigrante encuentre orientación confiable sin barreras.",
    stat1Val: "45 Años",
    stat1Lbl: "De servicio ininterrumpido en L.A.",
    stat2Val: "24/7 Acceso",
    stat2Lbl: "Orientación digital segura",
    polaroids: [
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Una comunidad más fuerte con oportunidades",
        sub: "ARCHIVO 2026 • PRESENTE Y FUTURO",
      },
      {
        img: "/assets/provisional-documentary-macarthur-park.jpg",
        caption: "Atención híbrida presencial y digital",
        sub: "ARCHIVO 2026 • INNOVACIÓN SOCIAL",
      },
      {
        img: "/assets/provisional-documentary-la-placita.jpg",
        caption: "Cuatro décadas caminando junto al migrante",
        sub: "EXPEDIENTE #500 • EL RESCATE",
      },
    ],
  },
];

const PLANET_RADIUS = 10.5;
const WHEEL_RADIUS = 0.28;

/**
 * Subcomponente 3D: Esfera del Terreno Low-Poly + Camino de Tierra + Árboles y Flores
 * Rota sobre su eje cuando el usuario navega entre fechas.
 */
function LowPolyPlanet({ planetPivotRef }) {
  const { planetGeometry, roadGeometry, treesData, flowersData } = useMemo(() => {
    const pGeom = new THREE.IcosahedronGeometry(PLANET_RADIUS, 5);
    const pos = pGeom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      if (Math.abs(v.x) < 1.32) {
        v.normalize().multiplyScalar(PLANET_RADIUS - 0.02);
      } else {
        const noise =
          0.18 * Math.sin(v.x * 0.8 + v.y * 0.6) +
          0.14 * Math.cos(v.z * 0.7 - v.x * 0.5);
        v.normalize().multiplyScalar(PLANET_RADIUS + Math.max(0, noise));
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pGeom.computeVertexNormals();

    const rGeom = new THREE.CylinderGeometry(
      PLANET_RADIUS + 0.025,
      PLANET_RADIUS + 0.025,
      2.15,
      96,
      4,
      true
    );
    rGeom.rotateZ(Math.PI / 2);
    const rPos = rGeom.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      v.fromBufferAttribute(rPos, i);
      const angle = Math.atan2(v.z, v.y);
      v.x += 0.26 * Math.sin(angle * 4.0);
      v.normalize().multiplyScalar(PLANET_RADIUS + 0.022);
      rPos.setXYZ(i, v.x, v.y, v.z);
    }
    rGeom.computeVertexNormals();

    const trees = [];
    for (let i = 0; i < 72; i++) {
      const theta = (i / 72) * Math.PI * 2;
      const side = i % 2 === 0 ? -1 : 1;
      const latX = side * (1.6 + ((i * 37) % 100) / 100 * 3.8);
      const waveX = 0.26 * Math.sin(theta * 4.0);
      const position = new THREE.Vector3(
        waveX + latX,
        PLANET_RADIUS * Math.cos(theta),
        PLANET_RADIUS * Math.sin(theta)
      )
        .normalize()
        .multiplyScalar(PLANET_RADIUS);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize()
      );
      const scale = 0.6 + ((i * 19) % 100) / 100 * 0.5;
      trees.push({ position, quaternion, scale, variant: i % 2 });
    }

    const flowers = [];
    const palette = ["#E8A04A", "#FFFFFF", "#245B87"];
    for (let i = 0; i < 180; i++) {
      const theta = (i / 180) * Math.PI * 2;
      const side = i % 2 === 0 ? -1 : 1;
      const latX = side * (1.32 + ((i * 53) % 100) / 100 * 4.0);
      const waveX = 0.26 * Math.sin(theta * 4.0);
      const position = new THREE.Vector3(
        waveX + latX,
        PLANET_RADIUS * Math.cos(theta),
        PLANET_RADIUS * Math.sin(theta)
      )
        .normalize()
        .multiplyScalar(PLANET_RADIUS);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize()
      );
      flowers.push({ position, quaternion, color: palette[i % 3] });
    }

    return { planetGeometry: pGeom, roadGeometry: rGeom, treesData: trees, flowersData: flowers };
  }, []);

  return (
    <group ref={planetPivotRef} position={[0, -PLANET_RADIUS, 0]}>
      <mesh geometry={planetGeometry} receiveShadow>
        <meshStandardMaterial color="#35823B" roughness={0.78} flatShading />
      </mesh>
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color="#8F653E" roughness={0.9} flatShading />
      </mesh>

      {treesData.map((t, idx) => (
        <group key={idx} position={t.position} quaternion={t.quaternion} scale={t.scale}>
          <mesh position={[0, 0.21, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 0.42, 6]} />
            <meshStandardMaterial color="#5C3A21" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.62, 0]} castShadow>
            <coneGeometry args={[0.42, 0.65, 7]} />
            <meshStandardMaterial
              color={t.variant === 0 ? "#24692C" : "#43993E"}
              roughness={0.72}
              flatShading
            />
          </mesh>
          <mesh position={[0, 0.98, 0]} castShadow>
            <coneGeometry args={[0.3, 0.5, 7]} />
            <meshStandardMaterial color="#43993E" roughness={0.68} flatShading />
          </mesh>
        </group>
      ))}

      {flowersData.map((f, idx) => (
        <group key={idx} position={f.position} quaternion={f.quaternion}>
          <mesh position={[0, 0.11, 0]}>
            <coneGeometry args={[0.055, 0.22, 4]} />
            <meshStandardMaterial color="#499E45" flatShading />
          </mesh>
          <mesh position={[0, 0.22, 0]} scale={[1.2, 0.65, 1.2]}>
            <octahedronGeometry args={[0.085, 0]} />
            <meshStandardMaterial color={f.color} roughness={0.45} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Subcomponente 3D: Autobús de Transporte Comunitario (Azul Marino #173B63, Blanco #F7F6F2 y Dorado #E8A04A)
 * Incluye rebote sutil de motor en el chasis y rotación sincronizada de las 4 ruedas.
 */
function CommunityBus({ busChassisRef, wheelsRef }) {
  const wheelPositions = [
    [-0.64, 0.28, -0.86],
    [0.64, 0.28, -0.86],
    [-0.64, 0.28, 0.86],
    [0.64, 0.28, 0.86],
  ];

  return (
    <group position={[0, 0.04, 0]}>
      <group ref={busChassisRef}>
        {/* Cuerpo inferior Azul Marino (#173B63) */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.28, 0.56, 2.75]} />
          <meshPhysicalMaterial color="#173B63" roughness={0.22} metalness={0.32} clearcoat={0.9} />
        </mesh>

        {/* Cabina superior Blanca (#F7F6F2) */}
        <mesh position={[0, 1.04, -0.02]} castShadow>
          <boxGeometry args={[1.22, 0.52, 2.62]} />
          <meshPhysicalMaterial color="#F7F6F2" roughness={0.25} clearcoat={0.85} />
        </mesh>

        {/* Franja Cinturón Dorada (#E8A04A) */}
        <mesh position={[0, 0.79, 0]}>
          <boxGeometry args={[1.31, 0.075, 2.79]} />
          <meshStandardMaterial color="#E09C3E" roughness={0.28} metalness={0.82} />
        </mesh>

        {/* Parachoques Dorados */}
        <mesh position={[0, 0.28, 1.4]}>
          <boxGeometry args={[1.36, 0.12, 0.14]} />
          <meshStandardMaterial color="#E09C3E" roughness={0.28} metalness={0.82} />
        </mesh>
        <mesh position={[0, 0.28, -1.4]}>
          <boxGeometry args={[1.36, 0.12, 0.14]} />
          <meshStandardMaterial color="#E09C3E" roughness={0.28} metalness={0.82} />
        </mesh>

        {/* Parabrisas y Ventanas Laterales */}
        <mesh position={[0, 1.05, 1.28]}>
          <boxGeometry args={[1.08, 0.36, 0.08]} />
          <meshPhysicalMaterial color="#1E4B7A" roughness={0.1} metalness={0.22} clearcoat={1.0} />
        </mesh>
        {[-0.9, -0.32, 0.26, 0.84].map((wz, i) => (
          <mesh key={i} position={[0, 1.05, wz]}>
            <boxGeometry args={[1.25, 0.33, 0.44]} />
            <meshPhysicalMaterial color="#1E4B7A" roughness={0.1} metalness={0.22} clearcoat={1.0} />
          </mesh>
        ))}
      </group>

      {/* 4 Ruedas sincronizadas con la rotación del planeta */}
      {wheelPositions.map((pos, idx) => (
        <group
          key={idx}
          position={pos}
          ref={(el) => {
            wheelsRef.current[idx] = el;
          }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.2, 24]} />
            <meshStandardMaterial color="#18202C" roughness={0.82} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.22, 16]} />
            <meshStandardMaterial color="#E09C3E" roughness={0.28} metalness={0.82} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.23, 0.04, 0.24]} />
            <meshStandardMaterial color="#F7F6F2" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Escena 3D Orquestada: conecta el bucle useFrame con el estado GSAP
 */
function TimelineSceneContent({ activeYear, motionStateRef, yearPivotRef, busChassisRef }) {
  const planetPivotRef = useRef();
  const wheelsRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const state = motionStateRef.current;
    const deltaAngle = state.planetAngle - state.lastPlanetAngle;
    state.lastPlanetAngle = state.planetAngle;

    if (planetPivotRef.current) {
      planetPivotRef.current.rotation.x = -state.planetAngle;
    }

    const wheelDelta = deltaAngle * (PLANET_RADIUS / WHEEL_RADIUS);
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x += wheelDelta;
    });

    if (busChassisRef.current) {
      const idleAmp = 0.014 + state.busSpeedBoost * 0.022;
      const idleFreq = 7.2 + state.busSpeedBoost * 6.0;
      busChassisRef.current.position.y = Math.sin(t * idleFreq) * idleAmp;
      busChassisRef.current.rotation.z = Math.cos(t * (idleFreq * 0.5)) * 0.006;
    }

    if (yearPivotRef.current) {
      yearPivotRef.current.rotation.y = Math.sin(t * 1.4) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.88} color="#EAF1F6" />
      <hemisphereLight args={["#FFF9EE", "#173B63", 0.55]} />
      <directionalLight position={[5.5, 9.5, 6.5]} intensity={1.45} color="#FFF3DC" castShadow />

      <group rotation={[0, Math.PI * 0.38, 0]}>
        <LowPolyPlanet planetPivotRef={planetPivotRef} />
        <CommunityBus busChassisRef={busChassisRef} wheelsRef={wheelsRef} />
      </group>

      {/* Fecha Flotante 3D en Dorado Mate encima del techo del autobús */}
      <group ref={yearPivotRef} position={[0, 1.66, 0]}>
        <Center>
          <Text3D
            font="/fonts/CormorantGaramond_Bold.json"
            size={0.68}
            height={0.14}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
          >
            {activeYear}
            <meshStandardMaterial color="#E5A140" roughness={0.44} metalness={0.65} />
          </Text3D>
        </Center>
      </group>
    </>
  );
}

export default function ElRescateTimelineHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const isTransitioningRef = useRef(false);

  const motionStateRef = useRef({
    planetAngle: 0,
    lastPlanetAngle: 0,
    busSpeedBoost: 0,
  });

  const yearPivotRef = useRef();
  const busChassisRef = useRef();
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();

  const navigateTimeline = (direction) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIdx = (currentIndex + direction + TIMELINE_MILESTONES.length) % TIMELINE_MILESTONES.length;
    setCurrentIndex(nextIdx);

    const stepAngle = (Math.PI * 2) / TIMELINE_MILESTONES.length;
    const targetAngle = motionStateRef.current.planetAngle + direction * stepAngle;

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
      },
    });

    tl.to(
      [leftPanelRef.current, rightPanelRef.current],
      {
        scale: 0.95,
        y: 12,
        autoAlpha: 0,
        filter: "blur(2px)",
        duration: 0.24,
        ease: "power2.out",
        stagger: 0.03,
      },
      0
    );

    if (yearPivotRef.current) {
      tl.to(yearPivotRef.current.scale, { x: 0.88, y: 0.88, z: 0.88, duration: 0.24, ease: "power2.out" }, 0);
      tl.to(yearPivotRef.current.position, { y: 1.92, duration: 0.24, ease: "power2.out" }, 0);
    }

    tl.to(
      motionStateRef.current,
      {
        planetAngle: targetAngle,
        duration: 1.28,
        ease: "power3.inOut",
      },
      0
    );

    tl.add(() => {
      setDisplayedIndex(nextIdx);
    }, 0.86);

    if (yearPivotRef.current) {
      tl.to(yearPivotRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.42, ease: "back.out(1.8)" }, 0.88);
      tl.to(yearPivotRef.current.position, { y: 1.66, duration: 0.42, ease: "power3.out" }, 0.88);
    }

    tl.fromTo(
      [leftPanelRef.current, rightPanelRef.current],
      { scale: 0.95, y: 14, autoAlpha: 0, filter: "blur(2px)" },
      {
        scale: 1,
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.38,
        ease: "cubic-bezier(0.23, 1, 0.32, 1)",
        stagger: 0.055,
      },
      0.9
    );
  };

  const activeData = TIMELINE_MILESTONES[displayedIndex];

  return (
    <section className="timeline-hero">
      <div id="timeline-canvas-wrap">
        <Canvas shadows camera={{ position: [0, 2.05, 8.35], fov: 34 }}>
          <TimelineSceneContent
            activeYear={activeData.year}
            motionStateRef={motionStateRef}
            yearPivotRef={yearPivotRef}
            busChassisRef={busChassisRef}
          />
        </Canvas>
      </div>

      {/* Header Fijo en Pantalla */}
      <header className="hero-header">
        <h1 className="hero-header__title">EL RESCATE</h1>
        <p className="hero-header__subtitle">IMMIGRATION, COMMUNITY &amp; LEGAL SERVICES</p>
      </header>

      {/* Botones Circulares de Navegación */}
      <button type="button" className="nav-arrow-btn nav-arrow-btn--prev" onClick={() => navigateTimeline(-1)}>
        ←
      </button>
      <button type="button" className="nav-arrow-btn nav-arrow-btn--next" onClick={() => navigateTimeline(1)}>
        →
      </button>

      {/* Paneles Flotantes: Polaroids (Izquierda) y Portapapeles Legal (Derecha) */}
      <div className="hero-stage">
        <aside ref={leftPanelRef} className="floating-panel polaroid-gallery">
          <div className="polaroid-stack">
            {activeData.polaroids.map((p, idx) => (
              <figure key={idx} className="polaroid-card">
                <div className="polaroid-card__photo-wrap">
                  <img className="polaroid-card__photo" src={p.img} alt={p.caption} />
                </div>
                <figcaption className="polaroid-card__caption">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </aside>

        <div className="center-bus-corridor" />

        <article ref={rightPanelRef} className="floating-panel legal-clipboard">
          <div className="legal-clipboard__sheet">
            <h2 className="legal-clipboard__title">{activeData.title}</h2>
            <p className="legal-clipboard__desc">{activeData.description}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
