import { ChartBarIcon, DocumentTextIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ActasPorRegion from "./components/ActasPorRegion";
import AvanceBanner from "./components/AvanceBanner";
import DesglosVotos from "./components/DesglosVotos";
import EstadoActas from "./components/EstadoActas";
import MesasTable from "./components/MesasTable";
import PeruMap from "./components/PeruMap";
import PodioSection from "./components/PodioSection";
import RankingPartidos from "./components/RankingPartidos";
import StatCard from "./components/StatCard";
import {
  MOCK_ACTAS_REGION,
  MOCK_CANDIDATOS,
  MOCK_DESGLOSE_DATA,
  MOCK_GANADOR_REGION,
  MOCK_MESAS,
  MOCK_REGION_MAP_DATA,
  MOCK_REGIONES,
  MOCK_STATS,
  MOCK_VOTOS_NACIONAL,
} from "./data/mock";

const fmt = (n) => Number(n).toLocaleString("es-PE");

export default function Dashboard() {
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [mapView, setMapView] = useState("participacion");

  const mesas = MOCK_MESAS.filter(
    (m) =>
      !search || m.mesa.includes(search) || m.local.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 -z-10 bg-[#040c1e]">
        <div className="orb-1 absolute -top-[20%] -left-[10%]  w-[700px] h-[700px] rounded-full bg-blue-700/30   blur-[130px]" />
        <div className="orb-2 absolute top-[20%]  -right-[12%] w-[600px] h-[600px] rounded-full bg-violet-700/22 blur-[120px]" />
        <div className="orb-3 absolute bottom-[-8%] left-[25%]  w-[500px] h-[500px] rounded-full bg-indigo-700/18 blur-[110px]" />
        <div className="orb-4 absolute top-[58%]  left-[5%]   w-[380px] h-[380px] rounded-full bg-sky-700/15    blur-[100px]" />
      </div>

      {/* ── HEADER ── */}
      <header
        style={{ backdropFilter: "blur(32px)" }}
        className="sticky top-0 z-50 bg-black/25 border-b border-white/[0.08] px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              style={{ backdropFilter: "blur(12px)" }}
              className="w-9 h-9 rounded-xl bg-blue-500/25 border border-blue-400/35 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-blue-300 text-[9px] font-bold tracking-wider">ONPE</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white/90 tracking-tight leading-tight">
                Dashboard Electoral Perú 2026
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/35 text-[11px]">
                  Resultados en tiempo real · Primera vuelta
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-white/35 text-xs hidden sm:block">Región</span>
            <select
              style={{ backdropFilter: "blur(16px)" }}
              className="bg-white/[0.08] border border-white/[0.14] text-white/85 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/45 transition-all"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Todas las regiones</option>
              {MOCK_REGIONES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* ── AVANCE BANNER ── */}
        <AvanceBanner
          actas={MOCK_STATS.actas}
          totalEsperadas={MOCK_STATS.totalEsperadas}
          avanceConteo={MOCK_STATS.avanceConteo}
        />

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DocumentTextIcon}
            label="Actas procesadas"
            value={fmt(MOCK_STATS.actas)}
            sub="Actas contabilizadas"
            color="blue"
          />
          <StatCard
            icon={ChartBarIcon}
            label="Participación"
            value={`${MOCK_STATS.participacion}%`}
            sub="Del padrón electoral"
            color="purple"
          />
          <StatCard
            icon={MapPinIcon}
            label="Mesas computadas"
            value={fmt(MOCK_STATS.mesas)}
            sub="Mesas de votación"
            color="indigo"
          />
          <StatCard
            icon={UsersIcon}
            label="Total electores"
            value={fmt(MOCK_STATS.electores)}
            sub="Padrón habilitado 2026"
            color="cyan"
          />
        </div>

        {/* ── PODIO TOP 3 ── */}
        <PodioSection data={MOCK_VOTOS_NACIONAL} />

        {/* ── RANKING + DESGLOSE ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
            <RankingPartidos data={MOCK_VOTOS_NACIONAL} />
          </div>
          <div className="xl:col-span-2">
            <DesglosVotos data={MOCK_DESGLOSE_DATA} />
          </div>
        </div>

        {/* ── ESTADO ACTAS + ACTAS POR REGIÓN ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <EstadoActas data={MOCK_CANDIDATOS} />
          <ActasPorRegion data={MOCK_ACTAS_REGION} />
        </div>

        {/* ── MAPA + TABLA ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <PeruMap
              regionData={MOCK_REGION_MAP_DATA}
              ganadorData={MOCK_GANADOR_REGION}
              viewMode={mapView}
              onToggleView={() =>
                setMapView((v) => (v === "participacion" ? "ganador" : "participacion"))
              }
            />
          </div>
          <div className="xl:col-span-3">
            <MesasTable mesas={mesas} search={search} onSearchChange={setSearch} />
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center py-6">
        <p className="text-white/15 text-xs">
          Fuente: Oficina Nacional de Procesos Electorales (ONPE) · Datos de muestra
        </p>
      </footer>
    </div>
  );
}
