const express = require('express');
const { Kafka } = require('kafkajs');
const bodyParser = require('body-parser');
const cors = require('cors');
const Ajv = require('ajv');

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

// Definir el esquema JSON
const ajv = new Ajv();
const orderSchema = {
  type: "object",
  required: ["userId", "items"],
  properties: {
    userId: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        required: ["productId", "quantity", "price"],
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
          price: { type: "number", minimum: 0 }
        }
      }
    }
  }
};
const validateOrder = ajv.compile(orderSchema);

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

const startProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Conectado a Kafka");
  } catch (err) {
    console.error("❌ Error al conectar con Kafka:", err);
  }
};

startProducer();

// Ruta para recibir órdenes y publicar en Kafka
app.post('/api/orders', async (req, res) => {
  const order = req.body;

  if (!validateOrder(order)) {
    console.error("❌ Orden inválida:", validateOrder.errors);
    return res.status(400).send("Orden inválida.");
  }

  try {
    await producer.send({
      topic: 'order-created',
      messages: [
        { value: JSON.stringify(order) }
      ]
    });
    console.log("✅ Orden publicada en Kafka:", order);
    res.status(200).send("Orden recibida y enviada a Kafka.");
  } catch (err) {
    console.error("❌ Error al publicar en Kafka:", err);
    res.status(500).send("Error al enviar orden a Kafka.");
  }
});

app.listen(port, () => {
  console.log(`🟢 Order-service escuchando en puerto ${port}`);
});