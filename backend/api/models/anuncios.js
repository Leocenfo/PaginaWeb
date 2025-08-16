// models/anuncios.js
const mongoose = require("mongoose");

const anuncioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  tipoAnuncio: {
    type: String,
    required: [true, "El tipo de anuncio es obligatorio"],
    enum: ["servicios", "educativo", "negocio", "comunitario"],
    default: "servicios",
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  telefono: {
    type: String,
    unique: true,
    required: [true, "El teléfono es obligatorio"],
  },
  linkImagen: {
    type: String,
    required: [true, "El link de la imagen es obligatorio"],
  },
  estado: {
    type: String,
    default: "inactivo",
    enum: ["inactivo", "activo"],
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Anuncio", anuncioSchema);
