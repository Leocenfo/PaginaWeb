// backend/api/controladores/OpinionController.js
const Opinion = require('../models/opinion');

// GET /api/opiniones
// Por defecto: solo aprobadas (estado=aprobado)
// ?estado=todos|aprobado|pendiente|rechazado  ·  ?ruta=...
async function listar(req, res) {
  try {
    const { estado, ruta } = req.query;
    const filtro = {};

    if (!estado || estado === 'aprobado') filtro.estado = 'aprobado';
    else if (estado !== 'todos') filtro.estado = estado;

    if (ruta && ruta.trim()) filtro.ruta = { $regex: ruta.trim(), $options: 'i' };

    const items = await Opinion.find(filtro).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('Error listar opiniones:', err);
    res.status(500).send('Error al listar opiniones');
  }
}

// POST /api/opiniones  (crea en estado "pendiente")
async function crear(req, res) {
  try {
    let { nombre = '', comentario, calificacion = 5, ruta = '' } = req.body;

    nombre = String(nombre || '').trim();
    comentario = String(comentario || '').trim();
    ruta = String(ruta || '').trim();
    calificacion = Number(calificacion || 5);

    if (!comentario) return res.status(400).send('El comentario es requerido.');
    if (Number.isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      return res.status(400).send('La calificación debe estar entre 1 y 5.');
    }

    const nueva = await Opinion.create({ nombre, comentario, calificacion, ruta });
    res.status(201).json(nueva);
  } catch (err) {
    console.error('Error crear opinión:', err);
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(' | ');
      return res.status(400).send(msg);
    }
    res.status(500).send('Error al crear la opinión.');
  }
}

// GET /api/opiniones/pendientes
async function listarPendientes(req, res) {
  try {
    const { ruta } = req.query;
    const filtro = { estado: 'pendiente' };
    if (ruta && ruta.trim()) filtro.ruta = { $regex: ruta.trim(), $options: 'i' };

    const items = await Opinion.find(filtro).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('Error listar pendientes:', err);
    res.status(500).send('Error al listar pendientes');
  }
}

// PUT /api/opiniones/:id/aprobar
async function aprobar(req, res) {
  try {
    const { id } = req.params;
    const doc = await Opinion.findByIdAndUpdate(
      id,
      { estado: 'aprobado' },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).send('No existe la opinión');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'No se pudo aprobar' });
  }
}

// PUT /api/opiniones/:id/rechazar
async function rechazar(req, res) {
  try {
    const { id } = req.params;
    const doc = await Opinion.findByIdAndUpdate(
      id,
      { estado: 'rechazado' },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).send('No existe la opinión');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'No se pudo rechazar' });
  }
}

// GET /api/opiniones/:id
async function getById(req, res) {
  try {
    const doc = await Opinion.findById(req.params.id).lean();
    if (!doc) return res.status(404).send('No existe la opinión');
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'No se pudo leer el documento' });
  }
}

module.exports = { listar, crear, listarPendientes, aprobar, rechazar, getById };
