// models/anuncios.js
const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'El autor es obligatorio'],
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es obligatorio']
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobado', 'Rechazado'],
    default: 'Pendiente'
  }
});

module.exports = mongoose.model('Anuncio', anuncioSchema);
