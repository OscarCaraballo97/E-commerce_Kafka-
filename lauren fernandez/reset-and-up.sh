#!/bin/bash

echo "🚨 ATENCIÓN: Esto eliminará todas las imágenes, contenedores y volúmenes detenidos."
read -p "¿Estás seguro que querés continuar? (s/n): " confirm

if [[ "$confirm" != "s" ]]; then
  echo "❌ Cancelado."
  exit 1
fi

echo "🧹 Limpiando Docker..."
docker system prune -a --volumes -f

echo "✅ Docker limpio. Levantando servicios..."
docker-compose -f docker-compose-kafka-fixed-mongo-platform-arm64.yml up --build
