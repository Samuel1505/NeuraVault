"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import RoleSelectionModal from "@/app/components/RoleSelectionModal";

const STATS = [
  { value: "2,400+", label: "Data Vaults Created" },
  { value: "98%", label: "Privacy Score" },
  { value: "$1.2M+", label: "Total Distributed" },
  { value: "340+", label: "Active Researchers" },
];

export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "80px",
      }}
    >
      {/* ── Background Layers ── */}
      <div
        className="dot-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          zIndex: 0,
        }}
      />
      {/* Radial glow top-center */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at center, rgba(30,58,110,0.38) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "40%",
          background:
            "linear-gradient(to top, var(--bg-base) 0%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Main Content ── */}
      <div
        className="container-xl"
        style={{ position: "relative", zIndex: 2, paddingTop: "5rem", paddingBottom: "4rem" }}
      >
        {/* Badge */}
        <div
          className="animate-fade-up"
          style={{ marginBottom: "1.75rem" }}
        >
          <span className="label-tag">
            <ShieldCheck size={11} />
            Blockchain-Powered Neural Privacy
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up animate-fade-up-delay-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "1.5rem",
            maxWidth: "820px",
          }}
        >
          Own Your{" "}
          <span className="gradient-text">Neural Data.</span>
          <br />
          Earn From It.
        </h1>

        {/* Sub-headline */}
        <p
          className="animate-fade-up animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            maxWidth: "560px",
            marginBottom: "2.5rem",
            fontWeight: 400,
          }}
        >
          The first blockchain-powered privacy layer for Brain-Computer Interface
          data. Sovereign identity, granular consent, and fair compensation —{" "}
          <span style={{ color: "var(--text-primary)" }}>all on-chain.</span>
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up animate-fade-up-delay-3"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "5rem" }}
        >
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary btn-primary-hover"
            style={{ fontSize: "0.95rem", padding: "0.85rem 2rem" }}
          >
            Get Started
            <ArrowRight size={16} />
          </button>
          <a href="#" className="btn-outline btn-outline-hover" style={{ fontSize: "0.95rem", padding: "0.85rem 2rem" }}>
            Read the Docs
          </a>
        </div>

        {/* Stats Cards Row */}
        <div
          className="animate-fade-up animate-fade-up-delay-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "1rem",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover"
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "0.35rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative floating element */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          right: "8%",
          top: "30%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          opacity: 0.35,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "var(--primary-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px var(--primary-glow)",
            }}
          >
            <Zap size={40} color="var(--primary-bright)" />
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showModal && <RoleSelectionModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
