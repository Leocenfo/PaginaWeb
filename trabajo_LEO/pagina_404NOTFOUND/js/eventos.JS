// FUNCIONES GLOBALES
function mostrarError(mensaje) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-mensaje';
  errorDiv.textContent = mensaje;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

async function enviarAsistencia(eventoId, usuario, respuesta) {
  try {
    if (!eventoId || !usuario || !respuesta) {
      throw new Error("Faltan datos requeridos");
    }

    if (!eventoId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("ID de evento no válido");
    }

    const respuestasValidas = ['me_interesa', 'asistire', 'no_asistire'];
    if (!respuestasValidas.includes(respuesta)) {
      throw new Error("Respuesta no válida");
    }

    const response = await axios.post('http://localhost:3000/api/eventosLeo/asistencia', {
      eventoId: eventoId,
      usuario: usuario,
      respuesta: respuesta
    });

    return response.data;
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    mostrarError(error.response?.data?.error || error.message);
    return null;
  }
}

// MAIN CODE
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  const formCrear = document.getElementById('formCrearEvento');
  const tituloCrearEvento = document.getElementById('tituloCrearEvento');
  const mensaje = document.getElementById('mensajeEvento');
  const container = document.getElementById('eventos-container'); 

  // Verificar usuario
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) {
    window.location.href = "/ruta-de-login.html";
    return;
  }

  // Mostrar/ocultar formulario según rol
  formCrear.style.display = (usuario.rol === 'admin' || usuario.rol === 'empresario') ? 'block' : 'none';
  tituloCrearEvento.style.display = formCrear.style.display;

  // Menú responsive
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", e => {
      e.stopPropagation();
      menu.classList.toggle("active");
    });
    menu.addEventListener("click", e => e.stopPropagation());
    document.addEventListener("click", () => menu.classList.remove("active"));
  }

  // Cargar eventos
  async function cargarEventos() {
    if (!container) return;

    container.innerHTML = '';
    try {
      const response = await axios.get('http://localhost:3000/api/eventosLeo');
      const eventos = response.data;

      eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = evento._id;

        card.innerHTML = `
          <img src="${evento.imagen || '/ruta/imagen_default.jpg'}" alt="${evento.titulo}">
          <div class="info">
            <p class="titulo">${evento.titulo}</p>
            <p class="fecha">Fecha: ${new Date(evento.fecha).toLocaleDateString()}</p>
            <div class="acciones">
              <button class="btn-interesa"><i class="fa fa-star-o"></i> Me interesa</button>
              <button class="btn-asistire">Asistiré</button>
              <button class="btn-no-asistire">No asistiré</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      inicializarBotonesAsistencia();
    } catch (err) {
      console.error('Error al obtener eventos:', err);
      mostrarError('Error al cargar eventos');
    }
  }

  // Inicializar botones
  function inicializarBotonesAsistencia() {
    const cards = document.querySelectorAll(".event-card");

    cards.forEach(card => {
      const eventoId = card.dataset.id;
      const usuarioEmail = usuario.email; // Usamos el usuario ya obtenido

      if (!usuarioEmail) {
        mostrarError("Debes iniciar sesión para confirmar asistencia");
        return;
      }

      const btnInteresa = card.querySelector('.btn-interesa');
      const btnAsistire = card.querySelector('.btn-asistire');
      const btnNoAsistire = card.querySelector('.btn-no-asistire');

      const manejarClick = async (respuesta, boton) => {
        const success = await enviarAsistencia(eventoId, usuarioEmail, respuesta);
        if (success) {
          // Resetear todos los botones
          [btnInteresa, btnAsistire, btnNoAsistire].forEach(b => b?.classList.remove('activo'));
          
          // Activar solo el botón clickeado
          boton.classList.add('activo');
          
          // Manejar icono de estrella
          const icon = btnInteresa?.querySelector('i');
          if (icon) {
            icon.classList.toggle('fa-star', respuesta === 'me_interesa');
            icon.classList.toggle('fa-star-o', respuesta !== 'me_interesa');
          }
        }
      };

      btnInteresa?.addEventListener('click', () => manejarClick('me_interesa', btnInteresa));
      btnAsistire?.addEventListener('click', () => manejarClick('asistire', btnAsistire));
      btnNoAsistire?.addEventListener('click', () => manejarClick('no_asistire', btnNoAsistire));
    });
  }

  // Crear evento
  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const fecha = document.getElementById('fecha').value;
    const imagen = document.getElementById('imagen').value;

    try {
      await axios.post('http://localhost:3000/api/eventosLeo', { titulo, fecha, imagen });
      mensaje.textContent = 'Evento creado exitosamente.';
      formCrear.reset();
      await cargarEventos();
    } catch (error) {
      console.error('Error al crear evento:', error);
      mostrarError(error.response?.data?.error || 'Error al crear evento');
    }
  });

  // Inicializar
  cargarEventos();
});