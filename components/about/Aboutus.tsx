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

// ─── Client types data ────────────────────────────────────────────
const CLIENTS = [
  { icon: "⚕", label: "Healthcare Experts",    desc: "Doctors building online authority and patient trust" },
  { icon: "⚙", label: "Industrialists",         desc: "Manufacturers scaling reach and converting B2B leads" },
  { icon: "🏨", label: "Hospitality Brands",    desc: "Hotels and resorts attracting the right guests" },
  { icon: "🎓", label: "Educators",             desc: "Teachers and coaches establishing thought leadership" },
  { icon: "🏫", label: "Institutions",          desc: "Schools and colleges driving admissions and recognition" },
  { icon: "🎬", label: "Content Creators",      desc: "Influencers, bloggers and video creators scaling audience" },
];

// ─── Core differentiators ─────────────────────────────────────────
const DIFF = [
  { num: "01", title: "Tailored Strategy",  body: "No template approaches. Every plan is custom-built around your brand's goals, market position, and growth ambitions." },
  { num: "02", title: "Structured Execution", body: "From content creation to paid campaigns and software — every deliverable is organised, trackable, and purpose-built." },
  { num: "03", title: "Measurable Results", body: "We obsess over data and outcomes. Visibility, leads, conversions, and brand equity — all reported with clarity." },
  { num: "04", title: "Long-Term Growth",   body: "We think in quarters and years, not just campaigns. Sustainable digital growth that compounds over time." },
];

