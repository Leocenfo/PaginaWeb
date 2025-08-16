const { Schema, model, Types } = require('mongoose');

const SolicitudSchema = new Schema(
  {
    solicitanteCorreo: { type: String, required: true, trim: true, lowercase: true },
    solicitanteNombre: { type: String, default: '', trim: true },
    tipo: { type: String, required: true, trim: true },          // ej: "Reporte de luminaria dañada"
    descripcion: { type: String, default: '', trim: true },
    estado: {
      type: String,
      enum: ['Pendiente', 'En revisión', 'Resuelto'],
      default: 'Pendiente'
    },
    adjuntos: { type: [String], default: [] }, // URLs si luego subes archivos
    usuarioId: { type: Types.ObjectId, ref: 'Usuario', default: null }
  },
  { timestamps: true }
);

SolicitudSchema.set('toJSON', {
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = model('Solicitud', SolicitudSchema);
