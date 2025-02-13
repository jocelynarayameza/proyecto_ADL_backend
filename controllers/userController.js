const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();
const pool = require('../config/database');

// const { getUser } = require('../modules/users')

exports.getUsers = async(req,res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows
    
  } catch (error) {
    res.status(500).send('No se pudo obtener datos')
  }
}