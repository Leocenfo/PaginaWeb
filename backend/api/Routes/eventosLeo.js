const express = require('express');
const router = express.Router();
const eventosControllerLeo = require('../controladores/eventosControllerLeo');

// Actualizar estado del evento
router.put('/:id/estado', eventosControllerLeo.actualizarEstadoEvento);
router.get('/', eventosControllerLeo.obtenerEventos);
router.post('/', eventosControllerLeo.crearEvento);
router.put('/:id/estado', eventosControllerLeo.actualizarEstadoEvento);

module.exports = router;
