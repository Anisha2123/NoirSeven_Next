"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";

// ─── Color palette ────────────────────────────────────────────────
const C = {
  crimson : "#B9375D",
  rose    : "#D25D5D",
  blush   : "#E7D3D3",
  snow    : "#EEEEEE",
  ink     : "#1a0a0f",
};

// ─── Team data ────────────────────────────────────────────────────
const TEAM = [
  {
    id        : 1,
    name      : "Ms. Aditi Sharma",
    firstName : "Aditi",
    role      : "Content Strategist",
    dept      : "Performance Marketing",
    since     : "2022",
    image     : "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=85",
    tag       : "Strategy · Design",
    expertise : ["Performance Ad Campaigns (Meta & Google)", "Organic Brand Growth Strategy", "Content Planning & Brand Positioning", "Graphic Designing & Creative Direction"],
    industries: ["Cafés & Restaurants", "Yoga & Wellness", "Real Estate", "Men's Grooming"],
    bio       : "Aditi has worked in digital marketing for more than three years and is a results-oriented content strategist. She has been assisting brands in scaling since 2022 by combining organic growth tactics, paid advertising, and captivating visual storytelling. Her primary focus at NOIRSEVEN is transforming innovative concepts into quantifiable performance results.",
    belief    : "Developing a strong visual identity that turns attention into action, understanding audience psychology, and developing effective content funnels are all important components of digital success.",
  },
  {
    id        : 2,
    name      : "Ms. Anisha Birla",
    firstName : "Anisha",
    role      : "Software Developer Engineer",
    dept      : "Web Development",
    since     : "2022",
    image     : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85",
    tag       : "Build · Deploy",
    expertise : ["MERN Stack (MongoDB, Express, React, Node)", "Next.js, Angular, AWS & Vercel", "Web App Architecture & Deployment", "Clean, Scalable Code Architecture"],
    industries: ["10+ Live Websites", "MNCs (Paltech, PSDC)", "Business Web Solutions", "Full-Stack Development"],
    bio       : "Ms. Anisha Birla is a Software Developer Engineer at NOIRSEVEN with over 2 years of web application experience. She previously worked with large MNCs including Paltech and PSDC. She holds a B.Tech in Computer Science and currently manages 10+ live websites, ensuring they are performant, secure, and user-friendly.",
    belief    : "Building something from plan to deployment with clean, reliable code that genuinely meets the needs of businesses.",
  },
  {
    id        : 3,
    name      : "Ms. Bhoomi Goyal",
    firstName : "Bhoomi",
    role      : "Content Writer",
    dept      : "Content & Strategy",
    since     : "2020",
    image     : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=85",
    tag       : "Research · Authority",
    expertise : ["Long-form & Strategic Website Content", "Brand Storytelling Frameworks", "Journalism-grade Research & Analysis", "Insight-driven, Audience-focused Writing"],
    industries: ["Media & Journalism", "Academic Research", "Brand Narratives", "Digital Publishing"],
    bio       : "With more than four years of journalism and professional content writing expertise, Bhoomi brings depth and credibility to NOIRSEVEN's content strategy. Currently pursuing a Ph.D. in Journalism, she blends academic rigor with real-world industry knowledge to produce thoroughly researched, audience-focused material.",
    belief    : "Content must display authority and purpose — every piece should be strategically aligned, intellectually sound, and factually impeccable.",
  },
  {
    id        : 4,
    name      : "Ms. Khushbu Tiwari",
    firstName : "Khushbu",
    role      : "Digital Marketer",
    dept      : "Digital Marketing",
    since     : "2019",
    image     : "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=85",
    tag       : "Campaigns · Growth",
    expertise : ["Data-driven Digital Campaign Strategy", "Brand Visibility Optimization", "Multi-platform Customer Engagement", "Strategic Marketing Solutions"],
    industries: ["Business Administration", "Digital Campaigns", "Brand Visibility", "Customer Engagement"],
    bio       : "With over 5 years of experience in digital marketing, Ms. Khushbu Tiwari is a dedicated and result-driven Digital Marketer at NOIRSEVEN. She holds an M.Com with specialization in Business Administration (BADM) and combines her academic knowledge with practical expertise to deliver impactful marketing campaigns.",
    belief    : "Data-driven campaigns that optimize brand visibility and drive real customer engagement across multiple platforms.",
  },
  {
    id        : 5,
    name      : "Ms. Tanu Jain",
    firstName : "Tanu",
    role      : "Digital Marketing Executive",
    dept      : "SEO & Paid Ads",
    since     : "2023",
    image     : "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&q=85",
    tag       : "SEO · Meta Ads",
    expertise : ["Search Engine Optimization (SEO)", "Meta Ads & Paid Advertising", "Audience Targeting & Campaign Optimization", "Performance Metrics & Analytics"],
    industries: ["E-commerce", "Lead Generation", "Brand Visibility", "Organic Growth"],
    bio       : "Ms. Tanu Jain is a skilled and detail-oriented Digital Marketing Executive specializing in SEO and Meta Ads. Holding an M.Com degree, she combines academic expertise with hands-on experience in both organic and paid marketing, focusing on improving website visibility and driving targeted traffic through strategic SEO.",
    belief    : "Staying current with the latest industry trends ensures every campaign is optimized for maximum performance and impact.",
  },
  {
    id        : 6,
    name      : "Ms. Gayatri Bhardwaj",
    firstName : "Gayatri",
    role      : "Researcher",
    dept      : "Research & Content",
    since     : "2024",
    image     : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=85",
    tag       : "Research · Innovation",
    expertise : ["Digital Research & Trend Analysis", "Content Editing & Quality Assurance", "Detail-oriented Problem Solving", "Innovation & Ideation"],
    industries: ["Technology Research", "Content Quality", "Academic Research", "Digital Solutions"],
    bio       : "Gayatri Bhardwaj is a researcher at NOIRSEVEN Digital Solution. She completed her B.Tech and is currently pursuing her M.Tech from JECRC University. New to the industry but full of curiosity and innovation, she approaches every challenge with fresh thinking and a detail-oriented mindset.",
    belief    : "Curiosity and attention to detail are the foundations of great research — always finding new solutions and improving every day.",
  },
];

