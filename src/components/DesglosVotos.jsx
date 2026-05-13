import PropTypes from "prop-types";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Panel from "./Panel";

const fmt = (n) => Number(n).toLocaleString("es-PE");

export default function DesglosVotos({ data }) {
  const total = data.reduce((s, d) => s + d.valor, 0);

  return (
    <Panel className="p-5">
      <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Análisis</p>
      <h2 className="text-base font-semibold text-white/85 mb-1">Desglose de Votos</h2>
      <p className="text-white/30 text-xs mb-3">Válidos · Blancos · Nulos</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="valor"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={75}
            innerRadius={42}
            paddingAngle={3}
          >
            {data.map((d) => (
              <Cell key={d.nombre} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, name) => [fmt(v), name]}
            contentStyle={{
              backdropFilter: "blur(20px)",
              background: "rgba(4,12,30,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              fontSize: "13px",
            }}
            itemStyle={{ color: "rgba(255,255,255,0.85)" }}
            labelStyle={{ color: "rgba(255,255,255,0.45)" }}
          />
          <Legend
            iconType="circle"
            iconSize={7}
            formatter={(v) => (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{v}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {data.map((d) => (
          <div key={d.nombre} className="text-center">
            <p className="text-lg font-bold" style={{ color: d.color }}>
              {d.porcentaje}%
            </p>
            <p className="text-white/35 text-[10px]">{d.nombre}</p>
            <p className="text-white/20 text-[10px]">{fmt(d.valor)}</p>
          </div>
        ))}
      </div>

      <p className="text-white/20 text-[10px] text-center mt-2">Total emitidos: {fmt(total)}</p>
    </Panel>
  );
}

DesglosVotos.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string,
      valor: PropTypes.number,
      porcentaje: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
};
