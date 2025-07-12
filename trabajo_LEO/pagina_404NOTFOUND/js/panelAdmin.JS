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

/* Menú de hamburguesa */
document.getElementById('menuCambio').addEventListener('click', function () {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});
