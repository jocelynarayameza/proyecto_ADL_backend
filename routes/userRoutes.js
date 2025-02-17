const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');


router.post("/registro",userController.registerUsers);
router.post("/login", userController.loginUsers)
router.get("/perfil", authentication, userController.getUsers);
router.put("/editar-perfil", authentication, userController.editUsers);
router.put("/editar-direccion",authentication, userController.editAddressUsers);
// router.delete("/eliminar", authentication, userController.deleteUsers);
router.get("/logout",userController.logout);


module.exports = router;
