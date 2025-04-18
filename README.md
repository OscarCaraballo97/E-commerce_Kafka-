
# 🛒 Ecommerce Kafka Microservices

Este proyecto demuestra una arquitectura de microservicios usando Kafka, MongoDB y Node.js.

## 📁 Estructura del Proyecto

```
ecommerce-kafka/
├── docker-compose-kafka-restart.yml
├── frontend-api/
│   ├── server.js
│   ├── Dockerfile
│   └── .env
```

## 🚀 Cómo levantar el proyecto

### 1. Clonar y posicionarse en la raíz del proyecto

```bash
cd ecommerce-kafka
```

### 2. Ejecutar con Docker

```bash
docker-compose -f docker-compose-kafka-restart.yml up --build
```

### 3. Acceder a la API

La API estará disponible en: [http://localhost:3000](http://localhost:3000)

### 4. Enviar orden de prueba

```bash
curl -X POST http://localhost:3000/api/order -H "Content-Type: application/json" -d '{"orderId": "123", "total": 500}'
```

---

## 🧪 Ejecutar solo el frontend-api localmente

```bash
cd frontend-api
npm install
node server.js
```

Asegurate de que Kafka esté corriendo y `.env` contenga:

```
KAFKA_BROKER=localhost:9092
```

---
