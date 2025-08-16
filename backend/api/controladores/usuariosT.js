const Usuario = require('../models/Usuario');

// GET /api/comunidad/usuarios  (opcional: ?correo=)
exports.listar = async (req, res) => {
  try {
    const { correo } = req.query;
    const filtro = correo ? { correo: correo.toLowerCase() } : {};
    const usuarios = await Usuario.find(filtro).sort({ nombre: 1 }).lean();
    return res.json(usuarios);
  } catch (e) {
    console.error('listar usuarios:', e);
    return res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

// GET /api/comunidad/usuarios/:id
exports.obtener = async (req, res) => {
  try {
    const u = await Usuario.findById(req.params.id).lean();
    if (!u) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(u);
  } catch (e) {
    console.error('obtener usuario:', e);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// GET /api/comunidad/usuarios/by-email/:correo
exports.obtenerPorCorreo = async (req, res) => {
  try {
    const correo = req.params.correo.toLowerCase();
    const u = await Usuario.findOne({ correo }).lean();
    if (!u) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(u);
  } catch (e) {
    console.error('obtenerPorCorreo:', e);
    return res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// POST /api/comunidad/usuarios
exports.crear = async (req, res) => {
  try {
    const nuevo = await Usuario.create(req.body);
    return res.status(201).json(nuevo);
  } catch (e) {
    console.error('crear usuario:', e);
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// PUT /api/comunidad/usuarios/:id
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Usuario.findByIdAndUpdate(id, req.body, {
      new: true, runValidators: true
    }).lean();
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(actualizado);
  } catch (e) {
    console.error('actualizar usuario:', e);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// PATCH /api/comunidad/usuarios/:id/roles
exports.actualizarRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body; // array
    const actualizado = await Usuario.findByIdAndUpdate(id, { roles }, {
      new: true, runValidators: true
    }).lean();
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(actualizado);
  } catch (e) {
    console.error('actualizar roles:', e);
    return res.status(500).json({ message: 'Error al actualizar roles' });
  }
};

// DELETE /api/comunidad/usuarios/:id
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id).lean();
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ message: 'Usuario eliminado' });
  } catch (e) {
    console.error('eliminar usuario:', e);
    return res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
