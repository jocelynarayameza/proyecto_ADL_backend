const { repeatOrderToCart } = require('../modules/cart.js');
const {getOrders, getOrderById} = require('../modules/orders.js')

exports.getOrdersController = async (req, res) => {
    try {
    const user = req.user;
    const userId = user.id_user; 
    const orders = await getOrders(userId);
    res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "Error interno del servidor" });
    }
}

exports.getOrderByIdController = async (req, res) => {
    try {
        const idOrder = req.params.idPedido;
        const idUser = req.user.id_user
        const order = await getOrderById(idUser, idOrder);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "Error interno del servidor" });

    }
}

exports.repeatOrderToCartController = async (req, res) => {
    try {
        const idOrder = req.params.idPedido;
        const idUser = req.user.id_user
        const response = await repeatOrderToCart(idUser, idOrder);
        res.json(response.msg);
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "Error interno del servidor" });
}}
