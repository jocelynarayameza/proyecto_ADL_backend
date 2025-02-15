const pool = require ('../config/database');

exports.emailValid = async (email) =>{
  try {
    const { rows } = await pool.query('SELECT EXISTS(SELECT * FROM users WHERE email=$1)',[email])

    if(rows[0].exists===true){
      return !rows[0].exists
      
    } else if (rows[0].exists===false) {
      return !rows[0].exists
    }

  } catch (error) {
    throw new Error("Error al validar el email");
  }
}
exports.usernameValid = async (username) =>{
  try {
    const { rows } = await pool.query('SELECT EXISTS(SELECT * FROM users WHERE username=$1)',[username])

    if(rows[0].exists===true){
      return !rows[0].exists
      
    } else if (rows[0].exists===false) {
      return !rows[0].exists
    }

  } catch (error) {
    throw new Error("Error al validar el usuario");
  }
}

exports.passEmailConfirm = (email,email_confirm, password, password_confirm) =>{
  try {
    let emailConfirm = false;
    let passConfirm = false;
  
    if(password==password_confirm){
          passConfirm = true;
        } else{
          throw new Error("Las contraseñas no coinciden",error);
        }
    
    if(email==email_confirm){
      emailConfirm = true;
    } else{
      throw new Error("Los emails no coinciden",error);
    }

    if(emailConfirm && passConfirm){
      return true
    }
  } catch (error) {
    throw new Error("Error en la confirmacion de contraseña o email",error);
  }

}

exports.inputEmpty = (value) =>{
  if(value.length!=0){
    return true
  }
}