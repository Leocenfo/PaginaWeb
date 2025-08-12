let userId = 1;
const form = document.getElementById("userForm");
const tableBody = document.querySelector("#userTable tbody");

async function cambiarRolUsuario(id, nuevoRol) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ _id: id, rol: nuevoRol });
    }, 300);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const rol = document.getElementById("rol").value;
  const estado = document.getElementById("estado").value;

  const row = document.createElement("tr");
  row.dataset.id = userId; 
  row.innerHTML = `
    <td>${userId++}</td>
    <td>${nombre}</td>
    <td>${correo}</td>
    <td class="rol-cell">${rol}</td>
    <td>${estado}</td>
    <td>
      <button class="eliminar-btn">Eliminar</button>
      <button class="btn-cambiar-rol">Cambiar rol</button>
      <select class="select-rol" style="display:none;">
        <option value="ciudadano">Ciudadano</option>
        <option value="emprendedor">Emprendedor</option>
        <option value="moderador">Moderador</option>
        <option value="admin">Administrador</option>
      </select>
    </td>
  `;
  tableBody.appendChild(row);

  const btnCambiarRol = row.querySelector(".btn-cambiar-rol");
  const selectRol = row.querySelector(".select-rol");
  const celdaRol = row.querySelector(".rol-cell");

  btnCambiarRol.addEventListener("click", () => {
    if (selectRol.style.display === "none") {
      selectRol.style.display = "inline-block";
    } else {
      selectRol.style.display = "none";
    }
  });

  selectRol.addEventListener("change", async () => {
    const nuevoRol = selectRol.value;
    const idUsuario = row.dataset.id;

    try {
      const usuarioActualizado = await cambiarRolUsuario(idUsuario, nuevoRol);
      celdaRol.textContent = usuarioActualizado.rol;
      selectRol.style.display = "none";
      alert("Rol actualizado a " + nuevoRol);
    } catch (error) {
      alert("Error al actualizar rol");
    }
  });

  // Botón para eliminar usuario
  row.querySelector(".eliminar-btn").addEventListener("click", () => {
    tableBody.removeChild(row);
  });

  tableBody.appendChild(row);
  form.reset();
});

// Menú responsive
document.addEventListener("DOMContentLoaded", function () {
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

