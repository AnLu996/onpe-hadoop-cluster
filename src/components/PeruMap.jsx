import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import PropTypes from "prop-types";

const SCALE = [
  { min: 85, color: "#1d4ed8", label: "> 85%" },
  { min: 80, color: "#2563eb", label: "80–85%" },
  { min: 75, color: "#3b82f6", label: "75–80%" },
  { min: 70, color: "#60a5fa", label: "70–75%" },
  { min: 65, color: "#93c5fd", label: "65–70%" },
  { min: 0,  color: "#bfdbfe", label: "< 65%"  },
];

function getColor(participacion) {
  if (!participacion) return "#e2e8f0";
  return SCALE.find((s) => participacion >= s.min)?.color ?? "#e2e8f0";
}

const ESTADO_DOT = {
  "Contabilizada": "bg-emerald-400",
  "Observada":     "bg-amber-400",
};

export default function PeruMap({ regionData = {}, onSelectRegion }) {
  const [geoData, setGeoData]   = useState(null);
  const [tooltip, setTooltip]   = useState(null);

  useEffect(() => {
    fetch("/peru.geojson").then((r) => r.json()).then(setGeoData);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 h-full flex flex-col">

      <div className="mb-3">
        <h2 className="font-semibold text-slate-800">Mapa Electoral</h2>
        <p className="text-xs text-slate-400 mt-0.5">Participación por región — hover para detalles</p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {SCALE.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-xs text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Mapa */}
      <div className="relative flex-1 bg-slate-50 rounded-xl overflow-hidden">
        {geoData ? (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1150, center: [-75, -9] }}
            style={{ width: "100%", height: "100%", minHeight: 460 }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const rawName = geo.properties.NOMBDEP || geo.properties.name || "";
                  const name    = rawName.trim();
                  const data    = regionData[name];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setTooltip({ name, data })}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => onSelectRegion?.(name)}
                      style={{
                        default: {
                          fill:        getColor(data?.participacion),
                          stroke:      "#ffffff",
                          strokeWidth: 0.6,
                          outline:     "none",
                        },
                        hover: {
                          fill:        "#1e40af",
                          stroke:      "#ffffff",
                          strokeWidth: 0.8,
                          outline:     "none",
                          cursor:      "pointer",
                        },
                        pressed: {
                          fill:    "#1e3a8a",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <div className="flex items-center justify-center h-full min-h-96 text-slate-400 text-sm">
            Cargando mapa…
          </div>
        )}

        {/* Tooltip flotante */}
        {tooltip && (
          <div className="absolute top-3 right-3 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-2xl z-50 min-w-40 pointer-events-none">
            <p className="font-bold text-sm mb-2">{tooltip.name || "—"}</p>
            {tooltip.data ? (
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Participación</span>
                  <span className="font-semibold">{tooltip.data.participacion}%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Mesas</span>
                  <span className="font-semibold">{tooltip.data.mesas.toLocaleString("es-PE")}</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
                  <span className="text-slate-400">Estado</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_DOT[tooltip.data.estado] ?? "bg-slate-400"}`} />
                    <span className="font-medium">{tooltip.data.estado}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Sin datos disponibles</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

PeruMap.propTypes = {
  regionData:      PropTypes.object,
  onSelectRegion:  PropTypes.func,
};
