const express = require("express");
const rendezVousController = require("../controllers/rendezVousController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/rendezvous/create:
 *   post:
 *     summary: Créer un rendez-vous (médecin uniquement)
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               duree:
 *                 type: number
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *       403:
 *         description: Accès refusé
 */
router.post(
  "/create",
  verifyToken,
  isDoctor,
  rendezVousController.createRendezVous
  /**
   * @swagger
   * /api/v1/rendezvous/check-conflicts:
   *   get:
   *     summary: Vérifier les conflits de rendez-vous
   *     tags: [RendezVous]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: medecinId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Liste des conflits
   *       403:
   *         description: Accès refusé
   */
);
router.put(
  "/:id/update",
  verifyToken,
  isDoctor,
  rendezVousController.updateRendezVous
);
router.delete(
  "/:id",
  verifyToken,
  isDoctor,
  rendezVousController.deleteRendezVous
);
/**
 * @swagger
 * /api/v1/rendezvous/{id}:
 *   delete:
 *     summary: Supprimer un rendez-vous (médecin uniquement)
 *     tags: [RendezVous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/check-conflicts",
  verifyToken,
  rendezVousController.checkConflicts
);

module.exports = router;
