"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import * as THREE from "three";
import { SERVICES } from "@/components/services/Services";

// ─── Three.js Background for detail page ─────────────────────────
function useDetailThree(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.z = 7;

    scene.add(new THREE.AmbientLight(0xfff0f4, 0.4));
    const pl = new THREE.PointLight(0xb9375d, 2.2, 35);
    pl.position.set(-4, 3, 4);
    scene.add(pl);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.4, 25);
    pl2.position.set(5, -2, 2);
    scene.add(pl2);

    // Central rotating sculpture
    const group = new THREE.Group();
    scene.add(group);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.1 })
    );
    group.add(shell);

    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.MeshPhongMaterial({ color: 0xf5e8ea, emissive: 0xb9375d, emissiveIntensity: 0.12, transparent: true, opacity: 0.5, shininess: 100 })
    );
    group.add(inner);

    // Orbital ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.007, 6, 140),
      new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.3 })
    );
    ring.rotation.x = 0.5;
    scene.add(ring);

    // Particles
    const particles: { mesh: THREE.Mesh; rx: number; ry: number; vy: number }[] = [];
    const pGeo = [new THREE.OctahedronGeometry(0.08, 0), new THREE.TetrahedronGeometry(0.1, 0)];
    const pMat = [
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.22 }),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.16 }),
    ];
    for (let i = 0; i < 30; i++) {
      const mesh = new THREE.Mesh(pGeo[i % 2], pMat[i % 2]);
      mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 8 - 3);
      mesh.scale.setScalar(0.4 + Math.random() * 1.2);
      particles.push({ mesh, rx: (Math.random() - 0.5) * 0.007, ry: (Math.random() - 0.5) * 0.009, vy: (Math.random() - 0.5) * 0.002 });
      scene.add(mesh);
    }

    // Dot field
    const dp = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) { dp[i * 3] = (Math.random() - 0.5) * 28; dp[i * 3 + 1] = (Math.random() - 0.5) * 24; dp[i * 3 + 2] = -7 - Math.random() * 5; }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xb9375d, size: 0.025, transparent: true, opacity: 0.12 })));

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
      group.rotation.y = t * 0.2 + tgt.x * 0.15;
      group.rotation.x = Math.sin(t * 0.15) * 0.1 + tgt.y * 0.08;
      inner.rotation.y = -t * 0.3;
      ring.rotation.z += 0.004;
      pl.intensity = 2.0 + Math.sin(t * 1.1) * 0.4;
      particles.forEach(({ mesh, rx, ry, vy }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 9) mesh.position.y = -9;
        if (mesh.position.y < -9) mesh.position.y = 9;
      });
      camera.position.x += (tgt.x * 0.35 - camera.position.x) * 0.025;
      camera.position.y += (tgt.y * 0.2 - camera.position.y) * 0.025;
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

