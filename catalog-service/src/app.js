const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());


const products = [
  {
    productId: uuidv4(),
    name: "Laptop Dell XPS",
    price: 1500
  },
  {
    productId: uuidv4(),
    name: "Mouse Logitech",
    price: 30
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`🟢 Catalog-service corriendo en puerto ${PORT}`);
});
