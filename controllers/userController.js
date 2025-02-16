const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();
const crypto = require("crypto");

const { getUser, registerUser, loginUser, editUser, editAddressUser, deleteUser, tokenIDAdd, tokenIDRemove } = require('../modules/users');
const { passEmailConfirm, emailValid, usernameValid, inputEmpty } = require('../middlewares/validation');



exports.getUsers = async(req,res) => {
  try {
    const user = await getUser(req);
    res.status(200).send(user);

  } catch (error) {
    console.log(error);
    
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
            address:user.address,
          },
            process.env.TOKEN_PWD,
            {jwtid: crypto.randomUUID().toString() }
        )
        await tokenIDAdd(token);
        res.status(200).json({msg:'Autentificacion correcta','token':token})
      }
    }
    

  } catch (error) {   
    console.log(error);
    
    res.status(500).json({msg:"Fallo la autentificación"})
  }
}



exports.editUsers = async (req,res) =>{
  try {
    let { id_user, email, password, name, lastname } = await getUser(req)
    let { nameChange, lastnameChange, passwordChange, emailChange} = req.body;

    const passwordC = await bcrypt.compare(passwordChange, password)
    console.log(passwordC);
    
    if( inputEmpty(emailChange) && email != emailChange ){
      email = emailChange;

    } else if(inputEmpty(emailChange) && email== emailChange){
      res.status(409).json({msg:"Email es el mismo que tenía antes"})
    }


    if( inputEmpty(nameChange) && name != nameChange ){
      name = nameChange;
      
    } else if(inputEmpty(nameChange) && name== nameChange){
      res.status(409).json({msg:"Nombre es el mismo que tenía antes"})
    }


    if( inputEmpty(lastnameChange) && lastname!= lastnameChange ){
      lastname = lastnameChange;
      
    } else if(inputEmpty(lastnameChange) && lastname== lastnameChange){
      res.status(409).json({msg:"Apellido es el mismo que tenía antes"})
    }


    if( inputEmpty(passwordChange) && !passwordC){
      password = await bcrypt.hash(passwordChange,12)
      
    } else if(inputEmpty(passwordChange) && passwordC){
      res.status(409).json({msg:"Contraseña es la misma que tenía antes"})
    }


    await editUser(id_user, email, name, lastname, password)
    res.status(200).json({msg:"El usuario se modificó con éxito"})

  } catch (error) {
    res.status(401).json({msg:'Error al modificar el usuario'})
    
  }
}



exports.editAddressUsers = async (req,res) =>{
  try {
    let { id_user, address } = await getUser(req);
    let { addressChange } = req.body;

    if(address != addressChange ){
      address= addressChange;

    } else if(address == addressChange){
      res.status(409).json({msg:"Dirección es la misma que tenía antes"})
    }

    await editAddressUser(id_user,address)
    res.status(200).json({msg:"La dirección se modificó con éxito"})

  } catch (error) {
    res.status(401).json({msg:'Error al modificar la dirección'})
  }
}

// exports.deleteUsers = async(req,res) => {
//   try {
//     const { id_user } = await getUser(req)
//     console.log(id_user);
    

//     await deleteUser(id_user);
//     res.status(200).json({msg:"El usuario se eliminó con éxito"})

//   } catch (error) {
//     console.log(error);
    
//   }

// }


// exports.logout = async(req,res) =>{
//   // try {
//     const Authorization = req.header("Authorization")
//     const token = Authorization.split("Bearer ")[1]
//     await tokenIDRemove(token)
//     res.status(200).json({msg:"El usuario se deslogueó con éxito"})
//   // } catch (error) {
    
//   // }
// }
