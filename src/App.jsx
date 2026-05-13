import { useState } from "react";
import { MOCK_VOTOS_NACIONAL } from "./data/mock";
import MesasView from "./views/MesasView";
import NacionalView from "./views/NacionalView";
import RegionesView from "./views/RegionesView";

const TICKER_STR = MOCK_VOTOS_NACIONAL.map(
  (d, i) => `${i + 1}° ${d.corto}  ${d.porcentaje}%`
).join("     ·     ");

const TABS = [
  {
    id:      "nacional",
    label:   "Nacional",
    eyebrow: "Resultados y candidatos",
  },
  {
    id:      "regiones",
    label:   "Regiones",
    eyebrow: "Mapa electoral interactivo",
  },
  {
    id:      "mesas",
    label:   "Mesas",
    eyebrow: "Estado del escrutinio",
  },
];

export default function Dashboard() {
  const [tab, setTab] = useState("nacional");

  return (
    <div className="relative min-h-screen" style={{ color: "var(--clr-text)" }}>

      {/* ── PERU FLAG STRIPE ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex h-[3px]">
        <div className="flex-1" style={{ background: "var(--clr-red)" }} />
        <div className="flex-1" style={{ background: "rgba(240,235,250,0.85)" }} />
        <div className="flex-1" style={{ background: "var(--clr-red)" }} />
      </div>

      {/* ── HEADER ── */}
      <header
        className="sticky top-[3px] z-50"
        style={{
          background:   "rgba(12,11,19,0.97)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        {/* Top row: branding */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-0 flex items-center gap-5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-[3px] h-7 rounded-full"
              style={{ background: "var(--clr-red)" }}
            />
            <div>
              <div
                className="font-display text-xl leading-none"
                style={{ color: "var(--clr-red)", letterSpacing: "0.12em" }}
              >
                ONPE
              </div>
              <div
                className="text-[8px] uppercase tracking-[0.2em]"
                style={{ color: "var(--clr-text-3)" }}
              >
                Ofic. Nac. de Procesos Electorales
              </div>
            </div>
          </div>

          <div className="w-px h-8" style={{ background: "var(--clr-border)" }} />

          <div className="min-w-0">
            <h1 className="text-sm font-semibold leading-tight" style={{ color: "var(--clr-text)" }}>
              Dashboard Electoral · Perú 2026
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="blink w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--clr-red)" }}
              />
              <span
                className="text-[9px] uppercase tracking-[0.16em]"
                style={{ color: "var(--clr-text-2)" }}
              >
                En vivo · Primera vuelta
              </span>
            </div>
          </div>

          {/* Tab nav — right-aligned on desktop, bleeds into the row */}
          <div className="ml-auto hidden sm:flex items-end gap-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="relative px-4 py-2.5 text-sm font-medium transition-all duration-150 rounded-t-lg"
                  style={{
                    color:      active ? "var(--clr-text)" : "var(--clr-text-2)",
                    background: active ? "var(--clr-elevated)" : "transparent",
                    borderTop:  active ? `2px solid var(--clr-red)` : "2px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile tabs */}
        <div
          className="sm:hidden flex border-t mt-3"
          style={{ borderColor: "var(--clr-border)" }}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 text-xs font-medium transition-all duration-150 relative"
                style={{
                  color:        active ? "var(--clr-text)" : "var(--clr-text-2)",
                  background:   active ? "var(--clr-elevated)" : "transparent",
                  borderBottom: active ? `2px solid var(--clr-red)` : "2px solid transparent",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Ticker */}
        <div
          className="overflow-hidden"
          style={{
            borderTop:  "1px solid var(--clr-red-border)",
            background: "rgba(200,16,46,0.05)",
          }}
        >
          <div className="flex items-stretch">
            <div
              className="flex-shrink-0 flex items-center px-3 py-1.5 font-display text-[11px] border-r"
              style={{
                color:        "var(--clr-red)",
                borderColor:  "var(--clr-red-border)",
                letterSpacing: "0.09em",
              }}
            >
              ESCRUTINIO
            </div>
            <div className="overflow-hidden flex-1 py-1.5 px-2">
              <div
                className="ticker-track flex whitespace-nowrap text-[11px] gap-14"
                style={{ color: "var(--clr-text-2)" }}
              >
                <span>{TICKER_STR}</span>
                <span aria-hidden>{TICKER_STR}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <div
        className="max-w-7xl mx-auto px-6 pt-4 pb-0"
        style={{ color: "var(--clr-text-3)" }}
      >
        <p className="text-[10px] uppercase tracking-[0.18em]">
          {TABS.find((t) => t.id === tab)?.eyebrow}
        </p>
      </div>

      {/* ── CONTENT ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        {tab === "nacional"  && <NacionalView />}
        {tab === "regiones"  && <RegionesView />}
        {tab === "mesas"     && <MesasView />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: "var(--clr-border)" }} />
          <p
            className="text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "var(--clr-text-3)" }}
          >
            Fuente: ONPE · Datos de muestra · Elecciones Generales 2026
          </p>
          <div className="h-px w-16" style={{ background: "var(--clr-border)" }} />
        </div>
      </footer>
    </div>
  );
}
