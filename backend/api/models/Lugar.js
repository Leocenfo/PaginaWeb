const mongoose = require('mongoose');

const lugarSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: String, required: true },
  comentario: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lugar', lugarSchema);
