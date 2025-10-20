const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.post("/inscription", authController.inscription);
router.post("/connexion", authController.connexion);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/utilisateurs/create", verifyToken, isAdmin, authController.createUserWithRole);

module.exports = router;
