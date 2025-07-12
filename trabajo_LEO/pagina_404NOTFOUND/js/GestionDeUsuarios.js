document.addEventListener("DOMContentLoaded", () => {
  const aceptarBtns = document.querySelectorAll(".aceptar");
  const eliminarBtns = document.querySelectorAll(".eliminar");

  aceptarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const estadoTd = btn.closest("tr").querySelector(".estado");
      estadoTd.textContent = "✔️ Activo";
    });
  });

  eliminarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const fila = btn.closest("tr");
      fila.remove();
    });
  });
});

document.getElementById('menuCambio').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});
