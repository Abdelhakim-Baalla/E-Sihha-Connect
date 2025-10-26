const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, isDoctor, prescriptionController.createPrescription);
router.get("/patient/:patientId", verifyToken, isDoctor, prescriptionController.getByPatient);
router.get("/me", verifyToken, prescriptionController.getMine);
router.get("/me/active", verifyToken, prescriptionController.getActiveMine);
router.get("/:id", verifyToken, prescriptionController.getById);

module.exports = router;
