const pool = require('../config/database');
const jwt = require('jsonwebtoken');

exports.getOrders = async (idUser) => {
  try {
    const { rows: orders } = await pool.query(`
      SELECT p.product_name, o.id_order, o.order_total, od.product_order_quantity FROM orders o 
      INNER JOIN order_details od ON od.order_id = o.id_order 
      INNER JOIN products p ON p.id_product = od.order_product
      WHERE o.order_user = $1`, [idUser]);
    
    return orders

  } catch (error) {
    throw new Error(`No se pudo obtener los pedidos: ${error.message}`);
  }
}

exports.getOrderById = async (idUser, idOrder) => {
    try {
  
      const query = {
        text: `
      SELECT p.product_name, p.product_price, o.id_order, o.order_total, od.product_order_quantity FROM orders o 
      INNER JOIN order_details od ON od.order_id = o.id_order 
      INNER JOIN products p ON p.id_product = od.order_product
      WHERE o.order_user = $1 and o.id_order = $2`,
        values: [idUser, idOrder]
      };
  
      const { rows: order } = await pool.query(query);

      if(!order) {
        throw new Error("La orden no pertenece al usuario o no existe");
      }
  
      return order;
    } catch (error) {
      throw new Error(`No se pudo obtener la orden del usuario": ${error.message}`);
    }
  }

  