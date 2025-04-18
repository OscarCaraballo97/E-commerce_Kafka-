const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
});

module.exports = mongoose.model('Product', productSchema);
