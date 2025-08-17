const Opinion = require('../models/Opinion');

exports.list = async ({ estado } = {}) => {
  const filtro = {};
  if (estado) filtro.estado = estado;
  return Opinion.find(filtro).sort({ createdAt: -1 }).lean();
};

exports.create = async (data) => {
  // por seguridad ignoramos un estado enviado por el cliente
  const { nombre, comentario, calificacion, ruta } = data;
  return Opinion.create({ nombre, comentario, calificacion, ruta, estado: 'pendiente' });
};

exports.updateEstado = (id, estado) =>
  Opinion.findByIdAndUpdate(id, { estado }, { new: true }).lean();

exports.deleteById = async (id) => {
  const r = await Opinion.findByIdAndDelete(id).lean();
  return !!r;
};