// ─── Three.js Background ──────────────────────────────────────────
function useTeamThree(mountRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.z = 9;

    // Lights
    scene.add(new THREE.AmbientLight(0xfff0f4, 0.5));
    const pl1 = new THREE.PointLight(0xb9375d, 2.2, 40);
    pl1.position.set(-7, 5, 4);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xd25d5d, 1.6, 30);
    pl2.position.set(8, -4, 2);
    scene.add(pl2);

    // Central connected orb network – 6 nodes representing team members
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodePositions = [
      new THREE.Vector3(-2.5,  1.4,  0),
      new THREE.Vector3( 2.5,  1.4,  0),
      new THREE.Vector3(-3.5, -0.8,  0),
      new THREE.Vector3( 3.5, -0.8,  0),
      new THREE.Vector3(-1.2, -2.4,  0),
      new THREE.Vector3( 1.2, -2.4,  0),
    ];

    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshPhongMaterial({
      color: 0xb9375d, emissive: 0xb9375d, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.75, shininess: 150,
    });
    const nodes: THREE.Mesh[] = nodePositions.map((pos) => {
      const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
      node.position.copy(pos);
      nodeGroup.add(node);
      return node;
    });

    // Connecting lines between nodes
    const connLineMat = new THREE.LineBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.07 });
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        nodeGroup.add(new THREE.Line(lineGeo, connLineMat));
      }
    }

    // Orbital rings around nodes
    const rings: THREE.Mesh[] = [];
    nodePositions.forEach((pos, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.28 + i * 0.03, 0.004, 6, 80),
        new THREE.MeshBasicMaterial({ color: 0xb9375d, transparent: true, opacity: 0.2 })
      );
      ring.position.copy(pos);
      ring.rotation.x = Math.PI / 2 + (i * 0.2);
      ring.rotation.z = i * 0.4;
      rings.push(ring);
      nodeGroup.add(ring);
    });

    // Large background icosahedron
    const bigGeo = new THREE.IcosahedronGeometry(5, 1);
    const bigMat = new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.04 });
    const bigShell = new THREE.Mesh(bigGeo, bigMat);
    scene.add(bigShell);

    // Floating particles
    const particles: { mesh: THREE.Mesh; rx: number; ry: number; vy: number; phase: number }[] = [];
    const pGeos = [new THREE.OctahedronGeometry(0.07, 0), new THREE.TetrahedronGeometry(0.09, 0), new THREE.IcosahedronGeometry(0.06, 0)];
    const pMats = [
      new THREE.MeshBasicMaterial({ color: 0xb9375d, wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshBasicMaterial({ color: 0xd25d5d, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xe7d3d3, wireframe: true, transparent: true, opacity: 0.1 }),
    ];
    for (let i = 0; i < 50; i++) {
      const mesh = new THREE.Mesh(pGeos[i % 3], pMats[i % 3]);
      mesh.position.set((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 24, (Math.random() - 0.5) * 10 - 3);
      mesh.scale.setScalar(0.4 + Math.random() * 1.3);
      particles.push({ mesh, rx: (Math.random() - 0.5) * 0.006, ry: (Math.random() - 0.5) * 0.008, vy: (Math.random() - 0.5) * 0.0018, phase: Math.random() * Math.PI * 2 });
      scene.add(mesh);
    }

    // Dot field
    const dp = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) { dp[i * 3] = (Math.random() - 0.5) * 34; dp[i * 3 + 1] = (Math.random() - 0.5) * 30; dp[i * 3 + 2] = -8 - Math.random() * 6; }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xb9375d, size: 0.028, transparent: true, opacity: 0.13 })));

    // Mouse parallax
    let mouse = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
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

      // Node group gentle rotation
      nodeGroup.rotation.y = Math.sin(t * 0.18) * 0.08 + tgt.x * 0.1;
      nodeGroup.rotation.x = Math.sin(t * 0.12) * 0.05 + tgt.y * 0.06;

      // Rings spin
      rings.forEach((ring, i) => {
        ring.rotation.y += 0.004 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.z += 0.003 * (i % 2 === 0 ? -1 : 1);
      });

      // Node pulse
      nodes.forEach((node, i) => {
        const s = 1 + Math.sin(t * 1.2 + i * 1.1) * 0.18;
        node.scale.setScalar(s);
        (node.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.5 + Math.sin(t * 1.4 + i * 0.9) * 0.3;
      });

      bigShell.rotation.y = t * 0.025;
      bigShell.rotation.x = t * 0.015;
      pl1.intensity = 2.0 + Math.sin(t * 1.1) * 0.4;
      pl2.intensity = 1.4 + Math.cos(t * 0.9) * 0.35;

      particles.forEach(({ mesh, rx, ry, vy, phase }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        mesh.position.y += vy;
        if (mesh.position.y > 12) mesh.position.y = -12;
        if (mesh.position.y < -12) mesh.position.y = 12;
      });

      camera.position.x += (tgt.x * 0.45 - camera.position.x) * 0.02;
      camera.position.y += (tgt.y * 0.28 - camera.position.y) * 0.02;
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

// ─── Member Detail Modal ──────────────────────────────────────────
function MemberModal({
  member,
  onClose,
}: {
  member: typeof TEAM[0] | null;
  onClose: () => void;
}) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (member) {
      setTimeout(() => setVis(true), 10);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [member]);

  const close = useCallback(() => {
    setVis(false);
    setTimeout(onClose, 340);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!member) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: `rgba(15,4,8,${vis ? 0.78 : 0})`,
        backdropFilter: vis ? "blur(12px)" : "blur(0px)",
        transition: "all 0.34s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.snow,
          border: "1px solid rgba(185,55,93,0.18)",
          borderRadius: "2px",
          maxWidth: "760px", width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          transform: vis ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
          opacity: vis ? 1 : 0,
          transition: "all 0.34s cubic-bezier(0.25,0.46,0.45,0.94)",
          scrollbarWidth: "thin", scrollbarColor: `${C.crimson} transparent`,
        }}
      >
        {/* Top strip */}
        <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
          <Image
            src={member.image}
            alt={member.name}
            fill
            style={{ objectFit: "cover", filter: "brightness(0.75) saturate(0.85)" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 20%, rgba(26,10,15,0.85) 100%)",
          }} />

          {/* Close btn */}
          <button
            onClick={close}
            style={{
              position: "absolute", top: "18px", right: "18px",
              background: "rgba(238,238,238,0.1)", border: "1px solid rgba(238,238,238,0.25)",
              color: "rgba(238,238,238,0.7)", width: "36px", height: "36px",
              borderRadius: "50%", cursor: "pointer", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", backdropFilter: "blur(6px)",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = "rgba(185,55,93,0.6)"; (e.currentTarget).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.background = "rgba(238,238,238,0.1)"; (e.currentTarget).style.color = "rgba(238,238,238,0.7)"; }}
          >
            ✕
          </button>

          {/* Name & role overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
              color: C.crimson, marginBottom: "8px",
            }}>
              {member.dept}
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px", fontWeight: 700,
              color: "#fff", margin: "0 0 4px",
              letterSpacing: "-0.5px",
            }}>
              {member.name}
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px", fontStyle: "italic",
              color: "rgba(231,211,211,0.75)", margin: 0,
            }}>
              {member.role}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 36px 36px" }}>
          {/* Bio */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
              color: C.crimson, marginBottom: "12px",
            }}>
              About
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", color: "rgba(26,10,15,0.62)",
              lineHeight: 1.82, margin: 0,
            }}>
              {member.bio}
            </p>
          </div>

          {/* Belief quote */}
          <div style={{
            borderLeft: `2px solid ${C.crimson}`,
            paddingLeft: "20px", marginBottom: "28px",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "17px", fontStyle: "italic",
              color: "rgba(26,10,15,0.55)", lineHeight: 1.6,
              margin: 0,
            }}>
              "{member.belief}"
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Expertise */}
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
                color: C.crimson, marginBottom: "12px",
              }}>
                Core Expertise
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {member.expertise.map((e) => (
                  <div key={e} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: C.crimson, fontSize: "8px", marginTop: "4px", flexShrink: 0 }}>◈</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(26,10,15,0.65)", lineHeight: 1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industries / Experience */}
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
                color: C.crimson, marginBottom: "12px",
              }}>
                Experience
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {member.industries.map((ind) => (
                  <span key={ind} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px", color: C.crimson,
                    background: "rgba(185,55,93,0.07)",
                    border: "1px solid rgba(185,55,93,0.16)",
                    padding: "4px 11px", borderRadius: "1px",
                  }}>
                    {ind}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
                  color: C.crimson, marginBottom: "10px",
                }}>
                  With NOIRSEVEN Since
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px", fontWeight: 700,
                  color: C.ink, letterSpacing: "-1px",
                }}>
                  {member.since}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Team Member Card ─────────────────────────────────────────────
