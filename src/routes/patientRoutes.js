const express = require("express");
const patientController = require("../controllers/patientController");
const {verifyToken,isAdmin,isSelfPatient, isDoctor} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, isAdmin, patientController.createPatient);
router.get("/", verifyToken, isAdmin, patientController.getPatients);
router.get("/:id", verifyToken, isSelfPatient, isAdmin, isDoctor, patientController.getPatientById);
router.put("/:id", verifyToken, isAdmin, patientController.updatePatient);
router.put("/:id/update",verifyToken,isSelfPatient,patientController.updatePatient);
router.delete("/:id", verifyToken, isAdmin, patientController.deletePatient);

module.exports = router;
