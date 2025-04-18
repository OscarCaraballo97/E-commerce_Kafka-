const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({ clientId: 'invoice-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'invoice-group' });
const producer = kafka.producer();

const mongo = new MongoClient('mongodb://mongo:27017');

async function start() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'order-created', fromBeginning: true });
  await mongo.connect();
  const db = mongo.db('ecommerce');
  const events = db.collection('events');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const orderEvent = JSON.parse(message.value.toString());
      const invoice = {
        invoiceId: uuidv4(),
        amount: orderEvent.snapshot.total,
        userId: orderEvent.payload.userId
      };

      const event = {
        eventId: uuidv4(),
        timestamp: new Date().toISOString(),
        source: 'InvoiceService',
        topic: 'invoice-processing',
        payload: orderEvent.payload,
        snapshot: invoice
      };

      await events.insertOne(event);

      await producer.send({
        topic: 'invoice-processing',
        messages: [{ value: JSON.stringify(event) }]
      });

      console.log('Factura generada y publicada');
    }
  });
}

start();