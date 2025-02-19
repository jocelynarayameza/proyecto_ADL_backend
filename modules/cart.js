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



exports.buyProductToOrder = async (id_user, cart) =>{
  try {
    let totalPrice = 0;
    let totalPriceOrder = cart.map((productPrice) =>{
      totalPrice += (productPrice.product_price * productPrice.total_quantity);
      return totalPrice
    })
    totalPriceOrder = Number(totalPriceOrder.slice(-1))
    
    let order_date = new Date()
    const orderDate = order_date.toISOString().split('T')[0]
    const orderTime = order_date.toISOString().split('T')[1].split('Z')[0]
    order_date_final = orderDate + " " + orderTime;
  
    await pool.query('INSERT INTO orders (order_user, order_total, order_date) VALUES ($1,$2,$3)',[id_user, totalPriceOrder, order_date_final]);
    const { rows: orderSearch } = await pool.query('SELECT id_order FROM orders WHERE order_user = $1 AND order_total = $2 AND order_date = $3', [id_user, totalPriceOrder, order_date_final ]);
  
    const orderId = orderSearch[0].id_order;
    
  
    await Promise.all (cart.map( async(product) => {
      await pool.query('INSERT INTO order_details (order_id, order_product, product_order_price,product_order_quantity) VALUES ($1,$2,$3,$4)', [orderId, product.product_id, product.product_price, product.total_quantity])
  
    })) 
    return {confirm: true, order_details: { id_order: orderId, order_date: order_date_final, order_total: totalPriceOrder }}

  } catch (error) {
    throw new Error("Error al enviar la orden");
  }
}



exports.deleteTotalCart = async (id_user) =>{
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1',[id_user])
    return true

  } catch (error) {
    throw new Error("Error al eliminar el carrito"); 
  }
}

exports.repeatOrderToCart = async (idUser, idOrder) => {
  try {
    const { rows: validateUser } = await pool.query(
      `SELECT id_order FROM orders WHERE id_order = $1 AND order_user = $2`,
      [idOrder, idUser]
    );

    if (validateUser.length === 0) {
      throw new Error("La orden no pertenece al usuario o no existe");
    }

    const { rows: orderProducts } = await pool.query(
      `SELECT order_product, product_order_quantity FROM order_details WHERE order_id = $1`,
      [idOrder]
    );
    await Promise.all(orderProducts.map(async (product) => {
      const { order_product, product_order_quantity } = product;
      const productExists = await exports.checkProductInCart(idUser, order_product);

      if (productExists) {
        await exports.editProductInCart(idUser, order_product, product_order_quantity);
      } else {
        await exports.addProductInCart(idUser, order_product, product_order_quantity);
      }
    }));
    return { msg: "Orden añadida al carrito" };

  } catch (error) {
    console.error("Error en repeatOrderToCart:", error);
    throw new Error(`Error al repetir la orden: ${error.message}`);
  }
};