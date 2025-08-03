const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  fecha: { type: Date, required: true },
  imagen: String,
}, {
  timestamps: true // añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Evento', eventoSchema);
