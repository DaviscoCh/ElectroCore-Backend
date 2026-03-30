const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');

router.get('/',        controller.getAll);    // con filtros opcionales
router.get('/:slug',   controller.getBySlug);

module.exports = router;