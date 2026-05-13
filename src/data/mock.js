// Keys for region maps MUST match GeoJSON NOMBDEP property (all-caps, no accents)
// e.g. "LIMA", "ANCASH", "SAN MARTIN" — see public/peru.geojson

export const PARTIDO_COLORS = [
  "#60a5fa",
  "#f97316",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#38bdf8",
  "#fb7185",
];

// ── Partidos políticos ───────────────────────────────────────────────────────
// Simula output de votos_nacional: agrupacion -> total_votos (solo CONTABILIZADA)
export const MOCK_VOTOS_NACIONAL = [
  { partido: "AHORA NACIÓN", corto: "AN", votos: 3_842_110, porcentaje: 28.3 },
  { partido: "FUERZA POPULAR", corto: "FP", votos: 3_026_440, porcentaje: 22.3 },
  { partido: "RENOVACIÓN POPULAR", corto: "RP", votos: 2_538_620, porcentaje: 18.7 },
  { partido: "PARTIDO DEL BUEN GOBIERNO", corto: "PBG", votos: 1_739_420, porcentaje: 12.8 },
  { partido: "PARTIDO CÍVICO OBRAS", corto: "PCO", votos: 990_540, porcentaje: 7.3 },
  { partido: "JUNTOS POR EL PERÚ", corto: "JP", votos: 679_140, porcentaje: 5.0 },
  { partido: "ALIANZA ELECT. VENCEREMOS", corto: "AEV", votos: 475_540, porcentaje: 3.5 },
  { partido: "ALIANZA PARA EL PROGRESO", corto: "APP", votos: 298_820, porcentaje: 2.2 },
];

// ── Estadísticas globales ────────────────────────────────────────────────────
// Simula conteo_lineas + actas_estado + totales de actas_resumen_tsv
export const MOCK_STATS = {
  actas: 160_341,
  totalEsperadas: 226_322,
  avanceConteo: 70.8,
  participacion: 78.4,
  mesas: 160_341,
  electores: 25_748_630,
};

// ── Estado de actas (barras) ─────────────────────────────────────────────────
// Simula output de actas_estado: estado -> count
export const MOCK_CANDIDATOS = [
  { nombre: "Contabilizada", votos: 160_341, porcentaje: 70.8 },
  { nombre: "Observada", votos: 28_410, porcentaje: 12.6 },
  { nombre: "Sin acta", votos: 37_571, porcentaje: 16.6 },
];

// ── Desglose de votos ────────────────────────────────────────────────────────
export const MOCK_DESGLOSE_DATA = [
  { nombre: "Válidos", valor: 13_590_630, porcentaje: 68.4, color: "#34d399" },
  { nombre: "Blancos", valor: 3_856_290, porcentaje: 19.4, color: "#94a3b8" },
  { nombre: "Nulos", valor: 2_432_730, porcentaje: 12.2, color: "#f87171" },
];

// ── Estado de actas por región ────────────────────────────────────────────────
// Simula output de actas_estado: region|estado -> count
export const MOCK_ACTAS_REGION = [
  { region: "Lima", contabilizada: 42_180, observada: 2_820, sinActa: 4_100 },
  { region: "Piura", contabilizada: 9_240, observada: 980, sinActa: 1_420 },
  { region: "La Libertad", contabilizada: 9_860, observada: 1_150, sinActa: 1_330 },
  { region: "Cajamarca", contabilizada: 8_620, observada: 980, sinActa: 1_290 },
  { region: "Arequipa", contabilizada: 9_800, observada: 1_200, sinActa: 1_240 },
  { region: "Cusco", contabilizada: 7_800, observada: 720, sinActa: 1_140 },
  { region: "Puno", contabilizada: 7_500, observada: 890, sinActa: 1_280 },
  { region: "Junín", contabilizada: 6_500, observada: 580, sinActa: 1_260 },
];

