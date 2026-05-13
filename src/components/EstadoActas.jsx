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
import { PanelHeader } from "./RankingPartidos";

const CHART_COLORS = ["#c8102e", "#a855f7", "#f97316"];

export default function EstadoActas({ data }) {
  return (
    <Panel className="p-5">
      <PanelHeader eyebrow="Estadísticas" title="Estado de Actas por Candidato" />
      <ResponsiveContainer width="100%" height={255}>
        <BarChart data={data} barCategoryGap="40%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="nombre"
            tick={{ fill: "var(--clr-text-2)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--clr-text-2)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
          <Bar dataKey="votos" name="votos" radius={[6, 6, 0, 0]}>
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
