const request = require("supertest");
const express = require('express');
const app = express();
app.use(express.json());


const userRoutes = require("../routes/userRoutes.js");
const server = require('../routes/cartRoutes');

app.use("/usuarios", userRoutes); 
app.use('/carrito', server);

describe ("Operaciones CRUD del carrito", () =>{
  let token;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/usuarios/iniciar-sesion") 
            .send({
                email: "test@tienda.cl", 
                password: "12341234"
            });
        token = loginResponse.body.token; 
    });

  test("Error al obtener carrito sin productos", async () =>{
    const response = await request(app)
    .get('/carrito')
    .set("Authorization",`Bearer ${token}`) 
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("Carrito esta vacio")
  })
  test("Error al agregar un producto al carrito con cantidad >1", async () => {
    const product = {
      "id_product": 7,
      "total_quantity": 10
  };

    const response = await request(app)
      .post("/carrito/editar")
      .send(product)
      .set("Authorization",`Bearer ${token}`) 
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

      console.log(response.body.msg);
      

    expect(response.body.msg).toBe("Tienes que añadir el producto primero")
});
});