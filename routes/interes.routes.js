const express = require('express');
const router = express.Router();
const { registrarInteres } = require('../controller/interes.controller');

router.post('/registrar-interes', registrarInteres);

module.exports = router;
