// Verificar usuario logueado al cargar el archivo
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
if (!usuario || !usuario.id) {
  alert("Debes estar logueado para ver tus publicaciones");
  window.location.href = "/trabajo_LEO/pagina_404NOTFOUND/HTML/login.html"; // CAMBIA la ruta si es otra
}

document.addEventListener('DOMContentLoaded', function () {
  // Menú hamburguesa
  const menuBtn = document.getElementById('menuCambio');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.classList.toggle('active');
    });
  }

  // Referencias DOM
  const form = document.getElementById("form-publicacion");
  const publicacionesContainer = document.getElementById("contenedor-publicaciones");
  const misPublicacionesContainer = document.getElementById("mis-publicaciones");

  // Envío del formulario al backend
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const categoria = document.getElementById("categoria").value;
    const tema = document.getElementById("tema").value.trim();
    const contenido = document.getElementById("contenido").value.trim();

    if (!["Reporte", "Sugerencia"].includes(categoria)) {
      alert("Solo puedes seleccionar 'Reporte' o 'Sugerencia'");
      return;
    }

    if (tema.length < 3 || contenido.length < 10) {
      alert("Debes llenar correctamente todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, tema, contenido, usuarioId: usuario.id })
      });

      if (!res.ok) throw new Error("Error al enviar publicación");
      alert("¡Publicación enviada!");
      form.reset();
      cargarPublicaciones();
      cargarMisPublicaciones();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al enviar la publicación.");
    }
  });

  // Cargar TODAS las publicaciones
  async function cargarPublicaciones() {
    try {
      const res = await fetch("http://localhost:3000/api/publicaciones");
      const publicaciones = await res.json();

      publicacionesContainer.innerHTML = "";

      publicaciones.forEach(pub => {
        const div = document.createElement("div");
        div.className = "carta";
        div.innerHTML = `
          <h4>${pub.categoria}</h4>
          <h5>${pub.tema}</h5>
          <p>${pub.contenido}</p>
          <small>${new Date(pub.fecha).toLocaleDateString()}</small>
        `;
        publicacionesContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  }

  // Cargar solo MIS publicaciones
  async function cargarMisPublicaciones() {
    try {
      const res = await fetch("http://localhost:3000/api/publicaciones");
      const publicaciones = await res.json();

      // Convertir IDs a string para evitar comparación entre ObjectId y string
      const mias = publicaciones.filter(pub => pub.usuarioId && pub.usuarioId.toString() === usuario.id);

      misPublicacionesContainer.innerHTML = "";

      mias.forEach(pub => {
        const div = document.createElement("div");
        div.className = "carta";
        div.innerHTML = `
          <h4>${pub.categoria}</h4>
          <h5>${pub.tema}</h5>
          <p>${pub.contenido}</p>
          <small>${new Date(pub.fecha).toLocaleDateString()}</small>
        `;
        misPublicacionesContainer.appendChild(div);
      });
    } catch (error) {
      console.error("Error al cargar MIS publicaciones:", error);
    }
  }

  // Inicializar
  cargarPublicaciones();
  cargarMisPublicaciones();
});
