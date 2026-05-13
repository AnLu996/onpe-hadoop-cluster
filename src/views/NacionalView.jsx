import { ChartBarIcon, DocumentTextIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import AvanceBanner from "../components/AvanceBanner";
import DesglosVotos from "../components/DesglosVotos";
import {
  MOCK_DESGLOSE_DATA,
  MOCK_STATS,
  MOCK_VOTOS_NACIONAL,
  PARTIDO_COLORS,
} from "../data/mock";

const fmt   = (n) => Number(n).toLocaleString("es-PE");
const fmtM  = (n) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : fmt(n);

// ── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl flex-1 min-w-[140px]"
      style={{
        background:  "var(--clr-surface)",
        border:      "1px solid var(--clr-border)",
      }}
    >
      <div
        className="p-1.5 rounded-lg flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-[9px] uppercase tracking-[0.18em] font-semibold truncate"
          style={{ color: "var(--clr-text-3)" }}
        >
          {label}
        </p>
        <p
          className="font-display text-xl leading-none tabular-nums"
          style={{ color: "var(--clr-text)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Head-to-head duel ────────────────────────────────────────────────────────
function DuelBanner({ a, b, colorA, colorB }) {
  const total     = a.porcentaje + b.porcentaje;
  const aFraction = a.porcentaje / 100;
  const bFraction = b.porcentaje / 100;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-border)",
        boxShadow:  "0 4px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* header strip */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{
          background:   "var(--clr-elevated)",
          borderBottom: "1px solid var(--clr-border)",
        }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.22em] font-semibold"
          style={{ color: "var(--clr-text-3)" }}
        >
          Proyección segunda vuelta
        </span>
        <span
          className="text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "var(--clr-text-3)" }}
        >
          Diferencia: {(a.porcentaje - b.porcentaje).toFixed(1)} puntos
        </span>
      </div>

      {/* main content: A — VS — B */}
      <div className="grid grid-cols-[1fr,80px,1fr]">
        {/* Candidate A */}
        <div
          className="p-6 sm:p-8 flex flex-col items-end text-right"
          style={{ background: `${colorA}08`, borderRight: "1px solid var(--clr-border)" }}
        >
          <div
            className="text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded mb-3"
            style={{ background: `${colorA}20`, color: colorA }}
          >
            1° Lugar
          </div>
          <p
            className="font-display text-[3.5rem] sm:text-[5rem] leading-none tabular-nums"
            style={{ color: colorA }}
          >
            {a.porcentaje}%
          </p>
          <p
            className="font-semibold text-sm mt-2 leading-tight"
            style={{ color: "var(--clr-text)" }}
          >
            {a.partido}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "var(--clr-text-2)" }}>
            {fmtM(a.votos)} votos
          </p>
        </div>

        {/* VS separator */}
        <div
          className="flex flex-col items-center justify-center gap-2"
          style={{ background: "var(--clr-elevated)" }}
        >
          <span
            className="font-display text-2xl"
            style={{ color: "var(--clr-text-3)", letterSpacing: "0.08em" }}
          >
            VS
          </span>
          <div className="w-px h-8" style={{ background: "var(--clr-border)" }} />
          <span
            className="font-display text-[11px]"
            style={{ color: "var(--clr-text-3)", letterSpacing: "0.12em" }}
          >
            2026
          </span>
        </div>

        {/* Candidate B */}
        <div
          className="p-6 sm:p-8 flex flex-col items-start"
          style={{ background: `${colorB}08`, borderLeft: "1px solid var(--clr-border)" }}
        >
          <div
            className="text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded mb-3"
            style={{ background: `${colorB}20`, color: colorB }}
          >
            2° Lugar
          </div>
          <p
            className="font-display text-[3.5rem] sm:text-[5rem] leading-none tabular-nums"
            style={{ color: colorB }}
          >
            {b.porcentaje}%
          </p>
          <p
            className="font-semibold text-sm mt-2 leading-tight"
            style={{ color: "var(--clr-text)" }}
          >
            {b.partido}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "var(--clr-text-2)" }}>
            {fmtM(b.votos)} votos
          </p>
        </div>
      </div>

      {/* Dual progress bar: A from left, B from right */}
      <div className="flex h-2">
        <div
          className="transition-all duration-1000"
          style={{ width: `${aFraction * 100}%`, background: colorA }}
        />
        <div
          className="flex-1"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="transition-all duration-1000"
          style={{ width: `${bFraction * 100}%`, background: colorB }}
        />
      </div>

      {/* labels under bar */}
      <div
        className="px-5 py-2 flex justify-between"
        style={{ background: "var(--clr-elevated)", borderTop: "1px solid var(--clr-border)" }}
      >
        <span className="text-[9px] uppercase tracking-widest" style={{ color: colorA }}>
          {a.corto}
        </span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--clr-text-3)" }}>
          Otros partidos: {(100 - total).toFixed(1)}%
        </span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: colorB }}>
          {b.corto}
        </span>
      </div>
    </div>
  );
}

