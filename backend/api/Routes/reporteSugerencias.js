const express = require('express');
const router = express.Router();
const controlador = require('../controladores/reporteSugerenciasControlador');

// Ruta base: /api/reporteSugerencias
router.post('/', controlador.crearPublicacion);
router.get('/', controlador.obtenerPublicaciones);

module.exports = router;
