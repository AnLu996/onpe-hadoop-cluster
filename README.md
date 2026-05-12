# Big Data ONPE con Hadoop, HDFS y MapReduce en AWS

Este proyecto implementa una arquitectura Big Data para procesar datos electorales de la ONPE usando un clúster Hadoop de 4 nodos en AWS EC2.

El objetivo es automatizar el levantamiento del clúster, cargar datos de actas electorales en HDFS y ejecutar consultas distribuidas mediante trabajos MapReduce.

---

## 1. Estructura del Proyecto

Todos los integrantes deben tener la siguiente estructura de carpetas:

```text
bigdata-onpe-hadoop/
│
├── deploy_cluster.sh
├── destroy_cluster.sh
├── setup_hadoop_cluster.sh
├── upload_data.sh
│
├── scripts/                   <-- Scripts de ejecución de jobs (Tarea 1.4)
│   ├── run_limpieza.sh
│   ├── run_votos_nacional.sh
│   ├── run_votos_region.sh
│   └── run_indice.sh
│
├── jobs/                      <-- Directorio para los Jars compilados
│   ├── limpieza/
│   ├── votos_nacional/
│   ├── votos_region/
│   └── indice_invertido/
│
└── README.md
```

---

## 2. Guía de Replicación para AWS Academy (Estudiante 1)

Sigue estos pasos para levantar toda la infraestructura desde cero y cargar los 23GB de datos JSON de la ONPE en HDFS. Las instancias se crean con **40GB de disco** y **factor de replicación de HDFS a 1** para optimizar los créditos de AWS Academy.

### Paso 0: Clonar el Repositorio
Para comenzar, debes clonar este repositorio en el entorno desde donde controlarás AWS. **Se recomienda encarecidamente usar AWS CloudShell** (la terminal integrada en la consola de AWS) o una máquina local que ya tenga `aws-cli` configurado con tus credenciales de AWS Academy.

En tu terminal (ej. AWS CloudShell), ejecuta:
```bash
git clone https://github.com/jflma/onpe-hadoop-cluster.git
cd onpe-hadoop-cluster
```

### Paso 1: Desplegar el Clúster
Estando dentro de la carpeta clonada, ejecuta:
```bash
bash deploy_cluster.sh
```
Esto creará 1 nodo Master y 3 nodos Worker (instancias t2.micro con 40GB EBS). Generará un archivo `cluster_ips.txt`.

### Paso 2: Configurar Hadoop
Una vez las instancias estén corriendo, instala y configura Hadoop automáticamente ejecutando:
```bash
bash setup_hadoop_cluster.sh
```

### Paso 3: Validar el Clúster (Tarea 1.1)
Conéctate por SSH al nodo Master:
```bash
ssh -i hadoop-onpe-key.pem ubuntu@<IP_PÚBLICA_MASTER>
```
Valida que Hadoop esté corriendo en el **Master**:
```bash
jps
# Debe mostrar: NameNode, SecondaryNameNode, ResourceManager, JobHistoryServer
```
Valida que los **Workers** estén funcionando:
```bash
for worker in worker1 worker2 worker3; do
  echo "===== $worker ====="
  ssh $worker jps
  # Debe mostrar: DataNode, NodeManager
done
```

### Paso 4: Carga de Datos y Estructura HDFS (Tareas 1.2 y 1.3)
Aún dentro del nodo Master, ejecuta el script de carga. Este script:
1. Descargará `data.zip` (1GB) desde Google Drive.
2. Descomprimirá la carpeta `data/` que contiene todos los archivos JSON (23GB).
3. Creará toda la estructura de carpetas en HDFS (`/onpe/raw`, `/onpe/clean`, etc.).
4. Subirá todos los JSONs a `/onpe/raw/`.
5. Borrará los archivos locales del Master para liberar espacio.

Ejecuta:
```bash
bash upload_data.sh
```
*Nota: Este proceso tomará varios minutos debido a la cantidad de información.*

### Paso 5: Ejecución de Jobs MapReduce (Tarea 1.4)
Una vez que los demás estudiantes hayan desarrollado y compilado los archivos `.jar` en la carpeta `jobs/`, puedes ejecutarlos fácilmente desde el Master usando los scripts en la carpeta `scripts/`.

Por ejemplo, para ejecutar la limpieza:
```bash
bash scripts/run_limpieza.sh
```

---

## 3. Destruir el Clúster
Para no consumir créditos de más cuando termines de trabajar:
```bash
bash destroy_cluster.sh
```
