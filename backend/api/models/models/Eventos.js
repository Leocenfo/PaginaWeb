const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: String,
  fecha: String,
  imagen: String,
});

module.exports = mongoose.model('Evento', eventoSchema);
