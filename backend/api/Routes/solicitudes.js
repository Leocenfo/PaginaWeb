const router = require("express").Router();
const C = require("../controladores/solicitudcontroller");

// Crear y listar (lo que usa tu frontend)
router.post("/", C.crear);
router.get("/", C.listar);

// Opcionales por si luego administras solicitudes:
router.patch("/:id/estado", C.actualizarEstado);
router.delete("/:id", C.eliminar);

module.exports = router;
