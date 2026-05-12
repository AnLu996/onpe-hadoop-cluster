#!/bin/bash

# =================================================================
# SCRIPT 2: SUBIDA DE DATOS A HDFS
# =================================================================

echo "=== 1. Preparando estructura en HDFS ==="
hdfs dfs -mkdir -p /onpe/raw
hdfs dfs -mkdir -p /onpe/clean
hdfs dfs -mkdir -p /onpe/output
hdfs dfs -mkdir -p /onpe/output/conteo_lineas
hdfs dfs -mkdir -p /onpe/output/votos_nacional
hdfs dfs -mkdir -p /onpe/output/votos_region
hdfs dfs -mkdir -p /onpe/output/votos_especiales
hdfs dfs -mkdir -p /onpe/output/actas_estado
hdfs dfs -mkdir -p /onpe/output/indice_invertido

echo "=== 2. Subiendo datos a HDFS ==="
# Como son muchísimos archivos, usamos HDFS internamente para moverlos y evitar el límite de argumentos de bash
hdfs dfs -put data /onpe/raw/
hdfs dfs -mv /onpe/raw/data/* /onpe/raw/
hdfs dfs -rm -r /onpe/raw/data

echo "=== 3. Verificación de carga ==="
echo "Total de archivos subidos:"
ARCHIVOS=$(hdfs dfs -ls /onpe/raw/ | grep ".json" | wc -l)
echo "$ARCHIVOS"

if [ "$ARCHIVOS" -eq 0 ]; then
    echo "¡ERROR! No se subieron los archivos. Abortando limpieza para no perder la data."
    exit 1
fi

echo "=== 4. Limpieza final en Master ==="
rm -rf data

echo "¡Subida a HDFS completada exitosamente!"
