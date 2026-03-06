import { Cpu, Lock, HardDrive, Link2, FlaskConical, ArrowRight } from "lucide-react";

const ARCH_NODES = [
  {
    icon: Cpu,
    label: "BCI Device",
    desc: "Neural signal acquisition",
  },
  {
    icon: Lock,
    label: "Encrypted Upload",
    desc: "AES-256-GCM client-side",
  },
  {
    icon: HardDrive,
    label: "IPFS Vault",
    desc: "Decentralized storage",
  },
  {
    icon: Link2,
    label: "Blockchain Registry",
    desc: "Identity & consent on-chain",
  },
  {
    icon: FlaskConical,
    label: "Researcher Access",
    desc: "Consented & compensated",
  },
];

export default function Architecture() {
  return (
    <section
      id="architecture"
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
            The Technology Stack
          </span>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Built on battle-tested infrastructure
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
            Every component is auditable, decentralized, and designed with privacy-by-default
            at every layer of the stack.
          </p>
        </div>

        {/* Architecture flow */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "0",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
          className="arch-flow"
        >
          {ARCH_NODES.map((node, i) => {
            const Icon = node.icon;
            const isLast = i === ARCH_NODES.length - 1;
            return (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 150 }}
              >
                {/* Node card */}
                <div
                  className="glass-card glass-card-hover"
                  style={{
                    flex: 1,
                    padding: "1.75rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem",
                    borderRadius: "var(--radius-md)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: "rgba(45, 91, 163, 0.12)",
                      border: "1px solid var(--primary-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color="var(--primary-bright)" strokeWidth={1.5} />
                  </div>

                  {/* Label */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.35rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {node.desc}
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <div
                    style={{
                      flexShrink: 0,
                      width: 32,
                      display: "flex",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout box */}
        <div
          className="glass-card"
          style={{
            marginTop: "2.5rem",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            flexWrap: "wrap",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "rgba(45, 91, 163, 0.12)",
              border: "1px solid var(--primary-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock size={18} color="var(--primary-bright)" strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.25rem",
                fontFamily: "var(--font-display)",
              }}
            >
              End-to-end encrypted by design
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Data is encrypted client-side before upload. The IPFS hash is stored on-chain
              alongside your access grants. The backend never has access to plaintext neural data.
            </p>
          </div>
          <a
            href="#"
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--primary-bright)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            Read the whitepaper <ArrowRight size={13} />
          </a>
        </div>
      </div>

      <style>{`
        .arch-flow::-webkit-scrollbar { height: 4px; }
        .arch-flow::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
        @media (max-width: 700px) {
          .arch-flow { flex-direction: column; }
          .arch-flow > div { width: 100%; min-width: unset; }
        }
      `}</style>
    </section>
  );
}
