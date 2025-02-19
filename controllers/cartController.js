const jwt= require('jsonwebtoken');
require('dotenv').config();

const { deleteProductInCart, editProductInCart, checkProductInCart, addProductInCart, getCartFull, buyProductToOrder, deleteTotalCart } = require('../modules/cart');
const { getUser} = require('../modules/users');
const { myProductInCart } = require('../middlewares/validation');



exports.getCartController = async(req,res) =>{
try {
  let { id_user } = await getUser(req)
  let cart = await getCartFull(id_user)

  if (!cart) {
   return res.status(404).json({ msg: "No se encontró el carrito del usuario." });
  }

  if(cart.length==0){
    return res.status(401).json({msg:"Carrito esta vacio"});
  }
  res.status(200).send(cart);

} catch (error) {
  res.status(500).json({msg:"No se pudo obtener el carrito", 'error': error.message})
}
}



exports.editProductInCartController = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
    const { id_product, total_quantity } = req.body;
    const productValid = await myProductInCart(id_user, id_product);

    if (!productValid){
      return res.status(409).json({msg:"No puedes agregar al carrito un producto tuyo"});

    } else if(productValid) {
      if(total_quantity===0){
        await deleteProductInCart(id_user, id_product);
        let cart =  await getCartFull(id_user);
        res.status(200).json({msg:"Producto eliminado con éxito",'cart':cart});
  
      } else if (total_quantity===1) {
        const checkProduct = await checkProductInCart(id_user, id_product)
        
        if(checkProduct){   
          await editProductInCart(id_user, id_product, total_quantity);
          let cart =  await getCartFull(id_user);
          res.status(200).json({msg:"Producto editado con exito",'cart':cart});
  
        } else {
          await addProductInCart(id_user, id_product, total_quantity)
          let cart =  await getCartFull(id_user);
          res.status(200).json({msg:"Producto agregado con exito",'cart':cart});
        }
        
      } else {
        const checkProduct = await checkProductInCart(id_user, id_product)
        if(!checkProduct){
          res.status(409).json({msg:"Tienes que añadir el producto primero"});

        } else {
          let stock = await editProductInCart(id_user,id_product, total_quantity);
          if (stock){
            let cart =  await getCartFull(id_user);
            res.status(200).json({msg:"Producto editado con exito",'cart':cart});

          } else if(!stock){
            res.status(400).json({msg:"Sobrepasaste el stock disponible del producto"});
          }
        }
      }
    } 

  } catch (error) {
    res.status(500).send({msg:'No se pudo agregar o modificar producto del carrito', 'error': error.message});
  }  
}



exports.buyProductsToOrderController = async(req,res) =>{
  try {
    let { id_user } = await getUser(req);
    let cart = await getCartFull(id_user)
    
    if(cart.length==0){
      res.status(400).json({msg:"Carrito esta vacio"});
    } else{
      let orderConfirm = await buyProductToOrder(id_user,cart);
      
      if(orderConfirm.confirm){
        let deleteConfirm = await deleteTotalCart(id_user);

        if(deleteConfirm){
          res.status(200).json({msg:"Carrito fue comprado con éxito",'order_details':orderConfirm.order_details, 'cart':cart});
        } else {
          res.status(400).json({msg:"No se pudo borrar el carrito"});
        }
      } else {
        res.status(400).json({msg:"No se pudo enviar la orden"});
      }
    }
  } catch (error) {
    res.status(400).json({msg:"No se pudo comprar el carrito", 'error': error.message});
  } 
}

exports.deleteCartController = async (req,res) =>{
  try {
    let { id_user } = await getUser(req);
    await deleteTotalCart(id_user);
    res.status(200).json({msg:"Carrito fue vaciado con éxito"})

  } catch (error) {
    res.status(500).send({msg:'No se pudo vaciar el carrito', 'error': error.message});
  }

}

