const express = require('express');
const router = express.Router();
const controller = require('../controllers/zona.controller');

router.get('/',                          controller.getZonas);
router.get('/sucursales',                controller.getSucursales);
router.get('/cobertura/:ciudad',         controller.verificarCobertura);

module.exports = router;