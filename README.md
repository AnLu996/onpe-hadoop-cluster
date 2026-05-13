# Big Data ONPE con Hadoop, HDFS y MapReduce en AWS

Este proyecto implementa una arquitectura Big Data para procesar datos electorales de la ONPE usando un clúster Hadoop de 4 nodos en AWS EC2.

El objetivo es automatizar el levantamiento del clúster, cargar datos de actas electorales en HDFS, realizar una limpieza distribuida de los datos y ejecutar consultas mediante trabajos MapReduce con **Hadoop Streaming + Python**.

---

## 1. Estructura del Proyecto

```text
onpe-hadoop-cluster/
│
├── deploy_cluster.sh              # Crea clúster en AWS
├── destroy_cluster.sh             # Destruye clúster
├── setup_hadoop_cluster.sh        # Configura Hadoop
│
├── data/
│   └── actas_onpe_raw.jsonl       # Datos raw descargados
│
├── jobs/
│   ├── limpieza_actas/
│   │   ├── mapper_limpieza.py
│   │   ├── reducer_limpieza.py
│   │   └── run_limpieza.sh
│   │
│   ├── actas_resumen/
│   │   ├── mapper_resumen.py
│   │   ├── reducer_resumen.py
│   │   └── run_resumen.sh
│   │
│   ├── conteo_lineas/
│   │   ├── mapper_conteo.py
│   │   ├── reducer_suma.py
│   │   └── run_conteo.sh
│   │
│   ├── votos_nacional/
│   │   ├── mapper_votos_nacional.py
│   │   ├── reducer_suma.py
│   │   └── run_votos_nacional.sh
│   │
│   ├── votos_region/
│   │   ├── mapper_votos_region.py
│   │   ├── reducer_suma.py
│   │   └── run_votos_region.sh
│   │
│   ├── votos_especiales/
│   │   ├── mapper_votos_especiales.py
│   │   ├── reducer_suma.py
│   │   └── run_votos_especiales.sh
│   │
│   ├── actas_estado/
│   │   ├── mapper_actas_estado.py
│   │   ├── reducer_suma.py
│   │   └── run_actas_estado.sh
│   │
│   └── indice_invertido/
│       ├── mapper_indice.py
│       ├── reducer_indice.py
│       └── run_indice.sh
│
├── results/
│   ├── votos_nacional.txt
│   ├── votos_region.txt
│   ├── votos_especiales.txt
│   ├── actas_estado.txt
│   └── indice_invertido.txt
│
└── README.md
```

---

## 2. Objetivo del Proyecto

Procesar **23GB de actas electorales** de la ONPE usando Hadoop y MapReduce, distribuido entre 4 nodos AWS.

El pipeline es:

```
Datos ONPE (23GB JSON)
        ↓
Carga a HDFS (/onpe/raw/)
        ↓
Limpieza distribuida (Estudiante 2)
        ↓
Transformación JSONL → TSV
        ↓
Almacenamiento (/onpe/clean/)
        ↓
MapReduce Jobs (Estudiante 3)
        ↓
Resultados agregados (/onpe/output/)
        ↓
Dashboard y búsqueda
```

---

## 3. Arquitectura del Clúster

```
MASTER NODE (1 máquina)
├─ NameNode (coordina HDFS)
├─ ResourceManager (asigna trabajos)
├─ SecondaryNameNode
└─ JobHistoryServer

WORKER NODES (3 máquinas)
├─ DataNode (almacena datos)
├─ NodeManager (ejecuta tasks)
└─ Procesos Mapper/Reducer en paralelo

Almacenamiento distribuido:
├─ /onpe/raw/           ← Actas raw (23GB)
├─ /onpe/clean/         ← Actas limpias
└─ /onpe/output/        ← Resultados jobs
```

**⚠️ IMPORTANTE:** El Master NO almacena actas. Solo coordina. Las actas se distribuyen en los 3 Workers.

---

## 4. Guía de Despliegue

### Paso 0: Clonar el repositorio

Desde **AWS CloudShell** o terminal con `aws-cli`:

