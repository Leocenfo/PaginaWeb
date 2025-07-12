
// FILTRO DE BÚSQUEDA EN RUTAS
document.addEventListener('DOMContentLoaded', function () {
    const buscador = document.getElementById('buscadorRuta');
    const cartas = document.querySelectorAll('.carta');

    buscador.addEventListener('input', function () {
        const texto = buscador.value.toLowerCase();

        cartas.forEach(function (carta) {
            const contenido = carta.textContent.toLowerCase();
            carta.style.display = contenido.includes(texto) ? 'block' : 'none';
        });
    });
});


// MENÚ RESPONSIVE
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menuCambio');
    const menu = document.getElementById('menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');
        });
    }
});


// BOTÓN ¿NECESITÁS AYUDA?
document.addEventListener('DOMContentLoaded', function () {
    const btnAyuda = document.querySelector('.btn-normal');

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
});
