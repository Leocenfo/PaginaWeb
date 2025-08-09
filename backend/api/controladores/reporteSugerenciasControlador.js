const ReporteSugerencia = require('../models/reporteSugerencias');

// Crear una nueva publicación
exports.crearPublicacion = async (req, res) => {
  try {
    const { categoria, tema, contenido, usuarioId } = req.body;

    if (!categoria || !tema || !contenido || !usuarioId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nueva = new ReporteSugerencia({ categoria, tema, contenido, usuarioId });
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error("Error al guardar publicación:", error);
    res.status(500).json({ error: 'Error al guardar publicación' });
  }
};

// Obtener todas las publicaciones
exports.obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await ReporteSugerencia.find().sort({ fecha: -1 });
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};
