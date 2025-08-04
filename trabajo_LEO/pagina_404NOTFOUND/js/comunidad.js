// variables globales
let marcadores = [];
let mapa;
let datosTemporales = null;
let indiceEditando = null;
let areasComunes = [];

const API_URL = "http://localhost:3000/api/comunidad/lugares";

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

  cargarAreasComunes(); // cargar desde MongoDB al iniciar
}

// Cargar datos desde MongoDB
async function cargarAreasComunes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    areasComunes = data;

    data.forEach((area, index) => {
      agregarMarcador(area);
    });

    mostrarAreasComunes();
  } catch (err) {
    console.error("Error al cargar áreas comunes:", err);
  }
}

// Registrar datos y esperar el click en el mapa
function registrarAreaComun() {
  const nombre = inputNombre.value;
  const fecha = inputFecha.value;
  const comentario = inputComentario.value;

  if (nombre && fecha && comentario) {
    datosTemporales = { nombre, fecha, comentario };

    if (indiceEditando !== null) {
      alert("Haz clic en el mapa para actualizar la ubicación.");
    } else {
      alert("Haz clic en el mapa para ubicar el área.");
    }
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

// Click en el mapa
async function onMapaClick(event) {
  if (!datosTemporales) return;

  const nuevaZona = {
    ...datosTemporales,
    lat: event.latlng.lat,
    lng: event.latlng.lng
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaZona)
    });
    const data = await res.json();
    areasComunes.push(data);
    agregarMarcador(data);
    mostrarAreasComunes();
    limpiarFormulario();
    datosTemporales = null;
  } catch (err) {
    console.error("Error al guardar en el backend:", err);
  }
}

// Mostrar áreas en la tabla
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

// Crear marcador
function agregarMarcador(area) {
  const marcador = L.marker([area.lat, area.lng])
    .addTo(mapa)
    .bindPopup(`<b>${area.nombre}</b><br>${area.comentario}<br>${area.fecha}`);
  marcadores.push(marcador);
}

// Ver área
function verArea(index) {
  const area = areasComunes[index];
  mapa.setView([area.lat, area.lng], 18);
  marcadores[index].openPopup();
}

// Eliminar
async function eliminarArea(index) {
  const area = areasComunes[index];
  const confirmar = confirm("¿Seguro que quieres eliminar esta área?");

  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/${area._id}`, {
      method: "DELETE"
    });
    areasComunes.splice(index, 1);
    mapa.removeLayer(marcadores[index]);
    marcadores.splice(index, 1);
    mostrarAreasComunes();
  } catch (err) {
    console.error("Error al eliminar área:", err);
  }
}

// Limpiar
function limpiarFormulario() {
  inputNombre.value = "";
  inputFecha.value = "";
  inputComentario.value = "";
}

// Eventos
btnAgregar.addEventListener("click", registrarAreaComun);
tabla.addEventListener("click", (event) => {
  const btn = event.target;
  const accion = btn.dataset.accion;
  const index = parseInt(btn.dataset.index);

  if (accion === "ver") verArea(index);
  if (accion === "eliminar") eliminarArea(index);
});

document.addEventListener("DOMContentLoaded", inicializarMapa);
