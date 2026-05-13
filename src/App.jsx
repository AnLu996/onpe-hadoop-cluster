import { ChartBarIcon, DocumentTextIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PeruMap from "./components/PeruMap";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_REGIONES = [
  { code: "01", name: "Amazonas", count: 182 },
  { code: "02", name: "Áncash", count: 891 },
  { code: "03", name: "Apurímac", count: 364 },
  { code: "04", name: "Arequipa", count: 1124 },
  { code: "05", name: "Ayacucho", count: 423 },
  { code: "06", name: "Cajamarca", count: 987 },
  { code: "07", name: "Callao", count: 645 },
  { code: "08", name: "Cusco", count: 876 },
  { code: "09", name: "Huancavelica", count: 312 },
  { code: "10", name: "Huánuco", count: 534 },
  { code: "11", name: "Ica", count: 456 },
  { code: "12", name: "Junín", count: 734 },
  { code: "13", name: "La Libertad", count: 1098 },
  { code: "14", name: "Lambayeque", count: 678 },
  { code: "15", name: "Lima", count: 4521 },
  { code: "16", name: "Loreto", count: 423 },
  { code: "17", name: "Madre de Dios", count: 145 },
  { code: "18", name: "Moquegua", count: 198 },
  { code: "19", name: "Pasco", count: 234 },
  { code: "20", name: "Piura", count: 1023 },
  { code: "21", name: "Puno", count: 867 },
  { code: "22", name: "San Martín", count: 456 },
  { code: "23", name: "Tacna", count: 267 },
  { code: "24", name: "Tumbes", count: 189 },
  { code: "25", name: "Ucayali", count: 312 },
];

const MOCK_STATS = { actas: 4521, participacion: 78.4, mesas: 4521, electores: 1234567 };

const MOCK_CANDIDATOS = [
  { nombre: "Contabilizada", votos: 3200, porcentaje: 70.8 },
  { nombre: "Observada", votos: 800, porcentaje: 17.7 },
  { nombre: "Sin acta", votos: 521, porcentaje: 11.5 },
];

const MOCK_MESAS = [
  {
    mesa: "000001",
    local: "I.E. San Martín de Porres",
    estado: "Contabilizada",
    participacion: 82.5,
  },
  {
    mesa: "000002",
    local: "Colegio Nacional Guadalupe",
    estado: "Contabilizada",
    participacion: 76.3,
  },
  { mesa: "000003", local: "I.E. José María Eguren", estado: "Observada", participacion: 91.2 },
  {
    mesa: "000004",
    local: "I.E. Rosa de Santa María",
    estado: "Contabilizada",
    participacion: 68.9,
  },
  { mesa: "000005", local: "Colegio Marianista", estado: "Sin acta", participacion: 0 },
  { mesa: "000006", local: "I.E. Melitón Carvajal", estado: "Contabilizada", participacion: 85.1 },
  { mesa: "000007", local: "I.E. Javier Prado", estado: "Contabilizada", participacion: 72.4 },
  { mesa: "000008", local: "C.M. Leoncio Prado", estado: "Observada", participacion: 88.7 },
  { mesa: "000009", local: "I.E. Ricardo Palma", estado: "Contabilizada", participacion: 79.6 },
  {
    mesa: "000010",
    local: "I.E. Manuel González Prada",
    estado: "Contabilizada",
    participacion: 81.3,
  },
];

export const MOCK_REGION_MAP_DATA = {
  Amazonas: { participacion: 74.2, mesas: 182, estado: "Contabilizada" },
  Áncash: { participacion: 79.1, mesas: 891, estado: "Contabilizada" },
  Apurímac: { participacion: 82.3, mesas: 364, estado: "Contabilizada" },
  Arequipa: { participacion: 76.8, mesas: 1124, estado: "Contabilizada" },
  Ayacucho: { participacion: 85.4, mesas: 423, estado: "Contabilizada" },
  Cajamarca: { participacion: 71.2, mesas: 987, estado: "Contabilizada" },
  Callao: { participacion: 68.9, mesas: 645, estado: "Contabilizada" },
  Cusco: { participacion: 83.7, mesas: 876, estado: "Contabilizada" },
  Huancavelica: { participacion: 88.1, mesas: 312, estado: "Contabilizada" },
  Huánuco: { participacion: 75.6, mesas: 534, estado: "Contabilizada" },
  Ica: { participacion: 72.4, mesas: 456, estado: "Contabilizada" },
  Junín: { participacion: 78.9, mesas: 734, estado: "Contabilizada" },
  "La Libertad": { participacion: 77.3, mesas: 1098, estado: "Contabilizada" },
  Lambayeque: { participacion: 73.8, mesas: 678, estado: "Contabilizada" },
  Lima: { participacion: 65.4, mesas: 4521, estado: "Contabilizada" },
  Loreto: { participacion: 61.2, mesas: 423, estado: "Observada" },
  "Madre De Dios": { participacion: 69.8, mesas: 145, estado: "Contabilizada" },
  Moquegua: { participacion: 81.5, mesas: 198, estado: "Contabilizada" },
  Pasco: { participacion: 77.2, mesas: 234, estado: "Contabilizada" },
  Piura: { participacion: 74.9, mesas: 1023, estado: "Contabilizada" },
  Puno: { participacion: 86.3, mesas: 867, estado: "Contabilizada" },
  "San Martin": { participacion: 72.1, mesas: 456, estado: "Contabilizada" },
  Tacna: { participacion: 78.4, mesas: 267, estado: "Contabilizada" },
  Tumbes: { participacion: 70.6, mesas: 189, estado: "Contabilizada" },
  Ucayali: { participacion: 64.7, mesas: 312, estado: "Observada" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString("es-PE");

const ESTADO_BADGE = {
  Contabilizada: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Observada: "bg-amber-500/20  text-amber-300  border border-amber-500/30",
  "Sin acta": "bg-red-500/20    text-red-300    border border-red-500/30",
};

const CHART_COLORS = ["#60a5fa", "#c084fc", "#fb923c"];

// ─── GLASS STYLES ─────────────────────────────────────────────────────────────
const GLASS = {
  panel: "bg-white/[0.06] border border-white/[0.11] rounded-2xl",
  header: "bg-black/30 border-b border-white/[0.08]",
};

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function GlassTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{ backdropFilter: "blur(20px)" }}
      className="bg-black/70 border border-white/20 rounded-xl px-4 py-3 shadow-2xl text-sm"
    >
      <p className="text-white/50 text-xs mb-1.5">{label || payload[0]?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.fill || p.color }}>
          {p.value?.toLocaleString("es-PE")}
          {p.name === "porcentaje" ? "%" : " actas"}
        </p>
      ))}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const ACCENTS = {
  blue: { icon: "bg-blue-500/20   text-blue-300", line: "via-blue-400/60", glow: "bg-blue-600/25" },
  purple: {
    icon: "bg-purple-500/20 text-purple-300",
    line: "via-purple-400/60",
    glow: "bg-purple-600/25",
  },
  indigo: {
    icon: "bg-indigo-500/20 text-indigo-300",
    line: "via-indigo-400/60",
    glow: "bg-indigo-600/25",
  },
  cyan: { icon: "bg-cyan-500/20   text-cyan-300", line: "via-cyan-400/60", glow: "bg-cyan-600/25" },
};

