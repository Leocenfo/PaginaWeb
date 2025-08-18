const { Schema, model } = require("mongoose");

const SolicitudSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email:  { type: String, required: true, trim: true, lowercase: true },
    rolSolicitado: { type: String, enum: ["moderador", "admin"], required: true },
    motivo: { type: String, required: true, trim: true },
    estado: { type: String, enum: ["pendiente", "aprobado", "rechazado"], default: "pendiente" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Para evitar duplicados de (email + rol) en estado pendiente:
SolicitudSchema.index({ email: 1, rolSolicitado: 1, estado: 1 });

module.exports = model("Solicitud", SolicitudSchema);
