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

/* Menú hamburguesa */
document.getElementById('menuCambio').addEventListener('click', function () {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});
