import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const PART_SCALE = [
  { min: 85, color: "#7dd3fc", label: "> 85%" },
  { min: 80, color: "#60a5fa", label: "80–85%" },
  { min: 75, color: "#3b82f6", label: "75–80%" },
  { min: 70, color: "#2563eb", label: "70–75%" },
  { min: 65, color: "#1d4ed8", label: "65–70%" },
  { min: 0, color: "#1e3a8a", label: "< 65%" },
];

const ESTADO_DOT = { Contabilizada: "bg-emerald-400", Observada: "bg-amber-400" };

function getPartColor(p) {
  if (p == null) return "rgba(255,255,255,0.06)";
  return PART_SCALE.find((s) => p >= s.min)?.color ?? "rgba(255,255,255,0.06)";
}

export default function PeruMap({
  regionData = {},
  ganadorData = {},
  viewMode = "participacion",
  onToggleView,
  onSelectRegion,
}) {
  const [geoData, setGeoData] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetch("/peru.geojson")
      .then((r) => r.json())
      .then(setGeoData);
  }, []);

  function getFill(name) {
    if (viewMode === "ganador") return ganadorData[name]?.color ?? "rgba(255,255,255,0.06)";
    return getPartColor(regionData[name]?.participacion);
  }

  const ganadorPartidos = [...new Set(Object.values(ganadorData).map((d) => d.partido))];

  return (
    <div
      className="rounded-xl overflow-hidden p-5 h-full flex flex-col"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-border)",
        boxShadow:  "0 4px 32px rgba(0,0,0,0.45)",
      }}
    >
      {/* Red accent line */}
      <div
        className="h-[1.5px] -mx-5 -mt-5 mb-4"
        style={{ background: "linear-gradient(90deg, var(--clr-red) 0%, transparent 60%)" }}
      />

      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-[3px] h-5 rounded-full flex-shrink-0"
            style={{ background: "var(--clr-red)" }}
          />
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "var(--clr-text-3)" }}
            >
              Geografía
            </p>
            <h2 className="text-sm font-semibold" style={{ color: "var(--clr-text)" }}>
              Mapa Electoral
            </h2>
          </div>
        </div>
        {onToggleView && (
          <button
            type="button"
            onClick={onToggleView}
            className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded-lg border font-semibold uppercase tracking-wider transition-all duration-150"
            style={{
              background:   "var(--clr-elevated)",
              borderColor:  "var(--clr-border)",
              color:        "var(--clr-text-2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--clr-red-border)";
              e.currentTarget.style.color = "var(--clr-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--clr-border)";
              e.currentTarget.style.color = "var(--clr-text-2)";
            }}
          >
            {viewMode === "participacion" ? "Ver ganador" : "Ver participación"}
          </button>
        )}
      </div>

      {/* Legend */}
      {viewMode === "participacion" ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
          {PART_SCALE.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-[10px]" style={{ color: "var(--clr-text-2)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
          {ganadorPartidos.map((partido) => {
            const color = Object.values(ganadorData).find((d) => d.partido === partido)?.color;
            return (
              <div key={partido} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-[10px] truncate max-w-[120px]" style={{ color: "var(--clr-text-2)" }}>{partido}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Map */}
      <div
        className="relative rounded-xl overflow-hidden bg-white/[0.03]"
        style={{ height: "690px" }}
      >
        {geoData ? (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1800, center: [-75, -9] }}
            style={{ width: "100%", height: "690px" }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = (geo.properties.NOMBDEP || geo.properties.name || "").trim();
                  const partData = regionData[name];
                  const winData = ganadorData[name];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setTooltip({ name, partData, winData })}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => onSelectRegion?.(name)}
                      style={{
                        default: {
                          fill: getFill(name),
                          stroke: "rgba(255,255,255,0.18)",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#e0f2fe",
                          stroke: "rgba(255,255,255,0.7)",
                          strokeWidth: 0.8,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { fill: "#bae6fd", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <div
            className="flex items-center justify-center text-sm"
            style={{ height: "690px", color: "var(--clr-text-3)" }}
          >
            Cargando mapa…
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute top-3 right-3 rounded-xl p-3.5 shadow-2xl z-50 min-w-[160px] pointer-events-none slide-in"
            style={{
              background:  "var(--clr-elevated)",
              border:      "1px solid var(--clr-border-med)",
              boxShadow:   "0 8px 32px rgba(0,0,0,0.65)",
            }}
          >
            <p
              className="font-semibold text-sm mb-2.5 pb-2"
              style={{
                color:        "var(--clr-text)",
                borderBottom: "1px solid var(--clr-border)",
              }}
            >
              {tooltip.name || "—"}
            </p>
            {tooltip.partData ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between gap-6">
                  <span style={{ color: "var(--clr-text-2)" }}>Participación</span>
                  <span className="font-semibold tabular-nums" style={{ color: "var(--clr-text)" }}>
                    {tooltip.partData.participacion}%
                  </span>
                </div>
                <div
                  className="w-full h-[2px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:      `${tooltip.partData.participacion}%`,
                      background: "linear-gradient(90deg, var(--clr-red), #ff4060)",
                    }}
                  />
                </div>
                <div className="flex justify-between gap-6 pt-0.5">
                  <span style={{ color: "var(--clr-text-2)" }}>Mesas</span>
                  <span className="font-semibold tabular-nums" style={{ color: "var(--clr-text)" }}>
                    {tooltip.partData.mesas.toLocaleString("es-PE")}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between gap-4 pt-1.5"
                  style={{ borderTop: "1px solid var(--clr-border)" }}
                >
                  <span style={{ color: "var(--clr-text-2)" }}>Estado</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ESTADO_DOT[tooltip.partData.estado] ?? "bg-slate-400"}`}
                    />
                    <span className="font-medium" style={{ color: "var(--clr-text)" }}>
                      {tooltip.partData.estado}
                    </span>
                  </div>
                </div>
                {tooltip.winData && (
                  <div
                    className="flex items-center justify-between gap-4 pt-1.5"
                    style={{ borderTop: "1px solid var(--clr-border)" }}
                  >
                    <span style={{ color: "var(--clr-text-2)" }}>Ganador</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: tooltip.winData.color }}
                      />
                      <span className="font-medium text-[10px]" style={{ color: "var(--clr-text)" }}>
                        {tooltip.winData.partido}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--clr-text-3)" }}>Sin datos disponibles</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

PeruMap.propTypes = {
  regionData: PropTypes.object,
  ganadorData: PropTypes.object,
  viewMode: PropTypes.oneOf(["participacion", "ganador"]),
  onToggleView: PropTypes.func,
  onSelectRegion: PropTypes.func,
};
