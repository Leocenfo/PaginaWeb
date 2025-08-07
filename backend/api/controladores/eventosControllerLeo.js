const Evento = require('../models/EventosLeo');

// ✅ CREAR un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    // Mostrar esquema para depuración
    console.log('Campos del esquema Evento:', Evento.schema.obj);

    const { titulo, fecha, estado = 'Pendiente' } = req.body;

    if (!titulo || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos (titulo o fecha)' });
    }

    // Validar fecha válida
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }

    const nuevoEvento = new Evento({ titulo, fecha, estado });
    await nuevoEvento.save();

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
};

// ✅ OBTENER todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// ✅ ACTUALIZAR estado del evento (Aprobado / Rechazado)
exports.actualizarEstadoEvento = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  if (!['Aprobado', 'Rechazado'].includes(nuevoEstado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json(eventoActualizado);
  } catch (error) {
    console.error('Error al actualizar estado del evento:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del evento' });
  }
};

