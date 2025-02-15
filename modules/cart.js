const pool = require('../config/database');

exports.getCart = async (req,res) =>{
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const {id} = jwt.decode(token)

    const { rows:cart} = await pool.query("SELECT * FROM cart WHERE user_id=$1", id);

    return cart
    // res.json(cart)  

  } catch (error) {
    throw new Error('Error al obtener el carrito');
  }
}

exports.buyProduct = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}