// ── Mesas de votación (tabla detalle) ────────────────────────────────────────
// Simula filas del actas_resumen_tsv
export const MOCK_MESAS = [
  {
    mesa: "150101001",
    local: "I.E. San Martín de Porres",
    ubigeo: "150101",
    region: "LIMA",
    estado: "Contabilizada",
    participacion: 82.5,
  },
  {
    mesa: "150101002",
    local: "Colegio Nacional Guadalupe",
    ubigeo: "150101",
    region: "LIMA",
    estado: "Contabilizada",
    participacion: 76.3,
  },
  {
    mesa: "150101003",
    local: "I.E. José María Eguren",
    ubigeo: "150101",
    region: "LIMA",
    estado: "Observada",
    participacion: 91.2,
  },
  {
    mesa: "150101004",
    local: "I.E. Rosa de Santa María",
    ubigeo: "150101",
    region: "LIMA",
    estado: "Contabilizada",
    participacion: 68.9,
  },
  {
    mesa: "150101005",
    local: "Colegio Marianista",
    ubigeo: "150101",
    region: "LIMA",
    estado: "Sin acta",
    participacion: 0,
  },
  {
    mesa: "040101001",
    local: "I.E. La Salle Arequipa",
    ubigeo: "040101",
    region: "AREQUIPA",
    estado: "Contabilizada",
    participacion: 85.1,
  },
  {
    mesa: "040101002",
    local: "C.E. Independencia Americana",
    ubigeo: "040101",
    region: "AREQUIPA",
    estado: "Contabilizada",
    participacion: 72.4,
  },
  {
    mesa: "080101001",
    local: "Colegio Nacional Ciencias Cusco",
    ubigeo: "080101",
    region: "CUSCO",
    estado: "Observada",
    participacion: 88.7,
  },
  {
    mesa: "080101002",
    local: "I.E. Inca Garcilaso de la Vega",
    ubigeo: "080101",
    region: "CUSCO",
    estado: "Contabilizada",
    participacion: 79.6,
  },
  {
    mesa: "130101001",
    local: "I.E. San Juan La Libertad",
    ubigeo: "130101",
    region: "LA LIBERTAD",
    estado: "Contabilizada",
    participacion: 81.3,
  },
  {
    mesa: "200101001",
    local: "I.E. San Miguel de Piura",
    ubigeo: "200101",
    region: "PIURA",
    estado: "Contabilizada",
    participacion: 74.2,
  },
  {
    mesa: "060101001",
    local: "I.E. San Ramón de Cajamarca",
    ubigeo: "060101",
    region: "CAJAMARCA",
    estado: "Sin acta",
    participacion: 0,
  },
  {
    mesa: "210101001",
    local: "I.E. Gran Unidad Escolar Puno",
    ubigeo: "210101",
    region: "PUNO",
    estado: "Contabilizada",
    participacion: 87.9,
  },
  {
    mesa: "140101001",
    local: "I.E. Nacional de Lambayeque",
    ubigeo: "140101",
    region: "LAMBAYEQUE",
    estado: "Contabilizada",
    participacion: 73.5,
  },
  {
    mesa: "120101001",
    local: "I.E. Santa Isabel Junín",
    ubigeo: "120101",
    region: "JUNIN",
    estado: "Observada",
    participacion: 80.1,
  },
];

// ── Regiones para el selector ────────────────────────────────────────────────
export const MOCK_REGIONES = [
  { code: "01", name: "Amazonas", count: 1_820 },
  { code: "02", name: "Áncash", count: 8_910 },
  { code: "03", name: "Apurímac", count: 3_640 },
  { code: "04", name: "Arequipa", count: 11_240 },
  { code: "05", name: "Ayacucho", count: 4_230 },
  { code: "06", name: "Cajamarca", count: 9_870 },
  { code: "07", name: "Callao", count: 6_450 },
  { code: "08", name: "Cusco", count: 8_760 },
  { code: "09", name: "Huancavelica", count: 3_120 },
  { code: "10", name: "Huánuco", count: 5_340 },
  { code: "11", name: "Ica", count: 4_560 },
  { code: "12", name: "Junín", count: 7_340 },
  { code: "13", name: "La Libertad", count: 10_980 },
  { code: "14", name: "Lambayeque", count: 6_780 },
  { code: "15", name: "Lima", count: 49_180 },
  { code: "16", name: "Loreto", count: 4_230 },
  { code: "17", name: "Madre de Dios", count: 1_450 },
  { code: "18", name: "Moquegua", count: 1_980 },
  { code: "19", name: "Pasco", count: 2_340 },
  { code: "20", name: "Piura", count: 10_230 },
  { code: "21", name: "Puno", count: 8_670 },
  { code: "22", name: "San Martín", count: 4_560 },
  { code: "23", name: "Tacna", count: 2_670 },
  { code: "24", name: "Tumbes", count: 1_890 },
  { code: "25", name: "Ucayali", count: 3_120 },
];

