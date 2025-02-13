const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication')


module.exports = () => {
  router.get('/', (req,res) =>{
    res.send('Bienvenido')
  })

  router.get('*', (req,res) =>{
    res.status(404).send({ msg: "La ruta que intenta consultar no existe" })
  })

  return router
}
