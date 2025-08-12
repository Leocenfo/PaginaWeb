document.addEventListener("DOMContentLoaded", () => {

  // Elementos del DOM
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");
  const formCrear = document.getElementById('formCrearEvento');
  const tituloCrearEvento = document.getElementById('tituloCrearEvento');
  const mensaje = document.getElementById('mensajeEvento');
  const container = document.getElementById('eventos-container');

  // Obtener el usuario logueado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuario) {
    window.location.href = "/ruta-de-login.html";
    return;
  }

  console.log("ID del usuario logueado:", usuario._id || usuario.id);
  console.log("Nombre:", usuario.nombre);


  // Mostrar u ocultar formulario y título según el rol
  if (usuario.rol === 'admin' || usuario.rol === 'empresario') {
    formCrear.style.display = 'block';
    tituloCrearEvento.style.display = 'block';
  } else {
    formCrear.style.display = 'none';
    tituloCrearEvento.style.display = 'none';
    console.warn('Formulario y título ocultados por rol no autorizado:', usuario.rol);
  }


  // Menú responsive
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("active");
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    document.addEventListener("click", function () {
      menu.classList.remove("active");
    });
  }


  // Cargar eventos del backend
  async function cargarEventos() {
    container.innerHTML = '';

    try {
      const response = await axios.get('http://localhost:3000/api/eventos');
      const eventos = response.data;

      eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-id', evento._id);

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
    }
  }


  // Inicializar botones de asistencia
  function inicializarBotonesAsistencia() {
    const cards = document.querySelectorAll(".event-card");

    cards.forEach(card => {
      const eventoId = card.getAttribute('data-id');
      const interesaBtn = card.querySelector(".btn-interesa");
      const asistireBtn = card.querySelector(".btn-asistire");
      const noAsistireBtn = card.querySelector(".btn-no-asistire");

      const enviarAsistencia = (respuesta) => {
        axios.post('http://localhost:3000/api/eventos/asistencia', {
          eventoId,
          usuario: usuario.email || "usuario_demo",
          respuesta
        })
        .then(res => console.log(res.data))
        .catch(err => console.error('Error al enviar asistencia:', err));
      };

      if (interesaBtn) {
        interesaBtn.addEventListener("click", () => {
          const icon = interesaBtn.querySelector('i');
          icon.classList.toggle('fa-star');
          icon.classList.toggle('fa-star-o');
          interesaBtn.classList.toggle('activo');

          if (interesaBtn.classList.contains('activo')) {
            asistireBtn.classList.remove('activo');
            noAsistireBtn.classList.remove('activo');
            enviarAsistencia("me_interesa");
          } else {
            enviarAsistencia("sin_respuesta");
          }
        });
      }

      if (asistireBtn && noAsistireBtn) {
        asistireBtn.addEventListener("click", () => {
          asistireBtn.classList.add("activo");
          noAsistireBtn.classList.remove("activo");
          interesaBtn.classList.remove("activo");

          const icon = interesaBtn.querySelector('i');
          icon.classList.remove('fa-star');
          icon.classList.add('fa-star-o');

          enviarAsistencia("asistire");
        });

        noAsistireBtn.addEventListener("click", () => {
          noAsistireBtn.classList.add("activo");
          asistireBtn.classList.remove("activo");
          interesaBtn.classList.remove("activo");

          const icon = interesaBtn.querySelector('i');
          icon.classList.remove('fa-star');
          icon.classList.add('fa-star-o');

          enviarAsistencia("no_asistire");
        });
      }
    });
  }

  
  // Envío del formulario para crear evento
  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const fecha = document.getElementById('fecha').value;
    const imagen = document.getElementById('imagen').value;

    try {
      await axios.post('http://localhost:3000/api/eventos', {
        titulo,
        fecha,
        imagen
      });

      mensaje.textContent = ' Evento creado exitosamente.';
      formCrear.reset();
      cargarEventos();

    } catch (error) {
      console.error(' Error al crear evento:', error);
      mensaje.textContent = ' Error al crear el evento.';
    }
  });

  // Inicializa eventos
  cargarEventos();
});



