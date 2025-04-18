const express = require('express');
const mongoose = require('mongoose');
const { emitEvent } = require('../events/emitter');
const Cart = require('../models/cart');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/system-cart')
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error de conexión a MongoDB", err));

app.post('/cart/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
        { userId },
        { $push: { items: { productId, quantity } } },
        { upsert: true, new: true }
    );
    emitEvent('cart-updates', { userId, productId, quantity });
    res.json(cart);
});

app.post('/cart/remove', async (req, res) => {
    const { userId, productId } = req.body;
    const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
    );
    emitEvent('cart-removals', { userId, productId });
    res.json(cart);
});

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));