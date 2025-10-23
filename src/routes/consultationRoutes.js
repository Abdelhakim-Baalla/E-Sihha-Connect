const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

router.post("/",verifyToken,isDoctor,consultationController.createConsultation);
router.get("/patient/:patientId",verifyToken,isDoctor,consultationController.getByPatient);
router.get("/me", verifyToken, consultationController.getMine);

module.exports = router;
