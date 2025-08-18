const API_OPINIONES_ADMIN = 'http://localhost:3000/api/opiniones/pendientes';
const API_OPINIONES_ACCIONES = 'http://localhost:3000/api/admin/OpinionController';

document.addEventListener('DOMContentLoaded', () => {
  cargarOpinionesPendientes();
});

// Cargar opiniones pendientes
async function cargarOpinionesPendientes() {
  const contenedor = document.querySelector('.admin_margen');

  try {
    const res = await fetch(API_OPINIONES_ADMIN);
    const opiniones = await res.json();

    if (!opiniones.length) {
      contenedor.innerHTML += `<p>No hay opiniones pendientes.</p>`;
      return;
    }

    const tabla = document.createElement('table');
    tabla.classList.add('tabla-admin');

    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ruta</th>
          <th>Comentario</th>
          <th>Calificación</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${opiniones.map(op => `
          <tr data-id="${op._id}">
            <td>${op.nombre || 'Anónimo'}</td>
            <td>${op.ruta || '-'}</td>
            <td>${op.comentario}</td>
            <td>${'★'.repeat(op.calificacion)}${'☆'.repeat(5 - op.calificacion)}</td>
            <td>${new Date(op.createdAt).toLocaleString()}</td>
            <td>
              <button class="aceptar">Aceptar</button>
              <button class="rechazar">Rechazar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    contenedor.appendChild(tabla);
  } catch (err) {
    console.error('Error al cargar opiniones:', err);
    contenedor.innerHTML += `<p style="color:red;">Error al cargar opiniones pendientes.</p>`;
  }
}

// Manejo de botones
document.addEventListener('click', async function (e) {
  const btn = e.target;
  const fila = btn.closest('tr');
  const id = fila?.dataset?.id;

  if (!id) return;

  if (btn.classList.contains('aceptar')) {
    try {
      const res = await fetch(`${API_OPINIONES_ACCIONES}/${id}/aprobar`, {
        method: 'PUT'
      });

      if (!res.ok) throw new Error('Error al aprobar');
      fila.remove();
    } catch (err) {
      alert('Error al aprobar la opinión');
      console.error(err);
    }
  }

  if (btn.classList.contains('rechazar')) {
    try {
      const res = await fetch(`${API_OPINIONES_ACCIONES}/${id}/rechazar`, {
        method: 'PUT'
      });

      if (!res.ok) throw new Error('Error al rechazar');
      fila.remove();
    } catch (err) {
      alert('Error al rechazar la opinión');
      console.error(err);
    }
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