function StatCard({ icon: Icon, label, value, sub, color = "blue" }) {
  const c = ACCENTS[color];
  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className={`relative ${GLASS.panel} p-5 overflow-hidden group hover:bg-white/[0.09] transition-all duration-300 cursor-default`}
    >
      {/* top accent shimmer */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${c.line} to-transparent`}
      />
      {/* corner glow */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 ${c.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${c.icon} flex-shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-white/45 text-[11px] font-medium tracking-widest uppercase">
            {label}
          </span>
        </div>
        <p className="text-[2rem] font-bold text-white leading-none tracking-tight">{value}</p>
        {sub && <p className="text-white/30 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

// ─── GLASS PANEL WRAPPER ─────────────────────────────────────────────────────
function Panel({ children, className = "" }) {
  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className={`${GLASS.panel} overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");

  const mesasFull = MOCK_MESAS;
  const mesas = mesasFull.filter(
    (m) =>
      !search || m.mesa.includes(search) || m.local.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── DEEP BACKGROUND + ORBS ── */}
      <div className="fixed inset-0 -z-10 bg-[#040c1e]">
        <div className="orb-1 absolute -top-[20%] -left-[10%]  w-[700px] h-[700px] rounded-full bg-blue-700/30   blur-[130px]" />
        <div className="orb-2 absolute top-[20%]  -right-[12%] w-[600px] h-[600px] rounded-full bg-violet-700/22 blur-[120px]" />
        <div className="orb-3 absolute bottom-[-8%] left-[25%] w-[500px] h-[500px] rounded-full bg-indigo-700/18 blur-[110px]" />
        <div className="orb-4 absolute top-[58%]  left-[5%]   w-[380px] h-[380px] rounded-full bg-sky-700/15    blur-[100px]" />
      </div>

      {/* ── HEADER ── */}
      <header
        style={{ backdropFilter: "blur(32px)" }}
        className={`sticky top-0 z-50 ${GLASS.header} px-6 py-4`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* ONPE badge */}
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

        {/* ── CHARTS ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Bar chart */}
          <Panel className="p-5">
            <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">
              Estadísticas
            </p>
            <h2 className="text-base font-semibold text-white/85 mb-4">Estado de Actas</h2>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart data={MOCK_CANDIDATOS} barCategoryGap="40%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="nombre"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="votos" radius={[8, 8, 0, 0]}>
                  {MOCK_CANDIDATOS.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Donut chart */}
          <Panel className="p-5">
            <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">
              Distribución
            </p>
            <h2 className="text-base font-semibold text-white/85 mb-4">Porcentaje por Estado</h2>
            <ResponsiveContainer width="100%" height={255}>
              <PieChart>
                <Pie
                  data={MOCK_CANDIDATOS}
                  dataKey="porcentaje"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={58}
                  paddingAngle={3}
                >
                  {MOCK_CANDIDATOS.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, "Porcentaje"]}
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
          </Panel>
        </div>

        {/* ── MAP + TABLE ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Map */}
          <div className="xl:col-span-2">
            <PeruMap regionData={MOCK_REGION_MAP_DATA} />
          </div>

          {/* Table */}
          <Panel className="xl:col-span-3 flex flex-col">
            {/* Table header */}
            <div
              style={{ backdropFilter: "blur(16px)" }}
              className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-4 bg-white/[0.02]"
            >
              <div>
                <p className="text-[11px] text-white/35 uppercase tracking-widest mb-0.5">
                  Detalle
                </p>
                <h2 className="text-sm font-semibold text-white/80">Mesas de Votación</h2>
              </div>
              <input
                style={{ backdropFilter: "blur(12px)" }}
                className="bg-white/[0.07] border border-white/[0.12] text-white/80 placeholder-white/20 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/30 transition-all w-44"
                placeholder="Buscar…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      { label: "Mesa", align: "text-left" },
                      { label: "Local de votación", align: "text-left" },
                      { label: "Estado", align: "text-left" },
                      { label: "Participación", align: "text-right" },
                    ].map(({ label, align }) => (
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
              <p className="text-white/25 text-xs">
                Mostrando {mesas.length} de {mesasFull.length} mesas
              </p>
            </div>
          </Panel>
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
