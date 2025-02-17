const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController.js');
const authentication = require('../middlewares/authentication')

router.get('/', productController.getProductsController)
router.get('/mis-productos', authentication, productController.getMyProductsController)
router.get('/mis-productos/:idProduct', authentication, productController.getMyProductsByIdController)
router.put('/mis-productos/:idProduct', authentication, productController.putMyProductsByIdController)
router.delete('/mis-productos/:idProduct', authentication, productController.deleteMyProductsByIdController)
router.post('/mis-productos/agregar', authentication, productController.newProductController)
router.get('/:id', productController.getProductByIdController)


module.exports = router

