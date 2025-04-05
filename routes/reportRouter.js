const express = require("express");
const reportCtrl = require("../controllers/reportCtrl");
const auth = require("../middleware/auth");

const router = express.Router();

// Crear un reporte
router.post("/reports", auth, reportCtrl.createReport);

// Obtener todos los reportes
router.get("/reports", auth, reportCtrl.getReports);

// Obtener los usuarios más reportados
router.get("/most-reported-users", auth, reportCtrl.getMostReportedUsers);

// Obtener los usuarios que más reportes han hecho
router.get("/most-active-reporters", auth, reportCtrl.getMostActiveReporters);

// Eliminar un reporte por su ID
//router.delete("/reports/:id", auth, reportCtrl.deleteReport);

module.exports = router;
