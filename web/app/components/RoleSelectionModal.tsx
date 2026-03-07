"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { X, FlaskConical, Brain } from "lucide-react";

interface RoleSelectionModalProps {
  onClose: () => void;
}

export default function RoleSelectionModal({ onClose }: RoleSelectionModalProps) {
  const router = useRouter();

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSelect = (role: "researcher" | "owner") => {
    onClose();
    router.push(`/${role}`);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(3, 11, 24, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          maxWidth: 680,
          width: "100%",
          position: "relative",
          animation: "fadeInUp 0.3s ease both",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Top glow bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--primary-bright), transparent)",
            borderRadius: "0 0 4px 4px",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--bg-glass)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
          }}
        >
          <X size={15} strokeWidth={2} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "0.6rem",
            }}
          >
            Who are you?
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Tell us your role to get started with NeuralVault
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="role-grid">
          {/* Researcher Card */}
          <RoleCard
            icon={FlaskConical}
            title="I'm a Researcher"
            description="Access verified BCI datasets from real researchers. Search, discover, and purchase neural data securely."
            accentColor="var(--primary-bright)"
            onClick={() => handleSelect("researcher")}
            buttonLabel="Continue as Researcher"
          />

          {/* Owner Card */}
          <RoleCard
            icon={Brain}
            title="I'm a BCI Owner"
            description="Upload and monetize your BCI data. Set access requirements, pricing, and consent terms — all on-chain."
            accentColor="#22c55e"
            onClick={() => handleSelect("owner")}
            buttonLabel="Continue as Owner"
          />
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "1.5rem",
          }}
        >
          You can switch roles at any time from your dashboard.
        </p>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .role-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Role Card ─────────────────────────────────────────────── */
interface RoleCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor: string;
  onClick: () => void;
  buttonLabel: string;
}

function RoleCard({
  icon: Icon,
  title,
  description,
  accentColor,
  onClick,
  buttonLabel,
}: RoleCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.border = `1px solid ${accentColor}40`;
        el.style.background = "var(--bg-glass-hover)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.border = "1px solid var(--border-subtle)";
        el.style.background = "var(--bg-glass)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={24} color={accentColor} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
          {description}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "0.7rem 1rem",
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}40`,
          borderRadius: "var(--radius-md)",
          color: accentColor,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.82rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}30`;
          (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}20`;
          (e.currentTarget as HTMLButtonElement).style.borderColor = `${accentColor}40`;
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
