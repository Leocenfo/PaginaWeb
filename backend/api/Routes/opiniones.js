//routes/opiniones.js
const express = require('express');
const router = express.Router();
const opinionController = require('../controladores/OpinionController');

// GET /api/opiniones  (solo aprobadas por defecto)
router.get('/', opinionController.listar);
router.get("/api/admin/OpinionController/pendientes",opinionController.listarPendientes)
// POST /api/opiniones  (crea en estado pendiente)
router.post('/', opinionController.crear);

router.put(`/api/admin/OpinionController/:id/aprobar`,opinionController.aprobar)
router.put(`/api/admin/OpinionController/:id/rechazar`,opinionController.rechazar)

module.exports = router;