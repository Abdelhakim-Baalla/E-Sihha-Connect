const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/inscription", authController.inscription);
router.post("/connexion", authController.connexion);
router.post("/forget-password", authController.forgetPassword);

module.exports = router;