// ─── Three.js scene ───────────────────────────────────────────────
function useSomething(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 0, 9);

    // Lights
    scene.add(new THREE.AmbientLight(0xfff0f4, 0.5));
    const pl1 = new THREE.PointLight(0xb9375d, 2.5, 42);
    pl1.position.set(-6, 5, 6);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.7, 32);
    pl2.position.set(7, -4, 3);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0xffe8ec, 0.8, 20);
    pl3.position.set(0, 0, 8);
    scene.add(pl3);

    // ── Central sculpture: nested geometry ───────────────────
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Outermost wireframe cage — dodecahedron
    const cageGeo = new THREE.DodecahedronGeometry(2.6, 0);
    const cageMat = new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.06 });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    sculptureGroup.add(cage);

    // Mid translucent icosahedron
    const midGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const midMat = new THREE.MeshPhongMaterial({
      color: 0xf5eaec, emissive: 0xb9375d, emissiveIntensity: 0.1,
      transparent: true, opacity: 0.38, shininess: 120, side: THREE.DoubleSide,
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    sculptureGroup.add(midMesh);

    // Inner bright octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0xfff0f2, emissive: 0xd25d5d, emissiveIntensity: 0.28,
      shininess: 200, transparent: true, opacity: 0.88,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    sculptureGroup.add(innerMesh);

    // Glowing core orb
    const orbGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const orbMat = new THREE.MeshPhongMaterial({
      color: 0xffffff, emissive: 0xb9375d, emissiveIntensity: 1.4,
      transparent: true, opacity: 0.9,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    sculptureGroup.add(orb);

    // 3 orbital rings at different tilts
    const ringConfigs = [
      { r: 3.0, tube: 0.007, tilt: 0.45, tiltZ: 0.2,  speed:  0.004 },
      { r: 3.6, tube: 0.005, tilt: -0.7, tiltZ: 0.55, speed: -0.003 },
      { r: 4.2, tube: 0.003, tilt: 1.15, tiltZ: -0.3, speed:  0.002 },
    ];
    const rings = ringConfigs.map(cfg => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.r, cfg.tube, 8, 180),
        new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: cfg.r < 3.2 ? 0.35 : cfg.r < 3.8 ? 0.22 : 0.14 })
      );
      ring.rotation.x = cfg.tilt;
      ring.rotation.z = cfg.tiltZ;
      scene.add(ring);
      return { ring, speed: cfg.speed };
    });

    // ── Floating glyph particles ─────────────────────────────
    const particles: { mesh: THREE.Mesh; rx: number; ry: number; vy: number; phase: number; ox: number }[] = [];
    const pGeos = [
      new THREE.TetrahedronGeometry(0.065, 0),
      new THREE.OctahedronGeometry(0.07, 0),
      new THREE.IcosahedronGeometry(0.055, 0),
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
    ];
    const pMats = [
      new THREE.MeshPhongMaterial({ color: 0xb9375d, transparent: true, opacity: 0.65, shininess: 90 }),
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.22 }),
      new THREE.MeshPhongMaterial({ color: 0xd25d5d, transparent: true, opacity: 0.48, shininess: 70 }),
      new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.14 }),
    ];
    for (let i = 0; i < 55; i++) {
      const mesh = new THREE.Mesh(pGeos[i % 4], pMats[i % 4]);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const r     = 3.2 + Math.random() * 5;
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 10,
        r * Math.sin(phi) * Math.sin(theta) - 2
      );
      mesh.scale.setScalar(0.45 + Math.random() * 1.25);
      particles.push({
        mesh,
        rx: (Math.random() - 0.5) * 0.007,
        ry: (Math.random() - 0.5) * 0.009,
        vy: (Math.random() - 0.5) * 0.0018,
        phase: Math.random() * Math.PI * 2,
        ox: mesh.position.x,
      });
      scene.add(mesh);
    }

    // Dot starfield
    const dp = new Float32Array(380 * 3);
    for (let i = 0; i < 380; i++) {
      dp[i*3]   = (Math.random() - 0.5) * 36;
      dp[i*3+1] = (Math.random() - 0.5) * 32;
      dp[i*3+2] = -9 - Math.random() * 7;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dGeo,
      new THREE.PointsMaterial({ color: 0xb9375d, size: 0.026, transparent: true, opacity: 0.12 })
    ));

    // Thin connecting web lines
    const webMat = new THREE.LineBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.05 });
    for (let i = 0; i < 22; i++) {
      const pts = [
        new THREE.Vector3((Math.random()-0.5)*18, (Math.random()-0.5)*14, -4),
        new THREE.Vector3((Math.random()-0.5)*18, (Math.random()-0.5)*14, -4),
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), webMat));
    }

    // Mouse parallax
    let mouse = {x:0, y:0}, tgt = {x:0, y:0};
    const onMM = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMM);

    let frame = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.007;
      tgt.x += (mouse.x - tgt.x) * 0.03;
      tgt.y += (mouse.y - tgt.y) * 0.03;

      // Sculpture
      sculptureGroup.rotation.y = t * 0.20 + tgt.x * 0.16;
      sculptureGroup.rotation.x = Math.sin(t*0.14)*0.11 + tgt.y*0.09;
      cage.rotation.x       = t * 0.07; cage.rotation.z = t * 0.045;
      midMesh.rotation.y    = -t * 0.13; midMesh.rotation.z = Math.sin(t*0.2)*0.04;
      innerMesh.rotation.x  = t * 0.26; innerMesh.rotation.z = -t * 0.17;
      orb.position.x        = Math.sin(t*0.85)*0.09;
      orb.position.y        = Math.cos(t*0.72)*0.07;
      sculptureGroup.position.y = Math.sin(t*0.3)*0.1;

      // Rings
      rings.forEach(({ring, speed}, i) => {
        ring.rotation.z += speed;
        ring.rotation.y += speed * 0.4;
        ring.rotation.x = ringConfigs[i].tilt + tgt.y * 0.05;
      });

      // Lights pulse
      pl1.intensity = 2.3 + Math.sin(t*1.1)*0.5;
      pl2.intensity = 1.5 + Math.cos(t*0.9)*0.4;

      // Particles
      particles.forEach(({mesh, rx, ry, vy, phase}) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 12) mesh.position.y = -12;
        if (mesh.position.y < -12) mesh.position.y = 12;
        mesh.position.x += Math.sin(t*0.35 + phase) * 0.0007;
      });

      camera.position.x += (tgt.x*0.42 - camera.position.x)*0.022;
      camera.position.y += (-tgt.y*0.28 - camera.position.y)*0.022;
      camera.lookAt(0,0,0);
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

// ─── Subcomponents ────────────────────────────────────────────────

function ClientCard({ client, index }: { client: typeof CLIENTS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "28px 26px",
        border: hov ? "1px solid rgba(185,55,93,0.4)" : "1px solid rgba(185,55,93,0.1)",
        background: hov ? "rgba(185,55,93,0.05)" : "rgba(238,238,238,0.6)",
        borderRadius: "2px",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
        animation: `fadeSlideUp 0.6s ease ${index*0.07}s both`,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "12px", lineHeight: 1 }}>{client.icon}</div>
      <h4 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "16px", fontWeight: 600,
        color: C.ink, margin: "0 0 8px",
        letterSpacing: "-0.2px",
      }}>{client.label}</h4>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12.5px", color: "rgba(26,10,15,0.52)",
        lineHeight: 1.65, margin: 0,
      }}>{client.desc}</p>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: "2px", width: hov ? "100%" : "0%",
        background: `linear-gradient(90deg, ${C.crimson}, ${C.rose})`,
        transition: "width 0.42s ease",
      }} />
    </div>
  );
}

