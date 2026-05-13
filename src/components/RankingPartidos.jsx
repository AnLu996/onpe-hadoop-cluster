import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PARTIDO_COLORS } from "../data/mock";
import GlassTooltip from "./GlassTooltip";
import Panel from "./Panel";

export default function RankingPartidos({ data }) {
  return (
    <Panel className="p-5">
      <PanelHeader eyebrow="Resultados" title="Ranking de Partidos" />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 55, bottom: 0, left: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "var(--clr-text-2)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="corto"
            width={38}
            tick={{ fill: "var(--clr-text-2)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
          <Bar
            dataKey="porcentaje"
            name="porcentaje"
            radius={[0, 5, 5, 0]}
            label={{
              position:  "right",
              fill:      "var(--clr-text-2)",
              fontSize:  11,
              formatter: (v) => `${v}%`,
            }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PARTIDO_COLORS[i % PARTIDO_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

RankingPartidos.propTypes = {
  data: PropTypes.array.isRequired,
};

export function PanelHeader({ eyebrow, title, className = "mb-4" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="w-[3px] h-5 rounded-full flex-shrink-0"
        style={{ background: "var(--clr-red)" }}
      />
      <div>
        <p
          className="text-[9px] uppercase tracking-[0.22em] font-semibold"
          style={{ color: "var(--clr-text-3)" }}
        >
          {eyebrow}
        </p>
        <h2 className="text-sm font-semibold leading-tight" style={{ color: "var(--clr-text)" }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

PanelHeader.propTypes = {
  eyebrow:   PropTypes.string.isRequired,
  title:     PropTypes.string.isRequired,
  className: PropTypes.string,
};
