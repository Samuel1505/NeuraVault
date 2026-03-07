"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search datasets by keyword, type, or researcher...",
}: SearchBarProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Search
        size={16}
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.85rem 2.75rem",
          background: "var(--bg-glass)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--primary-bright)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,111,189,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-default)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            padding: "2px",
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
