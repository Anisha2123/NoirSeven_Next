"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import { SERVICES } from "@/components/services/Services";

// ─── Three.js Background ──────────────────────────────────────────
function useServicesThree(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.z = 8;

    // Ambient + point lights
    scene.add(new THREE.AmbientLight(0xfff0f4, 0.5));
    const pl1 = new THREE.PointLight(0xb9375d, 2, 40);
    pl1.position.set(-6, 4, 3);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.5, 30);
    pl2.position.set(7, -3, 2);
    scene.add(pl2);

    // Flowing ribbon lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.06 });
    const lines: THREE.Line[] = [];
    for (let i = 0; i < 24; i++) {
      const pts = Array.from({ length: 60 }, (_, j) => {
        const t = j / 59;
        return new THREE.Vector3(
          Math.sin(t * Math.PI * 2 + i * 0.5) * (4 + i * 0.3),
          (t - 0.5) * 18 + Math.cos(t * Math.PI + i) * 1.5,
          Math.cos(t * Math.PI * 2 + i * 0.3) * 2 - 4
        );
      });
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, lineMat.clone());
      lines.push(line);
      scene.add(line);
    }

    // Floating geometric shapes
    const shapes: { mesh: THREE.Mesh; rx: number; ry: number; vy: number; phase: number }[] = [];
    const geos = [
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.TetrahedronGeometry(0.12, 0),
      new THREE.IcosahedronGeometry(0.09, 0),
    ];
    const mats = [
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.12 }),
    ];
    for (let i = 0; i < 45; i++) {
      const mesh = new THREE.Mesh(geos[i % 3], mats[i % 3]);
      mesh.position.set((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 8 - 3);
      mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
      const s = 0.4 + Math.random() * 1.4;
      mesh.scale.setScalar(s);
      shapes.push({ mesh, rx: (Math.random() - 0.5) * 0.006, ry: (Math.random() - 0.5) * 0.008, vy: (Math.random() - 0.5) * 0.002, phase: Math.random() * Math.PI * 2 });
      scene.add(mesh);
    }

    // Dot field
    const dpos = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      dpos[i * 3] = (Math.random() - 0.5) * 32;
      dpos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      dpos[i * 3 + 2] = -6 - Math.random() * 6;
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.Float32BufferAttribute(dpos, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xb9375d, size: 0.03, transparent: true, opacity: 0.14 })));

    let mouse = { x: 0, y: 0 };
    let tgt = { x: 0, y: 0 };
    const onMM = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMM);

    let frame = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.007;
      tgt.x += (mouse.x - tgt.x) * 0.03;
      tgt.y += (mouse.y - tgt.y) * 0.03;

      lines.forEach((line, i) => { line.rotation.z = t * 0.015 + i * 0.1; });
      pl1.intensity = 1.8 + Math.sin(t * 1.2) * 0.5;
      pl2.intensity = 1.3 + Math.cos(t * 0.9) * 0.4;
      shapes.forEach(({ mesh, rx, ry, vy, phase }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 11) mesh.position.y = -11;
        if (mesh.position.y < -11) mesh.position.y = 11;
        mesh.position.x += Math.sin(t * 0.3 + phase) * 0.0008;
      });
      camera.position.x += (tgt.x * 0.4 - camera.position.x) * 0.02;
      camera.position.y += (tgt.y * 0.25 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
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

// ─── Service Card ─────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/services/${service.slug}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        style={{
          position: "relative",
          background: "#EEEEEE",
          border: hovered ? "1px solid rgba(185,55,93,0.45)" : "1px solid rgba(185,55,93,0.1)",
          overflow: "hidden",
          cursor: "pointer",
          transform: hovered ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
          transition: "all 0.38s cubic-bezier(0.25,0.46,0.45,0.94)",
          animation: `cardReveal 0.65s ease ${index * 0.07}s both`,
          borderRadius: "2px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: "200px", overflow: "hidden", flexShrink: 0 }}>
          <Image
            src={service.cardImage}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
              filter: hovered ? "brightness(0.82) saturate(1.1)" : "brightness(0.92) saturate(0.9)",
            }}
          />
          {/* Image overlay gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, transparent 40%, rgba(238,238,238,0.95) 100%)`,
            zIndex: 1,
          }} />
          {/* Abbr badge */}
          <div style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 2,
            background: "rgba(185,55,93,0.9)",
            color: "#EEEEEE",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "10px", letterSpacing: "3px",
            textTransform: "uppercase", padding: "5px 10px",
            borderRadius: "1px", backdropFilter: "blur(4px)",
          }}>
            {service.abbr}
          </div>
          {/* Number */}
          <div style={{
            position: "absolute", top: "14px", left: "14px", zIndex: 2,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "11px", fontStyle: "italic",
            color: "rgba(238,238,238,0.7)", letterSpacing: "2px",
          }}>
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "22px 24px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "11px", letterSpacing: "4px",
            color: "#B9375D", textTransform: "uppercase",
          }}>
            {service.tagline}
          </div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "19px", fontWeight: 600,
            color: "#1a0a0f", margin: 0,
            lineHeight: 1.25, letterSpacing: "-0.3px",
          }}>
            {service.title}
          </h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", color: "rgba(26,10,15,0.55)",
            lineHeight: 1.7, margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {service.description}
          </p>

          {/* Sub-service count */}
          <div style={{
            marginTop: "auto", paddingTop: "14px",
            borderTop: "1px solid rgba(185,55,93,0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", letterSpacing: "1.5px",
              color: "rgba(26,10,15,0.38)", textTransform: "uppercase",
            }}>
              {service.subServices.length} sub-services
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", color: "#B9375D",
              letterSpacing: "1px", textTransform: "uppercase",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}>
              Explore
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#B9375D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: "2px",
          width: hovered ? "100%" : "0%",
          background: `linear-gradient(90deg, #B9375D, #D25D5D)`,
          transition: "width 0.45s ease",
        }} />
      </article>
    </Link>
  );
}

