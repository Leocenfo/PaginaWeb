const express = require('express');
const app = express();

app.use(express.json());

let anuncios = [];

app.post('/anuncios', (req, res) => {
  const nuevoAnuncio = req.body;
  nuevoAnuncio.id = anuncios.length + 1;
  anuncios.push(nuevoAnuncio);
  res.status(201).json({ mensaje: 'Anuncio agregado', anuncio: nuevoAnuncio });
});

app.get('/anuncios', (req, res) => {
  res.json(anuncios);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
