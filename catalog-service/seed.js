require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Product.findOne({ productId: 'prod001' });
    if (!existing) {
      await Product.create({
        productId: 'prod001',
        name: 'Laptop Gamer',
        price: 1200.99,
      });
      console.log('✅ Producto inicial insertado en MongoDB.');
    } else {
      console.log('⚠️ Producto ya existente.');
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });
