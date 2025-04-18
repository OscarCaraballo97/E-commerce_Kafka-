const express = require('express');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const kafka = new Kafka({ clientId: 'order-service', brokers: ['kafka:9092'] });
const producer = kafka.producer();

const runProducer = async () => await producer.connect();
runProducer();

app.post('/api/orders', async (req, res) => {
  const { userId, items } = req.body;
  const event = {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    source: 'OrderService',
    topic: 'order-created',
    payload: { userId, items },
    snapshot: { total: items.reduce((sum, item) => sum + item.quantity * item.price, 0) }
  };

  await producer.send({
    topic: 'order-created',
    messages: [{ value: JSON.stringify(event) }]
  });

  res.status(201).json({ message: 'Order created', event });
});

app.listen(3000, () => {
  console.log('Order Service running on port 3000');
});