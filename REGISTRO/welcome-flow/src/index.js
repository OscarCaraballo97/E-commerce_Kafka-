const express = require('express');
const mongoose = require('mongoose');
const routes = require('./user.routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/users', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(3001, () => {
      console.log('🚀 User Service corriendo en http://localhost:3001');
    });
  })
  .catch(err => console.error('❌ Mongo error:', err));
