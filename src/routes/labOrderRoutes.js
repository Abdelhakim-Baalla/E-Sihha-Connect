const express = require("express");
const router = express.Router();
const labOrderController = require("../controllers/labOrderController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: LabOrders
 *   description: Gestion des ordres de laboratoire
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LabOrderTest:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         nom:
 *           type: string
 *         instructions:
 *           type: string
 *       required:
 *         - nom
 *     LabOrder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         patient:
 *           type: string
 *         medecin:
 *           type: string
 *         consultation:
 *           type: string
 *           nullable: true
 *         tests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LabOrderTest'
 *         statut:
 *           type: string
 *           enum: [ordered, completed, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/laborders:
 *   post:
 *     summary: Créer un ordre de laboratoire pour un patient
 *     description: Disponible pour les médecins authentifiés. Chaque ordre est créé avec le statut initial `ordered`.
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient
 *               - tests
 *             properties:
 *               patient:
 *                 type: string
 *                 description: Identifiant du patient ciblé
 *                 example: 64f1bca0c24c9f0012ab5678
 *               consultation:
 *                 type: string
 *                 description: Identifiant de la consultation liée (optionnel)
 *               tests:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - nom
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Code interne ou LOINC du test
 *                       example: HB1
 *                     nom:
 *                       type: string
 *                       description: Nom du test demandé
 *                       example: Hemogramme complet
 *                     instructions:
 *                       type: string
 *                       description: Consignes pour le laboratoire
 *                       example: A jeun
 *     responses:
 *       201:
 *         description: Ordre de laboratoire créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabOrder'
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé
 */
router.post("/", verifyToken, isDoctor, labOrderController.createLabOrder);

/**
 * @swagger
 * /api/v1/laborders/patient/{patientId}:
 *   get:
 *     summary: Lister les ordres de laboratoire d'un patient
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du patient
 *     responses:
 *       200:
 *         description: Liste des ordres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabOrder'
 *       403:
 *         description: Accès refusé
 */
router.get(
  "/patient/:patientId",
  verifyToken,
  isDoctor,
  labOrderController.getByPatient
);

/**
 * @swagger
 * /api/v1/laborders/me:
 *   get:
 *     summary: Récupérer les ordres de laboratoire du patient connecté
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des ordres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabOrder'
 *       401:
 *         description: Utilisateur non authentifié
 */
router.get("/me", verifyToken, labOrderController.getMine);

/**
 * @swagger
 * /api/v1/laborders/{id}:
 *   get:
 *     summary: Récupérer un ordre de laboratoire par identifiant
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'ordre
 *     responses:
 *       200:
 *         description: Ordre de laboratoire demandé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabOrder'
 *       404:
 *         description: Ordre non trouvé
 */
router.get("/:id", verifyToken, labOrderController.getById);

module.exports = router;
