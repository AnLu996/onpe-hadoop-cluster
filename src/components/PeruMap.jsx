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
      style={{ backdropFilter: "blur(28px)" }}
      className="bg-white/[0.06] border border-white/[0.11] rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">Geografía</p>
          <h2 className="text-base font-semibold text-white/85">Mapa Electoral</h2>
        </div>
        {onToggleView && (
          <button
            type="button"
            onClick={onToggleView}
            className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white/60 hover:bg-white/[0.12] hover:text-white/80 transition-all"
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
                className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-[11px] text-white/35">{s.label}</span>
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
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-[11px] text-white/35 truncate max-w-[120px]">{partido}</span>
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
            className="flex items-center justify-center text-white/25 text-sm"
            style={{ height: "690px" }}
          >
            Cargando mapa…
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{ backdropFilter: "blur(24px)" }}
            className="absolute top-3 right-3 bg-black/75 border border-white/20 rounded-xl p-3.5 shadow-2xl z-50 min-w-[165px] pointer-events-none"
          >
            <p className="font-bold text-sm text-white/90 mb-2.5">{tooltip.name || "—"}</p>
            {tooltip.partData ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between gap-6">
                  <span className="text-white/40">Participación</span>
                  <span className="font-semibold text-white/90">
                    {tooltip.partData.participacion}%
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                    style={{ width: `${tooltip.partData.participacion}%` }}
                  />
                </div>
                <div className="flex justify-between gap-6 pt-0.5">
                  <span className="text-white/40">Mesas</span>
                  <span className="font-semibold text-white/90">
                    {tooltip.partData.mesas.toLocaleString("es-PE")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-white/10">
                  <span className="text-white/40">Estado</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ESTADO_DOT[tooltip.partData.estado] ?? "bg-slate-400"}`}
                    />
                    <span className="font-medium text-white/80">{tooltip.partData.estado}</span>
                  </div>
                </div>
                {tooltip.winData && (
                  <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-white/10">
                    <span className="text-white/40">Ganador</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: tooltip.winData.color }}
                      />
                      <span className="font-medium text-white/80 text-[10px]">
                        {tooltip.winData.partido}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/25 text-xs">Sin datos disponibles</p>
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
