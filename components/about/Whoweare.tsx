"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const VALUES = [
  { title: "Systems Over Trends", desc: "We build infrastructure, not gimmicks. Every tactic serves a long-term architecture." },
  { title: "Measurable by Design", desc: "Nothing launches without a success metric. We measure what matters, always." },
  { title: "Research-First Execution", desc: "Every solution is preceded by data, competitive analysis, and strategic positioning." },
  { title: "Long-Horizon Thinking", desc: "We optimize for sustained dominance, not short bursts. Your foundation is our priority." },
];

const PILLARS = [
  { num: "01", title: "Brand Architecture", desc: "Identity systems built for recognition, recall, and lasting market presence." },
  { num: "02", title: "Content Systems", desc: "Structured content frameworks that compound visibility over time." },
  { num: "03", title: "Strategic Advertising", desc: "Performance campaigns grounded in psychology and precision targeting." },
  { num: "04", title: "Software Solutions", desc: "Custom digital products engineered to scale your operations seamlessly." },
];

const DISTINCTIONS = [
  { title: "No guesswork, ever", desc: "Every decision traces back to research, data, and a defined growth objective." },
  { title: "Foundations, not facades", desc: "We build infrastructure that supports long-term scaling, not surface-level wins." },
  { title: "Disciplined & accountable", desc: "From Jaipur to your market — strict timelines, clear ownership, no exceptions." },
];

/* ─────────────────────────────────────────
   SECTION 1 THREE.JS — GROWTH HELIX ORBS
───────────────────────────────────────── */
function useScene1(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 380, H = 380;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    cam.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xfff0f0, 0.8));
    const pl = new THREE.PointLight(0xb9375d, 3, 20);
    pl.position.set(2, 2, 5); scene.add(pl);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.5, 18);
    pl2.position.set(-3, -2, 4); scene.add(pl2);

    // Background soft circle
    const bgMesh = new THREE.Mesh(
      new THREE.CircleGeometry(3.8, 64),
      new THREE.MeshBasicMaterial({ color: 0xf5ecec, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    scene.add(bgMesh);

    // Grid plane
    const gLines: number[] = [];
    for (let i = -7; i <= 7; i++) {
      gLines.push(-8, 0, i * (8 / 7), 8, 0, i * (8 / 7));
      gLines.push(i * (8 / 7), 0, -8, i * (8 / 7), 0, 8);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(gLines), 3));
    const grid = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0xe7d3d3, transparent: true, opacity: 0.25 }));
    grid.rotation.x = Math.PI / 2;
    grid.position.y = -2.8;
    scene.add(grid);

    // Core octahedron
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.05, 0),
      new THREE.MeshStandardMaterial({ color: 0xb9375d, metalness: 0.7, roughness: 0.15, emissive: new THREE.Color(0x3a0015), emissiveIntensity: 0.4 })
    );
    scene.add(core);

    const wire = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.12, 0),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.3 })
    );
    scene.add(wire);

    // Orbit rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.012, 8, 100), new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.5 }));
    ring1.rotation.x = Math.PI / 2; scene.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.008, 8, 100), new THREE.MeshBasicMaterial({ color: 0xe7d3d3, transparent: true, opacity: 0.35 }));
    ring2.rotation.x = Math.PI / 3; ring2.rotation.y = Math.PI / 6; scene.add(ring2);

    // Orbiting spheres
    const oData = [
      { r: 2.1, speed: 0.55, phase: 0, size: 0.13, tilt: 0, color: 0xb9375d },
      { r: 2.1, speed: 0.55, phase: (Math.PI * 2) / 3, size: 0.10, tilt: 0, color: 0xd25d5d },
      { r: 2.1, speed: 0.55, phase: (Math.PI * 4) / 3, size: 0.13, tilt: 0, color: 0xb9375d },
      { r: 2.85, speed: 0.32, phase: 0.5, size: 0.09, tilt: Math.PI / 3, color: 0xe7d3d3 },
      { r: 2.85, speed: 0.32, phase: 2.6, size: 0.09, tilt: Math.PI / 3, color: 0xe7d3d3 },
    ];
    const orbitMeshes = oData.map(d => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(d.size, 12, 12),
        new THREE.MeshStandardMaterial({ color: d.color, metalness: 0.6, roughness: 0.2, emissive: new THREE.Color(0x1a0008), emissiveIntensity: 0.3 })
      );
      scene.add(m); return { mesh: m, ...d };
    });

    // Particles
    const pCount = 120;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI, r = 2.5 + Math.random() * 2.5;
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xd25d5d, size: 0.05, transparent: true, opacity: 0.45 })));

    // Connectors
    const connectors = oData.slice(0, 3).map(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xe7d3d3, transparent: true, opacity: 0.2 }));
      scene.add(line); return line;
    });

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / W - 0.5) * 2;
      mouse.y = -((e.clientY - r.top) / H - 0.5) * 2;
    };
    canvas.addEventListener("mousemove", onMouse);

    let t = 0, raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.012;
      core.rotation.y = t * 0.35; core.rotation.x = t * 0.18;
      wire.rotation.y = -t * 0.2; wire.rotation.z = t * 0.12;
      ring1.rotation.z = t * 0.12; ring2.rotation.y = t * 0.08;
      cam.position.x += (mouse.x * 0.8 - cam.position.x) * 0.04;
      cam.position.y += (mouse.y * 0.5 - cam.position.y) * 0.04;
      cam.lookAt(0, 0, 0);
      orbitMeshes.forEach(o => {
        const a = t * o.speed + o.phase;
        if (o.tilt === 0) o.mesh.position.set(Math.cos(a) * o.r, Math.sin(a * 0.3) * 0.3, Math.sin(a) * o.r);
        else o.mesh.position.set(Math.cos(a) * o.r * Math.cos(o.tilt), Math.cos(a) * o.r * Math.sin(o.tilt * 0.5) + Math.sin(a) * o.r * Math.cos(o.tilt * 0.5), Math.sin(a) * o.r * 0.8);
      });
      connectors.forEach((line, i) => {
        const arr = line.geometry.attributes.position.array as Float32Array;
        arr[0] = 0; arr[1] = 0; arr[2] = 0;
        arr[3] = orbitMeshes[i].mesh.position.x;
        arr[4] = orbitMeshes[i].mesh.position.y;
        arr[5] = orbitMeshes[i].mesh.position.z;
        (line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      });
      renderer.render(scene, cam);
    };
    animate();
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("mousemove", onMouse); renderer.dispose(); };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────
   SECTION 2 THREE.JS — DARK PARTICLE SPHERE
