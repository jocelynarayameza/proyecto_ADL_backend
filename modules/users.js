const pool = require('../config/database');
const jwt=require('jsonwebtoken');

exports.getUser = async () =>{
  try {
    const { rows:users } = await pool.query("SELECT * FROM users");
    return users

  } catch (error) {
    throw new Error("No se pudo obtener usuarios");
  }
}

module.exports = { getUser }