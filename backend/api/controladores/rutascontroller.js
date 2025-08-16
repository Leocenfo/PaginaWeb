const Ruta = require('../models/Ruta');

// GET /api/comunidad/rutas?q=termino
exports.listarRutas = async (req, res) => {
  try {
    const { q } = req.query;
    const filtro = q
      ? {
          $or: [
            { nombre: new RegExp(q, 'i') },
            { frecuencia: new RegExp(q, 'i') },
            { horario: new RegExp(q, 'i') },
            { paradas: { $elemMatch: { $regex: q, $options: 'i' } } }
          ]
        }
      : {};

    const rutas = await Ruta.find(filtro).sort({ nombre: 1 }).lean();
    return res.json(rutas);
  } catch (err) {
    console.error('Error listarRutas:', err);
    return res.status(500).json({ message: 'Error al obtener rutas' });
  }
};

// GET /api/comunidad/rutas/:id
exports.obtenerRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id).lean();
    if (!ruta) return res.status(404).json({ message: 'Ruta no encontrada' });
    return res.json(ruta);
  } catch (err) {
    console.error('Error obtenerRuta:', err);
    return res.status(500).json({ message: 'Error al obtener ruta' });
  }
};

// POST /api/comunidad/rutas
exports.crearRuta = async (req, res) => {
  try {
    const { nombre, frecuencia, horario, paradas, activa } = req.body;
    const nueva = await Ruta.create({ nombre, frecuencia, horario, paradas, activa });
    return res.status(201).json(nueva);
  } catch (err) {
    console.error('Error crearRuta:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una ruta con ese nombre' });
    }
    return res.status(500).json({ message: 'Error al crear ruta' });
  }
};

// PUT /api/comunidad/rutas/:id
exports.actualizarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizada = await Ruta.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).lean();
    if (!actualizada) return res.status(404).json({ message: 'Ruta no encontrada' });
    return res.json(actualizada);
  } catch (err) {
    console.error('Error actualizarRuta:', err);
    return res.status(500).json({ message: 'Error al actualizar ruta' });
  }
};

// DELETE /api/comunidad/rutas/:id
exports.eliminarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Ruta.findByIdAndDelete(id).lean();
    if (!eliminada) return res.status(404).json({ message: 'Ruta no encontrada' });
    return res.json({ message: 'Ruta eliminada' });
  } catch (err) {
    console.error('Error eliminarRuta:', err);
    return res.status(500).json({ message: 'Error al eliminar ruta' });
  }
};
