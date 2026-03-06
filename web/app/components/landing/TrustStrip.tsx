import { Shield, Database, Users, Lock } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Shield, label: "Non-Custodial", desc: "You hold your keys" },
  { icon: Database, label: "IPFS Storage", desc: "Decentralized vaults" },
  { icon: Lock, label: "AES-256-GCM", desc: "Military-grade encryption" },
  { icon: Users, label: "Ethereum", desc: "Immutable on-chain records" },
];

export default function TrustStrip() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "2.5rem 0",
      }}
    >
      <div className="container-xl">
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "2rem",
          }}
        >
          Built on proven infrastructure
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0",
          }}
        >
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1.25rem 1.5rem",
                  borderRight: i < TRUST_ITEMS.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "rgba(45, 91, 163, 0.1)",
                    border: "1px solid var(--primary-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color="var(--primary-bright)" strokeWidth={1.5} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .trust-item { border-right: none !important; border-bottom: 1px solid var(--border-subtle); }
        }
      `}</style>
    </section>
  );
}
