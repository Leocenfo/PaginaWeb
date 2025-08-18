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

  const tablaBody = document.querySelector("#emprendimientosTable tbody");

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
      await api.put(`/emprendimientos/${id}/estado`, { estado });
      mostrarNotificacion(
        `Emprendimiento ${estado.toLowerCase()} correctamente`,
        "exito"
      );
      cargarEmprendimientos(); 
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion(
        `Error al ${estado.toLowerCase()} el emprendimiento`,
        "error"
      );
    }
  };

  // Función para eliminar
  const eliminarEmprendimiento = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este emprendimiento?")) return;

    try {
      await api.delete(`/emprendimientos/${id}`);
      mostrarNotificacion("Emprendimiento eliminado correctamente", "exito");
      cargarEmprendimientos();
    } catch (error) {
      console.error("Error:", error);
      mostrarNotificacion("Error al eliminar el emprendimiento", "error");
    }
  };

  // Cargar anuncios desde backend
  const cargarEmprendimientos = async () => {
    try {
      const response = await api.get("/emprendimientos");
      console.log("Datos recibidos:", response.data);

      tablaBody.innerHTML = "";

      if (response.data.length === 0) {
        tablaBody.innerHTML =
          '<tr><td colspan="6">No hay emprendimientos disponibles</td></tr>';
        return;
      }

      response.data.forEach((emprendimiento) => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", emprendimiento._id); 
        fila.innerHTML = `
          <td>${emprendimiento.nombreCompleto || "Sin nombre"}</td>
          <td>${emprendimiento.correo || "Sin nombre"}</td>
          <td>${emprendimiento.numTel || "Sin telefono"}
          <td>${emprendimiento.nomEmprendimiento || "Sin nombre"}</td>
          <td>${emprendimiento.tipoEmprendimiento || "Anónimo"}</td>
          <td>${emprendimiento.descripEmprendimiento || "Sin descripcion"}</td>
          <td><img src="${emprendimiento.linkImagen}" alt="Imagen del emprendimiento" width=100px height100px/></td>
          <td> ${
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
                    || "N/A"}</td>
                    </td>
          <td>${new Date(
            emprendimiento.fecha || emprendimiento.createdAt
          ).toLocaleDateString()}</td>
          <td class="estado">${emprendimiento.estado || "Pendiente"}</td>

          <td>
            <button class="btn aceptar" data-id="${
              emprendimiento._id
            }">Activar</button>
            <button class="btn rechazar" data-id="${
              emprendimiento._id
            }">Inactivar</button>
            <button class="btn eliminar" data-id="${
              emprendimiento._id
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
        eliminarEmprendimiento(e.target.dataset.id);
      });
    });
  };

  // Evento para recargar
  document
    .getElementById("recargar-emprendimientos")
    ?.addEventListener("click", cargarEmprendimientos);

  // Inicializar
  cargarEmprendimientos();
});