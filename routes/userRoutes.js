const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authentication = require('../middlewares/authentication')



router.post("/registro", userController.registerUsers);
router.post("/login", authentication.userController.loginUsers)
router.get("/perfil", authentication, userController.getUsers);



module.exports = router;
