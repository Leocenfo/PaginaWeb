// models/EventosLeo.js
const mongoose = require('mongoose');

// En models/EventosLeo.js
const eventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  fecha: { type: Date, required: true },
  imagen: { type: String, default: '' },
  estado: { 
    type: String, 
    default: 'Pendiente',
    enum: ['Pendiente', 'Aprobado', 'Rechazado'] 
  },
  asistencias: [{
      usuario: { type: String, required: true },
      respuesta: { 
        type: String, 
        required: true,
        enum: ['me_interesa', 'asistire', 'no_asistire', 'sin_respuesta']
      },
      fecha: { type: Date, default: Date.now }
    }
  ],
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

module.exports = mongoose.models.Evento || mongoose.model('Evento', eventoSchema);


