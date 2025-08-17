const ReporteSugerencia = require('../models/reporteSugerencias');

// === Público ===

// Crear (queda PENDIENTE por defecto)
exports.crearPublicacion = async (req, res) => {
  try {
    const { categoria, tema, contenido, usuarioId } = req.body;
    if (!categoria || !tema || !contenido || !usuarioId) {
      return res.status(400).json({ ok: false, msg: 'Faltan campos' });
    }

    const doc = await ReporteSugerencia.create({
      categoria,
      tema,
      contenido,
      usuarioId,
      estado: 'pendiente',
      aprobada: false,
    });

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al crear publicación' });
  }
};

// Listar público: SOLO aprobadas (acepta 'aprobada' y 'aprobado')
// Si viene ?usuarioId=... filtra por ese usuario
exports.obtenerPublicaciones = async (req, res) => {
  try {
    const { usuarioId } = req.query;

    const query = {
      $or: [
        { estado: { $in: ['aprobada', 'aprobado'] } },
        { aprobada: true },
      ],
    };

    if (usuarioId) query.usuarioId = usuarioId;

    const docs = await ReporteSugerencia.find(query).sort({ fecha: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al listar publicaciones' });
  }
};

// === Admin ===

// Pendientes: NO incluir aprobadas ni rechazadas
exports.listarPendientes = async (_req, res) => {
  try {
    const docs = await ReporteSugerencia.find({
      $and: [
        // aún no aprobadas (o flag ausente)
        { $or: [{ aprobada: { $ne: true } }, { aprobada: { $exists: false } }] },
        // estado no es aprobado/aprobada ni rechazado/rechazada
        { $or: [{ estado: { $exists: false } }, { estado: { $nin: ['aprobado', 'aprobada', 'rechazado', 'rechazada'] } }] },
      ],
    }).sort({ fecha: 1 });

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Error al listar pendientes' });
  }
};

exports.aprobar = async (req, res) => {
  try {
    const { id } = req.params;
    await ReporteSugerencia.findByIdAndUpdate(
      id,
      { estado: 'aprobada', aprobada: true },
      { new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'No se pudo aprobar' });
  }
};

exports.rechazar = async (req, res) => {
  try {
    const { id } = req.params;
    await ReporteSugerencia.findByIdAndUpdate(
      id,
      { estado: 'rechazada', aprobada: false },
      { new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'No se pudo rechazar' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await ReporteSugerencia.findById(req.params.id).lean();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'No se pudo leer el documento' });
  }
};

// resumen rápido
exports.debugResumen = async (req, res) => {
  try {
    const { usuarioId } = req.query;
    const match = {};
    if (usuarioId) match.usuarioId = usuarioId;

    const totales = await ReporteSugerencia.aggregate([
      { $match: match },
      { $group: {
          _id: '$estado',
          total: { $sum: 1 },
          aprobadasFlag: { $sum: { $cond: [{ $eq: ['$aprobada', true] }, 1, 0] } }
      }},
      { $sort: { total: -1 } }
    ]);

    const muestras = await ReporteSugerencia.find(match)
      .sort({ fecha: -1 })
      .limit(5)
      .select('_id usuarioId estado aprobada tema categoria fecha');

    res.json({ ok:true, filtros:{usuarioId:usuarioId||null}, totales, muestras });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'debug falló' });
  }
};

// Eliminar una publicación propia
exports.eliminarPropia = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.query; // lo recibimos por query

    if (!usuarioId) {
      return res.status(400).json({ ok: false, msg: 'Falta usuarioId' });
    }

    const doc = await ReporteSugerencia.findById(id);
    if (!doc) {
      return res.status(404).json({ ok: false, msg: 'Publicación no existe' });
    }

    if (String(doc.usuarioId) !== String(usuarioId)) {
      return res.status(403).json({ ok: false, msg: 'No puedes eliminar esta publicación' });
    }

    await doc.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'No se pudo eliminar' });
  }
};
