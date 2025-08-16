const ReporteSugerencia = require('../models/reporteSugerencias');

// === Público ===

// Crear una nueva publicación -> queda PENDIENTE
exports.crearPublicacion = async (req, res) => {
  try {
    const { categoria, tema, contenido, usuarioId } = req.body;
    if (!categoria || !tema || !contenido || !usuarioId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nueva = new ReporteSugerencia({
      categoria, tema, contenido, usuarioId,
      estado: 'pendiente' // <- importante
    });

    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error("Error al guardar publicación:", error);
    res.status(500).json({ error: 'Error al guardar publicación' });
  }
};

// Obtener publicaciones APROBADAS (página pública)
exports.obtenerPublicaciones = async (_req, res) => {
  try {
    const publicaciones = await ReporteSugerencia
      .find({ estado: 'aprobado' })
      .sort({ fecha: -1 });
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

// === Panel de administración ===

// Listar por estado (pendiente/aprobado/rechazado) con paginación opcional
exports.listarAdmin = async (req, res) => {
  try {
    const { estado = 'pendiente', page = 1, limit = 50 } = req.query;
    const q = estado ? { estado } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      ReporteSugerencia.find(q).sort({ fecha: -1 }).skip(skip).limit(Number(limit)),
      ReporteSugerencia.countDocuments(q),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error("Error listar admin:", error);
    res.status(500).json({ error: 'Error al listar' });
  }
};

// Aprobar
exports.aprobar = async (req, res) => {
  try {
    const id = req.params.id;
    const pub = await ReporteSugerencia.findByIdAndUpdate(
      id,
      {
        estado: 'aprobado',
        moderadoPor: req.user?._id || 'admin',
        moderadoEn: new Date(),
        motivoRechazo: null
      },
      { new: true }
    );
    if (!pub) return res.status(404).json({ error: 'No encontrada' });
    res.json(pub);
  } catch (error) {
    console.error("Error aprobar:", error);
    res.status(400).json({ error: 'No se pudo aprobar' });
  }
};

// Rechazar
exports.rechazar = async (req, res) => {
  try {
    const id = req.params.id;
    const { motivo } = req.body;
    const pub = await ReporteSugerencia.findByIdAndUpdate(
      id,
      {
        estado: 'rechazado',
        moderadoPor: req.user?._id || 'admin',
        moderadoEn: new Date(),
        motivoRechazo: motivo || 'No especificado'
      },
      { new: true }
    );
    if (!pub) return res.status(404).json({ error: 'No encontrada' });
    res.json(pub);
  } catch (error) {
    console.error("Error rechazar:", error);
    res.status(400).json({ error: 'No se pudo rechazar' });
  }
};
