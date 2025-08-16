    
    if (!localStorage.getItem("usuarioLogueado")) {
        console.log("No hay usuarios loggeados, devolviendo a home");
        window.location.href = "../login_vale/home_Vale.HTML";
    }
    
    document.addEventListener("DOMContentLoaded", function () {
        const btnCerrar = document.getElementById("BtnCerrarSesion");
                console.log("cerrarSesion.js cargado");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", function () {
                // Eliminar la información del usuario del localStorage
                localStorage.removeItem("usuarioLogueado");
                // Devolver al usuario a la página de inicio
                window.location.href = "../login_vale/home_Vale.HTML";
            });
        }
    });

    