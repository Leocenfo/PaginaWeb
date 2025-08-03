const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  eventoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true
  },
  usuario: { type: String, required: true },
  respuesta: {
    type: String,
    enum: ['me_interesa', 'asistire', 'no_asistire'],
    required: true
  }
}, {
  timestamps: true  // para createdAt y updatedAt automáticos
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
