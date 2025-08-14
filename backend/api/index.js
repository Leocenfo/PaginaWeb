const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Requerir rutas
const routesUsuarios = require('./Routes/routesUsuarios.js');
const routesEventos = require('./Routes/eventos');
const rutaAnuncios = require('./Routes/routesAnuncios');
const rutasZonas = require('./Routes/comunidadRuta');
const eventosRouter = require('./Routes/eventosLeo');
const rutasReporteSugerencias = require('./Routes/reporteSugerencias');
const gestionUsuariosRouter = require('./Routes/gestionUsuario'); 
const routesEmprendimientos = require('./Routes/emprendimientos.js');

const Usuario = require('./models/adminUsuarios');



// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Configuración de Express
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registrar rutas
app.use('/', routesUsuarios);
app.use('/api/eventos', routesEventos);
app.use('/api', rutaAnuncios);
app.use('/api/comunidad', rutasZonas); // << aquí se manejan las zonas
app.use('/api/eventosLeo', eventosRouter);
app.use('/api/zonas', require('./Routes/comunidadRuta')); // ← esta línea es la clave
app.use('/api/reporteSugerencias', rutasReporteSugerencias);
app.use('/api/usuarios', gestionUsuariosRouter);
app.use('/', routesEmprendimientos)


// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

Usuario.find().then(usuarios => {
  console.log('Usuarios en la base de datos:', usuarios.length);
});