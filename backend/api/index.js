
// Codigo de iniciar express de https://expressjs.com/

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
const rutasPublicaciones = require('./Routes/publicaciones.js');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Configuración de Express
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/', routesUsuarios);
app.use('/api/eventos', routesEventos);
app.use('/api', rutaAnuncios);
app.use('/api/comunidad', rutasZonas);
app.use('/api', rutasPublicaciones);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`La aplicación esta corriendo en el puerto ${port}`);
});
