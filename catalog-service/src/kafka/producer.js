const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

(async () => {
  await producer.connect();
})();

module.exports = producer;
