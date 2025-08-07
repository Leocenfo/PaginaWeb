const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  titulo: String,
  fecha: Date,
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobado', 'Rechazado'],
    default: 'Pendiente'
  }
});

module.exports = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

