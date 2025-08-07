const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobado', 'Rechazado'],
    default: 'Pendiente'
  }
},{ timestamps: true });
module.exports = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

