const express = require("express");
const router = express.Router();
const labOrderController = require("../controllers/labOrderController");
const {
  verifyToken,
  isDoctor,
  isLabResponsable,
} = require("../middlewares/authMiddleware");

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
 *         resultatValeur:
 *           type: number
 *           description: Valeur numérique retournée par le laboratoire
 *           example: 13.5
 *         resultatUnite:
 *           type: string
 *           description: Unité de mesure de la valeur
 *           example: g/dL
 *         referenceMin:
 *           type: number
 *           description: Limite inférieure de la plage de référence
 *           example: 12
 *         referenceMax:
 *           type: number
 *           description: Limite supérieure de la plage de référence
 *           example: 16
 *         flag:
 *           type: string
 *           description: Indicateur calculé (low, high, normal, unknown)
 *           enum: [low, high, normal, unknown]
 *           readOnly: true
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
 *           enum: [ordered, received, completed, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LabReportLink:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         ttlMinutes:
 *           type: integer
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
 *                     resultatValeur:
 *                       type: number
 *                       description: Valeur mesurée (optionnel, utile pour restituer un résultat)
 *                     resultatUnite:
 *                       type: string
 *                       description: Unité de mesure, par exemple g/dL
 *                     referenceMin:
 *                       type: number
 *                       description: Borne inférieure de la plage de référence
 *                     referenceMax:
 *                       type: number
 *                       description: Borne supérieure de la plage de référence
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
 * /api/v1/laborders/{id}/report-link:
 *   get:
 *     summary: Générer un lien temporaire pour télécharger le rapport PDF
 *     description: Accessible au médecin qui a créé l'ordre de laboratoire.
 *     tags: [LabOrders]
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
 *         description: Lien généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabReportLink'
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ordre non trouvé
 */
router.get(
  "/:id/report-link",
  verifyToken,
  isDoctor,
  labOrderController.getLabOrderDownloadLink
);

/**
 * @swagger
 * /api/v1/laborders/{id}/report-link/patient:
 *   get:
 *     summary: Générer un lien de téléchargement temporaire pour un patient
 *     description: Permet à un patient authentifié de récupérer un lien pour télécharger le rapport PDF de son propre ordre de laboratoire.
 *     tags: [LabOrders]
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
 *         description: Lien généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabReportLink'
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Accès refusé (ordre ne correspondant pas au patient)
 *       404:
 *         description: Ordre non trouvé
 */
router.get(
  "/:id/report-link/patient",
  verifyToken,
  labOrderController.getLabOrderDownloadLinkForPatient
);

/**
 * @swagger
 * /api/v1/laborders/{id}/report:
 *   get:
 *     summary: Télécharger le rapport PDF d'un ordre de laboratoire
 *     description: Requiert un token temporaire obtenu via l'endpoint report-link.
 *     tags: [LabOrders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Jeton temporaire signé
 *     responses:
 *       200:
 *         description: Rapport PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Token invalide
 *       410:
 *         description: Lien expiré
 */
router.get("/:id/report", labOrderController.downloadLabOrderReport);

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
 * /api/v1/laborders/me/results:
 *   get:
 *     summary: Récupérer les résultats de laboratoire complétés du patient connecté
 *     description: Retourne uniquement les ordres avec statut "completed" et inclut les résultats associés aux tests.
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des résultats complétés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabOrder'
 *       401:
 *         description: Utilisateur non authentifié
 */
router.get("/me/results", verifyToken, labOrderController.getMyResults);

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
/**
 * @swagger
 * /api/v1/laborders/{id}/results:
 *   put:
 *     summary: Mettre à jour les résultats d'un ordre de laboratoire reçu
 *     description: Accessible uniquement au responsable de laboratoire afin d'ajouter les valeurs mesurées et de faire évoluer le statut de l'ordre de "ordered" vers "received" puis "completed".
 *     tags: [LabOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'ordre de laboratoire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [received, completed]
 *                 description: Statut souhaité après mise à jour. Par défaut "received".
 *               tests:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LabOrderTest'
 *                 description: Liste des tests avec leurs résultats saisis par le laboratoire.
 *     responses:
 *       200:
 *         description: Ordre mis à jour avec les résultats fournis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LabOrder'
 *       400:
 *         description: Données invalides ou transition de statut interdite
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ordre non trouvé
 */
router.put(
  "/:id/results",
  verifyToken,
  isLabResponsable,
  labOrderController.updateLabResults
);

router.get("/:id", verifyToken, isLabResponsable, labOrderController.getById);

module.exports = router;
