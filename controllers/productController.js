const { getProducts, getProductById, getMyProducts, getMyProductsById, putMyProductsById, deleteMyProductsById } = require('../modules/products.js');


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
    const userId = user.id;
    const products = await getMyProducts(userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message, errormsg: "error en controller" });

  }
}


exports.getMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const productId = req.params.idProduct
    const productUser = await getMyProductsById(userId, productId)
    res.json(productUser);
  } catch (error) {
    res.status(500).json({ error: error.message, errormsg: "error en controller" });

  }
}

exports.putMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const productId = req.params.idProduct
    const productData = await getMyProductsById(userId, productId)
    const {product_name: prevName, product_description: prevDescription, product_price: prevPrice, product_quantity: prevQuantity, product_photo: prevPhoto, product_category: prevCategory} = productData
    const { product_name, product_description, product_price, product_quantity,product_photo, product_category } = req.body;
    const updatedProduct = {
      product_name: product_name || prevName,
      product_description: product_description || prevDescription,  
      product_price: product_price || prevPrice,
      product_quantity: product_quantity || prevQuantity,
      product_photo: product_photo || prevPhoto, 
      product_category: product_category || prevCategory
    }

    const productUser = await putMyProductsById(userId, productId, updatedProduct)

    res.json(productUser);
  } catch (error) {
    res.status(500).json({ error: error.message, errormsg: "error en controller" });

  }
}

exports.deleteMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const productId = req.params.idProduct
    const deletedProduct = await deleteMyProductsById(userId, productId)
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message, errormsg: "error en controller" });

  }
}