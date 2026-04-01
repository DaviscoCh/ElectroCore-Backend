const express = require('express');
const router = express.Router();
const controller = require('../../controllers/resena.controller');
const { verificarToken, verificarRol } = require('../../middleware/auth');

router.use(verificarToken);
router.use(verificarRol('admin'));

router.get('/',           controller.getPendientes);
router.put('/:id',        controller.moderarResena);

module.exports = router;