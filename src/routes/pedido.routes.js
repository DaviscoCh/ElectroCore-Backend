const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedido.controller');
const { verificarToken } = require('../middleware/auth');

router.use(verificarToken);

router.post('/',      controller.crearPedido);
router.get('/',       controller.getMisPedidos);
router.get('/:id',    controller.getDetallePedido);

module.exports = router;