```bash
git clone https://github.com/AnLu996/onpe-hadoop-cluster.git
cd onpe-hadoop-cluster
```

### Paso 1: Desplegar clúster en AWS

```bash
bash deploy_cluster.sh
```

Esto crea:
- 1 Master t3.medium (60GB)
- 3 Workers t3.medium (40GB cada uno)
- Security Group
- Key Pair
- Archivo `cluster_ips.txt`

### Paso 2: Configurar Hadoop

```bash
bash setup_hadoop_cluster.sh
```

Instala y configura:
- Java 11
- Hadoop 3.3.6
- HDFS
- YARN
- MapReduce

### Paso 3: Validar clúster

Conéctate al Master:

```bash
ssh -i hadoop-onpe-key.pem ubuntu@<IP_PUBLICA_MASTER>
```

Verifica procesos en Master:

```bash
jps
```

Debe mostrar:
```
NameNode
SecondaryNameNode
ResourceManager
JobHistoryServer
Jps
```

Verifica Workers:

```bash
for worker in worker1 worker2 worker3; do
  echo "===== $worker ====="
  ssh $worker jps
done
```

Cada worker debe mostrar:
```
DataNode
NodeManager
Jps
```

---

## 5. Carga de Datos a HDFS

Desde el **nodo Master**, crea estructura HDFS:

```bash
hdfs dfs -mkdir -p /onpe/raw
hdfs dfs -mkdir -p /onpe/clean
hdfs dfs -mkdir -p /onpe/output
```

Sube datos en formato JSONL:

```bash
hdfs dfs -put -f data/actas_onpe_raw.jsonl /onpe/raw/
```

Valida carga:

```bash
hdfs dfs -ls -h /onpe/raw/
hdfs dfs -cat /onpe/raw/actas_onpe_raw.jsonl | head -3
```

**Formato esperado** (JSONL - una línea por acta):
```json
{"codigoMesa":"000010","success":true,"data":[{"adCodigo":"00000001","adDescripcion":"FUERZA POPULAR","adVotos":38},...]}
{"codigoMesa":"000011","success":true,"data":[...]}
```

---

## 6. ETAPA 1: Limpieza Distribuida (Estudiante 2)

El Estudiante 2 es responsable de la limpieza y transformación de datos.

### Objetivo

Convertir JSONL raw en **TSV limpio** con campos separados por tabs:

```
codigoMesa  idEleccion  region  nombreLocal  partidoAgrupacion  votos
000010      10          AREQUIPA  IE 1828     FUERZA POPULAR     38
000010      10          AREQUIPA  IE 1828     ACCION POPULAR     2
```

### 6.1 Limpieza de actas con votos

Convierte JSON con detalles de votos en TSV:

```bash
cd jobs/limpieza_actas
chmod +x *.py *.sh
bash run_limpieza.sh
```

**Entrada:**
```
/onpe/raw/actas_onpe_raw.jsonl
```

**Salida:**
```
/onpe/clean/actas_limpias_tsv/part-00000
```

**Campos extraídos:**
- codigoMesa
- idEleccion
- region
- nombreLocalVotacion
- codigoLocalVotacion
- totalElectoresHabiles
- totalVotosEmitidos
- totalVotosValidos
- partidoAgrupacion (de detalles)
- votos (por agrupación)

Validar resultado:

```bash
hdfs dfs -cat /onpe/clean/actas_limpias_tsv/part-00000 | head -20
```

### 6.2 Resumen por acta (sin duplicados)

Genera un registro por acta (útil para contar actas sin duplicar):

```bash
cd ../actas_resumen
chmod +x *.py *.sh
bash run_resumen.sh
```

**Entrada:**
```
/onpe/raw/actas_onpe_raw.jsonl
```

**Salida:**
```
/onpe/clean/actas_resumen_tsv/part-00000
```

**Campos:**
- codigoMesa
- region
- nombreLocalVotacion
- estadoActa
- totalElectoresHabiles
- totalVotosEmitidos
- totalVotosValidos

Validar:

```bash
hdfs dfs -cat /onpe/clean/actas_resumen_tsv/part-00000 | head -20
```

