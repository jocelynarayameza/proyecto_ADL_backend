const express = require('express');
const app = express();
const cors = require('cors');

const routes = require('./routes/index');
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')

const orderRoutes = require('./routes/orderRoutes')
const productRoutes = require('./routes/productRoutes')

app.use(cors())
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
require('dotenv').config()

app.use('/api/usuarios',userRoutes);
app.use('/api/carrito',cartRoutes);
app.use('/api/pedidos',orderRoutes);
app.use('/api/productos',productRoutes);
app.use('/',routes);

const PORT = process.env.PORT ||3000

app.listen(PORT, () =>
  console.log(`Servidor encendido en http://localhost:${PORT}`)
);