// Routes/routesAnuncios.js
const express = require('express');
const router = express.Router();
const Anuncio = require('../models/anuncios');

// Obtener todos los anuncios
router.get('/anuncios', async (req, res) => {
  try {
    const anuncios = await Anuncio.find();
    res.json(anuncios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo anuncio
router.post('/anuncios', async (req, res) => {
  try {
    const nuevo = new Anuncio(req.body);
    const anuncioGuardado = await nuevo.save();
    res.status(201).json(anuncioGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar el estado del anuncio
router.put('/anuncios/:id', async (req, res) => {
  try {
    const anuncio = await Anuncio.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!anuncio) return res.status(404).json({ message: 'No encontrado' });
    res.json(anuncio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un anuncio
router.delete('/anuncios/:id', async (req, res) => {
  try {
    const result = await Anuncio.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Anuncio eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

