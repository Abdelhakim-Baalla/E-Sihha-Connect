const express = require("express");
const router = express.Router();
const labOrderController = require("../controllers/labOrderController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, isDoctor, labOrderController.createLabOrder);
router.get("/patient/:patientId", verifyToken, isDoctor, labOrderController.getByPatient);
router.get("/me", verifyToken, labOrderController.getMine);
router.get("/:id", verifyToken, labOrderController.getById);

module.exports = router;
