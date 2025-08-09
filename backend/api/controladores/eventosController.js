const Evento = require('../models/Eventos');
const Asistencia = require('../models/Asistencia');

// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Crear un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    // Verificamos rol del usuario que crea el evento
    const usuario = req.user; // Suponiendo que middleware autenticó y puso el usuario en req.user
    if (!usuario || (usuario.rol !== 'empresario' && usuario.rol !== 'admin')) {
      return res.status(403).json({ error: 'No tienes permiso para crear eventos' });
    }

    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

// Registrar asistencia a un evento
exports.registrarAsistencia = async (req, res) => {
  try {
    const { eventoId, usuario, respuesta } = req.body;
    const asistencia = new Asistencia({ eventoId, usuario, respuesta });
    await asistencia.save();
    res.status(201).json({ mensaje: 'Respuesta registrada', asistencia });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

// Obtener todas las asistencias
exports.obtenerAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.find().populate('eventoId', 'titulo fecha');
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
};

// Obtener asistencias filtrando por eventoId (query param)
exports.obtenerAsistenciasPorEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const asistencias = await Asistencia.find({ eventoId }).populate('eventoId', 'titulo fecha');
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asistencias por evento' });
  }
};
