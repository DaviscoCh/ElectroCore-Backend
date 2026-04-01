const express = require('express');
const router = express.Router();
const controller = require('../controllers/resena.controller');
const { verificarToken } = require('../middleware/auth');

// Pública — ver reseñas de un producto
router.get('/producto/:id_producto', controller.getByProducto);

// Privada — crear reseña
router.post('/producto/:id_producto', verificarToken, controller.crear);

module.exports = router;