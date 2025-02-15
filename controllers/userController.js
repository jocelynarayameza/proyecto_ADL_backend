const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();

const { getUser, registerUser, loginUser } = require('../modules/users');
const { passEmailConfirm, emailValid, usernameValid } = require('../middlewares/validation');

exports.getUsers = async(req,res) => {
  try {
    const user = await getUser(req);
    res.status(200).send(user);

  } catch (error) {
    res.status(500).json({msg:'No se pudo obtener datos'});
  }
};

exports.registerUsers = async(req,res) => {
  try {
    let {username, name, lastname, email, password, birthday, password_confirm, email_confirm} = req.body;
    const passEmailC = passEmailConfirm(email,email_confirm, password, password_confirm); 
    const usernameV = await usernameValid(username);
    const emailV = await emailValid(email);

    if(passEmailC && emailV && usernameV){
      password = await bcrypt.hash(password,12)
      await registerUser(username, name, lastname, email, password, birthday);
      res.status(201).json({msg:'Usuario registrado satisfactoriamente'})

    } else if (passEmailC && !emailV && usernameV){
      res.status(409).json({msg:'El email ya esta en uso'})

    } else if (passEmailC && emailV && !usernameV){
      res.status(409).json({msg:'El usuario ya esta en uso'})

    } else if (!passEmailC){
      res.status(409).json({msg:'La contrasena o el email de confirmacion no son iguales'})

    } else if (passEmailC && !emailV && !usernameV) {
      res.status(409).json({msg:'El usuario y el email ya estan en uso'})
    }

  } catch (error) {
    res.status(409).json({msg:'Error al registrar nuevo usuario'})
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
    res.status(500).json({msg:"Fallo la autentificacion"})
  }
}

exports.logout = async(req,res) =>{
  try {

  } catch (error) {
    
  }
}