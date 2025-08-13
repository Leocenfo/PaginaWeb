const Anuncio = require('../models/anuncios');
const mongoose = require('mongoose');

// Crear un nuevo anuncio
const crearAnuncio = async (req, res) => {
  try {
    const { titulo, autor, contenido } = req.body;
    
    // Validación básica
    if (!titulo || !autor || !contenido) {
      return res.status(400).json({ 
        mensaje: 'Faltan campos obligatorios: título, autor o contenido' 
      });
    }

    const nuevoAnuncio = new Anuncio({
      titulo,
      autor,
      contenido,
      fecha: new Date() // Asignamos la fecha actual si no se proporciona
    });

    const anuncioGuardado = await nuevoAnuncio.save();
    res.status(201).json(anuncioGuardado);
  } catch (error) {
    console.error('Error al crear anuncio:', error);
    res.status(500).json({ mensaje: 'Error al crear anuncio', error: error.message });
  }
};

// Obtener todos los anuncios
const obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.find().sort({ createdAt: -1 }); // Ordena por fecha de creación descendente
    console.log('Anuncios encontrados:', anuncios); // Agrega este log para depuración
    res.json(anuncios);
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener anuncios',
      error: error.message 
    });
  }
};

// Cambiar el estado de un anuncio
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const anuncio = await Anuncio.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!anuncio) {
      return res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }

    res.json({ mensaje: 'Estado actualizado correctamente', anuncio });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
};

// Eliminar un anuncio
const eliminarAnuncio = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const anuncio = await Anuncio.findByIdAndDelete(id);

    if (!anuncio) {
      return res.status(404).json({ mensaje: 'Anuncio no encontrado' });
    }

    res.json({ mensaje: 'Anuncio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar anuncio', error: error.message });
  }
};

module.exports = {
  crearAnuncio,
  obtenerAnuncios,
  cambiarEstado,
  eliminarAnuncio
};