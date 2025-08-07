const Evento = require('../models/EventosLeo');

// ✅ CREAR un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    console.log('Campos del esquema Evento:', Evento.schema.obj);

    const { titulo, fecha } = req.body;

    // Validar campos obligatorios
    if (!titulo || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos (titulo o fecha)' });
    }

    // Validar formato de fecha
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: 'Fecha inválida' });
    }

    // Crear nuevo evento (Mongoose aplicará el estado: 'Pendiente' por defecto)
    const nuevoEvento = new Evento({ titulo, fecha });

    // Guardar en la base de datos
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
  console.log('Body recibido:', req.body);
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  if (!['Pendiente','Aprobado', 'Rechazado'].includes(nuevoEstado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true, runValidators: true }
    );
console.log('Evento actualizado:', eventoActualizado);
    if (!eventoActualizado) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json(eventoActualizado);
  } catch (error) {
    console.error('Error al actualizar estado del evento:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del evento' });
  }
};
// BORRAR evento por ID
exports.borrarEvento = async (req, res) => {
  const { id } = req.params;

  try {
    const eventoBorrado = await Evento.findByIdAndDelete(id);

    if (!eventoBorrado) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado correctamente', evento: eventoBorrado });
  } catch (error) {
    console.error('Error al borrar evento:', error);
    res.status(500).json({ error: 'Error al borrar el evento' });
  }
};
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


