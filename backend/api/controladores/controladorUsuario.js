/* Controlador de home S*/


/*VALIDACION DE FORMULARIOS*/
    //Referencias al los elementos del DOM
        // Referencias a formularios 
        const formRegistro = document.getElementById("RegistroForm");
        const formLogin = document.getElementById("LoginForm");
        // Referencias a botones de enviar formularios
        const btnEnviarRegistro = document.getElementById("btnEnviarRegistro");
        const btnEnviarLogin = document.getElementById("btnEnviarLogin");

    // Constantes para registros de información 
        const inputsRegistro = {
            email: document.getElementById("email"),
            contrasenna: document.getElementById("password"),
            nombre: document.getElementById("nombre"),
            apellido: document.getElementById("apellido"),
            direccion: document.getElementById("direccion"),
            telefono: document.getElementById("telefono"),
            preguntaSeguridad: document.getElementById("preguntaSeguridad"),
            respuestaSeguridad: document.getElementById("respuestaSeguridad")
        };

        const inputsLogin = {
            correo: document.getElementById("emailLogin"),
            contrasenna: document.getElementById("passwordLogin")
        };
    // logica de validación registro
        const validacionRegistro = {
            correo:(input)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? true : "El formato de correo no es valido.",
            contrasenna:(input)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?]).{8,}$/.test(input.value.trim()) ? true : "La contrasenna debe contener mayusculas, minusculas, un caracter especial y ser de al menos 8 caracteres",
            nombre: (input)=> /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim()) ? true : "El nombre solo puede contener letras.",
            apellido:(input)=> /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim()) ? true : "El apellido solo puede contener letras.",
            direccion:(input)=> input.value ? true : "Deber ingresar una direccion.",
            telefono:(input)=> /^\d{8}$/.test(input.value.trim()) ? true : "El telefono debe contener 8 digitos.",
            preguntaSeguridad: (input) => input.value ? true : "Debe seleccionar una pregunta de seguridad.",
            respuestaSeguridad: (input) => input.value.trim().length > 3 ? true : "La respuesta debe contener al menos 4 caracteres."   
        }

    // logica de validación login
        const validacionLogin = {
            correo:(input)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? true : "El formato de correo no es valido.",
            contrasenna:(input)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?]).{8,}$/.test(input.value.trim()) ? true : "La contrasenna debe contener mayusculas, minusculas, un caracter especial y ser de al menos 8 caracteres",}
        
    //Funcion para mostrar u ocultar errores en el span correspondiente
    const mostrarError = (input,mensaje)=>{
        const errorSpan = input.nextElementSibling;
        if(mensaje){
            input.classList.add("error");
            errorSpan.textContent = mensaje;
        }else{
            input.classList.remove('error');
            errorSpan.textContent="";
        }
    };

    //Funcion principal para validar el formulario de registro
    const validarFormularioRegistro =()=>{
        let primerError = null;

        for (const clave in validacionRegistro){
            const referenciaHTML = inputsRegistro[clave];
            console.log(referenciaHTML);

            if(referenciaHTML){
                const resultado = validacionRegistro[clave](referenciaHTML);
                console.log(resultado);
                if(resultado != true){
                    mostrarError(referenciaHTML,resultado);
                    if(!primerError){
                        primerError = {referenciaHTML,mensaje:resultado};
                    }
                }else{
                    mostrarError(referenciaHTML,null);
                }
                
            }
        }
        return primerError;
    };

    const validarFormularioLogin =()=>{
        let primerError = null;

        for (const clave in validacionLogin){
            const referenciaHTML = inputsLogin[clave];
            console.log(referenciaHTML);

            if(referenciaHTML){
                const resultado = validacionLogin[clave](referenciaHTML);
                console.log(resultado);
                if(resultado != true){
                    mostrarError(referenciaHTML,resultado);
                    if(!primerError){
                        primerError = {referenciaHTML,mensaje:resultado};
                    }
                }else{
                    mostrarError(referenciaHTML,null);
                }
                
            }
        }
        return primerError;
    };

//Listener para el boton de "Registrar"

btnEnviarRegistro.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Botón de registro clickeado"); 
    const error = validarFormularioRegistro(); 
    if (error) {
        console.warn("Hay errores:", error); 
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error"
        });
    } else {

        // funcion para enviar los datos al servidor 
            
        // obtener datos del formulario 
            const email = inputsRegistro.email.value.trim();
            const password = inputsRegistro.contrasenna.value.trim();
            const nombre = inputsRegistro.nombre.value.trim();
            const apellido = inputsRegistro.apellido.value.trim();
            const direccion = inputsRegistro.direccion.value.trim();
            const telefono = inputsRegistro.telefono.value.trim();
            const preguntaSeguridad = inputsRegistro.preguntaSeguridad.value.trim();
            const respuestaSeguridad = inputsRegistro.respuestaSeguridad.value.trim();
        // llamar a la funcion de servicio usuario para registrar el usuario 

        registrarUsuario(email, password, nombre, apellido, direccion, telefono, preguntaSeguridad, respuestaSeguridad)

        formRegistro.reset(); 
    }
});

