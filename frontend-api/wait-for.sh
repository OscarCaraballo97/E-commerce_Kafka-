#!/bin/sh

HOST=kafka
PORT=9092

echo "Esperando a que $HOST:$PORT esté disponible..."

while ! nc -z $HOST $PORT; do
  sleep 2
done

echo "$HOST:$PORT está disponible. Iniciando servicio..."

exec node app.js
