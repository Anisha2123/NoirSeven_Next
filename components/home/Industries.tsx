"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const INDUSTRIES = [
  {
    id: "health",
    label: "Health",
    icon: "✦",
    desc: "Clinics, hospitals & wellness platforms",
    color: "#D25D5D",
    angle: 0,
  },
  {
    id: "tech",
    label: "Tech",
    icon: "✦",
    desc: "Startups, SaaS & product companies",
    color: "#B9375D",
    angle: 36,
  },
  {
    id: "education",
    label: "Education",
    icon: "✦",
    desc: "Schools, edtech & learning platforms",
    color: "#D25D5D",
    angle: 72,
  },
  {
    id: "hospitality",
    label: "Hospitality",
    icon: "✦",
    desc: "Hotels, restaurants & experiences",
    color: "#B9375D",
    angle: 108,
  },
  {
    id: "realestate",
    label: "Real Estate",
    icon: "✦",
    desc: "Agencies, developers & property tech",
    color: "#D25D5D",
    angle: 144,
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    icon: "✦",
    desc: "Retail brands & online stores",
    color: "#B9375D",
    angle: 180,
  },
  {
    id: "legal",
    label: "Legal Services",
    icon: "✦",
    desc: "Law firms & compliance platforms",
    color: "#D25D5D",
    angle: 216,
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    icon: "✦",
    desc: "Salons, spas & lifestyle brands",
    color: "#B9375D",
    angle: 252,
  },
  {
    id: "it",
    label: "IT & SaaS",
    icon: "✦",
    desc: "Software platforms & IT services",
    color: "#D25D5D",
    angle: 288,
  },
  {
    id: "ngo",
    label: "NGOs",
    icon: "✦",
    desc: "Non-profits & social welfare orgs",
    color: "#B9375D",
    angle: 324,
  },
];

