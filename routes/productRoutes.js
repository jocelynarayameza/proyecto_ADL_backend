const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication')

