const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrito.controller');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas del carrito requieren autenticación
router.use(verificarToken);

router.get('/',        controller.getCarrito);
router.post('/',       controller.agregar);
router.put('/:id',     controller.actualizarCantidad);
router.delete('/:id',  controller.eliminar);
router.delete('/',     controller.vaciar);

module.exports = router;