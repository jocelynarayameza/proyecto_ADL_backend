const {getOrders, getOrderById} = require('../modules/orders.js')
exports.getOrdersController = async (req, res) => {
    try {
    const user = req.user;
    const userId = user.id;
    const orders = await getOrders(userId);
    res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message, errormsg: "error en controller" });
    }
}

exports.getOrderByIdController = async (req, res) => {
    try {
        const idOrder = req.params.idPedido;
        const idUser = req.user.id
        const order = await getOrderById(idOrder, idUser);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message, errormsg: "error en controller" });

    }
}

