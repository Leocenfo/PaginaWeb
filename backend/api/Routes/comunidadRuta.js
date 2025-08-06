const express = require('express');
const router = express.Router();
const zonasControlador = require('../controladores/zonasControlador');

// Ruta base: /api/comunidad/lugares
router.post('/lugares', zonasControlador.crearZona);
router.get('/lugares', zonasControlador.obtenerZonas);
router.put('/lugares/:id', zonasControlador.actualizarZona);
router.delete('/lugares/:id', zonasControlador.eliminarZona);
router.get('/lugares/:id', zonasControlador.obtenerZonaPorId);



module.exports = router;

