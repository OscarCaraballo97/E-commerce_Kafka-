const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

router.post("/products", controller.createProduct);
router.get("/products", controller.getAllProducts);

module.exports = router;
