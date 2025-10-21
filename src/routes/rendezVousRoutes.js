const express = require("express");
const rendezVousController = require("../controllers/rendezVousController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, isDoctor, rendezVousController.createRendezVous);

module.exports = router;
