const express = require("express");
const patientController = require("../controllers/patientController");
const {
  verifyToken,
  isAdmin,
  isSelfPatient,
  isDoctor,
} = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Créer un patient (admin uniquement)
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Patient créé
 *       403:
 *         description: Accès refusé
 */
router.post("/", verifyToken, isAdmin, patientController.createPatient);
/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: Récupérer tous les patients (admin uniquement)
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des patients
 *       403:
 *         description: Accès refusé
 */
router.get("/", verifyToken, isAdmin, patientController.getPatients);
/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Récupérer un patient par ID (médecin uniquement)
 *     tags: [Patient]
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
 *         description: Détails du patient
 *       403:
 *         description: Accès refusé
 */
router.get("/:id", verifyToken, isDoctor, patientController.getPatientById);
/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Modifier un patient (admin uniquement)
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Patient modifié
 *       403:
 *         description: Accès refusé
 */
router.put("/:id", verifyToken, isAdmin, patientController.updatePatient);
/**
 * @swagger
 * /api/v1/patients/{id}/update:
 *   put:
 *     summary: Modifier ses propres informations (patient)
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Patient modifié
 *       403:
 *         description: Accès refusé
 */
router.put(
  "/:id/update",
  verifyToken,
  isSelfPatient,
  patientController.updatePatient
);
/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Supprimer un patient (admin uniquement)
 *     tags: [Patient]
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
 *         description: Patient supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete("/:id", verifyToken, isAdmin, patientController.deletePatient);

module.exports = router;