// Listener para el boton de "Iniciar Sesion"

btnEnviarLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Botón de inicio clickeado"); 

    const error = validarFormularioLogin(); 

    if (error) {
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error"
        });
        return;
    }

    const correo = inputsLogin.correo.value.trim();
    const contrasenna = inputsLogin.contrasenna.value.trim();

    try {
        const respuesta = await loginUsuario(correo, contrasenna);

        if (!respuesta.resultado) {
            Swal.fire({
                title: "Error de inicio de sesión",
                text: respuesta.mensaje,
                icon: "error"
            });
        } else {
            const usuario = respuesta.usuario;

            // Guardar los datos del usuario en localStorage
            localStorage.setItem("usuarioLogueado", JSON.stringify({
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado
            }));

            // Mostrar en consola el usuario logueado
            console.log("Usuario logueado:", {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado
            });

            Swal.fire({
                title: "Login exitoso",
                text: "Será redirigido a la página de anuncios comunitarios.",
                icon: "success",
                confirmButtonText: "Continuar"
            }).then(() => {
                window.location.href = "http://127.0.0.1:5501/trabajo_LEO/pagina_404NOTFOUND/HTML/perfiles_Tray/perfil_Tray.HTML";
            });

            formLogin.reset(); 
        }

    } catch (error) {
        console.error("Error en login:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al iniciar sesión.",
            icon: "error"
        });
    }
});

// Funcion para recuperar usuario actual en el local storage: 


// const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

// Función de utilidad para traducir claves a preguntas legibles
function obtenerTextoPregunta(valor) {
    switch (valor) {
        case "escuela":
            return "¿En qué escuela cursaste el primer grado?";
        case "mascota":
            return "¿Cómo se llama/llamaba tu primera mascota?";
        case "amigo":
            return "¿Cuál es el nombre completo de tu mejor amigo de la infancia?";
        default:
            return "Pregunta desconocida";
    }
}


// funcion para recuperar contrasenna 
document.getElementById("formRecuperar").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("emailRecuperar").value.trim();

    try {
        const respuesta = await axios.get("http://localhost:3000/getPreguntaSeguridad", {
            params: { email }
        });

        const contenedorPregunta = document.getElementById("pasoPregunta");
        const contenedorCorreo = document.getElementById("pasoCorreo");

        if (!respuesta.data.usuario) {
            // Usar Swal para error
            Swal.fire({
                icon: 'error',
                title: 'Correo no encontrado',
                text: 'El correo ingresado no está registrado en el sistema.'
            });
            return;
        }

        // Ocultar paso 1 y mostrar paso 2
        contenedorCorreo.style.display = "none";
        contenedorPregunta.style.display = "block";

        const preguntaTexto = obtenerTextoPregunta(respuesta.data.usuario.preguntaSeguridad);

        contenedorPregunta.innerHTML = `
            <p><strong>${preguntaTexto}</strong></p>
            <input type="text" class="margen" id="respuestaIngresada" placeholder="Respuesta" required>
            <button type="button" class="BaseVerde" id="btnVerificarRespuesta">Verificar</button>
        `;

        document.getElementById("btnVerificarRespuesta").addEventListener("click", function () {
            const respuestaUsuario = document.getElementById("respuestaIngresada").value.trim().toLowerCase();
            const respuestaCorrecta = respuesta.data.usuario.respuestaSeguridad.trim().toLowerCase();

            if (respuestaUsuario === respuestaCorrecta) {
                mostrarPasoResultado(respuesta.data.usuario.password);
                contenedorPregunta.style.display = "none";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Respuesta incorrecta',
                    text: 'La respuesta a la pregunta de seguridad no coincide.'
                });
            }
        });

    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Ocurrió un problema al consultar el servicio. Inténtalo más tarde.'
        });
    }
});

function mostrarPasoResultado(contrasenna) {
    const contenedorResultado = document.getElementById("pasoResultado");
    contenedorResultado.style.display = "block";
    contenedorResultado.innerHTML = `
        <p >Tu contraseña es: <strong>${contrasenna}</strong></p>
        <button class="BaseAzul" id="btnVolverLogin">Volver a Login</button>
    `;

    document.getElementById("btnVolverLogin").addEventListener("click", function () {
        closePopup("DivPopupRecuperar");
        openPopup("DivPopupLogin");
        resetRecuperacion();
    });
}

function resetRecuperacion() {
    document.getElementById("formRecuperar").reset();
    document.getElementById("pasoCorreo").style.display = "block";
    document.getElementById("pasoPregunta").style.display = "none";
    document.getElementById("pasoResultado").style.display = "none";
}
