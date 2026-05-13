import PropTypes from "prop-types";

const fmt = (n) => Number(n).toLocaleString("es-PE");

export default function AvanceBanner({ actas, totalEsperadas, avanceConteo }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--clr-surface)",
        border:     "1px solid var(--clr-red-border)",
        boxShadow:  "0 0 48px rgba(200,16,46,0.07), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Full-width red top bar */}
      <div className="h-[2px]" style={{ background: "var(--clr-red)" }} />

      <div className="px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded border flex-shrink-0"
              style={{
                background:   "var(--clr-red-dim)",
                borderColor:  "var(--clr-red-border)",
              }}
            >
              <span
                className="blink w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--clr-red)" }}
              />
              <span
                className="font-display text-[13px] tracking-wider"
                style={{ color: "var(--clr-red)" }}
              >
                EN VIVO
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--clr-text)" }}>
                Escrutinio Oficial · Elecciones Generales Perú 2026
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--clr-text-2)" }}>
                {fmt(actas)} actas contabilizadas de {fmt(totalEsperadas)} esperadas
              </p>
            </div>
          </div>

          {/* Right side: big % */}
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span
              className="font-display text-[3.2rem] leading-none tabular-nums"
              style={{ color: "var(--clr-text)" }}
            >
              {avanceConteo}
            </span>
            <span className="font-display text-2xl" style={{ color: "var(--clr-text-2)" }}>%</span>
            <span className="text-[11px] ml-1.5" style={{ color: "var(--clr-text-3)" }}>
              procesado
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 w-full h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width:      `${avanceConteo}%`,
              background: "linear-gradient(90deg, var(--clr-red) 0%, #ff3256 100%)",
              boxShadow:  "0 0 10px rgba(200,16,46,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

AvanceBanner.propTypes = {
  actas:          PropTypes.number.isRequired,
  totalEsperadas: PropTypes.number.isRequired,
  avanceConteo:   PropTypes.number.isRequired,
};
