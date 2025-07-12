document.addEventListener('DOMContentLoaded', function () {
    // Menú hamburguesa
    const menuBtn = document.getElementById('menuCambio');
    const menu = document.getElementById('menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function () {
        menu.classList.toggle('active');
      });
    }
  
    // Manejo de publicaciones
    const form = document.getElementById("form-publicacion");
    const publicacionesContainer = document.getElementById("contenedor-publicaciones");
    const misPublicacionesContainer = document.getElementById("mis-publicaciones");
  
    form.addEventListener("submit", function (e) {
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
  
      // Crear publicación para "Todas las publicaciones"
      const publicacion = document.createElement("div");
      publicacion.className = "carta";
      publicacion.innerHTML = `
        <h4>${categoria}</h4>
        <h5>${tema}</h5>
        <p>${contenido}</p>
        <small>User</small>
      `;
  
      // Crear publicación con botón eliminar para "Mis publicaciones"
      const miPublicacion = publicacion.cloneNode(true);
      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.className = "boton";
      botonEliminar.style.marginTop = "10px";
      botonEliminar.style.backgroundColor = "#D0021B";
      botonEliminar.style.color = "white";
      botonEliminar.style.fontSize = "16px";
      botonEliminar.style.padding = "5px 10px";
  
      // Vincular publicaciones para eliminación cruzada
      botonEliminar.addEventListener("click", () => {
        if (confirm("¿Estás seguro de eliminar esta publicación?")) {
          publicacionesContainer.removeChild(publicacion);
          misPublicacionesContainer.removeChild(miPublicacion);
        }
      });
  
      miPublicacion.appendChild(botonEliminar);
  
      // Insertar en los contenedores
      publicacionesContainer.prepend(publicacion);
      misPublicacionesContainer.prepend(miPublicacion);
  
      form.reset();
    });
  });  