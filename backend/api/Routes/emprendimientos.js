const express = require('express')
const Emprendimiento = require('../models/emprendimientos')
const router = express.Router()

//GET-recuperar info
//Recupera toda la informacion de la BD
//http://localhost:3000/emprendimientos
router.get('/emprendimientos',async(req,res)=>{

    try {
        const listaEmprendimientosEnBD = await Emprendimiento.find()
        if(listaEmprendimientosEnBD === null){
            return res.status(404).json({
                mensaje:"Emprendimientos no encontrados!",
                resultado:"false"
            })
        }
        res.json({
            lista_emprendimiento:listaEmprendimientosEnBD,
            mensaje:"Emprendimientos recuperados exitosamente"
        })
    } catch (error) {
        res.json({
            mensaje:"Ocurrio un error",
            error
        })
    }

})

//GET
//Buscar a un emprendimiento en especifico
//http://localhost:3000/emprendimiento-id
router.get('/buscar', async(req, res)=>{

    //definir el parametro de busqueda
    const id_busqueda = req.query.id

    try {
        const emprendimientoBuscado = await Emprendimiento.findById(id_busqueda)
        if(!emprendimientoBuscado){ //si el emprendimiento no existe
           return res.json({
                mensaje:"Emprendimiento no existe!",
                resultado:"false"
            })
        }
        //si emprendimientoBuscado no esta vacio
        res.json({
            emprendimiento_buscado:emprendimientoBuscado,
            mensaje:"Emprendimiento encontrado"
        })

    } catch (error) {
        res.json({
            mensaje:"Ocurrio un error",
            error
        })
    }

})

//POST-crear recursos nuevos
//http://localhost:3000/solicitud
router.post('/solicitud', async (req,res)=>{

    console.log(req)

    const nuevoEmprendimiento = new Emprendimiento(req.body)
    
    try {

        await nuevoEmprendimiento.save()
        
            res.json({
                emprendimiento: nuevoEmprendimiento,
                mensaje: "Emprendimiento creado exitosamente",
                resultado: "true"
            });
        
    } catch (error) {
        res.status(500).json({
            mensaje:"No se pudo grabar el emprendimiento, ocurrio un error",
            error,
            resultado:"false"
        })
    }

})

//PUT-actualiza recursos existentes
//http://localhost:3000/actualizar
router.put('/actualizar',async(req,res)=>{

    //encontrar el emprendimiento a actualizar
    const id_busqueda = req.query.id
    console.log(id_busqueda)

    try {
        const emprendimientoActualizado = await Emprendimiento.findByIdAndUpdate(id_busqueda, req.body, {new:true})
        //si el emprendimiento no existe
        if(!emprendimientoActualizado){
            return res.json({
                msj:"Emprendimiento no existe"
            })
        }

        //si el emprendimiento si existe
        res.json({
            emprendimiento_actualizado:emprendimientoActualizado,
            mensaje:"Informacion actualizada exitosamente",
            resultado:"true"
        })
    } catch (error) {
        res.json({
            mensaje:"Ocurrio un error",
            error
        })
    }
    

})

//DELETE-elemina el recurso
//http://localhost:3000/eliminar
router.delete('/eliminar',async(req,res)=>{

    try {
        const emprendimientoEliminado = await Emprendimiento.findByIdAndDelete(req.query.id)
        if(!emprendimientoEliminado){
            return res.json({
                mensaje:"El emprendimiento no existe"
            })
        }

        res.json({
            emprendimiento_eliminado:emprendimientoEliminado,
            mensaje:"Emprendimiento eliminado exitosamente"
        })

    } catch (error) {
        res.json({
            mensaje:"No se pudo eliminar el emprendimiento, ocurrio un error",
            error
        })
    }

})

//endpoint filtrar por fecha
//http://localhost:3000/filtrarfecha
// router.get('/filtrarfecha', async(req,res)=>{
//     try {
        
//         //crear un rango de fechas
//         const fecha = req.query.fecha
//         const desde = req.query.desde
//         const hasta = req.query.hasta

//         //inicilizar un filtro
//         let filtro={}

//         //si especificamos una fecha exacta (2025-06-27)
//         if(fecha){
//             const dia = new Date(fecha)
//             const siguienteDia = new Date(dia)
//             siguienteDia.setDate(siguienteDia.getDate()+1)

//             filtro.fechaRegistro = {$gte:dia, $lt:siguienteDia}
//         }
//         else if(desde || hasta){
//             filtro.fechaRegistro ={}
//             if(desde){
//                 filtro.fechaRegistro.$gte = new Date(desde)
//             }
//             if(hasta){
//                 filtro.fechaRegistro.$lte = new Date(hasta)
//             }
//         }

//         console.log(filtro)

//         const lista_personas_filtradas = await Persona.find(filtro)

//         res.json({
//             mensaje:"Personas recuperadas",
//             lista:lista_personas_filtradas
//         })
//     } catch (error) {
//         res.json({
//             msj:"Ocurrio un error",
//             error
//         })
//     }
// })


module.exports = router;