export default function IndustriesSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const nodesRef = useRef<{ [key: string]: THREE.Mesh }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // ── Floating particles background ──
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      pSizes[i] = Math.random() * 2.5 + 0.5;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: 0xd25d5d,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // ── Concentric decorative rings ──
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    ringsRef.current = ringGroup;

    [2.2, 3.1, 3.95].forEach((r, i) => {
      const rGeo = new THREE.RingGeometry(r, r + 0.006, 128);
      const rMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xb9375d : 0xe7d3d3,
        transparent: true,
        opacity: i === 1 ? 0.45 : 0.2,
        side: THREE.DoubleSide,
      });
      ringGroup.add(new THREE.Mesh(rGeo, rMat));
    });

    // ── Center sphere ──
    const cGeo = new THREE.IcosahedronGeometry(0.55, 3);
    const cMat = new THREE.MeshStandardMaterial({
      color: 0xb9375d,
      metalness: 0.6,
      roughness: 0.25,
      wireframe: false,
    });
    const centerSphere = new THREE.Mesh(cGeo, cMat);
    scene.add(centerSphere);

    // Center wireframe overlay
    const cWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.58, 1),
      new THREE.MeshBasicMaterial({
        color: 0xd25d5d,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    scene.add(cWire);

    // ── Orbit group (nodes) ──
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    orbitGroupRef.current = orbitGroup;

    const radius = 3.1;
    INDUSTRIES.forEach((ind) => {
      const theta = (ind.angle * Math.PI) / 180;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;

      // Node sphere
      const nGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const nMat = new THREE.MeshStandardMaterial({
        color: 0xb9375d,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x2a0010,
        emissiveIntensity: 0.2,
      });
      const node = new THREE.Mesh(nGeo, nMat);
      node.position.set(x, y, 0);
      node.userData = { id: ind.id, baseScale: 1 };
      orbitGroup.add(node);
      nodesRef.current[ind.id] = node;

      // Connector line from center to node
      const lPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)];
      const lGeo = new THREE.BufferGeometry().setFromPoints(lPoints);
      const lMat = new THREE.LineBasicMaterial({
        color: 0xe7d3d3,
        transparent: true,
        opacity: 0.18,
      });
      orbitGroup.add(new THREE.Line(lGeo, lMat));
    });

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xfff5f5, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);
    const pLight = new THREE.PointLight(0xb9375d, 2, 10);
    pLight.position.set(0, 0, 3);
    scene.add(pLight);

    // ── Mouse ──
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / W - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - rect.top) / H - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouse);

    // ── Resize ──
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ──
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // Slow orbit rotation
      orbitGroup.rotation.z = t * 0.04;

      // Camera parallax
      camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (mouseRef.current.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Rings subtle pulse
      if (ringsRef.current) {
        ringsRef.current.rotation.z = t * 0.015;
        ringsRef.current.children.forEach((r, i) => {
          (r as THREE.Mesh).scale.setScalar(
            1 + Math.sin(t * 0.4 + i * 1.2) * 0.015
          );
        });
      }

      // Center sphere breathe
      const bs = 1 + Math.sin(t * 0.8) * 0.06;
      centerSphere.scale.setScalar(bs);
      cWire.rotation.y = t * 0.3;
      cWire.rotation.x = t * 0.15;

      // Particles drift
      particles.rotation.y = t * 0.008;
      particles.rotation.x = t * 0.004;

      // Node pulse
      Object.entries(nodesRef.current).forEach(([id, node]) => {
        const isActive = id === active;
        const isHov = id === hovered;
        const targetScale = isActive ? 1.8 : isHov ? 1.4 : 1;
        node.scale.setScalar(
          node.scale.x + (targetScale - node.scale.x) * 0.12
        );
        const mat = node.material as THREE.MeshStandardMaterial;
        const targetEmissive = isActive ? 0.8 : isHov ? 0.5 : 0.2;
        mat.emissiveIntensity +=
          (targetEmissive - mat.emissiveIntensity) * 0.1;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Update active/hovered without restarting the effect
  useEffect(() => {
    Object.entries(nodesRef.current).forEach(([id, node]) => {
      const mat = node.material as THREE.MeshStandardMaterial;
      mat.color.set(active === id ? 0xd25d5d : 0xb9375d);
    });
  }, [active, hovered]);

  const activeInd = INDUSTRIES.find((i) => i.id === active);

  return (
    <section
      style={{
        background: "#EEEEEE",
        minHeight: "100vh",
        fontFamily: "'DM Serif Display', 'Georgia', serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Google font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ind-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #B9375D;
          padding: 5px 14px;
          border: 1px solid #E7D3D3;
          border-radius: 100px;
          background: #fff;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .ind-pill:hover {
          background: #D25D5D;
          color: #fff;
          border-color: #D25D5D;
          transform: translateY(-2px);
        }
        .ind-pill.active {
          background: #B9375D;
          color: #fff;
          border-color: #B9375D;
        }
      `}</style>

      {/* Subtle background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #E7D3D320 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D25D5D0D 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {/* Left — text + pills */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B9375D",
              marginBottom: 20,
            }}
          >
            Industries We Serve
          </p>

          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(38px, 5vw, 62px)",
              fontWeight: 400,
              color: "#1a0a0e",
              lineHeight: 1.08,
              marginBottom: 20,
            }}
          >
            We partner
            <br />
            <em style={{ color: "#D25D5D" }}>across every</em>
            <br />
            industry.
          </h2>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "#6b4050",
              lineHeight: 1.7,
              maxWidth: 380,
              marginBottom: 36,
              fontWeight: 300,
            }}
          >
            From healthcare providers to tech disruptors, Noirseven crafts
            digital experiences that resonate, convert, and endure.
          </p>

          {/* Pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              maxWidth: 440,
            }}
          >
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                className={`ind-pill${active === ind.id ? " active" : ""}`}
                onClick={() => setActive(active === ind.id ? null : ind.id)}
                onMouseEnter={() => setHovered(ind.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {ind.label}
              </button>
            ))}
          </div>

          {/* Active card */}
          <div
            style={{
              marginTop: 28,
              minHeight: 60,
              transition: "opacity 0.3s ease",
              opacity: activeInd ? 1 : 0,
            }}
          >
            {activeInd && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E7D3D3",
                  borderLeft: "3px solid #B9375D",
                  borderRadius: 8,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#E7D3D3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#B9375D",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✦
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 17,
                      color: "#1a0a0e",
                      marginBottom: 2,
                    }}
                  >
                    {activeInd.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: "#7a4c5a",
                      fontWeight: 300,
                    }}
                  >
                    {activeInd.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Three.js canvas */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            height: 520,
            borderRadius: 24,
            overflow: "hidden",
            background:
              "radial-gradient(ellipse at 50% 50%, #fff8f8 0%, #EEEEEE 100%)",
            border: "1px solid #E7D3D3",
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block" }} />

          {/* Center label */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 13,
                color: "#B9375D",
                letterSpacing: "0.08em",
                opacity: 0.8,
              }}
            >
              NOIRSEVEN
            </p>
          </div>

          {/* Floating labels around orbit */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {INDUSTRIES.map((ind) => {
              const cx = containerRef.current?.clientWidth ?? 520;
              const cy = 520;
              const r = Math.min(cx, cy) * 0.385;
              const theta = (ind.angle * Math.PI) / 180;
              const x = cx / 2 + Math.cos(theta) * (r + 26);
              const y = cy / 2 - Math.sin(theta) * (r + 26);
              return (
                <text
                  key={ind.id}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: active === ind.id ? 11 : 9,
                    fill: active === ind.id ? "#B9375D" : "#9a6070",
                    fontWeight: active === ind.id ? 500 : 400,
                    transition: "all 0.3s ease",
                    opacity: hovered && hovered !== ind.id ? 0.4 : 1,
                    letterSpacing: "0.04em",
                  }}
                >
                  {ind.label}
                </text>
              );
            })}
          </svg>

          {/* Corner decoration */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 20,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "#C4929A",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            10 sectors
          </div>
        </div>
      </div>
    </section>
  );
}