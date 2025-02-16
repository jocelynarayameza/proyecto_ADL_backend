const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController')
const authentication = require('../middlewares/authentication')


router.get("/", authentication, cartController.getCarts);
// router.post("/comprar", authentication, cartController.buyProductsToOrders);
// router.post("/agregar", authentication, cartController.addProductsToCart)

module.exports = router;
