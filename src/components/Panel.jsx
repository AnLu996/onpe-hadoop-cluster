import PropTypes from "prop-types";

const ACCENTS = {
  red:    "var(--clr-red)",
  gold:   "var(--clr-gold)",
  blue:   "#3b82f6",
  none:   "transparent",
};

export default function Panel({ children, className = "", accent = "red" }) {
  const color = ACCENTS[accent] ?? ACCENTS.red;
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background:  "var(--clr-surface)",
        border:      "1px solid var(--clr-border)",
        boxShadow:   "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div
        className="h-[1.5px] flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color}55 45%, transparent 100%)`,
        }}
      />
      {children}
    </div>
  );
}

Panel.propTypes = {
  children:  PropTypes.node,
  className: PropTypes.string,
  accent:    PropTypes.oneOf(["red", "gold", "blue", "none"]),
};
