const express = require("express");
const { bookRendezVous } = require("../controllers/bookRendezVousController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/book", verifyToken, bookRendezVous);

module.exports = router;
