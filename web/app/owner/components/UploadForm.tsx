"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader,
  Info, Cpu, Clock, DollarSign, ShieldCheck,
} from "lucide-react";
import type { BCIUploadForm, BCIType } from "@/types/bci";
import { uploadFileToPinata, uploadJSONToPinata } from "@/lib/pinata";

const BCI_TYPES: BCIType[] = ["EEG", "fMRI", "ECoG", "MEG", "EMG", "fNIRS"];

type UploadState = "idle" | "uploading" | "success" | "error";

const DEFAULT_FORM: BCIUploadForm = {
  file: null,
  title: "",
  description: "",
  type: "",
  channels: "",
  samplingRate: "",
  duration: "",
  price: "",
  requirements: {
    minEthBalance: "0",
    institutionRequired: false,
    purposeRequired: "",
    walletVerification: false,
  },
};

export default function UploadForm() {
  const [form, setForm] = useState<BCIUploadForm>(DEFAULT_FORM);
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadResult, setUploadResult] = useState<{ fileHash: string; metaHash: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File Handling ── */
  const handleFile = useCallback((file: File) => {
    setForm((prev) => ({ ...prev, file }));
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* ── Form helpers ── */
  const setField = <K extends keyof BCIUploadForm>(key: K, value: BCIUploadForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setReq = <K extends keyof BCIUploadForm["requirements"]>(
    key: K,
    value: BCIUploadForm["requirements"][K]
  ) =>
    setForm((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [key]: value },
    }));

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.title || !form.type || !form.price) return;

    setUploadState("uploading");
    setErrorMsg("");

    try {
      // 1. Upload the BCI data file
      const fileRes = await uploadFileToPinata(form.file, {
        title: form.title,
        type: form.type,
        uploader: "NeuralVault",
      });

      // 2. Upload metadata JSON
      const metaRes = await uploadJSONToPinata(
        {
          title: form.title,
          description: form.description,
          type: form.type,
          channels: form.channels,
          samplingRate: form.samplingRate,
          duration: form.duration,
          price: form.price,
          requirements: form.requirements,
          dataFileHash: fileRes.IpfsHash,
          uploadedAt: new Date().toISOString(),
          platform: "NeuralVault",
        },
        `${form.title} — Metadata`
      );

      setUploadResult({ fileHash: fileRes.IpfsHash, metaHash: metaRes.IpfsHash });
      setUploadState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Check your Pinata API key.");
      setUploadState("error");
    }
  };

  /* ── Success Screen ── */
  if (uploadState === "success" && uploadResult) {
    return (
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: "1.5rem", padding: "3rem 2rem",
        }}
      >
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle size={32} color="#22c55e" />
        </div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Upload Successful!
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Your dataset is now live on IPFS and published for researchers.
          </p>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <HashRow label="Data File (IPFS)" hash={uploadResult.fileHash} />
          <HashRow label="Metadata (IPFS)" hash={uploadResult.metaHash} />
        </div>

        <button
          onClick={() => { setForm(DEFAULT_FORM); setUploadState("idle"); setUploadResult(null); }}
          className="btn-primary btn-primary-hover"
          style={{ padding: "0.8rem 2rem", fontSize: "0.88rem" }}
        >
          Upload Another Dataset
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── 1. File Drop Zone ── */}
      <FormSection icon={<Upload size={16} />} title="Dataset File">
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--primary-bright)" : form.file ? "rgba(34,197,94,0.5)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
            background: dragOver ? "rgba(61,111,189,0.06)" : form.file ? "rgba(34,197,94,0.04)" : "var(--bg-glass)",
            transition: "all 0.2s ease",
            textAlign: "center",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.edf,.mat,.h5,.json,.txt,.zip"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {form.file ? (
            <>
              <FileText size={32} color="#22c55e" strokeWidth={1.5} />
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#22c55e" }}>{form.file.name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {(form.file.size / 1024 / 1024).toFixed(2)} MB — click to replace
              </p>
            </>
          ) : (
            <>
              <Upload size={32} color="var(--text-muted)" strokeWidth={1.5} />
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                Drag &amp; drop your BCI data file here
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>or click to browse</p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Supported formats: .csv, .edf, .mat, .h5, .json, .zip
              </p>
            </>
          )}
        </div>
      </FormSection>

      {/* ── 2. Metadata ── */}
      <FormSection icon={<FileText size={16} />} title="Dataset Metadata">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Title */}
          <Field label="Dataset Title" required>
            <input
              type="text"
              required
              placeholder="e.g. High-Density EEG Motor Cortex Dataset"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Description */}
          <Field label="Description" required>
            <textarea
              required
              placeholder="Describe your dataset — acquisition method, tasks, participants, preprocessing applied..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>

          {/* Type + Channels row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-two-col">
            <Field label="BCI Type" required>
              <select
                required
                value={form.type}
                onChange={(e) => setField("type", e.target.value as BCIType)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option value="" disabled style={{ background: "var(--bg-surface)" }}>Select type</option>
                {BCI_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "var(--bg-surface)" }}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Number of Channels" required>
              <input
                type="number"
                required
                placeholder="e.g. 256"
                min={1}
                value={form.channels}
                onChange={(e) => setField("channels", e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
          </div>

          {/* Sampling + Duration row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-two-col">
            <Field label="Sampling Rate" required>
              <input
                type="text"
                required
                placeholder="e.g. 2048 Hz"
                value={form.samplingRate}
                onChange={(e) => setField("samplingRate", e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <Field label="Duration" required>
              <input
                type="text"
                required
                placeholder="e.g. 48 hours"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>
          </div>
        </div>
      </FormSection>

      {/* ── 3. Pricing ── */}
      <FormSection icon={<DollarSign size={16} />} title="Pricing">
        <Field label="Price (ETH)" required hint="Set the one-time access fee researchers pay to download your dataset.">
          <div style={{ position: "relative" }}>
            <input
              type="number"
              required
              placeholder="0.05"
              min="0"
              step="0.001"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              style={{ ...inputStyle, paddingLeft: "2.5rem" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, pointerEvents: "none" }}>
              Ξ
            </span>
          </div>
        </Field>
      </FormSection>

      {/* ── 4. Access Requirements ── */}
      <FormSection icon={<ShieldCheck size={16} />} title="Access Requirements">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

          <CheckField
            label="Require wallet verification"
            checked={form.requirements.walletVerification}
            onChange={(v) => setReq("walletVerification", v)}
          />

          <CheckField
            label="Require institution affiliation"
            checked={form.requirements.institutionRequired}
            onChange={(v) => setReq("institutionRequired", v)}
          />

          <Field label="Minimum ETH balance required" hint="Leave 0 for no minimum">
            <div style={{ position: "relative" }}>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.requirements.minEthBalance}
                onChange={(e) => setReq("minEthBalance", e.target.value)}
                style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, pointerEvents: "none" }}>
                Ξ
              </span>
            </div>
          </Field>

          <Field label="Research purpose required" hint="e.g. Medical Research, Neuroscience. Leave blank for any.">
            <input
              type="text"
              placeholder="e.g. Medical Research"
              value={form.requirements.purposeRequired}
              onChange={(e) => setReq("purposeRequired", e.target.value)}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </Field>
        </div>
      </FormSection>

      {/* ── Error ── */}
      {uploadState === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-md)", fontSize: "0.82rem", color: "#f87171" }}>
          <AlertCircle size={14} />
          {errorMsg || "Upload failed. Please check your Pinata API key in .env.local"}
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={uploadState === "uploading" || !form.file}
        className="btn-primary btn-primary-hover"
        style={{
          padding: "1rem 2rem",
          fontSize: "0.95rem",
          justifyContent: "center",
          opacity: !form.file ? 0.5 : 1,
          cursor: !form.file ? "not-allowed" : "pointer",
        }}
      >
        {uploadState === "uploading" ? (
          <>
            <Loader size={16} style={{ animation: "spin 0.8s linear infinite" }} />
            Uploading to Pinata...
          </>
        ) : (
          <>
            <Upload size={16} />
            Upload to IPFS
          </>
        )}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 560px) {
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

/* ── Shared sub-components ── */

function FormSection({
  icon, title, children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--bg-glass)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}>
        <span style={{ color: "var(--primary-bright)" }}>{icon}</span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

function Field({
  label, required, hint, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {label}
        {required && <span style={{ color: "#f87171" }}>*</span>}
        {hint && (
          <span title={hint} style={{ color: "var(--text-muted)", cursor: "help", display: "flex", alignItems: "center" }}>
            <Info size={11} />
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function CheckField({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", userSelect: "none" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 18, height: 18, borderRadius: 5,
          background: checked ? "var(--primary-light)" : "var(--bg-elevated)",
          border: `1.5px solid ${checked ? "var(--primary-bright)" : "var(--border-default)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s ease",
        }}
      >
        {checked && <CheckCircle size={11} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{label}</span>
    </label>
  );
}

function HashRow({ label, hash }: { label: string; hash: string }) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "0.85rem 1rem" }}>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>{label}</div>
      <code style={{ fontSize: "0.78rem", color: "var(--primary-bright)", wordBreak: "break-all" }}>{hash}</code>
    </div>
  );
}

/* ── Input style helpers ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "var(--primary-bright)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,111,189,0.1)";
};

const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "var(--border-default)";
  e.currentTarget.style.boxShadow = "none";
};
