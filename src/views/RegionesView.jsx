import { useState } from "react";
import PeruMap from "../components/PeruMap";
import {
  MOCK_ACTAS_REGION,
  MOCK_GANADOR_REGION,
  MOCK_REGION_MAP_DATA,
} from "../data/mock";

const fmt = (n) => Number(n).toLocaleString("es-PE");

// Sorted regions: highest participation first
const SORTED_REGIONS = Object.entries(MOCK_REGION_MAP_DATA)
  .sort((a, b) => b[1].participacion - a[1].participacion);

const PART_COLOR = (p) => {
  if (p >= 85) return "#10b981";
  if (p >= 80) return "#34d399";
  if (p >= 75) return "#60a5fa";
  if (p >= 70) return "#f59e0b";
  return "#f87171";
};

const ACTAS_MAP = Object.fromEntries(
  MOCK_ACTAS_REGION.map((r) => [
    r.region.toUpperCase(),
    r,
  ])
);

// ── Region list item ─────────────────────────────────────────────────────────
function RegionRow({ regionKey, data, winner, selected, onSelect }) {
  const isSelected = selected === regionKey;
  const pc = PART_COLOR(data.participacion);

  return (
    <button
      type="button"
      className="w-full text-left px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3"
      style={{
        background:  isSelected ? `${winner?.color ?? "var(--clr-red)"}12` : "transparent",
        border:      `1px solid ${isSelected ? winner?.color ?? "var(--clr-red)" : "var(--clr-border)"}`,
      }}
      onClick={() => onSelect(isSelected ? null : regionKey)}
    >
      {/* Winner color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: winner?.color ?? "var(--clr-text-3)" }}
      />

      {/* Name + winner */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--clr-text)" }}>
          {regionKey}
        </p>
        <p className="text-[10px] truncate" style={{ color: "var(--clr-text-2)" }}>
          {winner?.partido ?? "—"}
        </p>
      </div>

      {/* Participation */}
      <div className="text-right flex-shrink-0">
        <p
          className="font-display text-lg leading-none tabular-nums"
          style={{ color: pc }}
        >
          {data.participacion}%
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: "var(--clr-text-3)" }}>
          {fmt(data.mesas)} mesas
        </p>
      </div>
    </button>
  );
}

