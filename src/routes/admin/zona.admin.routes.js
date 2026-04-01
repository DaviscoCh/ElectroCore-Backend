const express = require('express');
const router = express.Router();
const controller = require('../../controllers/zona.controller');
const { verificarToken, verificarRol } = require('../../middleware/auth');

router.use(verificarToken);
router.use(verificarRol('admin'));

router.get('/',              controller.getZonasAdmin);
router.post('/',             controller.crearZona);
router.put('/:id',           controller.actualizarZona);
router.post('/sucursales',   controller.crearSucursal);

module.exports = router;