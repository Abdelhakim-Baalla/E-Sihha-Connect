const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, consultationController.createConsultation);
router.get("/patient/:patientId", authMiddleware, consultationController.getByPatient);

module.exports = router;
