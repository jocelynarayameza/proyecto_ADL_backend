const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authentication = require('../middlewares/authentication')

router.get('/', authentication, orderController.getOrdersController )
router.post('/repetir-pedido/:idPedido', authentication, orderController.repeatOrderToCartController)
router.get('/mis-pedidos/:idPedido', authentication, orderController.getOrderByIdController )


module.exports = router