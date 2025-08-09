let userId = 1;
const form = document.getElementById("userForm");
const tableBody = document.querySelector("#userTable tbody");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const rol = document.getElementById("rol").value;
  const estado = document.getElementById("estado").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${userId++}</td>
    <td>${nombre}</td>
    <td>${correo}</td>
    <td>${rol}</td>
    <td>${estado}</td>
    <td><button class="eliminar-btn">🗑️ Eliminar</button></td>
  `;

  // Botón para eliminar usuario
  row.querySelector(".eliminar-btn").addEventListener("click", function () {
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