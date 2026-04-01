const express = require('express');
const router = express.Router();
const controller = require('../controllers/favorito.controller');
const { verificarToken } = require('../middleware/auth');

router.use(verificarToken);

router.get('/',                    controller.getMisFavoritos);
router.post('/:id_producto',       controller.toggle);

module.exports = router;