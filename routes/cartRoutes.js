const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController')
const authentication = require('../middlewares/authentication')


router.get("/", authentication, cartController.getCartController);
router.post("/comprar", authentication, cartController.buyProductsToOrderController);
router.post("/editar", authentication, cartController.editProductInCartController);

module.exports = router;
