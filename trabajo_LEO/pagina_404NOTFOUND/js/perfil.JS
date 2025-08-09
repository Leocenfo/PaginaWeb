
// Función para mostrar el popup
function mostrarPopup() {
    const popup = document.getElementById('formEditar');
    if (popup) popup.style.display = 'flex';
}

// Función para cerrar el popup
function cerrarPopup() {
    const popup = document.getElementById('formEditar');
    if (popup) popup.style.display = 'none';
}

// Cerrar popup si se hace clic fuera del contenido
window.addEventListener('click', function(event) {
    const popup = document.getElementById('formEditar');

    if (popup && event.target === popup) {
        cerrarPopup();
    }
});

// Cerrar popup con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarPopup();
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

// Guardar formulario
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#formEditar form');
    const popup = document.getElementById('formEditar');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que se recargue la página
        popup.style.display = 'none'; // Oculta el formulario
    });
});

// Mostrar mensaje de éxito al guardar

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#formEditar form');
    const popup = document.getElementById('formEditar');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita recarga
        popup.style.display = 'none'; // Oculta el formulario

        // Mostrar alerta de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Cambios guardados!',
            text: 'La información se actualizó correctamente.',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#4A90E2'
        });
    });
});

// Popup al presionar botón "Contactar"
document.addEventListener('DOMContentLoaded', function () {
  const btnContactar = document.getElementById('btnContactar');

  btnContactar.addEventListener('click', function (event) {
    event.preventDefault(); // Evita que se recargue o abra el mail

     // Mostrar ventana emergente con info de contacto
    Swal.fire({
      title: 'Contactar a Juan Pérez',
      html: `
        <p>Correo: <strong>juan.perez@comunidadconectada.ac.cr</strong></p>
        <p>Teléfono: <strong>+506 2222-2222</strong></p>
        <p>¿Deseás enviarle un correo?</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar correo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4A90E2'
    }).then((result) => {
        
        // Si confirma, abre el cliente de correo
      if (result.isConfirmed) {
        window.location.href = "mailto:juan.perez@comunidadconectada.ac.cr";
      }
    });
  });
});



