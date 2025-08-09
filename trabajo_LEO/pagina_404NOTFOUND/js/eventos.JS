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
  const cards = document.querySelectorAll(".event-card");

  cards.forEach(card => {
    const eventoId = card.getAttribute('data-id');
    const interesaBtn = card.querySelector(".btn-interesa");
    const asistireBtn = card.querySelector(".btn-asistire");
    const noAsistireBtn = card.querySelector(".btn-no-asistire");

    const enviarAsistencia = (respuesta) => {
      fetch('http://localhost:3000/api/eventos/asistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventoId,
          usuario: "usuario_demo",
          respuesta
        })
      })
      .then(res => res.json())
      .then(data => console.log(data))
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
});
