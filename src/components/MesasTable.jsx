import PropTypes from "prop-types";
import Panel from "./Panel";
import { PanelHeader } from "./RankingPartidos";

const ESTADO_BADGE = {
  Contabilizada: {
    bg:     "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.28)",
    color:  "#34d399",
  },
  Observada: {
    bg:     "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.28)",
    color:  "#fbbf24",
  },
  "Sin acta": {
    bg:     "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.28)",
    color:  "#f87171",
  },
};

const HEADERS = [
  { label: "Mesa",            align: "text-left"  },
  { label: "Local",           align: "text-left"  },
  { label: "Estado",          align: "text-left"  },
  { label: "Participación",   align: "text-right" },
];

export default function MesasTable({ mesas, search, onSearchChange }) {
  return (
    <Panel className="flex flex-col">
      {/* Header row */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-4"
        style={{ borderBottom: "1px solid var(--clr-border)" }}
      >
        <PanelHeader eyebrow="Detalle" title="Mesas de Votación" className="" />
        <input
          className="text-sm px-3 py-1.5 rounded-lg border focus:outline-none transition-all w-44"
          style={{
            background:    "var(--clr-elevated)",
            borderColor:   "var(--clr-border)",
            color:         "var(--clr-text)",
            "::placeholder": { color: "var(--clr-text-3)" },
          }}
          placeholder="Buscar…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--clr-border)" }}>
              {HEADERS.map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-5 py-3 ${align} text-[9px] font-semibold uppercase tracking-[0.18em]`}
                  style={{
                    color:      "var(--clr-text-3)",
                    background: "rgba(255,255,255,0.01)",
                  }}
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
                className="transition-colors duration-100"
                style={{
                  borderBottom: "1px solid var(--clr-border)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.025)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td
                  className="px-5 py-3 font-mono text-xs tabular-nums"
                  style={{ color: "var(--clr-text-2)" }}
                >
                  {m.mesa}
                </td>
                <td
                  className="px-5 py-3 max-w-[200px] truncate text-sm"
                  style={{ color: "var(--clr-text)" }}
                >
                  {m.local}
                </td>
                <td className="px-5 py-3">
                  {(() => {
                    const b = ESTADO_BADGE[m.estado];
                    return (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                        style={
                          b
                            ? { background: b.bg, borderColor: b.border, color: b.color }
                            : {
                                background:  "rgba(255,255,255,0.05)",
                                borderColor: "var(--clr-border)",
                                color:       "var(--clr-text-2)",
                              }
                        }
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: b?.color ?? "var(--clr-text-2)" }}
                        />
                        {m.estado}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className="w-14 h-[2px] rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      `${m.participacion}%`,
                          background: "linear-gradient(90deg, var(--clr-red) 0%, #ff4060 100%)",
                        }}
                      />
                    </div>
                    <span
                      className="font-display text-base tabular-nums w-10 text-right"
                      style={{ color: "var(--clr-text)" }}
                    >
                      {m.participacion}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {mesas.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-14 text-center text-sm"
                  style={{ color: "var(--clr-text-3)" }}
                >
                  Sin resultados para &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="px-5 py-3"
        style={{ borderTop: "1px solid var(--clr-border)" }}
      >
        <p className="text-[10px]" style={{ color: "var(--clr-text-3)" }}>
          Mostrando {mesas.length} mesa{mesas.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Panel>
  );
}

MesasTable.propTypes = {
  mesas:          PropTypes.array.isRequired,
  search:         PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
