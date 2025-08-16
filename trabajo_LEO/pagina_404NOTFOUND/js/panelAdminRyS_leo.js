// --- Guardia de sesión súper simple ---
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
if (!usuario) {
  // No hay sesión → a login
  window.location.href = "/ruta-de-login.html"; // pon aquí tu login real
  throw new Error("Sin sesión"); // corta la ejecución del resto del script
}

// (Opcional) bloquea por rol sin enredarse
// Si usas roles y quieres que SOLO admin/moderador entre:
if (usuario.rol && !['admin','moderador'].includes(usuario.rol)) {
  alert('No tienes permiso para ver esta página.');
  window.location.href = "/"; // redirige a donde prefieras
  throw new Error("Rol no autorizado");
}

console.log("ID del usuario logueado:", usuario.id);
console.log("Nombre:", usuario.nombre);


// ==== CONFIG ====
const API_BASE = 'http://localhost:3000'; // ajusta si es distinto

// ==== UTIL ====
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }

// ==== CARGA INICIAL ====
document.addEventListener('DOMContentLoaded', async () => {
  // Menú responsive
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("active"); });
    menu.addEventListener("click", (e) => { e.stopPropagation(); });
    document.addEventListener("click", () => { menu.classList.remove("active"); });
  }

  await cargarPendientes(); // llena la tabla con data-id desde el backend
});

// ==== LLENAR TABLA DESDE BACKEND (pendientes) ====
async function cargarPendientes(){
  const tbody = document.querySelector('#reportesTable tbody');
  tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

  try {
    // GET admin con filtro estado=pendiente (ajusta si tu endpoint es otro)
    const url = `${API_BASE}/api/admin/reporteSugerencias?estado=pendiente&page=1&limit=100`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET falló ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items : data; // por si devuelves array directo
    if (!Array.isArray(items)) throw new Error('Respuesta inesperada');

    tbody.innerHTML = '';
    items.forEach((pub, i) => {
      const tr = document.createElement('tr');
      tr.dataset.id = pub._id; // <-- IMPORTANTE
      tr.innerHTML = `
        <td data-label="ID">${i+1}</td>
        <td data-label="Usuario">${escapeHtml(pub.usuarioNombre || 'Usuario')}</td>
        <td data-label="Tipo">${escapeHtml(pub.categoria || pub.tipo || '')}</td>
        <td data-label="Mensaje">${escapeHtml(pub.contenido || '')}</td>
        <td data-label="Estado" class="estado">Pendiente</td>
        <td data-label="Acciones">
          <button class="BaseVerdeTabla aceptar">Aceptar</button>
          <button class="BaseRojoTabla rechazar">Rechazar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No hay publicaciones pendientes.</td></tr>';
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="6">Error al cargar pendientes.</td></tr>';
  }
}

// ==== HANDLER DE CLICS (robusto) ====
document.addEventListener('click', async function (e) {
  // ACEPTAR
  const btnAceptar = e.target.closest('.aceptar, .BaseVerdeTabla');
  if (btnAceptar) {
    const tr = btnAceptar.closest('tr');
    const id = tr?.dataset?.id;
    if (!id) { console.warn('Falta data-id en <tr>'); return; }

    const estado = tr.querySelector('.estado');
    const prev = estado.textContent;
    estado.textContent = '✔️ Aprobado'; // UI optimista

    try {
      const r = await fetch(`${API_BASE}/api/admin/reporteSugerencias/${id}/aprobar`, { method: 'PATCH' });
      if (!r.ok) {
        estado.textContent = prev;
        console.error('PATCH aprobar falló:', r.status, await r.text());
        alert('No se pudo aprobar.');
      } else {
        // opcional: eliminar fila de la lista de pendientes
        // tr.remove();
      }
    } catch (err) {
      estado.textContent = prev;
      console.error(err);
      alert('No se pudo aprobar (red).');
    }
    return;
  }

  // RECHAZAR
  const btnRechazar = e.target.closest('.rechazar, .BaseRojoTabla');
  if (btnRechazar) {
    const tr = btnRechazar.closest('tr');
    const id = tr?.dataset?.id;
    if (!id) { console.warn('Falta data-id en <tr>'); return; }

    const motivo = prompt('Motivo de rechazo:');
    if (motivo === null) return;

    const estado = tr.querySelector('.estado');
    const prev = estado.textContent;
    estado.textContent = '❌ Rechazado'; // UI optimista

    try {
      const r = await fetch(`${API_BASE}/api/admin/reporteSugerencias/${id}/rechazar`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ motivo })
      });
      if (!r.ok) {
        estado.textContent = prev;
        console.error('PATCH rechazar falló:', r.status, await r.text());
        alert('No se pudo rechazar.');
      } else {
        // opcional: eliminar fila de la lista de pendientes
        // tr.remove();
      }
    } catch (err) {
      estado.textContent = prev;
      console.error(err);
      alert('No se pudo rechazar (red).');
    }
    return;
  }
});