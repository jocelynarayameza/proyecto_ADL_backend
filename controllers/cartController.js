const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();

const { getCart } = require('../modules/cart')

exports.getCarts = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
    const cart = await getCart(id_user)
    res.status(200).send(cart);

  } catch (error) {
    res.status(500).send({msg:'No se pudo obtener informacion del carrito'});
  }
}

exports.buyProductsToOrders = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
  } catch (error) {
    
  }
}

exports.addProductsToCart = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
    const { id_product } = req.body
    const addProductToCart(id_user,id_product)
    res.status(200).send(cart);
    
  } catch (error) {
    
  }
}