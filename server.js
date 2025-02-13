const express = require('express');
const app = express();
var cors = require('cors');

const routes = require('./routes/index');
const errorHandler = require('./middlewares/corsMiddleware')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extendd: true }));
require('dotenv').config()


app.use('/',routes());


// app.use(errorHandler);

const PORT = process.env.PORT ||3000

app.listen(PORT, () =>
  console.log(`Servidor encendido en http://localhost:${PORT}`)
);