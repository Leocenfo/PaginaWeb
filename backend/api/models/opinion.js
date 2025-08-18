// models/Opinion.js
const mongoose = require('mongoose');

const OpinionSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true, default: '' },
    comentario: {
      type: String,
      trim: true,
      required: [true, 'El comentario es requerido'],
      minlength: [5, 'El comentario es muy corto']
    },
    calificacion: {
      type: Number,
      min: [1, 'Calificación mínima 1'],
      max: [5, 'Calificación máxima 5'],
      default: 5
    },
    ruta: { type: String, trim: true, default: '' },
    estado: {
      type: String,
      enum: ['pendiente', 'aprobado', 'rechazado'],
      default: 'pendiente'
    }
  },
  { timestamps: true }
);

// Búsquedas frecuentes
OpinionSchema.index({ estado: 1, createdAt: -1 });

module.exports = mongoose.model("Opinion", OpinionSchema)