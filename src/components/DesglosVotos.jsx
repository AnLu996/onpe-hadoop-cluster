import PropTypes from "prop-types";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Panel from "./Panel";
import { PanelHeader } from "./RankingPartidos";

const fmt = (n) => Number(n).toLocaleString("es-PE");

export default function DesglosVotos({ data }) {
  const total = data.reduce((s, d) => s + d.valor, 0);

  return (
    <Panel className="p-5">
      <PanelHeader eyebrow="Análisis" title="Desglose de Votos" />

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={75}
            innerRadius={44}
            paddingAngle={3}
          >
            {data.map((d) => (
              <Cell key={d.nombre} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, name) => [fmt(v), name]}
            contentStyle={{
              background:   "var(--clr-elevated)",
              border:       "1px solid var(--clr-border-med)",
              borderRadius: "10px",
              fontSize:     "12px",
              boxShadow:    "0 8px 24px rgba(0,0,0,0.5)",
            }}
            itemStyle={{ color: "var(--clr-text)" }}
            labelStyle={{ color: "var(--clr-text-2)", fontSize: "10px" }}
          />
          <Legend
            iconType="circle"
            iconSize={6}
            formatter={(v) => (
              <span style={{ color: "var(--clr-text-2)", fontSize: 11 }}>{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 mt-1">
        {data.map((d) => (
          <div
            key={d.nombre}
            className="text-center py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)" }}
          >
            <p className="font-display text-xl tabular-nums leading-none" style={{ color: d.color }}>
              {d.porcentaje}%
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--clr-text-2)" }}>
              {d.nombre}
            </p>
            <p className="text-[10px]" style={{ color: "var(--clr-text-3)" }}>
              {fmt(d.valor)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-center mt-2.5" style={{ color: "var(--clr-text-3)" }}>
        Total emitidos: {fmt(total)}
      </p>
    </Panel>
  );
}

DesglosVotos.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre:     PropTypes.string,
      valor:      PropTypes.number,
      porcentaje: PropTypes.number,
      color:      PropTypes.string,
    })
  ).isRequired,
};
