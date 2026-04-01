const express = require('express');
const router = express.Router();
const controller = require('../../controllers/pedido.controller');
const { verificarToken, verificarRol } = require('../../middleware/auth');

router.use(verificarToken);
router.use(verificarRol('admin'));

router.get('/',           controller.getAllPedidos);
router.put('/:id/estado', controller.updateEstado);

module.exports = router;