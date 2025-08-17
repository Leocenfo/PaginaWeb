/* =========================
   Transporte · tp.JS
   - Mapa: buscar / centrar / mi ubicación / copiar enlace
   - Opiniones: crear (pendiente) + listar (aprobadas)
   ========================= */

/* ====== CONFIG ====== */
const API_OPINIONES = 'http://localhost:3000/api/opiniones';
const HV_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.08950106349!2d-84.03100398500974!3d9.917647876191204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e2bbf279e5df%3A0x6a1d7cfad788490b!2sHacienda%20Vieja%2C%20Curridabat!5e0!3m2!1ses-419!2scr!4v1710012345678';

/* ====== UTILS ====== */
const $ = (sel) => document.querySelector(sel);
function getMap() {
  // usa #mapFrame si existe; si no, el iframe del bloque claro
  return $('#mapFrame') || document.querySelector('.claro iframe');
}
function toast(titulo, texto = '', icon = 'info') {
  if (window.Swal) return Swal.fire(titulo, texto, icon);
  alert(titulo + (texto ? `\n\n${texto}` : ''));
}

/* ====== MAPA ====== */
function buscarEnMapaTermino(termino) {
  const iframe = getMap();
  if (!iframe) return;
  const q = (termino || '').trim();
  if (!q) return;
  const query = encodeURIComponent(`${q} Hacienda Vieja, Curridabat`);
  iframe.src = `https://www.google.com/maps?q=${query}&output=embed&z=16`;
}
function centrarHV() {
  const iframe = getMap();
  if (iframe) iframe.src = HV_EMBED;
}
function miUbicacion() {
  const iframe = getMap();
  if (!iframe) return;
  if (!navigator.geolocation) {
    return toast('Oops', 'Este navegador no soporta geolocalización.', 'info');
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      iframe.src = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed&z=16`;
    },
    (err) => toast('No se pudo obtener ubicación', String(err.message || err), 'warning'),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
}
function copiarEnlaceMapa() {
  const iframe = getMap();
  if (!iframe) return;
  const url = iframe.src;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(
      () => toast('Listo', 'Enlace del mapa copiado al portapapeles.', 'success'),
      () => toast('Listo', url, 'info')
    );
  } else {
    toast('Enlace del mapa', url, 'info');
  }
}

/* ====== OPINIONES (CLIENTE) ====== */
function estrellas(n) {
  const s = Math.max(1, Math.min(5, Number(n) || 5));
  return '★'.repeat(s) + '☆'.repeat(5 - s);
}

async function cargarOpiniones() {
  // obtiene SOLO las aprobadas (lo maneja el backend)
  const lista = $('#opinionesLista');
  if (!lista) return; // si no está la sección, no hacemos nada
  try {
    const res = await fetch(API_OPINIONES);
    if (!res.ok) throw new Error('Respuesta no OK');
    const data = await res.json();

    lista.innerHTML = '';
    if (!data.length) {
      lista.innerHTML = '<p class="azul">Aún no hay opiniones aprobadas.</p>';
      return;
    }

    data.forEach((op) => {
      const div = document.createElement('div');
      div.className = 'carta';
      div.innerHTML = `
        <p style="margin:0">
          <b>${op.nombre || 'Anónimo'}</b> · ${estrellas(op.calificacion)}
        </p>
        ${op.ruta ? `<p style="margin:0;color:#555">Ruta: ${op.ruta}</p>` : ''}
        <p style="margin:6px 0 0 0">${op.comentario}</p>
        <small style="color:#666">${new Date(op.createdAt).toLocaleString()}</small>
      `;
      lista.appendChild(div);
    });
  } catch (e) {
    console.error('Opiniones:', e);
  }
}

async function enviarOpinion(e) {
  e.preventDefault();
  const nombre = $('#opNombre')?.value.trim() || '';
  const comentario = $('#opComentario')?.value.trim() || '';
  const calificacion = Number($('#opCalif')?.value || 5);
  const ruta = $('#opRuta')?.value.trim() || '';

  if (!comentario) {
    return toast('Escribe tu opinión.', '', 'info');
  }

  try {
    const res = await fetch(API_OPINIONES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, comentario, calificacion, ruta })
    });
    if (!res.ok) throw new Error(await res.text());

    // limpio
    e.target.reset();
    toast('¡Gracias!', 'Tu opinión quedó pendiente de aprobación.', 'success');
  } catch (err) {
    console.error(err);
    toast('Error', 'No se pudo publicar la opinión. Verificá el backend.', 'error');
  }
}

/* ====== INIT / EVENTOS ====== */
document.addEventListener('DOMContentLoaded', () => {
  // Menú responsive
  const menuToggle = $('#menuCambio');
  const menu = $('#menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });
    menu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => menu.classList.remove('active'));
  }

  // Botones de mapa si existen en tu HTML
  $('#btnCentrar')?.addEventListener('click', centrarHV);
  $('#btnMiUbicacion')?.addEventListener('click', miUbicacion);
  $('#btnCopiarMapa')?.addEventListener('click', copiarEnlaceMapa);

  // Buscar en el mapa
  const input = $('#buscadorRuta');
  const btnBuscar = $('#btnBuscar') || document.querySelector('.busqueda .boton');
  btnBuscar?.addEventListener('click', () => {
    const q = (input?.value || '').trim();
    if (q) buscarEnMapaTermino(q);
  });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = (input?.value || '').trim();
      if (q) buscarEnMapaTermino(q);
    }
  });

  // Form de opiniones
  $('#frmOpinion')?.addEventListener('submit', enviarOpinion);

  // Cargar opiniones aprobadas
  cargarOpiniones();
});
