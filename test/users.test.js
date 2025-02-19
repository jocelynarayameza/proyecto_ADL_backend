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
    token = response.body.token; // Guardamos el token recibido
    const decoded = jwt.decode(token);
    id_user = decoded.id_user;
    console.log("log", id_user);
    // Extraemos id_user del token
    expect(id_user).toBeDefined(); // Aseguramos que el id_user está presente
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


  // test("Eliminar a un usuario con status 200", async () => {
    
  //   if (!token || !id_user) {
  //     throw new Error("Token o id_user no disponible para la prueba");
  //   }

  //   const response = await request(app)
  //   .post("/usuarios/eliminar")
  //   .set('Authorization', `Bearer ${token}`) 
  //   .set('Content-Type', 'application/json')
  //   .set('Accept', 'application/json')

  //   console.log("Response body:", response.body); 
  //   console.log("Response status:", response.status);
  
  //   expect(response.status).toBe(200); 
  //   expect(response.body.msg).toBe('El usuario se eliminó con éxito'); 
  // })
});