───────────────────────────────────────── */
function useDarkScene(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const resize = () => {
      const p = canvas.parentElement!;
      renderer.setSize(p.clientWidth, p.clientHeight, false);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      cam.aspect = p.clientWidth / p.clientHeight;
      cam.updateProjectionMatrix();
      cam.position.set(0, 0, 10);
    };
    resize(); window.addEventListener("resize", resize);

    const sCount = 300, sPos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 30;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x6a2535, size: 0.06, transparent: true, opacity: 0.5 })));

    const wSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(4, 1), new THREE.MeshBasicMaterial({ color: 0x2a0810, wireframe: true, transparent: true, opacity: 0.15 }));
    scene.add(wSphere);

    let t = 0, raf = 0;
    const animate = () => { raf = requestAnimationFrame(animate); t += 0.008; wSphere.rotation.y = t * 0.06; wSphere.rotation.x = t * 0.03; renderer.render(scene, cam); };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────
   SECTION 3 THREE.JS — WAVE GRID
───────────────────────────────────────── */
function useWaveScene(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const resize = () => {
      const p = canvas.parentElement!;
      renderer.setSize(p.clientWidth, p.clientHeight, false);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      cam.aspect = p.clientWidth / p.clientHeight;
      cam.updateProjectionMatrix();
      cam.position.set(0, 4, 8); cam.lookAt(0, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);
    const geo = new THREE.PlaneGeometry(18, 12, 40, 30);
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.18 })));
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const orig: { x: number; y: number }[] = [];
    for (let i = 0; i < pos.count; i++) orig.push({ x: pos.getX(i), y: pos.getY(i) });
    let t = 0, raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.012;
      for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(orig[i].x * 0.7 + t) * 0.18 + Math.sin(orig[i].y * 0.5 + t * 0.8) * 0.15);
      pos.needsUpdate = true; renderer.render(scene, cam);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────
   SECTION 4 THREE.JS — FLOATING SHAPES
