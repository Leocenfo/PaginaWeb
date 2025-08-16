const { Schema, model } = require('mongoose');

const RutaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    frecuencia: { type: String, required: true, trim: true }, // ej: "cada 15 min"
    horario: { type: String, required: true, trim: true },    // ej: "5:00-22:00"
    paradas: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Debe incluir al menos una parada'
      }
    },
    activa: { type: Boolean, default: true }
  },
  { timestamps: true }
);

RutaSchema.set('toJSON', {
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = model('Ruta', RutaSchema);
