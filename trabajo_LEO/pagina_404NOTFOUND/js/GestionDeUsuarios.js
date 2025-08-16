document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.querySelector("#userTable tbody");

// se que no es una buena practica pero no queria modificar el archivo css 
//  // esto lo hice para darle el estilo a los botones directamente desde el js 


  const style = document.createElement('style');
  style.textContent = `
    .dropdown {
      position: relative;
      display: inline-block;
    }
    .dropbtn {
      background-color: #4CAF50;
      color: white;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .dropbtn:hover {
      background-color: #3e8e41;
    }
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      right: 0;
      border-radius: 4px;
      overflow: hidden;
    }
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    .dropdown-content a:hover {
      background-color: #f1f1f1;
    }
    #userTable td:last-child {
      min-width: 300px;
    }
  `;

  //aqui ya cargamos y llamamos a axios para que nos jale los usuarios desde la base de datos 
  document.head.appendChild(style);

  try {
    const { data: usuarios } = await axios.get("http://localhost:3000/api/usuarios");

    tableBody.innerHTML = "";

    usuarios.forEach(usuario => {
      const row = document.createElement("tr");

      // esto es el dropdown para que fuera de manera visual mas amigable lo hice que fuera estilo drop para cambiar los roles de usuarios 
      const dropdownHTML = `
        <div class="dropdown" style="margin-left: 5px;">
          <button class="dropbtn" style="background-color: #4A90E2;">Cambiar Rol ▼</button>
          <div class="dropdown-content">
            ${usuario.rol !== "emprendedor" ? '<a href="#" class="rol-option" data-rol="emprendedor" style="color: #4A4A4A;">Promover a Emprendedor</a>' : ''}
            ${usuario.rol !== "moderador" ? '<a href="#" class="rol-option" data-rol="moderador" style="color: #4A4A4A;">Hacer Moderador</a>' : ''}
            ${usuario.rol !== "admin" ? '<a href="#" class="rol-option" data-rol="admin" style="color: #4A4A4A;">Hacer Administrador</a>' : ''}
            ${usuario.rol !== "ciudadano" ? '<a href="#" class="rol-option" data-rol="ciudadano" style="color: #4A4A4A;">Volver a Ciudadano</a>' : ''}
          </div>
        </div>
      `;
 //a todo le di estilo desde aca se que no es una buena practica pero estaba contratiempo //los simbolos del check y la X los busque de la tabla de emojis 
      row.innerHTML = `
        <td>${usuario._id}</td>
        <td>${usuario.nombre} ${usuario.apellido}</td>
        <td>${usuario.email}</td>
        <td class="rol">${usuario.rol}</td>
        <td class="estado">${usuario.estado === 'activo' ? '✔️ Activo' : '❌ Inactivo'}</td> 
        <td style="display: flex; flex-wrap: wrap; gap: 5px; align-items: center;">
          <button class="aceptar" style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Aceptar</button>
          <button class="inactivar" style="background-color: #f8E71C; color: #4A4A4A; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Inactivar</button>
          <button class="eliminar" style="background-color: #D0021B; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Eliminar</button>
          ${dropdownHTML}
        </td>
      `;

      // Acciones básicas aqui cambiamos los roles de usuario si es activo en este caso 
      row.querySelector(".aceptar").addEventListener("click", async () => {
        await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/estado`, { estado: "activo" });
        location.reload();
      });
  //aqui al hacer click el usaurio pasa a estado inactivo 
      row.querySelector(".inactivar").addEventListener("click", async () => {
        await axios.put(`http://localhost:3000/api/usuarios/${usuario._id}/estado`, { estado: "inactivo" });
        location.reload();
      });
// se nos dijo en clases que los usuarios siempre quedan guardados en base de datos por lo que no se pueden eliminar pero se agrego esta opcion para opcion de prueba 
      row.querySelector(".eliminar").addEventListener("click", async () => {
        if (confirm(`¿Eliminar a ${usuario.nombre}?`)) {
          await axios.delete(`http://localhost:3000/api/usuarios/${usuario._id}`);
          location.reload();
        }
      });

      // Manejar el dropdown aqui al hacer click el drop muestra el contenido 
      const dropbtn = row.querySelector(".dropbtn");
      const dropdownContent = row.querySelector(".dropdown-content");

      dropbtn.addEventListener("click", function(e) {
        e.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
      });

      // si se hace click fuera del drop se cierra automaticamente 
      document.addEventListener("click", function() {
        dropdownContent.style.display = "none";
      });

      // Manejar selección de rol para verificar que el cambio fue realizado satisfactoriamente 
      row.querySelectorAll(".rol-option").forEach(option => {
        option.addEventListener("click", async function(e) {
          e.preventDefault();
          const nuevoRol = this.getAttribute("data-rol");
          await cambiarRol(usuario._id, nuevoRol);
        });
      });

      tableBody.appendChild(row);
    });
    // Verificar rol cada 30 segundos
setInterval(() => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (usuario) {
    axios.get(`http://localhost:3000/api/usuarios/${usuario._id}`)
      .then(response => {
        const nuevoRol = response.data.rol;
        if (nuevoRol !== usuario.rol) {
          usuario.rol = nuevoRol;
          localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
          actualizarUIsegunRol();
        }
      })
      .catch(error => console.error("Error al verificar rol:", error));
  }
}, 30000);

    // si los usuarios no se cargan o hay algun error se muestara el mensaje de error 
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("No se pudieron cargar los usuarios. Revisa tu conexión con el backend.");
  }

  // con esta funcion tenemos un poco mas de seguridad a la hora de cambiar de roles a los usuarios 
  async function cambiarRol(userId, nuevoRol) {
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${userId}/rol`, { rol: nuevoRol });
      alert(`Rol cambiado a ${nuevoRol} exitosamente`);
      location.reload();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      alert(`Error al cambiar rol: ${error.response?.data?.error || error.message}`);
    }
  }

  // Menú responsive para que sea adaptable a todos los dispositivos 
  const menuToggle = document.getElementById("menuCambio");
  const menu = document.getElementById("menu");

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
});
