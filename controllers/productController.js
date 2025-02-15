const { getProducts, getProductById, getMyProducts, newProduct } = require('../modules/products.js');
const { getUser } = require('../modules/users.js');


exports.getProductsController = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message, errormsg: "error en controller" });
  }
};

exports.getProductByIdController = async (req, res) => {
    try {
    const id = req.params.id;
      const product = await getProductById(id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message, errormsg: "error en controller" });
    }
  };

  exports.getMyProductsController = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id_user;
        const products = await getMyProducts(userId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message, errormsg: "error en controller" });

    }
 

  }

  exports.newProductController = async (req,res) => {

    const {id_user, name, lastname} = await getUser(req)
    const fullName = name +" "+ lastname
    console.log(fullName);
    
    let { product_name, product_description, product_price, product_quantity, product_photo, product_category } = req.body
    await newProduct(product_name, product_description, product_price, product_quantity, product_photo, product_category, id_user, fullName)
    res.status(201).json({msg:'Producto registrado satisfactoriamente'})
  }