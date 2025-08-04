// Funcion para registrar a usuarios usando axios 

// se llaman los campos que se llenan dentro del formulario en el modelo de datos
const registrarUsuario = async(pemail, ppassword, pnombre, papellido, pdireccion, ptelefono, ppregunta, prespuesta) =>{
    try {
        // configuracion de axios 
        const res = await axios({
            method:"post"
            , url: "http://localhost:3000/postUsuarios"
            , responseType: 'json'
            , data:{
                email: pemail
                , password: ppassword
                , nombre: pnombre
                , apellido: papellido
                , direccion: pdireccion
                , telefono: ptelefono
                , preguntaSeguridad: ppregunta
                , respuestaSeguridad: prespuesta
            }
        })

        console.log(res.data)

        // evaluar si la persona ya esta registrada - codigo 11000
        if(res.data.resultado == false){
            if(res.data.error == 11000){
                swal.fire({
                    title: "Error!"
                    , text: "Ya existe una cuenta con este correo"
                    , icon: "error"
                })
            } 
        }else {
                swal.fire({
                    title: "Registrado!"
                    , text: "Su usuario ha sido creado"
                    , icon: "success"
                })
            }
    
        // Recibe el callback y cierra la alerta
        setTimeout(()=>{
            closePopup("DivPopupRegistro");
            openPopup("DivPopupLogin");
        },1500)

    } catch (error) {
        swal.fire({
            title: "Error!"
            , text: "Hubo error al registrar la cuenta"
            , icon: "error"
        })
    }
}

