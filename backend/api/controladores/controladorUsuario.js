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

        // llamar a la funcion de servicio usuario para registrar el usuario 

        registrarUsuario(email, password, nombre, apellido, direccion, telefono)

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

// if (usuario) {
//     console.log("ID del usuario logueado:", usuario.id);
//     console.log("Nombre:", usuario.nombre);
//     // Puedes usar el ID para cargar datos personalizados
// } else {
//     // Redirigir si no está logueado
//     window.location.href = "/ruta-de-login.html";
// }
