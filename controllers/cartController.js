const jwt= require('jsonwebtoken');
require('dotenv').config();

const { getCart, deleteProductInCart, editProductInCart, checkProductInCart, addProductInCart, getCartFull } = require('../modules/cart');
const { getUser, getUserName } = require('../modules/users');
const { getProductById } = require('../modules/products');
const { myProductInCart } = require('../middlewares/validation');

exports.getCartController = async(req,res) =>{
try {
  let { id_user } = await getUser(req)
  let cart = await getCartFull(id_user)

  res.status(200).send(cart);

} catch (error) {
  res.status(500).json({msg:"No se pudo obtener el carrito"})
}
}



exports.editProductInCartController = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
    const { id_product, total_quantity } = req.body
    const productValid = await myProductInCart(id_user, id_product)

    if (!productValid){
      res.status(409).json({msg:"No puedes agregar al carrito un producto tuyo"})

    } else if(productValid) {
      if(total_quantity===0){
        await deleteProductInCart(id_user, id_product);
        let cart =  await getCartFull(id_user);
        res.status(200).json({msg:"Producto eliminado con éxito",'cart':cart})
  
      } else if (total_quantity===1) {
        const checkProduct = await checkProductInCart(id_user, id_product)
        
        if(checkProduct){   
          await editProductInCart(id_user, id_product, total_quantity);
          let cart =  await getCartFull(id_user);
          res.status(200).json({msg:"Producto editado con exito",'cart':cart})
  
        } else {
          await addProductInCart(id_user, id_product, total_quantity)
          let cart =  await getCartFull(id_user);
          res.status(200).json({msg:"Producto agregado con exito",'cart':cart})
        }
        
      } else {
        let stock = await editProductInCart(id_user,id_product, total_quantity);
        if (stock){
          let cart =  await getCartFull(id_user);
          res.status(200).json({msg:"Producto editado con exito",'cart':cart});

        } else if(!stock){
          res.status(400).json({msg:"Sobrepasaste el stock disponible del producto"})
        }
        
      }
    } 

  } catch (error) {
    res.status(500).send({msg:'No se pudo agregar o modificar producto del carrito'});
  }  
}


exports.buyProductsToOrders = async(req,res) =>{

}

