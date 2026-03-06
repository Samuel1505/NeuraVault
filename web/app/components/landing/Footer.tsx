"use client";

import { Brain, Github, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  Product: ["Dashboard", "Consent Manager", "Data Vault", "Payments"],
  Resources: ["Documentation", "API Reference", "Smart Contracts", "Whitepaper"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="container-xl">
        {/* Main footer grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr repeat(4, 1fr)",
            gap: "3rem",
            padding: "4rem 0 3rem",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px var(--primary-glow)",
                }}
              >
                <Brain size={16} color="#fff" strokeWidth={2} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Neural<span style={{ color: "var(--primary-bright)" }}>Vault</span>
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              The first blockchain-powered privacy layer for Brain-Computer Interface data.
              Sovereign identity, granular consent, fair compensation.
            </p>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { Icon: Github, label: "GitHub" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-primary)";
                    el.style.borderColor = "var(--border-default)";
                    el.style.background = "var(--bg-glass-hover)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-muted)";
                    el.style.borderColor = "var(--border-subtle)";
                    el.style.background = "var(--bg-glass)";
                  }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                }}
              >
                {category}
              </h4>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 0",
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © 2026 NeuralVault. All rights reserved.
          </p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            Built on Ethereum. Secured by cryptography.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
