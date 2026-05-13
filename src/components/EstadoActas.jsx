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
import GlassTooltip from "./GlassTooltip";
import Panel from "./Panel";

const CHART_COLORS = ["#60a5fa", "#c084fc", "#fb923c"];

export default function EstadoActas({ data }) {
  return (
    <Panel className="p-5">
      <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Estadísticas</p>
      <h2 className="text-base font-semibold text-white/85 mb-4">Estado de Actas</h2>
      <ResponsiveContainer width="100%" height={255}>
        <BarChart data={data} barCategoryGap="40%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="nombre"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="votos" name="votos" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

EstadoActas.propTypes = {
  data: PropTypes.array.isRequired,
};
