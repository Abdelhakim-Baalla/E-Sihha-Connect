const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { verifyToken, isDoctor, isPharmacist } = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  isDoctor,
  prescriptionController.createPrescription
);
router.get(
  "/patient/:patientId",
  verifyToken,
  isDoctor,
  prescriptionController.getByPatient
);
router.get("/me", verifyToken, prescriptionController.getMine);
router.get("/me/active", verifyToken, prescriptionController.getActiveMine);
router.get("/:id", verifyToken, prescriptionController.getById);
router.patch(
  "/:id/statut",
  verifyToken,
  prescriptionController.updateStatus
);

router.get(
  "/assigned",
  verifyToken,
  isPharmacist,
  prescriptionController.getAssignedPrescriptions
);

router.put(
  "/:id/assign",
  verifyToken,
  isDoctor,
  prescriptionController.assignPharmacist
);

module.exports = router;
