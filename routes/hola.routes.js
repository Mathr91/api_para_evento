// routes/generalRoutes.js
const express = require('express');
const router = express.Router();
const { saludo } = require('../controller/hola.controller');

router.get('/', saludo); // GET /api

module.exports = router;