// ─── Sub-Service Card ─────────────────────────────────────────────
function SubServiceCard({ sub, index }: { sub: { title: string; items: string[] }; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(185,55,93,0.05)" : "rgba(238,238,238,0.5)",
        border: hov ? "1px solid rgba(185,55,93,0.35)" : "1px solid rgba(185,55,93,0.1)",
        padding: "24px 26px",
        borderRadius: "2px",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        animation: `fadeSlideUp 0.6s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "10px", letterSpacing: "3px",
        color: "#B9375D", textTransform: "uppercase",
        marginBottom: "10px",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <h4 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "15px", fontWeight: 600,
        color: "#1a0a0f", margin: "0 0 14px",
        letterSpacing: "-0.2px", lineHeight: 1.3,
      }}>
        {sub.title}
      </h4>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
        {sub.items.map((item) => (
          <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ color: "#B9375D", fontSize: "9px", marginTop: "3px", flexShrink: 0 }}>◈</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(26,10,15,0.62)", lineHeight: 1.55 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Service Detail Page ──────────────────────────────────────────
export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === params.slug);
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useDetailThree(mountRef);
  useEffect(() => { setMounted(true); }, []);

  if (!service) return notFound();

  const serviceIndex = SERVICES.indexOf(service);
  const prev = SERVICES[serviceIndex - 1];
  const next = SERVICES[serviceIndex + 1];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #EEEEEE; overflow-x: hidden; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseDot { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.6); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(185,55,93,0.3); border-radius: 2px; }
      `}</style>

      <div style={{ position: "relative", minHeight: "100vh", background: "#EEEEEE" }}>

        {/* Three.js */}
        <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", background: "radial-gradient(ellipse 85% 80% at 50% 40%, transparent 35%, rgba(238,238,238,0.75) 75%, rgba(238,238,238,0.92) 100%)" }} />

        {/* ── Hero section ────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

          {/* Back nav */}
          <div style={{
            padding: "100px 48px 0",
            maxWidth: "1320px", margin: "0 auto", width: "100%",
            animation: mounted ? "fadeSlideUp 0.6s ease 0.1s both" : "none",
          }}>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", letterSpacing: "2px",
              textTransform: "uppercase", color: "rgba(26,10,15,0.4)",
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#B9375D")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(26,10,15,0.4)")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Services
            </Link>
          </div>

          {/* Hero content */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            maxWidth: "1320px", margin: "0 auto", width: "100%",
            padding: "48px 48px 80px",
            gap: "64px",
          }}>
            {/* Left text */}
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "20px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.2s both" : "none",
              }}>
                <div style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: "#B9375D", animation: "pulseDot 2s ease infinite",
                }} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "10px", letterSpacing: "5px",
                  color: "#B9375D", textTransform: "uppercase", fontStyle: "italic",
                }}>
                  Service {String(serviceIndex + 1).padStart(2, "0")} of {SERVICES.length}
                </span>
              </div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "10px", letterSpacing: "5px",
                color: "#B9375D", textTransform: "uppercase",
                marginBottom: "10px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.28s both" : "none",
              }}>
                {service.abbr}
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(38px, 5.5vw, 68px)",
                fontWeight: 700, color: "#1a0a0f",
                lineHeight: 1.06, letterSpacing: "-1.5px",
                margin: "0 0 8px",
                animation: mounted ? "fadeSlideUp 0.75s ease 0.34s both" : "none",
              }}>
                {service.title}
              </h1>

              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(16px, 2vw, 22px)",
                fontStyle: "italic", color: "#B9375D",
                margin: "0 0 28px", letterSpacing: "0.5px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.4s both" : "none",
              }}>
                {service.tagline}
              </p>

              <div style={{
                width: "44px", height: "1.5px",
                background: "linear-gradient(90deg, #B9375D, transparent)",
                marginBottom: "22px",
                animation: mounted ? "fadeSlideUp 0.6s ease 0.46s both" : "none",
              }} />

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(14px, 1.4vw, 16px)",
                color: "rgba(26,10,15,0.6)", lineHeight: 1.82,
                maxWidth: "520px", margin: "0 0 36px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.52s both" : "none",
              }}>
                {service.description}
              </p>

              {/* Highlights */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "8px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.58s both" : "none",
              }}>
                {service.highlights.map((h) => (
                  <span key={h} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px", letterSpacing: "1px",
                    color: "#B9375D",
                    background: "rgba(185,55,93,0.07)",
                    border: "1px solid rgba(185,55,93,0.16)",
                    padding: "5px 12px", borderRadius: "1px",
                  }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                display: "flex", gap: "12px", marginTop: "40px",
                animation: mounted ? "fadeSlideUp 0.7s ease 0.64s both" : "none",
              }}>
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
                  Get Started
                </Link>
                <Link href="/services" style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", letterSpacing: "2px",
                  textTransform: "uppercase", color: "#B9375D",
                  background: "transparent",
                  border: "1px solid rgba(185,55,93,0.28)",
                  textDecoration: "none", padding: "14px 30px",
                  borderRadius: "1px", transition: "all 0.2s",
                  display: "inline-block",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(185,55,93,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  All Services
                </Link>
              </div>
            </div>

            {/* Right: hero image */}
            <div style={{
              flex: "0 0 auto",
              width: "clamp(280px, 32vw, 460px)",
              borderRadius: "2px", overflow: "hidden",
              border: "1px solid rgba(185,55,93,0.15)",
              position: "relative",
              animation: mounted ? "fadeIn 1s ease 0.5s both" : "none",
              aspectRatio: "4/5",
            }}>
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 460px"
                style={{ objectFit: "cover", filter: "brightness(0.88) saturate(0.9)" }}
                onLoad={() => setImgLoaded(true)}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(26,10,15,0.7) 0%, transparent 55%)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "28px 24px",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "13px", fontStyle: "italic",
                  color: "rgba(238,238,238,0.7)",
                  marginBottom: "4px",
                }}>
                  NoirSeven Digital Solution
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "10px", letterSpacing: "3px",
                  color: "#D25D5D", textTransform: "uppercase",
                }}>
                  LalKothi, Jaipur
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Why choose us ────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 2, background: "rgba(26,10,15,0.96)", padding: "80px 48px" }}>
          <div style={{ maxWidth: "1320px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "10px", letterSpacing: "5px",
                color: "#B9375D", textTransform: "uppercase",
                marginBottom: "16px",
              }}>
                Why Choose Us
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700, color: "#EEEEEE",
                letterSpacing: "-0.8px", lineHeight: 1.15,
                margin: "0 0 24px",
              }}>
                The NoirSeven<br />
                <span style={{
                  background: "linear-gradient(135deg, #B9375D, #D25D5D)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Difference</span>
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px", color: "rgba(238,238,238,0.55)",
                lineHeight: 1.82, margin: 0,
              }}>
                {service.whyChooseUs}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {service.highlights.map((h, i) => (
                <div key={h} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px 20px",
                  background: "rgba(185,55,93,0.06)",
                  border: "1px solid rgba(185,55,93,0.12)",
                  borderRadius: "1px",
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px", color: "#B9375D",
                    minWidth: "24px", fontStyle: "italic",
                  }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px", color: "rgba(238,238,238,0.75)",
                    letterSpacing: "0.3px",
                  }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sub-services grid ────────────────────────── */}
        <div style={{ position: "relative", zIndex: 2, padding: "96px 48px", maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ marginBottom: "52px" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "10px", letterSpacing: "5px",
              color: "#B9375D", textTransform: "uppercase",
              marginBottom: "12px",
            }}>
              What We Deliver
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 700, color: "#1a0a0f",
              letterSpacing: "-1px", lineHeight: 1.1,
              margin: 0,
            }}>
              Our {service.abbr} Sub-Services
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(185,55,93,0.08)",
            border: "1px solid rgba(185,55,93,0.08)",
          }}>
            {service.subServices.map((sub, i) => (
              <div key={sub.title} style={{ background: "#EEEEEE" }}>
                <SubServiceCard sub={sub} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Navigation between services ──────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1320px", margin: "0 auto",
          padding: "0 48px 80px",
          display: "grid",
          gridTemplateColumns: prev ? (next ? "1fr 1fr" : "1fr") : "1fr",
          gap: "1px",
          background: prev && next ? "rgba(185,55,93,0.08)" : "transparent",
        }}>
          {prev && (
            <Link href={`/services/${prev.slug}`} style={{ textDecoration: "none", background: "#EEEEEE" }}>
              <div style={{
                padding: "28px 32px",
                border: "1px solid rgba(185,55,93,0.1)",
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: "16px",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(185,55,93,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,55,93,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#EEEEEE"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,55,93,0.1)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8H3M7 4L3 8l4 4" stroke="#B9375D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px", color: "#B9375D", textTransform: "uppercase", marginBottom: "4px" }}>Previous</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 600, color: "#1a0a0f" }}>{prev.title}</div>
                </div>
              </div>
            </Link>
          )}
          {next && (
            <Link href={`/services/${next.slug}`} style={{ textDecoration: "none", background: "#EEEEEE" }}>
              <div style={{
                padding: "28px 32px",
                border: "1px solid rgba(185,55,93,0.1)",
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px",
                textAlign: "right",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(185,55,93,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,55,93,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#EEEEEE"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,55,93,0.1)"; }}
              >
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px", color: "#B9375D", textTransform: "uppercase", marginBottom: "4px" }}>Next</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 600, color: "#1a0a0f" }}>{next.title}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#B9375D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* ── CTA Footer ───────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          background: "linear-gradient(135deg, #150709 0%, #26060f 50%, #150709 100%)",
          padding: "90px 48px", textAlign: "center",
          overflow: "hidden",
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${160 + i * 150}px`, height: `${160 + i * 150}px`,
              border: `1px solid rgba(185,55,93,${0.1 - i * 0.025})`,
              borderRadius: "50%", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", pointerEvents: "none",
            }} />
          ))}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: "#B9375D", textTransform: "uppercase", marginBottom: "16px" }}>
            Ready to Begin?
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4.5vw, 54px)",
            fontWeight: 700, color: "#EEEEEE",
            margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.1,
          }}>
            Let's build your{" "}
            <span style={{
              background: "linear-gradient(135deg, #B9375D, #D25D5D)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {service.abbr} strategy
            </span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(238,238,238,0.42)", marginBottom: "40px", maxWidth: "360px", margin: "0 auto 40px", lineHeight: 1.75 }}>
            Partner with NoirSevenDigitalSolution for measurable, sustainable growth.
          </p>
          <Link href="/contact" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px", letterSpacing: "2px",
            textTransform: "uppercase", color: "#EEEEEE",
            background: "linear-gradient(135deg, #B9375D, #D25D5D)",
            textDecoration: "none", padding: "16px 36px",
            borderRadius: "1px", display: "inline-block",
            transition: "opacity 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Get Free Consultation
          </Link>
          <div style={{ marginTop: "48px", fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", fontStyle: "italic", color: "rgba(238,238,238,0.18)", letterSpacing: "1px" }}>
            NoirSeven Digital & Software Solution · LalKothi, Jaipur
          </div>
        </div>
      </div>
    </>
  );
}