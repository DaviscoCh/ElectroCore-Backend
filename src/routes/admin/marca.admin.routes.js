const express = require('express');
const router = express.Router();
const controller = require('../../controllers/marca.controller');
const { verificarToken, verificarRol } = require('../../middleware/auth');

router.use(verificarToken);
router.use(verificarRol('admin'));

router.post('/',     controller.create);
router.put('/:id',   controller.update);

module.exports = router;