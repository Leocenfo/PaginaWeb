const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  fecha: { type: Date, required: true },
  imagen: String,
}, {
  timestamps: true 
});

module.exports = mongoose.model('Evento', eventoSchema);
