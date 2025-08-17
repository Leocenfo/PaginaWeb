const mongoose = require('mongoose');

const esquema = new mongoose.Schema({
  categoria: { type: String, required: true, enum: ['Reporte','Sugerencia','deporte','arte','via publica','seguridad','otros','Arte','Deporte','Vía pública','Seguridad','Otros'] },
  tema:      { type: String, required: true },
  contenido: { type: String, required: true },
  usuarioId: { type: String, required: true },

  // Campos de moderación (¡imprescindibles!)
  estado:    { type: String, enum: ['pendiente','aprobado','aprobada','rechazado','rechazada'], default: 'pendiente', index: true },
  aprobada:  { type: Boolean, default: false, index: true },

  fecha:     { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ReporteSugerencia', esquema);
