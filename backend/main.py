from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from collections import Counter, defaultdict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FOLDER = "data"
mesas = []

# ---------------- CARGA DE DATOS ----------------
for archivo in os.listdir(DATA_FOLDER):
    if archivo.endswith(".json"):
        ruta = os.path.join(DATA_FOLDER, archivo)
        with open(ruta, "r", encoding="utf-8") as f:
            contenido = json.load(f)
            if "data" in contenido:
                mesas.extend(contenido["data"])


# ---------------- UBIGEO REGIONES REALES ----------------
NOMBRES_REGIONES = {
    "01": "Amazonas",
    "02": "Áncash",
    "03": "Apurímac",
    "04": "Arequipa",
    "05": "Ayacucho",
    "06": "Cajamarca",
    "07": "Callao",
    "08": "Cusco",
    "09": "Huancavelica",
    "10": "Huánuco",
    "11": "Ica",
    "12": "Junín",
    "13": "La Libertad",
    "14": "Lambayeque",
    "15": "Lima",
    "16": "Loreto",
    "17": "Madre de Dios",
    "18": "Moquegua",
    "19": "Pasco",
    "20": "Piura",
    "21": "Puno",
    "22": "San Martín",
    "23": "Tacna",
    "24": "Tumbes",
    "25": "Ucayali"
}


#  FILTRO 
def filtrar(data, region):

    if not region:
        return data

    return [
        m for m in data
        if str(m.get("idUbigeo", "")).zfill(6)[:2] == region
    ]


#  HOME 
@app.get("/")
def home():
    return {
        "mensaje": "API funcionando correctamente",
        "mesas_cargadas": len(mesas)
    }


#  REGIONES 
@app.get("/regiones")
def regiones():

    grupos = defaultdict(int)

    for m in mesas:
        ubigeo = str(m.get("idUbigeo", "")).zfill(6)
        region = ubigeo[:2]
        grupos[region] += 1

    return [
        {
            "code": k,
            "name": NOMBRES_REGIONES.get(k, f"Región {k}"),
            "count": v
        }
        for k, v in sorted(grupos.items())
    ]


#  STATS 
@app.get("/stats")
def stats(region: str = None):

    data = filtrar(mesas, region)

    total_electores = sum(m.get("totalElectoresHabiles", 0) for m in data)
    total_votaron = sum(m.get("totalCiudadanosVotaron", 0) for m in data)

    participacion = round(
        (total_votaron / total_electores) * 100,
        2
    ) if total_electores else 0

    return {
        "actas": len(data),
        "participacion": participacion,
        "mesas": len(data),
        "electores": total_electores
    }


#  ESTADO ACTAS 
@app.get("/presidencial")
def presidencial(region: str = None):

    data = filtrar(mesas, region)

    estados = Counter()

    for m in data:
        estados[m.get("descripcionEstadoActa", "Sin estado")] += 1

    total = sum(estados.values())

    return [
        {
            "nombre": k,
            "votos": v,
            "porcentaje": round((v / total) * 100, 2) if total else 0
        }
        for k, v in estados.items()
    ]


#  MESAS 
@app.get("/mesas")
def obtener_mesas(region: str = None):

    data = filtrar(mesas, region)

    resultado = []

    for m in data[:100]:

        electores = m.get("totalElectoresHabiles", 0)
        votaron = m.get("totalCiudadanosVotaron", 0)

        participacion = round((votaron / electores) * 100, 2) if electores else 0

        resultado.append({
            "mesa": m.get("codigoMesa"),
            "local": m.get("nombreLocalVotacion"),
            "estado": m.get("descripcionEstadoActa"),
            "participacion": participacion
        })

    return resultado