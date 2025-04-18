use ecommerce_logs;

db.createCollection("purchases");

db.purchases.createIndex({ timestamp: 1 });
db.purchases.createIndex({ source: 1 });
db.purchases.createIndex({ topic: 1 });

try {
  sh.enableSharding("ecommerce_logs");
  sh.shardCollection("ecommerce_logs.purchases", { timestamp: 1 });
  print("✅ Sharding habilitado correctamente.");
} catch (e) {
  print("⚠️  No se habilitó sharding (posiblemente porque no estás en un clúster): " + e.message);
}