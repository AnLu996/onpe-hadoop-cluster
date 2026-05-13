import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import {
  DocumentTextIcon, UsersIcon, MapPinIcon, ChartBarIcon,
} from "@heroicons/react/24/outline";
import PeruMap from "./components/PeruMap";

// ─── MOCK DATA (cambiar USE_MOCK a false para conectar al backend) ───────────
const USE_MOCK = true;

const MOCK_REGIONES = [
  { code: "01", name: "Amazonas",      count: 182  },
  { code: "02", name: "Áncash",        count: 891  },
  { code: "03", name: "Apurímac",      count: 364  },
  { code: "04", name: "Arequipa",      count: 1124 },
  { code: "05", name: "Ayacucho",      count: 423  },
  { code: "06", name: "Cajamarca",     count: 987  },
  { code: "07", name: "Callao",        count: 645  },
  { code: "08", name: "Cusco",         count: 876  },
  { code: "09", name: "Huancavelica",  count: 312  },
  { code: "10", name: "Huánuco",       count: 534  },
  { code: "11", name: "Ica",           count: 456  },
  { code: "12", name: "Junín",         count: 734  },
  { code: "13", name: "La Libertad",   count: 1098 },
  { code: "14", name: "Lambayeque",    count: 678  },
  { code: "15", name: "Lima",          count: 4521 },
  { code: "16", name: "Loreto",        count: 423  },
  { code: "17", name: "Madre de Dios", count: 145  },
  { code: "18", name: "Moquegua",      count: 198  },
  { code: "19", name: "Pasco",         count: 234  },
  { code: "20", name: "Piura",         count: 1023 },
  { code: "21", name: "Puno",          count: 867  },
  { code: "22", name: "San Martín",    count: 456  },
  { code: "23", name: "Tacna",         count: 267  },
  { code: "24", name: "Tumbes",        count: 189  },
  { code: "25", name: "Ucayali",       count: 312  },
];

const MOCK_STATS = {
  actas: 4521,
  participacion: 78.4,
  mesas: 4521,
  electores: 1234567,
};

const MOCK_CANDIDATOS = [
  { nombre: "Contabilizada", votos: 3200, porcentaje: 70.8 },
  { nombre: "Observada",     votos: 800,  porcentaje: 17.7 },
  { nombre: "Sin acta",      votos: 521,  porcentaje: 11.5 },
];

const MOCK_MESAS = [
  { mesa: "000001", local: "I.E. San Martín de Porres",    estado: "Contabilizada", participacion: 82.5 },
  { mesa: "000002", local: "Colegio Nacional Guadalupe",   estado: "Contabilizada", participacion: 76.3 },
  { mesa: "000003", local: "I.E. José María Eguren",       estado: "Observada",     participacion: 91.2 },
  { mesa: "000004", local: "I.E. Rosa de Santa María",     estado: "Contabilizada", participacion: 68.9 },
  { mesa: "000005", local: "Colegio Marianista",           estado: "Sin acta",      participacion: 0   },
  { mesa: "000006", local: "I.E. Melitón Carvajal",        estado: "Contabilizada", participacion: 85.1 },
  { mesa: "000007", local: "I.E. Javier Prado",            estado: "Contabilizada", participacion: 72.4 },
  { mesa: "000008", local: "C.M. Leoncio Prado",           estado: "Observada",     participacion: 88.7 },
  { mesa: "000009", local: "I.E. Ricardo Palma",           estado: "Contabilizada", participacion: 79.6 },
  { mesa: "000010", local: "I.E. Manuel González Prada",   estado: "Contabilizada", participacion: 81.3 },
];

