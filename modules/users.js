const pool = require('../config/database');
const jwt=require('jsonwebtoken');

exports.getUser = async (req,res) =>{
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const {email} = jwt.decode(token)

    const { rows:users} = await pool.query("SELECT * FROM users WHERE email=$1",[email]); 
    return users[0]

  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
}

exports.registerUser = async ( username, name, lastname, email, password, birthday) => {
  try {
    const address = 'No se registra dirección';
    
    const postgresData = 'INSERT INTO users(username, name, lastname, email, password, birthday,address) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    const values = [username, name, lastname, email, password, birthday, address]
    const {rows} = await pool.query(postgresData,values)
    return rows[0]

  } catch (error) {
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

exports.editUser = async (id_user, email, name, lastname, password) => {
  try {
    const query = 'UPDATE users SET email = $1, name = $2, lastname = $3, password = $4 WHERE id_user = $5';
    const values = [ email, name, lastname, password, id_user ];
    const { rows } = await pool.query(query,values)
    
    return rows
  } catch (error) {
    throw new Error("No se pudo modificar el usuario");
  }
}

exports.editAddressUser = async (id_user,address) => {
  try {  
    const { rows } = await pool.query('UPDATE users SET address = $1 WHERE id_user = $2',[address,id_user])
    return rows

  } catch (error) {
    throw new Error("No se pudo modificar el usuario");
  }
}

exports.tokenIDAdd = async(token) =>{
  let {email, jti} = jwt.decode(token)
  
  const { rows} = await pool.query('UPDATE users SET tokenid = $1 WHERE email = $2',[jti,email]);
  
  return rows
}

exports.tokenIDSearch = async(token) => {
  let {email} = jwt.decode(token)
  
  const { rows:tokenid } = await pool.query('SELECT tokenid FROM users WHERE email = $1',[email]);
  console.log("Search", tokenid);
  
  
  return tokenid
}
exports.tokenIDRemove = async(token) =>{
  const tokenDecode = jwt.decode(token)
  let { email } = tokenDecode
  
  const { rows } = await pool.query('DELETE tokenid FROM users WHERE id_user = $1',[email]);
  
  return rows
}

// exports.deleteUser = async(id_user) => {
//   const { rows: products } = await pool.query('DELETE FROM products WHERE seller = $1',[id_user])


//   const { rows: cart } = await pool.query('DELETE FROM cart WHERE user_id = $1',[id_user])

//   const { rows: orders } = await pool.query('SELECT * FROM orders WHERE order_user = $1',[id_user])

//   for (order_row in orders){
//     const { orders } = await pool.query('DELETE * FROM order_details WHERE order_id = $1',[order_row])}

//   const { rows: finalorders } = await pool.query('DELETE FROM orders WHERE user_id = $1',[id_user])

//   const { rows: user } = await pool.query('DELETE FROM users WHERE id_user = $1',[id_user])
// }