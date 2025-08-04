const Zona = require('../models/Zona');

// Crear zona
exports.crearZona = async (req, res) => {
  try {
    const nuevaZona = new Zona(req.body);
    await nuevaZona.save();
    res.status(201).json(nuevaZona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las zonas
exports.obtenerZonas = async (req, res) => {
  try {
    const zonas = await Zona.find();
    res.json(zonas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar zona
exports.actualizarZona = async (req, res) => {
  try {
    const zona = await Zona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(zona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar zona
exports.eliminarZona = async (req, res) => {
  try {
    await Zona.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Zona eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Obtener una sola zona por ID
exports.obtenerZonaPorId = async (req, res) => {
  try {
    const zona = await Zona.findById(req.params.id);
    if (!zona) {
      return res.status(404).json({ mensaje: 'Zona no encontrada' });
    }
    res.json(zona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};