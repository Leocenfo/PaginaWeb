document.addEventListener("DOMContentLoaded", function () {
    console.log("Inició Validacion de permisos");

    // se obtiene la informacion del usuario del storage 
    const usuarioLogueadoStr = localStorage.getItem("usuarioLogueado");
    let usuarioLogueado = null;

    try {
        usuarioLogueado = usuarioLogueadoStr ? JSON.parse(usuarioLogueadoStr) : null;
    } catch (e) {
        console.error("No se pudo parsear usuarioLogueado:", e);
    }
    
    //seleccionar la seccion del main que vamos a bloquear 
    const main = document.querySelector("main");

    // si el usuario no esta logeado devolvemos a home 
    if (!usuarioLogueado) {
        window.location.href = "../login_vale/home_Vale.HTML";
        return;
    }

    // si el usuario no es admin, entonces bloqueamos acceso 
    if (usuarioLogueado.rol !== "admin") {
        // imprimimos el rol del usuario actual
        console.warn(`Usuario con rol "${usuarioLogueado.rol}" no tiene acceso`);

        // Crear un overlay que cubre todo el main
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "#FFFF";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = 999;
        overlay.innerHTML = `
            <h2>No cuenta con acceso</h2>
            <p>Por favor contacte al administrador para obtener permisos.</p>
        `;

        // Agregar overlay sin borrar el main
        main.style.position = "relative";
        main.appendChild(overlay);
    }
});