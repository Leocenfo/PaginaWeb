// routes/routesAnuncios.js
const express = require('express');
const router = express.Router();
const {
  crearAnuncio,
  obtenerAnuncios,
  cambiarEstado,
  eliminarAnuncio
} = require('../controladores/anunciosController');

// Rutas para anuncios
router.get('/anuncios', obtenerAnuncios);
router.post('/anuncios', crearAnuncio);
router.put('/anuncios/:id/estado', cambiarEstado);
router.delete('/anuncios/:id', eliminarAnuncio);

module.exports = router;


