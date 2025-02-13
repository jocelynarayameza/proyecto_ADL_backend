const pool = require('../config/database');

const getUsers = async () =>{
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows

  } catch (error) {
    throw new Error("No se pudo obtener usuarios");
    
    // throw new Error("Problema al obtener usuarios");
  }
}

module.exports = { getUsers }