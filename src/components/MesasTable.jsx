import PropTypes from "prop-types";
import Panel from "./Panel";

const ESTADO_BADGE = {
  Contabilizada: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Observada: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "Sin acta": "bg-red-500/20 text-red-300 border border-red-500/30",
};

const HEADERS = [
  { label: "Mesa", align: "text-left" },
  { label: "Local de votación", align: "text-left" },
  { label: "Estado", align: "text-left" },
  { label: "Participación", align: "text-right" },
];

export default function MesasTable({ mesas, search, onSearchChange }) {
  return (
    <Panel className="flex flex-col">
      <div
        style={{ backdropFilter: "blur(16px)" }}
        className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-4 bg-white/[0.02]"
      >
        <div>
          <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Detalle</p>
          <h2 className="text-sm font-semibold text-white/80">Mesas de Votación</h2>
        </div>
        <input
          style={{ backdropFilter: "blur(12px)" }}
          className="bg-white/[0.07] border border-white/[0.12] text-white/80 placeholder-white/20 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/30 transition-all w-44"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {HEADERS.map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-5 py-3 ${align} text-[10px] font-semibold text-white/30 uppercase tracking-widest bg-white/[0.02]`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mesas.map((m, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors"
              >
                <td className="px-5 py-3 font-mono text-white/35 text-xs">{m.mesa}</td>
                <td className="px-5 py-3 text-white/70 max-w-[200px] truncate">{m.local}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${ESTADO_BADGE[m.estado] ?? "bg-white/10 text-white/50 border border-white/10"}`}
                  >
                    {m.estado}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-14 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                        style={{ width: `${m.participacion}%` }}
                      />
                    </div>
                    <span className="text-white/65 font-medium tabular-nums text-xs w-9 text-right">
                      {m.participacion}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {mesas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center text-white/25 text-sm">
                  Sin resultados para "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-white/[0.05] bg-white/[0.02]">
        <p className="text-white/25 text-xs">Mostrando {mesas.length} mesas</p>
      </div>
    </Panel>
  );
}

MesasTable.propTypes = {
  mesas: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
