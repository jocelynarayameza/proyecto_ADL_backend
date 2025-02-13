const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


module.exports = () => {

    router.get('/get', function(req,res) {userController.getUsers})
    // router.post('/register',userController)
    // router.post('/login',userController)

  return router
}