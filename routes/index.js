const express = require('express');
const router = express.Router();


  router.get('/', (req,res) =>{
    res.send({msg: "Bienvenido a FF Marketplace" })
  })

  router.get('*', (req,res) =>{
    res.status(404).send({ msg: "La ruta que intenta consultar no existe" })
  })

  module.exports = router;
