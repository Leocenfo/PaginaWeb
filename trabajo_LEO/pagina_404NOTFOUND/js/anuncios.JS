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

//Referencias al los elementos del DOM
const form = document.getElementById("formularioSolicitud");
const btnEnviar = document.getElementById("btnEnviarRegistro");

//referencias a los inputs del formulario
const input = {
    titulo: document.getElementById("titulo"),
    tipoAnuncio: document.getElementById("tipoAnuncio"),
    descripAnun: document.getElementById("descripAnun"),
    numTelAnun: document.getElementById("numTelAnun"),
    linkImagenAnun: document.getElementById("linkImagenAnun"),
};

//logica de validacion
const validations = {
    titulo: (input) =>
        /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim())
            ? true
            : "El titulo solo puede contener letras.",
    tipoAnuncio: (input) =>
        input.value !== ""
            ? true
            : "Debe seleccionar una categoría de emprendimiento.",
    descripAnun: (input) =>
    /^[\w\s.,áéíóúÁÉÍÓÚñÑ¡¿!@#$%&()*+\-:;'"/\\?]+$/.test(input.value.trim()) &&
    input.value.trim().length <= 180
        ? true
        : "Ingrese una descripción válida (máximo 180 caracteres, puede incluir letras, números y algunos caracteres especiales).",

    numTelAnun: (input) =>
        /^\d{8}$/.test(input.value.replace(/[\s-]/g, ""))
            ? true
            : "El número telefónico debe ser de 8 dígitos y solo contener números.",
    linkImagenAnun: (input) =>
        /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|.*)$/i.test(
            input.value.trim()
        )
            ? true
            : "Ingrese un enlace válido de imagen.",
};

//Funcion para mostrar u ocultar errores en el span correspondiente
const mostrarError = (input, mensaje) => {
    const errorSpan = input.nextElementSibling;
    if (mensaje) {
        input.classList.add("error");

        errorSpan.textContent = mensaje;
    } else {
        input.classList.remove("error");

        errorSpan.textContent = "";
    }
};

//Funcion principal para validar el formulario
const ValidarFormulario = () => {
    let primerError = null;

    for (const clave in validations) {
        const referenciaHTML = input[clave];
        console.log(referenciaHTML);

        if (referenciaHTML) {
            const resultado = validations[clave](referenciaHTML);
            console.log(resultado);
            if (resultado != true) {
                mostrarError(referenciaHTML, resultado);
                if (!primerError) {
                    primerError = { referenciaHTML, mensaje: resultado };
                }
            } else {
                mostrarError(referenciaHTML, null);
            }
        }
    }
    return primerError;
};

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorAnuncios");

    fetch("http://localhost:3000/anuncios")
        .then((response) => response.json())
        .then((anuncios) => {
            const activos = anuncios.filter((anuncio) => anuncio.estado === "activo");

            if (activos.length === 0) {
                contenedor.innerHTML = "<p>No hay anuncios activos actualmente.</p>";
                return;
            }

            activos.forEach((anuncio) => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("carta", "centro");
                tarjeta.setAttribute("data-id", anuncio.id);

                tarjeta.innerHTML = `
                    <div class="contenedor-imagen-carta">
                        <img src="${anuncio.linkImagen
                    }" alt="Imagen del anuncio" class="imgAnchoCompleto-m">
                    </div>
                    <h3 class="rojo">${anuncio.titulo}</h3>
                    <p>${anuncio.descripcion || "No posee descripcion"}</p>
                    <div class="info-contacto">
                    <span>Más info:</span>
                    <a href="tel:${anuncio.telefono}" class="fa fa-phone"></a>
                    <span>${anuncio.telefono}</span>
                    </div>
                `;

                contenedor.appendChild(tarjeta);
            });
        })
        .catch((error) => {
            console.error("Error al cargar anuncios:", error);
            contenedor.innerHTML = "<p>Error al cargar los anuncios.</p>";
        });
});

// Listener para el boton de "Enviar"
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const error = ValidarFormulario();

    if (error) {
        console.warn("Hay errores:", error);
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error",
        });
    } else {
        const data = {
            titulo: input.titulo.value.trim(),
            tipoAnuncio: input.tipoAnuncio.value.trim(),
            descripcion: input.descripAnun.value.trim(),
            telefono: input.numTelAnun.value.trim(),
            linkImagen: input.linkImagenAnun.value.trim(),
        };

        fetch("http://localhost:3000/anuncios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.resultado === "true") {
                    Swal.fire({
                        title: "Solicitud exitosa",
                        text: "Su solicitud ha sido enviada exitosamente",
                        icon: "success",
                    });
                    form.reset();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: result.mensaje || "No se pudo enviar la solicitud",
                        icon: "error",
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo conectar con el servidor. Intente más tarde.",
                    icon: "error",
                });
            });
    }
});
