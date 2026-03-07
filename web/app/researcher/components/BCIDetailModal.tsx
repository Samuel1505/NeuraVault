"use client";

import { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Download,
  Users,
  Cpu,
  Activity,
  Lock,
  ShoppingCart,
} from "lucide-react";
import type { BCIRecord } from "@/types/bci";

const TYPE_COLORS: Record<string, string> = {
  EEG: "#3d6fbd",
  fMRI: "#8b5cf6",
  ECoG: "#f59e0b",
  MEG: "#06b6d4",
  EMG: "#22c55e",
  fNIRS: "#f43f5e",
};

interface BCIDetailModalProps {
  record: BCIRecord;
  onClose: () => void;
}

export default function BCIDetailModal({ record, onClose }: BCIDetailModalProps) {
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const typeColor = TYPE_COLORS[record.type] ?? "var(--primary-bright)";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handlePurchase = async () => {
    setPurchasing(true);
    // Simulate blockchain tx delay
    await new Promise((res) => setTimeout(res, 2000));
    setPurchasing(false);
    setPurchased(true);
  };

  const meetsRequirements =
    !record.requirements.institutionRequired &&
    !record.requirements.walletVerification;

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
        background: "rgba(3, 11, 24, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "fadeInUp 0.3s ease both",
          boxShadow: "0 32px 100px rgba(0,0,0,0.65)",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${typeColor} 40%, transparent 100%)`,
            borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "1.75rem 2rem 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            background: "var(--bg-surface)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              {/* Type badge */}
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  background: `${typeColor}15`,
                  border: `1px solid ${typeColor}30`,
                  borderRadius: 999,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: typeColor,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.05em",
                  display: "inline-block",
                  marginBottom: "0.6rem",
                }}
              >
                {record.type}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.25,
                  marginBottom: "0.4rem",
                }}
              >
                {record.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Users size={12} /> {record.ownerName}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={12} /> {record.uploadedAt}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Download size={12} /> {record.downloads} downloads
                </span>
                {record.verified && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#22c55e", fontWeight: 600 }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-muted)",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* Description */}
          <section>
            <SectionLabel>About this Dataset</SectionLabel>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
              {record.longDescription}
            </p>
          </section>

          {/* Technical Specs */}
          <section>
            <SectionLabel>Technical Specifications</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {[
                { icon: <Cpu size={14} />, label: "Channels", value: `${record.channels}` },
                { icon: <Activity size={14} />, label: "Sampling Rate", value: record.samplingRate },
                { icon: <Clock size={14} />, label: "Duration", value: record.duration },
                { icon: <Download size={14} />, label: "Data Points", value: record.dataPoints.toLocaleString() },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary-bright)", marginBottom: "0.5rem" }}>
                    {icon}
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {label}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section>
            <SectionLabel>Tags</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "0.3rem 0.75rem",
                    background: "rgba(45,91,163,0.1)",
                    border: "1px solid var(--primary-border)",
                    borderRadius: 999,
                    fontSize: "0.78rem",
                    color: "var(--primary-bright)",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* IPFS Link */}
          <section>
            <SectionLabel>IPFS Reference</SectionLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <ShieldCheck size={14} color="var(--primary-bright)" />
              <code style={{ fontSize: "0.78rem", color: "var(--text-secondary)", flex: 1, wordBreak: "break-all" }}>
                {record.ipfsHash}
              </code>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary-bright)", display: "flex", alignItems: "center" }}
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </section>

          {/* Requirements */}
          <section>
            <SectionLabel>Access Requirements</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <RequirementRow
                label="Wallet Verification"
                required={record.requirements.walletVerification}
              />
              <RequirementRow
                label="Institution Affiliation"
                required={record.requirements.institutionRequired}
              />
              <RequirementRow
                label={`Min ETH Balance: ${record.requirements.minEthBalance} ETH`}
                required={parseFloat(record.requirements.minEthBalance) > 0}
              />
              {record.requirements.purposeRequired && (
                <RequirementRow
                  label={`Research Purpose: ${record.requirements.purposeRequired}`}
                  required={true}
                />
              )}
            </div>
          </section>
        </div>

        {/* Purchase Footer */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-elevated)",
            borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Price */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {record.price} ETH
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              ≈ {record.priceUSD} · One-time access
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
            {purchased ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "#22c55e",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                <CheckCircle size={16} /> Access Granted!
              </div>
            ) : !meetsRequirements ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.75rem",
                    color: "#f59e0b",
                    marginBottom: "0.5rem",
                  }}
                >
                  <AlertTriangle size={12} />
                  Additional requirements needed
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="btn-primary btn-primary-hover"
                  style={{ opacity: 0.7, cursor: "not-allowed", gap: "0.5rem" }}
                >
                  <Lock size={14} />
                  {purchasing ? "Processing..." : "Purchase Dataset"}
                </button>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn-primary btn-primary-hover"
                style={{
                  padding: "0.85rem 2rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: purchasing ? "wait" : "pointer",
                }}
              >
                {purchasing ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    Purchase Dataset
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </h4>
  );
}

function RequirementRow({ label, required }: { label: string; required: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 0.85rem",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.82rem",
        color: required ? "var(--text-secondary)" : "var(--text-muted)",
      }}
    >
      {required ? (
        <AlertTriangle size={13} color="#f59e0b" />
      ) : (
        <CheckCircle size={13} color="#22c55e" />
      )}
      {label}
      {!required && (
        <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>
          Not required
        </span>
      )}
    </div>
  );
}
