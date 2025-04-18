const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const emitProductCreated = async (product) => {
  await producer.send({
    topic: process.env.TOPIC_PRODUCT_CREATED,
    messages: [{ value: JSON.stringify(product) }]
  });
};

module.exports = {
  connectProducer,
  emitProductCreated
};
