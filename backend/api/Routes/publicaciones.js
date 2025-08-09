const express = require('express');
const router = express.Router();
const Publicacion = require('../models/Publicacion');

// POST /api/publicaciones
router.post('/publicaciones', async (req, res) => {
  const { categoria, tema, contenido, usuarioId } = req.body;

  // Validación
  if (!categoria || !tema || !contenido || !usuarioId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o usuarioId' });
  }

  try {
    const nueva = new Publicacion({ categoria, tema, contenido, usuarioId });
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error("Error al guardar publicación:", error);
    res.status(500).json({ error: 'Error al guardar publicación' });
  }
});

// GET /api/publicaciones
router.get('/publicaciones', async (req, res) => {
  try {
    const publicaciones = await Publicacion.find().sort({ fecha: -1 });
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

module.exports = router;