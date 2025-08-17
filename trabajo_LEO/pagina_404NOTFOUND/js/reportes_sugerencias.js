console.log('reportes_sugerencias.js cargado v4');

// ====== CONFIG ======
const HOST = location.hostname || 'localhost';
const API_BASE = `http://${HOST}:3000`; // backend Express

// ====== SESIÓN (ajusta si tu login guarda otra clave) ======
const usuario = (() => {
  try { return JSON.parse(localStorage.getItem('usuarioLogueado') || 'null'); }
  catch { return null; }
})();
const USER_ID = usuario && (usuario.id || usuario._id || usuario.uid || usuario.userId || usuario.usuarioId || null);

if (!USER_ID) {
  alert('Debes estar logueado para ver tus publicaciones');
  // Cambia la ruta si tu login está en otro lugar:
  window.location.href = "/trabajo_LEO/pagina_404NOTFOUND/HTML/login.html";
}

// ====== HELPERS ======
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  try { return await res.json(); } catch { return null; }
}

function fechaBonita(iso) {
  return iso ? new Date(iso).toLocaleString() : '';
}

// Carta pública (sin botones)
function cardPublica(pub) {
  return `
    <div class="carta">
      <h4>${pub?.tema ?? '-'} <small>(${pub?.categoria ?? '-'})</small></h4>
      <p>${pub?.contenido ?? '-'}</p>
      <small>${fechaBonita(pub?.fecha)}</small>
    </div>
  `;
}

// Carta mía (con botón eliminar al lado de la hora)
function cardMia(pub) {
  return `
    <div class="carta" data-id="${pub?._id || ''}">
      <h4>${pub?.tema ?? '-'} <small>(${pub?.categoria ?? '-'})</small></h4>
      <p>${pub?.contenido ?? '-'}</p>
      <div class="fila-meta">
        <small>${fechaBonita(pub?.fecha)}</small>
        <button class="btn-eliminar BaseRojo" data-id="${pub?._id || ''}">Eliminar</button>
      </div>
    </div>
  `;
}

// ====== DOM ======
document.addEventListener('DOMContentLoaded', function () {
  // Menú responsive
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      menu.classList.toggle("active");
    });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { menu.classList.remove("active"); });
  }

  const form = document.getElementById("form-publicacion");
  const publicacionesContainer = document.getElementById("contenedor-publicaciones");
  const misPublicacionesContainer = document.getElementById("mis-publicaciones");

  // ====== FORM: crear (queda PENDIENTE) ======
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const categoria = (document.getElementById("categoria")?.value || '').trim();
      const tema = (document.getElementById("tema")?.value || '').trim();
      const contenido = (document.getElementById("contenido")?.value || '').trim();

      if (!categoria || !tema || !contenido) {
        alert("Debes llenar correctamente todos los campos.");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

      try {
        const body = { categoria, tema, contenido, usuarioId: USER_ID };
        const res = await fetchJSON(`${API_BASE}/api/reporteSugerencias`, {
          method: "POST",
          body: JSON.stringify(body),
        });
        console.log('[RyS][crear][ok]', res);
        alert("Enviado. Queda pendiente hasta aprobación del administrador.");
        form.reset();
        // recargas (no aparecerá hasta que aprueben)
        cargarPublicaciones();
        cargarMisPublicaciones();
      } catch (error) {
        console.error("Error al enviar la publicación:", error);
        alert("Hubo un problema al enviar la publicación.");
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Publicar'; }
      }
    });
  }

  // ====== TODAS (aprobadas) ======
  async function cargarPublicaciones() {
    if (!publicacionesContainer) return;
    publicacionesContainer.innerHTML = '<p>Cargando...</p>';
    try {
      // endpoint público devuelve SOLO aprobadas
      const data = await fetchJSON(`${API_BASE}/api/reporteSugerencias`);
      const items = Array.isArray(data) ? data : (data && data.data ? data.data : []);
      publicacionesContainer.innerHTML = items.length
        ? items.map(cardPublica).join('')
        : '<p>No hay publicaciones aún.</p>';
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
      publicacionesContainer.innerHTML = '<p style="color:#c00">Error cargando publicaciones.</p>';
    }
  }

  // ====== MIS (aprobadas del usuario) ======
  async function cargarMisPublicaciones() {
    if (!misPublicacionesContainer) return;
    misPublicacionesContainer.innerHTML = '<p>Cargando...</p>';

    try {
      // filtra desde el backend por usuarioId (aprobadas)
      const data = await fetchJSON(`${API_BASE}/api/reporteSugerencias?usuarioId=${encodeURIComponent(USER_ID)}`);
      const items = Array.isArray(data) ? data : (data && data.data ? data.data : []);
      misPublicacionesContainer.innerHTML = items.length
        ? items.map(cardMia).join('')
        : '<p>No tienes publicaciones aprobadas.</p>';
    } catch (error) {
      console.error("Error al cargar MIS publicaciones:", error);
      misPublicacionesContainer.innerHTML = '<p style="color:#c00">Error cargando tus publicaciones.</p>';
    }
  }

  // ====== Delegación: eliminar mi publicación ======
  document.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('btn-eliminar')) return;

    const id = e.target.dataset.id;
    if (!id) return;

    if (!confirm('¿Eliminar esta publicación?')) return;

    try {
      const url = `${API_BASE}/api/reporteSugerencias/${encodeURIComponent(id)}?usuarioId=${encodeURIComponent(USER_ID)}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());

      // quita la carta del DOM
      const carta = e.target.closest('.carta');
      if (carta) carta.remove();

      // refresca ambas listas por si esa publicación estaba en "todas"
      cargarPublicaciones();
      cargarMisPublicaciones();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar: ' + err.message);
    }
  });

  // Inicializar
  cargarPublicaciones();
  cargarMisPublicaciones();

  // (opcional) refresco periódico
  // setInterval(() => { cargarPublicaciones(); cargarMisPublicaciones(); }, 15000);
});
