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
      <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Resultados</p>
      <h2 className="text-base font-semibold text-white/85 mb-4">Ranking de Partidos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 55, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="corto"
            width={38}
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar
            dataKey="porcentaje"
            name="porcentaje"
            radius={[0, 6, 6, 0]}
            label={{
              position: "right",
              fill: "rgba(255,255,255,0.45)",
              fontSize: 11,
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
