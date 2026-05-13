# Pipeline Hadoop ONPE

## 1. Descarga de datos
**Script:** `1_download_data.sh`

- Descarga `data.zip` (~23 GB) desde Google Drive mediante `gdown`
- Lo descomprime en la carpeta `data/`
- Elimina el ZIP

## 2. Subida a HDFS
**Script:** `2_upload_hdfs.sh`

- Sube archivos `.json` desde `data/` hacia `/onpe/raw/` en lotes de 300
- Crea la estructura de directorios en HDFS

### Directorios HDFS

```
/onpe/
├── raw/                    # Datos crudos (JSONL)
├── clean/
│   ├── actas_limpias_tsv   # Output de limpieza_actas (17 columnas)
│   └── actas_resumen_tsv   # Output de actas_resumen (14 columnas)
└── output/
    ├── conteo_lineas/
    ├── votos_nacional/
    ├── votos_region/
    ├── votos_especiales/
    ├── actas_estado/
    └── indice_invertido/
```

## 3. Formato del JSON raw (entrada)

Cada línea del JSONL tiene esta estructura:

```json
{
  "data": [
    {
      "codigoMesa": "string",
      "idEleccion": 1,
      "idUbigeo": "150101",
      "nombreLocalVotacion": "string",
      "codigoLocalVotacion": "string",
      "totalElectoresHabiles": 100,
      "totalVotosEmitidos": 80,
      "totalVotosValidos": 75,
      "totalAsistentes": 80,
      "estadoActa": "string",
      "estadoComputo": "string",
      "codigoEstadoActa": "string",
      "descripcionEstadoActa": "string",
      "detalle": [
        {
          "adCodigo": "AGR01",
          "adDescripcion": "PARTIDO A",
          "adVotos": 40
        }
      ]
    }
  ]
}
```

## 4. Jobs MapReduce

### Rutas de limpieza

| Limpieza | Script | Output HDFS | Columnas |
|---|---|---|---|
| `limpieza_actas` | `jobs/limpieza_actas/run_limpieza.sh` | `/onpe/clean/actas_limpias_tsv` | 17 (explota `detalle`, 1 fila por agrupación por acta) |
| `actas_resumen` | `jobs/actas_resumen/run_resumen.sh` | `/onpe/clean/actas_resumen_tsv` | 14 (1 fila por acta, deduplicada) |

### Tabla resumen de jobs

| Job | Input | Output | Formato salida | Filtro |
|---|---|---|---|---|
| `conteo_lineas` | `actas_limpias_tsv` | `/onpe/output/conteo_lineas` | `total_filas\t<N>` | - |
| `votos_nacional` | `actas_limpias_tsv` | `/onpe/output/votos_nacional` | `agrupacion\t<total_votos>` | solo CONTABILIZADA |
| `votos_region` | `actas_limpias_tsv` | `/onpe/output/votos_region` | `region\|agrupacion\t<total_votos>` | solo CONTABILIZADA |
| `votos_especiales` | `actas_limpias_tsv` | `/onpe/output/votos_especiales` | mapper placeholder (sin implementar) | - |
| `actas_estado` | `actas_resumen_tsv` | `/onpe/output/actas_estado` | `estado\t<count>` y `region\|estado\t<count>` | - |

### Pipeline visual

```
JSON raw (/onpe/raw)
    ├──> limpieza_actas ──> actas_limpias_tsv (17 cols)
    │                        ├──> conteo_lineas ──> total_filas
    │                        ├──> votos_nacional ──> agrupacion -> total
    │                        ├──> votos_region ────> region|agrupacion -> total
    │                        └──> votos_especiales (TODO)
    │
    └──> actas_resumen ───> actas_resumen_tsv (14 cols)
                             └──> actas_estado ───> estado -> count
                                                     region|estado -> count
```

## 5. Columnas del TSV de 17 campos (`actas_limpias_tsv`)

| # | Campo | Origen |
|---|---|---|
| 0 | `codigoMesa` | acta |
| 1 | `idEleccion` | acta |
| 2 | `idUbigeo` | acta |
| 3 | `region` | derivado de ubigeo (primeros 2 dígitos = departamento) |
| 4 | `nombreLocalVotacion` | acta |
| 5 | `codigoLocalVotacion` | acta |
| 6 | `totalElectoresHabiles` | acta |
| 7 | `totalVotosEmitidos` | acta |
| 8 | `totalVotosValidos` | acta |
| 9 | `totalAsistentes` | acta |
| 10 | `estadoActa` | acta |
| 11 | `estadoComputo` | acta |
| 12 | `codigoEstadoActa` | acta |
| 13 | `descripcionEstadoActa` | acta |
| 14 | `adCodigo` | detalle (código de agrupación política) |
| 15 | `adDescripcion` | detalle (nombre de agrupación política) |
| 16 | `adVotos` | detalle (votos para esa agrupación) |

## 6. Columnas del TSV de 14 campos (`actas_resumen_tsv`)

| # | Campo | Origen |
|---|---|---|
| 0 | `codigoMesa` | acta |
| 1 | `idEleccion` | acta |
| 2 | `idUbigeo` | acta |
| 3 | `region` | derivado de ubigeo |
| 4 | `nombreLocalVotacion` | acta |
| 5 | `codigoLocalVotacion` | acta |
| 6 | `totalElectoresHabiles` | acta |
| 7 | `totalVotosEmitidos` | acta |
| 8 | `totalVotosValidos` | | acta |
| 9 | `totalAsistentes` | acta |
| 10 | `estadoActa` | acta |
| 11 | `estadoComputo` | acta |
| 12 | `codigoEstadoActa` | acta |
| 13 | `descripcionEstadoActa` | acta |

## 7. Mapa de departamentos (códigos ubigeo)

| Código | Departamento |
|---|---|
| 01 | AMAZONAS |
| 02 | ANCASH |
| 03 | APURIMAC |
| 04 | AREQUIPA |
| 05 | AYACUCHO |
| 06 | CAJAMARCA |
| 07 | CALLAO |
| 08 | CUSCO |
| 09 | HUANCAVELICA |
| 10 | HUANUCO |
| 11 | ICA |
| 12 | JUNIN |
| 13 | LA LIBERTAD |
| 14 | LAMBAYEQUE |
| 15 | LIMA |
| 16 | LORETO |
| 17 | MADRE DE DIOS |
| 18 | MOQUEGUA |
| 19 | PASCO |
| 20 | PIURA |
| 21 | PUNO |
| 22 | SAN MARTIN |
| 23 | TACNA |
| 24 | TUMBES |
| 25 | UCAYALI |
