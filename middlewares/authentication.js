const jwt=require('jsonwebtoken');
const { tokenIDSearch } = require('../modules/users');
require('dotenv').config()

module.exports = (req,res,next)=>{
  const authHeader=req.get('authorization');
  
  if(!authHeader){
    res.status(401).send("No autenticado, no hay JWT")}
    const token = authHeader.split(" ")[1];
    let revisarToken;

    try {
      let tokenId= tokenIDSearch(token);
      console.log(tokenId);
      revisarToken= jwt.verify(token,process.env.TOKEN_PWD)
      req.user=revisarToken;
      
      

      
      // if(tokenid==jti){
      //   res.status(200).json({msg:'Autentificacion correcta','token':token})
      // } else if (tokenJTI!=jti){
      //   res.status(500).json({msg:"Usuario ya no esta logueado"})
      // }

    } catch (error) {
      console.log(error);
      
      res.status(401).send("Token invalido")
    }
    
    if(!revisarToken){
      res.status(401).send("No autenticado")
    }
    next()
}