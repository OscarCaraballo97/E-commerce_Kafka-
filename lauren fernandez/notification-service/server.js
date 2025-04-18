const { Kafka } = require('kafkajs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);  // habilita formatos como email

const invoiceSchema = {
  type: "object",
  required: ["to", "subject", "content"],
  properties: {
    to: { type: "string", format: "email" },
    subject: { type: "string" },
    content: { type: "string" }
  }
};
const validateInvoice = ajv.compile(invoiceSchema);

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'invoice-processed', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const invoice = JSON.parse(message.value.toString());

        if (!validateInvoice(invoice)) {
          console.error("❌ Factura inválida en notification-service:", validateInvoice.errors);
          return;
        }

        console.log("📨 Enviando notificación a:", invoice.to);
        console.log("📧 Asunto:", invoice.subject);
        console.log("📝 Contenido:", invoice.content);
        // Simular envío de email...
      } catch (err) {
        console.error("❌ Error al procesar mensaje en notification-service:", err);
      }
    }
  });
};

run().catch(console.error);