/*ABRIR FORMULARIOS*/

    //funcion para abrir popups 
    function openPopup(id) {
        document.getElementById(id).style.display = 'flex';
    }
    // Event listener para abrir formulario de registro

    document.addEventListener('DOMContentLoaded', function () {
        const openBtn = document.getElementById('openRegistroBtn');

        if (openBtn) {
            openBtn.addEventListener('click', function () {
                openPopup('DivPopupRegistro');
            });
        }
    });
    // Event listener para abir formulario de inicio de sesión 

    document.addEventListener('DOMContentLoaded', function () {
        const openBtn = document.getElementById('openLoginBtn');

        if (openBtn) {
            openBtn.addEventListener('click', function () {
                openPopup('DivPopupLogin');
            });
        }
    });

/*CERRAR FORMULARIOS - Con boton de cerrar*/

    // funcion para cerrar popups
    function closePopup(id) {
        document.getElementById(id).style.display = 'none';
    }
    // Event listener para cerrar formulario de registro usando el boton de X
    document.addEventListener('DOMContentLoaded', function () {
        const closeBtn = document.getElementById('CerrarRegistroBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closePopup('DivPopupRegistro');
            });
        }
    });
    // Event listener para cerrar formulario de inicio de sesión usando el boton de X
    document.addEventListener('DOMContentLoaded', function () {
        const closeBtn = document.getElementById('CerrarLoginBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closePopup('DivPopupLogin');
            });
        }
    });

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
            TipoID: document.getElementsByName("TipoID"),
            NumeroIdentificacion: document.getElementById("NumeroIdentificacion")
        };

        const inputsLogin = {
            correo: document.getElementById("emailLogin"),
            contrasenna: document.getElementById("passwordLogin")
        };
    // logica de validación registro
        const validacionRegistro = {
            correo:(input)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? true : "El formato de correo no es valido.",
            contrasenna:(input)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?]).{8,}$/.test(input.value.trim()) ? true : "La contrasena debe ser de al menos 8 caracteres, y contener un caracter especial.",
            nombre: (input)=> /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim()) ? true : "El nombre solo puede contener letras.",
            apellido:(input)=> /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim()) ? true : "El apellido solo puede contener letras.",
            direccion:(input)=> input.value ? true : "Deber ingresar una direccion.",
            telefono:(input)=> /^\d{8}$/.test(input.value.trim()) ? true : "El telefono debe contener 8 digitos.",
        }

    // logica de validación login
        const validacionLogin = {
            correo:(input)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? true : "El formato de correo no es valido.",
            contrasenna:(input)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?]).{8,}$/.test(input.value.trim()) ? true : "La contrasena debe ser de al menos 8 caracteres, y contener un caracter especial."
        }
        
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
        console.log("Formulario válido, mostrando mensaje de éxito"); 
        Swal.fire({
            title: "Registro exitoso",
            text: "Su usuario ha sido creado exitosamente, por favor inicie sesion en la siguiente pagina.",
            icon: "success",
        });
        formRegistro.reset(); 
        closePopup("DivPopupRegistro");
        openPopup("DivPopupLogin");
    }
});

// Listener para el boton de "Iniciar Sesion"

btnEnviarLogin.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Botón de inicio clickeado"); 
    const error = validarFormularioLogin(); 
    if (error) {
        console.warn("Hay errores:", error); 
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error"
        });
    } else {
        console.log("Formulario válido, mostrando mensaje de éxito"); 
        Swal.fire({
            title: "Login exitoso",
            text: "Será redirigido a la página de anuncios comunitarios.",
            icon: "success",
            confirmButtonText: "Continuar"
        }).then(() => {
            // Redireccionar al usuario después de cerrar el modal
            window.location.href = "http://127.0.0.1:5501/trabajo_LEO/pagina_404NOTFOUND/HTML/perfiles_Tray/perfil_Tray.HTML";
        });
        formLogin.reset(); 
    }
});
