const pool = require('../config/database');
const jwt = require('jsonwebtoken');

exports.getOrders = async (idUser) => {
  try {
    const { rows: orders } = await pool.query("SELECT * FROM orders WHERE order_user = $1", [idUser]);
    
    return orders

  } catch (error) {
    throw new Error("No se pudo obtener los productos get products");
  }
}

exports.getOrderById = async (idUser, idOrder) => {
    try {
  
      const query = {
        text: "SELECT * FROM orders WHERE order_user = $1 and id_order = $2",
        values: [idUser, idOrder]
      };
  
      const { rows: order } = await pool.query(query);
  
      return order[0];
    } catch (error) {
      throw new Error("No se pudo obtener la orden del usuario");
    }
  }

  