import { UserPlus, SlidersHorizontal, Wallet } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register & Create Your Vault",
    description:
      "Connect your wallet, register your on-chain identity, and upload your encrypted BCI data to a decentralized IPFS vault. Your encryption keys never leave your device.",
    detail: "Supports EEG, fMRI, EMG, ECoG, MEG and more",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Set Your Consent Rules",
    description:
      "Define exactly who can access your data, at what consent level (anonymized, aggregated, or raw), for how long, and for what specific research purpose.",
    detail: "Granular per-data-type consent preferences",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Earn Compensation",
    description:
      "Approved researchers pay directly to your wallet through a smart contract escrow. Compensation is released upon access and you can revoke at any time.",
    detail: "Instant settlement via smart contract",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-pad"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="container-xl">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            How It Works
          </span>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Three simple steps to data sovereignty
          </h2>
          <p
            className="section-subtitle"
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            From registration to earning — the entire flow is transparent, on-chain, and
            fully under your control.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            position: "relative",
          }}
          className="steps-grid"
        >
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              top: "3.5rem",
              left: "calc(16.66% + 24px)",
              right: "calc(16.66% + 24px)",
              height: "1px",
              background:
                "linear-gradient(90deg, var(--border-default) 0%, var(--primary-border) 50%, var(--border-default) 100%)",
              zIndex: 0,
            }}
            className="step-line"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 1.75rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Step Number + Icon Circle */}
                <div
                  className="glass-card animate-pulse-glow"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.75rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Icon size={26} color="var(--primary-bright)" strokeWidth={1.5} />
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      color: "#fff",
                      border: "2px solid var(--bg-surface)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.75rem 1.5rem",
                    borderRadius: "var(--radius-lg)",
                    width: "100%",
                    textAlign: "left",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      marginBottom: "1rem",
                    }}
                  >
                    {step.description}
                  </p>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--primary-bright)",
                      letterSpacing: "0.03em",
                      padding: "0.3rem 0.75rem",
                      background: "rgba(45, 91, 163, 0.1)",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .steps-grid {
          align-items: start;
        }
        @media (max-width: 768px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .step-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}
