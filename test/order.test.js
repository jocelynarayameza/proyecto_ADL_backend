const request = require("supertest");
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes = require("../routes/userRoutes.js");
const server = require('../routes/orderRoutes.js');

app.use("/usuarios", userRoutes); 

app.use('/pedidos', server);

describe("Operaciones CRUD de pedidos", () => {
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
    test("Debería obtener los pedidos del usuario ", async () => {
        
        const response = await request(app)
        .get('/pedidos') 
        .set("Authorization",`Bearer ${token}`) 
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); 
    });
});