**¿Por qué es importante?** Porque si usamos `actas_limpias_tsv` tenemos múltiples filas por acta (una por partido), causando duplicados en conteos de actas.

---

## 7. ETAPA 2: MapReduce Jobs (Estudiante 3)

El Estudiante 3 es responsable de los jobs de análisis electoral.

**Tecnología:** Hadoop Streaming + Python (sin necesidad de compilar `.jar`)

### ¿Cómo funciona Hadoop Streaming?

```
Entrada (HDFS)
    ↓
Mapper (mapper_*.py)
  - Lee línea por línea
  - Emite: clave<TAB>valor
    ↓
Shuffle (coordinado por Hadoop)
  - Agrupa por clave
    ↓
Reducer (reducer_*.py)
  - Recibe: clave [valor1, valor2, ...]
  - Emite resultado final
    ↓
Salida (HDFS)
```

### 7.1 Prueba: Conteo de líneas limpias

Valida que Hadoop puede leer archivos limpios:

```bash
cd jobs/conteo_lineas
chmod +x *.py *.sh
bash run_conteo.sh
```

**Entrada:**
```
/onpe/clean/actas_limpias_tsv
```

**Salida:**
```
/onpe/output/conteo_lineas/part-00000
```

**Resultado esperado:**
```
TOTAL  23450000
```

Ver resultado:

```bash
hdfs dfs -cat /onpe/output/conteo_lineas/part-00000
```

---

### 7.2 Votos nacionales por agrupación política

Suma total de votos por partido a **nivel nacional**:

```bash
cd ../votos_nacional
chmod +x *.py *.sh
bash run_votos_nacional.sh
```

**Entrada:**
```
/onpe/clean/actas_limpias_tsv
```

**Salida:**
```
/onpe/output/votos_nacional/part-00000
```

**Resultado esperado:**
```
FUERZA_POPULAR     4500000
PERU_LIBRE         3200000
UNION_POR_PERU     2100000
ACCION_POPULAR     1800000
```

Ver resultado ordenado:

```bash
hdfs dfs -cat /onpe/output/votos_nacional/part-00000 | sort -k2 -nr | head -20
```

---

### 7.3 Votos por región

Suma de votos por **región + partido**:

```bash
cd ../votos_region
chmod +x *.py *.sh
bash run_votos_region.sh
```

**Entrada:**
```
/onpe/clean/actas_limpias_tsv
```

**Salida:**
```
/onpe/output/votos_region/part-00000
```

**Resultado esperado:**
```
AREQUIPA|FUERZA_POPULAR     450000
AREQUIPA|PERU_LIBRE         320000
LIMA|FUERZA_POPULAR         1500000
LIMA|PERU_LIBRE             980000
```

Ver resultado:

```bash
hdfs dfs -cat /onpe/output/votos_region/part-00000 | head -50
```

---

### 7.4 Votos especiales (blancos, nulos, etc.)

Suma de votos blancos, nulos, impugnados y viciados:

```bash
cd ../votos_especiales
chmod +x *.py *.sh
bash run_votos_especiales.sh
```

**Entrada:**
```
/onpe/clean/actas_limpias_tsv (filtrando partidoAgrupacion en lista especial)
```

**Salida:**
```
/onpe/output/votos_especiales/part-00000
```

**Resultado esperado:**
```
VOTOS_BLANCOS      350000
VOTOS_NULOS        450000
VOTOS_IMPUGNADOS   25000
VOTOS_VICIADOS     15000
```

Ver resultado:

```bash
hdfs dfs -cat /onpe/output/votos_especiales/part-00000
```

---

### 7.5 Actas por estado

Cuenta de actas por **estado de acta** (contabilizada, observada, etc.):

```bash
cd ../actas_estado
chmod +x *.py *.sh
bash run_actas_estado.sh
```

**⚠️ IMPORTANTE:** Usa `/onpe/clean/actas_resumen_tsv` (no `actas_limpias_tsv`) para evitar duplicados.

**Entrada:**
```
/onpe/clean/actas_resumen_tsv
```

