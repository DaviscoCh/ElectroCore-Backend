const express = require('express');
const router = express.Router();
const controller = require('../controllers/marca.controller');

router.get('/', controller.getAll);

module.exports = router;