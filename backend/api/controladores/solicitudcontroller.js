const Solicitud = require("../models/Solicitud");

// POST /api/solicitudes
exports.crear = async (req, res) => {
  try {
    const { nombre, email, rolSolicitado, motivo } = req.body;
    if (!nombre || !email || !rolSolicitado || !motivo) {
      return res.status(400).json({ msg: "Faltan campos requeridos." });
    }

    // Evitar duplicado pendiente para mismo email + rol
    const existe = await Solicitud.findOne({ email, rolSolicitado, estado: "pendiente" });
    if (existe) return res.status(409).json({ msg: "Ya existe una solicitud pendiente para ese rol y email." });

    const nueva = await Solicitud.create({ nombre, email, rolSolicitado, motivo });
    res.status(201).json(nueva);
  } catch (e) {
    res.status(500).json({ msg: "Error creando solicitud", error: e.message });
  }
};

// GET /api/solicitudes?email=...
exports.listar = async (req, res) => {
  try {
    const { email } = req.query;
    const filtro = email ? { email } : {};
    const data = await Solicitud.find(filtro).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ msg: "Error listando solicitudes", error: e.message });
  }
};

// (Opcional) PATCH /api/solicitudes/:id/estado  { estado: "aprobado" | "rechazado" | "pendiente" }
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    if (!["pendiente", "aprobado", "rechazado"].includes(estado)) {
      return res.status(400).json({ msg: "Estado inválido." });
    }

    const doc = await Solicitud.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!doc) return res.status(404).json({ msg: "Solicitud no encontrada." });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ msg: "Error actualizando estado", error: e.message });
  }
};

// (Opcional) DELETE /api/solicitudes/:id
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Solicitud.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ msg: "Solicitud no encontrada." });
    res.json({ msg: "Solicitud eliminada." });
  } catch (e) {
    res.status(500).json({ msg: "Error eliminando solicitud", error: e.message });
  }
};
