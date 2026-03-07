"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Brain, FlaskConical, SlidersHorizontal,
} from "lucide-react";
import { MOCK_BCI_RECORDS } from "@/lib/mockData";
import type { BCIRecord, BCIType } from "@/types/bci";
import SearchBar from "./components/SearchBar";
import BCICard from "./components/BCICard";
import BCIDetailModal from "./components/BCIDetailModal";

const BCI_TYPES: BCIType[] = ["EEG", "fMRI", "ECoG", "MEG", "EMG", "fNIRS"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "popular", label: "Most Downloaded" },
];

export default function ResearcherPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<BCIType | "All">("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedRecord, setSelectedRecord] = useState<BCIRecord | null>(null);

  const filtered = useMemo(() => {
    let list = [...MOCK_BCI_RECORDS];

    // Filter by type
    if (activeType !== "All") {
      list = list.filter((r) => r.type === activeType);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        list.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
    }
    return list;
  }, [query, activeType, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── Page Header ── */}
      <header
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container-xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Left: Back + logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: "0.82rem",
                fontFamily: "var(--font-body)", transition: "color 0.2s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div style={{ width: 1, height: 18, background: "var(--border-subtle)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px var(--primary-glow)" }}>
                <Brain size={14} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>
                Neural<span style={{ color: "var(--primary-bright)" }}>Vault</span>
              </span>
            </div>
          </div>

          {/* Right: role label */}
          <span className="label-tag" style={{ fontSize: "0.7rem" }}>
            <FlaskConical size={10} /> Researcher Portal
          </span>
        </div>
      </header>

      {/* ── Hero bar ── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "2rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="dot-grid-bg"
          style={{ position: "absolute", inset: 0, opacity: 0.25, zIndex: 0 }}
        />
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "40vw", height: "200%", background: "radial-gradient(ellipse,rgba(30,58,110,0.25) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="container-xl" style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,4vw,2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
            BCI Marketplace
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem", maxWidth: 500 }}>
            Discover and purchase verified brain-computer interface datasets from real researchers.
          </p>

          {/* Search */}
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {/* ── Filters & Sort ── */}
      <div
        style={{
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0.85rem 1.5rem",
        }}
      >
        <div
          className="container-xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {/* Type filter chips */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <SlidersHorizontal size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            {(["All", ...BCI_TYPES] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type as BCIType | "All")}
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: activeType === type ? "var(--primary-bright)" : "var(--border-subtle)",
                  background: activeType === type ? "rgba(61,111,189,0.15)" : "transparent",
                  color: activeType === type ? "var(--primary-bright)" : "var(--text-muted)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                fontSize: "0.78rem",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "var(--bg-surface)" }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <main style={{ padding: "2rem 1.5rem 4rem" }}>
        <div className="container-xl" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Result count */}
          <div style={{ marginBottom: "1.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {filtered.length} dataset{filtered.length !== 1 ? "s" : ""} found
            {activeType !== "All" && <span> · filtered by <span style={{ color: "var(--primary-bright)", fontWeight: 600 }}>{activeType}</span></span>}
          </div>

          {filtered.length === 0 ? (
            <EmptyState onReset={() => { setQuery(""); setActiveType("All"); }} />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
              className="bci-grid"
            >
              {filtered.map((record) => (
                <BCICard
                  key={record.id}
                  record={record}
                  onClick={() => setSelectedRecord(record)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedRecord && (
        <BCIDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      <style>{`
        @media (max-width: 640px) {
          .bci-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "5rem 1rem" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bg-glass)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <FlaskConical size={30} color="var(--text-muted)" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
        No datasets found
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        Try different search terms or filters
      </p>
      <button onClick={onReset} className="btn-outline btn-outline-hover" style={{ fontSize: "0.82rem", padding: "0.6rem 1.25rem" }}>
        Clear filters
      </button>
    </div>
  );
}
