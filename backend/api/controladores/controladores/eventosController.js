const Evento = require('../models/Evento');
const Asistencia = require('../models/Asistencia');

exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

exports.crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

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
exports.obtenerEventos = (req, res) => {
  res.send('Lista de eventos');
};