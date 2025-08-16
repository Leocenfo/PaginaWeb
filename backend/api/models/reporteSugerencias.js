const mongoose = require('mongoose');

const reporteSugerenciaSchema = new mongoose.Schema({
  categoria: { type: String, required: true },           // 'Reporte' | 'Sugerencia' (como la estás usando)
  tema: { type: String, required: true },                 // 'arte' | 'via_publica' | 'seguridad' | 'deporte' | 'otros'
  contenido: { type: String, required: true },
  usuarioId: { type: String, required: true },
  fecha: { type: Date, default: Date.now },

  // === moderación ===
  estado: { type: String, enum: ['pendiente','aprobado','rechazado'], default: 'pendiente', index: true },
  moderadoPor: { type: String, default: null },
  moderadoEn: { type: Date, default: null },
  motivoRechazo: { type: String, default: null },
}, { timestamps: true });

reporteSugerenciaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ReporteSugerencia', reporteSugerenciaSchema);
