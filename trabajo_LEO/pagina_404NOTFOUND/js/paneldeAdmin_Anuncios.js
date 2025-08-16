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
  // Configurar Axios
  const api = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 5000,
  });

  const tablaBody = document.querySelector("#anunciosTable tbody");

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo) => {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.classList.add("mostrar");
    }, 100);

    setTimeout(() => {
      notificacion.classList.remove("mostrar");
      setTimeout(() => notificacion.remove(), 500);
    }, 3000);
  };

  // Función para cambiar estado
  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/anuncios/${id}/estado`, { estado });
      mostrarNotificacion(
        `Anuncio ${estado.toLowerCase()} correctamente`,
        "exito"
      );
      cargarAnuncios(); // Recargar toda la tabla para asegurar consistencia
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion(
        `Error al ${estado.toLowerCase()} el anuncio`,
        "error"
      );
    }
  };

  // Función para eliminar
  const eliminarAnuncio = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este anuncio?")) return;

    try {
      await api.delete(`/anuncios/${id}`);
      mostrarNotificacion("Anuncio eliminado correctamente", "exito");
      cargarAnuncios();
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion("Error al eliminar el anuncio", "error");
    }
  };

  // Cargar anuncios desde backend
  const cargarAnuncios = async () => {
    try {
      const response = await api.get("/anuncios");
      console.log("Datos recibidos:", response.data);

      tablaBody.innerHTML = "";

      if (response.data.length === 0) {
        tablaBody.innerHTML =
          '<tr><td colspan="6">No hay anuncios disponibles</td></tr>';
        return;
      }

      response.data.forEach((anuncio) => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", anuncio._id); // Añadir data-id a la fila
        fila.innerHTML = `
          <td>${anuncio.titulo || "Sin título"}</td>
          <td>${anuncio.tipoAnuncio || "Anónimo"}</td>
          <td>${anuncio.descripcion || "Sin descripcion"}</td>
          <td>${anuncio.telefono || "Sin telefono"}
          <td>${new Date(
            anuncio.fecha || anuncio.createdAt
          ).toLocaleDateString()}</td>
          <td class="estado">${anuncio.estado || "Pendiente"}</td>
          <td><img src="${anuncio.linkImagen}" alt="Imagen del anuncio" width=100px height100px/></td>

          <td>
            <button class="btn aceptar" data-id="${
              anuncio._id
            }">Aprobar</button>
            <button class="btn rechazar" data-id="${
              anuncio._id
            }">Rechazar</button>
            <button class="btn eliminar" data-id="${
              anuncio._id
            }">Eliminar</button>
          </td>`;
        tablaBody.appendChild(fila);
      });

      // Asignar eventos después de crear los botones
      asignarEventosBotones();
    } catch (error) {
      console.error("Error al cargar anuncios:", error);
      tablaBody.innerHTML = `<tr><td colspan="6">Error al cargar anuncios: ${error.message}</td></tr>`;
    }
  };

  // Función para asignar eventos a los botones
  const asignarEventosBotones = () => {
    document.querySelectorAll(".aceptar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        cambiarEstado(e.target.dataset.id, "activo");
      });
    });

    document.querySelectorAll(".rechazar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        cambiarEstado(e.target.dataset.id, "inactivo");
      });
    });

    document.querySelectorAll(".eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        eliminarAnuncio(e.target.dataset.id);
      });
    });
  };

  // Evento para recargar
  document
    .getElementById("recargar-anuncios")
    ?.addEventListener("click", cargarAnuncios);

  // Inicializar
  cargarAnuncios();
});
