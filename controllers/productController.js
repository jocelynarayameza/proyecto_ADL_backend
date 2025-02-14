const { getProducts, getProductById, getMyProducts } = require('../modules/products.js');


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