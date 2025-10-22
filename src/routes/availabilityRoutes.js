const express = require("express");
const { getAvailability } = require("../controllers/availabilityController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/availability:
 *   get:
 *     summary: Obtenir la disponibilité d'un médecin
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des créneaux libres
 *       403:
 *         description: Accès refusé
 */
router.get("/", verifyToken, getAvailability);

module.exports = router;
