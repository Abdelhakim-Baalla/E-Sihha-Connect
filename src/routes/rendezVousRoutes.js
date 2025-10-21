const express = require("express");
const rendezVousController = require("../controllers/rendezVousController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, isDoctor, rendezVousController.createRendezVous);
router.put("/:id/update", verifyToken, isDoctor, rendezVousController.updateRendezVous);
router.delete("/:id", verifyToken, isDoctor, rendezVousController.deleteRendezVous);

module.exports = router;
