const { getProducts, getProductById, getMyProducts, newProduct, getMyProductsById, putMyProductsById, deleteMyProductsById, filters } = require('../modules/products.js');
const { getUser } = require('../modules/users.js');


exports.getProductsController = async (req, res) => {
  try {
    const { limits = 5, page = 1 } = req.query;
    const products = await getProducts({limits, page});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });
  }
};

exports.getFiltersController = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria } = req.query;
    const filtered = await filters({ precio_min, precio_max, categoria });
    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({error: error.message, msg: "Error interno del servidor" });
  }

}

exports.getProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });
  }
};

exports.getMyProductsController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id_user;
    const products = await getMyProducts(userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });

  }
}


exports.getMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id_user;
    const productoId = req.params.idProducto

    const productUser = await getMyProductsById(userId, productoId)
    console.log(productUser)
    res.json(productUser);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });

  }
}

exports.putMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id_user;
    const productoId = req.params.idProducto
    
    const productData = await getMyProductsById(userId, productoId)
    
    const { product_name: prevName, product_description: prevDescription, product_price: prevPrice, product_quantity: prevQuantity, product_photo: prevPhoto, product_category: prevCategory } = productData
    const { product_name, product_description, product_price, product_quantity, product_photo, product_category } = req.body;

    if (product_price && isNaN(product_price)) {
      return res.status(400).json({ error: "El precio debe ser un número válido" });
    }

    if (product_quantity && isNaN(product_quantity)) {
      return res.status(400).json({ error: "La cantidad debe ser un número válido" });
    }
    
    const updatedProduct = {
      product_name: product_name || prevName,
      product_description: product_description || prevDescription,
      product_price: product_price || prevPrice,
      product_quantity: product_quantity || prevQuantity,
      product_photo: product_photo || prevPhoto,
      product_category: product_category || prevCategory
    }

    const productUser = await putMyProductsById(userId, productoId, updatedProduct)

    res.json(productUser);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });

  }
}

exports.deleteMyProductsByIdController = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id_user;
    const productoId = req.params.idProducto
    const deletedProduct = await deleteMyProductsById(userId, productoId)
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });

  }
}

exports.newProductController = async (req, res) => {
  try {
    const { id_user } = await getUser(req)

    let { product_name, product_description, product_price, product_quantity, product_photo, product_category } = req.body
    await newProduct(product_name, product_description, product_price, product_quantity, product_photo, product_category, id_user)
    res.status(201).json({ msg: 'Producto registrado satisfactoriamente' })

  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Error interno del servidor" });
  }

}