**Salida:**
```
/onpe/output/actas_estado/part-00000
```

**Resultado esperado:**
```
CONTABILIZADA      85000
DIGITACION         1200
OBSERVADA          300
RETIRADA           50
```

Ver resultado:

```bash
hdfs dfs -cat /onpe/output/actas_estado/part-00000
```

---

## 8. Motor de Búsqueda: Índice Invertido

Crea un mapeo **término → documentos** para búsquedas rápidas.

```bash
cd ../indice_invertido
chmod +x *.py *.sh
bash run_indice.sh
```

**Entrada:**
```
/onpe/clean/actas_limpias_tsv
```

**Salida:**
```
/onpe/output/indice_invertido/part-00000
```

**Estructura:**
```
TERMINO             codigoMesa1,codigoMesa2,codigoMesa3,...
AREQUIPA            000010,000011,000015,000018,...
FUERZA_POPULAR      000010,000011,000018,000050,...
CONTABILIZADA       000010,000011,000012,...
```

Ver resultado:

```bash
hdfs dfs -cat /onpe/output/indice_invertido/part-00000 | head -30
```

**¿Cómo se usa?** Para búsquedas como:
- "¿Qué actas son de AREQUIPA?" → busco "AREQUIPA" en el índice
- "¿Qué actas votaron FUERZA_POPULAR?" → busco "FUERZA_POPULAR"
- "¿Actas contabilizadas de AREQUIPA?" → busco ambas

---

## 9. Descarga de Resultados

Desde el Master, descarga resultados a carpeta local:

```bash
mkdir -p results

hdfs dfs -get -f /onpe/output/votos_nacional/part-00000 results/votos_nacional.txt
hdfs dfs -get -f /onpe/output/votos_region/part-00000 results/votos_region.txt
hdfs dfs -get -f /onpe/output/votos_especiales/part-00000 results/votos_especiales.txt
hdfs dfs -get -f /onpe/output/actas_estado/part-00000 results/actas_estado.txt
hdfs dfs -get -f /onpe/output/indice_invertido/part-00000 results/indice_invertido.txt
```

Verifica descarga:

```bash
ls -lh results/
cat results/votos_nacional.txt | head
```

---

## 10. Dashboard (Opcional)

Los resultados pueden visualizarse con:

```bash
pip install streamlit pandas
streamlit run dashboard/app.py
```

O con HTML + Chart.js para una página estática.

---

## 11. Comandos Útiles de HDFS

Listar contenido:

```bash
hdfs dfs -ls /onpe
hdfs dfs -ls /onpe/raw
hdfs dfs -ls /onpe/clean
hdfs dfs -ls /onpe/output
```

Ver primeras líneas:

```bash
hdfs dfs -cat /onpe/raw/actas_onpe_raw.jsonl | head -5
hdfs dfs -cat /onpe/clean/actas_limpias_tsv/part-00000 | head -10
hdfs dfs -cat /onpe/output/votos_nacional/part-00000
```

Contar líneas:

```bash
hdfs dfs -cat /onpe/clean/actas_limpias_tsv/part-00000 | wc -l
```

Eliminar salida anterior:

```bash
hdfs dfs -rm -r -f /onpe/output/votos_nacional
```

Ver tamaño:

```bash
hdfs dfs -du -h /onpe
hdfs dfs -du -h /onpe/raw
hdfs dfs -du -h /onpe/clean
```

---

## 12. Interfaces Web de Hadoop

Accede desde tu navegador usando la IP pública del Master:

### HDFS NameNode UI
```
http://<IP_PUBLICA_MASTER>:9870
```
Ver: archivos, espacios, replicación, nodos

### YARN ResourceManager UI
```
http://<IP_PUBLICA_MASTER>:8088
```
Ver: aplicaciones, jobs, workers, uso de recursos

### JobHistoryServer
```
http://<IP_PUBLICA_MASTER>:19888
```
Ver: historial de jobs, logs de ejecución

---

## 13. Ejecución Completa (Paso a Paso)

Desde AWS CloudShell:

