const express = require('express');
const router = express.Router();
const eventosControllerLeo = require('../controladores/eventosControllerLeo');
const Evento = require('../models/EventosLeo');
console.log('Esquema cargado:', Evento.schema.obj);


// Ruta para corregir eventos sin estado
router.put('/corregir-estados', async (req, res) => {
  try {
    const result = await Evento.updateMany(
      { estado: { $exists: false } },
      { $set: { estado: 'Pendiente' } }
    );
    res.json({ message: 'Estados corregidos', result });
  } catch (error) {
    console.error('Error al corregir estados:', error);
    res.status(500).json({ error: 'No se pudieron corregir los eventos' });
  }
});
// Ruta para registrar la asistencia a un evento
router.post('/asistencia', async (req, res) => {
  const { eventoId, usuario, respuesta } = req.body;

  if (!eventoId || !usuario || !respuesta) {
    return res.status(400).json({ error: 'Datos incompletos para registrar asistencia' });
  }

  try {

    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }


    evento.asistencias = evento.asistencias || [];


    const idx = evento.asistencias.findIndex(a => a.usuario === usuario);
    if (idx >= 0) {
      evento.asistencias[idx].respuesta = respuesta;
      evento.asistencias[idx].fecha = new Date();
    } else {
      evento.asistencias.push({ usuario, respuesta, fecha: new Date() });
    }

    await evento.save();

    res.json({ message: 'Asistencia registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error interno al registrar asistencia' });
  }
});


// Obtener todos los eventos
router.get('/', eventosControllerLeo.obtenerEventos);

// Crear nuevo evento
router.post('/', eventosControllerLeo.crearEvento);

// Actualizar estado del evento
router.put('/:id/estado', eventosControllerLeo.actualizarEstadoEvento);

// Borrar el evento 
router.delete('/:id', eventosControllerLeo.borrarEvento);

router.post('/asistencia', eventosControllerLeo.registrarAsistencia);

module.exports = router;
