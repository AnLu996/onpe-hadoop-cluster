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

echo "=== 2. Subiendo datos a HDFS (Paciencia, tomará mucho tiempo) ==="
# Usamos nohup internamente para que no muera si SSH se desconecta?
# Mejor lo mantenemos simple y si falla le decimos al usuario usar nohup
hdfs dfs -put -f data/* /onpe/raw/

echo "=== 3. Verificación de carga ==="
echo "Total de archivos subidos:"
hdfs dfs -ls /onpe/raw/ | wc -l

echo "=== 4. Limpieza final en Master ==="
rm -rf data

echo "¡Subida a HDFS completada exitosamente!"
