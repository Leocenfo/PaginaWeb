const express = require('express');
const router = express.Router();
const eventosControllerLeo = require('../controladores/eventosControllerLeo');
const Evento = require('../models/EventosLeo'); // ✅ Importar el modelo correctamente
console.log('Esquema cargado:', Evento.schema.obj);

// Obtener todos los eventos
router.get('/', eventosControllerLeo.obtenerEventos);

// Crear nuevo evento
router.post('/', eventosControllerLeo.crearEvento);

// Actualizar estado del evento
router.put('/:id/estado', eventosControllerLeo.actualizarEstadoEvento);

// Borrar el evento 
router.delete('/:id', eventosControllerLeo.borrarEvento);  

// ✅ Ruta para corregir eventos sin estado
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

module.exports = router;
