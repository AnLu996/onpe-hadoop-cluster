#!/bin/bash

# =================================================================
# SCRIPT DE CARGA DE DATOS A HDFS 
# =================================================================

# 1. Configuración con los datos reales
DRIVE_ID="1HxNfJxIrVPCL8UE83IAQrZ0kjgwdzFkh"
FILE_NAME="data.zip"

echo "=== 1. Instalando herramientas necesarias (gdown, unzip) ==="
sudo apt-get update && sudo apt-get install -y python3-pip unzip
pip3 install gdown --quiet

echo "=== 2. Descargando archivo data.zip desde Google Drive ==="
gdown --id "$DRIVE_ID" -O "$FILE_NAME"

if [ ! -f "$FILE_NAME" ]; then
    echo "Error: No se pudo descargar el archivo $FILE_NAME."
    exit 1
fi

echo "=== 2.1 Descomprimiendo archivo ZIP ==="
# El archivo extrae una carpeta 'data/'
unzip -o "$FILE_NAME"

echo "=== Borrando el ZIP para liberar espacio ==="
rm "$FILE_NAME"

if [ ! -d "data" ]; then
    echo "Error: No se encontró la carpeta 'data' extraída."
    exit 1
fi

echo "=== 3. Preparando estructura completa en HDFS  ==="
hdfs dfs -mkdir -p /onpe/raw
hdfs dfs -mkdir -p /onpe/clean
hdfs dfs -mkdir -p /onpe/output
hdfs dfs -mkdir -p /onpe/output/conteo_lineas
hdfs dfs -mkdir -p /onpe/output/votos_nacional
hdfs dfs -mkdir -p /onpe/output/votos_region
hdfs dfs -mkdir -p /onpe/output/votos_especiales
hdfs dfs -mkdir -p /onpe/output/actas_estado
hdfs dfs -mkdir -p /onpe/output/indice_invertido

echo "=== 4. Subiendo datos a HDFS (Subiendo contenido de carpeta data) ==="
# Sube todos los json dentro de 'data' al directorio /onpe/raw/
hdfs dfs -put -f data/* /onpe/raw/

echo "=== 5. Verificación de carga ==="
echo "Total de archivos subidos:"
hdfs dfs -ls /onpe/raw/ | wc -l

echo "=== 6. Limpieza en Master ==="
# Borramos la carpeta extraída para no ocupar los 23GB en el disco del Master
rm -rf data

echo "¡Proceso de carga completado exitosamente!"
