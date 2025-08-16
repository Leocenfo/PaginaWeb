// CARGA DINÁMICA DE RUTAS DESDE EL BACKEND
document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/api/comunidad/rutas') // Asegúrate de que el backend esté corriendo
    .then(res => res.json())
    .then(rutas => {
      const contenedor = document.getElementById('contenedorRutas');
      contenedor.innerHTML = '';
      rutas.forEach(ruta => {
        const div = document.createElement('div');
        div.classList.add('carta');
        div.innerHTML = `
          <h4>${ruta.nombre}</h4>
          <p>Frecuencia: ${ruta.frecuencia}</p>
          <p>Horario: ${ruta.horario}</p>
          <p>Paradas: ${ruta.paradas.join(', ')}</p>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(err => console.error('Error al cargar rutas:', err));
});


// FILTRO DE BÚSQUEDA EN RUTAS (FUNCIONA CON DATOS DINÁMICOS)
document.addEventListener('DOMContentLoaded', function () {
  const buscador = document.getElementById('buscadorRuta');
  const contenedor = document.getElementById('contenedorRutas');

  buscador.addEventListener('input', function () {
    const texto = buscador.value.toLowerCase();
    const cartas = contenedor.querySelectorAll('.carta');

    cartas.forEach(function (carta) {
      const contenido = carta.textContent.toLowerCase();
      carta.style.display = contenido.includes(texto) ? 'block' : 'none';
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


// BOTÓN ¿NECESITÁS AYUDA? (SweetAlert)
document.addEventListener('DOMContentLoaded', function () {
  const btnAyuda = document.querySelector('.btn-normal');

  if (btnAyuda) {
    btnAyuda.addEventListener('click', function (event) {
      event.preventDefault();
      Swal.fire({
        title: '¿En qué podemos ayudarte?',
        text: 'Podés contactarnos al 2222-2222 o escribirnos a info@comunidadconectada.ac.cr',
        icon: 'info',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#4A90E2'
      });
    });
  }
});
