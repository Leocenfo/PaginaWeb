document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#tabla-eventos tbody');

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

          const estadoFormateado =
            evento.estado === 'Aprobado'
              ? '✔️ Aprobado'
              : evento.estado === 'Rechazado'
              ? '❌ Rechazado'
              : '⏳ Pendiente';

          tr.innerHTML = `
            <td data-label="ID">${evento._id}</td>
            <td data-label="Nombre">${evento.titulo}</td>
            <td data-label="Fecha">${new Date(evento.fecha).toLocaleDateString()}</td>
            <td data-label="Estado" class="estado">${estadoFormateado}</td>
            <td data-label="Acciones">
              <button class="aceptar">Aprobar</button>
              <button class="rechazar">Rechazar</button>
              <button class="eliminar">Eliminar</button>
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

  cargarEventos();

  document.addEventListener('click', function (e) {
    const tr = e.target.closest('tr');
    if (!tr) return;

    if (e.target.classList.contains('aceptar') || e.target.classList.contains('rechazar')) {
      const id = tr.querySelector('td[data-label="ID"]').textContent.trim();
      const nuevoEstado = e.target.classList.contains('aceptar') ? 'Aprobado' : 'Rechazado';

       console.log(`Botón presionado para cambiar estado a: ${nuevoEstado}, id: ${id}`);

      fetch(`http://localhost:3000/api/eventosLeo/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado })
      })
        .then(res => {
          if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
          return res.json();
        })
        .then(() => {
          tr.querySelector('.estado').textContent =
            nuevoEstado === 'Aprobado' ? '✔️ Aprobado' : '❌ Rechazado';
        })
        .catch(err => {
          alert('Error al actualizar el evento');
          console.error(err);
        });
    }

    if (e.target.classList.contains('eliminar')) {
      const id = tr.querySelector('td[data-label="ID"]').textContent.trim();
      if (confirm('¿Estás seguro que deseas eliminar este evento?')) {
        fetch(`http://localhost:3000/api/eventosLeo/${id}`, {
          method: 'DELETE'
        })
          .then(res => {
            if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`);
            return res.json();
          })
          .then(data => {
            alert(data.message);
            tr.remove();
          })
          .catch(err => {
            alert('Error al eliminar el evento');
            console.error(err);
          });
      }
    }
  });

  // Menú hamburguesa
  document.getElementById('menuCambio').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
  });
});


