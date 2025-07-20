const express = require('express');
const router = express.Router();
const { registrarCliente } = require('../controller/cliente.controller');

router.post('/regc', registrarCliente);

module.exports = router;
