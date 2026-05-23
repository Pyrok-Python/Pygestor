# Imagen base oficial de Python ligera
FROM python:3.12-slim

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . .

# Crear carpeta para datos persistentes (base de datos SQLite)
RUN mkdir -p /app/data

# Exponer el puerto 5000 en el contenedor
EXPOSE 5000

# Comando para ejecutar la app usando Gunicorn en producción
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
