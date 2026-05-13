import { useState } from "react";
import ActasPorRegion from "../components/ActasPorRegion";
import MesasTable from "../components/MesasTable";
import { MOCK_ACTAS_REGION, MOCK_CANDIDATOS, MOCK_MESAS, MOCK_STATS } from "../data/mock";

const fmt = (n) => Number(n).toLocaleString("es-PE");
const pct = (n, t) => ((n / t) * 100).toFixed(1);

const ESTADO_COLORS = {
  Contabilizada: { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.28)",  text: "#10b981", bar: "#10b981" },
  Observada:     { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.28)",  text: "#f59e0b", bar: "#f59e0b" },
  "Sin acta":    { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.28)",   text: "#ef4444", bar: "#ef4444" },
};

// ── Actas status cards (big 3-up) ────────────────────────────────────────────
function ActasStatusGrid({ data, total }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {data.map((item) => {
        const c     = ESTADO_COLORS[item.nombre] ?? ESTADO_COLORS["Sin acta"];
        const share = pct(item.votos, total);

        return (
          <div
            key={item.nombre}
            className="rounded-xl overflow-hidden"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <div className="h-[2px]" style={{ background: c.bar }} />
            <div className="p-5">
              <p
                className="text-[9px] uppercase tracking-[0.22em] font-semibold mb-3"
                style={{ color: c.text, opacity: 0.8 }}
              >
                {item.nombre}
              </p>
              <p
                className="font-display text-[2.8rem] leading-none tabular-nums"
                style={{ color: c.text }}
              >
                {fmt(item.votos)}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1 mb-3">
                <span
                  className="font-display text-2xl tabular-nums"
                  style={{ color: c.text }}
                >
                  {item.porcentaje}%
                </span>
                <span className="text-[11px]" style={{ color: "var(--clr-text-3)" }}>
                  del total
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:      `${item.porcentaje}%`,
                    background: c.bar,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Summary header ───────────────────────────────────────────────────────────
function SummaryBar() {
  const counted    = MOCK_CANDIDATOS.find((d) => d.nombre === "Contabilizada");
  const totalMesas = MOCK_STATS.mesas;
  const totalActas = MOCK_STATS.totalEsperadas;

  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{
        background:  "var(--clr-surface)",
        border:      "1px solid var(--clr-border)",
      }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--clr-text-3)" }}>
            Avance de escrutinio
          </p>
          <p
            className="font-display text-[2.4rem] leading-none tabular-nums"
            style={{ color: "var(--clr-text)" }}
          >
            {MOCK_STATS.avanceConteo}%
          </p>
        </div>

        <div
          className="w-px h-10 hidden sm:block"
          style={{ background: "var(--clr-border)" }}
        />

        {[
          { label: "Actas esperadas",     value: fmt(totalActas)    },
          { label: "Actas contabilizadas",value: fmt(MOCK_STATS.actas) },
          { label: "Padrón electoral",    value: fmt(MOCK_STATS.electores) },
          { label: "Participación",       value: `${MOCK_STATS.participacion}%` },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "var(--clr-text-3)" }}>
              {label}
            </p>
            <p
              className="font-display text-xl tabular-nums leading-tight"
              style={{ color: "var(--clr-text)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Mini progress */}
      <div className="sm:w-48 flex-shrink-0">
        <div className="flex justify-between mb-1.5">
          <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--clr-text-3)" }}>
            Procesado
          </span>
          <span
            className="font-display text-sm tabular-nums"
            style={{ color: "var(--clr-text)" }}
          >
            {fmt(MOCK_STATS.actas)} / {fmt(totalActas)}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width:      `${MOCK_STATS.avanceConteo}%`,
              background: "linear-gradient(90deg, var(--clr-red), #ff4060)",
              boxShadow:  "0 0 8px rgba(200,16,46,0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────
export default function MesasView() {
  const [search, setSearch] = useState("");
  const total = MOCK_CANDIDATOS.reduce((s, d) => s + d.votos, 0);

  const mesas = MOCK_MESAS.filter(
    (m) =>
      !search ||
      m.mesa.includes(search) ||
      m.local.toLowerCase().includes(search.toLowerCase()) ||
      m.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <SummaryBar />

      {/* Actas status — 3 big cards */}
      <ActasStatusGrid data={MOCK_CANDIDATOS} total={total} />

      {/* Actas por región chart + mesas table */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <ActasPorRegion data={MOCK_ACTAS_REGION} />
        </div>
        <div className="xl:col-span-3">
          <MesasTable mesas={mesas} search={search} onSearchChange={setSearch} />
        </div>
      </div>
    </div>
  );
}
