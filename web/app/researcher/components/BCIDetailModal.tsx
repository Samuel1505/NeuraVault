"use client";

import { useEffect, useState } from "react";
import {
  X, CheckCircle, AlertTriangle, ExternalLink, ShieldCheck,
  Clock, Download, Users, Cpu, Activity, Lock, ShoppingCart,
  ShoppingBag, Package,
} from "lucide-react";
import type { BCIRecord, PurchaseRecord } from "@/types/bci";
import { getPinataGatewayUrl } from "@/lib/pinata";

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
  onPurchase: (record: BCIRecord) => Promise<PurchaseRecord>;
  isPurchased: boolean;
}

type PurchaseState = "idle" | "purchasing" | "success" | "error";

export default function BCIDetailModal({ record, onClose, onPurchase, isPurchased }: BCIDetailModalProps) {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("idle");
  const [purchaseResult, setPurchaseResult] = useState<PurchaseRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const typeColor = TYPE_COLORS[record.type] ?? "var(--primary-bright)";

  const isSold = record.status === "sold" ||
    (typeof record.maxPurchases === "number" && record.purchaseCount >= record.maxPurchases);
  const hasLimit = typeof record.maxPurchases === "number";
  const remaining = hasLimit ? record.maxPurchases! - record.purchaseCount : null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handlePurchase = async () => {
    if (isSold || isPurchased) return;
    setPurchaseState("purchasing");
    setErrorMsg("");
    try {
      const result = await onPurchase(record);
      setPurchaseResult(result);
      setPurchaseState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Purchase failed. Please try again.");
      setPurchaseState("error");
    }
  };

  const meetsRequirements =
    !record.requirements.institutionRequired && !record.requirements.walletVerification;

  const alreadyOwned = isPurchased || purchaseState === "success";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
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
          maxWidth: 760, width: "100%", maxHeight: "90vh",
          overflowY: "auto", position: "relative",
          animation: "fadeInUp 0.3s ease both",
          boxShadow: "0 32px 100px rgba(0,0,0,0.65)",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent 0%, ${typeColor} 40%, transparent 100%)`, borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }} />

        {/* Header */}
        <div
          style={{
            padding: "1.75rem 2rem 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky", top: 0,
            background: "var(--bg-surface)", zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "0.2rem 0.6rem",
                    background: `${typeColor}15`, border: `1px solid ${typeColor}30`,
                    borderRadius: 999, fontSize: "0.7rem", fontWeight: 700,
                    color: typeColor, fontFamily: "var(--font-display)", letterSpacing: "0.05em",
                  }}
                >
                  {record.type}
                </span>
                {isSold && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, color: "#f87171" }}>
                    <ShoppingBag size={11} /> Sold Out
                  </span>
                )}
                {alreadyOwned && !isSold && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, color: "#22c55e" }}>
                    <CheckCircle size={11} /> Purchased
                  </span>
                )}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                  fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.025em",
                  lineHeight: 1.25, marginBottom: "0.4rem",
                }}
              >
                {record.title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Users size={12} /> {record.ownerName}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={12} /> {record.uploadedAt}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Download size={12} /> {record.purchaseCount} purchase{record.purchaseCount !== 1 ? "s" : ""}</span>
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
                width: 34, height: 34, borderRadius: 9,
                background: "var(--bg-glass)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-muted)", flexShrink: 0, transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* Stock availability bar */}
          {hasLimit && (
            <div
              style={{
                padding: "0.85rem 1rem",
                background: isSold ? "rgba(239,68,68,0.06)" : remaining! <= 2 ? "rgba(245,158,11,0.06)" : "rgba(34,197,94,0.06)",
                border: `1px solid ${isSold ? "rgba(239,68,68,0.2)" : remaining! <= 2 ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)"}`,
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Package size={14} color={isSold ? "#f87171" : remaining! <= 2 ? "#f59e0b" : "#22c55e"} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {isSold
                    ? "This dataset has sold out — no more purchases allowed"
                    : `${remaining} of ${record.maxPurchases} purchase slot${record.maxPurchases !== 1 ? "s" : ""} remaining`}
                </span>
              </div>
              {/* Progress bar */}
              {!isSold && (
                <div style={{ width: 80, height: 6, background: "var(--bg-elevated)", borderRadius: 999, flexShrink: 0 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(record.purchaseCount / record.maxPurchases!) * 100}%`,
                      background: remaining! <= 2 ? "#f59e0b" : "#22c55e",
                      borderRadius: 999,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Success purchase confirmation */}
          {purchaseState === "success" && purchaseResult && (
            <div
              style={{
                padding: "1.25rem",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "var(--radius-lg)",
                display: "flex", flexDirection: "column", gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle size={18} color="#22c55e" />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#22c55e", fontSize: "0.95rem" }}>
                  Purchase Successful!
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <TxRow label="Transaction" value={`${purchaseResult.txHash.slice(0, 14)}...${purchaseResult.txHash.slice(-8)}`} mono />
              </div>
              <a
                href={getPinataGatewayUrl(purchaseResult.ipfsHash)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.6rem 1rem",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "#22c55e", fontSize: "0.82rem", fontWeight: 600,
                  textDecoration: "none", width: "fit-content",
                }}
              >
                <Download size={14} /> Download from IPFS <ExternalLink size={11} />
              </a>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                This dataset is also saved in your <strong style={{ color: "var(--text-secondary)" }}>My Purchases</strong> tab.
              </p>
            </div>
          )}

          {/* Error */}
          {purchaseState === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-md)", fontSize: "0.82rem", color: "#f87171" }}>
              <AlertTriangle size={14} />
              {errorMsg}
            </div>
          )}

          {/* Description */}
          <section>
            <SectionLabel>About this Dataset</SectionLabel>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
              {record.longDescription || record.description}
            </p>
          </section>

          {/* Technical Specs */}
          <section>
            <SectionLabel>Technical Specifications</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
              {[
                { icon: <Cpu size={14} />, label: "Channels", value: `${record.channels}` },
                { icon: <Activity size={14} />, label: "Sampling Rate", value: record.samplingRate },
                { icon: <Clock size={14} />, label: "Duration", value: record.duration },
                ...(record.dataPoints > 0 ? [{ icon: <Download size={14} />, label: "Data Points", value: record.dataPoints.toLocaleString() }] : []),
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "1rem" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary-bright)", marginBottom: "0.5rem" }}>
                    {icon}
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          {record.tags.length > 0 && (
            <section>
              <SectionLabel>Tags</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {record.tags.map((tag) => (
                  <span key={tag} style={{ padding: "0.3rem 0.75rem", background: "rgba(45,91,163,0.1)", border: "1px solid var(--primary-border)", borderRadius: 999, fontSize: "0.78rem", color: "var(--primary-bright)", fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* IPFS Link — visible only after purchase or if already owned */}
          <section>
            <SectionLabel>IPFS Reference</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <ShieldCheck size={14} color="var(--primary-bright)" />
              <code style={{ fontSize: "0.78rem", color: "var(--text-secondary)", flex: 1, wordBreak: "break-all" }}>
                {record.ipfsHash}
              </code>
              {alreadyOwned && (
                <a href={getPinataGatewayUrl(record.ipfsHash)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-bright)", display: "flex", alignItems: "center" }}>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </section>

          {/* Requirements */}
          <section>
            <SectionLabel>Access Requirements</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <RequirementRow label="Wallet Verification" required={record.requirements.walletVerification} />
              <RequirementRow label="Institution Affiliation" required={record.requirements.institutionRequired} />
              <RequirementRow label={`Min ETH Balance: ${record.requirements.minEthBalance} ETH`} required={parseFloat(record.requirements.minEthBalance) > 0} />
              {record.requirements.purposeRequired && (
                <RequirementRow label={`Research Purpose: ${record.requirements.purposeRequired}`} required={true} />
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
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem",
          }}
        >
          {/* Price */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: isSold ? "var(--text-muted)" : "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1, textDecoration: isSold ? "line-through" : "none" }}>
              {record.price} ETH
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              ≈ {record.priceUSD} · One-time access
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
            {isSold ? (
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "var(--radius-md)",
                  color: "#f87171",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem",
                }}
              >
                <ShoppingBag size={16} /> Sold Out
              </div>
            ) : alreadyOwned ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: "var(--radius-md)",
                    color: "#22c55e",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem",
                  }}
                >
                  <CheckCircle size={16} /> Access Granted
                </div>
                <a
                  href={getPinataGatewayUrl(record.ipfsHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.75rem", color: "var(--primary-bright)", display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}
                >
                  <Download size={12} /> Download Dataset <ExternalLink size={10} />
                </a>
              </div>
            ) : !meetsRequirements ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#f59e0b", marginBottom: "0.5rem" }}>
                  <AlertTriangle size={12} /> Requirements needed to purchase
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={purchaseState === "purchasing"}
                  className="btn-primary btn-primary-hover"
                  style={{ opacity: 0.7, gap: "0.5rem", cursor: purchaseState === "purchasing" ? "wait" : "pointer" }}
                >
                  {purchaseState === "purchasing" ? (
                    <><Spinner /> Processing...</>
                  ) : (
                    <><Lock size={14} /> Purchase Dataset</>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchaseState === "purchasing"}
                className="btn-primary btn-primary-hover"
                style={{ padding: "0.85rem 2rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: purchaseState === "purchasing" ? "wait" : "pointer" }}
              >
                {purchaseState === "purchasing" ? (
                  <><Spinner /> Processing Transaction...</>
                ) : (
                  <><ShoppingCart size={15} /> Purchase Dataset</>
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

/* ── Small helpers ── */

function Spinner() {
  return (
    <span
      style={{
        width: 14, height: 14,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function TxRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{label}</span>
      <code style={{ fontSize: mono ? "0.72rem" : "0.78rem", color: "var(--text-secondary)", fontFamily: mono ? "monospace" : "var(--font-body)" }}>{value}</code>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
      {children}
    </h4>
  );
}

function RequirementRow({ label, required }: { label: string; required: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.85rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", color: required ? "var(--text-secondary)" : "var(--text-muted)" }}>
      {required ? <AlertTriangle size={13} color="#f59e0b" /> : <CheckCircle size={13} color="#22c55e" />}
      {label}
      {!required && <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>Not required</span>}
    </div>
  );
}
