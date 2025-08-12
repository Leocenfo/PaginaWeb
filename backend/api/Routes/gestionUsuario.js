const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  cambiarEstado,
  cambiarRol,
  eliminarUsuario
} = require('../controladores/usuariosControlador'); 

// Rutas
router.get('/', obtenerUsuarios);                 
router.put('/:id/estado', cambiarEstado);
router.put('/:id/rol', cambiarRol);
router.delete('/:id', eliminarUsuario);

module.exports = router;

