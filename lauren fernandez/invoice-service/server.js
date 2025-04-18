const { Kafka } = require('kafkajs');
const Ajv = require('ajv');
const { MongoClient } = require('mongodb');

const kafka = new Kafka({
  clientId: 'invoice-service',
  brokers: ['kafka:9092'],
});

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

const consumer = kafka.consumer({ groupId: 'invoice-group' });
const producer = kafka.producer();

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017';
const client = new MongoClient(mongoUri);
let purchasesCollection;

async function connectMongo() {
  await client.connect();
  const db = client.db("ecommerce_logs");
  purchasesCollection = db.collection("purchases");
  console.log("📦 Conectado a MongoDB desde invoice-service");
}

const run = async () => {
  await connectMongo();
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'order-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const order = JSON.parse(message.value.toString());

        if (!validateOrder(order)) {
          console.error("❌ Orden inválida:", validateOrder.errors);
          return;
        }

        const total = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const invoice = {
          to: order.email || "no-email@example.com",
          subject: "Factura de tu compra",
          content: `Total: $${total.toFixed(2)}`
        };

        await producer.send({
          topic: "invoice-processed",
          messages: [{ value: JSON.stringify(invoice) }]
        });

        const purchase = {
          timestamp: new Date(),
          source: "invoice-service",
          topic: "order-created",
          userId: order.userId,
          items: order.items,
          total
        };

        await purchasesCollection.insertOne(purchase);
        console.log("📥 Orden válida procesada y guardada:", purchase);

      } catch (err) {
        console.error("❌ Error al procesar orden:", err);
      }
    }
  });
};

run().catch(console.error);