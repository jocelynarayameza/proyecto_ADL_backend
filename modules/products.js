const pool = require('../config/database');
const jwt=require('jsonwebtoken');

exports.getProducts = async () =>{
  try {
    const { rows:products } = await pool.query("SELECT * FROM products");
    console.log(products);
    return products
    
  } catch (error) {
    throw new Error("No se pudo obtener los productos");
  }
}

exports.getProductById = async (id) =>{
    try {
      const query = {
        text: "SELECT * FROM products WHERE id_product = $1",
        values: [id]};
        const { rows: product } = await pool.query(query);

      console.log(product);
      return product[0];
      
    } catch (error) {
      throw new Error("No se pudo obtener el producto");
    }
  }
  
  exports.getMyProducts = async (id) =>{
    try {
        const query = {
            text: "SELECT * FROM products WHERE seller = $1",
            values: [id]};
            const { rows: products } = await pool.query(query);
    
          console.log(products);
          return products;
    } catch (error) {
        throw new Error("No se pudo obtener el producto");
    }
  }


exports.newProduct = async (product_name, product_description, product_price, product_quantity, product_photo, product_category, id_user ) =>{
  try {
    const query = 'INSERT INTO products(product_name, product_description, product_price, product_quantity, product_photo, product_category, seller) VALUES ($1,$2,$3,$4,$5,$6,$7)';
    const values = [product_name, product_description, product_price, product_quantity, product_photo, product_category, id_user]
    const {rows} = await pool.query(query,values)
  
    return rows[0]
  } catch (error) {
    throw new Error("No se pudo agregar el nuevo producto");
  }
 
}
