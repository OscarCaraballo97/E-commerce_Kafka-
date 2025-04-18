
const express = require('express');
const { Kafka } = require('kafkajs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const kafka = new Kafka({
  clientId: 'frontend-api',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const producer = kafka.producer();

app.post('/api/order', async (req, res) => {
  const order = req.body;

  try {
    await producer.connect();
    await producer.send({
      topic: 'order_created',
      messages: [
        { value: JSON.stringify(order) }
      ],
    });
    await producer.disconnect();
    res.json({ message: 'Orden enviada a Kafka correctamente.' });
  } catch (error) {
    console.error('Error al enviar mensaje a Kafka:', error);
    res.status(500).json({ message: 'Error al enviar mensaje a Kafka.' });
  }
});

app.listen(port, () => {
  console.log(`Frontend API escuchando en http://localhost:${port}`);
});
