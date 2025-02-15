const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController.js');
const authentication = require('../middlewares/authentication')

router.get('/', productController.getProductsController)
router.get('/:id', productController.getProductByIdController)
router.get('/mis-productos', authentication, productController.getMyProductsController)

module.exports = router

