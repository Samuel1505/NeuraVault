import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="section-pad"
      style={{
        background: "var(--bg-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        className="dot-grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.3, zIndex: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "80%",
          background:
            "radial-gradient(ellipse at center, rgba(30,58,110,0.32) 0%, transparent 65%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        className="container-xl"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Main CTA card */}
        <div
          className="glass-card"
          style={{
            maxWidth: 720,
            width: "100%",
            padding: "4rem 3rem",
            borderRadius: "var(--radius-xl)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Inner glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: 2,
              background:
                "linear-gradient(90deg, transparent, var(--primary-bright), transparent)",
            }}
          />

          <span className="label-tag">
            <ShieldCheck size={11} />
            Permissionless. Non-custodial. On-chain.
          </span>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            Ready to take control of
            <br />
            <span className="gradient-text">your neural data?</span>
          </h2>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 480,
              fontWeight: 400,
            }}
          >
            Join thousands of users who have already claimed sovereignty over their
            brain data. No middlemen. No data brokers. Just you and the science.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="#"
              className="btn-primary btn-primary-hover"
              style={{ padding: "0.9rem 2.25rem", fontSize: "0.95rem" }}
            >
              Get Started — It&apos;s Free
              <ArrowRight size={16} />
            </a>
            <a
              href="#"
              className="btn-outline btn-outline-hover"
              style={{ padding: "0.9rem 2.25rem", fontSize: "0.95rem" }}
            >
              Read the Docs
            </a>
          </div>

          {/* Trust sub-line */}
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              marginTop: "-0.5rem",
            }}
          >
            No credit card required · Connect wallet to start · Revoke access at any time
          </p>
        </div>
      </div>
    </section>
  );
}
