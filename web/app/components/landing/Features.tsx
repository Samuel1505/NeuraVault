"use client";

import { Fingerprint, ToggleRight, CircleDollarSign, KeyRound, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Identity Registry",
    description:
      "Create a sovereign digital identity linked to your encrypted BCI data vault on IPFS. Your public key hash stays on-chain while sensitive data remains private.",
    tag: "Identity",
    large: true,
    highlight:
      "Your identity is a cryptographic proof — not a username and password.",
  },
  {
    icon: ToggleRight,
    title: "Consent Manager",
    description:
      "Set granular consent preferences per data type. Control who accesses what, for how long, and for which research purpose.",
    tag: "Consent",
    large: false,
  },
  {
    icon: CircleDollarSign,
    title: "Payment Distributor",
    description:
      "Earn fair compensation every time a researcher accesses your neural data. Payments are escrowed and released automatically.",
    tag: "Payments",
    large: false,
  },
  {
    icon: KeyRound,
    title: "Privacy Layer",
    description:
      "All data is encrypted with AES-256-GCM before upload. Only you hold the encryption keys — not us, not the researchers.",
    tag: "Privacy",
    large: false,
  },
];

export default function Features() {
  return (
    <section id="features" className="section-pad" style={{ background: "var(--bg-base)" }}>
      <div className="container-xl">
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            Platform Features
          </span>
          <h2 className="section-title" style={{ marginBottom: "1rem", maxWidth: 520 }}>
            Everything you need to control your neural data
          </h2>
          <p className="section-subtitle">
            Four core modules working together to give you complete sovereignty
            over your brain-computer interface data.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto auto",
            gap: "1rem",
          }}
        >
          {/* Large Feature Card — Identity Registry */}
          <FeatureCard
            feature={FEATURES[0]}
            gridStyle={{
              gridColumn: "span 7",
              gridRow: "1",
            }}
          />

          {/* Consent Manager */}
          <FeatureCard
            feature={FEATURES[1]}
            gridStyle={{
              gridColumn: "span 5",
              gridRow: "1",
            }}
          />

          {/* Payment Distributor */}
          <FeatureCard
            feature={FEATURES[2]}
            gridStyle={{
              gridColumn: "span 5",
              gridRow: "2",
            }}
          />

          {/* Privacy Layer */}
          <FeatureCard
            feature={FEATURES[3]}
            gridStyle={{
              gridColumn: "span 7",
              gridRow: "2",
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-bento > div {
            grid-column: span 12 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

function FeatureCard({
  feature,
  gridStyle,
}: {
  feature: (typeof FEATURES)[0];
  gridStyle: React.CSSProperties;
}) {
  const Icon = feature.icon;
  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        ...gridStyle,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minHeight: 240,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "var(--primary-glow)",
          filter: "blur(60px)",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* Icon + Tag Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgba(45, 91, 163, 0.12)",
            border: "1px solid var(--primary-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color="var(--primary-bright)" strokeWidth={1.5} />
        </div>
        <span className="label-tag" style={{ fontSize: "0.7rem" }}>
          {feature.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7, flex: 1 }}>
        {feature.description}
      </p>

      {/* Highlight quote (only on large card) */}
      {feature.highlight && (
        <div
          style={{
            borderLeft: "2px solid var(--primary-bright)",
            paddingLeft: "0.85rem",
            marginTop: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
            {feature.highlight}
          </p>
        </div>
      )}

      {/* Learn more link */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "auto", paddingTop: "0.5rem" }}>
        <a
          href="#"
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--primary-bright)",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            transition: "gap 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.gap = "0.55rem";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.gap = "0.3rem";
          }}
        >
          Learn more <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}
