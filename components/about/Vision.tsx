"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import * as THREE from "three";

// ─── Palette ──────────────────────────────────────────────────────
const C = {
  crimson : "#B9375D",
  rose    : "#D25D5D",
  blush   : "#E7D3D3",
  snow    : "#EEEEEE",
  ink     : "#1a0a0f",
};

// ─── Vision pillars ───────────────────────────────────────────────
const PILLARS = [
  { num: "01", title: "Structure",     body: "We bring order to the chaos of digital marketing — clear frameworks, defined KPIs, and processes built to scale." },
  { num: "02", title: "Accountability",body: "Every deliverable is tracked, every result is reported. Transparency is not a feature — it is our foundation." },
  { num: "03", title: "Performance",   body: "We build campaigns and software solutions that create measurable business outcomes, not just aesthetic presence." },
  { num: "04", title: "Partnership",   body: "We walk alongside companies as true growth partners, not vendors completing tasks. Your growth is our mission." },
];

// ─── Three.js for Vision section ─────────────────────────────────
function useVisionThree(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 8);

    scene.add(new THREE.AmbientLight(0xfff0f4, 0.45));
    const pl1 = new THREE.PointLight(0xb9375d, 2.4, 38);
    pl1.position.set(-5, 4, 5);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.6, 28);
    pl2.position.set(6, -3, 2);
    scene.add(pl2);

    // ── Central object: layered dodecahedron ──────────────────
    const group = new THREE.Group();
    scene.add(group);

    const outerGeo = new THREE.DodecahedronGeometry(2.2, 0);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.07 });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    group.add(outer);

    const midGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const midMat = new THREE.MeshPhongMaterial({
      color: 0xf8eaed, emissive: 0xb9375d, emissiveIntensity: 0.1,
      transparent: true, opacity: 0.45, shininess: 100, side: THREE.DoubleSide,
    });
    const mid = new THREE.Mesh(midGeo, midMat);
    group.add(mid);

    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xfff0f2, emissive: 0xd25d5d, emissiveIntensity: 0.3,
      shininess: 180, transparent: true, opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const orbGeo = new THREE.SphereGeometry(0.26, 32, 32);
    const orbMat = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xb9375d, emissiveIntensity: 1.3, transparent: true, opacity: 0.9 });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    group.add(orb);

    // 4 orbiting satellite nodes (for 4 pillars)
    const satNodes: THREE.Mesh[] = [];
    const satRings: THREE.Mesh[] = [];
    const satPositions = [
      new THREE.Vector3( 3.2,  1.2,  0),
      new THREE.Vector3(-3.2,  1.2,  0),
      new THREE.Vector3( 0,   -3.2,  0),
      new THREE.Vector3( 0,    3.2,  0),
    ];
    satPositions.forEach((pos, i) => {
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 0),
        new THREE.MeshPhongMaterial({ color: 0xb9375d, emissive: 0xb9375d, emissiveIntensity: 0.7, transparent: true, opacity: 0.8 })
      );
      node.position.copy(pos);
      scene.add(node);
      satNodes.push(node);

      // Line to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, new THREE.Vector3(0, 0, 0)]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.08 });
      scene.add(new THREE.Line(lineGeo, lineMat));

      // Small orbital ring around satellite
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.005, 6, 60),
        new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.25 })
      );
      ring.position.copy(pos);
      ring.rotation.x = Math.PI / 2 + i * 0.3;
      satRings.push(ring);
      scene.add(ring);
    });

    // Outer orbital ring
    const bigRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.007, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.14 })
    );
    bigRing.rotation.x = 0.4;
    scene.add(bigRing);

    // Floating particles
    const particles: { mesh: THREE.Mesh; rx: number; ry: number; vy: number; phase: number }[] = [];
    const pGeos = [
      new THREE.TetrahedronGeometry(0.08, 0),
      new THREE.OctahedronGeometry(0.07, 0),
      new THREE.IcosahedronGeometry(0.06, 0),
    ];
    const pMats = [
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.22 }),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.1 }),
    ];
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(pGeos[i % 3], pMats[i % 3]);
      mesh.position.set((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 10 - 3);
      mesh.scale.setScalar(0.5 + Math.random() * 1.3);
      particles.push({ mesh, rx: (Math.random() - 0.5) * 0.007, ry: (Math.random() - 0.5) * 0.009, vy: (Math.random() - 0.5) * 0.002, phase: Math.random() * Math.PI * 2 });
      scene.add(mesh);
    }

    // Dot field
    const dp = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) { dp[i * 3] = (Math.random() - 0.5) * 32; dp[i * 3 + 1] = (Math.random() - 0.5) * 28; dp[i * 3 + 2] = -8 - Math.random() * 6; }
    const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xb9375d, size: 0.028, transparent: true, opacity: 0.12 })));

    let mouse = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
    const onMM = (e: MouseEvent) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMM);

    let frame = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.007;
      tgt.x += (mouse.x - tgt.x) * 0.03;
      tgt.y += (mouse.y - tgt.y) * 0.03;

      group.rotation.y = t * 0.18 + tgt.x * 0.14;
      group.rotation.x = Math.sin(t * 0.14) * 0.1 + tgt.y * 0.08;
      outer.rotation.x = t * 0.06; outer.rotation.z = t * 0.04;
      mid.rotation.y   = -t * 0.12; mid.rotation.z = Math.sin(t * 0.2) * 0.03;
      core.rotation.x  = t * 0.24; core.rotation.z = -t * 0.16;
      orb.position.x   = Math.sin(t * 0.9) * 0.07;
      orb.position.y   = Math.cos(t * 0.7) * 0.06;

      bigRing.rotation.z += 0.003; bigRing.rotation.y += 0.001;

      satNodes.forEach((node, i) => {
        const s = 1 + Math.sin(t * 1.2 + i * 1.5) * 0.2;
        node.scale.setScalar(s);
        (node.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5 + Math.sin(t * 1.4 + i * 1.1) * 0.3;
        satRings[i].rotation.y += 0.006 * (i % 2 === 0 ? 1 : -1);
        satRings[i].rotation.z += 0.004 * (i % 2 === 0 ? -1 : 1);
      });

      pl1.intensity = 2.2 + Math.sin(t * 1.1) * 0.45;
      pl2.intensity = 1.4 + Math.cos(t * 0.9) * 0.35;
      particles.forEach(({ mesh, rx, ry, vy }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 11) mesh.position.y = -11;
        if (mesh.position.y < -11) mesh.position.y = 11;
      });
      camera.position.x += (tgt.x * 0.4 - camera.position.x) * 0.025;
      camera.position.y += (tgt.y * 0.25 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);
}

