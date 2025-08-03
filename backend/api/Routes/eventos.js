const express = require('express');
const router = express.Router();
const eventosController = require('../../controladores/eventosController');

router.get('/', eventosController.obtenerEventos);
router.post('/', eventosController.crearEvento);
router.post('/asistencia', eventosController.registrarAsistencia);

module.exports = router;

router.get('/', eventosController.obtenerEventos);

module.exports = router;