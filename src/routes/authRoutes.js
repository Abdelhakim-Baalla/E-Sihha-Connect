const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { verifyToken, verifyMissingToken } = require("../middlewares/authMiddleware");

router.post("/inscription", verifyMissingToken, authController.inscription);
router.post("/connexion", verifyMissingToken, authController.connexion);

module.exports = router;
