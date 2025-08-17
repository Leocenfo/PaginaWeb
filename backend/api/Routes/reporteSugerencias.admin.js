const router = require('express').Router();
const c = require('../controladores/reporteSugerenciasControlador');

router.get('/pendientes',    c.listarPendientes);
router.patch('/:id/aprobar', c.aprobar);
router.patch('/:id/rechazar',c.rechazar);

module.exports = router;
