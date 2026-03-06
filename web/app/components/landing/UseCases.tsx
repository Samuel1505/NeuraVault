import { Microscope, GraduationCap, Building2, Code2 } from "lucide-react";

const USE_CASES = [
  {
    icon: Microscope,
    title: "Medical Researchers",
    description:
      "Access consented, high-quality neural datasets for disease research and treatment development. Cryptographic provenance guarantees data authenticity.",
    tag: "Healthcare",
    stat: "840+ datasets available",
  },
  {
    icon: GraduationCap,
    title: "Neuroscientists",
    description:
      "Study brain activity patterns with cryptographically verified, tamper-proof data provenance. Reproducible research with on-chain consent logs.",
    tag: "Research",
    stat: "12 academic institutions",
  },
  {
    icon: Code2,
    title: "BCI Developers",
    description:
      "Test and validate your BCI devices with diverse, ethically-sourced neural training data. Access real-world signals across multiple modalities.",
    tag: "Engineering",
    stat: "6 data modalities",
  },
  {
    icon: Building2,
    title: "Academic Institutions",
    description:
      "Conduct reproducible research with immutable data records and on-chain consent logs. IRB-compliant data sharing built into the protocol.",
    tag: "Academia",
    stat: "100% consent-verified",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="section-pad"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="container-xl">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            Who Benefits
          </span>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Powering the next generation
            <br />
            of brain science
          </h2>
          <p
            className="section-subtitle"
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            NeuralVault creates a trustless marketplace connecting BCI data owners with
            the researchers who need it most.
          </p>
        </div>

        {/* Use case cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div
                key={i}
                className="glass-card glass-card-hover"
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Tag */}
                <span className="label-tag" style={{ alignSelf: "flex-start", fontSize: "0.68rem" }}>
                  {uc.tag}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 13,
                    background: "rgba(45, 91, 163, 0.1)",
                    border: "1px solid var(--primary-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} color="var(--primary-bright)" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {uc.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  {uc.description}
                </p>

                {/* Stat */}
                <div
                  style={{
                    paddingTop: "0.875rem",
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--primary-bright)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {uc.stat}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
