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
// get para recuperar contraseña 
router.get('/getPreguntaSeguridad', async (req, res) => {
    const email = req.query.email;
    try {
        const usuario = await modelUsuarios.findOne({ email });
        if (!usuario) {
            return res.json({ mensaje: "Usuario no encontrado", usuario: null });
        }

        res.json({
            mensaje: "Usuario encontrado",
            usuario: {
                preguntaSeguridad: usuario.preguntaSeguridad,
                respuestaSeguridad: usuario.respuestaSeguridad,
                password: usuario.password
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar usuario", error });
    }
});

// GET para login
router.get('/login', async (req, res) => {
    const correo = req.query.correo;
    const contrasenna = req.query.contrasenna;

    try {
        const usuario = await modelUsuarios.findOne({ email: correo });
        // validar si el correo ha sido registrado
        if (!usuario) {
            return res.status(404).json({
                mensaje: "El correo no está registrado",
                resultado: false
            });
        }

        // validar si la contrasenna es correcta
        if (usuario.password !== contrasenna) {
            return res.status(401).json({
                mensaje: "La contraseña es incorrecta",
                resultado: false
            });
        }

        res.status(200).json({
            mensaje: "Login exitoso",
            resultado: true,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al intentar iniciar sesión",
            resultado: false,
            error
        });
    }
});



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
