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

export default function ActasPorRegion({ data }) {
  return (
    <Panel className="p-5">
      <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Distribución</p>
      <h2 className="text-base font-semibold text-white/85 mb-4">Estado de Actas por Región</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="region"
            width={82}
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            iconType="circle"
            iconSize={7}
            formatter={(v) => (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{v}</span>
            )}
          />
          <Bar dataKey="contabilizada" name="Contabilizada" stackId="a" fill="#34d399" />
          <Bar dataKey="observada" name="Observada" stackId="a" fill="#fbbf24" />
          <Bar dataKey="sinActa" name="Sin acta" stackId="a" fill="#f87171" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

ActasPorRegion.propTypes = {
  data: PropTypes.array.isRequired,
};
