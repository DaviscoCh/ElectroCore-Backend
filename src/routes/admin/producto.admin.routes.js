const express = require('express');
const router = express.Router();
const controller = require('../../controllers/producto.controller');
const { verificarToken, verificarRol } = require('../../middleware/auth');

// Todas las rutas admin requieren token + rol admin
router.use(verificarToken);
router.use(verificarRol('admin'));

router.post('/',        controller.create);
router.put('/:id',      controller.update);
router.delete('/:id',   controller.remove);

module.exports = router;