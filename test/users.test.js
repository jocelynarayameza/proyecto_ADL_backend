const request = require("supertest");
const express = require('express');
const app = express();
app.use(express.json());

const server = require('../routes/userRoutes');
app.use('/usuarios', server);

describe("Operaciones CRUD de usuario", () => {

  test("Registrar un nuevo usuario con éxito con status 201", async () => {
    const newUser = {
        "email":"garnet1@tienda.cl",
        "password":"12341234",
        "username": "Garnet_tienda1",
        "name": "Garnet",
        "lastname":"von Alexandros",
        "email_confirm":"garnet1@tienda.cl",
        "password_confirm":"12341234",
        "birthday": "2020-03-06"
    };
    const response = await request(app)
      .post("/usuarios/registro")
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

      expect(response.status).toBe(201);
  });

  test("Loguear usuario con exito y status 200", async () => {
    const user = {
      "email": "garnet1@tienda.cl",
      "password": "12341234"
    };

    const response = await request(app)  
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200); 
  });


  test("Error al loguear con usuario con email invalido", async () => {
    const user = {
      "email": "test@tienda.cl",
      "password": "12341234"
    };

    const response = await request(app)  
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401)
    expect(response.body.msg).toBe('No existe el usuario'); 
  });



  test("Error al loguear con usuario con contraseña invalida", async () => {
    const user = {
      "email": "garnet1@tienda.cl",
      "password": "12341235"
    };

    const response = await request(app)  
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401)
    expect(response.body.msg).toBe('Contrasena incorrecta'); 
  });

});