───────────────────────────────────────── */
function useFloatingScene(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const resize = () => {
      const p = canvas.parentElement!;
      renderer.setSize(p.clientWidth, p.clientHeight, false);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      cam.aspect = p.clientWidth / p.clientHeight;
      cam.updateProjectionMatrix(); cam.position.set(0, 0, 9);
    };
    resize(); window.addEventListener("resize", resize);
    scene.add(new THREE.AmbientLight(0xffe8e8, 0.9));
    const pl = new THREE.PointLight(0xb9375d, 2.5, 20); pl.position.set(3, 3, 4); scene.add(pl);
    const defs = [
      { geo: new THREE.TetrahedronGeometry(0.5, 0), x: -5, y: 2, z: -2, speed: 0.4, color: 0xe7d3d3 },
      { geo: new THREE.OctahedronGeometry(0.35, 0), x: 5, y: -1, z: -3, speed: 0.25, color: 0xd25d5d },
      { geo: new THREE.IcosahedronGeometry(0.28, 0), x: -4, y: -2, z: -1, speed: 0.55, color: 0xb9375d },
      { geo: new THREE.TetrahedronGeometry(0.2, 0), x: 4, y: 2.5, z: -2, speed: 0.35, color: 0xc8a0a8 },
      { geo: new THREE.OctahedronGeometry(0.22, 0), x: 0, y: 3, z: -4, speed: 0.45, color: 0xe7d3d3 },
    ];
    const shapes = defs.map(d => {
      const mesh = new THREE.Mesh(d.geo, new THREE.MeshStandardMaterial({ color: d.color, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.45 }));
      mesh.position.set(d.x, d.y, d.z); scene.add(mesh); return { mesh, speed: d.speed, ox: d.x, oy: d.y };
    });
    let t = 0, raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate); t += 0.01;
      shapes.forEach(s => {
        s.mesh.rotation.y += s.speed * 0.015; s.mesh.rotation.x += s.speed * 0.009;
        s.mesh.position.y = s.oy + Math.sin(t * s.speed + s.ox) * 0.3;
      });
      renderer.render(scene, cam);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); renderer.dispose(); };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function WhoWeAre() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);
  const canvas4Ref = useRef<HTMLCanvasElement>(null);
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState([true, false, false, false]);

  useScene1(canvas1Ref);
  useDarkScene(canvas2Ref);
  useWaveScene(canvas3Ref);
  useFloatingScene(canvas4Ref);

  const scrollToPanel = useCallback((i: number) => {
    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const i = panelRefs.current.indexOf(e.target as HTMLElement);
        if (i === -1) return;
        if (e.isIntersecting && e.intersectionRatio > 0.5) setCurrent(i);
        if (e.isIntersecting) setInView(prev => { const n = [...prev]; n[i] = true; return n; });
      });
    }, { threshold: 0.5 });
    panelRefs.current.forEach(p => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") scrollToPanel(Math.min(current + 1, 3));
      if (e.key === "ArrowUp" || e.key === "PageUp") scrollToPanel(Math.max(current - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, scrollToPanel]);

  const anim = (panel: number, delay = 0): React.CSSProperties => ({
    opacity: inView[panel] ? 1 : 0,
    transform: inView[panel] ? "translateY(0)" : "translateY(26px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  });

  const S: Record<string, React.CSSProperties> = {
    eyebrow: { fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#B9375D", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
    bodyMuted: { fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: "#5a3040", lineHeight: 1.75, fontWeight: 300 },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--c:#B9375D;--r:#D25D5D;--b:#E7D3D3;--p:#EEEEEE;--ink:#120608;--m:#5a3040;--w:#fff8f8}
        #wwa-scroller{width:100%;height:100vh;overflow-y:scroll;scroll-snap-type:y mandatory;scroll-behavior:smooth}
        #wwa-scroller::-webkit-scrollbar{display:none}
        .wwa-panel{scroll-snap-align:start;width:100%;height:100vh;min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .pillar-card{background:#fff;border:1px solid #E7D3D3;border-radius:8px;padding:24px 20px;position:relative;overflow:hidden;transition:transform .3s,border-color .3s;cursor:default}
        .pillar-card::before{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#B9375D;transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
        .pillar-card:hover{transform:translateY(-5px)}
        .pillar-card:hover::before{transform:scaleX(1)}
        .value-card{background:rgba(255,255,255,.04);border:1px solid rgba(231,211,211,.1);border-left:2px solid #B9375D;border-radius:0 6px 6px 0;padding:14px 18px;transition:background .3s}
        .value-card:hover{background:rgba(185,55,93,.08)}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#B9375D;color:#fff;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;padding:11px 22px;border-radius:4px;border:none;cursor:pointer;transition:background .25s,transform .2s}
        .cta-btn:hover{background:#D25D5D;transform:translateY(-2px)}
      `}</style>

   

      {/* Progress Dots */}
      <div style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: 9 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} onClick={() => scrollToPanel(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: current === i ? "#B9375D" : "#E7D3D3", border: "1.5px solid #B9375D", cursor: "pointer", transform: current === i ? "scale(1.4)" : "scale(1)", transition: "all .3s" }} />
        ))}
      </div>

      {/* Page Counter */}
      <div style={{ position: "fixed", left: 20, bottom: 24, zIndex: 200, fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.18em", color: "#5a3040", textTransform: "uppercase" }}>
        {String(current + 1).padStart(2, "0")} / 04
      </div>

      <div id="wwa-scroller" ref={scrollerRef}>

        {/* ── PANEL 1 — WHO WE ARE ── */}
        <section className="wwa-panel" ref={el => { panelRefs.current[0] = el; }} style={{ background: "#EEEEEE" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%,rgba(185,55,93,.07) 0%,transparent 60%),radial-gradient(ellipse at 10% 80%,rgba(231,211,211,.4) 0%,transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, width: "92%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", paddingTop: 58 }}>
            <div>
              <div style={{ ...S.eyebrow, ...anim(0, 0) }}><span style={{ width: 24, height: 1, background: "#B9375D", display: "block" }} />Who We Are</div>
              <h1 style={{ ...anim(0, 0.1), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(46px,6.5vw,82px)", fontWeight: 300, color: "#120608", lineHeight: 0.96, marginBottom: 20 }}>
                We<br />engineer<br /><em style={{ color: "#D25D5D" }}>growth.</em>
              </h1>
              <p style={{ ...S.bodyMuted, ...anim(0, 0.2), maxWidth: 380 }}>
                NOIRSEVEN is not a trend-chasing agency. We are systems architects — building measurable, research-backed digital foundations for businesses that refuse to plateau. Every solution is purposeful. Every metric, intentional.
              </p>
            </div>
            <div style={{ ...anim(0, 0.3), display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 20 }}>
              <canvas ref={canvas1Ref} width={380} height={380} style={{ borderRadius: 12, border: "1px solid rgba(231,211,211,.4)" }} />
            </div>
          </div>
        </section>

        {/* ── PANEL 2 — PHILOSOPHY ── */}
        <section className="wwa-panel" ref={el => { panelRefs.current[1] = el; }} style={{ background: "#120608" }}>
          <canvas ref={canvas2Ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 900, width: "92%", paddingTop: 58, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 140, color: "rgba(231,211,211,.08)", lineHeight: 0.5, position: "absolute", top: 80, left: 40, pointerEvents: "none", userSelect: "none" }}>"</div>
              <div style={{ ...anim(1, 0), fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#D25D5D", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 20, height: 1, background: "#D25D5D", display: "block" }} />Our Philosophy
              </div>
              <p style={{ ...anim(1, 0.1), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,3.5vw,42px)", fontStyle: "italic" as const, fontWeight: 300, color: "#fff", lineHeight: 1.25, marginBottom: 18, position: "relative", zIndex: 2 }}>
                "Growth is not<br />accidental,<br />it's <em style={{ color: "#D25D5D" }}>engineered</em>."
              </p>
              <p style={{ ...anim(1, 0.2), fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#D25D5D", fontWeight: 500, marginBottom: 22 }}>— NOIRSEVEN Digital</p>
              <p style={{ ...anim(1, 0.3), fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 300, lineHeight: 1.75, maxWidth: 340 }}>
                Every stage we build, every campaign we launch, every piece of content we craft — combined with one purpose: sustainable growth for your business.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {VALUES.map((v, i) => (
                <div key={i} className="value-card" style={anim(1, 0.1 + i * 0.1)}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "#fff", letterSpacing: "0.04em", marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.42)", fontWeight: 300, lineHeight: 1.55 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANEL 3 — APPROACH ── */}
        <section className="wwa-panel" ref={el => { panelRefs.current[2] = el; }} style={{ background: "#fff8f8" }}>
          <canvas ref={canvas3Ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, width: "92%", paddingTop: 58 }}>
            <div style={{ marginBottom: 44 }}>
              <div style={{ ...S.eyebrow, ...anim(2, 0) }}><span style={{ width: 20, height: 1, background: "#B9375D", display: "block" }} />Our Approach</div>
              <h2 style={{ ...anim(2, 0.1), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(34px,4.5vw,56px)", fontWeight: 300, color: "#120608", lineHeight: 1.05 }}>
                How we <em style={{ color: "#D25D5D", fontStyle: "italic" }}>build</em> differently.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {PILLARS.map((p, i) => (
                <div key={i} className="pillar-card" style={anim(2, 0.1 + i * 0.09)}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: "#E7D3D3", fontWeight: 300, lineHeight: 1, marginBottom: 12 }}>{p.num}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#120608", fontWeight: 400, marginBottom: 8, lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#5a3040", fontWeight: 300, lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANEL 4 — DISTINCTIONS + CTA ── */}
        <section className="wwa-panel" ref={el => { panelRefs.current[3] = el; }} style={{ background: "#EEEEEE" }}>
          <canvas ref={canvas4Ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 940, width: "92%", paddingTop: 58, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ ...S.eyebrow, ...anim(3, 0) }}><span style={{ width: 20, height: 1, background: "#B9375D", display: "block" }} />What Sets Us Apart</div>
              <h2 style={{ ...anim(3, 0.1), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 300, color: "#120608", lineHeight: 1.1, marginBottom: 26 }}>
                Built on purpose.<br /><em style={{ color: "#D25D5D", fontStyle: "italic" }}>Measured</em> always.
              </h2>
              {DISTINCTIONS.map((d, i) => (
                <div key={i} style={{ ...anim(3, 0.15 + i * 0.1), display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: i < 2 ? "1px solid rgba(231,211,211,.6)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E7D3D3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#B9375D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "#120608", marginBottom: 3 }}>{d.title}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#5a3040", fontWeight: 300, lineHeight: 1.55 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ ...anim(3, 0.2), background: "#fff", border: "1px solid #E7D3D3", borderRadius: 10, padding: "28px 26px" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#B9375D", marginBottom: 12 }}>Start Growing</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: "#120608", lineHeight: 1.15, marginBottom: 14 }}>
                  Ready to engineer your <em style={{ color: "#D25D5D" }}>growth?</em>
                </div>
                <button className="cta-btn">
                  Work With Us
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <div style={{ ...anim(3, 0.35), background: "#fff", border: "1px solid #E7D3D3", borderRadius: 10, padding: "20px 24px" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#B9375D", marginBottom: 10 }}>Location</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#120608", marginBottom: 5 }}>Lal Kothi, Jaipur</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#5a3040", fontWeight: 300, lineHeight: 1.6 }}>39 Working Labs, Coworking Space<br />Rajasthan – 302015, India</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}