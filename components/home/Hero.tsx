"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair', // This creates a CSS variable
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  abbr: string;
  label: string;
}

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  originalY: number;
  phase: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  { abbr: "SEO", label: "Search Engine Optimization" },
  { abbr: "SMM", label: "Social Media Marketing" },
  { abbr: "PPC", label: "Performance Marketing" },
  { abbr: "CM",  label: "Content Marketing" },
  { abbr: "WD",  label: "Web Design & Dev" },
  { abbr: "EM",  label: "E-mail Marketing" },
  { abbr: "BS",  label: "Branding Strategy" },
  { abbr: "CRO", label: "Conversion Rate Optimization" },
  { abbr: "DRM", label: "Reputation Management" },
];

const C = {
  crimson : "#B9375D",
  rose    : "#D25D5D",
  blush   : "#E7D3D3",
  white   : "#EEEEEE",
  ink     : "#1a0a0f",
};

// ─── Three.js Scene ───────────────────────────────────────────────────────────
function useThreeScene(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 7);

    // ── Lights ──────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xfff0f4, 0.6);
    scene.add(ambient);

    const crimsonLight = new THREE.PointLight(0xb9375d, 2.5, 30);
    crimsonLight.position.set(-4, 3, 4);
    scene.add(crimsonLight);

    const roseLight = new THREE.PointLight(0xd25d5d, 1.8, 25);
    roseLight.position.set(5, -2, 3);
    scene.add(roseLight);

    const rimLight = new THREE.DirectionalLight(0xffe8ec, 0.4);
    rimLight.position.set(0, 8, -5);
    scene.add(rimLight);

    // ── Central sculpture: layered icosahedra ────────────────────
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Outer wireframe shell
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xb9375d,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const outerShell = new THREE.Mesh(outerGeo, outerMat);
    sculptureGroup.add(outerShell);

    // Mid solid shell
    const midGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const midMat = new THREE.MeshPhongMaterial({
      color: 0xf5e8ea,
      emissive: 0xb9375d,
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0.55,
      shininess: 120,
      side: THREE.DoubleSide,
    });
    const midShell = new THREE.Mesh(midGeo, midMat);
    sculptureGroup.add(midShell);

    // Inner bright core
    const coreGeo = new THREE.IcosahedronGeometry(0.72, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xfff0f2,
      emissive: 0xd25d5d,
      emissiveIntensity: 0.25,
      shininess: 200,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    sculptureGroup.add(core);

    // Innermost glowing orb
    const orbGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const orbMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xb9375d,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    sculptureGroup.add(orb);

    // ── Orbital rings ────────────────────────────────────────────
    const rings: THREE.Mesh[] = [];
    const ringConfigs = [
      { radius: 2.4, tube: 0.008, color: 0xb9375d, opacity: 0.4, tiltX: 0.4, tiltZ: 0.2 },
      { radius: 2.9, tube: 0.006, color: 0xd25d5d, opacity: 0.25, tiltX: -0.6, tiltZ: 0.5 },
      { radius: 3.5, tube: 0.004, color: 0xe7d3d3, opacity: 0.18, tiltX: 1.1, tiltZ: -0.3 },
    ];
    ringConfigs.forEach(({ radius, tube, color, opacity, tiltX, tiltZ }) => {
      const geo = new THREE.TorusGeometry(radius, tube, 8, 160);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = tiltX;
      ring.rotation.z = tiltZ;
      rings.push(ring);
      scene.add(ring);
    });

    // ── Floating particles ───────────────────────────────────────
    const particles: Particle[] = [];
    const particleGeos = [
      new THREE.OctahedronGeometry(0.055, 0),
      new THREE.TetrahedronGeometry(0.065, 0),
      new THREE.BoxGeometry(0.07, 0.07, 0.07),
      new THREE.IcosahedronGeometry(0.05, 0),
    ];
    const particleMats = [
      new THREE.MeshPhongMaterial({ color: 0xb9375d, transparent: true, opacity: 0.7, shininess: 100 }),
      new THREE.MeshPhongMaterial({ color: 0xd25d5d, transparent: true, opacity: 0.5, shininess: 80  }),
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.35 }),
      new THREE.MeshPhongMaterial({ color: 0xe7d3d3, transparent: true, opacity: 0.45, shininess: 60  }),
    ];

    for (let i = 0; i < 55; i++) {
      const geo = particleGeos[i % particleGeos.length];
      const mat = particleMats[i % particleMats.length];
      const mesh = new THREE.Mesh(geo, mat);

      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const r     = 2.8 + Math.random() * 4.5;

      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 9,
        r * Math.sin(phi) * Math.sin(theta) - 2
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const s = 0.5 + Math.random() * 1.0;
      mesh.scale.setScalar(s);

      particles.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.0015,
        vz: (Math.random() - 0.5) * 0.001,
        rx: (Math.random() - 0.5) * 0.007,
        ry: (Math.random() - 0.5) * 0.009,
        originalY: mesh.position.y,
        phase: Math.random() * Math.PI * 2,
      });
      scene.add(mesh);
    }

    // ── Background dot field ─────────────────────────────────────
    const dotCount = 280;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      dotPositions[i * 3]     = (Math.random() - 0.5) * 30;
      dotPositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      dotPositions[i * 3 + 2] = -5 - Math.random() * 8;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0xb9375d,
      size: 0.038,
      transparent: true,
      opacity: 0.18,
    });
    scene.add(new THREE.Points(dotGeo, dotMat));

    // ── Line connectors (sparse web) ─────────────────────────────
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xb9375d,
      transparent: true,
      opacity: 0.07,
    });
    for (let i = 0; i < 18; i++) {
      const points = [
        new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, -3),
        new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, -3),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      lineGroup.add(new THREE.Line(lineGeo, lineMat));
    }

    // ── Mouse parallax ───────────────────────────────────────────
    const mouse  = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation loop ───────────────────────────────────────────
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.008;

      // Smooth mouse follow
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;

      // Sculpture rotation
      sculptureGroup.rotation.y  = t * 0.22 + target.x * 0.18;
      sculptureGroup.rotation.x  = Math.sin(t * 0.15) * 0.12 + target.y * 0.10;
      outerShell.rotation.x      = t * 0.08;
      outerShell.rotation.z      = t * 0.05;
      midShell.rotation.y        = -t * 0.14;
      midShell.rotation.z        = Math.sin(t * 0.2) * 0.04;
      core.rotation.x            = t * 0.28;
      core.rotation.z            = -t * 0.18;
      orb.position.x             = Math.sin(t * 0.9) * 0.08;
      orb.position.y             = Math.cos(t * 0.7) * 0.06;

      // Light pulsing
      crimsonLight.intensity  = 2.2 + Math.sin(t * 1.1) * 0.5;
      roseLight.intensity     = 1.6 + Math.cos(t * 0.9) * 0.4;

      // Rings counter-rotation
      rings[0].rotation.z += 0.004;
      rings[1].rotation.z -= 0.003;
      rings[2].rotation.y += 0.002;
      rings[0].rotation.x = ringConfigs[0].tiltX + target.y * 0.06;
      rings[1].rotation.x = ringConfigs[1].tiltX - target.y * 0.04;

      // Particles float
      particles.forEach((p, i) => {
        p.mesh.rotation.x += p.rx;
        p.mesh.rotation.y += p.ry;
        p.mesh.position.x += p.vx;
        p.mesh.position.y  = p.originalY + Math.sin(t * 0.4 + p.phase) * 0.35;
        p.mesh.position.z += p.vz;

        if (Math.abs(p.mesh.position.x) > 8) p.vx *= -1;
        if (Math.abs(p.mesh.position.z) > 5) p.vz *= -1;
      });

      // Camera gentle drift
      camera.position.x += (target.x * 0.5 - camera.position.x) * 0.025;
      camera.position.y += (-target.y * 0.3 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      // Sculpture Z bob
      sculptureGroup.position.y = Math.sin(t * 0.3) * 0.08;
      sculptureGroup.position.x = target.x * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  value, suffix, label, delay, started,
}: {
  value: number; suffix: string; label: string; delay: number; started: boolean;
}) {
  const count = useCountUp(value, 1600, started);
  return (
    <div
      style={{
        display        : "flex",
        flexDirection  : "column",
        alignItems     : "center",
        gap            : "4px",
        animation      : `fadeSlideUp 0.7s ease ${delay}s both`,
        padding        : "0 20px",
        borderRight    : "1px solid rgba(185,55,93,0.15)",
      }}
    >
      <span
        style={{
          fontFamily : "'Playfair Display', serif",
          fontSize   : "clamp(26px, 3.5vw, 38px)",
          fontWeight : 700,
          color      : C.crimson,
          lineHeight : 1,
          letterSpacing: "-1px",
        }}
      >
        {count}{suffix}
      </span>
      <span
        style={{
          fontFamily  : "'DM Sans', sans-serif",
          fontSize    : "10px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color       : "rgba(26,10,15,0.42)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Service pill ticker ───────────────────────────────────────────────────────
function ServiceTicker() {
  const doubled = [...SERVICES, ...SERVICES];
  return (
    <div
      style={{
        overflow : "hidden",
        width    : "100%",
        maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        style={{
          display       : "flex",
          gap           : "10px",
          animation     : "tickerScroll 28s linear infinite",
          width         : "max-content",
        }}
      >
        {doubled.map((s, i) => (
          <div
            key={i}
            style={{
              display      : "flex",
              alignItems   : "center",
              gap          : "7px",
              padding      : "7px 16px",
              background   : i % 3 === 0
                ? "rgba(185,55,93,0.08)"
                : "rgba(185,55,93,0.03)",
              border       : "1px solid rgba(185,55,93,0.14)",
              borderRadius : "1px",
              whiteSpace   : "nowrap",
            }}
          >
            <span
              style={{
                fontFamily  : "'Cormorant Garamond', serif",
                fontSize    : "9px",
                letterSpacing: "3px",
                color       : C.crimson,
                textTransform: "uppercase",
                fontWeight  : 600,
              }}
            >
              {s.abbr}
            </span>
            <span
              style={{
                fontFamily  : "'DM Sans', sans-serif",
                fontSize    : "11px",
                color       : "rgba(26,10,15,0.5)",
                letterSpacing: "0.5px",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Hero Component ───────────────────────────────────────────────────────
export default function HeroSection() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [mounted, setMounted]           = useState(false);

  useThreeScene(mountRef);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsStarted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── Global styles ──────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.white}; overflow-x: hidden; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rotateSlowReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1);   opacity: 0.7; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0);   opacity: 0.4; }
          50%       { transform: translateY(5px); opacity: 0.9; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .hero-cta-primary {
          font-family    : 'DM Sans', sans-serif;
          font-size      : 11px;
          letter-spacing : 2.5px;
          text-transform : uppercase;
          color          : ${C.white};
          background     : linear-gradient(135deg, ${C.crimson} 0%, ${C.rose} 100%);
          border         : none;
          padding        : 15px 34px;
          cursor         : pointer;
          border-radius  : 1px;
          transition     : transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease;
          position       : relative;
          overflow       : hidden;
          display        : inline-block;
          text-decoration: none;
        }
        .hero-cta-primary::after {
          content    : '';
          position   : absolute;
          inset      : 0;
          background : linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          background-size: 200% auto;
          opacity    : 0;
          transition : opacity 0.3s;
        }
        .hero-cta-primary:hover {
          transform  : translateY(-2px);
          box-shadow : 0 8px 28px rgba(185,55,93,0.32);
        }
        .hero-cta-primary:hover::after { opacity: 1; animation: shimmer 1.2s linear; }

        .hero-cta-secondary {
          font-family    : 'DM Sans', sans-serif;
          font-size      : 11px;
          letter-spacing : 2.5px;
          text-transform : uppercase;
          color          : ${C.crimson};
          background     : transparent;
          border         : 1px solid rgba(185,55,93,0.3);
          padding        : 14px 34px;
          cursor         : pointer;
          border-radius  : 1px;
          transition     : all 0.25s ease;
          display        : inline-block;
          text-decoration: none;
        }
        .hero-cta-secondary:hover {
          border-color: ${C.crimson};
          background  : rgba(185,55,93,0.05);
          transform   : translateY(-2px);
        }

        .service-badge {
          font-family    : 'Cormorant Garamond', serif;
          font-size      : 9px;
          letter-spacing : 3px;
          text-transform : uppercase;
          color          : ${C.crimson};
          background     : rgba(185,55,93,0.07);
          border         : 1px solid rgba(185,55,93,0.18);
          padding        : 4px 10px;
          border-radius  : 1px;
          transition     : all 0.2s;
          white-space    : nowrap;
        }
        .service-badge:hover {
          background  : rgba(185,55,93,0.13);
          border-color: rgba(185,55,93,0.4);
          color       : ${C.crimson};
        }
      `}</style>

      {/* ── Section wrapper ────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          position   : "relative",
          width      : "100%",
          minHeight  : "100vh",
          background : C.white,
          overflow   : "hidden",
          display    : "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Three.js canvas ─────────────────────────────────── */}
        <div
          ref={mountRef}
          style={{
            position     : "absolute",
            inset        : 0,
            zIndex       : 0,
            pointerEvents: "none",
          }}
        />

        {/* ── Radial vignette overlay ──────────────────────────── */}
        <div
          style={{
            position     : "absolute",
            inset        : 0,
            zIndex       : 1,
            background   : `radial-gradient(ellipse 70% 65% at 65% 50%, transparent 0%, ${C.white}88 70%, ${C.white} 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Subtle grid texture ──────────────────────────────── */}
        <div
          style={{
            position     : "absolute",
            inset        : 0,
            zIndex       : 1,
            backgroundImage: `
              linear-gradient(rgba(185,55,93,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(185,55,93,0.04) 1px, transparent 1px)
            `,
            backgroundSize : "60px 60px",
            pointerEvents  : "none",
            maskImage      : "radial-gradient(ellipse 80% 80% at 30% 50%, black 30%, transparent 80%)",
          }}
        />

        {/* ── Main content ─────────────────────────────────────── */}
        <div
          style={{
            position       : "relative",
            zIndex         : 2,
            flex           : 1,
            display        : "flex",
            alignItems     : "center",
            maxWidth       : "1320px",
            width          : "100%",
            margin         : "0 auto",
            padding        : "120px 48px 80px",
            gap            : "40px",
          }}
        >
          {/* ── LEFT: text content ──────────────────────────── */}
          <div
            style={{
              flex           : "1 1 0",
              display        : "flex",
              flexDirection  : "column",
              gap            : "0px",
              maxWidth       : "620px",
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display      : "flex",
                alignItems   : "center",
                gap          : "12px",
                marginBottom : "24px",
                animation    : mounted ? "fadeSlideUp 0.7s ease 0.1s both" : "none",
              }}
            >
              <div
                style={{
                  width        : "6px",
                  height       : "6px",
                  borderRadius : "50%",
                  background   : C.crimson,
                  animation    : "pulseDot 2s ease infinite",
                }}
              />
              <span
                style={{
                  fontFamily   : "'Cormorant Garamond', serif",
                  fontSize     : "11px",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  color        : C.crimson,
                  fontStyle    : "italic",
                }}
              >
                NoirSeven Digital & Software Solution
              </span>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontFamily   : "'Playfair Display', serif",
                fontSize     : "clamp(40px, 5.5vw, 72px)",
                fontWeight   : 700,
                color        : C.ink,
                lineHeight   : 1.06,
                letterSpacing: "-1.5px",
                margin       : "0 0 0",
                animation    : mounted ? "fadeSlideUp 0.75s ease 0.2s both" : "none",
              }}
            >
              Content Marketing
            </h1>
            <h1
              style={{
                fontFamily   : "'Playfair Display', serif",
                fontSize     : "clamp(40px, 5.5vw, 72px)",
                fontWeight   : 700,
                lineHeight   : 1.06,
                letterSpacing: "-1.5px",
                margin       : "0 0 0",
                animation    : mounted ? "fadeSlideUp 0.75s ease 0.28s both" : "none",
                background   : `linear-gradient(135deg, ${C.crimson} 0%, ${C.rose} 50%, #c04060 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor : "transparent",
                backgroundClip: "text",
              }}
            >
              Solutions That
            </h1>
            <h1
              style={{
                fontFamily   : "'Playfair Display', serif",
                fontSize     : "clamp(40px, 5.5vw, 72px)",
                fontWeight   : 400,
                fontStyle    : "italic",
                color        : C.ink,
                lineHeight   : 1.06,
                letterSpacing: "-1px",
                margin       : "0 0 28px",
                animation    : mounted ? "fadeSlideUp 0.75s ease 0.36s both" : "none",
              }}
            >
              Drive Real Growth.
            </h1>

            {/* Divider */}
            <div
              style={{
                width      : "56px",
                height     : "1.5px",
                background : `linear-gradient(90deg, ${C.crimson}, transparent)`,
                marginBottom: "24px",
                animation  : mounted ? "fadeSlideUp 0.7s ease 0.44s both" : "none",
              }}
            />

            {/* Sub-copy */}
            <p
              style={{
                fontFamily   : "'DM Sans', sans-serif",
                fontSize     : "clamp(14px, 1.5vw, 16.5px)",
                color        : "rgba(26,10,15,0.58)",
                lineHeight   : 1.82,
                margin       : "0 0 14px",
                maxWidth     : "520px",
                animation    : mounted ? "fadeSlideUp 0.7s ease 0.52s both" : "none",
              }}
            >
              At NoirSevenDigitalSolution, we don&apos;t just create content —
              we build authority. Our focused digital marketing services are
              designed to align with your specific business needs, delivering
              clarity and measurable impact.
            </p>

            <p
              style={{
                fontFamily   : "'Cormorant Garamond', serif",
                fontSize     : "clamp(14px, 1.4vw, 17px)",
                fontStyle    : "italic",
                color        : "rgba(26,10,15,0.4)",
                lineHeight   : 1.75,
                margin       : "0 0 40px",
                animation    : mounted ? "fadeSlideUp 0.7s ease 0.58s both" : "none",
              }}
            >
              Strategy · Precision · Authority · Growth
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display  : "flex",
                gap      : "14px",
                flexWrap : "wrap",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.66s both" : "none",
              }}
            >
              <a href="/services" className="hero-cta-primary">
                Explore Services
              </a>
              <a href="/contact" className="hero-cta-secondary">
                Let&apos;s Talk
              </a>
            </div>

            {/* Stats row */}
            <div
              style={{
                display      : "flex",
                alignItems   : "center",
                gap          : "0",
                marginTop    : "52px",
                paddingTop   : "32px",
                borderTop    : "1px solid rgba(185,55,93,0.1)",
                animation    : mounted ? "fadeSlideUp 0.7s ease 0.74s both" : "none",
              }}
            >
              <StatCard value={9}   suffix="+"  label="Core Services"     delay={0.8}  started={statsStarted} />
              <StatCard value={100} suffix="%"  label="Strategy-Driven"   delay={0.88} started={statsStarted} />
              <StatCard value={360} suffix="°"  label="Digital Coverage"  delay={0.96} started={statsStarted} />
              <div
                style={{
                  display      : "flex",
                  flexDirection: "column",
                  alignItems   : "center",
                  gap          : "4px",
                  padding      : "0 20px",
                }}
              >
                <span
                  style={{
                    fontFamily   : "'Cormorant Garamond', serif",
                    fontSize     : "clamp(20px, 2.5vw, 30px)",
                    fontWeight   : 600,
                    fontStyle    : "italic",
                    color        : C.crimson,
                    lineHeight   : 1,
                  }}
                >
                  Jaipur
                </span>
                <span
                  style={{
                    fontFamily   : "'DM Sans', sans-serif",
                    fontSize     : "10px",
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color        : "rgba(26,10,15,0.42)",
                  }}
                >
                  Based In
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: decorative UI panel ───────────────────── */}
          <div
            style={{
              flex           : "0 0 auto",
              width          : "clamp(260px, 28vw, 380px)",
              display        : "flex",
              flexDirection  : "column",
              gap            : "12px",
              animation      : mounted ? "fadeIn 1.2s ease 0.5s both" : "none",
            }}
          >
            {/* Rotating ring decoration */}
            <div
              style={{
                position      : "relative",
                width         : "100%",
                aspectRatio   : "1",
                display       : "flex",
                alignItems    : "center",
                justifyContent: "center",
                marginBottom  : "-20px",
              }}
            >
              {/* Outer dashed ring */}
              <div
                style={{
                  position     : "absolute",
                  inset        : "0",
                  borderRadius : "50%",
                  border       : `1px dashed rgba(185,55,93,0.2)`,
                  animation    : "rotateSlow 28s linear infinite",
                }}
              />
              {/* Mid solid ring */}
              <div
                style={{
                  position     : "absolute",
                  inset        : "12%",
                  borderRadius : "50%",
                  border       : `1px solid rgba(185,55,93,0.12)`,
                  animation    : "rotateSlowReverse 20s linear infinite",
                }}
              />
              {/* Inner ring */}
              <div
                style={{
                  position     : "absolute",
                  inset        : "26%",
                  borderRadius : "50%",
                  border       : `1px solid rgba(185,55,93,0.08)`,
                  animation    : "rotateSlow 14s linear infinite",
                }}
              />

              {/* Service badges around ring */}
              {SERVICES.slice(0, 6).map((s, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const r     = 44; // % from center
                const x     = 50 + r * Math.cos(angle);
                const y     = 50 + r * Math.sin(angle);
                return (
                  <div
                    key={s.abbr}
                    className="service-badge"
                    style={{
                      position : "absolute",
                      left     : `${x}%`,
                      top      : `${y}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex   : 2,
                    }}
                  >
                    {s.abbr}
                  </div>
                );
              })}

              {/* Center label */}
              <div
                style={{
                  display      : "flex",
                  flexDirection: "column",
                  alignItems   : "center",
                  gap          : "4px",
                  zIndex       : 3,
                  textAlign    : "center",
                }}
              >
                <span
                  style={{
                    fontFamily   : "'Playfair Display', serif",
                    fontSize     : "28px",
                    fontWeight   : 700,
                    color        : C.ink,
                    letterSpacing: "-0.5px",
                    lineHeight   : 1,
                  }}
                >
                  Noir
                </span>
                <span
                  style={{
                    fontFamily   : "'Playfair Display', serif",
                    fontSize     : "28px",
                    fontWeight   : 700,
                    background   : `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor : "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.5px",
                    lineHeight   : 1,
                  }}
                >
                  Seven
                </span>
                <span
                  style={{
                    fontFamily   : "'Cormorant Garamond', serif",
                    fontSize     : "9px",
                    letterSpacing: "3px",
                    color        : "rgba(26,10,15,0.35)",
                    textTransform: "uppercase",
                    marginTop    : "4px",
                  }}
                >
                  Digital
                </span>
              </div>
            </div>

            {/* Info card */}
            <div
              style={{
                background  : "rgba(238,238,238,0.7)",
                backdropFilter: "blur(12px)",
                border      : "1px solid rgba(185,55,93,0.12)",
                padding     : "20px 22px",
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  fontFamily   : "'Cormorant Garamond', serif",
                  fontSize     : "10px",
                  letterSpacing: "3.5px",
                  color        : C.crimson,
                  textTransform: "uppercase",
                  marginBottom : "10px",
                }}
              >
                LalKothi, Jaipur
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize  : "12.5px",
                  color     : "rgba(26,10,15,0.55)",
                  lineHeight: 1.7,
                  margin    : 0,
                }}
              >
                Custom digital marketing solutions crafted to align with your
                specific business needs — whether you&apos;re building presence,
                scaling your brand, or optimising content for long-term growth.
              </p>
            </div>
          </div>
        </div>

        {/* ── Service ticker strip ─────────────────────────────── */}
        <div
          style={{
            position  : "relative",
            zIndex    : 2,
            paddingBottom: "48px",
            animation : mounted ? "fadeIn 1s ease 1s both" : "none",
          }}
        >
          {/* Strip header */}
          <div
            style={{
              maxWidth    : "1320px",
              margin      : "0 auto 16px",
              padding     : "0 48px",
              display     : "flex",
              alignItems  : "center",
              gap         : "14px",
            }}
          >
            <div style={{ width: "30px", height: "1px", background: C.crimson, opacity: 0.5 }} />
            <span
              style={{
                fontFamily   : "'Cormorant Garamond', serif",
                fontSize     : "9px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color        : "rgba(26,10,15,0.35)",
              }}
            >
              Our Services
            </span>
          </div>
          <ServiceTicker />
        </div>

        {/* ── Scroll cue ───────────────────────────────────────── */}
        <div
          style={{
            position     : "absolute",
            bottom       : "56px",
            left         : "48px",
            zIndex       : 3,
            display      : "flex",
            flexDirection: "column",
            alignItems   : "center",
            gap          : "6px",
            animation    : mounted ? "fadeIn 1s ease 1.4s both" : "none",
          }}
        >
          <div
            style={{
              fontFamily   : "'Cormorant Garamond', serif",
              fontSize     : "9px",
              letterSpacing: "3.5px",
              textTransform: "uppercase",
              color        : "rgba(26,10,15,0.28)",
              writingMode  : "vertical-lr",
              transform    : "rotate(180deg)",
            }}
          >
            Scroll to explore
          </div>
          <div
            style={{
              width      : "1px",
              height     : "44px",
              background : `linear-gradient(${C.crimson}, transparent)`,
              animation  : "scrollBounce 2.2s ease infinite",
            }}
          />
        </div>

        {/* ── Location tag ─────────────────────────────────────── */}
        <div
          style={{
            position     : "absolute",
            bottom       : "64px",
            right        : "48px",
            zIndex       : 3,
            display      : "flex",
            alignItems   : "center",
            gap          : "8px",
            animation    : mounted ? "fadeIn 1s ease 1.5s both" : "none",
          }}
        >
          <div
            style={{
              width       : "5px",
              height      : "5px",
              borderRadius: "50%",
              background  : C.crimson,
              animation   : "pulseDot 2.5s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily   : "'Cormorant Garamond', serif",
              fontSize     : "11px",
              fontStyle    : "italic",
              letterSpacing: "1.5px",
              color        : "rgba(26,10,15,0.35)",
            }}
          >
            LalKothi, Jaipur, Rajasthan
          </span>
        </div>
      </section>
    </>
  );
}