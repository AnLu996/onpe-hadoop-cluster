import PropTypes from "prop-types";

const fmt = (n) => Number(n).toLocaleString("es-PE");

export default function AvanceBanner({ actas, totalEsperadas, avanceConteo }) {
  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className="bg-white/[0.06] border border-white/[0.11] rounded-2xl px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/45 text-[11px] font-medium uppercase tracking-widest">
            Avance de conteo
          </span>
        </div>
        <span className="text-white/80 font-bold text-sm">{avanceConteo}% completado</span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 rounded-full transition-all"
          style={{ width: `${avanceConteo}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-white/30 text-xs">{fmt(actas)} actas contabilizadas</span>
        <span className="text-white/30 text-xs">Total esperado: {fmt(totalEsperadas)}</span>
      </div>
    </div>
  );
}

AvanceBanner.propTypes = {
  actas: PropTypes.number.isRequired,
  totalEsperadas: PropTypes.number.isRequired,
  avanceConteo: PropTypes.number.isRequired,
};
