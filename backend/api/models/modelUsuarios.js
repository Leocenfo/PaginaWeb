// requerir mongoose 

const mongoose = require('mongoose')

// Esquema para crear nuevo usuario

const usuarioSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    password:{type:String, required:true},
    nombre:{type:String, required:true},
    apellido:{type:String, required:true},
    direccion:{type:String, required:true},
    telefono:{type:String, required:true},
    fechaRegistro:{type:Date, default:Date.now},
    rol:{type:String, default:'ciudadano', emun:['ciudadano','empresario','moderador','admin']},
    estado:{type:String, default:'activo', emun:['inactivo','activo'] }
})

module.exports = mongoose.model('modelUsuarios',usuarioSchema)
