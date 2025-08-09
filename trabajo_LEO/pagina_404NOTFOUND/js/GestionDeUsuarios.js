document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.querySelector("#userTable tbody");

  try {
    const { data: usuarios } = await axios.get("http://localhost:3000/api/usuarios");

    tableBody.innerHTML = ""; // Limpia la tabla para evitar duplicados

    usuarios.forEach(usuario => {
      const row = document.createElement("tr");

      let botonRol = "";
      if (usuario.rol === "ciudadano") {
        botonRol = `<button class="promover">Promover a Emprendedor</button>`;
      } else if (usuario.rol === "emprendedor") {
        botonRol = `<button class="revertir">Volver a Ciudadano</button>`;
      }

      row.innerHTML = `
        <td>${usuario._id}</td>
        <td>${usuario.nombre} ${usuario.apellido}</td>
        <td>${usuario.email}</td>
        <td>${usuario.rol}</td>
        <td class="estado">${usuario.estado === 'activo' ? '✔️ Activo' : '❌ Inactivo'}</td>
        <td>
          <button class="aceptar">Aceptar</button>
          <button class="inactivar">Inactivar</button>
          <button class="eliminar">Eliminar</button>
          ${botonRol}
        </td>
      `;

      // Acciones
      row.querySelector(".aceptar").addEventListener("click", async () => {
        await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/estado`, { estado: "activo" });
        location.reload();
      });

      row.querySelector(".inactivar").addEventListener("click", async () => {
        await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/estado`, { estado: "inactivo" });
        location.reload();
      });

      row.querySelector(".eliminar").addEventListener("click", async () => {
        const confirmar = confirm(`¿Eliminar a ${usuario.nombre}?`);
        if (confirmar) {
          await axios.delete(`http://localhost:3000/api/usuarios/${usuario._id}`);
          location.reload();
        }
      });

      const btnPromover = row.querySelector(".promover");
      if (btnPromover) {
        btnPromover.addEventListener("click", async () => {
          await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/rol`, { rol: "emprendedor" });
          location.reload();
        });
      }

      const btnRevertir = row.querySelector(".revertir");
      if (btnRevertir) {
        btnRevertir.addEventListener("click", async () => {
          await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/rol`, { rol: "ciudadano" });
          location.reload();
        });
      }

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("No se pudieron cargar los usuarios. Revisa tu conexión con el backend.");
  }

  // Menú responsive
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("click", function () {
      menu.classList.remove("active");
    });
  }
});


