"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Brain, Layers, ShieldCheck, Zap, Info } from "lucide-react";
import UploadForm from "./components/UploadForm";

const TIPS = [
  {
    icon: <ShieldCheck size={16} />,
    title: "Your data is encrypted",
    desc: "Files are pinned on IPFS via Pinata. Only approved researchers with valid credentials can access the download link.",
  },
  {
    icon: <Zap size={16} />,
    title: "Instant on-chain payments",
    desc: "When a researcher purchases access, payment is automatically escrowed and released to your wallet address.",
  },
  {
    icon: <Layers size={16} />,
    title: "Set granular requirements",
    desc: "Control who can access your data with wallet, institution, and balance requirements before payment.",
  },
];

export default function OwnerPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── Header ── */}
      <header
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: "0.82rem",
                fontFamily: "var(--font-body)", transition: "color 0.2s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div style={{ width: 1, height: 18, background: "var(--border-subtle)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px var(--primary-glow)" }}>
                <Brain size={14} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>
                Neural<span style={{ color: "var(--primary-bright)" }}>Vault</span>
              </span>
            </div>
          </div>

          <span className="label-tag" style={{ fontSize: "0.7rem", borderColor: "rgba(34,197,94,0.35)", color: "#22c55e", background: "rgba(34,197,94,0.08)" }}>
            <Layers size={10} /> Owner Portal
          </span>
        </div>
      </header>

      {/* ── Hero bar ── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "2.5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="dot-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.2, zIndex: 0 }} />
        <div style={{ position: "absolute", top: "-20%", left: "-5%", width: "40vw", height: "200%", background: "radial-gradient(ellipse,rgba(34,197,94,0.08) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex", borderColor: "rgba(34,197,94,0.35)", color: "#22c55e", background: "rgba(34,197,94,0.08)", fontSize: "0.7rem" }}>
            <ShieldCheck size={10} /> Pinata IPFS Storage
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            Upload Your{" "}
            <span className="gradient-text">BCI Dataset</span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: 520, lineHeight: 1.65 }}>
            Publish your brain-computer interface data to the NeuralVault marketplace. Set your price, requirements, and earn when researchers purchase access.
          </p>
        </div>
      </div>

      {/* ── Two-column Layout ── */}
      <main style={{ padding: "2.5rem 1.5rem 5rem" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2rem",
            alignItems: "flex-start",
          }}
          className="owner-layout"
        >
          {/* Left: Upload Form */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
            }}
          >
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>
                Dataset Details
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Fill in the metadata, set your requirements, then upload.
              </p>
            </div>
            <UploadForm />
          </div>

          {/* Right: Tips sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: 80 }} className="owner-sidebar">

            {/* Info note */}
            <div
              style={{
                display: "flex", alignItems: "flex-start", gap: "0.75rem",
                padding: "1rem", background: "rgba(61,111,189,0.07)",
                border: "1px solid rgba(61,111,189,0.2)", borderRadius: "var(--radius-md)",
                fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65,
              }}
            >
              <Info size={14} color="var(--primary-bright)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                You need a <strong style={{ color: "var(--text-primary)" }}>Pinata API JWT</strong> in your{" "}
                <code style={{ background: "var(--bg-elevated)", padding: "0.1rem 0.35rem", borderRadius: 4, fontSize: "0.72rem" }}>.env.local</code>{" "}
                to enable uploads. See the setup guide below.
              </span>
            </div>

            {/* Tips */}
            {TIPS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass-card"
                style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(45,91,163,0.12)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-bright)", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {title}
                  </h4>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}

            {/* Env setup hint */}
            <div
              style={{
                background: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
              }}
            >
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                .env.local setup
              </h4>
              <pre style={{ fontSize: "0.7rem", color: "var(--primary-bright)", background: "var(--bg-elevated)", padding: "0.75rem", borderRadius: "var(--radius-sm)", overflowX: "auto", lineHeight: 1.8, margin: 0 }}>
{`NEXT_PUBLIC_PINATA_JWT=eyJ...
NEXT_PUBLIC_PINATA_GATEWAY=
  https://gateway.pinata.cloud`}
              </pre>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.65rem", lineHeight: 1.6 }}>
                Get your JWT at{" "}
                <a href="https://app.pinata.cloud/developers/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-bright)", textDecoration: "underline" }}>
                  app.pinata.cloud
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .owner-layout { grid-template-columns: 1fr !important; }
          .owner-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}
