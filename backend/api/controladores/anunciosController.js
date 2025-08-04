const Anuncio = require('../models/anuncios'); // Usa tu modelo de Mongoose
const mongoose = require('mongoose');

// Obtener todos los anuncios
const obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.find();
    res.json(anuncios);
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({ mensaje: 'Error al obtener anuncios' });
  }
};

// Cambiar el estado de un anuncio
const cambiarEstado = async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const actualizado = await Anuncio.findByIdAndUpdate(id, { estado }, { new: true });
    if (actualizado) {
      res.json({ mensaje: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado' });
  }
};

// Eliminar un anuncio
const eliminarAnuncio = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const eliminado = await Anuncio.findByIdAndDelete(id);
    if (eliminado) {
      res.json({ mensaje: 'Anuncio eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar anuncio' });
  }
};

module.exports = {
  obtenerAnuncios,
  cambiarEstado,
  eliminarAnuncio,
};
