import PropTypes from "prop-types";

const ACCENTS = {
  red: {
    line:      "var(--clr-red)",
    iconBg:    "rgba(200,16,46,0.12)",
    iconColor: "var(--clr-red)",
  },
  gold: {
    line:      "var(--clr-gold)",
    iconBg:    "rgba(196,134,10,0.12)",
    iconColor: "var(--clr-gold)",
  },
  blue: {
    line:      "#3b82f6",
    iconBg:    "rgba(59,130,246,0.12)",
    iconColor: "#60a5fa",
  },
  purple: {
    line:      "#a855f7",
    iconBg:    "rgba(168,85,247,0.12)",
    iconColor: "#c084fc",
  },
};

export default function StatCard({ icon: Icon, label, value, sub, color = "red" }) {
  const c = ACCENTS[color] ?? ACCENTS.red;

  return (
    <div
      className="rounded-xl overflow-hidden cursor-default transition-transform duration-200 hover:-translate-y-[2px]"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-border)",
        boxShadow:  "0 4px 28px rgba(0,0,0,0.4)",
      }}
    >
      {/* Accent line */}
      <div
        className="h-[1.5px]"
        style={{
          background: `linear-gradient(90deg, ${c.line} 0%, ${c.line}55 45%, transparent 100%)`,
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-[9px] uppercase tracking-[0.22em] font-semibold"
            style={{ color: "var(--clr-text-2)" }}
          >
            {label}
          </span>
          <div
            className="p-1.5 rounded-lg flex-shrink-0"
            style={{ background: c.iconBg }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: c.iconColor }} />
          </div>
        </div>

        <p
          className="font-display text-[2.75rem] leading-none mb-1.5 tabular-nums"
          style={{ color: "var(--clr-text)" }}
        >
          {value}
        </p>

        {sub && (
          <p className="text-[11px]" style={{ color: "var(--clr-text-3)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon:  PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub:   PropTypes.string,
  color: PropTypes.oneOf(["red", "gold", "blue", "purple"]),
};