```bash
# 1. Clonar y desplegar
git clone https://github.com/AnLu996/onpe-hadoop-cluster.git
cd onpe-hadoop-cluster
bash deploy_cluster.sh
bash setup_hadoop_cluster.sh
```

Conectarse al Master:

```bash
ssh -i hadoop-onpe-key.pem ubuntu@<IP_PUBLICA_MASTER>
```

Desde el Master:

```bash
# 2. Clonar repo en Master
git clone https://github.com/AnLu996/onpe-hadoop-cluster.git
cd onpe-hadoop-cluster

# 3. Preparar HDFS
hdfs dfs -mkdir -p /onpe/raw /onpe/clean /onpe/output
hdfs dfs -put -f data/actas_onpe_raw.jsonl /onpe/raw/

# 4. Limpieza (Estudiante 2)
cd jobs/limpieza_actas && bash run_limpieza.sh && cd ../..
cd jobs/actas_resumen && bash run_resumen.sh && cd ../..

# 5. MapReduce (Estudiante 3)
cd jobs/conteo_lineas && bash run_conteo.sh && cd ../..
cd jobs/votos_nacional && bash run_votos_nacional.sh && cd ../..
cd jobs/votos_region && bash run_votos_region.sh && cd ../..
cd jobs/votos_especiales && bash run_votos_especiales.sh && cd ../..
cd jobs/actas_estado && bash run_actas_estado.sh && cd ../..
cd jobs/indice_invertido && bash run_indice.sh && cd ../..

# 6. Ver resultados
hdfs dfs -ls /onpe/output
hdfs dfs -cat /onpe/output/votos_nacional/part-00000 | head
```

---

## 14. División de Responsabilidades

### Estudiante 1: Infraestructura y Datos

```
✓ Ejecutar deploy_cluster.sh
✓ Ejecutar setup_hadoop_cluster.sh
✓ Validar clúster con jps
✓ Configurar HDFS (/onpe/raw, /onpe/clean, /onpe/output)
✓ Cargar datos raw a HDFS
✓ Monitorear interfaces web (9870, 8088, 19888)
```

### Estudiante 2: Limpieza Distribuida

```
✓ Implementar mapper_limpieza.py
✓ Implementar reducer_limpieza.py
✓ Generar /onpe/clean/actas_limpias_tsv
✓ Implementar mapper_resumen.py
✓ Implementar reducer_resumen.py
✓ Generar /onpe/clean/actas_resumen_tsv
✓ Validar formato TSV
✓ Documentar campos extraídos
```

### Estudiante 3: Análisis Electoral (MapReduce)

```
✓ Implementar conteo_lineas (prueba)
✓ Implementar votos_nacional
✓ Implementar votos_region
✓ Implementar votos_especiales
✓ Implementar actas_estado
✓ Generar todos los outputs
✓ Validar resultados contra ONPE oficial
```

### Estudiante 4: Índice e Integración (Opcional)

```
✓ Implementar índice invertido
✓ Crear consultas sobre actas
✓ Descargar resultados a carpeta local
✓ Crear dashboard
✓ Validación final
```

---

## 15. Tecnología: Hadoop Streaming

**Ventajas de Hadoop Streaming:**

✓ Sin compilación de `.jar`
✓ Python nativo
✓ Rápido para prototipar
✓ Usa stdin/stdout
✓ Fácil de debuggear

**Ejemplo básico de Mapper:**

```python
import sys

for line in sys.stdin:
    fields = line.strip().split('\t')
    partido = fields[4]
    votos = int(fields[5])
    print(f"{partido}\t{votos}")
```

**Ejemplo básico de Reducer:**

```python
import sys

current_party = None
total_votes = 0

for line in sys.stdin:
    party, votes = line.strip().split('\t')
    votes = int(votes)
    
    if party != current_party and current_party is not None:
        print(f"{current_party}\t{total_votes}")
        total_votes = 0
    
    current_party = party
    total_votes += votes

if current_party:
    print(f"{current_party}\t{total_votes}")
```

---

## 16. Notas Importantes

### ⚠️ Sobre el Master

