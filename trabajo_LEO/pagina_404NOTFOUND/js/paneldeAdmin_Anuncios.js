document.addEventListener('DOMContentLoaded', () => {  /*aqui tenemos acceso al contenido del html */
  const tabla = document.getElementById('anunciosTable'); /* tenemos la variable */

  tabla.addEventListener('click', function (e) {
    const fila = e.target.closest('tr');
    const estado = fila.querySelector('.estado');

    if (e.target.classList.contains('aceptar')) {
      estado.textContent = '✔️ Aprobado';
    }

    if (e.target.classList.contains('rechazar')) {
      estado.textContent = '❌ Rechazado';
    }
  });
});

document.getElementById('menuCambio').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});