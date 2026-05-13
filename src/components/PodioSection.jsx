import PropTypes from "prop-types";
import { PARTIDO_COLORS } from "../data/mock";

const fmt = (n) => Number(n).toLocaleString("es-PE");

const MEDAL_STYLES = [
  {
    label: "1° lugar",
    ring: "border-yellow-400/40",
    bg: "bg-yellow-500/10",
    numColor: "text-yellow-200",
    glow: "bg-yellow-500/15",
    badge: "bg-yellow-500/20 border-yellow-400/35 text-yellow-300",
  },
  {
    label: "2° lugar",
    ring: "border-slate-400/35",
    bg: "bg-slate-500/10",
    numColor: "text-slate-300",
    glow: "bg-slate-500/15",
    badge: "bg-slate-500/20 border-slate-400/30 text-slate-300",
  },
  {
    label: "3° lugar",
    ring: "border-orange-500/35",
    bg: "bg-orange-500/10",
    numColor: "text-orange-300",
    glow: "bg-orange-500/15",
    badge: "bg-orange-500/20 border-orange-400/30 text-orange-300",
  },
];

function PodioCard({ position, data }) {
  const s = MEDAL_STYLES[position - 1];
  const barColor = PARTIDO_COLORS[position - 1];

  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className={`relative bg-white/[0.06] border ${s.ring} rounded-2xl p-5 overflow-hidden flex-1`}
    >
      <div className={`absolute -top-8 -right-8 w-28 h-28 ${s.glow} rounded-full blur-2xl`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className={`text-4xl font-black ${s.numColor} opacity-70 leading-none`}>
            {position}°
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${s.badge}`}>
            {data.corto}
          </span>
        </div>

        <p className="text-white/75 font-semibold text-sm mb-1 leading-snug">{data.partido}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{data.porcentaje}%</p>
        <p className="text-white/30 text-xs mt-0.5">{fmt(data.votos)} votos</p>

        <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${data.porcentaje}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PodioSection({ data }) {
  const top3 = data.slice(0, 3);
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {top3.map((d, i) => (
        <PodioCard key={d.corto} position={i + 1} data={d} />
      ))}
    </div>
  );
}

PodioSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      partido: PropTypes.string,
      corto: PropTypes.string,
      votos: PropTypes.number,
      porcentaje: PropTypes.number,
    })
  ).isRequired,
};

PodioCard.propTypes = {
  position: PropTypes.number,
  data: PropTypes.object,
};