function DiffCard({ item, index }: { item: typeof DIFF[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: "22px", alignItems: "flex-start",
        padding: "28px 0",
        borderBottom: index < DIFF.length - 1 ? "1px solid rgba(185,55,93,0.08)" : "none",
        transition: "all 0.25s",
        animation: `fadeSlideUp 0.65s ease ${index*0.1}s both`,
        cursor: "default",
      }}
    >
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "11px", letterSpacing: "3px", fontStyle: "italic",
        color: hov ? C.crimson : "rgba(185,55,93,0.4)",
        minWidth: "28px", paddingTop: "4px",
        transition: "color 0.25s",
      }}>{item.num}</div>
      <div>
        <h4 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "18px", fontWeight: 600,
          color: C.ink, margin: "0 0 10px",
          letterSpacing: "-0.3px",
        }}>{item.title}</h4>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13.5px", color: "rgba(26,10,15,0.54)",
          lineHeight: 1.75, margin: 0,
        }}>{item.body}</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function AboutUs() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mouseXY, setMouseXY] = useState({ x: 0, y: 0 });

  useSomething(mountRef);

  useEffect(() => {
    setMounted(true);
    const onMM = (e: MouseEvent) => {
      setMouseXY({
        x: (e.clientX / window.innerWidth  - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) *  9,
      });
    };
    window.addEventListener("mousemove", onMM);
    return () => window.removeEventListener("mousemove", onMM);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${C.snow};overflow-x:hidden}

        @keyframes fadeSlideUp {
          from{opacity:0;transform:translateY(24px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.6);opacity:1}}
        @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes rotateSlowRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes marqueeFwd{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes scrollCue{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.8;transform:translateY(6px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(185,55,93,.3);border-radius:2px}
      `}</style>

      {/* Three.js canvas */}
      <div ref={mountRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />

      {/* Radial vignette */}
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        background:"radial-gradient(ellipse 85% 70% at 55% 50%, transparent 25%, rgba(238,238,238,.7) 70%, rgba(238,238,238,.95) 100%)",
      }} />

      {/* Fine grid texture left side */}
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        backgroundImage:`linear-gradient(rgba(185,55,93,.032) 1px, transparent 1px), linear-gradient(90deg, rgba(185,55,93,.032) 1px, transparent 1px)`,
        backgroundSize:"60px 60px",
        maskImage:"radial-gradient(ellipse 55% 65% at 15% 55%, black 15%, transparent 68%)",
      }} />

      <main style={{ position:"relative" }}>

        {/* ══════════════════════════════════════════════════════
            § 1 — HERO / ABOUT INTRO
        ══════════════════════════════════════════════════════ */}
        <section style={{
          position:"relative", zIndex:2,
          minHeight:"100vh",
          display:"flex", alignItems:"center",
          maxWidth:"1320px", margin:"0 auto",
          padding:"140px 48px 100px",
          gap:"72px",
        }}>
          {/* Left: text */}
          <div style={{ flex:"1 1 0", display:"flex", flexDirection:"column" }}>
            {/* Eyebrow */}
            <div style={{
              display:"flex", alignItems:"center", gap:"12px",
              marginBottom:"26px",
              animation: mounted ? "fadeSlideUp .7s ease .1s both" : "none",
            }}>
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:C.crimson, animation:"pulseDot 2s ease infinite" }} />
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"11px", letterSpacing:"5px", color:C.crimson, textTransform:"uppercase", fontStyle:"italic" }}>
                About NOIRSEVEN
              </span>
            </div>

            <h1 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(48px,7vw,88px)",
              fontWeight:700, color:C.ink,
              lineHeight:1.03, letterSpacing:"-2.5px",
              margin:0,
              animation: mounted ? "fadeSlideUp .75s ease .18s both" : "none",
            }}>We Don't Just</h1>
            <h1 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(48px,7vw,88px)",
              fontWeight:700,
              background:`linear-gradient(135deg, ${C.crimson} 0%, ${C.rose} 52%, #c03058 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              lineHeight:1.03, letterSpacing:"-2.5px",
              margin:"0 0 6px",
              animation: mounted ? "fadeSlideUp .75s ease .26s both" : "none",
            }}>Give Services.</h1>
            <p style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(17px,2.2vw,24px)",
              fontStyle:"italic", fontWeight:400,
              color:"rgba(26,10,15,.36)",
              margin:"0 0 28px",
              animation: mounted ? "fadeSlideUp .7s ease .32s both" : "none",
            }}>We walk with you — as a partner.</p>

            <div style={{
              width:"44px", height:"1.5px",
              background:`linear-gradient(90deg,${C.crimson},transparent)`,
              marginBottom:"24px",
              animation: mounted ? "fadeSlideUp .6s ease .38s both" : "none",
            }} />

            <p style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(14px,1.5vw,16.5px)",
              color:"rgba(26,10,15,.55)", lineHeight:1.84,
              maxWidth:"530px", margin:"0 0 16px",
              animation: mounted ? "fadeSlideUp .7s ease .44s both" : "none",
            }}>
              At NOIRSEVEN Digital & Software Solution, Lal Kothi, Jaipur, we work with you to make your digital presence stronger and clearer. In today's competitive digital world, just being seen is not enough.
            </p>
            <p style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(14px,1.5vw,16.5px)",
              color:"rgba(26,10,15,.42)", lineHeight:1.84,
              maxWidth:"530px", margin:"0 0 46px",
              animation: mounted ? "fadeSlideUp .7s ease .5s both" : "none",
            }}>
              You need a plan, a strong brand, and execution that actually works. Every brand is unique. We don't use the same approach for everyone — we build plans tailored to your goals, market position, and where you want to be in the future.
            </p>

            {/* CTA row */}
            <div style={{
              display:"flex", gap:"12px", flexWrap:"wrap",
              animation: mounted ? "fadeSlideUp .7s ease .56s both" : "none",
            }}>
              <Link href="/contact" style={{
                fontFamily:"'DM Sans', sans-serif",
                fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase",
                color:C.snow, background:`linear-gradient(135deg,${C.crimson},${C.rose})`,
                textDecoration:"none", padding:"14px 32px", borderRadius:"1px",
                display:"inline-block", transition:"opacity .2s, transform .2s",
              }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.opacity=".84"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}
              >Start Working Together</Link>
              <Link href="/services" style={{
                fontFamily:"'DM Sans', sans-serif",
                fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase",
                color:C.crimson, background:"transparent",
                border:"1px solid rgba(185,55,93,.28)",
                textDecoration:"none", padding:"13px 32px", borderRadius:"1px",
                display:"inline-block", transition:"all .2s",
              }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background="rgba(185,55,93,.05)"; (e.currentTarget as HTMLElement).style.borderColor=C.crimson; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.borderColor="rgba(185,55,93,.28)"; }}
              >Explore Services</Link>
            </div>
          </div>

          {/* Right: stacked images */}
          <div style={{
            flex:"0 0 auto", width:"clamp(260px,30vw,420px)",
            position:"relative",
            animation: mounted ? "fadeIn 1.1s ease .5s both" : "none",
          }}>
            {/* Background frame accent */}
            <div style={{
              position:"absolute", inset:"-14px 14px 14px -14px",
              border:"1px solid rgba(185,55,93,.18)", borderRadius:"2px",
              pointerEvents:"none",
            }} />
            {/* Primary image */}
            <div style={{ position:"relative", borderRadius:"2px", overflow:"hidden", aspectRatio:"3/4" }}>
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=85"
                alt="NOIRSEVEN team strategy session"
                fill
                style={{
                  objectFit:"cover",
                  filter:"brightness(.78) saturate(.85)",
                  transform:`translate(${mouseXY.x*.3}px,${mouseXY.y*.25}px) scale(1.07)`,
                  transition:"transform .45s ease",
                }}
              />
              <div style={{
                position:"absolute", inset:0,
                background:`linear-gradient(to bottom, transparent 45%, rgba(26,10,15,.72) 100%)`,
              }} />
              <div style={{ position:"absolute", bottom:"24px", left:"24px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(231,211,211,.6)", marginBottom:"4px" }}>LalKothi · Jaipur</div>
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"14px", fontStyle:"italic", color:"rgba(238,238,238,.75)" }}>Where Strategy Meets Design</div>
              </div>
            </div>

            {/* Floating stat card — top right */}
            <div style={{
              position:"absolute", top:"-20px", right:"-28px", zIndex:2,
              background:"rgba(238,238,238,.96)",
              border:"1px solid rgba(185,55,93,.16)",
              padding:"16px 20px", borderRadius:"2px",
              backdropFilter:"blur(8px)",
            }}>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"30px", fontWeight:700, color:C.crimson, lineHeight:1, letterSpacing:"-1px" }}>10+</div>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(26,10,15,.4)", marginTop:"3px" }}>Industries Served</div>
            </div>

            {/* Floating quote card — bottom left */}
            <div style={{
              position:"absolute", bottom:"-24px", left:"-24px", zIndex:2,
              background:`linear-gradient(135deg, rgba(185,55,93,.9), rgba(210,93,93,.85))`,
              padding:"16px 20px", borderRadius:"2px",
              maxWidth:"180px",
            }}>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(238,238,238,.65)", marginBottom:"6px" }}>Our Promise</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"14px", fontStyle:"italic", color:"rgba(238,238,238,.9)", lineHeight:1.5 }}>Measurable growth, not guesswork.</div>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{
            position:"absolute", bottom:"44px", left:"48px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"6px",
            animation: mounted ? "fadeIn 1s ease 1.2s both" : "none",
          }}>
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"9px", letterSpacing:"3.5px", color:"rgba(26,10,15,.25)", textTransform:"uppercase", writingMode:"vertical-lr", transform:"rotate(180deg)" }}>
              Explore
            </span>
            <div style={{ width:"1px", height:"40px", background:`linear-gradient(${C.crimson},transparent)`, animation:"scrollCue 2.2s ease infinite" }} />
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            § 2 — FOUNDER QUOTE (dark full-bleed)
        ══════════════════════════════════════════════════════ */}
        <section style={{ position:"relative", zIndex:2, overflow:"hidden" }}>
          {/* Full-bleed bg image */}
          <div style={{ position:"absolute", inset:0 }}>
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"
              alt="Strategy and structure"
              fill
              style={{ objectFit:"cover", filter:"brightness(.18) saturate(.6)" }}
            />
            <div style={{
              position:"absolute", inset:0,
              background:`linear-gradient(135deg, rgba(18,4,10,.97) 0%, rgba(185,55,93,.12) 50%, rgba(18,4,10,.97) 100%)`,
            }} />
          </div>

          {/* Concentric rings */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position:"absolute", zIndex:1,
              width:`${160+i*160}px`, height:`${160+i*160}px`,
              border:`1px solid rgba(185,55,93,${.12-i*.025})`,
              borderRadius:"50%",
              top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              pointerEvents:"none",
            }} />
          ))}

          <div style={{
            position:"relative", zIndex:2,
            maxWidth:"860px", margin:"0 auto",
            padding:"110px 48px",
            textAlign:"center",
            display:"flex", flexDirection:"column", alignItems:"center",
          }}>
            {/* Large quotation mark */}
            <div style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(80px,12vw,160px)",
              fontWeight:700,
              color:"rgba(185,55,93,.12)",
              lineHeight:0.8, marginBottom:"8px",
              userSelect:"none",
            }}>
              "
            </div>
            <blockquote style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(20px,2.8vw,34px)",
              fontWeight:400, fontStyle:"italic",
              color:"rgba(238,238,238,.85)",
              lineHeight:1.55, letterSpacing:"-0.3px",
              margin:"0 0 32px",
              maxWidth:"720px",
            }}>
              My background in law and commerce taught me one thing: clarity and structure win. That is the foundation of every strategy we build at NOIRSEVEN.
            </blockquote>
            <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{ width:"32px", height:"1px", background:`linear-gradient(90deg, transparent, ${C.crimson})` }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"16px", fontWeight:600, color:C.snow, letterSpacing:"-0.2px" }}>
                  Kanishkk Bansal
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"10px", letterSpacing:"3.5px", textTransform:"uppercase", color:C.crimson, marginTop:"3px" }}>
                  Founder · NOIRSEVEN Digital & Software Solution
                </div>
              </div>
              <div style={{ width:"32px", height:"1px", background:`linear-gradient(90deg, ${C.crimson}, transparent)` }} />
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            § 3 — WHO WE WORK WITH
        ══════════════════════════════════════════════════════ */}
        <section style={{ position:"relative", zIndex:2, background:C.snow, padding:"110px 0" }}>
          {/* Ghost watermark */}
          <div style={{
            position:"absolute", top:"-10px", right:"-20px",
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(140px,20vw,260px)",
            fontWeight:700, color:"rgba(185,55,93,.04)",
            lineHeight:1, pointerEvents:"none", userSelect:"none",
          }}>WHO</div>

          <div style={{ maxWidth:"1320px", margin:"0 auto", padding:"0 48px" }}>
            {/* Header */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"end", marginBottom:"56px" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                  <div style={{ width:"28px", height:"1px", background:C.crimson }} />
                  <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"10px", letterSpacing:"5px", color:C.crimson, textTransform:"uppercase" }}>
                    Who We Work With
                  </span>
                </div>
                <h2 style={{
                  fontFamily:"'Playfair Display', serif",
                  fontSize:"clamp(30px,4vw,50px)",
                  fontWeight:700, color:C.ink,
                  lineHeight:1.1, letterSpacing:"-1px", margin:0,
                }}>Every Brand Is<br />
                  <span style={{
                    background:`linear-gradient(135deg,${C.crimson},${C.rose})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  }}>Unique.</span>
                </h2>
              </div>
              <p style={{
                fontFamily:"'DM Sans', sans-serif",
                fontSize:"14.5px", color:"rgba(26,10,15,.5)",
                lineHeight:1.82, margin:0,
                paddingBottom:"8px",
              }}>
                We help businesses and creators get noticed online — doctors, industrialists, hotel owners, educators, schools, and content creators. We change what we do to fit what they need and what they want to achieve.
              </p>
            </div>

            {/* Client cards grid */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))",
              gap:"1px",
              background:"rgba(185,55,93,.08)",
              border:"1px solid rgba(185,55,93,.08)",
            }}>
              {CLIENTS.map((c,i) => (
                <div key={c.label} style={{ background:C.snow }}>
                  <ClientCard client={c} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            § 4 — WHAT MAKES US DIFFERENT (split layout)
        ══════════════════════════════════════════════════════ */}
        <section style={{
          position:"relative", zIndex:2,
          background:"linear-gradient(160deg, #120509 0%, #1e0810 50%, #120509 100%)",
          padding:"110px 0",
          overflow:"hidden",
        }}>
          {/* Ghost number */}
          <div style={{
            position:"absolute", top:"-30px", left:"-30px",
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(180px,26vw,340px)",
            fontWeight:700, color:"rgba(185,55,93,.035)",
            lineHeight:1, pointerEvents:"none", userSelect:"none",
          }}>04</div>

          <div style={{ maxWidth:"1320px", margin:"0 auto", padding:"0 48px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }}>

              {/* Left sticky */}
              <div style={{ position:"sticky", top:"120px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
                  <div style={{ width:"28px", height:"1px", background:C.crimson }} />
                  <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"10px", letterSpacing:"5px", color:C.crimson, textTransform:"uppercase" }}>
                    What Sets Us Apart
                  </span>
                </div>
                <h2 style={{
                  fontFamily:"'Playfair Display', serif",
                  fontSize:"clamp(30px,3.8vw,48px)",
                  fontWeight:700, color:C.snow,
                  lineHeight:1.1, letterSpacing:"-1px",
                  margin:"0 0 8px",
                }}>Growth That</h2>
                <h2 style={{
                  fontFamily:"'Playfair Display', serif",
                  fontSize:"clamp(30px,3.8vw,48px)",
                  fontWeight:400, fontStyle:"italic",
                  background:`linear-gradient(135deg,${C.crimson},${C.rose})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  lineHeight:1.1, letterSpacing:"-0.5px",
                  margin:"0 0 28px",
                }}>Compounds.</h2>

                <p style={{
                  fontFamily:"'DM Sans', sans-serif",
                  fontSize:"14.5px", color:"rgba(238,238,238,.48)",
                  lineHeight:1.82, margin:"0 0 36px",
                }}>
                  At NOIRSEVEN, growth should not be temporary. We think about how to help your brand grow and succeed over time, not just for one campaign.
                </p>

                {/* Image */}
                <div style={{ borderRadius:"2px", overflow:"hidden", aspectRatio:"4/3", border:"1px solid rgba(185,55,93,.15)" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=85"
                    alt="NOIRSEVEN execution"
                    width={800} height={600}
                    style={{
                      width:"100%", height:"100%", objectFit:"cover",
                      filter:"brightness(.65) saturate(.8)",
                      transform:`translate(${mouseXY.x*.25}px,${mouseXY.y*.18}px) scale(1.06)`,
                      transition:"transform .45s ease",
                    }}
                  />
                </div>
              </div>

              {/* Right: differentiators list */}
              <div>
                {DIFF.map((item, i) => (
                  <DiffCard key={item.num} item={item} index={i} />
                ))}

                {/* Extra emphasis block */}
                <div style={{
                  marginTop:"36px",
                  padding:"28px 28px",
                  background:"rgba(185,55,93,.07)",
                  border:"1px solid rgba(185,55,93,.18)",
                  borderRadius:"2px",
                }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:C.crimson, marginBottom:"10px" }}>
                    Our Core Belief
                  </div>
                  <p style={{
                    fontFamily:"'Playfair Display', serif",
                    fontSize:"17px", fontStyle:"italic",
                    color:"rgba(238,238,238,.72)", lineHeight:1.6, margin:0,
                  }}>
                    "We do not use the same approach for every brand. We create plans that are tailored to your needs, your goals, and where you want to be in the future."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            § 5 — FULL-BLEED IMAGE STATEMENT
        ══════════════════════════════════════════════════════ */}
        <section style={{ position:"relative", zIndex:2, height:"560px", overflow:"hidden" }}>
          <Image
            src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=80"
            alt="NOIRSEVEN digital growth"
            fill
            style={{
              objectFit:"cover",
              filter:"brightness(.22) saturate(.6)",
              transform:`translate(${mouseXY.x*.4}px,${mouseXY.y*.3}px) scale(1.08)`,
              transition:"transform .5s ease",
            }}
          />
          <div style={{
            position:"absolute", inset:0,
            background:`linear-gradient(135deg, rgba(18,4,10,.95) 0%, rgba(185,55,93,.1) 50%, rgba(18,4,10,.95) 100%)`,
          }} />

          {/* Centered statement */}
          <div style={{
            position:"absolute", inset:0, zIndex:2,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            textAlign:"center", padding:"0 48px",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
              <div style={{ width:"40px", height:"1px", background:`linear-gradient(90deg,transparent,${C.crimson})` }} />
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:C.crimson, animation:"pulseDot 2s ease infinite" }} />
              <div style={{ width:"40px", height:"1px", background:`linear-gradient(90deg,${C.crimson},transparent)` }} />
            </div>
            <h2 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(28px,5vw,64px)",
              fontWeight:700, color:C.snow,
              lineHeight:1.08, letterSpacing:"-1.5px",
              margin:"0 0 12px", maxWidth:"700px",
            }}>
              Clarity. Structure.{" "}
              <span style={{
                background:`linear-gradient(135deg,${C.crimson},${C.rose})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>Results.</span>
            </h2>
            <p style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(13px,1.5vw,16px)",
              color:"rgba(238,238,238,.42)", lineHeight:1.78,
              maxWidth:"480px", margin:"0 0 36px",
            }}>
              We help businesses and creators build a digital foundation of trust, visibility, and competitive dominance — built to last, not just to look good.
            </p>
            <Link href="/contact" style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase",
              color:C.snow, background:`linear-gradient(135deg,${C.crimson},${C.rose})`,
              textDecoration:"none", padding:"14px 32px", borderRadius:"1px",
              display:"inline-block", transition:"opacity .2s, transform .2s",
            }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.opacity=".84"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}
            >
              Work With NOIRSEVEN
            </Link>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            § 6 — SCROLLING MARQUEE FOOTER STRIP
        ══════════════════════════════════════════════════════ */}
        <div style={{ position:"relative", zIndex:2, background:C.crimson, padding:"13px 0", overflow:"hidden" }}>
          <div style={{ display:"flex", animation:"marqueeFwd 20s linear infinite", width:"max-content" }}>
            {Array.from({length:14}).map((_,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"20px", paddingRight:"20px" }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"12px", letterSpacing:"4px", color:"rgba(238,238,238,.82)", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                  Structure · Clarity · Authority · Growth · Results
                </span>
                <span style={{ color:"rgba(238,238,238,.35)", fontSize:"7px" }}>◈</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}