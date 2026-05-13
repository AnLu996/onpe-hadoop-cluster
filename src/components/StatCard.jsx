import PropTypes from "prop-types";

const ACCENTS = {
  blue: { icon: "bg-blue-500/20 text-blue-300", line: "via-blue-400/60", glow: "bg-blue-600/25" },
  purple: {
    icon: "bg-purple-500/20 text-purple-300",
    line: "via-purple-400/60",
    glow: "bg-purple-600/25",
  },
  indigo: {
    icon: "bg-indigo-500/20 text-indigo-300",
    line: "via-indigo-400/60",
    glow: "bg-indigo-600/25",
  },
  cyan: { icon: "bg-cyan-500/20 text-cyan-300", line: "via-cyan-400/60", glow: "bg-cyan-600/25" },
};

export default function StatCard({ icon: Icon, label, value, sub, color = "blue" }) {
  const c = ACCENTS[color];
  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className="relative bg-white/[0.06] border border-white/[0.11] rounded-2xl p-5 overflow-hidden group hover:bg-white/[0.09] transition-all duration-300 cursor-default"
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${c.line} to-transparent`}
      />
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 ${c.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${c.icon} flex-shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-white/45 text-[11px] font-medium tracking-widest uppercase">
            {label}
          </span>
        </div>
        <p className="text-[2rem] font-bold text-white leading-none tracking-tight">{value}</p>
        {sub && <p className="text-white/30 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  color: PropTypes.oneOf(["blue", "purple", "indigo", "cyan"]),
};