export const MOCK_REGION_MAP_DATA = {
  "Amazonas":      { participacion: 74.2, mesas: 182,  estado: "Contabilizada" },
  "Áncash":        { participacion: 79.1, mesas: 891,  estado: "Contabilizada" },
  "Apurímac":      { participacion: 82.3, mesas: 364,  estado: "Contabilizada" },
  "Arequipa":      { participacion: 76.8, mesas: 1124, estado: "Contabilizada" },
  "Ayacucho":      { participacion: 85.4, mesas: 423,  estado: "Contabilizada" },
  "Cajamarca":     { participacion: 71.2, mesas: 987,  estado: "Contabilizada" },
  "Callao":        { participacion: 68.9, mesas: 645,  estado: "Contabilizada" },
  "Cusco":         { participacion: 83.7, mesas: 876,  estado: "Contabilizada" },
  "Huancavelica":  { participacion: 88.1, mesas: 312,  estado: "Contabilizada" },
  "Huánuco":       { participacion: 75.6, mesas: 534,  estado: "Contabilizada" },
  "Ica":           { participacion: 72.4, mesas: 456,  estado: "Contabilizada" },
  "Junín":         { participacion: 78.9, mesas: 734,  estado: "Contabilizada" },
  "La Libertad":   { participacion: 77.3, mesas: 1098, estado: "Contabilizada" },
  "Lambayeque":    { participacion: 73.8, mesas: 678,  estado: "Contabilizada" },
  "Lima":          { participacion: 65.4, mesas: 4521, estado: "Contabilizada" },
  "Loreto":        { participacion: 61.2, mesas: 423,  estado: "Observada"     },
  "Madre De Dios": { participacion: 69.8, mesas: 145,  estado: "Contabilizada" },
  "Moquegua":      { participacion: 81.5, mesas: 198,  estado: "Contabilizada" },
  "Pasco":         { participacion: 77.2, mesas: 234,  estado: "Contabilizada" },
  "Piura":         { participacion: 74.9, mesas: 1023, estado: "Contabilizada" },
  "Puno":          { participacion: 86.3, mesas: 867,  estado: "Contabilizada" },
  "San Martin":    { participacion: 72.1, mesas: 456,  estado: "Contabilizada" },
  "Tacna":         { participacion: 78.4, mesas: 267,  estado: "Contabilizada" },
  "Tumbes":        { participacion: 70.6, mesas: 189,  estado: "Contabilizada" },
  "Ucayali":       { participacion: 64.7, mesas: 312,  estado: "Observada"     },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString("es-PE");

const ESTADO_STYLES = {
  "Contabilizada": "bg-emerald-100 text-emerald-800",
  "Observada":     "bg-amber-100  text-amber-800",
  "Sin acta":      "bg-red-100    text-red-800",
};

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b"];

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${accent ? "bg-blue-700 text-white" : "bg-white border border-slate-200"}`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${accent ? "bg-blue-600" : "bg-blue-50"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-blue-100" : "text-blue-600"}`} />
        </div>
        <span className={`text-sm font-medium ${accent ? "text-blue-100" : "text-slate-500"}`}>
          {label}
        </span>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${accent ? "text-white" : "text-slate-800"}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs ${accent ? "text-blue-200" : "text-slate-400"}`}>{sub}</p>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color }} className="font-medium">
          {p.value.toLocaleString("es-PE")} {p.name === "porcentaje" ? "%" : "actas"}
        </p>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [region, setRegion]   = useState("");
  const [search, setSearch]   = useState("");

  const regiones   = MOCK_REGIONES;
  const stats      = MOCK_STATS;
  const candidatos = MOCK_CANDIDATOS;
  const mesasFull  = MOCK_MESAS;
  const regionMap  = MOCK_REGION_MAP_DATA;

  const mesas = mesasFull.filter(
    (m) =>
      !search ||
      m.mesa.includes(search) ||
      m.local.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-r from-blue-950 to-blue-700 text-white px-6 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md tracking-widest">
                ONPE
              </span>
              <span className="text-blue-300 text-xs">EN VIVO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard Electoral Perú 2026
            </h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Resultados presidenciales — primera vuelta
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-blue-300 text-xs font-medium">Filtrar por región</label>
            <select
              className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Todas las regiones</option>
              {regiones.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DocumentTextIcon}
            label="Actas procesadas"
            value={fmt(stats.actas)}
            sub="Actas contabilizadas"
            accent
          />
          <StatCard
            icon={ChartBarIcon}
            label="Participación"
            value={`${stats.participacion}%`}
            sub="Del padrón electoral habilitado"
          />
          <StatCard
            icon={MapPinIcon}
            label="Mesas computadas"
            value={fmt(stats.mesas)}
            sub="Mesas de votación"
          />
          <StatCard
            icon={UsersIcon}
            label="Total electores"
            value={fmt(stats.electores)}
            sub="Padrón habilitado 2026"
          />
        </div>

        {/* ── GRÁFICOS ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-1">Estado de Actas</h2>
            <p className="text-xs text-slate-400 mb-4">Cantidad de actas por estado de contabilización</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={candidatos} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="nombre"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="votos" radius={[8, 8, 0, 0]}>
                  {candidatos.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-1">Distribución Porcentual</h2>
            <p className="text-xs text-slate-400 mb-4">Proporción de actas según su estado</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={candidatos}
                  dataKey="porcentaje"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {candidatos.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, "Porcentaje"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "#475569", fontSize: 13 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ── MAPA + TABLA ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          {/* Map */}
          <div className="xl:col-span-2">
            <PeruMap regionData={regionMap} />
          </div>

          {/* Table */}
          <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-800">Detalle de Mesas</h2>
                <p className="text-xs text-slate-400 mt-0.5">Primeras 100 mesas por región</p>
              </div>
              <input
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                placeholder="Buscar mesa o local…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Mesa</th>
                    <th className="px-5 py-3 text-left font-medium">Local de votación</th>
                    <th className="px-5 py-3 text-left font-medium">Estado</th>
                    <th className="px-5 py-3 text-right font-medium">Participación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mesas.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-slate-500 text-xs">
                        {m.mesa}
                      </td>
                      <td className="px-5 py-3 text-slate-700 max-w-xs truncate">
                        {m.local}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ESTADO_STYLES[m.estado] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {m.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${m.participacion}%` }}
                            />
                          </div>
                          <span className="text-slate-700 font-medium w-10 text-right tabular-nums">
                            {m.participacion}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {mesas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">
                        No se encontraron resultados para "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50">
              Mostrando {mesas.length} de {mesasFull.length} mesas
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        Fuente: Oficina Nacional de Procesos Electorales (ONPE) — Datos de muestra
      </footer>
    </div>
  );
}
