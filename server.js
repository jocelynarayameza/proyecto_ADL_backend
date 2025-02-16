const express = require('express');
const app = express();
const cors = require('cors');

const routes = require('./routes/index');
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')

const orderRoutes = require('./routes/orderRoutes')
const productRoutes = require('./routes/productRoutes')
const errorHandler = require('./middlewares/corsMiddleware')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config()

app.use('/',routes);
app.use('/api/usuarios',userRoutes);
app.use('/api/carrito',cartRoutes);
// app.use('/api/orders',orderRoutes);
app.use('/api/products',productRoutes);




// app.use(errorHandler);

const PORT = process.env.PORT ||3000

app.listen(PORT, () =>
  console.log(`Servidor encendido en http://localhost:${PORT}`)
);