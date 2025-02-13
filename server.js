const express = require('express');
const app = express();
var cors = require('cors');

const port = 3000;
const routes = require('./routes/index');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extendd: true }));
app.use('/',routes());



app.listen(port,() => console.log('Servidor encendido'));