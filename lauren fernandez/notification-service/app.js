const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({ clientId: 'notification-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'notification-group' });
const mongo = new MongoClient('mongodb://mongo:27017');

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'invoice-processing', fromBeginning: true });
  await mongo.connect();
  const db = mongo.db('ecommerce');
  const events = db.collection('events');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const invoiceEvent = JSON.parse(message.value.toString());

      const notification = {
        to: `${invoiceEvent.payload.userId}@example.com`,
        subject: `Factura #${invoiceEvent.snapshot.invoiceId}`,
        content: `Total a pagar: $${invoiceEvent.snapshot.amount}`
      };

      const event = {
        eventId: uuidv4(),
        timestamp: new Date().toISOString(),
        source: 'NotificationService',
        topic: 'notification-sent',
        payload: invoiceEvent.payload,
        snapshot: notification
      };

      await events.insertOne(event);

      console.log('Notificación enviada:', notification);
    }
  });
}

start();