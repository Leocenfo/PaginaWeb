// controllers/eventosControllerLeo.js
const Evento = require('../models/EventosLeo');

//Crear un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    const { titulo, fecha, imagen } = req.body;

    if (!titulo || !fecha) {
      return res.status(400).json({ error: 'Título y fecha son obligatorios' });
    }

    const nuevoEvento = new Evento({
      titulo,
      fecha: new Date(fecha),
      imagen: imagen || '',
      estado: 'Pendiente',
      asistencias: []
    });

    await nuevoEvento.save();

    res.status(201).json({ message: 'Evento creado', evento: nuevoEvento });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error interno al crear evento' });
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
// controllers/eventosControllerLeo.js
exports.registrarAsistencia = async (req, res) => {
  try {
    const { eventoId, usuario, respuesta } = req.body;

    // Validaciones básicas
    if (!mongoose.Types.ObjectId.isValid(eventoId)) {
      return res.status(400).json({ error: 'ID de evento no válido' });
    }
    if (!usuario || !respuesta) {
      return res.status(400).json({ error: 'Usuario y respuesta son obligatorios' });
    }

    // Buscar el evento
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Buscar si el usuario ya tiene una asistencia registrada
    const asistenciaExistenteIndex = evento.asistencias.findIndex(
      a => a.usuario === usuario
    );

    if (asistenciaExistenteIndex >= 0) {
      // Actualizar la asistencia existente
      evento.asistencias[asistenciaExistenteIndex].respuesta = respuesta;
      evento.asistencias[asistenciaExistenteIndex].fecha = new Date();
    } else {
      // Agregar nueva asistencia
      evento.asistencias.push({
        usuario,
        respuesta,
        fecha: new Date()
      });
    }

    // Guardar los cambios
    const eventoActualizado = await evento.save();

    res.json({
      message: 'Asistencia registrada correctamente',
      evento: eventoActualizado
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia' });
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


