const Anuncio = require("../models/anuncios");
const mongoose = require("mongoose");

// Crear un nuevo anuncio
const crearAnuncio = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios",
        resultado: "false",
      });
    }

    const nuevoAnuncio = new Anuncio(req.body);
    console.log(nuevoAnuncio);
    const anuncioGuardado = await nuevoAnuncio.save();

    res.json({
      anuncio: anuncioGuardado,
      mensaje: "Emprendimiento creado exitosamente",
      resultado: "true",
    });

  } catch (error) {
    console.error("Error al crear anuncio:", error);

    if (error.code === 11000 && error.keyPattern?.telefono) {
      return res.status(400).json({
        mensaje: "El número de teléfono ya está registrado",
        campo: "telefono",
        resultado: "false",
      });
    }

    res.status(500).json({
      mensaje: "Error al crear anuncio",
      error: error.message,
      resultado: "false",
    });
  }
};


// Obtener todos los anuncios
const obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.find().sort({ createdAt: -1 }); // Ordena por fecha de creación descendente
    console.log("Anuncios encontrados:", anuncios); // Agrega este log para depuración
    res.json(anuncios);
  } catch (error) {
    console.error("Error al obtener anuncios:", error);
    res.status(500).json({
      mensaje: "Error al obtener anuncios",
      error: error.message,
    });
  }
};

// Cambiar el estado de un anuncio
const cambiarEstado = async (req, res) => {
  const {id}  = req.params;
  const { estado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    const anuncio = await Anuncio.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!anuncio) {
      return res.status(404).json({ mensaje: "Anuncio no encontrado" });
    }

    res.json({ mensaje: "Estado actualizado correctamente", anuncio });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar estado", error: error.message });
  }
};

// Eliminar un anuncio
const eliminarAnuncio = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    const anuncio = await Anuncio.findByIdAndDelete(id);

    if (!anuncio) {
      return res.status(404).json({ mensaje: "Anuncio no encontrado" });
    }

    res.json({ mensaje: "Anuncio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar anuncio:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar anuncio", error: error.message });
  }
};

module.exports = {
  crearAnuncio,
  obtenerAnuncios,
  cambiarEstado,
  eliminarAnuncio,
};
