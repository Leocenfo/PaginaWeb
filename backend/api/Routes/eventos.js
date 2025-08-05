const express = require('express');
const router = express.Router();
const eventosController = require('../controladores/eventosController.js');

// Obtener todos los eventos
router.get('/', eventosController.obtenerEventos);

// Crear un nuevo evento
router.post('/', eventosController.crearEvento);

// Registrar asistencia a un evento
router.post('/asistencia', eventosController.registrarAsistencia);

// Obtener todas las asistencias
router.get('/asistencias', eventosController.obtenerAsistencias);


module.exports = router;
