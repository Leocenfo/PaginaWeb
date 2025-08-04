const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  fecha: String,  // Puedes usar Date si lo deseas
  estado: String
});

module.exports = mongoose.model('Anuncio', anuncioSchema);