// ── Race track ───────────────────────────────────────────────────────────────
function RaceTrack({ data }) {
  const max = data[0].porcentaje;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-border)",
      }}
    >
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--clr-border)", background: "var(--clr-elevated)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full" style={{ background: "var(--clr-red)" }} />
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--clr-text-3)" }}>
              Nacional
            </p>
            <h2 className="text-sm font-semibold" style={{ color: "var(--clr-text)" }}>
              Resultado por Partido
            </h2>
          </div>
        </div>
        <span className="text-[10px]" style={{ color: "var(--clr-text-3)" }}>
          {data.length} partidos · {fmt(data.reduce((s, d) => s + d.votos, 0))} votos válidos
        </span>
      </div>

      <div className="divide-y" style={{ "--tw-divide-opacity": 1 }}>
        {data.map((party, i) => {
          const color     = PARTIDO_COLORS[i % PARTIDO_COLORS.length];
          const barWidth  = (party.porcentaje / max) * 100;
          const isLeader  = i === 0;

          return (
            <div
              key={party.corto}
              className="px-5 py-4 flex items-center gap-4 transition-colors"
              style={{
                borderColor: "var(--clr-border)",
                background:  isLeader ? `${color}06` : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${color}08`)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isLeader ? `${color}06` : "transparent")
              }
            >
              {/* Rank */}
              <span
                className="font-display text-3xl w-8 text-right flex-shrink-0 tabular-nums leading-none"
                style={{ color: i < 3 ? color : "var(--clr-text-3)" }}
              >
                {i + 1}
              </span>

              {/* Party badge */}
              <div
                className="w-10 text-center px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0"
                style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}
              >
                {party.corto}
              </div>

              {/* Bar + name */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-medium mb-1.5 truncate"
                  style={{ color: "var(--clr-text-2)" }}
                >
                  {party.partido}
                </p>
                <div
                  className="h-2 w-full rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:      `${barWidth}%`,
                      background: color,
                      boxShadow:  isLeader ? `0 0 8px ${color}60` : "none",
                    }}
                  />
                </div>
              </div>

              {/* Percentage + votes */}
              <div className="text-right flex-shrink-0 w-24">
                <p
                  className="font-display text-2xl leading-none tabular-nums"
                  style={{ color: i < 3 ? color : "var(--clr-text)" }}
                >
                  {party.porcentaje}%
                </p>
                <p className="text-[10px] mt-0.5 tabular-nums" style={{ color: "var(--clr-text-3)" }}>
                  {fmtM(party.votos)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────
export default function NacionalView() {
  const [a, b] = MOCK_VOTOS_NACIONAL;
  const colorA = PARTIDO_COLORS[0];
  const colorB = PARTIDO_COLORS[1];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="flex flex-wrap gap-3">
        <StatPill
          icon={DocumentTextIcon}
          label="Actas computadas"
          value={fmt(MOCK_STATS.actas)}
          color="var(--clr-red)"
        />
        <StatPill
          icon={ChartBarIcon}
          label="Participación"
          value={`${MOCK_STATS.participacion}%`}
          color="#f59e0b"
        />
        <StatPill
          icon={MapPinIcon}
          label="Mesas procesadas"
          value={fmt(MOCK_STATS.mesas)}
          color="#3b82f6"
        />
        <StatPill
          icon={UsersIcon}
          label="Padrón electoral"
          value={fmtM(MOCK_STATS.electores)}
          color="#a855f7"
        />
      </div>

      {/* Avance banner */}
      <AvanceBanner
        actas={MOCK_STATS.actas}
        totalEsperadas={MOCK_STATS.totalEsperadas}
        avanceConteo={MOCK_STATS.avanceConteo}
      />

      {/* Duel */}
      <DuelBanner a={a} b={b} colorA={colorA} colorB={colorB} />

      {/* Race + Desglose side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RaceTrack data={MOCK_VOTOS_NACIONAL} />
        </div>
        <div className="xl:col-span-1">
          <DesglosVotos data={MOCK_DESGLOSE_DATA} />
        </div>
      </div>
    </div>
  );
}
