const Publicacion = require('../models/Publicacion');

exports.crear = async (req, res) => {
  try {
    const { tipo, tema, contenido } = req.body;
    const pub = await Publicacion.create({
      usuarioId: req.user?._id || req.body.usuarioId || 'anon',
      usuarioNombre: req.user?.nombre || req.body.usuarioNombre || 'Usuario',
      tipo, tema, contenido, estado: 'pendiente'
    });
    res.status(201).json(pub);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.listarPublicas = async (_req, res) => {
  try {
    const pubs = await Publicacion.find({ estado: 'aprobado' }).sort({ createdAt: -1 });
    res.json(pubs);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.listarAdmin = async (req, res) => {
  try {
    const { estado = 'pendiente', page = 1, limit = 50 } = req.query;
    const q = estado ? { estado } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Publicacion.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Publicacion.countDocuments(q)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.aprobar = async (req, res) => {
  try {
    const pub = await Publicacion.findByIdAndUpdate(
      req.params.id,
      { estado: 'aprobado', moderadoPor: req.user?._id || 'admin', moderadoEn: new Date(), motivoRechazo: null },
      { new: true }
    );
    if (!pub) return res.status(404).json({ error: 'No encontrada' });
    res.json(pub);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.rechazar = async (req, res) => {
  try {
    const pub = await Publicacion.findByIdAndUpdate(
      req.params.id,
      { estado: 'rechazado', moderadoPor: req.user?._id || 'admin', moderadoEn: new Date(), motivoRechazo: req.body?.motivo || 'No especificado' },
      { new: true }
    );
    if (!pub) return res.status(404).json({ error: 'No encontrada' });
    res.json(pub);
  } catch (e) { res.status(400).json({ error: e.message }); }
};
