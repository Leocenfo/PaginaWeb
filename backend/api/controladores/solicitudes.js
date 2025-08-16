const Solicitud = require('../models/Solicitud');

// GET /api/comunidad/solicitudes?correo=&estado=
exports.listar = async (req, res) => {
  try {
    const { correo, estado } = req.query;
    const filtro = {};
    if (correo) filtro.solicitanteCorreo = correo.toLowerCase();
    if (estado) filtro.estado = estado;

    const items = await Solicitud.find(filtro).sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (e) {
    console.error('listar solicitudes:', e);
    return res.status(500).json({ message: 'Error al listar solicitudes' });
  }
};

// GET /api/comunidad/solicitudes/:id
exports.obtener = async (req, res) => {
  try {
    const doc = await Solicitud.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json(doc);
  } catch (e) {
    console.error('obtener solicitud:', e);
    return res.status(500).json({ message: 'Error al obtener solicitud' });
  }
};

// POST /api/comunidad/solicitudes
exports.crear = async (req, res) => {
  try {
    const nuevo = await Solicitud.create(req.body);
    return res.status(201).json(nuevo);
  } catch (e) {
    console.error('crear solicitud:', e);
    return res.status(500).json({ message: 'Error al crear solicitud' });
  }
};

// PUT /api/comunidad/solicitudes/:id
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Solicitud.findByIdAndUpdate(id, req.body, {
      new: true, runValidators: true
    }).lean();
    if (!actualizado) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json(actualizado);
  } catch (e) {
    console.error('actualizar solicitud:', e);
    return res.status(500).json({ message: 'Error al actualizar solicitud' });
  }
};

// PATCH /api/comunidad/solicitudes/:id/estado
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'Pendiente' | 'En revisión' | 'Resuelto'
    const actualizado = await Solicitud.findByIdAndUpdate(id, { estado }, {
      new: true, runValidators: true
    }).lean();
    if (!actualizado) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json(actualizado);
  } catch (e) {
    console.error('actualizar estado:', e);
    return res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

// DELETE /api/comunidad/solicitudes/:id
exports.eliminar = async (req, res) => {
  try {
    const eliminado = await Solicitud.findByIdAndDelete(req.params.id).lean();
    if (!eliminado) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json({ message: 'Solicitud eliminada' });
  } catch (e) {
    console.error('eliminar solicitud:', e);
    return res.status(500).json({ message: 'Error al eliminar solicitud' });
  }
};
