const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Rutas existentes (de tu equipo)
const routesUsuarios = require('./Routes/routesUsuarios.js');
const routesEventos = require('./Routes/eventos');
const rutaAnuncios = require('./Routes/routesAnuncios');
const rutasZonas = require('./Routes/comunidadRuta');
const eventosRouter = require('./Routes/eventosLeo');
const rutasReporteSugerencias = require('./Routes/reporteSugerencias');
const gestionUsuariosRouter = require('./Routes/gestionUsuario');
const routesEmprendimientos = require('./Routes/emprendimientos.js');

const Usuario = require('./models/adminUsuarios');

// 🔹 NUEVO: rutas admin de Reportes & Sugerencias (solo require aquí)
const rutasReporteSugerenciasAdmin = require('./Routes/reporteSugerencias.admin');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de Express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registrar rutas (todo igual que tenías)
app.use('/', routesUsuarios);
app.use('/api/eventos', routesEventos);
app.use('/', rutaAnuncios);
app.use('/api/comunidad', rutasZonas);
app.use('/api/eventosLeo', eventosRouter);
app.use('/api/zonas', require('./Routes/comunidadRuta')); // lo de tu compa lo dejo tal cual
app.use('/api/reporteSugerencias', rutasReporteSugerencias);
app.use('/api/usuarios', gestionUsuariosRouter);
app.use('/', routesEmprendimientos);

// 🔹 AQUÍ va el app.use de admin (después de crear app)
app.use('/api/admin/reporteSugerencias', rutasReporteSugerenciasAdmin);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// (Solo informativo)
Usuario.find().then(usuarios => {
  console.log('Usuarios en la base de datos:', usuarios.length);
});