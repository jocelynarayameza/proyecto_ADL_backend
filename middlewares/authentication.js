const jwt=require('jsonwebtoken');
const { tokenIDSearch } = require('../modules/users');
require('dotenv').config()

module.exports = async (req,res,next)=>{
  const authHeader=req.get('authorization');
  
  if(!authHeader){
    res.status(401).send("No autenticado, no hay JWT")}
    const token = authHeader.split(" ")[1];
    let revisarToken;
    let tokenVerify = false;
    try {
      let tokenid= await tokenIDSearch(token);
      console.log("1", tokenid);
      revisarToken= jwt.verify(token,process.env.TOKEN_PWD)
      req.user=revisarToken;
      let {jti} = jwt.decode(token)
      console.log(jwt.decode(token));
      
      console.log("2", jti);
      
      
      if(tokenid==jti){
         tokenVerify = true;
      } else if (tokenid!=jti){
        tokenVerify = false;
      }

    } catch (error) {
      console.log(error);
      
      res.status(401).send("Token invalido")
    }
    
    if(!revisarToken){
      res.status(401).send("No autenticado")
    }
    if(!tokenVerify){
      res.status(401).send("No autenticado")
    }
    next()
}