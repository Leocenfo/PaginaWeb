// FUNCIONES GLOBALES
function mostrarError(mensaje) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-mensaje';
  errorDiv.textContent = mensaje;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}
async function enviarAsistencia(eventoId, usuarioId, respuesta) {
  try {
    if (!eventoId || !usuarioId || !respuesta) {
      throw new Error("Faltan datos requeridos");
    }

    const res = await axios.post('http://localhost:3000/api/eventosLeo/asistencia', {
      eventoId,
      usuario: usuarioId,  // ID del usuario, no email
      respuesta
    });

    return res.status === 200;
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    mostrarError(error.response?.data?.error || error.message);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  const formCrear = document.getElementById('formCrearEvento');
  const tituloCrearEvento = document.getElementById('tituloCrearEvento');
  const mensaje = document.getElementById('mensajeEvento');
  const container = document.getElementById('eventos-container'); 

  // Verificar usuario
  let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) {
    window.location.href = "/ruta-de-login.html";
    return;
  }

  const actualizarUIsegunRol = () => {
    const tienePermisos = ['admin', 'empresario'].includes(usuario.rol);
    formCrear.style.display = tienePermisos ? 'block' : 'none';
    tituloCrearEvento.style.display = tienePermisos ? 'block' : 'none';
  };

  // Verificación periódica del rol (cada 30 segundos)
  const verificarRol = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/usuarios/${usuario._id}`);
      if (response.data.rol !== usuario.rol) {
        usuario.rol = response.data.rol;
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        actualizarUIsegunRol();
      }
    } catch (error) {
      console.error("Error al verificar rol:", error);
    }
  };

  // Configurar intervalo
  let intervaloRol = setInterval(verificarRol, 30000);

  // Escuchar cambios en localStorage (para cuando se cambia rol en otra pestaña)
  window.addEventListener('storage', (event) => {
    if (event.key === 'usuarioLogueado') {
      const nuevoUsuario = JSON.parse(event.newValue);
      if (nuevoUsuario && nuevoUsuario._id === usuario._id) {
        usuario = nuevoUsuario;
        actualizarUIsegunRol();
      }
    }
  });

  actualizarUIsegunRol();

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
      const usuarioEmail = usuario.email;
      const usuarioId = usuario._id;

      if (!usuarioEmail) {
        mostrarError("Debes iniciar sesión para confirmar asistencia");
        return;
      }

      const btnInteresa = card.querySelector('.btn-interesa');
      const btnAsistire = card.querySelector('.btn-asistire');
      const btnNoAsistire = card.querySelector('.btn-no-asistire');

    const manejarClick = async (respuesta, boton) => {
    const yaActivo = boton.classList.contains('activo');

    if (yaActivo) {
        // Si ya estaba activo, lo deseleccionamos
        boton.classList.remove('activo');

        // Manejar icono de estrella solo para "me interesa"
        if (boton === btnInteresa) {
            const icon = boton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-star');
                icon.classList.add('fa-star-o');
            }
        }

        // Aquí puedes llamar al backend para quitar la asistencia
        await enviarAsistencia(eventoId, usuarioEmail, null);
        return;
    }

    // Si no estaba activo, seleccionamos y desactivamos los otros
    [btnInteresa, btnAsistire, btnNoAsistire].forEach(b => b?.classList.remove('activo'));
    boton.classList.add('activo');
    
          // icono de estrella
    if (boton === btnInteresa) {
        const icon = boton.querySelector('i');
        if (icon) {
            icon.classList.add('fa-star');
            icon.classList.remove('fa-star-o');
        }
    }

    await enviarAsistencia(eventoId, usuarioEmail, respuesta);
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