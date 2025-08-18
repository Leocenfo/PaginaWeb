// backend/api/Routes/opiniones.js
const express = require('express');
const router = express.Router();
const opinionController = require('../controladores/OpinionController');

// Montado en /api/opiniones
router.get('/', opinionController.listar);
router.get('/pendientes', opinionController.listarPendientes);
router.post('/', opinionController.crear);
router.put('/:id/aprobar', opinionController.aprobar);
router.put('/:id/rechazar', opinionController.rechazar);

module.exports = router;
