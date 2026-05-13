from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from collections import Counter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FOLDER = "data"

@app.get("/")
def home():
    return {"mensaje": "API elecciones funcionando"}

@app.get("/presidencial")
def presidencial():

    contador = Counter()
    total = 0

    archivos = os.listdir(DATA_FOLDER)[:200]

    for archivo in archivos:

        ruta = os.path.join(DATA_FOLDER, archivo)

        with open(ruta, "r", encoding="utf-8") as f:

            contenido = json.load(f)

            for item in contenido["data"]:

                estado = item["descripcionEstadoActa"]

                contador[estado] += 1

                total += 1

    resultado = []

    for estado, cantidad in contador.items():

        resultado.append({
            "id": estado,
            "candidate": estado,
            "name": "Estado de Acta",
            "votes": cantidad,
            "percent": round((cantidad / total) * 100, 2)
        })

    return resultado


@app.get("/stats")
def stats():

    total_actas = 0
    contabilizadas = 0
    pendientes = 0
    observadas = 0
    electores = 0

    archivos = os.listdir(DATA_FOLDER)[:200]

    for archivo in archivos:

        ruta = os.path.join(DATA_FOLDER, archivo)

        with open(ruta, "r", encoding="utf-8") as f:

            contenido = json.load(f)

            for item in contenido["data"]:

                total_actas += 1

                electores += item.get("totalElectoresHabiles", 0)

                estado = item["descripcionEstadoActa"]

                if estado == "Contabilizada":
                    contabilizadas += 1

                elif estado == "Pendiente":
                    pendientes += 1

                else:
                    observadas += 1

    return {
        "total_actas": total_actas,
        "contabilizadas": contabilizadas,
        "pendientes": pendientes,
        "observadas": observadas,
        "electores": electores
    }