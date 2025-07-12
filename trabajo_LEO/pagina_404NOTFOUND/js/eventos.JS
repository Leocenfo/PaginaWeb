document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll(".event-card");

  cards.forEach(card => {
    const interesaBtn = card.querySelector(".btn-interesa");
    const asistireBtn = card.querySelector(".btn-asistire");
    const noAsistireBtn = card.querySelector(".btn-no-asistire");

    if (interesaBtn) {
      interesaBtn.addEventListener("click", () => {
        const icon = interesaBtn.querySelector('i');
        icon.classList.toggle('fa-star');
        icon.classList.toggle('fa-star-o');
        interesaBtn.classList.toggle('activo');

        // Si activamos "Me interesa", desactivamos los otros dos
        if (interesaBtn.classList.contains('activo')) {
          asistireBtn.classList.remove('activo');
          noAsistireBtn.classList.remove('activo');
        }
      });
    }

    if (asistireBtn && noAsistireBtn) {
      asistireBtn.addEventListener("click", () => {
        asistireBtn.classList.add("activo");
        noAsistireBtn.classList.remove("activo");
        interesaBtn.classList.remove("activo");

        // Asegurar que el ícono de estrella vuelva a "no marcado"
        const icon = interesaBtn.querySelector('i');
        icon.classList.remove('fa-star');
        icon.classList.add('fa-star-o');
      });

      noAsistireBtn.addEventListener("click", () => {
        noAsistireBtn.classList.add("activo");
        asistireBtn.classList.remove("activo");
        interesaBtn.classList.remove("activo");

        // Asegurar que el ícono de estrella vuelva a "no marcado"
        const icon = interesaBtn.querySelector('i');
        icon.classList.remove('fa-star');
        icon.classList.add('fa-star-o');
      });
    }
  });
});
/* Menu de hamburguesa para header*/

document.getElementById('menuCambio').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
});