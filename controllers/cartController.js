const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();

const { getCart } = require('../modules/cart')

exports.getCarts = async(req,res) =>{
  try {
    const cart= await getCart(req);
    res.status(200).send(cart);

  } catch (error) {
    res.status(500).send({msg:'No se pudo obtener informacion del carrito'});
  }
}

exports.buyProducts = async(req,res) =>{
  try {
    
  } catch (error) {
    
  }
}