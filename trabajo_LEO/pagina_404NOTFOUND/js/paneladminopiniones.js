console.log('panelAdminRyS_leo.js cargado v2');

// ======================= CONFIG =======================
// autodetecta host (localhost / 127.0.0.1)
const HOST = location.hostname || 'localhost';
const API_BASE = `http://${HOST}:3000`; // backend Express

// ======================= HELPERS ======================
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  try { return await res.json(); } catch { return null; }
}

// Soporta array directo o { ok, data }
function asItems(body) {
  const arr = Array.isArray(body) ? body : (body && body.data ? body.data : []);
  // Filtra “pendientes” por si hay registros antiguos ya moderados
  return arr.filter(x => {
    const est = (x.estado || '').toLowerCase();
    return (x.aprobada !== true) && !['aprobado','aprobada','rechazado','rechazada'].includes(est);
  });
}

function fmtDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return '-'; }
}

function setBusyRow(btn, busy) {
  const tr = btn ? btn.closest('tr') : null;
  if (!tr) return;
  const buttons = tr.querySelectorAll('button');
  buttons.forEach(b => {
    b.disabled = busy;
    if (busy) {
      b.dataset._oldText = b.textContent;
      b.textContent = (b.classList.contains('aceptar') || b.classList.contains('BaseVerdeTabla'))
        ? 'Aprobando...' : 'Rechazando...';
    } else if (b.dataset._oldText) {
      b.textContent = b.dataset._oldText;
      delete b.dataset._oldText;
    }
  });
}

function updateCounter() {
  const tbody = document.getElementById('tbody-pendientes');
  const contador = document.getElementById('contadorPendientes');
  if (!tbody || !contador) return;
  const rows = tbody.querySelectorAll('tr[data-id]');
  contador.textContent = rows.length.toString();
}

function showRowMessage(text, color='#333') {
  const tbody = document.getElementById('tbody-pendientes');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:${color}">${text}</td></tr>`;
}

function debug(msg, data) {
  console.log('[PANEL-RyS]', msg, data ?? '');
  const pre = document.getElementById('debug');
  if (pre) {
    const dump = (typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    pre.textContent += `\n${msg}${data !== undefined ? ': ' + dump : ''}`;
  }
}

// =================== RENDER / CARGA ===================
async function cargarPendientes() {
  const tbody = document.getElementById('OpinionesTable');
  if (!tbody) { console.warn('Falta <tbody id="tbody-pendientes">'); return; }

  showRowMessage('Cargando...');
  try {
    const data = await fetchJSON(`${API_BASE}/api/admin/OpinionController/pendientes`);
    debug('Respuesta pendientes', data);
    const items = asItems(data);

    if (!items.length) {
      showRowMessage('No hay pendientes.');
      updateCounter();
      return;
    }

    tbody.innerHTML = items.map(x => `
      <tr data-id="${x._id}">
        <td data-label="ID">${x._id}</td>
        <td data-label="Usuario">${x.nombre ?? '-'}</td>
        <td data-label="Tipo">${x.ruta ?? '-'}</td>
        <td data-label="Mensaje">${x.calificacion ?? '-'}</td>
        <td data-label="Mensaje">${x.comentario ?? '-'}</td>
        <td data-label="Estado" class="estado">Pendiente</td>
        <td data-label="Acciones">
          <button class="BaseVerdeTabla aceptar">Aceptar</button>
          <button class="BaseRojoTabla rechazar">Rechazar</button>
        </td>
      </tr>
    `).join('');

    updateCounter();
  } catch (err) {
    console.error(err);
    debug('Error cargando pendientes', err.message);
    showRowMessage('Error cargando pendientes. Revisa consola (F12 → Console).', '#c00');
    updateCounter();
  }
}

// ================== ACCIONES ADMIN ====================
async function aprobar(id, btn) {
  setBusyRow(btn, true);
  try {
    await fetchJSON(`${API_BASE}/api/admin/OpinionController/${id}/aprobar`, { method: 'PATCH' });
    const tr = document.querySelector(`tr[data-id="${id}"]`);
    if (tr) tr.remove();
    updateCounter();
    const tbody = document.getElementById('tbody-pendientes');
    if (tbody && !tbody.querySelector('tr[data-id]')) {
      showRowMessage('No hay pendientes.');
    }
  } catch (err) {
    console.error(err);
    debug('Error aprobar', err.message);
    const tr = btn ? btn.closest('tr') : null;
    const estadoEl = tr ? tr.querySelector('.estado') : null;
    if (estadoEl) estadoEl.textContent = '❌ Error al aprobar';
  } finally {
    setBusyRow(btn, false);
  }
}

async function rechazar(id, btn) {
  setBusyRow(btn, true);
  try {
    await fetchJSON(`${API_BASE}/api/admin/OpinionController/${id}/rechazar`, { method: 'PATCH' });
    const tr = document.querySelector(`tr[data-id="${id}"]`);
    if (tr) tr.remove();
    updateCounter();
    const tbody = document.getElementById('tbody-pendientes');
    if (tbody && !tbody.querySelector('tr[data-id]')) {
      showRowMessage('No hay pendientes.');
    }
  } catch (err) {
    console.error(err);
    debug('Error rechazar', err.message);
    const tr = btn ? btn.closest('tr') : null;
    const estadoEl = tr ? tr.querySelector('.estado') : null;
    if (estadoEl) estadoEl.textContent = '❌ Error al rechazar';
  } finally {
    setBusyRow(btn, false);
  }
}

// ============= EVENTOS (delegación global) ============
document.addEventListener('click', (e) => {
  const btn = e.target;

  // Aceptar (soporta clase semántica y clase de estilo existente)
  if (btn.classList && (btn.classList.contains('aceptar') || btn.classList.contains('BaseVerdeTabla'))) {
    const tr = btn.closest('tr');
    const id = tr ? tr.dataset.id : null;
    if (id) aprobar(id, btn);
  }

  // Rechazar
  if (btn.classList && (btn.classList.contains('rechazar') || btn.classList.contains('BaseRojoTabla'))) {
    const tr = btn.closest('tr');
    const id = tr ? tr.dataset.id : null;
    if (id) rechazar(id, btn);
  }
});

// ====== MENÚ RESPONSIVE (aislado y robusto) ======
(function setupHeaderMenu() {
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.toggle("active");
    menu.classList.toggle("open"); // por si el CSS usa "open"
  });

  menu.addEventListener("click", function (e) { e.stopPropagation(); });

  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== menuToggle) {
      menu.classList.remove("active");
      menu.classList.remove("open");
    }
  });
})();

// =================== CARGA INICIAL ====================
document.addEventListener('DOMContentLoaded', () => {
  cargarPendientes();
});
