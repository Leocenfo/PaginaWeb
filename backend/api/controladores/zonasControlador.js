const Zona = require('../models/Zona');

// Crear una nueva zona
exports.crearZona = async (req, res) => {
  console.log("📥 Recibiendo datos:", req.body);
  try {
    const nuevaZona = new Zona(req.body);
    await nuevaZona.save();
    res.status(201).json(nuevaZona);
  } catch (err) {
    console.error("❌ Error al guardar:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las zonas
exports.obtenerZonas = async (req, res) => {
  try {
    const zonas = await Zona.find();
    res.json(zonas);
  } catch (err) {
    console.error("❌ Error al obtener zonas:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener una zona por ID
exports.obtenerZonaPorId = async (req, res) => {
  try {
    const zona = await Zona.findById(req.params.id);
    if (!zona) {
      return res.status(404).json({ mensaje: "Zona no encontrada" });
    }
    res.json(zona);
  } catch (err) {
    console.error("❌ Error al buscar zona:", err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar una zona por ID
exports.actualizarZona = async (req, res) => {
  try {
    const zonaActualizada = await Zona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!zonaActualizada) {
      return res.status(404).json({ mensaje: "Zona no encontrada para actualizar" });
    }
    res.json(zonaActualizada);
  } catch (err) {
    console.error("❌ Error al actualizar zona:", err);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una zona por ID
exports.eliminarZona = async (req, res) => {
  try {
    const zonaEliminada = await Zona.findByIdAndDelete(req.params.id);
    if (!zonaEliminada) {
      return res.status(404).json({ mensaje: "Zona no encontrada para eliminar" });
    }
    res.json({ mensaje: "Zona eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar zona:", err);
    res.status(500).json({ error: err.message });
  }
};
