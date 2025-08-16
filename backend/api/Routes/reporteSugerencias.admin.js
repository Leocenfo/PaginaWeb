const express = require('express');
const router = express.Router();
const controlador = require('../controladores/reporteSugerenciasControlador');
// Si tienes middlewares de auth/roles, descomenta y usa:
// const { requireAuth, requireRole } = require('../middlewares/auth');

// Ruta base admin: /api/admin/reporteSugerencias
router.get('/',
  /* requireAuth, requireRole('moderador','admin'), */
  controlador.listarAdmin
);

router.patch('/:id/aprobar',
  /* requireAuth, requireRole('moderador','admin'), */
  controlador.aprobar
);

router.patch('/:id/rechazar',
  /* requireAuth, requireRole('moderador','admin'), */
  controlador.rechazar
);

module.exports = router;

/* necesito revisar esta pagina una vez que se completen los demas pasos para el axios*/
