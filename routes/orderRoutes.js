const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authentication = require('../middlewares/authentication')

router.get('/', authentication, orderController.getOrdersController )
router.get('/mis-pedidos/:idPedido', authentication, orderController.getOrderByIdController )


module.exports = router
