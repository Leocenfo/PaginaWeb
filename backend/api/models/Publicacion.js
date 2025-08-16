const { Schema, model } = require('mongoose');

const PublicacionSchema = new Schema({
  usuarioId: { type: String, required: true },
  usuarioNombre: { type: String, default: '' },
  tipo: { type: String, enum: ['Reporte','Sugerencia'], required: true },
  tema: { type: String, enum: ['deporte','arte','via_publica','seguridad','otros'], required: true },
  contenido: { type: String, required: true },

  estado: { type: String, enum: ['pendiente','aprobado','rechazado'], default: 'pendiente', index: true },
  moderadoPor: { type: String, default: null },
  moderadoEn: { type: Date, default: null },
  motivoRechazo: { type: String, default: null }
}, { timestamps: true });

PublicacionSchema.index({ createdAt: -1 });

module.exports = model('Publicacion', PublicacionSchema);
