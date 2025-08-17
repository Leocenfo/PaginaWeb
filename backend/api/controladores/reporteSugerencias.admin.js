const router = require('express').Router();
const c = require('../controladores/reporteSugerenciasControlador');

// Listar SOLO pendientes (para el panel)
router.get('/pendientes', c.listarPendientes);

// Moderación
router.patch('/:id/aprobar',  c.aprobar);
router.patch('/:id/rechazar', c.rechazar);

// (Opcional) Métricas rápidas del panel
router.get('/stats/resumen', c.stats);

module.exports = router;