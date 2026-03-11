"use client";

import { CheckCircle, Clock, Download, Lock, Users, ShoppingBag } from "lucide-react";
import type { BCIRecord } from "@/types/bci";

const TYPE_COLORS: Record<string, string> = {
  EEG: "#3d6fbd",
  fMRI: "#8b5cf6",
  ECoG: "#f59e0b",
  MEG: "#06b6d4",
  EMG: "#22c55e",
  fNIRS: "#f43f5e",
};

interface BCICardProps {
  record: BCIRecord;
  onClick: () => void;
  isPurchased?: boolean;
}

export default function BCICard({ record, onClick, isPurchased = false }: BCICardProps) {
  const typeColor = TYPE_COLORS[record.type] ?? "var(--primary-bright)";
  const isSold = record.status === "sold" ||
    (typeof record.maxPurchases === "number" && record.purchaseCount >= record.maxPurchases);
  const hasLimit = typeof record.maxPurchases === "number";
  const remaining = hasLimit ? record.maxPurchases! - record.purchaseCount : null;

  return (
    <div
      className="glass-card glass-card-hover"
      onClick={onClick}
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        opacity: isSold ? 0.75 : 1,
        borderColor: isPurchased ? "rgba(34,197,94,0.25)" : undefined,
      }}
    >
      {/* Type color strip */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${typeColor}, transparent)`,
        }}
      />

      {/* Sold Out overlay badge */}
      {isSold && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(3, 11, 24, 0.60)",
            borderRadius: "var(--radius-lg)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 999,
              color: "#f87171",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
            }}
          >
            <ShoppingBag size={14} /> Sold Out
          </div>
        </div>
      )}

      {/* Purchased badge */}
      {isPurchased && !isSold && (
        <div
          style={{
            position: "absolute", top: "1rem", right: "1rem", zIndex: 1,
            display: "flex", alignItems: "center", gap: "0.25rem",
            fontSize: "0.68rem", color: "#22c55e", fontWeight: 700,
            padding: "0.2rem 0.55rem",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 999,
          }}
        >
          <CheckCircle size={10} /> Purchased
        </div>
      )}

      {/* Header row */}
      <div
        style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: "0.75rem",
          paddingTop: "0.25rem",
          paddingRight: isPurchased ? "6rem" : 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
              lineHeight: 1.3, marginBottom: "0.3rem",
            }}
          >
            {record.title}
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Users size={11} />
            {record.ownerName}
          </p>
        </div>

        {/* Type badge */}
        <span
          style={{
            padding: "0.25rem 0.65rem",
            background: `${typeColor}18`, border: `1px solid ${typeColor}35`,
            borderRadius: 999, fontSize: "0.7rem", fontWeight: 700,
            color: typeColor, fontFamily: "var(--font-display)",
            letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          {record.type}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.65,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {record.description}
      </p>

      {/* Metadata row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <MetaChip label="Channels" value={`${record.channels}`} />
        <MetaChip label="Duration" value={record.duration} />
        <MetaChip label="Sampling" value={record.samplingRate} />
        <MetaChip label="Downloads" value={`${record.downloads}`} icon={<Download size={9} />} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {record.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.2rem 0.55rem",
              background: "rgba(45,91,163,0.1)",
              border: "1px solid var(--primary-border)",
              borderRadius: 999, fontSize: "0.68rem",
              color: "var(--primary-bright)", fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: price + status + stock */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid var(--border-subtle)", paddingTop: "0.85rem", marginTop: "auto",
        }}
      >
        {/* Price */}
        <div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {record.price} ETH
          </span>
          <span style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginLeft: "0.35rem" }}>
            ≈ {record.priceUSD}
          </span>
        </div>

        {/* Status + stock */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {/* Stock indicator */}
          {hasLimit && !isSold && (
            <span
              style={{
                fontSize: "0.68rem", color: remaining! <= 2 ? "#f59e0b" : "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {remaining} left
            </span>
          )}
          {record.verified && !isPurchased && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>
              <CheckCircle size={11} /> Verified
            </span>
          )}
          <StatusBadge status={record.status} isPurchased={isPurchased} />
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function MetaChip({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-sm)", padding: "0.3rem 0.5rem",
      }}
    >
      <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.1rem" }}>{label}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {icon}{value}
      </div>
    </div>
  );
}

function StatusBadge({ status, isPurchased }: { status: BCIRecord["status"]; isPurchased: boolean }) {
  if (isPurchased) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600, color: "#22c55e", padding: "0.2rem 0.5rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999 }}>
        <CheckCircle size={10} /> Owned
      </span>
    );
  }

  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    available: { label: "Available", color: "#22c55e", icon: <CheckCircle size={10} /> },
    restricted: { label: "Restricted", color: "#f59e0b", icon: <Lock size={10} /> },
    pending: { label: "Pending", color: "var(--text-muted)", icon: <Clock size={10} /> },
    sold: { label: "Sold Out", color: "#ef4444", icon: <ShoppingBag size={10} /> },
  };
  const { label, color, icon } = map[status] ?? map.available;
  return (
    <span
      style={{
        display: "flex", alignItems: "center", gap: "0.25rem",
        fontSize: "0.7rem", fontWeight: 600, color,
        padding: "0.2rem 0.5rem",
        background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 999,
      }}
    >
      {icon}{label}
    </span>
  );
}
