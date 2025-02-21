const request = require("supertest");
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
app.use(express.json());

const server = require('../routes/userRoutes');
app.use('/usuarios', server);

describe("Operaciones CRUD de usuario", () => {
  let token;
  let id_user;

  test("Registrar un nuevo usuario con éxito con status 201", async () => {
    const newUser = {
        "email":"test@tienda.cl",
        "password":"12341234",
        "username": "test_tienda",
        "name": "Test",
        "lastname":"Test",
        "email_confirm":"test@tienda.cl",
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
      "email": "test@tienda.cl",
      "password": "12341234"
    };

    const response = await request(app)
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    token = response.body.token; 
    const decoded = jwt.decode(token);
    id_user = decoded.id_user;
    expect(id_user).toBeDefined(); 
  });


  test("Error al loguear con usuario con email invalido", async () => {
    const user = {
      "email": "test1@tienda.cl",
      "password": "12341234"
    };

    const response = await request(app)  
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404)
    expect(response.body.msg).toBe('Usuario no encontrado'); 
  });



  test("Error al loguear con usuario con contraseña invalida", async () => {
    const user = {
      "email": "test@tienda.cl",
      "password": "12341235"
    };

    const response = await request(app)  
      .post("/usuarios/iniciar-sesion")
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401)
    expect(response.body.msg).toBe('Contraseña incorrecta'); 
  });
});
