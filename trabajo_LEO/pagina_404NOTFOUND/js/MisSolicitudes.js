
const API_SOLICITUDES =
  window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:3000/api/solicitudes"
    : "/api/solicitudes"; // si sirves backend y frontend juntos, usa la relativa

// ===== UTILS
const $ = (sel) => document.querySelector(sel);
const fmt = (d) => {
  const dt = new Date(d);
  if (isNaN(dt)) return "-";
  return dt.toLocaleString();
};

// ===== RENDER
function renderSolicitudes(items) {
  const cont = $("#listaSolicitudes");
  cont.innerHTML = "";
  if (!items || !items.length) {
    cont.innerHTML = '<p class="azul">Aún no tenés solicitudes.</p>';
    return;
  }
  items.forEach((s) => {
    const div = document.createElement("div");
    div.className = "carta";
    div.innerHTML = `
      <p><strong>Fecha:</strong> ${fmt(s.createdAt)}</p>
      <p><strong>Rol:</strong> ${s.rolSolicitado}</p>
      <p><strong>Motivo:</strong> ${s.motivo}</p>
      <p><strong>Estado:</strong> ${s.estado}</p>
    `;
    cont.appendChild(div);
  });
}

// ===== API
async function crearSolicitud(payload) {
  const res = await fetch(API_SOLICITUDES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function listarMisSolicitudes(email) {
  const url = email
    ? `${API_SOLICITUDES}?email=${encodeURIComponent(email)}`
    : API_SOLICITUDES;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ===== INIT
document.addEventListener("DOMContentLoaded", () => {
  const frm = $("#frmSolicitudRol");
  const nombre = $("#solNombre");
  const email = $("#solEmail");
  const rol = $("#solRol");
  const motivo = $("#solMotivo");
  const btn = $("#btnEnviarSolicitud");

  async function recargar() {
    const e = (email.value || "").trim();
    if (!e) {
      renderSolicitudes([]);
      return;
    }
    try {
      const data = await listarMisSolicitudes(e);
      renderSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      renderSolicitudes([]);
    }
  }

  frm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const payload = {
      nombre: (nombre.value || "").trim(),
      email: (email.value || "").trim(),
      rolSolicitado: rol.value,
      motivo: (motivo.value || "").trim(),
    };

    if (!payload.nombre || !payload.email || !payload.rolSolicitado || !payload.motivo) {
      return Swal.fire("Campos requeridos", "Completá todos los campos.", "info");
    }

    btn.disabled = true;
    try {
      await crearSolicitud(payload);
      await Swal.fire(
        "¡Listo!",
        'Tu solicitud fue enviada y está en estado "pendiente".',
        "success"
      );
      // Mantener el email para recargar lo del usuario
      const keepEmail = payload.email;
      frm.reset();
      email.value = keepEmail;
      await recargar();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        "No se pudo enviar la solicitud (puede que ya exista una pendiente con ese email y rol).",
        "error"
      );
    } finally {
      btn.disabled = false;
    }
  });

  // Cargar automáticamente cuando el usuario termina de escribir su email
  email.addEventListener("blur", recargar);

  // Carga inicial (por si el campo ya trae valor)
  recargar();
});
