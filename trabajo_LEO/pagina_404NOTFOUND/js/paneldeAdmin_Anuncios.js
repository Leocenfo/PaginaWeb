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

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.querySelector('#anunciosTable tbody');

  // Cargar anuncios desde backend
  async function cargarAnuncios() {
    try {
      const res = await fetch('http://localhost:3000/api/anuncios');
      if (!res.ok) throw new Error('No se pudo cargar');
      const anuncios = await res.json();

      tablaBody.innerHTML = ''; // Limpia tabla
      anuncios.forEach(anuncio => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${anuncio._id}</td>
          <td>${anuncio.titulo}</td>
          <td>${anuncio.autor}</td>
          <td>${new Date(anuncio.fecha).toLocaleDateString()}</td>
          <td class="estado">${anuncio.estado}</td>
          <td>
            <button class="aceptar" data-id="${anuncio._id}">Aprobar</button>
            <button class="rechazar" data-id="${anuncio._id}">Rechazar</button>
          </td>`;
        tablaBody.appendChild(fila);
      });
    } catch (err) {
      console.error(err);
      alert('Error al cargar anuncios.');
    }
  }

  // Cambiar estado
  async function cambiarEstado(id, estado) {
    try {
      const res = await fetch(`http://localhost:3000/api/anuncios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      await cargarAnuncios();
    } catch (err) {
      console.error(err);
    }
  }

  // Eliminar anuncio
  async function eliminarAnuncio(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/anuncios/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      await cargarAnuncios();
    } catch (err) {
      console.error(err);
    }
  }

  // Delegación de eventos
  tablaBody.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('aceptar')) {
      cambiarEstado(id, 'Aprobado');
    } else if (e.target.classList.contains('rechazar')) {
      cambiarEstado(id, 'Rechazado');
    } else if (e.target.classList.contains('eliminar')) {
      if (confirm('¿Eliminar este anuncio?')) eliminarAnuncio(id);
    }
  });

  cargarAnuncios();
});
