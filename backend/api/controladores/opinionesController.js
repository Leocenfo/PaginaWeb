const { Router } = require('express');
const ctrl = require('../controladores/solicitudes.controller');

const router = Router();

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.patch('/:id/estado', ctrl.cambiarEstado);

module.exports = router;
