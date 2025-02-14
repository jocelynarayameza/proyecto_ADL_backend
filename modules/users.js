const pool = require('../config/database');
const jwt=require('jsonwebtoken');

exports.getUser = async (req,res) =>{
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const {email} = jwt.decode(token)

    const { rows:users} = await pool.query("SELECT * FROM users WHERE email=$1",email);
    res.json(users)  

  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
}

exports.registerUser = async ( username, name, lastname, email, password, birthday ) => {
  try {
    const address = 'No se registra dirección';
    const postgresData = 'INSERT INTO users(username, name, lastname, email, password, birthday,address';
    const values = [username, name, lastname, email, password, birthday,address]
    const result = await pool.query(postgresData,values)
    return result.rows[0]

  } catch (error) {
    throw new Error('Error al crear el usuario')
  }
}

exports.authUser = async (req, res) => {
  try {
    const SQLQuery = 'SELECT * FROM users WHERE email=$1';
    const SQLValues = [email]
    const result = await pool.query(SQLQuery,SQLValues)
    return result.rows[0];
    
  } catch (error) {
    throw new Error('Error al autenticar el usuario')
  }
}