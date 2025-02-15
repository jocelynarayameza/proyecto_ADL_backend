const pool = require('../config/database');
const jwt=require('jsonwebtoken');

exports.getUser = async (req,res) =>{
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const {email} = jwt.decode(token)

    const { rows:users} = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
    console.log(users[0]);
    
    return users[0]

  } catch (error) {
    console.log("1",error);
    
    throw new Error('Error al obtener el usuario');
  }
}

exports.registerUser = async ( username, name, lastname, email, password, birthday ) => {
  try {
    const address = 'No se registra dirección';
    
    const postgresData = 'INSERT INTO users(username, name, lastname, email, password, birthday,address) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    const values = [username, name, lastname, email, password, birthday, address]
    const {rows} = await pool.query(postgresData,values)
    return rows[0]

  } catch (error) {
    console.log(error);
    
    throw new Error('Error al crear el usuario')
  }
}

exports.loginUser = async (email) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1',[email])
    return rows[0];

  } catch (error) {
    throw new Error('Error al autenticar el usuario')
  }
}