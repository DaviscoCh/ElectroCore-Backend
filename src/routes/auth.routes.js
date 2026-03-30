const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', verificarToken, controller.me); // ruta protegida

module.exports = router;
