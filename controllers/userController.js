const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();

const { getUser, registerUser, loginUser } = require('../modules/users')

exports.getUsers = async(req,res) => {
  try {
    console.log(req);
    
    const user = await getUser(req);
    res.status(200).send(user);

  } catch (error) {
    res.status(500).send({msg:'No se pudo obtener datos'});
  }
};

exports.registerUsers = async(req,res) => {
  try {
    let emailConfirm = false;
    let passConfirm = false;

    let {username, name, lastname, email, password, birthday, password_confirm, email_confirm} = req.body;

    if(password==password_confirm){
      passConfirm = true;
    } else{
      res.status(409).json({msg:'Las contraseñas no coinciden'})
    }

    if(email==email_confirm){
      emailConfirm = true;
    } else{
      res.status(409).json({msg:'Los emails no coinciden'})
    }

    if(emailConfirm && passConfirm){
      password = await bcrypt.hash(password,12)
      await registerUser(username, name, lastname, email, password, birthday);
      res.status(201).send({msg:'Registrado satisfactoriamente'})
    }

  } catch (error) {
    console.log(error);
    
    throw new Error("El usuario ya existe");
  }
}

exports.loginUsers = async(req,res) =>{
  try {
    const { email,password } = req.body;
    const user = await loginUser(email);

    if(!user){
      res.status(401).json({msg:'No existe el usuario'})
    } else {
      if(!bcrypt.compareSync(password,user.password)){
        res.status(401).json({msg:"Contrasena incorrecta"})
      } else {
        const token = jwt.sign(
          {email: user.email,
            password: user.password,
            username:user.username,
            name: user.name,
            lastname: user.lastname,
            birthday: user.birthday,
            address:user.address
          },
            process.env.TOKEN_PWD
        )
        res.status(200).json({msg:'Autentificacion correcta','token':token})
      }
    }

  } catch (error) {
    console.log(error);
    
    res.status(500).send("Fallo la autentificacion")
  }
}

exports.logout = async(req,res) =>{
  try {
    
  } catch (error) {
    
  }
}