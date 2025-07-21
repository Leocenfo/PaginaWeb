const express = require('express')
const modelUsuarios = require('../models/modelUsuarios.js')
const router = express.Router()
// Exportar router para que sea visible en el servidor y que se encuentre cuando se llama en el index 

//GET - recuperar
    

    // GET para recuperar lista de todos los usuarios 
        // http://localhost:3000/getListaUsuarios
    router.get('/getListaUsuarios', async (req, res) => {
        try { 
            // recuperar la lista de todos los usuarios registrados
            const listaUsuariosBD = await modelUsuarios.find()
            res.json({
                listaUsuarios:listaUsuariosBD,
                msj:"Usuarios Recuperados Exitosamente"
            })
        } catch (error) {
            res.json({
                msj:"No se logro recuperar los usuarios "
            })
        }
    })

    // GET para recuperar un usuario por ID 
        // http://localhost:3000/getUsuario

    router.get('/getUsuario', async (req, res) => {
        // definir parametro de busqueda 
        const idUsuario = req.query.id // buscar el parametro de ID

        try { 
            const usuarioBuscado = await modelUsuarios.findById(idUsuario)
            // Si la persona no existe
            if(!usuarioBuscado){
                return res.json({
                    msj:"El usuario buscado no existe",
                    resultado:"false"
                })
            }

            // si no esta vacio 
            res.json({
                ResultadoUsuarioBuscado: usuarioBuscado,    
                msj:"Usuario encontrado",
            })
        } catch (error) {
            res.json({
                msj:"Error al buscar usuario",
                resultado:"false"
            })
        }
    })



// POST - Crear registros
    // http://localhost:3000/postUsuarios

    router.post('/postUsuarios', async (req, res) => {
        // del modelo de persona, almacene el body en la variable de nuevoUsuario
        const nuevoUsuario = new modelUsuarios(req.body)
        // try catch para capturar errores
        try {
            // guardar usuario en DB
            await nuevoUsuario.save()
            console.log(nuevoUsuario)
            res.status(200).json({
                info_nuevoUsuario:nuevoUsuario,
                msj:"Usuario creado exitosamente",
                resultado:"true"
            })
        } catch (error) {
            res.status(500).json({
                msj:"Error al guardar la persona",
                error,
                resultado:false
            })
            console.error("Error al guardar el usuario:", error)
        }

    })


// PUT - Actualizar (por ID) 

    // http://localhost:3000/putUsuario

    router.put('/putUsuario', async (req, res) => {
        // definir parametro de busqueda 
        const idUsuario = req.query.id // buscar el parametro de ID
        try {
            const usuarioActualizado = await modelUsuarios.findByIdAndUpdate(idUsuario, req.body,{new:true})
            // Si la persona no existe
            if(!usuarioActualizado){
                return res.json({
                    msj:"El usuario buscado no existe",
                    resultado:"false"
                })
            }

            // si no esta vacio 
            res.json({
                ResultadoUsuarioActualizado: usuarioActualizado,    
                msj:"Usuario actualizado",
            })
        } catch (error) {
            res.json({
                msj:"Error al actualizar usuario",
                resultado:"false"
            })
        }
    })

    // DELETE - Eliminar

        // http://localhost:3000/deleteUsuarios
    router.delete('/deleteUsuarios', async (req, res) => {
        const idUsuario = req.query.id // buscar el parametro de ID

        try {
            const usuarioEliminado = await modelUsuarios.findByIdAndDelete(idUsuario)
            // Si la persona no existe
            if(!usuarioEliminado){
                return res.json({
                    msj:"El usuario buscado no existe",
                    resultado:"false"
                })
            }
            // si no esta vacio 
            res.json({
                ResultadoUsuarioEliminado: usuarioEliminado,    
                msj:"Usuario eliminado",
            })
        } catch (error) {
            res.json({
                msj:"Error al eliminar usuario",
                resultado:"false"
            })
        }
    })

// modulo para usar router 

module.exports = router
