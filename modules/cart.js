const pool = require('../config/database');
const { getProductById } = require('./products');
const { getUserName } = require('./users');



exports.getCartFull = async (id_user) =>{
  try {
      const { rows:cart2} = await pool.query("SELECT * FROM cart WHERE user_id=$1", [id_user]);
      let cartNew = await Promise.all (cart2.map(async (item) => {
        let productInfo = await getProductById(item.product_id);
        let sellerName = await getUserName(productInfo.seller)
  
        return {...item,
        seller_Name: sellerName,
        product_name: productInfo.product_name ,
        product_price: productInfo.product_price ,
        product_quantity:productInfo.product_quantity ,
        product_photo: productInfo.product_photo};  
      }
      ))

    return cartNew

  } catch (error) {
    throw new Error("Error al obtener el carrito");
    
  }
    

}

exports.checkProductInCart = async(id_user, id_product,) =>{
  try {
    const { rows } = await pool.query('SELECT EXISTS(SELECT * FROM cart WHERE user_id=$1 AND product_id = $2)',[id_user, id_product])

    if(rows[0].exists===true){
      return rows[0].exists
      
    } else if (rows[0].exists===false) {
      return rows[0].exists
    }

  } catch (error) {
    throw new Error("Error al buscar si producto existe");
  }
}



exports.addProductInCart = async(id_user,id_product,total_quantity) => {
  try {
    const query = 'INSERT INTO cart(user_id, product_id, total_quantity) VALUES ($1,$2,$3)';
    const values = [id_user, id_product, total_quantity]
    const {rows} = await pool.query(query,values)
    return rows[0]

  } catch (error) {
    throw new Error("Error al añadir producto al carrito");
  }
}



exports.editProductInCart = async (id_user,id_product,total_quantity) =>{
  try {
    const {product_quantity} = await getProductById(id_product)
    if(total_quantity	<= product_quantity){
      const query = 'UPDATE cart SET total_quantity = $1 WHERE user_id = $2 AND product_id = $3';
      const values = [ total_quantity, id_user, id_product];
      const { rows } = await pool.query(query,values)
      return true

    } else if (total_quantity>product_quantity){
      return false
      
    }
    
  } catch (error) {
    throw new Error("Error al editar producto del carrito");
  }
}



exports.deleteProductInCart = async(id_user, id_product ) =>{
  try {
    const query = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2';
    const values = [ id_user, id_product];
    const { rows } = await pool.query(query,values)
    return rows

  } catch (error) {
    throw new Error("Error al eliminar producto del carrito");
  }
 
  
  
}


exports.buyProductToOrder = async (id_user, id_product) =>{

}


