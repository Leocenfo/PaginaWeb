// variables globales
let areasComunes = [];
let marcadores = [];
let mapa;
let datosTemporales = null;
let indiceEditando = null;

const API_URL = "http://localhost:3000/api/zonas/lugares";

// Acceso al DOM
const inputNombre = document.getElementById("nombre");
const inputFecha = document.getElementById("fecha");
const inputComentario = document.getElementById("comentario");
const btnAgregar = document.getElementById("btn-agregar");
const tabla = document.getElementById("tabla-lugares");

// Inicializar el mapa
function inicializarMapa() {
  mapa = L.map("mapa").setView([9.90692, -83.98789], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapa);

  mapa.on("click", onMapaClick);

  cargarDesdeLocalStorage(); // ← cargar zonas guardadas
}

// Registrar datos y esperar click en el mapa
function registrarAreaComun() {
  const nombre = inputNombre.value.trim();
  const fecha = inputFecha.value.trim();
  const comentario = inputComentario.value.trim();

  if (nombre && fecha && comentario) {
    datosTemporales = { nombre, fecha, comentario };
    alert("Haz clic en el mapa para ubicar el área.");
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

// Clic en el mapa → guardar datos
function onMapaClick(event) {
  if (!datosTemporales) {
    alert("Primero llena el formulario y presiona 'Registrar Área'");
    return;
  }

  const nuevaZona = {
    ...datosTemporales,
    lat: event.latlng.lat,
    lng: event.latlng.lng
  };

  areasComunes.push(nuevaZona);
  guardarEnLocalStorage();

  agregarMarcador(nuevaZona);
  mostrarAreasComunes();
  limpiarFormulario();
  datosTemporales = null;

  // NUEVO: Enviar al backend
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaZona)
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(texto => {
          console.error("Error del servidor:", texto);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("Zona también guardada en el backend:", data);
    })
    .catch(err => {
      console.error("Fallo al contactar el backend:", err);
    });
}

// Mostrar en tabla
function mostrarAreasComunes() {
  tabla.innerHTML = "";

  areasComunes.forEach((area, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${area.nombre}</td>
      <td>${area.fecha}</td>
      <td>${area.comentario}</td>
      <td>
        <button data-accion="ver" data-index="${index}">Ver</button>
        <button data-accion="eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

// Agregar marcador al mapa
function agregarMarcador(area) {
  const marcador = L.marker([area.lat, area.lng])
    .addTo(mapa)
    .bindPopup(`<b>${area.nombre}</b><br>${area.comentario}<br>${area.fecha}`);

  marcadores.push(marcador);
}

// Ver ubicación
function verArea(index) {
  const area = areasComunes[index];
  mapa.setView([area.lat, area.lng], 18);
  marcadores[index].openPopup();
}

// Eliminar zona
function eliminarArea(index) {
  if (confirm("¿Seguro que deseas eliminar esta zona?")) {
    areasComunes.splice(index, 1);
    mapa.removeLayer(marcadores[index]);
    marcadores.splice(index, 1);
    guardarEnLocalStorage();
    mostrarAreasComunes();
  }
}

// Guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("zonasComunidad", JSON.stringify(areasComunes));
}

// Cargar desde localStorage
function cargarDesdeLocalStorage() {
  const zonasGuardadas = localStorage.getItem("zonasComunidad");
  if (zonasGuardadas) {
    areasComunes = JSON.parse(zonasGuardadas);
    areasComunes.forEach(zona => {
      agregarMarcador(zona);
    });
    mostrarAreasComunes();
  }
}

// Limpiar formulario
function limpiarFormulario() {
  inputNombre.value = "";
  inputFecha.value = "";
  inputComentario.value = "";
}

// Listeners
btnAgregar.addEventListener("click", registrarAreaComun);

tabla.addEventListener("click", (event) => {
  const btn = event.target;
  const accion = btn.dataset.accion;
  const index = parseInt(btn.dataset.index);

  if (accion === "ver") verArea(index);
  if (accion === "eliminar") eliminarArea(index);
});

document.addEventListener("DOMContentLoaded", inicializarMapa);
