import { Quote } from "lucide-react";

const ANCHOR_TESTIMONIAL = {
  quote:
    "NeuralVault fundamentally changes how we approach ethical data procurement. For the first time, participants retain full sovereignty and we get cryptographic proof that consent was properly obtained. This is how neuroscience research should work.",
  name: "Dr. Sarah Chen",
  role: "Principal Investigator",
  institution: "MIT Brain & Cognitive Sciences",
  avatar: "https://i.pravatar.cc/80?u=sarah-chen-neuro",
};

const MINI_TESTIMONIALS = [
  {
    quote:
      "The consent management system is exactly what the field needed. Patients are now genuinely informed partners rather than passive subjects.",
    name: "Dr. Marcus Webb",
    role: "Neurology Research Lead",
    institution: "Johns Hopkins Medicine",
    avatar: "https://i.pravatar.cc/64?u=marcus-webb-neuro",
  },
  {
    quote:
      "We integrated NeuralVault into our BCI pipeline in under a week. The smart contract architecture is clean and the IPFS integration is seamless.",
    name: "Aisha Okonkwo",
    role: "Senior BCI Engineer",
    institution: "Neuralink Research Division",
    avatar: "https://i.pravatar.cc/64?u=aisha-okonkwo-bci",
  },
  {
    quote:
      "As a data contributor, I finally feel in control. I can see exactly who accessed my EEG data and when, and the payments are instant.",
    name: "James Holloway",
    role: "BCI Data Contributor",
    institution: "Clinical Trial Participant",
    avatar: "https://i.pravatar.cc/64?u=james-holloway-participant",
  },
];

export default function Testimonials() {
  return (
    <section
      className="section-pad"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="container-xl">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            What Researchers Say
          </span>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Trusted by scientists pushing
            <br />
            the boundaries of neuroscience
          </h2>
        </div>

        {/* Anchor Quote */}
        <div
          className="glass-card"
          style={{
            padding: "2.5rem",
            marginBottom: "1.25rem",
            borderRadius: "var(--radius-xl)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "-60px",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "var(--primary-glow)",
              filter: "blur(80px)",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          <Quote
            size={36}
            color="var(--primary-bright)"
            strokeWidth={1.5}
            style={{ marginBottom: "1.25rem", opacity: 0.7 }}
          />
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              marginBottom: "2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            &ldquo;{ANCHOR_TESTIMONIAL.quote}&rdquo;
          </blockquote>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={ANCHOR_TESTIMONIAL.avatar}
              alt={ANCHOR_TESTIMONIAL.name}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--border-default)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                }}
              >
                {ANCHOR_TESTIMONIAL.name}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {ANCHOR_TESTIMONIAL.role} · {ANCHOR_TESTIMONIAL.institution}
              </div>
            </div>
          </div>
        </div>

        {/* Mini testimonials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {MINI_TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover"
              style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}
            >
              <Quote
                size={20}
                color="var(--primary-bright)"
                strokeWidth={1.5}
                style={{ marginBottom: "1rem", opacity: 0.6 }}
              />
              <blockquote
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "1.5rem",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--border-subtle)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>
                    {t.role} · {t.institution}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
