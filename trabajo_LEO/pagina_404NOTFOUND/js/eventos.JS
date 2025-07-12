document.getElementById('formularioEvento').addEventListener('submit', function (e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenInput = document.getElementById('imagen');
    const imagen = imagenInput.files[0];

    if (!fecha || !descripcion || !imagen) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const lector = new FileReader();
    lector.onload = function (e) {
        const contenedor = document.createElement('div');
        contenedor.classList.add('evento');

        contenedor.innerHTML = `
            <strong>${fecha}</strong><br>
            <div class="evento-imagen">
                <img src="${e.target.result}" alt="Imagen del evento" />
            </div>
            <p class="descripcion">${descripcion}</p>
        `;

        document.getElementById('listaEventos').appendChild(contenedor);

        // Limpiar el formulario
        document.getElementById('formularioEvento').reset();
    };

    lector.readAsDataURL(imagen);
});


 /* Menu de hamburguesa para header*/

document.getElementById('menuCambio').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});