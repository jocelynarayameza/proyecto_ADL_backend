const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');
require('dotenv').config();
const crypto = require("crypto");

const { getUser, registerUser, loginUser, editUser, editAddressUser, deleteUser, tokenIDAdd, tokenIDRemove } = require('../modules/users');
const { passEmailConfirm, emailValid, usernameValid, inputEmpty } = require('../middlewares/validation');



exports.getUsers = async(req,res) => {
  try {
    const user = await getUser(req)
    

    if(!user){
     return res.status(404).json({msg: "Usuario no encontrado"})
    }

    res.status(200).send( {
      id_user: user.id_user, 
      username: user.username,
      name: user.name, 
      lastname: user.lastname,
      email: user.email,
      birthday: user.birthday.toISOString().split('T')[0],
      address: user.address
    }
  );

  } catch (error) {
    res.status(500).json({msg: "No se encontro usuario", 'error': error.message});
  }
};



exports.registerUsers = async(req,res) => {
  try {
    let {username, name, lastname, email, password, birthday, password_confirm, email_confirm} = req.body;
    const passEmailC = await passEmailConfirm(email,email_confirm, password, password_confirm); 
    const usernameV = await usernameValid(username);
    const emailV = await emailValid(email);

    if(passEmailC && emailV && usernameV){
      password = await bcrypt.hash(password,12)
      await registerUser(username, name, lastname, email, password, birthday);
      res.status(201).json({msg:'Usuario registrado satisfactoriamente','user_details': { 'username': username, 'email': email}})

    } else if (passEmailC && !emailV && usernameV){
      res.status(409).json({msg:'El email ya esta en uso'})

    } else if (passEmailC && emailV && !usernameV){
      res.status(409).json({msg:'El usuario ya esta en uso'})

    } else if (!passEmailC){
      res.status(400).json({msg:'La contraseña o el email de confirmación no son iguales'})

    } else if (passEmailC && !emailV && !usernameV) {
      res.status(409).json({msg:'El usuario y el email ya estan en uso'})
    }

  } catch (error) {
    res.status(500).json({msg:'No se pudo registrar nuevo usuario', 'error': error.message})
  }
}



exports.loginUsers = async(req,res) =>{
  try {
    const { email,password } = req.body;
    const user = await loginUser(email);

    if(!user){
      return res.status(404).json({msg:'Usuario no encontrado'})
    } 

    if(!bcrypt.compareSync(password,user.password)){
      res.status(401).json({msg:"Contraseña incorrecta"})
      } else {
        const token = jwt.sign(
          {id_user: user.id_user,
            email: user.email,
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
        res.status(200).json({msg:'Autentificación correcta','token':token})
      }
  
    
  } catch (error) {  
    res.status(500).json({msg:"No se pudo autenticar", 'error': error.message})
  }
}



exports.editUsers = async (req,res) =>{
  try {
    let { id_user, email, password, name, lastname } = await getUser(req)
    let { nameChange, lastnameChange, passwordChange, emailChange} = req.body;

    const passwordC = await bcrypt.compare(passwordChange, password);
    const emailChangeValid = await emailValid(emailChange);
    
    if( await inputEmpty(emailChange) && email != emailChange && emailChangeValid ){
      email = emailChange;

    } else if( await inputEmpty(emailChange) && email== emailChange){
      return res.status(409).json({msg:"Email es el mismo que tenía antes"})

    } else if(!emailChangeValid){
      return res.status(409).json({msg:"Email ya existe en uso"})
    }


    if( await inputEmpty(nameChange) && name != nameChange ){
      name = nameChange;
      
    } else if(await inputEmpty(nameChange) && name== nameChange){
      return res.status(409).json({msg:"Nombre es el mismo que tenía antes"})
    }


    if(await  inputEmpty(lastnameChange) && lastname!= lastnameChange ){
      lastname = lastnameChange;
      
    } else if(await inputEmpty(lastnameChange) && lastname== lastnameChange){
      return res.status(409).json({msg:"Apellido es el mismo que tenía antes"})
    }


    if(await  inputEmpty(passwordChange) && !passwordC){
      password = await bcrypt.hash(passwordChange,12)
      
    } else if(await inputEmpty(passwordChange) && passwordC){
      return res.status(409).json({msg:"Contraseña es la misma que tenía antes"})
    }

    await editUser(id_user, email, name, lastname, password)
    res.status(200).json({msg:"El usuario se modificó con éxito"})

  } catch (error) {
    res.status(500).json({msg:'No se pudo modificar el usuario', 'error': error.message})
  }
}



exports.editAddressUsers = async (req,res) =>{
  try {
    let { id_user, address } = await getUser(req);
    let { addressChange } = req.body;

    if(address != addressChange ){
      address= addressChange;

    } else if(address == addressChange){
     return res.status(409).json({msg:"Dirección es la misma que tenía antes"})
    }

    await editAddressUser(id_user,address)
    res.status(200).json({msg:"La dirección se modificó con éxito"})

  } catch (error) {
    res.status(500).json({msg:'No se pudo modificar la dirección del usuario', 'error': error.message})
  }
}



exports.logout = async(req,res) =>{
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    await tokenIDRemove(token)
    res.status(200).json({msg:"El usuario cerró sesión con éxito"})

  } catch (error) {
    res.status(500).json({msg:'No se pudo desloguear al usuario'})
}}



exports.deleteUsers = async(req,res) => {
  try {
    // const token = req.headers['authorization']?.split(' ')[1]; 
    
    // if (!token) {
    //   return res.status(401).json({ msg: 'No se proporcionó token' });
    // }
    // const decoded = jwt.decode(token);

    // if (!decoded || !decoded.id_user) {
    //   return res.status(401).json({ msg: 'Token inválido o no contiene id_user' });
    // }

    // const{ id_user } = jwt.decode(token);
    const { id_user } = await getUser(req)
    let deleteUserConfirm = await deleteUser(id_user);

    if (deleteUserConfirm) {
      return res.status(200).json({ msg: 'El usuario se eliminó con éxito' });
    }

    return res.status(404).json({ msg: 'No se encontró el usuario para eliminar' });

  } catch (error) {
    res.status(500).json({msg:'No se pudo eliminar el usuario', 'error': error.message})
  }
}
