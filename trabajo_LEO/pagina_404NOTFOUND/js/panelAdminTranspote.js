// trabajo_LEO/pagina_404NOTFOUND/js/panelAdminTranspote.js
const API_BASE = 'http://localhost:3000/api/opiniones';

document.addEventListener('DOMContentLoaded', () => {
  cargarPendientes();
  prepararMenuResponsive();
});

async function cargarPendientes() {
  const contenedor = document.querySelector('.admin_margen');
  try {
    const r = await fetch(`${API_BASE}/pendientes`);
    if (!r.ok) throw new Error(await r.text());
    const opiniones = await r.json();

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
              <button class="btn-aprobar" data-action="aprobar">Aceptar</button>
              <button class="btn-rechazar" data-action="rechazar">Rechazar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    contenedor.appendChild(tabla);
  } catch (err) {
    console.error('Error al cargar pendientes:', err);
    contenedor.innerHTML += `<p style="color:red;">Error al cargar opiniones pendientes.</p>`;
  }
}

// Delegación: aprobar/rechazar
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const fila = btn.closest('tr');
  const id = fila?.dataset?.id;
  const action = btn.dataset.action; // 'aprobar' | 'rechazar'
  if (!id) return;

  try {
    const r = await fetch(`${API_BASE}/${id}/${action}`, { method: 'PUT' });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    fila.remove();

    const tbody = document.querySelector('.tabla-admin tbody');
    if (tbody && !tbody.querySelector('tr')) {
      document.querySelector('.tabla-admin')?.remove();
      document.querySelector('.admin_margen').innerHTML += `<p>No hay opiniones pendientes.</p>`;
    }
  } catch (err) {
    console.error(`Error al ${action}:`, err);
    alert(`Error al ${action} la opinión`);
  }
});

function prepararMenuResponsive() {
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("active"); });
    menu.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => menu.classList.remove("active"));
  }
}
