const express = require("express");
const router = express.Router();
const patientDocumentController = require("../controllers/patientDocumentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: PatientDocuments
 *   description: Gestion des documents patients
 */

/**
 * @swagger
 * /api/v1/patients/{patientId}/documents:
 *   post:
 *     summary: Upload un document pour un patient (patient ou médecin)
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [image, rapport, autre]
 *     responses:
 *       201:
 *         description: Document uploadé
 *       400:
 *         description: Fichier invalide ou non autorisé
 */
router.post(
  "/:patientId/documents",
  verifyToken,
  upload.single("file"),
  patientDocumentController.uploadDocument
);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documents:
 *   get:
 *     summary: Récupérer les documents d'un patient
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [image, rapport, autre]
 *         description: Filtrer les documents par type
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date spécifique (YYYY-MM-DD)
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des documents
 */
router.get(
  "/:patientId/documents",
  verifyToken,
  patientDocumentController.getPatientDocuments
);

/**
 * @swagger
 * /api/v1/documents/{id}/download:
 *   get:
 *     summary: Télécharger un document
 *     tags: [PatientDocuments]
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
 *         description: Fichier téléchargé
 */
router.get(
  "/documents/:id/download",
  verifyToken,
  patientDocumentController.downloadDocument
);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   delete:
 *     summary: Supprimer un document (patient ou médecin uploader)
 *     tags: [PatientDocuments]
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
 *         description: Document supprimé
 */
router.delete(
  "/documents/:id",
  verifyToken,
  patientDocumentController.deleteDocument
);

module.exports = router;