// ─── Pillar card ──────────────────────────────────────────────────
function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "36px 32px",
        border: hov ? "1px solid rgba(185,55,93,0.42)" : "1px solid rgba(185,55,93,0.1)",
        background: hov ? "rgba(185,55,93,0.04)" : "rgba(238,238,238,0.5)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.34s cubic-bezier(0.25,0.46,0.45,0.94)",
        animation: `fadeSlideUp 0.65s ease ${index * 0.09}s both`,
        cursor: "default",
        borderRadius: "2px",
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "11px", letterSpacing: "4px",
        color: "rgba(185,55,93,0.4)", marginBottom: "14px",
        fontStyle: "italic",
      }}>
        {pillar.num}
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "22px", fontWeight: 600,
        color: C.ink, margin: "0 0 14px",
        letterSpacing: "-0.3px",
      }}>
        {pillar.title}
      </h3>
      <div style={{
        width: hov ? "36px" : "20px", height: "1.5px",
        background: `linear-gradient(90deg, ${C.crimson}, transparent)`,
        marginBottom: "14px", transition: "width 0.35s ease",
      }} />
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13.5px", color: "rgba(26,10,15,0.55)",
        lineHeight: 1.78, margin: 0,
      }}>
        {pillar.body}
      </p>
      {/* Bottom accent */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: "2px", width: hov ? "100%" : "0%",
        background: `linear-gradient(90deg, ${C.crimson}, ${C.rose})`,
        transition: "width 0.45s ease",
      }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function VisionMissionFounder() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [imgParallax, setImgParallax] = useState({ x: 0, y: 0 });

  useVisionThree(mountRef);
  useEffect(() => { setMounted(true); }, []);

  // Subtle image parallax on mouse
  useEffect(() => {
    const onMM = (e: MouseEvent) => {
      setImgParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      });
    };
    window.addEventListener("mousemove", onMM);
    return () => window.removeEventListener("mousemove", onMM);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.snow}; overflow-x: hidden; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseDot { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.6); opacity: 1; } }
        @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(185,55,93,0.3); border-radius: 2px; }

        .cta-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
          color: ${C.snow};
          background: linear-gradient(135deg, ${C.crimson}, ${C.rose});
          border: none; padding: 15px 34px; border-radius: 1px;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: opacity 0.22s, transform 0.22s;
        }
        .cta-primary:hover { opacity: 0.85; transform: translateY(-2px); }

        .cta-secondary {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
          color: ${C.crimson};
          background: transparent;
          border: 1px solid rgba(185,55,93,0.28);
          padding: 14px 34px; border-radius: 1px;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: all 0.22s;
        }
        .cta-secondary:hover { background: rgba(185,55,93,0.06); border-color: ${C.crimson}; }
      `}</style>

      {/* ── Three.js canvas (fixed full bg) ──────────────────── */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Radial vignette */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(238,238,238,0.72) 72%, rgba(238,238,238,0.93) 100%)",
      }} />

      {/* Fine grid texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(185,55,93,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(185,55,93,0.03) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 60% 60% at 70% 40%, black 20%, transparent 70%)",
      }} />

      <main style={{ position: "relative" }}>

        {/* ════════════════════════════════════════════════════════
            SECTION 1 — VISION
        ════════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          maxWidth: "1320px", margin: "0 auto",
          padding: "140px 48px 100px",
        }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "26px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.1s both" : "none",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.crimson, animation: "pulseDot 2s ease infinite" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase", fontStyle: "italic" }}>
              Our Vision
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(50px, 7.5vw, 92px)",
              fontWeight: 700, color: C.ink,
              lineHeight: 1.03, letterSpacing: "-2.5px", margin: 0,
              animation: mounted ? "fadeSlideUp 0.75s ease 0.18s both" : "none",
            }}>
              Built to Change
            </h1>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(50px, 7.5vw, 92px)",
              fontWeight: 700,
              background: `linear-gradient(135deg, ${C.crimson} 0%, ${C.rose} 55%, #b93060 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.03, letterSpacing: "-2.5px", margin: 0,
              animation: mounted ? "fadeSlideUp 0.75s ease 0.26s both" : "none",
            }}>
              Digital Marketing.
            </h1>
          </div>

          {/* Vision statement */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            color: "rgba(26,10,15,0.55)", lineHeight: 1.85,
            maxWidth: "620px", margin: "0 0 18px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.36s both" : "none",
          }}>
            NOIRSEVEN Digital & Software Solution wants to be a partner that helps companies grow in a way that really works. We use strategy, technology, and measurable marketing tactics to help companies grow with clarity — not guesswork.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            fontStyle: "italic", color: "rgba(26,10,15,0.38)",
            maxWidth: "560px", lineHeight: 1.7, margin: "0 0 56px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.44s both" : "none",
          }}>
            "To help businesses build a digital foundation of trust, visibility, and competitive dominance in an ever-evolving online world."
          </p>

          {/* Pillars grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1px",
            background: "rgba(185,55,93,0.08)",
            border: "1px solid rgba(185,55,93,0.08)",
            animation: mounted ? "fadeIn 0.8s ease 0.55s both" : "none",
          }}>
            {PILLARS.map((p, i) => (
              <div key={p.num} style={{ background: C.snow }}>
                <PillarCard pillar={p} index={i} />
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SECTION 2 — MISSION (dark bg)
        ════════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", zIndex: 2,
          background: "linear-gradient(160deg, #12050a 0%, #200812 50%, #12050a 100%)",
          overflow: "hidden",
          padding: "110px 0",
        }}>
          {/* Large ghost number watermark */}
          <div style={{
            position: "absolute", top: "-20px", right: "-40px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(180px, 25vw, 320px)",
            fontWeight: 700, color: "rgba(185,55,93,0.04)",
            lineHeight: 1, pointerEvents: "none", userSelect: "none",
            letterSpacing: "-10px",
          }}>
            02
          </div>

          <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
              {/* Left: image */}
              <div style={{ position: "relative" }}>
                {/* Decorative frame */}
                <div style={{
                  position: "absolute", inset: "-12px 12px 12px -12px",
                  border: "1px solid rgba(185,55,93,0.2)", borderRadius: "2px",
                  pointerEvents: "none", zIndex: 0,
                }} />
                <div style={{ position: "relative", zIndex: 1, borderRadius: "2px", overflow: "hidden", aspectRatio: "4/5" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=85"
                    alt="Mission — NOIRSEVEN Digital"
                    fill
                    style={{
                      objectFit: "cover",
                      filter: "brightness(0.7) saturate(0.85)",
                      transform: `translate(${imgParallax.x * 0.3}px, ${imgParallax.y * 0.3}px) scale(1.06)`,
                      transition: "transform 0.4s ease",
                    }}
                  />
                  {/* Crimson tint overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, rgba(185,55,93,0.18) 0%, transparent 60%, rgba(18,5,10,0.55) 100%)`,
                  }} />
                  {/* Corner label */}
                  <div style={{
                    position: "absolute", bottom: "24px", left: "24px",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
                    color: "rgba(231,211,211,0.65)",
                  }}>
                    LalKothi · Jaipur
                  </div>
                </div>
                {/* Floating stat card */}
                <div style={{
                  position: "absolute", bottom: "-24px", right: "-24px", zIndex: 2,
                  background: "rgba(238,238,238,0.96)",
                  border: "1px solid rgba(185,55,93,0.18)",
                  padding: "20px 24px", borderRadius: "2px",
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: C.crimson, lineHeight: 1, letterSpacing: "-1px" }}>∞</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(26,10,15,0.45)", marginTop: "4px" }}>Growth Potential</div>
                </div>
              </div>

              {/* Right: Mission text */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
                  <div style={{ width: "28px", height: "1px", background: C.crimson }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase" }}>
                    Our Mission
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700, color: C.snow,
                  lineHeight: 1.1, letterSpacing: "-1px",
                  margin: "0 0 10px",
                }}>
                  Growth That
                </h2>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 400, fontStyle: "italic",
                  background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  lineHeight: 1.1, letterSpacing: "-0.5px",
                  margin: "0 0 30px",
                }}>
                  Actually Works.
                </h2>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", color: "rgba(238,238,238,0.55)",
                  lineHeight: 1.85, margin: "0 0 20px",
                }}>
                  Our goal is to get measurable results for businesses. We focus on building content that works well, software solutions that grow with the business, and data-based digital plans that deliver conversions, not just clicks.
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", color: "rgba(238,238,238,0.42)",
                  lineHeight: 1.85, margin: "0 0 36px",
                }}>
                  We care about accuracy and business outcomes — not making things look good on paper. We work hard to ensure companies don't waste money on things that don't work, and to help them evolve into trusted brands.
                </p>

                {/* Mission values list */}
                {[
                  "Campaigns that get conversions",
                  "Software solutions that scale",
                  "Digital plans grounded in data",
                  "Open, transparent processes",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{
                      width: "20px", height: "1px",
                      background: `linear-gradient(90deg, ${C.crimson}, transparent)`,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(238,238,238,0.68)", letterSpacing: "0.3px" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SECTION 3 — FOUNDER NOTE
        ════════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", zIndex: 2,
          background: C.snow,
          padding: "120px 0 0",
          overflow: "hidden",
        }}>
          {/* Ghost watermark */}
          <div style={{
            position: "absolute", top: "-10px", left: "-30px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(160px, 22vw, 280px)",
            fontWeight: 700, color: "rgba(185,55,93,0.04)",
            lineHeight: 1, pointerEvents: "none", userSelect: "none",
          }}>
            03
          </div>

          <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px 120px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

              {/* Left: Founder text */}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
                  <div style={{ width: "28px", height: "1px", background: C.crimson }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase" }}>
                    A Note From Our Founder
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(30px, 3.8vw, 50px)",
                  fontWeight: 700, color: C.ink,
                  lineHeight: 1.1, letterSpacing: "-1px",
                  margin: "0 0 8px",
                }}>
                  Structure.
                </h2>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(30px, 3.8vw, 50px)",
                  fontWeight: 700, color: C.ink,
                  lineHeight: 1.1, letterSpacing: "-1px",
                  margin: "0 0 8px",
                }}>
                  Accountability.
                </h2>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(30px, 3.8vw, 50px)",
                  fontWeight: 400, fontStyle: "italic",
                  background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  lineHeight: 1.1, letterSpacing: "-0.5px",
                  margin: "0 0 32px",
                }}>
                  Measurable Performance.
                </h2>

                {/* Block quote */}
                <div style={{
                  borderLeft: `3px solid ${C.crimson}`,
                  paddingLeft: "24px",
                  marginBottom: "28px",
                }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(17px, 2vw, 22px)",
                    fontStyle: "italic",
                    color: "rgba(26,10,15,0.52)",
                    lineHeight: 1.65, margin: 0,
                  }}>
                    "NOIRSEVEN Digital & Software Solution is established with a clear objective — we want to bring structure, accountability, and measurable performance in the digital marketing world."
                  </p>
                </div>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14.5px", color: "rgba(26,10,15,0.55)",
                  lineHeight: 1.85, margin: "0 0 16px",
                }}>
                  With an academic foundation in Law and Commerce, I have always approached challenges through deep analysis, logic, and disciplined execution. This mindset carries across my team as well. I believe in making strategy first.
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14.5px", color: "rgba(26,10,15,0.45)",
                  lineHeight: 1.85, margin: "0 0 16px",
                }}>
                  We don't rely on trends — we search and research for something new. In today's digital environment, visibility alone is not enough. Brands require sustainability, research-based content, and healthy competition.
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14.5px", color: "rgba(26,10,15,0.45)",
                  lineHeight: 1.85, margin: "0 0 36px",
                }}>
                  Our commitment is simple: exact plan, open procedures, and quantifiable results.
                </p>

                {/* Founder signature */}
                <div style={{
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(185,55,93,0.1)",
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px", fontStyle: "italic",
                    color: C.ink, marginBottom: "4px",
                    letterSpacing: "-0.3px",
                  }}>
                    — Founder
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px", letterSpacing: "3px",
                    color: C.crimson, textTransform: "uppercase",
                  }}>
                    NOIRSEVEN Digital & Software Solution
                  </div>
                </div>
              </div>

              {/* Right: Founder image with decorative overlays */}
              <div style={{ position: "relative", alignSelf: "stretch" }}>
                {/* Main image */}
                <div style={{
                  position: "sticky", top: "120px",
                  borderRadius: "2px", overflow: "hidden",
                  aspectRatio: "3/4",
                  border: "1px solid rgba(185,55,93,0.15)",
                }}>
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85"
                    alt="Founder — NOIRSEVEN Digital"
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                      filter: "brightness(0.82) saturate(0.88)",
                      transform: `translate(${imgParallax.x * 0.4}px, ${imgParallax.y * 0.4}px) scale(1.07)`,
                      transition: "transform 0.45s ease",
                    }}
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(to bottom, transparent 50%, rgba(26,10,15,0.72) 100%)`,
                  }} />
                  {/* Label bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 26px" }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "15px", fontWeight: 600,
                      color: C.snow, marginBottom: "4px",
                    }}>
                      Founder & Director
                    </div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "11px", letterSpacing: "3px",
                      color: C.crimson, textTransform: "uppercase",
                    }}>
                      NOIRSEVEN · LalKothi, Jaipur
                    </div>
                  </div>
                </div>

                {/* Floating quote card */}
                <div style={{
                  position: "absolute", top: "30px", right: "-28px", zIndex: 2,
                  background: "rgba(238,238,238,0.96)",
                  border: "1px solid rgba(185,55,93,0.18)",
                  padding: "18px 20px", borderRadius: "2px",
                  maxWidth: "200px", backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", fontStyle: "italic", color: "rgba(26,10,15,0.55)", lineHeight: 1.6, margin: "0 0 10px" }}>
                    "Strategy first, always."
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["Law", "Commerce", "Strategy"].map((t) => (
                      <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.crimson, background: "rgba(185,55,93,0.07)", border: "1px solid rgba(185,55,93,0.14)", padding: "3px 7px", borderRadius: "1px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SECTION 4 — WORK WITH US
        ════════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", zIndex: 2,
          overflow: "hidden",
        }}>
          {/* Full bleed image background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"
              alt="Work With NOIRSEVEN"
              fill
              style={{ objectFit: "cover", filter: "brightness(0.25) saturate(0.7)" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(135deg, rgba(18,5,10,0.92) 0%, rgba(185,55,93,0.15) 50%, rgba(18,5,10,0.95) 100%)`,
            }} />
          </div>

          {/* Concentric ring decoration */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              position: "absolute", zIndex: 1,
              width: `${200 + i * 180}px`, height: `${200 + i * 180}px`,
              border: `1px solid rgba(185,55,93,${0.12 - i * 0.02})`,
              borderRadius: "50%", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              animation: i % 2 === 0 ? `rotateSlow ${28 + i * 8}s linear infinite` : undefined,
            }} />
          ))}

          <div style={{
            position: "relative", zIndex: 2,
            maxWidth: "800px", margin: "0 auto",
            padding: "130px 48px 110px",
            textAlign: "center",
          }}>
            {/* Section label */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              marginBottom: "28px",
            }}>
              <div style={{ width: "24px", height: "1px", background: C.crimson }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase" }}>
                Work With Us
              </span>
              <div style={{ width: "24px", height: "1px", background: C.crimson }} />
            </div>

            {/* Main heading */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 74px)",
              fontWeight: 700, color: C.snow,
              lineHeight: 1.05, letterSpacing: "-2px",
              margin: "0 0 10px",
            }}>
              Let's Build Something
            </h2>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 74px)",
              fontWeight: 400, fontStyle: "italic",
              background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.05, letterSpacing: "-1.5px",
              margin: "0 0 32px",
            }}>
              Meaningful Together.
            </h2>

            {/* Copy */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "rgba(238,238,238,0.52)",
              lineHeight: 1.82, margin: "0 0 12px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
            }}>
              No matter where you are in your journey — building trust, expanding reach, or accelerating sales, we walk with you until you reach your destination.
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(16px, 1.8vw, 20px)",
              fontStyle: "italic",
              color: "rgba(238,238,238,0.3)",
              margin: "0 0 52px",
            }}>
              "We don't just complete jobs — we build partnerships."
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="cta-primary">
                Start Your Journey
              </Link>
              <Link href="/services" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
                color: "rgba(231,211,211,0.65)",
                background: "transparent",
                border: "1px solid rgba(231,211,211,0.2)",
                padding: "14px 34px", borderRadius: "1px",
                textDecoration: "none", display: "inline-block",
                transition: "all 0.22s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.crimson; (e.currentTarget as HTMLElement).style.color = C.snow; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,211,211,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(231,211,211,0.65)"; }}
              >
                Explore Services
              </Link>
            </div>

            {/* Location */}
            <div style={{ marginTop: "56px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.crimson, animation: "pulseDot 2.5s ease infinite" }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", fontStyle: "italic", letterSpacing: "2px", color: "rgba(238,238,238,0.28)" }}>
                NOIRSEVEN Digital & Software Solution · LalKothi, Jaipur, Rajasthan
              </span>
            </div>
          </div>
        </section>

        {/* ── Scrolling marquee strip ─────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          background: C.crimson,
          padding: "14px 0",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", gap: "0",
            animation: "marqueeScroll 18s linear infinite",
            width: "max-content",
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px", paddingRight: "24px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "12px", letterSpacing: "4px", color: "rgba(238,238,238,0.85)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  Strategy · Design · Growth · Authority
                </span>
                <span style={{ color: "rgba(238,238,238,0.4)", fontSize: "8px" }}>◈</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}