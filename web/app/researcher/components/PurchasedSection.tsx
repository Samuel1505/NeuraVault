"use client";

import { ExternalLink, CheckCircle, Clock, FlaskConical, Download } from "lucide-react";
import type { PurchaseRecord, BCIType } from "@/types/bci";
import { getPinataGatewayUrl } from "@/lib/pinata";

const TYPE_COLORS: Record<string, string> = {
  EEG: "#3d6fbd",
  fMRI: "#8b5cf6",
  ECoG: "#f59e0b",
  MEG: "#06b6d4",
  EMG: "#22c55e",
  fNIRS: "#f43f5e",
};

interface PurchasedSectionProps {
  purchases: PurchaseRecord[];
}

export default function PurchasedSection({ purchases }: PurchasedSectionProps) {
  if (purchases.length === 0) {
    return (
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "5rem 1rem",
        }}
      >
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--bg-glass)", border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem",
          }}
        >
          <FlaskConical size={34} color="var(--text-muted)" strokeWidth={1.5} />
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)", fontSize: "1.15rem",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem",
          }}
        >
          No purchases yet
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 340 }}>
          Browse the Marketplace tab to find and purchase BCI datasets. Your acquired datasets will appear here with direct IPFS download links.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem",
        }}
      >
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--primary-bright)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
            {purchases.length}
          </span>{" "}
          dataset{purchases.length !== 1 ? "s" : ""} purchased
        </div>
        <span
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.72rem", color: "#22c55e", fontWeight: 600,
            padding: "0.25rem 0.75rem",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 999,
          }}
        >
          <CheckCircle size={11} /> Access Granted
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
        className="bci-grid"
      >
        {purchases.map((p) => (
          <PurchasedCard key={p.recordId} purchase={p} />
        ))}
      </div>
    </div>
  );
}

function PurchasedCard({ purchase }: { purchase: PurchaseRecord }) {
  const typeColor = TYPE_COLORS[purchase.type] ?? "var(--primary-bright)";
  const purchasedDate = new Date(purchase.purchasedAt);
  const dateStr = purchasedDate.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
  const timeStr = purchasedDate.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        borderColor: "rgba(34,197,94,0.15)",
      }}
    >
      {/* Top color strip */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${typeColor}, transparent)`,
        }}
      />

      {/* Access granted badge */}
      <div
        style={{
          position: "absolute", top: "1rem", right: "1rem",
          display: "flex", alignItems: "center", gap: "0.3rem",
          fontSize: "0.68rem", color: "#22c55e", fontWeight: 700,
          padding: "0.2rem 0.6rem",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 999,
        }}
      >
        <CheckCircle size={10} /> Access Granted
      </div>

      {/* Header */}
      <div style={{ paddingTop: "0.25rem", paddingRight: "7rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.2rem 0.55rem",
            background: `${typeColor}18`, border: `1px solid ${typeColor}35`,
            borderRadius: 999, fontSize: "0.68rem", fontWeight: 700,
            color: typeColor, fontFamily: "var(--font-display)",
            letterSpacing: "0.05em", marginBottom: "0.5rem",
          }}
        >
          {purchase.type}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3,
            marginBottom: "0.25rem",
          }}
        >
          {purchase.title}
        </h3>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          by {purchase.ownerName}
        </p>
      </div>

      {/* Purchase info */}
      <div
        style={{
          background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)", padding: "0.75rem 1rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}
      >
        <InfoRow label="Price Paid" value={`${purchase.price} ETH`} />
        <InfoRow
          label="Purchased"
          value={`${dateStr} · ${timeStr}`}
          icon={<Clock size={11} />}
        />
        <InfoRow
          label="Tx Hash"
          value={`${purchase.txHash.slice(0, 10)}...${purchase.txHash.slice(-6)}`}
          mono
        />
      </div>

      {/* IPFS Access links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <a
          href={getPinataGatewayUrl(purchase.ipfsHash)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1rem",
            background: "rgba(61,111,189,0.08)",
            border: "1px solid var(--primary-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--primary-bright)",
            fontSize: "0.8rem", fontWeight: 600,
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(61,111,189,0.14)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary-bright)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(61,111,189,0.08)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary-border)";
          }}
        >
          <Download size={14} />
          Download Dataset (IPFS)
          <ExternalLink size={11} style={{ marginLeft: "auto", opacity: 0.6 }} />
        </a>

        {purchase.metaIpfsHash && (
          <a
            href={getPinataGatewayUrl(purchase.metaIpfsHash)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.55rem 1rem",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
              fontSize: "0.75rem", fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-default)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)";
            }}
          >
            View Metadata (IPFS)
            <ExternalLink size={10} style={{ marginLeft: "auto", opacity: 0.6 }} />
          </a>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {icon}
        {label}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          fontWeight: 600,
          fontFamily: mono ? "monospace" : "var(--font-body)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
