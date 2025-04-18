const express = require('express');
const router = express.Router();
const { registerUser } = require('./user.controller');

router.post('/register', registerUser);

module.exports = router;
