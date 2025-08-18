// routes/opiniones.js
const express = require('express');
const router = express.Router();
const opinionController = require('../controladores/OpinionController');

// GET /api/opiniones  (solo aprobadas por defecto)
router.get('/', opinionController.listar);

// 🔹 Rutas ADMIN
router.get('/pendientes', opinionController.listarPendientes);
router.put('/:id/aprobar', opinionController.aprobar);
router.put('/:id/rechazar', opinionController.rechazar);

// POST /api/opiniones  (crea en estado pendiente)
router.post('/', opinionController.crear);

module.exports = router;
