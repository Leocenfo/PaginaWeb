document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#eventoTable tbody');

  // Función para cargar eventos desde el backend
  function cargarEventos() {
    fetch('http://localhost:3000/api/eventosLeo')
      .then(res => {
        if (!res.ok) throw new Error(`Error al obtener eventos: ${res.status}`);
        return res.json();
      })
      .then(eventos => {
        tbody.innerHTML = ''; // Limpiar tabla

        eventos.forEach(evento => {
          const tr = document.createElement('tr');

          tr.innerHTML = `
            <td data-label="ID">${evento._id}</td>
            <td data-label="Nombre">${evento.nombre}</td>
            <td data-label="Fecha">${evento.fecha}</td>
            <td data-label="Estado" class="estado">${evento.estado}</td>
            <td data-label="Acciones">
              <button class="aceptar">Aprobar</button>
              <button class="rechazar">Rechazar</button>
            </td>
          `;

          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error('Error al cargar eventos:', err);
        alert('No se pudieron cargar los eventos.');
      });
  }

  // Cargar eventos al inicio
  cargarEventos();

  // Manejar clicks para aprobar/rechazar eventos
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('aceptar') || e.target.classList.contains('rechazar')) {
      const tr = e.target.closest('tr');
      const id = tr.querySelector('td[data-label="ID"]').textContent.trim();
      const estado = e.target.classList.contains('aceptar') ? 'Aprobado' : 'Rechazado';

      fetch(`http://localhost:3000/api/eventosLeo/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado: estado })
      })
      .then(res => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then(data => {
        tr.querySelector('.estado').textContent = estado === 'Aprobado' ? '✔️ Aprobado' : '❌ Rechazado';
      })
      .catch(err => {
        alert('Error al actualizar el evento');
        console.error(err);
      });
    }
  });

  // Menú hamburguesa
  document.getElementById('menuCambio').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
  });
});
