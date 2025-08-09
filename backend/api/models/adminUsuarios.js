const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  password: String,
  direccion: String,
  telefono: String,
  preguntaSeguridad: String,
  respuestaSeguridad: String,
  rol: {
    type: String,
    enum: ['admin', 'moderador', 'ciudadano', 'emprendedor'],
    default: 'ciudadano'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'inactivo'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'modelusuarios');
