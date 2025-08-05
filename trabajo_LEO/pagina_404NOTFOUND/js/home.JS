/* Controlador de homeABRIR FORMULARIOS*/

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


// Abrir popup de recuperar contraseña
document.addEventListener('DOMContentLoaded', function () {
    const linkRecuperar = document.getElementById("linkRecuperarContrasena");
    const cerrarRecuperarBtn = document.getElementById("CerrarRecuperarBtn");

    if (linkRecuperar) {
        linkRecuperar.addEventListener("click", function (e) {
            e.preventDefault();
            closePopup('DivPopupLogin')
            openPopup("DivPopupRecuperar");
        });
    }

    if (cerrarRecuperarBtn) {
        cerrarRecuperarBtn.addEventListener("click", function () {
            closePopup("DivPopupRecuperar")
            openPopup('DivPopupLogin');
        });
    }
});