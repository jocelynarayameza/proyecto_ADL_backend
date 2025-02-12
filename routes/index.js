const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController')
const authentication = require('../middlewares/authentication')


module.exports = () => {
  router.get('/', (req,res) =>{
    res.send('bienvenido')
  })

  // router.get('/usuarios',auth,usersController)
  // router.post('/usuarios',usersController)
  // router.post('/login',usuariosController)

  router.get('*', (req,res) =>{
    res.status(404).send({ msg: "La ruta que intenta consultar no existe" })
  })

  return router
}