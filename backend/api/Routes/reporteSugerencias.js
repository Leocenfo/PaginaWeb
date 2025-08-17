const router = require('express').Router();
const c = require('../controladores/reporteSugerenciasControlador');

// Público
router.post('/', c.crearPublicacion);
router.get('/',  c.obtenerPublicaciones);

// Debug/ID (opcional pero útil si ya lo tienes)
router.get('/_debug', c.debugResumen);
router.get('/:id',    c.getById);

// Eliminar propia
router.delete('/:id', c.eliminarPropia);

module.exports = router;
