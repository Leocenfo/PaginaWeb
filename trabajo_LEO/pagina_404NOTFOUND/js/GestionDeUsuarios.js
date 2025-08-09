document.addEventListener("DOMContentLoaded", () => {
  const aceptarBtns = document.querySelectorAll(".aceptar");
  const eliminarBtns = document.querySelectorAll(".eliminar");
  const inactivarBtns = document.querySelectorAll(".inactivar");

  aceptarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const estadoTd = btn.closest("tr").querySelector(".estado");
      estadoTd.textContent = "✔️ Activo";
    });
  });

  inactivarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const estadoTd = btn.closest("tr").querySelector(".estado");
      estadoTd.textContent = "❌ Inactivo";
    });
  });

  eliminarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const fila = btn.closest("tr");
      fila.remove();
    });
  });
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

