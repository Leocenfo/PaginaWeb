const Usuario = require('../models/adminUsuarios');

//aqui es donde se nos permite obtener los usuarios y hacer los cambios de rol , estado e elimninar usuarios 

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-password'); // sin la contraseña
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Cambiar estado (activo/inactivo)
exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado }, { new: true });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};

// Cambiar rol
exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(id, { rol }, { new: true });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar rol' });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Usuario.findByIdAndDelete(id);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
