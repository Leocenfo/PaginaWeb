const mongoose = require('mongoose');
const fs = require('fs');
const Anuncio = require('./models/anuncios');  // ajusta la ruta si es necesario

// Carga las variables de entorno
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Conectado a MongoDB');

  const data = fs.readFileSync('./data/anuncios.json', 'utf8');
  const anuncios = JSON.parse(data);

  // Borrar anuncios actuales
  await Anuncio.deleteMany({});

  // Insertar anuncios desde JSON
  await Anuncio.insertMany(anuncios);

  console.log('Anuncios importados con éxito');
  mongoose.disconnect();
})
.catch(err => {
  console.error('Error:', err);
});
