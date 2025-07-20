const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controller/usuario.controller');

router.post('/registrar-usuario', registrarUsuario);

module.exports = router;
