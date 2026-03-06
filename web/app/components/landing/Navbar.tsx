"use client";

import { useState, useEffect } from "react";
import { Brain, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Data Types", href: "#data-types" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition:
          "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        background: scrolled ? "rgba(3, 11, 24, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border-subtle)"
          : "1px solid transparent",
      }}
    >
      <div
        className="container-xl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px var(--primary-glow)",
            }}
          >
            <Brain size={18} color="#fff" strokeWidth={2} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Neural
            <span style={{ color: "var(--primary-bright)" }}>Vault</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                borderRadius: 8,
                transition: "color 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--text-primary)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--bg-glass)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--text-secondary)";
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          className="hidden-mobile"
        >
          <a
            href="#"
            className="btn-outline btn-outline-hover"
            style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}
          >
            Docs
          </a>
          {/* Reown AppKit connect button — themed via createAppKit themeVariables */}
          <appkit-button size="sm" label="Connect Wallet" balance="hide" />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "0.25rem",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(3, 11, 24, 0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "1.25rem 1.5rem 1.75rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--text-secondary)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <a
              href="#"
              className="btn-outline btn-outline-hover"
              style={{ flex: 1, justifyContent: "center" }}
            >
              Docs
            </a>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <appkit-button size="sm" label="Connect Wallet" balance="hide" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        /* Ensure AppKit button aligns visually with other nav buttons */
        appkit-button {
          --wui-border-radius-s: var(--radius-md);
        }
      `}</style>
    </header>
  );
}
