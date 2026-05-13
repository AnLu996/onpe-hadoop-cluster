import PropTypes from "prop-types";

export default function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-2xl text-sm slide-in"
      style={{
        background:  "var(--clr-elevated)",
        border:      "1px solid var(--clr-border-med)",
        boxShadow:   "0 8px 32px rgba(0,0,0,0.6)",
        minWidth:    "140px",
      }}
    >
      {label && (
        <p
          className="text-[10px] uppercase tracking-[0.12em] mb-2 pb-2"
          style={{ color: "var(--clr-text-2)", borderBottom: "1px solid var(--clr-border)" }}
        >
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: p.fill || p.color }}
          />
          <span className="text-[11px]" style={{ color: "var(--clr-text-2)" }}>
            {p.name}:
          </span>
          <span className="font-semibold text-[11px] tabular-nums ml-auto" style={{ color: "var(--clr-text)" }}>
            {typeof p.value === "number" ? p.value.toLocaleString("es-PE") : p.value}
            {p.name === "porcentaje" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

GlassTooltip.propTypes = {
  active:  PropTypes.bool,
  payload: PropTypes.array,
  label:   PropTypes.string,
};
