"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ... Types and NAV_LINKS remain the same ...
interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
`;

export default function Navbar() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false); // Hydration Fix
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Fix hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!hasMounted) return;
    const target = hoveredLink ?? pathname;
    const el = linkRefs.current[target];
    const nav = navRef.current;
    if (!el || !nav) {
      if (!hoveredLink) setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [hoveredLink, pathname, hasMounted]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // If not mounted, return a minimal version or null to match SSR
  if (!hasMounted) return <header style={{ height: "80px" }} />;

  return (
    <>
      <style>{FONT_IMPORT}{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-link-item {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(26, 10, 15, 0.55);
          text-decoration: none;
          padding: 6px 0;
          transition: color 0.25s ease;
          white-space: nowrap;
        }
        .nav-link-item:hover, .nav-link-item.active { color: #B9375D; }
        .mobile-link {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(26,10,15,0.55);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid rgba(185,55,93,0.07);
        }
        .hamburger-line {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #B9375D;
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          nav[aria-label="Main navigation"] { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          animation: "navSlideDown 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both",
          transition: "all 0.4s ease",
          background: scrolled ? "rgba(238,238,238,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(1.4)" : "none",
          borderBottom: scrolled ? "1px solid rgba(185,55,93,0.12)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 40px",
            height: scrolled ? "64px" : "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "height 0.4s ease",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "#1a0a0f" }}>
              NoirSeven
            </span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "9.5px", fontStyle: "italic", letterSpacing: "3.5px", color: "#B9375D", textTransform: "uppercase" }}>
              Digital & Software Solution
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} style={{ display: "flex", alignItems: "center", gap: "36px", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                bottom: -2,
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: "1px",
                background: "linear-gradient(90deg, #B9375D, #D25D5D)",
                opacity: indicatorStyle.opacity,
                transition: "left 0.3s ease, width 0.3s ease, opacity 0.2s ease",
              }}
            />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => { linkRefs.current[link.href] = el; }}
                className={`nav-link-item${isActive(link.href) ? " active" : ""}`}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px" }}
          >
            <span className="hamburger-line" style={{ transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
            <span className="hamburger-line" style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="hamburger-line" style={{ transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "rgba(238,238,238,0.97)", backdropFilter: "blur(16px)", padding: "8px 40px 28px", animation: "menuFadeIn 0.28s ease both" }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`mobile-link${isActive(link.href) ? " active" : ""}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}