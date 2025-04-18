#!/bin/sh

host="$1"
shift
cmd="$@"

echo "🔄 Esperando a que $host esté disponible..."
until nc -z $(echo $host | cut -d: -f1) $(echo $host | cut -d: -f2); do
  sleep 2
done

echo "✅ $host está disponible. Iniciando servicio..."
exec "$@"