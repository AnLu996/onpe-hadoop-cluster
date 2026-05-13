import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function PeruElectionsDashboard() {

  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({});
  const [mesas, setMesas] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [region, setRegion] = useState("");

  const COLORS = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

  // ---------------- CARGA REGIONES ----------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/regiones")
      .then(res => res.json())
      .then(setRegiones);
  }, []);

  // ---------------- DATOS ----------------
  useEffect(() => {

    const query = region ? `?region=${region}` : "";

    fetch(`http://127.0.0.1:8000/presidencial${query}`)
      .then(res => res.json())
      .then(setCandidates);

    fetch(`http://127.0.0.1:8000/stats${query}`)
      .then(res => res.json())
      .then(setStats);

    fetch(`http://127.0.0.1:8000/mesas${query}`)
      .then(res => res.json())
      .then(setMesas);

  }, [region]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-blue-900 text-white p-8">

            <h1 className="text-4xl font-bold">
              Dashboard Electoral Perú 2026
            </h1>

            {/* FILTRO */}
            <div className="mt-4">

              <select
                className="p-2 text-black rounded-lg"
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

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">

            <div className="bg-blue-700 text-white p-6 rounded-3xl">
              Actas: {stats.actas || 0}
            </div>

            <div className="bg-white p-6 border rounded-3xl">
              Participación: {stats.participacion || 0}%
            </div>

            <div className="bg-white p-6 border rounded-3xl">
              Mesas: {stats.mesas || 0}
            </div>

            <div className="bg-white p-6 border rounded-3xl">
              Electores: {stats.electores || 0}
            </div>

          </div>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">

            <div className="bg-white p-6 rounded-3xl border">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidates}>
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={candidates}
                    dataKey="votos"
                    nameKey="nombre"
                    outerRadius={100}
                    label
                  >
                    {candidates.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* TABLA */}
          <div className="p-6">

            <table className="w-full">

              <thead>
                <tr>
                  <th>Mesa</th>
                  <th>Local</th>
                  <th>Estado</th>
                  <th>%</th>
                </tr>
              </thead>

              <tbody>

                {mesas.map((m, i) => (
                  <tr key={i}>
                    <td>{m.mesa}</td>
                    <td>{m.local}</td>
                    <td>{m.estado}</td>
                    <td>{m.participacion}%</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}