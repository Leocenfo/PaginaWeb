
// Codigo de iniciar express de https://expressjs.com/

// Requerir dependencias
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// requerir rutas de usurarios 
const routesUsuarios = require('./Routes/routesUsuarios.js');
const routesEventos = require('./Routes/eventos');
const rutaAnuncios = require('./Routes/routesAnuncios');
const eventosRouter = require('./Routes/eventosLeo');
// Conectarse a mongoose 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar a MongoDB:', err));


// habilitar express
const app = express()

// definir puerto
const port = 3000

// habilitar cors 
app.use(cors())

// habilitar body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// cuando entre peticion por ruta personas, entonces usa la ruta de routesUsuarios
app.use('/',routesUsuarios);
app.use('/api/eventos',routesEventos);
app.use('/api', rutaAnuncios);
app.use('/api/eventosLeo', eventosRouter);

app.listen(port, () => {
  console.log(`La aplicación esta corriendo el el puerto ${port}`)
});

