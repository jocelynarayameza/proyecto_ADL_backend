const jwt=require('jsonwebtoken');
require('dotenv').config()

module.exports = (req,res,next)=>{
  const authHeader=req.get('authorization');
  
  if(!authHeader){
    res.status(401).send("No autenticado, no hay JWT")}
    const token = authHeader.split(" ")[1];
    let revisarToken;

    try {
      revisarToken= jwt.verify(token,process.env.TOKEN_PWD)
    } catch (error) {
      res.status(401).send("Token invalido")
    }
    
    if(!revisarToken){
      res.status(401).send("No autenticado")
    }
    next()
}