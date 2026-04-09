"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PANELS = ["Hero", "Education", "Healthcare", "Digital Vision", "Philosophy"];

const educationItems = [
  {
    degree: "B.Com (Hons.)",
    institution: "Sri Guru Gobind Singh College of Commerce · University of Delhi",
  },
  {
    degree: "CS Executive Program",
    institution: "Company Secretaryship · Compliance & Corporate Governance",
  },
  {
    degree: "LL.B. & LL.M.",
    institution: "Bachelor & Master of Laws · Legal Strategy & Regulatory Precision",
  },
];

const pillars = [
  {
    title: "Quality Over Quantity",
    desc: "Every engagement is a strategic collaboration, not a transaction",
  },
  {
    title: "Digital Assets, Not Campaigns",
    desc: "Building long-term brand equity through systems and data",
  },
  {
    title: "Strict Timelines & Accountability",
    desc: "Military-grade discipline applied to every deliverable",
  },
  {
    title: "Psychology & Strategic Visibility",
    desc: "Understanding the human behind every click and conversion",
  },
];

export default function MeetTheLeader() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState<boolean[]>([true, false, false, false, false]);

  const scrollToPanel = useCallback((idx: number) => {
    panelRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = panelRefs.current.indexOf(e.target as HTMLElement);
          if (idx === -1) return;
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            setCurrent(idx);
          }
          if (e.isIntersecting) {
            setInView((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    panelRefs.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown")
        scrollToPanel(Math.min(current + 1, 4));
      if (e.key === "ArrowUp" || e.key === "PageUp")
        scrollToPanel(Math.max(current - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, scrollToPanel]);

  const anim = (idx: number, delay = 0) => ({
    opacity: inView[idx] ? 1 : 0,
    transform: inView[idx] ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        :root {
          --crimson: #B9375D;
          --rose: #D25D5D;
          --blush: #E7D3D3;
          --pale: #EEEEEE;
          --ink: #1a0a0e;
          --muted: #6b4050;
          --light: #fff8f8;
        }
        #leader-scroller {
          width: 100%;
          height: 100vh;
          overflow-y: scroll;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        #leader-scroller::-webkit-scrollbar { display: none; }
        .leader-panel {
          width: 100%;
          height: 100vh;
          min-height: 100vh;
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .panel-num {
          position: absolute;
          top: 28px;
          right: 36px;
          font-family: 'DM Serif Display', serif;
          font-size: 90px;
          color: var(--blush);
          opacity: 0.35;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          font-style: italic;
        }
        .stat-card:hover { transform: translateY(-4px) !important; border-color: var(--crimson) !important; }
        @keyframes bounce { to { transform: rotate(45deg) translateY(4px); } }
        .arrow-down {
          width: 18px; height: 18px;
          border-right: 1.5px solid var(--crimson);
          border-bottom: 1.5px solid var(--crimson);
          transform: rotate(45deg);
          animation: bounce 0.8s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Fixed progress dots */}
      <div style={{
        position: "fixed", right: 22, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 10, zIndex: 100,
      }}>
        {PANELS.map((_, i) => (
          <div
            key={i}
            onClick={() => scrollToPanel(i)}
            style={{
              width: 7, height: 7, borderRadius: "50%", cursor: "pointer",
              background: current === i ? "#B9375D" : "#E7D3D3",
              border: "1.5px solid #B9375D",
              transform: current === i ? "scale(1.3)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Fixed counter */}
      <div style={{
        position: "fixed", left: 22, bottom: 24, zIndex: 100,
        fontFamily: "'DM Sans', sans-serif", fontSize: 10,
        letterSpacing: "0.15em", color: "#6b4050", textTransform: "uppercase",
      }}>
        {String(current + 1).padStart(2, "0")} / 05
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center",
        gap: 6, opacity: current === 4 ? 0 : 1, transition: "opacity 0.5s",
        fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: "0.15em",
        color: "#6b4050", textTransform: "uppercase",
      }}>
        <div className="arrow-down" />
        scroll
      </div>

      <div id="leader-scroller" ref={scrollerRef}>

        {/* ── PANEL 1 — HERO ── */}
        <section
          className="leader-panel"
          ref={(el) => { panelRefs.current[0] = el; }}
          style={{ background: "#EEEEEE" }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 70% 50%,rgba(185,55,93,.07) 0%,transparent 60%), radial-gradient(ellipse at 10% 80%,rgba(231,211,211,.4) 0%,transparent 50%)",
          }} />
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: "50%", width: 1,
            background: "linear-gradient(to bottom,transparent,#E7D3D3 30%,#E7D3D3 70%,transparent)",
            opacity: 0.5,
          }} />
          <div className="panel-num">01</div>
          <div style={{
            position: "relative", zIndex: 2, maxWidth: 900, width: "90%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "center",
          }}>
            <div style={{ paddingRight: 60 }}>
              <div style={{ ...anim(0, 0), fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B9375D", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 28, height: 1, background: "#B9375D", display: "inline-block" }} />
                Meet the Leader
              </div>
              <h1 style={{ ...anim(0, 0.1), fontFamily: "'DM Serif Display',serif", fontSize: "clamp(42px,6vw,72px)", fontWeight: 400, color: "#1a0a0e", lineHeight: 1.02, marginBottom: 16 }}>
                Kanishkk<br /><em style={{ color: "#D25D5D" }}>Bansal</em>
              </h1>
              <p style={{ ...anim(0, 0.2), fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#6b4050", lineHeight: 1.7, fontWeight: 300, maxWidth: 320 }}>
                Founder of NoirSeven — a multidisciplinary entrepreneur at the intersection of medicine, law, commerce, and digital strategy.
              </p>
            </div>
            <div style={{ ...anim(0, 0.3), paddingLeft: 60 }}>
              <div style={{
                width: 260, height: 320, border: "1px solid #E7D3D3", borderRadius: 4,
                background: "linear-gradient(135deg,#E7D3D3 0%,#f5e8e8 100%)",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 72, color: "#B9375D", opacity: 0.25, fontStyle: "italic", userSelect: "none" }}>KB</span>
                <div style={{
                  position: "absolute", top: -10, right: -10, width: 80, height: 80,
                  borderTop: "1.5px solid #B9375D", borderRight: "1.5px solid #B9375D",
                  borderRadius: "0 4px 0 0", opacity: 0.4,
                }} />
                <div style={{
                  position: "absolute", bottom: 16, left: 16, right: 16,
                  background: "rgba(255,255,255,.92)", border: "1px solid #E7D3D3",
                  borderRadius: 4, padding: "10px 14px",
                }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 15, color: "#1a0a0e" }}>Kanishkk Bansal</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#6b4050", fontWeight: 300, marginTop: 2, letterSpacing: "0.05em" }}>Founder & Vision Lead · NOIRSEVEN</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PANEL 2 — EDUCATION ── */}
        <section
          className="leader-panel"
          ref={(el) => { panelRefs.current[1] = el; }}
          style={{ background: "#fff8f8" }}
        >
          <div className="panel-num">02</div>
          <div style={{
            maxWidth: 860, width: "90%",
            display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "center",
          }}>
            <div>
              <div style={{ ...anim(1, 0), fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B9375D", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 20, height: 1, background: "#B9375D", display: "inline-block" }} />
                Academic Foundation
              </div>
              <h2 style={{ ...anim(1, 0.1), fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#1a0a0e", lineHeight: 1.1, marginBottom: 10 }}>
                Built on <em style={{ color: "#D25D5D" }}>discipline</em><br />and rigor.
              </h2>
              <p style={{ ...anim(1, 0.2), fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#6b4050", lineHeight: 1.7, fontWeight: 300 }}>
                A rare combination of commerce, law, and governance — each degree adding a layer of structured thinking and strategic clarity.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {educationItems.map((item, i) => (
                <div key={i} style={{
                  ...anim(1, 0.1 + i * 0.1),
                  background: "#fff", border: "1px solid #E7D3D3",
                  borderLeft: "3px solid #B9375D", borderRadius: "0 6px 6px 0",
                  padding: "14px 18px",
                }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, color: "#1a0a0e" }}>{item.degree}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b4050", marginTop: 3, fontWeight: 300, letterSpacing: "0.03em" }}>{item.institution}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANEL 3 — HEALTHCARE ── */}
        <section
          className="leader-panel"
          ref={(el) => { panelRefs.current[2] = el; }}
          style={{ background: "#EEEEEE" }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 15%,rgba(185,55,93,.06) 0%,transparent 45%)" }} />
          <div className="panel-num">03</div>
          <div style={{ position: "relative", zIndex: 2, maxWidth: 900, width: "90%" }}>
            <div style={{ ...anim(2, 0), fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B9375D", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 1, background: "#B9375D", display: "inline-block" }} />
              Healthcare Leadership
            </div>
            <h2 style={{ ...anim(2, 0.1), fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#1a0a0e", lineHeight: 1.08, marginBottom: 10 }}>
              Running hospitals<br />before running <em style={{ color: "#D25D5D" }}>agencies.</em>
            </h2>
            <p style={{ ...anim(2, 0.2), fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#6b4050", lineHeight: 1.75, fontWeight: 300, maxWidth: 680, marginBottom: 32 }}>
              Kanishkk has served as Administrator and CEO of three multidisciplinary hospitals across Yamunanagar and Jaipur — grounded in high-performance team management, regulatory accuracy, and operational excellence. He owns a hospital in Hisar, Haryana, a testament to his ability to build, scale, and sustain complex service-oriented institutions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { num: "3+", label: "Hospitals led as\nCEO & Administrator" },
                { num: "1", label: "Hospital owned\nin Hisar, Haryana" },
                { num: "2", label: "Cities — Yamunanagar\n& Jaipur operations" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{
                  ...anim(2, 0.2 + i * 0.1),
                  background: "#fff", border: "1px solid #E7D3D3", borderRadius: 8,
                  padding: "22px 20px", textAlign: "center", transition: "transform 0.3s, border-color 0.3s",
                }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 38, color: "#B9375D", lineHeight: 1, marginBottom: 6 }}>{s.num}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b4050", fontWeight: 400, lineHeight: 1.5, whiteSpace: "pre-line" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANEL 4 — DIGITAL VISION ── */}
        <section
          className="leader-panel"
          ref={(el) => { panelRefs.current[3] = el; }}
          style={{ background: "#1a0a0e" }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 30% 60%,rgba(185,55,93,.15) 0%,transparent 50%), radial-gradient(ellipse at 80% 20%,rgba(210,93,93,.08) 0%,transparent 40%)",
          }} />
          <div className="panel-num" style={{ color: "rgba(255,255,255,.06)" }}>04</div>
          <div style={{
            position: "relative", zIndex: 2, maxWidth: 860, width: "90%",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
          }}>
            <div>
              <div style={{ ...anim(3, 0), fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#D25D5D", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 20, height: 1, background: "#D25D5D", display: "inline-block" }} />
                A New Chapter
              </div>
              <h2 style={{ ...anim(3, 0.1), fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, marginBottom: 16 }}>
                Digital leadership<br />as a <em style={{ color: "#D25D5D" }}>system,</em><br />not a trend.
              </h2>
              <p style={{ ...anim(3, 0.2), fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.75, fontWeight: 300 }}>
                After mastering healthcare operations, Kanishkk discovered a critical gap: most firms don't fail on service quality — they fail on digital positioning. NOIRSEVEN was his answer.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pillars.map((p, i) => (
                <div key={i} style={{
                  ...anim(3, 0.1 + i * 0.1),
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(231,211,211,.12)",
                  borderLeft: "2px solid #B9375D",
                  borderRadius: "0 6px 6px 0",
                  padding: "14px 18px",
                }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "#fff", marginBottom: 3, letterSpacing: "0.03em" }}>{p.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.45)", fontWeight: 300, lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANEL 5 — PHILOSOPHY + ADDRESS ── */}
        <section
          className="leader-panel"
          ref={(el) => { panelRefs.current[4] = el; }}
          style={{ background: "#fff8f8" }}
        >
          <div className="panel-num">05</div>
          <div style={{
            maxWidth: 860, width: "90%",
            display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center",
          }}>
            <div style={{
              ...anim(4, 0),
              position: "relative", padding: "40px 36px",
              background: "#fff", border: "1px solid #E7D3D3", borderRadius: 8,
            }}>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 110, color: "#E7D3D3", lineHeight: 0.5, position: "absolute", top: 20, left: 22, userSelect: "none" }}>"</div>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(20px,2.5vw,28px)", fontStyle: "italic", color: "#1a0a0e", lineHeight: 1.35, position: "relative", zIndex: 2, marginTop: 30 }}>
                Excellence is not accidental.<br />It is engineered.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#B9375D", fontWeight: 500, letterSpacing: "0.1em", marginTop: 18, textTransform: "uppercase" }}>
                — Kanishkk Bansal, Founder NOIRSEVEN
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                ...anim(4, 0.15),
                background: "#fff", border: "1px solid #E7D3D3", borderRadius: 8, padding: "20px 22px",
              }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B9375D", marginBottom: 10 }}>Where Ideas Travel</div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, color: "#1a0a0e", marginBottom: 6 }}>NOIRSEVEN Digital & Software Solutions</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6b4050", fontWeight: 300, lineHeight: 1.6 }}>
                  39 Working Labs, Coworking Space<br />Lal Kothi, Jaipur, Rajasthan – 302015<br />India
                </div>
              </div>
              <div style={{
                ...anim(4, 0.3),
                background: "#fff", border: "1px solid #E7D3D3", borderRadius: 8, padding: "20px 22px",
              }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B9375D", marginBottom: 10 }}>Expert Team</div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 16, color: "#1a0a0e", marginBottom: 14 }}>A Full-Spectrum Studio</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Designers", "SEO", "Content", "Brand", "Video", "Strategy"].map((t) => (
                    <span key={t} style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 500,
                      letterSpacing: "0.1em", textTransform: "uppercase", color: "#B9375D",
                      padding: "4px 10px", border: "1px solid #E7D3D3", borderRadius: 100, background: "#fff",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}