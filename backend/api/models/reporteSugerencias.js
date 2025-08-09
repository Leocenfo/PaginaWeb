// backend/api/models/reporteSugerencias.js
const mongoose = require('mongoose');

const reporteSugerenciaSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  tema: { type: String, required: true },
  contenido: { type: String, required: true },
  usuarioId: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReporteSugerencia', reporteSugerenciaSchema);
