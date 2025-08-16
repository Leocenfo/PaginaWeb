// Menú responsive
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuCambio");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        // Abrir/cerrar menú al hacer clic en el icono
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation(); // Evita que el clic se propague y lo cierre inmediatamente
            menu.classList.toggle("active");
        });

        // Evitar que clics dentro del menú lo cierren
        menu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // Cerrar si se hace clic fuera
        document.addEventListener("click", function () {
            menu.classList.remove("active");
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorEmprendimientos");

    fetch("http://localhost:3000/emprendimientos")
        .then((response) => response.json())
        .then((emprendimientos) => {
            const activos = emprendimientos.filter((emprendimiento) => emprendimiento.estado === "activo");

            if (activos.length === 0) {
                contenedor.innerHTML = "<p>No hay emprendimientos activos actualmente.</p>";
                return;
            }

            activos.forEach((emprendimiento) => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("carta", "centro");
                tarjeta.setAttribute("data-id", emprendimiento.id);

                tarjeta.innerHTML = `
                    <div class="contenedor-imagen-carta">
                    <img src="${emprendimiento.linkImagen || 'https://cdn0.iconfinder.com/data/icons/multimedia-285/32/Multimedia-33-512.png'}" alt="Imagen del emprendimiento">
                    </div>

                    <h3 class="rojo">${emprendimiento.nomEmprendimiento}</h3>

                    <p>${emprendimiento.descripEmprendimiento || "No posee descripcion"}</p>
                    <div class="info-contacto">
                    <span>Más info:</span>
                    <a href="tel:${emprendimiento.numTel}" class="fa fa-phone"></a>
                    <span>${emprendimiento.numTel}</span>
                    </div>
                    <div class="redes-sociales">
                    ${
                        (() => {
                        const redes = emprendimiento.redesSociales;

                        if (!redes) return ""; // nada definido

                        const urls = Array.isArray(redes) ? redes : [redes]; // convertir a array si es string

                        return urls.map((url) => {
                            let iconClass = "";
                            if (url.includes("facebook.com")) iconClass = "fa fa-facebook";
                            else if (url.includes("instagram.com")) iconClass = "fa fa-instagram";
                            else if (url.includes("wa.me") || url.includes("whatsapp.com")) iconClass = "fa fa-whatsapp";
                            else iconClass = "fa fa-link";

                            return `
                            <a href="${url}" target="_blank" rel="noopener noreferrer">
                                <i class="${iconClass}"></i>
                            </a>
                            `;
                        }).join("");
                        })()
                    }
                    </div>

                `;

                contenedor.appendChild(tarjeta);
            });
        })
        .catch((error) => {
            console.error("Error al cargar emprendimientoss:", error);
            contenedor.innerHTML = "<p>Error al cargar los emprendimientos s.</p>";
        });
});