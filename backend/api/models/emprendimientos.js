const mongoose = require('mongoose')


const emprendimientoSchema = new mongoose.Schema({
    nombreCompleto: {type:String, required:true},
    correo:{type:String, required:true, unique:true},
    numTel:{type:String, required:true, unique:true},
    tipoEmprendimiento:{type:String, required:true},
    nomEmprendimiento:{type:String, required:true},
    descripEmprendimiento:{type:String, required:true},
    linkImagen: { type: String, required: true },
    redesSociales: { type: String },
    fecha: {type: Date, default: Date.now},   
    estado:{type:String, default:'inactivo', emun:['inactivo','activo'] }
})

module.exports = mongoose.model('Emprendimiento',emprendimientoSchema)
