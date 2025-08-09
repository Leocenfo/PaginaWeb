document.addEventListener('click', function (e) {
  if (e.target.classList.contains('aceptar')) {
    const estado = e.target.closest('tr').querySelector('.estado');
    estado.textContent = '✔️ Aprobado';
  }

  if (e.target.classList.contains('rechazar')) {
    const estado = e.target.closest('tr').querySelector('.estado');
    estado.textContent = '❌ Rechazado';
  }
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
