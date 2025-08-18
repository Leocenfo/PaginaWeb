const Opinion = require('../models/Opinion');

// GET /api/opiniones
// Por defecto devuelve SOLO las aprobadas (estado=aprobado)
// Opcional (para admin futuro): ?estado=todos | aprobado | pendiente | rechazado
// Filtros extra opcionales: ?ruta=...  (coincidencia parcial)
async function listar(req, res) {
  try {
    const { estado, ruta } = req.query;

    // Por defecto, solo aprobadas
    const filtro = {};
    if (!estado || estado === 'aprobado') filtro.estado = 'aprobado';
    else if (estado !== 'todos') filtro.estado = estado;

    if (ruta && ruta.trim()) {
      filtro.ruta = { $regex: ruta.trim(), $options: 'i' };
    }

    const items = await Opinion.find(filtro).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('Error listar opiniones:', err);
    res.status(500).send('Error al listar opiniones');
  }
}



// POST /api/opiniones
// Crea una opinión en estado "pendiente"
async function crear(req, res) {
  try {
    let { nombre = '', comentario, calificacion = 5, ruta = '' } = req.body;

    // Sanitizar mínimos
    nombre = (nombre || '').toString().trim();
    comentario = (comentario || '').toString().trim();
    ruta = (ruta || '').toString().trim();
    calificacion = Number(calificacion || 5);

    if (!comentario) {
      return res.status(400).send('El comentario es requerido.');
    }
    if (Number.isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      return res.status(400).send('La calificación debe estar entre 1 y 5.');
    }

    const nueva = await Opinion.create({
      nombre,
      comentario,
      calificacion,
      ruta,
      // estado queda "pendiente" por default
    });

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


async function listarPendientes(req, res) {
  try {
    const { estado, ruta } = req.query;

    // Por defecto, solo aprobadas
    const filtro = {};
    if (!estado || estado === 'aprobado') filtro.estado = 'pendiente';
    
    if (ruta && ruta.trim()) {
      filtro.ruta = { $regex: ruta.trim(), $options: 'i' };
    }

    const items = await Opinion.find(filtro).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('Error listar opiniones:', err);
    res.status(500).send('Error al listar opiniones');
  }
}

async function aprobar (req, res) {
  try {
    const { id } = req.params;
    await Opinion.findByIdAndUpdate(
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

async function rechazar  (req, res)  {
  try {
    const { id } = req.params;
    await Opinion.findByIdAndUpdate(
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

async function getById  (req, res)  {
  try {
    const doc = await Opinion.findById(req.params.id).lean();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'No se pudo leer el documento' });
  }
};

module.exports = {
  listar,
  crear,
  listarPendientes,
  aprobar,
  rechazar,
  getById,
};

