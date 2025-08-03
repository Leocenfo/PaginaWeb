const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  eventoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true
  },
  usuario: String,
  respuesta: {
    type: String,
    enum: ['me_interesa', 'asistire', 'no_asistire'],
    required: true
  }
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);