```
✗ El Master NO almacena actas (no es DataNode)
✗ El Master NO ejecuta Mappers
✓ El Master SÍ coordina (NameNode, ResourceManager)
✓ El Master SÍ ejecuta Reducers
✓ Las 23GB se distribuyen entre 3 Workers
```

### 📌 Sobre Procesos y Paralelismo

```
Hadoop usa PROCESOS (no hilos):
✓ Cada Mapper = proceso Java independiente
✓ Cada Reducer = proceso Java independiente
✓ Se ejecutan en paralelo si hay CPUs disponibles
✓ Fault-tolerant (un proceso malo no cae todo)

En tu proyecto:
✓ ~6 procesos Mapper por worker (en paralelo)
✓ 1 Reducer en el Master (consolidación final)
```

### 📊 Sobre Factor de Replicación

```
Configurado: dfs.replication = 1
Por qué: Espacio limitado en instancias t3.medium

Implicación: Si falla un Worker, se pierden sus datos
Alternativa: Aumentar a 3, pero necesita 3x espacio
```

---

## 17. Destruir el Clúster

**IMPORTANTE:** Para evitar cargos innecesarios en AWS Academy:

```bash
bash destroy_cluster.sh
```

Esto elimina:
- Instancias EC2
- Security Group
- Key Pair
- Volúmenes EBS

---

## 18. Troubleshooting

### Error: "No such file or directory: /onpe/raw"

```bash
# Solución:
hdfs dfs -mkdir -p /onpe/raw /onpe/clean /onpe/output
```

### Error: "Task failed"

Verifica logs:

```bash
# En interfaz web: http://localhost:8088
# O en terminal:
hdfs dfs -cat /onpe/output/votos_nacional/_logs
```

### Error: "Out of memory"

```bash
# Reduce memoria por task:
# En archivo de configuración:
mapreduce.map.memory.mb = 128  (en lugar de 256)
```

### Mapper no recibe entrada

```bash
# Verifica que el archivo existe:
hdfs dfs -cat /onpe/clean/actas_limpias_tsv/part-00000 | head

# Verifica formato (debe ser TSV):
hdfs dfs -cat /onpe/clean/actas_limpias_tsv/part-00000 | cut -f1-5 | head
```

---

## 19. Evidencias para Informe Final

Captura pantalla de:

```text
☐ Clúster EC2 con 4 nodos activos
☐ `jps` en Master
☐ `jps` en cada Worker
☐ HDFS NameNode UI (9870)
☐ YARN ResourceManager UI (8088)
☐ JobHistoryServer UI (19888)
☐ Datos cargados: hdfs dfs -ls /onpe/raw/
☐ Limpieza completada: hdfs dfs -cat /onpe/clean/.../part-00000
☐ Ejecución de jobs (logs)
☐ Votos nacionales: hdfs dfs -cat /onpe/output/votos_nacional/...
☐ Votos por región: hdfs dfs -cat /onpe/output/votos_region/...
☐ Votos especiales: hdfs dfs -cat /onpe/output/votos_especiales/...
☐ Actas por estado: hdfs dfs -cat /onpe/output/actas_estado/...
☐ Índice invertido: hdfs dfs -cat /onpe/output/indice_invertido/...
☐ Dashboard final (si aplica)
```

---

## 20. Referencias Útiles

**Documentación oficial:**
- [Apache Hadoop](https://hadoop.apache.org/)
- [Hadoop Streaming](https://hadoop.apache.org/docs/stable/hadoop-streaming/)
- [HDFS Commands](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HDFSCommands.html)

**Tutoriales:**
- [MapReduce Concepts](https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html)
- [Python en Hadoop](https://www.youtube.com/watch?v=xxl5cHj5Dls)

---

## 21. Contacto y Preguntas

Para dudas sobre infraestructura: Estudiante 1
Para dudas sobre limpieza: Estudiante 2
Para dudas sobre MapReduce: Estudiante 3

---

**Última actualización:** 2026-05-13
**Versión:** 2.0 (Hadoop Streaming + División de trabajo)
