const request = require("supertest");
const express = require('express');
const app = express();
app.use(express.json());

const server = require('../routes/productRoutes.js');
app.use('/productos', server);

describe("Operaciones CRUD de producto", () => {
    test("Debería obtener un producto por id de tipo objeto", async () => {
        const response = await request(app).get('/productos/1');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});