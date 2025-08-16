// backend/api/Routes/comunidadRuta.js

const express = require('express');
const router = express.Router();
const zonasControlador = require('../controladores/zonasControlador');

// Ruta base: /api/zonas/lugares
router.post('/lugares', zonasControlador.crearZona);
router.get('/lugares', zonasControlador.obtenerZonas);
router.get('/lugares/:id', zonasControlador.obtenerZonaPorId);
router.put('/lugares/:id', zonasControlador.actualizarZona);
router.delete('/lugares/:id', zonasControlador.eliminarZona);

module.exports = router;