// ── Region detail panel ──────────────────────────────────────────────────────
function RegionDetail({ regionKey, data, winner, onClose }) {
  const pc       = PART_COLOR(data.participacion);
  const actasRow = ACTAS_MAP[regionKey];
  const total    = actasRow ? actasRow.contabilizada + actasRow.observada + actasRow.sinActa : null;

  const ESTADO_COLOR = {
    Contabilizada: "#10b981",
    Observada:     "#f59e0b",
  };

  const bars = actasRow
    ? [
        { label: "Contabilizadas", value: actasRow.contabilizada, color: "#10b981" },
        { label: "Observadas",     value: actasRow.observada,     color: "#f59e0b" },
        { label: "Sin acta",       value: actasRow.sinActa,        color: "#ef4444" },
      ]
    : [];

  return (
    <div
      className="rounded-xl overflow-hidden h-full flex flex-col"
      style={{
        background: "var(--clr-surface)",
        border:     `1px solid ${winner?.color ?? "var(--clr-border)"}40`,
        boxShadow:  `0 0 40px ${winner?.color ?? "transparent"}10`,
      }}
    >
      {/* Accent line in winner color */}
      <div
        className="h-[2px] flex-shrink-0"
        style={{ background: winner?.color ?? "var(--clr-red)" }}
      />

      {/* Back button + region name */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--clr-border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] px-2 py-1 rounded border transition-colors"
          style={{
            background:  "var(--clr-elevated)",
            borderColor: "var(--clr-border)",
            color:       "var(--clr-text-2)",
          }}
        >
          ← Volver
        </button>
        <h2
          className="font-display text-2xl leading-none"
          style={{ color: "var(--clr-text)", letterSpacing: "0.06em" }}
        >
          {regionKey}
        </h2>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto">
        {/* Winner badge */}
        {winner && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{
              background:  `${winner.color}10`,
              border:      `1px solid ${winner.color}30`,
            }}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: winner.color }}
            />
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: winner.color }}>
                Ganador en esta región
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--clr-text)" }}>
                {winner.partido}
              </p>
            </div>
          </div>
        )}

        {/* Participation big number */}
        <div
          className="rounded-lg px-4 py-4"
          style={{ background: "var(--clr-elevated)", border: "1px solid var(--clr-border)" }}
        >
          <p
            className="text-[9px] uppercase tracking-[0.2em] mb-1"
            style={{ color: "var(--clr-text-3)" }}
          >
            Participación electoral
          </p>
          <p
            className="font-display text-[3.5rem] leading-none tabular-nums"
            style={{ color: pc }}
          >
            {data.participacion}%
          </p>
          <div
            className="mt-3 h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width:      `${data.participacion}%`,
                background: pc,
                boxShadow:  `0 0 8px ${pc}60`,
              }}
            />
          </div>
        </div>

        {/* Meta stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg text-center"
            style={{ background: "var(--clr-elevated)", border: "1px solid var(--clr-border)" }}
          >
            <p
              className="font-display text-2xl tabular-nums"
              style={{ color: "var(--clr-text)" }}
            >
              {fmt(data.mesas)}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--clr-text-3)" }}>
              Mesas totales
            </p>
          </div>
          <div
            className="p-3 rounded-lg text-center"
            style={{
              background:  `${ESTADO_COLOR[data.estado] ?? "#6b7280"}12`,
              border:      `1px solid ${ESTADO_COLOR[data.estado] ?? "#6b7280"}25`,
            }}
          >
            <p
              className="font-display text-2xl"
              style={{ color: ESTADO_COLOR[data.estado] ?? "var(--clr-text-2)" }}
            >
              OK
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--clr-text-3)" }}>
              {data.estado}
            </p>
          </div>
        </div>

        {/* Actas breakdown if available */}
        {bars.length > 0 && (
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--clr-text-3)" }}
            >
              Estado de actas ({fmt(total)} total)
            </p>
            <div className="space-y-2.5">
              {bars.map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px]" style={{ color: "var(--clr-text-2)" }}>
                      {label}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-display text-base tabular-nums"
                        style={{ color }}
                      >
                        {fmt(value)}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--clr-text-3)" }}>
                        ({total ? ((value / total) * 100).toFixed(1) : "—"}%)
                      </span>
                    </div>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:      `${total ? (value / total) * 100 : 0}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── All-regions list ─────────────────────────────────────────────────────────
function RegionList({ selected, onSelect }) {
  return (
    <div
      className="rounded-xl overflow-hidden h-full flex flex-col"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-border)",
      }}
    >
      <div
        className="h-[1.5px]"
        style={{ background: "linear-gradient(90deg, var(--clr-red) 0%, transparent 60%)" }}
      />
      <div
        className="px-5 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid var(--clr-border)", background: "var(--clr-elevated)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full" style={{ background: "var(--clr-red)" }} />
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--clr-text-3)" }}>
              Participación
            </p>
            <h2 className="text-sm font-semibold" style={{ color: "var(--clr-text)" }}>
              Todas las Regiones
            </h2>
          </div>
        </div>
        <span className="text-[10px]" style={{ color: "var(--clr-text-3)" }}>
          Clic en región para ver detalle
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {SORTED_REGIONS.map(([key, data]) => (
          <RegionRow
            key={key}
            regionKey={key}
            data={data}
            winner={MOCK_GANADOR_REGION[key]}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────
export default function RegionesView() {
  const [selected, setSelected] = useState(null);
  const [mapView, setMapView]   = useState("ganador");

  const regionData    = MOCK_REGION_MAP_DATA[selected];
  const winnerData    = MOCK_GANADOR_REGION[selected];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 min-h-[800px]">
      {/* Map */}
      <div className="xl:col-span-3">
        <PeruMap
          regionData={MOCK_REGION_MAP_DATA}
          ganadorData={MOCK_GANADOR_REGION}
          viewMode={mapView}
          onToggleView={() =>
            setMapView((v) => (v === "participacion" ? "ganador" : "participacion"))
          }
          onSelectRegion={setSelected}
        />
      </div>

      {/* Right panel */}
      <div className="xl:col-span-2">
        {selected && regionData ? (
          <RegionDetail
            regionKey={selected}
            data={regionData}
            winner={winnerData}
            onClose={() => setSelected(null)}
          />
        ) : (
          <RegionList selected={selected} onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