function TeamCard({
  member,
  index,
  onOpen,
}: {
  member: typeof TEAM[0];
  index: number;
  onOpen: (m: typeof TEAM[0]) => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(member)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "2px",
        overflow: "hidden",
        border: hov ? "1px solid rgba(185,55,93,0.42)" : "1px solid rgba(185,55,93,0.1)",
        transform: hov ? "translateY(-7px) scale(1.018)" : "translateY(0) scale(1)",
        transition: "all 0.38s cubic-bezier(0.25,0.46,0.45,0.94)",
        animation: `cardReveal 0.65s ease ${index * 0.08}s both`,
        background: C.snow,
        boxShadow: hov ? "0 20px 48px rgba(185,55,93,0.12)" : "none",
      }}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            objectPosition: "top",
            transform: hov ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
            filter: hov ? "brightness(0.78) saturate(1.05)" : "brightness(0.88) saturate(0.9)",
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 45%, rgba(238,238,238,0.98) 100%)",
          zIndex: 1,
        }} />

        {/* Dept badge */}
        <div style={{
          position: "absolute", top: "14px", left: "14px", zIndex: 2,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase",
          color: "#EEEEEE", background: "rgba(185,55,93,0.85)",
          padding: "4px 10px", borderRadius: "1px",
          backdropFilter: "blur(4px)",
        }}>
          {member.dept}
        </div>

        {/* Index */}
        <div style={{
          position: "absolute", top: "14px", right: "14px", zIndex: 2,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "12px", fontStyle: "italic",
          color: "rgba(238,238,238,0.6)", letterSpacing: "2px",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Hover action overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `rgba(185,55,93,${hov ? 0.12 : 0})`,
          transition: "background 0.35s ease",
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
            color: "#fff",
            background: "rgba(185,55,93,0.85)",
            padding: "10px 20px", borderRadius: "1px",
            transform: hov ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
            opacity: hov ? 1 : 0,
            transition: "all 0.3s ease",
          }}>
            View Profile
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px 24px" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "11px", letterSpacing: "4px",
          color: C.crimson, textTransform: "uppercase",
          marginBottom: "6px",
        }}>
          {member.tag}
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "19px", fontWeight: 600,
          color: C.ink, margin: "0 0 4px",
          letterSpacing: "-0.3px", lineHeight: 1.2,
        }}>
          {member.name}
        </h3>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "14px", fontStyle: "italic",
          color: "rgba(26,10,15,0.48)", margin: "0 0 14px",
        }}>
          {member.role}
        </p>

        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, rgba(185,55,93,${hov ? 0.4 : 0.1}), transparent)`,
          marginBottom: "12px",
          transition: "all 0.35s ease",
          width: hov ? "100%" : "60%",
        }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {member.expertise.slice(0, 2).map((e) => (
            <span key={e} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", letterSpacing: "0.5px",
              color: "rgba(26,10,15,0.45)",
              background: "rgba(185,55,93,0.05)",
              border: "1px solid rgba(185,55,93,0.1)",
              padding: "3px 9px", borderRadius: "1px",
            }}>
              {e.length > 28 ? e.slice(0, 28) + "…" : e}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: "2px",
        width: hov ? "100%" : "0%",
        background: `linear-gradient(90deg, ${C.crimson}, ${C.rose})`,
        transition: "width 0.45s ease",
      }} />
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function OurTeamSection() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const [mounted, setMounted]   = useState(false);
  const [selected, setSelected] = useState<typeof TEAM[0] | null>(null);

  useTeamThree(mountRef);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.snow}; overflow-x: hidden; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseDot {
          0%,100% { transform: scale(1);   opacity: 0.7; }
          50%      { transform: scale(1.6); opacity: 1; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes scrollBounce {
          0%,100% { opacity: 0.3; transform: translateY(0); }
          50%      { opacity: 0.8; transform: translateY(5px); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(185,55,93,0.3); border-radius: 2px; }
      `}</style>

      {/* Three.js canvas */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Vignette overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(238,238,238,0.72) 75%, rgba(238,238,238,0.92) 100%)",
      }} />

      {/* Subtle grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(185,55,93,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(185,55,93,0.035) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 70% 70% at 20% 50%, black 20%, transparent 75%)",
      }} />

      <main style={{ position: "relative", minHeight: "100vh" }}>

        {/* ── HERO HEADER ──────────────────────────────────────── */}
        <section style={{
          position: "relative", zIndex: 2,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "flex-start",
          maxWidth: "1320px", margin: "0 auto",
          padding: "130px 48px 80px",
        }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "24px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.1s both" : "none",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.crimson, animation: "pulseDot 2s ease infinite" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase", fontStyle: "italic" }}>
              NoirSeven Digital & Software Solution
            </span>
          </div>

          {/* Main title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(52px, 8vw, 96px)",
            fontWeight: 700, color: C.ink,
            lineHeight: 1.03, letterSpacing: "-2.5px",
            margin: 0,
            animation: mounted ? "fadeSlideUp 0.75s ease 0.18s both" : "none",
          }}>
            Meet The
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(52px, 8vw, 96px)",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${C.crimson} 0%, ${C.rose} 55%, #c03050 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            lineHeight: 1.03, letterSpacing: "-2.5px",
            margin: "0 0 8px",
            animation: mounted ? "fadeSlideUp 0.75s ease 0.26s both" : "none",
          }}>
            Team
          </h1>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(18px, 2.5vw, 26px)",
            fontStyle: "italic", fontWeight: 400,
            color: "rgba(26,10,15,0.38)",
            margin: "0 0 32px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.34s both" : "none",
          }}>
            "Where Strategy Meets Design"
          </p>

          <div style={{
            width: "48px", height: "1.5px",
            background: `linear-gradient(90deg, ${C.crimson}, transparent)`,
            marginBottom: "26px",
            animation: mounted ? "fadeSlideUp 0.6s ease 0.4s both" : "none",
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 16.5px)",
            color: "rgba(26,10,15,0.52)", lineHeight: 1.82,
            maxWidth: "500px", margin: "0 0 48px",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.46s both" : "none",
          }}>
            A team of six driven specialists — strategists, developers, writers, researchers, and marketers — united by a single mission: to grow your brand with clarity, creativity, and measurable results.
          </p>

          {/* Team stats */}
          <div style={{
            display: "flex", gap: "0",
            animation: mounted ? "fadeSlideUp 0.7s ease 0.54s both" : "none",
          }}>
            {[
              ["6", "Specialists"],
              ["5+", "Years Combined Exp."],
              ["LalKothi", "Jaipur"],
            ].map(([val, lbl], i) => (
              <div key={lbl} style={{
                padding: "0 28px",
                borderRight: i < 2 ? "1px solid rgba(185,55,93,0.15)" : "none",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700, color: C.crimson, lineHeight: 1, letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(26,10,15,0.38)", textTransform: "uppercase", marginTop: "5px" }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div style={{
            position: "absolute", bottom: "44px", left: "48px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            animation: mounted ? "fadeIn 1s ease 1s both" : "none",
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "9px", letterSpacing: "3.5px", color: "rgba(26,10,15,0.25)", textTransform: "uppercase", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
              Meet them
            </span>
            <div style={{ width: "1px", height: "40px", background: `linear-gradient(${C.crimson}, transparent)`, animation: "scrollBounce 2.2s ease infinite" }} />
          </div>

          {/* Decorative rotating ring */}
          <div style={{
            position: "absolute", right: "48px", top: "50%", transform: "translateY(-50%)",
            width: "clamp(200px, 25vw, 340px)", aspectRatio: "1",
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
            animation: mounted ? "fadeIn 1.2s ease 0.6s both" : "none",
          }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(185,55,93,0.18)", animation: "rotateSlow 30s linear infinite" }} />
            <div style={{ position: "absolute", inset: "12%", borderRadius: "50%", border: "1px solid rgba(185,55,93,0.1)", animation: "rotateSlow 22s linear infinite reverse" }} />
            <div style={{ position: "absolute", inset: "26%", borderRadius: "50%", border: "1px solid rgba(185,55,93,0.07)", animation: "rotateSlow 16s linear infinite" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 700, color: C.ink, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Noir</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 700, background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1 }}>Seven</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "9px", letterSpacing: "3px", color: "rgba(26,10,15,0.3)", textTransform: "uppercase", marginTop: "6px" }}>Team</div>
            </div>
            {/* 6 dots around the ring */}
            {TEAM.map((_, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              return (
                <div key={i} style={{
                  position: "absolute",
                  left: `calc(50% + ${Math.cos(angle) * 46}% - 4px)`,
                  top:  `calc(50% + ${Math.sin(angle) * 46}% - 4px)`,
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: C.crimson, opacity: 0.5,
                }} />
              );
            })}
          </div>
        </section>

        {/* ── TEAM GRID ─────────────────────────────────────────── */}
        <section style={{ position: "relative", zIndex: 2, maxWidth: "1320px", margin: "0 auto", padding: "0 48px 120px" }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "52px" }}>
            <div style={{ width: "36px", height: "1px", background: C.crimson }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase" }}>
              The Specialists
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "1px",
            background: "rgba(185,55,93,0.08)",
            border: "1px solid rgba(185,55,93,0.08)",
          }}>
            {TEAM.map((member, i) => (
              <div key={member.id} style={{ background: C.snow }}>
                <TeamCard member={member} index={i} onOpen={setSelected} />
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px", color: "rgba(26,10,15,0.3)",
            textAlign: "center", marginTop: "28px",
            letterSpacing: "1.5px", textTransform: "uppercase",
          }}>
            Click any card to view full profile
          </p>
        </section>

        {/* ── TAGLINE / CTA STRIP ───────────────────────────────── */}
        <section style={{
          position: "relative", zIndex: 2,
          background: "linear-gradient(135deg, #150709 0%, #260a12 50%, #150709 100%)",
          padding: "96px 48px", textAlign: "center", overflow: "hidden",
        }}>
          {/* Concentric rings decoration */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${180 + i * 160}px`, height: `${180 + i * 160}px`,
              border: `1px solid rgba(185,55,93,${0.1 - i * 0.02})`,
              borderRadius: "50%", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", pointerEvents: "none",
            }} />
          ))}

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: C.crimson, textTransform: "uppercase", marginBottom: "18px" }}>
            Our Promise
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 60px)",
            fontWeight: 700, color: C.snow,
            margin: "0 0 14px", letterSpacing: "-1.5px", lineHeight: 1.08,
          }}>
            Where Strategy
          </h2>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 60px)",
            fontWeight: 400, fontStyle: "italic",
            background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            margin: "0 0 28px", letterSpacing: "-1px", lineHeight: 1.08,
          }}>
            Meets Design.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px", color: "rgba(238,238,238,0.42)",
            marginBottom: "44px", maxWidth: "380px", margin: "0 auto 44px", lineHeight: 1.78,
          }}>
            Six specialists, one vision — to grow your brand with precision, creativity, and measurable impact.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/contact" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
              color: C.snow, background: `linear-gradient(135deg, ${C.crimson}, ${C.rose})`,
              textDecoration: "none", padding: "15px 34px", borderRadius: "1px",
              display: "inline-block", transition: "opacity 0.2s, transform 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Work With Us
            </a>
            <a href="/services" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
              color: C.blush, background: "transparent",
              border: "1px solid rgba(231,211,211,0.22)",
              textDecoration: "none", padding: "15px 34px", borderRadius: "1px",
              display: "inline-block", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.crimson; (e.currentTarget as HTMLElement).style.color = C.snow; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,211,211,0.22)"; (e.currentTarget as HTMLElement).style.color = C.blush; }}
            >
              Our Services
            </a>
          </div>
          <div style={{ marginTop: "56px", fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", fontStyle: "italic", color: "rgba(238,238,238,0.18)", letterSpacing: "1px" }}>
            NoirSeven Digital & Software Solution · LalKothi, Jaipur, Rajasthan
          </div>
        </section>
      </main>

      {/* Member Modal */}
      <MemberModal member={selected} onClose={() => setSelected(null)} />
    </>
  );
}