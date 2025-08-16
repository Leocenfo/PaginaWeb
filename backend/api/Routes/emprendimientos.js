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
        res.json(listaEmprendimientosEnBD);

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
// PUT - Cambiar estado del emprendimiento
// http://localhost:3000/emprendimientos/:id/estado
router.put('/emprendimientos/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const emprendimiento = await Emprendimiento.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!emprendimiento) {
            return res.status(404).json({
                mensaje: "Emprendimiento no encontrado",
                resultado: "false"
            });
        }

        res.json({
            mensaje: "Estado actualizado correctamente",
            resultado: "true",
            emprendimiento
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el estado",
            error,
            resultado: "false"
        });
    }
});


//DELETE-elemina el recurso
//http://localhost:3000/eliminar
// DELETE - Eliminar emprendimiento por ID
// http://localhost:3000/emprendimientos/:id
router.delete('/emprendimientos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await Emprendimiento.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Emprendimiento no encontrado",
                resultado: "false"
            });
        }

        res.json({
            mensaje: "Emprendimiento eliminado correctamente",
            resultado: "true",
            emprendimiento_eliminado: eliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el emprendimiento",
            error,
            resultado: "false"
        });
    }
});



module.exports = router;

