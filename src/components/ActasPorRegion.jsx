import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassTooltip from "./GlassTooltip";
import Panel from "./Panel";
import { PanelHeader } from "./RankingPartidos";

export default function ActasPorRegion({ data }) {
  return (
    <Panel className="p-5">
      <PanelHeader eyebrow="Distribución" title="Estado de Actas por Región" />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
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
          />
          <YAxis
            type="category"
            dataKey="region"
            width={82}
            tick={{ fill: "var(--clr-text-2)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
          <Legend
            iconType="square"
            iconSize={6}
            formatter={(v) => (
              <span style={{ color: "var(--clr-text-2)", fontSize: 11 }}>{v}</span>
            )}
          />
          <Bar dataKey="contabilizada" name="Contabilizada" stackId="a" fill="#10b981" />
          <Bar dataKey="observada"     name="Observada"     stackId="a" fill="#f59e0b" />
          <Bar
            dataKey="sinActa"
            name="Sin acta"
            stackId="a"
            fill="#ef4444"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

ActasPorRegion.propTypes = {
  data: PropTypes.array.isRequired,
};
