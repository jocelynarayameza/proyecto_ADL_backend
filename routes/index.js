const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController')
const authentication = require('../middlewares/authentication')


module.exports = () => {
  router.get('/', (req,res) =>{
    res.send('bienvenido')
  })
 
  // Rutas de Users
    router.get('/users', function(req,res){usersController.getUsers})
    router.post('/register',function(req,res){usersController})
    router.post('/login',function(req,res){usersController})
  

  router.get('*', (req,res) =>{
    res.status(404).send({ msg: "La ruta que intenta consultar no existe" })
  })

  return router
}
