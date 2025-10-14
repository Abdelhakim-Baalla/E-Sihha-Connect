const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/inscription", verifyToken, authController.inscription);
router.post("/connexion", verifyToken, authController.connexion);

module.exports = router;
