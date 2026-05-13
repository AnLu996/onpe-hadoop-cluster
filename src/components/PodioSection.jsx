import PropTypes from "prop-types";
import { PARTIDO_COLORS } from "../data/mock";

const fmt = (n) => Number(n).toLocaleString("es-PE");

const STYLES = {
  1: {
    orderMobile: "order-1",
    orderSm:     "sm:order-2",
    nudge:       "sm:-mt-5",
    accentColor: "#C4860A",
    accentBorder: "rgba(196,134,10,0.45)",
    numColor:    "#D4A020",
    badgeBg:     "rgba(196,134,10,0.12)",
    badgeBorder: "rgba(196,134,10,0.32)",
    badgeText:   "#C4860A",
    glowColor:   "rgba(196,134,10,0.06)",
    label:       "Primer Lugar",
  },
  2: {
    orderMobile: "order-2",
    orderSm:     "sm:order-1",
    nudge:       "",
    accentColor: "rgba(255,255,255,0.22)",
    accentBorder: "rgba(255,255,255,0.1)",
    numColor:    "rgba(255,255,255,0.38)",
    badgeBg:     "rgba(255,255,255,0.05)",
    badgeBorder: "rgba(255,255,255,0.09)",
    badgeText:   "rgba(255,255,255,0.5)",
    glowColor:   "rgba(255,255,255,0.01)",
    label:       "Segundo Lugar",
  },
  3: {
    orderMobile: "order-3",
    orderSm:     "sm:order-3",
    nudge:       "sm:mt-4",
    accentColor: "rgba(200,90,30,0.55)",
    accentBorder: "rgba(200,90,30,0.22)",
    numColor:    "rgba(210,110,50,0.8)",
    badgeBg:     "rgba(200,90,30,0.08)",
    badgeBorder: "rgba(200,90,30,0.22)",
    badgeText:   "rgba(210,110,60,0.9)",
    glowColor:   "rgba(200,90,30,0.03)",
    label:       "Tercer Lugar",
  },
};

function PodioCard({ position, data, barColor }) {
  const s = STYLES[position];

  return (
    <div
      className={`relative flex-1 rounded-xl overflow-hidden p-5 transition-all duration-300 ${s.orderMobile} ${s.orderSm} ${s.nudge}`}
      style={{
        background:  `linear-gradient(155deg, var(--clr-elevated) 0%, var(--clr-surface) 100%)`,
        border:      `1px solid ${s.accentBorder}`,
        boxShadow:   `0 8px 40px rgba(0,0,0,0.45), inset 0 0 80px ${s.glowColor}`,
      }}
    >
      {/* Accent line top */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: `linear-gradient(90deg, ${s.accentColor} 0%, ${s.accentColor}55 50%, transparent 100%)`,
        }}
      />

      {/* Watermark position number */}
      <div
        className="absolute -bottom-4 -right-3 font-display text-[130px] leading-none select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.018)", letterSpacing: "0.02em" }}
      >
        {position}
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="font-display text-5xl leading-none" style={{ color: s.numColor }}>
            {position}°
          </span>
          <span
            className="text-[9px] px-2 py-0.5 rounded border font-semibold uppercase tracking-[0.15em]"
            style={{
              background:   s.badgeBg,
              borderColor:  s.badgeBorder,
              color:        s.badgeText,
            }}
          >
            {data.corto}
          </span>
        </div>

        <p
          className="text-[11px] uppercase tracking-[0.1em] mb-1 leading-snug"
          style={{ color: "var(--clr-text-2)" }}
        >
          {data.partido}
        </p>

        <p
          className="font-display text-[2.8rem] leading-none mb-0.5 tabular-nums"
          style={{ color: "var(--clr-text)" }}
        >
          {data.porcentaje}%
        </p>

        <p className="text-[11px] mb-4" style={{ color: "var(--clr-text-3)" }}>
          {fmt(data.votos)} votos
        </p>

        {/* Progress bar */}
        <div
          className="w-full h-[2px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${data.porcentaje}%`, background: barColor }}
          />
        </div>

        <p
          className="text-[9px] uppercase tracking-[0.18em] mt-3"
          style={{ color: s.numColor, opacity: 0.7 }}
        >
          {s.label}
        </p>
      </div>
    </div>
  );
}

export default function PodioSection({ data }) {
  const top3 = data.slice(0, 3);
  const renderOrder = [
    { pos: 2, d: top3[1] },
    { pos: 1, d: top3[0] },
    { pos: 3, d: top3[2] },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
      {renderOrder.map(({ pos, d }) => (
        <PodioCard
          key={d.corto}
          position={pos}
          data={d}
          barColor={PARTIDO_COLORS[pos - 1]}
        />
      ))}
    </div>
  );
}

PodioSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      partido:    PropTypes.string,
      corto:      PropTypes.string,
      votos:      PropTypes.number,
      porcentaje: PropTypes.number,
    })
  ).isRequired,
};

PodioCard.propTypes = {
  position: PropTypes.number,
  data:     PropTypes.object,
  barColor: PropTypes.string,
};
