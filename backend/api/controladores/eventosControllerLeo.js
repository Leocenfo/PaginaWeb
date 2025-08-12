// controllers/eventosControllerLeo.js
const Evento = require('../models/EventosLeo');

//Crear un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    const { titulo, fecha } = req.body;

    if (!titulo || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos (titulo o fecha)' });
    }

    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }

    const nuevoEvento = new Evento({ titulo, fecha });
    await nuevoEvento.save();

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
};

//Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Actualizar estado del evento
exports.actualizarEstadoEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    console.log('ID recibido:', id);
    console.log('nuevoEstado recibido:', nuevoEstado);

    if (!['Pendiente', 'Aprobado', 'Rechazado'].includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const evento = await Evento.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    console.log('Evento actualizado:', evento);
    res.json(evento.toObject());
  } catch (error) {
    console.error('Error al actualizar estado del evento:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al actualizar el estado del evento' });
    }
  }
};


//Borrar evento
exports.borrarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByIdAndDelete(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado correctamente', evento });
  } catch (error) {
    console.error('Error al borrar evento:', error);
    res.status(500).json({ error: 'Error al borrar el evento' });
  }
};

//Corregir estados faltantes
exports.corregirEstados = async (req, res) => {
  try {
    const result = await Evento.updateMany(
      { estado: { $exists: false } },
      { $set: { estado: 'Pendiente' } }
    );
    res.json({ message: 'Estados corregidos', result });
  } catch (error) {
    console.error('Error al corregir estados:', error);
    res.status(500).json({ error: 'Error al corregir los estados' });
  }
};