// ── Mapa: participación por región ───────────────────────────────────────────
// Keys = NOMBDEP del GeoJSON (uppercase, sin tildes)
// Simula output de votos_region + actas_estado cruzado con actas_resumen_tsv
export const MOCK_REGION_MAP_DATA = {
  AMAZONAS: { participacion: 74.2, mesas: 1_820, estado: "Contabilizada" },
  ANCASH: { participacion: 79.1, mesas: 8_910, estado: "Contabilizada" },
  APURIMAC: { participacion: 82.3, mesas: 3_640, estado: "Contabilizada" },
  AREQUIPA: { participacion: 76.8, mesas: 11_240, estado: "Contabilizada" },
  AYACUCHO: { participacion: 85.4, mesas: 4_230, estado: "Contabilizada" },
  CAJAMARCA: { participacion: 71.2, mesas: 9_870, estado: "Contabilizada" },
  CALLAO: { participacion: 68.9, mesas: 6_450, estado: "Contabilizada" },
  CUSCO: { participacion: 83.7, mesas: 8_760, estado: "Contabilizada" },
  HUANCAVELICA: { participacion: 88.1, mesas: 3_120, estado: "Contabilizada" },
  HUANUCO: { participacion: 75.6, mesas: 5_340, estado: "Contabilizada" },
  ICA: { participacion: 72.4, mesas: 4_560, estado: "Contabilizada" },
  JUNIN: { participacion: 78.9, mesas: 7_340, estado: "Contabilizada" },
  "LA LIBERTAD": { participacion: 77.3, mesas: 10_980, estado: "Contabilizada" },
  LAMBAYEQUE: { participacion: 73.8, mesas: 6_780, estado: "Contabilizada" },
  LIMA: { participacion: 65.4, mesas: 49_180, estado: "Contabilizada" },
  LORETO: { participacion: 61.2, mesas: 4_230, estado: "Observada" },
  "MADRE DE DIOS": { participacion: 69.8, mesas: 1_450, estado: "Contabilizada" },
  MOQUEGUA: { participacion: 81.5, mesas: 1_980, estado: "Contabilizada" },
  PASCO: { participacion: 77.2, mesas: 2_340, estado: "Contabilizada" },
  PIURA: { participacion: 74.9, mesas: 10_230, estado: "Contabilizada" },
  PUNO: { participacion: 86.3, mesas: 8_670, estado: "Contabilizada" },
  "SAN MARTIN": { participacion: 72.1, mesas: 4_560, estado: "Contabilizada" },
  TACNA: { participacion: 78.4, mesas: 2_670, estado: "Contabilizada" },
  TUMBES: { participacion: 70.6, mesas: 1_890, estado: "Contabilizada" },
  UCAYALI: { participacion: 64.7, mesas: 3_120, estado: "Observada" },
};

// ── Mapa: ganador por región ─────────────────────────────────────────────────
// Keys = NOMBDEP del GeoJSON (uppercase, sin tildes)
// Simula cruce de votos_region con el partido de mayor votos por región
export const MOCK_GANADOR_REGION = {
  AMAZONAS: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  ANCASH: { partido: "FUERZA POPULAR", color: "#f97316" },
  APURIMAC: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  AREQUIPA: { partido: "RENOVACIÓN POPULAR", color: "#a78bfa" },
  AYACUCHO: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  CAJAMARCA: { partido: "FUERZA POPULAR", color: "#f97316" },
  CALLAO: { partido: "FUERZA POPULAR", color: "#f97316" },
  CUSCO: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  HUANCAVELICA: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  HUANUCO: { partido: "PARTIDO DEL BUEN GOBIERNO", color: "#34d399" },
  ICA: { partido: "RENOVACIÓN POPULAR", color: "#a78bfa" },
  JUNIN: { partido: "FUERZA POPULAR", color: "#f97316" },
  "LA LIBERTAD": { partido: "FUERZA POPULAR", color: "#f97316" },
  LAMBAYEQUE: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  LIMA: { partido: "FUERZA POPULAR", color: "#f97316" },
  LORETO: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  "MADRE DE DIOS": { partido: "RENOVACIÓN POPULAR", color: "#a78bfa" },
  MOQUEGUA: { partido: "RENOVACIÓN POPULAR", color: "#a78bfa" },
  PASCO: { partido: "PARTIDO DEL BUEN GOBIERNO", color: "#34d399" },
  PIURA: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  PUNO: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  "SAN MARTIN": { partido: "PARTIDO DEL BUEN GOBIERNO", color: "#34d399" },
  TACNA: { partido: "RENOVACIÓN POPULAR", color: "#a78bfa" },
  TUMBES: { partido: "AHORA NACIÓN", color: "#60a5fa" },
  UCAYALI: { partido: "PARTIDO DEL BUEN GOBIERNO", color: "#34d399" },
};
