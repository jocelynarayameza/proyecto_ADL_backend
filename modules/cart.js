const pool = require('../config/database');

exports.getCart = async (id_user) =>{
  try {

    const { rows:cart} = await pool.query("SELECT * FROM cart WHERE user_id=$1", [id]);
    return cart

  } catch (error) {
    throw new Error('Error al obtener el carrito');
  }
}

exports.buyProductToOrder = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

exports.addProductToCart = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

