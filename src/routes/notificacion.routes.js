const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacion.controller');
const { verificarToken } = require('../middleware/auth');

router.use(verificarToken);

router.get('/',           controller.getMisNotificaciones);
router.put('/leer-todas', controller.marcarTodasLeidas);
router.put('/:id',        controller.marcarLeida);
router.delete('/:id',     controller.eliminar);

module.exports = router;