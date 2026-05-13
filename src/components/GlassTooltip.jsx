import PropTypes from "prop-types";

export default function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{ backdropFilter: "blur(20px)" }}
      className="bg-black/70 border border-white/20 rounded-xl px-4 py-3 shadow-2xl text-sm"
    >
      {label && <p className="text-white/50 text-xs mb-1.5">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.fill || p.color }}
          />
          <span className="text-white/55 text-xs">{p.name}:</span>
          <span className="font-semibold text-white text-xs">
            {typeof p.value === "number" ? p.value.toLocaleString("es-PE") : p.value}
            {p.name === "porcentaje" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

GlassTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};
