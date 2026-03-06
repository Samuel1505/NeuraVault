import { Activity, Brain, Cpu, Radio, Waves, Signal } from "lucide-react";

const DATA_TYPES = [
  {
    icon: Waves,
    acronym: "EEG",
    name: "Electroencephalography",
    desc: "Scalp electrode recordings of brainwave oscillations and neural synchrony patterns.",
    color: "#2d5ba3",
  },
  {
    icon: Brain,
    acronym: "fMRI",
    name: "Functional MRI",
    desc: "Blood-oxygen-level-dependent imaging capturing spatial maps of brain activation.",
    color: "#1e3a6e",
  },
  {
    icon: Activity,
    acronym: "EMG",
    name: "Electromyography",
    desc: "Muscle electrical activity used in motor BCI and prosthetic control systems.",
    color: "#2d5ba3",
  },
  {
    icon: Radio,
    acronym: "ECoG",
    name: "Electrocorticography",
    desc: "High-resolution intracranial electrode grid recordings of cortical surface activity.",
    color: "#1e3a6e",
  },
  {
    icon: Signal,
    acronym: "MEG",
    name: "Magnetoencephalography",
    desc: "Magnetic field measurements from neuronal currents, providing millisecond resolution.",
    color: "#2d5ba3",
  },
  {
    icon: Cpu,
    acronym: "LFP",
    name: "Local Field Potentials",
    desc: "Extracellular electrode signals capturing local population neural activity.",
    color: "#1e3a6e",
  },
];

export default function DataTypes() {
  return (
    <section
      id="data-types"
      className="section-pad"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="container-xl">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <span className="label-tag" style={{ marginBottom: "1rem", display: "inline-flex" }}>
              Supported Data Types
            </span>
            <h2 className="section-title">
              The full spectrum of
              <br />
              BCI neural formats
            </h2>
          </div>
          <p className="section-subtitle" style={{ maxWidth: 380 }}>
            NeuralVault supports every major modality of brain-computer interface
            and neural recording data.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {DATA_TYPES.map((dt, i) => {
            const Icon = dt.icon;
            return (
              <div
                key={i}
                className="glass-card glass-card-hover"
                style={{ padding: "1.75rem" }}
              >
                {/* Acronym + Icon row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {dt.acronym}
                  </span>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "rgba(45, 91, 163, 0.12)",
                      border: "1px solid var(--primary-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={17} color="var(--primary-bright)" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Name */}
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--primary-bright)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  {dt.name}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {dt.desc}
                </p>

                {/* Separator line */}
                <div
                  style={{
                    height: 2,
                    borderRadius: 1,
                    background: `linear-gradient(90deg, ${dt.color}66, transparent)`,
                    marginTop: "1.25rem",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