// ─── Main Services Section ────────────────────────────────────────
export default function ServicesSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useServicesThree(mountRef);

  useEffect(() => { setMounted(true); }, []);

  const filters = ["all", "seo", "social", "paid", "creative", "technical"];

  const filterMap: Record<string, number[]> = {
    all: SERVICES.map((_, i) => i),
    seo: [0],
    social: [1, 3],
    paid: [2],
    creative: [3, 6, 9],
    technical: [4, 7],
  };

  const visibleIndices = filterMap[activeFilter] ?? SERVICES.map((_, i) => i);
  const visibleServices = activeFilter === "all" ? SERVICES : SERVICES.filter((_, i) => visibleIndices.includes(i));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #EEEEEE; overflow-x: hidden; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .filter-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 8px 18px;
          border: 1px solid rgba(185,55,93,0.18);
          background: transparent;
          color: rgba(26,10,15,0.45);
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.22s ease;
        }
        .filter-btn:hover { border-color: rgba(185,55,93,0.4); color: #B9375D; background: rgba(185,55,93,0.04); }
        .filter-btn.active { background: #B9375D; color: #EEEEEE; border-color: #B9375D; }
      `}</style>

      <section style={{ position: "relative", minHeight: "100vh", background: "#EEEEEE", paddingBottom: "100px" }}>

        {/* Three.js canvas */}
        <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

        {/* Vignette */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(238,238,238,0.7) 80%, rgba(238,238,238,0.9) 100%)",
        }} />

        {/* ── Hero Header ─────────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1320px", margin: "0 auto",
          padding: "130px 48px 80px",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "28px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.1s both" : "none",
          }}>
            <div style={{ width: "32px", height: "1px", background: "#B9375D" }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "10px", letterSpacing: "5px",
              color: "#B9375D", textTransform: "uppercase",
              fontStyle: "italic",
            }}>
              NoirSeven Digital & Software Solution
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "40px", flexWrap: "wrap" }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 700,
                color: "#1a0a0f",
                lineHeight: 1.03,
                letterSpacing: "-2px",
                margin: 0,
                animation: mounted ? "fadeSlideUp 0.75s ease 0.18s both" : "none",
              }}>
                What We
              </h1>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 700,
                lineHeight: 1.03,
                letterSpacing: "-2px",
                margin: "0 0 20px",
                background: "linear-gradient(135deg, #B9375D 0%, #D25D5D 55%, #B9375D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: mounted ? "fadeSlideUp 0.75s ease 0.26s both" : "none",
              }}>
                Do Best
              </h1>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(14px, 1.5vw, 16px)",
                color: "rgba(26,10,15,0.52)",
                maxWidth: "480px",
                lineHeight: 1.8,
                animation: mounted ? "fadeSlideUp 0.7s ease 0.34s both" : "none",
              }}>
                Research-backed strategies and performance-driven execution across 10 specialised digital marketing disciplines, crafted for your growth.
              </p>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: "36px",
              animation: mounted ? "fadeSlideUp 0.7s ease 0.42s both" : "none",
            }}>
              {[["10", "Services"], ["100%", "Strategy-Driven"], ["∞", "Growth"]].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "32px", fontWeight: 700,
                    color: "#B9375D", lineHeight: 1,
                    letterSpacing: "-1px",
                  }}>{val}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px", letterSpacing: "2px",
                    color: "rgba(26,10,15,0.38)",
                    textTransform: "uppercase", marginTop: "4px",
                  }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "48px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.5s both" : "none",
          }}>
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-btn${activeFilter === f ? " active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Services Grid ─────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1320px", margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1px",
          background: "rgba(185,55,93,0.08)",
          border: "1px solid rgba(185,55,93,0.08)",
        }}>
          {visibleServices.map((service, i) => (
            <div key={service.id} style={{ background: "#EEEEEE" }}>
              <ServiceCard service={service} index={SERVICES.indexOf(service)} />
            </div>
          ))}
        </div>

        {/* ── CTA strip ────────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1320px", margin: "60px auto 0",
          padding: "0 48px",
          animation: mounted ? "fadeIn 1s ease 0.8s both" : "none",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1a0a0f 0%, #26060f 50%, #1a0a0f 100%)",
            padding: "52px 56px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "32px",
            flexWrap: "wrap", borderRadius: "2px",
            border: "1px solid rgba(185,55,93,0.2)",
          }}>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "10px", letterSpacing: "4px",
                color: "#B9375D", textTransform: "uppercase",
                marginBottom: "10px",
              }}>LalKothi, Jaipur</div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3vw, 38px)",
                fontWeight: 700, color: "#EEEEEE",
                margin: 0, letterSpacing: "-0.5px",
              }}>
                Ready to grow your brand?
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px", color: "rgba(238,238,238,0.45)",
                marginTop: "8px", maxWidth: "380px", lineHeight: 1.7,
              }}>
                Let's build a custom strategy tailored to your business goals and growth ambitions.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/contact" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase", color: "#EEEEEE",
                background: "linear-gradient(135deg, #B9375D, #D25D5D)",
                textDecoration: "none", padding: "14px 30px",
                borderRadius: "1px", transition: "opacity 0.2s, transform 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                Get Free Consultation
              </Link>
              <Link href="/" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase", color: "rgba(231,211,211,0.7)",
                background: "transparent",
                border: "1px solid rgba(231,211,211,0.2)",
                textDecoration: "none", padding: "14px 30px",
                borderRadius: "1px", transition: "all 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#B9375D"; (e.currentTarget as HTMLElement).style.color = "#EEEEEE"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,211,211,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(231,211,211,0.7)"; }}
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}