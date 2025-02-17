const pool = require('../config/database');
const jwt = require('jsonwebtoken');

exports.getProducts = async () => {
  try {
    const { rows: products } = await pool.query("SELECT * FROM products");
    console.log(products);
    return products

  } catch (error) {
    throw new Error("No se pudo obtener los productos get products");
  }
}

exports.getProductById = async (id) => {
  try {
    const query = {
      text: "SELECT * FROM products WHERE id_product = $1",
      values: [id]
    };
    const { rows: product } = await pool.query(query);

    return product[0];

  } catch (error) {
    console.log(error)
    throw new Error("No se pudo obtener el producto");
  }
}

exports.getMyProducts = async (id) => {
  try {

    const query = {
      text: "SELECT * FROM products WHERE seller = $1",
      values: [id]
    };

    const { rows: products } = await pool.query(query);
console.log(products)
    return products;
  } catch (error) {
    throw new Error("No se pudo obtener los productos del usuario");
  }
}

exports.getMyProductsById = async (idUser, idProduct) => {
  try {

    const query = {
      text: "SELECT * FROM products WHERE seller = $1 and id_product = $2",
      values: [idUser, idProduct]
    };

    const { rows: product } = await pool.query(query);

    return product[0];
  } catch (error) {
    throw new Error("No se pudo obtener los productos del usuario");
  }
}


exports.putMyProductsById = async (idUser, idProduct, dataProduct) => {
  try {
    const {product_name, product_description, product_price, product_quantity, product_photo,product_category} = dataProduct 
    const query = {
      text: `UPDATE products 
      set product_name = $3, product_description = $4, product_price = $5, product_quantity = $6, product_photo = $7, product_category = $8
      WHERE seller = $1 and id_product = $2 RETURNING *`,
      values: [idUser, idProduct, product_name, product_description, product_price, product_quantity, product_photo, product_category]
    };

    const { rows: product } = await pool.query(query);

    return product[0];
  } catch (error) {
    throw new Error("No se pudo obtener los productos del usuario");
  }
}

exports.deleteMyProductsById = async (idUser, idProduct) => {
  try {

    const query = {
      text: "DELETE FROM products WHERE seller = $1 and id_product = $2",
      values: [idUser, idProduct]
    };
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new Error("El producto no existe");
    }
    return { message: "Producto eliminado" };
  } catch (error) {
    throw new Error("No se pudo eliminar el producto");
  }
}





