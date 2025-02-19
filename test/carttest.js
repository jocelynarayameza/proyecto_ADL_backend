const request = require("supertest");
const express = require('express');
const app = express();
app.use(express.json());

const server = require('../routes/cartRoutes');
app.use('/carrito', server);

describe ("Operaciones CRUD del carrito", () =>{

//   test("Agregar un producto al carrito", async () => {
//     const product = {
//       "id_product": 7,
//       "total_quantity": 1
//   };

//     const response = await request(app)
//       .post("/carrito/editar")
//       .send(product)
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');

//     expect(response.status).toBe(200);
// });
});